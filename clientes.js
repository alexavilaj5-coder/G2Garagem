// ===========================================
// CLIENTES.JS V15.3 - LAYOUT MODERNO & REESTRUTURADO 🚗💳📅
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
    { nome: "Colecionador", bonus: 6, tolerancia: 1, descricao: "Apaixonado por raridades. Paga bem se o carro estiver impecável." },
    { nome: "Cliente Exigente", bonus: -3, tolerancia: 1, descricao: "Nota cada detalhe e defeito. Chato na negociação, mas tem bom orçamento." },
    { nome: "Comprador Desesperado", bonus: 10, tolerancia: 4, descricao: "Precisa de um carro para ontem. Aceita pagar ágio sem pensar duas vezes." }
];

function mostrarClientes(){
    if (typeof jogo === 'undefined') window.jogo = {};
    if (!jogo.financiamentosAtivos) jogo.financiamentosAtivos = [];
    if (!jogo.carros || !Array.isArray(jogo.carros)) {
        let salvo = localStorage.getItem("g2_garagem_jogo") || localStorage.getItem("jogo");
        if (salvo) {
            try {
                let dados = JSON.parse(salvo);
                if (dados && dados.carros) jogo.carros = dados.carros;
                if (dados && dados.financiamentosAtivos) jogo.financiamentosAtivos = dados.financiamentosAtivos;
            } catch(e) {}
        }
    }

    let qtdFinanciamentos = jogo.financiamentosAtivos.length;

    if(!jogo.carros || !Array.isArray(jogo.carros) || jogo.carros.length === 0){
        conteudo.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px; max-width: 900px; margin: 0 auto; font-family: inherit;">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #18181b; border: 1px solid #27272a; padding: 16px 20px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <span style="font-size: 2.2rem; background: rgba(156,39,176,0.15); padding: 10px; border-radius: 10px;">👥</span>
                    <div>
                        <h1 style="margin: 0; font-size: 1.3rem; color: #f4f4f5; font-weight: 700; letter-spacing: 0.5px;">SALÃO DE VENDAS</h1>
                        <p style="margin: 3px 0 0 0; font-size: 0.85rem; color: #a1a1aa;">Gerenciamento de Pátio e Crediário Mensal</p>
                    </div>
                </div>
                <button onclick="abrirPainelFinanciamentos()" style="background: #9333ea; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                    💳 Crediário <span style="background: rgba(0,0,0,0.25); padding: 2px 7px; border-radius: 12px; font-size: 0.75rem;">${qtdFinanciamentos}</span>
                </button>
            </div>
            
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; text-align: center; padding: 50px 30px;">
                <span style="font-size: 3.5rem; display: block; margin-bottom: 15px; opacity: 0.8;">🏢</span>
                <h2 style="color: #f4f4f5; margin: 0 0 8px 0; font-size: 1.4rem;">Salão de Vendas Vazio</h2>
                <p style="color: #a1a1aa; font-size: 0.95rem; margin: 0 auto; max-width: 420px; line-height: 1.5;">Você não possui nenhum veículo no pátio para atrair compradores no momento.</p>
            </div>
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

    let randCred = Math.random();
    let querParcelar = randCred >= 0.05 && randCred <= 0.20;
    let parcelasQtd = querParcelar ? 3 : 1;

    let randTroca = Math.random();
    let temTroca = randTroca >= 0.05 && randTroca <= 0.15;
    let carroTroca = temTroca ? gerarCarroAleatorioParaTroca() : null;

    let valorParcelaCalc = querParcelar ? Math.round(ofertaInicial / parcelasQtd) : 0;

    let falaInicial = carroTroca 
        ? `Olá, vi este ${carro.marca || ''} ${carro.modelo || 'Veículo'} e quero negociar. Posso dar meu ${carroTroca.modelo} na troca mais uma volta em dinheiro!`
        : querParcelar
            ? `Olá! Gostei muito do ${carro.marca || ''} ${carro.modelo || 'Veículo'}, mas não tenho todo o valor à vista. Posso parcelar com você em ${parcelasQtd}x de R$ ${valorParcelaCalc.toLocaleString("pt-BR")}?`
            : `Olá, vim dar uma olhada neste ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}. Quanto faz nele?`;

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
        jaArgumentou: false,
        humor: "Neutro",
        querParcelar: querParcelar,
        parcelas: parcelasQtd,
        valorParcela: valorParcelaCalc,
        carroTroca: carroTroca,
        historicoDialogo: [falaInicial]
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
        <div style="display: flex; flex-direction: column; gap: 20px; max-width: 900px; margin: 0 auto; font-family: inherit;">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #18181b; border: 1px solid #27272a; padding: 16px 20px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <span style="font-size: 2.2rem; background: rgba(156,39,176,0.15); padding: 10px; border-radius: 10px;">👥</span>
                    <div>
                        <h1 style="margin: 0; font-size: 1.3rem; color: #f4f4f5; font-weight: 700; letter-spacing: 0.5px;">SALÃO DE VENDAS</h1>
                        <p style="margin: 3px 0 0 0; font-size: 0.85rem; color: #a1a1aa;">Movimento no Pátio</p>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="abrirPainelFinanciamentos()" style="background: #9333ea; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                        💳 Crediário (${qtdFinanciamentos})
                    </button>
                    <button onclick="abrirPainelMarketing()" style="background: #eab308; color: #000; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                        📢 Marketing
                    </button>
                </div>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; text-align: center; padding: 45px 30px;">
                <span style="font-size: 3.5rem; display: block; margin-bottom: 15px; opacity: 0.8;">😴</span>
                <h2 style="color: #f4f4f5; margin: 0 0 8px 0; font-size: 1.4rem;">Movimento Fraco no Pátio</h2>
                <p style="color: #a1a1aa; font-size: 0.95rem; margin: 0 auto 25px auto; max-width: 440px; line-height: 1.5;">Nenhum comprador se interessou pelos veículos hoje. Use campanhas de marketing para impulsionar as vendas!</p>
                <div style="display: flex; justify-content: center; gap: 12px;">
                    <button onclick="proximoDia()" style="background: #27272a; color: #f4f4f5; border: 1px solid #3f3f46; padding: 11px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        ⏭️ Avançar o Dia
                    </button>
                    <button onclick="abrirPainelMarketing()" style="background: #eab308; color: #000; border: none; padding: 11px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        📢 Impulsionar Vendas
                    </button>
                </div>
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
    let corHumor = "#22c55e";
    if(cliente.humor === "Desconfiado") corHumor = "#eab308";
    if(cliente.humor === "Irritado") corHumor = "#ef4444";

    let temDefeitos = carro.defeitos && Array.isArray(carro.defeitos) && carro.defeitos.length > 0;

    let botoesAcaoHtml = "";
    if (cliente.querParcelar) {
        botoesAcaoHtml = `
            <button onclick="aceitarPropostaCrediario()" style="background: #eab308; color: #000; border: none; padding: 13px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: opacity 0.2s;">
                💳 Aceitar Parcelamento (${cliente.parcelas}x R$ ${cliente.valorParcela.toLocaleString("pt-BR")})
            </button>
            <button onclick="exigirPagamentoAVista()" style="background: #22c55e; color: #000; border: none; padding: 13px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: opacity 0.2s;">
                💵 Exigir À Vista (R$ ${(cliente.ofertaAtual || 0).toLocaleString("pt-BR")})
            </button>
        `;
    } else {
        botoesAcaoHtml = `
            <button onclick="aceitarOferta()" style="background: #22c55e; color: #000; border: none; padding: 13px; border-radius: 8px; font-weight: 600; grid-column: span 2; cursor: pointer; font-size: 0.95rem;">
                💵 Vender à Vista (R$ ${(cliente.ofertaAtual || 0).toLocaleString("pt-BR")})
            </button>
        `;
    }

    let html = `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 960px; margin: 0 auto; font-family: inherit;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #18181b; border: 1px solid #27272a; padding: 16px 20px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 2.2rem; background: rgba(34,197,94,0.15); padding: 10px; border-radius: 10px;">🤝</span>
                <div>
                    <h1 style="margin: 0; font-size: 1.3rem; color: #f4f4f5; font-weight: 700; letter-spacing: 0.5px;">MESA DE NEGOCIAÇÃO</h1>
                    <p style="margin: 3px 0 0 0; font-size: 0.85rem; color: #a1a1aa;">Negociando com <strong style="color: #f4f4f5;">${cliente.nome}</strong> (${cliente.tipo})</p>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="abrirPainelFinanciamentos()" style="background: #9333ea; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    💳 Crediário (${qtdFinanciamentos})
                </button>
                <button onclick="abrirPainelMarketing()" style="background: #eab308; color: #000; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    📢 Marketing
                </button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 16px; align-items: start;">
            <!-- CARD DO VEÍCULO -->
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
                <div>
                    <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #71717a; font-weight: 700;">Veículo em Foco</span>
                    <h3 style="margin: 4px 0 0 0; font-size: 1.15rem; color: #f4f4f5; font-weight: 600;">${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'} <span style="color: #a1a1aa; font-weight: 400;">(${carro.ano || 'N/D'})</span></h3>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #09090b; padding: 12px; border-radius: 8px; border: 1px solid #27272a;">
                    <div>
                        <span style="font-size: 0.75rem; color: #71717a; display: block;">Quilometragem</span>
                        <strong style="color: #f4f4f5; font-size: 0.9rem;">🛣️ ${carro.km ? carro.km.toLocaleString("pt-BR") + " km" : "0 km"}</strong>
                    </div>
                    <div>
                        <span style="font-size: 0.75rem; color: #71717a; display: block;">Cor</span>
                        <strong style="color: #f4f4f5; font-size: 0.9rem;">🎨 ${carro.cor || "Original"}</strong>
                    </div>
                </div>

                <div style="background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.2); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.85rem; color: #a1a1aa;">Valor Tabela FIPE:</span>
                    <strong style="color: #22c55e; font-size: 1.05rem;">R$ ${(carro.fipe || 15000).toLocaleString("pt-BR")}</strong>
                </div>
                
                ${temDefeitos ? `
                    <div style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); padding: 12px; border-radius: 8px;">
                        <span style="font-size: 0.8rem; color: #ef4444; font-weight: 700; display: block; margin-bottom: 4px;">⚠️ Defeitos Relatados:</span>
                        <ul style="margin: 0 0 0 16px; padding: 0; font-size: 0.82rem; color: #fca5a5;">
                            ${carro.defeitos.map(d => `<li style="margin-bottom: 2px;">${d.nome || d}</li>`).join('')}
                        </ul>
                    </div>
                ` : `
                    <div style="background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); padding: 12px; border-radius: 8px; font-size: 0.82rem; color: #22c55e; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                        ✅ Veículo íntegro e pronto para venda!
                    </div>
                `}

                ${cliente.carroTroca ? `
                    <div style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.25); padding: 12px; border-radius: 8px;">
                        <span style="font-size: 0.8rem; color: #3b82f6; font-weight: 700; display: block; margin-bottom: 4px;">🔄 Proposta de Troca (Trade-in):</span>
                        <p style="font-size: 0.85rem; color: #f4f4f5; margin: 0; line-height: 1.4;">Dá o ${cliente.carroTroca.marca} ${cliente.carroTroca.modelo} (${cliente.carroTroca.ano}) avaliado em <strong style="color: #3b82f6;">R$ ${cliente.carroTroca.fipe.toLocaleString("pt-BR")}</strong> na troca!</p>
                    </div>
                ` : ''}
            </div>

            <!-- CARD DA MESA DE NEGOCIAÇÃO E DIÁLOGO -->
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; color: #a1a1aa; text-transform: uppercase; font-weight: 600;">Perfil: ${cliente.descricaoTipo}</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: ${corHumor}; background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 6px; border: 1px solid #27272a;">Humor: ${cliente.humor}</span>
                    </div>

                    <div style="background: #09090b; border: 1px solid #27272a; padding: 12px; border-radius: 8px; min-height: 100px; max-height: 130px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
                        ${Array.isArray(cliente.historicoDialogo) ? cliente.historicoDialogo.map(msg => `<p style="font-size: 0.87rem; color: #d4d4d8; margin: 0; line-height: 1.4;">💬 ${msg}</p>`).join('') : ''}
                    </div>

                    <div style="text-align: center; background: #09090b; padding: 14px; border-radius: 8px; border: 1px solid #27272a;">
                        <span style="font-size: 0.72rem; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Oferta Atual da Mesa</span>
                        <h2 style="color: #22c55e; font-size: 1.8rem; margin: 0; font-weight: 700;">R$ ${(cliente.ofertaAtual || 0).toLocaleString("pt-BR")}</h2>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${botoesAcaoHtml}
                    <button onclick="recusarOferta()" style="background: #27272a; color: #ef4444; border: 1px solid #3f3f46; padding: 11px; border-radius: 8px; font-weight: 600; grid-column: span 2; cursor: pointer; font-size: 0.82rem; transition: background 0.2s;">
                        ❌ Mandar o Cliente Embora / Recusar
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
}

// ===========================================
// VENDAS À VISTA E CREDIÁRIO
// ===========================================

function aceitarOferta(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    let valorFinal = cliente.ofertaAtual || 0;
    
    jogo.dinheiro = (jogo.dinheiro || 0) + valorFinal;
    
    if(cliente.carroTroca) {
        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(cliente.carroTroca);
    }

    jogo.carros.splice(cliente.carro, 1);
    jogo.clienteAtual = null;

    if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
    
    mostrarAlerta("🎉 VENDA CONCLUÍDA!", `Você vendeu o veículo à vista por R$ ${valorFinal.toLocaleString("pt-BR")}! O dinheiro já entrou na sua conta.`);
    
    if(typeof atualizarPainel === "function") atualizarPainel();
    salvarJogo();
    mostrarClientes();
}

function aceitarPropostaCrediario(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    if(!jogo.financiamentosAtivos) jogo.financiamentosAtivos = [];
    let carroVendido = jogo.carros[cliente.carro];

    let novoContrato = {
        clienteNome: cliente.nome,
        carroModelo: `${carroVendido.marca || ''} ${carroVendido.modelo || 'Veículo'}`,
        carroObjeto: carroVendido,
        parcelaMensal: cliente.valorParcela,
        totalMeses: cliente.parcelas,
        mesesRestantes: cliente.parcelas,
        mesesAtraso: 0,
        diaVencimento: ((jogo.dia || 1) % 30) + 1,
        dataVenda: `Dia ${jogo.dia || 1}`
    };

    jogo.financiamentosAtivos.push(novoContrato);

    if(cliente.carroTroca) {
        if(!jogo.carros) jogo.carros = [];
        jogo.carros.push(cliente.carroTroca);
    }

    jogo.carros.splice(cliente.carro, 1);
    jogo.clienteAtual = null;

    if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();

    mostrarAlerta("💳 CREDIÁRIO FECHADO!", `Negócio fechado com ${cliente.nome} em ${cliente.parcelas}x de R$ ${cliente.valorParcela.toLocaleString("pt-BR")}!`);

    if(typeof atualizarPainel === "function") atualizarPainel();
    salvarJogo();
    mostrarClientes();
}

function exigirPagamentoAVista(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    if(Math.random() > 0.5){
        cliente.querParcelar = false;
        mostrarAlerta("💵 Negociação Alterada", `${cliente.nome} aceitou pagar à vista!`);
        mostrarClienteAtual();
    } else {
        mostrarAlerta("❌ Recusou", `${cliente.nome} disse que não tem o valor integral à vista e foi embora.`);
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
    }
}

function recusarOferta(){
    jogo.clienteAtual = null;
    salvarJogo();
    mostrarClientes();
}

// ===========================================
// PAINEL DE CREDIÁRIO & SISTEMA DE COBRANÇA
// ===========================================
function abrirPainelFinanciamentos(){
    let financiamentos = jogo.financiamentosAtivos || [];

    let listaHtml = "";
    if(financiamentos.length === 0) {
        listaHtml = `<p style="color: #a1a1aa; text-align: center; padding: 35px; font-size: 0.95rem; margin: 0;">Nenhum contrato de crediário mensal ativo no momento.</p>`;
    } else {
        listaHtml = financiamentos.map((f, idx) => {
            let parcelasPagas = f.totalMeses - f.mesesRestantes;
            let formatoParcela = `${String(parcelasPagas).padStart(2, '0')}/${String(f.totalMeses).padStart(2, '0')}`;
            let atraso = f.mesesAtraso || 0;

            let podeCobrar = atraso >= 2;
            let statusBadge = "";
            let corBorda = "#27272a";
            
            if (atraso === 0) {
                statusBadge = `<span style="color: #22c55e; font-weight: 600; font-size: 0.8rem; background: rgba(34,197,94,0.1); padding: 2px 8px; border-radius: 4px;">Em Dia</span>`;
            } else if (atraso === 1) {
                statusBadge = `<span style="color: #eab308; font-weight: 600; font-size: 0.8rem; background: rgba(234,179,8,0.1); padding: 2px 8px; border-radius: 4px;">1 Mês Atrasado</span>`;
                corBorda = "#eab308";
            } else {
                statusBadge = `<span style="color: #ef4444; font-weight: 600; font-size: 0.8rem; background: rgba(239,68,68,0.1); padding: 2px 8px; border-radius: 4px;">${atraso} Meses Atrasados</span>`;
                corBorda = "#ef4444";
            }

            return `
            <div style="background: #09090b; border: 1px solid ${corBorda}; padding: 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #f4f4f5; font-size: 0.95rem;">👤 ${f.clienteNome}</strong>
                        ${statusBadge}
                    </div>
                    <span style="color: #a1a1aa; font-size: 0.83rem;">Carro: <strong style="color: #d4d4d8;">${f.carroModelo}</strong> | Vencimento: Dia <strong>${f.diaVencimento}</strong></span>
                    <span style="color: #d4d4d8; font-size: 0.83rem;">
                        Parcelas Pagas: <strong>${formatoParcela}</strong> | Valor Parcela: <strong style="color: #22c55e;">R$ ${(f.parcelaMensal || 0).toLocaleString("pt-BR")}</strong>
                    </span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
                    ${podeCobrar ? `
                        <button onclick="abrirCentralCobranca(${idx})" style="background: #f97316; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">
                            📞 Cobrar
                        </button>
                        <button onclick="apreenderVeiculoInadimplente(${idx})" style="background: #ef4444; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">
                            🚨 Guincho
                        </button>
                    ` : `
                        <button disabled style="background: #27272a; color: #71717a; border: 1px solid #3f3f46; padding: 8px 12px; border-radius: 6px; cursor: not-allowed; font-size: 0.78rem; font-weight: 600;" title="Opção liberada somente após 2 meses de atraso">
                            🔒 Cobrar (Mín. 2 Atrasos)
                        </button>
                    `}
                </div>
            </div>
        `;
        }).join('');
    }

    conteudo.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto; font-family: inherit;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #18181b; border: 1px solid #27272a; padding: 16px 20px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 2.2rem; background: rgba(147,51,234,0.15); padding: 10px; border-radius: 10px;">💳</span>
                <div>
                    <h1 style="margin: 0; font-size: 1.3rem; color: #f4f4f5; font-weight: 700; letter-spacing: 0.5px;">CREDIÁRIO MENSAL</h1>
                    <p style="margin: 3px 0 0 0; font-size: 0.85rem; color: #a1a1aa;">Acompanhe pagamentos e gerencie contratos ativos</p>
                </div>
            </div>
        </div>
        
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <h3 style="margin: 0; font-size: 1.05rem; color: #f4f4f5; font-weight: 600;">Contratos de Parcelamento Ativos</h3>
            
            <div style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px;">
                ${listaHtml}
            </div>
            
            <div style="margin-top: 5px; text-align: center; border-top: 1px solid #27272a; padding-top: 15px;">
                <button onclick="mostrarClientes()" style="background: #27272a; color: #f4f4f5; border: 1px solid #3f3f46; padding: 9px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">← Voltar ao Salão de Vendas</button>
            </div>
        </div>
    </div>
    `;
}

// ===========================================
// CENTRAL DE COBRANÇA
// ===========================================
function abrirCentralCobranca(index){
    let f = jogo.financiamentosAtivos[index];
    if(!f) return;

    if(typeof tocarSomTelefone === "function") tocarSomTelefone();

    conteudo.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 650px; margin: 0 auto; font-family: inherit;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #18181b; border: 1px solid #27272a; padding: 16px 20px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 2.2rem; background: rgba(249,115,22,0.15); padding: 10px; border-radius: 10px;">📞</span>
                <div>
                    <h1 style="margin: 0; font-size: 1.25rem; color: #f4f4f5; font-weight: 700; letter-spacing: 0.5px;">CENTRAL DE COBRANÇA</h1>
                    <p style="margin: 3px 0 0 0; font-size: 0.85rem; color: #a1a1aa;">Em ligação com <strong style="color: #f4f4f5;">${f.clienteNome}</strong> (${f.carroModelo})</p>
                </div>
            </div>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); padding: 14px; border-radius: 8px;">
                <h3 style="color: #ef4444; margin: 0 0 6px 0; font-size: 1rem; font-weight: 700;">⚠️ Parcela Atrasada em ${f.mesesAtraso} Meses!</h3>
                <p style="color: #d4d4d8; font-size: 0.87rem; margin: 0; line-height: 1.4;">
                    Valor por Parcela: <strong style="color: #22c55e;">R$ ${(f.parcelaMensal || 0).toLocaleString("pt-BR")}</strong> | Restam: <strong>${f.mesesRestantes} parcelas</strong>
                </p>
            </div>

            <h4 style="color: #f4f4f5; margin: 0; font-size: 0.95rem; font-weight: 600;">Escolha a abordagem para a cobrança:</h4>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="executarAcaoCobranca(${index}, 'cobrar')" style="background: #09090b; border: 1px solid #27272a; color: #fff; padding: 14px; border-radius: 8px; text-align: left; cursor: pointer; transition: border-color 0.2s;">
                    <strong style="color: #22c55e; font-size: 0.95rem; display: block; margin-bottom: 2px;">💵 Exigir Pagamento Imediato</strong>
                    <span style="color: #a1a1aa; font-size: 0.83rem; display: block;">Pressiona o cliente a quitar ao menos 1 parcela pendente na hora.</span>
                </button>

                <button onclick="executarAcaoCobranca(${index}, 'renegociar')" style="background: #09090b; border: 1px solid #27272a; color: #fff; padding: 14px; border-radius: 8px; text-align: left; cursor: pointer; transition: border-color 0.2s;">
                    <strong style="color: #eab308; font-size: 0.95rem; display: block; margin-bottom: 2px;">🔄 Prolongar Contrato (+2 Meses)</strong>
                    <span style="color: #a1a1aa; font-size: 0.83rem; display: block;">Reduz o valor da parcela mensal recalculando o saldo e limpa o nome do cliente.</span>
                </button>
            </div>

            <div style="margin-top: 5px; text-align: center; border-top: 1px solid #27272a; padding-top: 15px;">
                <button onclick="abrirPainelFinanciamentos()" style="background: #27272a; color: #f4f4f5; border: 1px solid #3f3f46; padding: 9px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">📞 Desligar / Voltar</button>
            </div>
        </div>
    </div>
    `;
}

function executarAcaoCobranca(index, acao){
    let f = jogo.financiamentosAtivos[index];
    if(!f) return;

    if(acao === 'cobrar'){
        if(Math.random() < 0.65){
            f.mesesAtraso = Math.max(0, f.mesesAtraso - 1);
            f.mesesRestantes--;
            jogo.dinheiro = (jogo.dinheiro || 0) + f.parcelaMensal;
            if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
            mostrarAlerta("💰 PAGAMENTO RECEBIDO!", `${f.clienteNome} se desculpou e realizou o pagamento de 1 parcela atrasada (R$ ${f.parcelaMensal.toLocaleString("pt-BR")}).`);
        } else {
            mostrarAlerta("❌ Não Pagou", `${f.clienteNome} inventou uma desculpa e disse que não tem dinheiro essa semana.`);
        }
    } else if(acao === 'renegociar'){
        let saldoDevedorRestante = f.mesesRestantes * f.parcelaMensal;
        f.mesesRestantes += 2;
        f.totalMeses += 2;
        
        f.parcelaMensal = Math.max(150, Math.floor(saldoDevedorRestante / f.mesesRestantes));
        f.mesesAtraso = 0;
        
        mostrarAlerta("🤝 Contrato Renegociado", `Prazo estendido em 2 meses!\nSaldo de R$ ${saldoDevedorRestante.toLocaleString("pt-BR")} recalculado em ${f.mesesRestantes}x de R$ ${f.parcelaMensal.toLocaleString("pt-BR")}.`);
    }

    salvarJogo();
    if(typeof atualizarPainel === "function") atualizarPainel();
    abrirPainelFinanciamentos();
}

function apreenderVeiculoInadimplente(index){
    let f = jogo.financiamentosAtivos[index];
    if(!f) return;

    if(!jogo.carros) jogo.carros = [];
    if(f.carroObjeto) {
        jogo.carros.push(f.carroObjeto);
    }

    jogo.financiamentosAtivos.splice(index, 1);
    
    if(typeof tocarSomGuincho === "function") tocarSomGuincho();

    salvarJogo();
    if(typeof atualizarPainel === "function") atualizarPainel();

    mostrarAlerta(
        "🚨 VEÍCULO APREENDIDO!",
        `O guincho buscou o veículo de ${f.clienteNome} devido às parcelas atrasadas.\n\nO carro voltou para o pátio da sua garagem.`
    );
    abrirPainelFinanciamentos();
}

// ===========================================
// MOTOR DO PROCESSAMENTO DIÁRIO DAS PARCELAS
// ===========================================
function processarParcelasDiarias(){
    if(!jogo.financiamentosAtivos || jogo.financiamentosAtivos.length === 0) return;

    let diaAtual = jogo.dia || 1;
    let diaDoMes = ((diaAtual - 1) % 30) + 1;

    let totalRecebidoHoje = 0;
    let mensagensPagamento = [];
    let indicesParaRemover = [];

    jogo.financiamentosAtivos.forEach((f, idx) => {
        if(f.diaVencimento === diaDoMes){
            let vaiAtrasar = Math.random() < 0.20;

            if(vaiAtrasar){
                f.mesesAtraso = (f.mesesAtraso || 0) + 1;
            } else {
                totalRecebidoHoje += f.parcelaMensal;
                f.mesesRestantes--;
                
                let numParcelaPaga = f.totalMeses - f.mesesRestantes;
                mensagensPagamento.push(`💳 <strong>${f.clienteNome}</strong> pagou a parcela ${numParcelaPaga}/${f.totalMeses} (R$ ${f.parcelaMensal.toLocaleString("pt-BR")}) do ${f.carroModelo}`);

                if (f.mesesAtraso > 0) f.mesesAtraso--;

                if(f.mesesRestantes <= 0){
                    indicesParaRemover.push(idx);
                    mensagensPagamento.push(`🎉 <strong>CONTRATO QUITADO:</strong> ${f.clienteNome} terminou de pagar o ${f.carroModelo}!`);
                }
            }
        }
    });

    indicesParaRemover.reverse().forEach(i => {
        jogo.financiamentosAtivos.splice(i, 1);
    });

    if(totalRecebidoHoje > 0){
        jogo.dinheiro = (jogo.dinheiro || 0) + totalRecebidoHoje;
        if(typeof tocarSomDinheiro === "function") tocarSomDinheiro();
        
        mostrarAlerta(
            "💵 PARCELAS RECEBIDAS HOJE!",
            mensagensPagamento.join("<br>") + `<br><br><strong style="color: #22c55e;">Total Depositado na Conta: R$ ${totalRecebidoHoje.toLocaleString("pt-BR")}</strong>`
        );
    }

    if(typeof atualizarPainel === "function") atualizarPainel();
    salvarJogo();

    let divPainel = document.querySelector(".garagem-texto-titulo h1");
    if (divPainel && divPainel.innerText.includes("CREDIÁRIO MENSAL")) {
        abrirPainelFinanciamentos();
    }
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
// PAINEL DE MARKETING
// ===========================================
function abrirPainelMarketing(){
    conteudo.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 650px; margin: 0 auto; font-family: inherit;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #18181b; border: 1px solid #27272a; padding: 16px 20px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 2.2rem; background: rgba(234,179,8,0.15); padding: 10px; border-radius: 10px;">📢</span>
                <div>
                    <h1 style="margin: 0; font-size: 1.25rem; color: #f4f4f5; font-weight: 700; letter-spacing: 0.5px;">CAMPANHAS DE MARKETING</h1>
                    <p style="margin: 3px 0 0 0; font-size: 0.85rem; color: #a1a1aa;">Atraia compradores qualificados instantaneamente</p>
                </div>
            </div>
        </div>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <h3 style="margin: 0; font-size: 1.05rem; color: #f4f4f5; font-weight: 600;">Escolha a Estratégia de Divulgação:</h3>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="executarMarketing(350, 'panfletos')" style="background: #09090b; border: 1px solid #27272a; color: #fff; padding: 14px; border-radius: 8px; text-align: left; cursor: pointer; transition: border-color 0.2s;">
                    <strong style="color: #22c55e; font-size: 0.95rem; display: block; margin-bottom: 2px;">📄 Panfletos na Região (Custo: R$ 350)</strong>
                    <span style="color: #a1a1aa; font-size: 0.83rem; display: block;">Atrai clientes comuns e compradores focados em carros populares.</span>
                </button>

                <button onclick="executarMarketing(1500, 'redes')" style="background: #09090b; border: 1px solid #27272a; color: #fff; padding: 14px; border-radius: 8px; text-align: left; cursor: pointer; transition: border-color 0.2s;">
                    <strong style="color: #eab308; font-size: 0.95rem; display: block; margin-bottom: 2px;">🌐 Anúncio patrocinado online (Custo: R$ 1.500)</strong>
                    <span style="color: #a1a1aa; font-size: 0.83rem; display: block;">Atrai colecionadores e entusiastas dispostos a pagar mais caro.</span>
                </button>

                <button onclick="executarMarketing(4500, 'feirao')" style="background: #09090b; border: 1px solid #27272a; color: #fff; padding: 14px; border-radius: 8px; text-align: left; cursor: pointer; transition: border-color 0.2s;">
                    <strong style="color: #ef4444; font-size: 0.95rem; display: block; margin-bottom: 2px;">🎪 Feirão Relâmpago de Garagem (Custo: R$ 4.500)</strong>
                    <span style="color: #a1a1aa; font-size: 0.83rem; display: block;">Gera fluxo massivo de compradores imediatos na hora!</span>
                </button>
            </div>

            <div style="margin-top: 5px; text-align: center; border-top: 1px solid #27272a; padding-top: 15px;">
                <button onclick="mostrarClientes()" style="background: #27272a; color: #f4f4f5; border: 1px solid #3f3f46; padding: 9px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">← Voltar</button>
            </div>
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
