// ===========================
// TEMPO.JS
// G2 GARAGEM
// ===========================

// ===========================
// CALENDÁRIO
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

    {nome:"🧹 Diária Faxineira",valor:120},

    {nome:"📢 Divulgação da Garagem",valor:100}

];

// ===========================
// INICIAR CALENDÁRIO
// ===========================

function iniciarCalendario(){

    if(jogo.mes===undefined) jogo.mes=1;
    if(jogo.ano===undefined) jogo.ano=2026;
    if(jogo.diaSemana===undefined) jogo.diaSemana=4;

}

// ===========================
// DATA DO PAINEL
// ===========================

function atualizarDataPainel(){

    iniciarCalendario();

    dia.innerHTML =
    diasSemana[jogo.diaSemana] +
    "<br>" +
    String(jogo.dia).padStart(2,"0") +
    "/" +
    String(jogo.mes).padStart(2,"0") +
    "/" +
    jogo.ano;

}

// ===========================
// DESPESAS DO DIA
// ===========================

function cobrarDespesasDiarias(){

    let total = 0;

    let texto = "☕ DESPESAS DO DIA\n\n";

    despesasDiarias.forEach(function(despesa){

        total += despesa.valor;

        texto +=
        despesa.nome +
        " - R$ " +
        despesa.valor.toLocaleString("pt-BR") +
        "\n";

    });

    jogo.dinheiro -= total;

    jogo.financeiro.gastosHoje += total;
    jogo.financeiro.gastosMes += total;
    jogo.financeiro.gastosTotal += total;

    texto += "\n━━━━━━━━━━━━━━";

    texto += "\nTOTAL: R$ " +
    total.toLocaleString("pt-BR");

    texto += "\n\n💰 Caixa Atual\nR$ " +
    jogo.dinheiro.toLocaleString("pt-BR");

    mostrarAlerta(
        "💸 Despesas do Dia",
        texto
    );

}

// ===========================
// CONTAS DO MÊS
// ===========================

function cobrarDespesasMensais(){

    let total = 0;

    let texto = "🏢 CONTAS DO MÊS\n\n";

    despesasMensais.forEach(function(despesa){

        total += despesa.valor;

        texto +=
        despesa.nome +
        " - R$ " +
        despesa.valor.toLocaleString("pt-BR") +
        "\n";

    });

    jogo.dinheiro -= total;

    jogo.financeiro.gastosMes += total;
    jogo.financeiro.gastosTotal += total;
    jogo.financeiro.gastosContas += total;

    texto += "\n━━━━━━━━━━━━━━";

    texto += "\nTOTAL: R$ " +
    total.toLocaleString("pt-BR");

    texto += "\n\n💰 Caixa Atual\nR$ " +
    jogo.dinheiro.toLocaleString("pt-BR");

    mostrarAlerta(
        "🏢 Contas do Mês",
        texto
    );

}

// ===========================
// AVANÇAR DIA
// ===========================

function avancarDia(){

    iniciarCalendario();

    // Zera gastos do dia
    jogo.financeiro.gastosHoje = 0;

    // Avança um dia
    jogo.dia++;
    jogo.diaSemana++;

    // Reinicia a semana
    if(jogo.diaSemana > 6){
        jogo.diaSemana = 0;
    }

    // Cobra despesas do dia
    cobrarDespesasDiarias();

    // Virou o mês
    if(jogo.dia > 30){

        jogo.dia = 1;
        jogo.mes++;

        // Zera gastos do mês
        jogo.financeiro.gastosMes = 0;

        // Cobra contas mensais
        cobrarDespesasMensais();

        mostrarAlerta(
            "📅 Novo Mês",
`🏢 Um novo mês começou!

As contas mensais foram pagas.

Boa sorte nas próximas negociações!`
        );

    }

    // Virou o ano
    if(jogo.mes > 12){

        jogo.mes = 1;
        jogo.ano++;

        mostrarAlerta(
            "🎉 Feliz Ano Novo!",
`Parabéns!

A G2 GARAGEM entrou em ${jogo.ano}.

Que seja um ano de muito lucro! 🚗`
        );

    }

    // Atualiza clientes do dia
    if(typeof atualizarClientesNovoDia === "function"){
        atualizarClientesNovoDia();
    }

    // Gera nova oferta do mercado
    gerarOferta();

    salvarJogo();

    atualizarPainel();

    atualizarDataPainel();

    // Resumo do dia
    mostrarAlerta(
        "📅 Novo Dia",
`${diasSemana[jogo.diaSemana]}

📅 ${String(jogo.dia).padStart(2,"0")}/${String(jogo.mes).padStart(2,"0")}/${jogo.ano}

━━━━━━━━━━━━━━

💸 Gastos Hoje
R$ ${jogo.financeiro.gastosHoje.toLocaleString("pt-BR")}

💰 Caixa
R$ ${jogo.dinheiro.toLocaleString("pt-BR")}

🚗 Novos veículos chegaram ao mercado!

👥 Novos clientes podem aparecer hoje.`
    );

}