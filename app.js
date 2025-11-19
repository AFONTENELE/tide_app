const resultado = document.getElementById("resultado");
const imgMare = document.getElementById("img-mare");
const previsaoDiv = document.getElementById("previsao");

// Caminho das fotos CORRIGIDO para sua estrutura
const FOTO_CHEIA = "imgs/foto1.png"; 
const FOTO_BAIXA = "imgs/foto2.png"; 
const MARE_ALTA = 2.5; // Limiar definido aqui para ser usado globalmente

/* ==============================
   CÁLCULO DA FASE DA LUA COM EMOJIS
   ============================== */
function faseDaLua() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const dia = hoje.getDate();
    
    let lp = 2551443;
    let now = new Date(ano, mes - 1, dia, 20, 35, 0);
    let new_moon = new Date(1970, 0, 7, 20, 35, 0);

    let phase = ((now - new_moon) / 1000) % lp;
    let fase = Math.floor((phase / lp) * 8);

    const nomes = [
        "Lua Nova", "Crescente Iluminante", "Quarto Crescente", "Gibosa Crescente", 
        "Lua Cheia", "Gibosa Minguante", "Quarto Minguante", "Crescente Minguante"
    ];

    const emojis = [
        "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"
    ];

    return {
        nome: nomes[fase],
        emoji: emojis[fase]
    };
}

function mostrarLua() {
    const dadosLua = faseDaLua();

    document.getElementById("lua-emoji").textContent = dadosLua.emoji;
    document.getElementById("lua-nome").textContent = dadosLua.nome;

    document.getElementById("lua-emoji").style.display = "block";
}

/* ==============================
   FUNÇÕES DA MARÉ
   ============================== */
function dataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function mostrarMare() {
    const hoje = dataHoje();
    const dados = tabelasDeMare["LUIS_CORREIA"][hoje];

    if (!dados) {
        resultado.innerHTML = `<h3>Sem dados de maré para ${hoje}</h3>`;
        imgMare.style.display = "none";
        return;
    }

    let html = `<h3>Maré do dia ${hoje}</h3>`;
    
    // CORREÇÃO: ADICIONANDO EMOJIS NA MARÉ DO DIA
    dados.forEach(m => {
        const tipo = m.altura >= MARE_ALTA ? "⬆️ Alta" : "⬇️ Baixa";
        html += `<p>🌊 <b>${m.hora}</b> — ${m.altura} m — ${tipo}</p>`;
    });
    resultado.innerHTML = html;

    const agora = new Date();
    const minAgora = agora.getHours() * 60 + agora.getMinutes();
    let proxima = dados[0];

    for (let i = 0; i < dados.length; i++) {
        const [h, m] = dados[i].hora.split(":").map(Number);
        const minMare = h * 60 + m;

        if (minMare >= minAgora) {
            proxima = dados[i];
            break;
        }
    }

    imgMare.src = proxima.altura >= MARE_ALTA ? FOTO_CHEIA : FOTO_BAIXA;
    imgMare.style.display = "block";
}

/* ==============================
   PREVISÃO DA MARÉ — DIA SEGUINTE
   ============================== */
function mostrarPrevisao() {
    const hoje = new Date();
    const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    const ano = amanha.getFullYear();
    const mes = String(amanha.getMonth() + 1).padStart(2, "0");
    const dia = String(amanha.getDate()).padStart(2, "0");

    const chave = `${ano}-${mes}-${dia}`;

    const dados = tabelasDeMare["LUIS_CORREIA"][chave];

    if (!dados) {
        previsaoDiv.innerHTML = "<h3>Sem previsão disponível para amanhã.</h3>";
        return;
    }

    let html = `<h3>📅 Previsão das Marés — ${dia}/${mes}</h3>`;

    dados.forEach(m => {
        const tipo = m.altura >= MARE_ALTA ? "⬆️ Maré Alta" : "⬇️ Maré Baixa";
        html += `<p>🌊 ${m.hora} — <b>${m.altura} m</b> — ${tipo}</p>`;
    });

    previsaoDiv.innerHTML = html;
}

/* ==============================
   INICIALIZAÇÃO
   ============================== */
mostrarLua();
mostrarMare();
mostrarPrevisao();