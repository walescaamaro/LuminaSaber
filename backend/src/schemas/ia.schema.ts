import { z } from 'zod';

const body = z.object({
  prompt: z.string().trim().min(1, 'Campo "prompt" é obrigatório.'),
});

export const analisarSchema = z.object({ body });