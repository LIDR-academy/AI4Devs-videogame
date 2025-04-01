class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Inicializar con la textura del jefe volando
        super(scene, x, y, 'boss_flying');
        
        console.log('Constructor del jefe iniciado');
        
        // FORZAR VISIBILIDAD Y ESCALA - sin parpadeo
        this.setScale(2); // Hacer el jefe más grande
        this.setAlpha(1); // Asegurar visibilidad completa
        this.setVisible(true);
        this.setDepth(10); // Poner al jefe por encima de otros elementos
        
        // Verificar que las texturas existan
        if (!scene.textures.exists('boss_flying')) {
            console.error('ERROR: La textura boss_flying no existe en el constructor del jefe');
        }
        
        // Añadir a la escena y habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propiedades físicas - cuerpo más grande y mejor ajustado
        this.body.setSize(100, 80);
        this.body.setOffset(14, 24);
        this.body.setGravity(0, -800); // Contrarrestar la gravedad del juego
        this.body.setImmovable(false); // Permitir colisiones
        this.body.setCollideWorldBounds(true); // Mantener dentro del mundo
        
        // Estado del jefe
        this.active = true;
        this.health = 100;
        this.maxHealth = 100;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 500; // ms
        
        // Comportamiento
        this.state = 'inactive'; // 'inactive', 'flying', 'attacking', 'dying'
        this.targetPosition = new Phaser.Math.Vector2(x, y);
        this.flySpeed = 100;
        this.attackCooldown = 0;
        this.minAttackCooldown = 3000; // ms
        this.maxAttackCooldown = 5000; // ms
        this.projectiles = scene.physics.add.group();
        
        // Configuración de animaciones
        this.createAnimations();
        
        // Iniciar la animación de vuelo sin reiniciarla constantemente
        if (scene.anims.exists('boss_flying') && !this.anims.isPlaying) {
            this.play('boss_flying');
            console.log('Animación boss_flying iniciada en constructor');
        } else {
            console.error('No se pudo iniciar la animación boss_flying: no existe');
        }
        
        // Audio
        this.lastSoundTime = 0;
        this.soundCooldown = 1000; // ms
        
        // Agregar un debug visual para el jefe
        this.debugText = scene.add.text(0, -80, 'JEFE', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FF0000',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.debugText.setDepth(20);
        this.debugCircle = scene.add.circle(0, 0, 50, 0xFF0000, 0.3);
        this.debugCircle.setDepth(9);
        
        // Hacer que los elementos de debug sigan al jefe
        this.on('preUpdate', () => {
            this.debugText.setPosition(this.x, this.y - 80);
            this.debugCircle.setPosition(this.x, this.y);
        });
    }
    
    createAnimations() {
        try {
            // Comprobamos si las animaciones ya existen
            const scene = this.scene;
            console.log('Intentando crear animaciones del jefe');
            
            // Verificar que las texturas existan
            if (!scene.textures.exists('boss_flying')) {
                console.error('ERROR: La textura boss_flying no existe en createAnimations');
                return;
            }
            
            // Crear la animación de vuelo
            if (!scene.anims.exists('boss_flying')) {
                try {
                    scene.anims.create({
                        key: 'boss_flying',
                        frames: scene.anims.generateFrameNumbers('boss_flying', { start: 0, end: 7 }),
                        frameRate: 10,
                        repeat: -1
                    });
                    console.log('Animación boss_flying creada exitosamente');
                } catch (error) {
                    console.error('Error al crear animación boss_flying:', error);
                }
            }
            
            // Crear la animación de ataque
            if (!scene.anims.exists('boss_attack')) {
                try {
                    scene.anims.create({
                        key: 'boss_attack',
                        frames: scene.anims.generateFrameNumbers('boss_attack', { start: 0, end: 7 }),
                        frameRate: 10,
                        repeat: 0
                    });
                    console.log('Animación boss_attack creada exitosamente');
                } catch (error) {
                    console.error('Error al crear animación boss_attack:', error);
                }
            }
            
            // Crear la animación de muerte
            if (!scene.anims.exists('boss_death')) {
                try {
                    scene.anims.create({
                        key: 'boss_death',
                        frames: scene.anims.generateFrameNumbers('boss_death', { start: 0, end: 7 }),
                        frameRate: 8,
                        repeat: 0
                    });
                    console.log('Animación boss_death creada exitosamente');
                } catch (error) {
                    console.error('Error al crear animación boss_death:', error);
                }
            }
            
            console.log('Estado final de animaciones:',
                scene.anims.exists('boss_flying') ? 'boss_flying existe' : 'boss_flying NO existe',
                scene.anims.exists('boss_attack') ? 'boss_attack existe' : 'boss_attack NO existe',
                scene.anims.exists('boss_death') ? 'boss_death existe' : 'boss_death NO existe'
            );
            
        } catch (error) {
            console.error('Error en createAnimations:', error);
        }
    }
    
    // Activar el jefe (cuando el jugador se acerca)
    activate() {
        try {
            console.log('Método activate() del jefe llamado');
            
            // Verificar que el objeto esté activo y no haya sido destruido
            if (!this.scene) {
                console.log('Jefe sin escena, no se puede activar');
                return;
            }
            
            // Forzar que el jefe esté activo y visible
            this.setActive(true);
            this.setVisible(true);
            this.setAlpha(1);
            
            // Cambiar estado a volando (flying) si está inactivo
            if (this.state === 'inactive') {
                console.log('Cambiando estado del jefe de "inactive" a "flying"');
                this.state = 'flying';
                
                // Reproducir animación si es posible
                if (this.anims && typeof this.anims.play === 'function') {
                    console.log('Reproduciendo animación boss_flying');
                    // Forzar la creación de animaciones si no existen
                    this.createAnimations();
                    this.play('boss_flying');
                } else {
                    console.error('No se pueden reproducir animaciones del jefe: no hay método play');
                }
                
                // Sonido de rugido inicial
                if (this.scene.audioManager) {
                    console.log('Reproduciendo sonido boss-roar con AudioManager');
                    this.scene.audioManager.playSfx('boss-roar', { volume: 0.7 });
                } else if (this.scene.sound) {
                    console.log('Reproduciendo sonido boss-roar con scene.sound');
                    this.scene.sound.play('boss-roar', { volume: 0.7 });
                }
                
                // Crear barra de vida
                this.createHealthBar();
                
                // Efecto visual de activación
                if (this.scene.cameras && this.scene.cameras.main) {
                    this.scene.cameras.main.shake(300, 0.01);
                }
                
                // Mensaje de activación
                if (this.scene.add) {
                    const activationText = this.scene.add.text(
                        this.x,
                        this.y - 100,
                        '¡JEFE ACTIVADO!',
                        {
                            fontSize: '32px',
                            fontFamily: 'Arial',
                            color: '#FF0000',
                            stroke: '#000',
                            strokeThickness: 6
                        }
                    ).setOrigin(0.5);
                    
                    // Animación del texto
                    if (this.scene.tweens) {
                        this.scene.tweens.add({
                            targets: activationText,
                            scale: 1.5,
                            alpha: 0,
                            y: activationText.y - 50,
                            duration: 1500,
                            onComplete: () => {
                                activationText.destroy();
                            }
                        });
                    }
                }
                
                // Emitir evento de activación para otras partes del código que lo escuchan
                this.emit('activated');
                
                console.log('¡El jefe final ha sido activado exitosamente!');
            } else {
                console.log(`El jefe ya está en estado: ${this.state}`);
            }
        } catch (error) {
            console.error('Error al activar jefe:', error);
        }
    }
    
    // Crear barra de vida
    createHealthBar() {
        try {
            // Verificar que la escena exista
            if (!this.scene || !this.scene.add || !this.scene.cameras) return;
            
            const scene = this.scene;
            
            // Verificar que podamos acceder a las dimensiones de la cámara
            if (!scene.cameras.main) return;
            
            const barWidth = 200;
            const barHeight = 20;
            const barX = scene.cameras.main.width / 2 - barWidth / 2;
            const barY = 30;
            
            // Fondo de la barra (negro)
            this.healthBarBackground = scene.add.rectangle(
                barX, barY, barWidth, barHeight, 0x000000
            ).setOrigin(0).setScrollFactor(0).setDepth(100);
            
            // Borde de la barra (gris)
            this.healthBarBorder = scene.add.rectangle(
                barX, barY, barWidth, barHeight, 0x808080, 0
            ).setOrigin(0).setScrollFactor(0).setDepth(101)
            .setStrokeStyle(2, 0x808080);
            
            // Barra de vida (rojo)
            this.healthBarFill = scene.add.rectangle(
                barX + 2, barY + 2, barWidth - 4, barHeight - 4, 0xcc0000
            ).setOrigin(0).setScrollFactor(0).setDepth(102);
            
            // Texto "BOSS"
            this.healthBarText = scene.add.text(
                barX, barY - 25, 'JEFE FINAL', 
                { fontSize: '20px', fill: '#ffffff', stroke: '#000000', strokeThickness: 4 }
            ).setOrigin(0).setScrollFactor(0).setDepth(103);
        } catch (error) {
            console.error('Error al crear barra de vida:', error);
        }
    }
    
    // Actualizar barra de vida
    updateHealthBar() {
        try {
            if (!this.healthBarFill || !this.healthBarBackground) {
                console.log('No se puede actualizar la barra de vida: no existe');
                return;
            }
            
            // Calcular ancho basado en la salud
            const fullWidth = (this.healthBarBackground.width - 4);
            const currentWidth = fullWidth * (this.health / this.maxHealth);
            
            // Actualizar el ancho de la barra
            this.healthBarFill.width = Math.max(0, currentWidth);
            
            // Cambiar color según la salud
            if (this.health < this.maxHealth * 0.3) {
                this.healthBarFill.fillColor = 0xff0000; // Rojo brillante
            } else if (this.health < this.maxHealth * 0.6) {
                this.healthBarFill.fillColor = 0xff7700; // Naranja
            }
            
            // Actualizar texto con porcentaje de salud
            if (this.healthBarText) {
                const healthPercent = Math.floor((this.health / this.maxHealth) * 100);
                this.healthBarText.setText(`JEFE FINAL - ${healthPercent}%`);
            }
            
            console.log(`Barra de vida actualizada: ${this.health}/${this.maxHealth} (${Math.floor((this.health/this.maxHealth)*100)}%)`);
        } catch (error) {
            console.error('Error al actualizar barra de vida:', error);
        }
    }
    
    // Recibir daño
    takeDamage(damage) {
        try {
            // Si el jefe está muriendo o es invulnerable, ignorar el daño
            if (this.state === 'dying') {
                console.log('El jefe está muriendo, no recibe daño');
                return false;
            }
            
            if (this.isInvulnerable) {
                console.log('El jefe es invulnerable en este momento, no recibe daño');
                return false;
            }
            
            // Asegurar que el daño sea al menos 10 para testing
            damage = Math.max(damage, 10);
            console.log(`El jefe recibe ${damage} puntos de daño!`);
            
            // Reproducir sonido de daño si está disponible
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('boss-hit', { volume: 0.5 });
            }
            
            // Reducir la salud y asegurar que no baje de 0
            this.health -= damage;
            this.health = Math.max(0, this.health);
            console.log(`Salud actual del jefe: ${this.health}/${this.maxHealth}`);
            
            // Mostrar efecto de daño (parpadeo rojo)
            this.showDamageEffect();
            
            // Actualizar la barra de salud
            this.updateHealthBar();
            
            // Si la salud llega a 0, el jefe muere
            if (this.health <= 0) {
                console.log('¡El jefe ha sido derrotado!');
                this.die();
                return true;
            }
            
            // Hacer al jefe temporalmente invulnerable tras recibir daño
            this.isInvulnerable = true;
            this.scene.time.delayedCall(500, () => {
                this.isInvulnerable = false;
            });
            
            return true;
        } catch (error) {
            console.error('Error en takeDamage:', error);
            return false;
        }
    }
    
    // Mostrar efecto visual cuando el jefe recibe daño
    showDamageEffect() {
        try {
            // Aplicar tint rojo intenso
            this.setTint(0xff0000);

            // Efecto de sacudida leve
            const originalY = this.y;
            const shakeIntensity = 5;
            
            // Secuencia de sacudida
            this.scene.tweens.add({
                targets: this,
                y: originalY - shakeIntensity,
                duration: 50,
                yoyo: true,
                repeat: 2,
                ease: 'Power2'
            });
            
            // Mostrar texto de daño
            const damageText = this.scene.add.text(
                this.x, 
                this.y - 50, 
                'DAÑO!', 
                { 
                    fontSize: '24px', 
                    fontFamily: 'Arial',
                    color: '#ff0000',
                    stroke: '#000',
                    strokeThickness: 4
                }
            );
            damageText.setOrigin(0.5, 0.5);
            
            // Animar el texto de daño
            this.scene.tweens.add({
                targets: damageText,
                y: damageText.y - 30,
                alpha: 0,
                duration: 800,
                onComplete: () => damageText.destroy()
            });
            
            // Eliminar el tint después de un breve tiempo
            this.scene.time.delayedCall(200, () => {
                this.clearTint();
            });
            
        } catch (error) {
            console.error('Error en showDamageEffect:', error);
        }
    }
    
    // Morir
    die() {
        if (this.state === 'dying') return;
        
        this.state = 'dying';
        this.body.setVelocity(0, 0);
        this.body.setAcceleration(0, 0);
        
        // Desactivar colisiones
        this.body.enable = false;
        
        // Reproducir animación de muerte
        this.play('boss_death');
        
        // Reproducir sonido de muerte usando AudioManager
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('boss-death', { volume: 0.7 });
        }
        
        // Evento al completar la animación de muerte
        this.on('animationcomplete-boss_death', () => {
            // Crear efecto final de explosión
            this.createDeathExplosion();
            
            // Ocultar barra de vida
            if (this.healthBarBackground) this.healthBarBackground.destroy();
            if (this.healthBarBorder) this.healthBarBorder.destroy();
            if (this.healthBarFill) this.healthBarFill.destroy();
            if (this.healthBarText) this.healthBarText.destroy();
            
            // Notificar a la escena
            this.scene.bossDefeated();
            
            // Destruir tras un breve retraso
            this.scene.time.delayedCall(1000, () => {
                this.destroy();
            });
        });
    }
    
    // Crear explosión al morir
    createDeathExplosion() {
        const explosionConfig = {
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 2 },
            speed: { min: 50, max: 200 },
            lifespan: 1000,
            blendMode: 'ADD',
            frequency: 20,
            quantity: 5,
            tint: 0xff0000
        };
        
        if (this.scene.add.particles) {
            const explosionParticles = this.scene.add.particles('boss_fireball');
            const emitter = explosionParticles.createEmitter(explosionConfig);
            
            // Posicionar y emitir
            emitter.setPosition(this.x, this.y);
            
            // Detener emisión después de un tiempo
            this.scene.time.delayedCall(500, () => {
                emitter.stop();
                
                // Eliminar tras un retraso para que se vean las partículas
                this.scene.time.delayedCall(1000, () => {
                    explosionParticles.destroy();
                });
            });
        }
        
        // Sacudir la cámara
        this.scene.cameras.main.shake(1000, 0.02);
    }
    
    // Iniciar ataque
    startAttack() {
        try {
            if (!this.canAttack || this.state !== 'active') {
                console.log('No se puede atacar ahora o jefe inactivo');
                return;
            }
            
            // Establecer estado
            this.state = 'attacking';
            this.canAttack = false;
            
            // Detener movimiento
            this.body.setVelocity(0, 0);
            
            // Reproducir animación de ataque
            this.play('boss_attack');
            
            // Reproducir sonido de ataque con AudioManager
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('boss-attack', { volume: 0.6 });
            }
            
            // Retrasar el disparo para sincronizar con la animación
            this.scene.time.delayedCall(500, () => {
                this.fireProjectile();
            });
            
            // Cambiar de vuelta a estado activo después de atacar
            this.on('animationcomplete-boss_attack', () => {
                this.state = 'active';
                
                // Establecer un enfriamiento para el próximo ataque
                this.scene.time.delayedCall(this.attackCooldown, () => {
                    this.canAttack = true;
                    this.play('boss_flying');
                });
            });
            
        } catch (error) {
            console.error('Error en startAttack:', error);
            this.state = 'active';
            this.play('boss_flying');
        }
    }
    
    // Lanzar una bola de fuego
    fireProjectile() {
        try {
            if (this.state !== 'attacking') return;
            
            // Obtener la posición del jugador
            const targetX = this.scene.player.x;
            const targetY = this.scene.player.y;
            
            // Crear una bola de fuego
            const fireball = this.scene.physics.add.sprite(
                this.x - 30, 
                this.y, 
                'boss_fireball'
            ).setScale(0.7);
            
            // Propiedades físicas
            fireball.body.setAllowGravity(false);
            
            // Sonido de lanzamiento
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('boss-attack', { volume: 0.5 });
            }
            
            // Calcular la dirección hacia el jugador
            const angle = Phaser.Math.Angle.Between(
                fireball.x, fireball.y,
                targetX, targetY
            );
            
            // Velocidad
            const speed = 350;
            fireball.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Efectos visuales de la bola de fuego
            fireball.setTint(0xff7700);
            
            // Permitir colisiones con el jugador
            this.scene.physics.add.collider(
                fireball, 
                this.scene.player,
                (fireball, player) => {
                    fireball.destroy();
                    // Causar daño al jugador (si tiene método para recibir daño)
                    if (player.takeDamage) {
                        player.takeDamage(1);
                    }
                }
            );
            
            // Permitir colisiones con plataformas
            this.scene.physics.add.collider(
                fireball,
                this.scene.platforms,
                (fireball) => {
                    fireball.destroy();
                }
            );
            
            // Agregar un timeout para destruir la bola de fuego después de cierto tiempo
            this.scene.time.delayedCall(5000, () => {
                if (fireball.active) {
                    fireball.destroy();
                }
            });
            
        } catch (error) {
            console.error('Error en fireProjectile:', error);
        }
    }
    
    // Actualizar posición objetivo (seguimiento del jugador)
    updateTargetPosition() {
        try {
            // Verificar que tengamos acceso a la escena y al jugador
            if (!this.scene || !this.scene.player || !this.scene.player.active || this.state !== 'flying') return;
            
            const player = this.scene.player;
            
            // Verificar que tengamos acceso a las propiedades del mundo físico
            if (!this.scene.physics || !this.scene.physics.world || !this.scene.physics.world.bounds) return;
            
            // Obtener los límites del nivel
            const levelWidth = this.scene.levelWidth || 3200;
            
            // Forzar al jefe a mantenerse en el último tercio del nivel
            const bossMinX = levelWidth - 800; // Último cuarto del nivel
            
            // Calcular nueva posición objetivo
            // El jefe intentará mantenerse a cierta distancia del jugador
            const distanceX = 300; // Distancia horizontal
            const minHeightAbovePlayer = 100; // Altura mínima por encima del jugador
            const maxHeightAbovePlayer = 200; // Altura máxima por encima del jugador
            
            // Calcular posiciones iniciales (usar let para permitir reasignación)
            let targetX;
            let targetY;
            
            // Calcular altura relativa al jugador
            targetY = player.y - Phaser.Math.Between(minHeightAbovePlayer, maxHeightAbovePlayer);
            
            // Intentar posicionarse frente al jugador (según la dirección del jugador)
            if (player.flipX) {
                // Jugador mirando a la izquierda, jefe a la izquierda
                targetX = player.x - distanceX;
                this.flipX = false;
            } else {
                // Jugador mirando a la derecha, jefe a la derecha
                targetX = player.x + distanceX;
                this.flipX = true;
            }
            
            // CORRECCIÓN IMPORTANTE: Mantener al jefe en la zona final del nivel
            targetX = Math.max(targetX, bossMinX);
            
            // Obtener límites del mundo
            const worldWidth = this.scene.physics.world.bounds.width;
            
            // Aplicar restricciones para mantener al jefe dentro de los límites del nivel
            targetX = Phaser.Math.Clamp(targetX, bossMinX, worldWidth - 100);
            targetY = Phaser.Math.Clamp(targetY, 100, this.scene.physics.world.bounds.height - 200);
            
            // Actualizar posición objetivo
            if (this.targetPosition) {
                this.targetPosition.x = targetX;
                this.targetPosition.y = targetY;
            }
            
            // Actualizar el texto de depuración con información de posición
            if (this.debugText) {
                this.debugText.setText(`JEFE\nX:${Math.floor(this.x)},Y:${Math.floor(this.y)}`);
            }
        } catch (error) {
            console.error('Error en updateTargetPosition:', error);
        }
    }
    
    // Mover hacia la posición objetivo
    moveToTarget() {
        try {
            // Verificaciones de seguridad
            if (!this.active || !this.body || this.state !== 'flying' || !this.targetPosition) {
                console.log('moveToTarget: No se puede mover, condiciones no cumplidas');
                return;
            }
            
            // Calcular dirección y distancia
            const dx = this.targetPosition.x - this.x;
            const dy = this.targetPosition.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Registrar información de movimiento para depuración
            if (Math.random() < 0.01) { // Reducir la frecuencia de los logs
                console.log(`Jefe moviéndose: posición actual (${this.x.toFixed(0)},${this.y.toFixed(0)}), objetivo (${this.targetPosition.x.toFixed(0)},${this.targetPosition.y.toFixed(0)}), distancia ${distance.toFixed(0)}`);
            }
            
            // Movimiento más directo hacia el objetivo
            // Si está muy lejos (más de 1000 píxeles), moverse directamente
            if (distance > 1000) {
                // Teletransportar más cerca del objetivo para evitar viajes largos
                this.x = this.targetPosition.x - (dx > 0 ? 500 : -500);
                this.y = this.targetPosition.y - (dy > 0 ? 100 : -100);
                console.log('Jefe teletransportado más cerca del objetivo', this.x, this.y);
                return;
            }
            
            // Si está lo suficientemente cerca, detenerse
            if (distance < 10) {
                this.body.setVelocity(0, 0);
                return;
            }
            
            // Calcular velocidad (más rápido cuando está lejos)
            const speed = Math.min(this.flySpeed || 100, distance);
            
            // Evitar división por cero
            if (distance > 0.1) {
                const vx = dx / distance * speed;
                const vy = dy / distance * speed;
                
                // Aplicar velocidad
                this.body.setVelocity(vx, vy);
                
                // Actualizar dirección visual
                if (vx < 0) {
                    this.flipX = false;
                } else if (vx > 0) {
                    this.flipX = true;
                }
            }
        } catch (error) {
            console.error('Error en moveToTarget:', error);
        }
    }
    
    // Decisión de patrones de ataque
    decideAction() {
        try {
            // Verificaciones de seguridad
            if (!this.active || !this.scene || !this.scene.player || !this.scene.player.active || this.state !== 'flying') return;
            
            // Verificar que tenemos acceso a deltaTime
            if (this.scene.time && typeof this.scene.time.deltaTime !== 'undefined') {
                // Reducir cooldown de ataque
                if (this.attackCooldown > 0) {
                    this.attackCooldown -= this.scene.time.deltaTime;
                }
            }
            
            // Obtener referencia al jugador
            const player = this.scene.player;
            
            // Calcular distancia al jugador
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            
            // Si está lo suficientemente cerca y no está en cooldown, atacar
            if (distance < 350 && this.attackCooldown <= 0) {
                this.startAttack();
            }
            
            // La frecuencia de ataque aumenta cuando tiene menos vida
            const healthFactor = this.health / this.maxHealth;
            this.flySpeed = 100 + (1 - healthFactor) * 100; // Más rápido con menos vida
        } catch (error) {
            console.error('Error en decideAction:', error);
        }
    }
    
    // Actualizar estado del jefe
    update() {
        try {
            // Verificaciones básicas de seguridad
            if (!this.active || !this.scene) return;
            
            // NO resetear constantemente la visibilidad y alpha - esto causa parpadeo
            
            // SOLO iniciar animación si NO está reproduciéndose ya
            if (!this.anims.isPlaying) {
                if (this.state === 'flying' && this.scene.anims.exists('boss_flying')) {
                    this.play('boss_flying');
                    console.log('Reiniciando animación boss_flying porque se detuvo');
                } else if (this.state === 'inactive' && this.scene.anims.exists('boss_flying')) {
                    this.play('boss_flying');
                }
            }
            
            // Si está inactivo, solo mantener la animación pero no hacer más
            if (this.state === 'inactive') {
                return;
            }
            
            // Si está muriendo, no hacer nada más
            if (this.state === 'dying') return;
            
            // Actualizar posición objetivo
            this.updateTargetPosition();
            
            // Mover hacia la posición objetivo
            this.moveToTarget();
            
            // Decidir acciones
            this.decideAction();
            
            // Actualizar proyectiles
            if (this.projectiles && this.projectiles.getChildren) {
                this.projectiles.getChildren().forEach(projectile => {
                    if (projectile && projectile.active) {
                        // Añadir efectos visuales a los proyectiles (rotación)
                        projectile.rotation += 0.1;
                    }
                });
            }
        } catch (error) {
            console.error('Error en Boss.update:', error);
        }
    }
}

export default Boss; 