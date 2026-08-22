import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';

/**
 * Roda DEPOIS do authMiddleware (precisa de req.user já preenchido).
 * Bloqueia a rota de API para qualquer usuário autenticado que não seja
 * administrador — protege dados sensíveis (ex.: lista de usuários) e
 * ações destrutivas (criar/editar/excluir questões).
 */
export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new HttpError(401, 'Usuário não autenticado.'));
  }

  if (req.user.tipo !== 'administrador') {
    return next(new HttpError(403, 'Acesso restrito a administradores.'));
  }

  return next();
}