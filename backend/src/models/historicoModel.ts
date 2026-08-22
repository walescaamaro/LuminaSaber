// backend/src/models/historicoModel.ts (substitua tudo)
import { prisma } from '../lib/prisma.js';
import type { HistoricoResumo } from '../types/historico.js';

export const HistoricoModel = {
  async listarPorUsuario(codUsuario: number): Promise<HistoricoResumo[]> {
    const historicos = await prisma.historico.findMany({
      where: { cod_usuario: codUsuario },
      orderBy: { data_resposta: 'desc' },
      include: { questao: { include: { disciplina: true } } },
    });

    return historicos.map((h) => ({
      cod_resposta: h.cod_resposta,
      status: h.status,
      data_resposta: h.data_resposta.toISOString().slice(0, 10),
      questao: {
        cod_quest: h.questao.cod_quest,
        enunciado: h.questao.enunciado,
        materia: h.questao.disciplina.nome_disc,
      },
    }));
  },

  // Recalcula se acertou/errou no SERVIDOR (não confia no que o front manda),
  // comparando com a alternativa_correta salva no banco.
  async registrar(codUsuario: number, codQuest: number, alternativaEscolhida: string): Promise<string> {
    const questao = await prisma.questao.findUnique({ where: { cod_quest: codQuest } });

    if (!questao) {
      throw new Error('QUESTAO_NAO_ENCONTRADA');
    }

    const status = questao.alternativa_correta.toLowerCase() === alternativaEscolhida.toLowerCase()
      ? 'Acertou'
      : 'Errou';

    await prisma.historico.create({
      data: {
        cod_usuario: codUsuario,
        cod_quest: codQuest,
        data_resposta: new Date(),
        status,
      },
    });

    return status;
  },
};