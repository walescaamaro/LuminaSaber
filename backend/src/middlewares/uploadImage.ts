import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import multer from 'multer';
import { HttpError } from '../errors/HttpError.js';
import { UPLOADS_DIRECTORY } from '../lib/uploadPaths.js';

// Lista de permissões: MIME aceito → extensão que o SERVIDOR escolhe para o arquivo.
const extensoesPorTipo: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

// Garante a pasta mesmo num clone novo (o Git não versiona o conteúdo de uploads/).
mkdirSync(UPLOADS_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOADS_DIRECTORY),
  // Nome gerado pelo servidor: o file.originalname do cliente é ignorado,
  // então não há sobrescrita nem "../../" no caminho.
  filename: (_req, file, callback) => {
    callback(null, `${randomUUID()}.${extensoesPorTipo[file.mimetype]}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB → MulterError LIMIT_FILE_SIZE → 400 no errorHandler
    files: 1,
  },
  // O fileFilter roda ANTES do storage: tipo recusado = erro 400 e nada é gravado.
  // Se estourar o limite de tamanho, o Multer apaga o arquivo parcial sozinho.
  fileFilter(_req, file, callback) {
    if (!Object.hasOwn(extensoesPorTipo, file.mimetype)) {
      return callback(new HttpError(400, 'Tipo de arquivo não permitido. Envie JPEG, PNG ou GIF.'));
    }
    return callback(null, true);
  },
});