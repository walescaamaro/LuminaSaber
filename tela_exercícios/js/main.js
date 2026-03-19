import { carregarQuestoes } from './carregarQuestoes.js';
import { mostrarMaterias } from './filtros.js';

carregarQuestoes();
mostrarMaterias();

const input = document.getElementById("pesquisa");

input.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();

    const questoes = document.querySelectorAll(".questao");

    questoes.forEach(q => {
        const conteudo = q.innerText.toLowerCase();

        if (conteudo.includes(texto)) {
            q.style.display = "block";
        } else {
            q.style.display = "none";
        }
    });
});