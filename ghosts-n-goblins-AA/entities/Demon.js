class Demon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Iniciamos con la textura del demonio
        super(scene, x, y, 'demon_standing');
        
        // Añadir el demonio a la escena y habilitar la física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(45, 70);         // Área de colisión ajustada
        this.body.setOffset(10, 5);        // Ajuste de la hitbox
        this.setDepth(1);                  // Asegurar que se dibuje sobre el fondo
        this.setOrigin(0.5, 1);            // Origen en la base
        this.setScale(1);                  // Escala normal
        
        // Variables del demonio
        this.speed = 80;                   // Velocidad base
        this.isActive = false;             // Comienza inactivo
        this.direction = 1;                // 1 = derecha, -1 = izquierda
        this.detectionRange = 400;         // Rango de detección
        this.attackRange = 300;            // Rango para ataques
        this.attackCooldown = 0;           // Tiempo hasta poder atacar
        this.attackDelay = 2500;           // 2.5 segundos entre ataques
        this.isAttacking = false;          // Estado de ataque
        this.fireballs = null;             // Grupo de proyectiles (bolas de fuego)
        this.target = null;                // Objetivo (el jugador)
        
        // Sistema de salud y daño
        this.maxHealth = 6;                // Demonios requieren 6 golpes para morir
        this.health = this.maxHealth;
        this.isHurt = false;               // Flag para controlar el estado de herido
        this.isImmortal = false;           // Temporalmente invulnerable durante ciertos ataques
        
        // Crear grupo para las bolas de fuego
        this.createProjectiles(scene);
        
        // Desactivar gravedad si está volando
        this.body.setAllowGravity(!this.isFlying);
        
        // Ocultar inicialmente hasta activación
        this.setAlpha(0.5);
        this.body.enable = false;
        
        console.log('Demonio creado en:', x, y);
    }
    
    // Método para establecer el objetivo del demonio
    setTarget(player) {
        this.target = player;
        console.log('Target establecido para el demonio:', player);
        
        // Activar el demonio
        this.isActive = true;
        this.setAlpha(1);
        this.body.enable = true;
        
        // Si existe animación de aparición, reproducirla
        if (this.scene.anims.exists('demon-appear')) {
            this.play('demon-appear', true);
            
            // Establecer evento para cuando termina la animación
            this.on('animationcomplete-demon-appear', () => {
                if (this.scene.anims.exists('demon-idle')) {
                    this.play('demon-idle', true);
                }
            });
        } else {
            // Si no existe animación de aparición, mostrar idle
            if (this.scene.anims.exists('demon-idle')) {
                this.play('demon-idle', true);
            }
        }
        
        return this;
    }
    
    createProjectiles(scene) {
        // Crear grupo de proyectiles con física
        this.fireballs = scene.physics.add.group({
            defaultKey: 'demon_fireball', // Usar sprite de bola de fuego
            maxSize: 8                    // Máximo 8 bolas de fuego simultáneas
        });
        
        // Configurar colisiones entre bolas de fuego y jugador
        scene.physics.add.collider(
            this.fireballs,
            scene.player,
            this.handleFireballPlayerCollision,
            null,
            this
        );
        
        // Configurar colisiones entre bolas de fuego y plataformas
        scene.physics.add.collider(
            this.fireballs,
            scene.platforms,
            this.handleFireballPlatformCollision,
            null,
            this
        );
    }
    
    handleFireballPlayerCollision(fireball, player) {
        // Efecto visual de impacto
        this.createFireExplosion(fireball.x, fireball.y);
        
        // Aplicar daño al jugador
        if (player.takeDamage) {
            player.takeDamage(2); // Las bolas de fuego hacen más daño
        } else if (this.scene.handlePlayerTakeDamage) {
            this.scene.handlePlayerTakeDamage();
        }
        
        // Destruir la bola de fuego
        fireball.destroy();
    }
    
    handleFireballPlatformCollision(fireball, platform) {
        // Efecto visual de impacto
        this.createFireExplosion(fireball.x, fireball.y);
        
        // Destruir la bola de fuego
        fireball.destroy();
    }
    
    createFireExplosion(x, y) {
        // Crear partículas de fuego para la explosión
        const particles = this.scene.add.particles('demon_fireball', 0);
        
        // Configuración de emisor
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 60, max: 120 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.7, end: 0 },
            lifespan: 800,
            quantity: 10
        });
        
        // Detener emisión después de un único estallido
        this.scene.time.delayedCall(100, () => {
            emitter.stop();
            // Destruir las partículas después de que terminen
            this.scene.time.delayedCall(800, () => {
                particles.destroy();
            });
        });
        
        // Sonido de explosión
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('fireball-impact', { volume: 0.5 });
        }
    }
    
    update(player) {
        if (!this.isActive) return;
        
        // Reducir cooldown de ataque
        if (this.attackCooldown > 0) {
            this.attackCooldown -= 16; // Aproximación a delta time (60fps)
        }
        
        // Si está en animación de ataque, no hacer más
        if (this.isAttacking) return;
        
        // Gestionar vuelo si está activado
        if (this.isFlying) {
            this.updateFlying();
        }
        
        // Calcular distancia al jugador
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        // Si el jugador está dentro del rango de detección
        if (distanceToPlayer <= this.detectionRange) {
            // Determinar lado del jugador
            const playerSide = player.x < this.x ? -1 : 1;
            
            // Voltear el sprite según la posición del jugador
            this.setFlipX(playerSide === -1);
            
            // Probabilidad de empezar a volar si no está volando
            if (!this.isFlying && Math.random() < 0.01) {
                this.startFlying();
            }
            
            // Si está en rango de ataque y el ataque está disponible
            if (distanceToPlayer <= this.attackRange && this.attackCooldown <= 0) {
                this.attack(player);
                return;
            }
            
            // Si no está atacando, perseguir al jugador
            this.setVelocityX(this.speed * playerSide);
        } else {
            // Comportamiento de patrulla
            this.setVelocityX(this.speed * this.direction);
            
            // Cambiar dirección al chocar con obstáculos
            if (this.body.blocked.left || this.body.blocked.right) {
                this.direction *= -1;
                this.setFlipX(this.direction === -1);
            }
            
            // Si está volando y no hay jugador cerca, aterrizar
            if (this.isFlying && Math.random() < 0.02) {
                this.stopFlying();
            }
        }
        
        // Asegurar que la animación adecuada esté activa
        if (!this.anims.isPlaying) {
            // En lugar de usar una animación, simplemente establecer la textura correcta
            this.setTexture('demon_standing');
        }
    }
    
    startFlying() {
        // Activar modo de vuelo
        this.isFlying = true;
        this.body.setAllowGravity(false);
        this.flyingHeight = 0;
        
        // Efecto visual de elevación
        this.scene.tweens.add({
            targets: this,
            y: this.y - 20,
            duration: 500,
            ease: 'Power1',
            onStart: () => {
                // Sonido de aleteo
                if (this.scene.audioManager) {
                    this.scene.audioManager.playSfx('demon-flap', { volume: 0.4 });
                }
            }
        });
    }
    
    stopFlying() {
        // Desactivar modo de vuelo
        this.isFlying = false;
        this.body.setAllowGravity(true);
        
        // Efecto de descenso
        this.scene.tweens.add({
            targets: this,
            y: this.y + this.flyingHeight,
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
                this.flyingHeight = 0;
            }
        });
    }
    
    updateFlying() {
        // Movimiento ondulante durante el vuelo - versión más suave
        
        // Guardar la posición Y base (posición del cuerpo físico)
        const baseY = this.body.position.y;
        
        // Usar un movimiento sinusoidal para vuelo más suave en lugar de incrementar linealmente
        const time = this.scene.time.now / 500; // Factor de tiempo para que el movimiento sea más lento
        this.flyingHeight = (Math.sin(time) + 1) * (this.maxFlyingHeight / 2);
        
        // Aplicar la nueva posición Y con el offset de vuelo (sin cambiar la posición física real)
        this.y = baseY - this.flyingHeight;
    }
    
    attack(player) {
        // Iniciar ataque
        this.isAttacking = true;
        this.attackCooldown = this.attackDelay;
        
        // Cambiar textura para el ataque
        this.setTexture('demon_attack');
        
        // Detener movimiento horizontal durante el ataque
        this.setVelocityX(0);
        
        // Probabilidad de elegir entre diferentes ataques
        const attackType = Math.random();
        
        if (attackType < 0.7 || this.isFlying) {
            // Ataque a distancia: lanzar bola de fuego
            this.fireballAttack(player);
        } else {
            // Ataque cuerpo a cuerpo: embestida
            this.dashAttack(player);
        }
    }
    
    fireballAttack(player) {
        // Sonido de preparación para lanzar fuego
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('demon-attack', { volume: 0.5 });
        }
        
        // Retrasar el lanzamiento para sincronizar con la animación
        this.scene.time.delayedCall(300, () => {
            // Lanzar la bola de fuego
            this.throwFireball(player);
            
            // Finalizar ataque
            this.scene.time.delayedCall(200, () => {
                this.isAttacking = false;
                this.attackCooldown = this.attackDelay;
            });
        });
    }
    
    dashAttack(player) {
        // Preparación para embestida
        this.isImmortal = true; // Durante la embestida es invulnerable
        
        // Sonido de rugido
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('demon-roar', { volume: 0.6 });
        }
        
        // Efecto visual de preparación
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.3,
            scaleY: 0.9,
            duration: 300,
            yoyo: true,
            onComplete: () => {
                // Dirección hacia el jugador
                const direction = player.x > this.x ? 1 : -1;
                
                // Embestida rápida
                this.setVelocityX(this.speed * 3 * direction);
                
                // Finalizar ataque después de un tiempo
                this.scene.time.delayedCall(1000, () => {
                    this.setVelocityX(0);
                    this.isAttacking = false;
                    this.isImmortal = false;
                    this.attackCooldown = this.attackDelay * 1.5; // Mayor cooldown
                });
            }
        });
    }
    
    throwFireball(player) {
        // Crear una bola de fuego
        const fireball = this.fireballs.create(this.x, this.y - 20);
        if (!fireball) return; // No hay bolas de fuego disponibles en el grupo
        
        // Establecer textura y tamaño
        fireball.setTexture('demon_fireball');
        fireball.setDisplaySize(20, 20);
        
        // Dirección hacia el jugador
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y - 20,
            player.x, player.y - 20
        );
        
        // Velocidad
        const speed = 230; // Más rápido que otros proyectiles
        fireball.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Efectos visuales de fuego
        // 1. Rotación
        this.scene.tweens.add({
            targets: fireball,
            angle: 360,
            duration: 1000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // 2. Pulso de tamaño
        this.scene.tweens.add({
            targets: fireball,
            scale: { from: 0.5, to: 0.7 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        
        // 3. Estela de partículas de fuego
        const particles = this.scene.add.particles('demon_fireball', 0);
        const emitter = particles.createEmitter({
            speed: 50,
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 300,
            tint: [0xff4500, 0xff8c00]
        });
        
        // Actualizar posición de las partículas para que sigan a la bola de fuego
        this.scene.events.on('update', () => {
            if (fireball.active) {
                emitter.setPosition(fireball.x, fireball.y);
            } else {
                emitter.stop();
                this.scene.time.delayedCall(300, () => {
                    particles.destroy();
                });
            }
        });
        
        // Auto-destrucción después de 3 segundos
        this.scene.time.delayedCall(3000, () => {
            if (fireball.active) {
                this.createFireExplosion(fireball.x, fireball.y);
                fireball.destroy();
            }
        });
        
        // Sonido de bola de fuego
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('fireball-launch', { volume: 0.4 });
        }
    }
    
    // Método para recibir daño
    takeDamage(damage) {
        // Si ya está muerto o es inmortal, no recibe daño
        if (!this.isActive || this.isImmortal) return false;
        
        // Si ya está herido y parpadeando, ignorar el daño
        if (this.isHurt) return false;
        
        this.health -= damage;
        console.log(`Demonio recibió ${damage} de daño. Salud restante: ${this.health}`);
        
        if (this.health <= 0) {
            // Demonio muere
            this.die();
            return true;
        } else {
            // Demonio está herido pero no muere
            this.showHurtEffect();
            return false;
        }
    }
    
    // Efecto visual de daño
    showHurtEffect() {
        // Marcar como herido
        this.isHurt = true;
        
        // Cambiar color a blanco brillante
        this.setTint(0xffffff);
        
        // Sonido de daño
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('demon-hit', { volume: 0.5 });
        }
        
        // Efecto de parpadeo
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 4,
            onComplete: () => {
                this.setAlpha(1);
                this.setTint(0xff3333); // Volver al tinte rojizo
                this.isHurt = false;
            }
        });
    }
    
    die() {
        // Evitar que muera más de una vez
        if (!this.isActive) return;
        
        console.log('Demonio muriendo en:', this.x, this.y);
        
        // Marcar como inactivo y deshabilitar colisiones
        this.isActive = false;
        this.body.enable = false;
        
        // Detener cualquier movimiento
        this.setVelocity(0, 0);
        
        // Sonido de muerte
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('demon-death', { volume: 0.6 });
        }
        
        // Efecto visual de muerte espectacular
        // 1. Explosión grande
        this.createFireExplosion(this.x, this.y);
        
        // 2. Múltiples explosiones pequeñas alrededor
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 200, () => {
                const offsetX = Math.random() * 80 - 40;
                const offsetY = Math.random() * 80 - 40;
                this.createFireExplosion(this.x + offsetX, this.y + offsetY);
            });
        }
        
        // 3. Animación de desintegración
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 0.5,
            angle: 20,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Aumentar el contador de enemigos eliminados
                if (this.scene.zombiesKilled !== undefined) {
                    this.scene.zombiesKilled++;
                }
                
                // Añadir puntos (valor más alto)
                if (this.scene.score !== undefined) {
                    this.scene.score += 500 * (this.scene.pointsMultiplier || 1);
                    this.scene.updateScoreText();
                }
                
                // Alta probabilidad de soltar un objeto
                this.dropItem();
                
                // Destruir todas las bolas de fuego activas
                this.destroyAllFireballs();
                
                // Eliminar el objeto
                this.destroy();
            }
        });
    }
    
    destroyAllFireballs() {
        if (this.fireballs) {
            this.fireballs.getChildren().forEach(fireball => {
                if (fireball.active) {
                    this.createFireExplosion(fireball.x, fireball.y);
                    fireball.destroy();
                }
            });
        }
    }
    
    dropItem() {
        // Alta probabilidad (50%) de soltar un power-up valioso
        if (Math.random() < 0.5 && this.scene.spawnPowerup) {
            // Elegir un tipo aleatorio con mayor probabilidad de items valiosos
            const types = ['points', 'points', 'weapon_dagger', 'weapon_lance', 'weapon_axe', 'armor', 'extra_life'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            // Llamar al método de la escena para crear el power-up
            this.scene.spawnPowerup(this.x, this.y, randomType);
        }
    }
}

export default Demon; 