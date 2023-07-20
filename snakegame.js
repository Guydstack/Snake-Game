// Game Variables
let canvas;
let context;
let screenWidth;
let screenHeight;
let snake;
let food;
let walls = document.querySelector("#walls #key_color")


// Snake Constants
let snakeSize = 16;
let direction = "right";
let game = "normal";
let gameLoop;
let speed = 100;
let score = 0;
let newS = 0;


// Initialize the game
function init() {
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  screenWidth = 480;
  screenHeight = 320;
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  document.body.appendChild(canvas);

  snake = [];
  createSnake();
  createFood();


  gameLoop = setInterval(paint, speed);
}


// Create the snake
function createSnake() {
  let length = 1;
  for (let i = length - 1; i >= 0; --i) {
    snake.push({ x: i, y: 0 });
  }
}

// Create the food
function createFood() {
  food = {
    x: Math.floor(Math.random() * (screenWidth / snakeSize)),
    y: Math.floor(Math.random() * (screenHeight / snakeSize))
  };
}

// Update the game state
function update() {
  let headX = snake[0].x;
  let headY = snake[0].y;
  // Update snake direction
  if (direction === "right") headX++;
  else if (direction === "left") headX--;
  else if (direction === "up") headY--;
  else if (direction === "down") headY++;

  // Taggel to play with walls   
  if (game === "walls" || game === "normal"){
    walls.innerHTML = "ON";
      // Check for collision with self or wall
  if (
    headX === -1 ||
    headX === screenWidth / snakeSize ||
    headY === -1 ||
    headY === screenHeight / snakeSize ||
    headY === 20 ||
    checkCollision(headX, headY, snake)
  ) {
    gameOver()
  } // Taggel to play without walls   
  }if (game === "withOutWalls"){
    walls.innerHTML = "OFF";
      // Check for collision with self or wall
        if (checkCollision(headX, headY, snake)) {
            gameOver();
        } else {
            // Wrap around the snake when it reaches the edges
            if (headX === -1) {
                headX = screenWidth / snakeSize - 1;
            } else if (headX === screenWidth / snakeSize) {
                headX = 0;
            }
    
            if (headY === -1) {
                headY = screenHeight / snakeSize - 1;
            } else if (headY === screenHeight / snakeSize) {
                headY = 0;
            }
        }
  }


  // Check if snake has eaten the food
  if (headX === food.x && headY === food.y) {
    var tail = { x: headX, y: headY }; // Grow the snake
    newS+= 10;
        // Increase the speed after reaching 100 points
        if (newS >= 100) {
            speed -= 20;
            clearInterval(gameLoop);
            gameLoop = setInterval(paint, speed);
            // Reset score to 0 after speeding up
            newS = 0;
        }
    drawScore() // Draw Score
    createFood(); // Create new food
  } else {
    var tail = snake.pop(); // Remove the tail of the snake
    tail.x = headX;
    tail.y = headY;
  }
  snake.unshift(tail); // Add the new head to the snake
}



// Check if there's a collision with the snake itself
function checkCollision(x, y, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].x === x && array[i].y === y) {
      return true;
    }
  }
  return false;
}

// Refresh the page
function refreshPage(){
    location.reload()
}

// Print game over and stop the game
function gameOver(){
    context.font = "40px Tektur";
    context.fillStyle = "lime"
    context.fillText("GAME OVER",130,170)
    clearInterval(gameLoop);
}

// Draw the score
function drawScore(){
    score++
document.getElementById("score").innerHTML = "Score: " + (score * 10);
}



// Paint the game screen
function paint() {
  context.fillStyle = "green";
  context.fillRect(0, 0, screenWidth, screenHeight);
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";
  canvas.style.border = "2px solid black";


  for (var i = 0; i < snake.length; i++) {
    var snakePart = snake[i];
    context.fillStyle = "black";
    context.fillRect(
      snakePart.x * snakeSize,
      snakePart.y * snakeSize,
      snakeSize,
      snakeSize
    );
  }

  context.fillStyle = "lime";
  context.fillRect(
    food.x * snakeSize,
    food.y * snakeSize,
    snakeSize,
    snakeSize
  );

  update();
}

// Listen for keyboard events to change snake direction
document.addEventListener("keydown", function(event) {
  var key = event.keyCode;
  if (key === 37 && direction !== "right") direction = "left";
  else if (key === 38 && direction !== "down") direction = "up";
  else if (key === 39 && direction !== "left") direction = "right";
  else if (key === 40 && direction !== "up") direction = "down";
  else if (event.key === "Enter") refreshPage();
  else if (key === 87) game = "walls";
  else if (key === 69) game = "withOutWalls";
});

// Start the game
init();
