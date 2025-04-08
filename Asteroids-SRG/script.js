// Configuración del juego
const CONFIG = {
    width: 800,
    height: 600,
    fps: 60,
    asteroidSizes: {
        large: 40,
        medium: 20,
        small: 10
    },
    asteroidPoints: {
        large: 20,
        medium: 50,
        small: 100
    },
    ufoPoints: 200,
    initialLives: 3,
    maxBullets: 1,
    bulletLifeTime: 60, // frames
    respawnInvincibilityTime: 180, // frames (3 segundos)
    levelClearDelay: 180, // frames (3 segundos)
    hyperspaceCooldown: 300, // frames (5 segundos)
    ufoSpawnChance: 0.001, // probabilidad por frame
    ufoShootingInterval: 120 // frames (2 segundos)
};

// Estado del juego
const gameState = {
    score: 0,
    lives: CONFIG.initialLives,
    level: 1,
    isGameOver: false,
    asteroids: [],
    bullets: [],
    ufoBullets: [],
    particles: [],
    ufo: null,
    paused: false,
    respawnInvincibilityTimer: 0,
    levelClearTimer: 0,
    hyperspaceCooldown: 0,
    isTransitioning: false
};

// Controles
const controls = {
    left: false,
    right: false,
    up: false,
    shoot: false,
    hyperspace: false
};

// Inicialización del juego
let canvas, ctx, player, lastTime, deltaTime;
let animationFrameId;

// Variable para controlar si los controles ya se configuraron
let controlsSetup = false;

// Clase Vector para operaciones matemáticas
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return scalar === 0 ? new Vector() : new Vector(this.x / scalar, this.y / scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        return mag === 0 ? new Vector() : this.divide(mag);
    }

    static randomDirection() {
        const angle = Math.random() * Math.PI * 2;
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}

// Clase base para objetos de juego
class GameObject {
    constructor(position, velocity, radius) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.toRemove = false;
    }

    update() {
        this.position = this.position.add(this.velocity);
        this.wrapAround();
    }

    wrapAround() {
        // Mantiene los objetos dentro de la pantalla, envolviendo alrededor del borde
        if (this.position.x < 0) this.position.x = CONFIG.width;
        if (this.position.x > CONFIG.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = CONFIG.height;
        if (this.position.y > CONFIG.height) this.position.y = 0;
    }

    collidesWith(other) {
        // Detección básica de colisiones circulares
        const distance = this.position.subtract(other.position).magnitude();
        return distance < this.radius + other.radius;
    }
}

// Clase Nave del jugador
class Ship extends GameObject {
    constructor() {
        super(new Vector(CONFIG.width / 2, CONFIG.height / 2), new Vector(), 10);
        this.angle = 0; // orientación de la nave (radianes)
        this.rotation = 0; // velocidad de rotación
        this.thrust = 0; // propulsión
        this.thrustPower = 0.1; // fuerza de propulsión
        this.rotationSpeed = 0.1; // velocidad de rotación
        this.maxSpeed = 5; // velocidad máxima
        this.friction = 0.98; // fricción para simular inercia
        this.isBoosting = false;
        this.shooting = false;
        this.shootCooldown = 0;
        this.invincible = false;
        this.blinkTimer = 0;
        this.visible = true;
    }

    update() {
        // Actualiza la rotación
        this.angle += this.rotation;

        // Actualiza la propulsión
        if (this.isBoosting) {
            const force = new Vector(
                Math.cos(this.angle) * this.thrustPower,
                Math.sin(this.angle) * this.thrustPower
            );
            this.velocity = this.velocity.add(force);
        }

        // Limita la velocidad máxima
        const speed = this.velocity.magnitude();
        if (speed > this.maxSpeed) {
            this.velocity = this.velocity.normalize().multiply(this.maxSpeed);
        }

        // Aplica fricción
        this.velocity = this.velocity.multiply(this.friction);

        // Actualiza la posición
        super.update();

        // Gestiona el enfriamiento de disparo
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }

        // Efectos de parpadeo durante invencibilidad
        if (this.invincible) {
            this.blinkTimer = (this.blinkTimer + 1) % 10;
            this.visible = this.blinkTimer < 5;
        } else {
            this.visible = true;
        }
    }

    shoot() {
        if (this.shootCooldown === 0 && gameState.bullets.length < CONFIG.maxBullets) {
            const bulletSpeed = 7;
            const bulletDirection = new Vector(
                Math.cos(this.angle),
                Math.sin(this.angle)
            );
            
            const bulletVelocity = bulletDirection.multiply(bulletSpeed).add(this.velocity);
            const bulletPosition = this.position.add(bulletDirection.multiply(this.radius + 5));
            
            const bullet = new Bullet(bulletPosition, bulletVelocity);
            gameState.bullets.push(bullet);
            
            this.shootCooldown = 10; // Tiempo de enfriamiento entre disparos
            
            // Sonido de disparo (implementación básica)
            playSound('shoot');
        }
    }

    activateHyperspace() {
        if (gameState.hyperspaceCooldown === 0) {
            // Teletransporte aleatorio
            this.position = new Vector(
                Math.random() * CONFIG.width,
                Math.random() * CONFIG.height
            );
            this.velocity = new Vector(0, 0);
            
            // Establece el tiempo de enfriamiento de hiperespacio
            gameState.hyperspaceCooldown = CONFIG.hyperspaceCooldown;
            
            // Hace a la nave invencible brevemente después del teletransporte
            this.invincible = true;
            gameState.respawnInvincibilityTimer = 60; // 1 segundo de invencibilidad
            
            // Sonido de hiperespacio (implementación básica)
            playSound('hyperspace');
        }
    }

    draw() {
        if (!this.visible) return;
        
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        
        // Dibuja la nave
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, -7);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-10, 7);
        ctx.lineTo(10, 0);
        ctx.stroke();
        
        // Dibuja el fuego del propulsor si está acelerando
        if (this.isBoosting && Math.random() > 0.3) {
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.lineTo(-15, Math.random() * 3 - 1.5);
            ctx.lineTo(-7, 0);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Clase Asteroide
class Asteroid extends GameObject {
    constructor(position, velocity, size) {
        // Tamaño determina el radio
        const radius = CONFIG.asteroidSizes[size];
        super(position, velocity, radius);
        this.size = size;
        this.vertices = [];
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.rotation = 0;
        
        // Genera forma irregular para el asteroide
        const numVertices = Math.floor(Math.random() * 3) + 7; // 7-9 vértices
        for (let i = 0; i < numVertices; i++) {
            const angle = (i / numVertices) * Math.PI * 2;
            const offset = radius * (0.8 + Math.random() * 0.4); // Variación en el radio 80%-120%
            this.vertices.push({
                angle: angle,
                offset: offset
            });
        }
    }

    update() {
        super.update();
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Dibuja la forma irregular del asteroide
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            const x = Math.cos(vertex.angle) * vertex.offset;
            const y = Math.sin(vertex.angle) * vertex.offset;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    breakApart() {
        if (this.size === 'large' || this.size === 'medium') {
            const nextSize = this.size === 'large' ? 'medium' : 'small';
            
            // Crea dos asteroides más pequeños
            for (let i = 0; i < 2; i++) {
                const velocity = Vector.randomDirection().multiply(1 + Math.random());
                const newAsteroid = new Asteroid(
                    new Vector(this.position.x, this.position.y),
                    velocity,
                    nextSize
                );
                gameState.asteroids.push(newAsteroid);
            }
        }

        // Crea partículas
        this.createExplosionParticles();
        
        // Agrega puntos al marcador
        gameState.score += CONFIG.asteroidPoints[this.size];
        updateScoreDisplay();
        
        // Sonido de explosión
        playSound('explosion');
    }

    createExplosionParticles() {
        const numParticles = Math.floor(Math.random() * 5) + 5; // 5-9 partículas
        
        for (let i = 0; i < numParticles; i++) {
            const velocity = Vector.randomDirection().multiply(1 + Math.random() * 2);
            const particle = new Particle(
                new Vector(this.position.x, this.position.y),
                velocity,
                Math.random() * 2 + 1,
                30 + Math.random() * 30
            );
            gameState.particles.push(particle);
        }
    }
}

// Clase Proyectil
class Bullet extends GameObject {
    constructor(position, velocity) {
        super(position, velocity, 2);
        this.lifeTime = CONFIG.bulletLifeTime;
    }

    update() {
        super.update();
        this.lifeTime--;
        
        if (this.lifeTime <= 0) {
            this.toRemove = true;
        }
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Clase OVNI
class UFO extends GameObject {
    constructor(size = 'small') {
        const y = Math.random() * CONFIG.height;
        const direction = Math.random() < 0.5 ? 1 : -1;
        
        const position = new Vector(
            direction < 0 ? CONFIG.width : 0,
            y
        );
        
        // Velocidad horizontal constante, ligera oscilación vertical
        const velocity = new Vector(direction * -2, 0);
        
        const radius = size === 'small' ? 10 : 20;
        
        super(position, velocity, radius);
        
        this.size = size;
        this.shootTimer = Math.floor(Math.random() * 60); // Disparo inicial aleatorio
        this.verticalTime = 0; // Para movimiento ondulatorio
    }

    update() {
        super.update();
        
        // Movimiento ondulatorio vertical
        this.verticalTime += 0.05;
        this.velocity.y = Math.sin(this.verticalTime) * 0.5;
        
        // Sistema de disparo
        this.shootTimer--;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = CONFIG.ufoShootingInterval;
        }
        
        // Si sale completamente de la pantalla, se elimina
        if ((this.velocity.x > 0 && this.position.x > CONFIG.width + this.radius) ||
            (this.velocity.x < 0 && this.position.x < -this.radius)) {
            this.toRemove = true;
        }
    }

    shoot() {
        // OVNI pequeño: dispara hacia el jugador
        // OVNI grande: dispara en dirección aleatoria
        let direction;
        
        if (this.size === 'small' && player) {
            direction = player.position.subtract(this.position).normalize();
        } else {
            const angle = Math.random() * Math.PI * 2;
            direction = new Vector(Math.cos(angle), Math.sin(angle));
        }
        
        const bulletVelocity = direction.multiply(4);
        const bulletPosition = this.position.add(direction.multiply(this.radius + 5));
        
        const bullet = new Bullet(bulletPosition, bulletVelocity);
        gameState.ufoBullets.push(bullet);
        
        // Sonido de disparo OVNI
        playSound('ufoShoot');
    }

    destroy() {
        // Crea partículas para la explosión
        this.createExplosionParticles();
        
        // Suma puntos
        gameState.score += CONFIG.ufoPoints;
        updateScoreDisplay();
        
        // Sonido de explosión
        playSound('ufoExplosion');
    }

    createExplosionParticles() {
        const numParticles = Math.floor(Math.random() * 7) + 5; // 5-11 partículas
        
        for (let i = 0; i < numParticles; i++) {
            const velocity = Vector.randomDirection().multiply(1 + Math.random() * 2);
            const particle = new Particle(
                new Vector(this.position.x, this.position.y),
                velocity,
                Math.random() * 2 + 1,
                30 + Math.random() * 30
            );
            gameState.particles.push(particle);
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        
        // Dibuja el cuerpo del OVNI
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        
        // Cúpula superior
        ctx.beginPath();
        ctx.arc(0, -this.radius * 0.3, this.radius * 0.5, Math.PI, 0, false);
        ctx.stroke();
        
        // Cuerpo principal
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 0.5, -this.radius * 0.3);
        ctx.lineTo(this.radius * 0.5, -this.radius * 0.3);
        ctx.lineTo(this.radius, 0);
        ctx.closePath();
        ctx.stroke();
        
        // Base
        ctx.beginPath();
        ctx.moveTo(-this.radius * 0.7, 0);
        ctx.lineTo(-this.radius * 0.5, this.radius * 0.3);
        ctx.lineTo(this.radius * 0.5, this.radius * 0.3);
        ctx.lineTo(this.radius * 0.7, 0);
        ctx.stroke();
        
        ctx.restore();
    }
}

// Clase Partícula
class Particle extends GameObject {
    constructor(position, velocity, radius, lifeTime) {
        super(position, velocity, radius);
        this.lifeTime = lifeTime;
        this.initialLifeTime = lifeTime;
    }

    update() {
        super.update();
        this.lifeTime--;
        
        // Hace que la partícula desaparezca gradualmente
        this.radius *= 0.98;
        
        if (this.lifeTime <= 0 || this.radius < 0.1) {
            this.toRemove = true;
        }
    }

    draw() {
        const alpha = this.lifeTime / this.initialLifeTime;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Funciones de inicialización
function init() {
    // Inicializa el canvas
    canvas = document.getElementById('game-canvas');
    
    if (!canvas) {
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    if (!ctx) {
        return;
    }
    
    // Ajusta el tamaño del canvas
    resizeCanvas();
    
    // Inicializa el jugador
    player = new Ship();
    
    // Establece los controles
    setupControls();
    
    // Inicia el primer nivel
    startLevel(1);
    
    // Actualiza la información de la pantalla
    updateScoreDisplay();
    updateLivesDisplay();
    updateLevelDisplay();
    
    // Inicia el bucle del juego
    lastTime = performance.now();
    gameLoop();
}

function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Mantiene la relación de aspecto pero se ajusta al contenedor
    if (containerWidth / containerHeight > CONFIG.width / CONFIG.height) {
        canvas.height = containerHeight;
        canvas.width = containerHeight * (CONFIG.width / CONFIG.height);
    } else {
        canvas.width = containerWidth;
        canvas.height = containerWidth * (CONFIG.height / CONFIG.width);
    }
    
    // Actualiza el tamaño del mundo del juego
    CONFIG.width = canvas.width;
    CONFIG.height = canvas.height;
}

function setupControls() {
    // Evitar configurar los controles múltiples veces
    if (controlsSetup) {
        return;
    }
    
    // Controles de teclado
    window.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'ArrowLeft':
                controls.left = true;
                break;
            case 'ArrowRight':
                controls.right = true;
                break;
            case 'ArrowUp':
                controls.up = true;
                break;
            case 'Space':
                controls.shoot = true;
                e.preventDefault(); // Evita el desplazamiento de la página
                break;
            case 'KeyH':
                controls.hyperspace = true;
                break;
        }
    });
    
    window.addEventListener('keyup', function(e) {
        switch(e.code) {
            case 'ArrowLeft':
                controls.left = false;
                break;
            case 'ArrowRight':
                controls.right = false;
                break;
            case 'ArrowUp':
                controls.up = false;
                break;
            case 'Space':
                controls.shoot = false;
                break;
            case 'KeyH':
                controls.hyperspace = false;
                break;
            case 'KeyP':
                // Pausa el juego
                togglePause();
                break;
        }
    });
    
    // Controles táctiles (implementación básica)
    setupTouchControls();
    
    // Botones para iniciar y reiniciar
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    
    if (startButton) {
        startButton.onclick = function() {
            startGame();
        };
    }
    
    if (restartButton) {
        restartButton.onclick = function() {
            restartGame();
        };
    }
    
    // Evento de redimensionamiento
    window.addEventListener('resize', resizeCanvas);
    
    // Marcar los controles como configurados
    controlsSetup = true;
}

function setupTouchControls() {
    // Implementación muy básica para dispositivos táctiles
    // Se podría mejorar con botones virtuales en pantalla
    
    // Área de la izquierda: rotar a la izquierda
    // Área de la derecha: rotar a la derecha
    // Área superior: acelerar
    // Doble toque: disparar
    // Toque largo: hiperespacio
    
    let touchTimeout;
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        // Comprueba en qué región de la pantalla se tocó
        if (x < CONFIG.width / 3) {
            controls.left = true;
        } else if (x > CONFIG.width * 2 / 3) {
            controls.right = true;
        }
        
        if (y < CONFIG.height / 3) {
            controls.up = true;
        }
        
        // Detecta doble toque para disparar
        if (e.touches.length === 2) {
            controls.shoot = true;
        }
        
        // Toque largo para hiperespacio
        touchTimeout = setTimeout(() => {
            controls.hyperspace = true;
        }, 1000);
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        
        // Resetea todos los controles
        controls.left = false;
        controls.right = false;
        controls.up = false;
        controls.shoot = false;
        controls.hyperspace = false;
        
        clearTimeout(touchTimeout);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
}

// Funciones de gestión del juego
function startGame() {
    // Oculta la pantalla de inicio y muestra el juego
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (gameScreen) gameScreen.classList.remove('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    
    // Inicia el juego
    init();
}

function restartGame() {
    // Resetea el estado del juego
    gameState.score = 0;
    gameState.lives = CONFIG.initialLives;
    gameState.level = 1;
    gameState.isGameOver = false;
    gameState.asteroids = [];
    gameState.bullets = [];
    gameState.ufoBullets = [];
    gameState.particles = [];
    gameState.ufo = null;
    
    // Oculta la pantalla de game over y muestra el juego
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Reinicia el juego
    init();
}

function gameOver() {
    gameState.isGameOver = true;
    
    // Actualiza la puntuación final
    document.getElementById('final-score').textContent = gameState.score;
    
    // Muestra la pantalla de game over
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    
    // Detiene el bucle del juego
    cancelAnimationFrame(animationFrameId);
    
    // Reproduce sonido de game over
    playSound('gameOver');
}

function startLevel(level) {
    gameState.level = level;
    gameState.asteroids = [];
    gameState.bullets = [];
    gameState.ufoBullets = [];
    gameState.particles = [];
    gameState.ufo = null;
    gameState.isTransitioning = false;
    
    // Número de asteroides según el nivel (incrementando con cada nivel)
    const numAsteroids = 3 + Math.min(level - 1, 7);
    
    // Crea asteroides grandes
    for (let i = 0; i < numAsteroids; i++) {
        createAsteroid();
    }
    
    // Actualiza la visualización del nivel
    updateLevelDisplay();
    
    // Hace la nave invencible brevemente al inicio del nivel
    if (player) {
        player.invincible = true;
        gameState.respawnInvincibilityTimer = CONFIG.respawnInvincibilityTime;
    }
}

function createAsteroid(size = 'large', pos = null) {
    // Si no se proporciona posición, crea el asteroide lejos del jugador
    if (!pos) {
        let position;
        do {
            position = new Vector(
                Math.random() * CONFIG.width,
                Math.random() * CONFIG.height
            );
        } while (player && position.subtract(player.position).magnitude() < 150);
        
        pos = position;
    }
    
    // Velocidad aleatoria
    const speed = 0.5 + Math.random() * (gameState.level * 0.1); // Aumenta con el nivel
    const velocity = Vector.randomDirection().multiply(speed);
    
    // Crea el asteroide y lo añade al juego
    const asteroid = new Asteroid(pos, velocity, size);
    gameState.asteroids.push(asteroid);
    
    return asteroid;
}

function spawnUFO() {
    // Probabilidad de que sea un OVNI grande
    const isLarge = Math.random() < 0.3;
    const size = isLarge ? 'large' : 'small';
    
    gameState.ufo = new UFO(size);
    
    // Sonido OVNI
    playSound('ufoAppear');
}

function respawnPlayer() {
    player = new Ship();
    player.invincible = true;
    gameState.respawnInvincibilityTimer = CONFIG.respawnInvincibilityTime;
}

// Funciones de actualización de la interfaz
function updateScoreDisplay() {
    document.getElementById('score').textContent = gameState.score;
}

function updateLivesDisplay() {
    document.getElementById('lives').textContent = gameState.lives;
}

function updateLevelDisplay() {
    document.getElementById('level').textContent = gameState.level;
}

// Funciones de sonido (implementación básica)
function playSound(soundType) {
    // En una implementación completa, aquí se reproducirían efectos de sonido
    // Para este ejemplo, dejamos la función vacía
    // Puedes implementar sonidos usando la API de Audio
}

function togglePause() {
    gameState.paused = !gameState.paused;
}

// Bucle principal del juego
function gameLoop(currentTime) {
    if (gameState.isGameOver) return;
    
    // Calcula delta time para movimiento consistente
    deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Limita deltaTime para evitar comportamientos extraños con bajos FPS
    if (deltaTime > 100) deltaTime = 100;
    
    // Si el juego está pausado, solo dibuja el estado actual
    if (!gameState.paused) {
        update();
    }
    
    render();
    
    // Continúa el bucle
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Actualiza el estado del juego
function update() {
    // Gestiona el tiempo de invencibilidad después de respawn
    if (gameState.respawnInvincibilityTimer > 0) {
        gameState.respawnInvincibilityTimer--;
        if (gameState.respawnInvincibilityTimer === 0) {
            player.invincible = false;
        }
    }
    
    // Gestiona el enfriamiento del hiperespacio
    if (gameState.hyperspaceCooldown > 0) {
        gameState.hyperspaceCooldown--;
    }
    
    // Actualiza al jugador según los controles
    if (player) {
        // Rotación
        player.rotation = 0;
        if (controls.left) player.rotation = -player.rotationSpeed;
        if (controls.right) player.rotation = player.rotationSpeed;
        
        // Propulsión
        player.isBoosting = controls.up;
        
        // Disparar
        if (controls.shoot) {
            player.shoot();
        }
        
        // Hiperespacio
        if (controls.hyperspace && gameState.hyperspaceCooldown === 0) {
            player.activateHyperspace();
        }
        
        // Actualiza la nave
        player.update();
    }
    
    // Actualiza los asteroides
    for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
        const asteroid = gameState.asteroids[i];
        asteroid.update();
        
        // Colisión con la nave (solo si no es invencible)
        if (player && !player.invincible && asteroid.collidesWith(player)) {
            playerHit();
            break;
        }
    }
    
    // Actualiza los proyectiles del jugador
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        bullet.update();
        
        let hit = false;
        
        // Comprueba colisiones con asteroides
        for (let j = gameState.asteroids.length - 1; j >= 0; j--) {
            const asteroid = gameState.asteroids[j];
            if (bullet.collidesWith(asteroid)) {
                // El asteroide se rompe
                asteroid.breakApart();
                
                // Marca el asteroide y la bala para eliminar
                asteroid.toRemove = true;
                bullet.toRemove = true;
                hit = true;
                break;
            }
        }
        
        // Comprueba colisiones con OVNI
        if (!hit && gameState.ufo && bullet.collidesWith(gameState.ufo)) {
            gameState.ufo.destroy();
            gameState.ufo.toRemove = true;
            bullet.toRemove = true;
        }
        
        // Elimina los proyectiles que han caducado o impactado
        if (bullet.toRemove) {
            gameState.bullets.splice(i, 1);
        }
    }
    
    // Actualiza los proyectiles del OVNI
    for (let i = gameState.ufoBullets.length - 1; i >= 0; i--) {
        const bullet = gameState.ufoBullets[i];
        bullet.update();
        
        // Colisión con la nave
        if (player && !player.invincible && bullet.collidesWith(player)) {
            playerHit();
            bullet.toRemove = true;
        }
        
        // Elimina los proyectiles que han caducado o impactado
        if (bullet.toRemove) {
            gameState.ufoBullets.splice(i, 1);
        }
    }
    
    // Elimina los asteroides marcados
    gameState.asteroids = gameState.asteroids.filter(a => !a.toRemove);
    
    // Actualiza el OVNI si existe
    if (gameState.ufo) {
        gameState.ufo.update();
        
        // Si el OVNI está marcado para eliminar o ha salido de la pantalla
        if (gameState.ufo.toRemove) {
            gameState.ufo = null;
        }
    } else if (!gameState.isTransitioning && Math.random() < CONFIG.ufoSpawnChance * (1 + gameState.level * 0.1)) {
        // Probabilidad de que aparezca un OVNI (aumenta con el nivel)
        spawnUFO();
    }
    
    // Actualiza las partículas
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        gameState.particles[i].update();
        if (gameState.particles[i].toRemove) {
            gameState.particles.splice(i, 1);
        }
    }
    
    // Comprueba si se ha completado el nivel (todos los asteroides destruidos)
    if (gameState.asteroids.length === 0 && !gameState.isTransitioning) {
        levelCompleted();
    }
}

function playerHit() {
    // Crea explosión para la nave
    createShipExplosion();
    
    // Resta una vida
    gameState.lives--;
    updateLivesDisplay();
    
    // Comprueba si es game over
    if (gameState.lives <= 0) {
        gameOver();
        return;
    }
    
    // Respawn del jugador después de un breve retraso
    player = null;
    setTimeout(respawnPlayer, 1500);
    
    // Sonido de explosión de la nave
    playSound('shipExplosion');
}

function createShipExplosion() {
    if (!player) return;
    
    // Crea una explosión más grande para la nave
    const numParticles = 20;
    
    for (let i = 0; i < numParticles; i++) {
        const velocity = Vector.randomDirection().multiply(1 + Math.random() * 3);
        const particle = new Particle(
            new Vector(player.position.x, player.position.y),
            velocity,
            Math.random() * 3 + 1,
            60 + Math.random() * 30
        );
        gameState.particles.push(particle);
    }
}

function levelCompleted() {
    gameState.isTransitioning = true;
    gameState.levelClearTimer = CONFIG.levelClearDelay;
    
    // Temporizador para iniciar el siguiente nivel
    setTimeout(() => {
        startLevel(gameState.level + 1);
    }, 3000);
    
    // Sonido de nivel completado
    playSound('levelComplete');
}

// Renderiza el juego
function render() {
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibuja el fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibuja todos los objetos del juego
    
    // Asteroides
    gameState.asteroids.forEach(asteroid => {
        asteroid.draw();
    });
    
    // Proyectiles
    gameState.bullets.forEach(bullet => {
        bullet.draw();
    });
    
    // Proyectiles del OVNI
    gameState.ufoBullets.forEach(bullet => {
        bullet.draw();
    });
    
    // OVNI
    if (gameState.ufo) {
        gameState.ufo.draw();
    }
    
    // Partículas
    gameState.particles.forEach(particle => {
        particle.draw();
    });
    
    // Nave del jugador
    if (player) {
        player.draw();
    }
    
    // Si está en transición al siguiente nivel, muestra mensaje
    if (gameState.isTransitioning) {
        const alpha = Math.sin(Date.now() / 200) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = '30px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`NIVEL ${gameState.level} COMPLETADO`, CONFIG.width / 2, CONFIG.height / 2);
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText('PREPARANDO SIGUIENTE NIVEL...', CONFIG.width / 2, CONFIG.height / 2 + 40);
    }
    
    // Si está pausado, muestra mensaje
    if (gameState.paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('JUEGO PAUSADO', CONFIG.width / 2, CONFIG.height / 2);
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText('Presiona P para continuar', CONFIG.width / 2, CONFIG.height / 2 + 40);
    }
}

// Inicializa el juego cuando todo esté cargado
window.addEventListener('load', function() {
    // No iniciamos el juego automáticamente, esperamos al botón de inicio
    // La pantalla de inicio ya se muestra por defecto
}); 