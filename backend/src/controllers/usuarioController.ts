import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import db from '../database/database.js';
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
      const conn = await db.connect();
      const emailExiste = await conn.get<{ cod_usuario: number }>('SELECT cod_usuario FROM USUARIO WHERE email = ?', [email]);
      if (emailExiste) {
        await conn.close();
        return next(new HttpError(409, 'Este e-mail já está cadastrado. Use outro e-mail.'));
      }

      const senhaExiste = await conn.get<{ cod_usuario: number }>('SELECT cod_usuario FROM USUARIO WHERE senha = ?', [senha]);
      if (senhaExiste) {
        await conn.close();
        return next(new HttpError(409, 'Esta senha já está em uso. Por favor, escolha uma senha diferente.'));
      }

      const resultado = await conn.run(
        `INSERT INTO USUARIO (nome, email, senha, grau_escolar, data_nasc, tipo)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, email, senha, grau_escolar || null, data_nasc, tipoUsuario]
      );
      await conn.close();

      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: resultado.lastID });
    } catch (error) {
      return next(error);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const conn = await db.connect();
      const usuarios = await conn.all<UsuarioListItem>('SELECT cod_usuario, nome, email, grau_escolar, data_nasc, tipo FROM USUARIO');
      await conn.close();
      return res.status(200).json(usuarios);
    } catch (error) {
      return next(error);
    }
  },
};
