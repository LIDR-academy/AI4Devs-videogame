class Skeleton extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Iniciamos con la textura del esqueleto
        super(scene, x, y, 'skeleton_standing');
        
        // Añadir el esqueleto a la escena y habilitar la física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(40, 60);         // Área de colisión
        this.body.setOffset(10, 4);        // Centrar colisión
        this.setDepth(1);                  // Asegurar que se dibuje sobre el fondo
        this.setOrigin(0.5, 1);            // Punto de origen en la base del sprite
        
        // Variables del esqueleto
        this.speed = 50;                   // Velocidad base
        this.isActive = false;             // Comienza inactivo (bajo tierra)
        this.direction = 1;                // 1 = derecha, -1 = izquierda
        this.detectionRange = 350;         // Rango de detección
        this.attackRange = 300;            // Rango para lanzar huesos
        this.attackCooldown = 0;           // Tiempo hasta poder atacar
        this.attackDelay = 2000;           // 2 segundos entre ataques
        this.isAttacking = false;          // Estado de ataque
        this.bones = null;                 // Grupo de proyectiles (huesos)
        this.isEmerging = false;           // Estado de emergencia del suelo
        this.hasEmerged = false;           // Ha emergido completamente
        this.target = null;                // Objetivo (el jugador)
        
        // Sistema de salud y daño
        this.maxHealth = 3;                // Esqueletos requieren 3 golpes para morir
        this.health = this.maxHealth;
        this.isHurt = false;               // Flag para controlar el estado de herido
        
        // Crear grupo para los huesos
        this.createProjectiles(scene);
        
        // Ocultar inicialmente el esqueleto (bajo tierra)
        this.setAlpha(0);
        this.body.enable = false;
        
        console.log('Esqueleto creado en:', x, y);
    }
    
    // Método para establecer el objetivo del esqueleto
    setTarget(player) {
        this.target = player;
        console.log('Target establecido para el esqueleto:', player);
        
        // Activar el esqueleto si no está activo
        if (!this.isActive && !this.isEmerging) {
            this.isActive = true;
            this.setAlpha(1);
            this.body.enable = true;
            
            // Si existe animación de emerge, reproducirla
            if (this.scene.anims.exists('skeleton-emerge')) {
                this.play('skeleton-emerge', true);
                
                // Establecer evento para cuando termina la animación
                this.on('animationcomplete-skeleton-emerge', () => {
                    if (this.scene.anims.exists('skeleton-idle')) {
                        this.play('skeleton-idle', true);
                    }
                });
            } else {
                // Si no existe animación de emerge, mostrar idle
                if (this.scene.anims.exists('skeleton-idle')) {
                    this.play('skeleton-idle', true);
                }
            }
        }
        
        return this;
    }
    
    createProjectiles(scene) {
        // Crear grupo de proyectiles con física
        this.bones = scene.physics.add.group({
            defaultKey: 'bone_projectile',
            maxSize: 6                    // Máximo 6 huesos simultáneos
        });
        
        // Configurar colisiones entre huesos y jugador
        scene.physics.add.collider(
            this.bones,
            scene.player,
            this.handleBonePlayerCollision,
            null,
            this
        );
        
        // Configurar colisiones entre huesos y plataformas
        scene.physics.add.collider(
            this.bones,
            scene.platforms,
            this.handleBonePlatformCollision,
            null,
            this
        );
    }
    
    handleBonePlayerCollision(bone, player) {
        // Efecto visual de impacto
        this.createBoneImpact(bone.x, bone.y);
        
        // Aplicar daño al jugador
        if (player.takeDamage) {
            player.takeDamage(1);
        } else if (this.scene.handlePlayerTakeDamage) {
            this.scene.handlePlayerTakeDamage();
        }
        
        // Destruir el hueso
        bone.destroy();
    }
    
    handleBonePlatformCollision(bone, platform) {
        // Efecto visual de impacto
        this.createBoneImpact(bone.x, bone.y);
        
        // Destruir el hueso
        bone.destroy();
    }
    
    createBoneImpact(x, y) {
        // Crear partículas para el impacto
        const particles = this.scene.add.particles('bone_projectile', 0);
        
        // Configuración de emisor
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 600,
            quantity: 8
        });
        
        // Detener emisión después de un único estallido
        this.scene.time.delayedCall(100, () => {
            emitter.stop();
            // Destruir las partículas después de que terminen
            this.scene.time.delayedCall(600, () => {
                particles.destroy();
            });
        });
        
        // Sonido de impacto
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('bone-impact', { volume: 0.4 });
        }
    }
    
    update(player) {
        try {
            // Verificar si está activo y si el jugador es válido
            if (!this.active || !player || !player.active) return;
            
            // Si está emergiendo, no hacer nada más
            if (this.isEmerging) return;
            
            // Reducir el tiempo de cooldown si existe
            if (this.attackCooldown > 0) {
                this.attackCooldown -= 16; // Aproximación de 60fps
            }
            
            // Calcular distancia al jugador
            const distanceToPlayer = Phaser.Math.Distance.Between(
                this.x, this.y,
                player.x, player.y
            );
            
            // Si el esqueleto tiene poca vida, intenta escapar para lanzar desde la distancia
            if (this.health <= 1 && distanceToPlayer < 100) {
                // Determinar dirección de huida (contraria al jugador)
                const escapeDirection = player.x < this.x ? 1 : -1;
                this.setVelocityX(this.speed * 1.3 * escapeDirection);
                this.setFlipX(escapeDirection === -1);
                
                // Intentar saltar para escapar, pero con probabilidad limitada
                if (this.body.touching.down && Phaser.Math.FloatBetween(0, 1) < 0.01) { // Reducido de 0.05 a 0.01
                    this.setVelocityY(-300);
                }
                
                // Intentar atacar mientras escapa
                if (this.attackCooldown <= 0 && Phaser.Math.FloatBetween(0, 1) < 0.1) { // Reducido de 0.3 a 0.1
                    this.attack(player);
                }
                
                return;
            }
            
            // Si el jugador está dentro del rango de detección
            if (distanceToPlayer <= this.detectionRange) {
                // Determinar lado del jugador
                const playerSide = player.x < this.x ? -1 : 1;
                
                // Voltear el sprite según la posición del jugador
                this.setFlipX(playerSide === -1);
                
                // Si está en rango de ataque y el ataque está disponible
                if (distanceToPlayer <= this.attackRange && this.attackCooldown <= 0) {
                    // Probabilidades de ataque según la distancia
                    let attackProbability = 0.3; // Reducido de 0.8 a 0.3
                    
                    // Si el jugador está muy cerca, menor probabilidad de ataque
                    if (distanceToPlayer < 100) {
                        attackProbability = 0.2; // Reducido de 0.5 a 0.2
                        
                        // Alejarse un poco para tener mejor ángulo de tiro
                        const retreatDirection = playerSide * -1;
                        this.setVelocityX(this.speed * 0.8 * retreatDirection);
                    } else if (distanceToPlayer > 250) {
                        // Distancia óptima, mayor probabilidad de ataque
                        attackProbability = 0.4; // Reducido de 0.9 a 0.4
                    }
                    
                    // Decidir si atacar basado en la probabilidad
                    if (Phaser.Math.FloatBetween(0, 1) < attackProbability) {
                        // Detenerse brevemente antes de atacar
                        this.setVelocityX(0);
                        this.attack(player);
                        return;
                    }
                }
                
                // Comportamiento de persecución inteligente
                if (Math.abs(player.y - this.y) > 50 && this.body.touching.down) {
                    // El jugador está a una altura diferente, intentar posicionarse en un punto ventajoso
                    if (Phaser.Math.FloatBetween(0, 1) < 0.005) { // Reducido de 0.02 a 0.005
                        this.setVelocityY(-300); // Saltar para reposicionarse
                    }
                }
                
                // Si no está atacando, moverse hacia/alrededor del jugador
                if (distanceToPlayer < 150) {
                    // Estando cerca, movimiento lateral aleatorio para confundir
                    const moveDirection = Phaser.Math.FloatBetween(0, 1) < 0.3 ? playerSide * -1 : playerSide;
                    this.setVelocityX(this.speed * moveDirection);
                } else {
                    // Acercarse al jugador a velocidad variable pero más predecible
                    const approachSpeed = this.speed * (0.7 + Phaser.Math.FloatBetween(0, 0.3)); // Reducido el rango aleatorio
                    this.setVelocityX(approachSpeed * playerSide);
                }
                
                // Animar el movimiento
                if (this.body.velocity.x !== 0) {
                    if (this.anims.exists('skeleton-walk')) {
                        this.play('skeleton-walk', true);
                    } else if (this.anims.exists('zombie-walk')) {
                        this.play('zombie-walk', true); // Fallback
                    }
                } else {
                    if (this.anims.exists('skeleton-idle')) {
                        this.play('skeleton-idle', true);
                    }
                }
            } else {
                // Comportamiento de patrulla cuando el jugador está lejos
                this.setVelocityX(this.speed * this.direction * 0.7);
                
                // Cambiar dirección al chocar con obstáculos o aleatoriamente
                if (this.body.blocked.left || this.body.blocked.right || Phaser.Math.FloatBetween(0, 1) < 0.005) { // Reducido de 0.01 a 0.005
                    this.direction *= -1;
                    this.setFlipX(this.direction === -1);
                }
                
                // Pausas ocasionales
                if (Phaser.Math.FloatBetween(0, 1) < 0.002) { // Reducido de 0.005 a 0.002
                    this.setVelocityX(0);
                    
                    // Animar estado idle
                    if (this.anims.exists('skeleton-idle')) {
                        this.play('skeleton-idle', true);
                    }
                    
                    // Reanudar movimiento después de una pausa
                    this.scene.time.delayedCall(1000, () => {
                        if (this.active) {
                            // Posibilidad de cambiar dirección después de la pausa
                            if (Phaser.Math.FloatBetween(0, 1) < 0.5) {
                                this.direction *= -1;
                                this.setFlipX(this.direction === -1);
                            }
                        }
                    });
                } else if (this.anims.exists('skeleton-walk')) {
                    this.play('skeleton-walk', true);
                } else if (this.anims.exists('zombie-walk')) {
                    this.play('zombie-walk', true); // Fallback
                }
            }
        } catch (error) {
            console.error("Error en Skeleton.update:", error);
        }
    }
    
    attack(player) {
        if (this.attackCooldown > 0 || !this.active) return;
        
        try {
            console.log('Esqueleto atacando');
            
            // Establecer cooldown de ataque
            this.attackCooldown = this.attackDelay;
            
            // Detener movimiento horizontal
            this.setVelocityX(0);
            
            // Reproducir animación de ataque
            if (this.anims.exists('skeleton-attack')) {
                this.play('skeleton-attack');
            }
            
            // Sonido de ataque
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('skeleton-throw', { volume: 0.4 });
            }
            
            // Después de un pequeño delay, lanzar el hueso (para sincronizar con la animación)
            this.scene.time.delayedCall(300, () => {
                if (!this.active) return;
                
                // Crear el hueso
                this.throwBone(player);
            });
        } catch (error) {
            console.error("Error en Skeleton.attack:", error);
        }
    }
    
    throwBone(player) {
        try {
            // Calcular dirección hacia el jugador
            const dirToPlayer = player.x < this.x ? -1 : 1;
            
            // Calcular ángulo de lanzamiento para mayor precisión
            const deltaX = player.x - this.x;
            const deltaY = player.y - this.y;
            
            // Añadir predicción de movimiento del jugador
            const playerVelocityFactor = 0.5;  // Factor para ajustar la predicción
            const predictedX = player.x + (player.body.velocity.x * playerVelocityFactor);
            const predictedY = player.y + (player.body.velocity.y * playerVelocityFactor);
            
            // Recalcular deltas con la posición predicha
            const predictedDeltaX = predictedX - this.x;
            const predictedDeltaY = predictedY - this.y;
            
            // Velocidad base del hueso
            const boneSpeed = 200;
            
            // Crear hueso y configurar propiedades
            const bone = this.bones.create(
                this.x + (20 * dirToPlayer),
                this.y - 20,
                'bone'
            );
            
            if (bone) {
                // Configurar física del hueso
                bone.setDepth(1)
                    .setCollideWorldBounds(true)
                    .setScale(1.0);
                
                // Ajustar cuerpo de colisión
                bone.body.setSize(16, 16);
                
                // Calcular velocidad basada en la distancia al objetivo
                const distance = Math.sqrt(predictedDeltaX * predictedDeltaX + predictedDeltaY * predictedDeltaY);
                const time = distance / boneSpeed;
                
                // Calcular velocidades para alcanzar al jugador
                // Incluir ajuste para la gravedad
                const velocityX = predictedDeltaX / time;
                const gravity = this.scene.physics.world.gravity.y;
                // Fórmula ajustada para compensar la gravedad
                const velocityY = (predictedDeltaY / time) - (gravity * time / 2);
                
                // Aplicar velocidad al hueso
                bone.setVelocity(velocityX, velocityY);
                
                // Rotar el hueso continuamente
                this.scene.tweens.add({
                    targets: bone,
                    angle: 360,
                    duration: 800,
                    repeat: -1
                });
                
                // Destruir el hueso después de un tiempo si no ha colisionado
                this.scene.time.delayedCall(3000, () => {
                    if (bone.active) {
                        bone.destroy();
                    }
                });
                
                // Detectar colisiones con el jugador
                this.scene.physics.add.overlap(
                    bone,
                    player,
                    this.handleBonePlayerCollision,
                    null,
                    this
                );
                
                // Detectar colisiones con plataformas
                this.scene.physics.add.collider(
                    bone,
                    this.scene.platforms,
                    this.handleBonePlatformCollision,
                    null,
                    this
                );
            }
        } catch (error) {
            console.error("Error en Skeleton.throwBone:", error);
        }
    }
    
    // Método para recibir daño
    takeDamage(damage) {
        try {
            // Si ya está muerto o emergiendo, no recibe daño
            if (!this.isActive || this.isEmerging) return false;
            
            // Si ya está herido y parpadeando, ignorar el daño
            if (this.isHurt) return false;
            
            this.health -= damage;
            console.log(`Esqueleto recibió ${damage} de daño. Salud restante: ${this.health}`);
            
            if (this.health <= 0) {
                // Esqueleto muere
                this.die();
                return true;
            } else {
                // Esqueleto está herido pero no muere
                this.showHurtEffect();
                return false;
            }
        } catch (error) {
            console.error("Error en Skeleton.takeDamage:", error);
            return false;
        }
    }
    
    // Efecto visual de daño
    showHurtEffect() {
        try {
            // Marcar como herido
            this.isHurt = true;
            
            // Cambiar color a blanco brillante
            this.setTint(0xffffff);
            
            // Sonido de daño
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('skeleton-hit', { volume: 0.5 });
            }
            
            // Efecto de parpadeo
            this.scene.tweens.add({
                targets: this,
                alpha: 0.5,
                duration: 100,
                ease: 'Linear',
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    if (!this.active) return;
                    this.clearTint();
                    this.setAlpha(1);
                    this.isHurt = false;
                }
            });
        } catch (error) {
            console.error("Error en Skeleton.showHurtEffect:", error);
            this.isHurt = false;
        }
    }
    
    die() {
        try {
            // Evitar que muera más de una vez
            if (!this.isActive) return;
            
            console.log('Esqueleto muriendo en:', this.x, this.y);
            
            // Marcar como inactivo y deshabilitar colisiones
            this.isActive = false;
            this.body.enable = false;
            
            // Detener cualquier movimiento
            this.setVelocity(0, 0);
            
            // Sonido de muerte
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('skeleton-death', { volume: 0.6 });
            }
            
            // Efecto visual de desintegración
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                y: this.y - 20,
                scaleX: 0.8,
                scaleY: 0.5,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    // Aumentar el contador de enemigos eliminados
                    if (this.scene.zombiesKilled !== undefined) {
                        this.scene.zombiesKilled++;
                    }
                    
                    // Añadir puntos
                    if (this.scene.score !== undefined) {
                        this.scene.score += 200 * (this.scene.pointsMultiplier || 1);
                        this.scene.updateScoreText();
                    }
                    
                    // Posibilidad de soltar un objeto
                    this.dropItem();
                    
                    // Destruir todos los huesos activos
                    this.destroyAllBones();
                    
                    // Eliminar el objeto
                    this.destroy();
                }
            });
            
            // Efecto de partículas de huesos rompiéndose
            this.createBoneParticles();
        } catch (error) {
            console.error("Error en Skeleton.die:", error);
        }
    }
    
    createBoneParticles() {
        try {
            const particles = this.scene.add.particles('bone_projectile', 0);
            
            // Configuración para simular huesos rompiéndose
            const emitter = particles.createEmitter({
                x: this.x,
                y: this.y - 30,
                speed: { min: 50, max: 150 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.5, end: 0 },
                lifespan: 1000,
                quantity: 15
            });
            
            // Detener emisión después de un único estallido
            this.scene.time.delayedCall(200, () => {
                emitter.stop();
                // Destruir las partículas después de que terminen
                this.scene.time.delayedCall(1000, () => {
                    particles.destroy();
                });
            });
        } catch (error) {
            console.error("Error en Skeleton.createBoneParticles:", error);
        }
    }
    
    destroyAllBones() {
        try {
            if (this.bones) {
                this.bones.getChildren().forEach(bone => {
                    if (bone.active) {
                        this.createBoneImpact(bone.x, bone.y);
                        bone.destroy();
                    }
                });
            }
        } catch (error) {
            console.error("Error en Skeleton.destroyAllBones:", error);
        }
    }
    
    dropItem() {
        try {
            // Probabilidad del 20% de soltar un power-up
            if (Math.random() < 0.2 && this.scene.spawnPowerup) {
                // Elegir un tipo aleatorio
                const types = ['points', 'weapon_dagger', 'armor'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                
                // Llamar al método de la escena para crear el power-up
                this.scene.spawnPowerup(this.x, this.y, randomType);
            }
        } catch (error) {
            console.error("Error en Skeleton.dropItem:", error);
        }
    }
}

export default Skeleton; 