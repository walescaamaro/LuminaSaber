import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(error.issues ? { issues: error.issues } : {}),
    });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}
