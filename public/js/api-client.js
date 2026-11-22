const TOKEN_KEY = 'luminasaber_token';
const USER_KEY = 'luminasaber_user';

export async function fetchAutenticado(url, opcoes = {}, dependencias = {}) {
  const armazenamento = dependencias.armazenamento ?? localStorage;
  const buscar = dependencias.buscar ?? fetch;
  const token = armazenamento.getItem(TOKEN_KEY);

  const resposta = await buscar(url, {
    ...opcoes,
    headers: {
      ...(opcoes.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (resposta.status === 401) {
    armazenamento.removeItem(TOKEN_KEY);
    armazenamento.removeItem(USER_KEY);
    (dependencias.aoExpirar ?? (() => window.location.replace('/login')))();
    throw new Error('Sessão expirada.');
  }

  return resposta;
}
