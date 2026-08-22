import express from 'express';
import { AnotacaoController } from '../controllers/anotacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/api/anotacoes', authMiddleware, AnotacaoController.listarMinhas);
router.post('/api/anotacoes', authMiddleware, AnotacaoController.criar);

export default router;