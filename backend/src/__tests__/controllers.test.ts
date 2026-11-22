import test from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/HttpError.js';
import { LojaController } from '../controllers/lojaController.js';
import { LojaModel } from '../models/lojaModel.js';

function contexto() {
  let statusCode: number | undefined;
  let body: unknown;
  let capturedError: unknown;
  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      body = payload;
      return this;
    },
  } as unknown as Response;
  const next = ((error?: unknown) => { capturedError = error; }) as NextFunction;
  return {
    req(user?: Request['user']) {
      return { user, body: { item: 'dica', tipo: 'dica', meta: 10, respondidas: 8 } } as unknown as Request;
    },
    res,
    next,
    statusCode: () => statusCode,
    body: () => body,
    error: () => capturedError,
  };
}

test('controller da loja bloqueia chamadas sem identidade e publica o catálogo', async () => {
  const routes = [
    LojaController.carteira,
    LojaController.inventario,
    LojaController.comprar,
    LojaController.usar,
    LojaController.sessaoConcluida,
  ];

  for (const route of routes) {
    const ctx = contexto();
    await route(ctx.req(), ctx.res, ctx.next);
    assert.ok(ctx.error() instanceof HttpError);
    assert.equal((ctx.error() as HttpError).statusCode, 401);
  }

  const ctx = contexto();
  await LojaController.listarItens(ctx.req(), ctx.res, ctx.next);
  assert.equal(ctx.statusCode(), 200);
  assert.ok(Array.isArray(ctx.body()));
  assert.ok((ctx.body() as unknown[]).length > 0);
});

test('controller converte falhas conhecidas de compra e encaminha falhas desconhecidas', async () => {
  const original = LojaModel.comprarItem;
  try {
    for (const [message, statusCode] of [
      ['SALDO_INSUFICIENTE', 400],
      ['ITEM_INVALIDO', 400],
      ['USUARIO_NAO_ENCONTRADO', 404],
    ] as const) {
      LojaModel.comprarItem = async () => { throw new Error(message); };
      const ctx = contexto();
      await LojaController.comprar(ctx.req({ id: 1, email: 'teste@example.com' }), ctx.res, ctx.next);
      assert.ok(ctx.error() instanceof HttpError);
      assert.equal((ctx.error() as HttpError).statusCode, statusCode);
    }

    const falhaInterna = new Error('falha de persistência');
    LojaModel.comprarItem = async () => { throw falhaInterna; };
    const ctx = contexto();
    await LojaController.comprar(ctx.req({ id: 1, email: 'teste@example.com' }), ctx.res, ctx.next);
    assert.equal(ctx.error(), falhaInterna);
  } finally {
    LojaModel.comprarItem = original;
  }
});

test('controller encaminha falhas de leitura, uso e recompensa', async () => {
  const originalSaldo = LojaModel.obterSaldo;
  const originalInventario = LojaModel.obterInventario;
  const originalUsar = LojaModel.usarBeneficio;
  const originalSessao = LojaModel.registrarSessaoConcluida;
  const falha = new Error('banco indisponível');
  const user = { id: 7, email: 'aluno@example.com' };

  try {
    LojaModel.obterSaldo = async () => { throw falha; };
    const saldo = contexto();
    await LojaController.carteira(saldo.req(user), saldo.res, saldo.next);
    assert.equal(saldo.error(), falha);

    LojaModel.obterInventario = async () => { throw falha; };
    const inventario = contexto();
    await LojaController.inventario(inventario.req(user), inventario.res, inventario.next);
    assert.equal(inventario.error(), falha);

    LojaModel.usarBeneficio = async () => { throw new Error('BENEFICIO_INDISPONIVEL'); };
    const indisponivel = contexto();
    await LojaController.usar(indisponivel.req(user), indisponivel.res, indisponivel.next);
    assert.ok(indisponivel.error() instanceof HttpError);
    assert.equal((indisponivel.error() as HttpError).statusCode, 400);

    LojaModel.usarBeneficio = async () => { throw falha; };
    const falhaUso = contexto();
    await LojaController.usar(falhaUso.req(user), falhaUso.res, falhaUso.next);
    assert.equal(falhaUso.error(), falha);

    LojaModel.registrarSessaoConcluida = async () => { throw falha; };
    const sessao = contexto();
    await LojaController.sessaoConcluida(sessao.req(user), sessao.res, sessao.next);
    assert.equal(sessao.error(), falha);
  } finally {
    LojaModel.obterSaldo = originalSaldo;
    LojaModel.obterInventario = originalInventario;
    LojaModel.usarBeneficio = originalUsar;
    LojaModel.registrarSessaoConcluida = originalSessao;
  }
});
