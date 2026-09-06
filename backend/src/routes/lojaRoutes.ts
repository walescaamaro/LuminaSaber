import express from 'express';
import { LojaController } from '../controllers/lojaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { comprarItemSchema, usarBeneficioSchema, sessaoConcluidaSchema } from '../schemas/loja.schema.js';

const router = express.Router();

// Todas as rotas da loja exigem usuário autenticado — o Mercado Lumina
// fica disponível para qualquer aluno ou administrador logado.
router.get('/api/loja/itens', authMiddleware, LojaController.listarItens);
router.get('/api/loja/carteira', authMiddleware, LojaController.carteira);
router.get('/api/loja/inventario', authMiddleware, LojaController.inventario);
router.post('/api/loja/comprar', authMiddleware, validate(comprarItemSchema), LojaController.comprar);
router.post('/api/loja/usar', authMiddleware, validate(usarBeneficioSchema), LojaController.usar);
router.post('/api/loja/sessao-concluida', authMiddleware, validate(sessaoConcluidaSchema), LojaController.sessaoConcluida);

export default router;