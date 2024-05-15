const divCriacaoTarefa = document.querySelector("#criacaoTarefa")
const divTarefas = document.querySelector("#divTarefas")
const inputCriacao = document.querySelector(".inputCriacao")
const divEdicaoTarefa = document.querySelector("#edicaoTarefa")
const btnCriar = document.querySelector("#btnCriar")

const nomeCriacaoTarefa = document.querySelector("#nomeCriacaoTarefa")
const dataCriacaoTarefa = document.querySelector("#dataCriacaoTarefa")
const descricaoCriacaoTarefa = document.querySelector("#descricaoCriacaoTarefa")
const prioridadeCriacaoTarefa = document.querySelector("#prioridadeCriacao")
const repetirCriacaoCheck = document.querySelector("#repetirCriacaoCheck")
const divRepetirDiasCriacao = document.querySelector("#diasRepeticaoCriacao")
const repetirDiasCriacao = document.querySelector("#repetirDiasCriacao")


const nomeEdicaoTarefa = document.querySelector("#nomeTarefaEdt")
const dataEdicaoTarefa = document.querySelector("#diaDeEntregaEdt")
const descricaoEdicaoTarefa = document.querySelector("#descricaoTarefaEdt")
const prioridadeEdicaoTarefa = document.querySelector("#prioridadeEdt")
const repetirEdicaoCheck = document.querySelector("#repetirCheckEdt")
const divRepetirDiasEdicao = document.querySelector("#diasRepeticaoEdt")
const repetirDiasEdicao = document.querySelector("#repetirDiasEdt")

const filtragem = document.querySelector("#filtragem")

let tarefas = []

function mostrarCriarTarefa() {
    cancelarEdicaoTarefa()
    divCriacaoTarefa.style = "display: inline-block;"
    btnCriar.style = "display: none;"
    repetirCriacaoCheck.checked = false
    divRepetirDiasCriacao.style ="display: none;"
    
}

function cancelarCriarTarefa(){
    divCriacaoTarefa.style = "display: none;"
    btnCriar.style = "display: inline-block;"
}

function mostrarRepetir(){
    repetirCriacaoCheck.addEventListener('change', () => {
        if(repetirCriacaoCheck.checked) {
            divRepetirDiasCriacao.style = "display: inline-block;"
        }else{
            divRepetirDiasCriacao.style = "display: none;"
        }
    })
    repetirEdicaoCheck.addEventListener('change', () => {
        if(repetirEdicaoCheck.checked) {
            divRepetirDiasEdicao.style = "display: inline-block;"
        }else{
            divRepetirDiasEdicao.style = "display: none;"
        }
    })
}
mostrarRepetir()

function criarTarefa(){
    if(nomeCriacaoTarefa.value && (repetirCriacaoCheck.checked && dataCriacaoTarefa.value && repetirDiasCriacao.value<=1095) || nomeCriacaoTarefa.value && !repetirCriacaoCheck.checked){
        let idTarefa 
        for(let i = 0; i < localStorage.length; i++){
            let item = JSON.parse(localStorage.getItem(i))
            if(item === null) break
            if(item.nomeTarefa === "del"){
                idTarefa = i
                break;
            }
        }
        let prioridade
        if(prioridadeCriacaoTarefa.value === "baixa") prioridade = 1
        if(prioridadeCriacaoTarefa.value === "media") prioridade = 2
        if(prioridadeCriacaoTarefa.value === "alta") prioridade = 3
        if(idTarefa === undefined) idTarefa = localStorage.length;
        let tarefa = {
            nomeTarefa: nomeCriacaoTarefa.value,
            descricaoTarefa: descricaoCriacaoTarefa.value,
            dataTarefa: dataCriacaoTarefa.value,
            prioridadeTarefa: prioridade,
            repetir: repetirCriacaoCheck.checked,
            repetirDias: Number(repetirDiasCriacao.value),
            idTarefa: idTarefa
        } 
        localStorage.setItem(idTarefa, JSON.stringify(tarefa))
        pegarTarefas();
        cancelarCriarTarefa()
    }
}

function pegarTarefas(){
    tarefas = []
    let item
    for (let i = 0; i < localStorage.length; i++){
        item = JSON.parse(localStorage.getItem(i))
        if(item !== null){
            if(item.nomeTarefa !=="del")tarefas.push(item)
    }
}
    mostrarTarefas()
}
pegarTarefas()

function avisarAtividades(){
    let dataDeHoje = new Date
    let textoAviso = "Atenção! Você tem uma ou mais tarefas com prazo próximo!"
    let temQueNotificar = false
    for (const i in tarefas) {
        let diaDaTarefa = new Date(tarefas[i].dataTarefa)
        let diferencaEmMilissegundos = diaDaTarefa.getTime() - dataDeHoje.getTime()
        let diasRestantes = Math.ceil(diferencaEmMilissegundos / (1000 *  3600 * 24))
        if(diasRestantes <= 2){
            textoAviso += `\n${tarefas[i].nomeTarefa}: ${diasRestantes} dias sobrando.`
            temQueNotificar = true
        }
    }
    if(temQueNotificar){
        temQueNotificar = false
    if("Notification" in window){
        if(Notification.permission === "granted"){
            new Notification(textoAviso)
        }else if(Notification.permission !=="granted"){
            Notification.requestPermission().then((res) => {
                if(res === "granted") new Notification(textoAviso)
            })            
        }
    }else{
        console.log("Sem suporte para notificações.")
    }
}
}
avisarAtividades()

function mostrarTarefas(filtragem){
    if(filtragem === "pertoDeAcabar"){
        tarefas.sort(function(a, b){
            let dataA = new Date(a.dataTarefa)
            let dataB = new Date(b.dataTarefa)
            return dataA-dataB
        })
    }
    if(filtragem === "longeDeAcabar"){
        tarefas.sort(function(a, b){
            let dataA = new Date(a.dataTarefa)
            let dataB = new Date(b.dataTarefa)
            return dataB-dataA
        })
    }
    if(filtragem === "prioridadeAlta"){
        tarefas.sort(function(a, b){
            let prioridadeA = new Date(a.prioridadeTarefa)
            let prioridadeB = new Date(b.prioridadeTarefa)
            return prioridadeB-prioridadeA
        })
    }
    if(filtragem === "prioridadeBaixa"){
        tarefas.sort(function(a, b){
            let prioridadeA = new Date(a.prioridadeTarefa)
            let prioridadeB = new Date(b.prioridadeTarefa)
            return prioridadeA-prioridadeB
        })
    }
    divTarefas.innerHTML = ''
    for (const i in tarefas) {
        let classeTarefa
        if(tarefas[i].prioridadeTarefa === 1) classeTarefa = "baixaPrioridade"
        if(tarefas[i].prioridadeTarefa === 2) classeTarefa = "mediaPrioridade"
        if(tarefas[i].prioridadeTarefa === 3) classeTarefa = "altaPrioridade"

        let data = ''
        if(tarefas[i].dataTarefa){
            data = new Date(tarefas[i].dataTarefa)
            data.setDate(data.getDate() + 1)
            data = data.toLocaleDateString("pt-br")
        }
        divTarefas.innerHTML += `<div class="tarefas ${classeTarefa}"><h3>${tarefas[i].nomeTarefa}</h3><br><br><p id="descricaoTarefa">${tarefas[i].descricaoTarefa}</p><br><br><p class="textoData">${data}</p><br><div class="botoes"><button class="concluirBtn" onclick="concluirTarefa(${tarefas[i].idTarefa})">Concluído</button><button class="editarBtn"onclick="mostrarEdicaoTarefa(${i}, ${tarefas[i].idTarefa})">Editar</button><button id="deletarBtn" onclick="deletarTarefa(${tarefas[i].idTarefa})">Apagar</button></div></div>`
    }
}


function deletarTarefa(idTarefa) {
    let del = {nomeTarefa: "del"}
    localStorage.setItem(idTarefa, JSON.stringify(del))
    pegarTarefas()
    divEdicaoTarefa.style = "display: none;"
}

function mostrarEdicaoTarefa(id, idTarefa){
    cancelarCriarTarefa()
    let prioridade
    if(tarefas[id].prioridadeTarefa === 1) prioridade = "baixa"
    if(tarefas[id].prioridadeTarefa === 2) prioridade = "media"
    if(tarefas[id].prioridadeTarefa === 3) prioridade = "alta"
    divEdicaoTarefa.style = "display: inline-block;"
    nomeEdicaoTarefa.value = tarefas[id].nomeTarefa
    descricaoEdicaoTarefa.value = tarefas[id].descricaoTarefa
    dataEdicaoTarefa.value = tarefas[id].dataTarefa
    prioridadeEdicaoTarefa.value = prioridade 
    repetirEdicaoCheck.checked = tarefas[id].repetir
    repetirDiasEdicao.value = tarefas[id].repetirDias
    
    if(repetirEdicaoCheck.checked){
        divRepetirDiasEdicao.style = "display: inline-block;"
    }else{
        divRepetirDiasEdicao.style = "display: none;"
    }

    document.querySelector("#idEdicaoBoto").innerHTML = `<button id="idEdicaoBoto" onclick="editarTarefa(${idTarefa})">Editar</button><button onclick="cancelarEdicaoTarefa()">Cancelar</button>`
}

function cancelarEdicaoTarefa(){
    divEdicaoTarefa.style = "display: none;"
}

function editarTarefa(idTarefa){
    cancelarEdicaoTarefa()
    if(nomeEdicaoTarefa.value && (repetirEdicaoCheck.checked && dataEdicaoTarefa.value && repetirDiasEdicao.value<=1095) || nomeEdicaoTarefa.value && !repetirEdicaoCheck.checked){
    let prioridade
    if(prioridadeEdicaoTarefa.value === "baixa") prioridade = 1
    if(prioridadeEdicaoTarefa.value === "media") prioridade = 2
    if(prioridadeEdicaoTarefa.value === "alta") prioridade = 3
    let tarefaEditada = {
        nomeTarefa: nomeEdicaoTarefa.value,
        descricaoTarefa: descricaoEdicaoTarefa.value,
        dataTarefa: dataEdicaoTarefa.value,
        prioridadeTarefa: prioridade,
        repetir: repetirEdicaoCheck.checked,
        repetirDias: Number(repetirDiasEdicao.value),
        idTarefa: idTarefa
    }
    localStorage.setItem(idTarefa, JSON.stringify(tarefaEditada))
    pegarTarefas()
}
}

function filtrar(){
    mostrarTarefas(filtragem.value)
}

function concluirTarefa(idTarefa){

    let objectDoConcluido = JSON.parse(localStorage.getItem(idTarefa))
    
    if(objectDoConcluido.repetir){
        let data = new Date(objectDoConcluido.dataTarefa)
        let diasASeremAdicionados = objectDoConcluido.repetirDias
        data.setDate(data.getDate() + diasASeremAdicionados)
        objectDoConcluido.dataTarefa = data
        localStorage.setItem(objectDoConcluido.idTarefa, JSON.stringify(objectDoConcluido))
    }else if(!localStorage.getItem("concluidos")){
        let tarefaConcluida = [{
            nomeTarefa: objectDoConcluido.nomeTarefa,
            dataTarefa: objectDoConcluido.dataTarefa
        }]
        localStorage.setItem("concluidos", JSON.stringify(tarefaConcluida))
        deletarTarefa(idTarefa)
    }else{
    let tarefasConcluidas = JSON.parse(localStorage.getItem("concluidos"))
    let tarefaConcluida = {
        nomeTarefa: objectDoConcluido.nomeTarefa,
        dataTarefa: objectDoConcluido.dataTarefa
    }
    tarefasConcluidas.push(tarefaConcluida)
    localStorage.setItem("concluidos", JSON.stringify(tarefasConcluidas))
    deletarTarefa(idTarefa)
    }
pegarTarefas()
}