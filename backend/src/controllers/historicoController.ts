import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { HistoricoModel } from '../models/historicoModel.js';

const LETRAS_VALIDAS = ['a', 'b', 'c', 'd'];

export const HistoricoController = {
  async listarMeu(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    try {
      const historico = await HistoricoModel.listarPorUsuario(usuarioLogado.id);
      return res.status(200).json(historico);
    } catch (error) {
      return next(error);
    }
  },

  // Usado pelo admin, na tela "Gerenciamento de Usuários", pra ver o
  // histórico de QUALQUER aluno (não só o do próprio usuário logado).
  // Protegido por authMiddleware + adminMiddleware na rota.
  async listarDeUsuario(req: Request, res: Response, next: NextFunction) {
    const codUsuario = Number(req.params.id);

    if (Number.isNaN(codUsuario)) {
      return next(new HttpError(400, 'O ID do usuário deve ser um número inteiro.'));
    }

    try {
      const historico = await HistoricoModel.listarPorUsuario(codUsuario);
      return res.status(200).json(historico);
    } catch (error) {
      return next(error);
    }
  },

  async registrar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { cod_quest, alternativa } = req.body as { cod_quest?: number; alternativa?: string };

    if (!cod_quest || !alternativa || !LETRAS_VALIDAS.includes(String(alternativa).toLowerCase())) {
      return next(new HttpError(400, 'Informe cod_quest e uma alternativa válida (a, b, c ou d).'));
    }

    try {
      const status = await HistoricoModel.registrar(usuarioLogado.id, Number(cod_quest), String(alternativa));
      return res.status(201).json({ mensagem: 'Resposta registrada com sucesso!', status });
    } catch (error) {
      if (error instanceof Error && error.message === 'QUESTAO_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Questão não encontrada.'));
      }
      return next(error);
    }
  },
};