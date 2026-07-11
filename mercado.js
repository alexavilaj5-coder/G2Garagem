// ===========================
// MERCADO.JS
// ===========================
function gerarAno(modelo){

    if(typeof anosModelos !== "undefined" && anosModelos[modelo.modelo]){

        return aleatorio(
            anosModelos[modelo.modelo].inicio,
            anosModelos[modelo.modelo].fim
        );

    }

    return aleatorio(2008, jogo.ano);

}

function gerarKm(ano){

    let idade = jogo.ano - ano;

    let kmMin = idade * 8000;
    let kmMax = idade * 18000;

    if(kmMin < 5000) kmMin = 5000;
    if(kmMax < 30000) kmMax = 30000;

    return aleatorio(kmMin, kmMax);

}



function gerarOferta(){

    let modelo = carros[aleatorio(0, carros.length - 1)];

let ano = gerarAno(modelo);

let km = gerarKm(ano);

    let cor = cores[aleatorio(0, cores.length - 1)];

    let historico = historicos[aleatorio(0, historicos.length - 1)];

    let qtdDefeitos = aleatorio(0,3);

    let listaDefeitos = [];

    let custoTotal = 0;

    for(let i=0;i<qtdDefeitos;i++){

        let defeito = defeitos[aleatorio(0,defeitos.length-1)];

        if(!listaDefeitos.some(d=>d.nome===defeito.nome)){

            listaDefeitos.push(defeito);

            custoTotal += defeito.valor;

        }

    }

    let desconto = aleatorio(5000,15000);

    let preco = modelo.fipe - desconto - custoTotal;

    if(preco < modelo.fipe * 0.45){

        preco = Math.floor(modelo.fipe * 0.45);

    }

    jogo.ofertaAtual = {

        marca:modelo.marca,

        nome:modelo.modelo,

        versao:modelo.versao,

        ano:ano,

        km:km,

        cor:cor,

        historico:historico,

        defeitos:listaDefeitos,

        custo:custoTotal,

        fipe:modelo.fipe,

        preco:preco

    };

    mostrarOferta();

}

function mostrarOferta(){

    let carro = jogo.ofertaAtual;

    let html = `

    <div class="card">

        <h2>${carro.marca} ${carro.nome}</h2>

        <h3>${carro.versao}</h3>

        <div style="display:flex;justify-content:space-between;margin-top:12px;">
            <span>📅 ${carro.ano}</span>
            <span>🛣️ ${carro.km.toLocaleString("pt-BR")} km</span>
        </div>

        <div style="display:flex;justify-content:space-between;margin-top:8px;">
            <span>🎨 ${carro.cor}</span>
            <span>📖 ${carro.historico}</span>
        </div>

        <hr>

        <div class="valor">
            💰 FIPE<br>
            R$ ${carro.fipe.toLocaleString("pt-BR")}
        </div>

        <div class="preco">
            💵 PEDIDO<br>
            R$ ${carro.preco.toLocaleString("pt-BR")}
        </div>

        <hr>

        <h3>🔧 Defeitos</h3>

    `;

    if(carro.defeitos.length==0){

        html += `
        <p style="color:#00d084;">
        ✅ Nenhum defeito
        </p>
        `;

    }else{

        carro.defeitos.forEach(function(d){

            html += `
            <div class="defeito">
                🔧 ${d.nome}
                <b style="float:right;">
                R$ ${d.valor.toLocaleString("pt-BR")}
                </b>
            </div>
            `;

        });

    }

    html += `

        <br>

        <button onclick="comprarCarro()">
            🚗 Comprar Veículo
        </button>

    </div>

    `;

    conteudo.innerHTML = html;

}





Carros: 



// ===========================
// CARROS.JS
// ===========================

// ===========================
// PÁTIO
// ===========================

function mostrarPatio(){

    let html = "<h2>🏢 Meu Pátio</h2>";

    if(jogo.carros.length == 0){

        html += "<p>Você não possui carros.</p>";

    }else{

        jogo.carros.forEach(function(carro,index){

            html += `

            <div class="card">

                <h2>${carro.marca} ${carro.nome}</h2>

                <p><b>Versão:</b> ${carro.versao}</p>

                <p><b>Ano:</b> ${carro.ano}</p>

                <p><b>KM:</b> ${carro.km.toLocaleString("pt-BR")}</p>

                <p><b>Cor:</b> ${carro.cor}</p>

                <p><b>Histórico:</b> ${carro.historico}</p>

                <hr>

                <p><b>Comprado por:</b></p>
                <h3>R$ ${carro.compra.toLocaleString("pt-BR")}</h3>

                <p><b>FIPE:</b></p>
                <h3>R$ ${carro.fipe.toLocaleString("pt-BR")}</h3>

                <p><b>Defeitos:</b> ${carro.defeitos.length}</p>

                <br>

                <button onclick="venderCarro(${index})">
                💰 Vender
                </button>

            </div>

            <br>

            `;

        });

    }

    conteudo.innerHTML = html;

}

// ===========================
// VENDER CARRO
// ===========================

function venderCarro(index){

    let carro = jogo.carros[index];

    let valor = carro.fipe;

    if(carro.defeitos.length > 0){

        valor -= carro.custo;

    }

    jogo.dinheiro += valor;

    let lucroVenda = valor - carro.compra;

    jogo.lucro += lucroVenda;

    jogo.estatisticas.vendidos++;

    jogo.carros.splice(index,1);

    atualizarPainel();

    salvarJogo();

    mostrarAlerta(
    "🚗 Carro vendido",
`💰 Venda:
R$ ${valor.toLocaleString("pt-BR")}

📈 Lucro:
R$ ${lucroVenda.toLocaleString("pt-BR")}`
);
    

    mostrarPatio();

}



Empresa



// ===========================
// EMPRESA.JS
// ===========================

function mostrarEmpresa(){

    let custoExpansao = jogo.empresa.nivel * 75000;

    conteudo.innerHTML = `

    <div class="card">

        <h2>🏢 ${jogo.empresa.nome}</h2>

        <hr>

        <p>⭐ <strong>Nível:</strong> ${jogo.empresa.nivel}</p>

        <p>🚗 <strong>Vagas:</strong> ${jogo.carros.length}/${jogo.empresa.vagas}</p>

        <p>👨‍🔧 <strong>Funcionários:</strong> ${jogo.empresa.funcionarios}</p>

        <p>⭐ <strong>Reputação:</strong> ${jogo.reputacao}</p>

        <hr>

        <p><strong>💰 Valor da Empresa</strong></p>

        <h2 style="color:#4CAF50;">
            R$ ${(50000 * jogo.empresa.nivel).toLocaleString("pt-BR")}
        </h2>

        <hr>

        <p>
        🏗️ Próxima expansão:
        <br>
        <strong>R$ ${custoExpansao.toLocaleString("pt-BR")}</strong>
        </p>

        <button onclick="expandirEmpresa()">
            🏗️ Expandir Empresa
        </button>

    </div>

    `;

}

function expandirEmpresa(){

    let custo = jogo.empresa.nivel * 75000;

    if(jogo.dinheiro < custo){

        alert(
`💸 Dinheiro insuficiente!

Expansão:
R$ ${custo.toLocaleString("pt-BR")}

Caixa:
R$ ${jogo.dinheiro.toLocaleString("pt-BR")}`
        );

        return;

    }

    jogo.dinheiro -= custo;

    jogo.empresa.nivel++;

    jogo.empresa.vagas += 2;

    atualizarPainel();

    salvarJogo();

    alert(
`🎉 Empresa expandida!

⭐ Nível ${jogo.empresa.nivel}

🚗 Vagas: ${jogo.empresa.vagas}

💰 Caixa:
R$ ${jogo.dinheiro.toLocaleString("pt-BR")}`
    );

    mostrarEmpresa();

}