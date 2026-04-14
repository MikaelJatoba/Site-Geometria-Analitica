// ------------------------------------------------------------
// 1. PREPARANDO O TERRENO (SETUP INICIAL)
// ------------------------------------------------------------

// Pega a tela de desenho do HTML
const tela = document.getElementById('telaDesenho');

// Pega o "pincel" para desenhar na tela
const pincel = tela.getContext('2d');

// Define o centro da tela (como é 500x500, o centro é 250)
const MEIO_X = 250;
const MEIO_Y = 250;

// Define quantos pixels valem 1 unidade matemática
const ESCALA = 20;

// ------------------------------------------------------------
// 2. FUNÇÕES MÁGICAS DE CONVERSÃO (MATEMÁTICA -> TELA)
// ------------------------------------------------------------

// Converte o X da matemática para o X da tela do computador
function converterX(coordenadaXMatematica) {
    return MEIO_X + (coordenadaXMatematica * ESCALA);
}

// Converte o Y da matemática para o Y da tela do computador
// (O sinal de MENOS é o truque para inverter o eixo Y!)
function converterY(coordenadaYMatematica) {
    return MEIO_Y - (coordenadaYMatematica * ESCALA);
}

// ------------------------------------------------------------
// 3. DESENHANDO O FUNDO (PLANO CARTESIANO E GRADE)
// ------------------------------------------------------------

function desenharPlanoDeFundo() {
    // Limpa a tela com tinta branca
    pincel.clearRect(0, 0, 500, 500);
    
    // Desenha as linhas da grade (cinza claro)
    pincel.beginPath();
    pincel.strokeStyle = "#d0d0d0";
    pincel.lineWidth = 1;
    
    // Linhas verticais (de -10 até +10)
    for (let i = -10; i <= 10; i++) {
        let posicaoNaTela = converterX(i);
        pincel.moveTo(posicaoNaTela, 0);
        pincel.lineTo(posicaoNaTela, 500);
    }
    
    // Linhas horizontais (de -10 até +10)
    for (let i = -10; i <= 10; i++) {
        let posicaoNaTela = converterY(i);
        pincel.moveTo(0, posicaoNaTela);
        pincel.lineTo(500, posicaoNaTela);
    }
    pincel.stroke();

    // Desenha os eixos X e Y (preto e mais grosso)
    pincel.beginPath();
    pincel.strokeStyle = "#000000";
    pincel.lineWidth = 3;
    
    // Eixo X (horizontal)
    pincel.moveTo(0, MEIO_Y);
    pincel.lineTo(500, MEIO_Y);
    
    // Eixo Y (vertical)
    pincel.moveTo(MEIO_X, 0);
    pincel.lineTo(MEIO_X, 500);
    pincel.stroke();
    
    // Escreve as letras X e Y nos cantos
    pincel.font = "14px Arial";
    pincel.fillStyle = "#000";
    pincel.fillText("x", 480, MEIO_Y - 5);
    pincel.fillText("y", MEIO_X + 10, 15);
}

// ------------------------------------------------------------
// 4. DESENHANDO UM PONTO (BOLINHA COLORIDA)
// ------------------------------------------------------------

function desenharPonto(xMat, yMat, cor, nome) {
    // Converte as coordenadas matemáticas para coordenadas da tela
    let xTela = converterX(xMat);
    let yTela = converterY(yMat);
    
    // Desenha o círculo (a bolinha)
    pincel.beginPath();
    pincel.arc(xTela, yTela, 6, 0, 2 * Math.PI);
    pincel.fillStyle = cor;
    pincel.fill();
    pincel.strokeStyle = "#333";
    pincel.lineWidth = 2;
    pincel.stroke();
    
    // Escreve o nome do ponto (A, B ou M) ao lado da bolinha
    pincel.font = "bold 14px Arial";
    pincel.fillStyle = "#1a1a2e";
    pincel.fillText(nome, xTela + 12, yTela - 12);
    pincel.fillStyle = cor;
    pincel.fillText(nome, xTela + 13, yTela - 13);
}

// ------------------------------------------------------------
// 5. DESENHANDO UMA RETA (LIGANDO DOIS PONTOS)
// ------------------------------------------------------------

function desenharLinha(x1, y1, x2, y2) {
    pincel.beginPath();
    pincel.moveTo(converterX(x1), converterY(y1)); // Vai para o ponto A
    pincel.lineTo(converterX(x2), converterY(y2)); // Traça linha até o ponto B
    pincel.strokeStyle = "#a0a0c0";
    pincel.lineWidth = 2;
    pincel.stroke();
}

// ------------------------------------------------------------
// 6. A FUNÇÃO PRINCIPAL (EXECUTADA QUANDO CLICAMOS NO BOTÃO)
// ------------------------------------------------------------

function calcularEMostrar() {
    
    // PASSO 1: Pegar os números que o usuário digitou no HTML
    // parseFloat transforma o texto "2" no número 2
    let ax = parseFloat(document.getElementById('inputAx').value);
    let ay = parseFloat(document.getElementById('inputAy').value);
    let bx = parseFloat(document.getElementById('inputBx').value);
    let by = parseFloat(document.getElementById('inputBy').value);
    
    // PASSO 2: Calcular o Ponto Médio usando a fórmula matemática
    // Fórmula: M = ( (x1 + x2)/2 , (y1 + y2)/2 )
    let mx = (ax + bx) / 2;
    let my = (ay + by) / 2;
    
    // PASSO 3: Mostrar o resultado escrito na tela (embaixo do botão)
    let elementoTexto = document.getElementById('textoResultado');
    elementoTexto.innerHTML = `Ponto Médio M = (${mx.toFixed(2)}, ${my.toFixed(2)})`;
    
    // PASSO 4: Desenhar tudo no Canvas
    
    // 4a. Limpa a tela e desenha a grade e os eixos
    desenharPlanoDeFundo();
    
    // 4b. Desenha a linha que liga o ponto A até o ponto B
    desenharLinha(ax, ay, bx, by);
    
    // 4c. Desenha o Ponto A (cor azul)
    desenharPonto(ax, ay, "#3498db", "A");
    
    // 4d. Desenha o Ponto B (cor verde)
    desenharPonto(bx, by, "#2ecc71", "B");
    
    // 4e. Desenha o Ponto Médio M (cor vermelha, maior destaque)
    desenharPonto(mx, my, "#e74c3c", "M");
}

// ------------------------------------------------------------
// 7. LIGANDO O BOTÃO DO HTML À FUNÇÃO PRINCIPAL
// ------------------------------------------------------------

// Procura o botão no HTML pelo seu ID
let botao = document.getElementById('botaoCalcular');

// Fica "escutando" se alguém clicar no botão
// Quando clicar, executa a função calcularEMostrar
botao.addEventListener('click', calcularEMostrar);

// Desenha o plano vazio assim que a página carregar
// (Para não aparecer uma tela toda branca)
desenharPlanoDeFundo();

// ------------------------------------------------------------
// FIM DO CÓDIGO
// ------------------------------------------------------------