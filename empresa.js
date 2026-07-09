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