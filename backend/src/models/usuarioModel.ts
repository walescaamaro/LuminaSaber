import { prisma } from '../lib/prisma.js';
import type { UsuarioCreatePayload, UsuarioListItem } from '../types/usuario.js';

export const UsuarioModel = {
  async buscarPorEmail(email: string) {
    return prisma.usuario.findFirst({
      where: { email },
      select: { cod_usuario: true },
    });
  },

  async buscarPorSenha(senha: string) {
    return prisma.usuario.findFirst({
      where: { senha },
      select: { cod_usuario: true },
    });
  },

  async criar(dados: UsuarioCreatePayload): Promise<number> {
    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        grau_escolar: dados.grau_escolar || null,
        data_nasc: new Date(dados.data_nasc),
        tipo: dados.tipo,
      },
      select: { cod_usuario: true },
    });

    return usuario.cod_usuario;
  },

  async listar(): Promise<UsuarioListItem[]> {
    const usuarios = await prisma.usuario.findMany({
      select: {
        cod_usuario: true,
        nome: true,
        email: true,
        grau_escolar: true,
        data_nasc: true,
        tipo: true,
      },
      orderBy: { nome: 'asc' },
    });

    return usuarios.map((usuario) => ({
      ...usuario,
      data_nasc: usuario.data_nasc.toISOString().slice(0, 10),
    }));
  },
};
