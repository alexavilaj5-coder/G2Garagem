// ===========================================
// SCRIPT.JS (G2 GARAGEM — VERSÃO LIMPA 🚀)
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
        <h2>🚗 O INÍCIO DE TUDO!</h2>
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

// ⚡ SISTEMA DE AVISO DO TOPO (TEMPO CUSTOMIZÁVEL E RESET DE TIMER)
let timerAvisoTopo = null;

function mostrarAvisoTopo(texto, tempoExibicao = 5000){
    let aviso = document.getElementById("avisoTopo");
    if(!aviso) return;
    
    aviso.innerHTML = texto;
    aviso.classList.add("mostrar");

    // Limpa o tempo do aviso anterior para não fechar antes da hora
    if(timerAvisoTopo) clearTimeout(timerAvisoTopo);

    timerAvisoTopo = setTimeout(function(){
        aviso.classList.remove("mostrar");
    }, tempoExibicao);
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

/* ==========================================
   LÓGICA DOS MINI-GAMES ARCADE (G2 GARAGE)
   ========================================== */

// --- MINI-GAME: SHIFT LIGHT & TESTE DE PISTA ---
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