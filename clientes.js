// ===========================================
// CLIENTES.JS V14.1 - CREDIÁRIO, ESCOLHA DE VENCIMENTO & TRAVA DE ARGUMENTO 🚗💳📅
// G2 GARAGEM
// ===========================================

const nomesClientes = [
    "João", "Carlos", "Pedro", "Lucas", "Marcos", "André",
    "Roberto", "Fernando", "Gabriel", "Felipe",
    "Juliana", "Amanda", "Camila", "Patrícia", "Fernanda",
    "Mariana", "Nelson", "Dexter", "Viviane", "Mickael",
    "Tales", "Raffa Repasses", "Giulia", "Laura", "Bruno",
    "Tiago", "Mecânica Midas", "José", "Sr Amir",
    "Sampaio Garagem", "Gustavo", "Ronaldo", "Joana",
    "Isabelle", "Bernardo", "Carmen", "Ana",
    "Pietra", "Pietro", "Antoni", "Joaquim"
];

const tiposClientes = [
    { nome: "Cliente Comum", bonus: 0, tolerancia: 2, descricao: "Busca um carro honesto pelo preço justo de mercado." },
    { nome: "Revendedor", bonus: -5, tolerancia: 3, descricao: "Olho clínico para lucro rápido. Quer pagar barato para revender." },
    { nome: "Colecionador", bonus: 6, tolerancia: 1, descricao: "Apaixonado por raridades. Paga bien se o carro estiver impecável." },
    { nome: "Cliente Exigente", bonus: -3, tolerancia: 1, descricao: "Nota cada detalhe e defeito. Chato na negociação, mas tem bom orçamento." },
    { nome: "Comprador Desesperado", bonus: 10, tolerancia: 4, descricao: "Precisa de um carro para ontem. Aceita pagar ágio sem pensar duas vezes." }
];

function mostrarClientes(){
    if (typeof jogo === 'undefined') window.jogo = {};
    if (!jogo.carros || !Array.isArray(jogo.carros)) {
        let salvo = localStorage.getItem("g2_garagem_jogo") || localStorage.getItem("jogo");
        if (salvo) {
            try {
                let dados = JSON.parse(salvo);
                if (dados && dados.carros) jogo.carros = dados.carros;
            } catch(e) {}
        }
    }

    let qtdFinanciamentos = jogo.financiamentosAtivos ? jogo.financiamentosAtivos.length : 0;

    if(!jogo.carros || !Array.isArray(jogo.carros) || jogo.carros.length === 0){
        conteudo.innerHTML = `
        <div class="garagem-header" style="margin-bottom: 15px;">
            <div class="garagem-titulo">
                <span class="garagem-icone">👥</span>
                <div class="garagem-texto-titulo">
                    <h1>SALÃO DE VENDAS</h1>
                    <p>Gerenciamento de Pátio e Crediário Mensal</p>
                </div>
            </div>
            <button onclick="abrirPainelFinanciamentos()" style="background: #9c27b0; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                💳 Crediário Mensal (${qtdFinanciamentos})
            </button>
        </div>
        <div class="card" style="text-align: center; padding: 40px;">
            <span style="font-size: 3rem; display: block; margin-bottom: 15px;">👥</span>
            <h2>Salão de Vendas Vazio</h2>
            <p style="color: #aaa; margin-top: 10px;">Você não possui nenhum veículo no pátio para atrair compradores.</p>
        </div>
        `;
        return;
    }

    if(jogo.clienteAtual){
        mostrarClienteAtual();
        return;
    }

    gerarNovoCliente();
}

function gerarNovoCliente(){
    if(!jogo.carros || !Array.isArray(jogo.carros) || jogo.carros.length === 0) {
        mostrarClientes();
        return;
    }

    if(Math.random() < 0.15){
        jogo.clienteAtual = { semCliente: true };
        mostrarClienteAtual();
        return;
    }

    let indiceCarro = aleatorio(0, jogo.carros.length - 1);
    let carro = jogo.carros[indiceCarro];

    if(!carro) {
        mostrarClientes();
        return;
    }

    let nome = nomesClientes[aleatorio(0, nomesClientes.length - 1)];
    let tipo = tiposClientes[aleatorio(0, tiposClientes.length - 1)];
    let ofertaInicial = calcularOfertaInicial(carro, tipo.bonus);

    let carroTroca = null;
    if(Math.random() < 0.28) {
        carroTroca = gerarCarroAleatorioParaTroca();
    }

    jogo.clienteAtual = {
        nome: nome,
        tipo: tipo.nome,
        descricaoTipo: tipo.descricao,
        toleranciaMax: tipo.tolerancia,
        bonusTipo: tipo.bonus,
        carro: indiceCarro,
        ofertaAtual: ofertaInicial,
        ofertaInicial: ofertaInicial,
        fatorPechincha: 0,
        jaArgumentou: false, // TRAVA CONTRA FARM DE DINHEIRO INFINITO
        humor: "Neutro",
        carroTroca: carroTroca,
        historicoDialogo: [
            carroTroca 
                ? `Olá, vi este ${carro.marca || ''} ${carro.modelo || 'Veículo'} e quero negociar. Posso dar meu ${carroTroca.modelo} na troca mais uma volta em dinheiro!`
                : `Olá, vim dar uma olhada neste ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}. Quanto faz nele?`
        ]
    };

    salvarJogo();
    mostrarClienteAtual();
}

function gerarCarroAleatorioParaTroca(){
    let marcas = ["Fiat", "Volkswagen", "Chevrolet", "Ford", "Renault"];
    let modelos = ["Uno Mille", "Gol G4", "Corsa C", "Fiesta Rocam", "Clio 1.0"];
    let m = marcas[aleatorio(0, marcas.length - 1)];
    let mod = modelos[aleatorio(0, modelos.length - 1)];
    let fipe = aleatorio(10000, 22000);
    return {
        marca: m,
        modelo: mod,
        ano: aleatorio(2004, 2012),
        fipe: fipe,
        km: aleatorio(90000, 190000),
        cor: "Semi-novo",
        precoCompra: Math.floor(fipe * 0.65),
        defeitos: [{ nome: "Desgaste natural de uso", valor: 800 }],
        reparos: []
    };
}

function calcularOfertaInicial(carro, bonus){
    let fipe = carro.fipe || 15000;
    let temDefeitos = carro.defeitos && Array.isArray(carro.defeitos) && carro.defeitos.length > 0;
    
    let fatorDefeito = temDefeitos ? 0.78 : 0.88;
    let base = fipe * fatorDefeito;

    let oferta = Math.floor(base + (fipe * (bonus / 100)) + ((jogo.reputacao || 0) * 50));
    let tetoMax = fipe * 1.10;

    if(oferta > tetoMax) oferta = Math.floor(tetoMax);
    if(oferta < fipe * 0.55) oferta = Math.floor(fipe * 0.55);

    return oferta;
}

function mostrarClienteAtual(){
    let cliente = jogo.clienteAtual;
    let qtdFinanciamentos = jogo.financiamentosAtivos ? jogo.financiamentosAtivos.length : 0;

    if(!cliente || cliente.semCliente){
        conteudo.innerHTML = `
        <div class="garagem-header" style="margin-bottom: 15px;">
            <div class="garagem-titulo">
                <span class="garagem-icone">👥</span>
                <div class="garagem-texto-titulo">
                    <h1>SALÃO DE VENDAS</h1>
                    <p>Movimento no Pátio</p>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="abrirPainelFinanciamentos()" style="background: #9c27b0; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                    💳 Crediário Mensal (${qtdFinanciamentos})
                </button>
                <button onclick="abrirPainelMarketing()" style="background: #ffb700; color: #000; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                    📢 Marketing
                </button>
            </div>
        </div>
        <div class="card" style="text-align: center; padding: 40px;">
            <span style="font-size: 3rem; display: block; margin-bottom: 15px;">😴</span>
            <h2>Movimento Fraco no Pátio</h2>
            <p style="color: #aaa; margin-top: 10px; margin-bottom: 25px;">Nenhum comprador se interessou pelos veículos hoje. Use campanhas de marketing para impulsionar as vendas!</p>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <button onclick="proximoDia()" class="btn-leilao-lance" style="max-width: 220px; cursor: pointer;">
                    ⏭️ Avançar o Dia
                </button>
                <button onclick="abrirPainelMarketing()" style="background: #ffb700; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                    📢 Impulsionar Vendas
                </button>
            </div>
        </div>
        `;
        return;
    }

    if(!jogo.carros || !jogo.carros[cliente.carro]){
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
        return;
    }

    let carro = jogo.carros[cliente.carro];
    let corHumor = "#00e676";
    if(cliente.humor === "Desconfiado") corHumor = "#ffb700";
    if(cliente.humor === "Irritado") corHumor = "#ff5252";

    let temDefeitos = carro.defeitos && Array.isArray(carro.defeitos) && carro.defeitos.length > 0;

    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">🤝</span>
            <div class="garagem-texto-titulo">
                <h1>MESA DE NEGOCIAÇÃO</h1>
                <p>Negociando com ${cliente.nome} (${cliente.tipo})</p>
            </div>
        </div>
        <div style="display: flex; gap: 8px;">
            <button onclick="abrirPainelFinanciamentos()" style="background: #9c27b0; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                💳 Crediário (${qtdFinanciamentos})
            </button>
            <button onclick="abrirPainelMarketing()" style="background: #ffb700; color: #000; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                📢 Marketing
            </button>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 15px;">
        <div class="card" style="margin: 0;">
            <h3>🚗 Veículo em Foco</h3>
            <hr style="border-color: #333; margin: 10px 0;">
            <p style="font-size: 1.1rem; font-weight: bold; color: #fff;">${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'} (${carro.ano || 'N/D'})</p>
            <p style="color: #aaa; font-size: 0.9rem; margin-top: 5px;">🛣️ KM: ${carro.km ? carro.km.toLocaleString("pt-BR") : "0"} | 🎨 Cor: ${carro.cor || "Original"}</p>
            <p style="color: #aaa; font-size: 0.9rem;">💰 Tabela FIPE: <strong style="color: #00e676;">R$ ${(carro.fipe || 15000).toLocaleString("pt-BR")}</strong></p>
            
            ${temDefeitos ? `
                <div style="margin-top: 12px; background: rgba(255,82,82,0.1); border: 1px solid #ff5252; padding: 8px; border-radius: 6px;">
                    <span style="font-size: 0.8rem; color: #ff5252; font-weight: bold;">⚠️ Defeitos Relatados:</span>
                    <ul style="margin: 5px 0 0 15px; font-size: 0.8rem; color: #ff8a80;">
                        ${carro.defeitos.map(d => `<li>${d.nome || d}</li>`).join('')}
                    </ul>
                </div>
            ` : `<div style="margin-top: 12px; background: rgba(0,230,118,0.1); border: 1px solid #00e676; padding: 8px; border-radius: 6px; font-size: 0.8rem; color: #00e676; font-weight: bold;">✅ Veículo íntegro e pronto para venda!</div>`}

            ${cliente.carroTroca ? `
                <div style="margin-top: 12px; background: rgba(33,150,243,0.1); border: 1px solid #2196F3; padding: 8px; border-radius: 6px;">
                    <span style="font-size: 0.8rem; color: #2196F3; font-weight: bold;">🔄 Proposta de Troca (Trade-in):</span>
                    <p style="font-size: 0.85rem; color: #fff; margin-top: 4px;">Dá o ${cliente.carroTroca.marca} ${cliente.carroTroca.modelo} (${cliente.carroTroca.ano}) avaliado em R$ ${cliente.carroTroca.fipe.toLocaleString("pt-BR")} na troca!</p>
                </div>
            ` : ''}

            <div style="margin-top: 20px;">
                <button onclick="abrirSeletorTrocaCarro()" style="width: 100%; background: #222; color: #fff; border: 1px solid #444; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                    🔄 Oferecer Outro Carro do Pátio
                </button>
            </div>
        </div>

        <div class="card" style="margin: 0; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 0.85rem; color: #888; text-transform: uppercase;">Perfil: ${cliente.descricaoTipo}</span>
                    <span style="font-size: 0.85rem; font-weight: bold; color: ${corHumor};">Humor: ${cliente.humor}</span>
                </div>

                <div style="background: #121212; border: 1px solid #333; padding: 12px; border-radius: 8px; min-height: 90px; max-height: 120px; overflow-y: auto; margin-bottom: 15px;">
                    ${Array.isArray(cliente.historicoDialogo) ? cliente.historicoDialogo.map(msg => `<p style="font-size: 0.9rem; color: #ddd; margin-bottom: 6px;">💬 ${msg}</p>`).join('') : ''}
                </div>

                <div style="text-align: center; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid #222;">
                    <span style="font-size: 0.75rem; color: #aaa; text-transform: uppercase; display: block;">Oferta Atual da Mesa</span>
                    <h1 style="color: #00e676; font-size: 2rem; margin: 5px 0;">R$ ${(cliente.ofertaAtual || 0).toLocaleString("pt-BR")}</h1>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 15px;">
                <button onclick="aceitarOferta()" style="background: #00e676; color: #000; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem;">
                    💵 Vender à Vista
                </button>
                <button onclick="abrirModalFinanciamento()" style="background: #9c27b0; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem;">
                    💳 Crediário Mensal
                </button>
                <button onclick="abrirModalNegociacaoAvancada()" style="background: #ffb700; color: #000; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
                    💬 Contraproposta
                </button>
                <button onclick="tentarPressaoPsicologica()" style="background: ${cliente.jaArgumentou ? '#444' : '#2196F3'}; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.8rem;" ${cliente.jaArgumentou ? 'title="Você já usou este argumento com este cliente!"' : ''}>
                    🧠 Argumentar ${cliente.jaArgumentou ? '(Usado)' : ''}
                </button>
                <button onclick="recusarOferta()" style="background: #ff5252; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; grid-column: span 2; cursor: pointer; font-size: 0.8rem;">
                    ❌ Mandar o Cliente Embora
                </button>
            </div>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
}

// ===========================================
// PAINEL DE CREDIÁRIO MENSAL & CENTRAL DE COBRANÇA
// ===========================================
function abrirPainelFinanciamentos(){
    let financiamentos = jogo.financiamentosAtivos || [];

    let listaHtml = "";
    if(financiamentos.length === 0) {
        listaHtml = `<p style="color: #aaa; text-align: center; padding: 25px;">Nenhum contrato de crediário mensal ativo no momento.</p>`;
    } else {
        listaHtml = financiamentos.map((f, idx) => {
            let parcelaAtualNum = (f.totalMeses - f.mesesRestantes) + 1;
            if (parcelaAtualNum > f.totalMeses) parcelaAtualNum = f.totalMeses;
            let formatoParcela = `${String(parcelaAtualNum).padStart(2, '0')}/${String(f.totalMeses).padStart(2, '0')}`;

            let estaInadimplente = f.mesesAtraso >= 2;

            return `
            <div style="background: #1e1e1e; border: 1px solid ${estaInadimplente ? '#ff5252' : '#333'}; padding: 12px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>👤 ${f.clienteNome}</strong><br>
                    <small style="color: #aaa;">Carro: ${f.carroModelo} | Vencimento dia <strong>${f.diaVencimento}</strong></small><br>
                    <small style="color: ${f.mesesAtraso > 0 ? '#ff5252' : '#00e676'};">
                        Parcela: ${formatoParcela} (R$ ${f.parcelaMensal.toLocaleString("pt-BR")}) 
                        ${f.mesesAtraso > 0 ? `(⚠️ Atrasado ${f.mesesAtraso}m - Faltam ${f.mesesRestantes} parcelas)` : `(Faltam ${f.mesesRestantes} parcelas)`}
                    </small>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button onclick="abrirCentralCobranca(${idx})" style="background: ${estaInadimplente ? '#ff9800' : '#2196F3'}; color: #fff; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">
                        📞 Ligar / Cobrar
                    </button>
                    ${estaInadimplente ? `
                        <button onclick="apreenderVeiculoInadimplente(${idx})" style="background: #ff5252; color: #fff; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">🚨 Apreender</button>
                    ` : ''}
                </div>
            </div>
        `;
        }).join('');
    }

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">💳</span>
            <div class="garagem-texto-titulo">
                <h1>CREDIÁRIO MENSAL (FLUXO DE CAIXA)</h1>
                <p>Recebimentos e controle de inadimplência</p>
            </div>
        </div>
    </div>
    <div class="card">
        <h3>Contratos de Parcelamento Ativos</h3>
        <hr style="border-color: #333; margin: 10px 0;">
        <div style="max-height: 380px; overflow-y: auto;">
            ${listaHtml}
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="mostrarClientes()" class="btn-leilao-sair" style="padding: 8px 20px; cursor: pointer;">Voltar ao Salão de Vendas</button>
        </div>
    </div>
    `;
}

// ===========================================
// CENTRAL DE RENEGOCIAÇÃO E LIGAÇÃO TELEFÔNICA
// ===========================================
function abrirCentralCobranca(index){
    let f = jogo.financiamentosAtivos[index];
    if(!f) return;

    if(typeof tocarSomTelefone === "function") tocarSomTelefone();

    let statusTexto = f.mesesAtraso > 0 
        ? `<span style="color: #ff5252;">⚠️ Cliente com ${f.mesesAtraso} mês(es) de atraso na praça!</span>` 
        : `<span style="color: #00e676;">✅ Cliente em dia com os pagamentos.</span>`;

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">📞</span>
            <div class="garagem-texto-titulo">
                <h1>CENTRAL DE COBRANÇA TELEFÔNICA</h1>
                <p>Em chamada com ${f.clienteNome} (${f.carroModelo})</p>
            </div>
        </div>
    </div>
    <div class="card">
        <h3>Detalhes do Contrato</h3>
        <p style="color: #aaa; font-size: 0.9rem; margin-top: 5px;">${statusTexto}</p>
        <p style="color: #ddd; font-size: 0.9rem; margin-top: 5px;">Valor da Parcela: <strong>R$ ${f.parcelaMensal.toLocaleString("pt-BR")}</strong> | Vencimento Dia: <strong>${f.diaVencimento}</strong> | Restam: <strong>${f.mesesRestantes} parcelas</strong></p>
        <hr style="border-color: #333; margin: 15px 0;">

        <h4 style="color: #fff; margin-bottom: 10px;">O que você deseja dizer ao cliente?</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="executarAcaoCobranca(${index}, 'amigavel')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #00e676;">🤝 Cobrança Amigável / Lembrete</strong><br>
                <small style="color: #aaa;">Lembra o cliente educadamente da parcela. Baixo risco de atrito.</small>
            </button>

            <button onclick="executarAcaoCobranca(${index}, 'renegociar')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ffb700;">🔄 Propor Renegociação / Esticar Prazo</strong><br>
                <small style="color: #aaa;">Alonga o contrato em +2 meses para dar respiro financeiro ao cliente.</small>
            </button>

            <button onclick="executarAcaoCobranca(${index}, 'ultimato')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ff5252;">⚠️ Dar Ultimato Rígido</strong><br>
                <small style="color: #aaa;">Ameaça acionar o jurídico/guincho. Pode pagar na hora ou se irritar profundamente.</small>
            </button>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button onclick="abrirPainelFinanciamentos()" class="btn-leilao-sair" style="padding: 8px 20px; cursor: pointer;">Desligar Telefone</button>
        </div>
    </div>
    `;
}

function executarAcaoCobranca(index, acao){
    let f = jogo.financiamentosAtivos[index];
    if(!f) return;

    if(acao === 'amigavel'){
        mostrarAlerta("📞 Chamada Concluída", `${f.clienteNome} foi atencioso, pediu desculpas pelo transtorno e prometeu regularizar.`);
    } else if(acao === 'renegociar'){
        f.mesesRestantes += 2;
        f.parcelaMensal = Math.max(500, Math.floor(f.parcelaMensal * 0.85));
        if(f.mesesAtraso > 0) f.mesesAtraso = 0;
        salvarJogo();
        mostrarAlerta("🤝 Acordo Fechado!", `${f.clienteNome} aceitou a renegociação! Prazo esticado e parcela ajustada para aliviar o orçamento dele.`);
    } else if(acao === 'ultimato'){
        if(Math.random() < 0.5){
            f.mesesAtraso = 0;
            jogo.dinheiro = (jogo.dinheiro || 0) + f.parcelaMensal;
            if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
            mostrarAlerta("💰 Pagamento Efetuado sob Pressão!", `${f.clienteNome} se assustou com o tom firme, correu e transferiu a parcela atual!`);
        } else {
            f.mesesAtraso++;
            mostrarAlerta("😡 Cliente Revoltado", `${f.clienteNome} odiou a ameaça, bateu boca com você e desligou o telefone na sua cara!`);
        }
        salvarJogo();
    }

    abrirPainelFinanciamentos();
}

function apreenderVeiculoInadimplente(index){
    let f = jogo.financiamentosAtivos[index];
    if(!f) return;

    if(!jogo.carros) jogo.carros = [];
    jogo.carros.push(f.carroObjeto);

    jogo.financiamentosAtivos.splice(index, 1);
    
    if(typeof tocarSomGuincho === "function") tocarSomGuincho();
    else if(typeof tocarSomCompra === "function") tocarSomCompra();

    salvarJogo();

    mostrarAlerta(
        "🚨 VEÍCULO APREENDIDO!",
        `Você acionou o guincho e tomou de volta o ${f.carroModelo} de ${f.clienteNome} por inadimplência crônica!\n\nO veículo retornou para o seu pátio.`
    );
    abrirPainelFinanciamentos();
}

// ===========================================
// PROCESSAMENTO DIÁRIO DAS PARCELAS (COM ESCOLHA DE DIA)
// ===========================================
function processarParcelasDiarias(){
    if(!jogo.financiamentosAtivos || jogo.financiamentosAtivos.length === 0) return;

    let diaAtual = jogo.dia || 1;
    let diaDoMes = ((diaAtual - 1) % 30) + 1;

    let totalRecebidoHoje = 0;
    let relatorioPagamentos = [];
    let contratosFinalizados = [];

    jogo.financiamentosAtivos.forEach((contrato, index) => {
        if(contrato.diaVencimento === diaDoMes) {
            if(Math.random() < contrato.taxaRisco) {
                contrato.mesesAtraso = (contrato.mesesAtraso || 0) + 1;
            } else {
                totalRecebidoHoje += contrato.parcelaMensal;
                contrato.mesesRestantes--;
                if(contrato.mesesAtraso > 0) contrato.mesesAtraso--; 

                let parcelaAtualNum = (contrato.totalMeses - contrato.mesesRestantes);
                relatorioPagamentos.push(`💳 ${contrato.clienteNome} pagou a parcela ${String(parcelaAtualNum).padStart(2, '0')}/${String(contrato.totalMeses).padStart(2, '0')}: R$ ${contrato.parcelaMensal.toLocaleString("pt-BR")}`);
            }

            if(contrato.mesesRestantes <= 0) {
                contratosFinalizados.push(index);
            }
        }
    });

    contratosFinalizados.reverse().forEach(idx => {
        jogo.financiamentosAtivos.splice(idx, 1);
    });

    if(totalRecebidoHoje > 0) {
        jogo.dinheiro = (jogo.dinheiro || 0) + totalRecebidoHoje;
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
    }

    if(relatorioPagamentos.length > 0){
        mostrarAlerta(
            "💳 ENTRADA DE CREDIÁRIO",
            relatorioPagamentos.join("<br>") + `<br><br><strong>Total creditado hoje: R$ ${totalRecebidoHoje.toLocaleString("pt-BR")}</strong>`
        );
    }

    salvarJogo();
}

if (typeof window.proximoDia === 'function' && !window._proximoDiaFinanciamentoDiarioHooked) {
    let _originalProximoDia = window.proximoDia;
    window.proximoDia = function() {
        _originalProximoDia.apply(this, arguments);
        processarParcelasDiarias();
    };
    window._proximoDiaFinanciamentoDiarioHooked = true;
}

// ===========================================
// PAINEL DE MARKETING E IMPULSO DE VENDAS
// ===========================================
function abrirPainelMarketing(){
    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">📢</span>
            <div class="garagem-texto-titulo">
                <h1>CAMPANHAS DE MARKETING</h1>
                <p>Atraia compradores qualificados instantaneamente</p>
            </div>
        </div>
    </div>
    <div class="card">
        <h3>Escolha a Estratégia de Divulgação:</h3>
        <hr style="border-color: #333; margin: 10px 0;">

        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
            <button onclick="executarMarketing(350, 'panfletos')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #00e676;">📄 Panfletos na Região (Custo: R$ 350)</strong><br>
                <small style="color: #aaa;">Atrai clientes comuns e compradores focados em carros populares.</small>
            </button>

            <button onclick="executarMarketing(1500, 'redes')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ffb700;">🌐 Anúncio patrocinado online (Custo: R$ 1.500)</strong><br>
                <small style="color: #aaa;">Atrai colecionadores e entusiastas dispostos a pagar mais caro.</small>
            </button>

            <button onclick="executarMarketing(4500, 'feirao')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ff5252;">🎪 Feirão Relâmpago de Garagem (Custo: R$ 4.500)</strong><br>
                <small style="color: #aaa;">Gera fluxo massivo de compradores imediatos na hora!</small>
            </button>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button onclick="mostrarClientes()" class="btn-leilao-sair" style="padding: 8px 20px; cursor: pointer;">Voltar</button>
        </div>
    </div>
    `;
}

function executarMarketing(custo, tipo){
    if((jogo.dinheiro || 0) < custo) {
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("❌ Dinheiro Insuficiente", "Você não tem fundos suficientes para investir nesta campanha!");
        return;
    }

    jogo.dinheiro -= custo;
    if(typeof tocarSomCompra === "function") tocarSomCompra();

    if(tipo === 'panfletos') {
        jogo.reputacao = (jogo.reputacao || 0) + 1;
        mostrarAlerta("📢 Panfletos Impressos!", "Visibilidade local aumentada.");
    } else if(tipo === 'redes') {
        jogo.reputacao = (jogo.reputacao || 0) + 3;
        mostrarAlerta("🌐 Anúncio Ativo!", "Entusiastas de carros online viram seus veículos!");
    } else if(tipo === 'feirao') {
        jogo.reputacao = (jogo.reputacao || 0) + 5;
        gerarNovoCliente();
        return;
    }

    if (typeof atualizarPainel === 'function') atualizarPainel();
    salvarJogo();
    mostrarClientes();
}

// ===========================================
// MODAL DE CREDIÁRIO MENSAL (PLANOS)
// ===========================================
function abrirModalFinanciamento(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;
    let valorTotal = cliente.ofertaAtual;

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">💳</span>
            <div class="garagem-texto-titulo">
                <h1>PLANOS DE CREDIÁRIO MENSAL</h1>
                <p>Ofereça parcelamento mensal para ${cliente.nome}</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h3>Escolha o Plano Mensal:</h3>
        <p style="color: #aaa; font-size: 0.85rem; margin-top: 5px;">Valor total da negociação: <strong style="color: #00e676;">R$ ${valorTotal.toLocaleString("pt-BR")}</strong></p>
        <hr style="border-color: #333; margin: 12px 0;">

        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="abrirSeletorDiaVencimento(3, 0.10)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #00e676;">3 Meses (Juros totais de 10%)</strong><br>
                <small style="color: #aaa;">Entrada + 3 parcelas mensais. Risco baixo.</small>
            </button>

            <button onclick="abrirSeletorDiaVencimento(6, 0.22)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ffb700;">6 Meses (Juros totais de 22%)</strong><br>
                <small style="color: #aaa;">Entrada + 6 parcelas mensais. Risco moderado.</small>
            </button>

            <button onclick="abrirSeletorDiaVencimento(12, 0.45)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ff5252;">12 Meses (Juros totais de 45%)</strong><br>
                <small style="color: #aaa;">Entrada + 12 parcelas mensais. Alto retorno, risco alto de inadimplência.</small>
            </button>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button onclick="mostrarClienteAtual()" class="btn-leilao-sair" style="padding: 8px 20px; cursor: pointer;">Voltar à Mesa</button>
        </div>
    </div>
    `;
}

// ===========================================
// SELETOR DO MELHOR DIA DE VENCIMENTO
// ===========================================
function abrirSeletorDiaVencimento(meses, taxaJuros){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">📅</span>
            <div class="garagem-texto-titulo">
                <h1>ESCOLHER DIA DE VENCIMENTO</h1>
                <p>Combine com ${cliente.nome} a melhor data para o bolso dele</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h3>Qual o dia de vencimento ideal das parcelas?</h3>
        <p style="color: #aaa; font-size: 0.85rem; margin-top: 5px;">O cliente prefere pagar todo mês no dia:</p>
        <hr style="border-color: #333; margin: 12px 0;">

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button onclick="fecharVendaFinanciada(${meses}, ${taxaJuros}, 5)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📅 Todo dia <strong>05</strong>
            </button>
            <button onclick="fecharVendaFinanciada(${meses}, ${taxaJuros}, 10)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📅 Todo dia <strong>10</strong>
            </button>
            <button onclick="fecharVendaFinanciada(${meses}, ${taxaJuros}, 15)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📅 Todo dia <strong>15</strong>
            </button>
            <button onclick="fecharVendaFinanciada(${meses}, ${taxaJuros}, 20)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                📅 Todo dia <strong>20</strong>
            </button>
            <button onclick="fecharVendaFinanciada(${meses}, ${taxaJuros}, 28)" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 14px; border-radius: 6px; font-weight: bold; grid-column: span 2; cursor: pointer;">
                📅 Todo dia <strong>28</strong> (Fechamento do Mês)
            </button>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button onclick="abrirModalFinanciamento()" class="btn-leilao-sair" style="padding: 8px 20px; cursor: pointer;">Voltar aos Planos</button>
        </div>
    </div>
    `;
}

function fecharVendaFinanciada(meses, taxaJuros, diaVencimento){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;
    let carro = jogo.carros[cliente.carro];
    if(!carro) return;

    if(carro.reparos && Array.isArray(carro.reparos) && carro.reparos.length > 0){
        mostrarAlerta("🔧 Veículo em Reparo", "Você não pode parcelar um carro que está na oficina!");
        mostrarClienteAtual();
        return;
    }

    let valorTotal = cliente.ofertaAtual;
    let valorEntrada = Math.floor(valorTotal * 0.35);
    let valorRestante = valorTotal - valorEntrada;
    let totalComJuros = valorRestante * (1 + taxaJuros);
    let valorParcelaMensal = Math.floor(totalComJuros / meses);

    jogo.dinheiro = (jogo.dinheiro || 0) + valorEntrada;

    if(cliente.carroTroca) {
        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(cliente.carroTroca);
    }

    if(!jogo.financiamentosAtivos) jogo.financiamentosAtivos = [];
    
    let novoContrato = {
        id: Date.now(),
        clienteNome: cliente.nome,
        carroModelo: `${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}`,
        carroObjeto: carro,
        valorTotalComJuros: Math.floor(totalComJuros),
        parcelaMensal: valorParcelaMensal,
        mesesRestantes: meses,
        totalMeses: meses,
        diaVencimento: diaVencimento,
        mesesAtraso: 0,
        taxaRisco: meses > 6 ? 0.20 : 0.08
    };

    jogo.financiamentosAtivos.push(novoContrato);

    let precoCompraOriginal = carro.precoCompra || carro.compra || (carro.fipe * 0.5);
    let lucroVenda = (valorEntrada + (valorParcelaMensal * meses)) - precoCompraOriginal;

    if(!jogo.lucro) jogo.lucro = 0;
    jogo.lucro += lucroVenda;

    if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
    jogo.estatisticas.vendidos++;

    jogo.reputacao = (jogo.reputacao || 0) + 2;
    jogo.carros.splice(cliente.carro, 1);
    jogo.clienteAtual = null;

    if(typeof tocarSomVenda === "function") tocarSomVenda();
    if (typeof atualizarPainel === 'function') atualizarPainel();
    salvarJogo();

    mostrarAlerta(
        "💳 CREDIÁRIO MENSAL APROVADO!",
        `Venda efetuada com sucesso!\n\n💰 Entrada: R$ ${valorEntrada.toLocaleString("pt-BR")}\n📅 ${meses} Parcelas de R$ ${valorParcelaMensal.toLocaleString("pt-BR")} (Vencimento todo dia ${diaVencimento})${cliente.carroTroca ? `\n🚗 Veículo de troca adicionado ao pátio!` : ''}`
    );

    mostrarClientes();
}

function abrirModalNegociacaoAvancada(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">💬</span>
            <div class="garagem-texto-titulo">
                <h1>ESTRATÉGIA DE NEGOCIAÇÃO</h1>
                <p>Escolha como abordar ${cliente.nome}</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h3>Selecione sua Abordagem Comercial:</h3>
        <hr style="border-color: #333; margin: 10px 0;">
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
            <button onclick="executarTaticaNegociacao('suave')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #00e676;">🤝 Pechincha Amigável (Baixo Risco)</strong>
            </button>
            <button onclick="executarTaticaNegociacao('firme')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ffb700;">⚖️ Negociação Firme (Risco Moderado)</strong>
            </button>
            <button onclick="executarTaticaNegociacao('blefe')" style="background: #1e1e1e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; text-align: left; cursor: pointer;">
                <strong style="color: #ff5252;">🔥 Blefe / Jogo Duro (Alto Risco)</strong>
            </button>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button onclick="mostrarClienteAtual()" class="btn-leilao-sair" style="padding: 8px 20px; cursor: pointer;">Voltar à Mesa</button>
        </div>
    </div>
    `;
}

function executarTaticaNegociacao(tipo){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;
    let carro = jogo.carros[cliente.carro];
    let fipe = carro.fipe || 15000;

    cliente.fatorPechincha++;

    if(cliente.fatorPechincha > cliente.toleranciaMax + 2){
        cliente.historicoDialogo.unshift(`Chega! Você testou demais minha paciência. Estou indo embora!`);
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("🚪 Cliente Irritado", `${cliente.nome} foi embora.`);
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
        return;
    }

    let chanceSucesso = tipo === 'firme' ? 0.50 : tipo === 'blefe' ? 0.35 : 0.65;
    let minM = tipo === 'firme' ? 0.07 : tipo === 'blefe' ? 0.12 : 0.04;
    let maxM = tipo === 'firme' ? 0.14 : tipo === 'blefe' ? 0.22 : 0.08;

    chanceSucesso += (jogo.reputacao || 0) * 0.005;

    if(Math.random() < chanceSucesso){
        let aumento = Math.floor(cliente.ofertaAtual * aleatorio(minM * 100, maxM * 100) / 100);
        cliente.ofertaAtual += aumento;
        if(cliente.ofertaAtual > fipe * 1.12) cliente.ofertaAtual = Math.floor(fipe * 1.12);

        cliente.humor = "Interessado";
        cliente.historicoDialogo.unshift(`Argumento aceito! O comprador subiu a oferta para R$ ${cliente.ofertaAtual.toLocaleString("pt-BR")}.`);
        if(typeof tocarSomCompra === "function") tocarSomCompra();
        mostrarAlerta("💬 Negociação Bem-Sucedida!", `${cliente.nome} melhorou a proposta.`);
    } else {
        cliente.humor = "Irritado";
        cliente.ofertaAtual -= Math.floor(cliente.ofertaAtual * 0.04);
        cliente.historicoDialogo.unshift(`O comprador não gostou da abordagem e a oferta caiu um pouco.`);
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("⚠️ Negociação Tensa", `A oferta caiu um pouco.`);
    }

    salvarJogo();
    mostrarClienteAtual();
}

function tentarPressaoPsicologica(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    if (cliente.jaArgumentou) {
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("⚠️ Argumento Já Utilizado", "Você já apelou para os pontos fortes deste carro com este cliente. Tente negociar ou aceitar a oferta!");
        return;
    }

    let carro = jogo.carros[cliente.carro];

    if(carro.defeitos && Array.isArray(carro.defeitos) && carro.defeitos.length > 0){
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("⚠️ Impossível Argumentar", "O cliente apontou os defeitos mecânicos do carro na hora e não caiu na sua lábia!");
        cliente.humor = "Desconfiado";
        cliente.jaArgumentou = true;
        salvarJogo();
        mostrarClienteAtual();
        return;
    }

    cliente.jaArgumentou = true; // TRAVA O BOTÃO PARA NÃO FARMAS MAIS
    let aumento = Math.floor(carro.fipe * 0.05);
    cliente.ofertaAtual += aumento;
    cliente.humor = "Interessado";
    cliente.historicoDialogo.unshift(`Você destacou a excelente procedência. O cliente convenceu-se e adicionou R$ ${aumento.toLocaleString("pt-BR")} na oferta!`);
    
    if(typeof tocarSomCompra === "function") tocarSomCompra();
    mostrarAlerta("🧠 Tacada Certa!", `Cliente convenceu-se da qualidade e subiu o valor! (Argumento utilizado com sucesso)`);
    salvarJogo();
    mostrarClienteAtual();
}

function abrirSeletorTrocaCarro(){
    let cliente = jogo.clienteAtual;
    if (!jogo.carros || !Array.isArray(jogo.carros) || jogo.carros.length === 0) return;

    let listaHtml = jogo.carros.map((carro, index) => `
        <div onclick="trocarCarroClienteMesa(${index})" style="background: #1e1e1e; padding: 12px; margin-bottom: 8px; border-radius: 6px; border: 1px solid #333; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <div>
                <strong>${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'} (${carro.ano || 'N/D'})</strong><br>
                <small style="color: #888;">FIPE: R$ ${(carro.fipe || 15000).toLocaleString("pt-BR")}</small>
            </div>
            <span style="background: #2196F3; color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">Apresentar 🚗</span>
        </div>
    `).join('');

    conteudo.innerHTML = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">🔄</span>
            <div class="garagem-texto-titulo">
                <h1>APRESENTAR OUTRO VEÍCULO</h1>
                <p>Mostre outro carro do pátio</p>
            </div>
        </div>
    </div>
    <div class="card" style="max-height: 420px; overflow-y: auto;">
        ${listaHtml}
        <div style="margin-top: 15px; text-align: center;">
            <button onclick="mostrarClienteAtual()" class="btn-leilao-sair" style="padding: 8px 16px; cursor: pointer;">Voltar</button>
        </div>
    </div>
    `;
}

function trocarCarroClienteMesa(indiceCarro){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;
    let carro = jogo.carros[indiceCarro];
    if(!carro) return;

    cliente.carro = indiceCarro;
    cliente.ofertaAtual = calcularOfertaInicial(carro, cliente.bonusTipo);
    cliente.fatorPechincha = 0;
    cliente.jaArgumentou = false; // Reseta a trava ao trocar de carro para o mesmo cliente
    cliente.humor = "Neutro";
    cliente.historicoDialogo = [`Pediu para ver este ${carro.marca || ''} ${carro.modelo || 'Veículo'}.`];

    salvarJogo();
    mostrarClienteAtual();
}

function aceitarOferta(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    let carro = jogo.carros[cliente.carro];
    if(!carro){
        jogo.clienteAtual = null;
        mostrarClientes();
        return;
    }

    if(carro.reparos && Array.isArray(carro.reparos) && carro.reparos.length > 0){
        mostrarAlerta("🔧 Veículo em Reparo", "Você não pode entregar um carro que ainda está na oficina!");
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
        return;
    }

    let valorVenda = cliente.ofertaAtual;
    jogo.dinheiro = (jogo.dinheiro || 0) + valorVenda;

    if(cliente.carroTroca) {
        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(cliente.carroTroca);
    }

    let precoCompraOriginal = carro.precoCompra || carro.compra || (carro.fipe * 0.5);
    let lucroVenda = valorVenda - precoCompraOriginal;

    if(!jogo.lucro) jogo.lucro = 0;
    jogo.lucro += lucroVenda;

    if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
    jogo.estatisticas.vendidos++;

    jogo.reputacao = (jogo.reputacao || 0) + 2;
    jogo.carros.splice(cliente.carro, 1);
    jogo.clienteAtual = null;

    if(typeof tocarSomVenda === "function") tocarSomVenda();
    if (typeof atualizarPainel === 'function') atualizarPainel();
    salvarJogo();

    mostrarAlerta(
        "🎉 VENDA FECHADA À VISTA!",
        `Comprador: ${cliente.nome}\n\n💰 Valor Recebido: R$ ${valorVenda.toLocaleString("pt-BR")}\n📈 Lucro Líquido: R$ ${lucroVenda.toLocaleString("pt-BR")}${cliente.carroTroca ? `\n🚗 Veículo aceito na troca adicionado ao pátio!` : ''}`
    );

    mostrarClientes();
}

function recusarOferta(){
    let cliente = jogo.clienteAtual;
    if(cliente) {
        if(typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta("❌ Negócio Recusado", `${cliente.nome} foi embora.`);
    }
    jogo.clienteAtual = null;
    salvarJogo();
    gerarNovoCliente();
}

function limparClienteDia(){
    jogo.clienteAtual = null;
    salvarJogo();
}

function atualizarClientesNovoDia(){
    limparClienteDia();
}

if(typeof jogo !== 'undefined' && jogo.clienteAtual === undefined){
    jogo.clienteAtual = null;
}