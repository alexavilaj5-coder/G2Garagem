// ===========================================
// BANCO.JS V5.2 (EXTRATO INTELIGENTE COM SALDO & MOVIMENTAÇÕES)
// G2 GARAGEM
// ===========================================

function registrarExtrato(descricao, valor, tipo) {
    if (!jogo.extratoBancario) jogo.extratoBancario = [];
    
    let dia = jogo.dia || 1;
    let mes = jogo.mes || 1;
    let ano = jogo.ano || 2026;
    let dataStr = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

    // Pega o saldo atual correto da conta no momento da transação
    let saldoAtual = jogo.dinheiro || 0;

    jogo.extratoBancario.unshift({
        data: dataStr,
        descricao: descricao,
        valor: valor,
        tipo: tipo, // 'entrada' ou 'saida'
        saldoApos: saldoAtual // Salva o saldo exato após a operação
    });

    if (jogo.extratoBancario.length > 50) {
        jogo.extratoBancario.pop();
    }
}

// 🎁 EASTER EGG: Precisa clicar 8 vezes no título do banco para ganhar 50k + Foto do Edson
let contadorEasterEgg = 0;

function easterEggGrana() {
    contadorEasterEgg++;
    
    if (contadorEasterEgg >= 8) {
        contadorEasterEgg = 0; // Reseta para poder usar de novo se quiser
        jogo.dinheiro = (jogo.dinheiro || 0) + 50000;
        registrarExtrato("Easter Egg (Bônus)", 50000, 'entrada');
        salvarJogo();
        atualizarPainel();
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
        
        // Exibe o alerta com a foto do Edson (substitua 'edson.png' pelo nome exato do arquivo da foto se for diferente)
        let mensagemComFoto = `
            <div style="text-align: center;">
                <img src="edson.png" alt="Edson" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #ffb700; margin-bottom: 10px;"><br>
                <span>Você recebeu R$ 50.000,00 de brinde na conta após 8 cliques!</span>
            </div>
        `;
        mostrarAlerta("🎁 Easter Egg do Carlinhos Ativado!", mensagemComFoto);
    } else {
        let faltam = 8 - contadorEasterEgg;
        console.log(`Easter egg: clique ${contadorEasterEgg}/8 (Faltam ${faltam})`);
    }
    
    mostrarBanco();
}

function mostrarBanco(){
    let emprestimos = jogo.emprestimos || [];

    let html = `
    <h2 onclick="easterEggGrana()" style="cursor: pointer;" title="Clique 8 vezes aqui...">🏦 BANCO G2 & CENTRO FINANCEIRO</h2>
    <div class="card">
        <p>Gerencie seus financiamentos e empréstimos parcelados, acompanhe seu extrato ou tente a sorte no cassino!</p>
        <hr>
    `;

    if(emprestimos.length > 0){
        html += `<h3 style="color: #ff5252; margin-top: 0;">📑 Empréstimos e Financiamentos Ativos</h3>`;
        
        emprestimos.forEach((emp, index) => {
            let parcelasRestantes = emp.totalParcelas - emp.parcelasPagas;
            let vencido = emp.diasRestantes <= 0;
            let statusPrazo = vencido ? `⚠️ VENCIDO! Juros acumulados` : `Vence em: ${emp.diasRestantes} dias`;
            
            html += `
            <div style="background: #2a1a1a; border: 1px solid ${vencido ? '#ff5252' : '#d32f2f'}; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                <p><strong>${emp.nome}</strong></p>
                <p>💰 Valor da Parcela: <strong style="color: #ffb700;">R$ ${emp.valorParcela.toLocaleString("pt-BR")}</strong> ${vencido ? '<span style="color: #ff5252; font-size: 0.8rem;">(Com juros de atraso)</span>' : ''}</p>
                <p>📊 Parcelas Restantes: <strong>${parcelasRestantes} de ${emp.totalParcelas}</strong> (Pagas: ${emp.parcelasPagas})</p>
                <p>📅 Prazo: <strong style="color: ${!vencido ? '#4CAF50' : '#ff5252'}">${statusPrazo}</strong></p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px;">
                    <button onclick="pagarParcela(${index})" style="padding: 8px; background: #4CAF50; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                        💳 Pagar Parcela
                    </button>
                    <button onclick="abrirRefinanciamento(${index})" style="padding: 8px; background: #2196F3; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                        🔄 Refinanciar Dívida
                    </button>
                    <button onclick="quitarDividaTotal(${index})" style="grid-column: span 2; padding: 8px; background: #ff9800; color: #000; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;" title="Quita o saldo devedor restante com desconto">
                        ⚡ Quitar Tudo com Desconto
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
        <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
            <button onclick="abrirEmprestimosBanco()" style="width: 100%; padding: 12px; background: #2196F3; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📑 Solicitar Novo Empréstimo / Financiamento
            </button>
            <button onclick="abrirExtratoBanco()" style="width: 100%; padding: 12px; background: #37474F; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📄 Extrato Bancário de Movimentações
            </button>
        </div>
        <br>
        <div style="display: flex; flex-direction: column; gap: 8px;">
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
        mostrarAlerta("⚠️ Crédito Negado pelo Gerente", "O Banco G2 não autoriza múltiplos financiamentos simultâneos. Quite, pague ou renegocie suas parcelas atuais antes de contrair uma nova dívida.");
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
            <button onclick="contratarEmprestimo('Crédito Comercial G2', 180000, 12, 19000)" style="padding: 10px; background: #333; color: #fff; border: 1px solid #555; border-radius: 6px; cursor: pointer; text-align: left;">
                🚗 <strong>Crédito Comercial G2</strong><br>
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
    registrarExtrato(`Empréstimo contratado: ${nome}`, valorRecebido, 'entrada');

    let novoEmprestimo = {
        nome: nome,
        valorParcelaBase: valorParcela,
        valorParcela: valorParcela,
        totalParcelas: totalParcelas,
        parcelasPagas: 0,
        diasRestantes: 30,
        atrasado: false
    };

    jogo.emprestimos.push(novoEmprestimo);

    salvarJogo();
    atualizarPainel();
    
    mostrarAlerta("📑 Financiamento Liberado", `O Banco G2 depositou R$ ${valorRecebido.toLocaleString("pt-BR")} em sua conta!\n\nContrato: ${nome}\nVocê assumiu ${totalParcelas} parcelas de R$ ${valorParcela.toLocaleString("pt-BR")}.\nVocê tiene 30 dias para pagar a primeira parcela.`);
    mostrarBanco();
}

function pagarParcela(indice){
    let emp = jogo.emprestimos[indice];
    if(!emp) return;

    let valorDevido = emp.valorParcela;

    if(jogo.dinheiro < valorDevido){
        mostrarAlerta("❌ Saldo Insuficiente", `Você não tem R$ ${valorDevido.toLocaleString("pt-BR")} para pagar esta parcela.`);
        return;
    }

    jogo.dinheiro -= valorDevido;
    registrarExtrato(`Pagamento de parcela (${emp.nome})`, valorDevido, 'saida');

    emp.parcelasPagas++;
    
    let diasRestantesAtuais = emp.diasRestantes > 0 ? emp.diasRestantes : 0;
    emp.diasRestantes = diasRestantesAtuais + 30;

    emp.valorParcela = emp.valorParcelaBase; 
    emp.atrasado = false;

    let mensagemAlerta = "";
    if(emp.parcelasPagas >= emp.totalParcelas){
        jogo.emprestimos.splice(indice, 1);
        mensagemAlerta = "🎉 Parabéns! Você quitou a última parcela e encerrou este contrato de financiamento com sucesso!";
    } else {
        let restam = emp.totalParcelas - emp.parcelasPagas;
        mensagemAlerta = `💳 Parcela paga com sucesso!\n\nRestam ${restam} parcelas. Como você antecipou, o prazo da próxima parcela foi estendido para ${emp.diasRestantes} dias!`;
    }

    salvarJogo();
    atualizarPainel();
    if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
    mostrarAlerta("✅ Pagamento Registrado", mensagemAlerta);
    mostrarBanco();
}

function quitarDividaTotal(indice){
    let emp = jogo.emprestimos[indice];
    if(!emp) return;

    let parcelasRestantes = emp.totalParcelas - emp.parcelasPagas;
    let valorQuitacao = Math.floor((emp.valorParcelaBase * parcelasRestantes) * 0.90);

    if(jogo.dinheiro < valorQuitacao){
        mostrarAlerta("❌ Saldo Insuficiente", `Você precisa de R$ ${valorQuitacao.toLocaleString("pt-BR")} (com 10% de desconto de antecipação) para quitar este contrato.`);
        return;
    }

    jogo.dinheiro -= valorQuitacao;
    registrarExtrato(`Quitação antecipada de dívida (${emp.nome})`, valorQuitacao, 'saida');
    jogo.emprestimos.splice(indice, 1);

    salvarJogo();
    atualizarPainel();
    if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
    mostrarAlerta("⚡ Dívida Quitada Antecipadamente", `Você pagou R$ ${valorQuitacao.toLocaleString("pt-BR")} à vista e liquidou todas as parcelas restantes com desconto!`);
    mostrarBanco();
}

// ===========================
// 2. REFINANCIAMENTO DA DÍVIDA
// ===========================
function abrirRefinanciamento(indice){
    let emp = jogo.emprestimos[indice];
    if(!emp) return;

    let parcelasRestantes = emp.totalParcelas - emp.parcelasPagas;
    
    let html = `
    <h2>🔄 Refinanciamento de Contrato</h2>
    <div class="card">
        <p>Está sufocado com a parcela atual? O Banco G2 pode renegociar o seu saldo devedor, esticando o prazo para aliviar o seu fluxo de caixa mensal.</p>
        <hr>
        <p style="color: #fff;"><strong>Contrato:</strong> ${emp.nome}</p>
        <p style="color: #aaa;">Parcelas restantes atuais: ${parcelasRestantes}</p>
        <p style="color: #ffb700;">Valor atual da parcela: R$ ${emp.valorParcela.toLocaleString("pt-BR")}</p>
        <br>
        <p style="font-weight: bold; color: #fff;">Nova proposta do Banco:</p>
        <p style="color: #4CAF50; font-size: 1.1rem;">📅 +4 Meses no prazo | Parcela reduzida em aprox. 25%!</p>
        <br>
        <div style="display: flex; gap: 10px;">
            <button onclick="confirmarRefinanciamento(${indice})" style="flex:1; padding: 12px; background: #2196F3; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                ✅ Aceitar Acordo
            </button>
            <button onclick="mostrarBanco()" style="flex:1; padding: 12px; background: #444; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                ❌ Recusar
            </button>
        </div>
    </div>
    `;
    conteudo.innerHTML = html;
}

function confirmarRefinanciamento(indice){
    let emp = jogo.emprestimos[indice];
    if(!emp) return;

    emp.totalParcelas += 4; 
    emp.valorParcelaBase = Math.floor(emp.valorParcelaBase * 0.82); 
    emp.valorParcela = emp.valorParcelaBase;
    emp.diasRestantes += 30; 
    emp.atrasado = false;

    salvarJogo();
    atualizarPainel();
    mostrarAlerta("🔄 Refinanciamento Concluído", "Seu contrato foi renegociado com sucesso! O prazo foi estendido e o valor da parcela ajustado.");
    mostrarBanco();
}

function checarVencimentoEmprestimo(){
    if(!jogo.emprestimos || jogo.emprestimos.length === 0) return;
    let penalidadeAplicada = false;

    jogo.emprestimos.forEach(emp => {
        emp.diasRestantes--;
        
        if(emp.diasRestantes < 0){
            jogo.reputacao = Math.max(0, (jogo.reputacao || 0) - 2);
            if (!emp.atrasado) {
                emp.valorParcela = Math.floor(emp.valorParcela * 1.10);
                emp.atrasado = true;
            }
            emp.diasRestantes = 0; 
            penalidadeAplicada = true;
        }
    });

    if(penalidadeAplicada){
        salvarJogo();
    }
}

// ===========================
// 3. EXTRATO BANCÁRIO INTELIGENTE COM SALDOS
// ===========================
function abrirExtratoBanco(){
    let extrato = jogo.extratoBancario || [];
    let saldoAtualConta = jogo.dinheiro || 0;
    let itensHtml = "";

    if(extrato.length === 0){
        itensHtml = `<p style="color: #aaa; text-align: center; padding: 20px;">Nenhuma movimentação registrada no extrato ainda.</p>`;
    } else {
        itensHtml = extrato.map(item => {
            let corValor = item.tipo === 'entrada' ? '#4CAF50' : '#ff5252';
            let sinal = item.tipo === 'entrada' ? '+' : '-';
            let saldoAposFormatado = (item.saldoApos !== undefined) ? item.saldoApos.toLocaleString("pt-BR") : '0';

            return `
            <div style="background: #1e1e1e; border-bottom: 1px solid #333; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                <div>
                    <span style="color: #888; font-size: 0.8rem;">[${item.data}]</span><br>
                    <span style="color: #fff; font-weight: 500;">${item.descricao}</span><br>
                    <span style="color: #71717a; font-size: 0.75rem;">Saldo após: R$ ${saldoAposFormatado}</span>
                </div>
                <strong style="color: ${corValor}; font-size: 1rem;">${sinal} R$ ${item.valor.toLocaleString("pt-BR")}</strong>
            </div>
            `;
        }).join('');
    }

    let html = `
    <h2>📄 Extrato Bancário</h2>
    <div class="card">
        <div style="background: #111827; border: 1px solid #1f2937; padding: 12px; border-radius: 6px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #9ca3af; font-size: 0.9rem;">💰 Saldo Atual em Conta:</span>
            <strong style="color: #34d399; font-size: 1.1rem;">R$ ${saldoAtualConta.toLocaleString("pt-BR")}</strong>
        </div>

        <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 10px;">Histórico completo de entradas e saídas de capital da sua conta corrente.</p>
        
        <div style="max-height: 350px; overflow-y: auto; border: 1px solid #333; border-radius: 6px;">
            ${itensHtml}
        </div>
        <br>
        <button onclick="mostrarBanco()" style="width: 100%; padding: 10px; background: #444; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
            ⬅️ Voltar ao Banco
        </button>
    </div>
    `;
    conteudo.innerHTML = html;
}

// ===========================
// 4. TRADE DE MERCADO (INVESTIMENTO)
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
    registrarExtrato(`Investimento em Trade de Mercado`, valorInvestido, 'saida');

    let sorteio = Math.random();
    
    if(sorteio < 0.45){
        let perda = Math.floor(valorInvestido * aleatorio(50, 100) / 100);
        let devolucao = valorInvestido - perda;
        jogo.dinheiro += devolucao;
        registrarExtrato(`Retorno de Trade (Prejuízo)`, devolucao, 'entrada');
        salvarJogo();
        atualizarPainel();
        mostrarAlerta("📉 Trade Deu Ruim!", `O mercado derreteu!\n\nVocê investiu R$ ${valorInvestido.toLocaleString("pt-BR")} e recuperou apenas R$ ${devolucao.toLocaleString("pt-BR")} (Prejuízo de R$ ${perda.toLocaleString("pt-BR")}).`);
    } else if(sorteio < 0.85){
        let lucroExtra = Math.floor(valorInvestido * aleatorio(30, 80) / 100);
        let totalRetorno = valorInvestido + lucroExtra;
        jogo.dinheiro += totalRetorno;
        registrarExtrato(`Retorno de Trade (Lucro)`, totalRetorno, 'entrada');
        salvarJogo();
        atualizarPainel();
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
        mostrarAlerta("📈 Trade Deu Bom!", `As importações valorizaram!\n\nSeu investimento de R$ ${valorInvestido.toLocaleString("pt-BR")} rendeu um lucro líquido de R$ ${lucroExtra.toLocaleString("pt-BR")}!`);
    } else {
        let totalRetorno = valorInvestido * 2;
        jogo.dinheiro += totalRetorno;
        registrarExtrato(`Retorno de Trade (Estouro na Bolsa)`, totalRetorno, 'entrada');
        salvarJogo();
        atualizarPainel();
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
        mostrarAlerta("🚀 ESTOUROU NA BOLSA!", `Seu lote de peças virou febre!\n\nO trade DOBROU o seu investimento! Você colocou R$ ${valorInvestido.toLocaleString("pt-BR")} e tirou R$ ${totalRetorno.toLocaleString("pt-BR")} limpinho!`);
    }

    abrirTradeBanco();
}

// ===========================
// 5. CASSINO / TENTE A SORTE
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
    registrarExtrato("Aposta no Cassino (Roleta)", aposta, 'saida');

    if(Math.random() < 0.50){
        let premio = aposta * 2;
        jogo.dinheiro += premio;
        registrarExtrato("Prêmio no Cassino (Roleta)", premio, 'entrada');
        salvarJogo();
        atualizarPainel();
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
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
    registrarExtrato("Aposta no Cassino (Caça-Níquel)", aposta, 'saida');

    let sorte = Math.random();
    if(sorte < 0.30){
        let premio = aposta * 3;
        jogo.dinheiro += premio;
        registrarExtrato("Prêmio no Cassino (Caça-Níquel)", premio, 'entrada');
        salvarJogo();
        atualizarPainel();
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
        mostrarAlerta("🎰 JACKPOT DUPLO!", `Alinhou três peças raras!\n\nVocê triplicou a aposta e levou R$ ${premio.toLocaleString("pt-BR")}!`);
    } else if(sorte < 0.55){
        jogo.dinheiro += aposta;
        registrarExtrato("Reembolso de Aposta (Caça-Níquel)", aposta, 'entrada');
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
        mostrarAlerta("💸 Sem Grana", "You need R$ 10.000 para encarar o Tudo ou Nada!");
        return;
    }
    jogo.dinheiro -= aposta;
    registrarExtrato("Aposta no Cassino (Tudo ou Nada)", aposta, 'saida');

    if(Math.random() < 0.25){
        let premio = aposta * 5;
        jogo.dinheiro += premio;
        registrarExtrato("Prêmio no Cassino (Tudo ou Nada)", premio, 'entrada');
        salvarJogo();
        atualizarPainel();
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
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
if(!jogo.extratoBancario) {
    jogo.extratoBancario = [];
}