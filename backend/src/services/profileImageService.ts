import { randomUUID } from 'node:crypto';
import { open, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { FileHandle } from 'node:fs/promises';
import type { Express } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { ImageModel } from '../models/imageModel.js';
import { UPLOADS_DIRECTORY, UPLOADS_PUBLIC_PATH } from '../lib/uploadPaths.js';

const extensoesPorTipo = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
} as const;

type ImageMimeType = keyof typeof extensoesPorTipo;

function identificarTipo(buffer: Buffer): ImageMimeType | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  const assinaturaPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length >= assinaturaPng.length && buffer.subarray(0, 8).equals(assinaturaPng)) {
    return 'image/png';
  }

  const assinaturaGif = buffer.subarray(0, 6).toString('ascii');
  if (assinaturaGif === 'GIF87a' || assinaturaGif === 'GIF89a') {
    return 'image/gif';
  }

  return null;
}

function caminhoAntigoSeguro(caminhoPublico: string): string | null {
  const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  const correspondencia = new RegExp(`^${UPLOADS_PUBLIC_PATH}/(${uuid}\\.(?:jpg|png|gif))$`, 'i')
    .exec(caminhoPublico);

  return correspondencia ? path.join(UPLOADS_DIRECTORY, correspondencia[1]) : null;
}

async function removerArquivo(caminho: string): Promise<void> {
  try {
    await unlink(caminho);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Não foi possível remover um arquivo de imagem após a operação.');
    }
  }
}

export const ProfileImageService = {
  async salvar(codUsuario: number, arquivo: Express.Multer.File) {
    const tipoReal = identificarTipo(arquivo.buffer);
    if (!tipoReal || tipoReal !== arquivo.mimetype) {
      throw new HttpError(400, 'O conteúdo do arquivo não corresponde a uma imagem JPEG, PNG ou GIF válida.');
    }

    await mkdir(UPLOADS_DIRECTORY, { recursive: true });

    const nomeArquivo = `${randomUUID()}.${extensoesPorTipo[tipoReal]}`;
    const caminhoDisco = path.join(UPLOADS_DIRECTORY, nomeArquivo);
    const caminhoPublico = `${UPLOADS_PUBLIC_PATH}/${nomeArquivo}`;
    let arquivoCriado = false;
    let handle: FileHandle | undefined;
    let resultado: Awaited<ReturnType<typeof ImageModel.salvarDoUsuario>>;

    try {
      handle = await open(caminhoDisco, 'wx');
      arquivoCriado = true;
      await handle.writeFile(arquivo.buffer);
      await handle.close();
      handle = undefined;

      resultado = await ImageModel.salvarDoUsuario(codUsuario, caminhoPublico);
    } catch (error) {
      if (handle) {
        await handle.close().catch(() => undefined);
      }
      if (arquivoCriado) {
        await removerArquivo(caminhoDisco);
      }
      throw error;
    }

    if (resultado.caminhoAnterior) {
      const caminhoAntigo = caminhoAntigoSeguro(resultado.caminhoAnterior);
      if (caminhoAntigo) {
        await removerArquivo(caminhoAntigo);
      }
    }

    return {
      imageUrl: caminhoPublico,
      criada: resultado.criada,
    };
  },
};