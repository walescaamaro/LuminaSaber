// public/tela_exercicios/js/carregarQuestoes.js (substitua tudo)
export async function carregarQuestoes() {
    try {
        const resposta = await fetch('/api/questoes');
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

        localStorage.removeItem('resultadosQuestoes');

        let resultados       = [];
        let questRespondidas = 0;

        const questoesFiltradas = materiasSelecionadas.length > 0
            ? questoes.filter(q => materiasSelecionadas.includes(q.materia))
            : questoes;

        const todasQuestoes = [...questoesFiltradas].sort(() => Math.random() - 0.5);

        atualizarContadorMeta(questRespondidas, metaQuestoes);

        function salvarEVerificarMeta() {
            localStorage.setItem('resultadosQuestoes', JSON.stringify(resultados));
            atualizarContadorMeta(questRespondidas, metaQuestoes);

            if (metaQuestoes > 0 && questRespondidas >= metaQuestoes) {
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
                        <button type="button" class="btn-responder">Responder</button>
                        <span class="resultado" style="margin-left:10px; font-weight:700;"></span>
                    </form>
                `;

                lista.appendChild(div);

                const btn       = div.querySelector('.btn-responder');
                const resultado = div.querySelector('.resultado');

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

                    resultado.textContent = acertou
                        ? '✅ Acertou!'
                        : `❌ Errou! Correta: ${q.alternativas[q.correta]}`;
                    resultado.style.color = acertou ? 'green' : 'red';

                    btn.disabled = true;
                    btn.style.opacity = '0.6';
                    questRespondidas++;

                    resultados.push({
                        materia:          q.materia,
                        nivel:            q.nivel,
                        enunciado:        q.enunciado,
                        alternativas:     q.alternativas,
                        respostaEscolhida: q.alternativas[escolhido],
                        respostaCorreta:  q.alternativas[q.correta],
                        acertou
                    });

                    // ── NOVO: salva a resposta no banco, no histórico do usuário logado ──
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
                        }
                    })
                    .catch((err) => {
                        // Se falhar, não trava a experiência do aluno — o resultado
                        // já foi mostrado na tela normalmente. Mas registra no console
                        // pra dar pra investigar depois.
                        console.error('Erro de rede ao salvar no histórico:', err);
                    });

                    salvarEVerificarMeta();
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
            listaEl.innerHTML = "<p style='color: #d32f2f;'>❌ Não foi possível carregar as questões. Verifique se o servidor está rodando em http://localhost:3000</p>";
        }
    }
}

function atualizarContadorMeta(respondidas, meta) {
    const el = document.getElementById('contadorMeta');
    if (!el) return;
    el.textContent = meta > 0 ? `${respondidas} / ${meta}` : `${respondidas}`;
    if (meta > 0 && respondidas >= meta) el.style.color = '#16a34a';
}