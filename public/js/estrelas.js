/**
 * public/js/estrelas.js
 *
 * Helper compartilhado do sistema de moedas (Estrelas) do Mercado Lumina.
 * Inclua com <script src="/js/estrelas.js"></script> DEPOIS de /js/auth.js
 * em qualquer página autenticada. Expõe tudo em `window.Estrelas`.
 */

(function () {
  // ── Ícone da moeda: imagem em /img/estrela.png ──
  const ICONE_ESTRELA_SVG = '<img src="/img/estrela.png" alt="Estrela" class="icone-estrela-img">';

  // ── CSS injetado uma única vez (evita duplicar <style> em cada página) ──
  const CSS_ESTRELAS = `
    .icone-estrela-img { display: block; object-fit: contain; }

    .badge-estrelas {
      display: inline-flex; align-items: center; gap: 8px;
      background: #fff; border-radius: 999px; padding: 8px 16px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.12);
      font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: 15px;
      color: #16323d; user-select: none; position: relative;
    }
    .badge-estrelas .icone-estrela-img { width: 23px; height: 23px; flex-shrink: 0; }
    .badge-estrelas .valor-estrelas { min-width: 1ch; transition: transform .18s ease; }
    .badge-estrelas.pulso .valor-estrelas { animation: pulsoEstrela .5s ease; }

    @keyframes pulsoEstrela {
      0%   { transform: scale(1); }
      35%  { transform: scale(1.35); color: #d68f00; }
      100% { transform: scale(1); }
    }

    .flutuante-estrela-wrap {
      position: fixed; z-index: 9999; pointer-events: none;
      left: 0; top: 0; width: 0; height: 0;
    }
    .flutuante-estrela {
      position: absolute; display: flex; align-items: center; gap: 4px;
      background: #fff8e1; border: 2px solid #f4b400; color: #8a5a00;
      border-radius: 999px; padding: 5px 12px; font-weight: 800;
      font-size: 14px; font-family: 'DM Sans', sans-serif; white-space: nowrap;
      box-shadow: 0 8px 18px rgba(0,0,0,0.18);
      animation: subirEDesaparecer 1.4s ease forwards;
    }
    .flutuante-estrela .icone-estrela-img { width: 18px; height: 18px; }
    @keyframes subirEDesaparecer {
      0%   { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
      15%  { opacity: 1; transform: translate(-50%, -8px) scale(1.05); }
      75%  { opacity: 1; transform: translate(-50%, -54px) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -74px) scale(0.9); }
    }
  `;

  function injetarCssUmaVez() {
    if (document.getElementById('estrelas-css')) return;
    const style = document.createElement('style');
    style.id = 'estrelas-css';
    style.textContent = CSS_ESTRELAS;
    document.head.appendChild(style);
  }

  injetarCssUmaVez();

  // ── API ──
  async function buscarSaldoEstrelas() {
    try {
      const res = await fetchAutenticado('/api/loja/carteira');
      if (!res.ok) return 0;
      const dados = await res.json();
      return dados.estrelas ?? 0;
    } catch (err) {
      console.error('Erro ao buscar saldo de estrelas:', err);
      return 0;
    }
  }

  async function buscarInventario() {
    try {
      const res = await fetchAutenticado('/api/loja/inventario');
      if (!res.ok) return { dica: 0, tempo_extra: 0, chance_extra: 0 };
      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar inventário:', err);
      return { dica: 0, tempo_extra: 0, chance_extra: 0 };
    }
  }

  // ── Renderização ──
  // Monta o badge dentro de `container` e devolve uma função `atualizar(saldo)`.
  function montarBadge(container, saldoInicial) {
    if (!container) return function () {};
    container.classList.add('badge-estrelas');
    container.innerHTML =
      ICONE_ESTRELA_SVG + '<span class="valor-estrelas">' + (saldoInicial ?? 0) + '</span>';

    const valorEl = container.querySelector('.valor-estrelas');

    return function atualizar(novoSaldo, animar) {
      valorEl.textContent = novoSaldo;
      if (animar) {
        container.classList.remove('pulso');
        // força reflow pra permitir reiniciar a animação
        void container.offsetWidth;
        container.classList.add('pulso');
      }
    };
  }

  // Cria uma "+N" flutuante de estrelas subindo a partir de um elemento
  // de referência (ou do centro da tela, se nenhum for passado).
  function animarGanho(quantidade, elementoOrigem) {
    if (!quantidade || quantidade <= 0) return;

    let wrap = document.querySelector('.flutuante-estrela-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'flutuante-estrela-wrap';
      document.body.appendChild(wrap);
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (elementoOrigem) {
      const rect = elementoOrigem.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top;
    }

    const el = document.createElement('div');
    el.className = 'flutuante-estrela';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.innerHTML = ICONE_ESTRELA_SVG + '<span>+' + quantidade + '</span>';

    wrap.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  window.Estrelas = {
    ICONE_ESTRELA_SVG,
    buscarSaldoEstrelas,
    buscarInventario,
    montarBadge,
    animarGanho,
  };
})();