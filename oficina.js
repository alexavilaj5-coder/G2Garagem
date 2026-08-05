// ===========================================
// OFICINA.JS V7.7 - EDIÇÃO DEFINITIVA AJUSTADA 🚀🔥
// (REMOVIDO POP & BANGS, CORTE DE GIRO RÁPIDO & SOM DO MOTOR ESCALA COM O TURBO/MOTOR)
// ===========================================

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
    { nome: "Motor Original", valor: 0, bonusValor: 1.0, cvBase: 95, pressaoMax: 0.0, redline: 6500, tipoSom: "original" },
    { nome: "Remap Estágio 1 + Filtro Esportivo", valor: 2500, bonusValor: 1.15, cvBase: 130, pressaoMax: 0.5, redline: 7000, tipoSom: "esportivo" },
    { nome: "Preparação Aspirada (Comando + Escape)", valor: 6000, bonusValor: 1.30, cvBase: 175, pressaoMax: 0.0, redline: 7800, tipoSom: "aspirado" },
    { nome: "Kit Turbo Forjado Completo 🐌", valor: 14000, bonusValor: 1.60, cvBase: 280, pressaoMax: 1.5, redline: 7500, tipoSom: "turbo" }
];

// Estado global para as simulações em tempo real e telemetria
let telemetryState = {
    ativo: false,
    indiceCarro: null,
    modo: null, // 'scanner' ou 'dyno'
    ignicaoLigada: false,
    pedalAcelerador: 0, // 0 a 100%
    rpmAtual: 0,
    pressaoTurboAtual: 0.0,
    temperaturaAgua: 25,
    tensaoBateria: 12.4,
    lambda: 1.0,
    avancoPonto: 12,
    velocidadeRolo: 0,
    potenciaAtual: 0,
    torqueAtual: 0,
    redline: 6500,
    maxTurbo: 0.0,
    tipoSomMotor: "original",
    intervaloId: null
};

// Gerenciador de Áudio Web (Web Audio API Synth & FX Engine Completo)
let audioCtx = null;
let motorOscillator = null;
let motorGain = null;
let motorFilter = null;
let ultimoAceleradorParaBlowoff = 0;

function inicializarAudioMotor() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (!motorOscillator) {
        motorOscillator = audioCtx.createOscillator();
        motorOscillator.type = 'sawtooth';
        motorOscillator.frequency.setValueAtTime(40, audioCtx.currentTime);

        motorGain = audioCtx.createGain();
        motorGain.gain.setValueAtTime(0, audioCtx.currentTime);

        motorFilter = audioCtx.createBiquadFilter();
        motorFilter.type = 'lowpass';
        motorFilter.frequency.setValueAtTime(300, audioCtx.currentTime);

        motorOscillator.connect(motorFilter);
        motorFilter.connect(motorGain);
        motorGain.connect(audioCtx.destination);
        motorOscillator.start();
    }
}

function atualizarSomMotor() {
    if (!audioCtx || !motorOscillator || !motorGain || !motorFilter) return;

    if (telemetryState.ignicaoLigada && telemetryState.ativo) {
        // Detecta alívio rápido de acelerador para disparar o chiado do turbo (Blow-off / Tssst) se tiver turbo
        if (ultimoAceleradorParaBlowoff > 50 && telemetryState.pedalAcelerador < 15 && telemetryState.maxTurbo > 0) {
            tocarSomBlowoff();
        }
        ultimoAceleradorParaBlowoff = telemetryState.pedalAcelerador;

        // Modifica a forma de onda e o corte com base no motor escolhido pelo jogador!
        let tipo = telemetryState.tipoSomMotor;
        
        if (tipo === "turbo") {
            motorOscillator.type = 'square'; // Som mais encorpado e metálico de turbo preparado
        } else if (tipo === "aspirado") {
            motorOscillator.type = 'sawtooth'; // Ronco forte e limpo
        } else if (tipo === "esportivo") {
            motorOscillator.type = 'triangle'; // Ronco encorpado
        } else {
            motorOscillator.type = 'sine'; // Original mais abafado e suave
        }

        // Detecta se o carro chegou perto do limite de giro (Redline) para o corte rápido
        let emCorte = telemetryState.rpmAtual >= (telemetryState.redline - 120);

        if (emCorte) {
            // Corte ultra-rápido (pulso menor e mais acelerado)
            let cortePulsante = Math.floor(Date.now() / 25) % 2 === 0;
            
            let freqCorte = 45 + ((telemetryState.redline - 150) / telemetryState.redline) * 220;
            motorOscillator.frequency.setTargetAtTime(cortePulsante ? freqCorte : 50, audioCtx.currentTime, 0.005);
            
            let ganhoCorte = cortePulsante ? (tipo === "turbo" || tipo === "aspirado" ? 0.25 : 0.18) : 0.01;
            motorGain.gain.setTargetAtTime(ganhoCorte, audioCtx.currentTime, 0.005);
        } else {
            let freqBase = 35 + (telemetryState.rpmAtual / telemetryState.redline) * (tipo === "aspirado" ? 220 : 180);
            motorOscillator.frequency.setTargetAtTime(freqBase, audioCtx.currentTime, 0.05);

            // Ajusta corte de frequência do filtro de acordo com a preparação do motor
            let freqFiltroAlvo = 300 + (telemetryState.pedalAcelerador / 100) * (tipo === "turbo" || tipo === "aspirado" ? 3500 : 1800);
            motorFilter.frequency.setTargetAtTime(freqFiltroAlvo, audioCtx.currentTime, 0.05);

            let ganhoAlvo = 0.06 + (telemetryState.pedalAcelerador / 100) * (tipo === "turbo" || tipo === "aspirado" ? 0.22 : 0.14);
            motorGain.gain.setTargetAtTime(ganhoAlvo, audioCtx.currentTime, 0.05);
        }
    } else {
        motorGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    }
}

// 1. Som de Partida do Motor (Crank / Motor de Arranque)
function tocarSomPartida() {
    if (!audioCtx) return;
    try {
        let duracao = 0.8;
        let bufferSize = audioCtx.sampleRate * duracao;
        let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        let data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            let t = i / audioCtx.sampleRate;
            data[i] = (Math.random() * 2 - 1) * Math.sin(t * 35 * Math.PI) * 0.5;
        }

        let noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        let filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, audioCtx.currentTime);

        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duracao);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start();
    } catch (e) {}
}

// 2. Alívio de Pressão do Turbo / Sopro (Blow-off / Tssst)
function tocarSomBlowoff() {
    if (!audioCtx) return;
    try {
        let duracao = 0.25;
        let bufferSize = audioCtx.sampleRate * duracao;
        let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        let data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        let noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        let filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4500, audioCtx.currentTime);
        filter.Q.setValueAtTime(4.0, audioCtx.currentTime);

        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracao);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start();
    } catch (e) {}
}

// 3. Pneus Cantando / Derrapando (Skid)
function tocarSomPneus() {
    if (!audioCtx) return;
    try {
        let duracao = 0.15;
        let bufferSize = audioCtx.sampleRate * duracao;
        let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        let data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.7;
        }

        let noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        let filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
        filter.Q.setValueAtTime(6.0, audioCtx.currentTime);

        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duracao);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start();
    } catch (e) {}
}

// 4. Buzina Esportiva (Horn)
function tocarBuzina() {
    if (!audioCtx) return;
    try {
        let osc1 = audioCtx.createOscillator();
        let osc2 = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(349.23, audioCtx.currentTime);
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(440.00, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

        let filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, audioCtx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.35);
        osc2.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
}

function desligarAudioMotor() {
    if (motorGain && audioCtx) {
        motorGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

// ===========================
// TELA PRINCIPAL DA OFICINA
// ===========================
function mostrarOficina(){
    pararTelemetria(); 

    if(!jogo.melhoriasOficina) {
        jogo.melhoriasOficina = { elevadorNivel: 1, ferramentasNivel: 1 };
    }
    if(!jogo.estatisticas) {
        jogo.estatisticas = { consertados: 0 };
    }

    let funcionarios = (jogo.empresa && jogo.empresa.funcionarios) ? jogo.empresa.funcionarios : 0;

    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">🔧</span>
            <div class="garagem-texto-titulo">
                <h1>OFICINA & TELEMETRIA AVANÇADA</h1>
                <p>Centro de Diagnóstico OBD-II em Tempo Real & Dinamômetro Inercial</p>
            </div>
        </div>
    </div>

    <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, #111827 0%, #0f172a 100%); border: 1px solid #1e293b;">
        <h3 style="margin-bottom: 10px; color: #38bdf8;">🏗️ Infraestrutura & Baías</h3>
        <hr style="border-color: #334155; margin: 8px 0 12px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; border: 1px solid #334155;">
                <span style="font-size: 0.8rem; color: #94a3b8;">ELEVADORES</span>
                <p style="font-size: 1.1rem; font-weight: bold; color: #fff; margin-top: 2px;">Nível ${jogo.melhoriasOficina.elevadorNivel}</p>
                <small style="color: #10b981;">${jogo.melhoriasOficina.elevadorNivel} Vagas simultâneas</small>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; border: 1px solid #334155;">
                <span style="font-size: 0.8rem; color: #94a3b8;">FERRAMENTARIA</span>
                <p style="font-size: 1.1rem; font-weight: bold; color: #fff; margin-top: 2px;">Nível ${jogo.melhoriasOficina.ferramentasNivel}</p>
                <small style="color: #f59e0b;">Equipe (${funcionarios} mecânicos) ativa</small>
            </div>
        </div>
         
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button onclick="melhorarElevador()" style="padding: 10px; background: #f59e0b; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                ⬆️ Upar Elevador <br><small>R$ ${(jogo.melhoriasOficina.elevadorNivel * 7500).toLocaleString("pt-BR")}</small>
            </button>
            <button onclick="melhorarFerramentas()" style="padding: 10px; background: #f59e0b; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                ⬆️ Upar Ferramentas <br><small>R$ ${(jogo.melhoriasOficina.ferramentasNivel * 5000).toLocaleString("pt-BR")}</small>
            </button>
        </div>
    </div>
    `;

    if(!jogo.carros || jogo.carros.length == 0){
        html += `
        <div class="card" style="text-align: center; padding: 30px; background: #0f172a; border: 1px solid #1e293b;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">📭</span>
            <p style="color: #94a3b8;">Sua oficina está vazia no momento.</p>
        </div>`;
        conteudo.innerHTML = html;
        return;
    }

    jogo.carros.forEach(function(carro, index){
        html += `
        <div class="card" style="margin-bottom: 15px; background: #0f172a; border: 1px solid #1e293b;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 3px;">🚗 ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}</h3>
                    <p style="color: #94a3b8; font-size: 0.85rem;">📅 Ano: ${carro.ano || 'N/D'} | 🛣️ KM: ${carro.km ? carro.km.toLocaleString("pt-BR") : "0"}</p>
                </div>
            </div>
             
            <div style="background: rgba(0,0,0,0.4); padding: 10px 12px; border-radius: 6px; border: 1px solid #334155; margin-bottom: 12px; font-size: 0.85rem; color: #cbd5e1;">
                <p style="margin-bottom: 4px;">🎨 Cor: <strong style="color:#fff">${carro.cor || "Original"}</strong></p>
                <p style="margin-bottom: 4px;">🕶️ Película: <strong style="color:#fff">${carro.pelicula || "Original"}</strong></p>
                <p style="margin-bottom: 4px;">🛞 Pneus: <strong style="color:#fff">${carro.pneus || "Original"}</strong></p>
                <p style="margin-bottom: 0;">🏎️ Motor: <strong style="color:#fff">${carro.motor || "Motor Original"}</strong></p>
            </div>
        `;

        if(carro.reparos && carro.reparos.length > 0){
            html += `<h4 style="color: #f59e0b; font-size: 0.9rem; margin-bottom: 6px;">⏳ Reparos em Andamento (Na baia)</h4>`;
            carro.reparos.forEach(function(reparo){
                html += `
                <div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.3); padding: 10px; border-radius: 6px; margin-bottom: 8px; font-size: 0.85rem;">
                    <strong>🔧 ${reparo.nome}</strong><br>
                    <span style="color: #94a3b8;">Custo: R$ ${reparo.valor.toLocaleString("pt-BR")}</span><br>
                    <span style="color: #f59e0b; font-weight: bold;">⏰ Tempo restante: ${reparo.dias} dia(s)</span>
                </div>
                `;
            });
        }

        if(carro.defeitos && carro.defeitos.length > 0){
            html += `<h4 style="color: #ef4444; font-size: 0.9rem; margin-bottom: 6px;">⚠️ Defeitos Identificados</h4>`;
            carro.defeitos.forEach(function(defeito, posicao){
                html += `
                <div style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); padding: 10px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #fca5a5; font-size: 0.85rem;">🔧 ${defeito.nome}</strong><br>
                        <span style="color: #94a3b8; font-size: 0.8rem;">Custo: R$ ${defeito.valor.toLocaleString("pt-BR")}</span>
                    </div>
                    <button onclick="iniciarReparo(${index}, ${posicao})" style="padding: 8px 12px; background: #ef4444; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                        🔧 Consertar
                    </button>
                </div>
                `;
            });
        }

        if((!carro.defeitos || carro.defeitos.length == 0) && (!carro.reparos || carro.reparos.length == 0)){
            html += `
            <div style="background: rgba(16,185,129,0.1); border: 1px solid #10b981; padding: 10px; border-radius: 6px; margin-bottom: 12px; text-align: center;">
                <span style="color:#10b981; font-weight: bold; font-size: 0.85rem;">✅ Veículo revisado e pronto para calibração ou venda!</span>
            </div>
             
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <button onclick="abrirEstetica(${index})" style="padding: 10px; background: #06b6d4; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                    🎨 Estética & Motor
                </button>
                <button onclick="iniciarScannerAoVivo(${index})" style="padding: 10px; background: #3b82f6; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                    💻 Scanner OBD Ao Vivo
                </button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button onclick="iniciarDynoAoVivo(${index})" style="padding: 10px; background: #10b981; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                    📈 Dinamômetro Dinâmico (Dyno Room)
                </button>
            </div>
            `;
        }

        html += `</div>`;
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

    let reducaoFerramentas = jogo.melhoriasOficina.ferramentasNivel - 1;
    let funcionarios = (jogo.empresa && jogo.empresa.funcionarios) ? jogo.empresa.funcionarios : 0;
    let reducaoEquipe = Math.floor(funcionarios / 2);

    let prazoBase = Math.floor(Math.random() * 4) + 3;
    let prazo = Math.max(1, prazoBase - reducaoFerramentas - reducaoEquipe);

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

    mostrarAlerta("🔧 Reparo iniciado", `${defeito.nome}\n⏳ Prazo: ${prazo} dia(s)\n(Equipe acelerou o serviço!)\nO veículo entrou na linha de montagem.`);
    mostrarOficina();
}

// ===========================================
// MOTOR DE TELEMETRIA AO VIVO & SIMULAÇÃO FÍSICA
// ===========================================

function iniciarScannerAoVivo(indiceCarro) {
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let motorObj = opcoesMotor.find(m => m.nome === carro.motor) || opcoesMotor[0];

    telemetryState = {
        ativo: true,
        indiceCarro: indiceCarro,
        modo: 'scanner',
        ignicaoLigada: false,
        pedalAcelerador: 0,
        rpmAtual: 0,
        pressaoTurboAtual: 0.0,
        temperaturaAgua: 25,
        tensaoBateria: 12.4,
        lambda: 1.0,
        avancoPonto: 12,
        velocidadeRolo: 0,
        potenciaAtual: 0,
        torqueAtual: 0,
        redline: motorObj.redline,
        maxTurbo: motorObj.pressaoMax,
        tipoSomMotor: motorObj.tipoSom
    };

    renderizarInterfaceScanner(carro);
    lancarLoopTelemetria();
}

function iniciarDynoAoVivo(indiceCarro) {
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let motorObj = opcoesMotor.find(m => m.nome === carro.motor) || opcoesMotor[0];

    telemetryState = {
        ativo: true,
        indiceCarro: indiceCarro,
        modo: 'dyno',
        ignicaoLigada: false,
        pedalAcelerador: 0,
        rpmAtual: 0,
        pressaoTurboAtual: 0.0,
        temperaturaAgua: 30,
        tensaoBateria: 12.4,
        lambda: 1.0,
        avancoPonto: 12,
        velocidadeRolo: 0,
        potenciaAtual: 0,
        torqueAtual: 0,
        redline: motorObj.redline,
        maxTurbo: motorObj.pressaoMax,
        tipoSomMotor: motorObj.tipoSom
    };

    renderizarInterfaceDyno(carro);
    lancarLoopTelemetria();
}

function pararTelemetria() {
    desligarAudioMotor();
    if (telemetryState.intervaloId) {
        clearInterval(telemetryState.intervaloId);
        telemetryState.intervaloId = null;
    }
    telemetryState.ativo = false;
}

function alternarIgnicao() {
    inicializarAudioMotor();
    telemetryState.ignicaoLigada = !telemetryState.ignicaoLigada;
    if (telemetryState.ignicaoLigada) {
        tocarSomPartida();
        telemetryState.rpmAtual = 850;
        telemetryState.tensaoBateria = 14.2; 
    } else {
        telemetryState.pedalAcelerador = 0;
        telemetryState.rpmAtual = 0;
        telemetryState.pressaoTurboAtual = 0;
        telemetryState.tensaoBateria = 12.4;
        let slider = document.getElementById("sliderAcelerador");
        if (slider) slider.value = 0;
        desligarAudioMotor();
    }
    atualizarElementosTelaTelemetria();
}

function setAcelerador(valor) {
    if (!telemetryState.ignicaoLigada) return;
    telemetryState.pedalAcelerador = Number(valor);
}

function lancarLoopTelemetria() {
    pararTelemetria();
    telemetryState.ativo = true;
    telemetryState.intervaloId = setInterval(() => {
        if (!telemetryState.ativo) return;

        if (telemetryState.ignicaoLigada) {
            let rpmAlvo = 850 + (telemetryState.pedalAcelerador / 100) * (telemetryState.redline - 850);
            
            if (telemetryState.rpmAtual < rpmAlvo) {
                telemetryState.rpmAtual += Math.max(150, (rpmAlvo - telemetryState.rpmAtual) * 0.25);
            } else if (telemetryState.rpmAtual > rpmAlvo) {
                telemetryState.rpmAtual -= Math.max(200, (telemetryState.rpmAtual - rpmAlvo) * 0.20);
            }

            if (telemetryState.rpmAtual > telemetryState.redline) {
                telemetryState.rpmAtual = telemetryState.redline - (Math.random() * 200);
            }

            if (telemetryState.temperaturaAgua < 90) {
                telemetryState.temperaturaAgua += 0.05;
            }

            let cargaFator = telemetryState.pedalAcelerador / 100;
            let rpmFator = telemetryState.rpmAtual / telemetryState.redline;
            let turboAlvo = telemetryState.maxTurbo * cargaFator * (rpmFator > 0.3 ? 1.0 : (rpmFator / 0.3));
            telemetryState.pressaoTurboAtual += (turboAlvo - telemetryState.pressaoTurboAtual) * 0.3;

            telemetryState.lambda = 0.85 + (0.15 * (1 - cargaFator)) + ((Math.random() - 0.5) * 0.04);
            telemetryState.avancoPonto = Math.round(32 - (cargaFator * 18) + ((Math.random() - 0.5) * 2));

            let torqueBaseMax = 22 + (telemetryState.maxTurbo * 25);
            let fatorCurvaTorque = Math.sin((telemetryState.rpmAtual / telemetryState.redline) * Math.PI * 0.8);
            if (fatorCurvaTorque < 0.2) fatorCurvaTorque = 0.2;

            telemetryState.torqueAtual = Math.round(torqueBaseMax * fatorCurvaTorque * (telemetryState.pedalAcelerador / 100));
            telemetryState.potenciaAtual = Math.round((telemetryState.torqueAtual * telemetryState.rpmAtual) / 5252);
            telemetryState.velocidadeRolo = Math.round((telemetryState.rpmAtual / telemetryState.redline) * 240);

            atualizarSomMotor();
        } else {
            if (telemetryState.temperaturaAgua > 25) telemetryState.temperaturaAgua -= 0.1;
            telemetryState.rpmAtual = 0;
            telemetryState.pressaoTurboAtual = 0;
            telemetryState.potenciaAtual = 0;
            telemetryState.torqueAtual = 0;
            telemetryState.velocidadeRolo = 0;
            desligarAudioMotor();
        }

        atualizarElementosTelaTelemetria();
    }, 80);
}

// ===========================
// RENDERIZAÇÃO DAS TELAS DE TELEMETRIA (HTML)
// ===========================

function renderizarInterfaceScanner(carro) {
    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">💻</span>
            <div class="garagem-texto-titulo">
                <h1>SCANNER OBD-II EM TEMPO REAL</h1>
                <p>Leitura de parâmetros diretos da Central (ECU): ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}</p>
            </div>
        </div>
    </div>

    <div class="card" style="margin-bottom: 20px; background: #080c14; border-color: #3b82f6; font-family: monospace;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 15px;">
            <div>
                <span style="font-size: 0.85rem; color: #94a3b8; display: block;">ESTADO DA IGNIÇÃO</span>
                <span id="txtStatusIgnicao" style="font-size: 1rem; font-weight: bold; color: #ef4444;">🔴 DESLIGADA</span>
            </div>
            <button onclick="alternarIgnicao()" id="btnIgnicao" style="padding: 10px 18px; background: #10b981; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                🔑 Virar Chave / Start
            </button>
        </div>

        <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                <span style="color: #94a3b8;">🕹️ PEDAL DO ACELERADOR (TPS)</span>
                <span id="txtValorAcelerador" style="color: #38bdf8; font-weight: bold;">0%</span>
            </div>
            <input type="range" min="0" max="100" value="0" id="sliderAcelerador" oninput="setAcelerador(this.value)" style="width: 100%; accent-color: #38bdf8; cursor: pointer;">
        </div>

        <h3 style="color: #38bdf8; margin-bottom: 12px; border-bottom: 1px dashed #1e293b; padding-bottom: 6px; font-size: 0.95rem;">📊 DADOS VITAIS DA ECU AO VIVO</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1e293b;">
                <span style="font-size: 0.75rem; color: #94a3b8; display: block;">ROTAÇÃO (RPM)</span>
                <span id="valRpm" style="font-size: 1.3rem; font-weight: bold; color: #10b981;">0 RPM</span>
            </div>
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1e293b;">
                <span style="font-size: 0.75rem; color: #94a3b8; display: block;">PRESSÃO DO TURBO</span>
                <span id="valTurbo" style="font-size: 1.3rem; font-weight: bold; color: #f59e0b;">0.00 Bar</span>
            </div>
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1e293b;">
                <span style="font-size: 0.75rem; color: #94a3b8; display: block;">TEMPERATURA DA ÁGUA</span>
                <span id="valTemp" style="font-size: 1.3rem; font-weight: bold; color: #38bdf8;">25°C</span>
            </div>
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1e293b;">
                <span style="font-size: 0.75rem; color: #94a3b8; display: block;">TENSÃO DA BATERIA</span>
                <span id="valBat" style="font-size: 1.3rem; font-weight: bold; color: #10b981;">12.4 V</span>
            </div>
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1e293b;">
                <span style="font-size: 0.75rem; color: #94a3b8; display: block;">SONDA LAMBDA (AFR)</span>
                <span id="valLambda" style="font-size: 1.3rem; font-weight: bold; color: #e2e8f0;">1.00</span>
            </div>
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #1e293b;">
                <span style="font-size: 0.75rem; color: #94a3b8; display: block;">AVANÇO DE IGNIÇÃO</span>
                <span id="valPonto" style="font-size: 1.3rem; font-weight: bold; color: #a855f7;">12°</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <button onclick="tocarBuzina()" style="padding: 10px; background: #f59e0b; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                📢 Tocar Buzina
            </button>
            <button onclick="tocarSomPneus()" style="padding: 10px; background: #38bdf8; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                🛞 Cantar Pneus
            </button>
        </div>

        <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); padding: 10px; border-radius: 6px; text-align: center;">
            <span style="color: #10b981; font-size: 0.8rem; font-weight: bold;">🔊 Som Dinâmico do Motor Ativo (Corte Rápido + Diferencial por Preparação)!</span>
        </div>
    </div>

    <button onclick="pararTelemetria(); mostrarOficina();" style="width:100%; padding:12px; background:#334155; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom: 20px;">
        ⬅️ Voltar para Oficina
    </button>
    `;

    conteudo.innerHTML = html;
    atualizarElementosTelaTelemetria();
}

function renderizarInterfaceDyno(carro) {
    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">📈</span>
            <div class="garagem-texto-titulo">
                <h1>DINAMÔMETRO INERCIAL (DYNO ROOM)</h1>
                <p>Banco de Prova em Tempo Real: ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}</p>
            </div>
        </div>
    </div>

    <div class="card" style="margin-bottom: 20px; background: #080c14; border-color: #10b981; font-family: monospace;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 15px;">
            <div>
                <span style="font-size: 0.85rem; color: #94a3b8; display: block;">MOTOR DO VEÍCULO</span>
                <span id="txtStatusIgnicao" style="font-size: 1rem; font-weight: bold; color: #ef4444;">🔴 DESLIGADO</span>
            </div>
            <button onclick="alternarIgnicao()" id="btnIgnicao" style="padding: 10px 18px; background: #10b981; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                🔑 Ligar Motor
            </button>
        </div>

        <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                <span style="color: #94a3b8;">🕹️ DOSAGEM DE ACELERAÇÃO (WOT)</span>
                <span id="txtValorAcelerador" style="color: #ef4444; font-weight: bold;">0%</span>
            </div>
            <input type="range" min="0" max="100" value="0" id="sliderAcelerador" oninput="setAcelerador(this.value)" style="width: 100%; accent-color: #ef4444; cursor: pointer;">
        </div>

        <div style="background: #020617; padding: 15px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 15px; text-align: center;">
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 2px;">ROTAÇÃO ATUAL NO ROLO</div>
            <div id="valRpm" style="font-size: 2.2rem; font-weight: bold; color: #38bdf8; margin-bottom: 10px;">0 RPM</div>
            
            <div style="width: 100%; background: #1e293b; height: 14px; border-radius: 7px; overflow: hidden; margin-bottom: 15px;">
                <div id="barraProgressoDyno" style="width: 0%; height: 100%; background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444); transition: width 0.05s linear;"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px;">
                    <span style="font-size: 0.7rem; color: #94a3b8; display: block;">VELOCIDADE</span>
                    <span id="valVelocidade" style="font-size: 1.1rem; font-weight: bold; color: #fff;">0 km/h</span>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px;">
                    <span style="font-size: 0.7rem; color: #94a3b8; display: block;">POTÊNCIA</span>
                    <span id="valPotencia" style="font-size: 1.1rem; font-weight: bold; color: #38bdf8;">0 CV</span>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px;">
                    <span style="font-size: 0.7rem; color: #94a3b8; display: block;">TORQUE</span>
                    <span id="valTorque" style="font-size: 1.1rem; font-weight: bold; color: #f59e0b;">0 kgfm</span>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <button onclick="tocarBuzina()" style="padding: 10px; background: #f59e0b; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                📢 Tocar Buzina
            </button>
            <button onclick="tocarSomPneus()" style="padding: 10px; background: #38bdf8; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                🛞 Cantar Pneus
            </button>
        </div>

        <div style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.3); padding: 10px; border-radius: 6px; text-align: center;">
            <span style="color: #60a5fa; font-size: 0.8rem;">🔊 Dica: Acelere até o corte rápido ou solte o acelerador para ouvir o chiado do turbo!</span>
        </div>
    </div>

    <button onclick="pararTelemetria(); mostrarOficina();" style="width:100%; padding:12px; background:#334155; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom: 20px;">
        ⬅️ Voltar para Oficina
    </button>
    `;

    conteudo.innerHTML = html;
    atualizarElementosTelaTelemetria();
}

function atualizarElementosTelaTelemetria() {
    if (!telemetryState.ativo) return;

    let txtIgn = document.getElementById("txtStatusIgnicao");
    let btnIgn = document.getElementById("btnIgnicao");
    let txtAcc = document.getElementById("txtValorAcelerador");

    if (txtIgn) {
        if (telemetryState.ignicaoLigada) {
            txtIgn.innerHTML = "🟢 LIGADO";
            txtIgn.style.color = "#10b981";
            if (btnIgn) btnIgn.innerText = "🛑 Desligar Motor";
        } else {
            txtIgn.innerHTML = "🔴 DESLIGADO";
            txtIgn.style.color = "#ef4444";
            if (btnIgn) btnIgn.innerText = "🔑 Ligar Motor";
        }
    }

    if (txtAcc) {
        txtAcc.innerText = Math.round(telemetryState.pedalAcelerador) + "%";
    }

    let elRpm = document.getElementById("valRpm");
    if (elRpm) elRpm.innerText = Math.round(telemetryState.rpmAtual).toLocaleString("pt-BR") + " RPM";

    let elTurbo = document.getElementById("valTurbo");
    let elTemp = document.getElementById("valTemp");
    let elBat = document.getElementById("valBat");
    let elLambda = document.getElementById("valLambda");
    let elPonto = document.getElementById("valPonto");

    if (elTurbo) elTurbo.innerText = telemetryState.pressaoTurboAtual.toFixed(2) + " Bar";
    if (elTemp) elTemp.innerText = Math.round(telemetryState.temperaturaAgua) + "°C";
    if (elBat) elBat.innerText = telemetryState.tensaoBateria.toFixed(1) + " V";
    if (elLambda) elLambda.innerText = telemetryState.lambda.toFixed(2);
    if (elPonto) elPonto.innerText = telemetryState.avancoPonto + "°";

    let elVel = document.getElementById("valVelocidade");
    let elPot = document.getElementById("valPotencia");
    let elTorq = document.getElementById("valTorque");
    let barraDyno = document.getElementById("barraProgressoDyno");

    if (elVel) elVel.innerText = telemetryState.velocidadeRolo + " km/h";
    if (elPot) elPot.innerText = telemetryState.potenciaAtual + " CV";
    if (elTorq) elTorq.innerText = telemetryState.torqueAtual + " kgfm";

    if (barraDyno) {
        let porcentagemGiro = (telemetryState.rpmAtual / telemetryState.redline) * 100;
        barraDyno.style.width = Math.min(100, Math.max(0, porcentagemGiro)) + "%";
    }
}

// ===========================
// PAINEL DE ESTÉTICA, PELÍCULA, PNEUS E MOTOR
// ===========================
function abrirEstetica(indiceCarro) {
    pararTelemetria();
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let html = `
    <div class="garagem-header" style="margin-bottom: 15px;">
        <div class="garagem-titulo">
            <span class="garagem-icone">🎨</span>
            <div class="garagem-texto-titulo">
                <h1>CUSTOMIZAÇÃO & ESTÉTICA</h1>
                <p>Personalize ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'} para valorizar o preço</p>
            </div>
        </div>
    </div>

    <div class="card" style="margin-bottom: 15px; background: #0f172a; border-color: #1e293b;">
        <h3 style="margin-bottom: 10px; color: #38bdf8;">🎨 Escolher Pintura:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    opcoesCoresPintura.forEach((cor, i) => {
        html += `
        <button onclick="aplicarPintura(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 6px; cursor:pointer;">
            <span>🎨 ${cor.nome}</span>
            <strong style="color: #10b981;">R$ ${cor.valor.toLocaleString("pt-BR")}</strong>
        </button>`;
    });

    html += `
        </div>
    </div>

    <div class="card" style="margin-bottom: 15px; background: #0f172a; border-color: #1e293b;">
        <h3 style="margin-bottom: 10px; color: #38bdf8;">🕶️ Película nos Vidros:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    opcoesPelicula.forEach((pelicula, i) => {
        html += `
        <button onclick="aplicarPelicula(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 6px; cursor:pointer;">
            <span>🕶️ ${pelicula.nome}</span>
            <strong style="color: #10b981;">R$ ${pelicula.valor.toLocaleString("pt-BR")}</strong>
        </button>`;
    });

    html += `
        </div>
    </div>

    <div class="card" style="margin-bottom: 15px; background: #0f172a; border-color: #1e293b;">
        <h3 style="margin-bottom: 10px; color: #38bdf8;">🛞 Troca de Pneus:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    opcoesPneus.forEach((pneu, i) => {
        html += `
        <button onclick="aplicarPneus(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 6px; cursor:pointer;">
            <span>🛞 ${pneu.nome}</span>
            <strong style="color: #10b981;">R$ ${pneu.valor.toLocaleString("pt-BR")}</strong>
        </button>`;
    });

    html += `
        </div>
    </div>

    <div class="card" style="margin-bottom: 20px; background: #0f172a; border-color: #1e293b;">
        <h3 style="margin-bottom: 10px; color: #f59e0b;">🏎️ Upgrade de Motor & Performance:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    opcoesMotor.forEach((motor, i) => {
        html += `
        <button onclick="aplicarMotor(${indiceCarro}, ${i})" style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: #1e293b; border: 1px solid #f59e0b; color: #fff; border-radius: 6px; cursor:pointer;">
            <span>🏎️ ${motor.nome}</span>
            <strong style="color: #10b981;">R$ ${motor.valor.toLocaleString("pt-BR")}</strong>
        </button>`;
    });

    html += `
        </div>
    </div>

    <button onclick="mostrarOficina()" style="width:100%; padding:12px; background:#334155; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom: 20px;">
        ⬅️ Voltar para Oficina
    </button>
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
    mostrarAlerta("✨ Pintura Concluída!", `Veículo pintado de ${corEscolhida.nome}!`);
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
    mostrarAlerta("🏎️ Upgrade de Motor Realizado!", `O possante agora tá equipado com: ${motorEscolhido.nome}!`);
    abrirEstetica(indiceCarro);
}

// ===========================
// AVANÇO DE DIAS DA OFICINA
// ===========================
function atualizarOficinaDia(){
    pararTelemetria();
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

                    mostrarAlerta("✅ Reparo concluído", `${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}\n🔧 ${reparo.nome}\nPronto para customização ou venda!`);
                    return false;
                }
                return true;
            });
        }
    });

    salvarJogo();
}