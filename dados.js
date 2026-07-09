// ===========================

// DADOS.JS

// ===========================



const jogo = {

    dinheiro: 50000,

    dia: 1,

    mes: 1,

    ano: 2026,

    diaSemana: 4,

    reputacao: 0,

    lucro: 0,

    emprestimo: 0,

    carros: [],

    ofertaAtual: null,

    // Empresa
    empresa:{

        nome:"G2 Garagem",

        nivel:1,

        vagas:2,

        funcionarios:0

    },

    // Financeiro
    financeiro:{

        gastosHoje:0,

        gastosMes:0,

        gastosTotal:0,

        gastosConsertos:0,

        gastosContas:0,

        receitaTotal:0,

        melhorVenda:0,

        maiorPrejuizo:0

    },

    estatisticas:{

        comprados:0,

        vendidos:0,

        consertados:0,

        lucroTotal:0

    }

};



// ===========================

// LISTA DE CARROS

// ===========================



const carros = [

{marca:"Honda",modelo:"Titan Esd (teste) ",versao:"150",fipe:8500},

{marca:"Volkswagen",modelo:"Gol",versao:"1.0",fipe:25000},

{marca:"Volkswagen",modelo:"Gol G5",versao:"1.6",fipe:36000},

{marca:"Volkswagen",modelo:"Gol G6",versao:"1.6",fipe:47000},

{marca:"Volkswagen",modelo:"Fox",versao:"1.6",fipe:42000},

{marca:"Volkswagen",modelo:"Voyage",versao:"1.6",fipe:43000},

{marca:"Volkswagen",modelo:"Saveiro",versao:"1.6",fipe:58000},



{marca:"Chevrolet",modelo:"Celta",versao:"1.0",fipe:22000},

{marca:"Chevrolet",modelo:"Corsa",versao:"1.4",fipe:27000},

{marca:"Chevrolet",modelo:"Onix",versao:"1.0",fipe:65000},

{marca:"Chevrolet",modelo:"Cruze",versao:"1.8",fipe:82000},



{marca:"Fiat",modelo:"Uno",versao:"1.0",fipe:18000},

{marca:"Fiat",modelo:"Palio",versao:"1.4",fipe:26000},

{marca:"Fiat",modelo:"Argo",versao:"1.3",fipe:76000},



{marca:"Ford",modelo:"Ka",versao:"1.0",fipe:36000},

{marca:"Ford",modelo:"Focus",versao:"2.0",fipe:55000},

{marca:"Ford",modelo:"Fiesta",versao:"1.6",fipe:39000},



{marca:"Honda",modelo:"Fit",versao:"1.5",fipe:58000},

{marca:"Honda",modelo:"City",versao:"1.5",fipe:69000},

{marca:"Honda",modelo:"Civic",versao:"2.0",fipe:98000},



{marca:"Toyota",modelo:"Etios",versao:"1.5",fipe:54000},

{marca:"Toyota",modelo:"Corolla",versao:"2.0",fipe:145000},

{marca:"Toyota",modelo:"Hilux",versao:"2.8",fipe:220000}



];



const cores = [



"Branco",

"Preto",

"Prata",

"Cinza",

"Vermelho",

"Azul",

"Verde",

"Amarelo"



];



const historicos = [



"Único dono",

"Uber",

"Locadora",

"Leilão",

"Pequena colisão",

"Revisões em dia",

"Sem histórico"



];



const defeitos = [



{nome:"Motor",valor:8500},

{nome:"Câmbio",valor:6500},

{nome:"Suspensão",valor:2800},

{nome:"Pintura",valor:2200},

{nome:"Pneus",valor:1800},

{nome:"Ar-condicionado",valor:1500},

{nome:"Freios",valor:900},

{nome:"Bateria",valor:650},

{nome:"Embreagem",valor:2400}



];



function aleatorio(min,max){



    return Math.floor(Math.random()*(max-min+1))+min;



}