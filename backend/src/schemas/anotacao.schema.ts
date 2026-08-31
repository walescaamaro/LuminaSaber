import { z } from 'zod';

const body = z.object({
  titulo: z.string().trim().min(1, 'Preencha o título da anotação.'),
  texto_anota: z.string().trim().min(1, 'Preencha o texto da anotação.'),
});

export const criarAnotacaoSchema = z.object({ body });
