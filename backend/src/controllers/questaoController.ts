import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { QuestaoModel } from '../models/questaoModel.js';
import type { QuestaoBanco, QuestaoFrontend, QuestaoPayload } from '../types/questao.js';

const mapearParaFrontend = (q: QuestaoBanco): QuestaoFrontend => {
  const mapaLetraParaIndex: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };

  return {
    id: q.cod_quest,
    materia: q.materia,
    nivel: q.dificuldade,
    enunciado: q.enunciado,
    alternativas: [q.alternativa_A, q.alternativa_B, q.alternativa_C, q.alternativa_D],
    correta: mapaLetraParaIndex[q.alternativa_correta] ?? 0,
  };
};

const CAMPOS_OBRIGATORIOS: Array<keyof QuestaoPayload> = [
  'cod_disc',
  'enunciado',
  'alternativa_A',
  'alternativa_B',
  'alternativa_C',
  'alternativa_D',
  'alternativa_correta',
  'dificuldade',
];

const LETRAS_VALIDAS = ['a', 'b', 'c', 'd'] as const;

type LetraValida = (typeof LETRAS_VALIDAS)[number];

export const QuestaoController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const questoesBanco = await QuestaoModel.listarTodas();
      const formatadas = questoesBanco.map(mapearParaFrontend);
      return res.status(200).json(formatadas);
    } catch (error) {
      return next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numeroId = Number(id);

    if (Number.isNaN(numeroId)) {
      return next(new HttpError(400, 'O ID deve ser um número inteiro.'));
    }

    try {
      const questao = await QuestaoModel.buscarPorId(numeroId);
      if (!questao) {
        return next(new HttpError(404, `Questão com ID ${id} não encontrada.`));
      }
      return res.status(200).json(mapearParaFrontend(questao));
    } catch (error) {
      return next(error);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    const dados = req.body as QuestaoPayload;

    const faltando = CAMPOS_OBRIGATORIOS.filter((campo) => !dados[campo]);
    if (faltando.length > 0) {
      return next(new HttpError(400, `Campos obrigatórios ausentes: ${faltando.join(', ')}`));
    }

    const alternativa = String(dados.alternativa_correta).toLowerCase() as LetraValida;
    if (!LETRAS_VALIDAS.includes(alternativa)) {
      return next(new HttpError(400, 'alternativa_correta deve ser uma das letras: a, b, c ou d.'));
    }

    try {
      const novoId = await QuestaoModel.criar({ ...dados, alternativa_correta: alternativa });
      return res.status(201).json({ mensagem: 'Questão criada com sucesso!', id: novoId });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'DUPLICADO') {
        return next(new HttpError(409, 'Esta questão já está cadastrada.'));
      }
      return next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const dados = req.body as Partial<QuestaoPayload>;
    const numeroId = Number(id);

    if (Number.isNaN(numeroId)) {
      return next(new HttpError(400, 'O ID deve ser um número inteiro.'));
    }

    const camposEditaveis: Array<keyof QuestaoPayload> = [
      'cod_disc',
      'enunciado',
      'alternativa_A',
      'alternativa_B',
      'alternativa_C',
      'alternativa_D',
      'alternativa_correta',
      'dificuldade',
    ];
    const temAlgumCampo = camposEditaveis.some((campo) => dados[campo] !== undefined);
    if (!temAlgumCampo) {
      return next(new HttpError(400, 'Envie ao menos um campo para atualizar.'));
    }

    if (dados.alternativa_correta) {
      const alternativaAtualizada = String(dados.alternativa_correta).toLowerCase() as LetraValida;
      if (!LETRAS_VALIDAS.includes(alternativaAtualizada)) {
        return next(new HttpError(400, 'alternativa_correta deve ser: a, b, c ou d.'));
      }
      dados.alternativa_correta = alternativaAtualizada;
    }

    try {
      const alteracoes = await QuestaoModel.atualizar(numeroId, dados);
      if (alteracoes === 0) {
        return next(new HttpError(404, `Questão com ID ${id} não encontrada.`));
      }
      return res.status(200).json({ mensagem: `Questão ${id} atualizada com sucesso!` });
    } catch (error) {
      return next(error);
    }
  },

  async deletar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numeroId = Number(id);

    if (Number.isNaN(numeroId)) {
      return next(new HttpError(400, 'O ID deve ser um número inteiro.'));
    }

    try {
      const alteracoes = await QuestaoModel.deletar(numeroId);
      if (alteracoes === 0) {
        return next(new HttpError(404, `Questão com ID ${id} não encontrada.`));
      }
      return res.status(200).json({ mensagem: `Questão ${id} deletada com sucesso!` });
    } catch (error) {
      return next(error);
    }
  },
};
