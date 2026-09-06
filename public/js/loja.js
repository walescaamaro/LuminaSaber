/**
 * public/js/loja.js
 * Lógica da tela do Mercado Lumina.
 */

const ICONES_ITEM = {
    dica: '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a6 6 0 00-4 10.5c.6.55 1 1.32 1 2.15V16h6v-1.35c0-.83.4-1.6 1-2.15A6 6 0 0012 2z"/></svg>',
    tempo_extra: '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/></svg>',
    chance_extra: '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6a4.6 4.6 0 00-8-3.1L12 6.3l-.8-.8a4.6 4.6 0 10-6.5 6.5L12 19.4l7.3-7.4a4.58 4.58 0 001.5-3.4z"/></svg>',
};

let toastTimeout = null;

function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('avisoToast');
    if (!toast) return;
    toast.textContent = mensagem;
    toast.className = 'aviso-toast mostrar' + (tipo === 'erro' ? ' erro' : '');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 2600);
}

async function buscarJson(url, opcoes) {
    const res = await fetchAutenticado(url, opcoes);
    let dados = null;
    try {
        dados = await res.json();
    } catch (err) {
        throw new Error(`Resposta inválida do servidor em ${url} (status ${res.status}).`);
    }
    if (!res.ok) {
        throw new Error((dados && dados.error) || `Erro ${res.status} ao acessar ${url}.`);
    }
    return dados;
}

function renderizarItens(itens, saldo, inventario) {
    const grade = document.getElementById('gradeItens');
    grade.innerHTML = '';

    if (!Array.isArray(itens) || itens.length === 0) {
        grade.innerHTML = '<p class="msg-vazio">Nenhum item disponível no momento.</p>';
        return;
    }

    itens.forEach((item) => {
        const podeComprar = saldo >= item.custo;
        const possuiUnidades = (inventario && inventario[item.id]) || 0;

        const card = document.createElement('div');
        card.className = `item-card i-${item.id}`;
        card.innerHTML = `
            <span class="item-icone">${ICONES_ITEM[item.id] || ''}</span>
            <p class="item-nome">${item.nome}</p>
            <p class="item-desc">${item.descricao}</p>
            <span class="item-possui ${possuiUnidades > 0 ? '' : 'zero'}">
                ${possuiUnidades > 0 
                    ? `Você tem ${possuiUnidades} ${possuiUnidades > 1 ? 'disponíveis' : 'disponível'}`
                    : 'Nenhum disponível ainda'
            }
            </span>
            <div class="item-rodape">
                <span class="item-custo">${window.Estrelas.ICONE_ESTRELA_SVG}${item.custo}</span>
                <button class="btn-comprar" ${podeComprar ? '' : 'disabled'}>Comprar</button>
            </div>
        `;

        const btn = card.querySelector('.btn-comprar');
        btn.addEventListener('click', () => comprarItem(item, btn));

        grade.appendChild(card);
    });
}

function mostrarErroCarregamento(erro) {
    console.error('Erro ao carregar o Mercado Lumina:', erro);
    const grade = document.getElementById('gradeItens');
    grade.innerHTML = `
        <div class="msg-erro">
            <p>Não foi possível carregar os itens da loja.</p>
            <p class="msg-erro-detalhe">${(erro && erro.message) || 'Erro desconhecido.'}</p>
            <button class="btn-tentar-novo" id="btnTentarDeNovo">Tentar novamente</button>
        </div>
    `;
    const btn = document.getElementById('btnTentarDeNovo');
    if (btn) btn.addEventListener('click', () => carregarTudo());
}

async function comprarItem(item, botao) {
    botao.disabled = true;
    const textoOriginal = botao.textContent;
    botao.textContent = 'Comprando...';

    try {
        const dados = await buscarJson('/api/loja/comprar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: item.id }),
        });

        mostrarToast(`Compra realizada: ${item.nome}!`, 'sucesso');
        atualizarBadgeSaldo(dados.estrelas, true);
        await carregarTudo(dados.estrelas, dados.inventario);
    } catch (err) {
        console.error('Erro ao comprar item:', err);
        mostrarToast(err.message || 'Não foi possível concluir a compra.', 'erro');
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

let atualizarBadgeSaldo = function () {};

async function carregarTudo(saldoConhecido, inventarioConhecido) {
    try {
        const [itensRes, saldo, inventario] = await Promise.all([
            buscarJson('/api/loja/itens'),
            saldoConhecido !== undefined ? Promise.resolve(saldoConhecido) : window.Estrelas.buscarSaldoEstrelas(),
            inventarioConhecido !== undefined ? Promise.resolve(inventarioConhecido) : window.Estrelas.buscarInventario(),
        ]);

        renderizarItens(itensRes, saldo, inventario);
    } catch (err) {
        mostrarErroCarregamento(err);
    }
}

(async function iniciar() {
    try {
        const saldo = await window.Estrelas.buscarSaldoEstrelas();
        atualizarBadgeSaldo = window.Estrelas.montarBadge(document.getElementById('badgeSaldo'), saldo);
        await carregarTudo(saldo);
    } catch (err) {
        mostrarErroCarregamento(err);
    }
})();