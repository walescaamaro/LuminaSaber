import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { generateToken } from '../lib/auth.js';
import { verifyPassword } from '../lib/crypto.js';
import { gerarTokenRecuperacao, hashTokenRecuperacao, senhaAtendeCritérios, validarSenha } from '../lib/password.js';
import { UsuarioModel } from '../models/usuarioModel.js';
import { SendMail } from '../services/SendMail.js';
import type { UsuarioCreatePayload, UsuarioListItem, UsuarioTipo } from '../types/usuario.js';

const OITO_HORAS_MS = 8 * 60 * 60 * 1000;
const UMA_HORA_MS = 60 * 60 * 1000;

export const UsuarioController = {
  // Formato, tamanho mínimo e obrigatoriedade de cada campo já foram
  // conferidos pelo middleware validate(criarUsuarioSchema) na rota — o
  // controller só cuida da regra de negócio que o Zod não pode checar
  // sozinho (e-mail duplicado depende de consultar o banco).
  async criar(req: Request, res: Response, next: NextFunction) {
    const { nome, email, senha, grau_escolar, data_nasc } = req.body as UsuarioCreatePayload;

    try {
      const errosSenha = validarSenha(senha);
      if (errosSenha.length > 0) {
        return next(new HttpError(400, `Senha inválida. ${errosSenha.join(' ')}`));
      }

      const emailNormalizado = email.trim().toLowerCase();
      const emailExiste = await UsuarioModel.buscarPorEmail(emailNormalizado);
      if (emailExiste) {
        return next(new HttpError(409, 'Este e-mail já está cadastrado. Use outro e-mail.'));
      }

      await UsuarioModel.criar({
        nome: nome.trim(),
        email: emailNormalizado,
        senha,
        grau_escolar,
        data_nasc,
        tipo: 'aluno',
      });

      const usuario = await UsuarioModel.buscarPorEmailCompleto(emailNormalizado);
      if (!usuario) {
        return next(new HttpError(500, 'Não foi possível iniciar a sessão.'));
      }

      const token = generateToken({
        id: usuario.cod_usuario,
        email: usuario.email,
        tipo: usuario.tipo,
      });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: OITO_HORAS_MS,
      });

      // O envio é depois de gravar no banco: não faz sentido avisar sobre
      // uma conta que falhou ao ser criada. Não usamos "await" aqui de
      // propósito — o e-mail é disparado em segundo plano, sem segurar a
      // resposta. É o padrão de produção que o próprio material da
      // disciplina recomenda ("enfileira o e-mail e responde sem depender
      // do servidor de e-mail"). O .catch cobre a falha: um SMTP fora do
      // ar não pode impedir alguém de criar conta, então o erro é só
      // registrado no log.
      SendMail.boasVindas(usuario.email, usuario.nome).catch((erroEnvio) => {
        console.error('Falha ao enviar o e-mail de boas-vindas:', erroEnvio);
      });

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
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

  // Formato de e-mail e senha obrigatória já foram conferidos pelo
  // middleware validate(loginUsuarioSchema) na rota.
  async login(req: Request, res: Response, next: NextFunction) {
    const { email: emailInformado, senha } = req.body as { email: string; senha: string };
    const email = emailInformado.trim().toLowerCase();

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

  async solicitarRedefinicaoSenha(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body as { email: string };
    const emailNormalizado = email.trim().toLowerCase();

    try {
      const usuario = await UsuarioModel.buscarPorEmailCompleto(emailNormalizado);

      if (!usuario) {
        return res.status(200).json({
          mensagem: 'Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.',
        });
      }

      const token = gerarTokenRecuperacao();
      await UsuarioModel.invalidarTokensPendentes(usuario.cod_usuario);
      await UsuarioModel.criarTokenRecuperacao(usuario.cod_usuario, token, UMA_HORA_MS);

      SendMail.redefinicaoSenha(usuario.email, usuario.nome, token).catch((erroEnvio) => {
        console.error('Falha ao enviar e-mail de redefinição de senha:', erroEnvio);
      });

      return res.status(200).json({
        mensagem: 'Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.',
      });
    } catch (error) {
      return next(error);
    }
  },

  async redefinirSenha(req: Request, res: Response, next: NextFunction) {
    const { token, novaSenha, senha } = req.body as { token?: string; novaSenha?: string; senha?: string };
    const tokenInformado = token?.trim();
    const novaSenhaInformada = (novaSenha ?? senha)?.trim();

    try {
      if (!tokenInformado) {
        return next(new HttpError(400, 'Token de redefinição é obrigatório.'));
      }

      if (!novaSenhaInformada) {
        return next(new HttpError(400, 'A nova senha é obrigatória.'));
      }

      const errosSenha = validarSenha(novaSenhaInformada);
      if (errosSenha.length > 0) {
        return next(new HttpError(400, `Senha inválida. ${errosSenha.join(' ')}`));
      }

      const tokenHash = hashTokenRecuperacao(tokenInformado);
      const tokenValido = await UsuarioModel.buscarTokenValidoPorHash(tokenHash);

      if (!tokenValido) {
        return next(new HttpError(400, 'Token de redefinição inválido ou expirado.'));
      }

      await UsuarioModel.atualizarSenha(tokenValido.cod_usuario, novaSenhaInformada);
      await UsuarioModel.marcarTokenUtilizado(tokenValido.cod_token);

      return res.status(200).json({ mensagem: 'Senha redefinida com sucesso.' });
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