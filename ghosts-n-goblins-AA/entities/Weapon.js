class Weapon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'spear') {
        // Inicializar sprite con la textura correspondiente al tipo de arma
        super(scene, x, y, type);
        
        // Añadir a la escena y habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configuración de diferentes tipos de armas
        this.weaponConfig = {
            'spear': {
                damage: 10,
                speed: 400,
                gravityY: 100,
                size: { width: 28, height: 10 },
                lifespan: 3000,
                arc: false,
                flightFrames: 2,
                impactFrames: 2
            },
            'dagger': {
                damage: 8,
                speed: 600,
                gravityY: 0,
                size: { width: 20, height: 10 },
                lifespan: 2500,
                arc: false,
                flightFrames: 2,
                impactFrames: 2
            },
            'torch': {
                damage: 7,
                speed: 350,
                gravityY: 200,
                size: { width: 16, height: 16 },
                lifespan: 2800,
                arc: false,
                flightFrames: 2,
                impactFrames: 3
            },
            'axe': {
                damage: 15,
                speed: 350,
                gravityY: 300,
                spinSpeed: 0.2,
                size: { width: 20, height: 20 },
                lifespan: 3500,
                arc: true,
                flightFrames: 2,
                impactFrames: 2
            }
        };
        
        // Configuración según el tipo de arma
        if (this.weaponConfig[type]) {
            // Aumentar el daño para que tenga más efecto sobre el jefe
            this.damage = this.weaponConfig[type].damage * 2; // Duplicar el daño original
            this.speed = this.weaponConfig[type].speed * 1.5; // Aumentar la velocidad en un 50% para mayor alcance
            this.gravityY = this.weaponConfig[type].gravityY;
            if (this.weaponConfig[type].size) {
                this.setSize(
                    this.weaponConfig[type].size.width, 
                    this.weaponConfig[type].size.height
                );
            }
            if (this.weaponConfig[type].spinSpeed) {
                this.spinSpeed = this.weaponConfig[type].spinSpeed;
            }
        } else {
            // Valores por defecto si el tipo no está definido
            this.damage = 20;
            this.speed = 400;
            this.gravityY = 100;
            this.setSize(28, 10);
        }
        
        // Inicializar propiedades comunes
        this.type = type;
        this.isImpacting = false;
        
        // Asegurar que este sprite tenga física
        if (!this.body) {
            scene.physics.world.enable(this);
        }
        
        // Configurar físicas
        this.body.setOffset(2, 2); // Ajustar offset para centrar mejor la colisión
        this.setDepth(1); // Por encima del fondo
        
        // Sonidos para el arma
        this.impactSound = null;
        if (scene.cache.audio.exists(`${type}-impact`)) {
            this.impactSound = scene.sound.add(`${type}-impact`, { volume: 0.3 });
        }
        
        // Crear las animaciones para este tipo de arma
        this.createAnimations();
    }
    
    createAnimations() {
        const config = this.weaponConfig[this.type];
        const capitalizedType = this.type.charAt(0).toUpperCase() + this.type.slice(1);
        
        // Animación de vuelo/movimiento
        if (!this.scene.anims.exists(`${this.type}-flight`)) {
            let flightFrames = [];
            for (let i = 0; i < config.flightFrames; i++) {
                flightFrames.push(i);
            }
            
            this.scene.anims.create({
                key: `${this.type}-flight`,
                frames: this.scene.anims.generateFrameNumbers(capitalizedType, { 
                    frames: flightFrames 
                }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // Animación de impacto
        if (!this.scene.anims.exists(`${this.type}-impact`)) {
            let impactFrames = [];
            const baseIndex = config.flightFrames; // Índice donde empiezan los frames de impacto
            
            for (let i = 0; i < config.impactFrames; i++) {
                impactFrames.push(baseIndex + i);
            }
            
            this.scene.anims.create({
                key: `${this.type}-impact`,
                frames: this.scene.anims.generateFrameNumbers(capitalizedType, { 
                    frames: impactFrames 
                }),
                frameRate: 12,
                repeat: 0
            });
        }
    }
    
    fire(x, y, direction) {
        try {
            // Verificar que el objeto está activo
            if (!this.active) return this;
            
            // Posicionar el arma
            this.setPosition(x, y);
            this.setActive(true);
            this.setVisible(true);
            this.isImpacting = false;
            
            // Verificar que el tipo de arma es válido
            if (!this.type || !this.weaponConfig[this.type]) {
                console.warn('Tipo de arma no válido:', this.type);
                return this;
            }
            
            // Configurar dirección y velocidad
            const config = this.weaponConfig[this.type];
            this.setVelocityX(config.speed * direction);
            this.setFlipX(direction < 0);
            
            // Para el hacha, añadir movimiento parabólico
            if (this.body && config.arc) {
                this.body.setAllowGravity(true);
                this.body.setGravityY(this.gravityY);
                this.setVelocityY(-200);     // Impulso inicial hacia arriba
            }
            
            // Iniciar animación de vuelo
            try {
                // Verificar si la animación existe
                const flightAnimKey = `${this.type}-flight`;
                if (this.scene.anims.exists(flightAnimKey)) {
                    this.play(flightAnimKey);
                    console.log(`Reproduciendo animación ${flightAnimKey}`);
                } else {
                    console.warn(`La animación ${flightAnimKey} no existe`);
                    // Crear la animación si no existe
                    this.createAnimations();
                    // Intentar reproducir de nuevo
                    if (this.scene.anims.exists(flightAnimKey)) {
                        this.play(flightAnimKey);
                    }
                }
            } catch (error) {
                console.error('Error al reproducir animación de vuelo:', error);
            }
            
            // Timer para destruir el arma después del tiempo especificado (lifespan)
            // Más confiable que confiar en el update
            if (this.scene && this.scene.time) {
                this.destroyTimer = this.scene.time.delayedCall(config.lifespan, () => {
                    if (this.active && !this.isImpacting) {
                        this.destroy();
                    }
                });
            }
            
            // Evento para cuando termine la animación de impacto
            this.on('animationcomplete-' + this.type + '-impact', this.destroy, this);
            
            return this;
        } catch (error) {
            console.error('Error al disparar arma:', error);
            return this;
        }
    }
    
    impact() {
        // Evitar múltiples impactos
        if (this.isImpacting || !this.active) return;
        
        console.log('Arma impactando:', this.type);
        
        // Detener el movimiento
        if (this.body) {
            this.body.setVelocity(0, 0);
            this.body.setAllowGravity(false);
            // Desactivar colisiones físicas para evitar múltiples colisiones
            this.body.enable = false;
        }
        
        this.isImpacting = true;
        
        // Cancelar el timer de destrucción si existe
        if (this.destroyTimer) {
            this.destroyTimer.remove();
        }
        
        // Crear efecto de área para daño a zombies cercanos
        this.createAreaEffect();
        
        // Reproducir animación de impacto
        try {
            // Verificar si la animación existe
            const impactAnimKey = `${this.type}-impact`;
            if (this.scene.anims.exists(impactAnimKey)) {
                this.play(impactAnimKey);
                console.log(`Reproduciendo animación ${impactAnimKey}`);
            } else {
                console.warn(`La animación ${impactAnimKey} no existe`);
                // Crear la animación si no existe
                this.createAnimations();
                // Intentar reproducir de nuevo
                if (this.scene.anims.exists(impactAnimKey)) {
                    this.play(impactAnimKey);
                }
            }
        } catch (error) {
            console.error('Error reproduciendo animación de impacto:', error);
        }
        
        // Reproducir sonido de impacto si existe
        const impactSoundKey = `${this.type}-impact`;
        if (this.scene && this.scene.cache && this.scene.cache.audio && this.scene.cache.audio.exists(impactSoundKey)) {
            try {
                this.scene.sound.play(impactSoundKey, { volume: 0.5 });
            } catch (error) {
                console.warn(`Error reproduciendo sonido ${impactSoundKey}:`, error);
            }
        }
        
        // Auto-destrucción después de la animación si no se activa el evento
        if (this.scene && this.scene.time) {
            this.scene.time.delayedCall(500, () => {
                if (this.active && this.isImpacting) {
                    this.destroy();
                }
            });
        } else {
            // En caso de que la escena haya cambiado, destruir de inmediato
            this.destroy();
        }
    }
    
    // Alias para impact (para compatibilidad)
    handleImpact() {
        this.impact();
    }
    
    // Crear un efecto de área que dañe zombies cercanos
    createAreaEffect() {
        try {
            // Configuración básica del área de efecto
            const areaRadius = 80; // Radio del área de efecto
            const areaDamage = this.damage * 0.5; // Daño reducido para enemigos cercanos
            
            // Crear partículas de impacto
            const particles = this.scene.add.particles('particle');
            const emitter = particles.createEmitter({
                x: this.x,
                y: this.y,
                speed: { min: 50, max: 150 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.4, end: 0 },
                lifespan: { min: 300, max: 500 },
                quantity: 15,
                blendMode: 'ADD'
            });
            
            // Emitir partículas una vez
            emitter.explode();
            
            // Autodestruir el emisor después de un tiempo
            this.scene.time.delayedCall(500, () => {
                particles.destroy();
            });
            
            // Reproducir sonido de impacto si existe
            if (this.impactSound) {
                this.impactSound.play({ volume: 0.4 });
            }
            
            // Opcional: buscar enemigos en un radio y aplicar daño reducido
            // Esto requiere acceso a los grupos de enemigos desde el arma
            if (this.scene.zombies) {
                this.scene.zombies.getChildren().forEach(zombie => {
                    // Calcular distancia al zombie
                    const distance = Phaser.Math.Distance.Between(
                        this.x, this.y, zombie.x, zombie.y
                    );
                    
                    // Si está dentro del radio, aplicar daño reducido
                    if (distance < areaRadius && distance > 10 && zombie.active && zombie.isActive) {
                        zombie.takeDamage(areaDamage);
                    }
                });
            }
        } catch (error) {
            console.error('Error al crear efecto de área:', error);
        }
    }
    
    update() {
        // Verificar si el objeto sigue activo y tiene un cuerpo físico
        if (!this.active || !this.body) return;
        
        // Si el arma está fuera de los límites verticales del mundo, destruirla
        // Para límites horizontales, usamos el timer para permitir mayor alcance
        if (this.y < 0 || this.y > this.scene.physics.world.bounds.height) {
            this.destroy();
            return;
        }
        
        // Mantener la velocidad horizontal constante para las armas normales (no hacha)
        if (!this.isImpacting && this.type !== 'axe') {
            try {
                // Verificar explícitamente que el body y velocity existen
                if (this.body && typeof this.body.velocity !== 'undefined') {
                    // Mantener la velocidad constante en caso de que haya sido afectada por colisiones
                    const direction = this.flipX ? -1 : 1;
                    const velocity = this.weaponConfig[this.type].speed;
                    this.body.velocity.x = velocity * direction;
                }
            } catch (error) {
                console.warn('Error al actualizar velocidad del arma:', error);
            }
        }
        
        // Para el hacha, hacer que rote durante el vuelo
        if (this.type === 'axe' && !this.isImpacting) {
            this.angle += 10;
        }
    }

    setVelocityX(value) {
        if (this.body) {
            this.body.velocity.x = value;
        }
        return this;
    }

    setVelocityY(value) {
        if (this.body) {
            this.body.velocity.y = value;
        }
        return this;
    }

    // Método para manejar rebote del arma (cuando impacta con enemigo invulnerable)
    deflect() {
        // Si ya está impactando, ignorar
        if (this.isImpacting) return;
        
        console.log(`Arma ${this.type} rebotada`);
        
        // Cambiar velocidad para simular un rebote
        if (this.body) {
            // Invertir la velocidad horizontal y reducirla
            this.body.velocity.x *= -0.5;
            // Aplicar velocidad vertical negativa para que "rebote"
            this.body.velocity.y = -150;
        }
        
        // Aplicar rotación para efecto visual de rebote
        this.setAngularVelocity(300 * (this.body.velocity.x > 0 ? 1 : -1));
        
        // Marcar como impactando para evitar múltiples rebotes
        this.isImpacting = true;
        
        // Destruir después de un tiempo corto
        this.scene.time.delayedCall(500, () => {
            if (this.active) {
                this.destroy();
            }
        });
    }
}

export default Weapon; 