// ===========================================
// PATIO.JS V2.1 - GERENCIAMENTO DE FROTA
// G2 GARAGEM
// ===========================================

function mostrarPatio() {
    let porcentagemVagas = (jogo.carros.length / jogo.empresa.vagas) * 100;

    let html = `
    <div class="garagem-header">
        <div class="garagem-titulo">
            <span class="garagem-icone">🏢</span>
            <div class="garagem-texto-titulo">
                <h1>MEU PÁTIO</h1>
                <p>Gerenciamento e Regularização de Frota</p>
            </div>
        </div>
        <div class="vagas-container">
            <div class="vagas-info">
                <span>Vagas Ocupadas</span>
                <strong>${jogo.carros.length} / ${jogo.empresa.vagas}</strong>
            </div>
            <div class="vagas-barra-fundo">
                <div class="vagas-barra-progresso" style="width: ${porcentagemVagas}%"></div>
            </div>
        </div>
    </div>
    `;

    if (jogo.carros.length === 0) {
        html += `
        <div class="card-vazio">
            <div class="vazio-icone">🅿️</div>
            <h3>Pátio Vazio</h3>
            <p>Nenhum veículo em estoque. Visite o mercado para adquirir unidades.</p>
        </div>
        `;
    } else {
        html += `<div class="patio-grid">`;

        jogo.carros.forEach(function (carro, index) {
            let imagemPadrao = 'imagens/semimagem.jpg';
            let imagemUrl = carro.foto ? `imagens/${carro.foto}` : imagemPadrao;

            let kmSeguro = (carro.km || 0).toLocaleString("pt-BR");
            let compraFormatada = (carro.precoCompra || carro.compra || 0).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            let fipeFormatada = (carro.fipe || 0).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            let docPendente = carro.documentosPendentes || 0;
            let qtdDefeitos = carro.defeitos ? carro.defeitos.length : 0;

            // Borda condicional de alerta
            let classeBorda = 'estado-perfeito';
            if (qtdDefeitos > 0 || docPendente > 0) classeBorda = 'estado-atencao';
            if (qtdDefeitos >= 3) classeBorda = 'estado-critico';

            html += `
            <div class="card carro-card ${classeBorda}">
                
                <div class="carro-imagem-container" style="position: relative;">
                    <img src="${imagemUrl}" onerror="this.src='${imagemPadrao}'" alt="${carro.marca} ${carro.modelo}">
                    
                    <!-- Badge de Defeitos -->
                    <div class="overlay-defeitos ${qtdDefeitos > 0 ? 'tem-defeito' : ''}" title="Defeitos mecânicos">
                        <span class="icone-defeito">🔧</span>
                        <span class="numero-defeito">${qtdDefeitos}</span>
                    </div>

                    <!-- Badge de Documento Pendente -->
                    ${docPendente > 0 ? `
                        <div style="position: absolute; top: 10px; left: 10px; background: rgba(231, 76, 60, 0.9); color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                            📜 R$ ${docPendente.toLocaleString("pt-BR")}
                        </div>
                    ` : `
                        <div style="position: absolute; top: 10px; left: 10px; background: rgba(46, 204, 113, 0.9); color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                            ✅ Doc Ok
                        </div>
                    `}
                </div>

                <div class="carro-info-basica">
                    <h2>${carro.marca || "Sem Marca"}</h2>
                    <h3>${carro.modelo || carro.nome || "Sem Modelo"}</h3>
                    ${carro.origem ? `<small style="color:#aaa;">Origem: ${carro.origem}</small>` : ''}
                </div>

                <div class="carro-stats-grid">
                    <div class="stat-item">
                        <span class="stat-icone">📅</span>
                        <span class="stat-valor">${carro.ano || "--"}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icone">🛣️</span>
                        <span class="stat-valor">${kmSeguro} <small>km</small></span>
                    </div>
                </div>

                <div class="carro-financeiro">
                    <div class="fin-linha">
                        <span class="fin-label">Compra:</span>
                        <strong class="fin-valor compra">${compraFormatada}</strong>
                    </div>
                    <div class="fin-linha">
                        <span class="fin-label">FIPE:</span>
                        <strong class="fin-valor fipe">${fipeFormatada}</strong>
                    </div>
                </div>

                <!-- Ações do Card -->
                <div style="display: flex; gap: 6px; margin-top: 10px;">
                    ${docPendente > 0 ? `
                        <button onclick="pagarDocumentoPai(${index})" style="flex: 1; padding: 8px; background: #e74c3c; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px;">
                            📜 Pagar Doc
                        </button>
                    ` : ''}
                    
                    <button class="btn-acao-ghost" onclick="verDetalhesCarro(${index})" style="flex: 1; padding: 8px;">
                        🔍 Detalhes
                    </button>
                </div>

            </div>
            `;
        });

        html += `</div>`;
    }

    conteudo.innerHTML = html;
}

// ===========================================
// PAGAR DOCUMENTOS DO VEÍCULO
// ===========================================
function pagarDocumentoPai(index) {
    let carro = jogo.carros[index];
    if (!carro) return;

    let valorDoc = carro.documentosPendentes || 0;

    if (valorDoc <= 0) {
        mostrarAlerta("✅ Regularizado", "A documentação deste veículo já está em dia!");
        return;
    }

    if (jogo.dinheiro < valorDoc) {
        if (typeof tocarSomErro === "function") tocarSomErro();
        mostrarAlerta(
            "💸 Saldo Insuficiente", 
            `Você precisa de R$ ${valorDoc.toLocaleString("pt-BR")} no caixa para regularizar a documentação do veículo.\n\nSeu Caixa: R$ ${jogo.dinheiro.toLocaleString("pt-BR")}`
        );
        return;
    }

    // Processa o Pagamento e armazena histórico
    jogo.dinheiro -= valorDoc;
    carro.docPagoValor = (carro.docPagoValor || 0) + valorDoc;
    carro.documentosPendentes = 0;

    if (typeof tocarSomCompra === "function") tocarSomCompra();

    atualizarPainel();
    salvarJogo();
    mostrarPatio();

    mostrarAlerta(
        "🎉 Documentação Regularizada!", 
        `Você pagou R$ ${valorDoc.toLocaleString("pt-BR")} em débitos de IPVA e licenciamento do ${carro.marca} ${carro.modelo || carro.nome}.`
    );
}

// ===========================================
// PAINEL DE DETALHES AVANÇADO (SEM CONFIRM POPUP)
// ===========================================
function verDetalhesCarro(index) {
    let carro = jogo.carros[index];
    if (!carro) return;

    let precoCompra = carro.precoCompra || carro.compra || 0;

    // Calcula os custos de reparo da oficina
    let custosGastosReparos = 0;
    if (carro.reparos && Array.isArray(carro.reparos)) {
        custosGastosReparos = carro.reparos.reduce((total, r) => total + (r.valor || r.custo || 0), 0);
    } else if (carro.gastosOficina) {
        custosGastosReparos = carro.gastosOficina;
    }

    let docPendente = carro.documentosPendentes || 0;
    let docPago = carro.docPagoValor || 0;

    // Investimento Total = Compra + Reparos na Oficina + Documentos Pagos
    let investimentoTotal = precoCompra + custosGastosReparos + docPago;

    let qtdDefeitos = carro.defeitos ? carro.defeitos.length : 0;

    let mensagemDefeitos = "✅ Nenhum defeito pendente.";
    if (qtdDefeitos > 0) {
        mensagemDefeitos = carro.defeitos.map(d => `• ${d.nome} (R$ ${(d.valor || 0).toLocaleString("pt-BR")})`).join("\n");
    }

    let textoDetalhes = 
        `🚘 ${carro.marca || ''} ${carro.modelo || carro.nome || ''} (${carro.ano || '--'})\n` +
        `🛣️ Quilometragem: ${(carro.km || 0).toLocaleString("pt-BR")} km\n` +
        `🎨 Cor: ${carro.cor || "Não informada"}\n` +
        `----------------------------------------\n` +
        `💰 Valor de Compra: R$ ${precoCompra.toLocaleString("pt-BR")}\n` +
        `🔧 Gastos na Oficina: R$ ${custosGastosReparos.toLocaleString("pt-BR")}\n` +
        `📈 Investimento Total: R$ ${investimentoTotal.toLocaleString("pt-BR")}\n` +
        `📊 Valor FIPE: R$ ${(carro.fipe || 0).toLocaleString("pt-BR")}\n` +
        `----------------------------------------\n` +
        `📜 Situação Doc: ${docPendente > 0 ? `PENDENTE (R$ ${docPendente.toLocaleString("pt-BR")})` : 'REGULARIZADO'}\n\n` +
        `🛠️ DEFEITOS A CONSERTAR:\n${mensagemDefeitos}`;

    mostrarAlerta("🚘 Ficha do Veículo", textoDetalhes);
}