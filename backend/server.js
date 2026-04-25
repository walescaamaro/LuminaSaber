const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ===== DIRETÓRIOS DO PROJETO =====
const rootDir  = path.join(__dirname, '..');
const homeDir  = path.join(__dirname, '..', '(teste)home.html');
const exercDir = path.join(__dirname, '..', 'tela_exercícios');

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(morgan('dev'));

// ===== ARQUIVOS ESTÁTICOS =====
app.use(express.static(homeDir));
app.use(express.static(exercDir));
app.use(express.static(rootDir));

// ===== ROTAS DE PÁGINAS =====
app.get('/', (req, res) => {
  res.sendFile(path.join(homeDir, 'home.html'));
});

app.get('/selecao', (req, res) => {
  res.sendFile(path.join(rootDir, 'seleção_disciplinas.html'));
});

app.get('/exercicios', (req, res) => {
  res.sendFile(path.join(exercDir, 'exercicios.html'));
});

// ===== DADOS TEMPORÁRIOS (array em memória) =====
const questoes = [
  {
    id: 1,
    nivel: 'Fácil',
    enunciado: 'Qual é a capital do Brasil?',
    alternativas: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador']
  },
  {
    id: 2,
    nivel: 'Médio',
    enunciado: 'Qual é a fórmula da água?',
    alternativas: ['H2O', 'CO2', 'O2', 'NaCl']
  },
  {
    id: 3,
    nivel: 'Difícil',
    enunciado: 'Qual é o maior planeta do Sistema Solar?',
    alternativas: ['Terra', 'Marte', 'Júpiter', 'Saturno']
  }
];

// ===== CRUD DE QUESTÕES =====

// GET - Listar todas as questões
app.get('/api/questoes', (req, res) => {
  res.status(200).json(questoes);
});

// GET - Obter uma questão específica pelo ID
app.get('/api/questoes/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID deve ser um número' });
  }
  const questao = questoes.find(q => q.id === parseInt(id));
  if (!questao) {
    return res.status(404).json({ error: 'Questão não encontrada' });
  }
  res.status(200).json(questao);
});

// POST - Criar uma nova questão
app.post('/api/questoes', (req, res) => {
  const novaQuestao = req.body;
  if (!novaQuestao || !novaQuestao.enunciado || !novaQuestao.alternativas) {
    return res.status(400).json({ error: 'Dados da questão incompletos. Obrigatório: enunciado e alternativas' });
  }
  if (!Array.isArray(novaQuestao.alternativas)) {
    return res.status(400).json({ error: 'Alternativas deve ser um array' });
  }
  if (novaQuestao.alternativas.length < 2) {
    return res.status(400).json({ error: 'A questão deve ter pelo menos 2 alternativas' });
  }
  novaQuestao.id = questoes.length > 0 ? Math.max(...questoes.map(q => q.id)) + 1 : 1;
  questoes.push(novaQuestao);
  res.status(201).json(novaQuestao);
});

// PUT - Atualizar uma questão existente
app.put('/api/questoes/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID deve ser um número' });
  }
  const questao = questoes.find(q => q.id === parseInt(id));
  if (!questao) {
    return res.status(404).json({ error: 'Questão não encontrada' });
  }
  if (!dadosAtualizados || (!dadosAtualizados.enunciado && !dadosAtualizados.alternativas && !dadosAtualizados.nivel)) {
    return res.status(400).json({ error: 'Envie pelo menos um campo para atualizar (enunciado, alternativas ou nivel)' });
  }
  if (dadosAtualizados.enunciado) questao.enunciado = dadosAtualizados.enunciado;
  if (dadosAtualizados.alternativas) {
    if (!Array.isArray(dadosAtualizados.alternativas) || dadosAtualizados.alternativas.length < 2) {
      return res.status(400).json({ error: 'Alternativas deve ser um array com pelo menos 2 itens' });
    }
    questao.alternativas = dadosAtualizados.alternativas;
  }
  if (dadosAtualizados.nivel) questao.nivel = dadosAtualizados.nivel;
  res.status(200).json(questao);
});

// DELETE - Deletar uma questão
app.delete('/api/questoes/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID deve ser um número' });
  }
  const indice = questoes.findIndex(q => q.id === parseInt(id));
  if (indice === -1) {
    return res.status(404).json({ error: 'Questão não encontrada' });
  }
  const questaoRemovida = questoes.splice(indice, 1);
  res.status(200).json({
    mensagem: 'Questão deletada com sucesso',
    questao: questaoRemovida[0]
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});