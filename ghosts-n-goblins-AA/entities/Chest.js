class Chest extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'random') {
        // Inicializamos el sprite con la textura del cofre cerrado
        super(scene, x, y, 'chest');
        
        // Añadir el cofre a la escena y habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = cuerpo estático
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(28, 24);        // Ajustar el área de colisión
        this.body.setOffset(2, 8);        // Centrar la colisión con el sprite
        this.setDepth(1);                 // Asegurar que el cofre se dibuje sobre el fondo
        
        // Estado del cofre
        this.isOpen = false;              // El cofre empieza cerrado
        this.isOpening = false;           // Flag para la animación de apertura
        this.hasBeenHit = false;          // Flag para detectar si ya fue golpeado
        
        // Tipo de contenido (si es random se decidirá al abrir)
        this.contentType = type;
        
        // Posibles tipos de contenido
        this.contentTypes = [
            'armor',
            'points',
            'weapon_spear',
            'weapon_dagger',
            'weapon_torch',
            'weapon_axe',
            'magic',
            'invincible'
        ];
        
        // Probabilidades para cada tipo (puntos más probable, invencibilidad menos)
        this.contentProbabilities = {
            'armor': 0.15,
            'points': 0.30,
            'weapon_spear': 0.10,
            'weapon_dagger': 0.12,
            'weapon_torch': 0.12,
            'weapon_axe': 0.10,
            'magic': 0.08,
            'invincible': 0.03
        };
        
        // Crear animaciones para el cofre
        this.createAnimations();
    }
    
    createAnimations() {
        // Comprobar si ya existen las animaciones para evitar errores
        if (!this.scene.anims.exists('chest-open')) {
            this.scene.anims.create({
                key: 'chest-open',
                frames: this.scene.anims.generateFrameNumbers('chest', { start: 0, end: 2 }),
                frameRate: 8,
                repeat: 0
            });
        }
    }
    
    // Método para cuando el cofre es golpeado
    hit() {
        // Evitar abrir un cofre ya abierto o en proceso de apertura
        if (this.isOpen || this.isOpening || this.hasBeenHit) return false;
        
        this.hasBeenHit = true;
        this.isOpening = true;
        
        console.log('Cofre golpeado en:', this.x, this.y);
        
        // Reproducir sonido de apertura del cofre
        if (this.scene.cache.audio.exists('chest-open')) {
            this.scene.sound.play('chest-open', { volume: 0.6 });
        }
        
        // Reproducir animación de apertura
        this.play('chest-open');
        
        // Crear efecto de brillo/partículas al abrir
        this.createOpeningEffect();
        
        // Esperar a que termine la animación para generar el contenido
        this.on('animationcomplete-chest-open', this.spawnContent, this);
        
        // Marcar como abierto después de un breve retraso
        this.scene.time.delayedCall(300, () => {
            this.isOpen = true;
            this.isOpening = false;
        });
        
        return true;
    }
    
    // Efecto visual de apertura
    createOpeningEffect() {
        // Brillo alrededor del cofre
        const glow = this.scene.add.sprite(this.x, this.y, 'chest-glow');
        glow.setAlpha(0);
        glow.setScale(0.5);
        
        // Tween para hacer aparecer y desaparecer el brillo
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.7,
            scale: 1,
            duration: 300,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                glow.destroy();
            }
        });
        
        // Partículas doradas
        if (this.scene.add.particles) {
            const particles = this.scene.add.particles('jump_particle_1'); // Reutilizamos partículas existentes
            
            const emitter = particles.createEmitter({
                x: this.x,
                y: this.y - 10,
                speed: { min: 50, max: 200 },
                angle: { min: -100, max: -80 },
                scale: { start: 0.5, end: 0 },
                lifespan: 800,
                blendMode: 'ADD',
                gravityY: 300,
                quantity: 1,
                frequency: 20
            });
            
            // Detener emisión después de un tiempo
            this.scene.time.delayedCall(500, () => {
                emitter.stop();
                
                // Eliminar el emisor después de que todas las partículas desaparezcan
                this.scene.time.delayedCall(1000, () => {
                    particles.destroy();
                });
            });
        }
    }
    
    // Generar contenido aleatorio basado en probabilidades
    getRandomContent() {
        if (this.contentType !== 'random') {
            return this.contentType;
        }
        
        const rand = Math.random();
        let cumulativeProbability = 0;
        
        for (const type of this.contentTypes) {
            cumulativeProbability += this.contentProbabilities[type];
            if (rand < cumulativeProbability) {
                return type;
            }
        }
        
        // Por defecto, dar puntos
        return 'points';
    }
    
    // Generar el contenido cuando se abre el cofre
    spawnContent() {
        if (!this.scene || !this.active) return;
        
        // Obtener tipo de contenido
        const contentType = this.getRandomContent();
        console.log(`Cofre generando contenido: ${contentType}`);
        
        // Crear efecto de partículas al salir el contenido
        this.createContentEmergingEffect(contentType);
        
        // Comprobar si existen las texturas necesarias
        let textureName;
        if (contentType.startsWith('weapon_')) {
            textureName = `${contentType.replace('weapon_', '')}-pickup`;
        } else {
            textureName = `powerup_${contentType}`;
        }
        
        // Verificar si la textura existe
        if (!this.scene.textures.exists(textureName)) {
            console.warn(`La textura ${textureName} no existe. Texturas disponibles:`, 
                Array.from(this.scene.textures.keys()).slice(0, 20));
        }
        
        // Determinar qué tipo de powerup crear
        if (contentType.startsWith('weapon_')) {
            // Es un arma, crea un pickup de arma
            const weaponType = contentType.replace('weapon_', '');
            
            // Pequeña demora para que las partículas se muestren primero
            this.scene.time.delayedCall(400, () => {
                // Asegurarse de que la textura del pickup exista
                const pickupTextureName = `${weaponType}-pickup`;
                if (!this.scene.textures.exists(pickupTextureName)) {
                    console.error(`Textura ${pickupTextureName} no encontrada. Usando textura de fallback.`);
                    // Usar una textura alternativa si la original no existe
                    this.scene.load.image(pickupTextureName, 'assets/images/Weapons/spear-pickup.png');
                    this.scene.load.once('complete', () => {
                        const pickup = this.scene.spawnWeaponPickup(this.x, this.y - 40, weaponType);
                        this.setupPickupEffects(pickup);
                    });
                    this.scene.load.start();
                } else {
                    const pickup = this.scene.spawnWeaponPickup(this.x, this.y - 40, weaponType);
                    this.setupPickupEffects(pickup);
                }
            });
        } else {
            // Es otro tipo de power-up
            this.scene.time.delayedCall(400, () => {
                // Asegurarse de que la textura del powerup exista
                const powerupTextureName = `powerup_${contentType}`;
                if (!this.scene.textures.exists(powerupTextureName)) {
                    console.error(`Textura ${powerupTextureName} no encontrada. Usando textura de fallback.`);
                    // Usar una textura alternativa si la original no existe
                    this.scene.load.image(powerupTextureName, 'assets/images/Items/powerup_points.png');
                    this.scene.load.once('complete', () => {
                        this.createAndSetupPowerup(contentType);
                    });
                    this.scene.load.start();
                } else {
                    this.createAndSetupPowerup(contentType);
                }
            });
        }
    }
    
    // Método auxiliar para crear y configurar un powerup
    createAndSetupPowerup(contentType) {
        try {
            // Crear el powerup y añadirlo al grupo de powerups
            const powerup = this.scene.powerups.create(this.x, this.y - 40, `powerup_${contentType}`);
            
            // Si no se pudo crear el powerup, mostrar un error
            if (!powerup) {
                console.error(`No se pudo crear el powerup de tipo ${contentType}`);
                return;
            }
            
            // Configurar propiedades del powerup
            powerup.powerupType = contentType;
            powerup.setScale(1.5); // Hacer el powerup más grande y visible
            
            // Asegurarse de que no le afecte la gravedad
            if (powerup.body) {
                powerup.body.setAllowGravity(false);
            }
            
            // Loggear información para depurar
            console.log(`Powerup creado: ${contentType}`, 
                powerup.x, powerup.y, 
                'Textura:', powerup.texture.key, 
                'Frame:', powerup.frame.name);
            
            // Efecto de flotación para el powerup
            this.scene.tweens.add({
                targets: powerup,
                y: powerup.y - 15,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Efecto de brillo
            this.scene.tweens.add({
                targets: powerup,
                alpha: 0.7,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
            
            // Añadir tiempo de vida al powerup (30 segundos)
            this.scene.time.delayedCall(25000, () => {
                if (powerup && powerup.active) {
                    // Parpadeo para indicar que desaparecerá pronto
                    this.scene.tweens.add({
                        targets: powerup,
                        alpha: 0.3,
                        duration: 200,
                        yoyo: true,
                        repeat: 10,
                        onComplete: () => {
                            // Animación final de desaparición
                            this.scene.tweens.add({
                                targets: powerup,
                                alpha: 0,
                                y: powerup.y - 30,
                                scale: 1.5,
                                duration: 800,
                                ease: 'Back.easeIn',
                                onComplete: () => {
                                    powerup.destroy();
                                }
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error al crear powerup:', error);
        }
    }
    
    // Método auxiliar para configurar efectos en un pickup de arma
    setupPickupEffects(pickup) {
        if (pickup && pickup.active) {
            // Hacer el pickup más grande y visible
            pickup.setScale(1.5);
            
            // Efecto de flotación
            this.scene.tweens.add({
                targets: pickup,
                y: pickup.y - 15,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Efecto de brillo
            this.scene.tweens.add({
                targets: pickup,
                alpha: 0.7,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    // Efecto visual de aparición del contenido
    createContentEmergingEffect(contentType) {
        // Partículas brillantes emergiendo del cofre
        if (this.scene.add.particles) {
            const particles = this.scene.add.particles('jump_particle_1');
            
            const emitter = particles.createEmitter({
                x: this.x,
                y: this.y - 15,
                speed: { min: 50, max: 150 },
                angle: { min: -180, max: 0 },
                scale: { start: 0.6, end: 0 },
                lifespan: 1000,
                blendMode: 'ADD',
                tint: contentType.startsWith('weapon_') ? 0x00FFFF : 0xFFFF00,
                gravityY: 100,
                frequency: 20,
                quantity: 2
            });
            
            // Detener emisión después de un tiempo
            this.scene.time.delayedCall(500, () => {
                emitter.stop();
                
                // Eliminar el emisor después de que todas las partículas desaparezcan
                this.scene.time.delayedCall(1000, () => {
                    particles.destroy();
                });
            });
        }
        
        // Brillo en el cofre
        const glow = this.scene.add.sprite(this.x, this.y, 'chest-glow');
        glow.setAlpha(0);
        glow.setScale(0.8);
        
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.8,
            scale: 1.2,
            duration: 400,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                glow.destroy();
            }
        });
    }

    // Método para abrir el cofre
    open() {
        if (this.isOpen || this.isOpening) return; // Si ya está abierto, no hacer nada
        
        this.isOpening = true;
        
        // Reproducir sonido de apertura del cofre
        if (this.scene.cache.audio.exists('chest-open')) {
            this.scene.sound.play('chest-open', { volume: 0.6 });
        }
        
        // Reproducir animación de apertura
        this.play('chest-open');
        
        // Crear efecto de brillo/partículas al abrir
        this.createOpeningEffect();
        
        // Esperar a que termine la animación para generar el contenido
        this.on('animationcomplete-chest-open', this.spawnContent, this);
        
        // Marcar como abierto después de un breve retraso
        this.scene.time.delayedCall(300, () => {
            this.isOpen = true;
            this.isOpening = false;
        });
    }

    // Método para generar un power-up
    spawnPowerUp() {
        const powerUpTypes = ['new-weapon', 'armor', 'extra-points'];
        const randomType = Phaser.Utils.Array.GetRandom(powerUpTypes);
        const powerUp = this.scene.spawnPowerUp(this.x, this.y - 30, randomType);
        
        // Hacer que el power-up flote
        this.scene.tweens.add({
            targets: powerUp,
            y: this.y - 50,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

export default Chest; 