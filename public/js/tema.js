/**
 * public/js/tema.js
 *
 * Alterna entre tema claro (padrão, tons pastéis) e escuro.
 * Inclua este script BEM NO TOPO do <head> (antes do <link> de CSS,
 * logo depois de /js/auth.js) pra evitar o "flash" do tema errado.
 *
 * Uso:
 *   <script src="/js/tema.js"></script>          <!-- aplica o tema salvo -->
 *   ...
 *   <div id="botaoTema"></div>
 *   <script>window.Tema.montarBotao(document.getElementById('botaoTema'));</script>
 */
(function () {
  const CHAVE = 'luminasaber_tema';

  const ICONE_LUA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>';
  const ICONE_SOL =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function temaSalvo() {
    return localStorage.getItem(CHAVE) || 'claro';
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
  }

  // Aplica imediatamente (antes do body renderizar) pra evitar flash.
  aplicarTema(temaSalvo());

  function atualizarIconeBotao(btn) {
    const escuro = document.documentElement.getAttribute('data-tema') === 'escuro';
    btn.innerHTML = escuro ? ICONE_SOL : ICONE_LUA;
    const rotulo = escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro';
    btn.setAttribute('aria-label', rotulo);
    btn.title = rotulo;
  }

  function alternarTema() {
    const atual = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'escuro' : 'claro';
    const novo = atual === 'escuro' ? 'claro' : 'escuro';
    localStorage.setItem(CHAVE, novo);
    aplicarTema(novo);
    document.querySelectorAll('.btn-tema').forEach(atualizarIconeBotao);
  }

  function montarBotao(container) {
    if (!container) return;
    container.classList.add('btn-tema');
    container.setAttribute('type', 'button');
    atualizarIconeBotao(container);
    container.addEventListener('click', alternarTema);
  }

  window.Tema = { montarBotao, alternarTema };
})();