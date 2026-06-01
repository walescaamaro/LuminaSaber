export type UsuarioTipo = 'administrador' | 'aluno';

export interface UsuarioCreatePayload {
  nome: string;
  email: string;
  senha: string;
  grau_escolar?: string | null;
  data_nasc: string;
  tipo: UsuarioTipo;
}

export interface UsuarioListItem {
  cod_usuario: number;
  nome: string;
  email: string;
  grau_escolar: string | null;
  data_nasc: string;
  tipo: UsuarioTipo;
}
