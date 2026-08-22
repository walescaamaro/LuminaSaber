import type { Request } from 'express';
import { verifyToken, type AuthTokenPayload } from './auth.js';

/**
 * Lê e valida o token JWT guardado no cookie httpOnly (definido no login).
 * Usado apenas para decidir se o SERVIDOR pode enviar uma página HTML
 * privada — é diferente do authMiddleware, que protege as rotas de API
 * usando o header Authorization.
 */
export function obterSessaoPagina(req: Request): AuthTokenPayload | null {
  const token = req.cookies?.token;
  if (!token) return null;
  return verifyToken(token);
}