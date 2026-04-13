const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const frontendDir = path.join(__dirname, '..', 'tela_exercícios');
app.use(express.static(frontendDir));

app.use(express.json());
app.use(morgan('dev'));

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

app.get('/api/questoes', (req, res) => {
  res.json(questoes);
});

app.post('/api/questoes', (req, res) => {
  const novaQuestao = req.body;

  if (!novaQuestao || !novaQuestao.enunciado || !novaQuestao.alternativas) {
    return res.status(400).json({ error: 'Dados da questão incompletos' });
  }

  novaQuestao.id = questoes.length + 1;
  questoes.push(novaQuestao);

  res.status(201).json(novaQuestao);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'exercicios.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
