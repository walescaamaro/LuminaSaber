import express from 'express';
import { HistoricoController } from '../controllers/historicoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { listarHistoricoDeUsuarioSchema, registrarHistoricoSchema } from '../schemas/historico.schema.js';

const router = express.Router();

router.get('/api/historico', authMiddleware, HistoricoController.listarMeu);
router.post('/api/historico', authMiddleware, validate(registrarHistoricoSchema), HistoricoController.registrar);

// Só admin pode ver o histórico de outro usuário.
router.get('/api/admin/usuarios/:id/historico', authMiddleware, adminMiddleware, validate(listarHistoricoDeUsuarioSchema), HistoricoController.listarDeUsuario);

export default router;