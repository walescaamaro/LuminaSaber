import express from 'express';
import { PastaController } from '../controllers/pastaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { criarPastaSchema, atualizarPastaSchema, excluirPastaSchema } from '../schemas/pasta.schema.js';

const router = express.Router();

router.get('/api/pastas', authMiddleware, PastaController.listarMinhas);
router.post('/api/pastas', authMiddleware, validate(criarPastaSchema), PastaController.criar);
router.put('/api/pastas/:id', authMiddleware, validate(atualizarPastaSchema), PastaController.atualizar);
router.delete('/api/pastas/:id', authMiddleware, validate(excluirPastaSchema), PastaController.excluir);

export default router;