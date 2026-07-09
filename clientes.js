// ===========================
// CLIENTES.JS
// ===========================

const nomesClientes = [

"João",
"Carlos",
"Pedro",
"Lucas",
"Marcos",
"André",
"Roberto",
"Fernando",
"Gabriel",
"Felipe",
"Juliana",
"Amanda",
"Camila",
"Patrícia",
"Fernanda",
"Mariana",
"Nelson",
"Dexter",
"Viviane",
"Mickael",
"Tales",
"Raffa Repasses",
"Giulia",
"Amanda",
"Laura",
"Bruno",
"Tiago",
"Mecanica Midas",
"José",
"Sr Amir",
"Sampaio Garagem",
"Gustavo",
"Ronaldo",
"Joana",
"Isabelle",
"Bernardo",
"Carmen",
"Ana",
"Pietra",
"Pietro",
"Antoni",
"Joaquim"

];

function mostrarClientes(){

    let html = "<h2>👥 Clientes</h2>";

    if(jogo.carros.length==0){

        html += "<p>Você não possui carros para vender.</p>";

        conteudo.innerHTML = html;

        return;

    }

    jogo.carros.forEach(function(carro,index){

        let cliente = nomesClientes[
            aleatorio(0,nomesClientes.length-1)
        ];

        let oferta = calcularOferta(carro);

        html += `

        <div class="card">

            <h2>${cliente}</h2>

            <p>Quer comprar seu:</p>

            <h3>${carro.marca} ${carro.nome}</h3>

            <p>${carro.ano}</p>

            <p>KM:
            ${carro.km.toLocaleString("pt-BR")}</p>

            <p>FIPE:
            R$ ${carro.fipe.toLocaleString("pt-BR")}</p>

            <hr>

            <h3 style="color:#4CAF50">

            Oferta:

            R$ ${oferta.toLocaleString("pt-BR")}

            </h3>

            <button onclick="aceitarOferta(${index},${oferta})">

            ✅ Aceitar Oferta

            </button>

            <br><br>

            <button onclick="mostrarClientes()">

            ❌ Recusar

            </button>

        </div>

        <br>

        `;

    });

    conteudo.innerHTML = html;

}

function calcularOferta(carro){

    let minimo = carro.fipe * 0.80;

    let maximo = carro.fipe * 1.05;

    if(carro.defeitos.length==0){

        minimo = carro.fipe * 0.95;

        maximo = carro.fipe * 1.10;

    }

    return Math.floor(

        Math.random()*(maximo-minimo)+minimo

    );

}

function aceitarOferta(index,valor){

    let carro = jogo.carros[index];

    jogo.dinheiro += valor;

    jogo.lucro += valor - carro.compra;

    jogo.estatisticas.vendidos++;

    jogo.reputacao++;

    jogo.carros.splice(index,1);

    atualizarPainel();

    salvarJogo();

    alert(

        "🚗 Venda realizada!\n\n"+

        "Valor: R$ "+valor.toLocaleString("pt-BR")

    );

    mostrarClientes();

}