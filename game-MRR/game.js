// Configuración del juego
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.8;
const LEVEL_WIDTH = 2400; // Nivel más amplio que el canvas para permitir scroll
const GROUND_LEVEL = 550;
const MAX_LIVES = 3; // Número máximo de vidas del jugador

// Variables del juego
let gameRunning = false;
let player;
let platforms = [];
let ghosts = [];
let pumpkins = [];
let cameraPosX = 0;
let keys = {};
let levelCompleted = false;
let backgroundImage;
let backgroundLoaded = false;
let debugMode = true; // Activar depuración
let errors = []; // Almacenar errores detectados
let canvasStartButton = { // Botón en canvas para iniciar el juego
    x: CANVAS_WIDTH / 2 - 100,
    y: CANVAS_HEIGHT / 2 + 60,
    width: 200,
    height: 50,
    text: "INICIAR JUEGO"
};
let startScreenShown = false; // Para rastrear si se ha mostrado la pantalla de inicio
let soundEnabled = true; // Control de sonido

// Elementos del DOM - los inicializamos después de que el DOM haya cargado
let canvas, ctx, scoreElement, livesElement, startScreen, gameOverScreen, startButton, restartButton, finalScoreElement;

// Función auxiliar para reproducir sonidos
function playSound(soundName) {
    if (window.audioManager && soundEnabled !== false) {
        try {
            window.audioManager.play(soundName);
            console.log(`Reproduciendo sonido: ${soundName}`);
        } catch (error) {
            console.error(`Error al reproducir sonido ${soundName}:`, error);
        }
    }
}

// Cargar recursos
function loadResources() {
    console.log('Cargando recursos...');
    
    try {
        // Inicializar elementos del DOM
        canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('No se encontró el elemento canvas');
        }
        
        ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No se pudo obtener el contexto 2D del canvas');
        }
        
        // Configurar dimensiones del canvas
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        
        // Obtener referencias a elementos UI
        scoreElement = document.getElementById('score');
        livesElement = document.getElementById('lives');
        startScreen = document.getElementById('startScreen');
        gameOverScreen = document.getElementById('gameOverScreen');
        finalScoreElement = document.getElementById('finalScore');
        
        // Verificar si los elementos existen
        if (!startScreen) {
            console.error('No se encontró la pantalla de inicio, creando alternativa');
            createFallbackStartScreen();
        }
        
        if (!gameOverScreen) {
            console.error('No se encontró la pantalla de game over, se usará alternativa en canvas');
        }
        
        // Cargar imagen de fondo
        backgroundImage = new Image();
        backgroundImage.src = 'assets/background-game.png';
        backgroundImage.onload = () => {
            backgroundLoaded = true;
            console.log('Imagen de fondo cargada correctamente');
        };
        backgroundImage.onerror = () => {
            console.error('Error al cargar la imagen de fondo, usando respaldo');
            // Marcar como no cargada para usar el fondo de respaldo
            backgroundLoaded = false;
        };
        
        // Dibujar pantalla de carga inicial
        drawLoadingScreen();
        
    } catch (error) {
        console.error('Error al cargar recursos:', error);
        // Intentar mostrar el error en pantalla
        if (ctx) {
            drawErrorScreen(error.message);
        } else {
            // Si no hay canvas, mostrar alerta
            alert('Error al cargar el juego: ' + error.message);
        }
    }
}

// Crear pantalla de inicio alternativa si falta en el DOM
function createFallbackStartScreen() {
    startScreen = document.createElement('div');
    startScreen.id = 'startScreen';
    startScreen.className = 'screen';
    
    // Crear contenido
    const content = document.createElement('div');
    content.className = 'menu-content';
    
    // Título
    const title = document.createElement('h1');
    title.textContent = "Skeleton's Halloween Adventure";
    content.appendChild(title);
    
    // Descripción
    const desc = document.createElement('p');
    desc.textContent = "Ayuda al esqueleto a recolectar calabazas y evitar fantasmas en esta noche de Halloween";
    content.appendChild(desc);
    
    // Controles
    const controls = document.createElement('div');
    controls.className = 'menu-controls';
    
    // Control de movimiento
    const moveControl = document.createElement('div');
    moveControl.className = 'control-info';
    const moveIcon = document.createElement('span');
    moveIcon.className = 'key-icon';
    moveIcon.textContent = '←→';
    const moveDesc = document.createElement('span');
    moveDesc.className = 'key-desc';
    moveDesc.textContent = 'Mover';
    moveControl.appendChild(moveIcon);
    moveControl.appendChild(moveDesc);
    
    // Control de salto
    const jumpControl = document.createElement('div');
    jumpControl.className = 'control-info';
    const jumpIcon = document.createElement('span');
    jumpIcon.className = 'key-icon';
    jumpIcon.textContent = '↑';
    const jumpDesc = document.createElement('span');
    jumpDesc.className = 'key-desc';
    jumpDesc.textContent = 'Saltar';
    jumpControl.appendChild(jumpIcon);
    jumpControl.appendChild(jumpDesc);
    
    controls.appendChild(moveControl);
    controls.appendChild(jumpControl);
    content.appendChild(controls);
    
    // Botón de inicio
    const startBtn = document.createElement('button');
    startBtn.id = 'startButton';
    startBtn.textContent = 'COMENZAR JUEGO';
    content.appendChild(startBtn);
    
    // Añadir contenido a la pantalla
    startScreen.appendChild(content);
    
    // Añadir la pantalla al contenedor
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.appendChild(startScreen);
        
        // Configurar evento para el botón creado
        startBtn.addEventListener('click', initGame);
    } else {
        console.error('No se encontró el contenedor del juego');
    }
}

// Función para dibujar la pantalla de carga
function drawLoadingScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Fondo para Halloween
    drawSimpleBackground();
    
    // Texto de carga
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Cargando juego...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    // Mensaje adicional
    ctx.font = '16px Arial';
    ctx.fillText('Presiona "S" para mostrar la pantalla de inicio', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    ctx.fillText('Presiona "Enter" para iniciar directamente', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    
    // Dibujar botón de inicio en el canvas
    drawCanvasButton();
}

// Función para dibujar botón en el canvas
function drawCanvasButton() {
    // Fondo del botón
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(canvasStartButton.x, canvasStartButton.y, canvasStartButton.width, canvasStartButton.height);
    
    // Borde del botón
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasStartButton.x, canvasStartButton.y, canvasStartButton.width, canvasStartButton.height);
    
    // Texto del botón
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(canvasStartButton.text, canvasStartButton.x + canvasStartButton.width/2, canvasStartButton.y + canvasStartButton.height/2);
}

// Función para manejar clics en el canvas
function handleCanvasClick(event) {
    if (gameRunning) return;
    
    // Obtener las coordenadas del clic relativas al canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Verificar si el clic fue en el botón de inicio
    if (x >= canvasStartButton.x && 
        x <= canvasStartButton.x + canvasStartButton.width && 
        y >= canvasStartButton.y && 
        y <= canvasStartButton.y + canvasStartButton.height) {
        console.log('Botón de inicio del canvas pulsado');
        initGame();
    }
}

// Función para mostrar errores en pantalla
function drawErrorScreen(errorMessage) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = 'red';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ERROR:', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.fillText(errorMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    ctx.fillStyle = 'white';
    ctx.fillText('Presiona "R" para recargar', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    
    // Añadir listener para recargar
    document.addEventListener('keydown', e => {
        if (e.key === 'r') {
            window.location.reload();
        }
    });
}

// Mostrar pantalla de inicio
function showStartScreen() {
    if (startScreen) {
        // Asegurarse que la pantalla de inicio está visible
        startScreen.style.display = 'flex';
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        console.log('Pantalla de inicio mostrada');
        
        // Configurar event listeners
        setupEventListeners();
    } else {
        console.error('No se puede mostrar la pantalla de inicio: no existe el elemento');
    }
}

// Función para inicializar el juego
function initGame() {
    try {
        console.log('Inicializando juego...');
        gameRunning = true;
        gameOver = false;
        score = 0;
        playerLives = MAX_LIVES;
        
        // Ocultar pantallas
        if (startScreen) {
            startScreen.style.display = 'none';
        }
        
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        
        // Configurar canvas
        canvas = document.getElementById('gameCanvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        ctx = canvas.getContext('2d');
        
        console.log('Canvas configurado correctamente');
        
        // Reiniciar estado del juego
        player = new Player(100, 300);
        platforms = [];
        ghosts = [];
        pumpkins = [];
        lastTime = performance.now();
        
        // Actualizar UI
        if (scoreElement) scoreElement.textContent = score;
        if (livesElement) livesElement.textContent = playerLives;
        
        // Crear el nivel completo en lugar de solo las plataformas iniciales
        createLevel();
        
        // Reproducir música de fondo
        if (audioManager) {
            audioManager.playMusic();
        }
        
        console.log('¡Juego inicializado!');
        
        // Iniciar bucle del juego
        requestAnimationFrame(gameLoop);
        
    } catch (error) {
        console.error('Error al inicializar el juego:', error);
        if (ctx) {
            // Mostrar mensaje de error en el canvas
            drawErrorScreen(error.message);
        }
    }
}

// Función para activar/desactivar sonido
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    // Cambiar icono del botón
    const soundControl = document.getElementById('soundControl');
    if (soundControl) {
        if (soundEnabled) {
            soundControl.textContent = '🔊';
            soundControl.classList.remove('muted');
        } else {
            soundControl.textContent = '🔇';
            soundControl.classList.add('muted');
        }
    }
    
    // Llamar al AudioManager
    if (window.audioManager) {
        const isMuted = window.audioManager.toggleMute();
        console.log(`Sonido ${isMuted ? 'silenciado' : 'activado'}`);
    }
    
    // Mostrar indicador visual de sonido
    showSoundIndicator(soundEnabled);
}

// Mostrar indicador de sonido activado/desactivado
function showSoundIndicator(enabled) {
    const indicatorText = enabled ? '🔊 Sonido activado' : '🔇 Sonido silenciado';
    
    // Añadir indicador temporal
    const indicator = document.createElement('div');
    indicator.textContent = indicatorText;
    indicator.style.position = 'absolute';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '8px 16px';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '1000';
    indicator.style.transition = 'opacity 0.5s ease';
    
    document.body.appendChild(indicator);
    
    // Desvanecer y eliminar después de 2 segundos
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 500);
    }, 1500);
}

// Crear nivel
function createLevel() {
    console.log('Creando nivel completo...');
    
    // Limpiar arrays para evitar duplicados
    platforms = [];
    ghosts = [];
    pumpkins = [];
    
    // Suelo principal
    platforms.push(new Platform(0, GROUND_LEVEL, LEVEL_WIDTH, 50));
    
    // Plataformas flotantes (x, y, ancho, alto)
    const platformPositions = [
        [200, 450, 150, 20],     // Primera plataforma
        [400, 380, 150, 20],     // Segunda plataforma
        [650, 400, 150, 20],     // Tercera plataforma
        [850, 350, 150, 20],     // Cuarta plataforma
        
        // Añadir más plataformas a lo largo del nivel
        [1050, 400, 200, 20],    // Quinta plataforma
        [1300, 350, 150, 20],    // Sexta plataforma
        [1500, 450, 150, 20],    // Séptima plataforma
        [1700, 380, 200, 20],    // Octava plataforma
        [1950, 420, 150, 20],    // Novena plataforma
        [2150, 350, 200, 20]     // Décima plataforma (cerca del final)
    ];
    
    platformPositions.forEach(pos => {
        platforms.push(new Platform(...pos));
    });
    
    // Añadir fantasmas
    const ghostPositions = [
        [300, 400, 150],      // Primer fantasma
        [600, 330, 150],      // Segundo fantasma
        [900, 300, 150],      // Tercer fantasma
        [1100, 350, 150],     // Cuarto fantasma
        [1400, 300, 200],     // Quinto fantasma
        [1600, 400, 150],     // Sexto fantasma
        [1800, 330, 200],     // Séptimo fantasma
        [2000, 370, 150]      // Octavo fantasma
    ];
    
    ghostPositions.forEach(pos => {
        ghosts.push(new Ghost(...pos));
    });
    
    // Añadir calabazas
    const pumpkinPositions = [
        [250, 400],           // Primera calabaza
        [500, 330],           // Segunda calabaza
        [700, 350],           // Tercera calabaza
        [950, 300],           // Cuarta calabaza
        [1150, 350],          // Quinta calabaza
        [1350, 300],          // Sexta calabaza
        [1550, 400],          // Séptima calabaza
        [1750, 330],          // Octava calabaza
        [1850, 330],          // Novena calabaza
        [2050, 370],          // Décima calabaza
        [2200, 300]           // Calabaza cerca del final
    ];
    
    pumpkinPositions.forEach(pos => {
        pumpkins.push(new Pumpkin(...pos));
    });
    
    console.log(`Nivel creado con ${platforms.length} plataformas, ${ghosts.length} fantasmas y ${pumpkins.length} calabazas`);
}

// Bucle principal del juego
function gameLoop() {
    if (!gameRunning) return;
    
    try {
        // Actualizar errores detectados
        if (window.gameDebug) {
            errors = window.gameDebug.detectProblems({
                player,
                platforms,
                ghosts,
                pumpkins,
                keys,
                gameRunning
            });
        }
        
        // Actualizar posición de la cámara para seguir al jugador
        updateCamera();
        
        // Dibujar fondo
        drawBackground();
        
        // Guardar estado del canvas antes de aplicar transformación
        ctx.save();
        
        // Aplicar transformación para simular la cámara
        ctx.translate(-cameraPosX, 0);
        
        // Actualizar y dibujar plataformas
        platforms.forEach(platform => {
            platform.draw(ctx);
        });
        
        // Actualizar y dibujar calabazas
        for (let i = pumpkins.length - 1; i >= 0; i--) {
            const pumpkin = pumpkins[i];
            pumpkin.update();
            pumpkin.draw(ctx);
            
            // Comprobar colisión con jugador
            if (checkCollision(player, pumpkin)) {
                // Incrementar puntuación
                player.score += 10;
                
                // Reproducir sonido de recolección
                playSound('collect');
                
                // Eliminar calabaza
                pumpkins.splice(i, 1);
                
                // Crear nueva calabaza en posición aleatoria
                spawnPumpkin();
            }
        }
        
        // Actualizar y dibujar fantasmas
        for (let i = 0; i < ghosts.length; i++) {
            const ghost = ghosts[i];
            ghost.update();
            ghost.draw(ctx);
            
            // Detectar colisión con el jugador
            if (checkCollision(player, ghost) && !player.isInvulnerable) {
                player.hit();
                
                // Comprobar si el jugador se quedó sin vidas
                if (player.lives <= 0) {
                    gameOver();
                    return;
                }
            }
        }
        
        // Actualizar y dibujar jugador
        handlePlayerInput();
        player.update(platforms, pumpkins, ghosts);
        player.draw(ctx);
        
        // Restaurar estado del canvas
        ctx.restore();
        
        // Actualizar UI
        updateUI();
        
        // Comprobar condiciones de fin de juego
        checkGameEnd();
        
        // Dibujar información de depuración si está activado
        if (debugMode && window.gameDebug) {
            window.gameDebug.drawDebugInfo(ctx, {
                player,
                platforms,
                ghosts,
                pumpkins,
                keys,
                gameRunning,
                errors
            });
        }
        
    } catch (error) {
        console.error('Error en gameLoop:', error);
        errors.push(error.message);
    }
    
    // Continuar el bucle
    requestAnimationFrame(gameLoop);
}

// Actualizar la posición de la cámara
function updateCamera() {
    // La cámara sigue al jugador horizontalmente, con límites en los bordes del nivel
    const targetX = player.x - CANVAS_WIDTH / 3;
    cameraPosX = Math.max(0, Math.min(targetX, LEVEL_WIDTH - CANVAS_WIDTH));
}

// Función para detectar colisiones entre dos objetos
function checkCollision(objA, objB) {
    // Verificar si los objetos se solapan en ambos ejes
    return (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y < objB.y + objB.height &&
        objA.y + objA.height > objB.y
    );
}

// Dibujar fondo con efecto parallax
function drawBackground() {
    // Limpiar todo el canvas primero para evitar duplicación
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Dibujar cielo como gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#2c1e31'); // Púrpura oscuro
    gradient.addColorStop(1, '#614051'); // Púrpura más claro
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Intentar dibujar imagen de fondo con efecto parallax
    try {
        if (backgroundLoaded && backgroundImage && backgroundImage.complete) {
            // Calcular posición con efecto parallax (movimiento más lento que la cámara)
            const bgX = cameraPosX * 0.3; // Movimiento más lento para efecto de profundidad
            ctx.drawImage(backgroundImage, -bgX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else {
            // Dibujar un fondo simple si la imagen no está cargada
            drawSimpleBackground();
        }
    } catch (error) {
        console.error('Error al dibujar fondo:', error);
        // Asegurar que siempre dibujamos algo
        drawSimpleBackground();
    }
}

// Dibujar un fondo simple con formas básicas
function drawSimpleBackground() {
    // Dibujar algunas formas en el fondo para simular un paisaje de Halloween
    
    // Luna
    ctx.fillStyle = 'rgba(255, 230, 150, 0.8)';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 100 - cameraPosX * 0.05, 80, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Montañas lejanas (que se muevan con efecto parallax)
    ctx.fillStyle = '#1a0f23';
    
    // Primera montaña
    ctx.beginPath();
    ctx.moveTo(-100 - cameraPosX * 0.1, CANVAS_HEIGHT);
    ctx.lineTo(300 - cameraPosX * 0.1, 200);
    ctx.lineTo(700 - cameraPosX * 0.1, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();
    
    // Segunda montaña
    ctx.beginPath();
    ctx.moveTo(500 - cameraPosX * 0.1, CANVAS_HEIGHT);
    ctx.lineTo(900 - cameraPosX * 0.1, 250);
    ctx.lineTo(1300 - cameraPosX * 0.1, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();
    
    // Árboles simples (que se muevan con la cámara)
    for (let i = 0; i < 5; i++) {
        const treeX = (i * 200 - cameraPosX * 0.2) % (CANVAS_WIDTH + 400) - 200;
        drawSimpleTree(treeX, CANVAS_HEIGHT - 100, 80, 120);
    }
    
    // Niebla en la parte inferior
    const fogGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - 100, 0, CANVAS_HEIGHT);
    fogGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    fogGradient.addColorStop(1, 'rgba(200, 200, 255, 0.2)');
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
}

// Dibujar un árbol simple para el fondo
function drawSimpleTree(x, y, width, height) {
    // Tronco
    ctx.fillStyle = '#3D1E09';
    ctx.fillRect(x + width/3, y - height/3, width/3, height/3);
    
    // Copa del árbol (estilo árbol muerto de Halloween)
    ctx.fillStyle = '#1a0f23';
    ctx.beginPath();
    ctx.moveTo(x, y - height/3);
    ctx.lineTo(x + width/2, y - height);
    ctx.lineTo(x + width, y - height/3);
    ctx.closePath();
    ctx.fill();
}

// Manejar entrada del jugador
function handlePlayerInput() {
    if (keys['ArrowLeft'] || keys['a']) {
        player.moveLeft();
    } else if (keys['ArrowRight'] || keys['d']) {
        player.moveRight();
    } else {
        player.stopMoving();
    }
    
    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && !player.isJumping) {
        player.jump();
        // Reproducir sonido de salto
        if (window.audioManager && soundEnabled) {
            window.audioManager.play('jump');
        }
    }
}

// Actualizar elementos de la UI
function updateUI() {
    try {
        if (scoreElement) scoreElement.textContent = player.score;
        if (livesElement) livesElement.textContent = player.lives;
    } catch (error) {
        console.error('Error al actualizar UI:', error);
    }
}

// Comprobar si el juego ha terminado
function checkGameEnd() {
    // Muerte por caída
    if (player.y > CANVAS_HEIGHT + 100) {
        player.lives = 0;
    }
    
    // Game over si no quedan vidas
    if (player.lives <= 0) {
        // Asegurar que las vidas no sean negativas
        player.lives = 0;
        showGameOver();
    }
    
    // Victoria si se llega al final del nivel
    if (player.x > LEVEL_WIDTH - 100 && !levelCompleted) {
        levelCompleted = true;
        // Aquí se podría mostrar una pantalla de victoria o pasar al siguiente nivel
        alert('¡Nivel completado! Puntuación: ' + player.score);
        showGameOver();
    }
}

// Finalizar juego
function showGameOver() {
    gameRunning = false;
    
    // Actualizar la puntuación final
    if (finalScoreElement) {
        finalScoreElement.textContent = player.score;
    }
    
    // Animación de caída del esqueleto
    let fallAnimation = 0;
    const fallDuration = 60; // frames de animación
    const animatePlayerFall = () => {
        fallAnimation++;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Dibujar fondo
        drawBackground();
        
        // Dibujar plataformas
        platforms.forEach(platform => platform.draw(ctx));
        
        // Dibujar fantasmas
        ghosts.forEach(ghost => ghost.draw(ctx));
        
        // Dibujar calabazas
        pumpkins.forEach(pumpkin => pumpkin.draw(ctx));
        
        // Aplicar rotación al jugador para que parezca que cae
        ctx.save();
        ctx.translate(player.x + player.width/2, player.y + player.height/2);
        const rotation = Math.min(fallAnimation / 20, Math.PI/2); // Rotar hasta 90 grados
        ctx.rotate(rotation);
        ctx.translate(-(player.x + player.width/2), -(player.y + player.height/2));
        
        // Hacer que caiga fuera de la pantalla
        player.y += 2;
        player.draw(ctx);
        ctx.restore();
        
        if (fallAnimation < fallDuration) {
            requestAnimationFrame(animatePlayerFall);
        } else {
            // Mostrar pantalla de Game Over
            if (gameOverScreen) {
                gameOverScreen.style.display = 'flex';
            } else {
                // Si no hay elemento HTML, dibujamos en el canvas
                drawGameOverScreen();
            }
            
            // Reproducir sonido de game over
            try {
                if (window.audioManager && window.soundEnabled !== false) {
                    window.audioManager.play('gameOver');
                    console.log('Reproduciendo sonido de game over');
                }
            } catch (error) {
                console.error('Error al reproducir sonido de game over:', error);
            }
        }
    };
    
    // Iniciar animación
    animatePlayerFall();
}

// Dibujar pantalla de game over en el canvas (como respaldo)
function drawGameOverScreen() {
    // Limpiar canvas y dibujar fondo
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Fondo para Halloween
    drawSimpleBackground();
    
    // Título
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡JUEGO TERMINADO!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
    
    // Puntuación
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Tu puntuación: ${player.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    // Botón de reinicio en canvas
    const restartCanvasButton = {
        x: CANVAS_WIDTH / 2 - 100,
        y: CANVAS_HEIGHT / 2 + 60,
        width: 200,
        height: 50,
        text: "JUGAR DE NUEVO"
    };
    
    // Dibujar botón
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(restartCanvasButton.x, restartCanvasButton.y, restartCanvasButton.width, restartCanvasButton.height);
    
    // Borde del botón
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(restartCanvasButton.x, restartCanvasButton.y, restartCanvasButton.width, restartCanvasButton.height);
    
    // Texto del botón
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(restartCanvasButton.text, restartCanvasButton.x + restartCanvasButton.width/2, restartCanvasButton.y + restartCanvasButton.height/2);
    
    // Añadir listener para reiniciar
    canvas.addEventListener('click', function gameOverClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (x >= restartCanvasButton.x && 
            x <= restartCanvasButton.x + restartCanvasButton.width && 
            y >= restartCanvasButton.y && 
            y <= restartCanvasButton.y + restartCanvasButton.height) {
            
            console.log('Botón de reinicio pulsado');
            canvas.removeEventListener('click', gameOverClick);
            initGame();
        }
    });
    
    // También permitir reiniciar con Enter
    const enterKeyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            document.removeEventListener('keydown', enterKeyHandler);
            initGame();
        }
    };
    
    document.addEventListener('keydown', enterKeyHandler);
}

// Control táctil para dispositivos móviles
let touchStartX = 0;
const TOUCH_THRESHOLD = 30;
let jumpButton = null;

function initTouchControls() {
    // Crear botones de control táctil si es un dispositivo móvil/tablet
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        const touchControls = document.createElement('div');
        touchControls.className = 'touch-controls';
        
        // Botones de dirección
        const leftButton = document.createElement('div');
        leftButton.className = 'touch-button left-button';
        leftButton.innerHTML = '&larr;';
        
        const rightButton = document.createElement('div');
        rightButton.className = 'touch-button right-button';
        rightButton.innerHTML = '&rarr;';
        
        // Botón de salto
        jumpButton = document.createElement('div');
        jumpButton.className = 'touch-button jump-button';
        jumpButton.innerHTML = '&uarr;';
        
        // Añadir event listeners
        leftButton.addEventListener('touchstart', () => { keys['ArrowLeft'] = true; });
        leftButton.addEventListener('touchend', () => { keys['ArrowLeft'] = false; });
        
        rightButton.addEventListener('touchstart', () => { keys['ArrowRight'] = true; });
        rightButton.addEventListener('touchend', () => { keys['ArrowRight'] = false; });
        
        jumpButton.addEventListener('touchstart', () => { 
            keys['ArrowUp'] = true; 
            // Reproducir sonido de salto
            if (window.audioManager && soundEnabled && !player.isJumping) {
                window.audioManager.play('jump');
            }
        });
        jumpButton.addEventListener('touchend', () => { keys['ArrowUp'] = false; });
        
        // Botón de sonido
        const soundButton = document.createElement('div');
        soundButton.className = 'touch-button sound-button';
        soundButton.innerHTML = '🔊';
        soundButton.addEventListener('click', toggleSound);
        
        // Añadir al DOM
        touchControls.appendChild(leftButton);
        touchControls.appendChild(rightButton);
        touchControls.appendChild(jumpButton);
        touchControls.appendChild(soundButton);
        document.body.appendChild(touchControls);
    }
}

// Crear plataformas iniciales
function createInitialPlatforms() {
    console.log('Creando plataformas iniciales...');
    
    // Crear el suelo
    platforms.push(new Platform(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40));
    
    // Plataformas flotantes ajustadas para ser accesibles con un salto (x, y, ancho, alto)
    platforms.push(new Platform(200, 450, 150, 20));     // Bajada de 350 a 450
    platforms.push(new Platform(400, 380, 150, 20));     // Bajada de 250 a 380
    platforms.push(new Platform(650, 400, 150, 20));     // Bajada de 300 a 400
    platforms.push(new Platform(850, 350, 150, 20));     // Bajada de 200 a 350
    
    console.log(`${platforms.length} plataformas creadas`);
}

// Crear fantasmas y calabazas iniciales
function spawnInitialEntities() {
    console.log('Creando entidades iniciales...');
    
    // Crear algunos fantasmas
    ghosts.push(new Ghost(300, 400)); // Ajustado para estar más cerca de las plataformas
    ghosts.push(new Ghost(600, 330)); // Ajustado para estar más cerca de las plataformas
    ghosts.push(new Ghost(900, 300)); // Ajustado para estar más cerca de las plataformas
    
    // Crear algunas calabazas
    spawnPumpkin(250, 400); // Ajustado para estar sobre la primera plataforma
    spawnPumpkin(500, 330); // Ajustado para estar sobre la segunda plataforma
    spawnPumpkin(700, 350); // Ajustado para estar sobre la tercera plataforma
    
    console.log(`${ghosts.length} fantasmas y ${pumpkins.length} calabazas creados`);
}

// Función para crear una nueva calabaza
function spawnPumpkin(x, y) {
    pumpkins.push(new Pumpkin(x, y));
}

// Iniciar carga de juego
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado completamente, inicializando...');
    
    // Cargar recursos del juego
    loadResources();
    
    // Mostrar la pantalla de inicio inmediatamente después de cargar
    showStartScreen();
    
    // Configurar eventos para botones
    setupEventListeners();
    
    // Verificar si el AudioContext necesita ser habilitado
    setTimeout(() => {
        if (window.audioManager) {
            window.audioManager.addAudioContextEnabler();
        }
    }, 500);
});

// Configurar los event listeners para los controles del juego
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    try {
        // Obtener referencias a los botones
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        const soundControl = document.getElementById('soundControl');
        
        // Evento para el botón de inicio
        if (startButton) {
            console.log('Configurando botón de inicio');
            startButton.addEventListener('click', initGame);
        } else {
            console.warn('No se encontró el botón de inicio');
        }
        
        // Evento para el botón de reinicio
        if (restartButton) {
            console.log('Configurando botón de reinicio');
            restartButton.addEventListener('click', initGame);
        } else {
            console.warn('No se encontró el botón de reinicio');
        }
        
        // Configurar botón de sonido
        if (soundControl) {
            console.log('Configurando botón de sonido');
            soundControl.addEventListener('click', toggleSound);
        } else {
            console.warn('No se encontró el botón de sonido');
        }
        
        // Configurar eventos de teclado
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        // Click en el canvas para botón de inicio
        if (canvas) {
            canvas.addEventListener('click', handleCanvasClick);
        } else {
            console.error('No se encontró el canvas para configurar eventos');
        }
        
        // Inicializar controles táctiles
        initTouchControls();
        
        console.log('Event listeners configurados correctamente');
    } catch (error) {
        console.error('Error al configurar event listeners:', error);
    }
}

// Manejar evento keydown
function handleKeyDown(e) {
    keys[e.key] = true;
    
    // Tecla 'D' para activar/desactivar depuración
    if (e.key === 'd') {
        debugMode = !debugMode;
        console.log(`Modo de depuración: ${debugMode ? 'activado' : 'desactivado'}`);
    }
    
    // Tecla 'S' para mostrar pantalla de inicio manualmente
    if (e.key === 's') {
        console.log('Mostrando pantalla de inicio manualmente');
        showStartScreen();
    }
    
    // Tecla 'Enter' para iniciar juego directamente
    if (e.key === 'Enter' && !gameRunning) {
        initGame();
    }
    
    // Tecla 'M' para silenciar/activar sonido
    if (e.key === 'm') {
        toggleSound();
    }
}

// Manejar evento keyup
function handleKeyUp(e) {
    keys[e.key] = false;
} 