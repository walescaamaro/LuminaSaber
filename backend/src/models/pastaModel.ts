// backend/src/models/pastaModel.ts (novo)
import { prisma } from '../lib/prisma.js';

export const PastaModel = {
  // Toda anotação precisa estar dentro de uma pasta (regra do banco).
  // Pra simplificar a experiência, criamos uma pasta padrão automaticamente
  // na primeira anotação do usuário, sem exigir que ele gerencie pastas.
  async buscarOuCriarPadrao(codUsuario: number): Promise<number> {
    const existente = await prisma.pasta.findFirst({
      where: { cod_usuario: codUsuario },
      select: { cod_pasta: true },
      orderBy: { cod_pasta: 'asc' },
    });

    if (existente) return existente.cod_pasta;

    const nova = await prisma.pasta.create({
      data: {
        cod_usuario: codUsuario,
        nome_pasta: 'Minhas anotações',
        data_criacao: new Date(),
      },
      select: { cod_pasta: true },
    });

    return nova.cod_pasta;
  },
};