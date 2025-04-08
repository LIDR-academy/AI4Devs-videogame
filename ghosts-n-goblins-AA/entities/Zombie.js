class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Iniciamos el zombie en su posición final
        super(scene, x, y, 'zombie');
        
        // Añadir el zombie a la escena y habilitar la física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(40, 56);         // Ajustar el área de colisión a la anchura y altura reales
        this.body.setOffset(12, 8);        // Centrar la colisión con el sprite
        this.setDepth(1);                  // Asegurar que el zombie se dibuje sobre el fondo
        this.setOrigin(0.5, 1);            // Punto de origen en la base del sprite
        this.setScale(1);                  // Asegurar escala 1:1
        
        // Variables del zombie
        this.speed = 50;
        this.isEmerging = false;
        this.isActive = false;
        this.direction = 1;
        this.detectionRange = 300;
        this.initialY = y;
        
        // Sistema de salud y daño
        this.maxHealth = 2;                // Zombies requieren 2 golpes para morir
        this.health = this.maxHealth;
        this.isHurt = false;               // Flag para controlar el estado de herido
        this.blinkDuration = 500;          // Duración del parpadeo en ms
        
        // Crear animaciones
        this.createAnimations();
        
        // Configuración inicial
        this.setVisible(false);
        this.body.enable = false;
        this.alpha = 0;

        console.log('Zombie creado en:', x, y);
    }
    
    createAnimations() {
        if (!this.scene.anims.exists('zombie-emerge')) {
            this.scene.anims.create({
                key: 'zombie-emerge',
                frames: this.scene.anims.generateFrameNumbers('zombie', { 
                    frames: [0, 1, 2] 
                }),
                frameRate: 8,
                repeat: 0
            });
        }
        
        if (!this.scene.anims.exists('zombie-walk')) {
            this.scene.anims.create({
                key: 'zombie-walk',
                frames: this.scene.anims.generateFrameNumbers('zombie', { 
                    frames: [3, 4, 5] 
                }),
                frameRate: 6,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('zombie-die')) {
            this.scene.anims.create({
                key: 'zombie-die',
                frames: this.scene.anims.generateFrameNumbers('zombie', { 
                    frames: [2, 1, 0] 
                }),
                frameRate: 8,
                repeat: 0
            });
        }
    }
    
    emerge() {
        if (!this.isEmerging && !this.isActive) {
            this.isEmerging = true;
            this.setVisible(true);
            this.body.enable = true;
            
            // Empezar desde abajo del suelo
            this.y = this.initialY + 64;  // Ajustado a la altura real del sprite
            this.alpha = 0;
            
            // Tween para emerger
            this.scene.tweens.add({
                targets: this,
                y: this.initialY,
                alpha: 1,
                duration: 1000,
                ease: 'Power1',
                onStart: () => {
                    this.play('zombie-emerge');
                },
                onComplete: () => {
                    this.isEmerging = false;
                    this.isActive = true;
                    this.play('zombie-walk');
                }
            });
        }
    }
    
    update(player) {
        if (!this.isActive || this.isEmerging) return;
        
        // Calcular distancia al jugador
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        // Si el jugador está dentro del rango de detección
        if (distanceToPlayer <= this.detectionRange) {
            // Determinar dirección hacia el jugador
            const directionToPlayer = player.x < this.x ? -1 : 1;
            
            // Voltear el sprite según la dirección
            this.setFlipX(directionToPlayer === -1);
            
            // Comportamientos basados en la distancia al jugador
            if (distanceToPlayer < 100) {
                // Cuando está muy cerca, aumentar velocidad para ataque
                const attackSpeed = this.speed * 1.5;
                this.setVelocityX(attackSpeed * directionToPlayer);
                
                // Cambiar a animación de ataque si existe
                if (this.anims.exists('zombie-attack')) {
                    this.play('zombie-attack', true);
                } else {
                    this.play('zombie-walk', true);
                }
                
                // Posibilidad de saltar hacia el jugador si está a diferente altura
                if (this.body.touching.down && player.y < this.y - 20 && Math.random() < 0.05) {
                    this.setVelocityY(-250); // Salto básico
                }
            } else {
                // Perseguir al jugador con velocidad normal
                this.setVelocityX(this.speed * directionToPlayer);
                
                // Animación de caminar normal
                this.play('zombie-walk', true);
                
                // Ocasionalmente cambiar velocidad para comportamiento más natural
                if (Math.random() < 0.01) {
                    const randomSpeed = this.speed * (0.7 + Math.random() * 0.6);
                    this.speed = randomSpeed;
                }
            }
        } else {
            // Comportamiento de patrulla
            this.setVelocityX(this.speed * this.direction);
            
            // Cambiar dirección al chocar con obstáculos o aleatoriamente
            if (this.body.blocked.left || this.body.blocked.right || Math.random() < 0.005) {
                this.direction *= -1;
                this.setFlipX(this.direction === -1);
            }
            
            // Comportamiento aleatorio: pausa ocasional
            if (Math.random() < 0.002) {
                // Detener brevemente
                const originalSpeed = this.speed;
                this.setVelocityX(0);
                
                // Después de un tiempo aleatorio, continuar
                this.scene.time.delayedCall(500 + Math.random() * 1000, () => {
                    if (this.active) {
                        this.speed = originalSpeed;
                    }
                });
            }
            
            // Asegurar que la animación de caminar esté activa
            if (!this.anims.isPlaying) {
                this.play('zombie-walk', true);
            }
        }
        
        // Si el zombie se está cayendo, asegurarse que tenga la animación apropiada
        if (!this.body.touching.down && this.body.velocity.y > 0) {
            if (this.anims.exists('zombie-fall')) {
                this.play('zombie-fall', true);
            }
        }
    }
    
    // Método para recibir daño
    takeDamage(damage) {
        // Si ya está muerto o emergiendo, no recibe daño
        if (!this.isActive || this.isEmerging) return false;
        
        // Si ya está herido y parpadeando, duplicar el daño (para asegurar muerte en 2o golpe)
        if (this.isHurt) {
            damage = damage * 2;
        }
        
        this.health -= damage;
        console.log(`Zombie recibió ${damage} de daño. Salud restante: ${this.health}`);
        
        if (this.health <= 0) {
            // Zombie muere
            this.die();
            return true;
        } else {
            // Zombie está herido pero no muere
            this.showHurtEffect();
            return false;
        }
    }
    
    // Efecto visual de daño (parpadeo)
    showHurtEffect() {
        // Marcar como herido
        this.isHurt = true;
        
        // Cambiar color a rojo en el primer impacto
        this.setTint(0xff5555);
        
        // Efecto de parpadeo
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 4,
            onComplete: () => {
                // Mantener el tinte rojo después del parpadeo
                this.setAlpha(1);
            }
        });
        
        // Temporizador para permitir ser dañado otra vez
        this.scene.time.delayedCall(this.blinkDuration, () => {
            this.isHurt = false;
        });
    }
    
    die() {
        // Evitar que muera más de una vez
        if (!this.isActive) return;
        
        console.log('Zombie muriendo en:', this.x, this.y);
        
        // Marcar como inactivo y deshabilitar colisiones
        this.isActive = false;
        this.body.enable = false;
        
        // Aplicar efecto visual exagerado al morir (tinte rojo intenso)
        this.setTint(0xff0000);
        
        // Reproducir animación de muerte
        this.play('zombie-die');
        
        // Tween de desvanecimiento después de la animación de muerte
        this.on('animationcomplete-zombie-die', () => {
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                y: this.y + 32,
                duration: 500,
                ease: 'Power1',
                onComplete: () => {
                    console.log('Animación de muerte completada, destruyendo zombie');
                    this.destroy();
                }
            });
        });
    }
}

export default Zombie; 