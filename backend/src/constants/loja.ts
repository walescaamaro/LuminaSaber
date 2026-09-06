// backend/src/constants/loja.ts
//
// Catálogo do "Mercado Lumina" — fonte única de verdade dos itens
// vendidos e do custo em Estrelas. O front-end busca esses dados em
// GET /api/loja/itens em vez de duplicar os valores, então mudar um
// preço aqui já reflete em toda a aplicação.

export type TipoBeneficio = 'dica' | 'tempo_extra' | 'chance_extra';

export interface ItemLoja {
  id: TipoBeneficio;
  nome: string;
  descricao: string;
  custo: number;
  unidades: number; // quantas "cargas" de uso o item adiciona ao inventário
  efeitoPorUso: number; // magnitude do efeito de CADA carga (ex: minutos)
  efeitoUnidade: string; // unidade do efeito, pra exibição (ex: "min")
}

export const ITENS_LOJA: Record<TipoBeneficio, ItemLoja> = {
  dica: {
    id: 'dica',
    nome: '2 dicas',
    descricao: 'Elimina uma alternativa errada da questão atual.',
    custo: 30,
    unidades: 2,
    efeitoPorUso: 1,
    efeitoUnidade: 'alternativa eliminada',
  },
  tempo_extra: {
    id: 'tempo_extra',
    nome: '+5 minutos de tempo extra',
    descricao: 'Adiciona 5 minutos ao cronômetro da sessão de estudo atual.',
    custo: 15,
    unidades: 1,
    efeitoPorUso: 5,
    efeitoUnidade: 'min',
  },
  chance_extra: {
    id: 'chance_extra',
    nome: '3 chances extras',
    descricao: 'Permite tentar novamente uma questão que você errou.',
    custo: 40,
    unidades: 3,
    efeitoPorUso: 1,
    efeitoUnidade: 'nova tentativa',
  },
};

// Regras de recompensa por acerto/sessão (mantidas junto do catálogo
// para ficarem fáceis de auditar em um único lugar).
export const ESTRELAS_POR_CORRECAO_DE_ERRO = 5;

export function calcularEstrelasPorConclusaoDeSessao(meta: number, respondidas: number): number {
  if (!meta || meta <= 0) return 2;

  const percentual = (respondidas / meta) * 100;

  if (percentual >= 100) return 6;
  if (percentual > 50) return 5;
  if (percentual === 50) return 4;
  return 2;
}