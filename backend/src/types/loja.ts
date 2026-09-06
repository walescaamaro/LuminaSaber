import type { TipoBeneficio } from '../constants/loja.js';

export type { TipoBeneficio };

export interface CarteiraResposta {
  estrelas: number;
}

export interface InventarioResposta {
  dica: number;
  tempo_extra: number;
  chance_extra: number;
}

export interface CompraResposta {
  mensagem: string;
  estrelas: number;
  inventario: InventarioResposta;
}

export interface UsoBeneficioResposta {
  mensagem: string;
  inventario: InventarioResposta;
}

export interface SessaoConcluidaResposta {
  mensagem: string;
  estrelasGanhas: number;
  estrelas: number;
}