// ===========================
// TEMPO.JS
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

    {nome:"🏢 Aluguel da Garagem",valor:2500},
    {nome:"💡 Energia",valor:650},
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

    {nome:"☕ Café",valor:4},
    {nome:"🧹 produtos Limpeza",valor:5},
    {nome:"🍽️ Almoço",valor:12},
    {nome:"🥤 Coca geladinha",valor:8},
    {nome:"🧹 Diaria Fixineira",valor:120}

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
// ATUALIZA DATA
// ===========================

function atualizarDataPainel(){

    iniciarCalendario();

    dia.innerHTML=
    diasSemana[jogo.diaSemana]+
    "<br>"+
    String(jogo.dia).padStart(2,"0")+
    "/"+
    String(jogo.mes).padStart(2,"0")+
    "/"+
    jogo.ano;

}

// ===========================
// DESPESAS DO DIA
// ===========================

function cobrarDespesasDiarias(){

    let total=0;

    let texto="💸 DESPESAS DO DIA\n\n";

    for(let despesa of despesasDiarias){

        total+=despesa.valor;

        texto+=
        despesa.nome+
        " - R$ "+
        despesa.valor.toLocaleString("pt-BR")+
        "\n";

    }

    jogo.dinheiro-=total;

    // Financeiro
    jogo.financeiro.gastosHoje+=total;
    jogo.financeiro.gastosMes+=total;
    jogo.financeiro.gastosTotal+=total;

    texto+="\n-------------------------";

    texto+="\nTOTAL: R$ "+
    total.toLocaleString("pt-BR");

    texto+="\n\n💰 Caixa Atual\nR$ "+
    jogo.dinheiro.toLocaleString("pt-BR");

    alert(texto);

}

// ===========================
// DESPESAS MENSAIS
// ===========================

function cobrarDespesasMensais(){

    let total=0;

    let texto="🏢 CONTAS DO MÊS\n\n";

    for(let despesa of despesasMensais){

        total+=despesa.valor;

        texto+=
        despesa.nome+
        " - R$ "+
        despesa.valor.toLocaleString("pt-BR")+
        "\n";

    }

    jogo.dinheiro-=total;

    // Financeiro
    jogo.financeiro.gastosMes+=total;
    jogo.financeiro.gastosTotal+=total;
    jogo.financeiro.gastosContas+=total;

    texto+="\n-------------------------";

    texto+="\nTOTAL: R$ "+
    total.toLocaleString("pt-BR");

    texto+="\n\n💰 Caixa Atual\nR$ "+
    jogo.dinheiro.toLocaleString("pt-BR");

    alert(texto);

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

    // Cobra despesas diárias
    cobrarDespesasDiarias();

    // Virou o mês
    if(jogo.dia > 30){

        jogo.dia = 1;
        jogo.mes++;

        // Zera gastos mensais
        jogo.financeiro.gastosMes = 0;

        // Cobra contas do mês
        cobrarDespesasMensais();

        alert(
`📅 Novo mês iniciado!

🏢 As contas mensais foram pagas.`
        );

    }

    // Virou o ano
    if(jogo.mes > 12){

        jogo.mes = 1;
        jogo.ano++;

        alert("🎉 Feliz Ano Novo!");

    }

    // Gera nova oferta
    gerarOferta();

    salvarJogo();

    atualizarPainel();

    // Atualiza a data do painel
    if(typeof atualizarDataPainel === "function"){
        atualizarDataPainel();
    }

    // Resumo do dia
    alert(
`📅 ${diasSemana[jogo.diaSemana]}

${String(jogo.dia).padStart(2,"0")}/${String(jogo.mes).padStart(2,"0")}/${jogo.ano}

💸 Gastos hoje:
R$ ${jogo.financeiro.gastosHoje.toLocaleString("pt-BR")}

💰 Caixa:
R$ ${jogo.dinheiro.toLocaleString("pt-BR")}

🚗 Novas ofertas chegaram ao mercado!`
    );

}