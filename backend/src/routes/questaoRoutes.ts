import express from 'express';
import { QuestaoController } from '../controllers/questaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  buscarQuestaoPorIdSchema,
  criarQuestaoSchema,
  atualizarQuestaoSchema,
  deletarQuestaoSchema,
} from '../schemas/questao.schema.js';

const router = express.Router();

// Leitura: pública (alunos precisam buscar as questões para responder).
router.get('/api/questoes', QuestaoController.listar);
router.get('/api/questoes/:id', validate(buscarQuestaoPorIdSchema), QuestaoController.buscarPorId);

// Escrita: exige login + ser administrador.
router.post('/api/questoes', authMiddleware, adminMiddleware, validate(criarQuestaoSchema), QuestaoController.criar);
router.put('/api/questoes/:id', authMiddleware, adminMiddleware, validate(atualizarQuestaoSchema), QuestaoController.atualizar);
router.delete('/api/questoes/:id', authMiddleware, adminMiddleware, validate(deletarQuestaoSchema), QuestaoController.deletar);

export default router;