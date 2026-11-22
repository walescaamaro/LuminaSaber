import { afterEach, describe, expect, it } from 'vitest';
import '../../public/js/tema.js';

describe('Tema', () => {
  afterEach(() => {
    localStorage.clear();
    document.querySelectorAll('.btn-tema').forEach((button) => button.remove());
  });

  it('aplica tema claro inicial e ignora container ausente', () => {
    expect(document.documentElement.getAttribute('data-tema')).toBe('claro');
    expect(() => window.Tema.montarBotao(null)).not.toThrow();
  });

  it('alterna tema, persiste a escolha e atualiza o nome acessível', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    window.Tema.montarBotao(button);

    expect(button.getAttribute('aria-label')).toBe('Mudar para tema escuro');
    expect(button.getAttribute('type')).toBe('button');

    button.click();
    expect(document.documentElement.getAttribute('data-tema')).toBe('escuro');
    expect(localStorage.getItem('luminasaber_tema')).toBe('escuro');
    expect(button.getAttribute('aria-label')).toBe('Mudar para tema claro');

    button.click();
    expect(document.documentElement.getAttribute('data-tema')).toBe('claro');
    expect(localStorage.getItem('luminasaber_tema')).toBe('claro');
    expect(button.getAttribute('aria-label')).toBe('Mudar para tema escuro');
  });
});
