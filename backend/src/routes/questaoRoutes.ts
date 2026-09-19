import express from 'express';
import { QuestaoController } from '../controllers/questaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { validate } from '../middlewares/validate.js';
import * as questaoSchemas from '../schemas/questao.schema.js';

const {
  buscarQuestaoPorIdSchema = (questaoSchemas as any).buscarQuestaoPorId ?? (questaoSchemas as any).buscarQuestaoPorIdSchema,
  criarQuestaoSchema = (questaoSchemas as any).criarQuestao ?? (questaoSchemas as any).criarQuestaoSchema,
  listarQuestoesSchema = (questaoSchemas as any).listarQuestoes ?? (questaoSchemas as any).listarQuestoesSchema,
  atualizarQuestaoSchema = (questaoSchemas as any).atualizarQuestao ?? (questaoSchemas as any).atualizarQuestaoSchema,
  deletarQuestaoSchema = (questaoSchemas as any).deletarQuestao ?? (questaoSchemas as any).deletarQuestaoSchema,
} = questaoSchemas as any;

const router = express.Router();

// Leitura: pública (alunos precisam buscar as questões para responder).
// Aceita filtros opcionais por query string: ?cod_disc= e ?dificuldade=
router.get('/api/questoes', validate(listarQuestoesSchema), QuestaoController.listar);
router.get('/api/questoes/:id', validate(buscarQuestaoPorIdSchema), QuestaoController.buscarPorId);

// Escrita: exige login + ser administrador.
router.post('/api/questoes', authMiddleware, adminMiddleware, validate(criarQuestaoSchema), QuestaoController.criar);
router.put('/api/questoes/:id', authMiddleware, adminMiddleware, validate(atualizarQuestaoSchema), QuestaoController.atualizar);
router.delete('/api/questoes/:id', authMiddleware, adminMiddleware, validate(deletarQuestaoSchema), QuestaoController.deletar);

export default router;