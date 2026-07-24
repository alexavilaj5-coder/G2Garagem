// ===========================
// OFICINA.JS V3
// G2 GARAGEM
// ===========================


function mostrarOficina(){

    let html = "<h2>🔧 OFICINA</h2>";


    if(jogo.carros.length == 0){

        html += "<p>Você não possui carros.</p>";

        conteudo.innerHTML = html;

        return;

    }



    jogo.carros.forEach(function(carro,index){


        html += `

        <div class="card">


        <h2>
        ${carro.marca} ${carro.modelo}
        </h2>


        <p>
        📅 Ano: ${carro.ano}
        </p>


        <p>
        🛣️ KM: ${carro.km ? carro.km.toLocaleString("pt-BR") : "N/A"}
        </p>


        <p>
        🎨 Cor: ${carro.cor || "Não informado"}
        </p>


        <hr>

        `;



        // ===========================
        // REPAROS EM ANDAMENTO
        // ===========================


        if(carro.reparos && carro.reparos.length > 0){


            html += `

            <h3>
            ⏳ Reparos em andamento
            </h3>

            `;


            carro.reparos.forEach(function(reparo){


                html += `

                <div class="defeito">


                🔧 ${reparo.nome}

                <br>

                💰 R$ ${reparo.valor.toLocaleString("pt-BR")}


                <br>

                ⏰ Faltam:
                ${reparo.dias} dias


                </div>


                `;


            });



        }



        // ===========================
        // CARRO PRONTO
        // ===========================


        if(
        (!carro.defeitos || carro.defeitos.length == 0)
        &&
        (!carro.reparos || carro.reparos.length == 0)
        ){


            html += `

            <p style="color:#4CAF50">

            ✅ Veículo revisado e pronto

            </p>

            `;


        }



        // ===========================
        // DEFEITOS
        // ===========================


        if(carro.defeitos && carro.defeitos.length > 0){


            html += `

            <h3>
            🔧 Defeitos encontrados
            </h3>

            `;



            carro.defeitos.forEach(function(defeito,posicao){



                html += `


                <div class="defeito">


                🔧 ${defeito.nome}


                <br>


                💰 R$ ${defeito.valor.toLocaleString("pt-BR")}


                </div>



                <button onclick="iniciarReparo(${index},${posicao})">

                🔧 Enviar para oficina

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





// ===========================
// INICIAR REPARO
// ===========================


function iniciarReparo(indiceCarro,indiceDefeito){


    let carro = jogo.carros[indiceCarro];


    let defeito = carro.defeitos[indiceDefeito];



    if(!carro.reparos){

        carro.reparos=[];

    }



    if(jogo.dinheiro < defeito.valor){


        mostrarAlerta(

        "💸 Dinheiro insuficiente",

        "Você não possui dinheiro para realizar esse reparo."

        );


        return;

    }



    let prazo = aleatorio(3,7);



    jogo.dinheiro -= defeito.valor;



    carro.reparos.push({

        nome:defeito.nome,

        valor:defeito.valor,

        dias:prazo,

        totalDias:prazo

    });



    carro.defeitos.splice(indiceDefeito,1);



    jogo.financeiro.gastosConsertos += defeito.valor;



    atualizarPainel();

    salvarJogo();



    mostrarAlerta(

    "🔧 Reparo iniciado",

`${defeito.nome}


⏳ Prazo:
${prazo} dias


O veículo ficará parado na oficina.`

    );



    mostrarOficina();



}





// ===========================
// AVANÇO DE DIAS DA OFICINA
// ===========================


function atualizarOficinaDia(){



    jogo.carros.forEach(function(carro){



        if(carro.reparos && carro.reparos.length > 0){



            carro.reparos.forEach(function(reparo){


                reparo.dias--;


            });





            carro.reparos =
            carro.reparos.filter(function(reparo){



                if(reparo.dias <= 0){



                    jogo.estatisticas.consertados++;


                    jogo.reputacao++;



                    mostrarAlerta(

                    "✅ Reparo concluído",

`${carro.marca} ${carro.modelo}


🔧 ${reparo.nome}


Veículo pronto para venda!`

                    );



                    return false;


                }



                return true;


            });



        }



    });



    salvarJogo();


}