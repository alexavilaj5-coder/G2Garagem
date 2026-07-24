// ===========================
// CONQUISTAS.JS V1
// G2 GARAGEM
// ===========================

// Inicializa as conquistas salvas
function iniciarConquistas(){

    if(!jogo.conquistas){

        jogo.conquistas = {};

    }

    if(jogo.carrosComprados == undefined)
        jogo.carrosComprados = 0;

    if(jogo.carrosVendidos == undefined)
        jogo.carrosVendidos = 0;

}

// ===========================
// LISTA DE CONQUISTAS
// ===========================

const conquistas = [

{
id:"primeira_compra",
nome:"🚗 Primeira Compra",
descricao:"Compre seu primeiro veículo.",
recompensa:500
},

{
id:"primeira_venda",
nome:"💰 Primeira Venda",
descricao:"Venda seu primeiro veículo.",
recompensa:1000
},

{
id:"cinco_vendas",
nome:"🏆 Vendedor Iniciante",
descricao:"Venda 5 veículos.",
recompensa:3000
},

{
id:"dez_vendas",
nome:"🥇 Vendedor Profissional",
descricao:"Venda 10 veículos.",
recompensa:7000
},

{
id:"vinte_vendas",
nome:"👑 Mestre das Vendas",
descricao:"Venda 20 veículos.",
recompensa:15000
},

{
id:"100mil",
nome:"💵 Caixa Cheio",
descricao:"Tenha R$ 100.000.",
recompensa:5000
},

{
id:"500mil",
nome:"🏦 Meio Milhão",
descricao:"Tenha R$ 500.000.",
recompensa:15000
},

{
id:"1milhao",
nome:"💎 Milionário",
descricao:"Tenha R$ 1.000.000.",
recompensa:50000
},

{
id:"reputacao25",
nome:"⭐ Empresa Conhecida",
descricao:"Alcance 25 de reputação.",
recompensa:3000
},

{
id:"reputacao50",
nome:"⭐⭐ Boa Fama",
descricao:"Alcance 50 de reputação.",
recompensa:7000
},

{
id:"reputacao100",
nome:"🌟 Lenda da Cidade",
descricao:"Alcance 100 de reputação.",
recompensa:20000
},

{
id:"dia30",
nome:"📅 Primeiro Mês",
descricao:"Jogue durante 30 dias.",
recompensa:5000
},

{
id:"dia100",
nome:"🗓 Veterano",
descricao:"Jogue durante 100 dias.",
recompensa:15000
},

{
id:"dia365",
nome:"🎉 Um Ano de Garagem",
descricao:"Complete 365 dias.",
recompensa:50000
}

];

// ===========================
// DESBLOQUEAR CONQUISTA
// ===========================

function desbloquearConquista(id){

    iniciarConquistas();

    if(jogo.conquistas[id]) return;

    let conquista = conquistas.find(c=>c.id==id);

    if(!conquista) return;

    jogo.conquistas[id]=true;

    jogo.dinheiro += conquista.recompensa;

    mostrarAvisoTopo(

        "🏆 CONQUISTA DESBLOQUEADA<br><br>" +

        conquista.nome +

        "<br><br>" +

        "💰 +" +

        conquista.recompensa.toLocaleString("pt-BR")

    );

    salvarJogo();

}

// ===========================
// VERIFICAR CONQUISTAS
// ===========================

function verificarConquistas(){

    iniciarConquistas();

    if(jogo.carrosComprados>=1)
        desbloquearConquista("primeira_compra");

    if(jogo.carrosVendidos>=1)
        desbloquearConquista("primeira_venda");

    if(jogo.carrosVendidos>=5)
        desbloquearConquista("cinco_vendas");

    if(jogo.carrosVendidos>=10)
        desbloquearConquista("dez_vendas");

    if(jogo.carrosVendidos>=20)
        desbloquearConquista("vinte_vendas");

    if(jogo.dinheiro>=100000)
        desbloquearConquista("100mil");

    if(jogo.dinheiro>=500000)
        desbloquearConquista("500mil");

    if(jogo.dinheiro>=1000000)
        desbloquearConquista("1milhao");

    if(jogo.reputacao>=25)
        desbloquearConquista("reputacao25");

    if(jogo.reputacao>=50)
        desbloquearConquista("reputacao50");

    if(jogo.reputacao>=100)
        desbloquearConquista("reputacao100");

    if(jogo.dia>=30)
        desbloquearConquista("dia30");

    if(jogo.dia>=100)
        desbloquearConquista("dia100");

    if(jogo.dia>=365)
        desbloquearConquista("dia365");

}

// ===========================
// TELA DE CONQUISTAS
// ===========================

function abrirConquistas(){

    iniciarConquistas();

    let html = `

    <div class="card">

        <h2>🏆 CONQUISTAS</h2>

        <p>Desbloqueie objetivos e receba recompensas.</p>

    `;

    let total = conquistas.length;
    let feitas = 0;

    conquistas.forEach(function(c){

        let ok = jogo.conquistas[c.id];

        if(ok) feitas++;

        html += `

        <div class="resumo-compra">

            <strong>${ok ? "✅" : "🔒"} ${c.nome}</strong>

            <small>${c.descricao}</small><br>

            <small>💰 Recompensa:
            R$ ${c.recompensa.toLocaleString("pt-BR")}</small>

        </div>

        `;

    });

    let porcentagem = Math.floor((feitas/total)*100);

    html += `

        <br>

        <h3>Progresso</h3>

        <p>${feitas} / ${total} conquistas</p>

        <div style="
            width:100%;
            height:18px;
            background:#222;
            border-radius:10px;
            overflow:hidden;
        ">

            <div style="
                width:${porcentagem}%;
                height:100%;
                background:#ffc400;
            "></div>

        </div>

        <br>

        <strong>${porcentagem}% concluído</strong>

    </div>

    `;

    conteudo.innerHTML = html;

}

// ===========================
// CONQUISTAS SECRETAS
// ===========================

const conquistasSecretas = [

{

id:"porsche",

nome:"🏎 Colecionador Porsche",

descricao:"Compre um Porsche.",

recompensa:25000

},

{

id:"bmw",

nome:"💎 Apaixonado por BMW",

descricao:"Compre uma BMW.",

recompensa:15000

},

{

id:"mercedes",

nome:"⭐ Classe Premium",

descricao:"Compre uma Mercedes.",

recompensa:18000

},

{

id:"ferrari",

nome:"🐎 Cavalo Rampante",

descricao:"Compre uma Ferrari.",

recompensa:100000

},

{

id:"lamborghini",

nome:"🔥 Touro Italiano",

descricao:"Compre uma Lamborghini.",

recompensa:120000

}

];

// ===========================
// VERIFICAR CONQUISTAS SECRETAS
// ===========================

function verificarMarca(nomeCarro){

    iniciarConquistas();

    nomeCarro = nomeCarro.toLowerCase();

    if(nomeCarro.includes("porsche"))
        desbloquearConquistaEspecial("porsche");

    if(nomeCarro.includes("bmw"))
        desbloquearConquistaEspecial("bmw");

    if(nomeCarro.includes("mercedes"))
        desbloquearConquistaEspecial("mercedes");

    if(nomeCarro.includes("ferrari"))
        desbloquearConquistaEspecial("ferrari");

    if(nomeCarro.includes("lamborghini"))
        desbloquearConquistaEspecial("lamborghini");

}

function desbloquearConquistaEspecial(id){

    if(jogo.conquistas[id]) return;

    let c = conquistasSecretas.find(x=>x.id==id);

    if(!c) return;

    jogo.conquistas[id]=true;

    jogo.dinheiro += c.recompensa;

    mostrarAvisoTopo(

        "🎉 CONQUISTA ESPECIAL<br><br>"+

        c.nome+

        "<br><br>💰 +" +

        c.recompensa.toLocaleString("pt-BR")

    );

    salvarJogo();

}

// ===========================
// ESTATÍSTICAS
// ===========================

function quantidadeConquistas(){

    iniciarConquistas();

    return Object.keys(jogo.conquistas).length;

}

// ===========================
// CHAMAR AUTOMATICAMENTE
// ===========================

setInterval(function(){

    verificarConquistas();

},3000);