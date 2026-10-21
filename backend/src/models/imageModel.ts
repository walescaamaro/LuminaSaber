import { prisma } from '../lib/prisma.js';

export const ImageModel = {
  async salvarDoUsuario(codUsuario: number, caminho: string) {
    return prisma.$transaction(async (transaction) => {
      const imagemAnterior = await transaction.image.findUnique({
        where: { cod_usuario: codUsuario },
        select: { caminho: true },
      });

      const imagem = await transaction.image.upsert({
        where: { cod_usuario: codUsuario },
        create: { cod_usuario: codUsuario, caminho },
        update: { caminho },
      });

      return {
        imagem,
        caminhoAnterior: imagemAnterior?.caminho ?? null,
        criada: imagemAnterior === null,
      };
    });
  },
};