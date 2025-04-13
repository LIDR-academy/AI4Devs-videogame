/**
 * GameScene - Escena principal del juego "Luz Roja, Luz Verde"
 */
import Player from '../entities/Player.js';
import Bot from '../entities/Bot.js';
import TrafficLight from '../entities/TrafficLight.js';
import { 
    GAME_CONFIG, 
    PLAYER_CONFIG,
    BOT_CONFIG,
    LINES_CONFIG, 
    GAME_STATES,
    TRAFFIC_LIGHT_STATES,
    GAME_TEXTS,
    AUDIO_CONFIG
} from '../config/gameConfig.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Cargar el archivo de audio para la luz verde
        this.load.audio('greenLight', 'assets/audio/greenLight.mp3');
        
        // Cargar el sonido de la pistola para la muerte del pingüino
        this.load.audio('pistol', 'assets/audio/pistol.mp3');
        
        // Generar imágenes dinámicamente para el efecto de sangre
        this.generateBloodParticle();
        this.generateBloodPuddle();
        
        // Cargar sprites del pingüino
        this.load.image('penguin_walk1', 'assets/sprites/penguin_walk01.png');
        this.load.image('penguin_walk2', 'assets/sprites/penguin_walk02.png');
        this.load.image('penguin_walk3', 'assets/sprites/penguin_walk03.png');
        this.load.image('penguin_walk4', 'assets/sprites/penguin_walk04.png');
        
        this.load.image('penguin_slide1', 'assets/sprites/penguin_slide01.png');
        this.load.image('penguin_slide2', 'assets/sprites/penguin_slide02.png');
        
        this.load.image('penguin_die1', 'assets/sprites/penguin_die01.png');
        this.load.image('penguin_die2', 'assets/sprites/penguin_die02.png');
        this.load.image('penguin_die3', 'assets/sprites/penguin_die03.png');
        this.load.image('penguin_die4', 'assets/sprites/penguin_die04.png');
        
        this.load.image('penguin_hurt', 'assets/sprites/penguin_hurt.png');
    }

    /**
     * Genera una imagen de partícula de sangre dinámicamente
     */
    generateBloodParticle() {
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        
        // Fondo transparente
        ctx.clearRect(0, 0, 8, 8);
        
        // Dibujar partícula como círculo blanco
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, 4, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Cargar en Phaser
        this.textures.addCanvas('blood_particle', canvas);
        console.log("✅ Partícula de sangre generada dinámicamente");
    }
    
    /**
     * Genera una imagen de mancha de sangre dinámicamente
     */
    generateBloodPuddle() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Fondo transparente
        ctx.clearRect(0, 0, 64, 32);
        
        // Dibujar mancha principal
        ctx.fillStyle = 'rgba(200, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.moveTo(10, 16);
        ctx.bezierCurveTo(15, 5, 30, 8, 35, 16);
        ctx.bezierCurveTo(50, 18, 55, 25, 45, 28);
        ctx.bezierCurveTo(35, 30, 15, 30, 10, 16);
        ctx.fill();
        
        // Añadir detalles más oscuros para dar profundidad
        ctx.fillStyle = 'rgba(150, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(30, 18, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Añadir detalles más claros para dar textura
        ctx.fillStyle = 'rgba(220, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(25, 15, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cargar en Phaser
        this.textures.addCanvas('blood_puddle', canvas);
        console.log("✅ Mancha de sangre generada dinámicamente");
    }

    create() {
        // Inicializar variables
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        
        // Array para almacenar los bots
        this.bots = [];
        
        // Crear animaciones para el pingüino
        this.setupAnimations();
        
        // Crear líneas de inicio y meta
        this.createLines();
        
        // Crear el jugador
        this.createPlayer();
        
        // Crear el semáforo (ANTES de los bots)
        this.createTrafficLight();
        
        // Crear los bots (DESPUÉS del semáforo)
        this.createBots();
        
        // Configurar controles
        this.setupControls();
        
        // Añadir zona de meta
        this.createFinishZone();
        
        // Crear elementos de UI
        this.createUI();
        
        // Configurar audio
        this.setupAudio();
        
        // Configurar sistema de partículas para el efecto de sangre
        this.setupBloodEffects();
        
        // Iniciar el semáforo
        this.trafficLight.start();
    }
    
    /**
     * Configura las animaciones del juego
     */
    setupAnimations() {
        // Animación de caminar
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'penguin_walk1' },
                { key: 'penguin_walk2' },
                { key: 'penguin_walk3' },
                { key: 'penguin_walk4' }
            ],
            frameRate: 10,
            repeat: -1
        });
        
        // Animación de deslizamiento
        this.anims.create({
            key: 'slide',
            frames: [
                { key: 'penguin_slide1' },
                { key: 'penguin_slide2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // Animación de muerte
        this.anims.create({
            key: 'die',
            frames: [
                { key: 'penguin_die1' },
                { key: 'penguin_die2' },
                { key: 'penguin_die3' },
                { key: 'penguin_die4' }
            ],
            frameRate: 8,
            repeat: 0
        });
        
        // Animación de daño/herida
        this.anims.create({
            key: 'hurt',
            frames: [{ key: 'penguin_hurt' }],
            frameRate: 1,
            repeat: 0
        });
    }
    
    /**
     * Crea las líneas de inicio y meta
     */
    createLines() {
        // Línea de inicio (verde)
        const startLineConfig = LINES_CONFIG.startLine;
        const startGraphics = this.add.graphics();
        startGraphics.fillStyle(startLineConfig.color, 1);
        startGraphics.fillRect(
            startLineConfig.x, 
            startLineConfig.y, 
            startLineConfig.width, 
            startLineConfig.height
        );
        
        // Línea de meta (roja)
        const finishLineConfig = LINES_CONFIG.finishLine;
        const finishGraphics = this.add.graphics();
        finishGraphics.fillStyle(finishLineConfig.color, 1);
        finishGraphics.fillRect(
            finishLineConfig.x, 
            finishLineConfig.y, 
            finishLineConfig.width, 
            finishLineConfig.height
        );
    }
    
    /**
     * Crea el jugador
     */
    createPlayer() {
        const { x, y } = PLAYER_CONFIG.initialPosition;
        
        // Configurar al jugador como controlado por el usuario
        const playerConfig = {
            ...PLAYER_CONFIG,
            isControlledByPlayer: true // Marcar como jugador controlado por el usuario
        };
        
        this.player = new Player(this, x, y, playerConfig);
    }
    
    /**
     * Crea los bots del juego
     */
    createBots() {
        // Crear la cantidad de bots especificada en la configuración
        const botCount = BOT_CONFIG.count;
        
        // Calcular el espacio disponible y la distribución
        const availableHeight = BOT_CONFIG.maxY - BOT_CONFIG.minY;
        
        for (let i = 0; i < botCount; i++) {
            // Generar una posición Y aleatoria dentro del rango configurado
            // Usamos una distribución más uniforme para evitar aglomeraciones
            const randomY = Phaser.Math.Between(BOT_CONFIG.minY, BOT_CONFIG.maxY);
            
            // Crear pequeña variación en X para evitar superposición exacta
            const randomXOffset = Phaser.Math.Between(-10, 10);
            const botX = BOT_CONFIG.initialX + randomXOffset;
            
            // Crear el bot con su propia configuración
            const botConfig = {
                ...PLAYER_CONFIG,
                botConfig: BOT_CONFIG.botConfig,
                isControlledByPlayer: false // Asegurarse de que no tenga indicador de jugador
            };
            
            // Crear el bot
            const bot = new Bot(this, botX, randomY, botConfig);
            
            // Aplicar un color distintivo aleatorio al bot
            if (BOT_CONFIG.tintColors && BOT_CONFIG.tintColors.length > 0) {
                // Usar un color aleatorio del array de colores
                const colorIndex = Math.floor(Math.random() * BOT_CONFIG.tintColors.length);
                bot.getSprite().setTint(BOT_CONFIG.tintColors[colorIndex]);
            }
            
            // Añadir el bot al array de bots
            this.bots.push(bot);
        }
        
        console.log(`✅ Creados ${botCount} bots a lo largo de la línea de partida`);
    }
    
    /**
     * Crea el semáforo
     */
    createTrafficLight() {
        this.trafficLight = new TrafficLight(this);
        
        // Configurar callback para cambios de estado
        this.trafficLight.setStateChangeCallback((state) => {
            if (state === TRAFFIC_LIGHT_STATES.GREEN) {
                // Iniciar música cuando cambia a verde
                if (this.greenLightMusic) {
                    this.greenLightMusic.play();
                    this.audioIndicator.setVisible(true);
                }
            } else {
                // Detener música cuando cambia a rojo
                if (this.greenLightMusic) {
                    this.greenLightMusic.pause();
                    this.audioIndicator.setVisible(false);
                }
                
                // Verificar si el jugador está en movimiento con luz roja
                if (this.player.isPlayerMoving() && this.player.getState() === GAME_STATES.MOVING) {
                    this.player.kill();
                }
            }
        });
    }
    
    /**
     * Configura los controles del juego
     */
    setupControls() {
        // Crear cursores
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Configurar barra espaciadora
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    /**
     * Crea la zona de meta
     */
    createFinishZone() {
        // Usar la posición de la línea de meta
        const { x, y, height } = LINES_CONFIG.finishLine;
        
        // Crear zona
        this.finishZone = this.add.zone(x, y + height/2).setSize(20, height);
        this.physics.world.enable(this.finishZone);
        this.finishZone.body.setAllowGravity(false);
        this.finishZone.body.moves = false;
        
        // Añadir colisión con el jugador
        this.physics.add.overlap(
            this.player.getSprite(), 
            this.finishZone, 
            this.handleFinish, 
            null, 
            this
        );
    }
    
    /**
     * Crea los elementos de UI
     */
    createUI() {
        // Instrucciones del juego
        GAME_TEXTS.instructions.forEach(instructionConfig => {
            this.add.text(
                instructionConfig.position.x, 
                instructionConfig.position.y, 
                instructionConfig.text, 
                { fontSize: '14px', fill: '#fff' }
            ).setOrigin(0.5);
        });
        
        // Texto de debug para mostrar el estado del juego
        this.debugText = this.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 5, y: 5 }
        });
        
        // Array para textos de debug de los bots
        this.botDebugTexts = [];
        
        // Inicializar textos de debug para los bots
        this.bots.forEach((bot, index) => {
            const botText = this.add.text(10, 100 + (index * 90), '', {
                fontSize: '14px',
                fill: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 5, y: 5 }
            });
            
            this.botDebugTexts.push(botText);
        });
        
        // Crear indicador de audio (inicialmente invisible)
        this.audioIndicator = this.add.text(
            AUDIO_CONFIG.indicatorPosition.x, 
            AUDIO_CONFIG.indicatorPosition.y, 
            AUDIO_CONFIG.indicatorText, {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#00aa00',
                padding: { x: 5, y: 2 }
            }
        ).setVisible(false);
        
        // Actualizar el texto de debug inmediatamente
        this.updateDebugText();
    }
    
    /**
     * Configura el sistema de audio
     */
    setupAudio() {
        // Verificar si el archivo de audio está disponible
        if (this.cache.audio.exists('greenLight')) {
            try {
                this.greenLightMusic = this.sound.add('greenLight', {
                    loop: true,
                    volume: AUDIO_CONFIG.greenLightVolume
                });
                
                // Si el semáforo está en verde, iniciar la música
                if (this.trafficLight.isGreen() && !this.sound.locked) {
                    this.greenLightMusic.play();
                    this.audioIndicator.setVisible(true);
                }
            } catch (error) {
                console.error('Error al crear el audio:', error);
                this.greenLightMusic = null;
            }
        } else {
            console.warn('Audio "greenLight" no encontrado en caché');
            this.greenLightMusic = null;
        }
    }
    
    /**
     * Configura el sistema de partículas para efectos de sangre
     */
    setupBloodEffects() {
        // Sonido de pistola
        this.pistolSound = this.sound.add('pistol', { volume: 0.5 });
        
        // Configurar el emisor de partículas
        this.bloodEmitter = this.add.particles('blood_particle').createEmitter({
            x: 0,
            y: 0,
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0.1 },
            lifespan: 800,
            gravityY: 600,
            blendMode: 'ADD',
            tint: 0xff0000,
            quantity: 1,
            on: false  // No emitir partículas automáticamente
        });
        
        console.log("✅ Sistema de partículas de sangre configurado");
    }
    
    /**
     * Maneja cuando el jugador llega a la meta
     */
    handleFinish() {
        // Verificar que el jugador no esté ya muerto o en meta
        if (this.player.getState() === GAME_STATES.MOVING || 
            this.player.getState() === GAME_STATES.PAUSED) {
            
            // Detener música si está sonando
            if (this.greenLightMusic && this.greenLightMusic.isPlaying) {
                this.greenLightMusic.stop();
                this.audioIndicator.setVisible(false);
            }
            
            // Marcar como ganador
            this.player.reachFinish();
            
            // Detener el semáforo
            this.trafficLight.stop();
        }
    }
    
    /**
     * Comprueba el estado del juego
     * Determina si el jugador o todos los bots han muerto o han llegado a la meta
     */
    checkGameState() {
        // Contar cuántos bots siguen "vivos" pero no han terminado
        const activeBots = this.bots.filter(bot => 
            bot.getState() !== GAME_STATES.DEAD && 
            bot.getState() !== GAME_STATES.FINISHED
        ).length;
        
        // Verificar si el jugador ha muerto
        const playerDead = this.player.getState() === GAME_STATES.DEAD;
        
        // Verificar si el jugador ha llegado a la meta
        const playerFinished = this.player.getState() === GAME_STATES.FINISHED;
        
        // Mostrar mensaje si el jugador ha ganado (llegó a la meta y hay bots muertos o activos)
        if (playerFinished && !this.gameEndMessageShown) {
            this.showVictoryMessage();
            this.gameEndMessageShown = true;
        }
        
        // Si todos los bots han muerto o terminado y el jugador sigue activo, el juego continúa
        return {
            playerDead,
            playerFinished,
            activeBots
        };
    }
    
    /**
     * Muestra un mensaje de victoria personalizado con el estado de los bots
     */
    showVictoryMessage() {
        // Contar bots muertos
        const deadBots = this.bots.filter(bot => bot.getState() === GAME_STATES.DEAD).length;
        
        // Texto principal de victoria
        this.add.text(400, 280, GAME_TEXTS.victory.title, {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Texto adicional con estadísticas de los bots
        this.add.text(400, 320, `¡Has derrotado a ${deadBots} de ${this.bots.length} bots!`, {
            fontSize: '18px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Texto para reiniciar
        this.add.text(400, 350, GAME_TEXTS.victory.restart, {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0.5);
    }
    
    /**
     * Verifica las colisiones entre jugadores/bots y la zona de meta
     */
    checkFinish() {
        // Verificar si el jugador ha llegado a la meta
        if (this.player.getState() !== GAME_STATES.DEAD && 
            this.player.getState() !== GAME_STATES.FINISHED) {
            
            const playerSprite = this.player.getSprite();
            if (playerSprite.x >= LINES_CONFIG.finishLine.x) {
                this.player.reachFinish();
            }
        }
        
        // Verificar si algún bot ha llegado a la meta
        this.bots.forEach(bot => {
            if (bot.getState() !== GAME_STATES.DEAD && 
                bot.getState() !== GAME_STATES.FINISHED) {
                
                const botSprite = bot.getSprite();
                if (botSprite.x >= LINES_CONFIG.finishLine.x) {
                    bot.reachFinish();
                    
                    // Mostrar mensaje si un bot gana primero
                    if (this.player.getState() !== GAME_STATES.FINISHED && 
                        this.player.getState() !== GAME_STATES.DEAD &&
                        !this.botWinMessageShown) {
                        
                        this.add.text(400, 200, '¡UN BOT HA GANADO!', {
                            fontSize: '24px',
                            fill: '#ff0000',
                            stroke: '#000',
                            strokeThickness: 3
                        }).setOrigin(0.5);
                        
                        this.botWinMessageShown = true;
                    }
                }
            }
        });
    }
    
    /**
     * Verifica si el jugador o los bots están moviéndose durante luz roja
     */
    checkMovementDuringRedLight() {
        // Solo verificar si el semáforo está en rojo
        if (this.trafficLight && this.trafficLight.isRed()) {
            // Verificar al jugador
            if (this.player.isPlayerMoving() && 
                this.player.getState() !== GAME_STATES.DEAD && 
                this.player.getState() !== GAME_STATES.FINISHED) {
                
                this.player.kill();
            }
            
            // Verificar a los bots (aunque su propia lógica interna también lo verifica)
            this.bots.forEach(bot => {
                if (bot.isPlayerMoving() && 
                    bot.getState() !== GAME_STATES.DEAD && 
                    bot.getState() !== GAME_STATES.FINISHED) {
                    
                    // Agregar un pequeño retraso aleatorio para simular tiempo de reacción
                    const reactionDelay = Phaser.Math.Between(100, 300);
                    this.time.delayedCall(reactionDelay, () => {
                        bot.kill();
                    });
                }
            });
        }
    }
    
    /**
     * Actualiza el juego en cada frame
     */
    update() {
        // Actualizar el jugador
        this.player.update();
        
        // Actualizar los bots
        this.bots.forEach(bot => bot.update());
        
        // Manejar los controles del jugador
        this.handleControls();
        
        // Verificar si el jugador o los bots han llegado a la meta
        this.checkFinish();
        
        // Verificar si el jugador o los bots se mueven en luz roja
        this.checkMovementDuringRedLight();
        
        // Verificar el estado general del juego
        this.checkGameState();
        
        // Actualizar textos de debug si están activos (ahora desactivado por configuración)
        if (GAME_CONFIG.debug) {
            this.updateDebugText();
        }
    }
    
    /**
     * Maneja los controles del jugador
     */
    handleControls() {
        const playerState = this.player.getState();
        
        // Control con barra espaciadora
        if (this.spaceBar.isDown && 
           (playerState === GAME_STATES.WAITING || 
            playerState === GAME_STATES.PAUSED || 
            playerState === GAME_STATES.MOVING)) {
            
            // Acelerar al jugador
            this.player.accelerate();
        } 
        else if (playerState === GAME_STATES.MOVING) {
            // Aplicar desaceleración cuando no se presiona la barra espaciadora
            this.player.decelerate();
        }
        
        // Detectar movimiento durante luz roja
        if (this.trafficLight.isRed() && 
            this.player.isPlayerMoving() && 
            playerState === GAME_STATES.MOVING) {
            
            this.player.kill();
        }
    }
    
    /**
     * Actualiza el texto de depuración con información del juego
     * (No se muestra cuando debug está desactivado)
     */
    updateDebugText() {
        // Si debug está desactivado, eliminar textos existentes y salir
        if (!GAME_CONFIG.debug) {
            if (this.debugText) {
                this.debugText.destroy();
                this.debugText = null;
            }
            
            if (this.botDebugTexts) {
                this.botDebugTexts.forEach(text => text.destroy());
                this.botDebugTexts = null;
            }
            return;
        }
        
        // Limpiar textos de debug previos
        if (this.debugText) {
            this.debugText.destroy();
        }
        
        if (this.botDebugTexts) {
            this.botDebugTexts.forEach(text => text.destroy());
        }
        
        // Crear array para los textos de debug de los bots
        this.botDebugTexts = [];
        
        // Información del jugador
        const playerState = this.player.getState();
        const playerSpeed = Math.round(this.player.speed * 100) / 100; // Redondear a 2 decimales
        const lightState = this.trafficLight ? this.trafficLight.getState() : 'unknown';
        
        // Texto principal de debug (jugador y semáforo)
        let debugInfo = `Estado: ${playerState}\n`;
        debugInfo += `Velocidad: ${playerSpeed}\n`;
        debugInfo += `Semáforo: ${lightState}\n`;
        debugInfo += `Bots activos: ${this.bots.length}`;
        
        this.debugText = this.add.text(10, 10, debugInfo, {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 5, y: 5 }
        });
        
        // Con muchos bots, solo mostrar estadísticas generales para evitar sobrecarga
        if (this.bots.length > 5) {
            // Contar bots por estado
            const botStats = {
                waiting: 0,
                moving: 0,
                paused: 0,
                finished: 0,
                dead: 0
            };
            
            this.bots.forEach(bot => {
                const state = bot.getState();
                if (botStats.hasOwnProperty(state)) {
                    botStats[state]++;
                }
            });
            
            let botStatsText = "Estadísticas de Bots:\n";
            botStatsText += `Esperando: ${botStats.waiting}\n`;
            botStatsText += `Moviendo: ${botStats.moving}\n`;
            botStatsText += `Pausados: ${botStats.paused}\n`;
            botStatsText += `Terminados: ${botStats.finished}\n`;
            botStatsText += `Eliminados: ${botStats.dead}`;
            
            const botText = this.add.text(10, 100, botStatsText, {
                fontSize: '14px',
                fill: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 5, y: 5 }
            });
            
            this.botDebugTexts.push(botText);
        } 
        // Si hay pocos bots, mostrar información detallada de cada uno
        else {
            // Información de los bots
            this.bots.forEach((bot, index) => {
                const botState = bot.getState();
                const botSpeed = Math.round(bot.speed * 100) / 100; // Redondear a 2 decimales
                
                let botInfo = `Bot ${index + 1}\n`;
                botInfo += `Estado: ${botState}\n`;
                botInfo += `Velocidad: ${botSpeed}`;
                
                const botText = this.add.text(10, 100 + (index * 90), botInfo, {
                    fontSize: '14px',
                    fill: '#ffffff',
                    backgroundColor: '#333333',
                    padding: { x: 5, y: 5 }
                });
                
                this.botDebugTexts.push(botText);
            });
        }
    }
}

export default GameScene; 