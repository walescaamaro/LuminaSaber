import { z } from 'zod';

const params = z.object({
  id: z.string().regex(/^\d+$/, 'O ID do usuário deve ser um número inteiro.'),
});

const body = z.object({
  cod_quest: z.coerce.number().int().positive('cod_quest deve ser um número inteiro positivo.'),
  alternativa: z
    .string()
    .trim()
    .min(1, 'Informe cod_quest e uma alternativa válida (a, b, c ou d).')
    .refine(
      (value) => ['a', 'b', 'c', 'd'].includes(value.toLowerCase()),
      'Informe cod_quest e uma alternativa válida (a, b, c ou d).',
    )
    .transform((value) => value.toLowerCase()),
});

export const listarHistoricoDeUsuarioSchema = z.object({ params });
export const registrarHistoricoSchema = z.object({ body });
