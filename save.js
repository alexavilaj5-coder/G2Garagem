// ===========================
// SAVE.JS
// ===========================

// ===========================
// AUTOSAVE
// ===========================

function salvarJogo(){

    localStorage.setItem(
        "AutoDealerBrasil",
        JSON.stringify(jogo)
    );

}

// ===========================
// BACKUP MANUAL
// ===========================

function salvarBackup(){

    localStorage.setItem(
        "AutoDealerBrasil_Backup",
        JSON.stringify(jogo)
    );

    mostrarAlerta(
        "💾 Backup salvo",
        "Seu progresso foi salvo com sucesso!"
    );

}

// ===========================
// CARREGAR BACKUP
// ===========================

function carregarBackup(){

    let save = localStorage.getItem("AutoDealerBrasil_Backup");

    if(!save){

        mostrarAlerta(
            "⚠️ Atenção",
            "Nenhum backup encontrado."
        );

        return;

    }

    if(!confirm("Carregar o backup salvo?\n\nO progresso atual será perdido.")){
        return;
    }

    Object.assign(jogo, JSON.parse(save));

    salvarJogo();

    atualizarPainel();

    mostrarTelaInicial();

    mostrarAlerta(
        "📂 Backup carregado",
        "Seu progresso foi restaurado."
    );

}

// ===========================
// CARREGAR JOGO
// ===========================

function carregarJogo(){

    let save = localStorage.getItem("AutoDealerBrasil");

    if(save){

        let dados = JSON.parse(save);

        Object.assign(jogo,dados);

    }

    // Empresa
    if(!jogo.empresa){

        jogo.empresa={

            nome:"GARAGEM G2",
            nivel:1,
            vagas:2,
            funcionarios:0

        };

    }

    // Financeiro
    if(!jogo.financeiro){

        jogo.financeiro={

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

    // Calendário
    if(jogo.mes===undefined) jogo.mes=1;
    if(jogo.ano===undefined) jogo.ano=2026;
    if(jogo.diaSemana===undefined) jogo.diaSemana=4;

    // Preparado para o relógio
    if(jogo.hora===undefined) jogo.hora=8;
    if(jogo.minuto===undefined) jogo.minuto=0;

}

// ===========================
// NOVO JOGO
// ===========================

function novoJogo(){

    if(!confirm(
`⚠️ Deseja realmente iniciar um novo jogo?

Todo o progresso será apagado.`)){
        return;
    }

    localStorage.removeItem("AutoDealerBrasil");

    location.reload();

}

// ===========================
// APAGAR SAVE
// ===========================

function apagarSave(){

    novoJogo();

}

// ===========================
// AUTOSAVE
// ===========================

setInterval(function(){

    salvarJogo();

},5000);