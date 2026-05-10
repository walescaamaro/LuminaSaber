import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url'; // necessário para recriar __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// ===== DIRETÓRIOS DO PROJETO =====
const publicDir = path.join(__dirname, '..', 'public');

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(morgan('dev'));

// ===== ARQUIVOS ESTÁTICOS =====
app.use(express.static(publicDir));

// ===== ROTAS =====
import configureRoutes from './routes.js';
configureRoutes(app, publicDir);

// ===== INICIAR SERVIDOR =====
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});