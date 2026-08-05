// ===========================================
// LEILÃO.JS V7.1 (COM SISTEMA DE ÁUDIO WEB API INTEGRADO) 🚀🔊
// G2 GARAGEM
// ===========================================

const carrosLeilaoLote = [
    { marca: "Chevrolet", modelo: "Opala Diplomata", ano: 1988, fipeBase: 25000 },
    { marca: "Volkswagen", modelo: "Gol Quadrado GTS", ano: 1992, fipeBase: 22000 },
    { marca: "Fiat", modelo: "Tempra Turbo", ano: 1994, fipeBase: 18000 },
    { marca: "Chevrolet", modelo: "Chevette DL", ano: 1991, fipeBase: 12000 },
    { marca: "Ford", modelo: "Escort XR3", ano: 1990, fipeBase: 16000 },
    { marca: "Volkswagen", modelo: "Santana Quantum", ano: 1989, fipeBase: 15000 },
    { marca: "Fiat", modelo: "Uno 1.5R", ano: 1993, fipeBase: 14000 }
];

const descricoesMisteriosas = [
    "Veículo de garagem fechada há anos. Bateria arriada, não liga.",
    "Apreendido em pátio municipal. Histórico duvidoso e cheiro de mofo.",
    "Repasses de financeira. Sem chave de ignição e motor batendo seco.",
    "Deixado por herança de tio avô. Tem muita poeira, mas o assoalho parece firme.",
    "Carro de leilão de seguradora. Pequena batida na traseira, mecânica incerta.",
    "Achado em celeiro no interior. Pneus muchos e vazamento misterioso."
];

const nomesConcorrentes = [
    "Dr. Silveira (Colecionador)", 
    "Garagista João (Re VENDA)", 
    "Fião Tubarão (Desmanche)", 
    "Investidor Anônimo", 
    "Caçador de Relíquias SP",
    "Felipe 'Turbo' RS"
];

let leilaoTimer = null;

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
        jogo.controleLeilaoDiario = { dataUltimoLeilao: "", participouHoje: false };
    }

    if (jogo.controleLeilaoDiario.dataUltimoLeilao !== dataJogoAtual) {
        jogo.controleLeilaoDiario.participouHoje = false;
        jogo.controleLeilaoDiario.dataUltimoLeilao = dataJogoAtual;
        jogo.loteLeilaoAtual = null;
        jogo.carroNoLeilao = null;
        if (typeof salvarJogo === 'function') salvarJogo();
    }
}

function irParaPatio() {
    if (leilaoTimer) clearInterval(leilaoTimer);
    if (typeof mudarAba === 'function') {
        mudarAba('patio');
    } else if (typeof mostrarPatio === 'function') {
        mostrarPatio();
    } else {
        window.location.reload();
    }
}

function mostrarLeilao(){
    if (typeof jogo === 'undefined') return;
    verificarLeilaoDiario();

    if (jogo.controleLeilaoDiario.participouHoje && !jogo.loteLeilaoAtual && !jogo.carroNoLeilao) {
        conteudo.innerHTML = `
        <div class="garagem-header" style="margin-bottom: 15px;">
            <div class="garagem-titulo">
                <span class="garagem-icone">🏆</span>
                <div class="garagem-texto-titulo">
                    <h1>AUDITÓRIO DE LEILÕES VIP</h1>
                    <p>Portões fechados por hoje</p>
                </div>
            </div>
        </div>
        <div class="card leilao-card-vivo" style="text-align: center; padding: 40px;">
            <span style="font-size: 3rem; display: block; margin-bottom: 15px;">⏳</span>
            <h2>O Leilão de Hoje Já Ocorreu!</h2>
            <p style="color: #aaa; margin-top: 10px; margin-bottom: 25px;">
                Acontece apenas <strong>um leilão por dia</strong>. Avance o dia no jogo para participar de um novo leilão!
            </p>
            <button onclick="irParaPatio()" class="btn-leilao-lance" style="max-width: 250px; margin: 0 auto; cursor: pointer;">
                🚗 Voltar ao Pátio
            </button>
        </div>
        `;
        return;
    }

    if (jogo.carroNoLeilao) {
        mostrarLeilaoDoJogador();
        return;
    }

    if(!jogo.loteLeilaoAtual){
        gerarLoteLeilao();
    }

    let lote = jogo.loteLeilaoAtual;
    let corLider = lote.ultimoLicitante === 'Você' ? '#00e676' : '#ffb700';

    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">🏆</span>
            <div class="garagem-texto-titulo">
                <h1>AUDITÓRIO DE LEILÕES VIP</h1>
                <p>Disputa com ${lote.concorrentesNaSala.length} colecionadores na sala</p>
            </div>
        </div>
    </div>

    <div class="card leilao-card-vivo">
        <div class="leilao-status-topo">
            <span class="lote-badge-id">📦 LOTE MISTERIOSO #${lote.id}</span>
            <span class="leilao-timer-box" id="timer-leilao">⏱️ ${lote.tempoRestante}s</span>
        </div>

        <div class="lote-caixa-descricao">
            <p>"${lote.descricao}"</p>
        </div>

        <div class="leilao-painel-central">
            <div class="lance-atual-bloco">
                <span class="label-lance">MAIOR LANCE NA MESA</span>
                <h2 id="valor-lance-atual">R$ ${lote.lanceAtual.toLocaleString("pt-BR")}</h2>
                <small class="quem-esta-ganhando" style="color: ${corLider}">
                    👑 Líder do leilão: <strong>${lote.ultimoLicitante}</strong>
                </small>
            </div>
        </div>

        <div class="historico-lances-container">
            <span style="font-size: 0.65rem; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px;">📡 Registro do Pregão (Ao Vivo)</span>
            <div class="historico-lances" id="historico-lances-box">
                ${gerarHtmlHistorico(lote.historicoLances)}
            </div>
        </div>

        <div class="lote-botoes-acao" style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="darLanceLeilao()" class="btn-leilao-lance" style="flex: 1; cursor: pointer;">
                🔨 COBRIR LANCE (+ R$ ${lote.incremento.toLocaleString("pt-BR")})
            </button>
            <button onclick="abandonarLeilao()" class="btn-leilao-sair" style="flex: 1; cursor: pointer;">
                🚪 Abandonar Auditório
            </button>
        </div>

        <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px; text-align: center;">
            <button onclick="abrirModalColocarCarroLeilao()" class="btn-secundario" style="background: #2196F3; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                🏷️ Quero colocar um carro MEU no leilão de hoje
            </button>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
    iniciarCronometroLeilao();
}

function gerarLoteLeilao(){
    let carroBase = carrosLeilaoLote[aleatorio(0, carrosLeilaoLote.length - 1)];
    let descricao = descricoesMisteriosas[aleatorio(0, descricoesMisteriosas.length - 1)];
    let lanceInicial = Math.floor(carroBase.fipeBase * aleatorio(35, 50) / 100);

    let qtdRivais = aleatorio(3, 4);
    let disponiveis = [...nomesConcorrentes];
    let ativosNaSala = [];
    for(let i=0; i<qtdRivais; i++){
        let idx = aleatorio(0, disponiveis.length - 1);
        ativosNaSala.push(disponiveis[idx]);
        disponiveis.splice(idx, 1);
    }

    jogo.loteLeilaoAtual = {
        id: aleatorio(1000, 9999),
        carroBase: carroBase,
        descricao: descricao,
        lanceAtual: lanceInicial,
        incremento: Math.max(500, Math.floor(carroBase.fipeBase * 0.04)),
        tetoMaximoBot: Math.floor(carroBase.fipeBase * aleatorio(75, 95) / 100),
        tempoRestante: 12, 
        ultimoLicitante: "Pregoeiro (Lance Inicial)",
        concorrentesNaSala: ativosNaSala,
        historicoLances: [`Lote aberto na mesa por R$ ${lanceInicial.toLocaleString("pt-BR")}`]
    };

    if (typeof salvarJogo === 'function') salvarJogo();
}

function iniciarCronometroLeilao(){
    if(leilaoTimer) clearInterval(leilaoTimer);

    leilaoTimer = setInterval(() => {
        let lote = jogo.loteLeilaoAtual;
        if(!lote) {
            clearInterval(leilaoTimer);
            return;
        }

        lote.tempoRestante--;
        
        let elementoTimer = document.getElementById("timer-leilao");
        if(elementoTimer) {
            elementoTimer.innerHTML = `⏱️ ${lote.tempoRestante}s`;
            if(lote.tempoRestante <= 4) {
                elementoTimer.style.color = "#ff5252";
            }
        }

        if(lote.tempoRestante > 0 && lote.tempoRestante <= 3 && lote.ultimoLicitante === "Você") {
            if(lote.lanceAtual < lote.tetoMaximoBot && Math.random() < 0.25) {
                fazerLanceConcorrenteBot();
            } else if (lote.lanceAtual >= lote.tetoMaximoBot && Math.random() < 0.50) {
                lote.historicoLances.unshift(`🛑 O preço chegou próximo ao limite de mercado. Os colecionadores pararam.`);
                if(lote.historicoLances.length > 4) lote.historicoLances.pop();
            }
        }

        if(lote.tempoRestante <= 0){
            clearInterval(leilaoTimer);
            
            if(lote.ultimoLicitante === "Você") {
                finalizarArremateLeilao();
            } else {
                if(typeof tocarSomErro === "function") tocarSomErro();
                mostrarAlerta("🔨 MARTELO BATIDO!", `O lote foi arrematado por ${lote.ultimoLicitante} por R$ ${lote.lanceAtual.toLocaleString("pt-BR")}!`);
                jogo.controleLeilaoDiario.participouHoje = true;
                jogo.loteLeilaoAtual = null;
                if (typeof salvarJogo === 'function') salvarJogo();
                mostrarLeilao();
            }
        }
    }, 1000);
}

function fazerLanceConcorrenteBot(){
    let lote = jogo.loteLeilaoAtual;
    if(!lote) return;

    if (lote.lanceAtual >= lote.tetoMaximoBot) return;

    let rivalSorteado = lote.concorrentesNaSala[aleatorio(0, lote.concorrentesNaSala.length - 1)];
    lote.lanceAtual += lote.incremento;
    lote.ultimoLicitante = rivalSorteado;
    lote.tempoRestante = 8; 

    lote.historicoLances.unshift(`⚡ ${rivalSorteado} cobriu para R$ ${lote.lanceAtual.toLocaleString("pt-BR")}!`);
    if(lote.historicoLances.length > 4) lote.historicoLances.pop();

    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarLeilao();
}

function darLanceLeilao(){
    let lote = jogo.loteLeilaoAtual;
    if(!lote) return;

    let valorTotalLance = lote.lanceAtual + lote.incremento;

    if(jogo.dinheiro < valorTotalLance){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("💸 Saldo Insuficiente", "Você não tem dinheiro suficiente para cobrir este lance!");
        return;
    }

    // Toca som curto de batida de martelo / lance
    tocarSomLanceLeilao();

    lote.lanceAtual = valorTotalLance;
    lote.ultimoLicitante = "Você";
    lote.tempoRestante = 10; 

    lote.historicoLances.unshift(`✅ Você encobriu para R$ ${valorTotalLance.toLocaleString("pt-BR")}`);
    if(lote.historicoLances.length > 4) lote.historicoLances.pop();

    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarLeilao();
}

function gerarHtmlHistorico(historico){
    return historico.map(h => `<div class="historico-item">${h}</div>`).join('');
}

function finalizarArremateLeilao(){
    let lote = jogo.loteLeilaoAtual;
    if(!lote) return;

    // --- TRAVA DE VAGAS DO PÁTIO ---
    if(!jogo.empresa) jogo.empresa = { nivel: 1, vagas: 4 };
    if(!jogo.empresa.vagas) jogo.empresa.vagas = 4;
    if(!jogo.carros) jogo.carros = [];

    if (jogo.carros.length >= jogo.empresa.vagas) {
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta(
            "🅿️ Pátio Lotado!", 
            `Seu pátio atingiu o limite de ${jogo.empresa.vagas} vagas.\n\nVenda um veículo ou expanda sua garagem para poder arrematar novos lotes!`
        );
        return;
    }
    // -------------------------------

    if(jogo.dinheiro < lote.lanceAtual){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("💸 Erro", "Você não possui saldo para liquidar este arremate!");
        return;
    }

    jogo.dinheiro -= lote.lanceAtual;

    // Toca som de compra com sucesso
    if(typeof tocarSomCompra === "function") {
        tocarSomCompra();
    } else {
        tocarSomLanceLeilao();
    }

    let listaDefeitosPossiveis = [
        { nome: "Motor fundido", valor: 3500 },
        { nome: "Suspensão totalmente estourada", valor: 2000 },
        { nome: "Câmbio travado", valor: 2500 },
        { nome: "Sistema elétrico em curto", valor: 1500 },
        { nome: "Freios inoperantes", valor: 1200 },
        { nome: "Vazamento crônico de óleo", valor: 900 }
    ];

    let quantidadeDefeitos = aleatorio(1, 3);
    let defeitosCarro = [];
    let copiaDefeitos = [...listaDefeitosPossiveis];

    for(let i = 0; i < quantidadeDefeitos; i++){
        if(copiaDefeitos.length === 0) break;
        let indexDef = aleatorio(0, copiaDefeitos.length - 1);
        defeitosCarro.push(copiaDefeitos[indexDef]);
        copiaDefeitos.splice(indexDef, 1);
    }

    let novoCarro = {
        marca: lote.carroBase.marca,
        modelo: lote.carroBase.modelo,
        ano: lote.carroBase.ano,
        km: aleatorio(80000, 200000),
        fipe: lote.carroBase.fipeBase,
        precoCompra: lote.lanceAtual,
        cor: "Original de Leilão",
        defeitos: defeitosCarro,
        reparos: []
    };

    if(!jogo.carros) jogo.carros = [];
    jogo.carros.push(novoCarro);

    if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
    jogo.estatisticas.comprados++;

    jogo.loteLeilaoAtual = null;
    jogo.controleLeilaoDiario.participouHoje = true;
    if(leilaoTimer) clearInterval(leilaoTimer);

    if (typeof atualizarPainel === 'function') atualizarPainel();
    if (typeof salvarJogo === 'function') salvarJogo();

    mostrarAlerta(
        "🎉 LOTE ARREMATADO NO PREGÃO!",
        `Parabéns! Você venceu a disputa e levou o ${novoCarro.marca} ${novoCarro.modelo} (${novoCarro.ano}) por R$ ${lote.lanceAtual.toLocaleString("pt-BR")}!\n\nO veículo foi descarregado no seu pátio.`
    );

    irParaPatio();
}

function abandonarLeilao(){
    if(leilaoTimer) clearInterval(leilaoTimer);
    jogo.loteLeilaoAtual = null;
    jogo.controleLeilaoDiario.participouHoje = true;
    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarAlerta("🚪 Desistência", "Você se retirou do auditório de leilões por hoje.");
    mostrarLeilao();
}

function abrirModalColocarCarroLeilao() {
    if (!jogo.carros || jogo.carros.length === 0) {
        mostrarAlerta("Garagem Vazia", "Você não tem nenhum carro no pátio para enviar ao leilão!");
        return;
    }

    let listaOpcoesHtml = jogo.carros.map((carro, index) => {
        let valorFipe = carro.fipe || carro.f || 15000;
        let kmCarro = carro.km || 0;
        return `
        <div style="background: #1e1e1e; padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${carro.marca} ${carro.modelo} (${carro.ano})</strong><br>
                <small style="color: #888;">FIPE: R$ ${valorFipe.toLocaleString("pt-BR")} | KM: ${kmCarro}</small>
            </div>
            <button onclick="selecionarCarroParaLeilao(${index})" class="btn-leilao-lance" style="padding: 6px 12px; font-size: 0.8rem; cursor: pointer;">
                Enviar ao Leilão 🏷️
            </button>
        </div>
    `;}).join('');

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">🏷️</span>
            <div class="garagem-texto-titulo">
                <h1>SELECIONAR VEÍCULO PARA O LEILÃO</h1>
                <p>Escolha qual carro do seu pátio irá para o pregão de hoje</p>
            </div>
        </div>
    </div>
    <div class="card" style="max-height: 400px; overflow-y: auto;">
        ${listaOpcoesHtml}
        <div style="margin-top: 15px; text-align: center;">
            <button onclick="mostrarLeilao()" class="btn-leilao-sair" style="padding: 8px 16px; cursor: pointer;">Voltar</button>
        </div>
    </div>
    `;
}

function selecionarCarroParaLeilao(indexCarro) {
    if (!jogo.carros || !jogo.carros[indexCarro]) return;
    
    let carroEscolhido = jogo.carros.splice(indexCarro, 1)[0]; 
    
    let valorFipe = carroEscolhido.fipe || carroEscolhido.f || 15000;
    let lanceInicialSorteado = Math.floor(valorFipe * aleatorio(45, 65) / 100);

    let qtdRivais = aleatorio(3, 4);
    let disponiveis = [...nomesConcorrentes];
    let ativosNaSala = [];
    for(let i=0; i<qtdRivais; i++){
        let idx = aleatorio(0, disponiveis.length - 1);
        ativosNaSala.push(disponiveis[idx]);
        disponiveis.splice(idx, 1);
    }

    jogo.carroNoLeilao = {
        carro: carroEscolhido,
        lanceAtual: lanceInicialSorteado,
        incremento: Math.max(500, Math.floor(valorFipe * 0.04)),
        tetoCompraBot: Math.floor(valorFipe * aleatorio(80, 105) / 100),
        tempoRestante: 12,
        ultimoLicitante: "Nenhum lance ainda",
        concorrentesNaSala: ativosNaSala,
        historicoLances: [`Seu ${carroEscolhido.marca} ${carroEscolhido.modelo} foi anunciado na mesa por R$ ${lanceInicialSorteado.toLocaleString("pt-BR")}`]
    };

    jogo.loteLeilaoAtual = null;
    if (typeof salvarJogo === 'function') salvarJogo();
    mostrarLeilaoDoJogador();
}

function mostrarLeilaoDoJogador() {
    let dadosLeilao = jogo.carroNoLeilao;
    if (!dadosLeilao) return;

    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">📢</span>
            <div class="garagem-texto-titulo">
                <h1>SEU VEÍCULO EM LEILÃO</h1>
                <p>Acompanhe os colecionadores disputando o seu ${dadosLeilao.carro.marca} ${dadosLeilao.carro.modelo}</p>
            </div>
        </div>
    </div>

    <div class="card leilao-card-vivo">
        <div class="leilao-status-topo">
            <span class="lote-badge-id">🚗 SEU CARRO À VENDA</span>
            <span class="leilao-timer-box" id="timer-leilao-jogador">⏱️ ${dadosLeilao.tempoRestante}s</span>
        </div>

        <div class="leilao-painel-central">
            <div class="lance-atual-bloco">
                <span class="label-lance">MAIOR OFERTA DA MESA</span>
                <h2>R$ ${dadosLeilao.lanceAtual.toLocaleString("pt-BR")}</h2>
                <small class="quem-esta-ganhando" style="color: #ffb700;">
                    🤝 Comprador interessado: <strong>${dadosLeilao.ultimoLicitante}</strong>
                </small>
            </div>
        </div>

        <div class="historico-lances-container">
            <span style="font-size: 0.65rem; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px;">📡 Pregão do seu carro ao vivo</span>
            <div class="historico-lances">
                ${gerarHtmlHistorico(dadosLeilao.historicoLances)}
            </div>
        </div>

        <div style="margin-top: 15px; text-align: center;">
            <p style="color: #888; font-size: 0.8rem;">O leilão do seu veículo rola automaticamente até o martelo bater!</p>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
    iniciarCronometroLeilaoDoJogador();
}

function iniciarCronometroLeilaoDoJogador() {
    if(leilaoTimer) clearInterval(leilaoTimer);

    leilaoTimer = setInterval(() => {
        let dadosLeilao = jogo.carroNoLeilao;
        if(!dadosLeilao) {
            clearInterval(leilaoTimer);
            return;
        }

        dadosLeilao.tempoRestante--;

        let elementoTimer = document.getElementById("timer-leilao-jogador");
        if(elementoTimer) {
            elementoTimer.innerHTML = `⏱️ ${dadosLeilao.tempoRestante}s`;
        }

        if(dadosLeilao.tempoRestante > 0 && dadosLeilao.lanceAtual < dadosLeilao.tetoCompraBot && Math.random() < 0.40) {
            let rivalSorteado = dadosLeilao.concorrentesNaSala[aleatorio(0, dadosLeilao.concorrentesNaSala.length - 1)];
            dadosLeilao.lanceAtual += dadosLeilao.incremento;
            dadosLeilao.ultimoLicitante = rivalSorteado;
            dadosLeilao.tempoRestante = 8; 

            dadosLeilao.historicoLances.unshift(`🔥 ${rivalSorteado} ofereceu R$ ${dadosLeilao.lanceAtual.toLocaleString("pt-BR")}`);
            if(dadosLeilao.historicoLances.length > 4) dadosLeilao.historicoLances.pop();
            
            if (typeof salvarJogo === 'function') salvarJogo();
            mostrarLeilaoDoJogador();
        }

        if(dadosLeilao.tempoRestante <= 0) {
            clearInterval(leilaoTimer);
            finalizarVendaCarroLeilao();
        }
    }, 1000);
}

function finalizarVendaCarroLeilao() {
    let dadosLeilao = jogo.carroNoLeilao;
    if(!dadosLeilao) return;

    let valorVenda = dadosLeilao.lanceAtual;
    let comprador = dadosLeilao.ultimoLicitante === "Nenhum lance ainda" ? "Ninguém quis comprar" : dadosLeilao.ultimoLicitante;

    if(dadosLeilao.ultimoLicitante === "Nenhum lance ainda") {
        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(dadosLeilao.carro);
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("❌ Lote Deserto", "Nenhum colecionador se interessou pelo seu carro. Ele retornou ao seu pátio.");
    } else {
        jogo.dinheiro += valorVenda;
        if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
        jogo.estatisticas.vendidos++;

        if(typeof tocarSomCompra === "function") {
            tocarSomCompra();
        } else {
            tocarSomLanceLeilao();
        }

        mostrarAlerta(
            "💰 CARRO VENDIDO NO LEILÃO!",
            `Seu ${dadosLeilao.carro.marca} ${dadosLeilao.carro.modelo} foi arrematado por ${comprador} por R$ ${valorVenda.toLocaleString("pt-BR")}!`
        );
    }

    jogo.carroNoLeilao = null;
    jogo.controleLeilaoDiario.participouHoje = true;
    if (typeof atualizarPainel === 'function') atualizarPainel();
    if (typeof salvarJogo === 'function') salvarJogo();
    irParaPatio();
}

// ===========================
// EFEITOS SONOROS ESPECÍFICOS PARA O LEILÃO (WEB AUDIO API)
// ===========================
function tocarSomLanceLeilao() {
    if (typeof audioCtx !== "undefined" && audioCtx) {
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Nota D5 (clique agudo de batida de martelo)
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

if(typeof jogo !== 'undefined') {
    if(jogo.loteLeilaoAtual === undefined) jogo.loteLeilaoAtual = null;
    if(jogo.carroNoLeilao === undefined) jogo.carroNoLeilao = null;
}