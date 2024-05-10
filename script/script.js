// Declarar las variables globales
let canvas, ctx;
let snake;
let tileSize = 20;
let food;
let gameInterval;
let score = 0; // Agregamos una variable para el puntaje

// Función para iniciar el juego
function startGame() {
  // Reiniciamos el puntaje
  score = 0;
  document.getElementById("score").textContent = score; // Actualizamos el puntaje en el HTML
  
  // obtengo el canvas y el contexto
  canvas = document.getElementById("snakeCanvas");
  ctx = canvas.getContext("2d");

  // creo la serpiente y la comida
  snake = new Snake();
  snake.create();
  food = createFood();

  // Intervalo para actualizar el juego
  gameInterval = setInterval(updateGame, 200);
}

// Función para actualizar el juego en cada intervalo
function updateGame() {
  // limpio el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // muevo y dibujo la serpiente
  snake.move();
  snake.draw();

  // dibujo la comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  // verifico si la serpiente come la comida
  if (snake.eatFood(food)) {
    food = createFood();
    score += 10; // Incrementamos el puntaje
    document.getElementById("score").textContent = score; // Actualizamos el puntaje en el HTML
  }

  // verifico si la serpiente colisiona
  if (snake.collide()) {
    clearInterval(gameInterval);
    alert("¡Perdiste! Puntaje final: " + score); // Mostramos el puntaje final
    let playAgain = confirm("¿Quieres jugar de nuevo?");
    if (playAgain) {
      startGame();
    }
  }
}

// Función para crear la comida en una posición aleatoria
function createFood() {
  let foodX = Math.floor(Math.random() * (canvas.width / tileSize));
  let foodY = Math.floor(Math.random() * (canvas.height / tileSize));
  return { x: foodX, y: foodY };
}

// Constructor para la serpiente
function Snake() {
  this.body = [{ x: 10, y: 10 }];
  this.dx = 1;
  this.dy = 0;

  // Método para crear la serpiente
  this.create = function () {
    ctx.fillStyle = "green";
    this.body.forEach(segment => {
      ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
  };

  // Método para mover la serpiente
  this.move = function () {
    let head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
    this.body.unshift(head);
    if (!this.eatFood(food)) {
      this.body.pop();
    }
  };

  // Método para dibujar la serpiente
  this.draw = function () {
    ctx.fillStyle = "green";
    this.body.forEach(segment => {
      ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
  };

  // Método para verificar si la serpiente come la comida
  this.eatFood = function (food) {
    return this.body[0].x === food.x && this.body[0].y === food.y;
  };

  // Método para verificar si la serpiente colisiona
  this.collide = function () {
    let head = this.body[0];
    return (
      head.x < 0 || head.y < 0 ||
      head.x >= canvas.width / tileSize ||
      head.y >= canvas.height / tileSize ||
      this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
  };
}

// Event listeners para los controles táctiles
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("upButton").addEventListener("click", handleUpButtonClick);
  document.getElementById("downButton").addEventListener("click", handleDownButtonClick);
  document.getElementById("leftButton").addEventListener("click", handleLeftButtonClick);
  document.getElementById("rightButton").addEventListener("click", handleRightButtonClick);

  document.getElementById("upButton").addEventListener("touchstart", handleUpButtonClick);
  document.getElementById("downButton").addEventListener("touchstart", handleDownButtonClick);
  document.getElementById("leftButton").addEventListener("touchstart", handleLeftButtonClick);
  document.getElementById("rightButton").addEventListener("touchstart", handleRightButtonClick);

  // Event listeners para las flechas del teclado
  document.addEventListener("keydown", handleKeyDown);
  
  // Event listeners para el movimiento táctil en el canvas
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
});

// Funciones para manejar eventos táctiles
function handleUpButtonClick() {
  if (snake.dy !== 1) {
    snake.dy = -1;
    snake.dx = 0;
  }
}

function handleDownButtonClick() {
  if (snake.dy !== -1) {
    snake.dy = 1;
    snake.dx = 0;
  }
}

function handleLeftButtonClick() {
  if (snake.dx !== 1) {
    snake.dx = -1;
    snake.dy = 0;
  }
}

function handleRightButtonClick() {
  if (snake.dx !== -1) {
    snake.dx = 1;
    snake.dy = 0;
  }
}

// Función para manejar eventos del teclado
function handleKeyDown(event) {
  switch(event.key) {
    case "ArrowUp":
      if (snake.dy !== 1) {
        snake.dy = -1;
        snake.dx = 0;
      }
      break;
    case "ArrowDown":
      if (snake.dy !== -1) {
        snake.dy = 1;
        snake.dx = 0;
      }
      break;
    case "ArrowLeft":
      if (snake.dx !== 1) {
        snake.dx = -1;
        snake.dy = 0;
      }
      break;
    case "ArrowRight":
      if (snake.dx !== -1) {
        snake.dx = 1;
        snake.dy = 0;
      }
      break;
  }
}

// Funciones para manejar eventos táctiles en el canvas
function handleTouchStart(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const x = touch.pageX - canvas.offsetLeft;
  const y = touch.pageY - canvas.offsetTop;
  handleTouch(x, y);
}

function handleTouchMove(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const x = touch.pageX - canvas.offsetLeft;
  const y = touch.pageY - canvas.offsetTop;
  handleTouch(x, y);
}

function handleTouch(x, y) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const angle = Math.atan2(y - centerY, x - centerX);
  const threshold = Math.PI / 4;
  
  if (angle > threshold && angle < 3 * threshold) {
    if (snake.dy !== 1) {
      snake.dy = -1;
      snake.dx = 0;
    }
  } else if (angle > -threshold && angle < threshold) {
    if (snake.dx !== -1) {
      snake.dx = 1;
      snake.dy = 0;
    }
  } else if (angle > -3 * threshold && angle < -threshold) {
    if (snake.dy !== -1) {
      snake.dy = 1;
      snake.dx = 0;
    }
  } else {
    if (snake.dx !== 1) {
      snake.dx = -1;
      snake.dy = 0;
    }
  }
}
