// ===========================
// ESTATISTICAS.JS V2.2
// G2 GARAGEM
// ===========================

function mostrarEstatisticas(){
    // Garante que os objetos financeiros existem para evitar erros de undefined
    const financeiro = jogo.financeiro || {};
    const estatisticas = jogo.estatisticas || {};

    // Calcula o valor total dos carros na garagem de forma mais limpa
    const valorCarros = jogo.carros.reduce((total, carro) => total + (carro.fipe || 0), 0);
    const patrimonio = (jogo.dinheiro || 0) + valorCarros;

    // Evita divisão por zero
    let lucroMedio = 0;
    if(estatisticas.vendidos > 0 && jogo.lucro){
        lucroMedio = jogo.lucro / estatisticas.vendidos;
    }

    // Tratamento para recordes
    const melhorVenda = financeiro.melhorVenda || 0;
    const maiorPrejuizo = financeiro.maiorPrejuizo || 0;
    const gastosTotal = financeiro.gastosTotal || 0;
    const gastosConsertos = financeiro.gastosConsertos || 0;
    const reputacao = Math.min(jogo.reputacao || 0, 100);

    conteudo.innerHTML = `
        <style>
            .stats-container {
                background: #121214;
                border: 1px solid #27272a;
                padding: 20px;
                border-radius: 12px;
                color: #fff;
                font-family: sans-serif;
            }
            .stats-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #27272a;
                padding-bottom: 12px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 12px;
                margin-bottom: 20px;
            }
            .stat-card {
                background: #18181b;
                border: 1px solid #27272a;
                padding: 14px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .stat-card.destaque {
                background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
                border-color: #059669;
            }
            .stat-label {
                font-size: 12px;
                color: #a1a1aa;
                text-transform: uppercase;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .stat-value {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
            }
            .stat-value.verde { color: #34d399; }
            .stat-value.vermelho { color: #f87171; }
            .stats-section-title {
                font-size: 14px;
                color: #38bdf8;
                text-transform: uppercase;
                margin: 20px 0 10px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .patrimonio-box {
                background: #18181b;
                border: 2px solid #3b82f6;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin-top: 20px;
            }
            .progress-bar-bg {
                background: #27272a;
                height: 10px;
                border-radius: 6px;
                overflow: hidden;
                width: 100%;
                margin-top: 6px;
            }
            .progress-bar-fill {
                height: 100%;
                background: #38bdf8;
            }
        </style>

        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">📊 CENTRAL DE ESTATÍSTICAS</h2>
                <span style="font-size: 12px; color: #a1a1aa; background: #27272a; padding: 4px 8px; border-radius: 6px;">
                    📅 ${jogo.dia}/${jogo.mes}/${jogo.ano}
                </span>
            </div>

            <!-- PATRIMÔNIO GLOBAL -->
            <div class="patrimonio-box">
                <span style="font-size: 12px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px;">💎 Patrimônio Total Líquido</span>
                <div style="font-size: 26px; font-weight: bold; color: #60a5fa; margin-top: 6px;">
                    R$ ${patrimonio.toLocaleString("pt-BR")}
                </div>
            </div>

            <!-- BLOCO FINANCEIRO -->
            <div class="stats-section-title">💰 Desempenho Financeiro</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">💵 Caixa Atual</span>
                    <span class="stat-value verde">R$ ${(jogo.dinheiro || 0).toLocaleString("pt-BR")}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">📈 Lucro Total</span>
                    <span class="stat-value ${(jogo.lucro || 0) >= 0 ? 'verde' : 'vermelho'}">R$ ${(jogo.lucro || 0).toLocaleString("pt-BR")}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">💸 Gastos Totais</span>
                    <span class="stat-value vermelho">R$ ${gastosTotal.toLocaleString("pt-BR")}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">🔧 Gastos Reparos</span>
                    <span class="stat-value vermelho">R$ ${gastosConsertos.toLocaleString("pt-BR")}</span>
                </div>
            </div>

            <!-- BLOCO FROTA -->
            <div class="stats-section-title">🚗 Movimento da Frota</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">🚘 No Pátio</span>
                    <span class="stat-value">${jogo.carros.length} / ${jogo.empresa?.vagas || 0}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">🛒 Comprados</span>
                    <span class="stat-value">${estatisticas.comprados || 0}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">💵 Vendidos</span>
                    <span class="stat-value">${estatisticas.vendidos || 0}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">🔧 Consertados</span>
                    <span class="stat-value">${estatisticas.consertados || 0}</span>
                </div>
                <div class="stat-card" style="grid-column: span 2;">
                    <span class="stat-label">🚘 Valor de Mercado da Frota</span>
                    <span class="stat-value">R$ ${valorCarros.toLocaleString("pt-BR")}</span>
                </div>
            </div>

            <!-- BLOCO EMPRESA & REPUTAÇÃO -->
            <div class="stats-section-title">🏢 Gestão da Empresa</div>
            <div class="stats-grid">
                <div class="stat-card" style="grid-column: span 2;">
                    <span class="stat-label">⭐ Reputação da Loja (${reputacao}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${reputacao}%;"></div>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-label">🏆 Nível da Garagem</span>
                    <span class="stat-value">${jogo.empresa?.nivel || 1}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">👨‍🔧 Funcionários</span>
                    <span class="stat-value">${jogo.empresa?.funcionarios || 0}</span>
                </div>
            </div>

            <!-- BLOCO RECORDES -->
            <div class="stats-section-title">🏆 Recordes e Médias</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">💎 Melhor Venda</span>
                    <span class="stat-value verde">R$ ${melhorVenda.toLocaleString("pt-BR")}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">📉 Maior Prejuízo</span>
                    <span class="stat-value vermelho">R$ ${maiorPrejuizo.toLocaleString("pt-BR")}</span>
                </div>
                <div class="stat-card" style="grid-column: span 2;">
                    <span class="stat-label">📊 Lucro Médio por Venda</span>
                    <span class="stat-value">R$ ${lucroMedio.toLocaleString("pt-BR")}</span>
                </div>
            </div>

        </div>
    `;
}