import express from 'express';
import path from 'path';
import fs from 'fs';
import { authPageMiddleware, authPageAdminMiddleware } from '../middlewares/authPageMiddleware.js';

export default function configurePageRoutes(publicDir: string) {
  const router = express.Router();

  router.get('/', (req, res) => res.sendFile(path.join(publicDir, 'home.html')));
  router.get('/cadastro', (req, res) => res.sendFile(path.join(publicDir, 'cadastro.html')));
  router.get('/login', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));

  router.get('/painel', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'painel.html')));
  router.get('/anotacoes', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'anotacoes.html')));
  router.get('/historico', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'historico.html')));
  router.get('/selecao', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'seleção_disciplinas.html')));
  router.get('/tempo', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'defina_seu_tempo.html')));
  router.get('/meta', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'meta_questoes.html')));
  router.get('/exercicios', authPageMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'tela_exercicios', 'exercicios.html')));

  router.get('/cadastro-exercicios', authPageAdminMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'cadastro_exercicios.html')));
  router.get('/admin', authPageAdminMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'admin.html')));
  router.get('/admin-usuarios', authPageAdminMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'admin-usuarios.html')));
  router.get('/admin-parametros', authPageAdminMiddleware, (req, res) => res.sendFile(path.join(publicDir, 'admin-parametros.html')));

  router.get('/relatorio', authPageMiddleware, (req, res) => {
    const filePath = path.join(publicDir, 'relatorio.html');
    const html = fs.readFileSync(filePath, 'utf-8');
    const chave = process.env.GEMINI_API_KEY || '';
    const injetado = html.replace('</head>', `<script>window.GEMINI_KEY = "${chave}";</script>\n</head>`);
    res.setHeader('Content-Type', 'text/html');
    res.send(injetado);
  });

  return router;
}