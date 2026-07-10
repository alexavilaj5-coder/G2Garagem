// ===========================
// OFICINA.JS
// ===========================

function mostrarOficina(){

    let html = "<h2>🔧 OFICINA</h2>";

    if(jogo.carros.length==0){

        html += "<p>Você não possui carros.</p>";

        conteudo.innerHTML = html;

        return;

    }

    jogo.carros.forEach(function(carro,index){

        html += `

        <div class="card">

        <h2>${carro.marca} ${carro.nome}</h2>

        <p><b>Ano:</b> ${carro.ano}</p>

        <p><b>KM:</b> ${carro.km.toLocaleString("pt-BR")}</p>

        <p><b>Cor:</b> ${carro.cor}</p>

        <hr>

        `;

        if(carro.defeitos.length==0){

            html += `

            <p style="color:#4CAF50">

            ✅ Carro revisado

            </p>

            `;

        }else{

            html += "<h3>Defeitos</h3>";

            carro.defeitos.forEach(function(defeito,posicao){

                html += `

                <p>

                🔧 ${defeito.nome}

                - R$ ${defeito.valor.toLocaleString("pt-BR")}

                </p>

                <button onclick="consertarDefeito(${index},${posicao})">

                Consertar

                </button>

                <br><br>

                `;

            });

        }

        html += `

        </div>

        <br>

        `;

    });

    conteudo.innerHTML = html;

}

function consertarDefeito(indiceCarro,indiceDefeito){

    let carro = jogo.carros[indiceCarro];

    let defeito = carro.defeitos[indiceDefeito];

    if(jogo.dinheiro < defeito.valor){

        alert("Dinheiro insuficiente.");

        return;

    }

    jogo.dinheiro -= defeito.valor;

    jogo.lucro -= defeito.valor;

    carro.custo -= defeito.valor;

    carro.defeitos.splice(indiceDefeito,1);

    if(carro.defeitos.length==0){

        carro.arrumado = true;

        jogo.reputacao++;

    }

    jogo.estatisticas.consertados++;

    atualizarPainel();

    salvarJogo();

    alert("🔧 Reparo concluído!");

    mostrarOficina();

}