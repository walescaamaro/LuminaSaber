import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { UsuarioModel } from '../models/usuarioModel.js';
import type { UsuarioCreatePayload, UsuarioListItem, UsuarioTipo } from '../types/usuario.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios: UsuarioListItem[] = await UsuarioModel.listar();
      return res.status(200).json(usuarios);
    } catch (error) {
      return next(error);
    }
  },
};
