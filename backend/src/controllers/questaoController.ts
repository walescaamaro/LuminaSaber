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

export const QuestaoController = {
  // cod_disc e dificuldade (quando enviados) já foram conferidos pelo
  // middleware validate(listarQuestoesSchema) na rota — aqui só repassamos
  // os filtros, já convertidos para número/string, ao model.
  async listar(req: Request, res: Response, next: NextFunction) {
    const { cod_disc, dificuldade } = req.query as { cod_disc?: string; dificuldade?: string };

    try {
      const questoesBanco = await QuestaoModel.listarTodas({
        cod_disc: cod_disc ? Number(cod_disc) : undefined,
        dificuldade,
      });
      const formatadas = questoesBanco.map(mapearParaFrontend);
      return res.status(200).json(formatadas);
    } catch (error) {
      return next(error);
    }
  },

  // O formato do :id (precisa ser numérico) já foi conferido pelo
  // middleware validate(buscarQuestaoPorIdSchema) na rota.
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numeroId = Number(id);

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

  // Campos obrigatórios, tamanho mínimo e a letra de alternativa_correta
  // já foram conferidos pelo middleware validate(criarQuestaoSchema) na
  // rota — só a regra de "enunciado repetido" fica aqui, porque depende
  // de consultar o banco (o Model lança 'DUPLICADO').
  async criar(req: Request, res: Response, next: NextFunction) {
    const dados = req.body as QuestaoPayload;

    try {
      const novoId = await QuestaoModel.criar(dados);
      return res.status(201).json({ mensagem: 'Questão criada com sucesso!', id: novoId });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'DUPLICADO') {
        return next(new HttpError(409, 'Esta questão já está cadastrada.'));
      }
      return next(error);
    }
  },

  // O schema (atualizarQuestaoSchema) já garante: :id numérico, ao menos
  // um campo enviado e alternativa_correta válida quando presente.
  async atualizar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const dados = req.body as Partial<QuestaoPayload>;
    const numeroId = Number(id);

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

  // O formato do :id já foi conferido pelo middleware validate(deletarQuestaoSchema).
  async deletar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numeroId = Number(id);

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