// ===========================
// SAVE.JS
// ===========================

function salvarJogo(){

    localStorage.setItem(
        "AutoDealerBrasil",
        JSON.stringify(jogo)
    );

}

function carregarJogo(){

    let save = localStorage.getItem("AutoDealerBrasil");

    if(save){

        let dados = JSON.parse(save);

        Object.assign(jogo,dados);

    }

    // Corrige saves antigos
    if(!jogo.empresa){

        jogo.empresa = {

            nome:"RAFFA REPASSES",

            nivel:1,

            vagas:2,

            funcionarios:0

        };

    }

    if(!jogo.financeiro){

        jogo.financeiro = {

            gastosHoje:0,

            gastosMes:0,

            gastosTotal:0,

            gastosConsertos:0,

            gastosContas:0,

            receitaTotal:0,

            melhorVenda:0,

            maiorPrejuizo:0

        };

    }

    if(jogo.mes === undefined) jogo.mes = 1;

    if(jogo.ano === undefined) jogo.ano = 2026;

    if(jogo.diaSemana === undefined) jogo.diaSemana = 4;

}

function apagarSave(){

    if(confirm("Deseja apagar o progresso?")){

        localStorage.removeItem("AutoDealerBrasil");

        location.reload();

    }

}

setInterval(function(){

    salvarJogo();

},5000);