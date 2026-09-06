export interface AnotacaoResumo {
  cod_anota: number;
  titulo: string;
  texto_anota: string;
  data_anota: string;
  cod_pasta: number;
  nome_pasta: string;
}

export interface CriarAnotacaoInput {
  titulo: string;
  texto_anota: string;
  cod_pasta?: number;
}

export interface AtualizarAnotacaoInput {
  titulo?: string;
  texto_anota?: string;
  cod_pasta?: number;
}