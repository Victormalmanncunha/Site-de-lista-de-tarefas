const divTarefas = document.querySelector("#divTarefas")
let tarefas = JSON.parse(localStorage.getItem("concluidos"))

function mostrarTarefas(){
    divTarefas.innerHTML = ''
    for (const i in tarefas) {
        divTarefas.innerHTML += `<div style="box-shadow: 0.5rem 0.5rem rgb(92, 127, 160);background-color: lightgoldenrodyellow;purple;border-radius: 1rem;" class="tarefas"><h3>${tarefas[i].nomeTarefa}</h3><p style="font-size: 1.5rem;">${tarefas[i].dataTarefa}</p></div>`
    }
}
mostrarTarefas()