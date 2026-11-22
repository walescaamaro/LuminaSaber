import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../../public/js/auth.js';

const auth = window.Auth;

describe('helpers de autenticação do navegador', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('salva, lê e limpa os dados de sessão, rejeitando JSON de usuário inválido', () => {
    expect(auth.obterToken()).toBeNull();
    expect(auth.obterUsuario()).toBeNull();
    expect(auth.estaAutenticado()).toBe(false);

    auth.salvarSessao('token-valido', { nome: 'Ana' });
    expect(auth.obterToken()).toBe('token-valido');
    expect(auth.obterUsuario()).toEqual({ nome: 'Ana' });
    expect(auth.estaAutenticado()).toBe(true);

    localStorage.setItem('luminasaber_user', '{json inválido');
    expect(() => auth.obterUsuario()).toThrow(SyntaxError);

    auth.limparSessao();
    expect(auth.obterToken()).toBeNull();
    expect(auth.obterUsuario()).toBeNull();
  });

  it('protege a página sem sessão e recarrega a página restaurada pelo cache do navegador', () => {
    const replace = vi.fn();
    const reload = vi.fn();
    let onPageShow;
    vi.stubGlobal('window', {
      location: { replace },
      addEventListener: vi.fn((event, callback) => {
        if (event === 'pageshow') onPageShow = callback;
      }),
    });
    window.location.reload = reload;

    auth.protegerPagina();
    expect(replace).toHaveBeenCalledWith('/login');

    auth.salvarSessao('token-valido', { nome: 'Ana' });
    auth.protegerPagina();
    expect(window.addEventListener).toHaveBeenCalledWith('pageshow', expect.any(Function));
    onPageShow({ persisted: false });
    expect(reload).not.toHaveBeenCalled();
    onPageShow({ persisted: true });
    expect(reload).toHaveBeenCalledOnce();
  });

  it('redireciona sessão válida e limpa token rejeitado, mas mantém sessão em falha de rede', async () => {
    const replace = vi.fn();
    vi.stubGlobal('window', { location: { replace } });
    const buscar = vi.fn()
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: false })
      .mockRejectedValueOnce(new TypeError('offline'));
    vi.stubGlobal('fetch', buscar);

    await auth.redirecionarSeAutenticado();
    expect(buscar).not.toHaveBeenCalled();

    auth.salvarSessao('token-valido', { nome: 'Ana' });
    await auth.redirecionarSeAutenticado();
    expect(replace).toHaveBeenCalledWith('/painel');
    expect(buscar).toHaveBeenLastCalledWith('/api/usuarios/perfil', {
      headers: { Authorization: 'Bearer token-valido' },
    });

    await auth.redirecionarSeAutenticado();
    expect(auth.obterToken()).toBeNull();

    auth.salvarSessao('token-temporario', { nome: 'Ana' });
    await auth.redirecionarSeAutenticado();
    expect(auth.obterToken()).toBe('token-temporario');
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('envia logout e sempre encerra a sessão local mesmo quando a API falha', async () => {
    const replace = vi.fn();
    vi.stubGlobal('window', { location: { replace } });
    const buscar = vi.fn().mockResolvedValue({ status: 200 });
    vi.stubGlobal('fetch', buscar);
    auth.salvarSessao('token-valido', { nome: 'Ana' });

    await auth.sair();

    expect(auth.obterToken()).toBeNull();
    expect(auth.obterUsuario()).toBeNull();
    expect(replace).toHaveBeenCalledWith('/login');
    expect(buscar).toHaveBeenCalledWith('/api/usuarios/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-valido' },
    });

    buscar.mockRejectedValueOnce(new TypeError('offline'));
    auth.salvarSessao('token-offline', { nome: 'Ana' });
    await auth.sair();
    expect(auth.obterToken()).toBeNull();
    expect(replace).toHaveBeenCalledTimes(2);
  });
});
