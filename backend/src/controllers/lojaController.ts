import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { LojaModel } from '../models/lojaModel.js';
import { ITENS_LOJA } from '../constants/loja.js';
import type { TipoBeneficio } from '../types/loja.js';

export const LojaController = {
  // Catálogo é público (autenticado) e serve de fonte única de verdade
  // para o front-end desenhar os cartões da loja.
  async listarItens(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(Object.values(ITENS_LOJA));
    } catch (error) {
      return next(error);
    }
  },

  async carteira(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    try {
      const estrelas = await LojaModel.obterSaldo(usuarioLogado.id);
      return res.status(200).json({ estrelas });
    } catch (error) {
      return next(error);
    }
  },

  async inventario(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    try {
      const inventario = await LojaModel.obterInventario(usuarioLogado.id);
      return res.status(200).json(inventario);
    } catch (error) {
      return next(error);
    }
  },

  async comprar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { item } = req.body as { item: TipoBeneficio };

    try {
      const resultado = await LojaModel.comprarItem(usuarioLogado.id, item);
      return res.status(200).json({
        mensagem: `Compra realizada com sucesso: ${ITENS_LOJA[item].nome}.`,
        ...resultado,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'SALDO_INSUFICIENTE') {
        return next(new HttpError(400, 'Estrelas insuficientes para essa compra.'));
      }
      if (error instanceof Error && error.message === 'ITEM_INVALIDO') {
        return next(new HttpError(400, 'Item da loja inválido.'));
      }
      if (error instanceof Error && error.message === 'USUARIO_NAO_ENCONTRADO') {
        return next(new HttpError(404, 'Usuário não encontrado.'));
      }
      return next(error);
    }
  },

  async usar(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { tipo } = req.body as { tipo: TipoBeneficio };

    try {
      const inventario = await LojaModel.usarBeneficio(usuarioLogado.id, tipo);
      return res.status(200).json({ mensagem: 'Benefício utilizado com sucesso.', inventario });
    } catch (error) {
      if (error instanceof Error && error.message === 'BENEFICIO_INDISPONIVEL') {
        return next(new HttpError(400, 'Você não possui esse benefício disponível.'));
      }
      return next(error);
    }
  },

  // Chamado ao final de uma sessão de estudo (tela /relatorio) pra
  // creditar as estrelas de acordo com o percentual da meta concluída.
  async sessaoConcluida(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;
    if (!usuarioLogado) return next(new HttpError(401, 'Usuário não autenticado.'));

    const { meta, respondidas } = req.body as { meta: number; respondidas: number };

    try {
      const { estrelasGanhas, estrelas } = await LojaModel.registrarSessaoConcluida(
        usuarioLogado.id,
        meta,
        respondidas,
      );
      return res.status(200).json({
        mensagem: 'Recompensa da sessão creditada com sucesso.',
        estrelasGanhas,
        estrelas,
      });
    } catch (error) {
      return next(error);
    }
  },
};