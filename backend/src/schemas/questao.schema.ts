import { z } from 'zod';

const body = z.object({
  cod_disc: z.coerce.number().int().positive('O código da disciplina deve ser um número inteiro positivo.'),
  enunciado: z.string().trim().min(1, 'O enunciado é obrigatório.'),
  alternativa_A: z.string().trim().min(1, 'A alternativa A é obrigatória.'),
  alternativa_B: z.string().trim().min(1, 'A alternativa B é obrigatória.'),
  alternativa_C: z.string().trim().min(1, 'A alternativa C é obrigatória.'),
  alternativa_D: z.string().trim().min(1, 'A alternativa D é obrigatória.'),
  alternativa_correta: z.enum(['a', 'b', 'c', 'd'], {
    message: 'alternativa_correta deve ser uma das letras: a, b, c ou d.',
  }),
  dificuldade: z.string().trim().min(1, 'A dificuldade é obrigatória.'),
});

const params = z.object({
  id: z.string().regex(/^\d+$/, 'O ID deve ser um número inteiro.'),
});

export const criarQuestaoSchema = z.object({ body });
export const buscarQuestaoPorIdSchema = z.object({ params });
export const atualizarQuestaoSchema = z.object({
  params,
  body: body.partial(),
});
export const deletarQuestaoSchema = z.object({ params });
