import express from 'express';
import * as IaController from '../controllers/iaController.js';

const router = express.Router();

router.post('/api/ai/analyze', IaController.analisar);

export default router;