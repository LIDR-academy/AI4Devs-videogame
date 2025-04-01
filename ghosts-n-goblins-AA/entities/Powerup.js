class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Verificar si la textura existe
        const textureName = `powerup_${type}`;
        if (!scene.textures.exists(textureName)) {
            console.error(`Textura ${textureName} no encontrada. Usando textura de fallback.`);
            // Usar 'powerup_points' como fallback
            super(scene, x, y, 'powerup_points');
        } else {
            // Inicializar el sprite con la textura del tipo de power-up
            super(scene, x, y, textureName);
        }
        
        // Añadir el power-up a la escena y habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Logging para depurar problemas de textura
        console.log(`Powerup creado - Tipo: ${type}, Textura: ${this.texture.key}, Frame: ${this.frame.name}`);
        console.log(`Dimensiones: ${this.width}x${this.height}, Alpha: ${this.alpha}`);
        
        // Hacer el powerup más grande y visible
        this.setScale(1.5);
        
        // Configurar propiedades físicas y visuales
        this.body.setSize(24, 24);        // Ajustar el área de colisión
        this.body.setOffset(4, 4);        // Centrar la colisión con el sprite
        this.setDepth(10);                // Asegurar que el power-up se dibuje por encima de otros elementos
        this.body.setAllowGravity(false); // El powerup debe flotar
        
        // Asegurar que el powerup sea visible
        this.setVisible(true);
        this.setAlpha(1);
        
        // Tipo de power-up
        this.type = type;
        this.powerupType = type;          // Para compatibilidad con el código existente
        
        // Estado
        this.isCollected = false;
        this.isExpiring = false;
        
        // Crear efectos visuales
        this.setupEffects();
        
        // Para power-ups que necesitan desaparecer después de un tiempo
        this.lifespan = 30000; // 30 segundos de vida
        this.startLifespanTimer();
    }
    
    // Configurar efectos visuales
    setupEffects() {
        // Efecto de flotación
        this.floatTween = this.scene.tweens.add({
            targets: this,
            y: this.y - 12,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Brillo pulsante
        this.glowTween = this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.8 },
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Efectos específicos según tipo
        switch (this.type) {
            case 'armor':
                // Destello para armadura
                this.scene.tweens.add({
                    targets: this,
                    scale: { from: 1.5, to: 1.6 },
                    duration: 1200,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
                
            case 'invincible':
                // Rotación lenta para invencibilidad
                this.scene.tweens.add({
                    targets: this,
                    angle: 360,
                    duration: 8000,
                    ease: 'Linear',
                    repeat: -1
                });
                break;
                
            case 'points':
                // Efecto de rebote para puntos
                this.scene.tweens.add({
                    targets: this,
                    scale: { from: 1.4, to: 1.6 },
                    duration: 800,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
                
            case 'magic':
                // Rotación suave para magia
                this.scene.tweens.add({
                    targets: this,
                    angle: '+=10',
                    duration: 3000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
        }
        
        // Crear partículas de brillo alrededor del powerup
        this.createAuraEffect();
    }
    
    // Crear aura de partículas alrededor del powerup
    createAuraEffect() {
        try {
            if (this.scene.add.particles) {
                // Diferentes colores según tipo
                let tint;
                switch (this.type) {
                    case 'armor': tint = 0xCCCCFF; break;     // Azul claro
                    case 'points': tint = 0xFFFF00; break;    // Amarillo
                    case 'invincible': tint = 0xFF00FF; break; // Magenta
                    case 'magic': tint = 0x00FF00; break;     // Verde
                    default: tint = 0xFFFFFF;                 // Blanco
                }
                
                // Crear el emisor de partículas
                const particles = this.scene.add.particles(this.x, this.y, 'sparkle');
                
                // Configurar el emisor para seguir al powerup
                const emitter = particles.createEmitter({
                    follow: this,
                    frequency: 200,
                    scale: { start: 0.4, end: 0 },
                    speed: { min: 5, max: 20 },
                    lifespan: 1000,
                    quantity: 1,
                    blendMode: 'ADD',
                    tint: tint
                });
                
                // Guardar referencia a las partículas para destruirlas después
                this.auraParticles = particles;
            }
        } catch (error) {
            console.warn('Error al crear partículas de aura:', error);
        }
    }
    
    // Establecer tiempo de vida para power-ups
    startLifespanTimer() {
        // Advertencia de expiración (parpadeo cuando queda poco tiempo)
        this.scene.time.delayedCall(this.lifespan - 5000, () => {
            if (!this.active || this.isCollected) return;
            
            this.isExpiring = true;
            
            // Animación de parpadeo para indicar que va a desaparecer
            this.blinkTween = this.scene.tweens.add({
                targets: this,
                alpha: 0.3,
                duration: 200,
                ease: 'Linear',
                yoyo: true,
                repeat: 8
            });
        });
        
        // Auto-destrucción después del tiempo de vida
        this.scene.time.delayedCall(this.lifespan, () => {
            if (!this.active || this.isCollected) return;
            
            // Detener tweens
            if (this.floatTween) this.floatTween.stop();
            if (this.glowTween) this.glowTween.stop();
            if (this.blinkTween) this.blinkTween.stop();
            
            // Animación de desaparición
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                y: this.y - 30,
                scale: 1.5,
                duration: 800,
                ease: 'Back.easeIn',
                onComplete: () => {
                    // Destruir partículas si existen
                    if (this.auraParticles && this.auraParticles.active) {
                        this.auraParticles.destroy();
                    }
                    
                    // Destruir el powerup
                    this.destroy();
                }
            });
        });
    }
    
    // Método para cuando el power-up es recogido
    collect() {
        if (this.isCollected || !this.active || !this.scene) return false;
        
        this.isCollected = true;
        
        // Detener tweens
        if (this.floatTween) this.floatTween.stop();
        if (this.glowTween) this.glowTween.stop();
        if (this.blinkTween) this.blinkTween.stop();
        
        // Asegurarnos de que el cuerpo físico exista antes de desactivarlo
        if (this.body) {
            this.body.enable = false;
        }
        
        console.log(`Power-up ${this.type} recogido`);
        
        // Reproducir sonido de recolección
        if (this.scene.cache && this.scene.cache.audio && this.scene.cache.audio.exists('powerup-collect')) {
            this.scene.sound.play('powerup-collect', { volume: 0.5 });
        }
        
        // Crear efecto visual de recolección
        this.createCollectEffect();
        
        // Animación de recolección
        this.scene.tweens.add({
            targets: this,
            y: this.y - 30,
            alpha: 0,
            scale: 1.5,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => {
                // Destruir partículas si existen
                if (this.auraParticles && this.auraParticles.active) {
                    this.auraParticles.destroy();
                }
                
                if (this.active) {
                    this.destroy();
                }
            }
        });
        
        // Verificar que el jugador exista antes de procesar efectos
        if (!this.scene.player || !this.scene.player.active) {
            return true;
        }
        
        // Aplicar efectos según tipo
        switch (this.type) {
            case 'armor':
                // Restaurar armadura
                if (this.scene.hasOwnProperty('hasArmor')) {
                    this.scene.hasArmor = true;
                    this.scene.player.clearTint();
                    
                    // Actualizar textura del jugador si existe la propiedad
                    if (this.scene.player.setTexture) {
                        this.scene.player.setTexture('arthur-idle');
                    }
                }
                
                // Mostrar texto flotante
                this.showFloatingText('¡ARMADURA!', 0x00FFFF);
                break;
                
            case 'points':
                // Añadir puntos
                if (this.scene && this.scene.hasOwnProperty('score')) {
                    const points = 500;
                    this.scene.score += points;
                    if (typeof this.scene.updateScoreText === 'function') {
                        this.scene.updateScoreText();
                    }
                    
                    // Mostrar texto de puntos ganados
                    this.showFloatingText(`+${points}`, 0xFFD700);
                }
                break;
                
            case 'magic':
                // Recuperar vida
                if (this.scene && this.scene.hasOwnProperty('lives') && this.scene.lives < 5) {
                    this.scene.lives++;
                    if (typeof this.scene.updateLivesText === 'function') {
                        this.scene.updateLivesText();
                    }
                    
                    // Mostrar texto de vida extra
                    this.showFloatingText('¡VIDA EXTRA!', 0x00FF00);
                }
                break;
                
            case 'invincible':
                // Dar invencibilidad temporal
                if (!this.scene || !this.scene.player || !this.scene.player.active) return true;
                
                this.scene.isInvulnerable = true;
                
                // Efecto visual de invencibilidad
                const originalTint = this.scene.player.tintTopLeft;
                
                // Aplicar efecto de parpadeo
                const invincibilityEffect = this.scene.time.addEvent({
                    delay: 100,
                    callback: () => {
                        if (!this.scene || !this.scene.player || !this.scene.player.active) return;
                        
                        if (this.scene.player.tintTopLeft === 0xFFFFFF) {
                            this.scene.player.setTint(0xFFFF00);
                        } else {
                            this.scene.player.setTint(0xFFFFFF);
                        }
                    },
                    loop: true
                });
                
                // Mostrar texto de invencibilidad
                this.showFloatingText('¡INVENCIBLE!', 0xFFD700);
                
                // Temporizador para quitar la invencibilidad
                this.scene.time.delayedCall(10000, () => {
                    if (!this.scene || !this.scene.player || !this.scene.player.active) {
                        if (invincibilityEffect) invincibilityEffect.remove();
                        return;
                    }
                    
                    this.scene.isInvulnerable = false;
                    if (invincibilityEffect) invincibilityEffect.remove();
                    this.scene.player.setTint(originalTint);
                });
                break;
                
            default:
                // Por defecto, dar algunos puntos
                if (this.scene && this.scene.hasOwnProperty('score')) {
                    const points = 100;
                    this.scene.score += points;
                    if (typeof this.scene.updateScoreText === 'function') {
                        this.scene.updateScoreText();
                    }
                    
                    // Mostrar texto de puntos
                    this.showFloatingText(`+${points}`, 0xFFD700);
                }
                break;
        }
        
        return true;
    }
    
    // Crear efecto visual de recolección
    createCollectEffect() {
        try {
            if (this.scene.add.particles) {
                // Diferentes colores según tipo
                let tint;
                switch (this.type) {
                    case 'armor': tint = 0xCCCCFF; break;
                    case 'points': tint = 0xFFFF00; break;
                    case 'invincible': tint = 0xFF00FF; break;
                    case 'magic': tint = 0x00FF00; break;
                    default: tint = 0xFFFFFF;
                }
                
                const particles = this.scene.add.particles(this.x, this.y, 'sparkle', {
                    speed: { min: 50, max: 200 },
                    scale: { start: 0.6, end: 0 },
                    lifespan: 800,
                    blendMode: 'ADD',
                    quantity: 15,
                    tint: tint
                });
                
                // Autodestruir después de que las partículas desaparezcan
                this.scene.time.delayedCall(800, () => {
                    particles.destroy();
                });
            }
        } catch (error) {
            console.warn('Error al crear partículas de recolección', error);
        }
    }
    
    // Mostrar texto flotante para feedback
    showFloatingText(text, color = 0xFFFFFF) {
        if (!this.scene || !this.active) return;
        
        // Comprobar si existe el método showFloatingText en la escena
        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(this.x, this.y - 40, text, color);
        } else {
            // Implementación fallback si no existe el método en la escena
            const floatingText = this.scene.add.text(this.x, this.y - 40, text, {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontStyle: 'bold',
                color: `#${color.toString(16).padStart(6, '0')}`,
                stroke: '#000',
                strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);
            
            // Animación de elevación y desaparición
            this.scene.tweens.add({
                targets: floatingText,
                y: floatingText.y - 50,
                alpha: 0,
                duration: 1500,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    floatingText.destroy();
                }
            });
        }
    }
    
    // Método update para comportamientos dinámicos
    update() {
        // Se usa principalmente para mantener las partículas actualizadas con la posición del powerup
        if (this.auraParticles && this.auraParticles.active) {
            // Las partículas ya siguen al powerup a través de 'follow', así que no necesitamos más código aquí
        }
    }
}

export default Powerup; 