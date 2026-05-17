import express from 'express';
import { QuestaoController } from '../controllers/questaoController.js';

const router = express.Router();

router.get('/api/questoes', QuestaoController.listar);
router.post('/api/questoes', QuestaoController.criar);

export default router;