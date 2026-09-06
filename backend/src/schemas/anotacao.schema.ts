import { z } from 'zod';

const criarBody = z.object({
  titulo: z.string().trim().min(1, 'Preencha o título da anotação.').max(120),
  texto_anota: z.string().trim().min(1, 'Preencha o texto da anotação.'),
  cod_pasta: z.coerce.number().int().positive().optional(),
});

const atualizarBody = z.object({
  titulo: z.string().trim().min(1, 'Preencha o título da anotação.').max(120).optional(),
  texto_anota: z.string().trim().min(1, 'Preencha o texto da anotação.').optional(),
  cod_pasta: z.coerce.number().int().positive().optional(),
}).refine((dados) => Object.keys(dados).length > 0, {
  message: 'Informe ao menos um campo para atualizar (titulo, texto_anota ou cod_pasta).',
});

const params = z.object({
  id: z.coerce.number().int().positive('Id de anotação inválido.'),
});

export const criarAnotacaoSchema = z.object({ body: criarBody });
export const atualizarAnotacaoSchema = z.object({ params, body: atualizarBody });
export const excluirAnotacaoSchema = z.object({ params });