export function mostrarMaterias() {

    const materias = JSON.parse(localStorage.getItem("materias")) || [];

    const area = document.getElementById("materiasSelecionadas");

    materias.forEach(materia => {
        const div = document.createElement("div");
        div.classList.add("materia-box");
        div.textContent = materia;
        area.appendChild(div);
    });

}