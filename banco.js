// ===========================
// BANCO.JS
// G2 GARAGEM
// ===========================

function mostrarBanco(){

    let html = `

    <div class="card">

        <h2>🏦 Torque Bank</h2>

        <hr>

        <p><strong>💰 Caixa</strong></p>

        <h2 style="color:#00d084;">
            R$ ${jogo.dinheiro.toLocaleString("pt-BR")}
        </h2>

        <hr>

        <p><strong>💳 Dívida Atual</strong></p>

        <h2 style="color:#ff6b6b;">
            R$ ${jogo.emprestimo.toLocaleString("pt-BR")}
        </h2>

        <hr>

        <p>
        Escolha um valor para solicitar.
        Juros únicos de <strong>41%</strong>.
        </p>

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

// ===========================
// FAZER EMPRÉSTIMO
// ===========================

function fazerEmprestimo(valor){

    if(jogo.emprestimo > 0){

        mostrarAlerta(
            "🏦 Empréstimo",
`Você já possui uma dívida ativa.

Quite o empréstimo atual antes de solicitar outro.`
        );

        return;

    }

    let juros = Math.round(valor * 0.41);

    jogo.dinheiro += valor;

    jogo.emprestimo = valor + juros;

    atualizarPainel();

    salvarJogo();

    mostrarAlerta(
        "✅ Empréstimo Aprovado",
`💰 Valor Recebido

R$ ${valor.toLocaleString("pt-BR")}

📈 Juros

R$ ${juros.toLocaleString("pt-BR")}

💳 Total para quitar

R$ ${(valor+juros).toLocaleString("pt-BR")}`
    );

    mostrarBanco();

}

// ===========================
// QUITAR EMPRÉSTIMO
// ===========================

function quitarEmprestimo(){

    if(jogo.emprestimo <= 0){

        mostrarAlerta(
            "🏦 Torque Bank",
`Você não possui empréstimos ativos.`
        );

        return;

    }

    if(jogo.dinheiro < jogo.emprestimo){

        mostrarAlerta(
            "❌ Saldo Insuficiente",
`Você não possui dinheiro suficiente.

💳 Dívida

R$ ${jogo.emprestimo.toLocaleString("pt-BR")}

💰 Caixa

R$ ${jogo.dinheiro.toLocaleString("pt-BR")}`
        );

        return;

    }

    let valorQuitado = jogo.emprestimo;

    jogo.dinheiro -= valorQuitado;

    jogo.emprestimo = 0;

    atualizarPainel();

    salvarJogo();

    mostrarAlerta(
        "🎉 Empréstimo Quitado",
`Parabéns!

Sua dívida foi paga com sucesso.

💳 Valor Quitado

R$ ${valorQuitado.toLocaleString("pt-BR")}`
    );

    mostrarBanco();

}