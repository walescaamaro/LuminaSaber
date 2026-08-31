import express from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { criarUsuarioSchema, loginUsuarioSchema } from '../schemas/usuario.schema.js';

const router = express.Router();

router.post('/api/usuarios', validate(criarUsuarioSchema), UsuarioController.criar);
router.post('/api/usuarios/login', validate(loginUsuarioSchema), UsuarioController.login);
router.post('/api/usuarios/logout', authMiddleware, UsuarioController.logout);
router.get('/api/usuarios', authMiddleware, adminMiddleware, UsuarioController.listar);
router.get('/api/usuarios/perfil', authMiddleware, UsuarioController.perfil);

export default router;