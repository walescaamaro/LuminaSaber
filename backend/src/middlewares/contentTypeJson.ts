import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';

export function contentTypeJson(req: Request, res: Response, next: NextFunction) {
  const caminhoOriginal = req.originalUrl.split('?')[0];
  if (caminhoOriginal === '/api/users/image' && req.is('multipart/form-data')) {
    res.type('application/json; charset=utf-8');
    return next();
  }

  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return next(new HttpError(415, 'Content-Type must be application/json'));
  }

  res.type('application/json; charset=utf-8');
  next();
}
