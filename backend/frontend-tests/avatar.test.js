import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../public/js/avatar.js';

describe('Avatar', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('gera iniciais para nomes compostos, simples e ausentes', () => {
    expect(window.Avatar.iniciais('  Ana Maria Silva ')).toBe('AS');
    expect(window.Avatar.iniciais('Ravi')).toBe('R');
    expect(window.Avatar.iniciais('   ')).toBe('?');
    expect(window.Avatar.iniciais(undefined)).toBe('?');
  });

  it('renderiza iniciais com textContent quando não há imagem', () => {
    const avatar = document.createElement('div');
    avatar.innerHTML = '<span>conteúdo antigo</span>';

    window.Avatar.renderizar(avatar, { nome: '<script>alert(1)</script>', imageUrl: null });

    expect(avatar.textContent).toBe('<');
    expect(avatar.querySelector('img')).toBeNull();
  });

  it('mostra a imagem e recua para iniciais quando o carregamento falha', () => {
    const avatar = document.createElement('div');
    const spy = vi.fn();
    avatar.addEventListener('click', spy);

    window.Avatar.renderizar(avatar, { nome: 'Ana Silva', imageUrl: '/uploads/ana.png' });
    const imagem = avatar.querySelector('img');

    expect(imagem?.getAttribute('alt')).toBe('Foto de perfil de Ana Silva');
    expect(imagem?.getAttribute('src')).toBe('/uploads/ana.png');
    imagem?.dispatchEvent(new Event('error'));

    expect(avatar.textContent).toBe('AS');
    expect(avatar.querySelector('img')).toBeNull();
    avatar.click();
    expect(spy).toHaveBeenCalledOnce();
  });
});
