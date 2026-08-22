import type { NextFunction, Request, Response } from 'express';
import { obterSessaoPagina } from '../lib/sessaoPagina.js';

const PAGINAS_PRIVADAS = new Set([
  '/painel.html',
  '/anotacoes.html',
  '/historico.html',
  '/seleção_disciplinas.html',
  '/defina_seu_tempo.html',
  '/meta_questoes.html',
  '/relatorio.html',
  '/tela_exercicios/exercicios.html',
]);

const PAGINAS_ADMIN = new Set([
  '/cadastro_exercicios.html',
  '/admin.html',
  '/admin-usuarios.html',
  '/admin-parametros.html',
]);

export function blockDirectHtmlAccess(req: Request, res: Response, next: NextFunction) {
  const caminho = decodeURIComponent(req.path);

  if (!PAGINAS_PRIVADAS.has(caminho) && !PAGINAS_ADMIN.has(caminho)) {
    return next();
  }

  const payload = obterSessaoPagina(req);

  if (!payload) {
    return res.redirect('/login');
  }

  if (PAGINAS_ADMIN.has(caminho) && payload.tipo !== 'administrador') {
    return res.redirect('/painel');
  }

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  return next();
}