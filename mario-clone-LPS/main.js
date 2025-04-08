// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales
let player;
let platforms;
let coins;
let enemies;
let cursors;
let score = 0;
let scoreText;
let gameOver = false;
let gameOverText;
let movingPlatform;
let level = 1; // Nuevo: nivel actual
let levelText; // Nuevo: texto del nivel

// Iniciar el juego
const game = new Phaser.Game(config);

// Cargar assets
function preload() {
    // Fondo
    this.load.image('sky', 'assets/images/skies/sky4.png');
    this.load.image('sky2', 'assets/images/skies/space3.png');
    this.load.image('sky3', 'assets/images/skies/sky1.png');
    this.load.image('sky4', 'assets/images/skies/nebula.jpg');
    
    // Plataformas y suelo
    this.load.image('ground', 'assets/images/sprites/platform.png');
    this.load.image('block', 'assets/images/sprites/block.png');
    
    // Monedas
    this.load.image('coin', 'assets/images/sprites/coin.png');
    
    // Jugador (Mario)
    this.load.spritesheet('mario', 
        'assets/images/sprites/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    
    // Enemigos
    this.load.image('enemy', 'assets/images/sprites/slime.png');
}

// Crear elementos del juego
function create() {
    createLevel.call(this);
}

// Función para crear un nivel
function createLevel() {
    // Limpiar nivel anterior si existe
    if (platforms) {
        platforms.clear(true, true);
    }
    if (coins) {
        coins.clear(true, true);
    }
    if (enemies) {
        enemies.clear(true, true);
    }
    
    // Elegir un fondo aleatorio dependiendo del nivel
    const skyImages = ['sky', 'sky2', 'sky3', 'sky4'];
    const skyIndex = (level - 1) % skyImages.length;
    this.add.image(400, 300, skyImages[skyIndex]);
    
    // Plataformas estáticas
    platforms = this.physics.add.staticGroup();
    
    // Crear suelo (más ancho para que sea visible en toda la pantalla)
    for (let i = 0; i < 5; i++) {
        platforms.create(200 * i - 100, 568, 'ground').setScale(2, 1).refreshBody();
    }
    
    // Crear plataformas según el nivel
    createPlatforms.call(this);
    
    // Jugador (posición más a la izquierda)
    if (!player) {
        // Crear jugador por primera vez
        player = this.physics.add.sprite(80, 450, 'mario');
        player.setBounce(0.1);
        player.setCollideWorldBounds(true);
        player.setVisible(true);
        player.active = true;
        player.alpha = 1;
        
        // Animaciones del jugador
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'mario', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('mario', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    } else {
        // Reiniciar posición del jugador para el nuevo nivel
        // Primero asegurar que el jugador es visible
        player.setVisible(true);
        player.active = true;
        player.alpha = 1;
        
        // Luego configurar propiedades físicas
        player.setPosition(80, 450);
        player.setVelocity(0, 0);
        player.clearTint();
        player.body.enable = true;
        
        // Es importante llamar a enableBody al final, después de las propiedades visuales
        player.enableBody(true, 80, 450, true, true);
    }
    
    // Monedas - redistribuidas para que sean MUY accesibles
    coins = this.physics.add.group();
    
    // Crear monedas según el nivel
    createCoins.call(this);
    
    // Crear enemigos
    enemies = this.physics.add.group();
    
    // Crear enemigos según el nivel
    createEnemies.call(this);
    
    // Marcador y nivel
    if (!scoreText) {
        scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        });
        
        levelText = this.add.text(650, 16, 'Nivel: 1', { 
            fontSize: '32px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        });
    } else {
        levelText.setText('Nivel: ' + level);
    }
    
    // Game Over texto (oculto inicialmente)
    if (!gameOverText) {
        gameOverText = this.add.text(400, 300, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        gameOverText.visible = false;
    }
    
    // Colisiones
    this.physics.add.collider(player, platforms);
    if (movingPlatform) {
        this.physics.add.collider(player, movingPlatform);
    }
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(enemies, platforms);
    if (movingPlatform) {
        this.physics.add.collider(enemies, movingPlatform);
    }
    
    // Colisión entre jugador y enemigos
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    
    // Recolección de monedas
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    
    // Controles
    if (!cursors) {
        cursors = this.input.keyboard.createCursorKeys();
    }
}

// Función para crear plataformas según el nivel
function createPlatforms() {
    // Posiciones base para plataformas (nivel 1)
    const basePositions = [
        // Plataforma de inicio
        { x: 100, y: 470, blocks: 2 },
        // Plataformas escalonadas
        { x: 280, y: 400, blocks: 2 },
        { x: 450, y: 350, blocks: 2 },
        { x: 620, y: 290, blocks: 2 },
        // Plataforma superior izquierda
        { x: 160, y: 250, blocks: 2 },
        // Plataforma superior central
        { x: 350, y: 200, blocks: 3 }
    ];
    
    // Añadir plataformas base
    basePositions.forEach(pos => {
        for (let i = 0; i < pos.blocks; i++) {
            platforms.create(pos.x + (i * 60), pos.y, 'block');
        }
    });
    
    // Añadir plataformas adicionales según el nivel (a partir del nivel 2)
    if (level > 1) {
        // Número de plataformas adicionales basado en el nivel
        const additionalPlatforms = Math.min(level, 5); // Máximo 5 plataformas adicionales
        
        for (let i = 0; i < additionalPlatforms; i++) {
            // Elegir una región del mapa que no interfiera con rutas críticas
            let regionX, regionY;
            
            // Dividir el espacio en regiones para evitar bloqueos
            const region = Math.floor(Math.random() * 5);
            switch (region) {
                case 0: // Arriba izquierda
                    regionX = 50 + Math.floor(Math.random() * 150);
                    regionY = 150 + Math.floor(Math.random() * 100);
                    break;
                case 1: // Arriba derecha
                    regionX = 500 + Math.floor(Math.random() * 200);
                    regionY = 150 + Math.floor(Math.random() * 100);
                    break;
                case 2: // Centro izquierda
                    regionX = 50 + Math.floor(Math.random() * 150);
                    regionY = 300 + Math.floor(Math.random() * 100);
                    break;
                case 3: // Centro derecha
                    regionX = 500 + Math.floor(Math.random() * 200);
                    regionY = 300 + Math.floor(Math.random() * 100);
                    break;
                case 4: // Área central (evitar bloquear zona principal)
                    regionX = 250 + Math.floor(Math.random() * 200);
                    regionY = 150 + Math.floor(Math.random() * 100);
                    break;
            }
            
            const blocks = 1 + Math.floor(Math.random() * 2); // 1 o 2 bloques
            
            for (let j = 0; j < blocks; j++) {
                platforms.create(regionX + (j * 60), regionY, 'block');
            }
        }
    }
    
    // Plataforma móvil (presente en todos los niveles)
    // Se crea una nueva para cada nivel con posición y velocidad diferente
    if (movingPlatform) {
        movingPlatform.destroy();
    }
    
    // La plataforma móvil se vuelve más rápida en niveles superiores, pero limitada
    // para que sea usable como transporte
    const platformSpeed = Math.min(100 + (level * 8), 180);
    movingPlatform = this.physics.add.image(400, 430, 'block');
    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityX(platformSpeed);
    movingPlatform.setFriction(1);
    movingPlatform.leftBound = 200;
    movingPlatform.rightBound = 600;
}

// Función para crear monedas según el nivel
function createCoins() {
    // Base de 10 monedas + 2 por nivel adicional
    const coinCount = 10 + ((level - 1) * 2);
    
    // Monedas en el suelo (siempre presentes)
    createCoinAt(this, 80, 520);
    createCoinAt(this, 140, 520);
    createCoinAt(this, 200, 520);
    
    // Monedas sobre plataformas fijas (siempre accesibles)
    // Plataforma de inicio
    createCoinAt(this, 100, 430);
    createCoinAt(this, 160, 430);
    
    // Plataformas escalonadas
    createCoinAt(this, 280, 360);
    createCoinAt(this, 340, 360);
    createCoinAt(this, 450, 310);
    createCoinAt(this, 510, 310);
    createCoinAt(this, 620, 250);
    createCoinAt(this, 680, 250);
    
    // Plataforma superior izquierda
    createCoinAt(this, 160, 210);
    createCoinAt(this, 220, 210);
    
    // Plataforma superior central
    createCoinAt(this, 350, 160);
    createCoinAt(this, 410, 160);
    createCoinAt(this, 470, 160);
    
    // Monedas aleatorias adicionales para niveles superiores
    // Solo generar monedas aleatorias adicionales si es necesario
    const fixedCoins = 16; // Número de monedas fijas que hemos colocado
    if (coinCount > fixedCoins) {
        // Generar solo las monedas adicionales necesarias
        for (let i = 0; i < coinCount - fixedCoins; i++) {
            // Asegurarse de que las monedas estén en lugares accesibles
            // Preferiblemente cerca de plataformas o en rutas de salto posibles
            let x, y;
            
            // 70% cerca de plataformas existentes, 30% en el aire pero alcanzables
            if (Math.random() < 0.7) {
                // Cerca de plataformas existentes
                const platformIndex = Math.floor(Math.random() * 6);
                switch (platformIndex) {
                    case 0: // Plataforma de inicio
                        x = 100 + Math.random() * 120;
                        y = 430 - Math.random() * 60;
                        break;
                    case 1: // Plataforma escalonada 1
                        x = 280 + Math.random() * 120;
                        y = 360 - Math.random() * 60;
                        break;
                    case 2: // Plataforma escalonada 2
                        x = 450 + Math.random() * 120;
                        y = 310 - Math.random() * 60;
                        break;
                    case 3: // Plataforma escalonada 3
                        x = 620 + Math.random() * 120;
                        y = 250 - Math.random() * 60;
                        break;
                    case 4: // Plataforma superior izquierda
                        x = 160 + Math.random() * 120;
                        y = 210 - Math.random() * 60;
                        break;
                    case 5: // Plataforma superior central
                        x = 350 + Math.random() * 180;
                        y = 160 - Math.random() * 60;
                        break;
                }
            } else {
                // En áreas alcanzables con saltos
                // Espacios intermedios entre plataformas pero alcanzables
                const jumpArea = Math.floor(Math.random() * 5);
                switch (jumpArea) {
                    case 0: // Entre inicio y escalonada 1
                        x = 180 + Math.random() * 100;
                        y = 380 + Math.random() * 40;
                        break;
                    case 1: // Entre escalonada 1 y 2
                        x = 360 + Math.random() * 90;
                        y = 330 + Math.random() * 30;
                        break;
                    case 2: // Entre escalonada 2 y 3
                        x = 530 + Math.random() * 90;
                        y = 280 + Math.random() * 30;
                        break;
                    case 3: // Entre superior izquierda y central
                        x = 240 + Math.random() * 110;
                        y = 180 + Math.random() * 30;
                        break;
                    case 4: // Debajo de plataforma móvil
                        x = 350 + Math.random() * 100;
                        y = 380 + Math.random() * 30;
                        break;
                }
            }
            
            createCoinAt(this, x, y);
        }
    }
}

// Función para crear enemigos según el nivel
function createEnemies() {
    // Solo un enemigo en el nivel 1 (posicionado estratégicamente para no bloquear rutas)
    if (level === 1) {
        // Colocar el enemigo en el suelo donde no bloquee el acceso a plataformas importantes
        createEnemyAt(this, 400, 520, 300, 500, 50); // Un solo enemigo en el suelo nivel 1
    } else {
        // En niveles posteriores, aumentar la cantidad de enemigos
        // Nivel 2: 2 enemigos, Nivel 3: 3 enemigos, etc. (máximo 8)
        const enemyCount = Math.min(level, 8);
        
        // Posiciones posibles para los enemigos, asegurando que no bloqueen rutas críticas
        const possiblePositions = [
            { x: 400, y: 520, left: 300, right: 500, speed: 50 }, // Suelo central
            { x: 650, y: 520, left: 550, right: 750, speed: 60 }, // Suelo derecha
            { x: 150, y: 520, left: 50, right: 250, speed: 60 },  // Suelo izquierda
            { x: 310, y: 380, left: 280, right: 340, speed: 40 }, // Escalonada 1 - limitada
            { x: 480, y: 330, left: 450, right: 510, speed: 40 }, // Escalonada 2 - limitada
            { x: 650, y: 270, left: 620, right: 680, speed: 40 }, // Escalonada 3 - limitada
            { x: 190, y: 230, left: 160, right: 220, speed: 40 }  // Superior izquierda - limitada
        ];
        
        // En niveles superiores añadir la plataforma superior central
        if (level > 3) {
            possiblePositions.push({ x: 410, y: 180, left: 350, right: 470, speed: 50 }); // Superior central
        }
        
        // Agregar posiciones aleatorias para niveles superiores
        if (level > 4) {
            for (let i = 0; i < 2; i++) {
                const x = 100 + Math.floor(Math.random() * 600);
                const y = 520; // En el suelo para posiciones aleatorias
                const left = Math.max(50, x - 100);
                const right = Math.min(750, x + 100);
                const speed = 60 + (level * 5); // Más rápido en niveles superiores
                
                possiblePositions.push({ x, y, left, right, speed });
            }
        }
        
        // Asegurar que al menos 2-3 plataformas queden sin enemigos para facilitar movimiento
        // Mezclamos y limitamos para tener variedad pero manteniendo completable el nivel
        
        // Mezclar posiciones aleatoriamente
        for (let i = possiblePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [possiblePositions[i], possiblePositions[j]] = [possiblePositions[j], possiblePositions[i]];
        }
        
        // Seleccionar posiciones para los enemigos (limitando para evitar bloqueos)
        for (let i = 0; i < Math.min(enemyCount, possiblePositions.length); i++) {
            const pos = possiblePositions[i];
            
            // Crear enemigo con velocidad ajustada según nivel
            // Velocidad limitada para enemigos en plataformas para que no cubran toda la plataforma
            const adjustedSpeed = pos.y < 500 ? Math.min(pos.speed, 40 + (level * 3)) : pos.speed + (level * 4);
            
            createEnemyAt(this, pos.x, pos.y, pos.left, pos.right, adjustedSpeed);
        }
    }
}

// Función para crear moneda en posición específica
function createCoinAt(scene, x, y) {
    const coin = coins.create(x, y, 'coin');
    coin.setBounceY(0);
    coin.setScale(0.5);
}

// Función para crear enemigo en posición específica con patrulla
function createEnemyAt(scene, x, y, leftBound, rightBound, speed) {
    const enemy = enemies.create(x, y, 'enemy');
    enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(speed);
    
    // Personalizar el tamaño del enemigo
    enemy.setScale(0.7);
    
    // Guardar límites de patrulla
    enemy.leftBound = leftBound;
    enemy.rightBound = rightBound;
    enemy.speed = speed;
    
    // Propiedad para el color del tint (diferente color según nivel)
    const colors = [0xff0000, 0xff6600, 0xffff00, 0x00ff00, 0x0000ff, 0x9900ff];
    const colorIndex = (level - 1) % colors.length;
    enemy.setTint(colors[colorIndex]);
}

// Actualizar el juego (loop)
function update() {
    if (gameOver) {
        return;
    }
    
    // Actualizar los límites de la plataforma móvil (ampliados)
    if (movingPlatform.x >= movingPlatform.rightBound) {
        movingPlatform.setVelocityX(-movingPlatform.body.velocity.x);
    } else if (movingPlatform.x <= movingPlatform.leftBound) {
        movingPlatform.setVelocityX(Math.abs(movingPlatform.body.velocity.x));
    }
    
    // Movimiento horizontal
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        // Desaceleración suave cuando no se presionan teclas
        player.setVelocityX(player.body.velocity.x * 0.9);
        
        // Si la velocidad es muy baja, detener por completo
        if (Math.abs(player.body.velocity.x) < 10) {
            player.setVelocityX(0);
        }
        
        player.anims.play('turn');
    }
    
    // Salto - aumentado para mayor capacidad de alcance
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-580); // Aumentado para mejor alcance vertical
    }
    
    // Actualizar movimiento de enemigos (patrulla)
    enemies.children.iterate(function (enemy) {
        if (enemy.x <= enemy.leftBound) {
            enemy.setVelocityX(enemy.speed);
        } else if (enemy.x >= enemy.rightBound) {
            enemy.setVelocityX(-enemy.speed);
        }
    });
    
    // Verificar si el jugador cayó fuera del mundo
    if (player.y > config.height) {
        showGameOver();
    }
}

// Función cuando el jugador golpea a un enemigo
function hitEnemy(player, enemy) {
    // Verificar si el jugador está cayendo sobre el enemigo (lo elimina)
    if (player.body.velocity.y > 0 && player.y < enemy.y - 15) {
        // El jugador cae sobre el enemigo - eliminar enemigo
        enemy.disableBody(true, true);
        
        // Dar un pequeño impulso al jugador después de eliminar al enemigo
        player.setVelocityY(-300);
        
        // Añadir puntos por eliminar enemigo
        score += 20;
        scoreText.setText('Score: ' + score);
    } else {
        // El jugador golpea al enemigo de lado - game over
        showGameOver.call(this, "¡TOCASTE UN ENEMIGO!");
    }
}

// Función para recolectar monedas
function collectCoin(player, coin) {
    coin.disableBody(true, true);
    
    // Actualizar puntuación
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // Verificar si quedan monedas
    if (coins.countActive(true) === 0) {
        // Completaste el nivel! Mostrar mensaje
        const levelCompleteText = this.add.text(400, 300, '¡NIVEL COMPLETADO!', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Asegurar que el jugador sea visible y esté activo
        player.setVisible(true);
        player.active = true;
        player.alpha = 1;
        
        // Pausar el juego brevemente pero mantener el jugador visible
        this.physics.pause();
        
        // Avanzar al siguiente nivel después de 2 segundos
        this.time.delayedCall(2000, nextLevel, [], this);
    }
}

// Función para avanzar al siguiente nivel
function nextLevel() {
    // Incrementar nivel
    level++;
    
    // Reiniciar la física
    this.physics.resume();
    
    // Asegurar que el jugador esté en un estado correcto antes de empezar el nivel
    if (player) {
        // Primero hacer visible y activo el jugador
        player.setVisible(true);
        player.active = true;
        player.alpha = 1;
        
        // Luego reactivar físicas y posicionar
        player.clearTint();
        player.body.enable = true;
        player.enableBody(true, 80, 450, true, true);
    }
    
    // Crear nuevo nivel
    createLevel.call(this);
}

// Mostrar Game Over
function showGameOver(message) {
    gameOver = true;
    
    // Mostrar el mensaje específico o el predeterminado
    if (message) {
        gameOverText.setText(message);
    } else {
        gameOverText.setText('GAME OVER');
    }
    
    gameOverText.visible = true;
    player.setTint(0xff0000);
    player.anims.play('turn');
    
    // Detener a los enemigos
    enemies.children.iterate(function(enemy) {
        enemy.setVelocityX(0);
    });
    
    // Reiniciar después de 3 segundos
    this.time.delayedCall(3000, resetGame, [], this);
}

// Reiniciar juego
function resetGame() {
    gameOver = false;
    gameOverText.visible = false;
    score = 0;
    level = 1; // Reiniciar al nivel 1
    
    // Actualizar marcador
    scoreText.setText('Score: 0');
    
    // Crear nivel 1
    createLevel.call(this);
}
