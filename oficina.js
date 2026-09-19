// ============================================================================
// OFICINA.JS V16.0 - DINAMÔMETRO FT-550 & LAYOUT OTIMIZADO 🏎️💨
// ============================================================================

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
    { nome: "Motor Original 1.6 8V", valor: 0, cvBase: 101, torqueBase: 15.4, pressaoMaxPermitida: 0.0, redline: 6300, tipoSom: "original", limiteResistencia: 160, forjado: false },
    { nome: "1.4 Turbo Remap Stg 2", valor: 4500, cvBase: 170, torqueBase: 25.5, pressaoMaxPermitida: 1.5, redline: 6800, tipoSom: "esportivo", limiteResistencia: 230, forjado: false },
    { nome: "2.0 16V Aspirado Preparado", valor: 8500, cvBase: 210, torqueBase: 23.0, pressaoMaxPermitida: 0.0, redline: 8200, tipoSom: "aspirado", limiteResistencia: 260, forjado: false },
    { nome: "2.0 20V Turbo Forjado Completo 🐌", valor: 18000, cvBase: 310, torqueBase: 42.0, pressaoMaxPermitida: 3.5, redline: 8200, tipoSom: "turbo", limiteResistencia: 750, forjado: true }
];

let telemetryState = {
    ativo: false,
    indiceCarro: null,
    carroQuebrado: false,
    ignicaoLigada: false,
    pedalAcelerador: 0,
    pressionandoPedal: false,
    rpmAtual: 0,
    pressaoTurboAtual: 0.0,
    pressaoOleoAtual: 0.0,
    temperaturaAgua: 35.0,
    tensaoBateria: 12.4,
    lambdaAtual: 1.0,
    avancoPontoAtual: 12,
    velocidadeRolo: 0,
    potenciaAtual: 0,
    torqueAtual: 0,
    redline: 6500,
    maxTurboConfigurado: 0.0,
    tipoSomMotor: "original",
    intervaloId: null,

    mapaECU: {
        combustivel: "gasolina",
        alvoLambda: 0.88,
        pontoIgricao: 18,
        pressaoWastegate: 0.0,
        corteRpm: 6500,
        twoStepAtivo: false,
        twoStepRpm: 4500,
        malhaFechada: true,
        tempoInjecaoMs: 4.2
    },

    puxadaDyna: {
        gravando: false,
        potenciaPico: 0,
        torquePico: 0
    }
};

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

    if (telemetryState.ignicaoLigada && telemetryState.ativo && !telemetryState.carroQuebrado) {
        if (ultimoAceleradorParaBlowoff > 50 && telemetryState.pedalAcelerador < 15 && telemetryState.mapaECU.pressaoWastegate > 0) {
            tocarSomBlowoff();
        }
        ultimoAceleradorParaBlowoff = telemetryState.pedalAcelerador;

        let tipo = telemetryState.tipoSomMotor;
        motorOscillator.type = tipo === "turbo" ? 'square' : (tipo === "aspirado" ? 'sawtooth' : 'sine');

        let limiteRpm = (telemetryState.mapaECU.twoStepAtivo && telemetryState.pedalAcelerador > 80 && !telemetryState.puxadaDyna.gravando) 
            ? telemetryState.mapaECU.twoStepRpm 
            : telemetryState.mapaECU.corteRpm;

        let emCorte = telemetryState.rpmAtual >= (limiteRpm - 100);

        if (emCorte) {
            let cortePulsante = Math.floor(Date.now() / 20) % 2 === 0;
            let freqCorte = 45 + ((limiteRpm - 150) / limiteRpm) * 220;
            motorOscillator.frequency.setTargetAtTime(cortePulsante ? freqCorte : 40, audioCtx.currentTime, 0.005);
            motorGain.gain.setTargetAtTime(cortePulsante ? 0.25 : 0.01, audioCtx.currentTime, 0.005);
        } else {
            let freqBase = 35 + (telemetryState.rpmAtual / telemetryState.mapaECU.corteRpm) * 200;
            motorOscillator.frequency.setTargetAtTime(freqBase, audioCtx.currentTime, 0.05);

            let freqFiltroAlvo = 300 + (telemetryState.pedalAcelerador / 100) * 3000;
            motorFilter.frequency.setTargetAtTime(freqFiltroAlvo, audioCtx.currentTime, 0.05);

            let ganhoAlvo = 0.05 + (telemetryState.pedalAcelerador / 100) * 0.20;
            motorGain.gain.setTargetAtTime(ganhoAlvo, audioCtx.currentTime, 0.05);
        }
    } else {
        motorGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function tocarSomBlowoff() {
    if (!audioCtx) return;
    try {
        let duracao = 0.25;
        let bufferSize = audioCtx.sampleRate * duracao;
        let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        let data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

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

function desligarAudioMotor() {
    if (motorGain && audioCtx) {
        motorGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function pararTelemetria() {
    telemetryState.ativo = false;
    if (telemetryState.intervaloId) {
        clearInterval(telemetryState.intervaloId);
        telemetryState.intervaloId = null;
    }
    desligarAudioMotor();
}

// ============================================================================
// TELA PRINCIPAL DA OFICINA
// ============================================================================
function mostrarOficina() {
    pararTelemetria(); 

    if (!jogo.melhoriasOficina) jogo.melhoriasOficina = { elevadorNivel: 1 };
    if (!jogo.estatisticas) jogo.estatisticas = { consertados: 0 };
    if (!jogo.reparosAndamento) jogo.reparosAndamento = [];

    verificarProgressoReparosPorDias();

    let funcionarios = (jogo.empresa && jogo.empresa.funcionarios) ? jogo.empresa.funcionarios : 0;
    
    let carrosOcupandoElevador = [...new Set(jogo.reparosAndamento.map(r => r.carroIndex))];
    let elevadoresTotais = jogo.melhoriasOficina.elevadorNivel;
    let elevadoresOcupados = carrosOcupandoElevador.length;
    let custoProximoElevador = jogo.melhoriasOficina.elevadorNivel * 3500; // Custo Rebalanceado

    let html = `
    <div id="painelOficinaContainer">
        <!-- HEADER DA OFICINA -->
        <div style="margin-bottom: 10px; background: #0f172a; padding: 10px 12px; border-radius: 8px; border: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="font-size: 0.95rem; color: #38bdf8; margin: 0; font-weight: 800;">🏎️ ACF PERFORMANCE</h1>
                <span style="font-size: 0.7rem; color: #64748b;">👷 ${funcionarios} Mecânicos</span>
            </div>
            <button onclick="melhorarElevador()" style="padding: 6px 10px; background: #2563eb; color: #fff; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem;">
                ⬆️ +1 Vaga (R$ ${custoProximoElevador.toLocaleString("pt-BR")})
            </button>
        </div>

        <!-- INFRAESTRUTURA COMPACTA DE ELEVADORES -->
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; color: #94a3b8; font-weight: bold;">🏗️ ELEVADORES</span>
            <span style="font-size: 0.8rem; font-weight: bold; color: ${elevadoresOcupados >= elevadoresTotais ? '#ef4444' : '#10b981'};">
                ${elevadoresOcupados} / ${elevadoresTotais} Ocupados
            </span>
        </div>
    `;

    // EXIBE OS CARROS NOS ELEVADORES
    if (jogo.reparosAndamento.length > 0) {
        html += `
        <div style="margin-bottom: 10px; background: #1e1b4b; border: 1px solid #4338ca; border-radius: 8px; padding: 10px;">
            <span style="color: #a5b4fc; font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 6px;">🚧 EM MANUTENÇÃO</span>
        `;

        jogo.reparosAndamento.forEach((rep) => {
            if (rep.tipo === 'expresso') {
                let perc = Math.min(100, Math.floor((rep.progressoAtual / rep.tempoTotalSegundos) * 100));
                html += `
                <div style="background: rgba(0,0,0,0.3); padding: 6px 8px; border-radius: 4px; margin-bottom: 4px; border: 1px solid #6366f1;">
                    <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#fff; margin-bottom:2px;">
                        <span>🚗 <strong>${rep.nomeCarro}</strong> (${rep.defeitoNome})</span>
                        <span style="color:#f59e0b; font-weight:bold;">⚡ Na Hora ${perc}%</span>
                    </div>
                    <div style="width: 100%; background: #334155; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="width: ${perc}%; background: #f59e0b; height: 100%; transition: width 0.3s;"></div>
                    </div>
                </div>
                `;
            } else {
                let diasRestantes = Math.max(0, rep.diaConclusao - (jogo.dia || 1));
                html += `
                <div style="background: rgba(0,0,0,0.3); padding: 6px 8px; border-radius: 4px; margin-bottom: 4px; border: 1px solid #4338ca; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#fff; font-size:0.7rem;">🚗 <strong>${rep.nomeCarro}</strong> - ${rep.defeitoNome}</span>
                    <span style="background:#312e81; color:#c7d2fe; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:bold;">
                        📅 Pronto em ${diasRestantes}DIA
                    </span>
                </div>
                `;
            }
        });

        html += `</div>`;
    }

    if (!jogo.carros || jogo.carros.length == 0) {
        html += `
        <div style="text-align: center; padding: 20px; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
            <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">Nenhum veículo no pátio no momento.</p>
        </div></div>`;
        conteudo.innerHTML = html;
        return;
    }

    // LISTAGEM DOS CARROS NO PÁTIO
    jogo.carros.forEach(function (carro, index) {
        let valorAgr = carro.valorAdicionadoRemap ? carro.valorAdicionadoRemap : 0;
        let temDefeito = carro.defeitos && carro.defeitos.length > 0;

        html += `
        <div style="margin-bottom: 10px; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px;">
            <!-- CABEÇALHO DO CARRO -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-bottom: 6px;">
                <div>
                    <strong style="color: #fff; font-size: 0.85rem;">🚗 ${carro.marca || ''} ${carro.modelo || carro.nome || 'Veículo'}</strong>
                    <small style="color: #64748b; font-size: 0.68rem; display: block;">Ano: ${carro.ano || 'N/D'} | KM: ${carro.km ? carro.km.toLocaleString("pt-BR") : "0"}</small>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button onclick="abrirEstetica(${index})" style="padding: 4px 8px; background: #1e293b; color: #38bdf8; border: 1px solid #334155; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 0.68rem;">
                        🎨 Customizar
                    </button>
                    <button onclick="abrirModuloInjecaoDyna(${index})" style="padding: 4px 8px; background: ${temDefeito ? '#334155' : '#10b981'}; color: ${temDefeito ? '#94a3b8' : '#000'}; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.68rem;">
                        🖥️ Dyno
                    </button>
                </div>
            </div>

            <!-- DETALHES DO CARRO -->
            <div style="display: flex; flex-wrap: wrap; gap: 4px; font-size: 0.65rem; margin-bottom: 8px;">
                <span style="background: #1e293b; color: #cbd5e1; padding: 2px 6px; border-radius: 3px;">🎨 ${carro.cor || "Original"}</span>
                <span style="background: #1e293b; color: #cbd5e1; padding: 2px 6px; border-radius: 3px;">🕶️ ${carro.pelicula || "Sem Insulfilm"}</span>
                <span style="background: #1e293b; color: #cbd5e1; padding: 2px 6px; border-radius: 3px;">🛞 ${carro.pneus || "Original"}</span>
                <span style="background: #1e293b; color: #cbd5e1; padding: 2px 6px; border-radius: 3px;">⚙️ ${carro.motor || "1.6 Original"}</span>
                ${valorAgr > 0 ? `<span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 2px 6px; border-radius: 3px; font-weight: bold;">+R$ ${valorAgr.toLocaleString("pt-BR")} Remap</span>` : ''}
            </div>
        `;

        // LISTA DE DEFEITOS
        if (temDefeito) {
            html += `<div style="background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 6px; padding: 6px;">`;
            carro.defeitos.forEach(function (defeito, posicao) {
                let diasEstimados = Math.max(1, Math.ceil(defeito.valor / 1500));
                let taxaExpressa = Math.round(defeito.valor * 0.35);

                html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <span style="color: #fca5a5; font-size: 0.72rem; font-weight: bold;">🔧 ${defeito.nome}</span>
                        <small style="color: #94a3b8; font-size: 0.65rem; display: block;">Peça: R$ ${defeito.valor.toLocaleString("pt-BR")}</small>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="agendarConsertoNormal(${index}, ${posicao}, ${diasEstimados})" style="padding: 4px 6px; background: #2563eb; color: #fff; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.65rem;">
                            🕒 ${diasEstimados} DIA
                        </button>
                        <button onclick="iniciarConsertoExpresso(${index}, ${posicao}, ${taxaExpressa})" style="padding: 4px 6px; background: #f59e0b; color: #000; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.65rem;">
                            ⚡ Express (+R$ ${taxaExpressa.toLocaleString("pt-BR")})
                        </button>
                    </div>
                </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;
    });

    html += `</div>`;
    conteudo.innerHTML = html;
}

function melhorarElevador() {
    let custo = jogo.melhoriasOficina.elevadorNivel * 3500;
    if (jogo.dinheiro < custo) return mostrarAlerta("💸 Saldo Insuficiente", "Você não tem saldo suficiente para comprar mais um elevador.");
    jogo.dinheiro -= custo;
    jogo.melhoriasOficina.elevadorNivel++;
    atualizarPainel(); salvarJogo(); mostrarOficina();
}

function validarVagaElevador(indiceCarro) {
    if (!jogo.reparosAndamento) jogo.reparosAndamento = [];

    let jaEstaNoElevador = jogo.reparosAndamento.some(r => r.carroIndex === indiceCarro);
    if (jaEstaNoElevador) return true;

    let carrosOcupando = [...new Set(jogo.reparosAndamento.map(r => r.carroIndex))];

    if (carrosOcupando.length >= jogo.melhoriasOficina.elevadorNivel) {
        mostrarAlerta(
            "🏗️ Elevadores Ocupados", 
            `Todos os seus ${jogo.melhoriasOficina.elevadorNivel} elevadores estão ocupados por outros veículos!\n\nEspere a manutenção terminar ou compre mais um elevador.`
        );
        return false;
    }
    return true;
}

function agendarConsertoNormal(indiceCarro, indiceDefeito, diasNecessarios) {
    if (!validarVagaElevador(indiceCarro)) return;

    let carro = jogo.carros[indiceCarro];
    let defeito = carro.defeitos[indiceDefeito];

    if (jogo.dinheiro < defeito.valor) {
        return mostrarAlerta("💸 Saldo Insuficiente", `Você precisa de R$ ${defeito.valor.toLocaleString("pt-BR")} para comprar as peças de "${defeito.nome}".`);
    }

    jogo.dinheiro -= defeito.valor;

    if (!carro.reparos) carro.reparos = [];
    carro.reparos.push({
        nome: defeito.nome,
        valor: defeito.valor
    });

    carro.defeitos.splice(indiceDefeito, 1);

    let diaAtual = jogo.dia || 1;
    jogo.reparosAndamento.push({
        tipo: "normal",
        carroIndex: indiceCarro,
        nomeCarro: `${carro.marca} ${carro.modelo || carro.nome}`,
        defeitoNome: defeito.nome,
        valor: defeito.valor,
        diaConclusao: diaAtual + diasNecessarios
    });

    atualizarPainel();
    salvarJogo();
    mostrarOficina();

    mostrarAlerta("🕒 Serviço Agendado", `O veículo entrou no elevador. O conserto de "${defeito.nome}" ficará pronto em ${diasNecessarios} dia(s).`);
}

function iniciarConsertoExpresso(indiceCarro, indiceDefeito, taxaUrgencia) {
    if (!validarVagaElevador(indiceCarro)) return;

    let carro = jogo.carros[indiceCarro];
    let defeito = carro.defeitos[indiceDefeito];
    let custoTotal = defeito.valor + taxaUrgencia;

    if (jogo.dinheiro < custoTotal) {
        return mostrarAlerta("💸 Saldo Insuficiente", `Você precisa de R$ ${custoTotal.toLocaleString("pt-BR")} (Peça: R$ ${defeito.valor.toLocaleString("pt-BR")} + Taxa Expresso: R$ ${taxaUrgencia.toLocaleString("pt-BR")}).`);
    }

    jogo.dinheiro -= custoTotal;

    if (!carro.reparos) carro.reparos = [];
    carro.reparos.push({
        nome: `${defeito.nome} (Express)`,
        valor: custoTotal
    });

    carro.defeitos.splice(indiceDefeito, 1);

    let tempoSegundos = 60;

    let objetoReparo = {
        tipo: "expresso",
        carroIndex: indiceCarro,
        nomeCarro: `${carro.marca} ${carro.modelo || carro.nome}`,
        defeitoNome: defeito.nome,
        progressoAtual: 0,
        tempoTotalSegundos: tempoSegundos
    };

    jogo.reparosAndamento.push(objetoReparo);

    atualizarPainel();
    salvarJogo();
    mostrarOficina();

    let timer = setInterval(() => {
        objetoReparo.progressoAtual += 1;
        
        if (objetoReparo.progressoAtual >= objetoReparo.tempoTotalSegundos) {
            clearInterval(timer);
            let idxRemover = jogo.reparosAndamento.indexOf(objetoReparo);
            if (idxRemover !== -1) jogo.reparosAndamento.splice(idxRemover, 1);

            if (jogo.estatisticas) jogo.estatisticas.consertados = (jogo.estatisticas.consertados || 0) + 1;
            
            atualizarPainel();
            salvarJogo();
            
            // CORREÇÃO: Só força o recarregamento se o usuário ESTIVER VISIVELMENTE no painel da oficina
            if (document.getElementById("painelOficinaContainer") !== null) { 
                mostrarOficina(); 
            }
            mostrarAlerta("⚡ Concluído!", `O conserto expresso de "${defeito.nome}" no ${carro.marca} ${carro.modelo || carro.nome} foi finalizado!`);
        } else {
            // CORREÇÃO: Só atualiza progresso visualmente se o usuário estiver na tela da oficina
            if (document.getElementById("painelOficinaContainer") !== null) {
                mostrarOficina();
            }
        }
    }, 1000);
}

function verificarProgressoReparosPorDias() {
    if (!jogo.reparosAndamento) return;
    let diaAtual = jogo.dia || 1;

    for (let i = jogo.reparosAndamento.length - 1; i >= 0; i--) {
        let rep = jogo.reparosAndamento[i];
        if (rep.tipo === "normal" && diaAtual >= rep.diaConclusao) {
            if (jogo.estatisticas) jogo.estatisticas.consertados = (jogo.estatisticas.consertados || 0) + 1;
            jogo.reparosAndamento.splice(i, 1);
        }
    }
}

// ============================================================================
// CUSTOMIZAÇÃO ESTÉTICA
// ============================================================================
function abrirEstetica(indiceCarro) {
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <button onclick="mostrarOficina()" style="padding: 5px 10px; background: #334155; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: bold;">
            ⬅️ Voltar
        </button>
        <h2 style="color: #38bdf8; font-size: 0.95rem; margin: 0;">🎨 CUSTOMIZAÇÃO: ${carro.marca || ''} ${carro.modelo || carro.nome}</h2>
    </div>

    <div class="card" style="margin-bottom: 10px; background: #0f172a; border: 1px solid #1e293b; padding: 10px; border-radius: 8px;">
        <h3 style="color: #94a3b8; font-size: 0.8rem; margin: 0 0 8px 0; text-transform: uppercase;">Pintura / Funilaria</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
    `;

    opcoesCoresPintura.forEach(cor => {
        html += `
            <button onclick="aplicarPintura(${indiceCarro}, '${cor.nome}', ${cor.valor})" style="padding: 6px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; text-align: left; cursor: pointer;">
                <div style="color: #38bdf8; font-size: 0.75rem; font-weight: bold;">${cor.nome}</div>
                <small style="color: #64748b; font-size: 0.68rem;">R$ ${cor.valor.toLocaleString("pt-BR")}</small>
            </button>
        `;
    });

    html += `</div></div>

    <div class="card" style="margin-bottom: 10px; background: #0f172a; border: 1px solid #1e293b; padding: 10px; border-radius: 8px;">
        <h3 style="color: #94a3b8; font-size: 0.8rem; margin: 0 0 8px 0; text-transform: uppercase;">Películas (Insulfilm)</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
    `;

    opcoesPelicula.forEach(p => {
        html += `
            <button onclick="aplicarPelicula(${indiceCarro}, '${p.nome}', ${p.valor})" style="padding: 6px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; text-align: left; cursor: pointer;">
                <div style="color: #38bdf8; font-size: 0.75rem; font-weight: bold;">${p.nome}</div>
                <small style="color: #64748b; font-size: 0.68rem;">R$ ${p.valor.toLocaleString("pt-BR")}</small>
            </button>
        `;
    });

    html += `</div></div>

    <div class="card" style="margin-bottom: 10px; background: #0f172a; border: 1px solid #1e293b; padding: 10px; border-radius: 8px;">
        <h3 style="color: #94a3b8; font-size: 0.8rem; margin: 0 0 8px 0; text-transform: uppercase;">Conjuntos de Pneus</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
    `;

    opcoesPneus.forEach(pn => {
        html += `
            <button onclick="aplicarPneus(${indiceCarro}, '${pn.nome}', ${pn.valor})" style="padding: 6px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; text-align: left; cursor: pointer;">
                <div style="color: #38bdf8; font-size: 0.75rem; font-weight: bold;">${pn.nome}</div>
                <small style="color: #64748b; font-size: 0.68rem;">R$ ${pn.valor.toLocaleString("pt-BR")}</small>
            </button>
        `;
    });

    html += `</div></div>

    <div class="card" style="margin-bottom: 10px; background: #0f172a; border: 1px solid #1e293b; padding: 10px; border-radius: 8px;">
        <h3 style="color: #94a3b8; font-size: 0.8rem; margin: 0 0 8px 0; text-transform: uppercase;">Engine Swap & Preparação</h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
    `;

    opcoesMotor.forEach(m => {
        html += `
            <button onclick="aplicarMotor(${indiceCarro}, '${m.nome}', ${m.valor})" style="padding: 6px 8px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="color: #f59e0b; font-size: 0.75rem; font-weight: bold;">${m.nome}</div>
                    <small style="color: #64748b; font-size: 0.68rem;">Base: ${m.cvBase} HP | ${m.torqueBase} Kgfm</small>
                </div>
                <span style="color: #10b981; font-size: 0.75rem; font-weight: bold;">R$ ${m.valor.toLocaleString("pt-BR")}</span>
            </button>
        `;
    });

    html += `</div></div>`;
    conteudo.innerHTML = html;
}

function aplicarPintura(indiceCarro, nomeCor, valor) {
    if (jogo.dinheiro < valor) return mostrarAlerta("💸 Saldo Insuficiente", "Sem dinheiro para pintar.");
    jogo.dinheiro -= valor;
    jogo.carros[indiceCarro].cor = nomeCor;
    atualizarPainel(); salvarJogo(); abrirEstetica(indiceCarro);
}

function aplicarPelicula(indiceCarro, nomePelicula, valor) {
    if (jogo.dinheiro < valor) return mostrarAlerta("💸 Saldo Insuficiente", "Sem dinheiro para película.");
    jogo.dinheiro -= valor;
    jogo.carros[indiceCarro].pelicula = nomePelicula;
    atualizarPainel(); salvarJogo(); abrirEstetica(indiceCarro);
}

function aplicarPneus(indiceCarro, nomePneus, valor) {
    if (jogo.dinheiro < valor) return mostrarAlerta("💸 Saldo Insuficiente", "Sem dinheiro para pneus.");
    jogo.dinheiro -= valor;
    jogo.carros[indiceCarro].pneus = nomePneus;
    atualizarPainel(); salvarJogo(); abrirEstetica(indiceCarro);
}

function aplicarMotor(indiceCarro, nomeMotor, valor) {
    if (jogo.dinheiro < valor) return mostrarAlerta("💸 Saldo Insuficiente", "Sem dinheiro para troca de motor.");
    jogo.dinheiro -= valor;
    jogo.carros[indiceCarro].motor = nomeMotor;
    delete jogo.carros[indiceCarro].mapaEcu;
    delete jogo.carros[indiceCarro].valorAdicionadoRemap;
    atualizarPainel(); salvarJogo(); abrirEstetica(indiceCarro);
}

// ============================================================================
// DINAMÔMETRO COMPLETO COM REMAP DA ECU
// ============================================================================
function abrirModuloInjecaoDyna(indiceCarro) {
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let motorObj = opcoesMotor.find(m => m.nome === carro.motor) || opcoesMotor[0];
    let temDefeito = carro.defeitos && carro.defeitos.length > 0;

    if (!carro.mapaEcu) {
        carro.mapaEcu = {
            combustivel: "gasolina",
            alvoLambda: 0.88,
            pontoIgricao: 18,
            pressaoWastegate: motorObj.pressaoMaxPermitida > 0 ? 0.8 : 0.0,
            corteRpm: motorObj.redline,
            twoStepAtivo: false,
            twoStepRpm: 4500,
            malhaFechada: true,
            tempoInjecaoMs: 4.2
        };
    }

    telemetryState = {
        ativo: true,
        indiceCarro: indiceCarro,
        carroQuebrado: temDefeito,
        ignicaoLigada: false,
        pedalAcelerador: 0,
        pressionandoPedal: false,
        rpmAtual: 0,
        pressaoTurboAtual: 0.0,
        pressaoOleoAtual: 0.0,
        temperaturaAgua: 35.0,
        tensaoBateria: 12.4,
        lambdaAtual: 1.0,
        avancoPontoAtual: carro.mapaEcu.pontoIgricao,
        velocidadeRolo: 0,
        potenciaAtual: 0,
        torqueAtual: 0,
        redline: motorObj.redline,
        maxTurboConfigurado: motorObj.pressaoMaxPermitida,
        tipoSomMotor: motorObj.tipoSom,
        intervaloId: null,

        mapaECU: { ...carro.mapaEcu },

        puxadaDyna: {
            gravando: false,
            potenciaPico: 0,
            torquePico: 0
        }
    };

    renderizarInterfaceIntegrada(carro, motorObj);
    lancarLoopTelemetria();
}

function renderizarInterfaceIntegrada(carro, motorObj) {
    let quebrado = telemetryState.carroQuebrado;

    let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <button onclick="mostrarOficina()" style="padding: 4px 8px; background: #334155; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem; font-weight: bold;">
            ⬅️ Sair do Dyno
        </button>
        <div style="font-size: 0.8rem; font-weight: 800; color: #10b981;">ACF DYNOCENTER FT-550</div>
    </div>

    <!-- PAINEL DIGITAL FT-550 -->
    <div style="background: #000; border: 2px solid #1e293b; border-radius: 8px; padding: 10px; margin-bottom: 10px; font-family: monospace;">
        <!-- SHIFT LIGHT BAR -->
        <div style="display: flex; gap: 3px; margin-bottom: 8px; height: 6px;" id="shiftLightBar">
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
            <div style="flex:1; background:#1e293b; border-radius:1px;" class="led"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
                <span style="color: #64748b; font-size: 0.65rem; display: block;">ECU MAP: <strong style="color:#fff" id="lblCombustivelAct">${telemetryState.mapaECU.combustivel.toUpperCase()}</strong></span>
                <span id="txtAlertaFt" style="color: ${quebrado ? '#ef4444' : '#10b981'}; font-weight: bold; font-size: 0.7rem;">
                    ${quebrado ? '🚨 MOTOR DANIFICADO' : 'SYSTEM: READY'}
                </span>
            </div>
            
            <button onclick="alternarIgnicao()" id="btnIgnicao" ${quebrado ? 'disabled' : ''} style="padding: 5px 10px; background: ${quebrado ? '#475569' : '#10b981'}; color: #000; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem;">
                ${quebrado ? 'BLOQUEADO' : '🔑 IGNIÇÃO'}
            </button>
        </div>

        <!-- TELEMETRIA EM TEMPO REAL -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 6px;">
            <div style="background: #090d16; padding: 4px; border-radius: 4px; border: 1px solid #1e293b; text-align: center;">
                <span style="font-size: 0.55rem; color: #64748b; display: block;">RPM</span>
                <span id="ftRpm" style="font-size: 1.1rem; color: #38bdf8; font-weight: bold;">0</span>
            </div>
            <div style="background: #090d16; padding: 4px; border-radius: 4px; border: 1px solid #1e293b; text-align: center;">
                <span style="font-size: 0.55rem; color: #64748b; display: block;">TURBO (BAR)</span>
                <span id="ftTurbo" style="font-size: 1.1rem; color: #f59e0b; font-weight: bold;">0.00</span>
            </div>
            <div style="background: #090d16; padding: 4px; border-radius: 4px; border: 1px solid #1e293b; text-align: center;">
                <span style="font-size: 0.55rem; color: #64748b; display: block;">LAMBDA</span>
                <span id="ftLambda" style="font-size: 1.1rem; color: #10b981; font-weight: bold;">1.00</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-bottom: 8px;">
            <div style="background: #090d16; padding: 4px; border-radius: 4px; border: 1px solid #1e293b; text-align: center;">
                <span style="font-size: 0.55rem; color: #64748b; display: block;">POTÊNCIA ATUAL</span>
                <span id="ftPotencia" style="font-size: 1rem; color: #ef4444; font-weight: bold;">0 HP</span>
            </div>
            <div style="background: #090d16; padding: 4px; border-radius: 4px; border: 1px solid #1e293b; text-align: center;">
                <span style="font-size: 0.55rem; color: #64748b; display: block;">TORQUE ATUAL</span>
                <span id="ftTorque" style="font-size: 1rem; color: #8b5cf6; font-weight: bold;">0.0 Kgfm</span>
            </div>
        </div>

        <!-- POTÊNCIA MÁXIMA DE PICO -->
        <div style="background: #111827; border: 1px solid #374151; border-radius: 4px; padding: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.65rem; color: #9ca3af;">PICO DE PUXADA:</span>
            <span id="ftPicoDyna" style="font-size: 0.75rem; color: #facc15; font-weight: bold;">0 HP / 0.0 Kgfm</span>
        </div>

        <!-- CONTROLE DO ACELERADOR -->
        <div style="margin-top: 8px; background: #090d16; padding: 8px; border-radius: 4px; border: 1px solid #1e293b;">
            <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: #94a3b8; margin-bottom: 4px;">
                <span>ACELERADOR</span>
                <span id="lblPedal">%</span>
            </div>
            <input type="range" id="pedalAcelerador" min="0" max="100" value="0" style="width: 100%; accent-color: #ef4444;" oninput="ajustarPedal(this.value)">
            
            <button id="btnPuxadaDyna" onmousedown="pressionarAceleradorMaximo()" onmouseup="soltarAceleradorMaximo()" ontouchstart="pressionarAceleradorMaximo()" ontouchend="soltarAceleradorMaximo()" style="width: 100%; margin-top: 6px; padding: 8px; background: #ef4444; color: #fff; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                🏎️ SEGURE PARA ACELERAR TUDO (PUXADA)
            </button>
        </div>
    </div>

    <!-- AJUSTES AVANÇADOS DA ECU -->
    <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px;">
        <h3 style="color: #38bdf8; font-size: 0.8rem; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 4px;">🛠️ MAPEAMENTO DA ECU & TURBO</h3>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px;">
            <div>
                <label style="font-size: 0.65rem; color: #94a3b8; display: block;">Combustível</label>
                <select id="cfgCombustivel" onchange="alterarConfigEcu()" style="width: 100%; padding: 4px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-size: 0.7rem;">
                    <option value="gasolina" ${telemetryState.mapaECU.combustivel === 'gasolina' ? 'selected' : ''}>Gasolina (Stg 1)</option>
                    <option value="etanol" ${telemetryState.mapaECU.combustivel === 'etanol' ? 'selected' : ''}>Etanol E100 (Stg 2/3)</option>
                </select>
            </div>

            <div>
                <label style="font-size: 0.65rem; color: #94a3b8; display: block;">Wastegate / Pressão Turbo</label>
                <input type="number" id="cfgWastegate" step="0.1" min="0" max="${motorObj.pressaoMaxPermitida}" value="${telemetryState.mapaECU.pressaoWastegate}" onchange="alterarConfigEcu()" style="width: 100%; padding: 4px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-size: 0.7rem;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px;">
            <div>
                <label style="font-size: 0.65rem; color: #94a3b8; display: block;">Alvo Lambda (Mistura)</label>
                <input type="number" id="cfgLambda" step="0.01" min="0.70" max="1.10" value="${telemetryState.mapaECU.alvoLambda}" onchange="alterarConfigEcu()" style="width: 100%; padding: 4px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-size: 0.7rem;">
            </div>

            <div>
                <label style="font-size: 0.65rem; color: #94a3b8; display: block;">Avanço de Ignição (°)</label>
                <input type="number" id="cfgPonto" step="1" min="5" max="32" value="${telemetryState.mapaECU.pontoIgricao}" onchange="alterarConfigEcu()" style="width: 100%; padding: 4px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-size: 0.7rem;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px;">
            <div>
                <label style="font-size: 0.65rem; color: #94a3b8; display: block;">Corte de Giro (RPM)</label>
                <input type="number" id="cfgCorteRpm" step="100" min="5000" max="${motorObj.redline}" value="${telemetryState.mapaECU.corteRpm}" onchange="alterarConfigEcu()" style="width: 100%; padding: 4px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-size: 0.7rem;">
            </div>

            <div>
                <label style="font-size: 0.65rem; color: #94a3b8; display: block;">Two-Step (RPM)</label>
                <input type="number" id="cfgTwoStepRpm" step="100" min="2500" max="6000" value="${telemetryState.mapaECU.twoStepRpm}" onchange="alterarConfigEcu()" style="width: 100%; padding: 4px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-size: 0.7rem;">
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <label style="font-size: 0.7rem; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="cfgTwoStepAtivo" ${telemetryState.mapaECU.twoStepAtivo ? 'checked' : ''} onchange="alterarConfigEcu()"> Activar Two-Step (Launch Control)
            </label>

            <button onclick="salvarRemapCarro(${telemetryState.indiceCarro})" style="padding: 6px 12px; background: #10b981; color: #000; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem;">
                💾 Gravacao de Mapa ECU
            </button>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
}

function alternarIgnicao() {
    inicializarAudioMotor();
    telemetryState.ignicaoLigada = !telemetryState.ignicaoLigada;
    let btn = document.getElementById("btnIgnicao");
    if (btn) {
        btn.innerText = telemetryState.ignicaoLigada ? "🛑 DESLIGAR" : "🔑 IGNIÇÃO";
        btn.style.background = telemetryState.ignicaoLigada ? "#ef4444" : "#10b981";
    }
}

function ajustarPedal(val) {
    telemetryState.pedalAcelerador = parseInt(val);
    let lbl = document.getElementById("lblPedal");
    if (lbl) lbl.innerText = val + "%";
}

function pressionarAceleradorMaximo() {
    telemetryState.pressionandoPedal = true;
    telemetryState.puxadaDyna.gravando = true;
    ajustarPedal(100);
}

function soltarAceleradorMaximo() {
    telemetryState.pressionandoPedal = false;
    ajustarPedal(0);
}

function alterarConfigEcu() {
    let comb = document.getElementById("cfgCombustivel").value;
    let wg = parseFloat(document.getElementById("cfgWastegate").value) || 0.0;
    let lmb = parseFloat(document.getElementById("cfgLambda").value) || 0.88;
    let pto = parseInt(document.getElementById("cfgPonto").value) || 18;
    let crt = parseInt(document.getElementById("cfgCorteRpm").value) || 6500;
    let tsRpm = parseInt(document.getElementById("cfgTwoStepRpm").value) || 4500;
    let tsAct = document.getElementById("cfgTwoStepAtivo").checked;

    telemetryState.mapaECU.combustivel = comb;
    telemetryState.mapaECU.pressaoWastegate = wg;
    telemetryState.mapaECU.alvoLambda = lmb;
    telemetryState.mapaECU.pontoIgricao = pto;
    telemetryState.mapaECU.corteRpm = crt;
    telemetryState.mapaECU.twoStepRpm = tsRpm;
    telemetryState.mapaECU.twoStepAtivo = tsAct;

    let lblComb = document.getElementById("lblCombustivelAct");
    if (lblComb) lblComb.innerText = comb.toUpperCase();
}

function salvarRemapCarro(index) {
    let carro = jogo.carros[index];
    if (!carro) return;

    carro.mapaEcu = { ...telemetryState.mapaECU };
    
    // Calcula o valor agregado ao preço de revenda do veículo
    let bonusRemap = Math.round((telemetryState.puxadaDyna.potenciaPico * 45) + (telemetryState.mapaECU.pressaoWastegate * 2000));
    carro.valorAdicionadoRemap = bonusRemap;

    salvarJogo();
    mostrarAlerta("💾 ECU Gravação Concluída", `O mapa foi gravado na ECU com sucesso!\n\nValorização estimada no veículo: +R$ ${bonusRemap.toLocaleString("pt-BR")}`);
}

// ============================================================================
// LOOP DE SIMULAÇÃO DE TELEMETRIA
// ============================================================================
function lancarLoopTelemetria() {
    if (telemetryState.intervaloId) clearInterval(telemetryState.intervaloId);

    telemetryState.intervaloId = setInterval(() => {
        if (!telemetryState.ativo) return;

        let motorObj = opcoesMotor.find(m => m.nome === (jogo.carros[telemetryState.indiceCarro] ? jogo.carros[telemetryState.indiceCarro].motor : '')) || opcoesMotor[0];

        if (telemetryState.ignicaoLigada && !telemetryState.carroQuebrado) {
            let alvoRpm = 900;
            let ped = telemetryState.pedalAcelerador;

            let limiteCorte = (telemetryState.mapaECU.twoStepAtivo && ped > 80 && !telemetryState.puxadaDyna.gravando)
                ? telemetryState.mapaECU.twoStepRpm
                : telemetryState.mapaECU.corteRpm;

            if (ped > 0) {
                alvoRpm = 900 + ((limiteCorte - 900) * (ped / 100));
            }

            // Suavização do RPM
            telemetryState.rpmAtual += (alvoRpm - telemetryState.rpmAtual) * 0.15;

            // Simulação de Pressão de Turbo
            if (telemetryState.mapaECU.pressaoWastegate > 0 && telemetryState.rpmAtual > 2200) {
                let fatorTurbo = Math.min(1.0, (telemetryState.rpmAtual - 2000) / 3000);
                let pressaoAlvo = telemetryState.mapaECU.pressaoWastegate * fatorTurbo * (ped / 100);
                telemetryState.pressaoTurboAtual += (pressaoAlvo - telemetryState.pressaoTurboAtual) * 0.2;
            } else {
                telemetryState.pressaoTurboAtual *= 0.8;
            }

            // Cálculo Dynamometrico da Potência / Torque
            let fatorEtanol = telemetryState.mapaECU.combustivel === 'etanol' ? 1.15 : 1.0;
            let cvBase = motorObj.cvBase * fatorEtanol;
            let tqBase = motorObj.torqueBase * fatorEtanol;

            let ganhoTurboCv = telemetryState.pressaoTurboAtual * 70;
            let ganhoTurboTq = telemetryState.pressaoTurboAtual * 10;

            let curvaRpm = Math.sin((telemetryState.rpmAtual / telemetryState.mapaECU.corteRpm) * Math.PI);
            telemetryState.potenciaAtual = Math.max(0, Math.round((cvBase + ganhoTurboCv) * curvaRpm * (ped / 100)));
            telemetryState.torqueAtual = Math.max(0, parseFloat(((tqBase + ganhoTurboTq) * curvaRpm * (ped / 100)).toFixed(1)));

            // Registrar Pico
            if (telemetryState.potenciaAtual > telemetryState.puxadaDyna.potenciaPico) {
                telemetryState.puxadaDyna.potenciaPico = telemetryState.potenciaAtual;
                telemetryState.puxadaDyna.torquePico = telemetryState.torqueAtual;
            }

            // Riscos de Quebra do Motor
            let pressaoExcessiva = telemetryState.pressaoTurboAtual > (motorObj.limiteResistencia / 100);
            let pontoMuitoAvancado = telemetryState.mapaECU.pontoIgricao > 26 && telemetryState.mapaECU.combustivel === 'gasolina';

            if ((pressaoExcessiva || pontoMuitoAvancado) && ped > 90 && Math.random() < 0.03) {
                telemetryState.carroQuebrado = true;
                telemetryState.ignicaoLigada = false;
                
                // Adiciona defeito de motor quebrado no carro
                let carro = jogo.carros[telemetryState.indiceCarro];
                if (carro) {
                    if (!carro.defeitos) carro.defeitos = [];
                    carro.defeitos.push({ nome: "Motor Fundido / Biela Quebrada", valor: 6500 });
                }
                salvarJogo();
            }

            // Mistura Lambda
            telemetryState.lambdaAtual = telemetryState.mapaECU.alvoLambda + ((Math.random() - 0.5) * 0.02);
        } else {
            telemetryState.rpmAtual *= 0.7;
            telemetryState.pressaoTurboAtual *= 0.5;
            telemetryState.potenciaAtual = 0;
            telemetryState.torqueAtual = 0;
            telemetryState.lambdaAtual = 1.0;
        }

        atualizarSomMotor();
        atualizarPainelDynoDOM();
    }, 50);
}

function atualizarPainelDynoDOM() {
    let elRpm = document.getElementById("ftRpm");
    let elTurbo = document.getElementById("ftTurbo");
    let elLambda = document.getElementById("ftLambda");
    let elPot = document.getElementById("ftPotencia");
    let elTorq = document.getElementById("ftTorque");
    let elPico = document.getElementById("ftPicoDyna");
    let elAlerta = document.getElementById("txtAlertaFt");

    if (elRpm) elRpm.innerText = Math.round(telemetryState.rpmAtual);
    if (elTurbo) elTurbo.innerText = telemetryState.pressaoTurboAtual.toFixed(2);
    if (elLambda) elLambda.innerText = telemetryState.lambdaAtual.toFixed(2);
    if (elPot) elPot.innerText = telemetryState.potenciaAtual + " HP";
    if (elTorq) elTorq.innerText = telemetryState.torqueAtual.toFixed(1) + " Kgfm";
    if (elPico) elPico.innerText = `${telemetryState.puxadaDyna.potenciaPico} HP / ${telemetryState.puxadaDyna.torquePico.toFixed(1)} Kgfm`;

    if (elAlerta && telemetryState.carroQuebrado) {
        elAlerta.innerText = "🚨 MOTOR DANIFICADO / QUEBRADO";
        elAlerta.style.color = "#ef4444";
    }

    // Shift light leds
    let leds = document.querySelectorAll("#shiftLightBar .led");
    if (leds.length > 0) {
        let pct = telemetryState.rpmAtual / telemetryState.mapaECU.corteRpm;
        leds.forEach((led, idx) => {
            let threshold = (idx + 1) / leds.length;
            if (pct >= threshold) {
                led.style.background = idx > 5 ? "#ef4444" : (idx > 3 ? "#f59e0b" : "#10b981");
            } else {
                led.style.background = "#1e293b";
            }
        });
    }
}