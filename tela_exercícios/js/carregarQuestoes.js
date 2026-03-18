export async function carregarQuestoes() {
    const resposta = await fetch('./data/questoes.json');
    const questoes = await resposta.json();

    const lista = document.getElementById("listaQuestoes");

    questoes.forEach((q, index) => {
        const div = document.createElement("div");

        div.classList.add("questao");

        div.innerHTML = `
            <span class="nivel">${q.nivel}</span>
            <h4>Questão ${index + 1}</h4>
            <p><strong>${q.enunciado}</strong></p>
            <p>a) ${q.alternativas[0]}</p>
            <p>b) ${q.alternativas[1]}</p>
            <p>c) ${q.alternativas[2]}</p>
            <p>d) ${q.alternativas[3]}</p>
        `;

        lista.appendChild(div);
    });
}