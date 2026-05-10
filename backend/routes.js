import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function configureRoutes(app, publicDir) {
  // ===== ROTAS DE PÁGINAS =====
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'home.html'));
  });

  app.get('/selecao', (req, res) => {
    res.sendFile(path.join(publicDir, 'seleção_disciplinas.html'));
  });

  app.get('/exercicios', (req, res) => {
    res.sendFile(path.join(publicDir, 'tela_exercicios', 'exercicios.html'));
  });

  app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(publicDir, 'cadastro.html'));
  });

  app.get('/cadastro-exercicios', (req, res) => {
    res.sendFile(path.join(publicDir, 'cadastro_exercicios.html'));
  });

  // ===== DADOS TEMPORÁRIOS (array em memória) =====
 const questoes = JSON.parse(
  readFileSync(path.join(__dirname, './data/questoes.json'), 'utf-8')
);

  // ===== CRUD DE QUESTÕES =====
  app.get('/api/questoes', (req, res) => {
    res.status(200).json(questoes);
  });

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
};
