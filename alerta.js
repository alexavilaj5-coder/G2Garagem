// ===========================
// SISTEMA DE ALERTAS
// ===========================

let filaAlertas = [];
let alertaAberto = false;



function mostrarAlerta(titulo,texto){


    filaAlertas.push({

        titulo: titulo,

        texto: texto

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



    document.getElementById("alertaTitulo").innerHTML = alerta.titulo;


    document.getElementById("alertaTexto").innerHTML = alerta.texto;


    document.getElementById("alerta").style.display = "flex";


}



function fecharAlerta(){


    document.getElementById("alerta").style.display = "none";


    setTimeout(()=>{


        abrirProximoAlerta();


    },300);


}