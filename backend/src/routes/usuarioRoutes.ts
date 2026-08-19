import express from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/api/usuarios', UsuarioController.criar);
router.post('/api/usuarios/login', UsuarioController.login);
router.get('/api/usuarios', UsuarioController.listar);
router.get('/api/usuarios/perfil', authMiddleware, UsuarioController.perfil);

export default router;
