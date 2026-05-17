import express from 'express';
import { QuestaoController } from '../controllers/questaoController.js';

const router = express.Router();

router.get   ('/api/questoes',     QuestaoController.listar);
router.get   ('/api/questoes/:id', QuestaoController.buscarPorId);
router.post  ('/api/questoes',     QuestaoController.criar);
router.put   ('/api/questoes/:id', QuestaoController.atualizar);
router.delete('/api/questoes/:id', QuestaoController.deletar);

export default router;