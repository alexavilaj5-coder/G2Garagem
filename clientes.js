// ===========================
// CLIENTES.JS V3
// G2 GARAGEM
// ===========================

// ===========================
// NOMES
// ===========================

const nomesClientes = [

"João","Carlos","Pedro","Lucas","Marcos","André",
"Roberto","Fernando","Gabriel","Felipe",
"Juliana","Amanda","Camila","Patrícia","Fernanda",
"Mariana","Nelson","Dexter","Viviane","Mickael",
"Tales","Raffa Repasses","Giulia","Laura","Bruno",
"Tiago","Mecânica Midas","José","Sr Amir",
"Sampaio Garagem","Gustavo","Ronaldo","Joana",
"Isabelle","Bernardo","Carmen","Ana",
"Pietra","Pietro","Antoni","Joaquim"

];

// ===========================
// TIPOS DE CLIENTE
// ===========================

const tiposClientes=[

{
nome:"Cliente Comum",
bonus:0
},

{
nome:"Revendedor",
bonus:-3
},

{
nome:"Colecionador",
bonus:4
},

{
nome:"Cliente Exigente",
bonus:-6
},

{
nome:"Comprador Desesperado",
bonus:8
}

];

// ===========================
// ABRIR ABA CLIENTES
// ===========================

function mostrarClientes(){

    if(jogo.carros.length==0){

        conteudo.innerHTML=`

        <div class="card">

            <h2>👥 Clientes</h2>

            <hr>

            <p>🚗 Você não possui veículos para vender.</p>

        </div>

        `;

        return;

    }

    // Se já existe um cliente salvo,
    // apenas mostra ele novamente

    if(jogo.clienteAtual){

        mostrarClienteAtual();

        return;

    }

    gerarNovoCliente();

}

// ===========================
// GERAR NOVO CLIENTE
// ===========================

function gerarNovoCliente(){

    // 20% de chance de não aparecer ninguém
    if(Math.random() < 0.20){

        jogo.clienteAtual = {
            semCliente:true
        };

        mostrarClienteAtual();
        return;

    }

    // Escolhe um carro aleatório do pátio
    let indice = aleatorio(0, jogo.carros.length - 1);

    let carro = jogo.carros[indice];

    // Nome aleatório
    let nome = nomesClientes[
        aleatorio(0, nomesClientes.length-1)
    ];

    // Tipo do cliente
    let tipo = tiposClientes[
        aleatorio(0, tiposClientes.length-1)
    ];

    // Calcula oferta
    let oferta = calcularOferta(carro, tipo.bonus);

    // Salva o cliente
    jogo.clienteAtual = {

        nome:nome,

        tipo:tipo.nome,

        bonus:tipo.bonus,

        carro:indice,

        oferta:oferta

    };

    salvarJogo();

    mostrarClienteAtual();

}

// ===========================
// MOSTRAR CLIENTE
// ===========================

function mostrarClienteAtual(){

    let cliente = jogo.clienteAtual;

    // Não apareceu ninguém
    if(cliente.semCliente){

        conteudo.innerHTML = `

        <div class="card">

            <h2>😴 Movimento Fraco</h2>

            <hr>

            <p>

            Hoje ninguém apareceu para comprar
            seus veículos.

            </p>

            <br>

            <button onclick="proximoDia()">

                ⏭️ Passar o Dia

            </button>

        </div>

        `;

        return;

    }

    let carro = jogo.carros[cliente.carro];

    // Caso o carro já tenha sido vendido
    if(!carro){

        jogo.clienteAtual = null;

        salvarJogo();

        mostrarClientes();

        return;

    }

    conteudo.innerHTML = `

    <div class="card">

        <h2>👤 ${cliente.nome}</h2>

        <p style="color:#00d084">

            ${cliente.tipo}

        </p>

        <hr>

        <h3>

        ${carro.marca} ${carro.nome}

        </h3>

        <p>📅 ${carro.ano}</p>

        <p>🛣️ ${carro.km.toLocaleString("pt-BR")} km</p>

        <p>💰 FIPE: R$ ${carro.fipe.toLocaleString("pt-BR")}</p>

        <hr>

        <h2 style="color:#4CAF50">

        Oferta

        <br>

        R$ ${cliente.oferta.toLocaleString("pt-BR")}

        </h2>

        <button onclick="aceitarOferta()">

            ✅ Aceitar Oferta

        </button>

        <br><br>

        <button onclick="recusarOferta()">

            ❌ Recusar

        </button>

    </div>

    `;

}

// ===========================
// CALCULAR OFERTA
// ===========================

function calcularOferta(carro, bonus = 0){

    let minimo;
    let maximo;

    if(carro.defeitos.length > 0){

        minimo = carro.fipe * 0.65;
        maximo = carro.fipe * 0.88;

    }else{

        minimo = carro.fipe * 0.85;
        maximo = carro.fipe * 0.98;

    }

    let oferta = Math.floor(
        Math.random() * (maximo - minimo) + minimo
    );

    // Tipo do cliente influencia
    oferta += (carro.fipe * (bonus / 100));

    // Reputação influencia um pouco
    oferta += jogo.reputacao * 30;

    // Pequena chance de pagar acima da FIPE
    if(Math.random() < 0.03){

        oferta = Math.floor(carro.fipe * 1.02);

    }

    // Nunca ultrapassa 102% da FIPE
    if(oferta > carro.fipe * 1.02){

        oferta = Math.floor(carro.fipe * 1.02);

    }

    return Math.floor(oferta);

}

// ===========================
// ACEITAR OFERTA
// ===========================

function aceitarOferta(){

    let cliente = jogo.clienteAtual;

    if(!cliente) return;

    let carro = jogo.carros[cliente.carro];

    if(!carro){

        jogo.clienteAtual = null;

        mostrarClientes();

        return;

    }

    let valor = cliente.oferta;

    jogo.dinheiro += valor;

    let lucroVenda = valor - carro.compra;

    jogo.lucro += lucroVenda;

    jogo.estatisticas.vendidos++;

    if(valor >= carro.fipe * 0.95){

        jogo.reputacao += 2;

    }else if(valor >= carro.fipe * 0.80){

        jogo.reputacao++;

    }

    jogo.carros.splice(cliente.carro,1);

    jogo.clienteAtual = null;

    atualizarPainel();

    salvarJogo();

    mostrarAlerta(

        "🚗 Venda realizada",

`👤 ${cliente.nome}

💰 Venda:
R$ ${valor.toLocaleString("pt-BR")}

📈 Resultado:
R$ ${lucroVenda.toLocaleString("pt-BR")}`

    );

    mostrarClientes();

}

// ===========================
// RECUSAR OFERTA
// ===========================

function recusarOferta(){

    jogo.clienteAtual = null;

    salvarJogo();

    gerarNovoCliente();

}

// ===========================
// LIMPAR CLIENTE DO DIA
// ===========================

function limparClienteDia(){

    jogo.clienteAtual = null;

    salvarJogo();

}

// ===========================
// NOVO DIA
// ===========================

// Sempre que passar o dia,
// chame esta função antes de gerar
// novas ofertas do mercado.

function atualizarClientesNovoDia(){

    limparClienteDia();

}

// ===========================
// CORREÇÃO DE SAVE ANTIGO
// ===========================

if(jogo.clienteAtual === undefined){

    jogo.clienteAtual = null;

}