import { z } from 'zod';

const TIPOS_VALIDOS = ['dica', 'tempo_extra', 'chance_extra'] as const;

const comprarBody = z.object({
  item: z.enum(TIPOS_VALIDOS, {
    message: 'Informe um item válido: dica, tempo_extra ou chance_extra.',
  }),
});

const usarBody = z.object({
  tipo: z.enum(TIPOS_VALIDOS, {
    message: 'Informe um benefício válido: dica, tempo_extra ou chance_extra.',
  }),
});

const sessaoConcluidaBody = z.object({
  meta: z.coerce.number().int().min(0, 'meta deve ser um número inteiro maior ou igual a 0.'),
  respondidas: z.coerce.number().int().min(0, 'respondidas deve ser um número inteiro maior ou igual a 0.'),
});

export const comprarItemSchema = z.object({ body: comprarBody });
export const usarBeneficioSchema = z.object({ body: usarBody });
export const sessaoConcluidaSchema = z.object({ body: sessaoConcluidaBody });