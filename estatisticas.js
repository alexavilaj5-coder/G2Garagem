// ===========================
// ESTATISTICAS.JS
// ===========================

function mostrarEstatisticas(){

    let patrimonio = jogo.dinheiro;

    jogo.carros.forEach(function(carro){

        patrimonio += carro.fipe;

    });

    conteudo.innerHTML = `

    <div class="card">

        <h2>📊 Estatísticas da Empresa</h2>

        <hr>

        <p>💰 Caixa Atual</p>
        <h3>R$ ${jogo.dinheiro.toLocaleString("pt-BR")}</h3>

        <p>📈 Lucro Total</p>
        <h3>R$ ${jogo.lucro.toLocaleString("pt-BR")}</h3>

        <p>🏦 Empréstimo Atual</p>
        <h3>R$ ${jogo.emprestimo.toLocaleString("pt-BR")}</h3>

        <hr>

        <p>🚗 Carros Comprados</p>
        <h3>${jogo.estatisticas.comprados}</h3>

        <p>💵 Carros Vendidos</p>
        <h3>${jogo.estatisticas.vendidos}</h3>

        <p>🔧 Reparos Realizados</p>
        <h3>${jogo.estatisticas.consertados}</h3>

        <p>🏢 Carros no Pátio</p>
        <h3>${jogo.carros.length}</h3>

        <hr>

        <p>⭐ Reputação</p>
        <h3>${jogo.reputacao}</h3>

        <p>📅 Dia Atual</p>
        <h3>${jogo.dia}/${jogo.mes}/${jogo.ano}</h3>

        <hr>

        <p>💎 Patrimônio Total</p>
        <h2 style="color:#4CAF50;">
            R$ ${patrimonio.toLocaleString("pt-BR")}
        </h2>

    </div>

    `;
    

}
