import { prisma } from '../lib/prisma.js';
import { PastaModel } from './pastaModel.js';
import type { AnotacaoResumo, AtualizarAnotacaoInput } from '../types/anotacao.js';

export const AnotacaoModel = {
  async listarPorUsuario(codUsuario: number): Promise<AnotacaoResumo[]> {
    const anotacoes = await prisma.anotacao.findMany({
      where: { cod_usuario: codUsuario },
      orderBy: { data_anota: 'desc' },
      include: { pasta: { select: { nome_pasta: true } } },
    });

    return anotacoes.map((anotacao) => ({
      cod_anota: anotacao.cod_anota,
      titulo: anotacao.titulo,
      texto_anota: anotacao.texto_anota,
      data_anota: anotacao.data_anota.toISOString().slice(0, 10),
      cod_pasta: anotacao.cod_pasta,
      nome_pasta: anotacao.pasta.nome_pasta,
    }));
  },

  async criar(codUsuario: number, titulo: string, texto: string, codPastaEscolhida?: number): Promise<number> {
    let codPasta = codPastaEscolhida;

    if (codPasta) {
      // Confere que a pasta escolhida é realmente do usuário logado.
      const pasta = await prisma.pasta.findFirst({
        where: { cod_pasta: codPasta, cod_usuario: codUsuario },
        select: { cod_pasta: true },
      });
      if (!pasta) {
        throw new Error('PASTA_NAO_ENCONTRADA');
      }
    } else {
      codPasta = await PastaModel.buscarOuCriarPadrao(codUsuario);
    }

    const anotacao = await prisma.anotacao.create({
      data: {
        cod_usuario: codUsuario,
        cod_pasta: codPasta,
        titulo,
        texto_anota: texto,
        data_anota: new Date(),
      },
      select: { cod_anota: true },
    });

    await prisma.contem.create({
      data: { cod_pasta: codPasta, cod_anota: anotacao.cod_anota },
    });

    return anotacao.cod_anota;
  },

  async atualizar(codUsuario: number, codAnota: number, dados: AtualizarAnotacaoInput): Promise<void> {
    const anotacao = await prisma.anotacao.findFirst({
      where: { cod_anota: codAnota, cod_usuario: codUsuario },
      select: { cod_anota: true, cod_pasta: true },
    });

    if (!anotacao) {
      throw new Error('ANOTACAO_NAO_ENCONTRADA');
    }

    if (dados.cod_pasta !== undefined && dados.cod_pasta !== anotacao.cod_pasta) {
      const pastaNova = await prisma.pasta.findFirst({
        where: { cod_pasta: dados.cod_pasta, cod_usuario: codUsuario },
        select: { cod_pasta: true },
      });
      if (!pastaNova) {
        throw new Error('PASTA_NAO_ENCONTRADA');
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.anotacao.update({
        where: { cod_anota: codAnota },
        data: {
          ...(dados.titulo !== undefined ? { titulo: dados.titulo } : {}),
          ...(dados.texto_anota !== undefined ? { texto_anota: dados.texto_anota } : {}),
          ...(dados.cod_pasta !== undefined ? { cod_pasta: dados.cod_pasta } : {}),
        },
      });

      if (dados.cod_pasta !== undefined && dados.cod_pasta !== anotacao.cod_pasta) {
        await tx.contem.updateMany({
          where: { cod_anota: codAnota },
          data: { cod_pasta: dados.cod_pasta },
        });
      }
    });
  },

  async excluir(codUsuario: number, codAnota: number): Promise<void> {
    const anotacao = await prisma.anotacao.findFirst({
      where: { cod_anota: codAnota, cod_usuario: codUsuario },
      select: { cod_anota: true },
    });

    if (!anotacao) {
      throw new Error('ANOTACAO_NAO_ENCONTRADA');
    }

    await prisma.$transaction(async (tx) => {
      await tx.contem.deleteMany({ where: { cod_anota: codAnota } });
      await tx.anotacao.delete({ where: { cod_anota: codAnota } });
    });
  },
};