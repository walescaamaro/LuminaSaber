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
            <p class="alternativa">a) ${q.alternativas[0]}</p>
            <p class="alternativa">b) ${q.alternativas[1]}</p>
            <p class="alternativa">c) ${q.alternativas[2]}</p>
            <p class="alternativa">d) ${q.alternativas[3]}</p>
        `;

div.querySelectorAll(".alternativa").forEach(alt => {
    alt.addEventListener("click", () => {


        div.querySelectorAll(".alternativa").forEach(a => {
            a.style.backgroundColor = "";
        });

    
        alt.style.backgroundColor = "#c3e2f7";

    });
});

        lista.appendChild(div);
    });
}
