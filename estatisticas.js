// ===========================
// ESTATISTICAS.JS V2
// G2 GARAGEM
// ===========================

function mostrarEstatisticas(){

    let valorCarros = 0;

    jogo.carros.forEach(function(carro){

        valorCarros += carro.fipe;

    });


    let patrimonio =
    jogo.dinheiro + valorCarros;


    let lucroMedio = 0;

    if(jogo.estatisticas.vendidos > 0){

        lucroMedio =
        jogo.lucro /
        jogo.estatisticas.vendidos;

    }


    conteudo.innerHTML = `


<div class="card">


<h2>📊 CENTRAL DE ESTATÍSTICAS</h2>


<hr>


<h3>💰 FINANCEIRO</h3>


<p>💵 Caixa Atual</p>
<strong>
R$ ${jogo.dinheiro.toLocaleString("pt-BR")}
</strong>


<p>📈 Lucro Total</p>
<strong>
R$ ${jogo.lucro.toLocaleString("pt-BR")}
</strong>


<p>💸 Gastos Totais</p>
<strong>
R$ ${jogo.financeiro.gastosTotal.toLocaleString("pt-BR")}
</strong>


<p>🔧 Gastos com Reparos</p>
<strong>
R$ ${jogo.financeiro.gastosConsertos.toLocaleString("pt-BR")}
</strong>


<hr>


<h3>🚗 FROTA</h3>


<p>🚘 Carros no Pátio</p>
<strong>
${jogo.carros.length}
</strong>


<p>🛒 Carros Comprados</p>
<strong>
${jogo.estatisticas.comprados}
</strong>


<p>💵 Carros Vendidos</p>
<strong>
${jogo.estatisticas.vendidos}
</strong>


<p>🔧 Reparos Realizados</p>
<strong>
${jogo.estatisticas.consertados}
</strong>


<p>🚘 Valor dos Veículos</p>
<strong>
R$ ${valorCarros.toLocaleString("pt-BR")}
</strong>


<hr>


<h3>🏢 EMPRESA</h3>


<p>⭐ Reputação</p>


<div style="
background:#222;
height:12px;
border-radius:10px;
overflow:hidden;
">

<div style="
width:${Math.min(jogo.reputacao,100)}%;
height:100%;
background:#00ff66;
">
</div>

</div>


<br>


<p>🏆 Nível da Garagem</p>

<strong>
${jogo.empresa.nivel}
</strong>


<p>🅿️ Vagas</p>

<strong>
${jogo.empresa.vagas}
</strong>


<p>👨‍🔧 Funcionários</p>

<strong>
${jogo.empresa.funcionarios}
</strong>



<hr>


<h3>🏆 RECORDES</h3>


<p>💎 Melhor Venda</p>

<strong>
R$ ${jogo.financeiro.melhorVenda.toLocaleString("pt-BR")}
</strong>


<p>📉 Maior Prejuízo</p>

<strong>
R$ ${jogo.financeiro.maiorPrejuizo.toLocaleString("pt-BR")}
</strong>


<p>📊 Lucro Médio por Venda</p>

<strong>
R$ ${lucroMedio.toLocaleString("pt-BR")}
</strong>



<hr>


<h2 style="color:#4CAF50;">
💎 Patrimônio Total
<br>
R$ ${patrimonio.toLocaleString("pt-BR")}
</h2>


<p>
📅 Data:
${jogo.dia}/${jogo.mes}/${jogo.ano}
</p>


</div>


`;

}