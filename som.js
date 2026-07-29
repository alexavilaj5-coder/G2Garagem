// ===========================================
// SOM.JS - LOJA DE ÁUDIO AUTOMOTIVO & ARENA SPL (EDIÇÃO ELITE & V2.0)
// NEW STEREO
// ===========================================

const opcoesReboques = [
    { nome: "Sem Reboque (Som Interno/Porta-malas)", valor: 0, maxAltoFalantes: 2, bonusEspaco: 1.0 },
    { nome: "Carretinha Simples Para-choque Fechado", valor: 3500, maxAltoFalantes: 4, bonusEspaco: 1.3 },
    { nome: "Reboque de Duplo Eixo Reforçado (Paredinha)", valor: 7500, maxAltoFalantes: 8, bonusEspaco: 1.75 },
    { nome: "Carreta Carregadeira de Paredão Extremo 🔊", valor: 14000, maxAltoFalantes: 12, bonusEspaco: 2.3 }
];

const opcoesModulos = [
    { nome: "Sem Módulo", valor: 0, potenciaRms: 0, impedanciaIdeal: 0, bonusSpl: 1.0 },
    { nome: "Stetsom Vulcan 800W RMS", valor: 890, potenciaRms: 800, impedanciaIdeal: 2, bonusSpl: 1.12 },
    { nome: "Taramps Smart 3K (3000W RMS)", valor: 2400, potenciaRms: 3000, impedanciaIdeal: 1, bonusSpl: 1.35 },
    { nome: "Soundigital 8000.1 EVOX", valor: 5200, potenciaRms: 8000, impedanciaIdeal: 1, bonusSpl: 1.7 },
    { nome: "Taramps Big Boss 15K (15.000W RMS 🔥)", valor: 9800, potenciaRms: 15000, impedanciaIdeal: 1, bonusSpl: 2.2 }
];

const opcoesWoofers = [
    { nome: "Nenhum Woofer", valor: 0, potenciaRms: 0, impedancia: 0, bonusSpl: 1.0 },
    { nome: "Woofer Bomber 12' 600W RMS Seco", valor: 650, potenciaRms: 600, impedancia: 4, bonusSpl: 1.15 },
    { nome: "Woofer Eros E-12 Hammer 3.0K (1500W RMS)", valor: 1450, potenciaRms: 1500, impedancia: 4, bonusSpl: 1.38 },
    { nome: "Woofer JBL Selenium Tornado 15' 2200W RMS", valor: 2100, potenciaRms: 2200, impedancia: 2, bonusSpl: 1.6 },
    { nome: "Woofer Eros Target Bass 18' 3000W RMS 💥", valor: 3200, potenciaRms: 3000, impedancia: 1, bonusSpl: 1.9 }
];

const opcoesCornetas = [
    { nome: "Nenhuma Corneta", valor: 0, qtdEquivalente: 0, bonusSpl: 1.0 },
    { nome: "Kit 2x D250X + 2x ST200 Tweeter", valor: 550, qtdEquivalente: 2, bonusSpl: 1.2 },
    { nome: "Caixa Cornetada Média (4x D405 + 4x Super Tweeter)", valor: 1350, qtdEquivalente: 4, bonusSpl: 1.45 },
    { nome: "Paredão de Voz (8x Drivers Titânio + 6x Tweeters 📢)", valor: 2800, qtdEquivalente: 8, bonusSpl: 1.8 }
];

const opcoesBateriasFontes = [
    { nome: "Nenhuma Bateria Extra", valor: 0, amperagem: 0, bonusSpl: 1.0 },
    { nome: "Bateria Estacionária Moura 100A", valor: 750, amperagem: 100, bonusSpl: 1.08 },
    { nome: "Par de Baterias Freedom 150A (Total 300A)", valor: 2100, amperagem: 300, bonusSpl: 1.25 },
    { nome: "Banco de Lítio 400A Heavy Duty + Fonte Stetsom 120A 🔋", valor: 4500, amperagem: 400, bonusSpl: 1.55 }
];

const opcoesAcessorios = [
    { nome: "Nenhum Acessório Extra", valor: 0, bonusSpl: 1.0 },
    { nome: "Manta Asfáltica Anti-vibração (Portas/Porta-malas)", valor: 400, bonusSpl: 1.05 },
    { nome: "Cabeamento Completo OFC Cobre Puro + Disjuntor", valor: 650, bonusSpl: 1.08 },
    { nome: "Processador de Áudio Stetsom STX2448 + Voltímetro Digital 🎛️", valor: 1100, bonusSpl: 1.18 }
];

// Instância de áudio global
let audioParedao = new Audio('audio/som_teste.mp3');
audioParedao.loop = true;

// ===========================
// FUNÇÃO CENTRAL (ABAS: LOJA OU ARENA)
// ===========================
function abrirLojaSom(indiceCarro, abaInicial = 'loja') {
    if (typeof jogo === 'undefined') return;
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;
    
    if (audioParedao) { audioParedao.pause(); audioParedao.currentTime = 0; }
    pararEfeitosSom();
    pararPainelSPL();

    if (!carro.somSetup) {
        carro.somSetup = { reboque: "Nenhum", modulo: "Nenhum", woofer: "Nenhum", qtdWoofer: 0, corneta: "Nenhuma", bateria: "Nenhuma", acessorio: "Nenhum", amperagemTotal: 0 };
    }

    let container = document.getElementById('conteudo') || document.body;

    let html = `
    <style>
        @keyframes rgbGlow {
            0% { border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
            33% { border-color: #22c55e; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
            66% { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
            100% { border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
        }
        @keyframes strobeFlash {
            0% { background-color: #09090b; }
            50% { background-color: #1c1917; }
            100% { background-color: #09090b; }
        }
        .arena-card-animado {
            animation: rgbGlow 4s infinite linear;
        }
        .strobe-ativo {
            animation: strobeFlash 0.3s infinite alternate;
        }
    </style>

    <div class="card" style="background: #121214; border: 1px solid #27272a; padding: 18px; border-radius: 12px; color: #fff; font-family: sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h2 style="margin:0; font-size: 20px; color:#38bdf8; text-transform:uppercase; letter-spacing:1px;">🔊 CENTRAL NEW STEREO - ÁUDIO & SPL</h2>
            <button onclick="pararSomEVoltar(${indiceCarro})" style="padding: 6px 14px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; font-weight: bold; cursor: pointer;">⬅️ Voltar</button>
        </div>
        <h3 style="color:#a1a1aa; font-size:13px; margin-top:0; margin-bottom:15px;">Veículo Selecionado: <span style="color:#fff;">${carro.marca} ${carro.modelo}</span></h3>
        
        <!-- Abas de Navegação -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button onclick="abrirLojaSom(${indiceCarro}, 'loja')" style="flex: 1; padding: 12px; background: ${abaInicial === 'loja' ? '#0284c7' : '#18181b'}; color: #fff; font-weight: bold; border: ${abaInicial === 'loja' ? 'none' : '1px solid #27272a'}; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                🛒 Loja de Equipamentos
            </button>
            <button onclick="abrirLojaSom(${indiceCarro}, 'arena')" style="flex: 1; padding: 12px; background: ${abaInicial === 'arena' ? '#0284c7' : '#18181b'}; color: #fff; font-weight: bold; border: ${abaInicial === 'arena' ? 'none' : '1px solid #27272a'}; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                🏆 Arena de Rachas & Disputas
            </button>
        </div>
    `;

    if (abaInicial === 'loja') {
        html += `
            <p style="color:#a1a1aa; font-size:13px; margin-bottom:15px;">Monte o som pesado com reboque, woofers secos, fontes de alta amperagem e acessórios profissionais.</p>
            
            <div style="display:grid; grid-template-columns: 1fr; gap: 12px;">
                <div>
                    <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">1️⃣ Reboque / Estrutura de Som:</label>
                    <select id="select-reboque" style="width:100%; padding:10px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px;">
        `;
        opcoesReboques.forEach((reb, i) => {
            html += `<option value="${i}">${reb.nome} - R$ ${reb.valor.toLocaleString("pt-BR")} (Até ${reb.maxAltoFalantes} Falantes)</option>`;
        });

        html += `
                    </select>
                </div>

                <div>
                    <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">2️⃣ Módulo Amplificador de Alta Potência:</label>
                    <select id="select-modulo" style="width:100%; padding:10px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px;">
        `;
        opcoesModulos.forEach((mod, i) => {
            html += `<option value="${i}">${mod.nome} - R$ ${mod.valor.toLocaleString("pt-BR")}</option>`;
        });

        html += `
                    </select>
                </div>

                <div style="display: flex; gap: 10px;">
                    <div style="flex: 2;">
                        <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">3️⃣ Woofers Secos de Alto Rendimento:</label>
                        <select id="select-woofer" style="width:100%; padding:10px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px;">
        `;
        opcoesWoofers.forEach((woof, i) => {
            html += `<option value="${i}">${woof.nome} - R$ ${woof.valor.toLocaleString("pt-BR")} un.</option>`;
        });

        html += `
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">Quantidade:</label>
                        <input type="number" id="input-qtd-woofer" min="1" max="12" value="2" style="width:100%; padding:9px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px; text-align:center;">
                    </div>
                </div>

                <div>
                    <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">4️⃣ Cornetas, Drivers e Super Tweeters:</label>
                    <select id="select-corneta" style="width:100%; padding:10px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px;">
        `;
        opcoesCornetas.forEach((corn, i) => {
            html += `<option value="${i}">${corn.nome} - R$ ${corn.valor.toLocaleString("pt-BR")}</option>`;
        });

        html += `
                    </select>
                </div>

                <div>
                    <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">5️⃣ Banco de Baterias & Fontes Inteligentes:</label>
                    <select id="select-bateria" style="width:100%; padding:10px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px;">
        `;
        opcoesBateriasFontes.forEach((bat, i) => {
            html += `<option value="${i}">${bat.nome} - R$ ${bat.valor.toLocaleString("pt-BR")}</option>`;
        });

        html += `
                    </select>
                </div>

                <div>
                    <label style="color:#38bdf8; font-size:12px; font-weight:bold; display:block; margin-bottom:4px;">6️⃣ Cabeamento e Acessórios Profissionais:</label>
                    <select id="select-acessorio" style="width:100%; padding:10px; background:#18181b; color:#fff; border:1px solid #3f3f46; border-radius:6px; margin-bottom: 5px;">
        `;
        opcoesAcessorios.forEach((aces, i) => {
            html += `<option value="${i}">${aces.nome} - R$ ${aces.valor.toLocaleString("pt-BR")}</option>`;
        });

        html += `
                    </select>
                </div>
            </div>

            <button onclick="finalizarCompraSom(${indiceCarro})" style="width:100%; padding:15px; background:#22c55e; color:#000; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:16px; margin-top: 15px; box-shadow: 0 4px 12px rgba(34,197,94,0.3);">
                💾 Salvar Projeto e Fechar Equipamentos
            </button>
        `;
    } else {
        if (!carro.somSetup || carro.somSetup.modulo === "Nenhum" || !carro.somSetup.modulo) {
            html += `
                <div style="text-align: center; padding: 40px 20px; background: #18181b; border-radius: 8px; border: 1px dashed #3f3f46;">
                    <p style="color: #ef4444; font-size: 15px; font-weight: bold; margin-bottom: 10px;">⚠️ NENHUM SOM MONTADO NESTE VEÍCULO!</p>
                    <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 20px;">Você precisa equipar o carro com um Módulo e Woofers na aba de peças antes de entrar na Arena SPL.</p>
                    <button onclick="abrirLojaSom(${indiceCarro}, 'loja')" style="padding: 12px 24px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Ir para a Loja de Peças 🛒</button>
                </div>
            `;
        } else {
            let setup = carro.somSetup;
            html += `
                <!-- PAINEL SUPERIOR DO VEÍCULO E STROBO DE LED -->
                <div id="painel-paredao-box" class="arena-card-animado" style="background: #18181b; border: 2px solid #0284c7; text-align: center; padding: 15px; border-radius: 10px; margin-bottom: 15px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top:0; left:0; width:100%; height:5px; background: linear-gradient(90deg, #ef4444, #eab308, #22c55e, #38bdf8, #a855f7);"></div>
                    
                    <h3 style="color: #fff; margin: 5px 0 5px 0; font-size: 18px;">🔥 ${carro.marca} ${carro.modelo} (${setup.reboque})</h3>
                    <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                        🎛️ <b>Módulo:</b> ${setup.modulo} | 🎶 <b>Woofers:</b> ${setup.qtdWoofer}x ${setup.woofer} | 🔋 <b>Baterias:</b> ${setup.amperagemTotal}A
                    </p>
                </div>

                <!-- EQUALIZADOR & VU METER COMPLETO COM LEDS -->
                <div style="background: #09090b; border: 1px solid #27272a; padding: 15px; border-radius: 10px; margin-bottom: 15px; text-align: center;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 11px; color: #a1a1aa; font-weight:bold; letter-spacing: 1px;">📊 ANALISADOR DE ESPECTRO & VU DIGITAL</span>
                        <span id="status-reacao-som" style="font-size: 10px; color: #22c55e; background: #052e16; padding: 2px 8px; border-radius: 4px; border: 1px solid #14532d;">AGUARDANDO PLAY...</span>
                    </div>

                    <!-- Barras do VU Meter Estilo Mesa Profissional -->
                    <div id="vu-meter-bars" style="display: flex; gap: 6px; justify-content: center; height: 50px; align-items: flex-end; padding: 5px; background: #000; border-radius: 6px; border: 1px solid #18181b;">
                        <div class="vu-bar" style="flex:1; background: #22c55e; height: 15%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #22c55e; height: 25%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #22c55e; height: 40%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #84cc16; height: 55%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #eab308; height: 45%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #eab308; height: 70%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #f97316; height: 85%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #ef4444; height: 60%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #ef4444; height: 95%; border-radius: 2px; transition: height 0.08s;"></div>
                        <div class="vu-bar" style="flex:1; background: #a855f7; height: 80%; border-radius: 2px; transition: height 0.08s;"></div>
                    </div>
                </div>

                <!-- CONTROLES DO PROCESSADOR DE ÁUDIO -->
                <div style="background: #18181b; padding: 15px; border-radius: 10px; border: 1px solid #27272a; margin-bottom: 15px;">
                    <p style="color: #facc15; font-weight: bold; margin-top:0; margin-bottom: 12px; font-size:13px; text-align:center;">🎛️ PROCESSADOR STETSOM - AJUSTE FINO</p>
                    
                    <div style="margin-bottom: 12px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; color:#a1a1aa; margin-bottom:4px;">
                            <span>VOLUME GERAL</span>
                            <span style="color:#38bdf8; font-weight:bold;"><span id="txt-vol">75</span>%</span>
                        </div>
                        <input type="range" id="range-vol" min="20" max="100" value="75" style="width:100%; accent-color:#0284c7;" oninput="document.getElementById('txt-vol').innerText = this.value">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; color:#a1a1aa; margin-bottom:4px;">
                            <span>SINTONIA DO WOOFER SECO (FREQ)</span>
                            <span style="color:#eab308; font-weight:bold;"><span id="txt-freq">55</span> Hz</span>
                        </div>
                        <input type="range" id="range-freq" min="40" max="90" value="55" style="width:100%; accent-color:#eab308;" oninput="document.getElementById('txt-freq').innerText = this.value">
                    </div>

                    <div style="margin-bottom: 5px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; color:#a1a1aa; margin-bottom:4px;">
                            <span>GANHO DE PROCESSADOR (BOOST)</span>
                            <span style="color:#22c55e; font-weight:bold;"><span id="txt-gain">10</span> dB</span>
                        </div>
                        <input type="range" id="range-gain" min="2" max="15" value="10" style="width:100%; accent-color:#22c55e;" oninput="document.getElementById('txt-gain').innerText = this.value">
                    </div>
                </div>

                <!-- VISOR DE PLACAR SPL -->
                <div id="visor-spl" style="background: #09090b; padding: 18px; border-radius: 10px; border: 2px dashed #3f3f46; margin-bottom: 15px; text-align: center;">
                    <span style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 2px; font-weight:bold;">Medidor Oficial SPL da Arena</span>
                    <div id="resultado-spl-num" style="font-size: 40px; font-weight: bold; color: #38bdf8; font-family: monospace; margin: 8px 0;">0.0 dB</div>
                    <p id="status-spl-texto" style="font-size: 13px; color: #a1a1aa; margin:0;">Ajuste perto de 55Hz para o woofer seco render ao máximo e solte o grave!</p>
                </div>

                <!-- BOTÕES DE AÇÃO E TESTE DE ÁUDIO -->
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="executarDisputaSom(${indiceCarro})" style="width: 100%; padding: 15px; background: #22c55e; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; box-shadow: 0 4px 12px rgba(34,197,94,0.3);">
                        🔊 SOLTAR O GRAVE SECO NA ARENA (DISPUTA)!
                    </button>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="testarMusicaParedao()" style="flex: 1; padding: 12px; background: #0284c7; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                            ▶️ Testar Música Real
                        </button>
                        <button onclick="pararMusicaParedao()" style="flex: 1; padding: 12px; background: #ef4444; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                            ⏹️ Parar Som / Luzes
                        </button>
                    </div>
                </div>
            `;
            
            // Inicia os efeitos dinâmicos e medidor SPL automaticamente ao abrir a arena com som montado
            setTimeout(() => {
                iniciarEfeitosSom();
                iniciarPainelSPL(setup);
            }, 100);
        }
    }

    html += `</div>`;
    container.innerHTML = html;
}

function pararSomEVoltar(indiceCarro) {
    if (audioParedao) { audioParedao.pause(); audioParedao.currentTime = 0; }
    pararEfeitosSom();
    pararPainelSPL();
    if (typeof mostrarOficina === 'function') mostrarOficina();
}

function testarMusicaParedao() {
    audioParedao.play().catch(e => {
        alert("⚠️ Arquivo de áudio não encontrado ou bloqueado pelo navegador!\nColoque um arquivo MP3 em: 'audio/som_teste.mp3'");
    });
    iniciarEfeitosSom();
    
    let box = document.getElementById('painel-paredao-box');
    if (box) box.classList.add('strobe-ativo');

    let statusReacao = document.getElementById('status-reacao-som');
    if (statusReacao) {
        statusReacao.innerText = "🔴 SOM TOCANDO AO VIVO";
        statusReacao.style.color = "#ef4444";
        statusReacao.style.background = "#450a0a";
        statusReacao.style.borderColor = "#991b1b";
    }
}

function pararMusicaParedao() {
    if (audioParedao) {
        audioParedao.pause();
        audioParedao.currentTime = 0;
    }
    pararEfeitosSom();

    let box = document.getElementById('painel-paredao-box');
    if (box) box.classList.remove('strobe-ativo');

    let statusReacao = document.getElementById('status-reacao-som');
    if (statusReacao) {
        statusReacao.innerText = "AGUARDANDO PLAY...";
        statusReacao.style.color = "#22c55e";
        statusReacao.style.background = "#052e16";
        statusReacao.style.borderColor = "#14532d";
    }
}

function finalizarCompraSom(indiceCarro) {
    if (typeof jogo === 'undefined') return;
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    let iReb = parseInt(document.getElementById('select-reboque').value) || 0;
    let iMod = parseInt(document.getElementById('select-modulo').value) || 0;
    let iWoof = parseInt(document.getElementById('select-woofer').value) || 0;
    let qtdWoof = parseInt(document.getElementById('input-qtd-woofer').value) || 2;
    let iCorn = parseInt(document.getElementById('select-corneta').value) || 0;
    let iBat = parseInt(document.getElementById('select-bateria').value) || 0;
    let iAces = parseInt(document.getElementById('select-acessorio').value) || 0;

    let rebObj = opcoesReboques[iReb];
    let modObj = opcoesModulos[iMod];
    let woofObj = opcoesWoofers[iWoof];
    let cornObj = opcoesCornetas[iCorn];
    let batObj = opcoesBateriasFontes[iBat];
    let acesObj = opcoesAcessorios[iAces];

    if (qtdWoof > rebObj.maxAltoFalantes) {
        alert(`⚠️ O reboque escolhido (${rebObj.nome}) suporta no máximo ${rebObj.maxAltoFalantes} alto-falantes!`);
        return;
    }

    let custoTotal = rebObj.valor + modObj.valor + (woofObj.valor * qtdWoof) + cornObj.valor + batObj.valor + acesObj.valor;

    if (jogo.dinheiro < custoTotal) {
        alert(`💸 Saldo insuficiente! O projeto custa R$ ${custoTotal.toLocaleString("pt-BR")}, mas você tem R$ ${jogo.dinheiro.toLocaleString("pt-BR")}.`);
        return;
    }

    jogo.dinheiro -= custoTotal;

    let statusImpedancia = "Perfeito";
    let fatorImpr = 1.2;
    if (woofObj.impedancia > 0 && modObj.impedanciaIdeal > 0) {
        if (woofObj.impedancia === modObj.impedanciaIdeal) {
            statusImpedancia = `Casado Perfeito (${woofObj.impedancia} Ohms)`;
            fatorImpr = 1.25;
        } else {
            statusImpedancia = `Impedância Mista / Forçada`;
            fatorImpr = 0.9;
        }
    }

    carro.somSetup = {
        reboque: rebObj.nome,
        modulo: modObj.nome,
        woofer: woofObj.nome,
        qtdWoofer: qtdWoof,
        corneta: cornObj.nome,
        bateria: batObj.nome,
        amperagemTotal: batObj.amperagem,
        acessorio: acesObj.nome,
        modObj: modObj,
        woofObj: woofObj,
        cornObj: cornObj,
        batObj: batObj,
        fatorImpr: fatorImpr
    };

    carro.impedanciaStatus = statusImpedancia;

    if (typeof atualizarPainel === 'function') atualizarPainel();
    if (typeof salvarJogo === 'function') salvarJogo();
    
    alert(`🎉 Projeto de som montado com sucesso!\nCusto total: R$ ${custoTotal.toLocaleString("pt-BR")}`);
    abrirLojaSom(indiceCarro, 'arena');
}

function executarDisputaSom(indiceCarro) {
    let carro = jogo.carros[indiceCarro];
    let setup = carro.somSetup;

    let vol = parseInt(document.getElementById('range-vol').value);
    let freq = parseInt(document.getElementById('range-freq').value);
    let gain = parseInt(document.getElementById('range-gain').value);

    let potenciaMod = setup.modObj ? (setup.modObj.potenciaRms / 1000) : 1.0;
    let bonusWoofers = setup.qtdWoofer * (setup.woofObj ? setup.woofObj.bonusSpl : 1.0);
    let bonusCorneta = setup.cornObj ? setup.cornObj.bonusSpl : 1.0;
    let fatorAmperagem = 1.0 + (setup.amperagemTotal / 500); 
    let fatorImpr = setup.fatorImpr || 1.0;

    let freqIdeal = 55; 
    let erroFreq = Math.abs(freq - freqIdeal);
    let sintoniaFator = Math.max(0.5, (1 - (erroFreq / 40)));

    let pontuacaoJogador = (vol * 0.4 + gain * 3.5 + setup.qtdWoofer * 4) * sintoniaFator * potenciaMod * bonusWoofers * bonusCorneta * fatorAmperagem * fatorImpr;
    pontuacaoJogador = parseFloat(pontuacaoJogador.toFixed(1));

    let oponenteScore = parseFloat((Math.random() * 40 + 130 * potenciaMod * 0.7).toFixed(1));

    let visorNum = document.getElementById('resultado-spl-num');
    let visorTxt = document.getElementById('status-spl-texto');

    let vitoria = pontuacaoJogador > oponenteScore;
    let premio = Math.floor(oponenteScore * 50);

    testarMusicaParedao();

    if (setup.amperagemTotal < 150 && setup.modObj.potenciaRms > 5000 && vol > 80) {
        pararMusicaParedao();
        visorNum.style.color = "#ef4444";
        visorNum.innerText = `${pontuacaoJogador} dB (⚡ QUEDA DE TENSÃO / MÓDULO DESARMOU!)`;
        visorTxt.innerHTML = `<b style="color:#ff4d4d;">O banco de baterias era fraco para alimentar ${setup.modObj.nome} em volume alto! A voltagem despencou e o som cortou.</b>`;
        return;
    }

    if (vitoria) {
        visorNum.style.color = "#22c55e";
        visorNum.innerText = `${pontuacaoJogador} dB 🏆 VITÓRIA ESMAGADORA!`;
        visorTxt.innerHTML = `<b style="color:#fff;">O paredão espancou o oponente (${oponenteScore} dB)!<br>💰 Prêmio de Campanha: R$ ${premio.toLocaleString("pt-BR")}</b>`;
        jogo.dinheiro += premio;
        jogo.reputacao = (jogo.reputacao || 0) + 4;
    } else {
        visorNum.style.color = "#f59e0b";
        visorNum.innerText = `${pontuacaoJogador} dB (Derrota)`;
        visorTxt.innerHTML = `<b style="color:#fff;">O oponente fez ${oponenteScore} dB e levou o troféu.<br>Dica: Melhore os woofers ou ajuste a sintonia perto de 55Hz!</b>`;
        jogo.reputacao = Math.max(0, (jogo.reputacao || 0) - 1);
    }

    if (typeof atualizarPainel === 'function') atualizarPainel();
    if (typeof salvarJogo === 'function') salvarJogo();
}

// ===========================================
// EFEITOS VISUAIS V2.0 (RGB, VU & VIBRAÇÃO)
// ===========================================

let intervaloRGB = null;
let intervaloVU = null;
let intervaloFumaca = null;
let intervaloSPL = null;

function iniciarEfeitosSom() {
    pararEfeitosSom();

    const painel = document.getElementById("painel-paredao-box");
    const visor = document.getElementById("visor-spl");
    const barras = document.querySelectorAll(".vu-bar");

    let cor = 0;

    intervaloRGB = setInterval(() => {
        cor += 3;
        if (cor >= 360) cor = 0;

        if (painel) {
            painel.style.boxShadow = `0 0 25px hsl(${cor},100%,55%)`;
            painel.style.borderColor = `hsl(${cor},100%,55%)`;
        }
        if (visor) {
            visor.style.boxShadow = `0 0 18px hsl(${cor},100%,55%)`;
        }
    }, 40);

    intervaloVU = setInterval(() => {
        barras.forEach(bar => {
            let altura = 20 + Math.random() * 80;
            bar.style.height = altura + "%";
        });
    }, 70);

    intervaloFumaca = setInterval(() => {
        if (!painel) return;
        painel.style.transform = `translateX(${Math.random() * 4 - 2}px) translateY(${Math.random() * 2 - 1}px)`;
    }, 45);
}

function pararEfeitosSom() {
    clearInterval(intervaloRGB);
    clearInterval(intervaloVU);
    clearInterval(intervaloFumaca);

    intervaloRGB = null;
    intervaloVU = null;
    intervaloFumaca = null;

    const painel = document.getElementById("painel-paredao-box");
    if (painel) {
        painel.style.transform = "";
        painel.style.boxShadow = "";
    }
}

function iniciarPainelSPL(setup) {
    if (!setup) return;
    clearInterval(intervaloSPL);

    const numero = document.getElementById("resultado-spl-num");
    const texto = document.getElementById("status-spl-texto");
    const status = document.getElementById("status-reacao-som");

    if (!numero) return;

    intervaloSPL = setInterval(() => {
        let spl = 118;
        spl += (setup.qtdWoofer || 0) * 1.8;
        if (setup.modulo && setup.modulo !== "Nenhum") spl += 4;
        if (setup.bateria && setup.bateria !== "Nenhuma") spl += 2;
        if (setup.reboque && setup.reboque !== "Nenhum") spl += 3;

        spl += Math.random() * 2;
        spl = spl.toFixed(1);

        numero.innerHTML = spl + " dB";

        if (spl < 125) {
            numero.style.color = "#22c55e";
            if (texto) texto.innerHTML = "🔊 Som leve";
            if (status) status.innerHTML = "TOCANDO";
        } else if (spl < 132) {
            numero.style.color = "#eab308";
            if (texto) texto.innerHTML = "💥 Grave forte";
            if (status) status.innerHTML = "GRAVE PESADO";
        } else if (spl < 140) {
            numero.style.color = "#f97316";
            if (texto) texto.innerHTML = "🔥 Paredão pesado";
            if (status) status.innerHTML = "EXTREMO";
        } else {
            numero.style.color = "#ef4444";
            if (texto) texto.innerHTML = "💀 Tremendo tudo!";
            if (status) status.innerHTML = "MONSTRO";
        }
    }, 180);
}

function pararPainelSPL() {
    clearInterval(intervaloSPL);
    intervaloSPL = null;
}