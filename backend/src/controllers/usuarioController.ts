import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { generateToken } from '../lib/auth.js';
import { verifyPassword } from '../lib/crypto.js';
import { UsuarioModel } from '../models/usuarioModel.js';
import type { UsuarioCreatePayload, UsuarioListItem, UsuarioTipo } from '../types/usuario.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OITO_HORAS_MS = 8 * 60 * 60 * 1000;

export const UsuarioController = {
  async criar(req: Request, res: Response, next: NextFunction) {
    const { nome, email, senha, grau_escolar, data_nasc, tipo } = req.body as UsuarioCreatePayload;

    if (!nome || !email || !senha || !data_nasc || !tipo) {
      return next(new HttpError(400, 'Preencha todos os campos obrigatórios.'));
    }

    const tipoUsuario = tipo as UsuarioTipo;
    if (!['administrador', 'aluno'].includes(tipoUsuario)) {
      return next(new HttpError(400, 'Tipo deve ser "administrador" ou "aluno".'));
    }

    if (tipoUsuario === 'aluno' && !grau_escolar) {
      return next(new HttpError(400, 'Alunos devem informar o grau escolar.'));
    }

    if (!emailRegex.test(email)) {
      return next(new HttpError(400, 'E-mail inválido.'));
    }

    try {
      const emailExiste = await UsuarioModel.buscarPorEmail(email);
      if (emailExiste) {
        return next(new HttpError(409, 'Este e-mail já está cadastrado. Use outro e-mail.'));
      }

      const id = await UsuarioModel.criar({ nome, email, senha, grau_escolar, data_nasc, tipo: tipoUsuario });
      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id });
    } catch (error) {
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, senha } = req.body as { email?: string; senha?: string };

    if (!email || !senha) {
      return next(new HttpError(400, 'E-mail e senha são obrigatórios.'));
    }

    if (!emailRegex.test(email)) {
      return next(new HttpError(400, 'E-mail inválido.'));
    }

    try {
      const usuario = await UsuarioModel.buscarPorEmailCompleto(email);

      if (!usuario) {
        return next(new HttpError(401, 'Usuário não encontrado.'));
      }

      const senhaValida = await verifyPassword(senha, usuario.senha);
      if (!senhaValida) {
        return next(new HttpError(401, 'Senha incorreta.'));
      }

      const token = generateToken({
        id: usuario.cod_usuario,
        email: usuario.email,
        tipo: usuario.tipo,
      });

      // Cookie httpOnly: usado só pelo SERVIDOR para decidir se envia as
      // páginas privadas. O front-end não lê esse cookie (JS não acessa
      // httpOnly) — ele usa o token do JSON abaixo, salvo no localStorage,
      // para autenticar as chamadas fetch à API via header Authorization.
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: OITO_HORAS_MS,
      });

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: {
          cod_usuario: usuario.cod_usuario,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
          grau_escolar: usuario.grau_escolar,
          data_nasc: usuario.data_nasc.toISOString().slice(0, 10),
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
  },

  async perfil(req: Request, res: Response, next: NextFunction) {
    const usuarioLogado = req.user;

    if (!usuarioLogado) {
      return next(new HttpError(401, 'Usuário não autenticado.'));
    }

    try {
      const usuario = await UsuarioModel.buscarPorId(usuarioLogado.id);

      if (!usuario) {
        return next(new HttpError(404, 'Usuário não encontrado.'));
      }

      return res.status(200).json({
        usuario: {
          ...usuario,
          data_nasc: usuario.data_nasc.toISOString().slice(0, 10),
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios: UsuarioListItem[] = await UsuarioModel.listar();
      return res.status(200).json(usuarios);
    } catch (error) {
      return next(error);
    }
  },
};