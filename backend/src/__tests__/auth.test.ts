import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

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

test('rejeita tokens expirados, malformados e assinados com outro segredo', () => {
  const segredo = process.env.JWT_SECRET!;
  const expirado = jwt.sign({ id: 42, email: 'aluno@luminasaber.com' }, segredo, { expiresIn: -1 });
  const outroSegredo = jwt.sign({ id: 42, email: 'aluno@luminasaber.com' }, `${segredo}-outro`);

  assert.equal(verifyToken(expirado), null);
  assert.equal(verifyToken('nao-e-um-jwt'), null);
  assert.equal(verifyToken(outroSegredo), null);
});

test('não gera token quando o segredo está ausente ou é curto', () => {
  const segredoOriginal = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    assert.throws(() => generateToken({ id: 1, email: 'aluno@example.com' }), /JWT_SECRET/);

    process.env.JWT_SECRET = 'curto';
    assert.throws(() => generateToken({ id: 1, email: 'aluno@example.com' }), /JWT_SECRET/);
  } finally {
    if (segredoOriginal === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = segredoOriginal;
  }
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

test('middleware rejeita token malformado sem autenticar a requisição', () => {
  const req = { headers: { authorization: 'Bearer token-invalido' } } as any;
  const res = {} as any;
  let capturedError: unknown = null;

  authMiddleware(req, res, (error?: unknown) => { capturedError = error; });

  assert.ok(capturedError instanceof HttpError);
  assert.equal((capturedError as HttpError).statusCode, 401);
  assert.equal(req.user, undefined);
});

test('valida critérios de senha no backend', () => {
  assert.deepEqual(validarSenha('Abcdef1!'), []);
  assert.deepEqual(validarSenha('abcdef1!'), ['A senha deve conter pelo menos uma letra maiúscula.']);
  assert.deepEqual(validarSenha('ABCDEF1!'), ['A senha deve conter pelo menos uma letra minúscula.']);
  assert.deepEqual(validarSenha('Abcdefgh!'), ['A senha deve conter pelo menos um número.']);
  assert.deepEqual(validarSenha('Abcdefg1'), ['A senha deve conter pelo menos um caractere especial.']);
  assert.deepEqual(validarSenha('Ab1!'), ['A senha deve ter pelo menos 8 caracteres.']);
});
