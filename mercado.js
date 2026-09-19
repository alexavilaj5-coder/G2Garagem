//===========================================
// MERCADO.JS V6.1 - SISTEMA COMPLETO DE BRICK, PREÇOS E PECHINCHA AJUSTADA
// G2 GARAGEM
// ===========================================

let termoPesquisaAtual = window.termoPesquisaAtual || "";
let modeloSelecionadoGlobal = window.modeloSelecionadoGlobal || null;
let buscaVisivelAdmin = window.buscaVisivelAdmin || false;
let scheckCliques = 0;
let carroParaTrocaSelecionado = null;

// Distribuição com alta probabilidade de veículos Particulares
function sortearOrigem() {
    let rand = Math.random();
    if (rand < 0.60) {
        return { tipo: "Particular", multiplicador: 0.93, riscoDefeitoOculto: 0.05, cor: "#2ecc71" }; // 60% Chance
    } else if (rand < 0.85) {
        return { tipo: "Repasse de Concessionária", multiplicador: 0.88, riscoDefeitoOculto: 0.12, cor: "#3498db" }; // 25% Chance
    } else if (rand < 0.95) {
        return { tipo: "Leilão (Financiamento)", multiplicador: 0.83, riscoDefeitoOculto: 0.20, cor: "#f39c12" }; // 10% Chance
    } else {
        return { tipo: "Leilão (Sinistro/Recuperado)", multiplicador: 0.78, riscoDefeitoOculto: 0.35, cor: "#e74c3c" }; // 5% Chance
    }
}

function gerarAno(modelo) {
    if (typeof anosModelos !== "undefined" && anosModelos[modelo.modelo]) {
        return aleatorio(anosModelos[modelo.modelo].inicio, anosModelos[modelo.modelo].fim);
    }
    return aleatorio(2008, jogo.ano || 2026);
}

function gerarKm(ano) {
    let idade = (jogo.ano || 2026) - ano;
    let minimo = Math.max(5000, idade * 8000);
    let maximo = Math.max(30000, idade * 18000);
    return aleatorio(minimo, maximo);
}

function gerarOferta(modeloEspecifico = null) {
    let modelo = modeloEspecifico || modeloSelecionadoGlobal || carros[aleatorio(0, carros.length - 1)];
    let ano = gerarAno(modelo);
    let km = gerarKm(ano);
    let cor = cores[aleatorio(0, cores.length - 1)];
    let origensSorteada = sortearOrigem();

    let defeitosCarro = [];
    let custoVisivel = 0;
    let custoOculto = 0;

    let semDefeitos = Math.random() < 0.50; // 50% de chance de carro 100% OK
    let qtdDefeitos = semDefeitos ? 0 : aleatorio(1, 2);

    for (let i = 0; i < qtdDefeitos; i++) {
        let defeito = defeitos[aleatorio(0, defeitos.length - 1)];
        if (!defeitosCarro.some(d => d.nome === defeito.nome)) {
            let ehOculto = Math.random() < origensSorteada.riscoDefeitoOculto;
            defeitosCarro.push({ ...defeito, oculto: ehOculto });
            
            if (ehOculto) custoOculto += defeito.valor;
            else custoVisivel += defeito.valor;
        }
    }

    let temDocumentoPendente = Math.random() < 0.10;
    let valorDoc = temDocumentoPendente ? aleatorio(600, 1800) : 0;

    // Fator KM Leve (Máximo 5% de variação)
    let fatorKm = 1 - Math.min(0.05, (km / 250000) * 0.05);
    
    // O Preço final fica SEMPRE entre 80% e 94% da FIPE (Margem justa de garagem)
    let fatorGeral = Math.max(0.82, origensSorteada.multiplicador * fatorKm);
    let precoPedida = Math.floor((modelo.fipe * fatorGeral) - (custoVisivel * 0.5));
    
    // Garantia de piso mínimo em 80% da FIPE
    precoPedida = Math.max(Math.floor(modelo.fipe * 0.80), precoPedida);
    let precoMinimoAceitavel = Math.floor(precoPedida * 0.92);

    let imagemEscolhida = Array.isArray(modelo.imagem)
        ? modelo.imagem[aleatorio(0, modelo.imagem.length - 1)]
        : modelo.imagem;

    carroParaTrocaSelecionado = null;

    jogo.ofertaAtual = {
        marca: modelo.marca,
        nome: modelo.modelo,
        versao: modelo.versao,
        imagem: imagemEscolhida,
        ano: ano,
        km: km,
        cor: cor,
        origemInfo: origensSorteada,
        defeitos: defeitosCarro,
        custoVisivel: custoVisivel,
        custoOculto: custoOculto,
        documentoPendente: valorDoc,
        fipe: modelo.fipe,
        precoOriginal: precoPedida,
        precoAtual: precoPedida,
        precoMinimo: precoMinimoAceitavel,
        laudoFeito: false
    };

    mostrarOferta();
}

function mostrarOferta() {
    let carro = jogo.ofertaAtual;
    if (!carro) {
        gerarOferta();
        return;
    }

    // Cálculo da troca para ajustar a interface
    let valorAbatido = carroParaTrocaSelecionado ? Math.floor(carroParaTrocaSelecionado.fipe * 0.85) : 0;
    let saldoRestante = Math.max(0, carro.precoAtual - valorAbatido);

    let html = `<div class="card carro-card" style="padding: 12px; max-width: 100%; box-sizing: border-box; background: #0f0f12; border: 1px solid #23232a; border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.6);">`;

    // PAINEL ADMIN DEBUG
    if (buscaVisivelAdmin) {
        html += `
        <div style="background: #18181b; border: 1px solid #3f3f46; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label style="font-size: 11px; font-weight: 700; color: #f4f4f5;">🔍 PAINEL ADMINISTRATIVO</label>
                <button onclick="fecharBuscaAdmin()" style="background: #27272a; color: #fff; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">✕</button>
            </div>
            <div style="display: flex; gap: 6px;">
                <input type="text" id="buscaCarroDebug" value="${termoPesquisaAtual}" placeholder="Buscar modelo..." oninput="filtrarCarrosBusca(this.value)" style="flex: 1; padding: 8px; background: #09090b; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; font-size: 12px;">
                <button onclick="clicarLupinha()" style="background: #2563eb; color: #fff; border: none; padding: 0 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">🔍</button>
            </div>
            <div id="resultadoBuscaDebug" style="max-height: 120px; overflow-y: auto; margin-top: 6px; background: #09090b; display: ${termoPesquisaAtual ? 'block' : 'none'}; border-radius: 6px; border: 1px solid #27272a;">
                ${gerarHtmlListaBusca(termoPesquisaAtual)}
            </div>
        </div>`;
    }

    // FOTO COM ASPECT RATIO 16:9
    html += `
    <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 10px; margin-bottom: 12px; background: #000; border: 1px solid #27272a;">
        <img src="imagens/${carro.imagem}" onerror="this.src='imagens/gol.jpg'" onclick="registrarCliqueSecreto()" style="width: 100%; height: 100%; object-fit: contain; object-position: center;">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 35%; background: linear-gradient(to top, rgba(15,15,18,0.95), transparent); pointer-events: none;"></div>
        
        <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); border: 1px solid ${carro.origemInfo.cor}; color: ${carro.origemInfo.cor}; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
            ${carro.origemInfo.tipo}
        </div>
    </div>
    
    <div style="text-align: center; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 18px; color: #fff; font-weight: 800;">${carro.marca} ${carro.nome}</h3>
        <span style="font-size: 12px; color: #94a3b8; font-weight: 500;">${carro.versao}</span>
    </div>

    <!-- CHIPS DE INFORMACÃO -->
    <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 12px; font-size: 11px;">
        <span style="background: #1e1e24; border: 1px solid #2d2d38; color: #e2e8f0; padding: 5px 10px; border-radius: 6px; font-weight: 600;">📅 ${carro.ano}</span>
        <span style="background: #1e1e24; border: 1px solid #2d2d38; color: #e2e8f0; padding: 5px 10px; border-radius: 6px; font-weight: 600;">🛣️ ${carro.km.toLocaleString("pt-BR")} km</span>
        <span style="background: #1e1e24; border: 1px solid #2d2d38; color: #e2e8f0; padding: 5px 10px; border-radius: 6px; font-weight: 600;">🎨 ${carro.cor}</span>
        <span style="background: #1e1e24; border: 1px solid ${carro.documentoPendente > 0 ? '#7f1d1d' : '#14532d'}; color: ${carro.documentoPendente > 0 ? '#fca5a5' : '#86efac'}; padding: 5px 10px; border-radius: 6px; font-weight: 600;">
            📜 ${carro.documentoPendente > 0 ? 'Doc: R$ ' + carro.documentoPendente.toLocaleString("pt-BR") : 'Doc OK'}
        </span>
    </div>

    <!-- CARDS DE PREÇO -->
    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <div style="flex: 1; background: #16161a; padding: 8px; border-radius: 8px; text-align: center; border: 1px solid #27272a;">
            <span style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; display: block;">Tabela FIPE</span>
            <strong style="font-size: 14px; color: #38bdf8;">R$ ${carro.fipe.toLocaleString("pt-BR")}</strong>
        </div>
        <div style="flex: 1; background: #16161a; padding: 8px; border-radius: 8px; text-align: center; border: 1px solid #27272a;">
            <span style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; display: block;">Valor Anúncio</span>
            <strong style="font-size: 15px; color: #4ade80;">R$ ${carro.precoAtual.toLocaleString("pt-BR")}</strong>
        </div>
    </div>

    <!-- DIAGNÓSTICO -->
    <div style="background: #16161a; border: 1px solid #27272a; padding: 10px; border-radius: 8px; margin-bottom: 12px; font-size: 12px;">
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">
            🔧 Diagnóstico da Garagem
        </div>
    `;

    let defeitosVisiveis = carro.defeitos.filter(d => !d.oculto || carro.laudoFeito);
    let defeitosOcultosQtd = carro.defeitos.filter(d => d.oculto && !carro.laudoFeito).length;

    if (defeitosVisiveis.length === 0 && defeitosOcultosQtd === 0) {
        html += `<div style="color:#4ade80; font-size: 11px; font-weight: 600;">✅ Nenhuma avaria identificada.</div>`;
    } else {
        defeitosVisiveis.forEach(d => {
            html += `
            <div style="display:flex; justify-content:space-between; margin: 4px 0; font-size: 11px; color: #f1f5f9;">
                <span>• ${d.nome} ${d.oculto ? '<small style="color:#f87171; font-weight:bold;">(Laudo)</small>' : ''}</span>
                <strong style="color: #f87171;">R$ ${d.valor.toLocaleString("pt-BR")}</strong>
            </div>`;
        });
    }

    if (defeitosOcultosQtd > 0) {
        html += `<div style="color: #fbbf24; font-size: 10px; margin-top: 6px; font-weight: 600;">⚠️ ${defeitosOcultosQtd} item(ns) sob suspeita. Faça o Laudo.</div>`;
    }

    html += `</div>`;

    // PAINEL DE TROCA (BRICK)
    if (carroParaTrocaSelecionado) {
        html += `
        <div style="background: #18181b; border: 1px dashed #eab308; padding: 10px; border-radius: 8px; margin-bottom: 12px; font-size: 11px;">
            <div style="display:flex; justify-content:space-between; color: #eab308; font-weight: bold; margin-bottom: 4px;">
                <span>🔄 Na Troca: ${carroParaTrocaSelecionado.marca} ${carroParaTrocaSelecionado.modelo}</span>
                <span onclick="cancelarTroca()" style="cursor:pointer; color:#f87171;">[Remover]</span>
            </div>
            <div style="color: #a1a1aa;">Avaliado em: <strong style="color:#4ade80;">R$ ${valorAbatido.toLocaleString("pt-BR")}</strong></div>
            <div style="color: #fff; margin-top: 2px;">Volta em Dinheiro: <strong style="color:#38bdf8;">R$ ${saldoRestante.toLocaleString("pt-BR")}</strong></div>
        </div>`;
    }

    // BOTÕES DE AÇÃO
    let podePechinchar = !carroParaTrocaSelecionado || saldoRestante > 0;

    html += `
    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        ${!carro.laudoFeito ? `
            <button onclick="solicitarLaudoAnimado()" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #d97706, #b45309); border:none; color:#fff; border-radius:8px; font-size: 11px; cursor:pointer; font-weight: 700;">
                🔍 Laudo (R$ 350)
            </button>
        ` : `<div style="flex: 1; color: #4ade80; font-size: 10px; text-align:center; padding: 8px; background: #052e16; border: 1px solid #14532d; border-radius: 8px; font-weight: 700;">✅ Laudo OK</div>`}
        
        <button onclick="${podePechinchar ? 'abrirModalPechincha()' : ''}" style="flex: 1; padding: 10px; background: ${podePechinchar ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#3f3f46'}; border:none; color:${podePechinchar ? '#fff' : '#a1a1aa'}; border-radius:8px; font-size: 11px; cursor:${podePechinchar ? 'pointer' : 'not-allowed'}; font-weight: 700;">
            💬 ${podePechinchar ? 'Pechinchar' : 'Troca Coberta'}
        </button>
    </div>

    <button onclick="abrirModalTroca()" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); border:none; color:#fff; font-weight:700; font-size: 12px; border-radius: 8px; cursor:pointer; margin-bottom: 8px;">
        🔁 Dar Carro na Troca (Brick)
    </button>

    <button onclick="comprarCarro()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #16a34a, #15803d); border:none; color:#fff; font-weight:800; font-size: 13px; border-radius: 8px; cursor:pointer; text-transform: uppercase;">
        🚗 Comprar (R$ ${saldoRestante.toLocaleString("pt-BR")})
    </button>

    <!-- MODAL DO SCANNER DO LAUDO CAUTELAR -->
    <div id="modalScannerLaudo" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); backdrop-filter: blur(8px); z-index: 10000; justify-content: center; align-items: center; flex-direction: column;">
        <div style="width: 85%; max-width: 340px; background: #121215; border: 1px solid #22c55e; border-radius: 12px; padding: 16px; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: #22c55e; font-size: 14px;">🔍 VISTORIA CAUTELAR</h4>
            
            <div style="position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; border: 1px solid #22c55e; margin-bottom: 12px;">
                <img src="imagens/${carro.imagem}" style="width: 100%; height: 100%; object-fit: contain;">
                <div id="linhaLaserScan" style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #22c55e; box-shadow: 0 0 15px #22c55e;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 11px; font-weight: bold; color: #e2e8f0;">
                <span id="txtStatusScan">Verificando...</span>
                <span id="txtPorcentagemScan" style="color: #22c55e;">0%</span>
            </div>

            <div style="width: 100%; background: #1f1f23; height: 8px; border-radius: 4px; overflow: hidden;">
                <div id="barraProgressoScan" style="width: 0%; height: 100%; background: #22c55e; transition: width 0.1s linear;"></div>
            </div>
        </div>
    </div>

    <!-- MODAL SELEÇÃO DE BRICK (TROCA) -->
    <div id="modalTrocaCarro" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 9999; justify-content: center; align-items: center;">
        <div style="background: #16161a; padding: 16px; border-radius: 12px; width: 85%; max-width: 340px; border: 1px solid #27272a;">
            <h4 style="margin-top: 0; color: #fff; font-size: 15px; text-align: center;">Escolha um Carro do seu Pátio</h4>
            <div id="listaCarrosTroca" style="max-height: 200px; overflow-y: auto; margin-bottom: 12px;"></div>
            <button onclick="fecharModalTroca()" style="width: 100%; padding: 8px; background: #27272a; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Cancelar</button>
        </div>
    </div>

    <!-- MODAL DE PECHINCHA (CORRIGIDO PARA SALDO EM DINHEIRO) -->
    <div id="modalPechincha" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 9999; justify-content: center; align-items: center;">
        <div style="background: #16161a; padding: 20px; border-radius: 12px; width: 85%; max-width: 320px; border: 1px solid #27272a; text-align: center;">
            <h4 style="margin-top: 0; color: #fff;">Enviar Contraproposta</h4>
            <p id="subtituloPechincha" style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;"></p>
            <input type="number" id="inputProposta" placeholder="Ofereça uma volta em R$" style="width: 100%; padding: 10px; box-sizing: border-box; background: #09090b; border: 1px solid #3f3f46; color: #fff; border-radius: 8px; font-size: 15px; text-align: center; margin-bottom: 12px; font-weight: bold;">
            <div style="display: flex; gap: 8px;">
                <button onclick="fecharModalPechincha()" style="flex: 1; padding: 10px; background: #27272a; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancelar</button>
                <button onclick="confirmarPechincha()" style="flex: 1; padding: 10px; background: #16a34a; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Enviar Oferta</button>
            </div>
        </div>
    </div>
    </div>`;

    conteudo.innerHTML = html;
}

// ===========================================
// LÓGICA DO BRICK (TROCA DE VEÍCULOS)
// ===========================================

function abrirModalTroca() {
    if (!jogo.carros || jogo.carros.length === 0) {
        mostrarAlerta("🅿️ Pátio Vazio", "Você não tem nenhum carro na garagem para dar na troca.");
        return;
    }

    let container = document.getElementById("listaCarrosTroca");
    let html = "";

    jogo.carros.forEach((c, index) => {
        let avaliacao = Math.floor(c.fipe * 0.85);
        html += `
        <div onclick="selecionarCarroParaTroca(${index})" style="padding: 10px; background: #0f0f12; border: 1px solid #27272a; border-radius: 8px; margin-bottom: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="color: #fff; font-size: 12px; display: block;">${c.marca} ${c.modelo}</strong>
                <small style="color: #a1a1aa; font-size: 10px;">Ano: ${c.ano}</small>
            </div>
            <div style="text-align: right;">
                <span style="color: #4ade80; font-size: 11px; font-weight: bold; display: block;">R$ ${avaliacao.toLocaleString("pt-BR")}</span>
                <small style="color: #71717a; font-size: 9px;">(Avaliação)</small>
            </div>
        </div>`;
    });

    container.innerHTML = html;
    document.getElementById("modalTrocaCarro").style.display = "flex";
}

function fecharModalTroca() {
    document.getElementById("modalTrocaCarro").style.display = "none";
}

function selecionarCarroParaTroca(index) {
    carroParaTrocaSelecionado = { ...jogo.carros[index], indexNoPatio: index };
    fecharModalTroca();
    mostrarOferta();
}

function cancelarTroca() {
    carroParaTrocaSelecionado = null;
    mostrarOferta();
}

// ===========================================
// SCANNER DE VISTORIA
// ===========================================

function solicitarLaudoAnimado() {
    let custoLaudo = 350;
    if (jogo.dinheiro < custoLaudo) {
        if (typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("💸 Saldo Insuficiente", "Você precisa de R$ 350 para o laudo.");
        return;
    }

    let modal = document.getElementById("modalScannerLaudo");
    let barra = document.getElementById("barraProgressoScan");
    let txtPorcentagem = document.getElementById("txtPorcentagemScan");
    let txtStatus = document.getElementById("txtStatusScan");
    let linhaLaser = document.getElementById("linhaLaserScan");

    modal.style.display = "flex";

    let progresso = 0;
    let posicaoLaser = 0;
    let sentidoLaser = 1;

    let intervaloScan = setInterval(() => {
        progresso += 2;
        if (progresso > 100) progresso = 100;

        barra.style.width = progresso + "%";
        txtPorcentagem.innerText = progresso + "%";

        posicaoLaser += 5 * sentidoLaser;
        if (posicaoLaser >= 95 || posicaoLaser <= 0) sentidoLaser *= -1;
        linhaLaser.style.top = posicaoLaser + "%";

        if (progresso < 35) txtStatus.innerText = "Escanando chassi...";
        else if (progresso < 70) txtStatus.innerText = "Avaliando lataria e pintura...";
        else if (progresso < 99) txtStatus.innerText = "Buscando histórico...";

        if (progresso >= 100) {
            clearInterval(intervaloScan);
            setTimeout(() => {
                modal.style.display = "none";
                jogo.dinheiro -= custoLaudo;
                jogo.ofertaAtual.laudoFeito = true;
                atualizarPainel();
                mostrarOferta();
                mostrarAlerta("📋 Vistoria Concluída", "Laudo realizado! Problemas ocultos revelados.");
            }, 250);
        }
    }, 35);
}

// ===========================================
// LÓGICA DE PECHINCHA
// ===========================================

function abrirModalPechincha() {
    let carro = jogo.ofertaAtual;
    let valorAbatido = carroParaTrocaSelecionado ? Math.floor(carroParaTrocaSelecionado.fipe * 0.85) : 0;
    let saldoAtualDinheiro = Math.max(0, carro.precoAtual - valorAbatido);

    let subtitulo = document.getElementById("subtituloPechincha");
    let input = document.getElementById("inputProposta");

    if (carroParaTrocaSelecionado) {
        subtitulo.innerHTML = `Volta Atual em Dinheiro: <strong style="color:#38bdf8;">R$ ${saldoAtualDinheiro.toLocaleString("pt-BR")}</strong>`;
        input.placeholder = "Volta desejada em R$";
    } else {
        subtitulo.innerHTML = `Valor Anunciado: <strong style="color:#4ade80;">R$ ${carro.precoAtual.toLocaleString("pt-BR")}</strong>`;
        input.placeholder = "Sua proposta em R$";
    }

    input.value = "";
    document.getElementById("modalPechincha").style.display = "flex";
    input.focus();
}

function fecharModalPechincha() {
    document.getElementById("modalPechincha").style.display = "none";
}

function confirmarPechincha() {
    let input = document.getElementById("inputProposta");
    let valorProposto = parseInt(input.value);
    fecharModalPechincha();

    if (isNaN(valorProposto) || valorProposto < 0) return;

    let carro = jogo.ofertaAtual;
    let valorAbatido = carroParaTrocaSelecionado ? Math.floor(carroParaTrocaSelecionado.fipe * 0.85) : 0;
    let saldoAtualDinheiro = Math.max(0, carro.precoAtual - valorAbatido);

    if (valorProposto >= saldoAtualDinheiro) {
        mostrarAlerta("🤔 Proposta Inválida", "Sua contraproposta precisa ser menor do que o saldo cobrado!");
        return;
    }

    let novoPrecoCarroProposto = valorProposto + valorAbatido;

    if (novoPrecoCarroProposto >= carro.precoMinimo) {
        carro.precoAtual = novoPrecoCarroProposto;
        mostrarOferta();
        mostrarAlerta("🤝 Oferta Aceita!", `O vendedor aceitou! A volta em dinheiro ficou em R$ ${valorProposto.toLocaleString("pt-BR")}.`);
    } else {
        if (typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("❌ Oferta Recusada", "O vendedor achou a proposta muito baixa e recusou.");
    }
}

// ===========================================
// FECHAMENTO DE COMPRA
// ===========================================

function comprarCarro() {
    let carro = jogo.ofertaAtual;
    if (!carro) return;

    if (!jogo.empresa) jogo.empresa = { vagas: 4 };
    if (!jogo.carros) jogo.carros = [];

    // Se estiver dando carro na troca, libera a vaga do carro antigo
    let precisaVaga = !carroParaTrocaSelecionado;
    if (precisaVaga && jogo.carros.length >= jogo.empresa.vagas) {
        if (typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("🅿️ Pátio Lotado", `Seu limite é de ${jogo.empresa.vagas} vagas.`);
        return;
    }

    let valorTrocaAbatido = carroParaTrocaSelecionado ? Math.floor(carroParaTrocaSelecionado.fipe * 0.85) : 0;
    let custoFinalEmDinheiro = Math.max(0, carro.precoAtual - valorTrocaAbatido);

    if (jogo.dinheiro < custoFinalEmDinheiro) {
        if (typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("💸 Saldo Insuficiente", `Você precisa de R$ ${custoFinalEmDinheiro.toLocaleString("pt-BR")} em dinheiro.`);
        return;
    }

    jogo.dinheiro -= custoFinalEmDinheiro;
    if (typeof tocarSomCompra === "function") tocarSomCompra();

    // Se houver troca, remove o carro antigo do pátio
    if (carroParaTrocaSelecionado) {
        jogo.carros.splice(carroParaTrocaSelecionado.indexNoPatio, 1);
    }

    let todosDefeitos = carro.defeitos.map(d => ({ nome: d.nome, valor: d.valor }));

    jogo.carros.push({
        marca: carro.marca,
        modelo: carro.nome + " " + carro.versao,
        ano: carro.ano,
        km: carro.km,
        cor: carro.cor,
        origem: carro.origemInfo.tipo,
        fipe: carro.fipe,
        precoCompra: carro.precoAtual,
        documentosPendentes: carro.documentoPendente,
        foto: carro.imagem,
        defeitos: todosDefeitos,
        reparos: []
    });

    jogo.ofertaAtual = null;
    carroParaTrocaSelecionado = null;

    atualizarPainel();
    salvarJogo();

    mostrarAlerta("🎉 Negócio Fechado!", `${carro.marca} ${carro.nome} já está na sua garagem.`);

    if (typeof mostrarOficina === "function") mostrarOficina();
}

// AUXILIARES ADMIN
function registrarCliqueSecreto() {
    scheckCliques++;
    if (scheckCliques >= 12) {
        buscaVisivelAdmin = !buscaVisivelAdmin;
        scheckCliques = 0;
        mostrarOferta();
    }
}

function fecharBuscaAdmin() {
    buscaVisivelAdmin = false;
    scheckCliques = 0;
    modeloSelecionadoGlobal = null;
    termoPesquisaAtual = "";
    gerarOferta();
}

function filtrarCarrosBusca(termo) {
    termoPesquisaAtual = termo;
    let container = document.getElementById("resultadoBuscaDebug");
    if (!container) return;

    if (!termo || termo.trim() === "") {
        container.style.display = "none";
        return;
    }
    container.style.display = "block";
    container.innerHTML = gerarHtmlListaBusca(termo);
}

function gerarHtmlListaBusca(termo) {
    let termoBusca = termo.toLowerCase();
    let encontrados = carros.filter(c => 
        c.marca.toLowerCase().includes(termoBusca) || 
        c.modelo.toLowerCase().includes(termoBusca)
    );

    if (encontrados.length === 0) return `<div style="padding: 8px; color: #a1a1aa; font-size: 11px;">Sem resultados.</div>`;

    return encontrados.map(c => {
        let index = carros.indexOf(c);
        return `
        <div onclick="selecionarCarroBusca(${index})" style="padding: 8px; border-bottom: 1px solid #27272a; cursor: pointer; font-size: 11px;">
            <strong style="color: #38bdf8;">${c.marca} ${c.modelo}</strong> <small style="color:#71717a;">(${c.versao})</small>
        </div>`;
    }).join("");
}

function selecionarCarroBusca(index) {
    let modeloEscolhido = carros[index];
    if (modeloEscolhido) {
        modeloSelecionadoGlobal = modeloEscolhido;
        gerarOferta(modeloEscolhido);
    }
}

function clicarLupinha() {
    gerarOferta(modeloSelecionadoGlobal || null);
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}