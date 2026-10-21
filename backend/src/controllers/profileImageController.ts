import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { ProfileImageService } from '../services/profileImageService.js';

export const ProfileImageController = {
  async salvar(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next(new HttpError(401, 'Usuário não autenticado.'));
    }

    if (!req.file) {
      return next(new HttpError(400, 'Envie um arquivo no campo image.'));
    }

    try {
      const resultado = await ProfileImageService.salvar(req.user.id, req.file);
      return res.status(resultado.criada ? 201 : 200).json({
        mensagem: 'Imagem de perfil salva com sucesso.',
        imageUrl: resultado.imageUrl,
      });
    } catch (error) {
      return next(error);
    }
  },
};