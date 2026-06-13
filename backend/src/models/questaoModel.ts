import { prisma } from '../lib/prisma.js';
import type { QuestaoBanco, QuestaoPayload } from '../types/questao.js';

type QuestaoComDisciplina = Awaited<ReturnType<typeof prisma.questao.findFirst>> & {
  disciplina?: { nome_disc: string };
};

function mapearQuestao(questao: NonNullable<QuestaoComDisciplina>): QuestaoBanco {
  return {
    cod_quest: questao.cod_quest,
    cod_disc: questao.cod_disc,
    enunciado: questao.enunciado,
    alternativa_A: questao.alternativa_A,
    alternativa_B: questao.alternativa_B,
    alternativa_C: questao.alternativa_C,
    alternativa_D: questao.alternativa_D,
    alternativa_correta: questao.alternativa_correta as QuestaoBanco['alternativa_correta'],
    dificuldade: questao.dificuldade,
    materia: questao.disciplina?.nome_disc ?? '',
  };
}

export const QuestaoModel = {
  async listarTodas(): Promise<QuestaoBanco[]> {
    const questoes = await prisma.questao.findMany({
      include: { disciplina: true },
      orderBy: [{ disciplina: { nome_disc: 'asc' } }, { cod_quest: 'asc' }],
    });
    return questoes.map(mapearQuestao);
  },

  async buscarPorId(id: number): Promise<QuestaoBanco | undefined> {
    const questao = await prisma.questao.findUnique({
      where: { cod_quest: id },
      include: { disciplina: true },
    });
    return questao ? mapearQuestao(questao) : undefined;
  },

  async criar(dados: QuestaoPayload): Promise<number> {
    const existe = await prisma.questao.findFirst({
      where: { enunciado: dados.enunciado },
      select: { cod_quest: true },
    });
    if (existe) {
      throw new Error('DUPLICADO');
    }

    const questao = await prisma.questao.create({
      data: {
        cod_disc: dados.cod_disc,
        enunciado: dados.enunciado,
        alternativa_A: dados.alternativa_A,
        alternativa_B: dados.alternativa_B,
        alternativa_C: dados.alternativa_C,
        alternativa_D: dados.alternativa_D,
        alternativa_correta: dados.alternativa_correta.toLowerCase(),
        dificuldade: dados.dificuldade,
      },
      select: { cod_quest: true },
    });

    return questao.cod_quest;
  },

  async atualizar(id: number, dados: Partial<QuestaoPayload>): Promise<number> {
    const questaoExiste = await prisma.questao.findUnique({
      where: { cod_quest: id },
      select: { cod_quest: true },
    });
    if (!questaoExiste) return 0;

    await prisma.questao.update({
      where: { cod_quest: id },
      data: {
        ...(dados.cod_disc !== undefined && { cod_disc: dados.cod_disc }),
        ...(dados.enunciado !== undefined && { enunciado: dados.enunciado }),
        ...(dados.alternativa_A !== undefined && { alternativa_A: dados.alternativa_A }),
        ...(dados.alternativa_B !== undefined && { alternativa_B: dados.alternativa_B }),
        ...(dados.alternativa_C !== undefined && { alternativa_C: dados.alternativa_C }),
        ...(dados.alternativa_D !== undefined && { alternativa_D: dados.alternativa_D }),
        ...(dados.alternativa_correta !== undefined && {
          alternativa_correta: dados.alternativa_correta.toLowerCase(),
        }),
        ...(dados.dificuldade !== undefined && { dificuldade: dados.dificuldade }),
      },
    });

    return 1;
  },

  async deletar(id: number): Promise<number> {
    const questaoExiste = await prisma.questao.findUnique({
      where: { cod_quest: id },
      select: { cod_quest: true },
    });
    if (!questaoExiste) return 0;

    await prisma.questao.delete({ where: { cod_quest: id } });
    return 1;
  },
};
