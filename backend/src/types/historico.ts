export interface HistoricoResumo {
  cod_resposta: number;
  status: string;
  data_resposta: string;
  questao: {
    cod_quest: number;
    enunciado: string;
    materia: string;
  };
}