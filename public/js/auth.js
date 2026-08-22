/**
 * Helper de autenticação usado por todas as páginas privadas do LuminaSaber.
 */

const TOKEN_KEY = 'luminasaber_token';
const USER_KEY = 'luminasaber_user';

function salvarSessao(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

function obterToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function obterUsuario() {
  const bruto = localStorage.getItem(USER_KEY);
  return bruto ? JSON.parse(bruto) : null;
}

function estaAutenticado() {
  return Boolean(obterToken());
}

function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function protegerPagina() {
  if (!estaAutenticado()) {
    window.location.replace('/login');
    return;
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });
}

// CORRIGIDO: antes só checava se existia ALGUMA coisa no localStorage.
// Agora confirma com o servidor se o token ainda é válido antes de
// redirecionar — evita o loop infinito quando o token expirou mas
// continuava salvo no navegador.
async function redirecionarSeAutenticado() {
  const token = obterToken();
  if (!token) return;

  try {
    const res = await fetch('/api/usuarios/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      window.location.replace('/painel');
    } else {
      // Token velho/expirado: limpa e deixa a pessoa na tela normalmente.
      limparSessao();
    }
  } catch (err) {
    // Falha de rede: não redireciona, não trava a tela.
  }
}

async function fetchAutenticado(url, opcoes = {}) {
  const token = obterToken();

  const resposta = await fetch(url, {
    ...opcoes,
    headers: { ...(opcoes.headers || {}), Authorization: `Bearer ${token}` },
  });

  if (resposta.status === 401) {
    limparSessao();
    window.location.replace('/login');
    throw new Error('Sessão expirada.');
  }

  return resposta;
}

async function sair() {
  try {
    await fetchAutenticado('/api/usuarios/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    // Ignorado de propósito.
  } finally {
    limparSessao();
    window.location.replace('/login');
  }
}