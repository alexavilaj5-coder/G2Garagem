function mostrarPatio() {
    let porcentagemVagas = (jogo.carros.length / jogo.empresa.vagas) * 100;

    let html = `
    <div class="garagem-header">
        <div class="garagem-titulo">
            <span class="garagem-icone">🏢</span>
            <div class="garagem-texto-titulo">
                <h1>MEU PÁTIO</h1>
                <p>Gerenciamento de Frota</p>
            </div>
        </div>
        <div class="vagas-container">
            <div class="vagas-info">
                <span>Vagas Ocupadas</span>
                <strong>${jogo.carros.length} / ${jogo.empresa.vagas}</strong>
            </div>
            <div class="vagas-barra-fundo">
                <div class="vagas-barra-progresso" style="width: ${porcentagemVagas}%"></div>
            </div>
        </div>
    </div>
    `;

    if (jogo.carros.length == 0) {
        html += `
        <div class="card-vazio">
            <div class="vazio-icone">🅿️</div>
            <h3>Pátio Vazio</h3>
            <p>Nenhum veículo em estoque. Visite o mercado para adquirir unidades.</p>
        </div>
        `;
    } else {
        html += `<div class="patio-grid">`;

        jogo.carros.forEach(function (carro, index) {
            let imagemPadrao = 'imagens/carros/gol.jpg';
            let imagemUrl = carro.foto ? `imagens/carros/${carro.foto}` : imagemPadrao;

            let kmSeguro = (carro.km || 0).toLocaleString("pt-BR");
            let compraFormatada = (carro.compra || carro.precoCompra || 0).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            let fipeFormatada = (carro.fipe || 0).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            let qtdDefeitos = carro.defeitos ? carro.defeitos.length : 0;

            let classeBorda = 'estado-perfeito';
            if (qtdDefeitos > 0 && qtdDefeitos < 3) classeBorda = 'estado-atencao';
            if (qtdDefeitos >= 3) classeBorda = 'estado-critico';

            // Adicionamos a chamada para ver os detalhes do carro ao clicar no card
            html += `
            <div class="card carro-card ${classeBorda}" onclick="verDetalhesCarro(${index})">
                
                <div class="carro-imagem-container">
                    <img src="${imagemUrl}" onerror="this.src='${imagemPadrao}'" alt="${carro.marca} ${carro.nome}">
                    <div class="overlay-defeitos ${qtdDefeitos > 0 ? 'tem-defeito' : ''}">
                        <span class="icone-defeito">🔧</span>
                        <span class="numero-defeito">${qtdDefeitos}</span>
                    </div>
                </div>

                <div class="carro-info-basica">
                    <h2>${carro.marca || "Sem Marca"}</h2>
                    <h3>${carro.modelo || carro.nome || "Sem Modelo"}</h3>
                </div>

                <div class="carro-stats-grid">
                    <div class="stat-item">
                        <span class="stat-icone">📅</span>
                        <span class="stat-valor">${carro.ano || "--"}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icone">🛣️</span>
                        <span class="stat-valor">${kmSeguro} <small>km</small></span>
                    </div>
                </div>

                <div class="carro-financeiro">
                    <div class="fin-linha">
                        <span class="fin-label">Compra</span>
                        <strong class="fin-valor compra">${compraFormatada}</strong>
                    </div>
                    <div class="fin-linha">
                        <span class="fin-label">Valor FIPE</span>
                        <strong class="fin-valor fipe">${fipeFormatada}</strong>
                    </div>
                </div>

                <button class="btn-acao-ghost">
                    🔍 Detalhes do Veículo
                </button>

            </div>
            `;
        });

        html += `</div>`;
    }

    conteudo.innerHTML = html;
}

// Função provisional para abrir os detalhes quando você clica no carro
function verDetalhesCarro(index) {
    let carro = jogo.carros[index];
    if (!carro) return;
    
    // Se você já tiver uma função antiga de inspecionar carro no seu jogo, pode chamá-la aqui.
    // Exemplo básico temporário:
    mostrarAlerta("🚘 " + carro.marca + " " + carro.modelo, `Ano: ${carro.ano}\nQuilometragem: ${(carro.km || 0).toLocaleString("pt-BR")} km\nDefeitos: ${carro.defeitos ? carro.defeitos.length : 0}`);
}