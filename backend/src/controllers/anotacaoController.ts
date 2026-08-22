import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { AnotacaoModel } from '../models/anotacaoModel.js';

export const AnotacaoController = {
  async listarMinhas(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    try {
      const anotacoes = await AnotacaoModel.listarPorUsuario(usuarioLogado.id);
      return res.status(200).json(anotacoes);
    } catch (error) {
      return next(error);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { titulo, texto_anota } = req.body as { titulo?: string; texto_anota?: string };

    if (!titulo || !texto_anota) {
      return next(new HttpError(400, 'Preencha o título e o texto da anotação.'));
    }

    try {
      const id = await AnotacaoModel.criar(usuarioLogado.id, titulo, texto_anota);
      return res.status(201).json({ mensagem: 'Anotação salva com sucesso!', id });
    } catch (error) {
      return next(error);
    }
  },
};