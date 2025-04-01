class Phantom extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Iniciamos el fantasma con la textura del zombie temporalmente (será reemplazada)
        super(scene, x, y, 'zombie');
        
        // Añadir el fantasma a la escena y habilitar la física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(40, 56);        // Ajustar el área de colisión 
        this.body.setOffset(12, 8);       // Centrar la colisión con el sprite
        this.setDepth(1);                 // Asegurar que el fantasma se dibuje sobre el fondo
        this.setOrigin(0.5, 0.5);         // Punto de origen en el centro del sprite
        this.setScale(1);                 // Escala 1:1
        this.setTint(0x88aaff);           // Tinte azulado para fantasma (temporal hasta tener sprite propio)
        this.setAlpha(0.7);               // Semi-transparencia para efecto fantasmal
        
        // Propiedades únicas del fantasma
        this.speed = 70;                  // Más rápido que los zombies
        this.isActive = true;             // Activo desde el principio
        this.detectionRange = 350;        // Mayor rango de detección
        this.floatAmplitude = 20;         // Amplitud de flotación
        this.floatSpeed = 2000;           // Velocidad de flotación
        this.originalY = y;               // Posición Y original para flotación
        this.canPassThroughPlatforms = true; // Puede atravesar plataformas
        this.teleportCooldown = 0;        // Tiempo hasta poder teleportarse
        this.teleportDelay = 5000;        // 5 segundos entre teleportaciones
        
        // Sistema de salud y daño
        this.maxHealth = 1;               // Fantasmas mueren de un golpe
        this.health = this.maxHealth;
        this.isHurt = false;              // Flag para controlar el estado de herido
        
        // Usar animaciones del zombie temporalmente (hasta tener propias)
        this.anims.play('zombie-walk');
        
        // Efecto de flotación
        this.setupFloatingEffect();
        
        // Desactivar colisiones con el mundo (puede salir de los límites)
        this.body.setCollideWorldBounds(false);
        
        // Desactivar gravedad para que flote
        this.body.setAllowGravity(false);

        console.log('Fantasma creado en:', x, y);
    }
    
    setupFloatingEffect() {
        // Crear efecto de flotación usando tweens
        this.scene.tweens.add({
            targets: this,
            y: this.originalY + this.floatAmplitude,
            duration: this.floatSpeed,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    update(player) {
        if (!this.isActive || !player || !player.active) return;
        
        // Reducir cooldown de teleportación
        if (this.teleportCooldown > 0) {
            this.teleportCooldown -= 16; // Aproximación a delta time (60fps)
        }
        
        // Calcular distancia al jugador
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );
        
        // Si el jugador está dentro del rango de detección
        if (distanceToPlayer <= this.detectionRange) {
            // Determinar dirección hacia el jugador
            const directionToPlayer = this.calculateDirection(player);
            
            // Voltear el sprite según la dirección
            this.setFlipX(directionToPlayer.x < 0);
            
            // Mover hacia el jugador con velocidad proporcional a la distancia
            // Esto crea un efecto de aceleración cuando está más cerca
            const speed = this.speed * (1 + (this.detectionRange - distanceToPlayer) / this.detectionRange);
            const normalizedDirection = this.normalizeVector(directionToPlayer);
            this.setVelocity(
                normalizedDirection.x * speed,
                normalizedDirection.y * speed * 0.5 // Menor velocidad vertical
            );
            
            // Teleportación cuando está lejos y el cooldown lo permite
            if (distanceToPlayer > 250 && this.teleportCooldown <= 0) {
                this.teleportTowardsPlayer(player);
            }
        } else {
            // Comportamiento de vagabundeo
            this.wander();
        }
        
        // Efecto visual - parpadeo aleatorio de transparencia
        if (Math.random() < 0.02) {
            this.flicker();
        }
    }
    
    calculateDirection(player) {
        return {
            x: player.x - this.x,
            y: player.y - this.y
        };
    }
    
    normalizeVector(vector) {
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (magnitude === 0) return { x: 0, y: 0 };
        
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }
    
    teleportTowardsPlayer(player) {
        // Visualizar teleportación
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                // Calcular nueva posición más cerca del jugador pero no demasiado cerca
                const directionToPlayer = this.calculateDirection(player);
                const normalizedDirection = this.normalizeVector(directionToPlayer);
                const teleportDistance = Phaser.Math.Between(100, 150);
                
                this.x = player.x - normalizedDirection.x * teleportDistance;
                this.y = player.y - normalizedDirection.y * teleportDistance;
                
                // Reaparecer con efecto
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0.7,
                    duration: 300
                });
                
                // Sonido de teleportación
                if (this.scene.audioManager) {
                    this.scene.audioManager.playSfx('phantom-teleport', { volume: 0.4 });
                }
                
                // Establecer cooldown
                this.teleportCooldown = this.teleportDelay;
            }
        });
    }
    
    wander() {
        // Si no tiene velocidad o es muy baja, darle una dirección aleatoria
        if (Math.abs(this.body.velocity.x) < 20 && Math.abs(this.body.velocity.y) < 20) {
            const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
            this.setVelocity(
                Math.cos(angle) * this.speed * 0.5,
                Math.sin(angle) * this.speed * 0.3
            );
            
            // Orientar el sprite según la dirección horizontal
            this.setFlipX(Math.cos(angle) < 0);
        }
    }
    
    flicker() {
        // Efecto visual de parpadeo fantasmal
        const targetAlpha = Phaser.Math.FloatBetween(0.4, 0.8);
        this.scene.tweens.add({
            targets: this,
            alpha: targetAlpha,
            duration: 200,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }
    
    // Método para recibir daño
    takeDamage(damage) {
        // Si ya está muerto, no recibe daño
        if (!this.isActive) return false;
        
        this.health -= damage;
        
        if (this.health <= 0) {
            // Fantasma muere
            this.die();
            return true;
        } else {
            // Fantasma está herido pero no muere
            this.showHurtEffect();
            return false;
        }
    }
    
    // Efecto visual de daño
    showHurtEffect() {
        // Marcar como herido
        this.isHurt = true;
        
        // Cambiar color a rojo
        this.setTint(0xff5555);
        
        // Efecto de parpadeo
        this.scene.tweens.add({
            targets: this,
            alpha: 0.2,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.setAlpha(0.7);
                this.clearTint();
                this.isHurt = false;
            }
        });
    }
    
    die() {
        // Evitar que muera más de una vez
        if (!this.isActive) return;
        
        this.isActive = false;
        
        // Sonido de muerte
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('phantom-death', { volume: 0.4 });
        }
        
        // Efecto visual de desvanecimiento
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Aumentar el contador de enemigos eliminados en la escena
                if (this.scene.zombiesKilled !== undefined) {
                    this.scene.zombiesKilled++;
                }
                
                // Añadir puntos
                if (this.scene.score !== undefined) {
                    this.scene.score += 150 * (this.scene.pointsMultiplier || 1);
                    this.scene.updateScoreText();
                }
                
                // Eliminar el objeto
                this.destroy();
            }
        });
    }
}

export default Phantom; 