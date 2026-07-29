// ===========================
// OFICINA.JS V4.5 (OTIMIZADO + CORRIGIDO)
// G2 GARAGEM
// ===========================

// ===========================
// CONFIGURAÇÕES DE ESTÉTICA E UPGRADES
// ===========================
const opcoesCoresPintura = [
    { nome: "Preto Fosco", valor: 1200, bonusValor: 1.15 },
    { nome: "Prata Lunar", valor: 800, bonusValor: 1.05 },
    { nome: "Vermelho Alpine", valor: 1000, bonusValor: 1.10 },
    { nome: "Azul Midnight", valor: 1000, bonusValor: 1.10 },
    { nome: "Branco Pérola", valor: 900, bonusValor: 1.08 },
    { nome: "Amarelo Esportivo", valor: 1500, bonusValor: 1.20 }
];

const opcoesPelicula = [
    { nome: "Sem Película", valor: 0, bonusValor: 1.0 },
    { nome: "Película G20 (Leve)", valor: 400, bonusValor: 1.02 },
    { nome: "Película G5 (Escura)", valor: 700, bonusValor: 1.05 },
    { nome: "Película Titanium / Espelhada", valor: 1200, bonusValor: 1.08 }
];

const opcoesPneus = [
    { nome: "Pneus Carecas / Originais", valor: 0, bonusValor: 1.0 },
    { nome: "Pneus Novos Rodagem", valor: 1600, bonusValor: 1.05 },
    { nome: "Pneus Esportivos de Alta Aderência", valor: 3200, bonusValor: 1.12 }
];

const opcoesMotor = [
    { nome: "Motor Original", valor: 0, bonusValor: 1.0 },
    { nome: "Remap Estágio 1 + Filtro Esportivo", valor: 2500, bonusValor: 1.15 },
    { nome: "Preparação Aspirada (Comando + Escape)", valor: 6000, bonusValor: 1.30 },
    { nome: "Kit Turbo Forjado Completo 🐌", valor: 14000, bonusValor: 1.60 }
];

// ===========================
// TELA PRINCIPAL DA OFICINA
// ===========================
function mostrarOficina(){
    // Garante que os objetos base existem
    if(!jogo.melhoriasOficina) {
        jogo.melhoriasOficina = { elevadorNivel: 1, ferramentasNivel: 1 };
    }
    if(!jogo.estatisticas) {
        jogo.estatisticas = { consertados: 0 };
    }

    let html = `
    <h2>🔧 OFICINA & CUSTOMIZAÇÃO</h2>
    
    <div class="card" style="background: #1e1e1e; border: 1px solid #444; margin-bottom: 15px;">
        <h3>🏗️ Estrutura da Oficina</h3>
        <p>⭐ Nível do Elevador: <strong>${jogo.melhoriasOficina.elevadorNivel}</strong> (Reparos simultâneos)</p>
        <p>🛠️ Nível das Ferramentas: <strong>${jogo.melhoriasOficina.ferramentasNivel}</strong></p>
        
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button onclick="melhorarElevador()" style="flex:1; padding:8px; background:#ff9800; color:#000; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">
                ⬆️ Upar Elevador (R$ ${(jogo.melhoriasOficina.elevadorNivel * 7500).toLocaleString("pt-BR")})
            </button>
            <button onclick="melhorarFerramentas()" style="flex:1; padding:8px; background:#ff9800; color:#000; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">
                ⬆️ Upar Ferramentas (R$ ${(jogo.melhoriasOficina.ferramentasNivel * 5000).toLocaleString("pt-BR")})
            </button>
        </div>
    </div>
    <hr>
    `;

    if(!jogo.carros || jogo.carros.length == 0){
        html += "<p>Você não possui carros na oficina.</p>";
        conteudo.innerHTML = html;
        return;
    }

    jogo.carros.forEach(function(carro, index){
        html += `
        <div class="card">
            <h2>${carro.marca} ${carro.modelo}</h2>
            <p>📅 Ano: ${carro.ano}</p>
            <p>🛣️ KM: ${carro.km ? carro.km.toLocaleString("pt-BR") : "N/A"}</p>
            <p>🎨 Cor: ${carro.cor || "Original"}</p>
            ${carro.pelicula ? `<p>🕶️ Película: ${carro.pelicula}</p>` : ""}
            ${carro.pneus ? `<p>🛞 Pneus: ${carro.pneus}</p>` : ""}
            ${carro.motor ? `<p>🏎️ Motor: ${carro.motor}</p>` : ""}
            <hr>
        `;

        // Reparos em andamento
        if(carro.reparos && carro.reparos.length > 0){
            html += `<h3>⏳ Reparos em andamento</h3>`;
            carro.reparos.forEach(function(reparo){
                html += `
                <div class="defeito">
                    🔧 ${reparo.nome}<br>
                    💰 R$ ${reparo.valor.toLocaleString("pt-BR")}<br>
                    ⏰ Faltam: ${reparo.dias} dias
                </div>
                `;
            });
        }

        // Defeitos mecânicos pendentes
        if(carro.defeitos && carro.defeitos.length > 0){
            html += `<h3>🔧 Defeitos encontrados</h3>`;
            carro.defeitos.forEach(function(defeito, posicao){
                html += `
                <div class="defeito">
                    🔧 ${defeito.nome}<br>
                    💰 R$ ${defeito.valor.toLocaleString("pt-BR")}
                </div>
                <button onclick="iniciarReparo(${index}, ${posicao})" style="width:100%; padding:8px; background:#e63946; color:#fff; font-weight:bold; border:none; border-radius:4px; margin-top:5px; cursor:pointer;">
                    🔧 Consertar este defeito
                </button>
                <br><br>
                `;
            });
        }

        // Carro pronto (sem defeitos e sem reparos rodando)
        if((!carro.defeitos || carro.defeitos.length == 0) && (!carro.reparos || carro.reparos.length == 0)){
            html += `
            <p style="color:#4CAF50; font-weight: bold;">✅ Veículo revisado e pronto</p>
            
            <button onclick="abrirEstetica(${index})" style="width:100%; padding:10px; background:#00b4d8; color:#000; font-weight:bold; border:none; border-radius:6px; margin-bottom:8px; cursor:pointer;">
                🎨 Estética, Película, Pneus & Motor
            </button>
            
            <button onclick='iniciarTesteDrive(jogo.carros[${index}])' style="width:100%; padding:10px; background:#10b981; color:#fff; font-weight:bold; border:none; border-radius:6px; margin-bottom:8px; cursor:pointer;">
                🏎️ Teste de Pista (Shift Light)
            </button>
            `;
        }

        html += `</div><br>`;
    });

    conteudo.innerHTML = html;
}

// ===========================
// SISTEMA DE UPGRADES DA OFICINA
// ===========================
function melhorarElevador(){
    let custo = jogo.melhoriasOficina.elevadorNivel * 7500;
    if(jogo.dinheiro < custo){
        mostrarAlerta("💸 Saldo Insuficiente", "Você não tem dinheiro para melhorar o elevador.");
        return;
    }
    jogo.dinheiro -= custo;
    jogo.melhoriasOficina.elevadorNivel++;
    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🏗️ Elevador Melhorado!", `Sua oficina agora suporta mais eficiência nos reparos simultâneos!`);
    mostrarOficina();
}

function melhorarFerramentas(){
    let custo = jogo.melhoriasOficina.ferramentasNivel * 5000;
    if(jogo.dinheiro < custo){
        mostrarAlerta("💸 Saldo Insuficiente", "Você não tem dinheiro para comprar ferramentas melhores.");
        return;
    }
    jogo.dinheiro -= custo;
    jogo.melhoriasOficina.ferramentasNivel++;
    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🛠️ Ferramentas Atualizadas!", `Os reparos agora serão concluídos mais rapidamente!`);
    mostrarOficina();
}

// ===========================
// INICIAR REPARO MECÂNICO
// ===========================
function iniciarReparo(indiceCarro, indiceDefeito){
    let carro = jogo.carros[indiceCarro];
    let defeito = carro.defeitos[indiceDefeito];

    // Conta quantos reparos estão ativos no total da oficina
    let totalEmReparo = 0;
    jogo.carros.forEach(c => {
        if(c.reparos && c.reparos.length > 0) totalEmReparo += c.reparos.length;
    });

    if(totalEmReparo >= jogo.melhoriasOficina.elevadorNivel){
        mostrarAlerta("⚠️ Vagas Ocupadas", `Seu nível atual de estrutura (${jogo.melhoriasOficina.elevadorNivel}) só permite realizar ${jogo.melhoriasOficina.elevadorNivel} reparo(s) simultâneo(s) por dia!`);
        return;
    }

    if(!carro.reparos) carro.reparos = [];

    if(jogo.dinheiro < defeito.valor){
        mostrarAlerta("💸 Dinheiro insuficiente", "Você não possui dinheiro para realizar esse reparo.");
        return;
    }

    let reducao = jogo.melhoriasOficina.ferramentasNivel - 1;
    let prazo = Math.max(1, Math.floor(Math.random() * 4) + 3 - reducao);

    jogo.dinheiro -= defeito.valor;
    
    carro.reparos.push({
        nome: defeito.nome,
        valor: defeito.valor,
        dias: prazo,
        totalDias: prazo
    });

    carro.defeitos.splice(indiceDefeito, 1);
    
    if(!jogo.financeiro) jogo.financeiro = { gastosConsertos: 0 };
    jogo.financeiro.gastosConsertos += defeito.valor;

    atualizarPainel();
    salvarJogo();

    mostrarAlerta("🔧 Reparo iniciado", `${defeito.nome}\n⏳ Prazo: ${prazo} dia(s)\nO veículo entrou na linha de montagem.`);
    mostrarOficina();
}

// ===========================
// PAINEL DE ESTÉTICA, PELÍCULA, PNEUS E MOTOR
// ===========================
function abrirEstetica(indiceCarro) {
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let html = `
    <div class="card">
        <h2>🎨 Estética, Película, Pneus & Motor</h2>
        <h3>${carro.marca} ${carro.modelo}</h3>
        <p>Cor: <strong>${carro.cor || "Original"}</strong> | Película: <strong>${carro.pelicula || "Original"}</strong> | Pneus: <strong>${carro.pneus || "Original"}</strong> | Motor: <strong>${carro.motor || "Original"}</strong></p>
        <hr>

        <h4>Escolher Pintura:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
    `;

    opcoesCoresPintura.forEach((cor, i) => {
        html += `<button onclick="aplicarPintura(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; padding: 8px; cursor:pointer;"><span>🎨 ${cor.nome}</span><strong>R$ ${cor.valor.toLocaleString("pt-BR")}</strong></button>`;
    });

    html += `
        </div>
        <h4>Escolher Película nos Vidros:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
    `;

    opcoesPelicula.forEach((pelicula, i) => {
        html += `<button onclick="aplicarPelicula(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; padding: 8px; cursor:pointer;"><span>🕶️ ${pelicula.nome}</span><strong>R$ ${pelicula.valor.toLocaleString("pt-BR")}</strong></button>`;
    });

    html += `
        </div>
        <h4>Escolher Pneus:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
    `;

    opcoesPneus.forEach((pneu, i) => {
        html += `<button onclick="aplicarPneus(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; padding: 8px; cursor:pointer;"><span>🛞 ${pneu.nome}</span><strong>R$ ${pneu.valor.toLocaleString("pt-BR")}</strong></button>`;
    });

    html += `
        </div>
        <h4>🏎️ Upgrade de Motor & Performance:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
    `;

    opcoesMotor.forEach((motor, i) => {
        html += `<button onclick="aplicarMotor(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; padding: 8px; cursor:pointer; background:#222; color:#fff;"><span>🏎️ ${motor.nome}</span><strong>R$ ${motor.valor.toLocaleString("pt-BR")}</strong></button>`;
    });

    html += `
        <br>
        <button onclick="mostrarOficina()" style="width:100%; padding:10px; background:#444; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
            ⬅️ Voltar para Oficina
        </button>
    </div>
    `;

    conteudo.innerHTML = html;
}

function aplicarPintura(indiceCarro, indiceCor) {
    let carro = jogo.carros[indiceCarro];
    let corEscolhida = opcoesCoresPintura[indiceCor];

    if (jogo.dinheiro < corEscolhida.valor) {
        mostrarAlerta("💸 Saldo Insuficiente", "Dinheiro insuficiente para a pintura.");
        return;
    }

    jogo.dinheiro -= corEscolhida.valor;
    carro.cor = corEscolhida.nome;
    if (carro.fipe) carro.fipe = Math.round(carro.fipe * corEscolhida.bonusValor);
    if (carro.valorVenda) carro.valorVenda = Math.round(carro.valorVenda * corEscolhida.bonusValor);

    atualizarPainel();
    salvarJogo();
    mostrarAlerta("✨ Pintura Concluída!", `Veículo pintado de ${corEscolhida.nome}!\nValor de mercado valorizado.`);
    abrirEstetica(indiceCarro);
}

function aplicarPelicula(indiceCarro, indicePelicula) {
    let carro = jogo.carros[indiceCarro];
    let peliculaEscolhida = opcoesPelicula[indicePelicula];

    if (peliculaEscolhida.valor > 0 && jogo.dinheiro < peliculaEscolhida.valor) {
        mostrarAlerta("💸 Saldo Insuficiente", "Dinheiro insuficiente para a película.");
        return;
    }

    if (peliculaEscolhida.valor > 0) jogo.dinheiro -= peliculaEscolhida.valor;
    carro.pelicula = peliculaEscolhida.nome;
    if (carro.fipe) carro.fipe = Math.round(carro.fipe * peliculaEscolhida.bonusValor);
    if (carro.valorVenda) carro.valorVenda = Math.round(carro.valorVenda * peliculaEscolhida.bonusValor);

    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🕶️ Película Aplicada!", `Instalado ${peliculaEscolhida.nome}!`);
    abrirEstetica(indiceCarro);
}

function aplicarPneus(indiceCarro, indicePneus) {
    let carro = jogo.carros[indiceCarro];
    let pneuEscolhido = opcoesPneus[indicePneus];

    if (pneuEscolhido.valor > 0 && jogo.dinheiro < pneuEscolhido.valor) {
        mostrarAlerta("💸 Saldo Insuficiente", "Dinheiro insuficiente para os pneus.");
        return;
    }

    if (pneuEscolhido.valor > 0) jogo.dinheiro -= pneuEscolhido.valor;
    carro.pneus = pneuEscolhido.nome;
    if (carro.fipe) carro.fipe = Math.round(carro.fipe * pneuEscolhido.bonusValor);
    if (carro.valorVenda) carro.valorVenda = Math.round(carro.valorVenda * pneuEscolhido.bonusValor);

    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🛞 Pneus Trocados!", `Instalado ${pneuEscolhido.nome}!`);
    abrirEstetica(indiceCarro);
}

function aplicarMotor(indiceCarro, indiceMotor) {
    let carro = jogo.carros[indiceCarro];
    let motorEscolhido = opcoesMotor[indiceMotor];

    if (motorEscolhido.valor > 0 && jogo.dinheiro < motorEscolhido.valor) {
        mostrarAlerta("💸 Saldo Insuficiente", "Dinheiro insuficiente para o upgrade de motor.");
        return;
    }

    if (motorEscolhido.valor > 0) jogo.dinheiro -= motorEscolhido.valor;
    carro.motor = motorEscolhido.nome;
    if (carro.fipe) carro.fipe = Math.round(carro.fipe * motorEscolhido.bonusValor);
    if (carro.valorVenda) carro.valorVenda = Math.round(carro.valorVenda * motorEscolhido.bonusValor);

    atualizarPainel();
    salvarJogo();
    mostrarAlerta("🏎️ Upgrade de Motor Realizado!", `O possante agora tá equipado com: ${motorEscolhido.nome}!\nA potência e a valorização de revenda dispararam.`);
    abrirEstetica(indiceCarro);
}

// ===========================
// AVANÇO DE DIAS DA OFICINA
// ===========================
function atualizarOficinaDia(){
    if(!jogo.carros) return;

    jogo.carros.forEach(function(carro){
        if(carro.reparos && carro.reparos.length > 0){
            carro.reparos.forEach(function(reparo){
                reparo.dias--;
            });

            carro.reparos = carro.reparos.filter(function(reparo){
                if(reparo.dias <= 0){
                    if(!jogo.estatisticas) jogo.estatisticas = { consertados: 0 };
                    jogo.estatisticas.consertados++;
                    jogo.reputacao = (jogo.reputacao || 0) + 1;

                    mostrarAlerta("✅ Reparo concluído", `${carro.marca} ${carro.modelo}\n🔧 ${reparo.nome}\nPronto para customização ou venda!`);
                    return false;
                }
                return true;
            });
        }
    });

    salvarJogo();
}