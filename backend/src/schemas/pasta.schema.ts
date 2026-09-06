import { z } from 'zod';

const criarBody = z.object({
  nome_pasta: z.string().trim().min(1, 'Preencha o nome da pasta.').max(60),
});

const atualizarBody = z.object({
  nome_pasta: z.string().trim().min(1, 'Preencha o nome da pasta.').max(60),
});

const params = z.object({
  id: z.coerce.number().int().positive('Id de pasta inválido.'),
});

export const criarPastaSchema = z.object({ body: criarBody });
export const atualizarPastaSchema = z.object({ params, body: atualizarBody });
export const excluirPastaSchema = z.object({ params });