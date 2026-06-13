import express from 'express';
import path from 'path';

export default function configurePageRoutes(publicDir: string) {
  const router = express.Router();

  router.get('/', (req, res) => res.sendFile(path.join(publicDir, 'home.html')));
  router.get('/selecao', (req, res) => res.sendFile(path.join(publicDir, 'seleção_disciplinas.html')));
  router.get('/tempo', (req, res) => res.sendFile(path.join(publicDir, 'defina_seu_tempo.html')));
  router.get('/meta', (req, res) => res.sendFile(path.join(publicDir, 'meta_questoes.html')));
  router.get('/exercicios', (req, res) => res.sendFile(path.join(publicDir, 'tela_exercicios', 'exercicios.html')));
  router.get('/relatorio', (req, res) => res.sendFile(path.join(publicDir, 'relatorio.html')));
  router.get('/cadastro', (req, res) => res.sendFile(path.join(publicDir, 'cadastro.html')));
  router.get('/cadastro-exercicios', (req, res) => res.sendFile(path.join(publicDir, 'cadastro_exercicios.html')));

  return router;
}