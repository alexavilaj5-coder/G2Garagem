// ============================================================================
// TEMPO.JS V4.18 (COMPLETO, CORRIGIDO E COM TOAST COMPACTO) 🚗💳💥
// G2 GARAGEM
// ============================================================================

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

// Notificação compacta (Toast flutuante no canto superior)
function mostrarAvisoTopo(htmlMensagem) {
    let container = document.getElementById("toast-container-g2");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container-g2";
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 999999;
            display: flex; flex-direction: column; gap: 8px; pointer-events: none;
            font-family: inherit;
        `;
        document.body.appendChild(container);
    }

    let toast = document.createElement("div");
    toast.style.cssText = `
        background: #18181b; border: 1px solid #27272a; border-left: 4px solid #38bdf8;
        color: #f4f4f5; padding: 10px 14px; border-radius: 8px; font-size: 13px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4); pointer-events: auto;
        min-width: 260px; max-width: 320px; opacity: 0; transform: translateY(-10px);
        transition: opacity 0.25s ease, transform 0.25s ease; line-height: 1.4;
    `;

    toast.innerHTML = htmlMensagem;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
        setTimeout(() => toast.remove(), 250);
    }, 4500); // Fica visível por 4.5 segundos
}

function iniciarCalendario(){
    if(jogo.mes === undefined) jogo.mes = 1;
    if(jogo.ano === undefined) jogo.ano = 2026;
    if(jogo.dia === undefined) jogo.dia = 1;
    if(jogo.diaSemana === undefined) jogo.diaSemana = 4;
    if(jogo.financeiro === undefined) jogo.financeiro = { gastosHoje: 0, gastosMes: 0, gastosTotal: 0, gastosContas: 0 };

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

// Animação imersiva para o pulo do fim de semana inteiro (Sábado + Domingo)
function animarAvancoFimDeSemana(callbackPassos) {
    let overlay = document.createElement("div");
    overlay.id = "modal-fim-de-semana-animacao";
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(9, 9, 11, 0.92);
        backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.4s ease-in-out;
        color: #fff;
        font-family: inherit;
    `;
    
    overlay.innerHTML = `
        <div style="background: #18181b; border: 1px solid #27272a; padding: 30px; border-radius: 16px; width: 90%; max-width: 420px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
            <div id="icone-anim-fds" style="font-size: 3.5rem; margin-bottom: 15px;">🌙</div>
            <h3 id="titulo-anim-fds" style="margin: 0 0 10px 0; font-size: 20px; color: #38bdf8;">Fim de Semana na Garagem</h3>
            <p id="texto-anim-fds" style="margin: 0 0 20px 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">Processando o descanso e a madrugada...</p>
            <div style="width: 100%; background: #27272a; height: 6px; border-radius: 3px; overflow: hidden;">
                <div id="barra-progresso-fds" style="width: 0%; height: 100%; background: #38bdf8; transition: width 0.8s ease-in-out;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
    });

    setTimeout(() => {
        document.getElementById("icone-anim-fds").innerHTML = "🌃";
        document.getElementById("titulo-anim-fds").innerText = "Madrugada de Sábado";
        document.getElementById("texto-anim-fds").innerText = "Verificando alarmes, segurança e checando imprevistos...";
        document.getElementById("barra-progresso-fds").style.width = "35%";
    }, 800);

    setTimeout(() => {
        document.getElementById("icone-anim-fds").innerHTML = "☀️";
        document.getElementById("titulo-anim-fds").innerText = "Domingo de Descanso";
        document.getElementById("texto-anim-fds").innerText = "Garagem fechada. Equipe recarregando as energias...";
        document.getElementById("barra-progresso-fds").style.width = "70%";
    }, 1800);

    setTimeout(() => {
        document.getElementById("icone-anim-fds").innerHTML = "🌅";
        document.getElementById("titulo-anim-fds").innerText = "Amanhecer de Segunda-feira";
        document.getElementById("texto-anim-fds").innerText = "Portões reabrindo para um novo ciclo de negócios!";
        document.getElementById("barra-progresso-fds").style.width = "100%";
    }, 2800);

    setTimeout(() => {
        if(callbackPassos) callbackPassos();
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 400);
    }, 3600);
}

function rolarEventoMadrugadaFimDeSemana() {
    let chance = Math.random();
    let relatorioEvento = "";

    if (chance < 0.30) {
        let tipoEvento = Math.floor(Math.random() * 3);

        if (tipoEvento === 0) {
            let custoCano = Math.floor(Math.random() * 450) + 150;
            jogo.dinheiro -= custoCano;
            relatorioEvento = `<br>💧 <span style="color: #ef4444;">Imprevisto na Madrugada:</span> Cano estourou! Prejuízo: <strong>- R$ ${custoCano.toLocaleString("pt-BR")}</strong>.`;
        } 
        else if (tipoEvento === 1) {
            if (Math.random() > 0.4 && jogo.empresa && jogo.empresa.nivel >= 2) {
                relatorioEvento = `<br>🛡️ <span style="color: #34d399;">Segurança Noturna:</span> Alarme espantou invasores. Sem danos!`;
            } else {
                let prejuizoRoubo = Math.floor(Math.random() * 900) + 300;
                jogo.dinheiro -= Math.max(0, prejuizoRoubo);
                relatorioEvento = `<br>🚨 <span style="color: #ef4444;">Tentativa de Furto:</span> Prejuízo: <strong>- R$ ${prejuizoRoubo.toLocaleString("pt-BR")}</strong>.`;
            }
        } 
        else {
            let multa = 250;
            jogo.dinheiro -= multa;
            relatorioEvento = `<br>📜 <span style="color: #f59e0b;">Reclamação Noturna:</span> Multa: <strong>- R$ ${multa}</strong>.`;
        }
    } else {
        relatorioEvento = `<br>🌙 <span style="color: #34d399;">Fim de semana tranquilo.</span>`;
    }

    return relatorioEvento;
}

// Executa a lógica de virar um dia comum
function processarAvancoDiaComum() {
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

        if(jogo.emprestimos && jogo.emprestimos.length > 0){
            let penalidadeAplicada = false;
            jogo.emprestimos.forEach(emp => {
                emp.diasRestantes--;
                
                if(emp.diasRestantes < 0){
                    jogo.reputacao = Math.max(0, (jogo.reputacao || 0) - 2);
                    emp.valorParcela = Math.floor(emp.valorParcela * 1.10);
                    emp.diasRestantes = 0; 
                    penalidadeAplicada = true;
                    emprestimosAtualizadosTexto = "<br>⚠️ <span style='color: #ff5252;'>Parcela de empréstimo vencida!</span>";
                } else if (emp.diasRestantes === 0) {
                    emprestimosAtualizadosTexto = "<br>⚠️ <span style='color: #ff5252;'>Último dia para pagar empréstimo!</span>";
                }
            });

            if(penalidadeAplicada){
                salvarJogo();
            }
        }

        if(jogo.investimento > 0){
            if(jogo.diasInvestido === undefined) jogo.diasInvestido = 0;
            jogo.diasInvestido++;
            let rendimentoDiario = Math.round(jogo.investimento * 0.01);
            jogo.investimento += rendimentoDiario;
        }

        // CHAMA A COBRANÇA DOS GASTOS DIÁRIOS AQUI
        totalGastoHojePassar = cobrarDespesasDiarias();

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
                "📅 Virada de Mês",
                "Um novo mês começou na G2 Garagem! As contas fixas mensais foram pagas."
            );
        }

        if(jogo.mes > 12){
            jogo.mes = 1;
            jogo.ano++;
            virouAnoNovo = true;
        }
    }

    passarDia();

    if(typeof processarParcelasDiarias === "function"){
        processarParcelasDiarias();
    } else if(typeof processarParcelasFinanciamentos === "function"){
        processarParcelasFinanciamentos();
    }

    if(typeof gerarOferta === "function"){
        gerarOferta();
    }

    salvarJogo();
    atualizarPainel();
    atualizarDataPainel();

    if(typeof mostrarBanco === "function" && document.getElementById("conteudo") && document.getElementById("conteudo").innerHTML.includes("BANCO G2")){
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

    // MONTAGEM DO RESUMO PARA APARECER NO TOAST
    let resumoDia = `💸 Custos operacionais hoje: <strong>R$ ${totalGastoHojePassar.toLocaleString("pt-BR")}</strong>`;
    
    if(jogo.resumoGastosHoje && jogo.resumoGastosHoje.length > 0) {
        resumoDia += `<br><span style='font-size: 11px; color: #a1a1aa;'>Insumos, café e desgaste calculados.</span>`;
    }

    if(jogo.investimento > 0) {
        resumoDia += `<br>📈 Seus investimentos renderam juros hoje.`;
    }

    if(jogo.emprestimos && jogo.emprestimos.length > 0) {
        let diasRestantesAtual = jogo.emprestimos[0].diasRestantes;
        resumoDia += `<br>📑 Parcela vence em: <strong>${diasRestantesAtual} dias</strong>`;
    }

    resumoDia += emprestimosAtualizadosTexto;

    // EXIBE O TOAST NO CANTO SUPERIOR
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

function avancarDia(){
    iniciarCalendario();

    if(jogo.diaSemana === 5) {
        mostrarModalFimDeSemana();
    } else {
        animarAvancoVisual("Avançando para o próximo dia... ⏳", () => {
            processarAvancoDiaComum();
        });
    }
}

function animarAvancoVisual(textoMensagem, callback) {
    let overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(3px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        color: #fff;
    `;
    
    overlay.innerHTML = `
        <div style="font-size: 2.8rem; animation: spin 0.8s linear infinite; margin-bottom: 12px;">⏳</div>
        <div style="font-size: 16px; font-weight: bold; color: #38bdf8;">${textoMensagem}</div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        setTimeout(() => {
            if(callback) callback();
            overlay.style.opacity = "0";
            setTimeout(() => overlay.remove(), 200);
        }, 500);
    });
}

function mostrarModalFimDeSemana() {
    let funcionarios = jogo.empresa?.funcionarios || 0;
    let custoHoraExtra = (funcionarios * 350) + 500;

    let modalExistente = document.getElementById("modal-fds-custom");
    if(modalExistente) modalExistente.remove();

    let modal = document.createElement("div");
    modal.id = "modal-fds-custom";
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(9, 9, 11, 0.85);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        font-family: inherit;
        animation: fadeIn 0.25s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: #18181b; border: 1px solid #3f3f46; padding: 25px; border-radius: 16px; width: 90%; max-width: 440px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); color: #fff;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <span style="font-size: 2.2rem;">🗓️</span>
                <div>
                    <h3 style="margin: 0; font-size: 18px; color: #fff;">Fim de Semana Chegando!</h3>
                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #a1a1aa;">Sexta-feira encerrando o expediente</p>
                </div>
            </div>

            <p style="font-size: 13px; color: #d4d4d8; line-height: 1.6; margin-bottom: 20px;">
                Deseja pagar hora extra para a sua equipe manter a garagem aberta neste <b>Sábado</b>, ou prefere dar folga geral e pular direto para segunda-feira?
            </p>

            <div style="background: #121214; border: 1px solid #27272a; padding: 12px; border-radius: 10px; margin-bottom: 20px; font-size: 13px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="color: #a1a1aa;">👨‍🔧 Funcionários:</span>
                    <strong style="color: #fff;">${funcionarios}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #a1a1aa;">💰 Custo Hora Extra:</span>
                    <strong style="color: #34d399;">R$ ${custoHoraExtra.toLocaleString("pt-BR")}</strong>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="btn-abrir-sabado" style="padding: 12px; background: #059669; color: #fff; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.2s;">
                    🛠️ Abrir no Sábado (Pagar Hora Extra)
                </button>
                <button id="btn-descansar-fds" style="padding: 12px; background: #27272a; color: #d4d4d8; font-weight: bold; border: 1px solid #3f3f46; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.2s;">
                    🏖️ Descansar (Pular Sábado e Domingo)
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btn-abrir-sabado").onclick = () => {
        modal.remove();
        if(jogo.dinheiro < custoHoraExtra) {
            mostrarAlerta("💸 Dinheiro Insuficiente", `Você não tem R$ ${custoHoraExtra.toLocaleString("pt-BR")} para pagar as horas extras.\nA garagem ficará fechada.`);
            pularFimDeSemanaCompleto();
            return;
        }

        jogo.dinheiro -= custoHoraExtra;
        salvarJogo();
        atualizarPainel();

        animarAvancoVisual("Abrindo garagem no Sábado (Hora Extra)... 🚗🔧", () => {
            jogo.dia++;
            jogo.diaSemana = 6; // Sábado
            
            if(jogo.dia > 30){
                jogo.dia = 1;
                jogo.mes++;
                cobrarDespesasMensais();
            }
            if(jogo.mes > 12){
                jogo.mes = 1;
                jogo.ano++;
            }

            // Cobra as despesas do sábado trabalhado normalmente
            let totalGastoSabado = cobrarDespesasDiarias();

            salvarJogo();
            atualizarPainel();
            atualizarDataPainel();

            mostrarAvisoTopo(
                "📅 Sábado<br>" + String(jogo.dia).padStart(2,"0") + "/" + String(jogo.mes).padStart(2,"0") + "/" + jogo.ano +
                "<br><br>🛠️ Garagem aberta em regime de hora extra.<br>💸 Custos hoje: <strong>R$ " + totalGastoSabado.toLocaleString("pt-BR") + "</strong>"
            );
        });
    };

    document.getElementById("btn-descansar-fds").onclick = () => {
        modal.remove();
        pularFimDeSemanaCompleto();
    };
}

function pularFimDeSemanaCompleto() {
    animarAvancoFimDeSemana(() => {
        jogo.dia += 3;
        jogo.diaSemana = 1; // Segunda-feira

        if(jogo.dia > 30){
            jogo.dia -= 30;
            jogo.mes++;
            cobrarDespesasMensais();
        }
        if(jogo.mes > 12){
            jogo.mes = 1;
            jogo.ano++;
        }

        let relatorioMadrugada = rolarEventoMadrugadaFimDeSemana();

        let custoFimDeSemana = 150;
        jogo.dinheiro -= custoFimDeSemana;
        jogo.financeiro.gastosHoje = 0;

        if(typeof atualizarOficinaDia === "function"){
            atualizarOficinaDia();
        }

        if(typeof atualizarClientesNovoDia === "function"){
            atualizarClientesNovoDia();
        }

        salvarJogo();
        atualizarPainel();
        atualizarDataPainel();

        mostrarAvisoTopo(
            "📅 " + diasSemana[jogo.diaSemana] +
            "<br>" +
            String(jogo.dia).padStart(2,"0") + "/" +
            String(jogo.mes).padStart(2,"0") + "/" +
            jogo.ano +
            "<br><br>" +
            `🏖️ Fim de semana concluído!<br>Taxas básicas: <strong>- R$ ${custoFimDeSemana}</strong>` +
            relatorioMadrugada
        );
    });
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