// ===========================================
// SOM.JS - SISTEMA DE PROJETOS DE SOM (EQUILIBRADO)
// ===========================================

const projetosSom = [
    { 
        id: "original", 
        nome: "Som Original de Fábrica", 
        descricao: "Apenas o rádio original e alto-falantes nas portas.", 
        custo: 0, 
        bonusValorCarro: 0, // Sem bônus extra
        badge: "🎵 Básico" 
    },
    { 
        id: "portamalas", 
        nome: "Trio Porta-Malas Médio", 
        descricao: "Subwoofer de 12 e kit de cornetas na mala.", 
        custo: 2500, 
        bonusValorCarro: 1500, // Adiciona valor fixo ou proporcional seguro
        badge: "🔊 Estiloso" 
    },
    { 
        id: "Forte", 
        nome: "2x15 de 1500rms", 
        descricao: "4x Cornetas e 2 Tweeters.", 
        custo: 6500, 
        bonusValorCarro: 4000, 
        badge: "🔥 Respeitado" 
    },
    { 
        id: "Paredao", 
        nome: "Reboque de som", 
        descricao: "8x12 de 1200rms", 
        custo: 15000, 
        bonusValorCarro: 9500, 
        badge: "🏆 Monstro" 
    }
];

function abrirLojaSom(indiceCarro) {
    if (typeof jogo === 'undefined') return;
    let carro = jogo.carros[indiceCarro];
    if (!carro) return;

    if (!carro.somSetup) {
        carro.somSetup = "original";
    }

    let container = document.getElementById('conteudo') || document.body;

    let html = `
    <div class="card" style="background: #121214; border: 1px solid #27272a; padding: 20px; border-radius: 12px; color: #fff; font-family: sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin:0; font-size: 18px; color:#38bdf8; text-transform:uppercase;">🔊 Projetos de Som Automotivo</h2>
            <button onclick="mostrarOficina()" style="padding: 6px 12px; background: #27272a; color: #fff; border: 1px solid #3f3f46; border-radius: 6px; cursor: pointer;">⬅️ Voltar</button>
        </div>

        <p style="color:#a1a1aa; font-size:13px; margin-bottom: 20px;">
            Veículo: <strong style="color:#fff;">${carro.marca} ${carro.modelo}</strong><br>
            Instalar um som de qualidade atrai compradores e valoriza o veículo!
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
    `;

    projetosSom.forEach(proj => {
        let isAtual = carro.somSetup === proj.id;
        
        html += `
            <div style="background: ${isAtual ? '#052e16' : '#18181b'}; border: 1px solid ${isAtual ? '#22c55e' : '#27272a'}; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 11px; background: #27272a; padding: 2px 6px; border-radius: 4px; color: #38bdf8;">${proj.badge}</span>
                    <h3 style="margin: 6px 0 4px 0; font-size: 15px; color: #fff;">${proj.nome}</h3>
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa;">${proj.descricao}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #4CAF50;"><strong>Custo:</strong> R$ ${proj.custo.toLocaleString("pt-BR")} | <strong>Valorização:</strong> +R$ ${proj.bonusValorCarro.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                    ${isAtual ? 
                        `<span style="color: #22c55e; font-weight: bold; font-size: 13px;">✅ Instalado</span>` : 
                        `<button onclick="instalarProjetoSom(${indiceCarro}, '${proj.id}')" style="padding: 10px 16px; background: #0284c7; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">Instalar</button>`
                    }
                </div>
            </div>
        `;
    });

    html += `
        </div>
    </div>
    `;

    container.innerHTML = html;
}

function instalarProjetoSom(indiceCarro, idProjeto) {
    let carro = jogo.carros[indiceCarro];
    let projetoEscolhido = projetosSom.find(p => p.id === idProjeto);

    if (!carro || !projetoEscolhido) return;

    if (jogo.dinheiro < projetoEscolhido.custo) {
        alert(`💸 Dinheiro insuficiente! Você precisa de R$ ${projetoEscolhido.custo.toLocaleString("pt-BR")}.`);
        return;
    }

    // Salva o preço base limpo do carro na primeira modificação de som para servir de âncora
    if (!carro.precoBaseOriginal) {
        // Se o carro já tiver um som anterior, removemos o bônus antigo antes de travar a base
        let somAnterior = projetosSom.find(p => p.id === carro.somSetup);
        let valorAtualSemSom = carro.precoVenda - (somAnterior ? somAnterior.bonusValorCarro : 0);
        carro.precoBaseOriginal = valorAtualSemSom;
    }

    // Desconta o dinheiro da instalação
    jogo.dinheiro -= projetoEscolhido.custo;
    carro.somSetup = projetoEscolhido.id;

    // Recalcula o preço final somando a base original + o bônus exato do novo projeto escolhido
    carro.precoVenda = carro.precoBaseOriginal + projetoEscolhido.bonusValorCarro;

    if (typeof atualizarPainel === 'function') atualizarPainel();
    if (typeof salvarJogo === 'function') salvarJogo();

    alert(`🎉 Projeto "${projetoEscolhido.nome}" instalado com sucesso!`);
    abrirLojaSom(indiceCarro);
}