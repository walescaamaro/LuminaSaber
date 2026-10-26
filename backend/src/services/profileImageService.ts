import { open, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { Express } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { ImageModel } from '../models/imageModel.js';
import { UPLOADS_DIRECTORY, UPLOADS_PUBLIC_PATH } from '../lib/uploadPaths.js';

type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/gif';

// Confere os "magic bytes" do início do arquivo: o Content-Type enviado pelo
// cliente pode mentir, a assinatura real do arquivo não.
function identificarTipo(inicio: Buffer): ImageMimeType | null {
  if (inicio.length >= 3 && inicio[0] === 0xff && inicio[1] === 0xd8 && inicio[2] === 0xff) {
    return 'image/jpeg';
  }

  const assinaturaPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (inicio.length >= 8 && inicio.subarray(0, 8).equals(assinaturaPng)) {
    return 'image/png';
  }

  const assinaturaGif = inicio.subarray(0, 6).toString('ascii');
  if (assinaturaGif === 'GIF87a' || assinaturaGif === 'GIF89a') {
    return 'image/gif';
  }

  return null;
}

async function lerInicio(caminho: string): Promise<Buffer> {
  const handle = await open(caminho, 'r');
  try {
    const buffer = Buffer.alloc(8);
    const { bytesRead } = await handle.read(buffer, 0, 8, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

// Só apaga arquivos com o formato exato que o servidor gera (<uuid v4>.jpg|png|gif),
// mesmo que o valor guardado no banco seja adulterado.
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
  // O Multer já gravou o arquivo em disco (arquivo.path / arquivo.filename).
  async salvar(codUsuario: number, arquivo: Express.Multer.File) {
    const tipoReal = identificarTipo(await lerInicio(arquivo.path));
    if (!tipoReal || tipoReal !== arquivo.mimetype) {
      await removerArquivo(arquivo.path);
      throw new HttpError(400, 'O conteúdo do arquivo não corresponde a uma imagem JPEG, PNG ou GIF válida.');
    }

    const caminhoPublico = `${UPLOADS_PUBLIC_PATH}/${arquivo.filename}`;

    let resultado: Awaited<ReturnType<typeof ImageModel.salvarDoUsuario>>;
    try {
      resultado = await ImageModel.salvarDoUsuario(codUsuario, caminhoPublico);
    } catch (error) {
      await removerArquivo(arquivo.path); // falhou no banco: não deixa arquivo órfão
      throw error;
    }

    if (resultado.caminhoAnterior) {
      const caminhoAntigo = caminhoAntigoSeguro(resultado.caminhoAnterior);
      if (caminhoAntigo) {
        await removerArquivo(caminhoAntigo);
      }
    }

    return { imageUrl: caminhoPublico, criada: resultado.criada };
  },
};