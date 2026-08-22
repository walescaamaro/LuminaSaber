import express from 'express';
import { AnotacaoController } from '../controllers/anotacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// authMiddleware roda ANTES do controller — sem token válido, a requisição
// nem chega em AnotacaoController.listarMinhas.
router.get('/api/anotacoes', authMiddleware, AnotacaoController.listarMinhas);

export default router;