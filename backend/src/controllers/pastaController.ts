import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { PastaModel } from '../models/pastaModel.js';

export const PastaController = {
  async listarMinhas(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    try {
      const pastas = await PastaModel.listarPorUsuario(usuarioLogado.id);
      return res.status(200).json(pastas);
    } catch (error) {
      return next(error);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { nome_pasta } = req.body as { nome_pasta: string };

    try {
      const pasta = await PastaModel.criar(usuarioLogado.id, nome_pasta);
      return res.status(201).json({ mensagem: 'Pasta criada com sucesso!', pasta });
    } catch (error) {
      return next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const codPasta = Number((req.params as { id: string | number }).id);
    const { nome_pasta } = req.body as { nome_pasta: string };

    try {
      await PastaModel.renomear(usuarioLogado.id, codPasta, nome_pasta);
      return res.status(200).json({ mensagem: 'Pasta renomeada com sucesso!' });
    } catch (error) {
      if (error instanceof Error && error.message === 'PASTA_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Pasta não encontrada.'));
      }
      return next(error);
    }
  },

  async excluir(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const codPasta = Number((req.params as { id: string | number }).id);

    try {
      await PastaModel.excluir(usuarioLogado.id, codPasta);
      return res.status(200).json({ mensagem: 'Pasta excluída com sucesso! As anotações foram movidas para outra pasta.' });
    } catch (error) {
      if (error instanceof Error && error.message === 'PASTA_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Pasta não encontrada.'));
      }
      return next(error);
    }
  },
};