/**
 * Galaxian Game
 * Motor base del juego y configuración principal
 */

// Constantes del juego
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameover',
    LEVEL_COMPLETE: 'levelComplete'
};

const FPS = 60;
const FRAME_TIME = 1000 / FPS;

// Constantes del jugador
const PLAYER_CONFIG = {
    WIDTH: 32,
    HEIGHT: 32,
    SPEED: 5,
    BULLET_SPEED: 7,
    BULLET_WIDTH: 2,
    BULLET_HEIGHT: 8,
    BULLET_COLOR: '#fff'
};

// Añadir constantes para los tipos de enemigos
const ENEMY_TYPES = {
    RED: 'red',
    PURPLE: 'purple',
    GREEN: 'green'
};

// Añadir estados para los enemigos
const ENEMY_STATES = {
    IN_FORMATION: 'inFormation',
    DIVING: 'diving'
};

// Actualizar la configuración de enemigos
const ENEMY_CONFIG = {
    WIDTH: 24,
    HEIGHT: 24,
    ROWS: 5,
    COLS: 10,
    PADDING: 30,
    TOP_MARGIN: 80,
    FORMATION_SPEED: 0.3,
    DIVE_CHANCE: 0.1,
    SHOOT_CHANCE: 0.002,
    BULLET_SPEED: 2,
    DIVE_SPEED: 2,
    MAX_DIVING_ENEMIES: 2,
    POINTS: {
        [ENEMY_TYPES.RED]: 25,
        [ENEMY_TYPES.PURPLE]: 10,
        [ENEMY_TYPES.GREEN]: 5
    }
};

// Constantes para la UI
const UI_CONFIG = {
    COLORS: {
        SCORE: '#FFFFFF',
        HI_SCORE: '#0000FF',
        TEXT: '#FFFFFF'
    },
    FONTS: {
        TITLE: '40px "Press Start 2P"',
        SCORE: '20px "Press Start 2P"',
        TEXT: '16px "Press Start 2P"'
    }
};

// Constantes para efectos y dificultad
const EFFECTS_CONFIG = {
    EXPLOSION_FRAMES: 5,
    EXPLOSION_DURATION: 500, // ms
    STAR_COUNT: 50,
    STAR_SPEEDS: [0.5, 1, 1.5], // Diferentes velocidades para paralaje
    SOUND_VOLUME: 0.3
};

const DIFFICULTY_CONFIG = {
    BASE: {
        FORMATION_SPEED: 0.3,
        DIVE_CHANCE: 0.1,
        SHOOT_CHANCE: 0.002,
        BULLET_SPEED: 2,
        DIVE_SPEED: 2
    },
    LEVEL_MULTIPLIER: {
        FORMATION_SPEED: 1.1,
        DIVE_CHANCE: 1.2,
        SHOOT_CHANCE: 1.15,
        BULLET_SPEED: 1.1,
        DIVE_SPEED: 1.1
    }
};

// Sistema de sonido con trazas
const soundCache = {
    shoot: null,
    explosion: null
};

function preloadSounds() {
    console.log('Precargando sonidos...'); // Debug
    try {
        soundCache.shoot = new Audio('assets/sounds/shoot.wav');
        soundCache.shoot.volume = 0.3;
        console.log('Sonido de disparo cargado'); // Debug
        
        soundCache.explosion = new Audio('assets/sounds/explosion.wav');
        soundCache.explosion.volume = 0.4;
        console.log('Sonido de explosión cargado'); // Debug
    } catch (error) {
        console.error('Error cargando sonidos:', error);
    }
}

function playSound(soundName) {
    console.log(`Intentando reproducir sonido: ${soundName}`); // Debug
    if (soundCache[soundName]) {
        console.log(`Reproduciendo sonido desde cache: ${soundName}`); // Debug
        const soundInstance = soundCache[soundName].cloneNode();
        soundInstance.play().catch(e => console.error('Error reproduciendo sonido:', e));
    } else {
        console.log(`Sonido no encontrado en cache: ${soundName}`); // Debug
    }
}

// Asegurar que estas variables están definidas globalmente al inicio del archivo
let gameState = GAME_STATES.PLAYING;
let level = 1;
let enemies = [];

// Modificar las constantes de configuración
const DIVE_CHANCE = 0.02;  // Aumentado a 2% por frame
const DIVE_SPEED = 5;      // Aumentado a 5
const MAX_DIVING_ENEMIES = 3; // Permitir hasta 3 enemigos en picado

// Modificar la estructura de los enemigos
function createEnemies() {
    enemies = [];
    const rows = 5;
    const enemiesPerRow = 11;
    const enemySpacing = 60;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < enemiesPerRow; col++) {
            enemies.push({
                x: col * enemySpacing + 50,
                y: row * enemySpacing + 50,
                width: 30,
                height: 30,
                type: row,
                isDiving: false,
                originalX: col * enemySpacing + 50,
                originalY: row * enemySpacing + 50,
                speed: 5
            });
        }
    }
}

// Función específica para el movimiento en picado
function updateDivingEnemy(enemy) {
    if (!enemy.isDiving) return;

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    enemy.x += (dx / distance) * enemy.speed;
    enemy.y += (dy / distance) * enemy.speed;
    
    // Verificar si está fuera de la pantalla
    if (enemy.y > canvas.height || enemy.x < 0 || enemy.x > canvas.width) {
        enemy.isDiving = false;
        enemy.x = enemy.originalX;
        enemy.y = enemy.originalY;
    }
}

// Función para iniciar un nuevo ataque
function startNewDive() {
    const nonDivingEnemies = enemies.filter(e => !e.isDiving);
    if (nonDivingEnemies.length > 0) {
        const randomEnemy = nonDivingEnemies[Math.floor(Math.random() * nonDivingEnemies.length)];
        randomEnemy.isDiving = true;
        console.log('Nuevo enemigo iniciando picado'); // Debug
    }
}

// Sistema de picados con trazas
function updateEnemies() {
    console.log('updateEnemies llamada'); // Debug
    
    // Contar enemigos en picado
    const divingCount = enemies.filter(e => e.isDiving).length;
    console.log(`Enemigos actualmente en picado: ${divingCount}`); // Debug
    
    if (divingCount < 3) {
        enemies.forEach((enemy, index) => {
            if (!enemy.isDiving && Math.random() < 0.01) {
                console.log(`Enemigo ${index} iniciando picado`); // Debug
                enemy.isDiving = true;
                enemy.diveSpeed = 5;
            }
        });
    }

    enemies.forEach((enemy, index) => {
        if (enemy.isDiving) {
            console.log(`Actualizando enemigo ${index} en picado`); // Debug
            
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const oldX = enemy.x;
            const oldY = enemy.y;
            
            enemy.x += (dx / distance) * enemy.diveSpeed;
            enemy.y += (dy / distance) * enemy.diveSpeed;
            
            console.log(`Movimiento picado: (${oldX},${oldY}) -> (${enemy.x},${enemy.y})`); // Debug
            
            if (enemy.y > canvas.height || enemy.x < 0 || enemy.x > canvas.width) {
                console.log(`Enemigo ${index} regresa a formación`); // Debug
                enemy.isDiving = false;
                enemy.x = enemy.originalX;
                enemy.y = enemy.originalY;
            }
        } else {
            // Movimiento normal en formación
            enemy.x += enemySpeed * enemyDirection;
        }
    });
}

class Bullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_CONFIG.BULLET_WIDTH;
        this.height = PLAYER_CONFIG.BULLET_HEIGHT;
        this.speed = speed;
        this.active = true;
    }

    update() {
        this.y -= this.speed;
        // Desactivar la bala si sale de la pantalla
        if (this.y < 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = PLAYER_CONFIG.BULLET_COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = PLAYER_CONFIG.WIDTH;
        this.height = PLAYER_CONFIG.HEIGHT;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - this.height - 20;
        this.speed = PLAYER_CONFIG.SPEED;
        this.bullets = [];
        this.canShoot = true;
        this.shootDelay = 250; // Tiempo mínimo entre disparos en ms
        this.lastShot = 0;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        
        // Cargar sprite
        this.sprite = new Image();
        this.sprite.src = 'assets/sprites/player.png';
    }

    update(deltaTime) {
        // Movimiento horizontal
        if (this.game.keys.left && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.game.keys.right && this.x < this.game.width - this.width) {
            this.x += this.speed;
        }

        // Actualizar disparos
        this.bullets = this.bullets.filter(bullet => bullet.active);
        this.bullets.forEach(bullet => bullet.update());

        // Disparar
        if (this.game.keys.space && this.canShoot && 
            (Date.now() - this.lastShot > this.shootDelay)) {
            this.shoot();
            this.lastShot = Date.now();
        }

        // Actualizar invulnerabilidad
        if (this.isInvulnerable) {
            this.invulnerableTimer -= deltaTime;
            if (this.invulnerableTimer <= 0) {
                this.isInvulnerable = false;
            }
        }
    }

    shoot() {
        const bulletX = this.x + this.width / 2 - PLAYER_CONFIG.BULLET_WIDTH / 2;
        const bulletY = this.y;
        this.bullets.push(new Bullet(bulletX, bulletY, PLAYER_CONFIG.BULLET_SPEED));
        
        // Reproducir sonido usando la referencia al juego
        if (this.game.sounds && this.game.sounds.shoot) {
            const soundInstance = this.game.sounds.shoot.cloneNode();
            soundInstance.play().catch(e => console.log('Error playing sound:', e));
        }
    }

    draw(ctx) {
        // Efecto visual de parpadeo cuando es invulnerable
        if (!this.isInvulnerable || Math.floor(Date.now() / 100) % 2) {
            if (this.sprite.complete) {
                ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            }
        }
        
        // Dibujar balas
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.bullets = [];
        this.canShoot = true;
    }

    makeInvulnerable(duration) {
        this.isInvulnerable = true;
        this.invulnerableTimer = duration;
    }
}

class EnemyBullet {
    constructor(x, y) {
        this.x = x;
        this.width = 2;
        this.height = 8;
        this.y = y;
        this.speed = ENEMY_CONFIG.BULLET_SPEED;
        this.active = true;
    }

    update() {
        this.y += this.speed;
        // Solo desactivar si sale de la pantalla
        if (this.y > 600) { // Altura del canvas
            this.active = false;
        }
    }

    draw(ctx) {
        if (this.active) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Enemy {
    constructor(type, x, y, row, col) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = ENEMY_CONFIG.WIDTH;
        this.height = ENEMY_CONFIG.HEIGHT;
        this.row = row;
        this.col = col;
        this.originalX = x;
        this.originalY = y;
        this.diving = false;
        this.diveSpeed = ENEMY_CONFIG.DIVE_SPEED;
        this.targetX = 0;
        this.targetY = 0;
        this.bullets = [];
        this.shootTimer = 0;
        this.shootDelay = 1000;
        
        // Cargar sprite
        this.sprite = new Image();
        this.sprite.src = `assets/sprites/enemies/${type}.png`;
        
        // Puntos según tipo
        this.points = ENEMY_CONFIG.POINTS[type];
    }

    update(deltaTime, playerX, playerY) {
        // Actualizar balas existentes
        this.bullets.forEach(bullet => bullet.update());
        
        // Actualizar timer de disparo
        if (this.shootTimer > 0) {
            this.shootTimer -= deltaTime;
        }

        if (this.diving) {
            this.updateDive(playerX, playerY);
        } else if (this.row === ENEMY_CONFIG.ROWS - 1 && this.shootTimer <= 0) {
            // Solo la fila inferior dispara y respeta el delay
            if (Math.random() < ENEMY_CONFIG.SHOOT_CHANCE) {
                this.shoot();
                this.shootTimer = this.shootDelay;
            }
        }
    }

    updateDive(playerX, playerY) {
        if (!this.diving) return;

        console.log(`Actualizando posición de enemigo en picado:
            Posición actual: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})
            Objetivo: (${playerX.toFixed(2)}, ${playerY.toFixed(2)})
            Velocidad: ${this.diveSpeed}`);

        // Calcular dirección hacia el jugador
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalizar y aplicar velocidad
        if (distance > 0) {
            const oldX = this.x;
            const oldY = this.y;
            
            this.x += (dx / distance) * this.diveSpeed;
            this.y += (dy / distance) * this.diveSpeed;
            
            console.log(`Movimiento: (${oldX.toFixed(2)},${oldY.toFixed(2)}) -> (${this.x.toFixed(2)},${this.y.toFixed(2)})`);
        }

        // Volver a la formación si está fuera de la pantalla
        if (this.y > 600 || this.y < 0 || this.x < 0 || this.x > 800) {
            console.log('Enemigo fuera de pantalla, volviendo a formación');
            this.returnToFormation();
        }
    }

    shoot() {
        if (this.bullets.length === 0) { // Solo un disparo activo a la vez
            const bullet = new EnemyBullet(
                this.x + this.width / 2 - 1, // Centrar el disparo
                this.y + this.height
            );
            this.bullets.push(bullet);
        }
    }

    draw(ctx) {
        // Dibujar enemigo
        if (this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
        
        // Dibujar balas
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    startDive(playerX, playerY) {
        if (!this.diving) {
            console.log(`Enemigo iniciando picado:
                Posición inicial: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})
                Objetivo: (${playerX.toFixed(2)}, ${playerY.toFixed(2)})`);
            this.diving = true;
            this.targetX = playerX;
            this.targetY = playerY;
        }
    }

    returnToFormation() {
        console.log(`Enemigo volviendo a formación:
            Desde: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})
            Hacia: (${this.originalX.toFixed(2)}, ${this.originalY.toFixed(2)})`);
        this.diving = false;
        this.x = this.originalX;
        this.y = this.originalY;
    }

    onHit() {
        if (this.game.sounds && this.game.sounds.explosion) {
            const soundInstance = this.game.sounds.explosion.cloneNode();
            soundInstance.play().catch(e => console.log('Error playing sound:', e));
        }
        // ... rest of hit logic ...
    }
}

class EnemyFormation {
    constructor(game) {
        this.game = game;
        this.enemies = [];
        this.direction = 1;
        this.moveTimer = 0;
        this.divingEnemies = 0;
        this.amplitude = 40; // Amplitud del movimiento lateral
        this.frequency = 2000; // Frecuencia del movimiento (ms)
        this.lastDiveTime = 0;
        this.diveInterval = 1000; // Reducido de 2000 a 1000 (verificar cada segundo)
        this.createFormation();
    }

    createFormation() {
        const startX = (this.game.width - (ENEMY_CONFIG.COLS * (ENEMY_CONFIG.WIDTH + ENEMY_CONFIG.PADDING))) / 2;
        
        // Definir tipos por fila
        const rowTypes = [
            ENEMY_TYPES.RED,    // Primera fila
            ENEMY_TYPES.PURPLE, // Segunda fila
            ENEMY_TYPES.PURPLE, // Tercera fila
            ENEMY_TYPES.GREEN,  // Cuarta fila
            ENEMY_TYPES.GREEN   // Quinta fila
        ];
        
        for (let row = 0; row < ENEMY_CONFIG.ROWS; row++) {
            for (let col = 0; col < ENEMY_CONFIG.COLS; col++) {
                const x = startX + col * (ENEMY_CONFIG.WIDTH + ENEMY_CONFIG.PADDING);
                const y = ENEMY_CONFIG.TOP_MARGIN + row * (ENEMY_CONFIG.HEIGHT + ENEMY_CONFIG.PADDING);
                
                const enemy = new Enemy(
                    rowTypes[row],
                    x,
                    y,
                    row,
                    col
                );
                this.enemies.push(enemy);
            }
        }
        console.log(`Creados ${this.enemies.length} enemigos`); // Debug
    }

    update(deltaTime, playerX, playerY) {
        // Solo procesar la lógica si el juego está activo
        if (this.game.gameState !== GAME_STATES.PLAYING) return;

        // Actualizar el timer para el movimiento lateral
        this.moveTimer += deltaTime;
        
        // Calcular el offset del movimiento lateral
        const offset = Math.sin(this.moveTimer / this.frequency) * this.amplitude;
        
        // Gestión de picados
        const currentTime = Date.now();
        if (currentTime - this.lastDiveTime > this.diveInterval) {
            console.log('\nVerificando posibilidad de nuevo picado...');
            this.tryStartNewDive(playerX, playerY);
            this.lastDiveTime = currentTime;
        }

        // Actualizar cada enemigo
        this.enemies.forEach(enemy => {
            if (enemy.diving) {
                enemy.updateDive(playerX, playerY);
            } else {
                // Aplicar movimiento lateral
                enemy.x = enemy.originalX + offset;
            }
            enemy.update(deltaTime, playerX, playerY);
        });
    }

    draw(ctx) {
        this.enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            if (enemy.diving) {
                this.divingEnemies--;
            }
        }
    }

    getAllBullets() {
        return this.enemies.reduce((bullets, enemy) => {
            return bullets.concat(enemy.bullets);
        }, []);
    }

    tryStartNewDive(playerX, playerY) {
        console.log('--- Intentando iniciar nuevo picado ---');
        console.log('Enemigos en picado actual:', this.divingEnemies);
        console.log('Máximo permitido:', ENEMY_CONFIG.MAX_DIVING_ENEMIES);
        
        if (this.divingEnemies >= ENEMY_CONFIG.MAX_DIVING_ENEMIES) {
            console.log('No se inicia picado: ya hay máximo de enemigos en picado');
            return;
        }

        // Priorizar enemigos rojos y morados para el picado
        const eligibleEnemies = this.enemies.filter(e => 
            !e.diving && 
            e.row < ENEMY_CONFIG.ROWS - 1 &&
            (e.type === ENEMY_TYPES.RED || e.type === ENEMY_TYPES.PURPLE)
        );
        console.log('Enemigos elegibles para picado:', eligibleEnemies.length);

        const random = Math.random();
        console.log('Probabilidad actual:', random, 'vs DIVE_CHANCE:', ENEMY_CONFIG.DIVE_CHANCE);
        
        if (eligibleEnemies.length > 0 && random < ENEMY_CONFIG.DIVE_CHANCE) {
            // Preferir enemigos rojos si están disponibles
            const redEnemies = eligibleEnemies.filter(e => e.type === ENEMY_TYPES.RED);
            const enemyPool = redEnemies.length > 0 ? redEnemies : eligibleEnemies;
            const randomEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];
            
            console.log('¡Iniciando picado! Enemigo seleccionado:', 
                `tipo ${randomEnemy.type}, fila ${randomEnemy.row}, columna ${randomEnemy.col}`);
            randomEnemy.startDive(playerX, playerY);
            this.divingEnemies++;
        } else {
            console.log('No se cumplieron las condiciones para iniciar picado');
        }
    }
}

class Explosion {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.frame = 0;
        this.maxFrames = 12;
        this.frameTime = 50; // ms por frame
        this.currentTime = 0;
        this.active = true;
        this.particles = [];
        
        // Crear partículas
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            this.particles.push({
                x: 0,
                y: 0,
                speed: Math.random() * 2 + 1,
                angle: angle,
                size: Math.random() * 2 + 1
            });
        }
    }

    update(deltaTime) {
        this.currentTime += deltaTime;
        if (this.currentTime >= this.frameTime) {
            this.frame++;
            this.currentTime = 0;
            if (this.frame >= this.maxFrames) {
                this.active = false;
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const progress = this.frame / this.maxFrames;
        const alpha = 1 - progress;
        const expandSize = this.size * progress;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Dibujar partículas
        this.particles.forEach(particle => {
            const distance = particle.speed * expandSize;
            const x = Math.cos(particle.angle) * distance;
            const y = Math.sin(particle.angle) * distance;

            ctx.fillStyle = `rgba(255, ${200 - progress * 200}, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, particle.size * (1 - progress), 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}

class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.speed = EFFECTS_CONFIG.STAR_SPEEDS[
            Math.floor(Math.random() * EFFECTS_CONFIG.STAR_SPEEDS.length)
        ];
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.canvas.height) {
            this.reset();
            this.y = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 0.3;
    }

    createOscillator(frequency, duration, type = 'square') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, this.audioContext.currentTime + duration
        );
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        return oscillator;
    }

    playShoot() {
        const osc = this.createOscillator(880, 0.1);
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    playExplosion() {
        const osc = this.createOscillator(110, 0.3, 'sawtooth');
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    playHit() {
        const osc = this.createOscillator(220, 0.2, 'triangle');
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.2);
    }

    play(sound) {
        // Implementation of play method
    }

    stopBgm() {
        // Implementation of stopBgm method
    }

    startBgm() {
        // Implementation of startBgm method
    }
}

class GalaxianGame {
    /**
     * Constructor del juego
     * Inicializa las propiedades básicas y configura el canvas
     */
    constructor() {
        // Configuración del canvas
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Estado inicial
        this.gameState = GAME_STATES.START;
        this.score = 0;
        this.hiScore = this.loadHiScore();
        this.level = 1;
        this.lives = 3;

        // Estado de las teclas
        this.keys = {
            left: false,
            right: false,
            space: false,
            enter: false
        };

        // Inicializar jugador y enemigos
        this.player = new Player(this);
        this.enemyFormation = new EnemyFormation(this);

        // Inicializar efectos
        this.explosions = [];
        this.stars = Array.from({length: EFFECTS_CONFIG.STAR_COUNT}, 
            () => new Star(this.canvas));
        this.soundManager = new SoundManager();
        
        // Configuración de dificultad inicial
        this.updateDifficulty();

        // Bind de métodos
        this.gameLoop = this.gameLoop.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        // Iniciar el loop
        this.lastTime = 0;
        this.deltaTime = 0;
        requestAnimationFrame(this.gameLoop);

        // Inicializar el sistema de sonido
        this.sounds = {
            shoot: new Audio('assets/sounds/shoot.wav'),
            explosion: new Audio('assets/sounds/explosion.wav')
        };
        
        // Configurar volúmenes
        this.sounds.shoot.volume = 0.3;
        this.sounds.explosion.volume = 0.4;
    }

    handleKeyDown(event) {
        event.preventDefault();
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
                this.keys.right = true;
                break;
            case ' ':
                this.keys.space = true;
                this.soundManager.playShoot();
                break;
            case 'Enter':
                event.preventDefault();
                switch (this.gameState) {
                    case GAME_STATES.START:
                        this.gameState = GAME_STATES.PLAYING;
                        this.soundManager.startBgm();
                        break;
                    case GAME_STATES.LEVEL_COMPLETE:
                        this.level++;
                        this.nextLevel();
                        break;
                    case GAME_STATES.GAME_OVER:
                        this.resetGame();
                        break;
                    case GAME_STATES.PAUSED:
                        this.gameState = GAME_STATES.PLAYING;
                        break;
                }
                break;
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                this.keys.right = false;
                break;
            case ' ':
                this.keys.space = false;
                break;
        }
    }

    /**
     * Carga la puntuación más alta del localStorage
     * @returns {number} Puntuación más alta guardada o 0 si no existe
     */
    loadHiScore() {
        const savedScore = localStorage.getItem('galaxianHiScore');
        return savedScore ? parseInt(savedScore) : 0;
    }

    /**
     * Guarda la puntuación más alta en localStorage
     */
    saveHiScore() {
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
            localStorage.setItem('galaxianHiScore', this.hiScore.toString());
        }
    }

    /**
     * Actualiza el panel de información superior
     */
    updateInfoPanel() {
        // Panel superior (fondo negro)
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, 40);

        // Configuración común del texto
        this.ctx.font = '16px "Press Start 2P"';
        
        // SCORE (izquierda)
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(`SCORE ${this.score.toString().padStart(5, '0')}`, 10, 25);

        // HI-SCORE (centro)
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#00F';
        this.ctx.fillText(`HI-SCORE ${this.hiScore.toString().padStart(5, '0')}`, this.width/2, 25);

        // LEVEL (derecha)
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(`LEVEL ${this.level}`, this.width - 10, 25);

        // Vidas (usando sprites pequeños de la nave)
        const lifeSize = 12;
        const lifeSpacing = 15;
        const livesStartX = 10;
        const livesY = 35;

        for (let i = 0; i < this.lives; i++) {
            if (this.player && this.player.sprite.complete) {
                this.ctx.drawImage(
                    this.player.sprite,
                    livesStartX + (i * (lifeSize + lifeSpacing)),
                    livesY,
                    lifeSize,
                    lifeSize
                );
            }
        }
    }

    /**
     * Loop principal del juego
     */
    gameLoop(timestamp) {
        // Calcular delta time
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Solo actualizar el juego si estamos en estado PLAYING
        if (this.gameState === GAME_STATES.PLAYING) {
            this.update(this.deltaTime);
            if (this.enemyFormation.enemies.length === 0) {
                this.gameState = GAME_STATES.LEVEL_COMPLETE;
            }
        }
        
        this.render();
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        // Solo actualizar si el juego está activo
        if (this.gameState !== GAME_STATES.PLAYING) return;

        // Actualizar estrellas
        this.stars.forEach(star => star.update());

        // Actualizar explosiones
        this.explosions = this.explosions.filter(exp => exp.active);
        this.explosions.forEach(exp => exp.update(deltaTime));

        // Actualizar jugador
        this.player.update(deltaTime);

        // Actualizar formación de enemigos
        this.enemyFormation.update(
            deltaTime,
            this.player.x + this.player.width/2,
            this.player.y + this.player.height/2
        );

        this.checkCollisions();
    }

    checkCollisions() {
        // Colisiones de balas del jugador con enemigos
        this.player.bullets.forEach((bullet, bulletIndex) => {
            bullet.y -= PLAYER_CONFIG.BULLET_SPEED;

            // Eliminar balas fuera de pantalla
            if (bullet.y < 0) {
                this.player.bullets.splice(bulletIndex, 1);
                return;
            }

            // Verificar colisiones con enemigos
            this.enemyFormation.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    this.player.bullets.splice(bulletIndex, 1);
                    this.enemyFormation.removeEnemy(enemy);
                    this.score += enemy.points;
                    this.updateInfoPanel();
                    this.addExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 32);
                }
            });
        });

        // Colisiones de balas enemigas con el jugador
        this.enemyFormation.enemies.forEach(enemy => {
            enemy.bullets = enemy.bullets.filter(bullet => bullet.active);
            enemy.bullets.forEach(bullet => {
                if (bullet.active && this.checkCollision(bullet, this.player)) {
                    const explosionInstance = this.sounds.explosion.cloneNode();
                    explosionInstance.play().catch(e => console.log('Error playing sound:', e));
                    bullet.active = false;
                    if (!this.player.isInvulnerable) {
                        this.playerHit();
                    }
                }
            });

            // Colisión directa enemigo-jugador
            if (enemy.diving && this.checkCollision(enemy, this.player)) {
                // Crear explosión y sonido para el enemigo
                this.addExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 32);
                const explosionSound1 = this.sounds.explosion.cloneNode();
                explosionSound1.play().catch(e => console.log('Error playing sound:', e));
                
                this.enemyFormation.removeEnemy(enemy);
                
                if (!this.player.isInvulnerable) {
                    // Crear explosión y sonido para el jugador
                    this.addExplosion(
                        this.player.x + this.player.width/2,
                        this.player.y + this.player.height/2,
                        40
                    );
                    const explosionSound2 = this.sounds.explosion.cloneNode();
                    explosionSound2.play().catch(e => console.log('Error playing sound:', e));
                    
                    this.playerHit();
                }
            }
        });
    }

    checkCollision(rect1, rect2) {
        return rect1.active !== false && rect2.active !== false &&
               rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    playerHit() {
        this.lives--;
        this.soundManager.playHit();
        this.updateInfoPanel();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reiniciar posición del jugador
            this.player.reset();
            // Dar un breve período de invulnerabilidad
            this.player.makeInvulnerable(2000); // 2 segundos
        }
    }

    render() {
        // Limpiar el canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Dibujar estrellas
        this.stars.forEach(star => star.draw(this.ctx));

        // Renderizar según el estado del juego
        switch (this.gameState) {
            case GAME_STATES.START:
                this.renderStartScreen();
                break;
            case GAME_STATES.PLAYING:
                this.renderGame();
                this.updateInfoPanel(); // Actualizar panel de información
                break;
            case GAME_STATES.LEVEL_COMPLETE:
                this.renderLevelComplete();
                break;
            case GAME_STATES.GAME_OVER:
                this.renderGameOver();
                break;
        }

        // Dibujar explosiones
        this.explosions.forEach(exp => exp.draw(this.ctx));
    }

    renderStartScreen() {
        // Fondo negro
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Título
        this.ctx.fillStyle = UI_CONFIG.COLORS.TEXT;
        this.ctx.font = UI_CONFIG.FONTS.TITLE;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GALAXIAN', this.width/2, this.height/3);

        // Puntuaciones
        this.ctx.font = UI_CONFIG.FONTS.SCORE;
        this.ctx.fillStyle = UI_CONFIG.COLORS.SCORE;
        this.ctx.fillText(`SCORE: ${this.score.toString().padStart(5, '0')}`, this.width/2, this.height/2);
        
        this.ctx.fillStyle = UI_CONFIG.COLORS.HI_SCORE;
        this.ctx.fillText(`HI-SCORE: ${this.hiScore.toString().padStart(5, '0')}`, this.width/2, this.height/2 + 40);

        // Instrucciones
        this.ctx.fillStyle = UI_CONFIG.COLORS.TEXT;
        this.ctx.font = UI_CONFIG.FONTS.TEXT;
        this.ctx.fillText('PRESS ENTER TO START', this.width/2, this.height * 3/4);
        
        // Controles
        this.ctx.font = UI_CONFIG.FONTS.TEXT;
        this.ctx.fillText('← → TO MOVE    SPACE TO SHOOT', this.width/2, this.height * 3/4 + 40);
    }

    renderGame() {
        // Limpiar canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Dibujar jugador
        this.player.draw(this.ctx);
        
        // Dibujar enemigos
        if (this.enemyFormation) {
            this.enemyFormation.draw(this.ctx);
        }
    }

    renderLevelComplete() {
        // Fondo negro
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Dibujar estrellas de fondo
        this.stars.forEach(star => star.draw(this.ctx));

        // Título
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '40px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL COMPLETE', this.width/2, this.height/3);

        // Nivel completado
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText(`LEVEL ${this.level} CLEARED`, this.width/2, this.height/2);

        // Puntuación
        this.ctx.fillText(`SCORE: ${this.score.toString().padStart(5, '0')}`, this.width/2, this.height/2 + 40);

        // Instrucciones
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText('PRESS ENTER FOR NEXT LEVEL', this.width/2, this.height * 3/4);
    }

    renderGameOver() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Game Over
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '40px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width/2, this.height/3);

        // Puntuación final
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText(`FINAL SCORE: ${this.score.toString().padStart(5, '0')}`, this.width/2, this.height/2);

        // Nuevo Hi-Score
        if (this.score === this.hiScore && this.score > 0) {
            this.ctx.fillStyle = '#00F';
            this.ctx.fillText('NEW HIGH SCORE!', this.width/2, this.height/2 + 40);
        }

        // Instrucciones
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText('PRESS ENTER TO PLAY AGAIN', this.width/2, this.height * 3/4);
    }

    resetGame() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        
        // Resetear configuración de enemigos a valores iniciales
        ENEMY_CONFIG.FORMATION_SPEED = DIFFICULTY_CONFIG.BASE.FORMATION_SPEED;
        ENEMY_CONFIG.DIVE_CHANCE = DIFFICULTY_CONFIG.BASE.DIVE_CHANCE;
        ENEMY_CONFIG.SHOOT_CHANCE = DIFFICULTY_CONFIG.BASE.SHOOT_CHANCE;
        ENEMY_CONFIG.BULLET_SPEED = DIFFICULTY_CONFIG.BASE.BULLET_SPEED;
        ENEMY_CONFIG.DIVE_SPEED = DIFFICULTY_CONFIG.BASE.DIVE_SPEED;
        
        this.player.reset();
        this.enemyFormation = new EnemyFormation(this);
        this.gameState = GAME_STATES.PLAYING;
        this.soundManager.startBgm();
    }

    /**
     * Maneja el game over
     */
    gameOver() {
        this.soundManager.stopBgm();
        this.saveHiScore();
        this.gameState = GAME_STATES.GAME_OVER;
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
            this.saveHiScore();
        }
    }

    nextLevel() {
        // Ya no incrementamos el nivel aquí, se hace en handleKeyDown
        
        // Aumentar dificultad un 10%
        ENEMY_CONFIG.FORMATION_SPEED *= 1.1;
        ENEMY_CONFIG.DIVE_CHANCE *= 1.1;
        ENEMY_CONFIG.SHOOT_CHANCE *= 1.1;
        ENEMY_CONFIG.BULLET_SPEED *= 1.1;
        ENEMY_CONFIG.DIVE_SPEED *= 1.1;
        
        // Crear nueva formación de enemigos
        this.enemyFormation = new EnemyFormation(this);
        this.gameState = GAME_STATES.PLAYING;
    }

    updateDifficulty() {
        const level = this.level - 1;
        const config = DIFFICULTY_CONFIG;
        
        // Actualizar configuración de enemigos según el nivel
        ENEMY_CONFIG.FORMATION_SPEED = config.BASE.FORMATION_SPEED * 
            Math.pow(config.LEVEL_MULTIPLIER.FORMATION_SPEED, level);
        ENEMY_CONFIG.DIVE_CHANCE = config.BASE.DIVE_CHANCE * 
            Math.pow(config.LEVEL_MULTIPLIER.DIVE_CHANCE, level);
        ENEMY_CONFIG.SHOOT_CHANCE = config.BASE.SHOOT_CHANCE * 
            Math.pow(config.LEVEL_MULTIPLIER.SHOOT_CHANCE, level);
        ENEMY_CONFIG.BULLET_SPEED = config.BASE.BULLET_SPEED * 
            Math.pow(config.LEVEL_MULTIPLIER.BULLET_SPEED, level);
        ENEMY_CONFIG.DIVE_SPEED = config.BASE.DIVE_SPEED * 
            Math.pow(config.LEVEL_MULTIPLIER.DIVE_SPEED, level);
    }

    addExplosion(x, y, size) {
        this.explosions.push(new Explosion(x, y, size));
        this.soundManager.playExplosion();
    }
}

// Iniciar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new GalaxianGame();
}); 