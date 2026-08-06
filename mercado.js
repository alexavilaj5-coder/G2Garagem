// ===========================================
// MERCADO.JS V3.1 (CORREÇÃO AO FECHAR A BUSCA)
// G2 GARAGEM
// ===========================================

function gerarAno(modelo){
    if(typeof anosModelos !== "undefined" && anosModelos[modelo.modelo]){
        return aleatorio(
            anosModelos[modelo.modelo].inicio,
            anosModelos[modelo.modelo].fim
        );
    }
    return aleatorio(2008, jogo.ano);
}

function gerarKm(ano){
    let idade = jogo.ano - ano;

    let minimo = idade * 8000;
    let maximo = idade * 18000;

    if(minimo < 5000) minimo = 5000;
    if(maximo < 30000) maximo = 30000;

    return aleatorio(minimo, maximo);
}

// Variáveis globais para manter o estado da busca e o modelo atual selecionado
let termoPesquisaAtual = window.termoPesquisaAtual || "";
let modeloSelecionadoGlobal = window.modeloSelecionadoGlobal || null;
let buscaVisivelAdmin = window.buscaVisivelAdmin || false;
let scheckCliques = 0;

function gerarOferta(modeloEspecifico = null){
    let modelo = modeloEspecifico || modeloSelecionadoGlobal;

    if(!modelo){
        modelo = carros[
            aleatorio(0, carros.length - 1)
        ];
    }

    let ano = gerarAno(modelo);
    let km = gerarKm(ano);
    let cor = cores[
        aleatorio(0, cores.length - 1)
    ];
    let historico = historicos[
        aleatorio(0, historicos.length - 1)
    ];

    let defeitosCarro = [];
    let custoTotal = 0;
    let quantidade = aleatorio(0, 3);

    for(let i = 0; i < quantidade; i++){
        let defeito = defeitos[
            aleatorio(0, defeitos.length - 1)
        ];

        if(!defeitosCarro.some(d => d.nome == defeito.nome)){
            defeitosCarro.push(defeito);
            custoTotal += defeito.valor;
        }
    }

    let desconto = aleatorio(5000, 15000);
    let preco = modelo.fipe - desconto - custoTotal;

    if(preco < modelo.fipe * 0.45){
        preco = Math.floor(modelo.fipe * 0.45);
    }

    let imagemEscolhida = Array.isArray(modelo.imagem)
        ? modelo.imagem[aleatorio(0, modelo.imagem.length - 1)]
        : modelo.imagem;

    jogo.ofertaAtual = {
        marca: modelo.marca,
        nome: modelo.modelo,
        versao: modelo.versao,
        imagem: imagemEscolhida,
        ano: ano,
        km: km,
        cor: cor,
        historico: historico,
        defeitos: defeitosCarro,
        custo: custoTotal,
        fipe: modelo.fipe,
        preco: preco
    };

    mostrarOferta();
}

function registrarCliqueSecreto(){
    scheckCliques++;
    if(scheckCliques >= 12){
        buscaVisivelAdmin = !buscaVisivelAdmin;
        scheckCliques = 0;
        mostrarOferta();
    }
}

function mostrarOferta(){
    let carro = jogo.ofertaAtual;

    if(!carro){
        gerarOferta();
        return;
    }

    let html = `
<div class="card carro-card">
`;

    // --- PAINEL SECRETO DE BUSCA ---
    if(buscaVisivelAdmin){
        html += `
        <div style="background: #1a1a1a; border: 1px solid #333; padding: 12px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label for="buscaCarroDebug" style="font-size: 13px; font-weight: 700; color: #f1f1f1;">🔍 Painel Secreto - Testar Veículo:</label>
                <button onclick="fecharBuscaAdmin()" style="background: #333; color: #fff; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">✕ Fechar</button>
            </div>
            
            <div style="display: flex; gap: 8px; align-items: center; position: relative;">
                <input type="text" id="buscaCarroDebug" value="${termoPesquisaAtual}" placeholder="Digite marca ou modelo (ex: uno)..." oninput="filtrarCarrosBusca(this.value)" style="flex: 1; padding: 12px 14px; border: 1px solid #444; border-radius: 6px; box-sizing: border-box; font-size: 15px; outline: none; background: #262626; color: #fff;">
                <button onclick="clicarLupinha()" style="background: #0d6efd; color: #fff; border: none; width: 38px; height: 38px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" title="Gerar novo veículo deste modelo">🔍</button>
            </div>

            <div id="resultadoBuscaDebug" style="max-height: 200px; overflow-y: auto; margin-top: 6px; background: #1e1e1e; border: 1px solid #444; border-radius: 6px; display: ${termoPesquisaAtual ? 'block' : 'none'}; box-shadow: 0 4px 6px rgba(0,0,0,0.5); z-index: 100; position: relative;">
                ${gerarHtmlListaBusca(termoPesquisaAtual)}
            </div>
        </div>
        `;
    }

    // --- FOTO DO CARRO COM 4 CLIQUES PARA ATIVAR O SEGREDO ---
    html += `
<img src="imagens/${carro.imagem}" onerror="this.src='imagens/gol.jpg'" onclick="registrarCliqueSecreto()" style="cursor: pointer;" title="Clique 4 vezes para abrir o painel de testes">

<h2>${carro.marca} ${carro.nome}</h2>

<h3>${carro.versao}</h3>

<div class="info-grid">

<div>
📅
<strong>${carro.ano}</strong>
</div>

<div>
🛣️
<strong>${carro.km.toLocaleString("pt-BR")} km</strong>
</div>

<div>
🎨
<strong>${carro.cor}</strong>
</div>

<div>
📖
<strong>${carro.historico}</strong>
</div>

</div>

<div class="precos">

<div class="fipe-box">
<small>FIPE</small>
<strong>
R$ ${carro.fipe.toLocaleString("pt-BR")}
</strong>
</div>

<div class="pedido-box">
<small>PEDIDO</small>
<strong>
R$ ${carro.preco.toLocaleString("pt-BR")}
</strong>
</div>

</div>

<h3>
🔧 Defeitos encontrados
</h3>
`;

if(carro.defeitos.length == 0){
    html += `
    <div class="defeito ok">
        ✅ Veículo sem defeitos
    </div>
    `;
} else {
    carro.defeitos.forEach(function(d){
        html += `
        <div class="defeito">
            <span>
                🔧 ${d.nome}
            </span>
            <strong>
                R$ ${d.valor.toLocaleString("pt-BR")}
            </strong>
        </div>
        `;
    });
}

html += `
<div class="resumo-compra">
    <div>
        <small>Custo dos reparos</small>
        <strong>
            R$ ${carro.custo.toLocaleString("pt-BR")}
        </strong>
    </div>
</div>

<button class="btnComprar" onclick="comprarCarro()">
    🚗 Comprar Veículo
</button>

</div>
`;

    conteudo.innerHTML = html;
}

function fecharBuscaAdmin(){
    buscaVisivelAdmin = false;
    scheckCliques = 0;
    modeloSelecionadoGlobal = null; // Limpa o carro fixado
    termoPesquisaAtual = ""; // Limpa o texto da pesquisa
    gerarOferta(); // Gera um carro totalmente aleatório novamente
}

// ===========================
// FUNÇÕES DE BUSCA E LUPINHA
// ===========================
function filtrarCarrosBusca(termo){
    termoPesquisaAtual = termo;
    let container = document.getElementById("resultadoBuscaDebug");
    if(!container) return;

    if(!termo || termo.trim() === ""){
        container.style.display = "none";
        container.innerHTML = "";
        return;
    }

    container.style.display = "block";
    container.innerHTML = gerarHtmlListaBusca(termo);
}

function gerarHtmlListaBusca(termo){
    if(!termo || termo.trim() === "") return "";
    let termoBusca = termo.toLowerCase();
    let encontrados = carros.filter(c => 
        c.marca.toLowerCase().includes(termoBusca) || 
        c.modelo.toLowerCase().includes(termoBusca) || 
        c.versao.toLowerCase().includes(termoBusca)
    );

    if(encontrados.length === 0){
        return `<div style="padding: 10px; font-size: 13px; color: #aaa; text-align: center;">Nenhum veículo encontrado.</div>`;
    }

    let htmlLista = "";
    encontrados.forEach((carroMatch) => {
        let indexReal = carros.indexOf(carroMatch);
        htmlLista += `
        <div onclick="selecionarCarroBusca(${indexReal})" style="padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #2a2a2a; cursor: pointer; text-align: left; color: #fff; transition: background 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#1e1e1e'">
            <strong style="color: #4dabf7;">${carroMatch.marca} ${carroMatch.modelo}</strong> <span style="color: #aaa; font-size: 12px;">(${carroMatch.versao})</span><br>
            <span style="font-size: 11px; color: #ccc;">FIPE: R$ ${carroMatch.fipe.toLocaleString("pt-BR")}</span>
        </div>`;
    });

    return htmlLista;
}

function selecionarCarroBusca(index){
    let modeloEscolhido = carros[index];
    if(modeloEscolhido){
        modeloSelecionadoGlobal = modeloEscolhido;
        gerarOferta(modeloEscolhido);
    }
}

// Botão da Lupinha: gera uma nova variação mantendo o carro atual na memória
function clicarLupinha(){
    if(modeloSelecionadoGlobal){
        gerarOferta(modeloSelecionadoGlobal);
    } else {
        gerarOferta();
    }
}

// ===========================
// FUNÇÃO DE PONTE (CHAMADA PELO MENU HTML)
// ===========================
function mostrarMercado(){
    if(!jogo.ofertaAtual){
        gerarOferta();
    } else {
        mostrarOferta();
    }
}

// ===========================
// COMPRAR CARRO (COM TRAVA DE VAGAS BLINDADA + SONS)
// ===========================
function comprarCarro(){
    let carro = jogo.ofertaAtual;

    if(!carro){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("❌ Erro", "Nenhuma oferta disponível no momento.");
        return;
    }

    if(!jogo.empresa) jogo.empresa = { nivel: 1, vagas: 4 };
    if(!jogo.empresa.vagas) jogo.empresa.vagas = 4;
    if(!jogo.carros) jogo.carros = [];

    if (jogo.carros.length >= jogo.empresa.vagas) {
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta(
            "🅿️ Pátio Lotado!", 
            `Seu pátio atingiu o limite de ${jogo.empresa.vagas} vagas.\n\nVenda um veículo ou expanda sua garagem para poder comprar mais!`
        );
        return; 
    }

    if(jogo.dinheiro < carro.preco){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta(
            "💸 Dinheiro insuficiente", 
            `Você não possui saldo suficiente para comprar este veículo.\n\nCaixa: R$ ${jogo.dinheiro.toLocaleString("pt-BR")}\nPreço: R$ ${carro.preco.toLocaleString("pt-BR")}`
        );
        return;
    }

    jogo.dinheiro -= carro.preco;

    if(typeof tocarSomCompra === "function") {
        tocarSomCompra();
    }

    if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0, lucroTotal: 0 };
    jogo.estatisticas.comprados++;

    jogo.carros.push({
        marca: carro.marca,
        modelo: carro.nome + " " + carro.versao,
        ano: carro.ano,
        km: carro.km,
        cor: carro.cor,
        fipe: carro.fipe,
        precoCompra: carro.preco,
        foto: carro.imagem, 
        defeitos: [...carro.defeitos],
        reparos: []
    });

    jogo.ofertaAtual = null;

    atualizarPainel();
    salvarJogo();

    mostrarAlerta(
        "🎉 Compra Realizada", 
        `Você comprou o ${carro.marca} ${carro.nome}!\n\nO carro foi enviado para a oficina.`
    );

    if(typeof mostrarOficina === "function"){
        mostrarOficina();
    }
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}