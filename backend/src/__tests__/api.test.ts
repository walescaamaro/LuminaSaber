import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import request from 'supertest';

import app from '../../app.js';
import { prisma } from '../lib/prisma.js';
import { generateToken } from '../lib/auth.js';
import { hashTokenRecuperacao } from '../lib/password.js';
import { UPLOADS_DIRECTORY } from '../lib/uploadPaths.js';

let ownerId: number;
let otherId: number;
let ownerToken: string;
let otherToken: string;
let adminToken: string;
let disciplineId: number;
const imagensTemporarias: string[] = [];

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
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador Teste',
      email: 'admin@luminasaber.test',
      senha: 'hash-nao-usado',
      data_nasc: new Date('1980-01-01'),
      tipo: 'administrador',
    },
  });
  const disciplina = await prisma.disciplina.create({ data: { nome_disc: 'Matemática de Teste' } });

  ownerId = owner.cod_usuario;
  otherId = other.cod_usuario;
  disciplineId = disciplina.cod_disc;
  ownerToken = generateToken({ id: ownerId, email: owner.email, tipo: owner.tipo });
  otherToken = generateToken({ id: otherId, email: other.email, tipo: other.tipo });
  adminToken = generateToken({ id: admin.cod_usuario, email: admin.email, tipo: admin.tipo });
});

after(async () => {
  for (const imagem of imagensTemporarias) {
    if (existsSync(imagem)) unlinkSync(imagem);
  }
  await prisma.$disconnect();
});

function payloadQuestao(enunciado: string) {
  return {
    cod_disc: disciplineId,
    enunciado,
    alternativa_A: 'Resposta A',
    alternativa_B: 'Resposta B',
    alternativa_C: 'Resposta C',
    alternativa_D: 'Resposta D',
    alternativa_correta: 'b',
    dificuldade: 'médio',
  };
}

test('SUCESSO + ERRO: rotas de pastas fazem CRUD e impedem acesso entre usuários', async () => {
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

test('SUCESSO + ERRO: rotas de anotações fazem CRUD e isolam usuários', async () => {
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

test('SUCESSO + ERRO: cadastro aceita conta nova e rejeita e-mail duplicado sem enviar e-mail real', async () => {
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

  const login = await request(app).post('/api/usuarios/login').send({ email: ' SIGNUP@LUMINASABER.TEST ', senha: body.senha });
  assert.equal(login.status, 200);
  assert.equal(login.body.usuario.email, body.email);
  assert.equal(typeof login.body.token, 'string');

  const senhaIncorreta = await request(app).post('/api/usuarios/login').send({ email: body.email, senha: 'SenhaErrada1!' });
  assert.equal(senhaIncorreta.status, 401);
  assert.equal(senhaIncorreta.body.error, 'Senha incorreta.');

  const perfil = await request(app)
    .get('/api/usuarios/perfil')
    .set('Authorization', `Bearer ${login.body.token}`);
  assert.equal(perfil.status, 200);
  assert.equal(perfil.body.usuario.email, body.email);
  assert.equal(perfil.body.usuario.imageUrl, null);

  const logout = await request(app)
    .post('/api/usuarios/logout')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${login.body.token}`);
  assert.equal(logout.status, 200);
  assert.match(logout.headers['set-cookie'][0], /token=;/);

  assert.equal((await request(app).get('/api/usuarios')).status, 401);
  const listaProibida = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(listaProibida.status, 403);
  const listaAdmin = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${adminToken}`);
  assert.equal(listaAdmin.status, 200);
  assert.ok(listaAdmin.body.some((usuario: { email: string }) => usuario.email === body.email));
  assert.ok(listaAdmin.body.every((usuario: { senha?: string }) => usuario.senha === undefined));
});

test('SUCESSO + ERRO: loja protege operações e valida saldo e itens', async () => {
  const semAutenticacao = await request(app).get('/api/loja/itens');
  assert.equal(semAutenticacao.status, 401);

  const catalogo = await request(app)
    .get('/api/loja/itens')
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(catalogo.status, 200);
  assert.ok(catalogo.body.some((item: { id: string; custo: number }) => item.id === 'dica' && item.custo === 30));

  const saldo = await request(app)
    .get('/api/loja/carteira')
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(saldo.status, 200);
  assert.equal(saldo.body.estrelas, 0);

  const compraSemSaldo = await request(app)
    .post('/api/loja/comprar')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ item: 'dica' });
  assert.equal(compraSemSaldo.status, 400);
  assert.equal(compraSemSaldo.body.error, 'Estrelas insuficientes para essa compra.');

  const itemInexistente = await request(app)
    .post('/api/loja/comprar')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ item: 'nao-existe' });
  assert.equal(itemInexistente.status, 400);

  const beneficioIndisponivel = await request(app)
    .post('/api/loja/usar')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ tipo: 'chance_extra' });
  assert.equal(beneficioIndisponivel.status, 400);

  await prisma.usuario.update({ where: { cod_usuario: ownerId }, data: { estrelas: 60 } });
  const compra = await request(app)
    .post('/api/loja/comprar')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ item: 'dica' });
  assert.equal(compra.status, 200);
  assert.equal(compra.body.estrelas, 30);
  assert.equal(compra.body.inventario.dica, 2);

  const uso = await request(app)
    .post('/api/loja/usar')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ tipo: 'dica' });
  assert.equal(uso.status, 200);
  assert.equal(uso.body.inventario.dica, 1);

  const recompensaSessao = await request(app)
    .post('/api/loja/sessao-concluida')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ meta: 10, respondidas: 7 });
  assert.equal(recompensaSessao.status, 200);
  assert.equal(recompensaSessao.body.estrelasGanhas, 5);
  assert.equal(recompensaSessao.body.estrelas, 35);

  const saldoDeOutro = await request(app)
    .get('/api/loja/carteira')
    .set('Authorization', `Bearer ${otherToken}`);
  assert.equal(saldoDeOutro.body.estrelas, 0);
});

test('SUCESSO + ERRO: recuperação de senha responde sem revelar se o e-mail existe', async () => {
  const existente = await request(app)
    .post('/api/usuarios/solicitar-redefinicao-senha')
    .send({ email: 'owner@luminasaber.test' });
  const inexistente = await request(app)
    .post('/api/usuarios/solicitar-redefinicao-senha')
    .send({ email: 'inexistente@luminasaber.test' });

  assert.equal(existente.status, 200);
  assert.deepEqual(existente.body, inexistente.body);
  assert.match(existente.body.mensagem, /Se este e-mail estiver cadastrado/);

  const token = 'token-de-reset-controlado-pelo-teste';
  const reset = await prisma.passwordResetToken.create({
    data: {
      cod_usuario: ownerId,
      token_hash: hashTokenRecuperacao(token),
      expires_at: new Date(Date.now() + 60_000),
    },
  });
  assert.ok(reset.cod_token > 0);

  const redefinida = await request(app)
    .post('/api/usuarios/redefinir-senha')
    .send({ token, novaSenha: 'NovaSenha123!' });
  assert.equal(redefinida.status, 200);
  assert.match(redefinida.body.mensagem, /redefinida com sucesso/);

  const reutilizado = await request(app)
    .post('/api/usuarios/redefinir-senha')
    .send({ token, novaSenha: 'OutraSenha123!' });
  assert.equal(reutilizado.status, 400);
  assert.match(reutilizado.body.error, /inválido ou expirado/);
});

test('SUCESSO + ERRO: questões permitem leitura e protegem CRUD de administrador', async () => {
  const leituraPublica = await request(app).get('/api/questoes');
  assert.equal(leituraPublica.status, 200);
  assert.deepEqual(leituraPublica.body, []);

  const semAdmin = await request(app).post('/api/questoes').send(payloadQuestao('Questão sem autorização'));
  assert.equal(semAdmin.status, 401);

  const alunoSemPermissao = await request(app)
    .post('/api/questoes')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send(payloadQuestao('Questão de aluno'));
  assert.equal(alunoSemPermissao.status, 403);

  const disciplinaFiltro = await request(app).get(`/api/questoes?cod_disc=${disciplineId}&dificuldade=médio`);
  assert.equal(disciplinaFiltro.status, 200);
  assert.deepEqual(disciplinaFiltro.body, []);

  const filtroInvalido = await request(app).get('/api/questoes?dificuldade=impossível');
  assert.equal(filtroInvalido.status, 400);

  const body = payloadQuestao('Quanto é 6 vezes 7?');
  const criada = await request(app)
    .post('/api/questoes')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body);
  assert.equal(criada.status, 201);
  const questaoId = criada.body.id as number;
  assert.ok(questaoId > 0);

  const duplicada = await request(app)
    .post('/api/questoes')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body);
  assert.equal(duplicada.status, 409);
  assert.equal(duplicada.body.error, 'Esta questão já está cadastrada.');

  const listagem = await request(app).get(`/api/questoes?cod_disc=${disciplineId}`);
  assert.equal(listagem.status, 200);
  assert.deepEqual(listagem.body[0], {
    id: questaoId,
    materia: 'Matemática de Teste',
    nivel: 'médio',
    enunciado: body.enunciado,
    alternativas: [body.alternativa_A, body.alternativa_B, body.alternativa_C, body.alternativa_D],
    correta: 1,
  });

  const consulta = await request(app).get(`/api/questoes/${questaoId}`);
  assert.equal(consulta.status, 200);
  assert.equal(consulta.body.correta, 1);
  assert.equal((await request(app).get('/api/questoes/abc')).status, 400);
  assert.equal((await request(app).get('/api/questoes/99999')).status, 404);

  const atualizada = await request(app)
    .put(`/api/questoes/${questaoId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ alternativa_correta: 'd' });
  assert.equal(atualizada.status, 200);
  assert.equal((await request(app).get(`/api/questoes/${questaoId}`)).body.correta, 3);

  const atualizacaoVazia = await request(app)
    .put(`/api/questoes/${questaoId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({});
  assert.equal(atualizacaoVazia.status, 400);

  const exclusao = await request(app)
    .delete(`/api/questoes/${questaoId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(exclusao.status, 200);
  const excluirInexistente = await request(app)
    .delete(`/api/questoes/${questaoId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(excluirInexistente.status, 404);
});

test('SUCESSO + ERRO: histórico registra respostas, recompensa correções e isola usuário/questão', async () => {
  const criada = await prisma.questao.create({
    data: payloadQuestao('Quanto é 8 vezes 8?'),
  });

  const registrarSemToken = await request(app).post('/api/historico').send({ cod_quest: criada.cod_quest, alternativa: 'a' });
  assert.equal(registrarSemToken.status, 401);

  const alternativaInvalida = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: criada.cod_quest, alternativa: 'z' });
  assert.equal(alternativaInvalida.status, 400);

  const erro = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: criada.cod_quest, alternativa: 'a' });
  assert.equal(erro.status, 201);
  assert.equal(erro.body.status, 'Errou');
  assert.equal(erro.body.estrelasGanhas, 0);

  const acerto = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: criada.cod_quest, alternativa: 'B' });
  assert.equal(acerto.status, 201);
  assert.equal(acerto.body.status, 'Acertou');
  assert.equal(acerto.body.estrelasGanhas, 5);

  const acertoRepetido = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: criada.cod_quest, alternativa: 'b' });
  assert.equal(acertoRepetido.body.estrelasGanhas, 5);

  // A recompensa permanece disponível após acertos posteriores, mas só para
  // a mesma questão e o mesmo usuário que já registrou um erro.
  const questaoB = await prisma.questao.create({ data: payloadQuestao('Questão B sem erro anterior') });
  const acertoQuestaoB = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: questaoB.cod_quest, alternativa: 'b' });
  assert.equal(acertoQuestaoB.body.estrelasGanhas, 0);
  const segundoAcertoQuestaoB = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: questaoB.cod_quest, alternativa: 'b' });
  assert.equal(segundoAcertoQuestaoB.body.estrelasGanhas, 0);

  const outroUsuarioNaQuestaoA = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${otherToken}`)
    .send({ cod_quest: criada.cod_quest, alternativa: 'b' });
  assert.equal(outroUsuarioNaQuestaoA.body.status, 'Acertou');
  assert.equal(outroUsuarioNaQuestaoA.body.estrelasGanhas, 0);

  const historicoProprio = await request(app)
    .get('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(historicoProprio.status, 200);
  assert.equal(historicoProprio.body.length, 5);
  assert.equal(historicoProprio.body[0].questao.materia, 'Matemática de Teste');

  const historicoOutro = await request(app)
    .get('/api/historico')
    .set('Authorization', `Bearer ${otherToken}`);
  assert.equal(historicoOutro.body.length, 1);
  assert.equal(historicoOutro.body[0].questao.cod_quest, criada.cod_quest);
  assert.equal(historicoOutro.body[0].status, 'Acertou');

  const adminSemPermissao = await request(app)
    .get(`/api/admin/usuarios/${ownerId}/historico`)
    .set('Authorization', `Bearer ${ownerToken}`);
  assert.equal(adminSemPermissao.status, 403);

  const historicoAdmin = await request(app)
    .get(`/api/admin/usuarios/${ownerId}/historico`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(historicoAdmin.status, 200);
  assert.equal(historicoAdmin.body.length, 5);
  assert.equal((await request(app).get('/api/admin/usuarios/abc/historico').set('Authorization', `Bearer ${adminToken}`)).status, 400);

  const questaoInexistente = await request(app)
    .post('/api/historico')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ cod_quest: 99999, alternativa: 'a' });
  assert.equal(questaoInexistente.status, 404);
});

test('SUCESSO + ERRO: upload valida arquivos e substitui imagem do perfil', async () => {
  const auth = { Authorization: `Bearer ${ownerToken}` };
  const pastaValida = path.resolve('test-files/valido.png');
  const pastaGif = path.resolve('test-files/segundo.gif');
  const pastaFalsa = path.resolve('test-files/falso.png');
  const pastaTexto = path.resolve('test-files/documento.txt');
  const pastaGrande = path.resolve('test-files/grande.png');

  const semArquivo = await request(app)
    .post('/api/users/image')
    .set(auth)
    .field('metadado', 'teste');
  assert.equal(semArquivo.status, 400);
  assert.match(semArquivo.body.error, /Envie um arquivo/);

  const tipoNaoPermitido = await request(app)
    .post('/api/users/image')
    .set(auth)
    .attach('image', pastaTexto, { contentType: 'text/plain' });
  assert.equal(tipoNaoPermitido.status, 400);
  assert.match(tipoNaoPermitido.body.error, /Tipo de arquivo não permitido/);

  const assinaturaFalsa = await request(app)
    .post('/api/users/image')
    .set(auth)
    .attach('image', pastaFalsa, { contentType: 'image/png' });
  assert.equal(assinaturaFalsa.status, 400);
  assert.match(assinaturaFalsa.body.error, /conteúdo do arquivo não corresponde/);

  const grandeDemais = await request(app)
    .post('/api/users/image')
    .set(auth)
    .attach('image', pastaGrande, { contentType: 'image/png' });
  assert.equal(grandeDemais.status, 400);
  assert.match(grandeDemais.body.error, /excede o limite de 2 MB/);

  let caminhoAtual: string | undefined;
  try {
    const primeira = await request(app)
      .post('/api/users/image')
      .set(auth)
      .attach('image', pastaValida, { contentType: 'image/png' });
    assert.equal(primeira.status, 201);
    assert.match(primeira.body.imageUrl, /^\/uploads\/[0-9a-f-]+\.png$/);

    const caminhoAnterior = path.join(UPLOADS_DIRECTORY, path.basename(primeira.body.imageUrl));
    imagensTemporarias.push(caminhoAnterior);
    caminhoAtual = caminhoAnterior;
    assert.equal(existsSync(caminhoAnterior), true);

    const segunda = await request(app)
      .put('/api/users/image')
      .set(auth)
      .attach('image', pastaGif, { contentType: 'image/gif' });
    assert.equal(segunda.status, 200);
    assert.match(segunda.body.imageUrl, /^\/uploads\/[0-9a-f-]+\.gif$/);
    assert.equal(existsSync(caminhoAnterior), false);

    const caminhoNovo = path.join(UPLOADS_DIRECTORY, path.basename(segunda.body.imageUrl));
    imagensTemporarias.push(caminhoNovo);
    caminhoAtual = caminhoNovo;
    assert.equal(existsSync(caminhoNovo), true);

    const perfil = await request(app).get('/api/usuarios/perfil').set('Authorization', `Bearer ${ownerToken}`);
    assert.equal(perfil.body.usuario.imageUrl, segunda.body.imageUrl);
  } finally {
    if (caminhoAtual && existsSync(caminhoAtual)) unlinkSync(caminhoAtual);
  }
});

test('SUCESSO + ERRO: páginas privadas e administrativas respeitam autenticação e permissão', async () => {
  const anonimo = await request(app).get('/painel');
  assert.equal(anonimo.status, 302);
  assert.equal(anonimo.headers.location, '/login');

  const painelAutenticado = await request(app)
    .get('/painel')
    .set('Cookie', `token=${ownerToken}`);
  assert.equal(painelAutenticado.status, 200);
  assert.match(painelAutenticado.headers['cache-control'], /no-store/);

  const adminNegado = await request(app)
    .get('/admin')
    .set('Cookie', `token=${ownerToken}`);
  assert.equal(adminNegado.status, 302);
  assert.equal(adminNegado.headers.location, '/painel');

  const adminPermitido = await request(app)
    .get('/admin')
    .set('Cookie', `token=${adminToken}`);
  assert.equal(adminPermitido.status, 200);
  assert.match(adminPermitido.headers['cache-control'], /private/);

  const htmlDiretoNegado = await request(app)
    .get('/admin.html')
    .set('Cookie', `token=${ownerToken}`);
  assert.equal(htmlDiretoNegado.status, 302);
  assert.equal(htmlDiretoNegado.headers.location, '/painel');

  const htmlDiretoAdmin = await request(app)
    .get('/admin.html')
    .set('Cookie', `token=${adminToken}`);
  assert.equal(htmlDiretoAdmin.status, 200);
  assert.match(htmlDiretoAdmin.headers['cache-control'], /no-store/);

  const htmlPublico = await request(app).get('/cadastro.html');
  assert.equal(htmlPublico.status, 200);
});

test('SUCESSO + ERRO: análise valida prompt e usa Groq quando Gemini falha', async () => {
  const chaveGeminiOriginal = process.env.GEMINI_API_KEY;
  const chaveGroqOriginal = process.env.GROQ_API_KEY;
  const fetchOriginal = globalThis.fetch;
  const consoleErrorOriginal = console.error;

  process.env.GEMINI_API_KEY = 'gemini-test-key';
  process.env.GROQ_API_KEY = 'groq-test-key';
  try {
    const semPrompt = await request(app).post('/api/ai/analyze').send({});
    assert.equal(semPrompt.status, 400);

    let chamadas = 0;
    globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
      chamadas += 1;
      assert.match(String(input), /generativelanguage\.googleapis\.com/);
      assert.equal(init?.method, 'POST');
      return {
        ok: true,
        json: async () => ({ candidates: [{ content: { parts: [{ text: 'Resposta Gemini' }] } }] }),
      } as Response;
    }) as typeof fetch;

    const respostaGemini = await request(app)
      .post('/api/ai/analyze')
      .send({ prompt: 'Explique fotossíntese.' });
    assert.equal(respostaGemini.status, 200);
    assert.equal(respostaGemini.body._fonte, 'gemini');
    assert.equal(respostaGemini.body.candidates[0].content.parts[0].text, 'Resposta Gemini');
    assert.equal(chamadas, 1);

    chamadas = 0;
    globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
      chamadas += 1;
      if (String(input).includes('generativelanguage')) {
        return { ok: false, status: 503, text: async () => 'Gemini indisponível' } as Response;
      }
      assert.match(String(input), /api\.groq\.com/);
      assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer groq-test-key');
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'Resposta Groq' } }] }),
      } as Response;
    }) as typeof fetch;

    const respostaGroq = await request(app)
      .post('/api/ai/analyze')
      .send({ prompt: 'Explique gravidade.' });
    assert.equal(respostaGroq.status, 200);
    assert.equal(respostaGroq.body._fonte, 'groq');
    assert.equal(respostaGroq.body.candidates[0].content.parts[0].text, 'Resposta Groq');
    assert.equal(chamadas, 2);

    delete process.env.GEMINI_API_KEY;
    delete process.env.GROQ_API_KEY;
    console.error = () => {};
    const semProvedores = await request(app)
      .post('/api/ai/analyze')
      .send({ prompt: 'Teste sem credenciais.' });
    assert.equal(semProvedores.status, 500);
    assert.equal(semProvedores.body.error, 'Erro interno do servidor.');
  } finally {
    globalThis.fetch = fetchOriginal;
    console.error = consoleErrorOriginal;
    if (chaveGeminiOriginal === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = chaveGeminiOriginal;
    if (chaveGroqOriginal === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = chaveGroqOriginal;
  }
});
