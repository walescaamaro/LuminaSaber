export async function carregarQuestoes() {
    const resposta = await fetch('./data/questoes.json');
    const questoes = await resposta.json();

    const lista = document.getElementById("listaQuestoes");
    const inputPesquisa = document.getElementById("pesquisa");

    const materiasSelecionadas = JSON.parse(localStorage.getItem("materias") || "[]");
    const questoesFiltradas = materiasSelecionadas.length > 0
        ? questoes.filter(q => materiasSelecionadas.includes(q.materia))
        : questoes;

    function exibirQuestoes(listaQuestoes) {
        lista.innerHTML = "";

        if (listaQuestoes.length === 0) {
            const semResultado = document.createElement("div");
            semResultado.classList.add("alert", "alert-warning");
            semResultado.textContent = "Nenhuma questão disponível para a seleção de disciplinas.";
            lista.appendChild(semResultado);
            return;
        }

        listaQuestoes.forEach((q, index) => {
            const div = document.createElement("div");
            div.classList.add("questao");

            const questaoHtml = `
                <span class="nivel">${q.nivel}</span>
                <p><strong>${q.enunciado}</strong></p>
                <form class="form-questao" data-pos="${index}">
                    ${q.alternativas.map((alt, i) => `
                        <div>
                            <label>
                                <input type="radio" name="questao-${index}" value="${i}"> ${alt}
                            </label>
                        </div>
                    `).join('')}
                    <button type="button" class="btn-responder">Responder</button>
                    <span class="resultado" style="margin-left:10px;font-weight:700;"></span>
                </form>
            `;

            div.innerHTML = questaoHtml;
            lista.appendChild(div);

            const btn = div.querySelector('.btn-responder');
            const resultado = div.querySelector('.resultado');

            btn.addEventListener('click', () => {
                const formQ = div.querySelector('.form-questao');
                const selecionada = formQ.querySelector('input[type="radio"]:checked');

                if (!selecionada) {
                    resultado.textContent = 'Selecione uma alternativa.';
                    resultado.style.color = 'orange';
                    return;
                }

                const escolhido = Number(selecionada.value);
                const indexCorreto = (typeof q.correta === 'number') ? q.correta : null;

                if (indexCorreto === null) {
                    resultado.textContent = 'Questão sem gabarito definido.';
                    resultado.style.color = 'gray';
                    return;
                }

                if (escolhido === indexCorreto) {
                    resultado.textContent = 'Acertou!';
                    resultado.style.color = 'green';
                } else {
                    resultado.textContent = `Errou. Correta: ${q.alternativas[indexCorreto]}`;
                    resultado.style.color = 'red';
                }
            });
        });
    }

    function buscarQuestoesPorTermos(questoes, query) {
        const termos = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

        if (termos.length === 0) {
            return questoes;
        }

        const resultado = questoes
            .map((q, index) => {
                const texto = `${q.materia} ${q.nivel} ${q.enunciado} ${q.alternativas.join(' ')}`.toLowerCase();
                const count = termos.reduce((acc, termo) => acc + (texto.includes(termo) ? 1 : 0), 0);
                return { q, index, count };
            })
            .filter(item => item.count > 0)
            .sort((a, b) => b.count - a.count || a.index - b.index);

        const perfeitos = resultado.filter(item => item.count >= termos.length);
        if (termos.length > 1 && perfeitos.length === 1) {
            return [perfeitos[0].q];
        }

        return resultado.slice(0, 3).map(item => item.q);
    }

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', () => {
            const filtro = inputPesquisa.value;
            const encontradas = buscarQuestoesPorTermos(questoesFiltradas, filtro);
            exibirQuestoes(encontradas);
        });
    }

    exibirQuestoes(questoesFiltradas);
}