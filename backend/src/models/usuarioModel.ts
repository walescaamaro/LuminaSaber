import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/crypto.js';
import { hashTokenRecuperacao } from '../lib/password.js';
import type { UsuarioCreatePayload, UsuarioListItem, UsuarioTipo } from '../types/usuario.js';

export const UsuarioModel = {
  async buscarPorEmail(email: string) {
    return prisma.usuario.findFirst({
      where: { email },
      select: { cod_usuario: true },
    });
  },

  async buscarPorEmailCompleto(email: string) {
    return prisma.usuario.findFirst({
      where: { email },
      select: {
        cod_usuario: true,
        nome: true,
        email: true,
        senha: true,
        tipo: true,
        grau_escolar: true,
        data_nasc: true,
      },
    });
  },

  async buscarPorId(codUsuario: number) {
    return prisma.usuario.findUnique({
      where: { cod_usuario: codUsuario },
      select: {
        cod_usuario: true,
        nome: true,
        email: true,
        grau_escolar: true,
        data_nasc: true,
        tipo: true,
      },
    });
  },

  async criar(dados: UsuarioCreatePayload): Promise<number> {
    const senhaHash = await hashPassword(dados.senha);
    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        grau_escolar: dados.grau_escolar || null,
        data_nasc: new Date(dados.data_nasc),
        tipo: dados.tipo,
      },
      select: { cod_usuario: true },
    });
    return usuario.cod_usuario;
  },

  async atualizarSenha(codUsuario: number, novaSenha: string) {
    const senhaHash = await hashPassword(novaSenha);
    return prisma.usuario.update({
      where: { cod_usuario: codUsuario },
      data: { senha: senhaHash },
    });
  },

  async invalidarTokensPendentes(codUsuario: number) {
    const agora = new Date();
    return prisma.passwordResetToken.updateMany({
      where: {
        cod_usuario: codUsuario,
        usado_em: null,
        expires_at: {
          gt: agora,
        },
      },
      data: {
        usado_em: agora,
      },
    });
  },

  async criarTokenRecuperacao(codUsuario: number, token: string, validadeMs: number) {
    const tokenHash = hashTokenRecuperacao(token);
    return prisma.passwordResetToken.create({
      data: {
        cod_usuario: codUsuario,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + validadeMs),
      },
      select: { cod_token: true, expires_at: true },
    });
  },

  async buscarTokenValidoPorHash(tokenHash: string) {
    return prisma.passwordResetToken.findFirst({
      where: {
        token_hash: tokenHash,
        usado_em: null,
        expires_at: {
          gt: new Date(),
        },
      },
      select: {
        cod_token: true,
        cod_usuario: true,
        expires_at: true,
        usado_em: true,
      },
    });
  },

  async marcarTokenUtilizado(codToken: number) {
    return prisma.passwordResetToken.update({
      where: { cod_token: codToken },
      data: { usado_em: new Date() },
    });
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
