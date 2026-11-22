import { beforeAll, describe, expect, it, vi } from 'vitest';

const itens = [
  { id: 'dica', nome: 'Dica', descricao: 'Ajuda adicional', custo: 10 },
  { id: 'tempo_extra', nome: 'Tempo extra', descricao: 'Mais tempo', custo: 30 },
  { id: 'item_novo', nome: 'Item novo', descricao: 'Sem ícone específico', custo: 1 },
];

let respostaCompra = { ok: true, status: 200, json: async () => ({ estrelas: 15, inventario: { dica: 1 } }) };
let falharProximaLista = false;
let respostaEspecial = null;
let carregarSaldo;
let carregarInventario;
let atualizarBadge;
let buscar;

beforeAll(async () => {
  document.body.innerHTML = '<div id="badgeSaldo"></div><div id="gradeItens"></div><div id="avisoToast"></div>';
  carregarSaldo = vi.fn().mockResolvedValue(25);
  carregarInventario = vi.fn().mockResolvedValue({ dica: 2, tempo_extra: 1 });
  atualizarBadge = vi.fn();
  window.Estrelas = {
    ICONE_ESTRELA_SVG: '<span aria-hidden="true">★</span>',
    buscarSaldoEstrelas: carregarSaldo,
    buscarInventario: carregarInventario,
    montarBadge: vi.fn(() => atualizarBadge),
  };
  buscar = vi.fn(async (url) => {
    if (respostaEspecial) return respostaEspecial;
    if (url === '/api/loja/itens') {
      if (falharProximaLista) {
        falharProximaLista = false;
        return { ok: false, status: 503, json: async () => ({ error: 'Loja indisponível' }) };
      }
      return { ok: true, status: 200, json: async () => itens };
    }
    if (url === '/api/loja/comprar') return respostaCompra;
    throw new Error(`URL inesperada: ${url}`);
  });
  vi.stubGlobal('fetchAutenticado', buscar);

  await import('../../public/js/loja.js');
  await vi.waitFor(() => expect(document.querySelectorAll('#gradeItens .item-card')).toHaveLength(3));
});

describe('Mercado Lumina', () => {
  it('renderiza catálogo, compra, apresenta falhas e permite tentar carregar novamente', async () => {
    const erroConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
    const grade = document.getElementById('gradeItens');
    const cardDica = grade.querySelector('.i-dica');
    const cardTempo = grade.querySelector('.i-tempo_extra');
    const cardNovo = grade.querySelector('.i-item_novo');

    expect(cardDica.textContent).toContain('Você tem 2 disponíveis');
    expect(cardTempo.textContent).toContain('Você tem 1 disponível');
    expect(cardNovo.textContent).toContain('Nenhum disponível ainda');
    expect(cardNovo.querySelector('.item-icone').innerHTML).toBe('');
    expect(cardDica.querySelector('.btn-comprar').disabled).toBe(false);
    expect(cardTempo.querySelector('.btn-comprar').disabled).toBe(true);

    cardDica.querySelector('.btn-comprar').click();
    await vi.waitFor(() => expect(document.getElementById('avisoToast').textContent).toContain('Compra realizada: Dica!'));
    expect(buscar).toHaveBeenCalledWith('/api/loja/comprar', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ item: 'dica' }),
    }));
    expect(atualizarBadge).toHaveBeenCalledWith(15, true);

    respostaCompra = { ok: false, status: 409, json: async () => ({ error: 'Saldo insuficiente' }) };
    const botaoAposCompra = grade.querySelector('.i-dica .btn-comprar');
    botaoAposCompra.click();
    await vi.waitFor(() => expect(document.getElementById('avisoToast').textContent).toBe('Saldo insuficiente'));
    expect(document.getElementById('avisoToast').classList.contains('erro')).toBe(true);
    expect(grade.querySelector('.i-dica .btn-comprar').disabled).toBe(false);
    respostaCompra = { ok: true, status: 200, json: async () => ({ estrelas: 15, inventario: { dica: 1 } }) };

    buscar.mockRejectedValueOnce(new Error(''));
    grade.querySelector('.i-dica .btn-comprar').click();
    await vi.waitFor(() => expect(document.getElementById('avisoToast').textContent)
      .toBe('Não foi possível concluir a compra.'));

    respostaEspecial = { ok: true, status: 200, json: async () => { throw new SyntaxError('JSON inválido'); } };
    await expect(window.Loja.buscarJson('/api/resposta-invalida')).rejects.toThrow(/Resposta inválida/);
    respostaEspecial = { ok: false, status: 403, json: async () => ({ error: 'Acesso negado' }) };
    await expect(window.Loja.buscarJson('/api/negada')).rejects.toThrow('Acesso negado');
    respostaEspecial = { ok: false, status: 500, json: async () => ({}) };
    await expect(window.Loja.buscarJson('/api/erro')).rejects.toThrow(/Erro 500/);
    respostaEspecial = null;

    window.Loja.renderizarItens(null, 0, {});
    expect(grade.textContent).toContain('Nenhum item disponível');
    window.Loja.renderizarItens([], 0, {});
    expect(grade.textContent).toContain('Nenhum item disponível');

    window.Loja.mostrarErroCarregamento(new Error('Falha temporária'));
    expect(grade.textContent).toContain('Falha temporária');
    window.Loja.mostrarErroCarregamento({});
    expect(grade.textContent).toContain('Erro desconhecido.');
    grade.querySelector('#btnTentarDeNovo').click();
    await vi.waitFor(() => expect(grade.querySelector('.msg-erro')).toBeNull());

    falharProximaLista = true;
    await window.Loja.carregarTudo();
    expect(grade.textContent).toContain('Loja indisponível');
    expect(carregarSaldo).toHaveBeenCalled();
    expect(carregarInventario).toHaveBeenCalled();
    erroConsole.mockRestore();

    vi.useFakeTimers();
    window.Loja.mostrarToast('Aviso temporário', 'sucesso');
    expect(document.getElementById('avisoToast').classList.contains('mostrar')).toBe(true);
    vi.advanceTimersByTime(2600);
    expect(document.getElementById('avisoToast').classList.contains('mostrar')).toBe(false);
    document.getElementById('avisoToast').remove();
    window.Loja.mostrarToast('Sem elemento de aviso', 'sucesso');
    vi.useRealTimers();
  });

  it('mostra mensagem quando o saldo inicial não pode ser carregado', async () => {
    const erroConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
    const buscarSaldoOriginal = window.Estrelas.buscarSaldoEstrelas;
    window.Estrelas.buscarSaldoEstrelas = vi.fn().mockRejectedValue(new Error('Sessão indisponível'));

    await import('../../public/js/loja.js?falha-saldo-inicial');

    await vi.waitFor(() => expect(document.querySelector('#gradeItens .msg-erro-detalhe')?.textContent)
      .toBe('Sessão indisponível'));

    window.Estrelas.buscarSaldoEstrelas = buscarSaldoOriginal;
    erroConsole.mockRestore();
  });
});
