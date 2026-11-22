import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../../public/js/estrelas.js';

describe('Estrelas', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.stubGlobal('fetchAutenticado', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('busca saldo e inventário e usa valores seguros em respostas incompletas', async () => {
    fetchAutenticado
      .mockResolvedValueOnce({ ok: true, json: async () => ({ estrelas: 42 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ dica: 2, tempo_extra: 1, chance_extra: 0 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await expect(window.Estrelas.buscarSaldoEstrelas()).resolves.toBe(42);
    await expect(window.Estrelas.buscarInventario()).resolves.toEqual({ dica: 2, tempo_extra: 1, chance_extra: 0 });
    await expect(window.Estrelas.buscarSaldoEstrelas()).resolves.toBe(0);

    fetchAutenticado
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: false });
    await expect(window.Estrelas.buscarSaldoEstrelas()).resolves.toBe(0);
    await expect(window.Estrelas.buscarInventario()).resolves.toEqual({ dica: 0, tempo_extra: 0, chance_extra: 0 });
  });

  it('converte falhas de rede em saldo e inventário vazios', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchAutenticado.mockRejectedValue(new Error('offline'));

    await expect(window.Estrelas.buscarSaldoEstrelas()).resolves.toBe(0);
    await expect(window.Estrelas.buscarInventario()).resolves.toEqual({ dica: 0, tempo_extra: 0, chance_extra: 0 });
    expect(erro).toHaveBeenCalledTimes(2);
  });

  it('não injeta a folha de estilos novamente quando o módulo é carregado outra vez', async () => {
    expect(document.querySelectorAll('#estrelas-css')).toHaveLength(1);

    await import('../../public/js/estrelas.js?segunda-carga');

    expect(document.querySelectorAll('#estrelas-css')).toHaveLength(1);
  });

  it('monta o badge e aplica animação de atualização somente quando solicitada', () => {
    expect(window.Estrelas.montarBadge(null, 5)).toBeTypeOf('function');

    const badge = document.createElement('div');
    const atualizar = window.Estrelas.montarBadge(badge, null);
    expect(badge.querySelector('.valor-estrelas')?.textContent).toBe('0');
    expect(badge.querySelector('img')?.getAttribute('alt')).toBe('Estrela');

    atualizar(17);
    expect(badge.querySelector('.valor-estrelas')?.textContent).toBe('17');
    expect(badge.classList.contains('pulso')).toBe(false);

    atualizar(19, true);
    expect(badge.querySelector('.valor-estrelas')?.textContent).toBe('19');
    expect(badge.classList.contains('pulso')).toBe(true);
  });

  it('anima ganhos positivos com origem ou no centro e remove a animação', () => {
    vi.useFakeTimers();
    window.innerWidth = 800;
    window.innerHeight = 600;

    window.Estrelas.animarGanho(0);
    window.Estrelas.animarGanho(-2);
    expect(document.querySelector('.flutuante-estrela-wrap')).toBeNull();

    window.Estrelas.animarGanho(5);
    const wrap = document.querySelector('.flutuante-estrela-wrap');
    const primeiro = wrap?.querySelector('.flutuante-estrela');
    expect(primeiro?.style.left).toBe('400px');
    expect(primeiro?.style.top).toBe('300px');
    expect(primeiro?.textContent).toContain('+5');

    const origem = document.createElement('button');
    origem.getBoundingClientRect = () => ({ left: 10, top: 20, width: 40, height: 30, right: 50, bottom: 50, x: 10, y: 20, toJSON: () => ({}) });
    window.Estrelas.animarGanho(3, origem);
    const animacoes = wrap?.querySelectorAll('.flutuante-estrela');
    expect(animacoes).toHaveLength(2);
    expect(animacoes?.[1].style.left).toBe('30px');
    expect(animacoes?.[1].style.top).toBe('20px');

    vi.advanceTimersByTime(1500);
    expect(wrap?.querySelectorAll('.flutuante-estrela')).toHaveLength(0);
  });
});
