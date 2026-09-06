// public/tela_exercicios/js/carregarQuestoes.js (substitua tudo)

// Saldo de benefícios do Mercado Lumina ainda não usados nesta sessão.
// Carregado uma vez no início e atualizado a cada uso.
let estadoBeneficios = { dica: 0, tempo_extra: 0, chance_extra: 0 };

export async function carregarQuestoes() {
    try {
        const [resposta] = await Promise.all([
            fetch('/api/questoes'),
            carregarBeneficiosIniciais(),
        ]);
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const questoes = await resposta.json();

        const lista         = document.getElementById("listaQuestoes");
        const inputPesquisa = document.getElementById("pesquisa");

        if (!lista) {
            console.warn("Elemento 'listaQuestoes' não encontrado no DOM");
            return;
        }

        const materiasSelecionadas = JSON.parse(localStorage.getItem("materias") || "[]");
        const metaQuestoes         = parseInt(localStorage.getItem("metaQuestoes") || "0");

        // Nova sessão: limpa resultados antigos e a marcação de recompensa
        // de sessão já resgatada (ver /relatorio), pra não herdar estado
        // de uma sessão anterior.
        localStorage.removeItem('resultadosQuestoes');
        localStorage.removeItem('recompensaSessaoResgatada');

        let resultados       = [];
        let questRespondidas = 0;

        const questoesFiltradas = materiasSelecionadas.length > 0
            ? questoes.filter(q => materiasSelecionadas.includes(q.materia))
            : questoes;

        const todasQuestoes = [...questoesFiltradas].sort(() => Math.random() - 0.5);

        atualizarContadorMeta(questRespondidas, metaQuestoes);

        function salvarEVerificarMeta(acertou) {
            localStorage.setItem('resultadosQuestoes', JSON.stringify(resultados));
            atualizarContadorMeta(questRespondidas, metaQuestoes);

            const podeConcluir = acertou || estadoBeneficios.chance_extra <= 0;
            if (metaQuestoes > 0 && questRespondidas >= metaQuestoes && podeConcluir) {
                const avisoMeta = document.getElementById('avisoMeta');
                if (avisoMeta) avisoMeta.style.display = 'block';
                setTimeout(() => { window.location.href = '/relatorio'; }, 1500);
            }
        }

        function exibirQuestoes(listaQuestoes) {
            lista.innerHTML = "";

            if (listaQuestoes.length === 0) {
                lista.innerHTML = "<p style='color: #999; font-style: italic;'>Nenhuma questão disponível para as disciplinas selecionadas.</p>";
                return;
            }

            listaQuestoes.forEach((q, index) => {
                const div = document.createElement("div");
                div.classList.add("questao");

                div.innerHTML = `
                    <span class="nivel">${q.nivel}</span>
                    <p><strong>${q.enunciado}</strong></p>
                    <form class="form-questao">
                        ${q.alternativas.map((alt, i) => `
                            <div>
                                <label class="alternativa">
                                    <input type="radio" name="questao-${index}" value="${i}"> ${alt}
                                </label>
                            </div>
                        `).join('')}
                        <div class="acoes-questao">
                            <button type="button" class="btn-responder">Responder</button>
                            <button type="button" class="btn-dica" title="Usar dica: elimina uma alternativa errada">
                                Usar dica <span class="qtd-dica-btn">(${estadoBeneficios.dica})</span>
                            </button>
                        </div>
                        <span class="resultado" style="margin-left:10px; font-weight:700;"></span>
                    </form>
                `;

                lista.appendChild(div);

                const btn        = div.querySelector('.btn-responder');
                const btnDica    = div.querySelector('.btn-dica');
                const resultado  = div.querySelector('.resultado');

                // Controla se essa questão já foi contabilizada na meta.
                // Ao usar uma "chance extra" pra tentar de novo, a mesma
                // questão não deve contar 2x — só atualizamos o resultado
                // final dela.
                let jaContabilizada = false;
                let indiceResultado = -1;

                atualizarBotaoDica(btnDica);

                btnDica.addEventListener('click', async () => {
                    if (btnDica.disabled) return;
                    await usarDicaNaQuestao(div, q, btnDica);
                });

                btn.addEventListener('click', () => {
                    if (btn.disabled) return;

                    const selecionada = div.querySelector('input[type="radio"]:checked');
                    if (!selecionada) {
                        resultado.textContent = 'Selecione uma alternativa!';
                        resultado.style.color = 'orange';
                        return;
                    }

                    const escolhido = Number(selecionada.value);
                    const acertou   = escolhido === q.correta;

                    btn.disabled = true;
                    btn.style.opacity = '0.6';
                    btnDica.disabled = true;
                    btnDica.style.display = 'none';

                    const entrada = {
                        materia:          q.materia,
                        nivel:            q.nivel,
                        enunciado:        q.enunciado,
                        alternativas:     q.alternativas,
                        respostaEscolhida: q.alternativas[escolhido],
                        respostaCorreta:  q.alternativas[q.correta],
                        acertou
                    };

                    if (!jaContabilizada) {
                        // Primeira tentativa nessa questão: conta pra meta.
                        jaContabilizada = true;
                        questRespondidas++;
                        indiceResultado = resultados.length;
                        resultados.push(entrada);
                    } else {
                        // Nova tentativa (via chance extra): substitui o
                        // resultado anterior dessa mesma questão, sem
                        // contar de novo pra meta.
                        resultados[indiceResultado] = entrada;
                    }

                    // ── Salva a resposta no banco, no histórico do usuário logado ──
                    const letras = ['a', 'b', 'c', 'd'];
                    fetchAutenticado('/api/historico', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cod_quest: q.id, alternativa: letras[escolhido] })
                    })
                    .then(async (res) => {
                        if (!res.ok) {
                            const erro = await res.json().catch(() => ({}));
                            console.error('Falha ao salvar no histórico:', res.status, erro);
                            resultado.textContent = acertou ? 'Acertou!' : textoErro(q);
                            resultado.style.color = acertou ? 'green' : 'red';
                            if (!acertou) exibirBotaoChance(div, resultado, btn);
                            salvarEVerificarMeta(acertou);
                            return;
                        }

                        const dados = await res.json();

                        resultado.textContent = acertou
                            ? (dados.estrelasGanhas > 0 ? 'Acertou! Você corrigiu um erro anterior.' : 'Acertou!')
                            : textoErro(q);
                        resultado.style.color = acertou ? 'green' : 'red';

                        if (dados.estrelasGanhas > 0 && window.Estrelas) {
                            window.Estrelas.animarGanho(dados.estrelasGanhas, resultado);
                            atualizarSaldoNaTela();
                        }

                        if (!acertou) {
                            exibirBotaoChance(div, resultado, btn);
                        }
                        salvarEVerificarMeta(acertou);
                    })
                    .catch((err) => {
                        // Se falhar, não trava a experiência do aluno — o resultado
                        // já foi mostrado na tela normalmente. Mas registra no console
                        // pra dar pra investigar depois.
                        console.error('Erro de rede ao salvar no histórico:', err);
                        resultado.textContent = acertou ? 'Acertou!' : textoErro(q);
                        resultado.style.color = acertou ? 'green' : 'red';
                        if (!acertou) exibirBotaoChance(div, resultado, btn);
                        salvarEVerificarMeta(acertou);
                    });
                });
            });
        }

        if (inputPesquisa) {
            inputPesquisa.addEventListener('input', () => {
                const termo = inputPesquisa.value.toLowerCase();
                const encontradas = todasQuestoes.filter(q =>
                    q.enunciado.toLowerCase().includes(termo) ||
                    q.materia.toLowerCase().includes(termo)
                );
                exibirQuestoes(encontradas);
            });
        }

        exibirQuestoes(todasQuestoes);

    } catch (erro) {
        console.error("Erro ao carregar questões:", erro);
        const listaEl = document.getElementById("listaQuestoes");
        if (listaEl) {
            listaEl.innerHTML = "<p style='color: #d32f2f;'>Não foi possível carregar as questões. Verifique se o servidor está rodando em http://localhost:3000</p>";
        }
    }
}

function atualizarContadorMeta(respondidas, meta) {
    const el = document.getElementById('contadorMeta');
    if (!el) return;
    el.textContent = meta > 0 ? `${respondidas} / ${meta}` : `${respondidas}`;
    if (meta > 0 && respondidas >= meta) el.style.color = '#16a34a';
}

// ── Mercado Lumina: dicas, chances extras e tempo extra ──

async function carregarBeneficiosIniciais() {
    if (!window.Estrelas) return;
    estadoBeneficios = await window.Estrelas.buscarInventario();
    renderizarPainelBeneficios();
}

function atualizarSaldoNaTela() {
    const badge = document.getElementById('badgeSaldoLateral');
    if (badge && window.Estrelas) {
        window.Estrelas.buscarSaldoEstrelas().then((saldo) => {
            const valorEl = badge.querySelector('.valor-estrelas');
            if (valorEl) {
                valorEl.textContent = saldo;
                badge.classList.remove('pulso');
                void badge.offsetWidth;
                badge.classList.add('pulso');
            }
        });
    }
}

function renderizarPainelBeneficios() {
    const qtdDica   = document.getElementById('qtdDica');
    const qtdChance = document.getElementById('qtdChance');
    const qtdTempo  = document.getElementById('qtdTempo');
    const btnTempo  = document.getElementById('btnUsarTempo');

    if (qtdDica)   qtdDica.textContent = estadoBeneficios.dica;
    if (qtdChance) qtdChance.textContent = estadoBeneficios.chance_extra;
    if (qtdTempo)  qtdTempo.textContent = estadoBeneficios.tempo_extra;
    if (btnTempo)  btnTempo.disabled = estadoBeneficios.tempo_extra <= 0;

    document.querySelectorAll('.qtd-dica-btn').forEach((el) => {
        el.textContent = `(${estadoBeneficios.dica})`;
    });
    document.querySelectorAll('.btn-dica').forEach(atualizarBotaoDica);
}

function atualizarBotaoDica(btnDica) {
    if (btnDica.style.display === 'none') return;
    btnDica.disabled = estadoBeneficios.dica <= 0;
}

async function usarBeneficio(tipo) {
    const res = await fetchAutenticado('/api/loja/usar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo }),
    });
    if (!res.ok) {
        const erro = await res.json().catch(() => ({}));
        throw new Error(erro.error || 'BENEFICIO_INDISPONIVEL');
    }
    const dados = await res.json();
    estadoBeneficios = dados.inventario;
    renderizarPainelBeneficios();
    return dados.inventario;
}

async function usarDicaNaQuestao(div, q, btnDica) {
    btnDica.disabled = true;
    try {
        await usarBeneficio('dica');

        const labels = Array.from(div.querySelectorAll('.alternativa'));
        const candidatas = labels.filter((label, i) => i !== q.correta && !label.classList.contains('alternativa-eliminada'));

        if (candidatas.length > 0) {
            const escolhida = candidatas[Math.floor(Math.random() * candidatas.length)];
            escolhida.classList.add('alternativa-eliminada');
            const input = escolhida.querySelector('input');
            if (input) input.disabled = true;
        }
    } catch (err) {
        console.error('Erro ao usar dica:', err);
    } finally {
        atualizarBotaoDica(btnDica);
    }
}

// Mensagem de erro exibida ao errar uma questão. Enquanto o aluno ainda
// tiver "chances extras" disponíveis, a resposta certa fica escondida —
// só é revelada quando ele gastar todas as chances e mesmo assim errar.
function textoErro(q) {
    if (estadoBeneficios.chance_extra > 0) {
        return 'Você errou! Use uma chance extra para tentar de novo.';
    }
    return `Errou! Correta: ${q.alternativas[q.correta]}`;
}

// Mostra, ao lado do resultado de uma questão errada, um botão pra usar
// uma "chance extra" comprada no Mercado Lumina — ela reabre a questão
// pra uma nova tentativa (e, se acertar dessa vez, ainda ganha as
// Estrelas de "corrigiu um erro").
function exibirBotaoChance(div, resultadoEl, btnResponder) {
    if (estadoBeneficios.chance_extra <= 0) return;
    if (div.querySelector('.btn-chance')) return;

    const btnChance = document.createElement('button');
    btnChance.type = 'button';
    btnChance.className = 'btn-chance';
    btnChance.textContent = 'Usar chance extra e tentar de novo';
    resultadoEl.insertAdjacentElement('afterend', btnChance);

    btnChance.addEventListener('click', async () => {
        btnChance.disabled = true;
        try {
            await usarBeneficio('chance_extra');

            // Reabre a questão pra nova tentativa (alternativas já
            // eliminadas por uma dica continuam eliminadas).
            div.querySelectorAll('.alternativa').forEach((label) => {
                const input = label.querySelector('input[type="radio"]');
                if (!input) return;
                if (!label.classList.contains('alternativa-eliminada')) {
                    input.disabled = false;
                }
                input.checked = false;
            });
            btnResponder.disabled = false;
            btnResponder.style.opacity = '1';
            resultadoEl.textContent = '';
            btnChance.remove();
        } catch (err) {
            console.error('Erro ao usar chance extra:', err);
            btnChance.disabled = false;
        }
    });
}

// Chamado pelo botão "+5 min" na barra lateral (ver exercicios.html).
window.usarTempoExtraNaSessao = async function () {
    try {
        await usarBeneficio('tempo_extra');
        if (typeof window.adicionarTempoExtra === 'function') {
            window.adicionarTempoExtra(5 * 60);
        }
    } catch (err) {
        console.error('Erro ao usar tempo extra:', err);
    }
};