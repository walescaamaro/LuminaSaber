import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import type { NextFunction, Request, Response } from 'express';

import questaoRoutes from './src/routes/questaoRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import anotacaoRoutes from './src/routes/anotacaoRoutes.js';
import pastaRoutes from './src/routes/pastaRoutes.js';
import historicoRoutes from './src/routes/historicoRoutes.js';
import lojaRoutes from './src/routes/lojaRoutes.js';
import configurePageRoutes from './src/routes/pageRoutes.js';
import { contentTypeJson } from './src/middlewares/contentTypeJson.js';
import { blockDirectHtmlAccess } from './src/middlewares/blockDirectHtmlAccess.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { HttpError } from './src/errors/HttpError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Configure JWT_SECRET no arquivo .env com pelo menos 32 caracteres.');
}
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Precisa rodar ANTES do express.static.
app.use(blockDirectHtmlAccess);
app.use(express.static(publicDir));

app.use('/api', contentTypeJson);

app.use(questaoRoutes);
app.use(usuarioRoutes);
app.use(anotacaoRoutes);
app.use(pastaRoutes);
app.use(historicoRoutes);
app.use(lojaRoutes);
app.use(configurePageRoutes(publicDir));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Rota não encontrada.'));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});