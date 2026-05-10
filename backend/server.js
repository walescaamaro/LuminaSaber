const express = require('express');
const morgan = require('morgan');
const path = require('path');

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
const configureRoutes = require('./routes');
configureRoutes(app, publicDir);

// ===== INICIAR SERVIDOR =====
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});