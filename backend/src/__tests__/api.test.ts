import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../../app.js';
import { prisma } from '../lib/prisma.js';
import { generateToken } from '../lib/auth.js';

let ownerId: number;
let otherId: number;
let ownerToken: string;
let otherToken: string;

before(async () => {
  const owner = await prisma.usuario.create({
    data: {
      nome: 'Usuário Teste',
      email: 'owner@luminasaber.test',
      senha: 'hash-nao-usado',
      grau_escolar: '3º ano',
      data_nasc: new Date('2000-01-01'),
      tipo: 'aluno',
    },
  });
  const other = await prisma.usuario.create({
    data: {
      nome: 'Outro Usuário',
      email: 'other@luminasaber.test',
      senha: 'hash-nao-usado',
      grau_escolar: '2º ano',
      data_nasc: new Date('2001-01-01'),
      tipo: 'aluno',
    },
  });

  ownerId = owner.cod_usuario;
  otherId = other.cod_usuario;
  ownerToken = generateToken({ id: ownerId, email: owner.email, tipo: owner.tipo });
  otherToken = generateToken({ id: otherId, email: other.email, tipo: other.tipo });
});

after(async () => {
  await prisma.$disconnect();
});

test('rotas de pastas suportam CRUD e impedem acesso entre usuários', async () => {
  const semAutenticacao = await request(app).get('/api/pastas');
  assert.equal(semAutenticacao.status, 401);

  const corpoInvalido = await request(app)
    .post('/api/pastas')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ nome_pasta: ' ' });
  assert.equal(corpoInvalido.status, 400);

  const criada = await request(app)
    .post('/api/pastas')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ nome_pasta: 'Minha pasta' });
  assert.equal(criada.status, 201);
  const pastaId = criada.body.pasta.cod_pasta as number;
  assert.equal(criada.body.pasta.nome_pasta, 'Minha pasta');

  const listagemDoDono = await request(app)
    .get('/api/pastas')
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(listagemDoDono.status, 200);
  assert.ok(listagemDoDono.body.some((pasta: { cod_pasta: number }) => pasta.cod_pasta === pastaId));

  const listagemDeOutro = await request(app)
    .get('/api/pastas')
    .set('Authorization', `Bearer ${otherToken}`);
  assert.equal(listagemDeOutro.status, 200);
  assert.ok(!listagemDeOutro.body.some((pasta: { cod_pasta: number }) => pasta.cod_pasta === pastaId));

  const idInvalido = await request(app)
    .put('/api/pastas/abc')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ nome_pasta: 'Inválida' });
  assert.equal(idInvalido.status, 400);

  const tentativaDeOutro = await request(app)
    .put(`/api/pastas/${pastaId}`)
    .set('Authorization', `Bearer ${otherToken}`)
    .send({ nome_pasta: 'Alteração indevida' });
  assert.equal(tentativaDeOutro.status, 404);

  const atualizada = await request(app)
    .put(`/api/pastas/${pastaId}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ nome_pasta: 'Pasta atualizada' });
  assert.equal(atualizada.status, 200);

  const excluidaPorOutro = await request(app)
    .delete(`/api/pastas/${pastaId}`)
    .set('Authorization', `Bearer ${otherToken}`);
  assert.equal(excluidaPorOutro.status, 404);

  const excluida = await request(app)
    .delete(`/api/pastas/${pastaId}`)
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(excluida.status, 200);

  const inexistente = await request(app)
    .delete(`/api/pastas/${pastaId}`)
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(inexistente.status, 404);
});

test('rotas de anotações suportam CRUD, erros HTTP e isolamento por usuário', async () => {
  const semToken = await request(app).post('/api/anotacoes').send({ titulo: 'A', texto_anota: 'B' });
  assert.equal(semToken.status, 401);

  const invalida = await request(app)
    .post('/api/anotacoes')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ titulo: ' ', texto_anota: 'Conteúdo' });
  assert.equal(invalida.status, 400);

  const pastaDoDono = await prisma.pasta.create({
    data: { cod_usuario: ownerId, nome_pasta: 'Anotações', data_criacao: new Date() },
  });
  const pastaDeOutro = await prisma.pasta.create({
    data: { cod_usuario: otherId, nome_pasta: 'Privada', data_criacao: new Date() },
  });

  const pastaAlheia = await request(app)
    .post('/api/anotacoes')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ titulo: 'Teste', texto_anota: 'Conteúdo', cod_pasta: pastaDeOutro.cod_pasta });
  assert.equal(pastaAlheia.status, 404);

  const criada = await request(app)
    .post('/api/anotacoes')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ titulo: 'Revisão', texto_anota: 'Conteúdo importante', cod_pasta: pastaDoDono.cod_pasta });
  assert.equal(criada.status, 201);
  const anotacaoId = criada.body.id as number;

  const listagemDoDono = await request(app)
    .get('/api/anotacoes')
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(listagemDoDono.status, 200);
  assert.ok(listagemDoDono.body.some((anotacao: { cod_anota: number }) => anotacao.cod_anota === anotacaoId));

  const listagemDeOutro = await request(app)
    .get('/api/anotacoes')
    .set('Authorization', `Bearer ${otherToken}`);
  assert.equal(listagemDeOutro.status, 200);
  assert.ok(!listagemDeOutro.body.some((anotacao: { cod_anota: number }) => anotacao.cod_anota === anotacaoId));

  const atualizarAlheia = await request(app)
    .put(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${otherToken}`)
    .send({ titulo: 'Não autorizado' });
  assert.equal(atualizarAlheia.status, 404);

  const atualizarVazia = await request(app)
    .put(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({});
  assert.equal(atualizarVazia.status, 400);

  const atualizada = await request(app)
    .put(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ titulo: 'Revisão atualizada' });
  assert.equal(atualizada.status, 200);

  const moverParaPastaAlheia = await request(app)
    .put(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_pasta: pastaDeOutro.cod_pasta });
  assert.equal(moverParaPastaAlheia.status, 404);

  const excluirAlheia = await request(app)
    .delete(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${otherToken}`);
  assert.equal(excluirAlheia.status, 404);

  const excluida = await request(app)
    .delete(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(excluida.status, 200);

  const excluirInexistente = await request(app)
    .delete(`/api/anotacoes/${anotacaoId}`)
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(excluirInexistente.status, 404);
});

test('cadastro diferencia criação válida de e-mail duplicado sem enviar e-mail real', async () => {
  const body = {
    nome: 'Conta de Teste',
    email: 'signup@luminasaber.test',
    senha: 'Abcdef1!',
    grau_escolar: '1º ano',
    data_nasc: '2000-01-01',
  };

  const criado = await request(app).post('/api/usuarios').send(body);
  assert.equal(criado.status, 201);

  const duplicado = await request(app).post('/api/usuarios').send(body);
  assert.equal(duplicado.status, 409);
});
