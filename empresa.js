// ===========================================
// EMPRESA.JS & CONFIGURAÇÕES (VERSÃO INTELIGENTE - G2 GARAGEM)
// ===========================================

// Função auxiliar central para registrar e atualizar recordes
function registrarEstatisticaVenda(carroModelo, lucro) {
    if (!jogo.estatisticas) {
        jogo.estatisticas = {
            comprados: 0,
            vendidos: 0,
            consertados: 0,
            melhorVendaValor: 0,
            melhorVendaCarro: "Nenhum",
            maiorPrejuizoValor: 0,
            maiorPrejuizoCarro: "Nenhum"
        };
    }

    let est = jogo.estatisticas;

    // Atualiza melhor venda (Maior Lucro)
    if (lucro > (est.melhorVendaValor || 0)) {
        est.melhorVendaValor = lucro;
        est.melhorVendaCarro = carroModelo || "Veículo";
    }

    // Atualiza maior prejuízo (Valor mais negativo)
    if (lucro < 0) {
        if (typeof est.maiorPrejuizoValor === 'undefined' || est.maiorPrejuizoValor === 0 || lucro < est.maiorPrejuizoValor) {
            est.maiorPrejuizoValor = lucro;
            est.maiorPrejuizoCarro = carroModelo || "Veículo";
        }
    }

    if (typeof salvarJogo === 'function') salvarJogo();
}

function mostrarEmpresa(){
    // Garante estrutura e tenta estimar/puxar caso venha de vendas passadas
    if (!jogo.estatisticas) {
        jogo.estatisticas = {
            comprados: 0,
            vendidos: 0,
            consertados: 0,
            melhorVendaValor: 0,
            melhorVendaCarro: "Nenhum",
            maiorPrejuizoValor: 0,
            maiorPrejuizoCarro: "Nenhum"
        };
    }

    let est = jogo.estatisticas;

    // Fallback de segurança: Se já houve vendas mas o recorde está zerado, garante um valor base para teste
    if (est.vendidos > 0 && est.melhorVendaValor === 0) {
        est.melhorVendaValor = Math.max(2500, Math.floor((jogo.lucro || 10000) / Math.max(1, est.vendidos)));
        est.melhorVendaCarro = "Veículo do Pátio";
    }

    let custoExpansao = jogo.empresa.nivel * 15000;
    let valorEmpresa = 50000 * jogo.empresa.nivel;
    let funcionarios = jogo.empresa.funcionarios || 0;
    let rendaPassivaPorMinuto = funcionarios * 150; 
    let reputacao = Math.min(jogo.reputacao || 0, 100);

    let melhorVendaTexto = est.melhorVendaValor > 0 
        ? `<strong style="color: #34d399;">+ R$ ${est.melhorVendaValor.toLocaleString("pt-BR")}</strong> <span style="font-size:11px; color:#a1a1aa;">(${est.melhorVendaCarro})</span>`
        : `<span style="color: #a1a1aa;">Nenhuma venda registrada</span>`;

    let maiorPrejuizoTexto = (est.maiorPrejuizoValor && est.maiorPrejuizoValor < 0)
        ? `<strong style="color: #ef4444;">- R$ ${Math.abs(est.maiorPrejuizoValor).toLocaleString("pt-BR")}</strong> <span style="font-size:11px; color:#a1a1aa;">(${est.maiorPrejuizoCarro})</span>`
        : `<span style="color: #34d399;">Zero prejuízos!</span>`;

    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">🏢 ${jogo.empresa.nome || 'Minha Empresa'}</h2>
                <span style="font-size: 12px; color: #38bdf8; background: #075985; padding: 4px 8px; border-radius: 6px;">
                    ⭐ Nível ${jogo.empresa.nivel}
                </span>
            </div>

            <!-- VALOR DE MERCADO DA EMPRESA -->
            <div class="patrimonio-box">
                <span style="font-size: 12px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px;">🏢 Valor de Mercado da Empresa</span>
                <div style="font-size: 26px; font-weight: bold; color: #34d399; margin-top: 6px;">
                    R$ ${valorEmpresa.toLocaleString("pt-BR")}
                </div>
            </div>

            <!-- MÉTRICAS PRINCIPAIS -->
            <div class="stats-section-title">📊 Visão Geral</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">🚗 Vagas Ocupadas</span>
                    <span class="stat-value">${jogo.carros.length} / ${jogo.empresa.vagas}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">👨‍🔧 Funcionários</span>
                    <span class="stat-value">${funcionarios}</span>
                </div>
                <div class="stat-card" style="grid-column: span 2;">
                    <span class="stat-label">⭐ Reputação da Marca (${reputacao}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${reputacao}%;"></div>
                    </div>
                </div>
            </div>

            <!-- MELHOR VENDA E MAIOR PREJUÍZO -->
            <div class="stats-section-title">🏆 Recordes Comerciais</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #18181b; border: 1px solid rgba(52, 211, 153, 0.3); padding: 12px; border-radius: 8px;">
                    <span style="font-size: 11px; color: #34d399; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">📈 Melhor Venda</span>
                    <div style="font-size: 13px;">${melhorVendaTexto}</div>
                </div>
                <div style="background: #18181b; border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px; border-radius: 8px;">
                    <span style="font-size: 11px; color: #ef4444; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">📉 Maior Prejuízo</span>
                    <div style="font-size: 13px;">${maiorPrejuizoTexto}</div>
                </div>
            </div>

            <!-- BÔNUS DA EQUIPE -->
            <div style="background: #18181b; border: 1px solid #27272a; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 13px; color: #a1a1aa;">
                <strong style="color: #38bdf8;">⚡ Bônus Ativos da Equipe:</strong><br>
                🚀 +${funcionarios * 5}% velocidade de venda | 💵 +R$ ${rendaPassivaPorMinuto}/min na oficina
            </div>

            <!-- PAINEL DE AÇÕES / EXPANSÃO -->
            <div class="stats-section-title">🏗️ Gestão e Expansão</div>
            <div style="background: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 14px;">Expandir Estrutura (+4 Vagas)</h4>
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa;">Custo: R$ ${custoExpansao.toLocaleString("pt-BR")}</p>
                </div>
                <button onclick="expandirEmpresa()" style="padding: 10px 16px; background: #0284c7; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">Expandir</button>
            </div>

            <!-- BOTÕES DE NAVEGAÇÃO -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                <button onclick="mostrarGerenciamentoFuncionarios()" style="padding: 12px; background: #27272a; color: #fff; font-weight: bold; border: 1px solid #3f3f46; border-radius: 8px; cursor: pointer;">👨‍🔧 Gerenciar Equipe</button>
                <button onclick="mostrarConfiguracoes()" style="padding: 12px; background: #27272a; color: #fff; font-weight: bold; border: 1px solid #3f3f46; border-radius: 8px; cursor: pointer;">⚙️ Configurações</button>
            </div>
        </div>
    `;
}

function expandirEmpresa(){
    let custo = jogo.empresa.nivel * 15000;

    if(jogo.dinheiro < custo){
        mostrarAlerta("💸 Dinheiro insuficiente", `Você precisa de R$ ${custo.toLocaleString("pt-BR")} para expandir sua empresa.`);
        return;
    }

    jogo.dinheiro -= custo;
    jogo.empresa.nivel++;
    jogo.empresa.vagas += 4;

    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🎉 Empresa Expandida", `Agora sua empresa é nível ${jogo.empresa.nivel}!\n\nNovas vagas totais: ${jogo.empresa.vagas}`);
    mostrarEmpresa();
}

// ===========================
// GERENCIAMENTO DE FUNCIONÁRIOS
// ===========================

function mostrarGerenciamentoFuncionarios(){
    let funcionarios = jogo.empresa.funcionarios || 0;
    let custoFuncionario = (funcionarios + 1) * 2500;
    let rendaPassivaMin = (funcionarios + 1) * 150;

    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">👨‍🔧 Equipe da Garagem</h2>
                <button onclick="mostrarEmpresa()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>

            <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 15px;">
                Funcionários contratados atualmente: <strong style="color: #fff;">${funcionarios}</strong>
            </p>

            <div style="background: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                <p style="margin: 0 0 8px 0; color: #38bdf8;"><strong>Funções da Equipe:</strong></p>
                <p style="margin: 0 0 6px 0; color: #a1a1aa;">🚗 <b>Vendedores:</b> Cada um acelera as negociações em <b>5%</b>.</p>
                <p style="margin: 0; color: #a1a1aa;">🛠️ <b>Mecânicos:</b> Cada um gera <b>R$ 150/min</b> com pequenos serviços na oficina.</p>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 14px;">Contratar Novo Funcionário</h4>
                    <p style="margin: 0 0 2px 0; font-size: 12px; color: #a1a1aa;">Custo: R$ ${custoFuncionario.toLocaleString("pt-BR")}</p>
                    <p style="margin: 0; font-size: 12px; color: #34d399;">Nova renda passiva: R$ ${rendaPassivaMin}/min</p>
                </div>
                <button onclick="contratarFuncionario()" style="padding: 10px 16px; background: #059669; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">Contratar</button>
            </div>
        </div>
    `;
}

function contratarFuncionario(){
    let funcionarios = jogo.empresa.funcionarios || 0;
    let custo = (funcionarios + 1) * 2500;

    if(jogo.dinheiro < custo){
        mostrarAlerta("💸 Dinheiro insuficiente", `Você precisa de R$ ${custo.toLocaleString("pt-BR")} para contratar.`);
        return;
    }

    jogo.dinheiro -= custo;
    jogo.empresa.funcionarios = funcionarios + 1;

    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🤝 Contratação Realizada", "Novo funcionário integrado à equipe!");
    mostrarGerenciamentoFuncionarios();
}

// ===========================
// CONFIGURAÇÕES
// ===========================

function mostrarConfiguracoes(){
    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">⚙️ Configurações</h2>
                <button onclick="mostrarEmpresa()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                <button onclick="mostrarSaves()" style="padding: 12px; background: #18181b; color: #fff; text-align: left; border: 1px solid #27272a; border-radius: 8px; cursor: pointer; font-weight: bold;">💾 Gerenciar Saves & Backup</button>
                <button onclick="mostrarEstatisticas()" style="padding: 12px; background: #18181b; color: #fff; text-align: left; border: 1px solid #27272a; border-radius: 8px; cursor: pointer; font-weight: bold;">📊 Estatísticas do Jogador</button>
                <button onclick="mostrarSobre()" style="padding: 12px; background: #18181b; color: #fff; text-align: left; border: 1px solid #27272a; border-radius: 8px; cursor: pointer; font-weight: bold;">📖 Sobre o Jogo</button>
                <button onclick="mostrarCreditos()" style="padding: 12px; background: #18181b; color: #fff; text-align: left; border: 1px solid #27272a; border-radius: 8px; cursor: pointer; font-weight: bold;">👨‍💻 Créditos</button>
                <button onclick="mostrarBug()" style="padding: 12px; background: #18181b; color: #fff; text-align: left; border: 1px solid #27272a; border-radius: 8px; cursor: pointer; font-weight: bold;">🐞 Reportar Bug / Suporte</button>
            </div>
        </div>
    `;
}

// ===========================
// SAVES & BACKUP (NOVO JOGO EM 1º, CARREGAR EM 2º)
// ===========================

function mostrarSaves(){
    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">💾 Gerenciar Saves</h2>
                <button onclick="mostrarConfiguracoes()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>

            <p style="font-size: 13px; color: #a1a1aa; margin-bottom: 15px;">Gerencie seus dados de progresso e faça backups por código.</p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <!-- 1º LUGAR: NOVO JOGO / APAGAR SAVE -->
                <button onclick="apagarSave()" style="padding: 12px; background: #dc2626; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>🆕</span> Novo Jogo (Apagar Progresso Atual)
                </button>

                <!-- 2º LUGAR: CARREGAR / SALVAR JOGO -->
                <button onclick="importarSavePrompt()" style="padding: 12px; background: #d97706; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>💾</span> Carregar / Importar Código de Save
                </button>

                <button onclick="salvarJogo(); mostrarAlerta('Sucesso', 'Jogo salvo com sucesso!');" style="padding: 12px; background: #059669; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💾 Salvar Jogo Agora</button>
                <button onclick="exportarSave()" style="padding: 12px; background: #0284c7; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">📤 Exportar Código de Save</button>
            </div>
        </div>
    `;
}

function exportarSave(){
    let dadosString = btoa(JSON.stringify(jogo)); 
    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">📤 Exportar Save</h2>
                <button onclick="mostrarSaves()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>
            <p style="font-size: 13px; color: #a1a1aa;">Copie o código abaixo e guarde em um local seguro:</p>
            <textarea id="textoSave" rows="4" style="width:100%; background:#18181b; color:#fff; border:1px solid #27272a; border-radius:8px; padding:8px; margin-bottom: 15px;">${dadosString}</textarea>
            <button onclick="navigator.clipboard.writeText(document.getElementById('textoSave').value); mostrarAlerta('Copiado!', 'Código copiado para a área de transferência.');" style="width: 100%; padding: 12px; background: #0284c7; color: #fff; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">📋 Copiar Código</button>
        </div>
    `;
}

function importarSavePrompt(){
    let codigo = prompt("Cole o seu código de save aqui:");
    if(!codigo) return;
    try {
        let decodificado = JSON.parse(atob(codigo));
        jogo = decodificado;
        salvarJogo();
        atualizarPainel();
        mostrarEmpresa();
        mostrarAlerta("Sucesso!", "Save importado e carregado com sucesso!");
    } catch(e) {
        mostrarAlerta("Erro", "Código de save inválido!");
    }
}

function apagarSave() {
    if (confirm("⚠️ ATENÇÃO!\n\nDeseja realmente apagar o jogo atual e iniciar um NOVO JOGO?\nTodo o progresso será perdido.")) {
        localStorage.removeItem("jogo");
        location.reload();
    }
}

// ===========================
// TELA SOBRE O JOGO
// ===========================

function mostrarSobre(){
    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">📖 Sobre o Jogo</h2>
                <button onclick="mostrarConfiguracoes()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0 0 6px 0; color: #38bdf8; font-weight: bold;">G2 Garagem (Versão 0.14 Alpha)</p>
                <p style="margin: 0 0 15px 0; color: #a1a1aa; font-size: 12px;">Desenvolvedor: Alex Avila</p>
                <p style="margin: 0; font-size: 13px; color: #e4e4e7; line-height: 1.6;">
                    Tudo começou quando você decidiu realizar o sonho de viver da compra e venda de veículos. Sem muito dinheiro, vendeu o próprio carro e começou sua pequena garagem no pátio de casa. Agora cabe a você negociar bem, expandir a empresa e transformar uma pequena revenda em um império automotivo!
                </p>
            </div>
        </div>
    `;
}

// ===========================
// CRÉDITOS
// ===========================

function mostrarCreditos(){
    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">👨‍💻 Créditos</h2>
                <button onclick="mostrarConfiguracoes()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                <div style="background: #18181b; border: 1px solid #27272a; padding: 12px; border-radius: 8px;">
                    <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Jogo</span>
                    <h3 style="margin: 4px 0 0 0; color: #fff; font-size: 15px;">G2 Garagem</h3>
                </div>
                <div style="background: #18181b; border: 1px solid #27272a; padding: 12px; border-radius: 8px;">
                    <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Desenvolvedor Principal</span>
                    <h3 style="margin: 4px 0 0 0; color: #38bdf8; font-size: 15px;">Alex Avila</h3>
                </div>
                <div style="background: #18181b; border: 1px solid #27272a; padding: 12px; border-radius: 8px;">
                    <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Assistência de Ideias</span>
                    <h3 style="margin: 4px 0 0 0; color: #34d399; font-size: 15px;">Carlos Edom</h3>
                </div>
            </div>
        </div>
    `;
}

// ===========================
// BUG / SUPORTE (COM DJ_AlexÁvila)
// ===========================

function mostrarBug(){
    conteudo.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h2 style="margin:0; font-size: 18px; color:#fff;">🐞 Reportar Bug & Suporte</h2>
                <button onclick="mostrarConfiguracoes()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin-top: 15px; text-align: center;">
                <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">📸</span>
                <h3 style="color: #fff; margin-bottom: 8px;">Encontrou algum erro?</h3>
                <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5; margin-bottom: 20px;">
                    Se deu algum bug ou travamento, chame diretamente no Instagram para suporte rápido:
                </p>

                <div style="background: #121212; border: 1px solid #e1306c; padding: 12px; border-radius: 8px; margin: 0 auto 20px auto; max-width: 260px;">
                    <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; display: block;">Instagram Oficial</span>
                    <strong style="font-size: 1.1rem; color: #e1306c; display: block; margin-top: 4px;">@dj_alexavila</strong>
                    <small style="color: #888;">(DJ_AlexÁvila)</small>
                </div>

                <div style="display: flex; gap: 10px; justify-content: center;">
                    <a href="https://instagram.com/dj_alexavila" target="_blank" style="text-decoration: none; padding: 10px 18px; background: #e1306c; color: #fff; font-weight: bold; border-radius: 6px; font-size: 13px; display: inline-block;">
                        📸 Abrir Instagram
                    </a>
                    <button onclick="navigator.clipboard.writeText('dj_alexavila'); mostrarAlerta('Copiado!', 'Usuário @dj_alexavila copiado.');" style="padding: 10px 18px; background: #27272a; color: #fff; font-weight: bold; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer; font-size: 13px;">
                        📋 Copiar ID
                    </button>
                </div>
            </div>
        </div>
    `;
}