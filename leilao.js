// ===========================================
// LEILÃO.JS V10.0 - COMPRA E VENDA SIMULTÂNEAS 🚀🚗💼
// G2 GARAGEM
// ===========================================

const carrosLeilaoLote = [
    { marca: "Chevrolet", modelo: "Opala Diplomata SE", ano: 1992, fipeBase: 38000, categoria: "Clássico" },
    { marca: "Volkswagen", modelo: "Gol Quadrado GTS 1.8", ano: 1994, fipeBase: 32000, categoria: "Esportivo" },
    { marca: "Fiat", modelo: "Tempra 16V Turbo", ano: 1995, fipeBase: 24000, categoria: "Sedã" },
    { marca: "Chevrolet", modelo: "Chevette DL", ano: 1993, fipeBase: 16000, categoria: "Popular" },
    { marca: "Ford", modelo: "Escort XR3 Convertible", ano: 1991, fipeBase: 28000, categoria: "Conversível" },
    { marca: "Volkswagen", modelo: "Santana Quantum GLS", ano: 1992, fipeBase: 22000, categoria: "Wagon" },
    { marca: "Fiat", modelo: "Uno Turbo i.e.", ano: 1995, fipeBase: 42000, categoria: "Hot Hatch" },
    { marca: "Chevrolet", modelo: "Caravan Comodoro", ano: 1988, fipeBase: 35000, categoria: "Clássico" },
    { marca: "Volkswagen", modelo: "Fusca Itamar 1600", ano: 1996, fipeBase: 26000, categoria: "Clássico" },
    { marca: "Ford", modelo: "Maverick Super Luxo", ano: 1976, fipeBase: 85000, categoria: "Muscle" },
    { marca: "BMW", modelo: "325i E36 Coupé", ano: 1994, fipeBase: 65000, categoria: "Importado" },
    { marca: "Mercedes-Benz", modelo: "C180 Elegance W202", ano: 1996, fipeBase: 45000, categoria: "Luxo" },
    { marca: "Toyota", modelo: "Supra A70 Turbo", ano: 1991, fipeBase: 120000, categoria: "JDM Legend" },
    { marca: "Mitsubishi", modelo: "Eclipse GSX AWD", ano: 1995, fipeBase: 95000, categoria: "JDM Legend" },
    { marca: "Audi", modelo: "A4 Avant 2.8 Quattro", ano: 1998, fipeBase: 50000, categoria: "Importado" }
];

const pacotesLeilaoEspeciais = [
    {
        nome: "📦 Lote Frota Abandonada de Empresa",
        descricao: "Pacote contendo 2 veículos utilitários de frota com histórico corporativo.",
        quantidadeCarros: 2,
        fipeBaseTotal: 45000,
        categoria: "Lote Múltiplo"
    },
    {
        nome: "📦 Celeiro do Vô Tonho (Dupla Clássica)",
        descricao: "Dois clássicos nacionais encontrados no mesmo celeiro no interior.",
        quantidadeCarros: 2,
        fipeBaseTotal: 58000,
        categoria: "Lote Múltiplo"
    }
];

const descricoesMisteriosas = [
    "Veículo de garagem fechada há anos. Bateria arriada, estofamento com mofo.",
    "Apreendido em pátio municipal por abandono. Histórico duvidoso.",
    "Repasses de financeira de grande porte. Sem chave e motor batendo.",
    "Deixado por herança de tio avô. Muita poeira acumulada, longarinas firmes.",
    "Carro de seguradora (Recuperado). Pequena batida na traseira, mecânica incerta."
];

const concorrentesLeilao = [
    { nome: "Dr. Silveira", tipo: "Colecionador", agressividade: 0.6, orcamentoMaxFator: 0.85 },
    { nome: "Garagista João", tipo: "Revendedor", agressividade: 0.8, orcamentoMaxFator: 0.75 },
    { nome: "Felipe 'Turbo' RS", tipo: "Preparador", agressividade: 0.9, orcamentoMaxFator: 0.90 },
    { nome: "Auto Desmanche Tubarão LTDA", tipo: "Empresa", agressividade: 0.95, orcamentoMaxFator: 0.95 },
    { nome: "Locadora Rápida S.A.", tipo: "Empresa", agressividade: 0.4, orcamentoMaxFator: 0.60 }
];

let leiloesIntervalos = {};

function obterDataJogoFormatada() {
    if (typeof jogo === 'undefined') return "2026-1-1";
    let d = jogo.dia || 1;
    let m = jogo.mes || 1;
    let a = jogo.ano || 2026;
    return `${a}-${m}-${d}`;
}

function verificarLeilaoDiario() {
    if (typeof jogo === 'undefined') return;
    const dataJogoAtual = obterDataJogoFormatada();
    
    if (!jogo.controleLeilaoDiario) {
        jogo.controleLeilaoDiario = { dataUltimoLeilao: "", participouHojeCompra: false };
    }

    if (jogo.controleLeilaoDiario.dataUltimoLeilao !== dataJogoAtual) {
        jogo.controleLeilaoDiario.participouHojeCompra = false;
        jogo.controleLeilaoDiario.dataUltimoLeilao = dataJogoAtual;
        if (typeof salvarJogo === 'function') salvarJogo();
    }
}

// ===========================================
// RENDERIZAÇÃO PRINCIPAL (EXIBE COMPRA E VENDAS SIMULTÂNEAS)
// ===========================================
function mostrarLeilao() {
    if (typeof jogo === 'undefined') return;
    verificarLeilaoDiario();
    injetarEstilosLeilao();

    // Garante que o lote de compra exista se o jogador ainda não concluiu o do dia
    if (!jogo.controleLeilaoDiario.participouHojeCompra && !jogo.loteLeilaoAtual) {
        gerarLoteLeilao();
    }

    if (!jogo.listaCarrosNoLeilao) jogo.listaCarrosNoLeilao = [];

    let html = `
    <div class="leilao-wrapper-container">
        <div class="garagem-header">
            <div class="garagem-titulo">
                <span class="garagem-icone">🏆</span>
                <div class="garagem-texto-titulo">
                    <h1>AUDITÓRIO DE LEILÕES - G2</h1>
                    <p>Compre novos veículos na praça e monitore os leilões dos seus carros ao mesmo tempo</p>
                </div>
            </div>
        </div>

        <!-- SEÇÃO 1: LOTE DE COMPRA (PARA VOCÊ ARREMATAR) -->
        <div style="margin-bottom: 25px;">
            <div class="garagem-header" style="margin-bottom: 10px;">
                <div class="garagem-titulo">
                    <span class="garagem-icone">🛒</span>
                    <div class="garagem-texto-titulo">
                        <h2 style="font-size: 1.2rem; margin:0;">LEILÃO DE COMPRA (DISPUTE O LOTE)</h2>
                        <p style="margin:0; font-size:0.8rem;">Dê lances para adicionar novos carros ao seu pátio</p>
                    </div>
                </div>
            </div>
            <div id="secao-lote-compra">
                ${gerarHtmlLoteCompra()}
            </div>
        </div>

        <!-- SEÇÃO 2: SEUS CARROS NA PRAÇA (PARA OS BOTS COMPRAREM) -->
        <div style="margin-top: 25px;">
            <div class="garagem-header" style="margin-bottom: 10px;">
                <div class="garagem-titulo">
                    <span class="garagem-icone">📢</span>
                    <div class="garagem-texto-titulo">
                        <h2 style="font-size: 1.2rem; margin:0;">SEUS VEÍCULOS SENDO LEILOADOS</h2>
                        <p style="margin:0; font-size:0.8rem;">Acompanhe as ofertas dos colecionadores pelo seu carro</p>
                    </div>
                </div>
            </div>
            <div id="lista-meus-leiloes-container">
                ${gerarHtmlMeusCarrosLeilao()}
            </div>
        </div>

        <div class="leilao-footer-botoes" style="margin-top: 25px;">
            <button onclick="abrirModalColocarCarroLeilao()" class="btn-leilao-secundario">
                🏷️ Enviar outro veículo do pátio para o leilão
            </button>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
    iniciarTodosOsCronometros();
}

// ===========================================
// HTML DO LOTE DE COMPRA
// ===========================================
function gerarHtmlLoteCompra() {
    if (jogo.controleLeilaoDiario.participouHojeCompra && !jogo.loteLeilaoAtual) {
        return `
        <div class="leilao-card-vivo leilao-text-center">
            <span class="leilao-emoji-gigante">⏳</span>
            <h3>Lote de Compra Diário Concluído</h3>
            <p class="leilao-subtext">Você já participou do leilão de aquisição de hoje. Avance o dia para o próximo pregão ou gerencie seus carros na praça abaixo!</p>
            <button onclick="gerarLoteLeilao(); mostrarLeilao();" class="btn-leilao-lance" style="margin-top: 15px; max-width: 250px;">Solicitar Novo Lote Extra</button>
        </div>`;
    }

    if (!jogo.loteLeilaoAtual) return '';

    let lote = jogo.loteLeilaoAtual;
    let corLider = lote.ultimoLicitante === 'Você' ? '#00e676' : '#ffb700';

    return `
    <div class="leilao-card-vivo" id="card-lote-compra">
        <div class="leilao-status-topo">
            <span class="lote-badge-id">📦 ${lote.isPacote ? lote.nomePacote : `LOTE DE COMPRA #${lote.id} (${lote.carroBase.categoria})`}</span>
            <span class="leilao-timer-box" id="timer-leilao">⏱️ ${lote.tempoRestante}s</span>
        </div>

        <div class="lote-caixa-descricao">
            ${lote.isPacote ? `<p><strong>Composição:</strong> Lote com <strong>${lote.quantidadeCarros} veículos</strong>.</p>` : `<p><strong>Veículo:</strong> ${lote.carroBase.marca} ${lote.carroBase.modelo} (${lote.carroBase.ano})</p>`}
            <p class="leilao-citacao-insp">"${lote.descricao}"</p>
        </div>

        <div class="leilao-painel-central">
            <div class="lance-atual-bloco">
                <span class="label-lance">MAIOR LANCE NA MESA DE COMPRA</span>
                <h2 id="valor-lance-atual">R$ ${lote.lanceAtual.toLocaleString("pt-BR")}</h2>
                <small class="quem-esta-ganhando" style="color: ${corLider}" id="lider-compra-txt">
                    👑 Líder do leilão: <strong>${lote.ultimoLicitante}</strong>
                </small>
            </div>
        </div>

        <div class="historico-lances-container">
            <span class="leilao-sec-title">📡 Registro de Lances (Compra)</span>
            <div class="historico-lances" id="historico-lances-box">
                ${gerarHtmlHistorico(lote.historicoLances)}
            </div>
        </div>

        <div class="lote-botoes-acao">
            <button onclick="darLanceLeilao()" class="btn-leilao-lance">
                🔨 COBRIR LANCE (+ R$ ${lote.incremento.toLocaleString("pt-BR")})
            </button>
            <button onclick="abandonarLeilaoCompra()" class="btn-leilao-sair">
                🚪 Abandonar Lote
            </button>
        </div>
    </div>`;
}

// ===========================================
// HTML DOS CARROS DO JOGADOR NA PRAÇA
// ===========================================
function gerarHtmlMeusCarrosLeilao() {
    if (!jogo.listaCarrosNoLeilao || jogo.listaCarrosNoLeilao.length === 0) {
        return `<div class="card" style="background:#18181b; border:1px solid #27272a; text-align:center; padding:15px; color:#a1a1aa; border-radius:8px;">Nenhum veículo seu na praça de leilões no momento.</div>`;
    }

    return jogo.listaCarrosNoLeilao.map((dadosLeilao, index) => `
    <div class="leilao-card-vivo" style="margin-bottom: 15px;" id="card-meu-carro-${index}">
        <div class="leilao-status-topo">
            <span class="lote-badge-id">🚗 ${dadosLeilao.carro.marca} ${dadosLeilao.carro.modelo} (${dadosLeilao.carro.ano})</span>
            <span class="leilao-timer-box" id="timer-meu-carro-${index}">⏱️ ${dadosLeilao.tempoRestante}s</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; background: #121215; padding: 12px; border-radius: 8px; border: 1px solid #27272a;">
            <div>
                <span class="label-lance">MAIOR OFERTA DA MESA</span>
                <h3 style="margin:0; color:#4ade80; font-size: 1.5rem;" id="lance-meu-carro-${index}">R$ ${dadosLeilao.lanceAtual.toLocaleString("pt-BR")}</h3>
                <small style="color:#ffb700;" id="lider-meu-carro-${index}">Interessado: <strong>${dadosLeilao.ultimoLicitante}</strong></small>
            </div>
            <button onclick="retirarCarroLeilao(${index})" class="btn-leilao-sair" style="padding: 8px 12px; font-size: 0.75rem;">Retirar da Praça</button>
        </div>
    </div>
    `).join('');
}

// ===========================================
// GERAÇÃO DOS LOTES DE COMPRA
// ===========================================
function gerarLoteLeilao() {
    let ehPacote = Math.random() < 0.25;

    if (ehPacote) {
        let pacoteBase = pacotesLeilaoEspeciais[aleatorio(0, pacotesLeilaoEspeciais.length - 1)];
        let descricao = descricoesMisteriosas[aleatorio(0, descricoesMisteriosas.length - 1)];
        let lanceInicial = Math.floor(pacoteBase.fipeBaseTotal * aleatorio(30, 45) / 100);

        let qtdRivais = aleatorio(3, 4);
        let disponiveis = [...concorrentesLeilao];
        let ativosNaSala = [];
        for(let i=0; i<qtdRivais; i++){
            let idx = aleatorio(0, disponiveis.length - 1);
            ativosNaSala.push(disponiveis[idx].nome);
            disponiveis.splice(idx, 1);
        }

        jogo.loteLeilaoAtual = {
            id: aleatorio(1000, 9999),
            isPacote: true,
            nomePacote: pacoteBase.nome,
            quantidadeCarros: pacoteBase.quantidadeCarros,
            fipeTotal: pacoteBase.fipeBaseTotal,
            descricao: descricao,
            lanceAtual: lanceInicial,
            incremento: Math.max(1000, Math.floor(pacoteBase.fipeBaseTotal * 0.05)),
            tetoMaximoBot: Math.floor(pacoteBase.fipeBaseTotal * aleatorio(70, 90) / 100),
            tempoRestante: 12,
            ultimoLicitante: "Pregoeiro Oficial (Abertura)",
            concorrentesNaSala: ativosNaSala,
            historicoLances: [`Lote múltiplo aberto por R$ ${lanceInicial.toLocaleString("pt-BR")}`]
        };
    } else {
        let carroBase = carrosLeilaoLote[aleatorio(0, carrosLeilaoLote.length - 1)];
        let descricao = descricoesMisteriosas[aleatorio(0, descricoesMisteriosas.length - 1)];
        let lanceInicial = Math.floor(carroBase.fipeBase * aleatorio(35, 50) / 100);

        let qtdRivais = aleatorio(3, 4);
        let disponiveis = [...concorrentesLeilao];
        let ativosNaSala = [];
        for(let i=0; i<qtdRivais; i++){
            let idx = aleatorio(0, disponiveis.length - 1);
            ativosNaSala.push(disponiveis[idx].nome);
            disponiveis.splice(idx, 1);
        }

        jogo.loteLeilaoAtual = {
            id: aleatorio(1000, 9999),
            isPacote: false,
            carroBase: carroBase,
            descricao: descricao,
            lanceAtual: lanceInicial,
            incremento: Math.max(500, Math.floor(carroBase.fipeBase * 0.04)),
            tetoMaximoBot: Math.floor(carroBase.fipeBase * aleatorio(75, 95) / 100),
            tempoRestante: 12, 
            ultimoLicitante: "Pregoeiro Oficial (Abertura)",
            concorrentesNaSala: ativosNaSala,
            historicoLances: [`Lote unitário aberto por R$ ${lanceInicial.toLocaleString("pt-BR")}`]
        };
    }

    if (typeof salvarJogo === 'function') salvarJogo();
}

// ===========================================
// CRONÔMETROS ASSÍNCRONOS (ATUALIZAÇÃO DOM SEM PERDER FOCO)
// ===========================================
function iniciarTodosOsCronometros() {
    Object.keys(leiloesIntervalos).forEach(k => clearInterval(leiloesIntervalos[k]));
    leiloesIntervalos = {};

    // 1. Cronômetro do Lote de Compra
    if (jogo.loteLeilaoAtual) {
        leiloesIntervalos['compra'] = setInterval(() => {
            let lote = jogo.loteLeilaoAtual;
            if (!lote) {
                clearInterval(leiloesIntervalos['compra']);
                return;
            }

            lote.tempoRestante--;
            let elTimer = document.getElementById("timer-leilao");
            if (elTimer) {
                elTimer.innerHTML = `⏱️ ${lote.tempoRestante}s`;
                if (lote.tempoRestante <= 4) elTimer.style.color = "#ff5252";
            }

            if (lote.tempoRestante > 0 && lote.tempoRestante <= 3 && lote.ultimoLicitante === "Você") {
                if (lote.lanceAtual < lote.tetoMaximoBot && Math.random() < 0.35) {
                    fazerLanceConcorrenteBot();
                }
            }

            if (lote.tempoRestante <= 0) {
                clearInterval(leiloesIntervalos['compra']);
                if (lote.ultimoLicitante === "Você") {
                    finalizarArremateLeilao();
                } else {
                    if(typeof tocarSomErro === "function") tocarSomErro();
                    mostrarAlerta("🔨 MARTELO BATIDO!", `O lote foi arrematado por ${lote.ultimoLicitante} por R$ ${lote.lanceAtual.toLocaleString("pt-BR")}!`);
                    jogo.controleLeilaoDiario.participouHojeCompra = true;
                    jogo.loteLeilaoAtual = null;
                    if (typeof salvarJogo === 'function') salvarJogo();
                    if (document.getElementById("card-lote-compra")) mostrarLeilao();
                }
            }
        }, 1000);
    }

    // 2. Cronômetros dos Carros do Jogador na Praça
    if (jogo.listaCarrosNoLeilao && jogo.listaCarrosNoLeilao.length > 0) {
        jogo.listaCarrosNoLeilao.forEach((dadosLeilao, index) => {
            leiloesIntervalos[`meu_carro_${index}`] = setInterval(() => {
                if (!jogo.listaCarrosNoLeilao[index]) {
                    clearInterval(leiloesIntervalos[`meu_carro_${index}`]);
                    return;
                }

                dadosLeilao.tempoRestante--;
                let elTimerCarro = document.getElementById(`timer-meu-carro-${index}`);
                if (elTimerCarro) elTimerCarro.innerHTML = `⏱️ ${dadosLeilao.tempoRestante}s`;

                if (dadosLeilao.tempoRestante > 0 && dadosLeilao.lanceAtual < dadosLeilao.tetoCompraBot && Math.random() < 0.40) {
                    let rivalSorteado = dadosLeilao.concorrentesNaSala[aleatorio(0, dadosLeilao.concorrentesNaSala.length - 1)];
                    dadosLeilao.lanceAtual += dadosLeilao.incremento;
                    dadosLeilao.ultimoLicitante = rivalSorteado;
                    dadosLeilao.tempoRestante = 8;

                    dadosLeilao.historicoLances.unshift(`🔥 ${rivalSorteado} elevou para R$ ${dadosLeilao.lanceAtual.toLocaleString("pt-BR")}`);
                    if(dadosLeilao.historicoLances.length > 5) dadosLeilao.historicoLances.pop();

                    let elLance = document.getElementById(`lance-meu-carro-${index}`);
                    let elLider = document.getElementById(`lider-meu-carro-${index}`);
                    if (elLance) elLance.innerText = `R$ ${dadosLeilao.lanceAtual.toLocaleString("pt-BR")}`;
                    if (elLider) elLider.innerHTML = `Interessado: <strong>${rivalSorteado}</strong>`;
                    
                    if (typeof salvarJogo === 'function') salvarJogo();
                }

                if (dadosLeilao.tempoRestante <= 0) {
                    clearInterval(leiloesIntervalos[`meu_carro_${index}`]);
                    finalizarVendaCarroLeilao(index);
                }
            }, 1000);
        });
    }
}

// ===========================================
// AÇÕES DE COMPRA
// ===========================================
function fazerLanceConcorrenteBot() {
    let lote = jogo.loteLeilaoAtual;
    if(!lote || lote.lanceAtual >= lote.tetoMaximoBot) return;

    let rivalSorteado = lote.concorrentesNaSala[aleatorio(0, lote.concorrentesNaSala.length - 1)];
    lote.lanceAtual += lote.incremento;
    lote.ultimoLicitante = rivalSorteado;
    lote.tempoRestante = 8; 

    lote.historicoLances.unshift(`⚡ ${rivalSorteado} cobriu para R$ ${lote.lanceAtual.toLocaleString("pt-BR")}!`);
    if(lote.historicoLances.length > 5) lote.historicoLances.pop();

    atualizarDomLoteCompra();
    if (typeof salvarJogo === 'function') salvarJogo();
}

function darLanceLeilao() {
    let lote = jogo.loteLeilaoAtual;
    if(!lote) return;

    let valorTotalLance = lote.lanceAtual + lote.incremento;

    if(jogo.dinheiro < valorTotalLance){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("💸 Saldo Insuficiente", "Você não tem fundos líquidos para cobrir este lance!");
        return;
    }

    tocarSomLanceLeilao();

    lote.lanceAtual = valorTotalLance;
    lote.ultimoLicitante = "Você";
    lote.tempoRestante = 10; 

    lote.historicoLances.unshift(`✅ Você encobriu a mesa ofertando R$ ${valorTotalLance.toLocaleString("pt-BR")}`);
    if(lote.historicoLances.length > 5) lote.historicoLances.pop();

    atualizarDomLoteCompra();
    if (typeof salvarJogo === 'function') salvarJogo();
}

function atualizarDomLoteCompra() {
    let lote = jogo.loteLeilaoAtual;
    if (!lote) return;
    
    let elValor = document.getElementById("valor-lance-atual");
    let elLider = document.getElementById("lider-compra-txt");
    let elHistorico = document.getElementById("historico-lances-box");

    if (elValor) elValor.innerText = `R$ ${lote.lanceAtual.toLocaleString("pt-BR")}`;
    if (elLider) {
        let corLider = lote.ultimoLicitante === 'Você' ? '#00e676' : '#ffb700';
        elLider.style.color = corLider;
        elLider.innerHTML = `👑 Líder do leilão: <strong>${lote.ultimoLicitante}</strong>`;
    }
    if (elHistorico) {
        elHistorico.innerHTML = gerarHtmlHistorico(lote.historicoLances);
    }
}

function gerarHtmlHistorico(historico){
    return historico.map(h => `<div class="historico-item">${h}</div>`).join('');
}

// ===========================================
// FINALIZAÇÕES E ENVIO DE CARROS
// ===========================================
function finalizarArremateLeilao() {
    let lote = jogo.loteLeilaoAtual;
    if(!lote) return;

    if(!jogo.empresa) jogo.empresa = { nivel: 1, vagas: 4 };
    if(!jogo.empresa.vagas) jogo.empresa.vagas = 4;
    if(!jogo.carros) jogo.carros = [];

    let carrosCount = lote.isPacote ? lote.quantidadeCarros : 1;

    if ((jogo.carros.length + carrosCount) > jogo.empresa.vagas) {
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("🅿️ Pátio Lotado!", `Seu pátio suporta no máximo ${jogo.empresa.vagas} veículos. Venda carros ou expanda a oficina.`);
        return;
    }

    if(jogo.dinheiro < lote.lanceAtual){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("💸 Erro", "Saldo insuficiente para liquidar a arrematação!");
        return;
    }

    jogo.dinheiro -= lote.lanceAtual;
    if(typeof tocarSomCompra === "function") tocarSomCompra(); else tocarSomLanceLeilao();

    let listaDefeitos = [
        { nome: "Motor fundido", valor: 3500 },
        { nome: "Suspensão estourada", valor: 2000 },
        { nome: "Câmbio travado", valor: 2500 },
        { nome: "Sistema elétrico em curto", valor: 1500 }
    ];

    let carrosNomes = [];
    let qtdAdd = lote.isPacote ? lote.quantidadeCarros : 1;

    for(let p = 0; p < qtdAdd; p++) {
        let b = lote.isPacote ? carrosLeilaoLote[aleatorio(0, carrosLeilaoLote.length - 1)] : lote.carroBase;
        let defs = [];
        let copiaD = [...listaDefeitos];
        for(let i=0; i<aleatorio(1, 2); i++){
            if(copiaD.length === 0) break;
            let idxx = aleatorio(0, copiaD.length - 1);
            defs.push(copiaD[idxx]);
            copiaD.splice(idxx, 1);
        }

        let novoC = {
            marca: b.marca,
            modelo: b.modelo,
            ano: b.ano,
            km: aleatorio(80000, 200000),
            fipe: b.fipeBase,
            precoCompra: Math.floor(lote.lanceAtual / qtdAdd),
            cor: "Original de Leilão",
            defeitos: defs,
            reparos: []
        };
        jogo.carros.push(novoC);
        carrosNomes.push(`${novoC.marca} ${novoC.modelo} (${novoC.ano})`);
    }

    if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
    jogo.estatisticas.comprados += carrosNomes.length;

    jogo.loteLeilaoAtual = null;
    jogo.controleLeilaoDiario.participouHojeCompra = true;
    if (typeof salvarJogo === 'function') salvarJogo();

    mostrarAlerta("🎉 LOTE ARREMATADO!", `Você arrematou com sucesso:\n• ${carrosNomes.join("\n• ")}`);
    mostrarLeilao();
}

function abandonarLeilaoCompra(){
    if(leiloesIntervalos['compra']) clearInterval(leiloesIntervalos['compra']);
    jogo.loteLeilaoAtual = null;
    jogo.controleLeilaoDiario.participouHojeCompra = true;
    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarAlerta("🚪 Desistência", "Você abandonou o leilão de compra de hoje.");
    mostrarLeilao();
}

function abrirModalColocarCarroLeilao() {
    if (!jogo.carros || jogo.carros.length === 0) {
        mostrarAlerta("Pátio Vazio", "Você não tem veículos no pátio para enviar ao leilão!");
        return;
    }

    let listaOpcoesHtml = jogo.carros.map((carro, index) => {
        let valorFipe = carro.fipe || carro.f || 15000;
        return `
        <div class="leilao-item-patio-card">
            <div>
                <strong>${carro.marca} ${carro.modelo} (${carro.ano})</strong><br>
                <small class="leilao-sub-info">FIPE: R$ ${valorFipe.toLocaleString("pt-BR")} | KM: ${carro.km || 0} km</small>
            </div>
            <button onclick="enviarCarroParaLeilaoPraça(${index})" class="btn-leilao-lance" style="padding: 6px 12px; font-size: 0.8rem;">
                Enviar para Praça 🏷️
            </button>
        </div>
    `;}).join('');

    conteudo.innerHTML = `
    <div class="leilao-wrapper-container">
        <div class="garagem-header">
            <div class="garagem-titulo">
                <span class="garagem-icone">🏷️</span>
                <div class="garagem-texto-titulo">
                    <h1>CADASTRAR VEÍCULO PARA LEILÃO NA PRAÇA</h1>
                    <p>Envie um carro do pátio para leiloar enquanto participa do leilão de compra</p>
                </div>
            </div>
        </div>
        <div class="card" style="max-height: 400px; overflow-y: auto; background: #18181b; border: 1px solid #27272a;">
            ${listaOpcoesHtml}
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="mostrarLeilao()" class="btn-leilao-sair" style="padding: 8px 16px;">Voltar ao Auditório</button>
            </div>
        </div>
    </div>
    `;
}

function enviarCarroParaLeilaoPraça(indexCarro) {
    if (!jogo.carros || !jogo.carros[indexCarro]) return;
    
    let carroEscolhido = jogo.carros.splice(indexCarro, 1)[0]; 
    let valorFipe = carroEscolhido.fipe || carroEscolhido.f || 15000;
    let lanceInicialSorteado = Math.floor(valorFipe * aleatorio(45, 65) / 100);

    let qtdRivais = aleatorio(3, 4);
    let disponiveis = [...concorrentesLeilao];
    let ativosNaSala = [];
    for(let i=0; i<qtdRivais; i++){
        let idx = aleatorio(0, disponiveis.length - 1);
        ativosNaSala.push(disponiveis[idx].nome);
        disponiveis.splice(idx, 1);
    }

    if (!jogo.listaCarrosNoLeilao) jogo.listaCarrosNoLeilao = [];

    jogo.listaCarrosNoLeilao.push({
        carro: carroEscolhido,
        lanceAtual: lanceInicialSorteado,
        incremento: Math.max(500, Math.floor(valorFipe * 0.04)),
        tetoCompraBot: Math.floor(valorFipe * aleatorio(80, 105) / 100),
        tempoRestante: 12,
        ultimoLicitante: "Nenhum lance ainda",
        concorrentesNaSala: ativosNaSala,
        historicoLances: [`Anunciado na praça por R$ ${lanceInicialSorteado.toLocaleString("pt-BR")}`]
    });

    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarLeilao();
}

function finalizarVendaCarroLeilao(indexLeilao) {
    if (!jogo.listaCarrosNoLeilao || !jogo.listaCarrosNoLeilao[indexLeilao]) return;

    let dadosLeilao = jogo.listaCarrosNoLeilao[indexLeilao];
    let valorVenda = dadosLeilao.lanceAtual;
    let comprador = dadosLeilao.ultimoLicitante;

    if(comprador === "Nenhum lance ainda") {
        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(dadosLeilao.carro);
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("❌ Lote Deserto", `Nenhum licitante quis o seu ${dadosLeilao.carro.marca} ${dadosLeilao.carro.modelo}. Ele retornou ao pátio.`);
    } else {
        jogo.dinheiro += valorVenda;
        if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
        jogo.estatisticas.vendidos++;

        if(typeof tocarSomCompra === "function") tocarSomCompra(); else tocarSomLanceLeilao();

        mostrarAlerta("💰 CARRO VENDIDO NA PRAÇA!", `Seu ${dadosLeilao.carro.marca} ${dadosLeilao.carro.modelo} foi arrematado por ${comprador} por R$ ${valorVenda.toLocaleString("pt-BR")}!`);
    }

    jogo.listaCarrosNoLeilao.splice(indexLeilao, 1);
    if (typeof atualizarPainel === 'function') atualizarPainel();
    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarLeilao();
}

function retirarCarroLeilao(indexLeilao) {
    if (!jogo.listaCarrosNoLeilao || !jogo.listaCarrosNoLeilao[indexLeilao]) return;
    if(leiloesIntervalos[`meu_carro_${indexLeilao}`]) clearInterval(leiloesIntervalos[`meu_carro_${indexLeilao}`]);

    let carroRetirado = jogo.listaCarrosNoLeilao.splice(indexLeilao, 1)[0].carro;
    if(!jogo.carros) jogo.carros = [];
    jogo.carros.push(carroRetirado);

    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarAlerta("🚗 Retirado", "Você retirou o veículo da praça de leilões com sucesso.");
    mostrarLeilao();
}

// ===========================
// ÁUDIO & ESTILOS CSS
// ===========================
function tocarSomLanceLeilao() {
    if (typeof audioCtx !== "undefined" && audioCtx) {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.10);
        } catch (e) {}
    }
}

function injetarEstilosLeilao() {
    if (document.getElementById("estilos-leilao-g2")) return;
    let style = document.createElement('style');
    style.id = "estilos-leilao-g2";
    style.innerHTML = `
        .leilao-wrapper-container { max-width: 850px; margin: 0 auto; }
        .leilao-card-vivo { background: linear-gradient(135deg, #18181b 0%, #09090b 100%); border: 1px solid #27272a; border-radius: 12px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); color: #f4f4f5; }
        .leilao-status-topo { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .lote-badge-id { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .leilao-timer-box { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
        .lote-caixa-descricao { background: #202024; border-left: 4px solid #3b82f6; padding: 10px 14px; border-radius: 0 8px 8px 0; margin-bottom: 15px; }
        .lote-caixa-descricao p { margin: 0; color: #d4d4d8; font-style: italic; font-size: 0.9rem; }
        .leilao-painel-central { text-align: center; background: #121215; border: 1px solid #27272a; border-radius: 10px; padding: 15px; margin-bottom: 15px; }
        .label-lance { font-size: 0.65rem; color: #a1a1aa; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .lance-atual-bloco h2 { margin: 0 0 6px 0; font-size: 2rem; color: #4ade80; font-weight: 800; }
        .historico-lances-container { background: #121215; border: 1px solid #27272a; border-radius: 8px; padding: 10px; margin-bottom: 15px; }
        .leilao-sec-title { font-size: 0.65rem; color: #a1a1aa; text-transform: uppercase; display: block; margin-bottom: 4px; font-weight: 600; }
        .historico-lances { max-height: 90px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
        .historico-item { font-size: 0.8rem; color: #d4d4d8; background: #18181b; padding: 5px 8px; border-radius: 4px; border-left: 3px solid #3f3f46; }
        .lote-botoes-acao { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-leilao-lance { flex: 1; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; text-transform: uppercase; }
        .btn-leilao-sair { flex: 1; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; text-transform: uppercase; }
        .btn-leilao-secundario { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        .leilao-item-patio-card { background: #121215; padding: 10px; margin-bottom: 6px; border-radius: 8px; border: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; }
        .leilao-sub-info { color: #a1a1aa; font-size: 0.75rem; }
        .leilao-text-center { text-align: center; padding: 30px; }
        .leilao-emoji-gigante { font-size: 2.5rem; display: block; margin-bottom: 10px; }
        .leilao-subtext { color: #a1a1aa; margin-top: 5px; font-size: 0.9rem; }
    `;
    document.head.appendChild(style);
}

if(typeof jogo !== 'undefined') {
    if(jogo.loteLeilaoAtual === undefined) jogo.loteLeilaoAtual = null;
    if(jogo.listaCarrosNoLeilao === undefined) jogo.listaCarrosNoLeilao = [];
}
