// ===========================
// SCRIPT.JS
// ===========================

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
    document.getElementById("btnBanco").onclick = abrirBanco;
    document.getElementById("btnClientes").onclick = abrirClientes;
    document.getElementById("btnEmpresa").onclick = abrirEmpresa;
    document.getElementById("btnEstatisticas").onclick = abrirEstatisticas;
    document.getElementById("btnProximoDia").onclick = proximoDia;

    mostrarTelaInicial();

};

function atualizarPainel(){

    caixa.innerHTML = "R$ " + jogo.dinheiro.toLocaleString("pt-BR");

    // Quem define a data é o tempo.js
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
        📖 Você vendeu o seu carro para realizar um sonho: abrir sua própria garagem de veículos. Começando do zero, será preciso negociar bem, consertar carros, conquistar clientes e administrar as despesas. Faça escolhas inteligentes, expanda sua empresa e construa uma das maiores revendas do Brasil."
        
        </p>
        
        <br>

        <p>
        ✅ G2 GARAGEM, SEU NOVO GAME!
</p> 
</p> 
Bem-vindo ao seu novo negócio automotivo!

Aqui você começa pequeno, comprando carros usados, fazendo negociações, consertando defeitos e aumentando seu patrimônio.

💰 Compre barato
🔧 Resolva problemas mecânicos
📈 Venda com lucro
🏆 Construa sua própria garagem de sucesso

Cada carro tem uma história... e cada negociação pode mudar o futuro da sua empresa.

Boa sorte, chefe! 🔥

        
        </p>

    </div>

    `;

}

function proximoDia(){

    // O tempo.js assume o controle
    if(typeof avancarDia === "function"){

        avancarDia();

    }else{

        jogo.dia++;

        gerarOferta();

        salvarJogo();

        atualizarPainel();

        alert(
`📅 Dia ${jogo.dia}

🚗 Novas ofertas chegaram ao mercado!`
        );

    }

}

function abrirMercado(){

    gerarOferta();

}

function abrirPatio(){

    mostrarPatio();

}

function abrirOficina(){

    mostrarOficina();

}

function abrirBanco(){

    mostrarBanco();

}

function abrirClientes(){

    mostrarClientes();

}

function abrirEstatisticas(){

    mostrarEstatisticas();

}

function abrirEmpresa(){

    mostrarEmpresa();

}