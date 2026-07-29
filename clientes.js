// ===========================
// CLIENTES.JS V4.0 (CONTRAPROPOSTA + ESCOLHA DE CARRO)
// G2 GARAGEM
// ===========================

const nomesClientes = [
"João","Carlos","Pedro","Lucas","Marcos","André",
"Roberto","Fernando","Gabriel","Felipe",
"Juliana","Amanda","Camila","Patrícia","Fernanda",
"Mariana","Nelson","Dexter","Viviane","Mickael",
"Tales","Raffa Repasses","Giulia","Laura","Bruno",
"Tiago","Mecânica Midas","José","Sr Amir",
"Sampaio Garagem","Gustavo","Ronaldo","Joana",
"Isabelle","Bernardo","Carmen","Ana",
"Pietra","Pietro","Antoni","Joaquim"
];

const tiposClientes=[
{ nome:"Cliente Comum", bonus:0 },
{ nome:"Revendedor", bonus:-3 },
{ nome:"Colecionador", bonus:4 },
{ nome:"Cliente Exigente", bonus:-6 },
{ nome:"Comprador Desesperado", bonus:8 }
];

function mostrarClientes(){
    if(!jogo.carros || jogo.carros.length == 0){
        conteudo.innerHTML=`
        <div class="card">
            <h2>👥 Clientes & Vendas</h2>
            <hr>
            <p>🚗 Você não possui veículos no pátio para vender.</p>
        </div>
        `;
        return;
    }

    if(jogo.clienteAtual){
        mostrarClienteAtual();
        return;
    }

    gerarNovoCliente();
}

function gerarNovoCliente(){
    if(Math.random() < 0.20){
        jogo.clienteAtual = { semCliente: true };
        mostrarClienteAtual();
        return;
    }

    // Escolhe um carro aleatório inicialmente para o cliente
    let indice = aleatorio(0, jogo.carros.length - 1);
    let carro = jogo.carros[indice];

    let nome = nomesClientes[aleatorio(0, nomesClientes.length - 1)];
    let tipo = tiposClientes[aleatorio(0, tiposClientes.length - 1)];
    let oferta = calcularOferta(carro, tipo.bonus);

    jogo.clienteAtual = {
        nome: nome,
        tipo: tipo.nome,
        bonus: tipo.bonus,
        carro: indice,
        oferta: oferta,
        tentativasNegociacao: 0 // Quantas vezes tentou pechinchar
    };

    salvarJogo();
    mostrarClienteAtual();
}

function mostrarClienteAtual(){
    let cliente = jogo.clienteAtual;

    if(!cliente || cliente.semCliente){
        conteudo.innerHTML = `
        <div class="card">
            <h2>😴 Movimento Fraco</h2>
            <hr>
            <p>Hoje ninguém apareceu para comprar veículos.</p>
            <br>
            <button onclick="proximoDia()">⏭️ Passar o Dia</button>
        </div>
        `;
        return;
    }

    let carro = jogo.carros[cliente.carro];
    if(!carro){
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
        return;
    }

    let html = `
    <div class="card">
        <h2>👤 ${cliente.nome}</h2>
        <p style="color:#00d084">Interesse: <strong>${cliente.tipo}</strong></p>
        <hr>
        
        <h3>🚗 Veículo em análise:</h3>
        <p><strong>${carro.marca} ${carro.modelo || carro.nome}</strong> (${carro.ano})</p>
        <p>🛣️ ${carro.km ? carro.km.toLocaleString("pt-BR") : "0"} km | 🎨 ${carro.cor || "Original"}</p>
        ${carro.rodas ? `<p>🛞 Rodas: ${carro.rodas}</p>` : ""}
        ${carro.som ? `<p>🔊 Som: ${carro.som}</p>` : ""}
        <p>💰 FIPE: R$ ${carro.fipe.toLocaleString("pt-BR")}</p>
        
        <button onclick="abrirTrocaCarroCliente()" style="background:#444; color:#fff; padding:6px 10px; border:none; border-radius:4px; margin: 10px 0; cursor:pointer;">
            🔄 Oferecer outro carro do pátio
        </button>
        
        <hr>
        <h2 style="color:#4CAF50">
            Oferta do Cliente<br>
            R$ ${cliente.oferta.toLocaleString("pt-BR")}
        </h2>
        
        <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="aceitarOferta()" style="flex:1; background:#4CAF50; color:#fff; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                ✅ Aceitar
            </button>
            <button onclick="tentarContraproposta()" style="flex:1; background:#ff9800; color:#000; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;" title="Tentar negociar um valor melhor">
                💬 Contraproposta
            </button>
            <button onclick="recusarOferta()" style="flex:1; background:#f44336; color:#fff; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                ❌ Recusar
            </button>
        </div>
    </div>
    `;

    conteudo.innerHTML = html;
}

// ===========================
// ESCOLHER OUTRO CARRO DO PÁTIO PARA O CLIENTE
// ===========================
function abrirTrocaCarroCliente(){
    let html = `
    <div class="card">
        <h2>🔄 Escolher Veículo para o Cliente</h2>
        <p>Selecione qual carro do seu pátio você quer apresentar para ${jogo.clienteAtual.nome}:</p>
        <hr>
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    jogo.carros.forEach((carro, index) => {
        let statusOficina = (carro.reparos && carro.reparos.length > 0) ? " ⚠️ (Em Reparo)" : " ✅ Pronto";
        html += `
        <button onclick="trocarCarroClienteAtivo(${index})" style="padding: 10px; text-align: left; background: #222; color: #fff; border: 1px solid #444; border-radius: 6px; cursor: pointer;">
            <strong>${carro.marca} ${carro.modelo || carro.nome}</strong> (${carro.ano})${statusOficina}<br>
            <span style="font-size: 0.9em; color: #aaa;">FIPE: R$ ${carro.fipe.toLocaleString("pt-BR")}</span>
        </button>
        `;
    });

    html += `
        </div>
        <br>
        <button onclick="mostrarClienteAtual()" style="width:100%; padding:10px; background:#444; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
            ⬅️ Voltar
        </button>
    </div>
    `;

    conteudo.innerHTML = html;
}

function trocarCarroClienteAtivo(indiceCarro){
    let carro = jogo.carros[indiceCarro];
    jogo.clienteAtual.carro = indiceCarro;
    jogo.clienteAtual.oferta = calcularOferta(carro, jogo.clienteAtual.bonus);
    jogo.clienteAtual.tentativasNegociacao = 0; // Reseta tentativas ao trocar de carro
    salvarJogo();
    mostrarClienteAtual();
}

// ===========================
// SISTEMA DE CONTRAPROPOSTA (PECHINCHA)
// ===========================
function tentarContraproposta(){
    let cliente = jogo.clienteAtual;
    let carro = jogo.carros[cliente.carro];

    if(cliente.tentativasNegociacao >= 2){
        mostrarAlerta("⚠️ Negociação encerrada", `${cliente.nome} disse que o preço é final e foi embora irritado com tanta insistência!`);
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
        return;
    }

    cliente.tentativasNegociacao++;

    // Chance base de sucesso na negociação baseada no tipo de cliente e reputação
    let chanceSucesso = 0.6 - (cliente.tentativasNegociacao * 0.15) + ((jogo.reputacao || 0) * 0.01);

    if(Math.random() < chanceSucesso){
        // Cliente aceita subir um pouco a oferta (entre 5% e 12% a mais)
        let aumento = Math.floor(cliente.oferta * aleatorio(5, 12) / 100);
        cliente.oferta += aumento;

        // Limita para não passar de 105% da FIPE
        if(cliente.oferta > carro.fipe * 1.05){
            cliente.oferta = Math.floor(carro.fipe * 1.05);
        }

        salvarJogo();
        mostrarAlerta("💬 Deu certo!", `${cliente.nome} pensou bem e aceitou subir a oferta para:\n\nR$ ${cliente.oferta.toLocaleString("pt-BR")}!`);
    } else {
        // Cliente se irrita e abaixa um pouco a oferta ou rejeita
        let reducao = Math.floor(cliente.oferta * 0.05);
        cliente.oferta -= reducao;
        salvarJogo();
        mostrarAlerta("❌ Negociação difícil", `${cliente.nome} não gostou da sua insistência e reduziu a proposta!\n\nNova oferta: R$ ${cliente.oferta.toLocaleString("pt-BR")}`);
    }

    mostrarClienteAtual();
}

function calcularOferta(carro, bonus = 0){
    let minimo, maximo;

    if(carro.defeitos && carro.defeitos.length > 0){
        minimo = carro.fipe * 0.65;
        maximo = carro.fipe * 0.88;
    } else {
        minimo = carro.fipe * 0.85;
        maximo = carro.fipe * 0.98;
    }

    let oferta = Math.floor(Math.random() * (maximo - minimo) + minimo);
    oferta += (carro.fipe * (bonus / 100));
    oferta += (jogo.reputacao || 0) * 30;

    if(Math.random() < 0.03 || oferta > carro.fipe * 1.02){
        oferta = Math.floor(carro.fipe * 1.02);
    }

    return Math.floor(oferta);
}

function aceitarOferta(){
    let cliente = jogo.clienteAtual;
    if(!cliente) return;

    let carro = jogo.carros[cliente.carro];
    if(!carro){
        jogo.clienteAtual = null;
        mostrarClientes();
        return;
    }

    if(carro.reparos && carro.reparos.length > 0){
        mostrarAlerta(
            "🔧 Veículo em reparo",
            `${carro.marca} ${carro.modelo || carro.nome}\nAinda está na oficina. Aguarde o término dos reparos antes de entregar ao comprador.`
        );
        jogo.clienteAtual = null;
        salvarJogo();
        mostrarClientes();
        return;
    }

    let valor = cliente.oferta;
    jogo.dinheiro += valor;

    let precoCompraOriginal = carro.precoCompra || carro.compra || (carro.fipe * 0.5);
    let lucroVenda = valor - precoCompraOriginal;

    if(!jogo.lucro) jogo.lucro = 0;
    jogo.lucro += lucroVenda;

    if(!jogo.estatisticas) jogo.estatisticas = { comprados: 0, vendidos: 0, consertados: 0 };
    jogo.estatisticas.vendidos++;

    if(valor >= carro.fipe * 0.95){
        jogo.reputacao = (jogo.reputacao || 0) + 2;
    } else if(valor >= carro.fipe * 0.80){
        jogo.reputacao = (jogo.reputacao || 0) + 1;
    }

    jogo.carros.splice(cliente.carro, 1);
    jogo.clienteAtual = null;

    atualizarPainel();
    salvarJogo();

    mostrarAlerta(
        "🚗 Venda realizada com sucesso!",
        `👤 ${cliente.nome}\n\n💰 Venda: R$ ${valor.toLocaleString("pt-BR")}\n\n📈 Lucro Líquido: R$ ${lucroVenda.toLocaleString("pt-BR")}`
    );

    mostrarClientes();
}

function recusarOferta(){
    jogo.clienteAtual = null;
    salvarJogo();
    gerarNovoCliente();
}

function limparClienteDia(){
    jogo.clienteAtual = null;
    salvarJogo();
}

function atualizarClientesNovoDia(){
    limparClienteDia();
}

if(jogo.clienteAtual === undefined){
    jogo.clienteAtual = null;
}