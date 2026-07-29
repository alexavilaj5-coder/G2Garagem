// ===========================
// LEILÃO.JS V1.0 (LEILÃO ÀS CEGAS)
// G2 GARAGEM
// ===========================

// Modelos surpresa para o leilão
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

function mostrarLeilao(){
    if(!jogo.loteLeilaoAtual){
        gerarLoteLeilao();
    }

    let lote = jogo.loteLeilaoAtual;

    let html = `
    <h2>🔨 LEILÃO ÀS CEGAS</h2>
    <div class="card" style="border: 2px dashed #ff9800;">
        <h3>📦 Lote Misterioso #${lote.id}</h3>
        <hr>
        <p style="color: #ff9800; font-style: italic; font-size: 1.1em; margin: 15px 0;">
            "${lote.descricao}"
        </p>
        <p>📅 Ano estimado: <strong>Por volta da década de 80/90</strong></p>
        <p>🏷️ Lance Inicial: <strong>R$ ${lote.lanceAtual.toLocaleString("pt-BR")}</strong></p>
        <p>👥 Concorrentes no leilão: <strong>${lote.concorrentes} pessoas</strong></p>
        <hr>
        
        <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="darLanceLeilao()" style="flex:1; background:#4CAF50; color:#fff; padding:12px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                💰 Dar Lance (+ R$ ${lote.incremento.toLocaleString("pt-BR")})
            </button>
            <button onclick="abandonarLeilao()" style="flex:1; background:#f44336; color:#fff; padding:12px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                🚪 Pular / Sair
            </button>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
}

function gerarLoteLeilao(){
    let carroBase = carrosLeilaoLote[aleatorio(0, carrosLeilaoLote.length - 1)];
    let descricao = descricoesMisteriosas[aleatorio(0, descricoesMisteriosas.length - 1)];
    
    // Valor inicial bem abaixo da FIPE para instigar o risco
    let lanceInicial = Math.floor(carroBase.fipeBase * aleatorio(30, 45) / 100);

    jogo.loteLeilaoAtual = {
        id: aleatorio(100, 999),
        carroBase: carroBase,
        descricao: descricao,
        lanceAtual: lanceInicial,
        incremento: Math.floor(lanceInicial * 0.15),
        concorrentes: aleatorio(3, 7)
    };

    salvarJogo();
}

function darLanceLeilao(){
    let lote = jogo.loteLeilaoAtual;
    let valorTotalLance = lote.lanceAtual + lote.incremento;

    if(jogo.dinheiro < valorTotalLance){
        mostrarAlerta("💸 Saldo Insuficiente", "Você não tem dinheiro para cobrir este lance no leilão!");
        return;
    }

    // Chance de os concorrentes desistirem ou cobrirem o lance
    let chanceConcorrenteCobrir = Math.random();

    if(chanceConcorrenteCobrir < 0.45 && lote.concorrentes > 1){
        // Concorrente cobriu o lance e aumentou o preço
        lote.concorrentes--;
        lote.lanceAtual = valorTotalLance + Math.floor(lote.incremento * aleatorio(1, 2));
        salvarJogo();
        mostrarAlerta("🔨 Outro Licitante!", `Alguém encobriu o seu lance!\n\nNovo valor do leilão: R$ ${lote.lanceAtual.toLocaleString("pt-BR")}\nRestam ${lote.concorrentes} concorrentes.`);
        mostrarLeilao();
    } else {
        // Você arrematou o lote!
        jogo.dinheiro -= valorTotalLance;
        
        // Sorteia defeitos surpresa (de 2 a 4 defeitos pesados)
        let listaDefeitosPossiveis = [
            { nome: "Motor fundido", valor: 3500 },
            { nome: "Suspensão totalmente estourada", valor: 2000 },
            { nome: "Câmbio travado", valor: 2500 },
            { nome: "Sistema elétrico em curto", valor: 1500 },
            { nome: "Freios inoperantes", valor: 1200 },
            { nome: "Vazamento crônico de óleo", valor: 900 }
        ];

        let quantidadeDefeitos = aleatorio(2, 4);
        let defeitosCarro = [];
        let copiaDefeitos = [...listaDefeitosPossiveis];

        for(let i = 0; i < quantidadeDefeitos; i++){
            if(copiaDefeitos.length === 0) break;
            let indexDef = aleatorio(0, copiaDefeitos.length - 1);
            defeitosCarro.push(copiaDefeitos[indexDef]);
            copiaDefeitos.splice(indexDef, 1);
        }

        // Cria o carro misterioso no pátio
        let novoCarro = {
            marca: lote.carroBase.marca,
            modelo: lote.carroBase.modelo,
            ano: lote.carroBase.ano,
            km: aleatorio(120000, 280000),
            fipe: lote.carroBase.fipeBase,
            precoCompra: valorTotalLance,
            cor: "Original de Leilão",
            defeitos: defeitosCarro,
            reparos: []
        };

        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(novoCarro);

        if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
        jogo.estatisticas.comprados++;

        // Limpa o leilão atual para gerar um novo depois
        jogo.loteLeilaoAtual = null;

        atualizarPainel();
        salvarJogo();

        mostrarAlerta(
            "🎉 Lote Arrematado!",
            `Você levou o veículo no escuro por R$ ${valorTotalLance.toLocaleString("pt-BR")}!\n\nO guincho acabou de descarregar um ${novoCarro.marca} ${novoCarro.modelo} (${novoCarro.ano}) na sua oficina.\n\nVá até a oficina inspecionar os estragos!`
        );

        mostrarOficina();
    }
}

function abandonarLeilao(){
    jogo.loteLeilaoAtual = null;
    salvarJogo();
    mostrarAlerta("🚪 Desistência", "Você preferiu não arriscar e saiu do leilão. Um novo lote será preparado.");
    gerarLoteLeilao();
    mostrarLeilao();
}

if(jogo.loteLeilaoAtual === undefined){
    jogo.loteLeilaoAtual = null;
}