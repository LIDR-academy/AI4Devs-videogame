// Game variables
let score = 0;
let scoreText;
let keyCollected = false;
let debugText;
let debugVisible = false;
let keyZero;
let lastState = 'Movement';
let door;
let doorOpen = false;
let playerHealth = 100;
let healthText;
let enemies;
let enemyCount = 1;
let playerProjectiles;
let projectiles;
let gameOver = false;
let helperArrow; // Variable global para la flecha auxiliar
let healingItem; // Variable para el item de curación
let lastPlayerDirection = 1; // 1 para derecha, -1 para izquierda

// Level variables
let platforms;
let worldWidth = 2400; // 3 screens wide
let worldHeight = 1200; // 2 screens high
let doors = []; // Array para almacenar todas las puertas
let deathZones = []; // Array para las zonas de muerte

// Variables para estadísticas
let enemiesDestroyed = 0;
let doorsOpened = 0;

class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Fondo negro semitransparente para toda la pantalla
        this.add.rectangle(centerX, centerY, 800, 600, 0x000000, 0.7);

        // Título del juego con efecto de sombra
        const titleText = this.add.text(centerX, 80, 'KNIGHTMARE', {
            fontSize: '64px',
            fill: '#fff',
            fontStyle: 'bold',
            stroke: '#ff0000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5);

        // Efecto de parpadeo en el título
        this.tweens.add({
            targets: titleText,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Panel de instrucciones con borde
        const instructionsPanel = this.add.rectangle(centerX, centerY, 500, 300, 0x222222);
        instructionsPanel.setStrokeStyle(2, 0xff0000);

        // Instrucciones
        const instructions = [
            'A/D o ←/→ : Movimiento',
            'W o ↑ : Saltar',
            'F : Disparar',
            'SHIFT : Sprint',
            '',
            'OBJETIVO',
            '-------------------',
            '* Recolecta llaves para abrir puertas',
            '* Elimina enemigos',
            '* Sobrevive y consigue la mayor',
            '* puntuación'
        ];

        this.add.text(centerX, centerY, instructions, {
            fontSize: '18px',
            fill: '#fff',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        // Botón de Play con efectos
        const playButton = this.add.container(centerX, centerY + 180);

        const buttonBg = this.add.rectangle(0, 0, 160, 40, 0xff0000);
        const buttonText = this.add.text(0, 0, 'PLAY', {
            fontSize: '28px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        playButton.add([buttonBg, buttonText]);
        playButton.setSize(160, 40);
        playButton.setInteractive()
            .on('pointerover', () => {
                buttonBg.setFillStyle(0xff3333);
                buttonText.setScale(1.1);
                this.tweens.add({
                    targets: playButton,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                buttonBg.setFillStyle(0xff0000);
                buttonText.setScale(1);
                this.tweens.add({
                    targets: playButton,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            })
            .on('pointerdown', () => {
                this.cameras.main.flash(500);
                this.time.delayedCall(500, () => {
                    this.scene.start('gameScene');
                });
            });

        // Añadir decoraciones en las esquinas
        this.add.rectangle(50, 50, 20, 20, 0xff0000).setAngle(45);
        this.add.rectangle(750, 50, 20, 20, 0xff0000).setAngle(45);
        this.add.rectangle(50, 550, 20, 20, 0xff0000).setAngle(45);
        this.add.rectangle(750, 550, 20, 20, 0xff0000).setAngle(45);

        // Añadir texto de versión
        this.add.text(780, 580, 'v1.0', {
            fontSize: '16px',
            fill: '#666'
        }).setOrigin(1);
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene' });
    }

    preload() {
        // Configurar la carga de archivos locales
        this.load.setPath('assets/images');
        
        // Cargar el fondo
        this.load.image('background', 'BG/Background.png');
        
        // Cargar assets del entorno
        this.load.image('groundTile', 'Environment/Castle_Rock01.png');
        this.load.image('pit', 'Environment/Castle_Pit.png');
        this.load.image('platform2', 'Environment/Castle_Platform02.png');
        this.load.image('platform3', 'Environment/Castle_Platform03.png');
        
        // Cargar assets de la llave
        this.load.image('key', 'Items/Item_Key/Key.png');
        this.load.image('keyIcon', 'Items/Item_Key/KeyIcon.png');
        
        // Cargar assets de la puerta
        this.load.image('doorClosed', 'Objects/door_closed.png');
        this.load.image('doorOpen', 'Objects/door_open.png');
        
        // Cargar frames de la animación del item curativo
        for(let i = 1; i <= 8; i++) {
            this.load.image(`healFrame${i}`, `Items/Item_Health/frame-${i}.png`);
        }

        // Cargar frames de animación del enemigo
        for(let i = 0; i <= 3; i++) {
            this.load.image(`enemyIdle${i}`, `Character/enemy_Idle/${i}.png`);
        }
        for(let i = 0; i <= 1; i++) {
            this.load.image(`enemyAttack${i}`, `Character/enemy_attack/${i}.png`);
        }
        // Cargar frames del proyectil enemigo
        for(let i = 0; i <= 2; i++) {
            this.load.image(`enemyProjectile${i}`, `Character/enemy_shot/${i}.png`);
        }

        // Cargar assets del jugador
        this.load.image('playerBullet', 'Player/player_bullet.png');
        this.load.image('playerPew', 'Player/player_pew.png');
        
        // Cargar frames de la animación de correr
        for(let i = 0; i <= 5; i++) {
            this.load.image(`playerRun${i}`, `Player/player_run${i}.png`);
        }
    }

    create() {
        // Crear animaciones del enemigo primero
        this.anims.create({
            key: 'enemyIdle',
            frames: [
                { key: 'enemyIdle0' },
                { key: 'enemyIdle1' },
                { key: 'enemyIdle2' },
                { key: 'enemyIdle3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemyAttack',
            frames: [
                { key: 'enemyAttack0' },
                { key: 'enemyAttack1' }
            ],
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'enemyProjectile',
            frames: [
                { key: 'enemyProjectile0' },
                { key: 'enemyProjectile1' },
                { key: 'enemyProjectile2' }
            ],
            frameRate: 12,
            repeat: -1
        });

        // Agregar el fondo y escalarlo para cubrir todo el nivel
        const bgWidth = 800; // Ancho original del background
        const bgHeight = 600; // Alto original del background
        const scaleX = 0.75; // 25% más grande que el 50% anterior
        const scaleY = 1.0; // 50% más grande que el 50% anterior
        const numBgTilesX = Math.ceil(worldWidth / (bgWidth * scaleX));
        const numBgTilesY = Math.ceil(worldHeight / (bgHeight * scaleY));
        
        for(let x = 0; x < numBgTilesX; x++) {
            for(let y = 0; y < numBgTilesY; y++) {
                this.add.image(
                    x * (bgWidth * scaleX) + (bgWidth * scaleX/2),
                    y * (bgHeight * scaleY) + (bgHeight * scaleY/2),
                    'background'
                )
                .setDisplaySize(bgWidth * scaleX, bgHeight * scaleY)
                .setDepth(-1);
            }
        }

        // Set world bounds
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Create platforms (ground and platforms)
        platforms = this.physics.add.staticGroup();

        // Main ground platforms with death pits
        createGroundWithPits.call(this);

        // Create platforms for level design
        createLevelPlatforms.call(this);

        // Crear animación de correr del jugador
        this.anims.create({
            key: 'playerRun',
            frames: [
                { key: 'playerRun0' },
                { key: 'playerRun1' },
                { key: 'playerRun2' },
                { key: 'playerRun3' },
                { key: 'playerRun4' },
                { key: 'playerRun5' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Modificar la creación del jugador
        this.player = this.physics.add.sprite(100, worldHeight - 150, 'playerRun0')
            .setDisplaySize(50, 50); // Mantener el tamaño de colisión actual
        
        // Crear el efecto "pew" (inicialmente invisible)
        this.pewEffect = this.add.image(0, 0, 'playerPew')
            .setVisible(false)
            .setDepth(1);

        // Player physics properties
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Create enemies group
        enemies = this.physics.add.group();

        // Place enemies strategically
        createEnemy.call(this, 400, worldHeight - 400);   // Enemigo en plataforma izquierda
        createEnemy.call(this, 1200, worldHeight - 300);  // Enemigo en plataforma media
        createEnemy.call(this, 2100, worldHeight - 300);  // Enemigo en plataforma derecha

        // Create key at a strategic location
        createKey.call(this);

        // Create doors
        createDoors.call(this);

        // Setup camera
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.08, 0);  // Establecer el lerp vertical a 0
        this.cameras.main.setFollowOffset(0, 200);  // Offset vertical fijo
        this.cameras.main.setLerp(0.08, 0);  // Solo suavizado horizontal

        // Create projectiles groups
        playerProjectiles = this.physics.add.group({ allowGravity: false });
        projectiles = this.physics.add.group({ allowGravity: false });

        // Setup collisions
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(enemies, platforms);
        this.physics.add.collider(this.key, platforms);
        this.physics.add.collider(playerProjectiles, platforms, destroyProjectile);
        this.physics.add.collider(projectiles, platforms, destroyProjectile);
        this.physics.add.overlap(this.player, this.key, collectKey, null, this);
        this.physics.add.overlap(this.player, deathZones, playerDeath, null, this);
        doors.forEach(door => {
            this.physics.add.overlap(this.player, door, passThroughDoor, null, this);
        });
        this.physics.add.overlap(this.player, projectiles, hitPlayer, null, this);
        this.physics.add.overlap(playerProjectiles, enemies, hitEnemy, null, this);
        this.physics.add.overlap(playerProjectiles, projectiles, destroyBothProjectiles, null, this);

        // Create UI elements
        createUI.call(this);

        // Create helper arrow (now visible from the start)
        createOrUpdateHelperArrow.call(this);

        // Setup input keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyZero = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);

        // Crear la animación del item curativo
        const healFrames = [];
        for(let i = 1; i <= 8; i++) {
            healFrames.push({ key: `healFrame${i}` });
        }
        this.anims.create({
            key: 'heal',
            frames: healFrames,
            frameRate: 10,
            repeat: -1
        });

        // Crear animaciones del enemigo
        this.anims.create({
            key: 'enemyIdle',
            frames: [
                { key: 'enemyIdle0' },
                { key: 'enemyIdle1' },
                { key: 'enemyIdle2' },
                { key: 'enemyIdle3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemyAttack',
            frames: [
                { key: 'enemyAttack0' },
                { key: 'enemyAttack1' }
            ],
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'enemyProjectile',
            frames: [
                { key: 'enemyProjectile0' },
                { key: 'enemyProjectile1' },
                { key: 'enemyProjectile2' }
            ],
            frameRate: 12,
            repeat: -1
        });
    }

    update() {
        if (gameOver) {
            return;
        }

        // Player movement
        if (this.cursors.left.isDown || this.keyA.isDown) {
            this.player.setVelocityX(-160);
            lastPlayerDirection = -1;
            this.player.setFlipX(true);
            this.player.play('playerRun', true);
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
            this.player.setVelocityX(160);
            lastPlayerDirection = 1;
            this.player.setFlipX(false);
            this.player.play('playerRun', true);
        } else {
            this.player.setVelocityX(0);
            this.player.stop();
            this.player.setTexture('playerRun0');
        }

        // Jump only if touching the ground
        if ((this.cursors.up.isDown || this.keyW.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        // Sprint functionality
        if (this.keyShift.isDown) {
            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(240);
            } else if (this.player.body.velocity.x < 0) {
                this.player.setVelocityX(-240);
            }
        }

        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
            shootProjectile.call(this, this.player, true);
        }

        // Update enemy behavior
        enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                // Update enemy health bar position
                if (enemy.healthContainer) {
                    enemy.healthContainer.setPosition(enemy.x, enemy.y);
                }
                
                // Update enemy direction line
                if (enemy.directionLine) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                    enemy.directionLine.setTo(enemy.x, enemy.y, enemy.x + Math.cos(angle) * 30, enemy.y + Math.sin(angle) * 30);
                    enemy.directionLine.setVisible(debugVisible);
                }

                // Update enemy orientation based on player position
                if (this.player.x < enemy.x) {
                    enemy.setFlipX(false);
                } else {
                    enemy.setFlipX(true);
                }

                // Enemy shooting logic based on distance
                const distToPlayer = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y,
                    this.player.x, this.player.y
                );
                
                if (distToPlayer <= 200 && enemy.nextShot && enemy.nextShot <= this.time.now) {
                    shootProjectile.call(this, enemy, false);
                    enemy.nextShot = this.time.now + enemy.fireRate;
                }
            }
        });

        // Debug panel toggle
        if (Phaser.Input.Keyboard.JustDown(keyZero)) {
            debugVisible = !debugVisible;
            debugText.setVisible(debugVisible);
        }

        // Update debug text
        if (debugVisible) {
            updateDebugText.call(this);
        }

        // Actualizar posición del icono de la llave
        if (keyCollected && this.keyIcon) {
            this.keyIcon.setPosition(this.player.x, this.player.y - 40);
        }

        // Actualizar la flecha auxiliar (removido el check de debugVisible)
        if (helperArrow) {
            const target = keyCollected ? 
                doors.find(door => door.doorOpen) : 
                this.key;
            
            if (target) {
                // Calcular el ángulo hacia el objetivo
                const angle = Phaser.Math.Angle.Between(
                    this.cameras.main.scrollX + 400, // Centro de la pantalla X
                    this.cameras.main.scrollY + 50,  // Parte superior de la pantalla Y
                    target.x,
                    target.y
                );
                
                // Actualizar posición y rotación de la flecha
                helperArrow.setPosition(400, 50); // Centro-superior de la pantalla
                helperArrow.setRotation(angle);
                
                // Actualizar posición y rotación de la punta de la flecha
                helperArrow.arrowHead.setPosition(
                    400 + Math.cos(angle) * 50,
                    50 + Math.sin(angle) * 50
                );
                helperArrow.arrowHead.setRotation(angle);
            }
        }
    }
}

function createGroundWithPits() {
    // Create ground platforms with two death pits
    const segments = [
        { start: 0, width: 600 },
        { start: 800, width: 800 },
        { start: 1800, width: 600 }
    ];

    segments.forEach(segment => {
        // Crear el suelo con tiles
        const tileWidth = 64; // Ancho de cada tile
        const numTiles = Math.ceil(segment.width / tileWidth);
        
        // Crear la colisión base
        const groundCollision = platforms.create(segment.start + segment.width/2, worldHeight - 32, null)
            .setDisplaySize(segment.width, 64)
            .setVisible(false) // Ocultar la colisión
            .refreshBody();
            
        // Crear los tiles visuales
        for(let i = 0; i < numTiles; i++) {
            this.add.image(
                segment.start + (i * tileWidth) + tileWidth/2,
                worldHeight - 32,
                'groundTile'
            ).setDisplaySize(tileWidth, 64);
        }
    });

    // Create death zones for the pits
    const pitPositions = [
        { x: 710, y: worldHeight + 45 },
        { x: 1710, y: worldHeight + 45 }
    ];

    pitPositions.forEach(pos => {
        // Crear la imagen del pit
        this.add.image(pos.x, pos.y - 40, 'pit')
            .setDisplaySize(200, 100);
        
        // Crear la zona de colisión invisible
        const pitZone = this.add.rectangle(pos.x, pos.y, 200, 100, 0x000000);
        this.physics.add.existing(pitZone, true);
        pitZone.setVisible(false); // Ocultar la colisión
        deathZones.push(pitZone);
    });
}

function createLevelPlatforms() {
    // Plataformas principales
    const platformsConfig = [
        // Sección izquierda
        { x: 200, y: worldHeight - 200, width: 400, height: 32, type: 'platform3' },
        { x: 400, y: worldHeight - 350, width: 200, height: 32, type: 'platform3' },
        { x: 250, y: worldHeight - 500, width: 200, height: 32, type: 'platform3' },
        // Plataformas de acceso izquierda
        { x: 150, y: worldHeight - 100, width: 200, height: 32, type: 'platform3' },
        
        // Sección media
        { x: 1000, y: worldHeight - 250, width: 300, height: 32, type: 'platform3' },
        { x: 1400, y: worldHeight - 350, width: 200, height: 32, type: 'platform3' },
        // Plataformas de acceso media
        { x: 900, y: worldHeight - 150, width: 200, height: 32, type: 'platform3' },
        { x: 1300, y: worldHeight - 200, width: 200, height: 32, type: 'platform3' },
        
        // Sección derecha
        { x: 1800, y: worldHeight - 300, width: 400, height: 32, type: 'platform3' },
        { x: 2200, y: worldHeight - 250, width: 300, height: 32, type: 'platform3' },
        { x: 2000, y: worldHeight - 400, width: 200, height: 32, type: 'platform3' },
        // Plataformas de acceso derecha
        { x: 1900, y: worldHeight - 150, width: 200, height: 32, type: 'platform3' },
        { x: 2100, y: worldHeight - 200, width: 200, height: 32, type: 'platform3' }
    ];

    platformsConfig.forEach(platform => {
        // Crear la colisión invisible
        const collision = platforms.create(platform.x, platform.y, null)
            .setDisplaySize(platform.width, platform.height)
            .setVisible(false)
            .refreshBody();
            
        // Crear la imagen visual de la plataforma
        this.add.image(platform.x, platform.y, platform.type)
            .setDisplaySize(platform.width, platform.height);
    });
}

function createDoors() {
    const doorLocations = [
        { x: 200, y: worldHeight - 250 },
        { x: 900, y: worldHeight - 200 },
        { x: 1300, y: worldHeight - 250 },
        { x: 1800, y: worldHeight - 350 },
        { x: 2000, y: worldHeight - 450 },
        { x: 2300, y: worldHeight - 300 }
    ];

    doorLocations.forEach(loc => {
        // Crear sprite de la puerta usando physics.add.sprite en lugar de add.sprite
        const door = this.physics.add.sprite(loc.x, loc.y, 'doorClosed')
            .setDisplaySize(30, 60)
            .setImmovable(true);
        
        // Hacer la puerta estática
        door.body.setAllowGravity(false);
        door.doorOpen = false; // Propiedad para tracking
        doors.push(door);
    });
}

function destroyProjectile(projectile) {
    projectile.destroy();
}

function playerDeath(player) {
    if (!gameOver) {
        gameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);

        // Ocultar UI existente
        if (this.healthBar) this.healthBar.setVisible(false);
        if (this.healthText) this.healthText.setVisible(false);
        if (this.scoreText) this.scoreText.setVisible(false);
        if (debugText) debugText.setVisible(false);
        if (helperArrow) {
            helperArrow.setVisible(false);
            helperArrow.arrowHead.setVisible(false);
        }

        // Calcular estadísticas finales
        const finalStats = [
            'GAME OVER',
            '',
            `Puntuación Final: ${score}`,
            `Enemigos Destruidos: ${enemiesDestroyed}`,
            `Puertas Abiertas: ${doorsOpened}`
        ];

        // Crear una capa para el Game Over que se mantenga fija en la pantalla
        const gameOverLayer = this.add.container(0, 0);
        gameOverLayer.setDepth(1000); // Asegurar que esté por encima de todo

        // Crear un fondo negro semitransparente que cubra toda la pantalla
        const background = this.add.rectangle(
            400, // Mitad del ancho de la pantalla
            300, // Mitad del alto de la pantalla
            800, // Ancho total de la pantalla
            600, // Alto total de la pantalla
            0x000000,
            0.7
        );
        background.setScrollFactor(0);
        gameOverLayer.add(background);

        // Mostrar estadísticas finales
        const gameOverText = this.add.text(400, 200, finalStats, {
            fontSize: '32px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        gameOverText.setScrollFactor(0);
        gameOverLayer.add(gameOverText);

        // Botón de Replay
        const replayButton = this.add.text(400, 400, 'JUGAR DE NUEVO', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerover', () => replayButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => replayButton.setStyle({ fill: '#fff' }))
        .on('pointerdown', () => {
            // Reiniciar todas las variables globales
            score = 0;
            keyCollected = false;
            gameOver = false;
            playerHealth = 100;
            enemiesDestroyed = 0;
            doorsOpened = 0;
            
            // Reiniciar la escena
            this.scene.restart();
        });
        gameOverLayer.add(replayButton);

        // Asegurar que el container se mantenga fijo en la pantalla
        gameOverLayer.setScrollFactor(0);
    }
}

function createKey() {
    // Posiciones seguras para la llave (sobre plataformas y en la mitad superior)
    const keyLocations = [
        { x: 200, y: worldHeight - 550 },   // Plataforma alta izquierda
        { x: 400, y: worldHeight - 600 },   // Plataforma más alta izquierda
        { x: 1000, y: worldHeight - 500 },  // Plataforma alta media
        { x: 1400, y: worldHeight - 550 },  // Plataforma alta media derecha
        { x: 2000, y: worldHeight - 600 },  // Plataforma alta derecha
        { x: 2200, y: worldHeight - 500 }   // Plataforma alta final
    ];
    
    // Filtrar ubicaciones válidas
    const validLocations = keyLocations.filter(loc => {
        // Verificar que esté en la mitad superior de la pantalla
        if (loc.y > worldHeight / 2) {
            return false;
        }

        // Verificar distancia con enemigos
        const tooCloseToEnemy = enemies.getChildren().some(enemy => {
            const distance = Phaser.Math.Distance.Between(loc.x, loc.y, enemy.x, enemy.y);
            return distance < 150; // Aumentado a 150 píxeles de distancia
        });
        
        // Verificar distancia con puertas
        const tooCloseToDoor = doors.some(door => {
            const distance = Phaser.Math.Distance.Between(loc.x, loc.y, door.x, door.y);
            return distance < 150; // Aumentado a 150 píxeles de distancia
        });

        // Verificar distancia con el jugador
        const tooCloseToPlayer = Phaser.Math.Distance.Between(
            loc.x, loc.y, 
            this.player.x, this.player.y
        ) < 150;

        // Verificar que haya una plataforma debajo para que sea accesible
        const hasPlatformBelow = platforms.getChildren().some(platform => {
            return Math.abs(platform.x - loc.x) < platform.displayWidth / 2 &&
                   platform.y > loc.y &&
                   platform.y - loc.y < 200; // Distancia máxima vertical a una plataforma
        });
        
        return !tooCloseToEnemy && !tooCloseToDoor && !tooCloseToPlayer && hasPlatformBelow;
    });
    
    if (validLocations.length === 0) {
        // Si no hay ubicaciones válidas, intentar con posiciones alternativas
        console.warn('No se encontraron ubicaciones válidas para la llave, usando posición alternativa');
        return createKeyAlternative.call(this);
    }

    const randomPos = Phaser.Math.RND.pick(validLocations);
    this.key = this.physics.add.sprite(randomPos.x, randomPos.y, 'key')
        .setDisplaySize(40, 40) // Doble del tamaño de la colisión (20x20)
        .setSize(20, 20) // Mantener el tamaño de la colisión original
        .setOffset(10, 10); // Ajustar el offset para centrar la colisión
    
    // Mantener la física de la llave igual
    this.key.setCollideWorldBounds(true);
    this.key.setBounce(0.2);
    this.key.body.setGravityY(300);
    
    // Asegurarnos de que la llave tenga un cuerpo físico adecuado
    this.key.body.setSize(20, 20);
    this.key.body.setOffset(0, 0);
    
    // Asegurar que la llave colisione con todas las plataformas
    this.physics.add.collider(this.key, platforms, null, null, this);
    
    // Añadir overlap con el jugador para poder recoger la llave
    this.physics.add.overlap(this.player, this.key, collectKey, null, this);
    
    // Crear o actualizar la flecha auxiliar
    createOrUpdateHelperArrow.call(this);
}

function createKeyAlternative() {
    // Posiciones alternativas más seguras
    const altLocations = [
        { x: 250, y: worldHeight - 700 },  // Muy arriba a la izquierda
        { x: 1200, y: worldHeight - 700 }, // Muy arriba en el medio
        { x: 2100, y: worldHeight - 700 }  // Muy arriba a la derecha
    ];
    
    const randomPos = Phaser.Math.RND.pick(altLocations);
    this.key = this.physics.add.sprite(randomPos.x, randomPos.y, 'key')
        .setDisplaySize(40, 40) // Doble del tamaño de la colisión (20x20)
        .setSize(20, 20) // Mantener el tamaño de la colisión original
        .setOffset(10, 10); // Ajustar el offset para centrar la colisión
    
    // Mantener la física de la llave igual
    this.key.setCollideWorldBounds(true);
    this.key.setBounce(0.2);
    this.key.body.setGravityY(300);
    this.key.body.setSize(20, 20);
    this.key.body.setOffset(0, 0);
    
    // Asegurar que la llave colisione con todas las plataformas
    this.physics.add.collider(this.key, platforms, null, null, this);
    
    // Añadir overlap con el jugador para poder recoger la llave
    this.physics.add.overlap(this.player, this.key, collectKey, null, this);
    
    // Crear o actualizar la flecha auxiliar
    createOrUpdateHelperArrow.call(this);
}

function createOrUpdateHelperArrow() {
    // Si la flecha ya existe, la destruimos para crear una nueva
    if (helperArrow && helperArrow.arrowHead) {
        helperArrow.arrowHead.destroy();
        helperArrow.destroy();
    }
    
    // Crear nueva flecha
    helperArrow = this.add.line(400, 50, 0, 0, 50, 0, keyCollected ? 0x00ff00 : 0xffff00);
    helperArrow.setLineWidth(3);
    helperArrow.setScrollFactor(0);
    
    // Agregar punta de flecha
    const arrowHead = this.add.triangle(400, 50, 0, -5, 10, 0, 0, 5, keyCollected ? 0x00ff00 : 0xffff00);
    arrowHead.setScrollFactor(0);
    helperArrow.arrowHead = arrowHead;
    
    // La flecha siempre es visible
    helperArrow.setVisible(true);
    arrowHead.setVisible(true);
}

function collectKey(player, key) {
    const scene = this;
    
    // Verificar que haya puertas disponibles antes de continuar
    if (!doors || doors.length === 0) {
        console.warn('No hay puertas disponibles');
        return;
    }
    
    key.destroy();
    keyCollected = true;
    updateScore.call(scene, 150);
    
    scene.keyIcon = scene.add.image(player.x, player.y - 40, 'keyIcon')
        .setDisplaySize(30, 30);
    
    // Encontrar una puerta válida que no esté abierta
    let availableDoors = doors.filter(door => !door.doorOpen && door.active);
    if (availableDoors.length === 0) {
        availableDoors = doors.filter(door => door.active); // Si todas están abiertas, usar cualquiera
    }
    
    if (availableDoors.length > 0) {
        const selectedDoor = Phaser.Math.RND.pick(availableDoors);
        if (selectedDoor && selectedDoor.setTexture) {
            selectedDoor.setTexture('doorOpen');
            selectedDoor.doorOpen = true;
        }
    }
    
    createOrUpdateHelperArrow.call(scene);
}

function createHealingItem(x, y) {
    // Crear el sprite con el primer frame
    healingItem = this.physics.add.sprite(x, y - 45, 'healFrame1')
        .setDisplaySize(25, 25)
        .setSize(25, 25);
    
    // Verificar si la animación existe antes de reproducirla
    if (this.anims.exists('heal')) {
        healingItem.play('heal');
    } else {
        // Si la animación no existe, crearla y reproducirla
        const healFrames = [];
        for(let i = 1; i <= 8; i++) {
            healFrames.push({ key: `healFrame${i}` });
        }
        this.anims.create({
            key: 'heal',
            frames: healFrames,
            frameRate: 10,
            repeat: -1
        });
        healingItem.play('heal');
    }
    
    // Configurar física
    healingItem.body.setAllowGravity(false);
    healingItem.body.setImmovable(true);
    
    // Añadir overlap
    this.physics.add.overlap(this.player, healingItem, collectHealingItem, null, this);
}

function collectHealingItem(player, item) {
    // Curar al jugador
    const previousHealth = playerHealth;
    playerHealth += 20;
    
    // Si la salud supera el máximo actual, actualizar el máximo
    if (playerHealth > this.maxHealth) {
        this.maxHealth = playerHealth;
    }
    
    // Actualizar barra de vida y texto
    const healthPercent = playerHealth / this.maxHealth;
    this.healthBar.setScale(healthPercent, 1);
    this.healthText.setText(`${playerHealth}/${this.maxHealth}`);
    
    // Efecto visual de curación
    player.setTint(0x00ff00);
    this.time.delayedCall(200, () => {
        player.clearTint();
    });
    
    // Destruir el item
    item.destroy();
}

function passThroughDoor(player, door) {
    if (keyCollected && door.doorOpen) {
        updateScore.call(this, 350);
        doorsOpened++;
        
        keyCollected = false;
        this.keyIcon.destroy();
        
        door.setTexture('doorClosed');
        door.doorOpen = false;
        
        createHealingItem.call(this, door.x, door.y);
        createKey.call(this);
    }
}

function shootProjectile(source, isPlayer) {
    if (isPlayer) {
        const projectile = playerProjectiles.create(source.x, source.y, 'playerBullet');
        projectile.setDisplaySize(10, 10);
        
        // Mostrar y posicionar el efecto "pew"
        this.pewEffect.setVisible(true)
            .setPosition(source.x, source.y - 30)
            .setScale(1)
            .setFlipX(lastPlayerDirection < 0);
        
        // Reiniciar el temporizador del "pew" si existe
        if (this.pewTimer) {
            this.pewTimer.remove();
        }
        
        // Crear nuevo temporizador para ocultar el "pew"
        this.pewTimer = this.time.delayedCall(500, () => {
            this.pewEffect.setVisible(false);
        });

        let angle = lastPlayerDirection > 0 ? 0 : Math.PI;
        const speed = 400;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        
        this.time.delayedCall(2000, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    } else {
        // Si es un enemigo, reproducir la animación de ataque
        source.play('enemyAttack');
        source.once('animationcomplete', () => {
            source.play('enemyIdle');
        });
    }

    const projectile = isPlayer ? 
        playerProjectiles.create(source.x, source.y, null) : 
        projectiles.create(source.x, source.y, 'enemyProjectile0');
    
    projectile.setDisplaySize(10, 10);
    
    if (isPlayer) {
        projectile.setTint(0x00ff00);
    } else {
        projectile.play('enemyProjectile');
    }

    let angle;
    if (isPlayer) {
        angle = lastPlayerDirection > 0 ? 0 : Math.PI;
    } else {
        angle = Phaser.Math.Angle.Between(source.x, source.y, this.player.x, this.player.y);
    }

    const speed = 400;
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Destroy projectile after 2 seconds
    this.time.delayedCall(2000, () => {
        if (projectile.active) {
            projectile.destroy();
        }
    });
}

function hitPlayer(player, projectile) {
    projectile.destroy();
    
    playerHealth -= 10;
    
    // Actualizar barra de vida y texto
    const healthPercent = Math.max(0, playerHealth) / this.maxHealth;
    this.healthBar.setScale(healthPercent, 1);
    this.healthText.setText(`${Math.max(0, playerHealth)}/${this.maxHealth}`);
    
    // Calculate knockback direction
    const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, player.x, player.y);
    player.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
    
    if (playerHealth <= 0) {
        playerDeath.call(this, player);
    }
}

function createEnemy(x, y) {
    const enemy = enemies.create(x, y, 'enemyIdle0');
    enemy.setDisplaySize(40, 40);
    
    // Activar gravedad y colisión con el mundo
    enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    
    // Set enemy properties
    enemy.health = 30;
    enemy.maxHealth = 30;
    enemy.fireRate = 1000; // Base fire rate in milliseconds
    enemy.nextShot = this.time.now + enemy.fireRate;
    
    // Crear contenedor para la barra de vida
    const healthBarWidth = 40;
    const healthBarHeight = 4;
    
    // Fondo de la barra de vida (negro)
    const healthBarBg = this.add.rectangle(0, -30, healthBarWidth, healthBarHeight, 0x000000);
    
    // Barra de vida (cyan)
    const healthBar = this.add.rectangle(-healthBarWidth/2, -30, healthBarWidth, healthBarHeight, 0x00ffff);
    healthBar.setOrigin(0, 0.5);
    
    // Crear contenedor y agregar las barras
    enemy.healthContainer = this.add.container(x, y, [healthBarBg, healthBar]);
    enemy.healthBar = healthBar;
    
    // Add direction line (hidden by default)
    enemy.directionLine = this.add.line(0, 0, x, y, x + 30, y, 0xff0000);
    enemy.directionLine.setVisible(false);
    
    // Iniciar animación idle inmediatamente y asegurarse de que se reproduzca en loop
    if (this.anims.exists('enemyIdle')) {
        enemy.play('enemyIdle', true);
    }
    
    return enemy;
}

function findValidEnemyPosition(scene) {
    const validPositions = [];
    
    // Obtener todas las plataformas y ordenarlas por altura (de abajo hacia arriba)
    const allPlatforms = platforms.getChildren()
        .filter(p => p.y < worldHeight - 100) // Excluir el suelo principal
        .sort((a, b) => b.y - a.y);
    
    allPlatforms.forEach(platform => {
        // Calcular posiciones válidas sobre esta plataforma
        const platformWidth = platform.displayWidth;
        const platformX = platform.x;
        const platformY = platform.y;
        
        // Verificar varios puntos a lo largo de la plataforma
        for(let x = platformX - platformWidth/2 + 50; x <= platformX + platformWidth/2 - 50; x += 100) {
            // Verificar distancia desde el jugador
            const distToPlayer = Phaser.Math.Distance.Between(x, platformY - 50, scene.player.x, scene.player.y);
            if(distToPlayer < 300) continue; // Muy cerca del jugador
            
            // Verificar que no esté sobre un pit
            const isOverPit = deathZones.some(pit => 
                Math.abs(x - pit.x) < pit.width/2
            );
            if(isOverPit) continue;
            
            // Verificar que no haya otros enemigos cerca
            const tooCloseToEnemy = enemies.getChildren().some(enemy => 
                Phaser.Math.Distance.Between(x, platformY - 50, enemy.x, enemy.y) < 200
            );
            if(tooCloseToEnemy) continue;
            
            validPositions.push({x, y: platformY - 50});
        }
    });
    
    return validPositions.length > 0 ? 
        Phaser.Math.RND.pick(validPositions) : 
        null;
}

function spawnNewEnemies(scene) {
    for(let i = 0; i < 2; i++) {
        const pos = findValidEnemyPosition(scene);
        if(pos) {
            createEnemy.call(scene, pos.x, pos.y);
        }
    }
}

function decreaseEnemyFireRate() {
    const reduction = 50; // 0.05 seconds = 50 milliseconds
    enemies.getChildren().forEach(enemy => {
        enemy.fireRate = Math.max(200, enemy.fireRate - reduction); // Don't go below 0.2 seconds
    });
}

function hitEnemy(projectile, enemy) {
    projectile.destroy();
    
    enemy.health -= 10;
    
    // Actualizar la barra de vida
    const healthPercent = enemy.health / enemy.maxHealth;
    enemy.healthBar.setScale(healthPercent, 1);
    
    if (enemy.health <= 0) {
        enemy.healthContainer.destroy();
        enemy.directionLine.destroy();
        
        spawnNewEnemies(this);
        decreaseEnemyFireRate();
        
        enemy.destroy();
        updateScore.call(this, 100);
        enemiesDestroyed++;
    }
}

function destroyBothProjectiles(projectile1, projectile2) {
    projectile1.destroy();
    projectile2.destroy();
}

function updateDebugText() {
    const state = lastState === 'Movement' ? 'Movement' : 'Combat';
    debugText.setText([
        'Debug Info:',
        'Player Position: (' + Math.round(this.player.x) + ', ' + Math.round(this.player.y) + ')',
        'Velocity: (' + Math.round(this.player.body.velocity.x) + ', ' + Math.round(this.player.body.velocity.y) + ')',
        'Health: ' + playerHealth,
        'Score: ' + score,
        'Key Collected: ' + keyCollected,
        'Door Open: ' + doorOpen,
        'Game State: ' + state
    ].join('\n'));
}

function createUI() {
    // Configuración de la barra de vida
    const barConfig = {
        width: 200,
        height: 30,
        x: 145,
        y: 25,
        borderWidth: 4
    };

    // Contenedor principal de la UI
    const uiContainer = this.add.container(0, 0);
    uiContainer.setScrollFactor(0);
    uiContainer.setDepth(1000);

    // Fondo de la barra (negro)
    const barBackground = this.add.rectangle(
        barConfig.x,
        barConfig.y,
        barConfig.width + barConfig.borderWidth,
        barConfig.height + barConfig.borderWidth,
        0x000000
    );

    // Barra base (rojo oscuro)
    const barBase = this.add.rectangle(
        barConfig.x,
        barConfig.y,
        barConfig.width,
        barConfig.height,
        0x880000
    );

    // Barra de vida (rojo brillante)
    const healthBar = this.add.rectangle(
        barConfig.x - barConfig.width/2,
        barConfig.y,
        barConfig.width,
        barConfig.height,
        0xff0000
    );
    healthBar.setOrigin(0, 0.5);

    // Texto de vida
    const healthText = this.add.text(
        barConfig.x,
        barConfig.y,
        `${playerHealth}/${playerHealth}`,
        {
            fontSize: '18px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);

    // Icono de corazón
    const heartIcon = this.add.text(
        barConfig.x - barConfig.width/2 - 25,
        barConfig.y,
        '❤',
        {
            fontSize: '24px',
            fill: '#ff0000'
        }
    ).setOrigin(0.5);

    // Score con fondo
    const scoreBackground = this.add.rectangle(
        barConfig.x,
        barConfig.y + 35,
        150,
        30,
        0x000000,
        0.7
    );

    const scoreText = this.add.text(
        barConfig.x,
        barConfig.y + 35,
        `Score: ${score}`,
        {
            fontSize: '20px',
            fill: '#ffff00',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);

    // Crear texto de debug (inicialmente oculto)
    debugText = this.add.text(10, 100, '', {
        fontSize: '16px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    });
    debugText.setScrollFactor(0);
    debugText.setDepth(1000);
    debugText.setVisible(debugVisible);

    // Agregar todo al contenedor
    uiContainer.add([
        barBackground,
        barBase,
        healthBar,
        healthText,
        heartIcon,
        scoreBackground,
        scoreText
    ]);

    // Guardar referencias para actualización
    this.healthBar = healthBar;
    this.healthText = healthText;
    this.scoreText = scoreText;
    this.maxHealth = playerHealth;
}

function updateScore(points) {
    score += points;
    this.scoreText.setText(`Score: ${score}`);
}

// Mover la configuración del juego después de las definiciones de clase
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainMenu, GameScene]
};

// Crear la instancia del juego después de toda la configuración
const game = new Phaser.Game(config); 