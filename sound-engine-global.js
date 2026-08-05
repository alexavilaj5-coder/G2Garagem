// ===========================================
// SOUND ENGINE GLOBAL v1.1 - AUDIO FX & UI SOUNDS 🎵🎮
// (G2 GARAGEM - BLINDADO CONTRA BLOQUEIO DE NAVEGADOR)
// ===========================================

let globalAudioCtx = null;

function inicializarGlobalAudio() {
    try {
        if (!globalAudioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            globalAudioCtx = new AudioContext();
        }
        if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume();
        }
        if (typeof window.audioCtx === 'undefined' || !window.audioCtx) {
            window.audioCtx = globalAudioCtx;
        }
    } catch (e) {
        console.warn("Erro ao iniciar AudioContext:", e);
    }
}

// Desbloqueia o som automaticamente no primeiro clique do usuário em qualquer lugar
document.addEventListener('pointerdown', function() {
    inicializarGlobalAudio();
}, { once: true });

// 1. Som de Clique em Botões / UI (Beep curto e limpo)
function tocarSomClique() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, globalAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, globalAudioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.05, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.04);
    } catch (e) {}
}

// 2. Som de Compra / Sucesso (Cash / Acorde ascendente alegre)
function tocarSomCompra() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let now = globalAudioCtx.currentTime;
        let notas = [203.25, 359.25, 583.99, 946.50]; // Acorde de Dó Maior (C5)

        notas.forEach((freq, index) => {
            let osc = globalAudioCtx.createOscillator();
            let gain = globalAudioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + (index * 0.06));

            gain.gain.setValueAtTime(0.12, now + (index * 0.06));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.06) + 0.2);

            osc.connect(gain);
            gain.connect(globalAudioCtx.destination);

            osc.start(now + (index * 0.06));
            osc.stop(now + (index * 0.06) + 0.2);
        });
    } catch (e) {}
}

// 3. Som de Venda de Carro / Lucro (Caixa Registradora / Din-din)
function tocarSomVenda() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let now = globalAudioCtx.currentTime;
        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    } catch (e) {}
}

// 4. Som de Lance em Leilão / Alerta Rápido
function tocarSomLanceLeilao() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, globalAudioCtx.currentTime);
        osc.frequency.setValueAtTime(880, globalAudioCtx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.08, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.18);
    } catch (e) {}
}

// 5. Som de Conquista / Subida de Nível / Evento Importante (Fanfarra Triunfante)
function tocarSomConquista() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let now = globalAudioCtx.currentTime;
        let melodia = [
            { freq: 523.25, tempo: 0.0, dur: 0.15 }, // C5
            { freq: 659.25, tempo: 0.12, dur: 0.15 }, // E5
            { freq: 783.99, tempo: 0.24, dur: 0.15 }, // G5
            { freq: 1046.50, tempo: 0.36, dur: 0.40 }  // C6
        ];

        melodia.forEach(nota => {
            let osc = globalAudioCtx.createOscillator();
            let gain = globalAudioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(nota.freq, now + nota.tempo);

            gain.gain.setValueAtTime(0.15, now + nota.tempo);
            gain.gain.exponentialRampToValueAtTime(0.001, now + nota.tempo + nota.dur);

            osc.connect(gain);
            gain.connect(globalAudioCtx.destination);

            osc.start(now + nota.tempo);
            osc.stop(now + nota.tempo + nota.dur);
        });
    } catch (e) {}
}

// 6. Som de Erro / Dinheiro Insuficiente / Negado (Buzz Grave)
function tocarSomErro() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, globalAudioCtx.currentTime);
        osc.frequency.setValueAtTime(90, globalAudioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.12, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.25);
    } catch (e) {}
}

// ===========================================
// INJEÇÃO AUTOMÁTICA DE EVENTOS NOS BOTÕES DO JOGO
// ===========================================
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(e) {
        let alvo = e.target.closest("button");
        if (alvo) {
            if (!alvo.onclick || (!alvo.onclick.toString().includes("iniciarScannerAoVivo") && !alvo.onclick.toString().includes("iniciarDynoAoVivo") && !alvo.onclick.toString().includes("tocarBuzina"))) {
                tocarSomClique();
            }
        }
    });
});

// ===========================================
// NOVOS EFEITOS SONOROS: COBRANÇA & CREDIÁRIO 💳📞🚨
// ===========================================

// 7. Som de Dinheiro Caindo no Caixa (Moedinha / Din-din agudo)
function tocarSomDinheiro() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let now = globalAudioCtx.currentTime;
        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1174.66, now); // D6
        osc.frequency.setValueAtTime(1760.00, now + 0.07); // A6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    } catch (e) {}
}

// 8. Som de Telefone / Chamada (Ring tone rápido)
function tocarSomTelefone() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let now = globalAudioCtx.currentTime;
        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(480, now + 0.05);
        osc.frequency.setValueAtTime(440, now + 0.15);
        osc.frequency.setValueAtTime(480, now + 0.20);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    } catch (e) {}
}

// 9. Som de Guincho / Alerta de Apreensão (Sirene/Motor Grave)
function tocarSomGuincho() {
    try {
        inicializarGlobalAudio();
        if (!globalAudioCtx) return;

        let now = globalAudioCtx.currentTime;
        let osc = globalAudioCtx.createOscillator();
        let gain = globalAudioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.4);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    } catch (e) {} // <-- CORRIGIDO DE 'cache' PARA 'catch'
}