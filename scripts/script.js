let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;

// Inicia a cobra com 3 blocos
let snake = [
    { x: 8 * box, y: 8 * box },
    { x: 7 * box, y: 8 * box },
    { x: 6 * box, y: 8 * box }
];

let direction = "right";
let score = 0; // Variável para armazenar a pontuação

// Carregar a imagem da comida
let foodImage = new Image();
foodImage.src = '../assets/comida.png';

// Carregar o som
let audio = new Audio('../assets/audio.mp3');

let food = { x: 0, y: 0 };

// Função para gerar uma nova posição válida para a comida
function generateFood() {
    do {
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    } while (isFoodOnSnake());
}

// Função para verificar se a comida está na posição da cobra
function isFoodOnSnake() {
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            return true; // Comida está em cima da cobra
        }
    }
    return false;
}

// Função para criar o fundo do jogo
function createBG() {
    context.fillStyle = "#e6e2d3";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

// Função para criar a cobrinha
function createSnake() {
    for (let segment of snake) {
        context.fillStyle = "green";
        context.fillRect(segment.x, segment.y, box, box);
    }
}

// Função para criar a comida
function createFood() {
    context.drawImage(foodImage, food.x, food.y, box, box);
}

// Função para atualizar a pontuação
function updateScore() {
    document.getElementById("score").innerText = "Pontuação: " + score;
}

// Função para iniciar o jogo
function startGame() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "right") snakeX += box;
    if (direction === "left") snakeX -= box;
    if (direction === "up") snakeY -= box;
    if (direction === "down") snakeY += box;

    // Colisão com as paredes
    if (snakeX >= 16 * box) snakeX = 0;
    if (snakeX < 0) snakeX = 15 * box;
    if (snakeY >= 16 * box) snakeY = 0;
    if (snakeY < 0) snakeY = 15 * box;

    // Colisão com a própria cobra
    for (let i = 1; i < snake.length; i++) {
        if (snakeX === snake[i].x && snakeY === snake[i].y) {
            clearInterval(game);
            document.getElementById("resetButton").style.display = "block"; // Mostra o botão
            return; // Remove o alerta
        }
    }

    // Verifica se a cobra comeu a comida
    if (snakeX === food.x && snakeY === food.y) {
        audio.play();
        score += 10; // Adiciona 10 pontos
        generateFood(); // Gera nova comida
        updateScore(); // Atualiza a pontuação exibida
    } else {
        snake.pop(); // Remove o último bloco
    }

    // Adiciona nova cabeça à cobra
    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // Renderiza o jogo
    createBG();
    createSnake();
    createFood();
}

// Mapeia as teclas para direção da cobra
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 37 && direction !== 'right') direction = 'left';
    if (event.keyCode === 38 && direction !== 'down') direction = 'up';
    if (event.keyCode === 39 && direction !== 'left') direction = 'right';
    if (event.keyCode === 40 && direction !== 'up') direction = 'down';
});

// Função para reiniciar o jogo
function resetGame() {
    snake = [
        { x: 8 * box, y: 8 * box },
        { x: 7 * box, y: 8 * box },
        { x: 6 * box, y: 8 * box }
    ];
    direction = "right";
    score = 0; // Reinicia a pontuação
    updateScore(); // Atualiza a pontuação exibida
    generateFood();
    clearInterval(game);
    game = setInterval(startGame, 100);
    document.getElementById("resetButton").style.display = "none"; // Esconde o botão
}

// Inicializa a comida e inicia o jogo
generateFood();
updateScore(); // Mostra a pontuação inicial
let game = setInterval(startGame, 100);
