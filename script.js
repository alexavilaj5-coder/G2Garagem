// ===========================================
// SCRIPT.JS (G2 GARAGEM — VERSÃO NÍVEL 1000 🚀)
// ===========================================

const conteudo = document.getElementById("conteudo");

const caixa = document.getElementById("caixa");
const dia = document.getElementById("dia");
const reputacao = document.getElementById("reputacao");
const lucro = document.getElementById("lucro");

const vagas = document.getElementById("vagas");

window.onload = function(){
    carregarJogo();
    atualizarPainel();
    
    iniciarIntroducaoCinematografica();

    document.getElementById("btnMercado").onclick = abrirMercado;
    document.getElementById("btnPatio").onclick = abrirPatio;
    document.getElementById("btnOficina").onclick = abrirOficina;
    document.getElementById("btnLeilao").onclick = abrirLeilao;
    document.getElementById("btnBanco").onclick = abrirBanco;
    document.getElementById("btnClientes").onclick = abrirClientes;
    document.getElementById("btnEmpresa").onclick = abrirEmpresa;
    document.getElementById("btnEstatisticas").onclick = abrirEstatisticas;
    document.getElementById("btnProximoDia").onclick = proximoDia;

    mostrarTelaInicial();
};

function atualizarPainel(){
    caixa.innerHTML = "R$ " + jogo.dinheiro.toLocaleString("pt-BR");

    if(typeof atualizarDataPainel === "function"){
        atualizarDataPainel();
    }else{
        dia.innerHTML = jogo.dia;
    }

    reputacao.innerHTML = jogo.reputacao;
    lucro.innerHTML = "R$ " + jogo.lucro.toLocaleString("pt-BR");

    if(vagas){
        let usadas = jogo.carros ? jogo.carros.length : 0;
        vagas.innerHTML = usadas + "/" + jogo.empresa.vagas;
    }
}

function mostrarTelaInicial(){
    conteudo.innerHTML = `
    <div class="card">
        <h2>🚗 O INICIO DE TUDO!</h2>
        <p>
        📖 Você vendeu o seu carro para realizar um sonho: abrir sua própria garagem de veículos. Começando do zero, será preciso negociar bem, consertar carros, conquistar clientes e administrar as despesas. Faça escolhas inteligentes, expanda sua empresa e construa uma das maiores revendas do Brasil.
        </p>
        <br>
        <p>✅ G2 GARAGEM, SEU NOVO GAME!</p>
        <p>
        Bem-vindo ao seu novo negócio automotivo!<br><br>
        Aqui você começa pequeno, comprando carros usados, fazendo negociações, consertando defeitos e aumentando seu patrimônio.<br><br>
        💰 Compre barato<br>
        🔧 Resolva problemas mecânicos<br>
        📈 Venda com lucro<br>
        🏆 Construa sua própria garagem de sucesso<br><br>
        Cada carro tem uma história... e cada negociação pode mudar o futuro da sua empresa.<br><br>
        Boa sorte, chefe! 🔥
        </p>
    </div>
    `;
}

function proximoDia(){
    if(typeof avancarDia === "function"){
        avancarDia();
    }else{
        jogo.dia++;
        gerarOferta();
        salvarJogo();
        atualizarPainel();
        alert(`📅 Dia ${jogo.dia}\n\n🚗 Novas ofertas chegaram ao mercado!`);
    }
}

function abrirMercado(){ gerarOferta(); }
function abrirPatio(){ mostrarPatio(); }
function abrirOficina(){ mostrarOficina(); }
function abrirLeilao(){ mostrarLeilao(); }
function abrirBanco(){ mostrarBanco(); }
function abrirClientes(){ mostrarClientes(); }
function abrirEstatisticas(){ mostrarEstatisticas(); }
function abrirEmpresa(){ mostrarEmpresa(); }

function mostrarAvisoTopo(texto){
    let aviso = document.getElementById("avisoTopo");
    if(!aviso) return;
    aviso.innerHTML = texto;
    aviso.classList.add("mostrar");
    setTimeout(function(){
        aviso.classList.remove("mostrar");
    },3000);
}

function iniciarTutorial(){
    if(jogo.tutorialVisto) return;
    conteudo.innerHTML=`
    <div class="card">
        <h2>🚗 Bem-vindo à G2 Garagem</h2>
        <hr>
        <p>Você começou uma pequena revenda de veículos.</p>
        <p>🎯 Compre, conserte, venda e expanda sua empresa.</p>
        <button onclick="fecharTutorial()">🚗 Começar jogo</button>
    </div>
    `;
}

// ===========================================
// INTRODUÇÃO CINEMATOGRÁFICA NÍVEL 1000 (PAINEL + IGNIÇÃO)
// ===========================================

function iniciarIntroducaoCinematografica() {
    if(!jogo.introducao) return;

    let existente = document.getElementById("modal-intro-g2");
    if(existente) existente.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-intro-g2";

    overlay.innerHTML = `
        <style>
            #modal-intro-g2 {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(5, 5, 7, 0.96);
                backdrop-filter: blur(12px);
                display: flex; justify-content: center; align-items: center;
                z-index: 999999;
                animation: fadeInIntro 0.5s ease-out forwards;
                font-family: inherit;
            }
            @keyframes fadeInIntro { from { opacity: 0; } to { opacity: 1; } }

            .painel-ignicao-box {
                background: linear-gradient(145deg, #121216 0%, #09090b 100%);
                border: 2px solid #27272a;
                border-top: 4px solid #ef4444;
                border-radius: 16px;
                padding: 40px;
                max-width: 520px;
                width: 90%;
                box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(239, 68, 68, 0.15);
                text-align: center;
                color: #f4f4f5;
                position: relative;
            }

            .painel-luzes-topo {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-bottom: 25px;
            }

            .luz-painel {
                width: 14px; height: 14px;
                background: #27272a;
                border-radius: 50%;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
                transition: all 0.3s ease;
            }
            .luz-painel.ligada {
                background: #10b981;
                box-shadow: 0 0 12px #10b981, inset 0 1px 2px rgba(255,255,255,0.4);
            }
            .luz-painel.alerta.ligada {
                background: #f59e0b;
                box-shadow: 0 0 12px #f59e0b;
            }

            .painel-titulo {
                font-size: 20px;
                font-weight: 800;
                color: #fff;
                margin-bottom: 10px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .painel-status-texto {
                font-size: 13px;
                color: #a1a1aa;
                margin-bottom: 30px;
                min-height: 20px;
                font-family: monospace;
            }

            .painel-controles {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px;
                background: rgba(0, 0, 0, 0.4);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid #27272a;
                margin-bottom: 25px;
            }

            .botao-painel {
                background: #18181b;
                border: 2px solid #3f3f46;
                color: #a1a1aa;
                padding: 12px 20px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }

            .botao-painel span {
                font-size: 18px;
            }

            .botao-painel.ativo {
                background: #27272a;
                border-color: #3b82f6;
                color: #fff;
                box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
            }

            /* Chave de ignição mecânica estilizada */
            .chave-ignicao-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .cilindro-chave {
                width: 65px; height: 65px;
                background: radial-gradient(circle, #3f3f46 0%, #18181b 80%);
                border: 3px solid #52525b;
                border-radius: 50%;
                display: flex; justify-content: center; align-items: center;
                cursor: not-allowed;
                position: relative;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s;
                box-shadow: 0 6px 15px rgba(0,0,0,0.5);
            }

            .cilindro-chave.liberado {
                cursor: pointer;
                border-color: #ef4444;
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), 0 6px 15px rgba(0,0,0,0.5);
            }

            .cilindro-chave.liberado:hover {
                transform: scale(1.05);
            }

            .miolo-chave {
                width: 12px; height: 35px;
                background: #d4d4d8;
                border-radius: 3px;
                transition: transform 0.4s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }

            .cilindro-chave.girada .miolo-chave {
                transform: rotate(90deg);
            }

            .painel-historia-bloco {
                font-size: 13px;
                line-height: 1.6;
                color: #d4d4d8;
                background: rgba(24, 24, 27, 0.7);
                padding: 15px;
                border-radius: 8px;
                border-left: 3px solid #ef4444;
                text-align: left;
                margin-bottom: 20px;
                display: none;
                animation: fadeInIntro 0.4s ease forwards;
            }
        </style>

        <div class="painel-ignicao-box">
            <div class="painel-luzes-topo">
                <div class="luz-painel" id="luzBateria" title="Bateria"></div>
                <div class="luz-painel alerta" id="luzInjecao" title="Injeção"></div>
                <div class="luz-painel" id="luzOleo" title="Pressão de Óleo"></div>
            </div>

            <div class="painel-titulo">🔧 G2 Garagem — Sistema de Partida</div>
            <div class="painel-status-texto" id="txtStatusPainel">PASSO 1: Ligue a ignição e sistemas do painel.</div>

            <div class="painel-controles">
                <button class="botao-painel" id="btnLigarSistema" onclick="painelLigarSistemas()">
                    <span>⚡</span> 1. Painel / Bateria
                </button>

                <div class="chave-ignicao-container">
                    <div class="cilindro-chave" id="cilindroChave" onclick="painelGirarChave()" title="Gire a chave para dar a partida">
                        <div class="miolo-chave" id="mioloChave"></div>
                    </div>
                    <span style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: bold;">2. Ignição</span>
                </div>
            </div>

            <div class="painel-historia-bloco" id="blocoHistoriaG2">
                <strong>Motor roncou forte! A G2 Garagem está aberta.</strong><br>
                Você vendeu tudo para investir na revenda de veículos. Agora o destino da oficina está no seu volante: compre barato, recupere motores, vença leilões e faça o caixa estourar!
                <br><br>
                <button class="botao-partida-g2" onclick="fecharIntroducaoNivel1000()" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); cursor:pointer; width:100%; border:none; padding:12px; border-radius:8px; color:#fff; font-weight:bold; font-size:14px; text-transform:uppercase; box-shadow:0 4px 15px rgba(16, 185, 129, 0.4);">Assumir o Comando da Garagem 🚀</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    window.sistemaEletricoLigado = false;
    window.motorLigado = false;
}

function painelLigarSistemas() {
    if(window.sistemaEletricoLigado) return;
    window.sistemaEletricoLigado = true;

    document.getElementById("luzBateria").classList.add("ligada");
    document.getElementById("luzInjecao").classList.add("ligada");
    document.getElementById("luzOleo").classList.add("ligada");

    let btn = document.getElementById("btnLigarSistema");
    btn.classList.add("ativo");
    btn.innerHTML = "<span>🔋</span> Sistemas OK";

    let cilindro = document.getElementById("cilindroChave");
    cilindro.classList.add("liberado");

    document.getElementById("txtStatusPainel").innerText = "PASSO 2: Bateria ativa. Clique na chave para dar a partida no motor!";
}

function painelGirarChave() {
    if(!window.sistemaEletricoLigado || window.motorLigado) return;
    window.motorLigado = true;

    let cilindro = document.getElementById("cilindroChave");
    cilindro.classList.add("girada");

    document.getElementById("txtStatusPainel").innerHTML = "<span style='color: #10b981; font-weight: bold;'>VVRUUUM! MOTOR RONCANDO ALTO! 🔥</span>";

    setTimeout(() => {
        document.getElementById("blocoHistoriaG2").style.display = "block";
        document.getElementById("txtStatusPainel").innerText = "Sistemas operacionais. Bem-vindo à G2 Garagem.";
    }, 700);
}

function fecharIntroducaoNivel1000() {
    const modal = document.getElementById("modal-intro-g2");
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            modal.remove();
        }, 400);
    }

    jogo.introducao = false;
    if(typeof salvarJogo === 'function') {
        salvarJogo();
    }
}


/* ==========================================
   LÓGICA DOS MINI-GAMES ARCADE (G2 GARAGE)
   ========================================== */

// --- 1. MINI-GAME: SHIFT LIGHT & TESTE DE PISTA ---
let carroEmTesteArcade = null;
let rpmAtual = 0;
let direcaoGiro = 1;
let loopArcade = null;
let marchaArcade = 1;
let acertosArcade = 0;
let jogoAtivoArcade = false;

function iniciarTesteDrive(carro) {
    carroEmTesteArcade = carro || { marca: 'Veículo', modelo: 'Custom', fipe: 20000 };
    marchaArcade = 1;
    acertosArcade = 0;
    rpmAtual = 0;
    direcaoGiro = 1;
    jogoAtivoArcade = true;

    let nomeVeiculo = carroEmTesteArcade.modelo ? `${carroEmTesteArcade.marca} ${carroEmTesteArcade.modelo}` : (carroEmTesteArcade.nome || 'Veículo');
    document.getElementById('infoCarroTeste').innerText = `Testando na pista: ${nomeVeiculo}`;
    
    document.getElementById('txtMarchaArcade').innerText = `${marchaArcade}ª`;
    document.getElementById('txtProgressoArcade').innerText = `${acertosArcade} / 3`;
    document.getElementById('statusTesteMsg').innerText = "Acelere e troque de marcha no momento verde!";
    document.getElementById('statusTesteMsg').style.color = "#fff";
    
    document.getElementById('btnAcelerarTeste').style.display = 'block';
    document.getElementById('btnFecharTeste').style.display = 'none';
    
    document.getElementById('modalTesteDrive').style.display = 'flex';

    if (loopArcade) clearInterval(loopArcade);

    loopArcade = setInterval(() => {
        if (!jogoAtivoArcade) return;

        let velocidadeGiro = 1.2 + (marchaArcade * 0.4);
        rpmAtual += velocidadeGiro * direcaoGiro;

        if (rpmAtual >= 100) {
            rpmAtual = 100;
            direcaoGiro = -1.5;
        } else if (rpmAtual <= 0) {
            rpmAtual = 0;
            direcaoGiro = 1;
        }

        atualizarInterfaceArcade();
    }, 20);
}

function atualizarInterfaceArcade() {
    let ponteiro = document.getElementById('ponteiroDinamico');
    if (ponteiro) ponteiro.style.left = `${rpmAtual}%`;

    let rpmReal = Math.floor(rpmAtual * 80);
    let txtRpm = document.getElementById('txtRpmDigital');
    if (txtRpm) txtRpm.innerText = `${rpmReal} RPM`;

    let l1 = document.getElementById('luz1');
    let l2 = document.getElementById('luz2');
    let l3 = document.getElementById('luz3');
    let l4 = document.getElementById('luz4');
    let l5 = document.getElementById('luz5');

    if (l1) l1.className = `luz-led ${rpmAtual >= 30 ? 'ativa' : ''}`;
    if (l2) l2.className = `luz-led ${rpmAtual >= 50 ? 'ativa' : ''}`;
    if (l3) l3.className = `luz-led ${rpmAtual >= 65 ? 'ativa' : ''}`;
    if (l4) l4.className = `luz-led ${rpmAtual >= 80 ? 'ativa' : ''}`;
    if (l5) l5.className = `luz-led red ${rpmAtual >= 72 && rpmAtual <= 87 ? 'ativa' : ''}`;
}

function executarTrocaMarcha() {
    if (!jogoAtivoArcade) return;

    if (rpmAtual >= 72 && rpmAtual <= 87) {
        acertosArcade++;
        document.getElementById('txtProgressoArcade').innerText = `${acertosArcade} / 3`;

        if (marchaArcade < 3) {
            marchaArcade++;
            document.getElementById('txtMarchaArcade').innerText = `${marchaArcade}ª`;
            rpmAtual = 15;
            direcaoGiro = 1;
            
            document.getElementById('statusTesteMsg').style.color = "#10b981";
            document.getElementById('statusTesteMsg').innerText = "⚡ Troca perfeita! O motor cantou bonito!";
        } else {
            finalizarTesteArcade(true);
        }
    } else if (rpmAtual > 87) {
        finalizarTesteArcade(false, "Corte de giro estourado! Você passou do ponto ideal.");
    } else {
        finalizarTesteArcade(false, "Troca muito cedo! O giro caiu e o carro perdeu embalo.");
    }
}

function finalizarTesteArcade(sucesso, motivoErro = "") {
    jogoAtivoArcade = false;
    clearInterval(loopArcade);

    document.getElementById('btnAcelerarTeste').style.display = 'none';
    document.getElementById('btnFecharTeste').style.display = 'block';

    let msgBox = document.getElementById('statusTesteMsg');

    if (sucesso) {
        msgBox.style.color = "#10b981";
        msgBox.innerHTML = `🏆 <strong>TESTE APROVADO COM LOUVOR!</strong><br>Motor regulado no talo e rendimento máximo.<br><span style="color: #38bdf8;">+15% de valorização no preço de mercado!</span>`;
        
        if (carroEmTesteArcade) {
            if (carroEmTesteArcade.fipe) {
                carroEmTesteArcade.fipe = Math.round(carroEmTesteArcade.fipe * 1.15);
            } else if (carroEmTesteArcade.valorVenda) {
                carroEmTesteArcade.valorVenda = Math.floor(carroEmTesteArcade.valorVenda * 1.15);
            }
        }
        if (typeof salvarJogo === 'function') salvarJogo();
    } else {
        msgBox.style.color = "#ef4444";
        msgBox.innerHTML = `❌ <strong>FALHA NO TESTE:</strong> ${motivoErro}<br><span style="color: #94a3b8;">O carro precisará de um acerto leve na oficina.</span>`;
    }
}

function fecharTesteDrive() {
    jogoAtivoArcade = false;
    if (loopArcade) clearInterval(loopArcade);
    document.getElementById('modalTesteDrive').style.display = 'none';
}


// --- 2. MINI-GAME: SHOW DE GRAVES (SPL) ---
let carroEmDisputaSom = null;
let nivelPressao = 20;
let cargaBateria = 100;
let acertosSpl = 0;
let jogoAtivoSpl = false;
let loopDecadenciaSpl = null;

function iniciarShowDeGraves(carro) {
    carroEmDisputaSom = carro || { marca: 'Paredão', modelo: 'New Stereo Full', valorVenda: 30000 };
    nivelPressao = 20;
    cargaBateria = 100;
    acertosSpl = 0;
    jogoAtivoSpl = true;

    let nomeVeiculo = carroEmDisputaSom.modelo ? `${carroEmDisputaSom.marca} ${carroEmDisputaSom.modelo}` : (carroEmDisputaSom.nome || 'Carro de Som');
    document.getElementById('infoCarroSom').innerText = `Competindo com: ${nomeVeiculo}`;
    
    document.getElementById('txtAcertosSpl').innerText = `${acertosSpl} / 5`;
    document.getElementById('txtBateria').innerText = `${cargaBateria}%`;
    document.getElementById('statusSomMsg').style.color = "#fff";
    document.getElementById('statusSomMsg').innerText = "Clique repetidamente para erguer a pressão do som!";
    
    document.getElementById('btnBaterSom').style.display = 'block';
    document.getElementById('btnFecharSom').style.display = 'none';
    
    document.getElementById('modalShowSom').style.display = 'flex';

    if (loopDecadenciaSpl) clearInterval(loopDecadenciaSpl);

    loopDecadenciaSpl = setInterval(() => {
        if (!jogoAtivoSpl) return;

        if (nivelPressao > 5) {
            nivelPressao -= 1.5;
        }
        
        atualizarInterfaceSpl();
    }, 100);
}

function atualizarInterfaceSpl() {
    let ponteiro = document.getElementById('ponteiroSpl');
    if (ponteiro) ponteiro.style.left = `${nivelPressao}%`;

    let decibeisEstimados = Math.floor(110 + (nivelPressao * 0.5));
    document.getElementById('txtDecibeis').innerText = `${decibeisEstimados} dB`;
    document.getElementById('txtBateria').innerText = `${Math.floor(cargaBateria)}%`;
}

function bombearGrave() {
    if (!jogoAtivoSpl) return;

    nivelPressao += 12;
    cargaBateria -= 3;

    if (nivelPressao > 100) nivelPressao = 100;

    if (nivelPressao >= 60 && nivelPressao <= 85) {
        acertosSpl++;
        document.getElementById('txtAcertosSpl').innerText = `${acertosSpl} / 5`;
        
        if (acertosSpl >= 5) {
            finalizarShowSom(true);
            return;
        }
    } else if (nivelPressao > 85) {
        finalizarShowSom(false, "Módulos entraram em proteção térmica! O som desarmou.");
        return;
    }

    if (cargaBateria <= 0) {
        finalizarShowSom(false, "A bateria arriou completamente durante a disputa!");
        return;
    }

    atualizarInterfaceSpl();
}

function finalizarShowSom(sucesso, motivoErro = "") {
    jogoAtivoSpl = false;
    if (loopDecadenciaSpl) clearInterval(loopDecadenciaSpl);

    document.getElementById('btnBaterSom').style.display = 'none';
    document.getElementById('btnFecharSom').style.display = 'block';

    let msgBox = document.getElementById('statusSomMsg');

    if (sucesso) {
        msgBox.style.color = "#38bdf8";
        msgBox.innerHTML = `🏆 <strong>PRIMEIRO LUGAR NA CATEGORIA SPL!</strong><br>O grave bateu forte e amassou a concorrência!<br><span style="color: #10b981;">+25% de valorização e bônus de R$ 3.500 no caixa!</span>`;
        
        if (carroEmDisputaSom) {
            if (carroEmDisputaSom.fipe) {
                carroEmDisputaSom.fipe = Math.round(carroEmDispropriaSomFipe = carroEmDisputaSom.fipe * 1.25); // Corrigido abaixo de forma segura
            } else if (carroEmDisputaSom.valorVenda) {
                carroEmDisputaSom.valorVenda = Math.floor(carroEmDisputaSom.valorVenda * 1.25);
            }
        }
        if (typeof jogo !== 'undefined' && jogo) {
            jogo.dinheiro = (jogo.dinheiro || 0) + 3500;
            if (typeof atualizarPainel === 'function') atualizarPainel();
            if (typeof salvarJogo === 'function') salvarJogo();
        }
    } else {
        msgBox.style.color = "#ef4444";
        msgBox.innerHTML = `⚠️ <strong>DISPUTA PERDIDA:</strong> ${motivoErro}<br><span style="color: #94a3b8;">O sistema precisará de uma revisão rápida.</span>`;
    }
}

function fecharShowSom() {
    jogoAtivoSpl = false;
    if (loopDecadenciaSpl) clearInterval(loopDecadenciaSpl);
    document.getElementById('modalShowSom').style.display = 'none';
}