import multer from 'multer';
import { HttpError } from '../errors/HttpError.js';

const tiposPermitidos = new Set(['image/jpeg', 'image/png', 'image/gif']);

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter(_req, file, callback) {
    if (!tiposPermitidos.has(file.mimetype)) {
      return callback(new HttpError(400, 'Tipo de arquivo não permitido. Envie JPEG, PNG ou GIF.'));
    }

    return callback(null, true);
  },
});