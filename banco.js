// ===========================
// BANCO.JS
// ===========================


function mostrarBanco(){

    let html = `

    <div class="card">

        <h2>🏦 Torque Bank</h2>


        <p><b>Saldo:</b></p>

        <h3 style="color:#4CAF50">
        R$ ${jogo.dinheiro.toLocaleString("pt-BR")}
        </h3>


        <br>


        <p><b>Dívida Atual:</b></p>

        <h3 style="color:#ff5252">
        R$ ${jogo.emprestimo.toLocaleString("pt-BR")}
        </h3>


        <hr>


        <button onclick="fazerEmprestimo(5000)">
        💵 Empréstimo R$ 5.000
        </button>


        <br><br>


        <button onclick="fazerEmprestimo(10000)">
        💵 Empréstimo R$ 10.000
        </button>


        <br><br>


        <button onclick="fazerEmprestimo(25000)">
        💵 Empréstimo R$ 25.000
        </button>


        <br><br>


        <button onclick="fazerEmprestimo(150000)">
        💵 Empréstimo R$ 150.000
        </button>


        <br><br>


        <button onclick="quitarEmprestimo()">
        💳 Quitar Empréstimo
        </button>


    </div>

    `;


    conteudo.innerHTML = html;

}





function fazerEmprestimo(valor){


    // NÃO PERMITE NOVO EMPRÉSTIMO COM DÍVIDA

    if(jogo.emprestimo > 0){


        mostrarAlerta(
        "⚠️ Você já possui uma dívida!<br><br>"+
        "Quite o empréstimo atual antes de pegar outro."
        );


        return;

    }



    jogo.dinheiro += valor;



    let juros = Math.round(valor * 0.41);



    jogo.emprestimo += valor + juros;



    atualizarPainel();


    salvarJogo();



    mostrarAlerta(
    "💰 Empréstimo aprovado!<br><br>"+
    "Recebido: R$ "+
    valor.toLocaleString("pt-BR")+
    "<br>"+
    "Dívida: R$ "+
    (valor+juros).toLocaleString("pt-BR")
    );



    mostrarBanco();

}





function quitarEmprestimo(){



    if(jogo.emprestimo <= 0){


        mostrarAlerta(
        "🏦 Você não possui empréstimos."
        );


        return;

    }




    if(jogo.dinheiro < jogo.emprestimo){


        mostrarAlerta(
        "⚠️ Dinheiro insuficiente para quitar a dívida."
        );


        return;

    }





    jogo.dinheiro -= jogo.emprestimo;



    jogo.emprestimo = 0;




    atualizarPainel();


    salvarJogo();




    mostrarAlerta(
    "✅ Empréstimo quitado com sucesso!"
    );



    mostrarBanco();


}