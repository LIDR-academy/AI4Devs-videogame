class Gargoyle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Iniciar con la textura de gárgola en posición de piedra
        super(scene, x, y, 'gargoyle_stone');
        
        // Añadir a la escena y habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(40, 60);         // Área de colisión ajustada
        this.body.setOffset(12, 4);        // Ajuste de la hitbox
        this.setDepth(1);                  // Asegurar que se dibuje sobre el fondo
        this.setOrigin(0.5, 1);            // Origen en la base
        this.setScale(1);                  // Escala normal
        
        // Variables del enemigo
        this.isStone = true;               // Comienza como piedra
        this.isActive = false;             // Comienza inactivo
        this.detectionRange = 300;         // Rango para activarse
        this.swoopRange = 200;             // Rango para lanzarse
        this.swoopSpeed = 250;             // Velocidad de descenso
        this.isSwooping = false;           // Flag para el ataque en picado
        this.target = null;                // Objetivo (el jugador)
        
        // Sistema de salud y daño
        this.maxHealth = 2;                // Salud máxima
        this.health = this.maxHealth;      // Salud actual
        this.isInvulnerable = true;        // Invulnerable mientras es piedra
        this.isHurt = false;               // Estado de daño
        
        // Establecer colisiones
        this.body.enable = true;           // Habilitamos la física
        
        console.log('Gárgola creada en:', x, y);
    }
    
    // Método para establecer el objetivo de la gárgola
    setTarget(player) {
        this.target = player;
        console.log('Target establecido para la gárgola:', player);
        
        // Inicialmente la gárgola está en estado de piedra
        // pero tiene físicas activas para poder colisionar
        
        return this;
    }
    
    // Método para activarse (cambiar de piedra a gárgola)
    activate() {
        if (this.isStone && !this.isActive) {
            this.isStone = false;
            this.isActive = true;
            this.isInvulnerable = false;
            
            // Cambiar textura a gárgola activa
            this.setTexture('gargoyle_standing');
            
            // Reproducir animación de activación
            if (this.anims.exists('gargoyle-awaken')) {
                this.play('gargoyle-awaken');
            }
            
            // Sonido de activación
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('gargoyle-awaken', { volume: 0.5 });
            }
            
            console.log('Gárgola activada en:', this.x, this.y);
        }
    }
    
    startFlyingEffect() {
        // Efecto de aleteo constante
        this.scene.tweens.add({
            targets: this,
            y: this.y - 15,
            duration: 1200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    update(player) {
        try {
            // Si no está activa o no hay un jugador válido, no hacer nada
            if (!this.active || !player || !player.active) return;
            
            // Si está en estado de piedra, actualizar ese estado
            if (this.isPetrified) {
                this.updatePetrifiedState();
                return;
            }
            
            // Reducir los cooldowns
            if (this.attackCooldown > 0) {
                this.attackCooldown -= 16;
            }
            
            if (this.swoopTimer > 0) {
                this.swoopTimer -= 16;
            }
            
            // Si está en ataque en picado, continuar con ese movimiento
            if (this.isSwoopping) {
                // Verificar si ha chocado con el suelo
                if (this.body.touching.down) {
                    this.endSwoop();
                }
                return;
            }
            
            // Si está en animación de ataque, no hacer más
            if (this.isAttacking) return;
            
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
                
                // Si está en rango de ataque y el ataque está disponible
                if (distanceToPlayer <= this.attackRange && this.attackCooldown <= 0) {
                    // IMPORTANTE: Cuidado con llamadas recursivas
                    const randomValue = Phaser.Math.FloatBetween(0, 1); // Usar método seguro de Phaser
                    
                    // Elegir entre ataque en picado o petrificación
                    if (this.health < this.maxHealth / 2 && randomValue < 0.4) {
                        // Si tiene poca vida, probabilidad de petrificarse para protegerse
                        this.petrify();
                    } else if (this.swoopTimer <= 0) {
                        // Ataque en picado hacia el jugador
                        this.swoopAttack(player);
                    } else {
                        // Perseguir al jugador con velocidad alta
                        this.setVelocityX(this.speed * playerSide * 1.2);
                        
                        // Movimiento en Y calculado para volar en arco
                        const heightDifference = player.y - this.y;
                        // Volar más alto si el jugador está por debajo
                        const targetY = heightDifference > 0 
                            ? player.y - 100 - Phaser.Math.FloatBetween(0, 50)
                            : player.y - 50 + Phaser.Math.FloatBetween(0, 30);
                        
                        // Movimiento suave en Y
                        // IMPORTANTE: Usar un ID específico para la tween y detener tweens existentes
                        this.scene.tweens.killTweensOf(this);
                        this.scene.tweens.add({
                            targets: this,
                            y: targetY,
                            duration: 800,
                            ease: 'Sine.easeInOut'
                        });
                    }
                } else {
                    // Perseguir al jugador con movimiento
                    this.setVelocityX(this.speed * playerSide);
                    
                    // Implementar patrón de vuelo evasivo, pero con menor frecuencia
                    if (Phaser.Math.FloatBetween(0, 1) < 0.01) { // Reducido de 0.03 a 0.01
                        // Maniobra evasiva aleatoria
                        const evasionY = this.y + (Phaser.Math.FloatBetween(-50, 50));
                        
                        // IMPORTANTE: Detener tweens existentes
                        this.scene.tweens.killTweensOf(this);
                        this.scene.tweens.add({
                            targets: this,
                            y: evasionY,
                            duration: 500,
                            ease: 'Sine.easeInOut'
                        });
                    }
                }
            } else {
                // Comportamiento de patrulla en el aire con movimiento simple
                this.setVelocityX(this.speed * this.direction * 0.7);
                
                // Cambiar altura periódicamente pero con menor frecuencia
                if (Phaser.Math.FloatBetween(0, 1) < 0.005) { // Reducido de 0.02 a 0.005
                    const newY = this.y + (Phaser.Math.FloatBetween(-40, 40));
                    // Limitar altura mínima y máxima
                    const boundedY = Math.max(100, Math.min(400, newY));
                    
                    // IMPORTANTE: Detener tweens existentes
                    this.scene.tweens.killTweensOf(this);
                    this.scene.tweens.add({
                        targets: this,
                        y: boundedY,
                        duration: 1200,
                        ease: 'Sine.easeInOut'
                    });
                }
                
                // Cambiar dirección ocasionalmente o al chocar
                if (Phaser.Math.FloatBetween(0, 1) < 0.005 || this.body.blocked.left || this.body.blocked.right) {
                    this.direction *= -1;
                    this.setFlipX(this.direction === -1);
                }
            }
            
            // Reproducir animación si está disponible y no está ya reproduciendo una animación
            if (!this.anims.isPlaying) {
                if (this.anims.exists('gargoyle-fly')) {
                    this.play('gargoyle-fly', true);
                } else if (this.anims.exists('zombie-walk')) {
                    this.play('zombie-walk', true); // Fallback
                }
            }
        } catch (error) {
            console.error("Error en Gargoyle.update:", error);
        }
    }
    
    updatePetrifiedState() {
        // Reducir el temporizador de petrificación
        this.petrifiedTimer -= 16;
        
        if (this.petrifiedTimer <= 0) {
            // Volver al estado normal
            this.unpetrify();
        }
    }
    
    petrify() {
        if (this.isPetrified) return;
        
        // Activar estado de piedra
        this.isPetrified = true;
        this.petrifiedTimer = this.maxPetrifiedTime;
        
        // Detener cualquier movimiento
        this.setVelocity(0, 0);
        
        // Aumentar la resistencia al daño
        this.isImmortal = true;
        
        // Cambiar textura a la de piedra
        this.setTexture('gargoyle_stone');
        
        // Efecto visual de petrificación
        this.scene.tweens.add({
            targets: this,
            alpha: 0.8,
            duration: 300,
            onStart: () => {
                // Sonido de petrificación
                if (this.scene.audioManager) {
                    this.scene.audioManager.playSfx('stone-transform', { volume: 0.5 });
                }
            },
            onComplete: () => {
                // Después de un tiempo, permitir recibir daño pero con reducción
                this.scene.time.delayedCall(1000, () => {
                    this.isImmortal = false;
                });
            }
        });
    }
    
    unpetrify() {
        if (!this.isPetrified) return;
        
        // Desactivar estado de piedra
        this.isPetrified = false;
        
        // Cambiar textura al estado normal
        this.setTexture('gargoyle_standing');
        
        // Efecto visual de des-petrificación
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 500,
            onStart: () => {
                // Sonido de des-petrificación
                if (this.scene.audioManager) {
                    this.scene.audioManager.playSfx('gargoyle-unstone', { volume: 0.5 });
                }
            },
            onComplete: () => {
                // Reanudar animación
                this.anims.play('zombie-walk', true);
                
                // Establecer cooldown de ataque
                this.attackCooldown = this.attackDelay;
            }
        });
    }
    
    swoopAttack(player) {
        try {
            console.log('Gárgola iniciando ataque en picado');
            
            // Marcar como en picado
            this.isSwoopping = true;
            
            // Calcular destino del picado (ligeramente adelantado a la posición del jugador)
            const playerVelocityX = player.body.velocity.x;
            const targetX = player.x + (playerVelocityX * 0.5); // Predicción de movimiento
            const targetY = player.y;
            
            // Calcular velocidades
            const deltaX = targetX - this.x;
            const deltaY = targetY - this.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Tiempo que tardará el picado
            const swoopTime = 700; // ms
            
            // Velocidades para alcanzar el objetivo en el tiempo específico
            const velocityX = (deltaX / swoopTime) * 1000;
            const velocityY = (deltaY / swoopTime) * 1000;
            
            // Sonido de picado
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('gargoyle-swoop', { volume: 0.5 });
            }
            
            // Reproducir animación de picado si existe
            if (this.anims.exists('gargoyle-dive')) {
                this.play('gargoyle-dive');
            }
            
            // Aplicar velocidad para el picado
            this.setVelocity(velocityX, velocityY);
            
            // Cooldown para evitar picados consecutivos
            this.swoopTimer = 3000;
            
            // Resetear el estado después de un tiempo máximo (si no colisiona)
            this.scene.time.delayedCall(swoopTime + 500, () => {
                if (this.isSwoopping) {
                    this.endSwoop();
                }
            });
        } catch (error) {
            console.error('Error en Gargoyle.swoopAttack:', error);
            this.isSwoopping = false;
        }
    }
    
    endSwoop() {
        if (!this.active) return;
        
        // Efecto visual de impacto
        if (this.body.touching.down) {
            this.createImpactEffect();
        }
        
        // Resetear estado
        this.isSwoopping = false;
        
        // Aplicar velocidad de recuperación (elevarse de nuevo)
        this.setVelocity(this.direction * this.speed * 0.5, -150);
        
        // Establecer cooldown de ataque
        this.attackCooldown = this.attackDelay;
        
        // Volver a animación normal
        if (this.anims.exists('gargoyle-fly')) {
            this.play('gargoyle-fly', true);
        }
    }
    
    createImpactEffect() {
        try {
            // Crear partículas de impacto
            if (this.scene.add && this.scene.add.particles) {
                const particles = this.scene.add.particles('particle');
                const emitter = particles.createEmitter({
                    x: this.x,
                    y: this.y + 20,
                    speed: { min: 30, max: 70 },
                    angle: { min: 230, max: 310 },
                    scale: { start: 0.6, end: 0 },
                    lifespan: 600,
                    quantity: 15
                });
                
                // Emitir una vez y destruir
                this.scene.time.delayedCall(100, () => {
                    emitter.stop();
                    this.scene.time.delayedCall(600, () => {
                        particles.destroy();
                    });
                });
            }
            
            // Sonido de impacto
            if (this.scene.audioManager) {
                this.scene.audioManager.playSfx('gargoyle-impact', { volume: 0.6 });
            }
            
            // Sacudir la cámara levemente
            if (this.scene.cameras && this.scene.cameras.main) {
                this.scene.cameras.main.shake(200, 0.01);
            }
        } catch (error) {
            console.error('Error en Gargoyle.createImpactEffect:', error);
        }
    }
    
    // Método para recibir daño
    takeDamage(damage) {
        // Si ya está muerto, no recibe daño
        if (!this.isActive) return false;
        
        // Si es inmortal (durante la petrificación inicial), no recibe daño
        if (this.isImmortal) return false;
        
        // Si ya está herido y parpadeando, ignorar el daño
        if (this.isHurt) return false;
        
        // Reducir el daño si está petrificado
        let actualDamage = damage;
        if (this.isPetrified) {
            actualDamage = Math.max(1, Math.floor(damage / 2));
        }
        
        this.health -= actualDamage;
        console.log(`Gárgola recibió ${actualDamage} de daño. Salud restante: ${this.health}`);
        
        if (this.health <= 0) {
            // Gárgola muere
            this.die();
            return true;
        } else {
            // Gárgola está herida pero no muere
            this.showHurtEffect();
            
            // Si recibe mucho daño y no está petrificada, probabilidad de petrificarse
            if (!this.isPetrified && this.health < this.maxHealth / 2 && Math.random() < 0.6) {
                this.scene.time.delayedCall(500, () => {
                    this.petrify();
                });
            }
            
            return false;
        }
    }
    
    // Efecto visual de daño
    showHurtEffect() {
        // Marcar como herido
        this.isHurt = true;
        
        // Cambiar color
        const tint = this.isPetrified ? 0x777777 : 0xff7777;
        this.setTint(tint);
        
        // Sonido de daño
        const soundKey = this.isPetrified ? 'stone-hit' : 'gargoyle-hit';
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx(soundKey, { volume: 0.4 });
        }
        
        // Efecto de parpadeo
        this.scene.tweens.add({
            targets: this,
            alpha: 0.6,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                // Restaurar apariencia
                this.setAlpha(this.isPetrified ? 0.5 : 1);
                this.setTint(this.isPetrified ? 0x555555 : 0x888888);
                this.isHurt = false;
            }
        });
    }
    
    die() {
        // Evitar que muera más de una vez
        if (!this.isActive) return;
        
        console.log('Gárgola muriendo en:', this.x, this.y);
        
        // Marcar como inactivo y deshabilitar colisiones
        this.isActive = false;
        this.body.enable = false;
        
        // Detener cualquier movimiento y tween
        this.setVelocity(0, 0);
        this.scene.tweens.killTweensOf(this);
        
        // Sonido de muerte
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('gargoyle-death', { volume: 0.5 });
        }
        
        // Efectos de muerte diferentes según si está petrificada o no
        if (this.isPetrified) {
            // Muerte como estatua: romperse en pedazos
            this.dieAsPetrified();
        } else {
            // Muerte normal: desintegrarse
            this.dieNormally();
        }
    }
    
    dieAsPetrified() {
        // Crear partículas de roca
        const particles = this.scene.add.particles('zombie', 0);
        
        // Configuración de emisor para simular fragmentos de piedra
        const emitter = particles.createEmitter({
            x: this.x,
            y: this.y - 30,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            lifespan: 1000,
            quantity: 20,
            tint: [0x888888, 0x666666, 0x444444]
        });
        
        // Animación de caída y destrucción
        this.scene.tweens.add({
            targets: this,
            y: this.y + 50,
            angle: 90,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // Detener emisión
                emitter.stop();
                
                // Finalizar muerte
                this.finalizeDeath();
                
                // Destruir partículas después de que terminen
                this.scene.time.delayedCall(1000, () => {
                    particles.destroy();
                });
            }
        });
    }
    
    dieNormally() {
        // Efecto visual de desvanecimiento con rotación
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            y: this.y - 30,
            angle: Math.random() < 0.5 ? 45 : -45,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.finalizeDeath();
            }
        });
        
        // Partículas de polvo/ceniza
        const particles = this.scene.add.particles('zombie', 0);
        const emitter = particles.createEmitter({
            x: this.x,
            y: this.y - 30,
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            lifespan: 800,
            quantity: 15,
            tint: 0x888888
        });
        
        // Detener emisión después de un único estallido
        this.scene.time.delayedCall(200, () => {
            emitter.stop();
            // Destruir las partículas después de que terminen
            this.scene.time.delayedCall(800, () => {
                particles.destroy();
            });
        });
    }
    
    finalizeDeath() {
        // Aumentar el contador de enemigos eliminados
        if (this.scene.zombiesKilled !== undefined) {
            this.scene.zombiesKilled++;
        }
        
        // Añadir puntos
        if (this.scene.score !== undefined) {
            this.scene.score += 300 * (this.scene.pointsMultiplier || 1);
            this.scene.updateScoreText();
        }
        
        // Posibilidad de soltar un objeto
        this.dropItem();
        
        // Eliminar el objeto
        this.destroy();
    }
    
    dropItem() {
        // Probabilidad del 30% de soltar un power-up
        if (Math.random() < 0.3 && this.scene.spawnPowerup) {
            // Elegir un tipo aleatorio con alta probabilidad de items valiosos
            const types = ['points', 'weapon_dagger', 'weapon_lance', 'armor', 'extra_life'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            // Llamar al método de la escena para crear el power-up
            this.scene.spawnPowerup(this.x, this.y, randomType);
        }
    }
}

export default Gargoyle; 