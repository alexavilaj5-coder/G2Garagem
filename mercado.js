// ===========================
// MERCADO.JS V2.0
// PARTE 1
// ===========================

function gerarAno(modelo){

    if(typeof anosModelos !== "undefined" && anosModelos[modelo.modelo]){

        return aleatorio(
            anosModelos[modelo.modelo].inicio,
            anosModelos[modelo.modelo].fim
        );

    }

    return aleatorio(2008,jogo.ano);

}

function gerarKm(ano){

    let idade = jogo.ano - ano;

    let minimo = idade * 8000;
    let maximo = idade * 18000;

    if(minimo < 5000) minimo = 5000;
    if(maximo < 30000) maximo = 30000;

    return aleatorio(minimo,maximo);

}

function gerarOferta(){

    let modelo = carros[
        aleatorio(0,carros.length-1)
    ];

    let ano = gerarAno(modelo);

    let km = gerarKm(ano);

    let cor = cores[
        aleatorio(0,cores.length-1)
    ];

    let historico = historicos[
        aleatorio(0,historicos.length-1)
    ];

    let defeitosCarro=[];

    let custoTotal=0;

    let quantidade=aleatorio(0,3);

    for(let i=0;i<quantidade;i++){

        let defeito=
        defeitos[
            aleatorio(0,defeitos.length-1)
        ];

        if(!defeitosCarro.some(d=>d.nome==defeito.nome)){

            defeitosCarro.push(defeito);

            custoTotal+=defeito.valor;

        }

    }

    let desconto=aleatorio(5000,15000);

    let preco=modelo.fipe-desconto-custoTotal;

    if(preco < modelo.fipe*0.45){

        preco=Math.floor(modelo.fipe*0.45);

    }

    jogo.ofertaAtual={

    marca:modelo.marca,

    nome:modelo.modelo,

    versao:modelo.versao,

    imagem: Array.isArray(modelo.imagem)
    ? modelo.imagem[
        aleatorio(0, modelo.imagem.length - 1)
      ]
    : modelo.imagem,

    ano:ano,

    km:km,

    cor:cor,

    historico:historico,

    defeitos:defeitosCarro,

    custo:custoTotal,

    fipe:modelo.fipe,

    preco:preco

};

    mostrarOferta();

}

function mostrarOferta(){

    let carro=jogo.ofertaAtual;

    let html=`

<div class="card carro-card">

<img src="imagens/carros/${carro.imagem}">

<h2>${carro.marca} ${carro.nome}</h2>

<h3>${carro.versao}</h3>

<div class="info-grid">

<div>

📅

<strong>${carro.ano}</strong>

</div>

<div>

🛣️

<strong>${carro.km.toLocaleString("pt-BR")} km</strong>

</div>

<div>

🎨

<strong>${carro.cor}</strong>

</div>

<div>

📖

<strong>${carro.historico}</strong>

</div>

</div>

<div class="precos">

<div class="fipe-box">

<small>FIPE</small>

<strong>

R$ ${carro.fipe.toLocaleString("pt-BR")}

</strong>

</div>

<div class="pedido-box">

<small>PEDIDO</small>

<strong>

R$ ${carro.preco.toLocaleString("pt-BR")}

</strong>

</div>

</div>

<h3>

🔧 Defeitos encontrados

</h3>

`;


if(carro.defeitos.length==0){

    html+=`

    <div class="defeito ok">

        ✅ Veículo sem defeitos

    </div>

    `;

}else{

    carro.defeitos.forEach(function(d){

        html+=`

        <div class="defeito">

            <span>

                🔧 ${d.nome}

            </span>

            <strong>

                R$ ${d.valor.toLocaleString("pt-BR")}

            </strong>

        </div>

        `;

    });

}

html+=`

<div class="resumo-compra">

    <div>

        <small>Custo dos reparos</small>

        <strong>

            R$ ${carro.custo.toLocaleString("pt-BR")}

        </strong>

    </div>

</div>

<button class="btnComprar" onclick="comprarCarro()">

    🚗 Comprar Veículo

</button>

</div>

`;

conteudo.innerHTML = html;

}