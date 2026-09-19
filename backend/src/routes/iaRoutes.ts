import express from 'express';
import * as IaController from '../controllers/iaController.js';
import { validate } from '../middlewares/validate.js';
import { analisarSchema } from '../schemas/ia.schema.js';

const router = express.Router();

router.post('/api/ai/analyze', validate(analisarSchema), IaController.analisar);

export default router;