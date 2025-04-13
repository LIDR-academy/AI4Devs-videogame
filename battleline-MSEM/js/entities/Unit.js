class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, race, type, isPlayer, laneIndex) {
        super(scene, x, y, texture);
        
        // Add sprite to scene
        scene.add.existing(this);
        
        // Enable physics body
        scene.physics.add.existing(this);
        
        // Store properties
        this.race = race;
        this.type = type;
        this.isPlayer = isPlayer;
        this.laneIndex = laneIndex;
        
        // Set unit stats based on type and race
        this.setUnitStats();
        
        // Set up physics body
        this.setPhysicsBody();
        
        // Initial state
        this.state = 'walking'; // walking, attacking, dying
        this.target = null;
        this.attackTimer = 0;
        this.attackCooldown = 1000; // 1 second default
        
        // Para debugging - darle colores distintos a cada equipo
        if (isPlayer) {
            this.setTint(0x0000ff); // Azul para jugador
        } else {
            this.setTint(0xff0000); // Rojo para enemigo
            this.flipX = true;     // Voltear sprite
        }
        
        // Logear la creación de la unidad
        console.log(`Unidad creada: ${race}-${type} en posición (${x},${y}), lane ${laneIndex}, isPlayer: ${isPlayer}`);
        
        // Start moving - IMPORTANTE: iniciar movimiento después de configurar todo
        this.velocityX = (isPlayer ? 1 : -1) * this.stats.moveSpeed;
        this.moving = true;
        this.startMovement();
    }
    
    setUnitStats() {
        // Default stats
        this.stats = {
            health: 100,
            maxHealth: 100,
            damage: 20,
            attackSpeed: 1, // Attacks per second
            attackRange: 20, // Pixels
            moveSpeed: 50,   // Pixels per second
            isRanged: false,
            specialAbility: null
        };
        
        // Customize stats based on race and type
        switch(this.race) {
            case 'humans':
                this.setHumanStats();
                break;
            case 'elves':
                this.setElfStats();
                break;
            case 'orcs':
                this.setOrcStats();
                break;
        }
        
        // Set attack cooldown based on attack speed
        this.attackCooldown = 1000 / this.stats.attackSpeed;
    }
    
    setHumanStats() {
        switch(this.type) {
            case 'swordsman':
                this.stats.health = 100;
                this.stats.damage = 20;
                this.stats.moveSpeed = 60;
                this.stats.attackRange = 20;
                break;
            case 'archer':
                this.stats.health = 80;
                this.stats.damage = 15;
                this.stats.moveSpeed = 50;
                this.stats.attackRange = 150;
                this.stats.isRanged = true;
                break;
            case 'knight':
                this.stats.health = 200;
                this.stats.damage = 25;
                this.stats.moveSpeed = 40;
                this.stats.attackRange = 25;
                break;
            case 'cleric':
                this.stats.health = 90;
                this.stats.damage = 10;
                this.stats.moveSpeed = 45;
                this.stats.attackRange = 100;
                this.stats.specialAbility = 'heal';
                break;
        }
    }
    
    setElfStats() {
        switch(this.type) {
            case 'spearman':
                this.stats.health = 80;
                this.stats.damage = 18;
                this.stats.moveSpeed = 70;
                this.stats.attackRange = 30;
                break;
            case 'archer':
                this.stats.health = 70;
                this.stats.damage = 12;
                this.stats.moveSpeed = 55;
                this.stats.attackRange = 200;
                this.stats.isRanged = true;
                break;
            case 'druid':
                this.stats.health = 90;
                this.stats.damage = 15;
                this.stats.moveSpeed = 50;
                this.stats.attackRange = 120;
                this.stats.specialAbility = 'slow';
                break;
            case 'sentinel':
                this.stats.health = 110;
                this.stats.damage = 25;
                this.stats.moveSpeed = 45;
                this.stats.attackRange = 130;
                this.stats.isRanged = true;
                this.stats.specialAbility = 'area';
                break;
        }
    }
    
    setOrcStats() {
        switch(this.type) {
            case 'brute':
                this.stats.health = 130;
                this.stats.damage = 30;
                this.stats.moveSpeed = 40;
                this.stats.attackRange = 25;
                break;
            case 'thrower':
                this.stats.health = 90;
                this.stats.damage = 20;
                this.stats.moveSpeed = 45;
                this.stats.attackRange = 100;
                this.stats.isRanged = true;
                break;
            case 'shaman':
                this.stats.health = 100;
                this.stats.damage = 15;
                this.stats.moveSpeed = 40;
                this.stats.attackRange = 110;
                this.stats.specialAbility = 'weaken';
                break;
            case 'beast':
                this.stats.health = 180;
                this.stats.damage = 35;
                this.stats.moveSpeed = 35;
                this.stats.attackRange = 30;
                this.stats.specialAbility = 'aoe';
                break;
        }
    }
    
    setPhysicsBody() {
        // Set size for collision
        this.body.setSize(30, 40);
        
        // No gravity
        this.body.setAllowGravity(false);
        
        // No bounce
        this.body.setBounce(0);
        
        // Importante: configurar para que no se bloqueen entre sí
        this.body.setImmovable(false);
        
        // Debugging: mostrar el cuerpo físico
        this.body.debugShowBody = true;
        this.body.debugBodyColor = 0xff0000;
        
        console.log(`Física configurada para ${this.race}-${this.type}, isPlayer: ${this.isPlayer}`);
    }
    
    update(delta) {
        // Si la unidad está inactiva o ha sido destruida, no hacer nada
        if (!this.active || this.stats.health <= 0) return;
        
        // NUEVO: Actualizar posición manualmente si estamos en estado walking
        if (this.state === 'walking' && this.moving) {
            // Mover la unidad basado en su velocidad y el delta time
            this.x += this.velocityX * (delta / 1000);
            
            // Comprobar si ha llegado al borde del campo
            if ((this.isPlayer && this.x >= 730) || (!this.isPlayer && this.x <= 70)) {
                // Llamar a la función correspondiente en la escena
                console.log(`Unidad llegó al borde: ${this.race}-${this.type}`);
                if (this.isPlayer) {
                    if (this.scene.playerWins) this.scene.playerWins();
                } else {
                    if (this.scene.enemyWins) this.scene.enemyWins();
                }
            }
            
            // También actualizar la velocidad física para mantener la coherencia
            this.body.setVelocityX(this.velocityX);
        }
        
        // Debug info
        if (this.scene.game.config.physics.debug) {
            console.log(`Unit (${this.race}-${this.type}) state: ${this.state}, pos: ${Math.floor(this.x)},${Math.floor(this.y)}, target: ${this.target ? 'yes' : 'no'}`);
        }
        
        // Asegurar que la unidad permanezca en su lane
        const targetY = this.scene.getLaneY(this.laneIndex);
        if (Math.abs(this.y - targetY) > 5) {
            this.y = Phaser.Math.Linear(this.y, targetY, 0.1);
        }
        
        // Verificar colisiones con otras unidades si estamos caminando
        if (this.state === 'walking') {
            // Check for nearby targets
            this.findTarget();
        }
        
        // Update attack timer if attacking
        if (this.state === 'attacking' && this.target) {
            this.attackTimer += delta;
            
            // Verificar si el objetivo sigue siendo válido
            if (!this.target.active || this.target.stats.health <= 0) {
                this.clearTarget();
                return;
            }
            
            // Verificar si el objetivo se ha alejado demasiado
            const distance = Math.abs(this.x - this.target.x);
            if (distance > this.stats.attackRange * 1.5) {
                this.clearTarget();
                return;
            }
            
            // Attack when cooldown reached
            if (this.attackTimer >= this.attackCooldown) {
                this.performAttack();
                this.attackTimer = 0;
                
                // Reproducir sonido de ataque si está disponible
                if (this.scene.sound && this.scene.sound.get('attack')) {
                    this.scene.sound.play('attack', { volume: 0.5 });
                }
                
                // Crear un efecto visual simple para el ataque
                this.createAttackEffect();
            }
        }
    }
    
    startMovement() {
        // Set the velocity property
        const direction = this.isPlayer ? 1 : -1;
        this.velocityX = direction * this.stats.moveSpeed;
        
        // Also set physics velocity
        this.body.setVelocityX(this.velocityX);
        
        // Mark as moving
        this.moving = true;
        this.state = 'walking';
        
        console.log(`Unidad ${this.race}-${this.type} iniciando movimiento: velocidad=${this.velocityX}`);
    }
    
    stopMovement() {
        // Stop moving
        this.body.setVelocityX(0);
        this.moving = false;
        
        // Change state to idle
        if (this.state === 'walking') {
            this.state = 'idle';
        }
    }
    
    findTarget() {
        // Get all units in the same lane
        const units = this.isPlayer ? 
                     this.scene.enemyUnits : 
                     this.scene.playerUnits;
        
        // Find the nearest unit in range and in the same lane
        let nearestUnit = null;
        let shortestDistance = Infinity;
        
        // Asegurarse de que units sea un array usando getChildren()
        if (units && units.getChildren) {
            units.getChildren().forEach(unit => {
                // Skip inactive units or units in different lanes
                if (!unit.active || unit.laneIndex !== this.laneIndex) return;
                
                // Calculate distance
                const distance = Math.abs(this.x - unit.x);
                
                // Check if within attack range and closer than current nearest
                if (distance <= this.stats.attackRange && distance < shortestDistance) {
                    nearestUnit = unit;
                    shortestDistance = distance;
                }
            });
        } else {
            console.warn('Units is not a valid Phaser Group', units);
        }
        
        // If found a target, start attacking
        if (nearestUnit) {
            this.setTarget(nearestUnit);
        }
    }
    
    setTarget(target) {
        this.target = target;
        this.state = 'attacking';
        
        // Stop movement
        this.stopMovement();
        
        // Visual indication of attacking (tint)
        this.setTint(0xff9900);
        
        // Reset attack timer
        this.attackTimer = this.attackCooldown * 0.8; // Attack soon after targeting
    }
    
    clearTarget() {
        this.target = null;
        this.state = 'walking';
        
        // Clear attack visual
        this.clearTint();
        
        // Resume movement
        this.startMovement();
    }
    
    performAttack() {
        // Solo atacar si tenemos un objetivo válido
        if (!this.target || !this.target.active) {
            this.clearTarget();
            return;
        }
        
        try {
            // Aplicar daño al objetivo
            const damage = this.stats.damage;
            
            // Verificar que el objetivo todavía exista y tenga el método takeDamage
            if (this.target && typeof this.target.takeDamage === 'function') {
                this.target.takeDamage(damage, this);
                
                // Mostrar texto de daño
                this.showDamageText(damage);
            } else {
                console.warn('Objetivo no válido para ataque', this.target);
                this.clearTarget();
            }
        } catch (error) {
            console.error('Error al realizar ataque:', error);
            this.clearTarget();
        }
    }
    
    showDamageText(amount) {
        // Crear texto de daño - usar la posición de la propia unidad, no del objetivo
        const damageText = this.scene.add.text(
            this.x, 
            this.y - 20, 
            `-${amount}`, 
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ff0000',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Animar el texto
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    takeDamage(amount, attacker) {
        // Reduce health
        this.stats.health -= amount;
        
        // Show damage text
        this.showDamageText(amount);
        
        // Visual indication of damage (flash red)
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (this.active) this.clearTint();
        });
        
        // Check if dead
        if (this.stats.health <= 0) {
            this.die(attacker);
        }
    }
    
    die(attacker) {
        // Change state
        this.state = 'dying';
        
        // Stop moving
        this.body.setVelocityX(0);
        
        // Visual indication of death (tint and alpha)
        this.setTint(0xff0000);
        
        // Play death sound if available
        if (this.scene.sound && this.scene.sound.get('death')) {
            this.scene.sound.play('death');
        }
        
        // Give gold to killer
        if (attacker && attacker.isPlayer !== this.isPlayer) {
            const goldAmount = gameConfig.gameSettings.goldPerKill;
            if (attacker.isPlayer) {
                this.scene.addGold(goldAmount);
            } else {
                this.scene.addEnemyGold(goldAmount);
            }
        }
        
        // Fade out effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }
    
    useSpecialAbility() {
        switch(this.stats.specialAbility) {
            case 'heal':
                this.healNearbyAllies();
                break;
            case 'slow':
                this.slowTarget();
                break;
            case 'weaken':
                this.weakenTarget();
                break;
            case 'aoe':
                this.areaAttack();
                break;
            case 'area':
                this.areaMagicAttack();
                break;
        }
    }
    
    healNearbyAllies() {
        // Find all allies in range
        const units = this.isPlayer ? 
                     this.scene.playerUnits : 
                     this.scene.enemyUnits;
        
        // Healing amount
        const healAmount = 10;
        
        units.forEach(unit => {
            // Skip self
            if (unit === this) return;
            
            // Calculate distance
            const distance = Phaser.Math.Distance.Between(this.x, this.y, unit.x, unit.y);
            
            // If within 100 pixels
            if (distance <= 100) {
                // Heal unit
                unit.stats.health = Math.min(unit.stats.health + healAmount, unit.stats.maxHealth);
                
                // Show heal effect
                this.showHealEffect(unit);
            }
        });
    }
    
    showHealEffect(target) {
        // Create heal effect using image
        const healImg = this.scene.add.image(target.x, target.y, 'heal');
        healImg.setScale(0.5);
        
        // Animate and remove
        this.scene.tweens.add({
            targets: healImg,
            alpha: 0,
            scale: 1,
            duration: 1000,
            onComplete: () => {
                healImg.destroy();
            }
        });
        
        // Show heal text
        const healText = this.scene.add.text(
            target.x, 
            target.y - 20, 
            '+10', 
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#00ff00',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Animate and fade out
        this.scene.tweens.add({
            targets: healText,
            y: healText.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                healText.destroy();
            }
        });
    }
    
    slowTarget() {
        // Reduce target speed
        if (this.target) {
            const originalSpeed = this.target.stats.moveSpeed;
            this.target.stats.moveSpeed *= 0.7;
            
            // Visual indicator
            this.target.setTint(0x0000ff);
            
            // Reset after 3 seconds
            this.scene.time.delayedCall(3000, () => {
                if (this.target && this.target.active) {
                    this.target.stats.moveSpeed = originalSpeed;
                    this.target.clearTint();
                }
            });
        }
    }
    
    weakenTarget() {
        // Reduce target damage
        if (this.target) {
            const originalDamage = this.target.stats.damage;
            this.target.stats.damage *= 0.7;
            
            // Visual indicator
            this.target.setTint(0x800080);
            
            // Reset after 3 seconds
            this.scene.time.delayedCall(3000, () => {
                if (this.target && this.target.active) {
                    this.target.stats.damage = originalDamage;
                    this.target.clearTint();
                }
            });
        }
    }
    
    areaAttack() {
        // Get all enemy units in the same lane
        const units = this.isPlayer ? 
                     this.scene.enemyUnits : 
                     this.scene.playerUnits;
        
        units.forEach(unit => {
            // Skip if not in same lane
            if (unit.laneIndex !== this.laneIndex) return;
            
            // Calculate distance
            const distance = Math.abs(this.x - unit.x);
            
            // If within 60 pixels (wider than normal attack)
            if (distance <= 60) {
                // Apply damage
                unit.takeDamage(Math.floor(this.stats.damage * 0.6), this);
            }
        });
        
        // Show area effect
        this.showAreaEffect(60);
    }
    
    areaMagicAttack() {
        // Get all enemy units in nearby lanes
        const units = this.isPlayer ? 
                     this.scene.enemyUnits : 
                     this.scene.playerUnits;
        
        units.forEach(unit => {
            // Skip if too far in lane index (max 1 lane away)
            if (Math.abs(unit.laneIndex - this.laneIndex) > 1) return;
            
            // Calculate distance
            const distance = Phaser.Math.Distance.Between(this.x, this.y, unit.x, unit.y);
            
            // If within 100 pixels
            if (distance <= 100) {
                // Apply damage
                unit.takeDamage(Math.floor(this.stats.damage * 0.4), this);
            }
        });
        
        // Show area effect
        this.showAreaEffect(100);
    }
    
    showAreaEffect(radius) {
        // Create explosion using image
        const explosion = this.scene.add.image(this.x, this.y, 'explosion');
        explosion.setScale(radius / 64); // Scale to match radius
        
        // Animate and remove
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scale: explosion.scale * 1.5,
            duration: 500,
            onComplete: () => {
                explosion.destroy();
            }
        });
    }
    
    createAttackEffect() {
        // Si es una unidad a distancia, crear un proyectil
        if (this.stats.isRanged) {
            const projectile = this.scene.add.rectangle(
                this.x, 
                this.y, 
                10, 
                5, 
                0xffff00
            );
            
            // Mover el proyectil hacia el objetivo
            const direction = this.isPlayer ? 1 : -1;
            const targetX = this.target.x;
            
            this.scene.tweens.add({
                targets: projectile,
                x: targetX,
                duration: 300,
                onComplete: () => {
                    projectile.destroy();
                }
            });
        } 
        // Si es una unidad cuerpo a cuerpo, crear un flash de ataque
        else {
            const attackFlash = this.scene.add.rectangle(
                this.x + (this.isPlayer ? 20 : -20), 
                this.y, 
                20, 
                30, 
                0xff0000, 
                0.7
            );
            
            // Hacer que el flash desaparezca rápidamente
            this.scene.tweens.add({
                targets: attackFlash,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    attackFlash.destroy();
                }
            });
        }
    }
}

// Exportar la clase para que esté disponible globalmente
window.Unit = Unit;
