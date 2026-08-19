import test from 'node:test';
import assert from 'node:assert/strict';

import { generateToken, verifyToken } from '../lib/auth.js';
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
