// ===========================================
// TEMPO.JS V4.3 (COM VIRADA DE PARCELAS MENSAL) 🚗💳💥
// G2 GARAGEM
// ===========================================

const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

// Lista expandida de despesas mensais (com variação de preço baseada em porcentagem)
const despesasMensais = [
    {nome: "🏢 Aluguel da Garagem", valorBase: 5500, variacao: 0.05},
    {nome: "💡 Energia Elétrica (Oficina)", valorBase: 1350, variacao: 0.25},
    {nome: "💧 Água e Saneamento", valorBase: 190, variacao: 0.10},
    {nome: "🌐 Internet Fibra & Sistema", valorBase: 150, variacao: 0.10},
    {nome: "📄 Alvará e Licenças", valorBase: 350, variacao: 0.00},
    {nome: "🧹 Limpeza Geral e Insumos", valorBase: 280, variacao: 0.10},
    {nome: "🛡 Seguro Frota & Imóvel", valorBase: 480, variacao: 0.05},
    {nome: "☕ Café, Água e Insumos", valorBase: 140, variacao: 0.20},
    {nome: "🗑️ Taxa de Resíduos Perigosos", valorBase: 220, variacao: 0.15},
    {nome: "📢 Marketing e Anúncios Fixos", valorBase: 600, variacao: 0.60}
];

// Lista expandida de despesas diárias (com variação e imprevistos)
const despesasDiarias = [
    {nome: "☕ Café da Equipe", valorBase: 18, variacao: 0.25},
    {nome: "🧹 Produtos de Limpeza", valorBase: 15, variacao: 0.70},
    {nome: "🍽️ Almoço dos Funcionários", valorBase: 90, variacao: 0.20},
    {nome: "🥤 Bebidas e Hidratação", valorBase: 25, variacao: 0.20},
    {nome: "🧽 Lavagem Rápida de Veículos", valorBase: 50, variacao: 0.40},
    {nome: "🔧 Ferramentas Manuais e Desgaste", valorBase: 60, variacao: 0.50},
    {nome: "📢 Divulgação Digital do Dia", valorBase: 100, variacao: 0.50},
    {nome: "🔩 Parafusos, Lixas e Abrasivos", valorBase: 45, variacao: 0.40},
    {nome: "🧯 Recarga e Manutenção de Equipamentos", valorBase: 35, variacao: 0.60}
];

function iniciarCalendario(){
    if(jogo.mes === undefined) jogo.mes = 1;
    if(jogo.ano === undefined) jogo.ano = 2026;
    if(jogo.dia === undefined) jogo.dia = 1;
    if(jogo.diaSemana === undefined) jogo.diaSemana = 4;
    if(jogo.financeiro === undefined) jogo.financeiro = { gastosHoje: 0, gastosMes: 0, gastosTotal: 0, gastosContas: 0 };

    // Dispara os fogos se o jogo iniciar exatamente no dia 1 de janeiro (boa vinda ao game)
    if(jogo.dia === 1 && jogo.mes === 1 && !window.fogosIniciaisDisparados){
        window.fogosIniciaisDisparados = true;
        setTimeout(() => {
            dispararFogosDeArtificio();
        }, 1000);
    }
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

// Função auxiliar para calcular valores aleatórios baseados na variação
function calcularValorAleatorio(base, variator){
    let fator = 1 + (Math.random() * (variator * 2) - variator);
    return Math.round(base * fator);
}

function cobrarDespesasDiarias(){
    let total = 0;
    
    jogo.resumoGastosHoje = [];

    despesasDiarias.forEach(function(d){
        let valorReal = calcularValorAleatorio(d.valorBase, d.variacao);
        total += valorReal;
        jogo.resumoGastosHoje.push({ nome: d.nome, valor: valorReal });
    });

    jogo.dinheiro -= total;
    jogo.financeiro.gastosHoje = total;
    jogo.financeiro.gastosMes += total;
    jogo.financeiro.gastosTotal += total;

    return total;
}

function cobrarDespesasMensais(){
    let total = 0;
    let texto = "🏢 CONTAS DO MÊS (FECHAMENTO)\n\n";

    despesasMensais.forEach(function(d){
        let valorReal = calcularValorAleatorio(d.valorBase, d.variacao);
        total += valorReal;
        texto += `${d.nome} - R$ ${valorReal.toLocaleString("pt-BR")}\n`;
    });

    jogo.dinheiro -= total;
    jogo.financeiro.gastosMes += total;
    jogo.financeiro.gastosTotal += total;
    jogo.financeiro.gastosContas += total;

    mostrarAlerta(
        "🏢 Fechamento Mensal de Contas",
        texto + "\n-----------------------------------\nTOTAL GASTO: R$ " + total.toLocaleString("pt-BR")
    );
}

function avancarDia(){
    iniciarCalendario();
    jogo.financeiro.gastosHoje = 0;

    let totalGastoHojePassar = 0;
    let emprestimosAtualizadosTexto = "";
    let virouAnoNovo = false;

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

        // 3. Cobra despesas diárias com variação aleatória
        totalGastoHojePassar = cobrarDespesasDiarias();

        if(typeof atualizarOficinaDia === "function"){
            atualizarOficinaDia();
        }

        if(typeof atualizarClientesNovoDia === "function"){
            atualizarClientesNovoDia();
        }

        // 4. Virada de Mês (Dispara Contas e Parcelas do Crediário Mensal)
        if(jogo.dia > 30){
            jogo.dia = 1;
            jogo.mes++;

            cobrarDespesasMensais();

            // CHAMA AQUI O PROCESSAMENTO DAS PARCELAS DO CREDIÁRIO
            if(typeof processarParcelasFinanciamentos === "function"){
                processarParcelasFinanciamentos();
            }

            mostrarAlerta(
                "📅 Virada de Mês",
                "Um novo mês começou na G2 Garagem! As contas fixas e as parcelas do crediário foram processadas."
            );
        }

        if(jogo.mes > 12){
            jogo.mes = 1;
            jogo.ano++;
            virouAnoNovo = true;
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

    if(virouAnoNovo){
        mostrarAlerta(
            "🎉 Feliz Ano Novo!",
            "Bem-vindo a " + jogo.ano + "! Sua garagem completa mais um ano de história."
        );
        setTimeout(() => {
            dispararFogosDeArtificio();
        }, 500);
    }

    let resumoDia = `💸 Custos operacionais hoje: <strong>R$ ${totalGastoHojePassar.toLocaleString("pt-BR")}</strong>`;
    
    if(jogo.resumoGastosHoje && jogo.resumoGastosHoje.length > 0) {
        resumoDia += `<br><span style='font-size: 11px; color: #a1a1aa;'>Imprevistos e gastos do dia calculados com sucesso.</span>`;
    }

    if(jogo.investimento > 0) {
        resumoDia += `<br>📈 Seus investimentos renderam juros hoje.`;
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

function dispararFogosDeArtificio() {
    const overlay = document.createElement("div");
    overlay.className = "container-fogos";
    document.body.appendChild(overlay);

    const cores = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ffffff"];

    let ondas = 0;
    let intervaloFogos = setInterval(() => {
        ondas++;
        
        let posX = Math.random() * window.innerWidth;
        let posY = Math.random() * (window.innerHeight / 2);

        for (let i = 0; i < 30; i++) {
            let particula = document.createElement("div");
            particula.className = "particula-fogo";
            particula.style.left = posX + "px";
            particula.style.top = posY + "px";
            particula.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
            
            let angulo = Math.random() * Math.PI * 2;
            let velocidade = Math.random() * 80 + 20;
            let destinoX = Math.cos(angulo) * velocidade;
            let destinoY = Math.sin(angulo) * velocidade;
            
            particula.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destinoX}px, ${destinoY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });

            overlay.appendChild(particula);
        }

        if (ondas >= 5) {
            clearInterval(intervaloFogos);
            setTimeout(() => {
                overlay.remove();
            }, 1500);
        }
    }, 800);
}