import { prisma } from '../lib/prisma.js';
import type { PastaResumo } from '../types/pasta.js';

export const PastaModel = {
  async listarPorUsuario(codUsuario: number): Promise<PastaResumo[]> {
    const pastas = await prisma.pasta.findMany({
      where: { cod_usuario: codUsuario },
      orderBy: { data_criacao: 'asc' },
      include: { _count: { select: { anotacoes: true } } },
    });

    return pastas.map((pasta) => ({
      cod_pasta: pasta.cod_pasta,
      nome_pasta: pasta.nome_pasta,
      data_criacao: pasta.data_criacao.toISOString().slice(0, 10),
      total_anotacoes: pasta._count.anotacoes,
    }));
  },

  async buscarOuCriarPadrao(codUsuario: number): Promise<number> {
    const existente = await prisma.pasta.findFirst({
      where: { cod_usuario: codUsuario },
      select: { cod_pasta: true },
      orderBy: { cod_pasta: 'asc' },
    });

    if (existente) return existente.cod_pasta;

    const nova = await prisma.pasta.create({
      data: {
        cod_usuario: codUsuario,
        nome_pasta: 'Minhas anotações',
        data_criacao: new Date(),
      },
      select: { cod_pasta: true },
    });

    return nova.cod_pasta;
  },

  async criar(codUsuario: number, nomePasta: string): Promise<PastaResumo> {
    const pasta = await prisma.pasta.create({
      data: {
        cod_usuario: codUsuario,
        nome_pasta: nomePasta,
        data_criacao: new Date(),
      },
    });

    return {
      cod_pasta: pasta.cod_pasta,
      nome_pasta: pasta.nome_pasta,
      data_criacao: pasta.data_criacao.toISOString().slice(0, 10),
      total_anotacoes: 0,
    };
  },

  async renomear(codUsuario: number, codPasta: number, novoNome: string): Promise<void> {
    const pasta = await prisma.pasta.findFirst({
      where: { cod_pasta: codPasta, cod_usuario: codUsuario },
      select: { cod_pasta: true },
    });

    if (!pasta) {
      throw new Error('PASTA_NAO_ENCONTRADA');
    }

    await prisma.pasta.update({
      where: { cod_pasta: codPasta },
      data: { nome_pasta: novoNome },
    });
  },

  // Exclui a pasta. As anotações dentro dela NUNCA são apagadas — são
  // movidas automaticamente para outra pasta do usuário (ou para uma
  // pasta padrão nova, se essa era a única pasta que ele tinha).
  async excluir(codUsuario: number, codPasta: number): Promise<void> {
    const pasta = await prisma.pasta.findFirst({
      where: { cod_pasta: codPasta, cod_usuario: codUsuario },
      select: { cod_pasta: true },
    });

    if (!pasta) {
      throw new Error('PASTA_NAO_ENCONTRADA');
    }

    await prisma.$transaction(async (tx) => {
      let destino = await tx.pasta.findFirst({
        where: { cod_usuario: codUsuario, cod_pasta: { not: codPasta } },
        select: { cod_pasta: true },
        orderBy: { cod_pasta: 'asc' },
      });

      if (!destino) {
        destino = await tx.pasta.create({
          data: {
            cod_usuario: codUsuario,
            nome_pasta: 'Minhas anotações',
            data_criacao: new Date(),
          },
          select: { cod_pasta: true },
        });
      }

      await tx.anotacao.updateMany({
        where: { cod_pasta: codPasta, cod_usuario: codUsuario },
        data: { cod_pasta: destino.cod_pasta },
      });

      await tx.contem.updateMany({
        where: { cod_pasta: codPasta },
        data: { cod_pasta: destino.cod_pasta },
      });

      await tx.pasta.delete({ where: { cod_pasta: codPasta } });
    });
  },
};