import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

import { HttpError } from '../errors/HttpError.js';
import { validate } from '../middlewares/validate.js';

test('middleware de validação rejeita body inválido com issues do Zod', () => {
  const schema = z.object({
    body: z.object({
      nome: z.string().min(2),
      idade: z.number().positive(),
    }),
  });

  const req = {
    body: { nome: 'A', idade: -1 },
    query: {},
    params: {},
  } as any;

  assert.throws(
    () => validate(schema)(req, {} as any, () => {}),
    (error: unknown) => {
      assert.ok(error instanceof HttpError);
      assert.equal((error as HttpError).statusCode, 400);
      assert.ok(Array.isArray((error as HttpError).issues));
      return true;
    },
  );
});

test('middleware avança quando dados válidos chegam ao handler', () => {
  const schema = z.object({
    body: z.object({
      nome: z.string().min(2),
      idade: z.number().positive(),
    }),
  });

  const req = {
    body: { nome: 'Ana', idade: 20 },
    query: {},
    params: {},
  } as any;

  let nextCalled = false;
  validate(schema)(req, {} as any, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
