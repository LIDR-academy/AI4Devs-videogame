/**
 * Clase Bot - Extiende la funcionalidad del Player para crear un NPC
 * controlado por la IA en el juego "Luz Roja, Luz Verde"
 */
import Player from './Player.js';
import { TRAFFIC_LIGHT_STATES } from '../config/gameConfig.js';

class Bot extends Player {
    /**
     * Constructor de la clase Bot
     * @param {Phaser.Scene} scene - La escena a la que pertenece el bot
     * @param {number} x - Posición X inicial
     * @param {number} y - Posición Y inicial
     * @param {Object} config - Configuración adicional del bot
     */
    constructor(scene, x, y, config = {}) {
        // Llamar al constructor de la clase padre (Player)
        super(scene, x, y, config);
        
        // Configuración específica del bot
        this.botConfig = {
            minSprintTime: 3000, // Mínimo tiempo de sprint en milisegundos (3 segundos)
            maxSprintTime: 8000, // Máximo tiempo de sprint en milisegundos (8 segundos)
            reactionTimeMin: 300, // Tiempo mínimo de reacción en milisegundos
            reactionTimeMax: 700, // Tiempo máximo de reacción en milisegundos
            shiverProbability: 0.3, // Probabilidad de que el bot tirite cuando esté en rojo
            shiverFrameChance: 0.002, // Probabilidad de tiritar en cada frame cuando está en rojo
            ...config.botConfig
        };
        
        // Timer para controlar el comportamiento del bot
        this.sprintTimer = null;
        this.reactionTimer = null;
        
        // Escuchar los cambios de estado del semáforo
        this.setupTrafficLightListener();
    }
    
    /**
     * Configura los listeners para reaccionar a los cambios del semáforo
     */
    setupTrafficLightListener() {
        // Verificar si existe el semáforo en la escena
        if (this.scene.trafficLight) {
            // Guardar referencia al semáforo
            this.trafficLight = this.scene.trafficLight;
            
            // Comprobación inicial del estado del semáforo
            this.reactToTrafficLight(this.trafficLight.getState());
            
            // Marcar que se ha conectado al semáforo
            this.hasConnectedToTrafficLight = true;
        } else {
            console.warn("Aviso: Semáforo no disponible para el Bot todavía. Se conectará más tarde.");
            this.hasConnectedToTrafficLight = false;
        }
    }
    
    /**
     * Reacciona a los cambios de estado del semáforo
     * @param {string} lightState - Estado actual del semáforo
     */
    reactToTrafficLight(lightState) {
        // Limpiar timers existentes
        this.clearTimers();
        
        // Detener el tiriteo si estaba activo
        this.stopShivering();
        
        // Reaccionar según el estado del semáforo
        if (lightState === TRAFFIC_LIGHT_STATES.GREEN) {
            // Cuando la luz está en verde, el bot comienza a moverse después de un tiempo de reacción
            const reactionTime = Phaser.Math.Between(
                this.botConfig.reactionTimeMin, 
                this.botConfig.reactionTimeMax
            );
            
            this.reactionTimer = this.scene.time.delayedCall(reactionTime, () => {
                // Iniciar sprint después del tiempo de reacción
                this.startSprint();
            });
            
        } else if (lightState === TRAFFIC_LIGHT_STATES.RED) {
            // Cuando la luz está en rojo, el bot debe detenerse
            // Pero añadimos un tiempo de reacción
            const reactionTime = Phaser.Math.Between(
                this.botConfig.reactionTimeMin, 
                this.botConfig.reactionTimeMax
            );
            
            // Si el bot está en movimiento durante la luz roja después del tiempo de reacción, es eliminado
            this.reactionTimer = this.scene.time.delayedCall(reactionTime, () => {
                if (this.isPlayerMoving() && this.trafficLight.isRed()) {
                    this.kill();
                } else {
                    this.stop();
                    
                    // Probabilidad de que el bot tirite de miedo cuando se detenga en luz roja
                    if (Math.random() < this.botConfig.shiverProbability) {
                        // Añadir un pequeño retraso aleatorio antes de comenzar a tiritar
                        const shiverDelay = Phaser.Math.Between(500, 2000);
                        this.scene.time.delayedCall(shiverDelay, () => {
                            if (this.state === 'paused' && this.trafficLight.isRed()) {
                                this.startShivering();
                            }
                        });
                    }
                }
            });
        }
    }
    
    /**
     * Inicia un sprint del bot durante un tiempo aleatorio
     */
    startSprint() {
        if (this.state === 'dead' || this.state === 'finished') return;
        
        // Generar duración aleatoria para el sprint entre 3-8 segundos
        const sprintDuration = Phaser.Math.Between(
            this.botConfig.minSprintTime,
            this.botConfig.maxSprintTime
        );
        
        // Función para acelerar continuamente durante el sprint
        const accelerateBot = () => {
            // Solo acelerar si la luz está verde
            if (this.trafficLight && this.trafficLight.isGreen()) {
                this.accelerate();
            }
        };
        
        // Crear un temporizador que llame a la función accelerateBot repetidamente
        this.sprintEvent = this.scene.time.addEvent({
            delay: 100, // Cada 100ms
            callback: accelerateBot,
            callbackScope: this,
            loop: true
        });
        
        // Programar la finalización del sprint
        this.sprintTimer = this.scene.time.delayedCall(sprintDuration, () => {
            // Detener el evento de aceleración
            if (this.sprintEvent) {
                this.sprintEvent.remove();
                this.sprintEvent = null;
            }
            
            // Decelerar bruscamente
            this.stop();
            
            // Si la luz sigue en verde, programar otro sprint después de un breve descanso
            if (this.trafficLight && this.trafficLight.isGreen()) {
                const breakTime = Phaser.Math.Between(500, 1500); // Descanso de 0.5-1.5 segundos
                this.scene.time.delayedCall(breakTime, () => {
                    this.startSprint();
                });
            }
        });
    }
    
    /**
     * Limpia todos los timers activos
     */
    clearTimers() {
        if (this.sprintTimer) {
            this.sprintTimer.remove();
            this.sprintTimer = null;
        }
        
        if (this.reactionTimer) {
            this.reactionTimer.remove();
            this.reactionTimer = null;
        }
        
        if (this.sprintEvent) {
            this.sprintEvent.remove();
            this.sprintEvent = null;
        }
    }
    
    /**
     * Sobrescribe el método update del Player para añadir el comportamiento del bot
     */
    update() {
        // Llamar al método update del padre
        if (super.update) {
            super.update();
        }
        
        // Intentar conectarse al semáforo si no se ha conectado aún
        if (!this.hasConnectedToTrafficLight && this.scene.trafficLight) {
            console.log("Bot: Conectando al semáforo que ya está disponible");
            this.setupTrafficLightListener();
        }
        
        // Actualizar la reacción al semáforo si ha cambiado su estado y estamos conectados
        if (this.trafficLight && this.lastKnownLightState !== this.trafficLight.getState()) {
            this.lastKnownLightState = this.trafficLight.getState();
            this.reactToTrafficLight(this.lastKnownLightState);
        }
        
        // Si estamos detenidos y en luz roja, hay una pequeña probabilidad de tiritar aleatoriamente
        if (this.state === 'paused' && this.trafficLight && this.trafficLight.isRed() && 
            !this.isShivering && Math.random() < this.botConfig.shiverFrameChance) {
            this.startShivering();
        }
    }
    
    /**
     * Limpia los recursos cuando el bot es destruido
     */
    destroy() {
        this.clearTimers();
        this.stopShivering();
        
        // Si hay un método destroy en la clase padre, llamarlo
        if (super.destroy) {
            super.destroy();
        }
    }
    
    /**
     * Sobrescribe el método kill() para que no muestre el mensaje "¡ELIMINADO!"
     * cuando un bot es eliminado, pero manteniendo los efectos visuales.
     */
    kill() {
        if (this.state === 'dead') return;
        
        this.state = 'dead';
        
        // Detener inmediatamente toda velocidad e inercia
        this.speed = 0;
        this.sprite.setVelocity(0);
        
        // Limpiar todos los timers activos
        this.clearTimers();
        
        // Con muchos bots, reducir efectos visuales para mejorar rendimiento
        const totalBots = this.scene.bots ? this.scene.bots.length : 0;
        const isHighLoad = totalBots > 20;
        
        // Reproducir sonido de pistola usando el sistema global (solo 20% de veces con muchos bots)
        if (this.scene.pistolSound && (!isHighLoad || Math.random() < 0.2)) {
            try {
                this.scene.pistolSound.play();
                console.log("🔊 Bot eliminado - Reproduciendo sonido de pistola");
            } catch (error) {
                console.error("⚠️ Error al reproducir sonido de pistola:", error);
            }
        }
        
        // Reproducir la animación de muerte
        this.sprite.play('die');
        
        // Efecto de salto al morir
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 50, // Primero salta hacia arriba
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
                // Luego cae al suelo
                this.scene.tweens.add({
                    targets: this.sprite,
                    y: this.sprite.y + 80, // Cae más abajo que la posición original
                    duration: 500,
                    ease: 'Bounce.Out',
                    onComplete: () => {
                        // Con muchos bots, reducir los efectos de partículas
                        // Activar el sistema de partículas en la posición del bot
                        if (this.scene.bloodEmitter && (!isHighLoad || Math.random() < 0.3)) {
                            // Usar emitParticleAt en lugar de explode
                            this.scene.bloodEmitter.setPosition(this.sprite.x, this.sprite.y);
                            
                            // Reducir el número de partículas si hay muchos bots
                            const particleCount = isHighLoad ? 20 : 50;
                            
                            // Emitir varias partículas de una vez
                            for (let i = 0; i < particleCount; i++) {
                                this.scene.bloodEmitter.emitParticleAt(
                                    this.sprite.x + Phaser.Math.Between(-10, 10),
                                    this.sprite.y + Phaser.Math.Between(-10, 10)
                                );
                            }
                            console.log("💥 Partículas de sangre del bot emitidas");
                        }
                        
                        // Crear mancha de sangre permanente en el suelo (solo algunas con muchos bots)
                        if (this.scene.textures.exists('blood_puddle') && (!isHighLoad || Math.random() < 0.3)) {
                            const bloodPuddle = this.scene.add.image(this.sprite.x, this.sprite.y + 20, 'blood_puddle')
                                .setOrigin(0.5, 0.5)
                                .setScale(0.8)
                                .setAlpha(0.9)
                                .setDepth(this.sprite.depth - 1);
                            
                            console.log("🩸 Mancha de sangre del bot creada");
                        }
                        
                        // NO mostrar el mensaje de "¡ELIMINADO!" ya que es un bot
                    }
                });
            }
        });
    }
}

export default Bot; 