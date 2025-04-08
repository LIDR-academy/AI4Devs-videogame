/**
 * Clase Player - Encapsula toda la lógica relacionada con el jugador
 * en el juego "Luz Roja, Luz Verde"
 */
class Player {
    /**
     * Constructor de la clase Player
     * @param {Phaser.Scene} scene - La escena a la que pertenece el jugador
     * @param {number} x - Posición X inicial
     * @param {number} y - Posición Y inicial
     * @param {Object} config - Configuración adicional del jugador
     */
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // Configuración del jugador
        this.config = {
            radius: 15, // Mantenemos para cálculos de colisión
            maxSpeed: 300,
            acceleration: 5,
            deceleration: 3,
            minSpeedThreshold: 5,
            isControlledByPlayer: false, // Indica si es el jugador principal
            ...config
        };
        
        // Estado del jugador
        this.speed = 0;
        this.isMoving = false;
        this.state = 'waiting'; // 'waiting', 'moving', 'paused', 'finished', 'dead'
        
        // Variables para el tiriteo cuando está asustado durante la luz roja
        this.isShivering = false;
        this.shiverTimer = null;
        this.shiverIntensity = 0;
        
        // Crear el jugador en la escena
        this.create();
    }
    
    /**
     * Crea el jugador en la escena
     */
    create() {
        // Crear el sprite del jugador
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'penguin_walk1');
        
        // Configurar el tamaño y la física
        this.sprite.setDisplaySize(40, 40); // Ajustar según el tamaño del sprite
        this.sprite.setBodySize(30, 30);    // Ajustar la hitbox para colisiones
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        
        // Si este es el jugador controlado por el usuario, añadir un triángulo azul sutil
        if (this.config.isControlledByPlayer) {
            this.createPlayerIndicator();
        }
        
        // Actualizar la animación inicial
        this.updateAnimation();
    }
    
    /**
     * Crea un indicador triangular sutil encima del pingüino del jugador
     */
    createPlayerIndicator() {
        // Crear un triángulo azul encima del pingüino
        this.playerIndicator = this.scene.add.graphics();
        this.playerIndicator.fillStyle(0x3333ff, 0.7); // Azul semi-transparente
        
        // Dibujar un triángulo pequeño
        this.playerIndicator.beginPath();
        this.playerIndicator.moveTo(0, -30); // Punta superior
        this.playerIndicator.lineTo(-6, -20); // Esquina izquierda
        this.playerIndicator.lineTo(6, -20); // Esquina derecha
        this.playerIndicator.closePath();
        this.playerIndicator.fillPath();
        
        // Posicionar el indicador donde está el sprite
        this.playerIndicator.x = this.sprite.x;
        this.playerIndicator.y = this.sprite.y;
    }
    
    /**
     * Actualiza la posición del indicador del jugador en cada frame
     */
    updatePlayerIndicator() {
        if (this.playerIndicator && this.config.isControlledByPlayer) {
            this.playerIndicator.x = this.sprite.x;
            this.playerIndicator.y = this.sprite.y;
        }
    }
    
    /**
     * Actualiza la animación del jugador según su estado
     */
    updateAnimation() {
        switch (this.state) {
            case 'waiting':
                this.sprite.setTexture('penguin_walk1');
                this.sprite.anims.stop();
                break;
            case 'moving':
                if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== 'walk') {
                    this.sprite.play('walk');
                }
                break;
            case 'paused':
                // Mostrar al pingüino estático en lugar de deslizándose
                this.sprite.setTexture('penguin_walk1');
                this.sprite.anims.stop();
                
                // Si el semáforo está en rojo y el jugador está parado, puede tiritar
                if (this.scene.trafficLight && this.scene.trafficLight.isRed()) {
                    // Intentar iniciar el tiriteo si no está tiritando ya
                    if (!this.isShivering && Math.random() < this.config.shiver?.frameChance) {
                        this.startShivering();
                    }
                } else {
                    // Si el semáforo no está en rojo, asegurarse de detener el tiriteo
                    this.stopShivering();
                }
                break;
            case 'finished':
                this.sprite.setTexture('penguin_walk1');
                this.sprite.anims.stop();
                // Podríamos añadir una animación de victoria si tuviéramos
                break;
            case 'dead':
                // La animación de muerte se maneja en el método kill()
                break;
            default:
                break;
        }
    }
    
    /**
     * Acelera al jugador
     */
    accelerate() {
        if (this.state === 'dead' || this.state === 'finished') return;
        
        if (this.state !== 'moving') {
            this.state = 'moving';
            console.log("Cambiando a estado moving");
        }
        
        this.isMoving = true;
        
        // Aumentar velocidad (aceleración)
        if (this.speed < this.config.maxSpeed) {
            this.speed += this.config.acceleration;
            if (this.speed > this.config.maxSpeed) this.speed = this.config.maxSpeed;
        }
        
        // Mover al jugador hacia la derecha
        this.sprite.setVelocityX(this.speed);
        
        // Actualizar animación
        this.updateAnimation();
    }
    
    /**
     * Desacelera al jugador gradualmente
     * @returns {boolean} - Retorna true si el jugador se ha detenido completamente
     */
    decelerate() {
        if (this.state !== 'moving' || this.speed <= 0) return true;
        
        // Aplicar desaceleración
        this.speed -= this.config.deceleration;
        
        // Comprobar si se ha detenido
        if (this.speed <= this.config.minSpeedThreshold) {
            this.stop();
            return true;
        } else {
            // Seguir moviendo pero más lento
            this.sprite.setVelocityX(this.speed);
            this.updateAnimation();
            return false;
        }
    }
    
    /**
     * Detiene al jugador completamente
     */
    stop() {
        this.speed = 0;
        this.isMoving = false;
        this.state = 'paused';
        this.sprite.setVelocity(0);
        this.updateAnimation();
    }
    
    /**
     * Elimina al jugador (cuando pierde)
     */
    kill() {
        if (this.state === 'dead') return;
        
        this.state = 'dead';
        
        // Ocultar el indicador del jugador si existe
        if (this.playerIndicator) {
            this.playerIndicator.setVisible(false);
        }
        
        // Detener inmediatamente toda velocidad e inercia
        this.speed = 0;
        this.sprite.setVelocity(0);
        
        // Reproducir sonido de pistola usando el sistema global
        if (this.scene.pistolSound) {
            try {
                this.scene.pistolSound.play();
                console.log("🔊 Reproduciendo sonido de pistola");
            } catch (error) {
                console.error("⚠️ Error al reproducir sonido de pistola:", error);
            }
        } else {
            console.warn("⚠️ Sonido de pistola no disponible");
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
                        // Activar el sistema de partículas en la posición del jugador
                        if (this.scene.bloodEmitter) {
                            // Usar emitParticleAt en lugar de explode
                            this.scene.bloodEmitter.setPosition(this.sprite.x, this.sprite.y);
                            // Emitir varias partículas de una vez
                            for (let i = 0; i < 50; i++) {
                                this.scene.bloodEmitter.emitParticleAt(
                                    this.sprite.x + Phaser.Math.Between(-10, 10),
                                    this.sprite.y + Phaser.Math.Between(-10, 10)
                                );
                            }
                            console.log("💥 Partículas de sangre emitidas");
                        }
                        
                        // Crear mancha de sangre permanente en el suelo
                        if (this.scene.textures.exists('blood_puddle')) {
                            const bloodPuddle = this.scene.add.image(this.sprite.x, this.sprite.y + 20, 'blood_puddle')
                                .setOrigin(0.5, 0.5)
                                .setScale(0.8)
                                .setAlpha(0.9)
                                .setDepth(this.sprite.depth - 1);
                            
                            console.log("🩸 Mancha de sangre creada");
                        }
                        
                        // Mensaje de game over
                        this.scene.add.text(400, 300, '¡ELIMINADO!', {
                            fontSize: '48px',
                            fill: '#ff0000',
                            stroke: '#000000',
                            strokeThickness: 4,
                            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, stroke: true, fill: true }
                        }).setOrigin(0.5);
                        
                        this.scene.add.text(400, 350, 'Presiona R para reiniciar', {
                            fontSize: '18px',
                            fill: '#fff'
                        }).setOrigin(0.5);
                        
                        // Permitir reiniciar
                        this.enableRestart();
                    }
                });
            }
        });
    }
    
    /**
     * Marca al jugador como ganador
     */
    reachFinish() {
        if (this.state === 'dead' || this.state === 'finished') return;
        
        this.state = 'finished';
        this.sprite.setVelocity(0);
        
        // Ocultar el indicador del jugador si existe
        if (this.playerIndicator) {
            this.playerIndicator.setVisible(false);
        }
        
        // Establecer animación de victoria (usar el primer frame de caminar)
        this.sprite.setTexture('penguin_walk1');
        this.sprite.setTint(0x00ff00); // Tinte verde para indicar victoria
        
        // Mensaje de victoria
        this.scene.add.text(400, 300, '¡META ALCANZADA!', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        this.scene.add.text(400, 350, 'Presiona R para reiniciar', {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Permitir reiniciar
        this.enableRestart();
    }
    
    /**
     * Habilita la opción de reiniciar con la tecla R
     */
    enableRestart() {
        this.scene.input.keyboard.once('keydown-R', () => {
            this.scene.scene.restart();
        });
    }
    
    /**
     * Actualiza el jugador en cada frame
     */
    update() {
        // Actualizar la animación según el estado
        this.updateAnimation();
        
        // Actualizar la posición del indicador del jugador si existe
        if (this.config.isControlledByPlayer) {
            this.updatePlayerIndicator();
        }
    }
    
    /**
     * Retorna el estado actual del jugador
     * @returns {string} - Estado del jugador
     */
    getState() {
        return this.state;
    }
    
    /**
     * Retorna si el jugador está en movimiento
     * @returns {boolean} - true si está moviéndose
     */
    isPlayerMoving() {
        return this.isMoving;
    }
    
    /**
     * Retorna el sprite físico del jugador
     * @returns {Phaser.Physics.Arcade.Sprite} - Sprite del jugador
     */
    getSprite() {
        return this.sprite;
    }
    
    /**
     * Inicia el efecto de tiriteo por miedo
     */
    startShivering() {
        if (this.isShivering || this.state === 'dead' || this.state === 'finished') return;
        
        this.isShivering = true;
        
        // Obtener la configuración de tiriteo
        const shiverConfig = this.config.shiver || {
            minIntensity: 0.4, // Valor predeterminado reducido
            maxIntensity: 0.8, // Valor predeterminado reducido
            minDuration: 1000,
            maxDuration: 3000
        };
        
        // Intensidad aleatoria según la configuración
        this.shiverIntensity = Phaser.Math.Between(
            shiverConfig.minIntensity * 10, 
            shiverConfig.maxIntensity * 10
        ) / 10; // Convertir a decimal para mayor precisión
        
        // Guardar la posición original del pingüino
        this.originalX = this.sprite.x;
        
        // Cambiar muy ligeramente el tinte del pingüino para mostrar miedo (azul muy pálido)
        this.sprite.setTint(0xeeeeff); // Tinte más sutil
        
        // Crear el efecto de "sudor frío" (pequeñas gotas azules) - más sutil
        this.createSweatDrops();
        
        // Crear un temporizador para el tiriteo con duración aleatoria
        const shiverDuration = Phaser.Math.Between(
            shiverConfig.minDuration, 
            shiverConfig.maxDuration
        );
        
        // Crear efecto de tiriteo con tweens - más sutil
        this.shiverTween = this.scene.tweens.add({
            targets: this.sprite,
            x: this.originalX - this.shiverIntensity / 2, // Desplazamiento mínimo
            duration: 50,
            yoyo: true,
            repeat: Math.floor(shiverDuration / 100), // Repetir según la duración
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                // Vibración aleatoria adicional - mucho más sutil
                if (Math.random() < 0.3) { // Reducida la probabilidad también
                    this.sprite.x += Phaser.Math.Between(-this.shiverIntensity, this.shiverIntensity) * 0.5;
                }
                
                // Actualizar posición de las gotas de sudor
                this.updateSweatDrops();
            },
            onComplete: () => {
                this.stopShivering();
            }
        });
        
        // Detener el tiriteo después de un tiempo aleatorio
        this.shiverTimer = this.scene.time.delayedCall(shiverDuration, () => {
            this.stopShivering();
        });
    }
    
    /**
     * Crea el efecto visual de "sudor frío" para el miedo
     */
    createSweatDrops() {
        // Eliminar gotas existentes si las hubiera
        if (this.sweatDrops) {
            this.sweatDrops.forEach(drop => drop.destroy());
        }
        
        // Crear array para almacenar las gotas
        this.sweatDrops = [];
        
        // Determinar el número de gotas según si es jugador principal o bot
        // El jugador principal puede tener más gotas que los bots
        let numDrops;
        
        if (this.config.isControlledByPlayer) {
            // Para el jugador principal, 1-2 gotas
            numDrops = Phaser.Math.Between(1, 2);
        } else {
            // Para los bots, con muchos en pantalla, reducir a 0-1 gotas
            // Además, solo un porcentaje de los bots tendrán gotas de sudor
            const totalBots = this.scene.bots ? this.scene.bots.length : 0;
            
            if (totalBots > 20 && Math.random() < 0.7) {
                // Con muchos bots, 70% de probabilidad de no mostrar gotas
                numDrops = 0;
            } else {
                // Máximo una gota para bots
                numDrops = Math.random() < 0.6 ? 1 : 0;
            }
        }
        
        for (let i = 0; i < numDrops; i++) {
            // Posición relativa al pingüino (alrededor de la cabeza)
            const offsetX = Phaser.Math.Between(-15, 15);
            const offsetY = Phaser.Math.Between(-20, -10);
            
            // Crear gráfico para la gota
            const sweatDrop = this.scene.add.graphics();
            sweatDrop.fillStyle(0x6666ff, 0.4); // Azul pálido más transparente
            sweatDrop.fillCircle(0, 0, Phaser.Math.Between(1, 2)); // Tamaño más pequeño
            sweatDrop.x = this.sprite.x + offsetX;
            sweatDrop.y = this.sprite.y + offsetY;
            
            // Añadir animación de "caída" para la gota
            this.scene.tweens.add({
                targets: sweatDrop,
                y: sweatDrop.y + Phaser.Math.Between(3, 5), // Caer menos
                alpha: 0, // Desaparecer gradualmente
                duration: Phaser.Math.Between(500, 1000),
                delay: i * 300, // Mayor retraso entre gotas
                onComplete: () => {
                    // Eliminar la gota cuando termina la animación
                    sweatDrop.destroy();
                    
                    // Si el pingüino sigue tiritando, crear una nueva gota
                    // Solo para el jugador principal o con probabilidad reducida para bots
                    const shouldCreateNewDrop = this.isShivering && 
                        (this.config.isControlledByPlayer || Math.random() < 0.3);
                    
                    if (shouldCreateNewDrop) {
                        const newDrop = this.scene.add.graphics();
                        newDrop.fillStyle(0x6666ff, 0.4);
                        newDrop.fillCircle(0, 0, Phaser.Math.Between(1, 2));
                        newDrop.x = this.sprite.x + Phaser.Math.Between(-15, 15);
                        newDrop.y = this.sprite.y + Phaser.Math.Between(-20, -10);
                        
                        // Reemplazar la gota en el array
                        const index = this.sweatDrops.indexOf(sweatDrop);
                        if (index !== -1) {
                            this.sweatDrops[index] = newDrop;
                        }
                        
                        // Animar la nueva gota
                        this.scene.tweens.add({
                            targets: newDrop,
                            y: newDrop.y + Phaser.Math.Between(3, 5),
                            alpha: 0,
                            duration: Phaser.Math.Between(500, 1000),
                            onComplete: () => {
                                newDrop.destroy();
                            }
                        });
                    }
                }
            });
            
            // Añadir la gota al array
            this.sweatDrops.push(sweatDrop);
        }
    }
    
    /**
     * Actualiza la posición de las gotas de sudor
     */
    updateSweatDrops() {
        if (!this.sweatDrops) return;
        
        this.sweatDrops.forEach(drop => {
            if (drop && drop.active) {
                // Ajustar la posición X para seguir al pingüino cuando tirita
                drop.x += (this.sprite.x - drop.x) * 0.2;
            }
        });
    }
    
    /**
     * Detiene el efecto de tiriteo
     */
    stopShivering() {
        if (!this.isShivering) return;
        
        // Detener el tween si existe
        if (this.shiverTween) {
            this.shiverTween.stop();
            this.shiverTween = null;
        }
        
        // Limpiar el timer
        if (this.shiverTimer) {
            this.shiverTimer.remove();
            this.shiverTimer = null;
        }
        
        // Devolver el pingüino a su posición original
        if (this.originalX) {
            this.sprite.x = this.originalX;
        }
        
        // Quitar el tinte azulado
        this.sprite.clearTint();
        
        // Eliminar las gotas de sudor
        if (this.sweatDrops) {
            this.sweatDrops.forEach(drop => {
                if (drop && drop.active) {
                    drop.destroy();
                }
            });
            this.sweatDrops = null;
        }
        
        this.isShivering = false;
    }
}

// Exportar la clase para poder utilizarla en otros archivos
export default Player; 