let enemyBullets = [];

let enemies = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;

const bgImage = document.getElementById("backgroundImg");
const playerImg = document.getElementById("playerImg");
const bgSound = document.getElementById("bgSound");

let player = {
  x: canvas.width / 2 - 32,
  y: canvas.height - 100,
  width: 64,
  height: 64,
  speed: 5,
  bullets: [],
  lives: 3,
  maxBullets: 1
};

let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (!gameStarted) {
    startGame();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function drawStartScreen() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0ff";
  ctx.font = "40px 'Blade Runner', Orbitron";
  ctx.textAlign = "center";
  ctx.shadowColor = "#f0f";
  ctx.shadowBlur = 20;
  ctx.fillText("SPACE INVADERS: CYBERPUNK ASSAULT", canvas.width / 2, canvas.height / 2 - 60);
  ctx.font = "20px 'Blade Runner', Orbitron";
  ctx.fillText("Presiona cualquier tecla para comenzar", canvas.width / 2, canvas.height / 2 + 20);
}

function startGame() {
  gameStarted = true;
  bgSound.volume = 0.3;
  bgSound.play();
  currentLevel = 1;
  spawnEnemiesLevel1();
  gameLoop();
}

function updatePlayer() {
  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += player.speed;
  }
  if (keys["ArrowUp"] || keys["w"]) {
    player.y -= player.speed;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    player.y += player.speed;
  }
  // Limitar a la pantalla
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function shoot() {
  if (player.bullets.length < player.maxBullets) {
    const shot = document.getElementById("shot1");
    shot.volume = 0.2;
    shot.currentTime = 0;
    shot.play();
    // Disparo central
    player.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 6,
      height: 15,
      speed: 8,
      dx: 0
    });
    // Disparos adicionales solo si el maxBullets es mayor que 1
    if (player.maxBullets > 1) {
      player.bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 6,
        height: 15,
        speed: 8,
        dx: -2
      });
      player.bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 6,
        height: 15,
        speed: 8,
        dx: 2
      });
    }
  }
}

let lastShotTime = 0;
function updateBullets() {
  for (let i = 0; i < player.bullets.length; i++) {
    player.bullets[i].y -= player.bullets[i].speed;
    player.bullets[i].x += player.bullets[i].dx || 0;
    if (player.bullets[i].y < 0 || player.bullets[i].x < 0 || player.bullets[i].x > canvas.width) {
      player.bullets.splice(i, 1);
      i--;
    }
  }
}

function drawBullets() {
  ctx.fillStyle = "#0ff";
  for (let bullet of player.bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function drawPlayerLives() {
  const maxLives = 10;
  const barWidth = 100;
  const barHeight = 10;
  const barX = 20;
  const barY = 20;
  const lifeWidth = (player.lives / maxLives) * barWidth;

  ctx.fillStyle = "#000";
  ctx.fillRect(barX, barY, barWidth, barHeight);
  ctx.fillStyle = "#0f0";
  ctx.fillRect(barX, barY, lifeWidth, barHeight);
}

function showLevelMessage(level) {
  ctx.fillStyle = "#0ff";
  ctx.font = "30px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText(`Nivel ${level}`, canvas.width / 2, canvas.height / 2);
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 2000); // Mostrar el mensaje durante 2 segundos
}

function gameLoop(timestamp) {
  if (gameOver) return; // Detener el bucle si el juego ha terminado

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  updatePlayer();
  updateBullets();

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  drawBullets();
  drawPlayerLives();

  if ((keys[" "] || keys["Enter"]) && timestamp - lastShotTime > 300) {
    shoot();
    lastShotTime = timestamp;
  }

  updateEnemies();
  drawEnemies();

  checkCollisions();
  checkLevelProgression();

  updateEnemyBullets();
  drawEnemyBullets();

  checkPlayerCollisions();

  spawnPowerUp();
  updatePowerUps();
  drawPowerUps();
  checkPowerUpCollection();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (!gameStarted) drawStartScreen();
});

drawStartScreen();


// ... código anterior sin cambios ...

let currentLevel = 1;

function nextLevel() {
  currentLevel++;
  enemies = [];
  explosions = [];
  enemyBullets = [];
  player.bullets = [];

  if (currentLevel === 2) {
    showLevelMessage(2);
    spawnEnemiesLevel2();
  } else if (currentLevel === 3) {
    showLevelMessage(3);
    spawnEnemiesLevel3();
  } else if (currentLevel === 4) {
    showLevelMessage(4);
    spawnEnemiesLevel4();
  } else if (currentLevel > 4) { // Asegurar que el mensaje de victoria se muestre
    showVictoryMessage();
  }
}

function checkLevelProgression() {
  if (enemies.length === 0 && gameStarted) {
    setTimeout(() => {
      if (enemies.length === 0) { // Verificar nuevamente antes de avanzar
        nextLevel();
      }
    }, 1000);
  }
}

let powerUps = [];

function spawnPowerUp() {
  let maxPowerUps = currentLevel; // Limitar el número de power-ups al nivel actual
  if (powerUps.length < maxPowerUps && Math.random() < 0.002) { // Reducir la probabilidad a 0.2%
    powerUps.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      width: 32,
      height: 32,
      type: Math.random() < 0.5 ? 'extraLife' : 'doubleShot',
      sprite: document.getElementById('powerupImg')
    });
  }
}

function updatePowerUps() {
  for (let i = 0; i < powerUps.length; i++) {
    powerUps[i].y += 1; // Los power-ups caen hacia abajo
    if (powerUps[i].y > canvas.height) {
      powerUps.splice(i, 1);
      i--;
    }
  }
}

function drawPowerUps() {
  for (let powerUp of powerUps) {
    ctx.drawImage(powerUp.sprite, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  }
}

function checkPowerUpCollection() {
  for (let i = 0; i < powerUps.length; i++) {
    if (
      player.x < powerUps[i].x + powerUps[i].width &&
      player.x + player.width > powerUps[i].x &&
      player.y < powerUps[i].y + powerUps[i].height &&
      player.y + player.height > powerUps[i].y
    ) {
      const powerupSound = document.getElementById("powerupSound");
      powerupSound.volume = 0.2;
      powerupSound.currentTime = 0;
      powerupSound.play();

      activatePowerUp(powerUps[i].type);
      powerUps.splice(i, 1);
      i--;
    }
  }
}

function activatePowerUp(type) {
  if (type === 'extraLife') {
    player.lives = Math.min(player.lives + 1, 10); // Máximo de 10 vidas
  } else if (type === 'doubleShot') {
    player.maxBullets += 1; // Aumentar en 1 bala adicional
  }
}

function spawnEnemiesLevel1() {
  // Lógica para spawnear enemigos de nivel 1
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      width: 64,
      height: 64,
      speed: 1,
      direction: 1,
      sprite: document.getElementById('enemyLvl1Img'),
      shootInterval: 2000
    });
  }
}

function spawnEnemiesLevel2() {
  // Lógica para spawnear enemigos de nivel 2
  for (let i = 0; i < 8; i++) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      width: 64,
      height: 64,
      speed: 1.5,
      direction: 1,
      sprite: document.getElementById('enemyLvl2Img'),
      shootInterval: 1500
    });
  }
}

function spawnEnemiesLevel3() {
  // Lógica para spawnear enemigos de nivel 3
  for (let i = 0; i < 10; i++) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      width: 64,
      height: 64,
      speed: 2,
      direction: 1,
      sprite: document.getElementById('enemyLvl3Img'),
      shootInterval: 1000
    });
  }
}

function spawnEnemiesLevel4() {
  // Lógica para spawnear enemigos de nivel 4
  for (let i = 0; i < 12; i++) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      width: 64,
      height: 64,
      speed: 2.5,
      direction: Math.random() < 0.5 ? 1 : -1,
      sprite: document.getElementById('enemyLvl4Img'),
      shootInterval: 500
    });
  }
}

function updateEnemies() {
  for (let enemy of enemies) {
    // Movimiento lateral para nivel 2 y 3
    if (currentLevel >= 2) {
      enemy.x += enemy.speed * enemy.direction;
      if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.direction *= -1;
      }
    }
    // Movimiento en todas direcciones para nivel 4
    if (currentLevel === 4) {
      enemy.x += enemy.speed * enemy.direction;
      enemy.y += enemy.speed * (Math.random() < 0.5 ? 1 : -1);
      if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.direction *= -1;
      }
      if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height / 2) {
        enemy.y = Math.max(0, Math.min(canvas.height / 2 - enemy.height, enemy.y));
      }
    }
    // Disparo de enemigos con límite de balas
    const maxBulletsPerEnemy = currentLevel === 2 ? 1 : currentLevel === 3 ? 2 : 3;
    const activeBullets = enemyBullets.filter(bullet => bullet.enemyId === enemy.id).length;
    if (activeBullets < maxBulletsPerEnemy && Date.now() % enemy.shootInterval < 50) {
      enemyBullets.push({
        x: enemy.x + enemy.width / 2,
        y: enemy.y + enemy.height,
        width: 6, // Aumentar el ancho de la bala del enemigo
        height: 15, // Aumentar la altura de la bala del enemigo
        speed: 5,
        enemyId: enemy.id
      });
    }
  }
}

function drawEnemies() {
  for (let enemy of enemies) {
    ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.width, enemy.height);
  }
}

function checkCollisions() {
  for (let i = 0; i < player.bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (
        player.bullets[i].x < enemies[j].x + enemies[j].width &&
        player.bullets[i].x + player.bullets[i].width > enemies[j].x &&
        player.bullets[i].y < enemies[j].y + enemies[j].height &&
        player.bullets[i].y + player.bullets[i].height > enemies[j].y
      ) {
        // Eliminar enemigo y bala
        const explosionImg = document.getElementById('explosionImg');
        ctx.drawImage(explosionImg, enemies[j].x, enemies[j].y, enemies[j].width, enemies[j].height);

        const killSound = document.getElementById("killSound");
        killSound.volume = 0.2;
        killSound.currentTime = 0;
        killSound.play();

        enemies.splice(j, 1);
        player.bullets.splice(i, 1);
        i--;
        break;
      }
    }
  }
}

function updateEnemyBullets() {
  for (let i = 0; i < enemyBullets.length; i++) {
    enemyBullets[i].y += enemyBullets[i].speed;
    if (enemyBullets[i].y > canvas.height) {
      enemyBullets.splice(i, 1);
      i--;
    }
  }
}

function drawEnemyBullets() {
  ctx.fillStyle = "#f00";
  for (let bullet of enemyBullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

let gameOver = false;

function showGameOverMessage() {
  ctx.fillStyle = "#f00";
  ctx.font = "50px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.font = "20px Orbitron";
  ctx.fillText("Presiona cualquier tecla para reiniciar", canvas.width / 2, canvas.height / 2 + 40);
  document.addEventListener("keydown", resetGame);
}

function showVictoryMessage() {
  ctx.fillStyle = "#0f0";
  ctx.font = "50px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText("VICTORIA", canvas.width / 2, canvas.height / 2);
  ctx.font = "20px Orbitron";
  ctx.fillText("Presiona cualquier tecla para reiniciar", canvas.width / 2, canvas.height / 2 + 40);
  document.addEventListener("keydown", resetGame);
}

function resetGame() {
  document.removeEventListener("keydown", resetGame);
  window.location.reload();
}

function checkPlayerCollisions() {
  if (gameOver) return; // Detener si el juego ha terminado

  for (let i = 0; i < enemyBullets.length; i++) {
    if (
      enemyBullets[i].x < player.x + player.width &&
      enemyBullets[i].x + enemyBullets[i].width > player.x &&
      enemyBullets[i].y < player.y + player.height &&
      enemyBullets[i].y + enemyBullets[i].height > player.y
    ) {
      // Impacto en el jugador
      const hitSound = document.getElementById("hitSound");
      hitSound.volume = 0.2;
      hitSound.currentTime = 0;
      hitSound.play();

      let damage = 1; // Daño por defecto
      if (currentLevel === 3) {
        damage = 2;
      } else if (currentLevel === 4) {
        damage = 3;
      }

      player.lives -= damage;
      enemyBullets.splice(i, 1); // Asegurar que la bala se elimine después del impacto
      i--; // Ajustar el índice después de eliminar la bala

      if (player.lives <= 0) {
        gameOver = true;
        const killSound = document.getElementById("killSound");
        killSound.volume = 0.2;
        killSound.currentTime = 0;
        killSound.play();
        setTimeout(() => {
          showGameOverMessage();
        }, 1000); // Espera 1 segundo antes de mostrar el mensaje
      }
    }
  }
}