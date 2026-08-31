import { prisma } from '../lib/prisma.js';
import { PastaModel } from './pastaModel.js';
import type { AnotacaoResumo } from '../types/anotacao.js';

export const AnotacaoModel = {
  async listarPorUsuario(codUsuario: number): Promise<AnotacaoResumo[]> {
    const anotacoes = await prisma.anotacao.findMany({
      where: { cod_usuario: codUsuario },
      orderBy: { data_anota: 'desc' },
      select: { cod_anota: true, titulo: true, texto_anota: true, data_anota: true },
    });

    return anotacoes.map((anotacao) => ({
      ...anotacao,
      data_anota: anotacao.data_anota.toISOString().slice(0, 10),
    }));
  },

  async criar(codUsuario: number, titulo: string, texto: string): Promise<number> {
    const codPasta = await PastaModel.buscarOuCriarPadrao(codUsuario);

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
};