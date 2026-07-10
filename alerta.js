// ===========================
// SISTEMA DE ALERTAS V2
// G2 GARAGEM
// ===========================

let filaAlertas = [];
let alertaAberto = false;

function mostrarAlerta(titulo, texto){

    filaAlertas.push({
        titulo,
        texto
    });

    if(!alertaAberto){
        abrirProximoAlerta();
    }

}

function abrirProximoAlerta(){

    if(filaAlertas.length === 0){

        alertaAberto = false;
        return;

    }

    alertaAberto = true;

    let alerta = filaAlertas.shift();

    const box = document.getElementById("alerta");

    document.getElementById("alertaTitulo").innerHTML = alerta.titulo;

    // Mantém as quebras de linha
    document.getElementById("alertaTexto").innerHTML =
        alerta.texto.replace(/\n/g,"<br>");

    box.style.display = "flex";

    // animação
    box.classList.remove("abrindo");

    void box.offsetWidth;

    box.classList.add("abrindo");

}

function fecharAlerta(){

    document.getElementById("alerta").style.display = "none";

    alertaAberto = false;

    if(filaAlertas.length > 0){

        setTimeout(abrirProximoAlerta,150);

    }

}