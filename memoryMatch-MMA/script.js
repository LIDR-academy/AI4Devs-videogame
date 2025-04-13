const grid = document.querySelector(".grid");
let isPlaying = false;
let gameLoopInterval = null;
let invaderInterval = null;
const width = 15;
const squares = [];
let keys = {};
let lastShotTime = 0;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
  squares.push(square);
}

let currentShooterIndex = 202;
squares[currentShooterIndex].classList.add("shooter");

let alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.add("invader");
  }
}

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}

draw();

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function gameLoop() {
  if (keys["ArrowLeft"]) {
    moveShooter("ArrowLeft");
  }
  if (keys["ArrowRight"]) {
    moveShooter("ArrowRight");
  }
  if (keys["ArrowUp"]) {
    shoot();
    keys["ArrowUp"] = false;
  }
}

function startInvaders() {
  invaderInterval = setInterval(moveInvaders, invaderSpeed);
}

function stopInvaders() {
  clearInterval(invaderInterval);
}

function moveShooter(key) {
  squares[currentShooterIndex].classList.remove("shooter");
  if (key === "ArrowLeft" && currentShooterIndex % width !== 0) {
    currentShooterIndex -= 1;
  } else if (key === "ArrowRight" && currentShooterIndex % width < width - 1) {
    currentShooterIndex += 1;
  }
  squares[currentShooterIndex].classList.add("shooter");
}

let direction = 1;
let goingRight = true;

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;

  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
    }
    direction = -1;
    goingRight = false;
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
    }
    direction = 1;
    goingRight = true;
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();
  checkGameOver();
}

function checkGameOver() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] >= currentShooterIndex) {
      lives--;
      document.getElementById("lives").textContent = lives;
      if (lives > 0) {
        alert(`😵 ¡Te han golpeado! Vidas restantes: ${lives}`);
        resetAliens();
        return;
      } else {
        clearInterval(invaderInterval);
        document.removeEventListener("keydown", moveShooter);
        alert("💀 Game Over");
        grid.style.animation = "none";
        void grid.offsetWidth;
        grid.style.animation = "moveBackground 40s linear infinite alternate";
        grid.style.animationPlayState = "paused";
        restartGame();
      }
    }
  }
}

const hud = document.createElement("div");
let result = 0;
let lives = 3;
let level = 1;
let invaderSpeed = 500;
hud.innerHTML = `<h2>Puntos: <span id="points">0</span></h2>
                 <h3>Vidas: <span id="lives">3</span></h3>`;
document.body.insertBefore(hud, grid);

function shoot() {
  const now = Date.now();
  if (now - lastShotTime < 1000) return;
  lastShotTime = now;

  const laserStartIndex = currentShooterIndex;
  let laserIndex = laserStartIndex;
  let laserInterval = setInterval(() => {
    squares[laserIndex].classList.remove("laser");
    laserIndex -= width;

    if (laserIndex < 0) {
      clearInterval(laserInterval);
      return;
    }

    if (squares[laserIndex].classList.contains("invader")) {
      squares[laserIndex].classList.remove("laser");
      squares[laserIndex].classList.remove("invader");
      squares[laserIndex].classList.add("boom");
      explosionSound.play();

      setTimeout(() => squares[laserIndex].classList.remove("boom"), 300);
      clearInterval(laserInterval);

      const alienRemoved = alienInvaders.indexOf(laserIndex);
      alienInvaders.splice(alienRemoved, 1);
      result++;
      document.getElementById("points").textContent = result;
      document.getElementById("lives").textContent = lives;

      if (alienInvaders.length === 0) {
        clearInterval(invaderInterval);
        alert("🎉 ¡Has ganado esta ronda!");
        nextLevel();
      }
    } else {
      squares[laserIndex].classList.add("laser");
    }
  }, 100);
}

function resetAliens() {
  remove();
  alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
  ];
  draw();
}

const shootSound = new Audio("shoot.wav");
const explosionSound = new Audio("explosion.wav");

function nextLevel() {
  level++;
  invaderSpeed -= 50;
  if (invaderSpeed < 100) invaderSpeed = 100;

  stopInvaders();
  resetAliens();
  draw();
  grid.style.animation = "none";
  void grid.offsetWidth;
  grid.style.animation = "moveBackground 40s linear infinite alternate";
  grid.style.animationPlayState = "running";
  startInvaders();
}

const controlsContainer = document.createElement("div");
controlsContainer.style.display = "flex";
controlsContainer.style.justifyContent = "center";
controlsContainer.style.gap = "10px";
controlsContainer.style.marginTop = "10px";
controlsContainer.style.position = "relative";
document.body.appendChild(controlsContainer);
const controlsInfo = document.createElement("div");
controlsInfo.style.marginTop = "10px";
controlsInfo.style.color = "white";
controlsInfo.style.fontSize = "14px";
controlsInfo.innerHTML = `
  <p><strong>Controles:</strong></p>
  <ul style="list-style: none; padding: 0; margin: 0;">
    <li>⬅️ Flecha Izquierda: Mover nave a la izquierda</li>
    <li>➡️ Flecha Derecha: Mover nave a la derecha</li>
    <li>⬆️ Flecha Arriba: Disparar</li>
    <li>▶️: Iniciar o pausar juego</li>
    <li>🔄: Reiniciar juego</li>
  </ul>
`;
document.body.appendChild(controlsInfo);

const playButton = document.createElement("button");
playButton.id = "playButton";
playButton.innerHTML = "▶️";
playButton.classList.add("control-button");
controlsContainer.appendChild(playButton);

const restartButton = document.createElement("button");
restartButton.id = "restartButton";
restartButton.innerHTML = "🔄";
restartButton.classList.add("control-button");
controlsContainer.appendChild(restartButton);

function toggleGame() {
  isPlaying = !isPlaying;
  playButton.innerHTML = isPlaying ? "⏸️" : "▶️";

  if (isPlaying) {
    gameLoopInterval = setInterval(gameLoop, 50);
    startInvaders();
    grid.style.animationPlayState = "running";
  } else {
    clearInterval(gameLoopInterval);
    stopInvaders();
    grid.style.animationPlayState = "paused";
  }
}

function restartGame() {
  stopInvaders();
  clearInterval(gameLoopInterval);
  result = 0;
  lives = 3;
  level = 1;
  invaderSpeed = 500;
  document.getElementById("points").textContent = result;
  document.getElementById("lives").textContent = lives;
  currentShooterIndex = 202;
  squares.forEach((square) => {
    square.classList.remove("invader", "shooter", "laser", "boom");
  });
  squares[currentShooterIndex].classList.add("shooter");
  resetAliens();
  draw();
  grid.style.animation = "none";
  void grid.offsetWidth; // trigger reflow
  grid.style.animation = "moveBackground 40s linear infinite alternate";
  grid.style.animationPlayState = "paused";
  isPlaying = false;
  playButton.innerHTML = "▶️";
}

playButton.addEventListener("click", toggleGame);
restartButton.addEventListener("click", restartGame);

// Initialize background animation
grid.style.animation = "moveBackground 40s linear infinite alternate";
grid.style.animationPlayState = "paused";
