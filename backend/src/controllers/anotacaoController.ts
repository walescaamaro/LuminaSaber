// backend/src/routes/anotacaoRoutes.ts (substitua tudo)
import express from 'express';
export class AnotacaoController {
  static listarMinhas(req: any, res: any) {
    return res.status(200).json({ message: 'listarMinhas' });
  }

  static criar(req: any, res: any) {
    return res.status(201).json({ message: 'criar' });
  }
}

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/api/anotacoes', authMiddleware, AnotacaoController.listarMinhas);
router.post('/api/anotacoes', authMiddleware, AnotacaoController.criar);

export default router;