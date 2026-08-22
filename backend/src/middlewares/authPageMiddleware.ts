import type { NextFunction, Request, Response } from 'express';
import { obterSessaoPagina } from '../lib/sessaoPagina.js';

// Impede que o navegador guarde a página no cache (inclusive no botão
// "voltar"/bfcache). Sem isso, depois do logout, apertar "voltar" pode
// mostrar uma cópia da tela privada guardada em memória, sem passar de
// novo pelo servidor — e sem passar pelo servidor, esse middleware nunca
// roda de novo pra bloquear o acesso.
function impedirCache(res: Response) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
}

export function authPageMiddleware(req: Request, res: Response, next: NextFunction) {
  const payload = obterSessaoPagina(req);

  if (!payload) {
    return res.redirect('/login');
  }

  impedirCache(res);
  req.user = payload;
  return next();
}

export function authPageAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  const payload = obterSessaoPagina(req);

  if (!payload) {
    return res.redirect('/login');
  }

  if (payload.tipo !== 'administrador') {
    return res.redirect('/painel');
  }

  impedirCache(res);
  req.user = payload;
  return next();
}