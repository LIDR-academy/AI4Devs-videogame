class WeaponPickup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Tipos de armas disponibles
        const WEAPON_TYPES = {
            SPEAR: 'spear',
            DAGGER: 'dagger',
            TORCH: 'torch',
            AXE: 'axe'
        };
        
        // Validar el tipo
        if (!Object.values(WEAPON_TYPES).includes(type)) {
            console.error(`Tipo de arma inválido: ${type}`);
            type = WEAPON_TYPES.DAGGER; // Por defecto
        }
        
        // Inicializar sprite
        super(scene, x, y, `${type}-pickup`);
        
        this.type = type;
        this.weaponType = type; // Para compatibilidad con código existente
        
        // Añadir a la escena y habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar físicas
        this.body.setSize(24, 24);
        this.body.setOffset(4, 4);
        this.body.setAllowGravity(false); // No afectado por gravedad
        
        // Tiempo de vida (30 segundos)
        this.lifespan = 30000;
        this.isCollected = false;
        this.isExpiring = false;
        
        // Configurar animaciones y efectos
        this.setupEffects();
        
        // Iniciar el temporizador de vida
        this.startLifespanTimer();
    }
    
    setupEffects() {
        // Efecto de flotación
        this.floatTween = this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Efecto de brillo
        this.glowTween = this.scene.tweens.add({
            targets: this,
            alpha: 0.7,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Efecto de rotación suave (solo para algunas armas)
        if (this.type === 'dagger' || this.type === 'spear') {
            this.scene.tweens.add({
                targets: this,
                angle: '+=5',
                duration: 3000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    startLifespanTimer() {
        // Advertencia de expiración (parpadeo después de 25 segundos)
        this.scene.time.delayedCall(25000, () => {
            if (!this.active || this.isCollected) return;
            
            this.isExpiring = true;
            
            // Animación de parpadeo para indicar que va a desaparecer
            this.blinkTween = this.scene.tweens.add({
                targets: this,
                alpha: 0.3,
                duration: 200,
                ease: 'Linear',
                yoyo: true,
                repeat: 10
            });
        });
        
        // Auto-destrucción después del tiempo de vida
        this.scene.time.delayedCall(this.lifespan, () => {
            if (!this.active || this.isCollected) return;
            
            // Detener tweens anteriores
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
                    this.destroy();
                }
            });
        });
    }
    
    // Método para recolectar el arma
    collect() {
        if (this.isCollected || !this.active) return this.type;
        
        this.isCollected = true;
        
        // Detener tweens de efectos visuales
        if (this.floatTween) this.floatTween.stop();
        if (this.glowTween) this.glowTween.stop();
        if (this.blinkTween) this.blinkTween.stop();
        
        // Desactivar el cuerpo físico para evitar múltiples colisiones
        if (this.body) {
            this.body.enable = false;
        }
        
        // Reproducir sonido de recolección
        if (this.scene.cache.audio.exists('pickup')) {
            try {
                this.scene.sound.play('pickup', { volume: 0.5 });
            } catch (error) {
                console.warn('Error reproduciendo sonido pickup:', error);
            }
        }
        
        // Crear efecto visual de recolección
        this.createCollectEffect();
        
        // Mostrar texto flotante con el nombre del arma
        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(
                this.x,
                this.y - 30,
                `¡${this.type.toUpperCase()}!`,
                0x00FFFF
            );
        }
        
        // Destruir después de la animación
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            y: this.y - 30,
            scale: 1.5,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.destroy();
            }
        });
        
        return this.type;
    }
    
    createCollectEffect() {
        // Crear partículas para el efecto de recolección
        try {
            if (this.scene.add.particles) {
                const particles = this.scene.add.particles(this.x, this.y, 'sparkle', {
                    speed: 100,
                    scale: { start: 0.5, end: 0 },
                    lifespan: 600,
                    blendMode: 'ADD',
                    quantity: 10,
                    tint: 0x00FFFF
                });
                
                // Autodestruir el emisor después de 600ms
                this.scene.time.delayedCall(600, () => {
                    particles.destroy();
                });
            }
        } catch (error) {
            console.warn('Error al crear partículas de recolección', error);
        }
    }
    
    // Método update para comportamientos dinámicos
    update() {
        // Cualquier lógica adicional que necesite actualizarse en cada frame
        // (por ahora no es necesario, los tweens manejan el movimiento)
    }
}

export default WeaponPickup; 