import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET ??= '12345678901234567890123456789012';

import { generateToken, verifyToken } from '../lib/auth.js';
import { validarSenha } from '../lib/password.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { HttpError } from '../errors/HttpError.js';

test('gera e valida token JWT com payload do usuário', () => {
  const token = generateToken({ id: 42, email: 'aluno@luminasaber.com' });
  const payload = verifyToken(token);

  assert.equal(payload?.id, 42);
  assert.equal(payload?.email, 'aluno@luminasaber.com');
});

test('middleware bloqueia acesso sem token de autenticação', () => {
  const req = { headers: {} } as any;
  const res = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  } as any;

  let capturedError: unknown = null;
  const next = (error?: unknown) => {
    capturedError = error;
  };

  authMiddleware(req, res, next);

  assert.ok(capturedError instanceof HttpError);
  assert.equal((capturedError as HttpError).statusCode, 401);
});

test('valida critérios de senha no backend', () => {
  assert.deepEqual(validarSenha('Abcdef1!'), []);
  assert.deepEqual(validarSenha('abcdef1!'), ['A senha deve conter pelo menos uma letra maiúscula.']);
  assert.deepEqual(validarSenha('ABCDEF1!'), ['A senha deve conter pelo menos uma letra minúscula.']);
  assert.deepEqual(validarSenha('Abcdefgh!'), ['A senha deve conter pelo menos um número.']);
  assert.deepEqual(validarSenha('Abcdefg1'), ['A senha deve conter pelo menos um caractere especial.']);
  assert.deepEqual(validarSenha('Ab1!'), ['A senha deve ter pelo menos 8 caracteres.']);
});
