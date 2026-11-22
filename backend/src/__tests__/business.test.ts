import test from 'node:test';
import assert from 'node:assert/strict';

import { calcularEstrelasPorConclusaoDeSessao, ITENS_LOJA } from '../constants/loja.js';
import { gerarTokenRecuperacao, hashTokenRecuperacao, senhaAtendeCritérios, validarSenha } from '../lib/password.js';
import { criarAnotacaoSchema, atualizarAnotacaoSchema, excluirAnotacaoSchema } from '../schemas/anotacao.schema.js';
import { comprarItemSchema, sessaoConcluidaSchema } from '../schemas/loja.schema.js';
import { criarPastaSchema, atualizarPastaSchema, excluirPastaSchema } from '../schemas/pasta.schema.js';
import { criarQuestaoSchema, listarQuestoesSchema } from '../schemas/questao.schema.js';
import { criarUsuarioSchema, redefinirSenhaSchema } from '../schemas/usuario.schema.js';

test('schemas de anotação aceitam dados válidos e normalizam campos', () => {
  const parsed = criarAnotacaoSchema.parse({
    body: { titulo: '  Resumo  ', texto_anota: '  Conteúdo  ', cod_pasta: '12' },
  });

  assert.deepEqual(parsed.body, { titulo: 'Resumo', texto_anota: 'Conteúdo', cod_pasta: 12 });
  assert.equal(atualizarAnotacaoSchema.safeParse({ params: { id: '12' }, body: { titulo: 'Novo' } }).success, true);
  assert.equal(excluirAnotacaoSchema.safeParse({ params: { id: 1 } }).success, true);
});

test('schemas de anotação rejeitam campos vazios, ids inválidos e atualização vazia', () => {
  assert.equal(criarAnotacaoSchema.safeParse({ body: { titulo: ' ', texto_anota: 'Texto' } }).success, false);
  assert.equal(criarAnotacaoSchema.safeParse({ body: { titulo: 'Título', texto_anota: 'Texto', cod_pasta: 0 } }).success, false);
  assert.equal(atualizarAnotacaoSchema.safeParse({ params: { id: 'abc' }, body: { titulo: 'Novo' } }).success, false);
  assert.equal(atualizarAnotacaoSchema.safeParse({ params: { id: 1 }, body: {} }).success, false);
  assert.equal(excluirAnotacaoSchema.safeParse({ params: { id: '-2' } }).success, false);
  assert.equal(criarAnotacaoSchema.safeParse({ body: null }).success, false);
  assert.equal(criarAnotacaoSchema.safeParse({ body: { titulo: 12, texto_anota: [] } }).success, false);
  assert.equal(criarAnotacaoSchema.safeParse({ body: { titulo: 'x'.repeat(201), texto_anota: 'Texto' } }).success, false);
});

test('schemas de pasta validam limites e identificadores', () => {
  assert.equal(criarPastaSchema.safeParse({ body: { nome_pasta: ' Estudos ' } }).success, true);
  assert.equal(criarPastaSchema.safeParse({ body: { nome_pasta: ' ' } }).success, false);
  assert.equal(criarPastaSchema.safeParse({ body: { nome_pasta: 'x'.repeat(61) } }).success, false);
  assert.equal(atualizarPastaSchema.safeParse({ params: { id: '2' }, body: { nome_pasta: 'Nova' } }).success, true);
  assert.equal(excluirPastaSchema.safeParse({ params: { id: '0' } }).success, false);
  assert.equal(criarPastaSchema.safeParse({ body: {} }).success, false);
  assert.equal(criarPastaSchema.safeParse({ body: { nome_pasta: null } }).success, false);
});

test('schema de usuário valida datas reais do calendário, data futura e senha', () => {
  const usuarioValido = {
    nome: 'Ana Silva',
    email: 'ana@example.com',
    senha: 'Abcdef1!',
    grau_escolar: '2º ano',
    data_nasc: '2000-02-29',
  };

  assert.equal(criarUsuarioSchema.safeParse({ body: usuarioValido }).success, true);
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, email: 'inválido' } }).success, false);
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, data_nasc: 'não-é-data' } }).success, false);
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, data_nasc: '2001-02-28' } }).success, true);
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, data_nasc: '2000-02-29' } }).success, true);
  for (const dataInvalida of ['2001-02-29', '2000-02-30', '2000-00-10', '2000-13-10', '2000-01-00', '2000-01-32', '']) {
    assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, data_nasc: dataInvalida } }).success, false, dataInvalida);
  }
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, data_nasc: undefined } }).success, false);
  assert.equal(criarUsuarioSchema.safeParse({
    body: { ...usuarioValido, data_nasc: '2999-01-01' },
  }).success, false);
  assert.equal(redefinirSenhaSchema.safeParse({ body: { token: 't', novaSenha: 'fraca' } }).success, false);
  assert.equal(criarUsuarioSchema.safeParse({ body: null }).success, false);
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, nome: 'x' } }).success, false);
  assert.equal(criarUsuarioSchema.safeParse({ body: { ...usuarioValido, senha: null } }).success, false);
});

test('schemas de questões e loja validam enums e valores de fronteira', () => {
  const questao = {
    cod_disc: '1',
    enunciado: 'Enunciado',
    alternativa_A: 'A',
    alternativa_B: 'B',
    alternativa_C: 'C',
    alternativa_D: 'D',
    alternativa_correta: 'a',
    dificuldade: 'fácil',
  };

  assert.equal(criarQuestaoSchema.safeParse({ body: questao }).success, true);
  assert.equal(criarQuestaoSchema.safeParse({ body: { ...questao, alternativa_correta: 'z' } }).success, false);
  assert.equal(listarQuestoesSchema.safeParse({ query: { cod_disc: '2', dificuldade: 'difícil' } }).success, true);
  assert.equal(listarQuestoesSchema.safeParse({ query: { dificuldade: 'muito difícil' } }).success, false);
  assert.equal(comprarItemSchema.safeParse({ body: { item: 'dica' } }).success, true);
  assert.equal(comprarItemSchema.safeParse({ body: { item: 'inexistente' } }).success, false);
  assert.equal(sessaoConcluidaSchema.safeParse({ body: { meta: 0, respondidas: 0 } }).success, true);
  assert.equal(sessaoConcluidaSchema.safeParse({ body: { meta: -1, respondidas: 0 } }).success, false);
});

test('regras de senha e tokens de recuperação cobrem formatos e consistência', () => {
  assert.deepEqual(validarSenha('Abcdef1!'), []);
  assert.equal(senhaAtendeCritérios('Abcdef1!'), true);
  assert.equal(senhaAtendeCritérios('abcdef1!'), false);

  const token = gerarTokenRecuperacao();
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(hashTokenRecuperacao(token), hashTokenRecuperacao(token));
  assert.match(hashTokenRecuperacao(token), /^[a-f0-9]{64}$/);
});

test('recompensas aplicam limites da meta e catálogo tem custos positivos', () => {
  assert.equal(calcularEstrelasPorConclusaoDeSessao(0, 0), 2);
  assert.equal(calcularEstrelasPorConclusaoDeSessao(-1, 10), 2);
  assert.equal(calcularEstrelasPorConclusaoDeSessao(10, 0), 2);
  assert.equal(calcularEstrelasPorConclusaoDeSessao(10, 5.01), 5);
  assert.equal(calcularEstrelasPorConclusaoDeSessao(10, 5), 4);
  assert.equal(calcularEstrelasPorConclusaoDeSessao(10, 6), 5);
  assert.equal(calcularEstrelasPorConclusaoDeSessao(10, 10), 6);
  assert.ok(Object.values(ITENS_LOJA).every((item) => item.custo > 0 && item.unidades > 0));
  assert.ok(Object.values(ITENS_LOJA).every((item) => item.efeitoPorUso > 0 && item.efeitoUnidade.length > 0));
});
