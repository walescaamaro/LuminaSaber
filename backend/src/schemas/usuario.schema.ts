import { z } from 'zod';

const body = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().trim().email('E-mail inválido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  grau_escolar: z.string().trim().min(1, 'Alunos devem informar o grau escolar.'),
  data_nasc: z
    .string()
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), 'Informe uma data de nascimento válida.')
    .refine(
      (value) => new Date(`${value}T00:00:00`) <= new Date(),
      'A data de nascimento não pode estar no futuro.',
    ),
});

const loginBody = z.object({
  email: z.string().trim().email('E-mail inválido.'),
  senha: z.string().min(1, 'E-mail e senha são obrigatórios.'),
});

export const criarUsuarioSchema = z.object({ body });
export const loginUsuarioSchema = z.object({ body: loginBody });