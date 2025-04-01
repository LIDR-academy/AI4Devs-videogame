// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales
const game = new Phaser.Game(config);
let mainCamera;
let player;
let cursors;
let pacmans;
let isAttacking = false;
let attackTimer = 0;
const ATTACK_DURATION = 150;
let attackKey;
let attackGraphics;
let lastDirection = 'right';
let lastHorizontalDirection = 'right';
let score = 0;
let scoreText;
let pacmansToKill = 10;
let pacmansLeftText;
let currentLevel = 1;
let levelText;
let simultaneousPacmans = 3;
let playerLives = 3;
let livesText;
let livesContainer;
let isGameOver = false;
let isGameStarted = false;
let isPaused = false;
let escKey;
let pauseDialog;

// Funciones principales del juego
function preload() {
    // Cargar el fondo local
    this.load.image('background', 'assets/img/imbackground.png');
    
    // Cargar el sprite dude
    this.load.spritesheet('dude', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });

    // Cargar el sprite de pacman
    this.load.spritesheet('pacman', 'https://labs.phaser.io/assets/sprites/pacman_by_oz_28x28.png', {
        frameWidth: 28,
        frameHeight: 28
    });
}

function create() {
    if (!isGameStarted) {
        createStartScreen.call(this);
    } else {
        setupWorld.call(this);
        setupPlayer.call(this);
        setupCamera.call(this);
        setupAnimations.call(this);
        setupPacmans.call(this);
        setupUI.call(this);
        setupCollisions.call(this);
    }
}

function createStartScreen() {
    // Crear fondo
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setScale(1.5);

    // Título del juego
    const titleStyle = {
        fontSize: '72px',
        fontFamily: 'Arial Black',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 8,
        shadow: {
            offsetX: 4,
            offsetY: 4,
            color: '#000000',
            blur: 8,
            fill: true
        }
    };

    const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3, 'MATA PACMAN', titleStyle);
    title.setOrigin(0.5);

    // Instrucciones
    const instructionsStyle = {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    };

    const instructions = [
        '¡Usa las flechas para moverte!',
        '¡Presiona ESPACIO para atacar!',
        '¡Evita a los Pacmans!',
        '¡Sobrevive el mayor tiempo posible!'
    ];

    instructions.forEach((text, index) => {
        const instructionText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + (index * 40),
            text,
            instructionsStyle
        );
        instructionText.setOrigin(0.5);
    });

    // Botón de inicio
    const startButtonStyle = {
        fontSize: '32px',
        fontFamily: 'Arial Black',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        shadow: {
            offsetX: 3,
            offsetY: 3,
            color: '#000000',
            blur: 5,
            fill: true
        }
    };

    const startButton = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height * 0.8,
        'Presiona ESPACIO para comenzar',
        startButtonStyle
    );
    startButton.setOrigin(0.5);

    // Efecto de parpadeo del botón
    this.tweens.add({
        targets: startButton,
        alpha: 0.5,
        duration: 1000,
        yoyo: true,
        repeat: -1
    });

    // Esperar a que se presione la barra espaciadora
    this.input.keyboard.once('keydown-SPACE', () => {
        // Limpiar la pantalla de inicio
        this.children.removeAll();
        // Iniciar el juego
        isGameStarted = true;
        create.call(this);
    });
}

function update(time) {
    if (!isGameStarted || isGameOver) return;
    
    handlePause.call(this);
    
    if (isPaused) return; // Si el juego está pausado, no ejecutar nada más
    
    handlePlayerMovement.call(this);
    handlePacmanMovement.call(this);
    handleAttack.call(this);
    updateUI.call(this);
}

// Funciones de configuración
function setupWorld() {
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setScale(1.5);
    
    const worldWidth = background.width * background.scale;
    const worldHeight = background.height * background.scale;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
}

function setupPlayer() {
    const worldHeight = this.physics.world.bounds.height;
    player = this.physics.add.sprite(150, worldHeight/2, 'dude');
    player.setCollideWorldBounds(true);
    player.setScale(2.5);
    player.lastDirection = 'right';
    player.lastHorizontalDirection = 'right';
    player.body.setSize(20, 30, true);
    player.body.setOffset(6, 9);
}

function setupCamera() {
    mainCamera = this.cameras.main;
    mainCamera.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    mainCamera.startFollow(player, true, 0.1, 0.1);
    mainCamera.setViewport(0, 0, 1024, 768);
    mainCamera.setZoom(1);
}

function setupAnimations() {
    // Animaciones del jugador
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn-left',
        frames: [{ key: 'dude', frame: 0 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'turn-right',
        frames: [{ key: 'dude', frame: 5 }],
        frameRate: 20
    });

    // Animaciones de Pacman
    this.anims.create({
        key: 'pacman-chomp',
        frames: this.anims.generateFrameNumbers('pacman', { frames: [0, 1, 2, 1] }),
        frameRate: 8,
        repeat: -1
    });
}

function setupPacmans() {
    pacmans = this.physics.add.group({
        collideWorldBounds: true,
        bounceX: 0,
        bounceY: 0
    });

    for (let i = 0; i < simultaneousPacmans; i++) {
        createNewPacman(this);
    }
}

function setupUI() {
    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    attackGraphics = this.add.graphics();
    cursors = this.input.keyboard.createCursorKeys();

    const scoreStyle = {
        fontSize: '32px',
        fontFamily: 'Arial Black, sans-serif',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        shadow: {
            offsetX: 3,
            offsetY: 3,
            color: '#000000',
            blur: 5,
            fill: true
        }
    };

    const scoreBg = this.add.graphics();
    scoreBg.setScrollFactor(0);
    scoreBg.fillStyle(0x000000, 0.7);
    scoreBg.fillRect(0, this.cameras.main.height - 60, this.cameras.main.width, 50);

    scoreText = this.add.text(25, this.cameras.main.height - 50, 'Puntuación: ' + score, scoreStyle);
    scoreText.setScrollFactor(0);

    levelText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'NIVEL ' + currentLevel, scoreStyle);
    levelText.setOrigin(0.5, 0);
    levelText.setScrollFactor(0);

    const pacmanIcon = this.add.sprite(this.cameras.main.width - 200, this.cameras.main.height - 35, 'pacman');
    pacmanIcon.setScrollFactor(0);
    pacmanIcon.setScale(1.5);
    pacmanIcon.play('pacman-chomp');

    pacmansLeftText = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 50, 'x ' + pacmansToKill, scoreStyle);
    pacmansLeftText.setScrollFactor(0);

    livesContainer = this.add.container(this.cameras.main.width - 150, 30);
    livesContainer.setScrollFactor(0);

    livesText = this.add.text(0, 0, 'Vidas: ' + playerLives, scoreStyle);
    livesContainer.add(livesText);
}

function setupCollisions() {
    this.physics.add.overlap(player, pacmans, (player, pacman) => {
        const distance = Phaser.Math.Distance.Between(
            player.x, 
            player.y,
            pacman.x,
            pacman.y
        );
        
        if (distance < 80) {
            handlePacmanCollision(this, player, pacman);
        }
    }, null, this);
}

// Funciones de manejo de eventos
function handlePlayerMovement() {
    const PLAYER_SPEED = 200;
    player.setVelocity(0);

    let moveX = 0;
    let moveY = 0;

    if (cursors.left.isDown) moveX = -1;
    else if (cursors.right.isDown) moveX = 1;
    if (cursors.up.isDown) moveY = -1;
    else if (cursors.down.isDown) moveY = 1;

    if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.707;
        moveY *= 0.707;
    }

    updatePlayerAnimation(moveX, moveY);
    player.setVelocityX(moveX * PLAYER_SPEED);
    player.setVelocityY(moveY * PLAYER_SPEED);
}

function handlePacmanMovement() {
    if (isPaused) return; // No mover los pacmans si el juego está pausado
    
    const PACMAN_SPEED = 150;
    
    pacmans.children.iterate(function (pacman) {
        if (pacman && pacman.active) {
            const angle = Phaser.Math.Angle.Between(pacman.x, pacman.y, player.x, player.y);
            
            pacman.setVelocityX(Math.cos(angle) * PACMAN_SPEED);
            pacman.setVelocityY(Math.sin(angle) * PACMAN_SPEED);

            updatePacmanRotation(pacman, angle);

            if (Math.random() < 0.02) {
                pacman.setVelocityX(pacman.body.velocity.x + Phaser.Math.Between(-30, 30));
                pacman.setVelocityY(pacman.body.velocity.y + Phaser.Math.Between(-30, 30));
            }
        }
    });
}

function handleAttack() {
    if (isAttacking) {
        attackTimer += this.game.loop.delta;
        drawAttackEffect(this, player.lastDirection);
        
        if (attackTimer >= ATTACK_DURATION) {
            isAttacking = false;
            attackTimer = 0;
            attackGraphics.clear();
        }
    }

    if (Phaser.Input.Keyboard.JustDown(attackKey) && !isAttacking && !isGameOver) {
        performAttack(this);
    }
}

// Funciones de utilidad
function updateUI() {
    scoreText.setPosition(25, this.cameras.main.height - 50);
    levelText.setPosition(this.cameras.main.width / 2, this.cameras.main.height - 50);
    pacmansLeftText.setPosition(this.cameras.main.width - 150, this.cameras.main.height - 50);
    livesContainer.setPosition(this.cameras.main.width - 150, 30);
}

function updatePlayerAnimation(moveX, moveY) {
    if (moveX !== 0 || moveY !== 0) {
        if (moveX < 0) {
            player.lastDirection = 'left';
            player.anims.play('left', true);
        } else if (moveX > 0) {
            player.lastDirection = 'right';
            player.anims.play('right', true);
        } else if (moveY !== 0) {
            player.lastDirection = moveY < 0 ? 'up' : 'down';
            player.anims.play(player.lastHorizontalDirection === 'left' ? 'left' : 'right', true);
        }

        if (moveX !== 0) {
            player.lastHorizontalDirection = moveX < 0 ? 'left' : 'right';
        }
    } else {
        player.anims.play('turn-' + player.lastHorizontalDirection, true);
    }
}

function updatePacmanRotation(pacman, angle) {
    let degrees = Phaser.Math.RadToDeg(angle);
    degrees = ((degrees % 360) + 360) % 360;
    
    if (degrees > 90 && degrees < 270) {
        pacman.scaleY = -3;
    } else {
        pacman.scaleY = 3;
    }
    
    pacman.angle = degrees;
    
    if (!pacman.anims.isPlaying) {
        pacman.play('pacman-chomp');
    }
}

// Funciones de ataque y colisión
function performAttack(scene) {
    // Solo bloquear ataques si el jugador está invisible
    if (player.alpha === 0) {
        return;
    }

    isAttacking = true;
    attackTimer = 0;
    
    pacmans.children.iterate(function (pacman) {
        if (pacman && pacman.active) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, pacman.x, pacman.y);
            
            let hitArea = {x: player.x, y: player.y + 15, width: 0, height: 0};
            const attackLength = 130;
            const hitWidth = 100;
            
            switch(player.lastDirection) {
                case 'left':
                    hitArea.width = attackLength;
                    hitArea.height = hitWidth;
                    hitArea.x -= attackLength;
                    hitArea.y -= hitWidth/2;
                    break;
                case 'right':
                    hitArea.width = attackLength;
                    hitArea.height = hitWidth;
                    hitArea.y -= hitWidth/2;
                    break;
                case 'up':
                    hitArea.width = hitWidth;
                    hitArea.height = attackLength;
                    hitArea.x -= hitWidth/2;
                    hitArea.y -= attackLength;
                    break;
                case 'down':
                    hitArea.width = hitWidth;
                    hitArea.height = attackLength;
                    hitArea.x -= hitWidth/2;
                    break;
            }
            
            if (pacman.x >= hitArea.x && pacman.x <= hitArea.x + hitArea.width &&
                pacman.y >= hitArea.y && pacman.y <= hitArea.y + hitArea.height) {
                killPacman(scene, pacman);
            }
        }
    });
}

function drawAttackEffect(scene, direction) {
    attackGraphics.clear();
    
    const progress = Math.min(attackTimer / ATTACK_DURATION, 1);
    
    // La opacidad disminuye con el progreso del ataque
    const opacity = 0.8 * (1 - progress);
    
    // Configurar el estilo de la línea con opacidad variable
    attackGraphics.lineStyle(8, 0xFFFFFF, opacity);
    
    // Ajustar el punto de inicio según la dirección
    let startX = player.x;
    let startY = player.y;
    let endX = startX;
    let endY = startY;
    const attackLength = 100;

    // Determinar los puntos de inicio y fin según la dirección
    switch(direction) {
        case 'left':
            startY = player.y + 15;
            endX = startX - attackLength;
            endY = startY;
            break;
        case 'right':
            startY = player.y + 15;
            endX = startX + attackLength;
            endY = startY;
            break;
        case 'up':
            startY = player.y - 15; // Ajustado para que empiece desde arriba
            endY = startY - attackLength;
            break;
        case 'down':
            startY = player.y + 15;
            endY = startY + attackLength;
            break;
    }

    // Dibujar la línea
    attackGraphics.beginPath();
    attackGraphics.moveTo(startX, startY);
    attackGraphics.lineTo(endX, endY);
    attackGraphics.strokePath();
}

function getAttackDirection(direction) {
    switch (direction) {
        case 'left': return Math.PI;
        case 'right': return 0;
        case 'up': return -Math.PI / 2;
        case 'down': return Math.PI / 2;
        default: return 0;
    }
}

function createNewPacman(scene) {
    // Si ya hay suficientes pacmans en pantalla, no crear más
    if (pacmans.countActive() >= simultaneousPacmans) {
        return;
    }

    // Calcular una posición aleatoria en los bordes del mundo
    let x, y;
    const worldBounds = scene.physics.world.bounds;
    
    // Decidir aleatoriamente desde qué borde aparecerá
    const side = Phaser.Math.Between(0, 3);
    
    switch(side) {
        case 0: // Arriba
            x = Phaser.Math.Between(0, worldBounds.width);
            y = 0;
            break;
        case 1: // Derecha
            x = worldBounds.width;
            y = Phaser.Math.Between(0, worldBounds.height);
            break;
        case 2: // Abajo
            x = Phaser.Math.Between(0, worldBounds.width);
            y = worldBounds.height;
            break;
        case 3: // Izquierda
            x = 0;
            y = Phaser.Math.Between(0, worldBounds.height);
            break;
    }

    // Crear el nuevo pacman
    const pacman = pacmans.create(x, y, 'pacman');
    pacman.setCollideWorldBounds(true);
    pacman.setScale(3);
    pacman.setOrigin(0.5, 0.5);
    pacman.body.setSize(50, 50, true);
    pacman.body.setOffset(-10, -10);
    pacman.play('pacman-chomp');
}

function killPacman(scene, pacman) {
    if (!pacman.isBeingKilled) {
        pacman.isBeingKilled = true;
        
        // Aumentar la puntuación y reducir contador
        score += 100;
        pacmansToKill--;
        
        scoreText.setText('Puntuación: ' + score);
        pacmansLeftText.setText('x ' + pacmansToKill);
        
        // Efecto visual de puntos
        const pointsText = scene.add.text(pacman.x, pacman.y - 20, '+100', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        });
        
        // Animación de los puntos flotando
        scene.tweens.add({
            targets: pointsText,
            y: pointsText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => pointsText.destroy()
        });

        // Detener el movimiento del pacman
        pacman.setVelocity(0, 0);
        pacman.anims.stop();
        
        // Cambiar el color a rojo
        pacman.setTint(0xff0000);
        
        // Primera fase: cambio de color y pequeña pausa
        scene.tweens.add({
            targets: pacman,
            scale: 4,
            duration: 100,
            onComplete: () => {
                // Segunda fase: efecto de explosión de burbuja
                scene.tweens.add({
                    targets: pacman,
                    scale: 6,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        pacman.destroy();
                        
                        // Comprobar si se ha completado el nivel después de la animación
                        if (pacmansToKill <= 0) {
                            scene.time.delayedCall(500, () => {
                                levelUp(scene);
                            });
                        } else {
                            createNewPacman(scene);
                        }
                    }
                });
            }
        });

        // Crear partículas de explosión
        const particles = scene.add.particles(pacman.x, pacman.y, 'pacman', {
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 20,
            rotate: { min: -180, max: 180 },
            tint: [0xff0000, 0xff6600, 0xffff00],
            emitting: false
        });

        // Emitir partículas
        particles.explode(20);
        scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }
}

function handlePacmanCollision(scene, player, pacman) {
    // Si el juego está en Game Over, el pacman está siendo eliminado o el jugador es invulnerable, ignorar la colisión
    if (isGameOver || player.isInvulnerable || pacman.isBeingKilled) {
        return;
    }

    playerLives--;
    // Asegurar que las vidas no bajen de 0
    if (playerLives < 0) playerLives = 0;
    livesText.setText('Vidas: ' + playerLives);
    
    if (playerLives <= 0) {
        // Activar el estado de Game Over
        isGameOver = true;

        // Detener al jugador y su animación
        player.setVelocity(0, 0);
        player.setActive(false);
        player.setImmovable(true);

        // Efecto de explosión final
        createExplosionEffect(scene, player.x, player.y);

        // Hacer desaparecer al jugador después de la explosión
        scene.tweens.add({
            targets: player,
            alpha: 0,
            scale: { from: 2.5, to: 0 },
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                player.setVisible(false);
                
                // Game Over
                const gameOverText = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2 - 50, 'GAME OVER', {
                    fontSize: '64px',
                    fontFamily: 'Arial Black',
                    color: '#FF0000',
                    stroke: '#000000',
                    strokeThickness: 8,
                    shadow: {
                        offsetX: 4,
                        offsetY: 4,
                        color: '#000000',
                        blur: 8,
                        fill: true
                    }
                });
                gameOverText.setOrigin(0.5);
                gameOverText.setScrollFactor(0);

                const pressSpaceText = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2 + 50, 'Presiona ESPACIO para empezar', {
                    fontSize: '32px',
                    fontFamily: 'Arial Black',
                    color: '#FFD700',
                    stroke: '#000000',
                    strokeThickness: 6,
                    shadow: {
                        offsetX: 3,
                        offsetY: 3,
                        color: '#000000',
                        blur: 5,
                        fill: true
                    }
                });
                pressSpaceText.setOrigin(0.5);
                pressSpaceText.setScrollFactor(0);

                // Detener todos los pacmans y sus animaciones
                pacmans.children.iterate(function (pacman) {
                    if (pacman) {
                        pacman.setVelocity(0, 0);
                        pacman.anims.stop();
                        pacman.setActive(false);
                        pacman.setImmovable(true);
                    }
                });

                // Esperar a que se presione la barra espaciadora
                scene.input.keyboard.once('keydown-SPACE', () => {
                    // Eliminar los textos de Game Over
                    gameOverText.destroy();
                    pressSpaceText.destroy();
                    // Reiniciar el juego completamente
                    resetGame(scene);
                });
            }
        });
    } else {
        // Crear efecto de explosión
        createExplosionEffect(scene, player.x, player.y);

        // Hacer al jugador invulnerable
        player.isInvulnerable = true;

        // Teletransportar al jugador a una posición aleatoria segura
        const worldBounds = scene.physics.world.bounds;
        const margin = 100; // Margen para no aparecer muy cerca de los bordes
        const newX = Phaser.Math.Between(margin, worldBounds.width - margin);
        const newY = Phaser.Math.Between(margin, worldBounds.height - margin);
        
        // Ocultar al jugador brevemente durante la teletransportación
        player.setAlpha(0);
        
        // Pequeño retraso antes de la reaparición
        scene.time.delayedCall(500, () => {
            player.setPosition(newX, newY);
            player.setAlpha(0.5);
            
            // Efecto de parpadeo durante 3 segundos
            const blinkInterval = scene.time.addEvent({
                delay: 100,
                callback: () => {
                    player.setAlpha(player.alpha === 0.5 ? 0.8 : 0.5);
                },
                repeat: 29 // 30 repeticiones = 3 segundos
            });

            // Terminar la inmunidad después de 3 segundos
            scene.time.delayedCall(3000, () => {
                blinkInterval.remove();
                player.setAlpha(1);
                player.isInvulnerable = false;
            });
        });
    }
}

function createExplosionEffect(scene, x, y) {
    // Crear partículas para la explosión
    const particles = scene.add.particles(x, y, 'dude', {
        speed: { min: 200, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 800,
        quantity: 20,
        rotate: { min: -180, max: 180 },
        tint: [0xff0000, 0xff6600, 0xffff00],
        emitting: false
    });

    // Emitir las partículas
    particles.explode(20);

    // Destruir el emisor después de la explosión
    scene.time.delayedCall(1000, () => {
        particles.destroy();
    });

    // Efecto de destello
    const flash = scene.add.circle(x, y, 50, 0xffffff);
    flash.setAlpha(0.8);
    scene.tweens.add({
        targets: flash,
        alpha: 0,
        scale: 2,
        duration: 200,
        onComplete: () => flash.destroy()
    });
}

function levelUp(scene) {
    currentLevel++;
    pacmansToKill = 10 + (currentLevel - 1) * 5;
    simultaneousPacmans = 3 + (currentLevel - 1);
    
    // Actualizar textos
    levelText.setText('NIVEL ' + currentLevel);
    pacmansLeftText.setText('x ' + pacmansToKill);
    
    // Efecto visual de subida de nivel
    const levelUpText = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2, '¡NIVEL ' + currentLevel + '!', {
        fontSize: '64px',
        fontFamily: 'Arial Black',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 8,
        shadow: {
            offsetX: 4,
            offsetY: 4,
            color: '#000000',
            blur: 8,
            fill: true
        }
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setScrollFactor(0);
    
    // Animación del texto de subida de nivel
    scene.tweens.add({
        targets: levelUpText,
        scale: { from: 0.5, to: 1.5 },
        alpha: { from: 1, to: 0 },
        duration: 2000,
        ease: 'Power2',
        onComplete: () => {
            levelUpText.destroy();
            
            // Calcular cuántos nuevos pacmans necesitamos crear
            const currentPacmans = pacmans.countActive();
            const newPacmansNeeded = simultaneousPacmans - currentPacmans;
            
            // Crear solo los nuevos pacmans necesarios
            for (let i = 0; i < newPacmansNeeded; i++) {
                createNewPacman(scene);
            }
        }
    });
}

function resetGame(scene) {
    // Reiniciar todas las variables globales
    isGameOver = false;
    playerLives = 3;
    score = 0;
    currentLevel = 1;
    pacmansToKill = 10;
    simultaneousPacmans = 3;
    isAttacking = false;
    attackTimer = 0;
    lastDirection = 'right';
    lastHorizontalDirection = 'right';

    // Limpiar todos los pacmans existentes
    pacmans.clear(true, true);

    // Reiniciar completamente el jugador
    player.setPosition(150, scene.physics.world.bounds.height/2);
    player.setVelocity(0, 0);
    player.setActive(true);
    player.setImmovable(false);
    player.clearTint();
    player.setAlpha(1);
    player.setVisible(true);
    player.setScale(2.5);
    player.isInvulnerable = false;
    player.anims.play('turn-right');

    // Actualizar todos los textos
    scoreText.setText('Puntuación: 0');
    levelText.setText('NIVEL 1');
    pacmansLeftText.setText('x 10');
    livesText.setText('Vidas: 3');

    // Crear los pacmans iniciales
    for (let i = 0; i < simultaneousPacmans; i++) {
        createNewPacman(scene);
    }

    // Limpiar los gráficos de ataque
    attackGraphics.clear();
    attackGraphics.alpha = 1;
}

function handlePause() {
    if (Phaser.Input.Keyboard.JustDown(escKey) && !isPaused) {
        showPauseDialog(this);
    }
}

function showPauseDialog(scene) {
    isPaused = true;
    
    // Detener todas las animaciones y físicas
    scene.physics.pause();
    scene.tweens.pauseAll();
    
    // Crear fondo semitransparente
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
    overlay.setScrollFactor(0);

    // Estilo para el texto del diálogo
    const dialogStyle = {
        fontSize: '48px',
        fontFamily: 'Arial Black',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 8,
        shadow: {
            offsetX: 4,
            offsetY: 4,
            color: '#000000',
            blur: 8,
            fill: true
        },
        align: 'center'
    };

    // Crear el diálogo
    const dialogBox = scene.add.graphics();
    dialogBox.fillStyle(0x000000, 0.9);
    dialogBox.fillRect(scene.cameras.main.width/2 - 300, scene.cameras.main.height/2 - 150, 600, 300);
    dialogBox.setScrollFactor(0);

    const questionText = scene.add.text(
        scene.cameras.main.width/2,
        scene.cameras.main.height/2 - 50,
        '¿Quieres salir del juego?',
        dialogStyle
    );
    questionText.setOrigin(0.5);
    questionText.setScrollFactor(0);

    const buttonStyle = {
        ...dialogStyle,
        fontSize: '36px'
    };

    const yesButton = scene.add.text(
        scene.cameras.main.width/2 - 150,
        scene.cameras.main.height/2 + 50,
        'Sí',
        buttonStyle
    );
    yesButton.setOrigin(0.5);
    yesButton.setScrollFactor(0);
    yesButton.setInteractive();

    const noButton = scene.add.text(
        scene.cameras.main.width/2 + 150,
        scene.cameras.main.height/2 + 50,
        'No',
        buttonStyle
    );
    noButton.setOrigin(0.5);
    noButton.setScrollFactor(0);
    noButton.setInteractive();

    // Efectos hover
    [yesButton, noButton].forEach(button => {
        button.on('pointerover', () => {
            button.setScale(1.2);
            button.setColor('#FFFFFF');
        });
        button.on('pointerout', () => {
            button.setScale(1);
            button.setColor('#FFD700');
        });
    });

    // Funciones de los botones
    yesButton.on('pointerdown', () => {
        // Reiniciar completamente el juego
        isGameStarted = false;
        isPaused = false;
        isGameOver = false;
        score = 0;
        currentLevel = 1;
        playerLives = 3;
        pacmansToKill = 10;
        simultaneousPacmans = 3;
        isAttacking = false;
        attackTimer = 0;
        lastDirection = 'right';
        lastHorizontalDirection = 'right';
        
        // Detener la física y las animaciones
        scene.physics.pause();
        scene.tweens.pauseAll();
        
        // Limpiar los grupos de sprites
        if (pacmans) {
            pacmans.clear(true, true);
        }
        
        // Limpiar el jugador
        if (player) {
            player.destroy();
        }
        
        // Limpiar la cámara
        if (mainCamera) {
            mainCamera.stopFollow();
        }
        
        // Limpiar los gráficos de ataque
        if (attackGraphics) {
            attackGraphics.clear();
            attackGraphics.alpha = 1;
        }

        // Reiniciar la escena
        scene.scene.restart();
    });

    noButton.on('pointerdown', () => {
        // Limpiar el diálogo
        [overlay, dialogBox, questionText, yesButton, noButton].forEach(element => element.destroy());
        
        // Reanudar el juego
        isPaused = false;
        scene.physics.resume();
        scene.tweens.resumeAll();
    });

    // También permitir cerrar con ESC
    scene.input.keyboard.once('keydown-ESC', () => {
        [overlay, dialogBox, questionText, yesButton, noButton].forEach(element => element.destroy());
        
        // Reanudar el juego
        isPaused = false;
        scene.physics.resume();
        scene.tweens.resumeAll();
    });
} 