import express from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/api/usuarios', UsuarioController.criar);
router.get('/api/usuarios', UsuarioController.listar);

export default router;
