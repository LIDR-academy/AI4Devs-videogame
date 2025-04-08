const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 300,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#87CEEB'
};

const game = new Phaser.Game(config);

// Variables globales
let dino;
let ground;
let obstacles;
let clouds;
let score = 0;
let scoreText;
let highScore = 0; // Récord histórico
let highScoreText; // Texto del récord
let gameSpeed = 2.5;
let isGameOver = false;
let gameOverText;
let restartText;
let lastObstacleTime = 0;
let lastSpeedIncreaseScore = 0;
let dinoGroundY = 285;
let cactusGroundY = 270;
let isNightMode = false; // Variable para controlar si estamos en modo nocturno
let lastDayNightSwitch = 0; // Para controlar cuándo fue el último cambio de día/noche
let highScoreBeaten = false; // Nueva variable para controlar si ya se ha batido el récord en esta partida

function preload() {
    // Cargar assets
    this.load.image('dino', 'assets/images/dino.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('cactus', 'assets/images/cactus.png');
    this.load.image('cloud', 'assets/images/cloud.png');
    
    // Cargar el high score del localStorage si existe
    if (localStorage.getItem('dinoHighScore')) {
        highScore = parseInt(localStorage.getItem('dinoHighScore'));
    }
}

function create() {
    // Configurar el fondo como día (cielo azul claro)
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Crear el suelo (ajustado para cubrir toda la escena)
    ground = this.add.tileSprite(0, 270, 1600, 32, 'ground');
    ground.setOrigin(0, 0);

    // Crear grupo de nubes
    clouds = this.add.group();
    for (let i = 0; i < 3; i++) {
        const cloud = clouds.create(200 + i * 200, Phaser.Math.Between(30, 100), 'cloud');
        cloud.setScale(0.3);
    }

    // Crear un suelo físico invisible para las colisiones
    const groundPhysics = this.physics.add.staticGroup();
    const invisibleGround = groundPhysics.create(400, dinoGroundY, 'ground');
    invisibleGround.setVisible(false);
    invisibleGround.setDisplaySize(800, 2);
    invisibleGround.refreshBody();

    // Crear el dinosaurio
    dino = this.physics.add.sprite(100, dinoGroundY, 'dino');
    dino.setCollideWorldBounds(true);
    dino.setGravityY(800);
    dino.setScale(0.12);
    dino.setOrigin(0.5, 1.0);
    dino.isFlipping = false;

    // Añadir colisión entre dinosaurio y suelo
    this.physics.add.collider(dino, groundPhysics, function() {
        // Asegurar que el dinosaurio esté a la altura correcta cuando toca el suelo
        if (dino.body.velocity.y === 0) {
            dino.y = dinoGroundY;
            
            // Si estaba haciendo un backflip, detener la rotación al tocar el suelo
            if (dino.isFlipping) {
                dino.isFlipping = false;
                dino.setAngle(0);
            }
        }
    });

    // Esperar un momento para asegurar que el dinosaurio aterrice correctamente
    this.time.delayedCall(100, function() {
        // Configurar controles después de que el dinosaurio haya aterrizado
        this.input.keyboard.on('keydown-SPACE', jump);
        this.input.keyboard.on('keydown-UP', jump);
    }, [], this);

    // Crear grupo de obstáculos
    obstacles = this.physics.add.group();

    // Crear texto de puntuación con sombra para mejor visibilidad - tamaño reducido y consistente
    scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '24px', // Reducido de 32px a 24px
        fill: '#000',
        stroke: '#fff',
        strokeThickness: 3 // Reducido de 4 a 3
    });
    
    // Crear texto de récord histórico - mismo tamaño que scoreText
    highScoreText = this.add.text(16, 50, 'High Score: ' + highScore, { 
        fontSize: '24px', // Mismo tamaño que scoreText
        fill: '#000',
        stroke: '#fff',
        strokeThickness: 3
    });

    // Añadir colisión entre dinosaurio y obstáculos
    this.physics.add.collider(dino, obstacles, hitObstacle, null, this);
}

function update() {
    if (isGameOver) return;

    // Mover el suelo
    ground.tilePositionX += gameSpeed;
    
    // Asegurar posición Y consistente cuando el dinosaurio está en el suelo
    if (dino.body.touching.down || dino.body.onFloor()) {
        if (Math.abs(dino.body.velocity.y) < 0.1) {  // Si prácticamente no se está moviendo verticalmente
            dino.y = dinoGroundY;
            
            // Si estaba haciendo un backflip, detener la rotación
            if (dino.isFlipping) {
                dino.isFlipping = false;
                dino.setAngle(0); // Resetear el ángulo
            }
        }
    }

    // Mover nubes
    clouds.children.iterate(function (cloud) {
        if (cloud) {  // Verificar que cloud no sea undefined
            cloud.x -= gameSpeed * 0.5;
            if (cloud.x < -100) {
                cloud.x = 800 + Math.random() * 100;
                cloud.y = 50 + Math.random() * 100;
            }
        }
    });

    // Verificar si hay obstáculos en la pantalla
    let obstaclesExist = false;
    let lastObstacleX = 1000; // Valor inicial alto
    
    obstacles.children.iterate(function (obstacle) {
        if (obstacle) {
            obstaclesExist = true;
            if (obstacle.x < lastObstacleX) {
                lastObstacleX = obstacle.x;
            }
        }
    });

    // Generar obstáculos con espacio suficiente entre ellos
    const currentTime = this.time.now;
    const minObstacleInterval = 1200; // Reducido de 1500 a 1200 ms
    
    // Condición para generar obstáculos:
    // 1. Si no hay obstáculos en la pantalla, generar uno con mayor probabilidad
    // 2. O si el último obstáculo ya pasó la mitad de la pantalla y ha pasado suficiente tiempo
    if ((!obstaclesExist && Phaser.Math.Between(0, 40) === 0) || // Aumentada la probabilidad de 1/60 a 1/40
        (obstaclesExist && lastObstacleX < 400 && currentTime - lastObstacleTime > minObstacleInterval && 
         Phaser.Math.Between(0, 120) === 0)) { // Aumentada la probabilidad de 1/180 a 1/120
        
        const obstacle = obstacles.create(800, cactusGroundY, 'cactus'); // Usar cactusGroundY en lugar de dinoGroundY
        obstacle.setScale(0.35);
        obstacle.body.setSize(obstacle.width * 0.35, obstacle.height * 0.35);
        obstacle.body.setAllowGravity(false);
        
        // Aplicar tinte según el modo día/noche
        if (isNightMode) {
            obstacle.setTint(0xDDDDDD);
        }
        
        // Actualizar el tiempo del último obstáculo
        lastObstacleTime = currentTime;
    }

    // Mover obstáculos
    obstacles.children.iterate(function (obstacle) {
        if (obstacle) {  // Verificar que obstacle no sea undefined
            obstacle.x -= gameSpeed;
            if (obstacle.x < -50) {
                obstacle.destroy();
                score += 10;
                scoreText.setText('Score: ' + score);
                
                // Verificar si se ha superado el récord histórico por primera vez en esta partida
                if (score > highScore && !highScoreBeaten) {
                    highScore = score;
                    highScoreText.setText('High Score: ' + highScore);
                    localStorage.setItem('dinoHighScore', highScore.toString());
                    highScoreBeaten = true; // Marcar que ya se ha batido el récord en esta partida
                    
                    // Crear una animación pulsante para el texto de récord
                    this.tweens.add({
                        targets: highScoreText,
                        scale: { from: 1, to: 1.2 },
                        alpha: { from: 1, to: 0.7 },
                        duration: 300,
                        yoyo: true,
                        repeat: 2,
                        ease: 'Sine.easeInOut',
                        onStart: function() {
                            // Cambiar el color a dorado al iniciar
                            highScoreText.setFill('#FFD700');
                            highScoreText.setStroke('#FFFFFF', 5);
                        },
                        onComplete: function() {
                            // Volver al color normal después de la animación
                            setTimeout(function() {
                                highScoreText.setFill(isNightMode ? '#FFFFFF' : '#000000');
                                highScoreText.setStroke('#FFFFFF', 3);
                            }, 1000);
                        }
                    });
                }
                else if (score > highScore && highScoreBeaten) {
                    // Solo actualizar el valor sin animación
                    highScore = score;
                    highScoreText.setText('High Score: ' + highScore);
                    localStorage.setItem('dinoHighScore', highScore.toString());
                }
                
                // Comprobar si debemos cambiar entre día y noche (cada 300 puntos)
                if (Math.floor(score / 300) > Math.floor(lastDayNightSwitch / 300)) {
                    // Cambiar entre modo día y noche
                    isNightMode = !isNightMode;
                    
                    if (isNightMode) {
                        // Cambiar a modo noche
                        this.cameras.main.setBackgroundColor('#1a237e'); // Cambiado de #333333 a azul noche oscuro
                        ground.setTint(0xAACCFF); // Suelo con tinte azulado
                        dino.setTint(0xEEEEFF); // Dinosaurio con tinte ligeramente azulado
                        clouds.children.iterate(function(cloud) {
                            if (cloud) cloud.setTint(0xBBCCFF); // Nubes con tinte azulado
                        });
                        scoreText.setColor('#FFFFFF'); // Texto blanco
                        highScoreText.setColor('#FFFFFF'); // Texto de récord también blanco
                    } else {
                        // Cambiar a modo día
                        this.cameras.main.setBackgroundColor('#87CEEB'); // Fondo azul claro
                        ground.clearTint(); // Suelo normal
                        dino.clearTint(); // Dinosaurio normal
                        clouds.children.iterate(function(cloud) {
                            if (cloud) cloud.clearTint();
                        });
                        scoreText.setColor('#000000'); // Texto negro
                        highScoreText.setColor('#000000'); // Texto de récord también negro
                    }
                    
                    // Efecto visual de transición
                    this.cameras.main.flash(500, isNightMode ? 0 : 255, isNightMode ? 0 : 255, isNightMode ? 0 : 255);
                    
                    // Actualizar el último puntaje en el que se cambió
                    lastDayNightSwitch = score;
                }
                
                // Aumentar velocidad cada 100 puntos
                if (Math.floor(score / 100) > Math.floor(lastSpeedIncreaseScore / 100)) {
                    // Aumentar la velocidad
                    gameSpeed += 0.5;  // Aumentado de 0.3 a 0.5
                    
                    // Limitar la velocidad máxima
                    if (gameSpeed > 9.0) {  // Aumentado de 7.5 a 9.0
                        gameSpeed = 9.0;
                    }
                    
                    // Efecto visual para indicar el aumento de velocidad
                    this.cameras.main.flash(300, 255, 255, 0); // Flash amarillo
                    
                    // Actualizar el último puntaje en el que se aumentó la velocidad
                    lastSpeedIncreaseScore = score;
                }
            }
        }
    }, this);
}

function jump() {
    if ((dino.body.touching.down || dino.body.onFloor()) && !isGameOver) {
        dino.setVelocityY(-500);  // Cambiado de -400 a -500 para un salto más alto
        
        // Iniciar el backflip
        dino.isFlipping = true;
        
        // Remover cualquier tween anterior que pueda estar activo
        if (dino.flipTween) {
            dino.flipTween.stop();
        }
        
        // Crear un tween para rotar 360 grados
        dino.flipTween = dino.scene.tweens.add({
            targets: dino,
            angle: 360,
            duration: 800,  // Aumentado de 700 a 800 ms para que coincida con el salto más alto
            ease: 'Linear',
            onComplete: function() {
                dino.setAngle(0); // Asegurar que el ángulo vuelva a 0 al final
            }
        });
    }
}

function hitObstacle() {
    // Directamente llamar a gameOver (ya no hay sistema de vidas)
    gameOver.call(this);
}

function gameOver() {
    isGameOver = true;
    this.physics.pause();
    
    // Si el puntaje actual es mayor que el récord, guardarlo
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore.toString());
        highScoreText.setText('High Score: ' + highScore);
        
        // En lugar de mostrar un texto de nuevo récord, hacer que el texto de highScore se ilumine
        this.tweens.add({
            targets: highScoreText,
            scale: { from: 1, to: 1.3 },
            alpha: { from: 1, to: 0.7 },
            duration: 400,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut',
            onStart: function() {
                // Cambiar el color a dorado al iniciar
                highScoreText.setFill('#FFD700');
                highScoreText.setStroke('#FFFFFF', 5);
            }
        });
    }
    
    // Mejorar la visibilidad de los textos de Game Over y centrarlos mejor
    gameOverText = this.add.text(400, 120, 'Game Over', { // Centrado horizontalmente y ajustado verticalmente
        fontSize: '64px', 
        fill: isNightMode ? '#FFFFFF' : '#000000',
        stroke: isNightMode ? '#000000' : '#FFFFFF',
        strokeThickness: 6 
    });
    gameOverText.setOrigin(0.5); // Centrar desde el punto medio
    
    restartText = this.add.text(400, 200, 'Press SPACE to restart', { // Centrado horizontalmente y ajustado verticalmente
        fontSize: '32px', 
        fill: isNightMode ? '#FFFFFF' : '#000000',
        stroke: isNightMode ? '#000000' : '#FFFFFF',
        strokeThickness: 4
    });
    restartText.setOrigin(0.5); // Centrar desde el punto medio
    
    // Remover el evento anterior si existe
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    // Añadir el nuevo evento de reinicio
    this.input.keyboard.once('keydown-SPACE', restart, this);
}

function restart() {
    // Eliminar específicamente los textos de Game Over
    if (gameOverText) gameOverText.destroy();
    if (restartText) restartText.destroy();
    
    // Limpiar otros textos que puedan haberse creado
    this.children.list.forEach(child => {
        if (child.type === 'Text' && child !== scoreText && child !== highScoreText) {
            child.destroy();
        }
    });

    // Reiniciar el estado del juego
    isGameOver = false;
    score = 0;
    gameSpeed = 2.5;
    lastSpeedIncreaseScore = 0;
    highScoreBeaten = false; // Reiniciar la variable para la próxima partida
    
    // Reiniciar modo día/noche
    isNightMode = false;
    lastDayNightSwitch = 0;
    this.cameras.main.setBackgroundColor('#87CEEB'); // Volver al fondo de día
    ground.clearTint(); // Quitar tinte del suelo
    dino.clearTint(); // Quitar tinte del dinosaurio
    clouds.children.iterate(function(cloud) {
        if (cloud) cloud.clearTint();
    });
    
    // Reiniciar textos
    scoreText.setText('Score: 0');
    scoreText.setColor('#000000'); // Reiniciar color
    highScoreText.setText('High Score: ' + highScore);
    highScoreText.setColor('#000000'); // Reiniciar color
    highScoreText.setScale(1); // Asegurar que la escala vuelva a 1
    highScoreText.setAlpha(1); // Asegurar que la opacidad vuelva a 1
    highScoreText.setStroke('#FFFFFF', 3); // Reiniciar el trazo
    
    // Reiniciar física
    this.physics.resume();
    
    // Limpiar obstáculos
    obstacles.clear(true);
    
    // Reiniciar posición del dinosaurio
    dino.setPosition(100, dinoGroundY);
    dino.setVelocityY(0);
    dino.clearTint();
    dino.setAngle(0);
    dino.isFlipping = false;
    
    // Si hay un tween activo, detenerlo
    if (dino.flipTween) {
        dino.flipTween.stop();
    }
    
    // Remover el evento de reinicio
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    // Restaurar el evento de salto
    this.input.keyboard.on('keydown-SPACE', jump);
    this.input.keyboard.on('keydown-UP', jump);
} 