const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Carregar a imagem do paddle (jogador.png), da cesta (cesta.png) e do fundo (arena.avif)
const paddleImage = new Image();
paddleImage.src = 'img/jogador.png';
const cestaImage = new Image();
cestaImage.src = 'img/cesta.png';
const backgroundImage = new Image();
backgroundImage.src = 'img/arena.jpg'; // Carregar a imagem do fundo

// Inicializar variáveis
let ball = { x: 503, y: 250, radius: 12, speedX: 0, speedY: 0, gravity: 0.10 };
let paddle1 = { x: 10, y: 225, width: 50, height: 100 };
let cesta = { x: 975, y: 250, radius: 50, speed: 1 }; // Cesta se movendo lentamente
let player1Score = 0;

// Variáveis de tentativas e pontuação
let totalTentativas = 5;
let acertos = 0;

let isChoosingForce = true;  // Indica se o jogador está escolhendo a força

// Variáveis de controle do mouse
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false; // Indica se o botão do mouse está pressionado
const approachSpeed = 10; // Velocidade de aproximação da bola

// Função para desenhar o jogo
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar a imagem de fundo
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Desenhar a imagem do paddle1 (jogador)
    context.drawImage(paddleImage, paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    // Desenhar a bola
    context.fillStyle = 'orange';
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();

    // Atualizar a posição da cesta
    cesta.y += cesta.speed;
    if (cesta.y + cesta.radius > canvas.height || cesta.y - cesta.radius < 0) {
        cesta.speed *= -1; // Inverte a direção ao atingir os limites
    }

    // Desenhar a imagem da cesta
    context.drawImage(cestaImage, cesta.x - cesta.radius, cesta.y - cesta.radius, cesta.radius * 2, cesta.radius * 2);

    // Desenhar pontuação e tentativas restantes
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Acertos: ${acertos}`, 10, 40);
    context.fillText(`Tentativas: ${totalTentativas}`, 10, 70);

    if (!isChoosingForce) {
        // Movimento parabólico
        ball.speedY += ball.gravity;
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // Verificar colisão com o chão ou se a bola saiu da tela
        if (ball.y + ball.radius >= canvas.height || ball.x > canvas.width) {
            totalTentativas--;
            resetBall();
        }

        // Verificar colisão com a cesta
        if (isBallInCesta()) {
            acertos++;
            totalTentativas--;
            resetBall();
        }
    }

    // Desenhar linha de mira arredondada
    if (isChoosingForce) {
        context.beginPath();
        context.moveTo(ball.x, ball.y);
        const curveX = (mouseX + ball.x) / 2;
        const curveY = mouseY - 50; // Ajusta a curva
        context.quadraticCurveTo(curveX, curveY, mouseX, mouseY);
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.stroke();
    }

    // Verificar se o jogo terminou
    if (totalTentativas <= 0) {
        gameOver();
    } else {
        requestAnimationFrame(draw);
    }
}

// Função para verificar se a bola está dentro da cesta
function isBallInCesta() {
    const distX = ball.x - cesta.x;
    const distY = ball.y - cesta.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < ball.radius + cesta.radius + 10;
}

// Função para resetar a bola
function resetBall() {
    paddle1.x = Math.random() * (canvas.width / 2);
    paddle1.y = canvas.height - paddle1.height - Math.random() * (canvas.height / 2);

    ball.x = paddle1.x + paddle1.width + 1;
    ball.y = paddle1.y;

    ball.speedX = 0;
    ball.speedY = 0;

    isChoosingForce = true;
}

// Função para iniciar o jogo
function startGame() {
    const angle = Math.atan2(mouseY - ball.y, mouseX - ball.x);
    ball.speedX = Math.cos(angle) * 8; // Ajuste a velocidade da bola aqui
    ball.speedY = Math.sin(angle) * 10; // Ajuste a velocidade da bola aqui
    isChoosingForce = false;
}

// Função para finalizar o jogo
function gameOver() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'Black';
    context.font = '50px Arial';
    context.fillText(`Fim de Jogo! Acertos: ${acertos}`, canvas.width / 4, canvas.height / 2);
}

// Controle do mouse
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

canvas.addEventListener('mousedown', () => {
    isMouseDown = true; // O mouse está pressionado
});

canvas.addEventListener('mouseup', () => {
    if (isChoosingForce) {
        startGame();
    }
    isMouseDown = false; // O mouse não está mais pressionado
});

// Inicializa o jogo
resetBall();
draw();
