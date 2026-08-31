import express from 'express';
import { AnotacaoController } from '../controllers/anotacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { criarAnotacaoSchema } from '../schemas/anotacao.schema.js';

const router = express.Router();

router.get('/api/anotacoes', authMiddleware, AnotacaoController.listarMinhas);
router.post('/api/anotacoes', authMiddleware, validate(criarAnotacaoSchema), AnotacaoController.criar);

export default router;