import express from 'express';
import { QuestaoController } from '../controllers/questaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Leitura: pública (alunos precisam buscar as questões para responder).
router.get('/api/questoes', QuestaoController.listar);
router.get('/api/questoes/:id', QuestaoController.buscarPorId);

// Escrita: exige login + ser administrador.
router.post('/api/questoes', authMiddleware, adminMiddleware, QuestaoController.criar);
router.put('/api/questoes/:id', authMiddleware, adminMiddleware, QuestaoController.atualizar);
router.delete('/api/questoes/:id', authMiddleware, adminMiddleware, QuestaoController.deletar);

export default router;