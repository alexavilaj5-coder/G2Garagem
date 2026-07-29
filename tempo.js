// ===========================
// TEMPO.JS V3.3 (COM RESUMO INTELIGENTE DO DIA)
// G2 GARAGEM
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

const despesasDiarias = [
    {nome:"☕ Café da Equipe",valor:17},
    {nome:"🧹 Produtos de Limpeza",valor:15},
    {nome:"🍽️ Almoço Funcionários",valor:80},
    {nome:"🥤 Bebidas da Equipe",valor:25},
    {nome:"🧽 Lavagem dos Veículos",valor:50},
    {nome:"🔧 Ferramentas e Manutenção",valor:50},
    {nome:"📢 Divulgação da Garagem",valor:100}
];

function iniciarCalendario(){
    if(jogo.mes === undefined) jogo.mes = 1;
    if(jogo.ano === undefined) jogo.ano = 2026;
    if(jogo.dia === undefined) jogo.dia = 1;
    if(jogo.diaSemana === undefined) jogo.diaSemana = 4;
}

function atualizarDataPainel(){
    iniciarCalendario();

    if(typeof dia !== 'undefined' && dia !== null){
        dia.innerHTML = diasSemana[jogo.diaSemana]
        + "<br>"
        + String(jogo.dia).padStart(2,"0")
        + "/"
        + String(jogo.mes).padStart(2,"0")
        + "/"
        + jogo.ano;
    }
}

function cobrarDespesasDiarias(){
    let total = 0;
    despesasDiarias.forEach(function(d){
        total += d.valor;
    });

    jogo.dinheiro -= total;
    jogo.financeiro.gastosHoje += total;
    jogo.financeiro.gastosMes += total;
    jogo.financeiro.gastosTotal += total;
}

function cobrarDespesasMensais(){
    let total = 0;
    let texto = "🏢 CONTAS DO MÊS\n\n";

    despesasMensais.forEach(function(d){
        total += d.valor;
        texto += d.nome + " - R$ " + d.valor.toLocaleString("pt-BR") + "\n";
    });

    jogo.dinheiro -= total;
    jogo.financeiro.gastosMes += total;
    jogo.financeiro.gastosTotal += total;
    jogo.financeiro.gastosContas += total;

    mostrarAlerta(
        "🏢 Contas Pagas",
        texto + "\n\nTOTAL: R$ " + total.toLocaleString("pt-BR")
    );
}

function avancarDia(){
    iniciarCalendario();
    jogo.financeiro.gastosHoje = 0;

    let totalGastoHojePassar = 0;
    let emprestimosAtualizadosTexto = "";

    function passarDia(){
        jogo.dia++;
        jogo.diaSemana++;

        if(jogo.diaSemana > 6){
            jogo.diaSemana = 0;
        }

        // 1. Atualiza dias dos empréstimos e verifica se algum venceu
        if(jogo.emprestimos && jogo.emprestimos.length > 0){
            let penalidadeAplicada = false;
            jogo.emprestimos.forEach(emp => {
                emp.diasRestantes--;
                
                if(emp.diasRestantes < 0){
                    jogo.reputacao = Math.max(0, (jogo.reputacao || 0) - 2);
                    emp.valorParcela = Math.floor(emp.valorParcela * 1.10);
                    emp.diasRestantes = 0; 
                    penalidadeAplicada = true;
                    emprestimosAtualizadosTexto = "<br>⚠️ <span style='color: #ff5252;'>Atenção: Parcela de empréstimo vencida! Juros aplicados.</span>";
                } else if (emp.diasRestantes === 0) {
                    emprestimosAtualizadosTexto = "<br>⚠️ <span style='color: #ff5252;'>Atenção: Último dia para pagar a parcela do empréstimo!</span>";
                }
            });

            if(penalidadeAplicada){
                salvarJogo();
            }
        }

        // 2. Rendimento e controle de dias do investimento
        if(jogo.investimento > 0){
            if(jogo.diasInvestido === undefined) jogo.diasInvestido = 0;
            jogo.diasInvestido++;
            
            let rendimentoDiario = Math.round(jogo.investimento * 0.01);
            jogo.investimento += rendimentoDiario;
        }

        // 3. Soma despesas diárias para o resumo
        despesasDiarias.forEach(function(d){
            totalGastoHojePassar += d.valor;
        });

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

    if(typeof gerarOferta === "function"){
        gerarOferta();
    }

    salvarJogo();
    atualizarPainel();
    atualizarDataPainel();

    if(typeof mostrarBanco === "function" && document.getElementById("conteudo").innerHTML.includes("BANCO G2")){
        mostrarBanco();
    }

    // Monta o resumo profissional com o que aconteceu no dia
    let resumoDia = `💸 Despesas pagas hoje: <strong>R$ ${totalGastoHojePassar.toLocaleString("pt-BR")}</strong>`;
    
    if(jogo.investimento > 0) {
        resumoDia += `<br>📈 Seus investimentos renderam hoje.`;
    }

    if(jogo.emprestimos && jogo.emprestimos.length > 0) {
        let diasRestantesAtual = jogo.emprestimos[0].diasRestantes;
        resumoDia += `<br>📑 Próxima parcela vence em: <strong>${diasRestantesAtual} dias</strong>`;
    }

    resumoDia += emprestimosAtualizadosTexto;

    mostrarAvisoTopo(
        "📅 " + diasSemana[jogo.diaSemana] +
        "<br>" +
        String(jogo.dia).padStart(2,"0") + "/" +
        String(jogo.mes).padStart(2,"0") + "/" +
        jogo.ano +
        "<br><br>" +
        resumoDia
    );
}