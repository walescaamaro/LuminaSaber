import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Importando as rotas separadas
import questaoRoutes from './src/routes/questaoRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import configurePageRoutes from './src/routes/pageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(publicDir));

// Usando o padrão MVC
app.use(questaoRoutes);    
app.use(usuarioRoutes);                 // API (Vai para o Controller)
app.use(configurePageRoutes(publicDir));    // Páginas HTML

// Iniciar o Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});