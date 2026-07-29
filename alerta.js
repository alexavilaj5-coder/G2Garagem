// ===========================
// SISTEMA DE ALERTAS V2.1 (COM ATALHOS E FILA OTIMIZADA)
// G2 GARAGEM
// ===========================

let filaAlertas = [];
let alertaAberto = false;

function mostrarAlerta(titulo, texto){
    // Evita duplicar exatamente o mesmo alerta seguido na fila
    if(filaAlertas.length > 0) {
        let ultimo = filaAlertas[filaAlertas.length - 1];
        if(ultimo.titulo === titulo && ultimo.texto === texto) {
            return; 
        }
    }

    filaAlertas.push({
        titulo,
        texto
    });

    if(!alertaAberto){
        abrirProximoAlerta();
    }
}

function abrirProximoAlerta(){
    if(filaAlertas.length === 0){
        alertaAberto = false;
        return;
    }

    alertaAberto = true;
    let alerta = filaAlertas.shift();

    const box = document.getElementById("alerta");
    if(!box) return;

    document.getElementById("alertaTitulo").innerHTML = alerta.titulo;

    // Mantém as quebras de linha e trata nulos com segurança
    let textoSeguro = alerta.texto ? alerta.texto.replace(/\n/g, "<br>") : "";
    document.getElementById("alertaTexto").innerHTML = textoSeguro;

    box.style.display = "flex";

    // Reinicia a animação de forma limpa
    box.classList.remove("abrindo");
    void box.offsetWidth;
    box.classList.add("abrindo");
}

function fecharAlerta(){
    const box = document.getElementById("alerta");
    if(box) {
        box.style.display = "none";
    }

    alertaAberto = false;

    if(filaAlertas.length > 0){
        setTimeout(abrirProximoAlerta, 150);
    }
}

// ===========================
// ATALHOS DE TECLADO (ENTER / ESC)
// ===========================
document.addEventListener("keydown", function(event){
    if(alertaAberto && (event.key === "Enter" || event.key === "Escape" || event.key === " ")) {
        event.preventDefault(); // Evita cliques duplos indesejados na tela
        fecharAlerta();
    }
});