// ===========================
// TEMPO.JS V2
// G2 GARAGEM
// ===========================


// ===========================
// DIAS DA SEMANA
// ===========================

const diasSemana = [

"Domingo",
"Segunda-feira",
"Terça-feira",
"Quarta-feira",
"Quinta-feira",
"Sexta-feira",
"Sábado"

];




// ===========================
// DESPESAS MENSAIS
// ===========================

const despesasMensais = [

{nome:"🏢 Aluguel da Garagem",valor:5500},

{nome:"💡 Energia",valor:1280},

{nome:"💧 Água",valor:180},

{nome:"🌐 Internet",valor:150},

{nome:"📄 Alvará",valor:350},

{nome:"🧹 Limpeza",valor:250},

{nome:"🛡 Seguro",valor:450},

{nome:"☕ Café e Materiais",valor:120}

];




// ===========================
// DESPESAS DIÁRIAS
// ===========================

const despesasDiarias = [

{nome:"☕ Café da Equipe",valor:17},

{nome:"🧹 Produtos de Limpeza",valor:15},

{nome:"🍽️ Almoço Funcionários",valor:80},

{nome:"🥤 Bebidas da Equipe",valor:25},

{nome:"🧽 Lavagem dos Veículos",valor:50},

{nome:"🔧 Ferramentas e Manutenção",valor:50},

{nome:"📢 Divulgação da Garagem",valor:100}

];




// ===========================
// INICIAR CALENDÁRIO
// ===========================

function iniciarCalendario(){


if(jogo.mes===undefined)
jogo.mes=1;


if(jogo.ano===undefined)
jogo.ano=2026;


if(jogo.diaSemana===undefined)
jogo.diaSemana=4;


}





// ===========================
// DATA NO PAINEL
// ===========================

function atualizarDataPainel(){


iniciarCalendario();



dia.innerHTML =

diasSemana[jogo.diaSemana]

+

"<br>"

+

String(jogo.dia).padStart(2,"0")

+

"/"

+

String(jogo.mes).padStart(2,"0")

+

"/"

+

jogo.ano;


}






// ===========================
// COBRAR DESPESAS DIÁRIAS
// ===========================

function cobrarDespesasDiarias(){


let total=0;



despesasDiarias.forEach(function(d){


total += d.valor;


});



jogo.dinheiro -= total;


jogo.financeiro.gastosHoje += total;

jogo.financeiro.gastosMes += total;

jogo.financeiro.gastosTotal += total;



}







// ===========================
// COBRAR CONTAS DO MÊS
// ===========================

function cobrarDespesasMensais(){


let total=0;


let texto="🏢 CONTAS DO MÊS\n\n";



despesasMensais.forEach(function(d){


total += d.valor;


texto +=

d.nome+

" - R$ "+

d.valor.toLocaleString("pt-BR")

+

"\n";


});



jogo.dinheiro -= total;



jogo.financeiro.gastosMes += total;

jogo.financeiro.gastosTotal += total;

jogo.financeiro.gastosContas += total;



mostrarAlerta(

"🏢 Contas Pagas",

texto+

"\n\nTOTAL: R$ "+

total.toLocaleString("pt-BR")

);

}







// ===========================
// AVANÇAR DIA
// ===========================

function avancarDia(){

    iniciarCalendario();

    jogo.financeiro.gastosHoje = 0;

    function passarDia(){

        jogo.dia++;
        jogo.diaSemana++;

        if(jogo.diaSemana > 6){
            jogo.diaSemana = 0;
        }

        cobrarDespesasDiarias();

        if(typeof atualizarOficinaDia === "function"){
            atualizarOficinaDia();
        }

        if(typeof atualizarClientesNovoDia === "function"){
            atualizarClientesNovoDia();
        }

        if(jogo.dia > 30){

            jogo.dia = 1;
            jogo.mes++;

            cobrarDespesasMensais();

            mostrarAlerta(
                "📅 Novo Mês",
                "Um novo mês começou na G2 Garagem!"
            );

        }

        if(jogo.mes > 12){

            jogo.mes = 1;
            jogo.ano++;

            mostrarAlerta(
                "🎉 Feliz Ano Novo",
                "Bem-vindo a " + jogo.ano + "!"
            );

        }

    }

    passarDia();

    // pula sábado e domingo automaticamente
    while(jogo.diaSemana == 6 || jogo.diaSemana == 0){
        passarDia();
    }

    if(typeof gerarOferta === "function"){
        gerarOferta();
    }

    salvarJogo();

    atualizarPainel();

    atualizarDataPainel();

    const avisos = [

        "🚗 Novos carros chegaram ao mercado!",

        "💰 Hora de fechar bons negócios!",

        "👀 Clientes estão pesquisando veículos.",

        "🔧 A oficina iniciou novos serviços.",

        "🏆 Mais um dia para aumentar sua reputação!",

        "📈 O mercado foi atualizado.",

        "🚘 Pode aparecer um carro raro hoje!",

        "💸 Negocie bem e aumente seus lucros!",

        "🔥 Bom trabalho, chefe!",

        "📢 Novas oportunidades apareceram!",

        "⭐ Sua garagem continua crescendo!",

        "🚙 SUVs e esportivos podem aparecer hoje!"

    ];

    const texto = avisos[Math.floor(Math.random()*avisos.length)];

    mostrarAvisoTopo(
        "📅 " + diasSemana[jogo.diaSemana] +
        "<br>" +
        String(jogo.dia).padStart(2,"0") + "/" +
        String(jogo.mes).padStart(2,"0") + "/" +
        jogo.ano +
        "<br><br>" +
        texto
    );

}