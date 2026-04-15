// ----- GERENCIADOR DE ABAS -----

const abaDistancia = document.getElementById('abaDistancia');
const abaPontoMedio = document.getElementById('abaPontoMedio');
const abaMediana = document.getElementById('abaMediana');
const abaBaricentro = document.getElementById('abaBaricentro');
const abaAlinhamento = document.getElementById('abaAlinhamento');

const conteudoDist = document.getElementById('conteudoDistancia');
const conteudoMed = document.getElementById('conteudoPontoMedio');
const conteudoMediana = document.getElementById('conteudoMediana');
const conteudoBari = document.getElementById('conteudoBaricentro');
const conteudoAlin = document.getElementById('conteudoAlinhamento');

function esconderTodasAbas() {
    conteudoDist.style.display = 'none';
    conteudoMed.style.display = 'none';
    conteudoMediana.style.display = 'none';
    conteudoBari.style.display = 'none';
    conteudoAlin.style.display = 'none';
    
    document.querySelectorAll('.menu-abas button').forEach(btn => {
        btn.classList.remove('aba-ativa');
    });
}

function mostrarDistancia() {
    esconderTodasAbas();
    conteudoDist.style.display = 'block';
    abaDistancia.classList.add('aba-ativa');
    setTimeout(calcularDistancia, 10); // Pequeno delay para o canvas renderizar
}

function mostrarPontoMedio() {
    esconderTodasAbas();
    conteudoMed.style.display = 'block';
    abaPontoMedio.classList.add('aba-ativa');
    setTimeout(calcularPontoMedio, 10);
}

function mostrarMediana() {
    esconderTodasAbas();
    conteudoMediana.style.display = 'block';
    abaMediana.classList.add('aba-ativa');
    setTimeout(calcularMediana, 10);
}

function mostrarBaricentro() {
    esconderTodasAbas();
    conteudoBari.style.display = 'block';
    abaBaricentro.classList.add('aba-ativa');
    setTimeout(calcularBaricentro, 10);
}

function mostrarAlinhamento() {
    esconderTodasAbas();
    conteudoAlin.style.display = 'block';
    abaAlinhamento.classList.add('aba-ativa');
    setTimeout(verificarAlinhamento, 10);
}

abaDistancia.addEventListener('click', mostrarDistancia);
abaPontoMedio.addEventListener('click', mostrarPontoMedio);
abaMediana.addEventListener('click', mostrarMediana);
abaBaricentro.addEventListener('click', mostrarBaricentro);
abaAlinhamento.addEventListener('click', mostrarAlinhamento);

// ----- FÁBRICA DE CANVAS (Função que retorna um desenhista configurado) -----

function criarDesenhista(canvasId) {
    const tela = document.getElementById(canvasId);
    const pincel = tela.getContext('2d');
    const MEIO_X = 250;
    const MEIO_Y = 250;
    const ESCALA = 20;
    
    function converterX(xMat) {
        return MEIO_X + (xMat * ESCALA);
    }
    
    function converterY(yMat) {
        return MEIO_Y - (yMat * ESCALA);
    }
    
    function desenharPlanoDeFundo() {
        pincel.clearRect(0, 0, 500, 500);
        
        pincel.beginPath();
        pincel.strokeStyle = "#e0e0e0";
        pincel.lineWidth = 1;
        
        for (let i = -10; i <= 10; i++) {
            let posX = converterX(i);
            pincel.moveTo(posX, 0);
            pincel.lineTo(posX, 500);
            
            let posY = converterY(i);
            pincel.moveTo(0, posY);
            pincel.lineTo(500, posY);
        }
        pincel.stroke();
    
        pincel.beginPath();
        pincel.strokeStyle = "#333";
        pincel.lineWidth = 2.5;
        pincel.moveTo(0, MEIO_Y);
        pincel.lineTo(500, MEIO_Y);
        pincel.moveTo(MEIO_X, 0);
        pincel.lineTo(MEIO_X, 500);
        pincel.stroke();
        
        pincel.font = "14px Arial";
        pincel.fillStyle = "#333";
        pincel.fillText("x", 480, MEIO_Y - 5);
        pincel.fillText("y", MEIO_X + 10, 15);
    }
    
    function desenharPonto(xMat, yMat, cor, nome) {
        let xTela = converterX(xMat);
        let yTela = converterY(yMat);
        
        pincel.beginPath();
        pincel.arc(xTela, yTela, 6, 0, 2 * Math.PI);
        pincel.fillStyle = cor;
        pincel.fill();
        pincel.strokeStyle = "#222";
        pincel.lineWidth = 2;
        pincel.stroke();
        
        pincel.font = "bold 14px Arial";
        pincel.fillStyle = "#1a1a2e";
        pincel.fillText(nome, xTela + 12, yTela - 12);
        pincel.fillStyle = cor;
        pincel.fillText(nome, xTela + 13, yTela - 13);
    }
    
    function desenharLinha(x1, y1, x2, y2, cor = "#8888cc", tracejada = false) {
        pincel.beginPath();
        pincel.moveTo(converterX(x1), converterY(y1));
        pincel.lineTo(converterX(x2), converterY(y2));
        pincel.strokeStyle = cor;
        pincel.lineWidth = 2.5;
        if (tracejada) pincel.setLineDash([5, 5]);
        pincel.stroke();
        pincel.setLineDash([]);
    }
    
    return { desenharPlanoDeFundo, desenharPonto, desenharLinha };
}

// ----- FUNÇÕES DE CÁLCULO (Cada uma usa seu próprio canvas) -----

function calcularDistancia() {
    const d = criarDesenhista('canvasDistancia');
    
    let ax = parseFloat(document.getElementById('distAx').value);
    let ay = parseFloat(document.getElementById('distAy').value);
    let bx = parseFloat(document.getElementById('distBx').value);
    let by = parseFloat(document.getElementById('distBy').value);
    
    let deltaX = bx - ax;
    let deltaY = by - ay;
    let distancia = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    
    document.getElementById('resultadoDistancia').innerHTML = `📐 Distância = ${distancia.toFixed(2)}`;
    
    d.desenharPlanoDeFundo();
    d.desenharLinha(ax, ay, bx, by);
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
}

function calcularPontoMedio() {
    const d = criarDesenhista('canvasPontoMedio');
    
    let ax = parseFloat(document.getElementById('medAx').value);
    let ay = parseFloat(document.getElementById('medAy').value);
    let bx = parseFloat(document.getElementById('medBx').value);
    let by = parseFloat(document.getElementById('medBy').value);
    
    let mx = (ax + bx) / 2;
    let my = (ay + by) / 2;
    
    document.getElementById('resultadoPontoMedio').innerHTML = `🎯 Ponto Médio M = (${mx.toFixed(2)}, ${my.toFixed(2)})`;
    
    d.desenharPlanoDeFundo();
    d.desenharLinha(ax, ay, bx, by);
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
    d.desenharPonto(mx, my, "#e74c3c", "M");
}

function calcularMediana() {
    const d = criarDesenhista('canvasMediana');
    
    let ax = parseFloat(document.getElementById('mednAx').value);
    let ay = parseFloat(document.getElementById('mednAy').value);
    let bx = parseFloat(document.getElementById('mednBx').value);
    let by = parseFloat(document.getElementById('mednBy').value);
    let cx = parseFloat(document.getElementById('mednCx').value);
    let cy = parseFloat(document.getElementById('mednCy').value);
    
    let mBCx = (bx + cx) / 2;
    let mBCy = (by + cy) / 2;
    
    let deltaX = mBCx - ax;
    let deltaY = mBCy - ay;
    let comprimento = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    
    document.getElementById('resultadoMediana').innerHTML = `📊 Comprimento da Mediana = ${comprimento.toFixed(2)}`;
    
    d.desenharPlanoDeFundo();
    d.desenharLinha(ax, ay, bx, by, "#a0a0c0");
    d.desenharLinha(bx, by, cx, cy, "#a0a0c0");
    d.desenharLinha(cx, cy, ax, ay, "#a0a0c0");
    d.desenharLinha(ax, ay, mBCx, mBCy, "#e74c3c");
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
    d.desenharPonto(cx, cy, "#f39c12", "C");
    d.desenharPonto(mBCx, mBCy, "#e74c3c", "M");
}

function calcularBaricentro() {
    const d = criarDesenhista('canvasBaricentro');
    
    let ax = parseFloat(document.getElementById('barAx').value);
    let ay = parseFloat(document.getElementById('barAy').value);
    let bx = parseFloat(document.getElementById('barBx').value);
    let by = parseFloat(document.getElementById('barBy').value);
    let cx = parseFloat(document.getElementById('barCx').value);
    let cy = parseFloat(document.getElementById('barCy').value);
    
    let gx = (ax + bx + cx) / 3;
    let gy = (ay + by + cy) / 3;
    
    document.getElementById('resultadoBaricentro').innerHTML = `🔺 Baricentro G = (${gx.toFixed(2)}, ${gy.toFixed(2)})`;
    
    d.desenharPlanoDeFundo();
    d.desenharLinha(ax, ay, bx, by, "#a0a0c0");
    d.desenharLinha(bx, by, cx, cy, "#a0a0c0");
    d.desenharLinha(cx, cy, ax, ay, "#a0a0c0");
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
    d.desenharPonto(cx, cy, "#f39c12", "C");
    d.desenharPonto(gx, gy, "#9b59b6", "G");
}

function verificarAlinhamento() {
    const d = criarDesenhista('canvasAlinhamento');
    
    let ax = parseFloat(document.getElementById('alnAx').value);
    let ay = parseFloat(document.getElementById('alnAy').value);
    let bx = parseFloat(document.getElementById('alnBx').value);
    let by = parseFloat(document.getElementById('alnBy').value);
    let cx = parseFloat(document.getElementById('alnCx').value);
    let cy = parseFloat(document.getElementById('alnCy').value);
    
    let det = (ax*by*1 + ay*1*cx + 1*bx*cy) - (1*by*cx + ax*1*cy + ay*bx*1);
    let alinhado = Math.abs(det) < 0.001;
    
    let mensagem = alinhado ? "✅ SIM! Os pontos estão ALINHADOS." : "❌ NÃO! Os pontos NÃO estão alinhados.";
    
    document.getElementById('resultadoAlinhamento').innerHTML = `${mensagem} (Determinante = ${det.toFixed(2)})`;
    
    d.desenharPlanoDeFundo();
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
    d.desenharPonto(cx, cy, "#f39c12", "C");
    
    if (alinhado) {
        d.desenharLinha(ax, ay, cx, cy, "#e74c3c");
    }
}

// ----- CONECTAR BOTÕES -----

document.getElementById('btnDistancia').addEventListener('click', calcularDistancia);
document.getElementById('btnPontoMedio').addEventListener('click', calcularPontoMedio);
document.getElementById('btnMediana').addEventListener('click', calcularMediana);
document.getElementById('btnBaricentro').addEventListener('click', calcularBaricentro);
document.getElementById('btnAlinhamento').addEventListener('click', verificarAlinhamento);

// ----- INICIAR -----
mostrarDistancia();