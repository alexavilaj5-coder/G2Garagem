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
        🏗️ Próxima expansão
        <br>
        <strong>R$ ${custoExpansao.toLocaleString("pt-BR")}</strong>
        </p>

        <button onclick="expandirEmpresa()">
            🏗️ Expandir Empresa
        </button>

        <br><br>

        <button onclick="mostrarConfiguracoes()">
            ⚙️ Configurações
        </button>

    </div>

    `;

}

function expandirEmpresa(){

    let custo = jogo.empresa.nivel * 75000;

    if(jogo.dinheiro < custo){

      
            "💸 Dinheiro insuficiente",
            `Você precisa de R$ ${custo.toLocaleString("pt-BR")} para expandir sua empresa.`
        );

        return;

    }

    jogo.dinheiro -= custo;

    jogo.empresa.nivel++;

    jogo.empresa.vagas += 2;

    atualizarPainel();

    salvarJogo();

    mostrarAlerta(
        "🎉 Empresa Expandida",
        `Agora sua empresa é nível ${jogo.empresa.nivel}!

Novas vagas:
${jogo.empresa.vagas}`
    );

    mostrarEmpresa();

}

// ===========================
// CONFIGURAÇÕES
// ===========================

function mostrarConfiguracoes(){

    conteudo.innerHTML = `

    <div class="card">

        <h2>⚙️ Configurações</h2>

        <hr>

        <button onclick="mostrarSaves()">
            💾 Saves
        </button>

        <br><br>

        <button onclick="mostrarSobre()">
            📖 Sobre o Jogo
        </button>

        <br><br>

        <button onclick="mostrarCreditos()">
            👨‍💻 Créditos
        </button>

        <br><br>

        <button onclick="mostrarBug()">
            🐞 Reportar Bug
        </button>

        <br><br>

        <button onclick="mostrarEmpresa()">
            ⬅️ Voltar
        </button>

    </div>

    `;

}

// ===========================
// SAVES
// ===========================

function mostrarSaves(){

    conteudo.innerHTML = `

    <div class="card">

        <h2>💾 Saves</h2>

        <p>
        Seu progresso é salvo automaticamente a cada poucos segundos.
        </p>

        <hr>

        <button onclick="salvarJogo()">
            💾 Salvar Agora
        </button>

        <br><br>

        <button onclick="carregarJogo(); atualizarPainel(); mostrarEmpresa();">
            📂 Carregar Save
        </button>

        <br><br>

        <button onclick="apagarSave()">
            🗑️ Novo Jogo
        </button>

        <br><br>

        <button onclick="mostrarConfiguracoes()">
            ⬅️ Voltar
        </button>

    </div>

    `;

}

// ===========================
// SOBRE
// ===========================

function mostrarSobre(){

    conteudo.innerHTML = `

    <div class="card">

        <h2>🚗 G2 Garagem</h2>

        <hr>

        <p><b>Versão:</b> 0.13 Alpha Dev..</p>

        <p><b>Desenvolvedor:</b> Alex Ávila</p>

        <hr>

        <p style="text-align:left;line-height:1.6;">

Tudo começou quando você decidiu realizar o sonho de viver da compra e venda de veículos.

Sem muito dinheiro, vendeu o próprio carro e começou sua pequena garagem no pátio de casa.

No início havia espaço para apenas dois veículos.

Agora cabe a você negociar bem, expandir a empresa, conquistar clientes, administrar despesas e transformar uma pequena garagem em uma grande revenda.

Cada compra importa.

Cada venda faz diferença.

Será que você consegue construir a maior garagem do Brasil?

        </p>

        <hr>

        <button onclick="mostrarConfiguracoes()">
            ⬅️ Voltar
        </button>

    </div>

    `;

}

// ===========================
// CRÉDITOS
// ===========================

function mostrarCreditos(){

    conteudo.innerHTML = `

    <div class="card">

        <h2>👨‍💻 Créditos</h2>

        <hr>

        <p><b>Jogo</b></p>

        <h3>G2 Garage</h3>

        <hr>

        <p>
        👨‍💻 Desenvolvedor
        </p>

        <h3>Alex Ávila</h3>

        <hr>

        <p>
        🤖 Assistência de Programação
        </p>

        <h3> </h3>

        <hr>

        <p>

Obrigado por jogar!

Este projeto continua recebendo melhorias a cada atualização.

        </p>

        <hr>

        <button onclick="mostrarConfiguracoes()">
            ⬅️ Voltar
        </button>

    </div>

    `;

}

// ===========================
// BUG
// ===========================

function mostrarBug(){

    conteudo.innerHTML = `

    <div class="card">

        <h2>🐞 Reportar Bug</h2>

        <hr>

        <p>

Encontrou algum problema?

Achou algum erro?

Tem alguma ideia para melhorar o jogo?

Toda sugestão é muito bem-vinda e ajuda o desenvolvimento do G2 Garagem.

Obrigado por participar deste projeto!

        </p>

        <hr>

        <button onclick="mostrarConfiguracoes()">
            ⬅️ Voltar
        </button>

    </div>

    `;

}