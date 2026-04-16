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

function mostrarAba(conteudo, botao, funcaoCalculo) {
    esconderTodasAbas();
    conteudo.style.display = 'block';
    botao.classList.add('aba-ativa');
    setTimeout(funcaoCalculo, 10);
}

abaDistancia.addEventListener('click', () => mostrarAba(conteudoDist, abaDistancia, calcularDistancia));
abaPontoMedio.addEventListener('click', () => mostrarAba(conteudoMed, abaPontoMedio, calcularPontoMedio));
abaMediana.addEventListener('click', () => mostrarAba(conteudoMediana, abaMediana, calcularMediana));
abaBaricentro.addEventListener('click', () => mostrarAba(conteudoBari, abaBaricentro, calcularBaricentro));
abaAlinhamento.addEventListener('click', () => mostrarAba(conteudoAlin, abaAlinhamento, verificarAlinhamento));

function criarDesenhista(canvasId) {
    const tela = document.getElementById(canvasId);
    const pincel = tela.getContext('2d');
    const MEIO_X = 250;
    const MEIO_Y = 250;
    
    let ESCALA = 20;
    let OFFSET_X = 0;
    let OFFSET_Y = 0;
    
    function converterX(xMat) {
        return MEIO_X + ((xMat - OFFSET_X) * ESCALA);
    }
    
    function converterY(yMat) {
        return MEIO_Y - ((yMat - OFFSET_Y) * ESCALA);
    }
    
    function ajustarEscala(pontos) {
        if (pontos.length === 0) return;
        
        let xs = pontos.map(p => p.x);
        let ys = pontos.map(p => p.y);
        
        let minX = Math.min(...xs);
        let maxX = Math.max(...xs);
        let minY = Math.min(...ys);
        let maxY = Math.max(...ys);
        
        let rangeX = maxX - minX;
        let rangeY = maxY - minY;
        
        if (rangeX < 0.001) rangeX = 2;
        if (rangeY < 0.001) rangeY = 2;
        
        let maxRange = Math.max(rangeX, rangeY);
        ESCALA = Math.min(200 / maxRange, 50);
        ESCALA = Math.max(ESCALA, 5);
        
        OFFSET_X = (minX + maxX) / 2;
        OFFSET_Y = (minY + maxY) / 2;
    }
    
    function desenharPlanoDeFundo() {
        pincel.clearRect(0, 0, 500, 500);
        
        pincel.beginPath();
        pincel.strokeStyle = "#e0e0e0";
        pincel.lineWidth = 1;
        
        let rangeX = 250 / ESCALA;
        let rangeY = 250 / ESCALA;
        let inicioX = Math.floor(OFFSET_X - rangeX);
        let fimX = Math.ceil(OFFSET_X + rangeX);
        let inicioY = Math.floor(OFFSET_Y - rangeY);
        let fimY = Math.ceil(OFFSET_Y + rangeY);
        
        for (let i = inicioX; i <= fimX; i++) {
            let posX = converterX(i);
            if (posX >= 0 && posX <= 500) {
                pincel.moveTo(posX, 0);
                pincel.lineTo(posX, 500);
            }
        }
        
        for (let i = inicioY; i <= fimY; i++) {
            let posY = converterY(i);
            if (posY >= 0 && posY <= 500) {
                pincel.moveTo(0, posY);
                pincel.lineTo(500, posY);
            }
        }
        pincel.stroke();
    
        pincel.beginPath();
        pincel.strokeStyle = "#333";
        pincel.lineWidth = 2.5;
        
        let eixoX_Y = converterY(0);
        if (eixoX_Y >= 0 && eixoX_Y <= 500) {
            pincel.moveTo(0, eixoX_Y);
            pincel.lineTo(500, eixoX_Y);
        }
        
        let eixoY_X = converterX(0);
        if (eixoY_X >= 0 && eixoY_X <= 500) {
            pincel.moveTo(eixoY_X, 0);
            pincel.lineTo(eixoY_X, 500);
        }
        pincel.stroke();
        
        pincel.font = "12px Arial";
        pincel.fillStyle = "#333";
        if (eixoX_Y >= 10 && eixoX_Y <= 490) {
            pincel.fillText("x", 480, eixoX_Y - 5);
        }
        if (eixoY_X >= 10 && eixoY_X <= 490) {
            pincel.fillText("y", eixoY_X + 10, 15);
        }
        if (eixoY_X >= 10 && eixoY_X <= 490 && eixoX_Y >= 10 && eixoX_Y <= 490) {
            pincel.fillText("0", eixoY_X + 5, eixoX_Y - 5);
        }
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
    
    return { 
        desenharPlanoDeFundo, 
        desenharPonto, 
        desenharLinha, 
        ajustarEscala 
    };
}

function calcularDistancia() {
    const d = criarDesenhista('canvasDistancia');
    
    let ax = parseFloat(document.getElementById('distAx').value) || 0;
    let ay = parseFloat(document.getElementById('distAy').value) || 0;
    let bx = parseFloat(document.getElementById('distBx').value) || 0;
    let by = parseFloat(document.getElementById('distBy').value) || 0;
    
    let deltaX = bx - ax;
    let deltaY = by - ay;
    let distancia = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    
    document.getElementById('resultadoDistancia').innerHTML = `Distância = ${distancia.toFixed(2)}`;
    
    let pontos = [{x: ax, y: ay}, {x: bx, y: by}];
    d.ajustarEscala(pontos);
    d.desenharPlanoDeFundo();
    d.desenharLinha(ax, ay, bx, by);
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
}

function calcularPontoMedio() {
    const d = criarDesenhista('canvasPontoMedio');
    
    let ax = parseFloat(document.getElementById('medAx').value) || 0;
    let ay = parseFloat(document.getElementById('medAy').value) || 0;
    let bx = parseFloat(document.getElementById('medBx').value) || 0;
    let by = parseFloat(document.getElementById('medBy').value) || 0;
    
    let mx = (ax + bx) / 2;
    let my = (ay + by) / 2;
    
    document.getElementById('resultadoPontoMedio').innerHTML = `Ponto Médio M = (${mx.toFixed(2)}, ${my.toFixed(2)})`;
    
    let pontos = [{x: ax, y: ay}, {x: bx, y: by}, {x: mx, y: my}];
    d.ajustarEscala(pontos);
    d.desenharPlanoDeFundo();
    d.desenharLinha(ax, ay, bx, by);
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
    d.desenharPonto(mx, my, "#e74c3c", "M");
}

function calcularMediana() {
    const d = criarDesenhista('canvasMediana');
    
    let ax = parseFloat(document.getElementById('mednAx').value) || 0;
    let ay = parseFloat(document.getElementById('mednAy').value) || 0;
    let bx = parseFloat(document.getElementById('mednBx').value) || 0;
    let by = parseFloat(document.getElementById('mednBy').value) || 0;
    let cx = parseFloat(document.getElementById('mednCx').value) || 0;
    let cy = parseFloat(document.getElementById('mednCy').value) || 0;
    
    let mBCx = (bx + cx) / 2;
    let mBCy = (by + cy) / 2;
    
    let deltaX = mBCx - ax;
    let deltaY = mBCy - ay;
    let comprimento = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    
    document.getElementById('resultadoMediana').innerHTML = `Comprimento da Mediana = ${comprimento.toFixed(2)}`;
    
    let pontos = [{x: ax, y: ay}, {x: bx, y: by}, {x: cx, y: cy}, {x: mBCx, y: mBCy}];
    d.ajustarEscala(pontos);
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
    
    let ax = parseFloat(document.getElementById('barAx').value) || 0;
    let ay = parseFloat(document.getElementById('barAy').value) || 0;
    let bx = parseFloat(document.getElementById('barBx').value) || 0;
    let by = parseFloat(document.getElementById('barBy').value) || 0;
    let cx = parseFloat(document.getElementById('barCx').value) || 0;
    let cy = parseFloat(document.getElementById('barCy').value) || 0;
    
    let gx = (ax + bx + cx) / 3;
    let gy = (ay + by + cy) / 3;
    
    document.getElementById('resultadoBaricentro').innerHTML = `Baricentro G = (${gx.toFixed(2)}, ${gy.toFixed(2)})`;
    
    let pontos = [{x: ax, y: ay}, {x: bx, y: by}, {x: cx, y: cy}, {x: gx, y: gy}];
    d.ajustarEscala(pontos);
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
    
    let ax = parseFloat(document.getElementById('alnAx').value) || 0;
    let ay = parseFloat(document.getElementById('alnAy').value) || 0;
    let bx = parseFloat(document.getElementById('alnBx').value) || 0;
    let by = parseFloat(document.getElementById('alnBy').value) || 0;
    let cx = parseFloat(document.getElementById('alnCx').value) || 0;
    let cy = parseFloat(document.getElementById('alnCy').value) || 0;
    
    let det = (ax*by*1 + ay*1*cx + 1*bx*cy) - (1*by*cx + ax*1*cy + ay*bx*1);
    let alinhado = Math.abs(det) < 0.001;
    
    let mensagem = alinhado ? "✅ SIM! Os pontos estão ALINHADOS." : "❌ NÃO! Os pontos NÃO estão alinhados.";
    
    document.getElementById('resultadoAlinhamento').innerHTML = `${mensagem} (Determinante = ${det.toFixed(2)})`;
    
    let pontos = [{x: ax, y: ay}, {x: bx, y: by}, {x: cx, y: cy}];
    d.ajustarEscala(pontos);
    d.desenharPlanoDeFundo();
    d.desenharPonto(ax, ay, "#3498db", "A");
    d.desenharPonto(bx, by, "#2ecc71", "B");
    d.desenharPonto(cx, cy, "#f39c12", "C");
    
    if (alinhado) {
        let todosX = [ax, bx, cx].sort((a, b) => a - b);
        let todosY = [ay, by, cy].sort((a, b) => a - b);
        
        let p1 = pontos.find(p => p.x === todosX[0] && p.y === todosY[0]) || 
                 pontos.find(p => p.x === todosX[0]) || 
                 pontos.find(p => p.y === todosY[0]) || 
                 pontos[0];
                 
        let p2 = pontos.find(p => p.x === todosX[2] && p.y === todosY[2]) || 
                 pontos.find(p => p.x === todosX[2]) || 
                 pontos.find(p => p.y === todosY[2]) || 
                 pontos[2];
        
        d.desenharLinha(p1.x, p1.y, p2.x, p2.y, "#e74c3c");
    }
}

document.getElementById('btnDistancia').addEventListener('click', calcularDistancia);
document.getElementById('btnPontoMedio').addEventListener('click', calcularPontoMedio);
document.getElementById('btnMediana').addEventListener('click', calcularMediana);
document.getElementById('btnBaricentro').addEventListener('click', calcularBaricentro);
document.getElementById('btnAlinhamento').addEventListener('click', verificarAlinhamento);

mostrarAba(conteudoDist, abaDistancia, calcularDistancia);