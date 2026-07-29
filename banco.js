// ===========================
// BANCO.JS V4.9 (VERSÃO LIMPA - SEM DIAS DO JOGO)
// G2 GARAGEM
// ===========================

function mostrarBanco(){
    let emprestimos = jogo.emprestimos || [];

    let html = `
    <h2>🏦 BANCO G2 & CENTRO FINANCEIRO</h2>
    <div class="card">
        <p>Gerencie seus financiamentos e empréstimos parcelados, arrisque no trade automotivo ou tente a sorte no cassino!</p>
        <hr>
    `;

    if(emprestimos.length > 0){
        html += `<h3 style="color: #ff5252; margin-top: 0;">📑 Empréstimos e Financiamentos Ativos</h3>`;
        
        emprestimos.forEach((emp, index) => {
            let parcelasRestantes = emp.totalParcelas - emp.parcelasPagas;
            let vencido = emp.diasRestantes <= 0;
            let statusPrazo = vencido ? `⚠️ VENCIDO! Pague agora!` : `Vence em: ${emp.diasRestantes} dias`;
            
            html += `
            <div style="background: #2a1a1a; border: 1px solid #d32f2f; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                <p><strong>${emp.nome}</strong></p>
                <p>💰 Parcela Atual: <strong>R$ ${emp.valorParcela.toLocaleString("pt-BR")}</strong></p>
                <p>📊 Parcelas Restantes: <strong>${parcelasRestantes} de ${emp.totalParcelas}</strong></p>
                <p>📅 Prazo: <strong style="color: ${!vencido ? '#4CAF50' : '#ff5252'}">${statusPrazo}</strong></p>
                <div style="display: flex; gap: 5px; margin-top: 8px;">
                    <button onclick="pagarParcela(${index})" style="flex:1; padding: 8px; background: #4CAF50; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                        💳 Pagar Parcela (R$ ${emp.valorParcela.toLocaleString("pt-BR")})
                    </button>
                    <button onclick="quitarDividaTotal(${index})" style="flex:1; padding: 8px; background: #ff9800; color: #000; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;" title="Quita o saldo devedor restante com desconto">
                        ⚡ Quitar Tudo
                    </button>
                </div>
            </div>
            `;
        });
    } else {
        html += `
        <div style="margin-bottom: 15px;">
            <p style="color: #4CAF50;">✅ Sua ficha financeira está limpa. Nenhuma dívida ativa no momento.</p>
        </div>
        `;
    }

    html += `
        <div style="margin-top: 15px;">
            <button onclick="abrirEmprestimosBanco()" style="width: 100%; padding: 12px; background: #2196F3; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📑 Solicitar Novo Empréstimo / Financiamento
            </button>
        </div>
        <br>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="abrirTradeBanco()" style="padding: 12px; background: #9c27b0; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📈 Trade de Mercado (Alto Risco)
            </button>
            <button onclick="abrirCassinoBanco()" style="padding: 12px; background: #ff9800; color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                🎰 Cassino / Tente a Sorte
            </button>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
}

// ===========================
// 1. MODALIDADES DE EMPRÉSTIMO PARCELADO
// ===========================
function abrirEmprestimosBanco(){
    if(jogo.emprestimos && jogo.emprestimos.length > 0){
        mostrarAlerta("⚠️ Crédito Negado pelo Gerente", "O Banco G2 não autoriza múltiplos financiamentos simultâneos. Quite ou pague suas parcelas atuais antes de contrair uma nova dívida.");
        mostrarBanco();
        return;
    }

    let html = `
    <h2>📑 Central de Crédito & Financiamentos</h2>
    <div class="card">
        <p>Escolha a linha de crédito ideal para alavancar os seus negócios. Cada contrato exige o pagamento de parcelas antes do vencimento para evitar juros.</p>
        <hr>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="contratarEmprestimo('Capital de Giro Rápido', 20000, 5, 5200)" style="padding: 10px; background: #333; color: #fff; border: 1px solid #555; border-radius: 6px; cursor: pointer; text-align: left;">
                💰 <strong>Capital de Giro</strong><br>
                <span style="font-size: 0.9em; color: #aaa;">Recebe R$ 20.000 | 5 parcelas de R$ 5.200 (Total: R$ 26.000)</span>
            </button>
            <button onclick="contratarEmprestimo('Expansão de Garagem', 60000, 8, 9500)" style="padding: 10px; background: #333; color: #fff; border: 1px solid #555; border-radius: 6px; cursor: pointer; text-align: left;">
                🏢 <strong>Financiamento de Expansão</strong><br>
                <span style="font-size: 0.9em; color: #aaa;">Recebe R$ 60.000 | 8 parcelas de R$ 9.500 (Total: R$ 76.000)</span>
            </button>
            <button onclick="contratarEmprestimo('Crédito Pesado Automotivo', 180000, 12, 19000)" style="padding: 10px; background: #333; color: #fff; border: 1px solid #555; border-radius: 6px; cursor: pointer; text-align: left;">
                🚗 <strong>Crédito Pesado Frota</strong><br>
                <span style="font-size: 0.9em; color: #aaa;">Recebe R$ 180.000 | 12 parcelas de R$ 19.000 (Total: R$ 228.000)</span>
            </button>
        </div>
        <br>
        <button onclick="mostrarBanco()" style="width: 100%; padding: 10px; background: #444; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
            ⬅️ Voltar ao Banco
        </button>
    </div>
    `;
    conteudo.innerHTML = html;
}

function contratarEmprestimo(nome, valorRecebido, totalParcelas, valorParcela){
    if(!jogo.emprestimos) jogo.emprestimos = [];

    jogo.dinheiro += valorRecebido;

    let novoEmprestimo = {
        nome: nome,
        valorParcela: valorParcela,
        totalParcelas: totalParcelas,
        parcelasPagas: 0,
        diasRestantes: 30
    };

    jogo.emprestimos.push(novoEmprestimo);

    salvarJogo();
    atualizarPainel();
    
    mostrarAlerta("📑 Financiamento Liberado", `O Banco G2 depositou R$ ${valorRecebido.toLocaleString("pt-BR")} em sua conta!\n\nContrato: ${nome}\nVocê assumiu ${totalParcelas} parcelas de R$ ${valorParcela.toLocaleString("pt-BR")}.\nVocê tem 30 dias para pagar a primeira parcela.`);
    mostrarBanco();
}

function pagarParcela(indice){
    let emp = jogo.emprestimos[indice];
    if(!emp) return;

    if(jogo.dinheiro < emp.valorParcela){
        mostrarAlerta("❌ Saldo Insuficiente", `Você não tem R$ ${emp.valorParcela.toLocaleString("pt-BR")} para pagar esta parcela.`);
        return;
    }

    jogo.dinheiro -= emp.valorParcela;
    emp.parcelasPagas++;
    emp.diasRestantes = 30;

    let mensagemAlerta = "";
    if(emp.parcelasPagas >= emp.totalParcelas){
        jogo.emprestimos.splice(indice, 1);
        mensagemAlerta = "🎉 Parabéns! Você quitou a última parcela e encerrou este contrato de financiamento com sucesso!";
    } else {
        let restam = emp.totalParcelas - emp.parcelasPagas;
        mensagemAlerta = `💳 Parcela paga com sucesso!\n\nRestam ${restam} parcelas. O prazo foi renovado por mais 30 dias.`;
    }

    salvarJogo();
    atualizarPainel();
    mostrarAlerta("✅ Pagamento Registrado", mensagemAlerta);
    mostrarBanco();
}

function quitarDividaTotal(indice){
    let emp = jogo.emprestimos[indice];
    if(!emp) return;

    let parcelasRestantes = emp.totalParcelas - emp.parcelasPagas;
    let valorQuitacao = Math.floor((emp.valorParcela * parcelasRestantes) * 0.90);

    if(jogo.dinheiro < valorQuitacao){
        mostrarAlerta("❌ Saldo Insuficiente", `Você precisa de R$ ${valorQuitacao.toLocaleString("pt-BR")} (com 10% de desconto de antecipação) para quitar este contrato.`);
        return;
    }

    jogo.dinheiro -= valorQuitacao;
    jogo.emprestimos.splice(indice, 1);

    salvarJogo();
    atualizarPainel();
    mostrarAlerta("⚡ Dívida Quitada Antecipadamente", `Você pagou R$ ${valorQuitacao.toLocaleString("pt-BR")} à vista e liquidou todas as parcelas restantes com desconto!`);
    mostrarBanco();
}

function checarVencimentoEmprestimo(){
    if(!jogo.emprestimos || jogo.emprestimos.length === 0) return;
    let penalidadeAplicada = false;

    jogo.emprestimos.forEach(emp => {
        emp.diasRestantes--;
        
        if(emp.diasRestantes < 0){
            jogo.reputacao = Math.max(0, (jogo.reputacao || 0) - 2);
            emp.valorParcela = Math.floor(emp.valorParcela * 1.10);
            emp.diasRestantes = 0; 
            penalidadeAplicada = true;
        }
    });

    if(penalidadeAplicada){
        salvarJogo();
    }
}

// ===========================
// 2. TRADE DE MERCADO (INVESTIMENTO)
// ===========================
function abrirTradeBanco(){
    let html = `
    <h2>📈 Trade Automotivo (Investimento de Risco)</h2>
    <div class="card">
        <p>Invista dinheiro em ações de importação de peças e lotes de carros. O mercado pode disparar e te dar um lucro absurdo, ou dar prejuízo!</p>
        <hr>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="executarTrade(5000)" style="padding: 12px; background: #2e7d32; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                🟢 Investimento Baixo: <strong>R$ 5.000</strong>
            </button>
            <button onclick="executarTrade(20000)" style="padding: 12px; background: #2e7d32; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                🟢 Investimento Médio: <strong>R$ 20.000</strong>
            </button>
            <button onclick="executarTrade(50000)" style="padding: 12px; background: #2e7d32; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                🟢 Investimento Pesado: <strong>R$ 50.000</strong>
            </button>
        </div>
        <br>
        <button onclick="mostrarBanco()" style="width: 100%; padding: 10px; background: #444; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
            ⬅️ Voltar ao Banco
        </button>
    </div>
    `;
    conteudo.innerHTML = html;
}

function executarTrade(valorInvestido){
    if(jogo.dinheiro < valorInvestido){
        mostrarAlerta("❌ Saldo Insuficiente", "Você não tem dinheiro suficiente para realizar este trade!");
        return;
    }

    jogo.dinheiro -= valorInvestido;
    let sorteio = Math.random();
    
    if(sorteio < 0.45){
        let perda = Math.floor(valorInvestido * aleatorio(50, 100) / 100);
        let devolucao = valorInvestido - perda;
        jogo.dinheiro += devolucao;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("📉 Trade Deu Ruim!", `O mercado derreteu!\n\nVocê investiu R$ ${valorInvestido.toLocaleString("pt-BR")} e recuperou apenas R$ ${devolucao.toLocaleString("pt-BR")} (Prejuízo de R$ ${perda.toLocaleString("pt-BR")}).`);
    } else if(sorteio < 0.85){
        let lucroExtra = Math.floor(valorInvestido * aleatorio(30, 80) / 100);
        let totalRetorno = valorInvestido + lucroExtra;
        jogo.dinheiro += totalRetorno;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("📈 Trade Deu Bom!", `As importações valorizaram!\n\nSeu investimento de R$ ${valorInvestido.toLocaleString("pt-BR")} rendeu um lucro líquido de R$ ${lucroExtra.toLocaleString("pt-BR")}!`);
    } else {
        let totalRetorno = valorInvestido * 2;
        jogo.dinheiro += totalRetorno;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("🚀 ESTOUROU NA BOLSA!", `Seu lote de peças virou febre!\n\nO trade DOBROU o seu investimento! Você colocou R$ ${valorInvestido.toLocaleString("pt-BR")} e tirou R$ ${totalRetorno.toLocaleString("pt-BR")} limpinho!`);
    }

    abrirTradeBanco();
}

// ===========================
// 3. CASSINO / TENTE A SORTE
// ===========================
function abrirCassinoBanco(){
    let html = `
    <h2>🎰 Cassino G2 - Tente a Sorte</h2>
    <div class="card">
        <p>Escolha o seu jogo favorito, faça a aposta e veja se a sorte está do seu lado hoje:</p>
        <hr>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="jogarRoletaCarros()" style="padding: 12px; background: #e91e63; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                🏎️ Roleta de Rodas (Aposta R$ 2.000 | Chance 50% de Dobrar)
            </button>
            <button onclick="jogarCaçaNiquel()" style="padding: 12px; background: #e91e63; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                🎰 Caça-Níquel Automotivo (Aposta R$ 5.000 | Pode Triplicar)
            </button>
            <button onclick="jogarTudoOuNada()" style="padding: 12px; background: #d32f2f; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                🔥 Tudo ou Nada (Aposta R$ 10.000 | 25% de Chance de 5x)
            </button>
        </div>
        <br>
        <button onclick="mostrarBanco()" style="width: 100%; padding: 10px; background: #444; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
            ⬅️ Voltar ao Banco
        </button>
    </div>
    `;
    conteudo.innerHTML = html;
}

function jogarRoletaCarros(){
    let aposta = 2000;
    if(jogo.dinheiro < aposta){
        mostrarAlerta("💸 Sem Grana", "Você precisa de pelo menos R$ 2.000 para jogar na Roleta de Rodas!");
        return;
    }
    jogo.dinheiro -= aposta;

    if(Math.random() < 0.50){
        let premio = aposta * 2;
        jogo.dinheiro += premio;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("🎉 DEU SORTAÇO!", `Você apostou R$ ${aposta.toLocaleString("pt-BR")} e ganhou R$ ${premio.toLocaleString("pt-BR")}!`);
    } else {
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("❌ PERDEU!", `Você perdeu os R$ ${aposta.toLocaleString("pt-BR")} da aposta.`);
    }
    abrirCassinoBanco();
}

function jogarCaçaNiquel(){
    let aposta = 5000;
    if(jogo.dinheiro < aposta){
        mostrarAlerta("💸 Sem Grana", "Você precisa de pelo menos R$ 5.000 para jogar no Caça-Níquel!");
        return;
    }
    jogo.dinheiro -= aposta;

    let sorte = Math.random();
    if(sorte < 0.30){
        let premio = aposta * 3;
        jogo.dinheiro += premio;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("🎰 JACKPOT DUPLO!", `Alinhou três peças raras!\n\nVocê triplicou a aposta e levou R$ ${premio.toLocaleString("pt-BR")}!`);
    } else if(sorte < 0.55){
        jogo.dinheiro += aposta;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("🔄 EMPATOU!", `Você recuperou os seus R$ ${aposta.toLocaleString("pt-BR")}.`);
    } else {
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("❌ TENTE DE NOVO", `O cassino ficou com os R$ ${aposta.toLocaleString("pt-BR")}.`);
    }
    abrirCassinoBanco();
}

function jogarTudoOuNada(){
    let aposta = 10000;
    if(jogo.dinheiro < aposta){
        mostrarAlerta("💸 Sem Grana", "Você precisa de R$ 10.000 para encarar o Tudo ou Nada!");
        return;
    }
    jogo.dinheiro -= aposta;

    if(Math.random() < 0.25){
        let premio = aposta * 5;
        jogo.dinheiro += premio;
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("🏆 BOLADA MÁXIMA!", `Você arriscou tudo e levou 5x!\n\nPrêmio: R$ ${premio.toLocaleString("pt-BR")}!`);
    } else {
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("💥 QUEBROU A CARA!", `Você perdeu os R$ ${aposta.toLocaleString("pt-BR")} da aposta!`);
    }
    abrirCassinoBanco();
}

if(!jogo.emprestimos) {
    jogo.emprestimos = [];
}