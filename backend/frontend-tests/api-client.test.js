import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAutenticado } from '../../public/js/api-client.js';

describe('fetchAutenticado', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('envia método, corpo, cabeçalhos e token e retorna a resposta de sucesso', async () => {
    localStorage.setItem('luminasaber_token', 'token-de-teste');
    const resposta = { status: 201, ok: true };
    const buscar = vi.fn().mockResolvedValue(resposta);

    const resultado = await fetchAutenticado('/api/anotacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Revisão' }),
    }, { buscar });

    expect(buscar).toHaveBeenCalledWith('/api/anotacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-de-teste',
      },
      body: JSON.stringify({ titulo: 'Revisão' }),
    });
    expect(resultado).toBe(resposta);
  });

  it('usa fetch e localStorage do navegador quando nenhuma dependência é injetada', async () => {
    const resposta = { status: 200, ok: true };
    const buscar = vi.fn().mockResolvedValue(resposta);
    vi.stubGlobal('fetch', buscar);

    await expect(fetchAutenticado('/api/anotacoes')).resolves.toBe(resposta);

    expect(buscar).toHaveBeenCalledWith('/api/anotacoes', {
      headers: { Authorization: 'Bearer null' },
    });
  });

  it('permite substituir fetch e localStorage globais por dublês controlados', async () => {
    const armazenamento = {
      getItem: vi.fn().mockReturnValue('token-mocado'),
      removeItem: vi.fn(),
    };
    const buscar = vi.fn().mockResolvedValue({ status: 200, ok: true });
    vi.stubGlobal('localStorage', armazenamento);
    vi.stubGlobal('fetch', buscar);

    const resposta = await fetchAutenticado('/api/perfil', { method: 'GET' });

    expect(resposta.status).toBe(200);
    expect(armazenamento.getItem).toHaveBeenCalledWith('luminasaber_token');
    expect(buscar).toHaveBeenCalledWith('/api/perfil', {
      method: 'GET',
      headers: { Authorization: 'Bearer token-mocado' },
    });
  });

  it('remove a sessão e rejeita a chamada quando a API responde 401', async () => {
    localStorage.setItem('luminasaber_token', 'token-expirado');
    localStorage.setItem('luminasaber_user', '{"nome":"Teste"}');
    const buscar = vi.fn().mockResolvedValue({ status: 401 });
    const aoExpirar = vi.fn();

    await expect(fetchAutenticado('/api/anotacoes', {}, { buscar, aoExpirar }))
      .rejects.toThrow('Sessão expirada.');

    expect(aoExpirar).toHaveBeenCalledOnce();
    expect(localStorage.getItem('luminasaber_token')).toBeNull();
    expect(localStorage.getItem('luminasaber_user')).toBeNull();
  });

  it('propaga falhas de rede e preserva a sessão em respostas que não são 401', async () => {
    localStorage.setItem('luminasaber_token', 'token-valido');
    const aoExpirar = vi.fn();

    await expect(fetchAutenticado('/api/anotacoes', {}, {
      buscar: vi.fn().mockRejectedValue(new TypeError('Falha de rede')),
      aoExpirar,
    })).rejects.toThrow('Falha de rede');
    expect(aoExpirar).not.toHaveBeenCalled();
    expect(localStorage.getItem('luminasaber_token')).toBe('token-valido');

    const respostaErro = { status: 500, ok: false };
    await expect(fetchAutenticado('/api/anotacoes', {}, {
      buscar: vi.fn().mockResolvedValue(respostaErro),
      aoExpirar,
    })).resolves.toBe(respostaErro);
    expect(localStorage.getItem('luminasaber_token')).toBe('token-valido');
  });

  it('envia Bearer null quando o token está ausente e não altera a sessão', async () => {
    const buscar = vi.fn().mockResolvedValue({ status: 404, ok: false });

    await fetchAutenticado('/api/inexistente', {}, { buscar });

    expect(buscar).toHaveBeenCalledWith('/api/inexistente', {
      headers: { Authorization: 'Bearer null' },
    });
    expect(localStorage.getItem('luminasaber_token')).toBeNull();
  });

  it('usa o redirecionamento padrão quando a sessão expira sem callback injetado', async () => {
    const replace = vi.fn();
    vi.stubGlobal('window', { location: { replace } });
    localStorage.setItem('luminasaber_token', 'token-expirado');
    const buscar = vi.fn().mockResolvedValue({ status: 401 });

    await expect(fetchAutenticado('/api/privado', {}, { buscar })).rejects.toThrow('Sessão expirada.');

    expect(replace).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('luminasaber_token')).toBeNull();
  });
});
