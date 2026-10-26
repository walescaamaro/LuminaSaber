/**
 * Helper de avatar: mostra a foto enviada pelo usuário ou, se não houver
 * (ou se a imagem falhar ao carregar), as iniciais do nome.
 * Requer /css/avatar.css na página.
 */
(function () {
  function iniciais(nome) {
    const partes = String(nome || '').trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '?';
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primeira + ultima).toUpperCase();
  }

  // textContent/atributos (nunca innerHTML) para não abrir brecha de XSS.
  function renderizar(elemento, { nome, imageUrl }) {
    elemento.replaceChildren();

    if (!imageUrl) {
      elemento.textContent = iniciais(nome);
      return;
    }

    const img = document.createElement('img');
    img.alt = `Foto de perfil de ${nome}`;
    img.addEventListener('error', () => renderizar(elemento, { nome, imageUrl: null }));
    img.src = imageUrl;
    elemento.appendChild(img);
  }

  window.Avatar = { iniciais, renderizar };
})();