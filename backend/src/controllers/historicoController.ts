import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { HistoricoModel } from '../models/historicoModel.js';

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
  // Protegido por authMiddleware + adminMiddleware na rota, e o formato
  // de :id já foi conferido pelo middleware validate(listarHistoricoDeUsuarioSchema).
  async listarDeUsuario(req: Request, res: Response, next: NextFunction) {
    const codUsuario = Number(req.params.id);

    try {
      const historico = await HistoricoModel.listarPorUsuario(codUsuario);
      return res.status(200).json(historico);
    } catch (error) {
      return next(error);
    }
  },

  // cod_quest (número positivo) e alternativa (uma de a/b/c/d, já
  // normalizada para minúscula pelo schema) já foram conferidos pelo
  // middleware validate(registrarHistoricoSchema) na rota.
  async registrar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { cod_quest, alternativa } = req.body as { cod_quest: number; alternativa: string };

    try {
      const { status, estrelasGanhas } = await HistoricoModel.registrar(
        usuarioLogado.id,
        cod_quest,
        alternativa,
      );
      return res.status(201).json({ mensagem: 'Resposta registrada com sucesso!', status, estrelasGanhas });
    } catch (error) {
      if (error instanceof Error && error.message === 'QUESTAO_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Questão não encontrada.'));
      }
      return next(error);
    }
  },
};