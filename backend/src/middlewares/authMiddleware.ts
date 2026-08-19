import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { verifyToken } from '../lib/auth.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Token de autenticação ausente ou inválido.'));
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const payload = verifyToken(token);

  if (!payload) {
    return next(new HttpError(401, 'Sessão inválida ou expirada.'));
  }

  req.user = payload;
  return next();
}
