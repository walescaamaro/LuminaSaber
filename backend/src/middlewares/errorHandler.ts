import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
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

  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'O arquivo excede o limite de 2 MB.'
      : 'Não foi possível processar o arquivo enviado.';
    return res.status(400).json({ error: message });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}
