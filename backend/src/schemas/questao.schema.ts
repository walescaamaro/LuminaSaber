import { z } from 'zod';

const DIFICULDADES_VALIDAS = ['fácil', 'médio', 'difícil'] as const;

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

// Filtros opcionais de listagem: GET /api/questoes?cod_disc=82211&dificuldade=fácil
// Nenhum campo é obrigatório — sem query, a listagem continua trazendo tudo.
const query = z.object({
  cod_disc: z.coerce.number().int().positive('cod_disc deve ser um número inteiro positivo.').optional(),
  dificuldade: z.enum(DIFICULDADES_VALIDAS, {
    message: `dificuldade deve ser uma de: ${DIFICULDADES_VALIDAS.join(', ')}.`,
  }).optional(),
});

export const criarQuestaoSchema = z.object({ body });
export const listarQuestoesSchema = z.object({ query });
export const buscarQuestaoPorIdSchema = z.object({ params });
export const atualizarQuestaoSchema = z.object({
  params,
  body: body.partial().refine(
    (dados) => Object.keys(dados).length > 0,
    { message: 'Envie ao menos um campo para atualizar.' },
  ),
});
export const deletarQuestaoSchema = z.object({ params });