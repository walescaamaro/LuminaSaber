/**
 * Carrega as questões da API e exibe na tela com filtro por disciplina e busca.
 * Integra com localStorage para persistência de respostas e acompanhamento de meta.
 *
 * MODIFICADO: agora salva dados completos de cada questão (enunciado, nível,
 * resposta escolhida, resposta correta) para permitir análise de IA no relatório.
 */
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

        // Limpar resultados anteriores
        localStorage.removeItem('resultadosQuestoes');

        let resultados       = [];
        let questRespondidas = 0;

        // Filtrar pelas matérias selecionadas
        const questoesFiltradas = materiasSelecionadas.length > 0
            ? questoes.filter(q => materiasSelecionadas.includes(q.materia))
            : questoes;

        // Embaralhar para variar a ordem
        const todasQuestoes = [...questoesFiltradas].sort(() => Math.random() - 0.5);

        atualizarContadorMeta(questRespondidas, metaQuestoes);

        /**
         * Salva os resultados no localStorage e verifica se a meta foi atingida.
         * Se atingida, redireciona para a tela de relatório.
         */
        function salvarEVerificarMeta() {
            localStorage.setItem('resultadosQuestoes', JSON.stringify(resultados));
            atualizarContadorMeta(questRespondidas, metaQuestoes);

            // Se bateu a meta, vai para o relatório após 1.5s
            if (metaQuestoes > 0 && questRespondidas >= metaQuestoes) {
                const avisoMeta = document.getElementById('avisoMeta');
                if (avisoMeta) avisoMeta.style.display = 'block';
                setTimeout(() => { window.location.href = '/relatorio'; }, 1500);
            }
        }

        /**
         * Renderiza a lista de questões no DOM.
         * Cada questão exibe enunciado, alternativas e feedback de acerto/erro.
         * @param {Array} listaQuestoes - Array de questões a exibir
         */
        function exibirQuestoes(listaQuestoes) {
            lista.innerHTML = "";

            if (listaQuestoes.length === 0) {
                lista.innerHTML = "<p style='color: #999; font-style: italic;'>Nenhuma questão disponível para as disciplinas selecionadas.</p>";
                return;
            }

            // Exibe TODAS as questões — o usuário escolhe quantas quer responder
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

                    // ── MODIFICADO: salva dados completos da questão ──
                    resultados.push({
                        materia:          q.materia,
                        nivel:            q.nivel,
                        enunciado:        q.enunciado,
                        alternativas:     q.alternativas,
                        respostaEscolhida: q.alternativas[escolhido],
                        respostaCorreta:  q.alternativas[q.correta],
                        acertou
                    });

                    salvarEVerificarMeta();
                });
            });
        }

        // Evento de busca/filtro em tempo real
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

        // Exibe todas as questões disponíveis inicialmente
        exibirQuestoes(todasQuestoes);

    } catch (erro) {
        console.error("Erro ao carregar questões:", erro);
        const listaEl = document.getElementById("listaQuestoes");
        if (listaEl) {
            listaEl.innerHTML = "<p style='color: #d32f2f;'>❌ Não foi possível carregar as questões. Verifique se o servidor está rodando em http://localhost:3000</p>";
        }
    }
}

/**
 * Atualiza o contador de questões respondidas na tela.
 * Muda a cor para verde quando a meta é atingida.
 * @param {number} respondidas - Quantidade de questões respondidas
 * @param {number} meta - Meta de questões a responder (0 = sem meta)
 */
function atualizarContadorMeta(respondidas, meta) {
    const el = document.getElementById('contadorMeta');
    if (!el) return;
    el.textContent = meta > 0 ? `${respondidas} / ${meta}` : `${respondidas}`;
    if (meta > 0 && respondidas >= meta) el.style.color = '#16a34a';
}