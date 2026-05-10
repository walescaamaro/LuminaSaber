export async function carregarQuestoes() {
    try {
        // Busca questões da API do servidor
        const resposta = await fetch('/api/questoes');
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const questoes = await resposta.json();

        const lista = document.getElementById("listaQuestoes");
        const inputPesquisa = document.getElementById("pesquisa");

        // Filtra pelas matérias que o usuário selecionou na tela anterior
        const materiasSelecionadas = JSON.parse(localStorage.getItem("materias") || "[]");
        const questoesFiltradas = materiasSelecionadas.length > 0
            ? questoes.filter(q => materiasSelecionadas.includes(q.materia))
            : questoes;

        function exibirQuestoes(listaQuestoes) {
            lista.innerHTML = "";

            if (listaQuestoes.length === 0) {
                lista.innerHTML = "<p>Nenhuma questão disponível para as disciplinas selecionadas.</p>";
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
                                <label>
                                    <input type="radio" name="questao-${index}" value="${i}"> ${alt}
                                </label>
                            </div>
                        `).join('')}
                        <button type="button" class="btn-responder">Responder</button>
                        <span class="resultado" style="margin-left:10px; font-weight:700;"></span>
                    </form>
                `;

                lista.appendChild(div);

                const btn = div.querySelector('.btn-responder');
                const resultado = div.querySelector('.resultado');

                btn.addEventListener('click', () => {
                    const selecionada = div.querySelector('input[type="radio"]:checked');

                    if (!selecionada) {
                        resultado.textContent = 'Selecione uma alternativa!';
                        resultado.style.color = 'orange';
                        return;
                    }

                    const escolhido = Number(selecionada.value);

                    if (escolhido === q.correta) {
                        resultado.textContent = '✅ Acertou!';
                        resultado.style.color = 'green';
                    } else {
                        resultado.textContent = `❌ Errou! Correta: ${q.alternativas[q.correta]}`;
                        resultado.style.color = 'red';
                    }

                    // Desabilita o botão após responder
                    btn.disabled = true;
                });
            });
        }

        // Pesquisa por termos
        if (inputPesquisa) {
            inputPesquisa.addEventListener('input', () => {
                const termo = inputPesquisa.value.toLowerCase();
                const encontradas = questoesFiltradas.filter(q =>
                    q.enunciado.toLowerCase().includes(termo) ||
                    q.materia.toLowerCase().includes(termo)
                );
                exibirQuestoes(encontradas);
            });
        }

        exibirQuestoes(questoesFiltradas);

    } catch (erro) {
        console.error("Erro ao carregar questões:", erro);
        document.getElementById("listaQuestoes").innerHTML =
            "<p>Não foi possível carregar as questões. Verifique se o servidor está rodando.</p>";
    }
}