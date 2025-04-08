// Variables globales
let game;
let cursors;
let gridSize = 30; // Tamaño de cada celda del grid
let boardWidth = 10; // Número de celdas horizontales
let boardHeight = 20; // Número de celdas verticales
let board = []; // Matriz para almacenar el estado del tablero

// Variables del juego
let currentPiece; // Pieza actual
let currentPiecePosition = { x: 0, y: 0 }; // Posición de la pieza actual
let nextPiece; // Próxima pieza
let fallTime = 1000; // Tiempo en ms para la caída automática
let fallTimer; // Temporizador para la caída
let score = 0; // Puntuación
let level = 1; // Nivel actual
let scoreText; // Texto de puntuación
let levelText; // Texto de nivel
let gameOver = false; // Estado de fin de juego
let canMove = true; // Control para evitar múltiples movimientos rápidos
let moveDelay = 100; // Retardo entre movimientos en ms
let backgrounds = []; // Array para almacenar los fondos
let currentBackground = 0; // Índice del fondo actual
let gameStarted = false; // Control para saber si el juego ha comenzado
let graphics; // Gráficos para dibujar el tablero y las piezas
let nextPieceGraphics; // Gráficos para dibujar la próxima pieza
let startText; // Texto de inicio del juego
let gameOverText; // Texto de fin de juego
let spaceKey; // Tecla espacio
let audioEnabled = false; // Desactivar sonido hasta tener archivos válidos

// Definiciones de Tetriminos (piezas)
const TETRIMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: 0x00ffff
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 0x0000ff
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 0xff8000
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 0xffff00
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 0x00ff00
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 0x9900ff
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 0xff0000
    }
};

// Nombres de las piezas para selección aleatoria
const pieceNames = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

// Escena de carga inicial
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Mostrar texto de carga con estilo retro
        const loadingText = this.add.text(config.width/2, config.height/2, 'CARGANDO...', {
            fontFamily: 'Press Start 2P, Arial Black',
            fontSize: '32px',
            fill: '#00ff00',
            align: 'center',
            stroke: '#003300',
            strokeThickness: 6
        });
        loadingText.setOrigin(0.5);

        // Efecto de parpadeo en el texto de carga
        this.tweens.add({
            targets: loadingText,
            alpha: 0.5,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
        
        // Cargar logo
        this.load.image('logo', 'assets/images/logo.png');
        
        // Cargar fondos intergalácticos
        this.load.image('bg1', 'https://labs.phaser.io/assets/skies/space1.png');
        this.load.image('bg2', 'https://labs.phaser.io/assets/skies/space2.png');
        this.load.image('bg3', 'https://labs.phaser.io/assets/skies/space3.png');
        
        // Cargar sonidos
        this.load.audio('menu_switch', 'assets/audio/menu_switch.mp3');
        this.load.audio('move', 'assets/audio/key.wav');
        this.load.audio('rotate', 'assets/audio/lazer.wav');
        this.load.audio('line', 'assets/audio/shot1.wav');
        this.load.audio('gameover', 'assets/audio/squit.wav');
        this.load.audio('music', 'assets/audio/neriakX_-_Enigma_Gun_Extended_Mix.mp3');
        this.load.audio('gameoverMusic', 'assets/audio/sd-ingame1.wav');
        
        // Cargar imagen de Game Over
        this.load.image('gameover', 'assets/images/Gameover.png');
    }

    create() {
        // Iniciar música de fondo aquí para que esté disponible en todas las escenas
        this.music = this.sound.add('music', { loop: true, volume: 0.5 });
        this.gameoverMusic = this.sound.add('gameoverMusic', { loop: true, volume: 0.5 });
        this.music.play();
        
        this.scene.start('MenuScene', { 
            music: this.music,
            gameoverMusic: this.gameoverMusic 
        });
    }
}

// Escena del menú principal
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(data) {
        // Mantener referencia a la música
        this.music = data.music;
        
        // Añadir fondo con efecto de scanlines
        const bg = this.add.image(config.width/2, config.height/2, 'bg1');
        
        // Efecto de scanlines
        const scanlines = this.add.graphics();
        scanlines.lineStyle(1, 0x000000, 0.3);
        for (let y = 0; y < config.height; y += 2) {
            scanlines.moveTo(0, y);
            scanlines.lineTo(config.width, y);
        }
        scanlines.strokePath();
        
        // Añadir logo con efecto de brillo
        const logo = this.add.image(config.width/2, config.height/3, 'logo');
        logo.setScale(0.5);
        
        // Efecto de brillo en el logo
        this.tweens.add({
            targets: logo,
            scaleX: 0.55,
            scaleY: 0.55,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Texto de inicio con estilo más retro
        const startText = this.add.text(config.width/2, config.height * 0.7, 
            'PRESIONA ESPACIO\nPARA COMENZAR', {
            fontFamily: 'Press Start 2P, Arial Black',
            fontSize: '24px',
            fill: '#00ff00',
            align: 'center',
            stroke: '#003300',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                fill: true
            }
        });
        startText.setOrigin(0.5);
        
        // Efecto de parpadeo mejorado
        this.tweens.add({
            targets: startText,
            alpha: 0.5,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
        
        // Control de tecla espacio
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.play('menu_switch');
            this.scene.start('GameScene', { music: this.music });
        });
    }
}

// Escena del juego
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        // Inicializar sonidos con objetos dummy por defecto
        this.sounds = {
            move: { play: () => {} },
            rotate: { play: () => {} },
            drop: { play: () => {} },
            line: { play: () => {} },
            gameOver: { play: () => {} }
        };
    }

    create(data) {
        // Reiniciar variables del juego
        score = 0;
        level = 1;
        fallTime = 1000;
        gameOver = false;
        gameStarted = false;
        canMove = true;
        
        // Configuración del juego al inicio
        cursors = this.input.keyboard.createCursorKeys();
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Mantener la referencia a la música
        this.music = data.music;
        this.gameoverMusic = data.gameoverMusic;
        
        // Limpiar el tablero
        createBoard();
        
        // Añadir los fondos
        backgrounds = [
            this.add.image(config.width/2, config.height/2, 'bg1'),
            this.add.image(config.width/2, config.height/2, 'bg2'),
            this.add.image(config.width/2, config.height/2, 'bg3')
        ];
        
        // Ocultar todos los fondos excepto el primero
        backgrounds.forEach((bg, index) => {
            bg.setVisible(index === currentBackground);
        });
        
        // Crear gráficos para el tablero y la próxima pieza
        graphics = this.add.graphics();
        nextPieceGraphics = this.add.graphics();
        
        // Dibujar el tablero inicial
        drawBoard();
        
        // Agregar efecto de scanlines
        const scanlines = this.add.graphics();
        scanlines.lineStyle(1, 0x000000, 0.3);
        for (let y = 0; y < config.height; y += 2) {
            scanlines.moveTo(0, y);
            scanlines.lineTo(config.width, y);
        }
        scanlines.strokePath();
        
        // Agregar texto para puntuación con estilo más retro
        scoreText = this.add.text(20, 20, 'PUNTUACIÓN: 0', { 
            fontFamily: 'Press Start 2P, Arial Black', 
            fontSize: '20px', 
            fill: '#00ff00',
            stroke: '#003300',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                fill: true
            }
        });
        
        // Agregar texto para nivel con estilo más retro
        levelText = this.add.text(20, 60, 'NIVEL: 1', { 
            fontFamily: 'Press Start 2P, Arial Black', 
            fontSize: '20px', 
            fill: '#00ff00',
            stroke: '#003300',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                fill: true
            }
        });
        
        // Texto para "Siguiente pieza" con estilo más retro
        this.add.text(config.width - 200, 20, 'SIGUIENTE:', { 
            fontFamily: 'Press Start 2P, Arial Black', 
            fontSize: '20px', 
            fill: '#00ff00',
            stroke: '#003300',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                fill: true
            }
        });
        
        // Texto de Game Over (inicialmente oculto)
        gameOverText = this.add.text(config.width / 2, config.height / 2, 'GAME OVER\n\nPuntuación: 0\n\nPresiona ESPACIO\npara reiniciar', {
            fontFamily: 'Press Start 2P, Arial Black',
            fontSize: '32px',
            fill: '#ff0000',
            align: 'center',
            stroke: '#550000',
            strokeThickness: 6,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 5,
                fill: true
            }
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setVisible(false);
        
        // Configurar sonidos de manera segura
        try {
            this.sounds = {
                move: this.sound.add('move', { volume: 0.5 }),
                rotate: this.sound.add('rotate', { volume: 0.5 }),
                drop: this.sound.add('line', { volume: 0.5 }),
                line: this.sound.add('line', { volume: 0.5 }),
                gameOver: this.sound.add('gameover', { volume: 0.5 })
            };
        } catch (error) {
            console.warn('No se pudieron cargar algunos sonidos, usando objetos dummy');
        }
        
        // Seleccionar piezas aleatorias para comenzar
        nextPiece = getRandomPiece();
        
        // Eliminar eventos de teclado anteriores si existen
        this.input.keyboard.removeAllListeners();
        
        // Control de teclas con manejo seguro de sonidos
        this.input.keyboard.on('keydown', (event) => {
            if (gameStarted && !gameOver) {
                if (canMove) {
                    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) {
                        if (movePiece(-1, 0)) {
                            this.sounds.move?.play?.();
                        }
                    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
                        if (movePiece(1, 0)) {
                            this.sounds.move?.play?.();
                        }
                    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) {
                        if (movePiece(0, 1)) {
                            score += 1;
                            updateScore();
                        }
                    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) {
                        if (rotatePiece()) {
                            this.sounds.rotate?.play?.();
                        }
                    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
                        hardDrop(this);
                    }
                    
                    canMove = false;
                    this.time.delayedCall(moveDelay, () => {
                        canMove = true;
                    });
                }
            }
        });
        
        // Iniciar el juego automáticamente
        startGame(this);
    }
}

// Escena de Game Over
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        // Pausar la música principal y reproducir la música de game over
        if (data.music && data.music.isPlaying) {
            data.music.pause();
        }
        if (data.gameoverMusic && !data.gameoverMusic.isPlaying) {
            data.gameoverMusic.play();
        }

        // Añadir fondo oscurecido con efecto CRT
        const bg = this.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.85);
        bg.setOrigin(0);
        
        // Efecto de scanlines más pronunciado
        const scanlines = this.add.graphics();
        scanlines.lineStyle(1, 0xffffff, 0.1);
        for (let y = 0; y < config.height; y += 2) {
            scanlines.moveTo(0, y);
            scanlines.lineTo(config.width, y);
        }
        scanlines.strokePath();
        
        // Añadir imagen de Game Over con efecto de glitch
        const gameOverImg = this.add.image(config.width/2, config.height/3, 'gameover');
        gameOverImg.setScale(0.8);
        
        // Efecto de glitch en la imagen
        this.tweens.add({
            targets: gameOverImg,
            scaleX: '+=0.02',
            scaleY: '+=0.02',
            duration: 100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Efecto de distorsión cromática
        const gameOverImgRed = this.add.image(config.width/2 + 2, config.height/3, 'gameover');
        const gameOverImgBlue = this.add.image(config.width/2 - 2, config.height/3, 'gameover');
        gameOverImgRed.setScale(0.8).setTint(0xff0000).setAlpha(0.5);
        gameOverImgBlue.setScale(0.8).setTint(0x0000ff).setAlpha(0.5);
        
        // Mostrar puntuación con estilo retro mejorado
        const scoreText = this.add.text(config.width/2, config.height/2 + 50, 
            `PUNTUACIÓN FINAL\n${data.score}`, {
            fontFamily: 'Press Start 2P, Arial Black',
            fontSize: '32px',
            fill: '#00ff00',
            align: 'center',
            stroke: '#003300',
            strokeThickness: 8,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 4,
                fill: true
            }
        });
        scoreText.setOrigin(0.5);
        
        // Efecto de brillo en la puntuación
        this.tweens.add({
            targets: scoreText,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Texto para reiniciar con efecto neón
        const restartText = this.add.text(config.width/2, config.height * 0.75, 
            'PRESIONA ESPACIO\nPARA REINICIAR', {
            fontFamily: 'Press Start 2P, Arial Black',
            fontSize: '24px',
            fill: '#ff00ff',
            align: 'center',
            stroke: '#550055',
            strokeThickness: 8,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#ff00ff',
                blur: 16,
                fill: true
            }
        });
        restartText.setOrigin(0.5);
        
        // Efecto de parpadeo neón mejorado
        this.tweens.add({
            targets: restartText,
            alpha: 0.5,
            duration: 750,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
        
        // Efecto de ruido estático en el fondo
        const noise = this.add.rectangle(0, 0, config.width, config.height, 0xffffff, 0.02);
        noise.setOrigin(0);
        this.tweens.add({
            targets: noise,
            alpha: 0,
            duration: 100,
            yoyo: true,
            repeat: -1,
            ease: 'Power0'
        });
        
        // Modificar el control de tecla espacio para gestionar la música
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.play('menu_switch');
            // Detener la música de game over y reanudar la música principal
            if (data.gameoverMusic && data.gameoverMusic.isPlaying) {
                data.gameoverMusic.stop();
            }
            if (data.music) {
                data.music.play();
            }
            this.scene.start('GameScene', { 
                music: data.music,
                gameoverMusic: data.gameoverMusic 
            });
        });
    }
}

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 800,
    backgroundColor: '#000000',
    parent: 'game-container',
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Iniciar el juego
window.onload = function() {
    game = new Phaser.Game(config);
}

// Funciones auxiliares

function createBoard() {
    // Crear la matriz del tablero (inicialmente vacía)
    board = [];
    for (let y = 0; y < boardHeight; y++) {
        board[y] = [];
        for (let x = 0; x < boardWidth; x++) {
            board[y][x] = 0; // 0 significa celda vacía
        }
    }
}

function drawBoard() {
    // Limpiar gráficos anteriores
    graphics.clear();
    
    // Dibujar grid del tablero
    graphics.lineStyle(1, 0x333333, 0.8);
    
    const offsetX = (config.width - boardWidth * gridSize) / 2;
    const offsetY = (config.height - boardHeight * gridSize) / 2;
    
    // Dibujar líneas horizontales
    for (let y = 0; y <= boardHeight; y++) {
        graphics.moveTo(offsetX, offsetY + y * gridSize);
        graphics.lineTo(offsetX + boardWidth * gridSize, offsetY + y * gridSize);
    }
    
    // Dibujar líneas verticales
    for (let x = 0; x <= boardWidth; x++) {
        graphics.moveTo(offsetX + x * gridSize, offsetY);
        graphics.lineTo(offsetX + x * gridSize, offsetY + boardHeight * gridSize);
    }
    
    graphics.strokePath();
    
    // Dibujar bloques en el tablero
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            if (board[y][x] !== 0) {
                // Dibujar bloques fijos con el color correspondiente
                graphics.fillStyle(board[y][x], 1);
                graphics.fillRect(
                    offsetX + x * gridSize + 1,
                    offsetY + y * gridSize + 1,
                    gridSize - 2,
                    gridSize - 2
                );
            }
        }
    }
    
    // Dibujar la pieza actual si el juego ha comenzado
    if (gameStarted && !gameOver && currentPiece) {
        graphics.fillStyle(currentPiece.color, 1);
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x] !== 0) {
                    graphics.fillRect(
                        offsetX + (currentPiecePosition.x + x) * gridSize + 1,
                        offsetY + (currentPiecePosition.y + y) * gridSize + 1,
                        gridSize - 2,
                        gridSize - 2
                    );
                }
            }
        }
    }
}

function drawNextPiece() {
    // Limpiar gráficos anteriores
    nextPieceGraphics.clear();
    
    // Coordenadas para mostrar la siguiente pieza
    const nextPieceX = config.width - 150;
    const nextPieceY = 80;
    
    // Dibujar la próxima pieza
    nextPieceGraphics.fillStyle(nextPiece.color, 1);
    
    for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
            if (nextPiece.shape[y][x] !== 0) {
                nextPieceGraphics.fillRect(
                    nextPieceX + x * 30,
                    nextPieceY + y * 30,
                    28,
                    28
                );
            }
        }
    }
}

function getRandomPiece() {
    // Seleccionar una pieza aleatoria
    const randomIndex = Math.floor(Math.random() * pieceNames.length);
    const pieceName = pieceNames[randomIndex];
    return TETRIMINOS[pieceName];
}

function startGame(scene) {
    // Iniciar el juego
    gameStarted = true;
    gameOver = false;
    
    // Seleccionar la primera pieza
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    
    // Dibujar la próxima pieza
    drawNextPiece();
    
    // Posicionar la pieza actual en la parte superior central
    currentPiecePosition = {
        x: Math.floor(boardWidth / 2) - Math.floor(currentPiece.shape[0].length / 2),
        y: 0
    };
    
    // Comprobar si la pieza puede aparecer
    if (!isValidMove(0, 0)) {
        // Game over si no hay espacio para la primera pieza
        endGame(scene);
        return;
    }
    
    // Iniciar la caída automática
    startFallTimer(scene);
}

function startFallTimer(scene) {
    // Detener el temporizador anterior si existe
    if (fallTimer) {
        fallTimer.remove();
    }
    
    // Crear un nuevo temporizador para la caída automática
    fallTimer = scene.time.addEvent({
        delay: fallTime,
        callback: function() {
            if (!movePiece(0, 1)) {
                // Si la pieza no puede moverse hacia abajo, se fija en el tablero
                placePiece();
                
                // Comprobar líneas completas
                const linesCleared = checkLines(scene);
                
                // Actualizar puntuación
                if (linesCleared > 0) {
                    // Puntuación basada en número de líneas
                    const points = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4 líneas
                    score += points[linesCleared] * level;
                    
                    // Efecto de sonido
                    if (linesCleared === 4) {
                        scene.sounds.drop.play();
                    } else {
                        scene.sounds.line.play();
                    }
                    
                    // Comprobar si sube de nivel
                    checkLevelUp();
                }
                
                updateScore();
                
                // Generar nueva pieza
                getNextPiece();
                
                // Comprobar si la nueva pieza puede aparecer
                if (!isValidMove(0, 0)) {
                    // Game over si no hay espacio para la nueva pieza
                    endGame(scene);
                    return;
                }
            }
            
            // Actualizar el tablero
            drawBoard();
        },
        callbackScope: scene,
        loop: true
    });
}

function movePiece(dx, dy) {
    // Comprobar si el movimiento es válido
    if (isValidMove(dx, dy)) {
        // Actualizar posición
        currentPiecePosition.x += dx;
        currentPiecePosition.y += dy;
        
        // Redibujar el tablero
        drawBoard();
        return true;
    }
    return false;
}

function isValidMove(dx, dy) {
    // Comprobar colisiones con bordes y otras piezas
    const newX = currentPiecePosition.x + dx;
    const newY = currentPiecePosition.y + dy;
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] !== 0) {
                const boardX = newX + x;
                const boardY = newY + y;
                
                // Comprobar límites del tablero
                if (boardX < 0 || boardX >= boardWidth || boardY >= boardHeight) {
                    return false;
                }
                
                // Comprobar colisión con piezas existentes
                if (boardY >= 0 && board[boardY][boardX] !== 0) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

function rotatePiece() {
    // Guardar la forma actual para restaurarla si la rotación no es válida
    const originalShape = JSON.parse(JSON.stringify(currentPiece.shape));
    
    // Crear una nueva matriz para la forma rotada
    const rotated = [];
    const n = originalShape.length;
    
    // Para una matriz NxN, transponer y luego invertir filas
    for (let i = 0; i < n; i++) {
        rotated[i] = [];
        for (let j = 0; j < n; j++) {
            rotated[i][j] = originalShape[n - j - 1][i];
        }
    }
    
    // Aplicar la rotación temporalmente
    currentPiece.shape = rotated;
    
    // Comprobar si la rotación es válida
    if (!isValidMove(0, 0)) {
        // Restaurar la forma original si no es válida
        currentPiece.shape = originalShape;
        return false;
    }
    
    // Redibujar el tablero con la pieza rotada
    drawBoard();
    return true;
}

function hardDrop(scene) {
    let dropDistance = 0;
    while (isValidMove(0, 1)) {
        currentPiecePosition.y++;
        dropDistance++;
    }
    
    score += dropDistance * 2;
    updateScore();
    
    placePiece();
    
    const linesCleared = checkLines(scene);
    
    if (linesCleared > 0) {
        const points = [0, 40, 100, 300, 1200];
        score += points[linesCleared] * level;
        
        try {
            if (linesCleared === 4) {
                scene.sounds.drop?.play?.();
            } else {
                scene.sounds.line?.play?.();
            }
        } catch (error) {
            console.warn('Error reproduciendo sonido');
        }
        
        checkLevelUp();
    }
    
    updateScore();
    getNextPiece();
    
    if (!isValidMove(0, 0)) {
        endGame(scene);
        return;
    }
    
    drawBoard();
}

function placePiece() {
    // Fijar la pieza actual en el tablero
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] !== 0) {
                const boardX = currentPiecePosition.x + x;
                const boardY = currentPiecePosition.y + y;
                
                // Solo colocar si está dentro del tablero
                if (boardY >= 0 && boardY < boardHeight && boardX >= 0 && boardX < boardWidth) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        }
    }
}

function getNextPiece() {
    // Pasar a la siguiente pieza
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    
    // Posicionar la nueva pieza en la parte superior central
    currentPiecePosition = {
        x: Math.floor(boardWidth / 2) - Math.floor(currentPiece.shape[0].length / 2),
        y: 0
    };
    
    // Dibujar la próxima pieza
    drawNextPiece();
}

function checkLines(scene) {
    // Comprobar líneas completas y eliminarlas
    let linesCleared = 0;
    
    for (let y = boardHeight - 1; y >= 0; y--) {
        let lineComplete = true;
        
        // Comprobar si la línea está completa
        for (let x = 0; x < boardWidth; x++) {
            if (board[y][x] === 0) {
                lineComplete = false;
                break;
            }
        }
        
        if (lineComplete) {
            // Efecto de parpadeo antes de eliminar la línea
            animateLine(y, scene);
            
            // Eliminar la línea
            for (let y2 = y; y2 > 0; y2--) {
                for (let x = 0; x < boardWidth; x++) {
                    board[y2][x] = board[y2-1][x];
                }
            }
            
            // Limpiar la línea superior
            for (let x = 0; x < boardWidth; x++) {
                board[0][x] = 0;
            }
            
            // Incrementar contador de líneas y comprobar de nuevo la misma posición
            linesCleared++;
            y++; // Compensar el decremento del bucle
        }
    }
    
    return linesCleared;
}

function animateLine(lineY, scene) {
    // Animación simple para la línea eliminada
    const offsetX = (config.width - boardWidth * gridSize) / 2;
    const offsetY = (config.height - boardHeight * gridSize) / 2;
    
    // Crear un rectángulo para la animación
    const flashRect = scene.add.rectangle(
        offsetX + boardWidth * gridSize / 2,
        offsetY + lineY * gridSize + gridSize / 2,
        boardWidth * gridSize,
        gridSize,
        0xffffff
    );
    
    // Animación de parpadeo
    scene.tweens.add({
        targets: flashRect,
        alpha: 0,
        duration: 300,
        yoyo: true,
        repeat: 1,
        onComplete: function() {
            flashRect.destroy();
        }
    });
}

function updateScore() {
    // Actualizar textos de puntuación y nivel
    scoreText.setText('PUNTUACIÓN: ' + score);
    levelText.setText('NIVEL: ' + level);
}

function checkLevelUp() {
    // Subir de nivel cada 10 líneas (aproximadamente)
    const newLevel = Math.floor(score / 1000) + 1;
    
    if (newLevel > level) {
        level = newLevel;
        
        // Aumentar velocidad (reducir tiempo de caída)
        fallTime = Math.max(100, 1000 - (level - 1) * 100);
        
        // Actualizar el temporizador con la nueva velocidad
        const scene = game.scene.scenes[0];
        startFallTimer(scene);
        
        // Cambiar el fondo al subir de nivel
        changeBackground();
    }
}

function changeBackground() {
    // Ocultar fondo actual
    backgrounds[currentBackground].setVisible(false);
    
    // Cambiar al siguiente fondo
    currentBackground = (currentBackground + 1) % backgrounds.length;
    
    // Mostrar nuevo fondo
    backgrounds[currentBackground].setVisible(true);
}

function endGame(scene) {
    // Finalizar el juego
    gameOver = true;
    
    // Detener el temporizador de caída
    if (fallTimer) {
        fallTimer.remove();
        fallTimer = null;
    }
    
    // Navegar a la escena de Game Over
    scene.scene.start('GameOverScene', { 
        score: score,
        music: scene.music,
        gameoverMusic: scene.gameoverMusic
    });
}

function restartGame(scene) {
    // Reiniciar el juego iniciando una nueva escena de juego
    scene.scene.start('GameScene', { music: scene.music });
}
