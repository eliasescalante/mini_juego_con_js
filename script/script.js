let canvas, ctx;
let snake;
let tileSize = 20;
let food;
let gameInterval;

function startGame() {
  canvas = document.getElementById("snakeCanvas");
  ctx = canvas.getContext("2d");

  snake = new Snake();
  snake.create();

  food = createFood();

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
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
  });

  // Intervalo más largo para ralentizar la serpiente
  gameInterval = setInterval(updateGame, 200);
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.move();
  snake.draw();

  if (snake.eatFood(food)) {
    food = createFood();
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  if (snake.collide()) {
    clearInterval(gameInterval);
    alert("¡Perdiste!");
    let playAgain = confirm("¿Quieres jugar de nuevo?");
    if (playAgain) {
      startGame();
    }
  }
}

function createFood() {
  let foodX = Math.floor(Math.random() * (canvas.width / tileSize));
  let foodY = Math.floor(Math.random() * (canvas.height / tileSize));
  return { x: foodX, y: foodY };
}

function Snake() {
  this.body = [{ x: 10, y: 10 }];
  this.dx = 1;
  this.dy = 0;

  this.create = function () {
    ctx.fillStyle = "green";
    this.body.forEach(segment => {
      ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
  };

  this.move = function () {
    let head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
    this.body.unshift(head);
    if (!this.eatFood(food)) {
      this.body.pop();
    }
  };

  this.draw = function () {
    ctx.fillStyle = "green";
    this.body.forEach(segment => {
      ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
  };

  this.eatFood = function (food) {
    return this.body[0].x === food.x && this.body[0].y === food.y;
  };

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
