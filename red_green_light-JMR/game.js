/**
 * AVISO IMPORTANTE:
 * =================
 * Este archivo es OBSOLETO y ha sido reemplazado por la estructura modular en la carpeta 'js/'.
 * Por favor, utiliza el archivo index.html para acceder a la versión actualizada del juego.
 * 
 * Sin embargo, por si alguien carga este archivo directamente, hemos modificado la velocidad
 * para que el pingüino vaya más lento y tarde al menos 1 minuto en llegar al otro lado.
 */

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // Activamos el debug para ver las físicas
        }
    },
    input: {
        keyboard: {
            // Evitar que la barra espaciadora haga scroll en la página
            capture: [Phaser.Input.Keyboard.KeyCodes.SPACE]
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
let startLine;
let finishLine;
let trafficLight;
let trafficLightState = 'green'; // 'green' o 'red'
let cursors;
let spaceBar;
let isMoving = false;
let gameState = 'waiting'; // 'waiting', 'moving', 'paused', 'balancing', 'finished', 'dead'
let playerSpeed = 0;
let maxSpeed = 10; // Reducido desde 300 para que tarde al menos 1 minuto
let acceleration = 0.2; // Reducido desde 5 para una aceleración más gradual
let deceleration = 0.3; // Reducido para una desaceleración gradual
let minSpeedThreshold = 0.5; // Reducido para un umbral menor de detención
let lightTimer;
let greenLightMusic; // Variable para la música cuando el semáforo está verde

// Variables para el minijuego de equilibrio
let balanceBar;
let balanceTarget;
let balancePointer;
let balanceActive = false;
let balanceSuccess = false;
let balanceFails = 0;
let maxBalanceFails = 3;

let audioIndicator; // Variable para el indicador de audio

// Iniciar el juego
const game = new Phaser.Game(config);

// Cargar assets
function preload() {
    // Cargar el archivo de audio del usuario
    console.log('⭐ Intentando cargar el archivo de audio personalizado');
    this.load.audio('greenLight', 'assets/audio/greenLight.mp3');
}

// Función para crear sonido usando el audio del usuario
function createBeepSound(scene) {
    console.log('⭐ Creando sonido con el archivo de audio del usuario');
    
    try {
        // Verificar si el audio está en la caché de Phaser
        if (!scene.cache.audio.exists('greenLight')) {
            console.error('⭐ El archivo de audio no está en caché');
            return createFallbackSound(scene); // Crear sonido programático como respaldo
        }
        
        // Crear un objeto simple para mantener compatibilidad con la implementación actual
        const customSound = {
            isPlaying: false,
            soundObj: null
        };
        
        // Crear el objeto de sonido de Phaser
        try {
            customSound.soundObj = scene.sound.add('greenLight', { 
                loop: true,
                volume: 0.5
            });
            console.log('⭐ Archivo de audio cargado correctamente');
        } catch (error) {
            console.error('⭐ Error al crear el objeto de sonido:', error);
            return createFallbackSound(scene); // Crear sonido programático como respaldo
        }
        
        // Método para iniciar el sonido
        customSound.playCustom = function() {
            console.log('⭐ Reproduciendo audio del usuario');
            
            if (this.soundObj) {
                try {
                    this.soundObj.play();
                    this.isPlaying = true;
                    
                    // Mostrar indicador visual
                    if (audioIndicator) {
                        audioIndicator.setVisible(true);
                    }
                } catch (error) {
                    console.error('⭐ Error al reproducir el audio:', error);
                }
            }
        };
        
        // Método para pausar el sonido
        customSound.pauseCustom = function() {
            console.log('⭐ Pausando audio del usuario');
            
            if (this.soundObj) {
                try {
                    this.soundObj.pause();
                    this.isPlaying = false;
                    
                    // Ocultar indicador visual
                    if (audioIndicator) {
                        audioIndicator.setVisible(false);
                    }
                } catch (error) {
                    console.error('⭐ Error al pausar el audio:', error);
                }
            }
        };
        
        // Método para detener el sonido
        customSound.stopCustom = function() {
            console.log('⭐ Deteniendo audio del usuario');
            
            if (this.soundObj) {
                try {
                    this.soundObj.stop();
                    this.isPlaying = false;
                    
                    // Ocultar indicador visual
                    if (audioIndicator) {
                        audioIndicator.setVisible(false);
                    }
                } catch (error) {
                    console.error('⭐ Error al detener el audio:', error);
                }
            }
        };
        
        return customSound;
        
    } catch (error) {
        console.error('⭐ Error al crear sistema de audio con archivo:', error);
        return createFallbackSound(scene); // Crear sonido programático como respaldo
    }
}

// Función de respaldo para crear sonido programáticamente (mantiene el código anterior)
function createFallbackSound(scene) {
    console.log('⭐ Creando sonido programático de respaldo');
    
    try {
        // Crear un objeto simple con métodos similares a los de Phaser para mantener compatibilidad
        const customSound = {
            isPlaying: false,
            beepInterval: null
        };
        
        // Obtener el AudioContext directamente del navegador si está disponible
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            throw new Error("Web Audio API no soportada en este navegador");
        }
        
        // Crear un nuevo contexto de audio
        const audioContext = new AudioContext();
        
        // Función para reproducir un beep simple
        function playOneBeep() {
            try {
                // Crear nodos de audio
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                // Configurar el oscilador
                oscillator.type = 'sine';
                oscillator.frequency.value = 440; // 440Hz = La (A)
                
                // Configurar el volumen
                gainNode.gain.value = 0.1; // Volumen bajo
                
                // Conectar los nodos
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Programar el inicio y fin del sonido
                const now = audioContext.currentTime;
                oscillator.start(now);
                oscillator.stop(now + 0.2); // Duración: 0.2 segundos
                
                // Limpiar automáticamente
                oscillator.onended = function() {
                    oscillator.disconnect();
                    gainNode.disconnect();
                };
                
                return true;
            } catch (error) {
                console.error('Error al reproducir beep:', error);
                return false;
            }
        }
        
        // Método para iniciar el sonido
        customSound.playCustom = function() {
            console.log('⭐ Iniciando beep programático de respaldo');
            
            // Detener cualquier beep previo
            if (this.beepInterval) {
                clearInterval(this.beepInterval);
            }
            
            // Reproducir un beep inicial inmediatamente
            playOneBeep();
            
            // Configurar beeps repetitivos
            this.beepInterval = setInterval(() => {
                playOneBeep();
                
                // Mostrar indicador visual
                if (audioIndicator) {
                    audioIndicator.setVisible(true);
                }
            }, 500); // Intervalo entre beeps: 0.5 segundos
            
            this.isPlaying = true;
        };
        
        // Método para pausar el sonido
        customSound.pauseCustom = function() {
            console.log('⭐ Pausando beep programático de respaldo');
            if (this.beepInterval) {
                clearInterval(this.beepInterval);
                this.beepInterval = null;
            }
            this.isPlaying = false;
            
            // Ocultar indicador visual
            if (audioIndicator) {
                audioIndicator.setVisible(false);
            }
        };
        
        // Método para detener el sonido
        customSound.stopCustom = function() {
            console.log('⭐ Deteniendo beep programático de respaldo');
            this.pauseCustom(); // Mismo comportamiento que pausar por ahora
        };
        
        console.log('⭐ Sistema de beep de respaldo creado exitosamente');
        return customSound;
        
    } catch (error) {
        console.error('⭐ Error al crear sistema de audio de respaldo:', error);
        return null;
    }
}

// Crear elementos del juego
function create() {
    // Inicializar variables
    gameWidth = this.sys.game.config.width;
    gameHeight = this.sys.game.config.height;
    gameState = 'moving'; // Estado inicial: moving, paused, dead, finished
    
    // Verificar el estado del sistema de audio de Phaser
    console.log('Estado del sistema de audio:');
    console.log('- Audio habilitado:', this.sound.locked ? 'Bloqueado (requiere interacción)' : 'Desbloqueado');
    console.log('- Sonidos disponibles:', this.cache.audio.entries.size);
    console.log('- Greenlight en caché:', this.cache.audio.exists('greenLight'));
    
    // Si el audio está bloqueado, crear botón para desbloquearlo
    if (this.sound.locked) {
        console.log('Audio bloqueado - Creando botón para desbloquear');
        
        // Crear un botón para desbloquear el audio
        const unlockButton = this.add.rectangle(400, 300, 300, 100, 0x00ff00, 0.8);
        const unlockText = this.add.text(400, 300, 'CLICK PARA ACTIVAR SONIDO', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Hacer que el botón sea interactivo
        unlockButton.setInteractive();
        
        // Cuando se hace clic en el botón, desbloquear el audio
        unlockButton.on('pointerdown', () => {
            console.log('Intentando desbloquear audio por interacción del usuario');
            
            // Intentar reproducir el audio
            this.sound.unlock();
            
            // Verificar si se desbloqueó
            if (!this.sound.locked) {
                console.log('Audio desbloqueado correctamente');
                
                // Crear audio explícitamente después del desbloqueo
                console.log('⭐ Creando audio después del desbloqueo');
                try {
                    // Crear beep programáticamente
                    greenLightMusic = createBeepSound(this);
                    console.log('⭐ Objeto de audio creado:', greenLightMusic);
                    
                    // Iniciar la música si es posible
                    if (greenLightMusic && trafficLightState === 'green') {
                        greenLightMusic.playCustom();
                        console.log('⭐ Reproduciendo audio después del desbloqueo');
                    }
                } catch (error) {
                    console.error('⭐ Error al crear audio:', error);
                }
                
                // Eliminar el botón y texto
                unlockButton.destroy();
                unlockText.destroy();
            } else {
                console.log('No se pudo desbloquear el audio');
                unlockText.setText('INTENTA DE NUEVO\nCLICK PARA ACTIVAR SONIDO');
            }
        });
    }
    
    // Crear línea de inicio (verde) - Ahora a la izquierda
    const graphics1 = this.add.graphics();
    graphics1.fillStyle(0x00ff00, 1);
    graphics1.fillRect(100, 100, 5, 400);
    
    // Crear línea de meta (roja) - Ahora a la derecha
    const graphics2 = this.add.graphics();
    graphics2.fillStyle(0xff0000, 1);
    graphics2.fillRect(700, 100, 5, 400);
    
    // Crear el jugador usando un círculo gráfico
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x3498db, 1);
    playerGraphics.fillCircle(120, 300, 15);
    
    // Crear el jugador como un cuerpo físico
    player = this.physics.add.sprite(120, 300, '');
    player.setCircle(15);
    player.setDisplaySize(30, 30);
    player.setVisible(false); // Hacemos el sprite invisible ya que usamos el gráfico
    player.setCollideWorldBounds(true);
    player.setBounce(0);
    
    // Guardar referencia al gráfico del jugador
    player.playerGraphic = playerGraphics;
    
    // Crear semáforo - Reposicionado arriba
    trafficLight = this.add.circle(400, 50, 30, 0x00ff00);
    
    // Crear indicador de audio (inicialmente invisible)
    audioIndicator = this.add.text(650, 20, '♪ SONANDO', {
        fontSize: '16px',
        fill: '#ffffff',
        backgroundColor: '#00aa00',
        padding: { x: 5, y: 2 }
    }).setVisible(false);
    
    // Intentar crear el audio programáticamente
    try {
        // Crear beep programáticamente
        greenLightMusic = createBeepSound(this);
        
        // Verificar si se creó correctamente
        if (greenLightMusic) {
            console.log('⭐ Sonido programático creado correctamente');
            
            // Si el sistema de audio no está bloqueado, iniciar sonido
            if (!this.sound.locked && trafficLightState === 'green') {
                console.log('⭐ Iniciando sonido inicial');
                greenLightMusic.playCustom();
            }
        } else {
            console.error('⭐ No se pudo crear el sonido programático');
        }
    } catch (error) {
        console.error('⭐ Error al crear sonido programático:', error);
        greenLightMusic = null;
    }
    
    // Texto de instrucciones
    this.add.text(400, 520, 'Mantén presionado ESPACIO para acelerar', {
        fontSize: '18px',
        fill: '#fff'
    }).setOrigin(0.5);
    
    this.add.text(400, 550, 'Suelta ESPACIO para frenar gradualmente', {
        fontSize: '18px',
        fill: '#fff'
    }).setOrigin(0.5);
    
    this.add.text(400, 580, 'Debes detenerte cuando el semáforo está ROJO', {
        fontSize: '18px',
        fill: '#fff'
    }).setOrigin(0.5);
    
    // Configurar controles
    cursors = this.input.keyboard.createCursorKeys();
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Zona de meta - Ahora a la derecha
    finishZone = this.add.zone(700, 300).setSize(20, 400);
    this.physics.world.enable(finishZone);
    finishZone.body.setAllowGravity(false);
    finishZone.body.moves = false;
    
    // Colisión con meta
    this.physics.add.overlap(player, finishZone, reachFinish, null, this);
    
    // Iniciar temporizador para cambiar las luces
    this.time.addEvent({
        delay: Phaser.Math.Between(3000, 8000),
        callback: toggleLight,
        callbackScope: this,
        loop: false
    });
    
    // Texto de depuración
    this.debugText = this.add.text(10, 10, 'Debug: Esperando movimiento', {
        fontSize: '14px',
        fill: '#fff',
        backgroundColor: '#000'
    });
    
    // Testear tecla
    this.input.keyboard.on('keydown-SPACE', function() {
        console.log("TECLA ESPACIO PRESIONADA - EVENTO TECLADO");
    });
    
    // Añadir un botón de prueba de audio para verificar manualmente
    const testAudioButton = this.add.rectangle(730, 550, 120, 40, 0x0000ff, 0.8);
    const testAudioText = this.add.text(730, 550, "PROBAR AUDIO", {
        fontSize: '12px',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    testAudioButton.setInteractive();
    testAudioButton.on('pointerdown', () => {
        console.log('⭐ Botón de prueba de audio presionado');
        
        // Verificar si ya existe un objeto de sonido y detenerlo
        if (greenLightMusic && greenLightMusic.isPlaying) {
            greenLightMusic.pauseCustom();
        }
        
        // Verificar si el archivo de audio está disponible
        if (this.cache.audio.exists('greenLight')) {
            try {
                console.log('⭐ Probando el archivo de audio del usuario');
                
                // Crear objeto de sonido para la prueba
                const testSound = this.sound.add('greenLight', { loop: false, volume: 0.6 });
                
                // Reproducir el audio
                testSound.play();
                
                // Mostrar mensaje de éxito
                console.log('⭐⭐⭐ ¡ARCHIVO DE AUDIO FUNCIONANDO! ⭐⭐⭐');
                const successText = this.add.text(400, 450, '¡AUDIO FUNCIONANDO!', {
                    fontSize: '24px',
                    fill: '#00ff00',
                    backgroundColor: '#000',
                    padding: { x: 10, y: 5 }
                }).setOrigin(0.5).setDepth(100);
                
                // Eliminar el texto después de unos segundos
                this.time.delayedCall(3000, function() {
                    successText.destroy();
                }, [], this);
                
                return;
            } catch (error) {
                console.error('⭐ Error al probar archivo de audio:', error);
                // Continuamos con el método alternativo
            }
        }
        
        // Si llegamos aquí, el archivo no estaba disponible o hubo un error
        // Usar el método de respaldo con Web Audio API
        try {
            console.log('⭐ Usando prueba de audio programático de respaldo');
            
            // Obtener el AudioContext directamente del navegador
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                throw new Error("Web Audio API no soportada en este navegador");
            }
            
            // Crear un contexto de audio temporal para la prueba
            const audioContext = new AudioContext();
            
            // Crear nodos de audio
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Configurar el oscilador
            oscillator.type = 'sine';
            oscillator.frequency.value = 523.25; // 523.25Hz = Do (C)
            
            // Configurar el volumen
            gainNode.gain.value = 0.2;
            
            // Conectar los nodos
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Programar el inicio y fin del sonido
            oscillator.start();
            
            // Mostrar mensaje
            console.log('⭐⭐⭐ ¡AUDIO DE RESPALDO FUNCIONANDO! ⭐⭐⭐');
            const fallbackText = this.add.text(400, 450, '¡AUDIO DE RESPALDO!', {
                fontSize: '18px',
                fill: '#ffff00',
                backgroundColor: '#000',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setDepth(100);
            
            // Detener el sonido después de 1 segundo
            this.time.delayedCall(1000, function() {
                oscillator.stop();
                oscillator.disconnect();
                gainNode.disconnect();
                
                // Eliminar el texto después de otro segundo
                this.time.delayedCall(1000, function() {
                    fallbackText.destroy();
                }, [], this);
                
            }, [], this);
            
        } catch (error) {
            console.error('⭐ Error al probar audio de respaldo:', error);
            
            // Mostrar mensaje de error
            const errorText = this.add.text(400, 450, 'ERROR DE AUDIO', {
                fontSize: '24px',
                fill: '#ff0000',
                backgroundColor: '#000',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setDepth(100);
            
            // Eliminar el texto después de 2 segundos
            this.time.delayedCall(2000, function() {
                errorText.destroy();
            }, [], this);
        }
    });
    
    // Crear elementos del minijuego de equilibrio (inicialmente invisibles) - DESACTIVADO
    // createBalanceGame.call(this);
}

// Crear elementos para el minijuego de equilibrio
function createBalanceGame() {
    // Contenedor para el minijuego
    const balanceContainer = this.add.container(400, 300);
    balanceContainer.setVisible(false);
    
    // Fondo
    const balanceBg = this.add.rectangle(0, 0, 400, 200, 0x000000, 0.7);
    
    // Barra de equilibrio
    balanceBar = this.add.rectangle(0, 0, 300, 20, 0x888888);
    
    // Zona segura
    balanceTarget = this.add.rectangle(0, 0, 60, 20, 0x00ff00);
    
    // Puntero
    balancePointer = this.add.triangle(0, -40, 0, 0, 10, -15, -10, -15, 0xff0000);
    
    // Texto de instrucciones
    const balanceText = this.add.text(0, 50, 'Presiona ESPACIO cuando el puntero esté en la zona verde', {
        fontSize: '14px',
        fill: '#fff'
    }).setOrigin(0.5);
    
    // Añadir todos los elementos al contenedor
    balanceContainer.add([balanceBg, balanceBar, balanceTarget, balancePointer, balanceText]);
    
    // Guardar referencia al contenedor
    this.balanceContainer = balanceContainer;
}

// Iniciar minijuego de equilibrio
function startBalanceGame() {
    gameState = 'balancing';
    balanceActive = true;
    balanceSuccess = false;
    
    // Hacer visible el contenedor
    this.balanceContainer.setVisible(true);
    
    // Posición inicial aleatoria del puntero
    const startX = Phaser.Math.Between(-120, 120);
    balancePointer.x = startX;
    
    // Agregar tweens para mover el puntero de lado a lado
    this.tweens.add({
        targets: balancePointer,
        x: -130,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}

// Comprobar equilibrio
function checkBalance() {
    // Verificar si el puntero está dentro del objetivo
    if (Math.abs(balancePointer.x - balanceTarget.x) < 30) {
        balanceSuccess = true;
        endBalanceGame.call(this, true);
    } else {
        balanceFails++;
        if (balanceFails >= maxBalanceFails) {
            endBalanceGame.call(this, false);
        } else {
            // Continuar con el juego del equilibrio
            this.time.delayedCall(500, function() {
                balanceActive = true;
            }, [], this);
        }
    }
}

// Finalizar minijuego de equilibrio
function endBalanceGame(success) {
    balanceActive = false;
    this.balanceContainer.setVisible(false);
    
    // Detener el tween del puntero
    this.tweens.killTweensOf(balancePointer);
    
    if (success) {
        gameState = 'paused';
        playerSpeed = 0;
    } else {
        killPlayer.call(this);
    }
}

// Cambiar el estado del semáforo
function toggleLight() {
    if (trafficLightState === 'green') {
        // Detener la música primero si está disponible
        if (greenLightMusic) {
            try {
                console.log('⭐ Intentando pausar audio (cambio a rojo)');
                greenLightMusic.pauseCustom();  // Usar la nueva función
                console.log('⭐ Audio pausado correctamente');
            } catch (error) {
                console.error('⭐ Error al pausar el audio:', error);
            }
        } else {
            console.log('⭐ Objeto greenLightMusic no disponible para pausar');
        }
        
        // Cambiar a luz roja después de 0.2 segundos
        this.time.delayedCall(200, function() {
            // Cambiar a luz roja
            trafficLightState = 'red';
            trafficLight.setFillStyle(0xff0000);
            
            // Detectar si el jugador sigue moviéndose
            if (isMoving && gameState === 'moving') {
                killPlayer.call(this);
            }
        }, [], this);
        
        // Programar cambio a luz verde
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: toggleLight,
            callbackScope: this,
            loop: false
        });
    } else {
        // Cambiar a luz verde
        trafficLightState = 'green';
        trafficLight.setFillStyle(0x00ff00);
        
        // Iniciar la música cuando el semáforo esté verde (si está disponible)
        if (greenLightMusic) {
            try {
                console.log('⭐ Intentando reproducir audio (cambio a verde)');
                greenLightMusic.playCustom();  // Usar la nueva función
                console.log('⭐ Audio reproducido correctamente');
            } catch (error) {
                console.error('⭐ Error al reproducir el audio:', error);
            }
        } else {
            console.log('⭐ Objeto greenLightMusic no disponible para reproducir - creando nuevo');
            // Intentar crear un nuevo objeto de audio si no existe
            try {
                greenLightMusic = createBeepSound(this);
                if (greenLightMusic) {
                    console.log('⭐ Nuevo sonido programático creado y reproduciendo');
                    greenLightMusic.playCustom();
                }
            } catch (error) {
                console.error('⭐ Error al crear nuevo audio:', error);
            }
        }
        
        // Programar cambio a luz roja
        this.time.addEvent({
            delay: Phaser.Math.Between(3000, 8000),
            callback: toggleLight,
            callbackScope: this,
            loop: false
        });
    }
}

// Eliminar al jugador
function killPlayer() {
    gameState = 'dead';
    
    // Detener la música si está disponible
    if (greenLightMusic) {
        try {
            console.log('⭐ Intentando detener audio (jugador eliminado)');
            greenLightMusic.stopCustom();  // Usar la nueva función
            console.log('⭐ Audio detenido correctamente');
        } catch (error) {
            console.error('⭐ Error al detener el audio:', error);
        }
    } else {
        console.log('⭐ Objeto greenLightMusic no disponible para detener');
    }
    
    // Efecto visual de muerte
    this.tweens.add({
        targets: player,
        scale: 1.5,
        alpha: 0,
        y: player.y + 30,
        duration: 800,
        ease: 'Power2',
        onComplete: function() {
            // Mancha de sangre donde murió el jugador
            this.add.circle(player.x, player.y, 20, 0xff0000);
            
            // Limpiar el gráfico del jugador
            player.playerGraphic.clear();
            
            // Mensaje de game over
            this.add.text(400, 300, '¡ELIMINADO!', {
                fontSize: '48px',
                fill: '#ff0000'
            }).setOrigin(0.5);
            
            this.add.text(400, 350, 'Presiona R para reiniciar', {
                fontSize: '18px',
                fill: '#fff'
            }).setOrigin(0.5);
            
            // Tecla para reiniciar
            this.input.keyboard.once('keydown-R', function() {
                this.scene.restart();
            }, this);
        },
        callbackScope: this
    });
}

// Actualizar el juego
function update() {
    // Actualizar texto de depuración
    this.debugText.setText(`Debug: Estado: ${gameState}, Moviendo: ${isMoving}, Velocidad: ${playerSpeed.toFixed(1)}, PosX: ${player.x.toFixed(1)}`);
    
    // Control de movimiento con barra espaciadora
    if (spaceBar.isDown && (gameState === 'waiting' || gameState === 'paused' || gameState === 'moving')) {
        if (gameState !== 'moving') {
            gameState = 'moving';
            console.log("Cambiando a estado moving");
        }
        
        isMoving = true;
        
        // Aumentar velocidad mientras se mantiene pulsado (aceleración)
        if (playerSpeed < maxSpeed) {
            playerSpeed += acceleration;
            if (playerSpeed > maxSpeed) playerSpeed = maxSpeed;
        }
        
        // Mover al jugador hacia la derecha
        player.setVelocityX(playerSpeed);
        console.log("Velocidad: " + playerSpeed.toFixed(1));
    } 
    else if (gameState === 'moving') {
        // Si la barra espaciadora se suelta pero el jugador sigue en movimiento
        // Aplicamos desaceleración gradual (inercia)
        if (playerSpeed > 0) {
            playerSpeed -= deceleration;
            
            // Si la velocidad es muy baja, consideramos que el jugador está detenido
            if (playerSpeed <= minSpeedThreshold) {
                playerSpeed = 0;
                isMoving = false;
                player.setVelocity(0);
                console.log("Deteniendo jugador");
                
                // Sin minijuego, solo cambiamos al estado 'paused'
                gameState = 'paused';
            } else {
                // Seguimos moviendo el jugador pero más lento
                player.setVelocityX(playerSpeed);
                console.log("Frenando: " + playerSpeed.toFixed(1));
            }
        }
    }
    
    // Detectar movimiento durante luz roja
    if (trafficLightState === 'red' && isMoving && gameState === 'moving') {
        killPlayer.call(this);
    }
    
    // Actualizar la posición del gráfico para que siga al cuerpo físico
    if (gameState !== 'dead') {
        player.playerGraphic.clear();
        player.playerGraphic.fillStyle(0x3498db, 1);
        player.playerGraphic.fillCircle(player.x, player.y, 15);
    }
}

// Función para cuando el jugador llega a la meta
function reachFinish() {
    if (gameState === 'moving' || gameState === 'paused') {
        gameState = 'finished';
        player.setVelocity(0);
        
        // Detener la música si está disponible
        if (greenLightMusic) {
            try {
                console.log('⭐ Intentando detener audio (jugador ganó)');
                greenLightMusic.stopCustom();  // Usar la nueva función
                console.log('⭐ Audio detenido correctamente');
            } catch (error) {
                console.error('⭐ Error al detener el audio:', error);
            }
        } else {
            console.log('⭐ Objeto greenLightMusic no disponible para detener');
        }
        
        // Cambiar color del jugador a verde al ganar
        player.playerGraphic.clear();
        player.playerGraphic.fillStyle(0x00ff00, 1);
        player.playerGraphic.fillCircle(player.x, player.y, 15);
        
        // Mensaje de victoria
        this.add.text(400, 300, '¡META ALCANZADA!', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        this.add.text(400, 350, 'Presiona R para reiniciar', {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Tecla para reiniciar
        this.input.keyboard.once('keydown-R', function() {
            this.scene.restart();
        }, this);
    }
} 