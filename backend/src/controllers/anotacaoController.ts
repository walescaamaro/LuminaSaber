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

    const { titulo, texto_anota, cod_pasta } = req.body as {
      titulo?: string;
      texto_anota?: string;
      cod_pasta?: number;
    };

    if (!titulo || !texto_anota) {
      return next(new HttpError(400, 'Preencha o título e o texto da anotação.'));
    }

    try {
      const id = await AnotacaoModel.criar(usuarioLogado.id, titulo, texto_anota, cod_pasta);
      return res.status(201).json({ mensagem: 'Anotação salva com sucesso!', id });
    } catch (error) {
      if (error instanceof Error && error.message === 'PASTA_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Pasta não encontrada.'));
      }
      return next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const codAnota = Number((req.params as { id: string | number }).id);
    const { titulo, texto_anota, cod_pasta } = req.body as {
      titulo?: string;
      texto_anota?: string;
      cod_pasta?: number;
    };

    try {
      await AnotacaoModel.atualizar(usuarioLogado.id, codAnota, { titulo, texto_anota, cod_pasta });
      return res.status(200).json({ mensagem: 'Anotação atualizada com sucesso!' });
    } catch (error) {
      if (error instanceof Error && error.message === 'ANOTACAO_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Anotação não encontrada.'));
      }
      if (error instanceof Error && error.message === 'PASTA_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Pasta não encontrada.'));
      }
      return next(error);
    }
  },

  async excluir(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const codAnota = Number((req.params as { id: string | number }).id);

    try {
      await AnotacaoModel.excluir(usuarioLogado.id, codAnota);
      return res.status(200).json({ mensagem: 'Anotação excluída com sucesso!' });
    } catch (error) {
      if (error instanceof Error && error.message === 'ANOTACAO_NAO_ENCONTRADA') {
        return next(new HttpError(404, 'Anotação não encontrada.'));
      }
      return next(error);
    }
  },
};