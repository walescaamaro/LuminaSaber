// backend/src/models/lojaModel.ts
import { prisma } from '../lib/prisma.js';
import { ITENS_LOJA, calcularEstrelasPorConclusaoDeSessao } from '../constants/loja.js';
import type { TipoBeneficio, InventarioResposta } from '../types/loja.js';

const TIPOS_BENEFICIO: TipoBeneficio[] = ['dica', 'tempo_extra', 'chance_extra'];

function inventarioVazio(): InventarioResposta {
  return { dica: 0, tempo_extra: 0, chance_extra: 0 };
}

export const LojaModel = {
  async obterSaldo(codUsuario: number): Promise<number> {
    const usuario = await prisma.usuario.findUnique({
      where: { cod_usuario: codUsuario },
      select: { estrelas: true },
    });
    return usuario?.estrelas ?? 0;
  },

  async obterInventario(codUsuario: number): Promise<InventarioResposta> {
    const linhas = await prisma.inventarioBeneficio.findMany({
      where: { cod_usuario: codUsuario },
    });

    const inventario = inventarioVazio();
    for (const linha of linhas) {
      if (TIPOS_BENEFICIO.includes(linha.tipo as TipoBeneficio)) {
        inventario[linha.tipo as TipoBeneficio] = linha.quantidade;
      }
    }
    return inventario;
  },

  // Soma `quantidade` estrelas ao saldo do usuário. Usada tanto para
  // acertar uma questão que antes tinha errado quanto para concluir sessão.
  async creditarEstrelas(codUsuario: number, quantidade: number): Promise<number> {
    if (quantidade <= 0) return this.obterSaldo(codUsuario);

    const usuario = await prisma.usuario.update({
      where: { cod_usuario: codUsuario },
      data: { estrelas: { increment: quantidade } },
      select: { estrelas: true },
    });
    return usuario.estrelas;
  },

  async registrarSessaoConcluida(
    codUsuario: number,
    meta: number,
    respondidas: number,
  ): Promise<{ estrelasGanhas: number; estrelas: number }> {
    const estrelasGanhas = calcularEstrelasPorConclusaoDeSessao(meta, respondidas);
    const estrelas = await this.creditarEstrelas(codUsuario, estrelasGanhas);
    return { estrelasGanhas, estrelas };
  },

  // Compra atômica: confere saldo, debita e credita o benefício no
  // inventário, tudo na mesma transação — evita saldo negativo em
  // requisições concorrentes.
  async comprarItem(codUsuario: number, itemId: TipoBeneficio): Promise<{ estrelas: number; inventario: InventarioResposta }> {
    const item = ITENS_LOJA[itemId];
    if (!item) {
      throw new Error('ITEM_INVALIDO');
    }

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({
        where: { cod_usuario: codUsuario },
        select: { estrelas: true },
      });

      if (!usuario) {
        throw new Error('USUARIO_NAO_ENCONTRADO');
      }

      if (usuario.estrelas < item.custo) {
        throw new Error('SALDO_INSUFICIENTE');
      }

      await tx.usuario.update({
        where: { cod_usuario: codUsuario },
        data: { estrelas: { decrement: item.custo } },
      });

      await tx.inventarioBeneficio.upsert({
        where: { cod_usuario_tipo: { cod_usuario: codUsuario, tipo: item.id } },
        create: { cod_usuario: codUsuario, tipo: item.id, quantidade: item.unidades },
        update: { quantidade: { increment: item.unidades } },
      });

      await tx.compra.create({
        data: {
          cod_usuario: codUsuario,
          item: item.id,
          quantidade: item.unidades,
          custo: item.custo,
          data_compra: new Date(),
        },
      });
    });

    const [estrelas, inventario] = await Promise.all([
      this.obterSaldo(codUsuario),
      this.obterInventario(codUsuario),
    ]);

    return { estrelas, inventario };
  },

  // Consome 1 unidade de um benefício já comprado (ex: usar 1 dica).
  async usarBeneficio(codUsuario: number, tipo: TipoBeneficio): Promise<InventarioResposta> {
    await prisma.$transaction(async (tx) => {
      const linha = await tx.inventarioBeneficio.findUnique({
        where: { cod_usuario_tipo: { cod_usuario: codUsuario, tipo } },
      });

      if (!linha || linha.quantidade <= 0) {
        throw new Error('BENEFICIO_INDISPONIVEL');
      }

      await tx.inventarioBeneficio.update({
        where: { cod_usuario_tipo: { cod_usuario: codUsuario, tipo } },
        data: { quantidade: { decrement: 1 } },
      });
    });

    return this.obterInventario(codUsuario);
  },
};