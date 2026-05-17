import express from 'express';
import path from 'path';

export default function configurePageRoutes(publicDir) {
    const router = express.Router();

    router.get('/', (req, res) => res.sendFile(path.join(publicDir, 'home.html')));
    router.get('/selecao', (req, res) => res.sendFile(path.join(publicDir, 'seleção_disciplinas.html')));
    router.get('/exercicios', (req, res) => res.sendFile(path.join(publicDir, 'tela_exercicios', 'exercicios.html')));
    router.get('/cadastro', (req, res) => res.sendFile(path.join(publicDir, 'cadastro.html')));
    router.get('/cadastro-exercicios', (req, res) => res.sendFile(path.join(publicDir, 'cadastro_exercicios.html')));

    return router;
}