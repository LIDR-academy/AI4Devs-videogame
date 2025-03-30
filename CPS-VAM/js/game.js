// VAM: The Alien Killer - Full Game Integration

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player, bullets = [], enemies = [], explosions = [], score = 0, wave = 1, health = 100;
let gameRunning = true;
let gameStarted = false;
let isPaused = false;
let meteors = [];

// Load assets
const playerImg = new Image();
playerImg.src = 'assets/images/player_idle.png';
const playerShootImg = new Image();
playerShootImg.src = 'assets/images/player_shoot.png';
const playerRunImg = new Image();
playerRunImg.src = 'assets/images/player_run.png';
const playerJumpImg = new Image();
playerJumpImg.src = 'assets/images/player_jump.png';
const bulletImg = new Image();
bulletImg.src = 'assets/images/bullet.png';
const alienImg = new Image();
alienImg.src = 'assets/images/alien_walk.png';
const explosionImg = new Image();
explosionImg.src = 'assets/images/explosion.png';
const bgImg = new Image();
bgImg.src = 'assets/images/background.png';
const meteorImg = new Image();
meteorImg.src = 'assets/images/meteor.png';

// Load sounds
const shootSound = new Audio('assets/sounds/shoot.mp3');
const hitSound = new Audio('assets/sounds/hit.mp3');
const damageSound = new Audio('assets/sounds/damage.mp3');
const bgMusic = new Audio('assets/sounds/bg-music.mp3');



// Player object
player = {
    x: 100,
    y: canvas.height -120,
    width: 100,
    height: 100,
    speed: 5,
    dx: 0,
    dy: 0,
    isJumping: false,
    sprite: playerImg
};

// Key states
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    // Pause/Unpause when 'p' is pressed
    if (e.key.toLowerCase() === 'p' && gameStarted) {
        isPaused = !isPaused;
        if (!isPaused) {
            gameLoop();
        }
    }
});
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Main game loop
function gameLoop() {
    if (gameRunning && gameStarted && !isPaused) {
        bgMusic.loop = true;
        bgMusic.volume = 0.1;
        bgMusic.play();
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else if (isPaused) {
        // Draw pause screen
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 40);
        ctx.restore();
    }
}

// Update game state
function update() {
    

    // Player movement
    if (keys['ArrowRight']) player.x += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;

    // Jumping
    if (keys['ArrowUp'] && !player.isJumping) {
        player.dy = -17;
        player.isJumping = true;
    }

    // Gravity
    player.dy += 0.5;
    player.y += player.dy;

    // Collision with ground
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }

    // Shooting bullets
    if (keys[' '] || keys['Control']) {
        shoot();
    }

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed;
        if (bullet.x > canvas.width) bullets.splice(index, 1);
    });

    // Move enemies and check collisions
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;

        // Check collision with player
        if (checkCollision(player, enemy)) {
            health -= 10;
            damageSound.play();
            enemies.splice(index, 1);
            if (health <= 0) gameOver();
        }

        // Check collision with bullets
        bullets.forEach((bullet, bIndex) => {
            if (checkCollision(bullet, enemy)) {
                explosions.push({ x: enemy.x, y: enemy.y, frame: 0 });
                hitSound.play();
                score += 10;
                bullets.splice(bIndex, 1);
                enemies.splice(index, 1);

            }
        });
    });

    // Handle explosions
    explosions.forEach((explosion, index) => {
        explosion.frame++;
        if (explosion.frame > 5) explosions.splice(index, 1);
    });

    // Move meteors and check collisions
    meteors.forEach((meteor, index) => {
        meteor.y += meteor.speed;
        
        // Check collision with player
        if (checkCollision(player, meteor)) {
            health -= 15; // Meteors do more damage than aliens
            damageSound.play();
            meteors.splice(index, 1);
            explosions.push({ x: meteor.x, y: meteor.y, frame: 0 });
            if (health <= 0) gameOver();
        }

        // Remove meteors that hit the ground
        if (meteor.y >= canvas.height) {
            explosions.push({ x: meteor.x, y: canvas.height - 50, frame: 0 });
            meteors.splice(index, 1);
        }
    });

    // Spawn new enemies
    if (Math.random() < 0.02 * wave) {
        spawnEnemy();
    }

    // Spawn new meteors
    if (Math.random() < 0.005 * wave) {
        spawnMeteor();
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw player animation according to key pressed
    //running animation
    if (keys['ArrowRight']) {
        ctx.drawImage(playerRunImg, player.x, player.y, player.width, player.height);
    } 
    //running animation
    else if (keys['ArrowLeft']) {
        ctx.drawImage(playerRunImg, player.x, player.y, player.width, player.height);
    }
    //jumping animation
    else if (keys['ArrowUp']) {
        ctx.drawImage(playerJumpImg, player.x, player.y, player.width, player.height);
    } 
    //shooting animation
    else if (keys[' '] || keys['Control']) {
        ctx.drawImage(playerShootImg, player.x, player.y, player.width, player.height);
    } 
    //idle animation
    else {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.drawImage(alienImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw explosions
    explosions.forEach(explosion => {
        ctx.drawImage(explosionImg, explosion.x, explosion.y, 50, 50);
    });

    // Draw meteors
    meteors.forEach(meteor => {
        ctx.drawImage(meteorImg, meteor.x, meteor.y, meteor.width, meteor.height);
    });

    // Draw UI
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('wave').innerText = `Wave: ${wave}`;
    document.getElementById('health').style.width = `${health}%`;
}

// Shoot bullets
function shoot() {
    bullets.push({
        x: player.x + player.width,
        y: player.y + player.height / 2 - 5,
        width: 10,
        height: 5,
        speed: 10
    });
    shootSound.play();
    bgMusic.volume = 0.1;
    bgMusic.play();

}

// Random number generator
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

// Spawn an enemy
function spawnEnemy() {
    enemies.push({
        x: canvas.width,
        y: canvas.height - getRandomArbitrary(80, 140), // random position between 80 and 120
        width: 55,
        height: 55,
        speed: 2 + score * 0.01
    });
}

// Spawn a meteor
function spawnMeteor() {
    meteors.push({
        x: Math.random() * (canvas.width - 30), // Random x position
        y: -30, // Start above the screen
        width: 30,
        height: 30,
        speed: 5 + Math.random() * 3 + (wave * 0.5) // Speed increases with wave
    });
}

// Check collision
function checkCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// Game over function
function gameOver() {
    gameRunning = false;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
}

// Restart the game
document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
});

// Add this function before gameLoop starts
function startGame() {
    document.getElementById('menu-screen').classList.add('hidden');
    gameStarted = true;
    meteors = []; // Reset meteors
    gameLoop();
}

// Add this event listener with the other listeners
document.getElementById('start-btn').addEventListener('click', startGame);

// Initial draw of the background
ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);