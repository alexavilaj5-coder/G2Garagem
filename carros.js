function mostrarPatio(){

    let html = `
    <div class="card">
        <h2>🏢 Garagem </h2>
        <p><b>Vagas:</b> ${jogo.carros.length}/${jogo.empresa.vagas}</p>
    </div>
    `;

    if(jogo.carros.length == 0){

        html += `
        <div class="card">
            <p>🚗 Você não possui carros.</p>
        </div>
        `;

    }else{

        jogo.carros.forEach(function(carro, index){

            // Verifica se o carro tem foto salva, senão exibe o placeholder padrão
            let imagemHtml = carro.foto 
                ? `<img src="imagens/carros/${carro.foto}" onerror="this.src='imagens/carros/gol.jpg'" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:10px;">`
                : `<div style="width: 100%; height: 160px; background: #18181b; border: 2px dashed #3f3f46; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #71717a; font-family: monospace; gap: 8px; margin-bottom:10px;">
                    <div style="font-size: 40px; opacity: 0.6;">🚘</div>
                    <span style="font-size: 12px; font-weight: bold; letter-spacing: 1px;">SEM FOTO DISPONÍVEL</span>
                   </div>`;

            html += `

            <div class="card">

                ${imagemHtml}

                <h2>${carro.marca} ${carro.nome}</h2>

                <h3>${carro.versao}</h3>

                <p>📅 Ano: ${carro.ano}</p>

                <p>🛣️ KM: ${carro.km.toLocaleString("pt-BR")}</p>

                <p>🎨 Cor: ${carro.cor}</p>

                <p>📖 Histórico: ${carro.historico}</p>

                <hr>

                <p>💰 Comprado por</p>

                <h3 style="color:#ff9800;">
                R$ ${carro.compra.toLocaleString("pt-BR")}
                </h3>

                <p>💵 FIPE</p>

                <h3 style="color:#4CAF50;">
                R$ ${carro.fipe.toLocaleString("pt-BR")}
                </h3>

                <p>🔧 Defeitos: ${carro.defeitos.length}</p>

                <hr>

            </div>

            <br>

            `;

        });

    }

    conteudo.innerHTML = html;

}

// ===========================
// COMPRAR CARRO
// ===========================

function comprarCarro(){

    if(!jogo.ofertaAtual){

        mostrarAlerta(
            "🚗 Mercado",
            "Nenhum veículo disponível."
        );

        return;

    }

    // Verifica vagas da empresa
    if(jogo.carros.length >= jogo.empresa.vagas){

        mostrarAlerta(
            "🚫 Garagem Lotada",
            `Sua empresa possui apenas ${jogo.empresa.vagas} vagas.<br><br>Venda um veículo ou expanda a empresa para comprar mais carros.`
        );

        return;

    }

    let carro = {

        marca: jogo.ofertaAtual.marca,
        nome: jogo.ofertaAtual.nome,
        versao: jogo.ofertaAtual.versao,
        ano: jogo.ofertaAtual.ano,
        km: jogo.ofertaAtual.km,
        cor: jogo.ofertaAtual.cor,
        historico: jogo.ofertaAtual.historico,
        defeitos: JSON.parse(JSON.stringify(jogo.ofertaAtual.defeitos)),
        custo: jogo.ofertaAtual.custo,
        fipe: jogo.ofertaAtual.fipe,
        compra: jogo.ofertaAtual.preco,
        foto: jogo.ofertaAtual.imagem // <--- Salva a foto do mercado para aparecer na garagem!

    };

    if(jogo.dinheiro < carro.compra){

        mostrarAlerta(
            "💸 Atenção",
            "Dinheiro insuficiente."
        );

        return;

    }

    jogo.dinheiro -= carro.compra;

    jogo.carros.push(carro);
    
    jogo.ofertaAtual = null;

    jogo.estatisticas.comprados++;

    atualizarPainel();

    salvarJogo();

    mostrarAlerta(
        "🚗 Compra realizada",
        "Veículo comprado com sucesso!"
    );

    gerarOferta();

}