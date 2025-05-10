// Configuración del juego
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.4;
const JUMP_FORCE = -12;
const PLATFORM_WIDTH = 80;
const PLATFORM_HEIGHT = 15;
const GIRAFFE_WIDTH = 50;
const GIRAFFE_HEIGHT = 70;
const MOVE_SPEED = 4; // Velocidad de movimiento horizontal
const WRAP_AROUND = true; // Permitir que la jirafa aparezca por el otro lado de la pantalla
const CAMERA_OFFSET = 200; // Distancia desde la parte superior de la pantalla
const DEATH_THRESHOLD = 0.2; // 20% de la altura de la pantalla
const PLATFORM_GAP = {
    MIN: 90,    // Reducido para permitir saltos más cortos
    MAX: 160    // Aumentado para permitir saltos más largos
};
const PLATFORM_BUFFER = 200; // Distancia adicional para generar plataformas por encima
const PLATFORM_X_RANGE = {
    MIN: 0,     // Sin margen mínimo
    MAX: 1      // Sin margen máximo
};
const HORIZONTAL_JUMP_RANGE = {
    MIN: 1.8,   // Reducido para permitir saltos más cortos
    MAX: 4.0    // Aumentado para permitir saltos más largos
};

// Configuración de Power-ups
const POWERUP_TYPES = {
    DOUBLE_JUMP: {
        name: 'doubleJump',
        duration: 10000, // 10 segundos
        probability: 0.10, // 15% de probabilidad
        color: '#FFD700', // Dorado
        effect: (giraffe) => {
            giraffe.canDoubleJump = true;
            giraffe.jumpsLeft = 2;
        },
        remove: (giraffe) => {
            giraffe.canDoubleJump = false;
            giraffe.jumpsLeft = 1;
        }
    },
    SHIELD: {
        name: 'shield',
        duration: 8000, // 8 segundos
        probability: 0.05, // 5% de probabilidad
        color: '#4169E1', // Azul real
        effect: (giraffe) => {
            giraffe.hasShield = true;
        },
        remove: (giraffe) => {
            giraffe.hasShield = false;
        }
    },
    MAGNET: {
        name: 'magnet',
        duration: 5000, // 5 segundos
        probability: 0.05, // 5% de probabilidad
        color: '#FF4500', // Naranja rojizo
        effect: (giraffe) => {
            giraffe.hasMagnet = true;
        },
        remove: (giraffe) => {
            giraffe.hasMagnet = false;
        }
    }
};

// Elementos del DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// Configuración del canvas
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Estado del juego
let gameState = {
    giraffe: {
        x: GAME_WIDTH / 2 - GIRAFFE_WIDTH / 2,
        y: GAME_HEIGHT - GIRAFFE_HEIGHT - 100,
        velocityY: 0,
        velocityX: 0,
        isJumping: false,
        direction: 1, // 1 para derecha, -1 para izquierda
        // Nuevas propiedades para power-ups
        canDoubleJump: false,
        jumpsLeft: 1,
        hasShield: false,
        hasMagnet: false,
        activePowerups: []
    },
    platforms: [],
    powerups: [],
    score: 0,
    gameOver: false,
    highestY: 0,
    camera: {
        y: 0
    }
};

// Cargar imágenes
const giraffeImage = new Image();
giraffeImage.src = 'kirin.png';

// Nueva imagen para el powerup DOUBLE_JUMP
globalThis.doubleJumpImage = new Image();
globalThis.doubleJumpImage.src = 'powerup-gold.png';

// Cargar imagen para las plataformas
const platformImage = new Image();
platformImage.src = 'platform.png';

// Cargar imagen para el powerup MAGNET
const magnetImage = new Image();
magnetImage.src = 'powerup-magnet.png';

// Cargar imagen para el powerup SHIELD
const shieldImage = new Image();
shieldImage.src = 'powerup-shield.png';

// Cargar imagen de fondo para el bioma selva
const jungleBgImage = new Image();
jungleBgImage.src = 'bioma-wild.png';

// Sonidos
const sounds = {
    jump: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3']
    }),
    gameOver: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3']
    }),
    powerup: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3']
    })
};

// Añadir constante para el número máximo de plataformas
const MAX_PLATFORMS = 8; // Reducido de 15 a 8 para más desafío

// Añadir variables para controlar la distribución de plataformas
let lastPlatformPosition = 'center'; // 'left', 'center', 'right'
let consecutiveExtremeCount = 0;

// Constante para el factor de parallax del fondo
const PARALLAX_FACTOR = 0.02; // El fondo se mueve a la mitad de la velocidad de la cámara

// Inicializar plataformas
function initializePlatforms() {
    gameState.platforms = [];
    
    // Plataforma inicial
    gameState.platforms.push({
        x: GAME_WIDTH / 2 - PLATFORM_WIDTH / 2,
        y: GAME_HEIGHT - 100,
        width: PLATFORM_WIDTH,
        height: PLATFORM_HEIGHT
    });
    
    // Generar plataformas iniciales
    for (let i = 0; i < 8; i++) {
        createPlatform();
    }
}

// Crear una nueva plataforma
function createPlatform() {
    const lastPlatform = gameState.platforms[gameState.platforms.length - 1];
    
    // Calcular la posición X asegurando que esté dentro de la pantalla
    let x;
    if (lastPlatform) {
        const centerX = lastPlatform.x + PLATFORM_WIDTH / 2;
        
        // Calcular la distancia de salto horizontal basada en la altura
        const heightFactor = Math.max(0, -lastPlatform.y / 1500);
        const jumpMultiplier = HORIZONTAL_JUMP_RANGE.MIN + 
            (heightFactor * (HORIZONTAL_JUMP_RANGE.MAX - HORIZONTAL_JUMP_RANGE.MIN));
        const maxJumpDistance = Math.abs(JUMP_FORCE) * jumpMultiplier;
        
        // Calcular los límites de la pantalla
        const minX = 0;
        const maxX = GAME_WIDTH - PLATFORM_WIDTH;
        const centerXMin = GAME_WIDTH * 0.3;
        const centerXMax = GAME_WIDTH * 0.7 - PLATFORM_WIDTH;
        
        // Determinar la posición basada en la última plataforma
        if (lastPlatformPosition === 'left' || lastPlatformPosition === 'right') {
            // Si la última plataforma estaba en un extremo, forzar la siguiente al centro
            x = centerXMin + Math.random() * (centerXMax - centerXMin);
            lastPlatformPosition = 'center';
            consecutiveExtremeCount = 0;
        } else {
            // Si la última plataforma estaba en el centro, podemos permitir un extremo
            if (Math.random() < 0.15 && consecutiveExtremeCount < 1) {
                const edgeVariation = 30; // Aumentado para más variación
                if (Math.random() < 0.5) {
                    x = minX + Math.random() * edgeVariation;
                    lastPlatformPosition = 'left';
                } else {
                    x = maxX - Math.random() * edgeVariation;
                    lastPlatformPosition = 'right';
                }
                consecutiveExtremeCount++;
            } else {
                // Distribución centrada con más variación
                const randomFactor = Math.random() * 1.4 - 0.7; // Reducido el rango para más control
                const distanceVariation = maxJumpDistance * 0.7; // Reducido para saltos más predecibles
                x = centerX + (randomFactor * distanceVariation);
                
                // Determinar si está en el centro o cerca de un extremo
                if (x < centerXMin) {
                    lastPlatformPosition = 'left';
                } else if (x > centerXMax) {
                    lastPlatformPosition = 'right';
                } else {
                    lastPlatformPosition = 'center';
                    consecutiveExtremeCount = 0;
                }
            }
        }
        
        // Asegurar que la plataforma esté dentro de la pantalla
        x = Math.max(minX, Math.min(maxX, x));
    } else {
        x = GAME_WIDTH / 2 - PLATFORM_WIDTH / 2;
        lastPlatformPosition = 'center';
    }

    // Calcular la posición Y asegurando que esté dentro del rango visible
    let y;
    if (lastPlatform) {
        const baseGap = PLATFORM_GAP.MIN + Math.random() * (PLATFORM_GAP.MAX - PLATFORM_GAP.MIN);
        const heightVariation = Math.random() * 40 - 20;
        y = lastPlatform.y - (baseGap + heightVariation);
        
        // Asegurar que la plataforma no esté demasiado lejos
        const maxGap = PLATFORM_GAP.MAX * 1.2;
        y = Math.max(lastPlatform.y - maxGap, y);
    } else {
        y = GAME_HEIGHT - 100;
    }

    // Añadir variación en el ancho de la plataforma
    const widthVariation = Math.random() * 30 - 15;
    const platformWidth = PLATFORM_WIDTH + widthVariation;

    const platform = {
        x: x,
        y: y,
        width: platformWidth,
        height: PLATFORM_HEIGHT
    };
    
    gameState.platforms.push(platform);
}

// Crear un nuevo power-up
function createPowerup() {
    const types = Object.values(POWERUP_TYPES);
    const randomType = types.find(type => Math.random() < type.probability);
    
    if (randomType) {
        const powerup = {
            x: Math.random() * (GAME_WIDTH - 30),
            y: gameState.platforms[gameState.platforms.length - 1].y - 50,
            width: 30,
            height: 30,
            type: randomType,
            active: true
        };
        gameState.powerups.push(powerup);
    }
}

// Actualizar power-ups
function updatePowerups() {
    // Generar nuevos power-ups
    if (Math.random() < 0.01) { // 1% de probabilidad por frame
        createPowerup();
    }

    // Actualizar power-ups activos
    gameState.giraffe.activePowerups = gameState.giraffe.activePowerups.filter(powerup => {
        powerup.timeLeft -= 16; // Aproximadamente 16ms por frame
        if (powerup.timeLeft <= 0) {
            powerup.type.remove(gameState.giraffe);
            return false;
        }
        return true;
    });

    // Verificar colisiones con power-ups
    gameState.powerups = gameState.powerups.filter(powerup => {
        if (powerup.active &&
            gameState.giraffe.x < powerup.x + powerup.width &&
            gameState.giraffe.x + GIRAFFE_WIDTH > powerup.x &&
            gameState.giraffe.y < powerup.y + powerup.height &&
            gameState.giraffe.y + GIRAFFE_HEIGHT > powerup.y) {
            
            // Activar power-up
            powerup.type.effect(gameState.giraffe);
            gameState.giraffe.activePowerups.push({
                type: powerup.type,
                timeLeft: powerup.type.duration
            });
            sounds.powerup.play();
            return false;
        }
        return true;
    });

    // Aplicar efectos de power-ups
    if (gameState.giraffe.hasMagnet) {
        // Atraer plataformas cercanas
        gameState.platforms.forEach(platform => {
            const dx = gameState.giraffe.x - platform.x;
            const dy = gameState.giraffe.y - platform.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) { // Radio de atracción
                platform.x += dx * 0.02;
            }
        });
    }
}

// Actualizar la cámara
function updateCamera() {
    // Calcular la posición objetivo de la cámara
    const targetY = gameState.giraffe.y - CAMERA_OFFSET;
    
    // Si la jirafa está subiendo, mover la cámara
    if (targetY < gameState.camera.y) {
        gameState.camera.y = targetY;
    }
}

// Actualizar el estado del juego
function update() {
    if (gameState.gameOver) return;

    // Manejar movimiento horizontal
    if (keys.ArrowLeft || keys.KeyA) {
        gameState.giraffe.velocityX = -MOVE_SPEED;
        gameState.giraffe.direction = -1;
    } else if (keys.ArrowRight || keys.KeyD) {
        gameState.giraffe.velocityX = MOVE_SPEED;
        gameState.giraffe.direction = 1;
    } else {
        gameState.giraffe.velocityX = 0;
    }

    // Aplicar movimiento horizontal
    gameState.giraffe.x += gameState.giraffe.velocityX;

    // Manejar el wrap-around (aparecer por el otro lado de la pantalla)
    if (WRAP_AROUND) {
        if (gameState.giraffe.x > GAME_WIDTH) {
            gameState.giraffe.x = -GIRAFFE_WIDTH;
        } else if (gameState.giraffe.x + GIRAFFE_WIDTH < 0) {
            gameState.giraffe.x = GAME_WIDTH;
        }
    } else {
        // Mantener la jirafa dentro de los límites de la pantalla
        gameState.giraffe.x = Math.max(0, Math.min(GAME_WIDTH - GIRAFFE_WIDTH, gameState.giraffe.x));
    }

    // Aplicar gravedad
    gameState.giraffe.velocityY += GRAVITY;
    gameState.giraffe.y += gameState.giraffe.velocityY;

    // Actualizar power-ups
    updatePowerups();

    // Modificar la lógica de salto para incluir doble salto
    if (gameState.giraffe.velocityY > 0) { // Cayendo
        gameState.platforms.forEach(platform => {
            if (gameState.giraffe.y + GIRAFFE_HEIGHT > platform.y &&
                gameState.giraffe.y + GIRAFFE_HEIGHT < platform.y + platform.height &&
                gameState.giraffe.x + GIRAFFE_WIDTH > platform.x &&
                gameState.giraffe.x < platform.x + platform.width) {
                
                gameState.giraffe.velocityY = JUMP_FORCE;
                gameState.giraffe.isJumping = true;
                gameState.giraffe.jumpsLeft = gameState.giraffe.canDoubleJump ? 2 : 1;
                sounds.jump.play();
            }
        });
    }

    // Actualizar puntuación
    if (gameState.giraffe.y < gameState.highestY) {
        gameState.highestY = gameState.giraffe.y;
        gameState.score = Math.floor(-gameState.highestY / 10);
        scoreElement.textContent = gameState.score;
    }

    // Generar nuevas plataformas cuando sea necesario
    const highestPlatform = Math.min(...gameState.platforms.map(p => p.y));
    const cameraTop = gameState.camera.y;
    
    // Aumentar la probabilidad de generar plataformas
    const heightFactor = Math.max(0, -cameraTop / 1000);
    const generationChance = 0.02 + (heightFactor * 0.01);
    
    // Generar plataformas si hay espacio en la pantalla y no excedemos el máximo
    if (highestPlatform > cameraTop - PLATFORM_BUFFER && 
        Math.random() < generationChance &&
        gameState.platforms.length < MAX_PLATFORMS) {
        createPlatform();
    }

    // Eliminar plataformas que están fuera de la pantalla
    gameState.platforms = gameState.platforms.filter(platform => 
        platform.y < gameState.camera.y + GAME_HEIGHT + PLATFORM_BUFFER &&
        platform.y > gameState.camera.y - PLATFORM_BUFFER
    );

    // Verificar game over con escudo y nueva lógica de muerte por caída
    const screenBottom = gameState.camera.y + GAME_HEIGHT;
    const deathThreshold = screenBottom + (GAME_HEIGHT * DEATH_THRESHOLD);
    
    if (gameState.giraffe.y > deathThreshold) {
        if (gameState.giraffe.hasShield) {
            // Si tiene escudo, rebota y pierde el escudo
            gameState.giraffe.y = deathThreshold - GIRAFFE_HEIGHT;
            gameState.giraffe.velocityY = JUMP_FORCE;
            gameState.giraffe.hasShield = false;
            // Eliminar el power-up de escudo activo
            gameState.giraffe.activePowerups = gameState.giraffe.activePowerups.filter(
                powerup => powerup.type.name !== 'shield'
            );
        } else {
            // Game over si no tiene escudo
            gameState.gameOver = true;
            finalScoreElement.textContent = gameState.score;
            gameOverElement.classList.remove('hidden');
            sounds.gameOver.play();
        }
    }

    // Actualizar la cámara
    updateCamera();
}

// Dibujar el juego
function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.save();
    ctx.translate(0, -gameState.camera.y);

    // Dibujar fondo de bioma selva estático
    if (jungleBgImage.complete && jungleBgImage.naturalWidth !== 0) {
        ctx.drawImage(jungleBgImage, 0, gameState.camera.y, GAME_WIDTH, GAME_HEIGHT);
    } else {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, gameState.camera.y, GAME_WIDTH, GAME_HEIGHT);
    }

    // Dibujar plataformas con imagen
    gameState.platforms.forEach(platform => {
        if (platform.y + platform.height > gameState.camera.y && 
            platform.y < gameState.camera.y + GAME_HEIGHT) {
            if (platformImage.complete && platformImage.naturalWidth !== 0) {
                ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
            } else {
                // Fallback visual si la imagen no está cargada
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            }
        }
    });

    // Dibujar power-ups
    gameState.powerups.forEach(powerup => {
        if (powerup.y + powerup.height > gameState.camera.y && 
            powerup.y < gameState.camera.y + GAME_HEIGHT) {
            if (powerup.type.name === 'doubleJump') {
                ctx.drawImage(
                    globalThis.doubleJumpImage,
                    powerup.x,
                    powerup.y,
                    powerup.width,
                    powerup.height
                );
            } else if (powerup.type.name === 'magnet') {
                ctx.drawImage(
                    magnetImage,
                    powerup.x,
                    powerup.y,
                    powerup.width,
                    powerup.height
                );
            } else if (powerup.type.name === 'shield') {
                ctx.drawImage(
                    shieldImage,
                    powerup.x,
                    powerup.y,
                    powerup.width,
                    powerup.height
                );
            } else {
                ctx.fillStyle = powerup.type.color;
                ctx.beginPath();
                ctx.arc(
                    powerup.x + powerup.width/2,
                    powerup.y + powerup.height/2,
                    powerup.width/2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    });

    // Dibujar jirafa
    if (gameState.giraffe.direction === -1) {
        ctx.translate(gameState.giraffe.x + GIRAFFE_WIDTH, gameState.giraffe.y);
        ctx.scale(-1, 1);
        ctx.drawImage(giraffeImage, 0, 0, GIRAFFE_WIDTH, GIRAFFE_HEIGHT);
    } else {
        ctx.drawImage(giraffeImage, gameState.giraffe.x, gameState.giraffe.y, GIRAFFE_WIDTH, GIRAFFE_HEIGHT);
    }

    // Dibujar efectos de power-ups activos
    if (gameState.giraffe.hasShield) {
        ctx.beginPath();
        ctx.arc(
            gameState.giraffe.x + GIRAFFE_WIDTH/2,
            gameState.giraffe.y + GIRAFFE_HEIGHT/2,
            GIRAFFE_WIDTH * 0.8,
            0,
            Math.PI * 2
        );
        ctx.strokeStyle = POWERUP_TYPES.SHIELD.color;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Restaurar el estado del contexto
    ctx.restore();

    // Dibujar UI después de restaurar el contexto
    drawUI();
}

// Nueva función para dibujar la UI
function drawUI() {
    // Limpiar el área de la puntuación
    ctx.clearRect(0, 0, 200, 50);
    
    // Dibujar fondo para la puntuación
    //ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    //ctx.fillRect(10, 10, 180, 40);
    
    // Dibujar puntuación
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    //ctx.fillText(`Puntuación: ${gameState.score}`, 20, 35);
}

// Bucle principal del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners
restartButton.addEventListener('click', resetGame);

// Sistema de control de teclas
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Iniciar el juego
initializePlatforms();
gameLoop();

// Modificar la función resetGame para reiniciar las variables de distribución
function resetGame() {
    gameState = {
        giraffe: {
            x: GAME_WIDTH / 2 - GIRAFFE_WIDTH / 2,
            y: GAME_HEIGHT - GIRAFFE_HEIGHT - 100,
            velocityY: 0,
            velocityX: 0,
            isJumping: false,
            direction: 1,
            canDoubleJump: false,
            jumpsLeft: 1,
            hasShield: false,
            hasMagnet: false,
            activePowerups: []
        },
        platforms: [],
        powerups: [],
        score: 0,
        gameOver: false,
        highestY: 0,
        camera: {
            y: 0
        }
    };
    lastPlatformPosition = 'center';
    consecutiveExtremeCount = 0;
    scoreElement.textContent = '0';
    gameOverElement.classList.add('hidden');
    initializePlatforms();
} 