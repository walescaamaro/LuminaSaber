import crypto from 'node:crypto';

const CARACTERES_ESPECIAIS = /[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]/;

export function validarSenha(senha: string): string[] {
  const erros: string[] = [];

  if (senha.length < 8) {
    erros.push('A senha deve ter pelo menos 8 caracteres.');
  }

  if (!/[A-Z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra maiúscula.');
  }

  if (!/[a-z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra minúscula.');
  }

  if (!/\d/.test(senha)) {
    erros.push('A senha deve conter pelo menos um número.');
  }

  if (!CARACTERES_ESPECIAIS.test(senha)) {
    erros.push('A senha deve conter pelo menos um caractere especial.');
  }

  return erros;
}

export function senhaAtendeCritérios(senha: string): boolean {
  return validarSenha(senha).length === 0;
}

export function gerarTokenRecuperacao(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashTokenRecuperacao(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
