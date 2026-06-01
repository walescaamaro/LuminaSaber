export type AlternativaCorreta = 'a' | 'b' | 'c' | 'd';

export interface QuestaoBanco {
  cod_quest: number;
  cod_disc: number;
  enunciado: string;
  alternativa_A: string;
  alternativa_B: string;
  alternativa_C: string;
  alternativa_D: string;
  alternativa_correta: AlternativaCorreta;
  dificuldade: string;
  materia: string;
}

export interface QuestaoFrontend {
  id: number;
  materia: string;
  nivel: string;
  enunciado: string;
  alternativas: [string, string, string, string];
  correta: number;
}

export interface QuestaoPayload {
  cod_disc: number;
  enunciado: string;
  alternativa_A: string;
  alternativa_B: string;
  alternativa_C: string;
  alternativa_D: string;
  alternativa_correta: AlternativaCorreta;
  dificuldade: string;
}
