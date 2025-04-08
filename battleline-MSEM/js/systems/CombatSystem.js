class CombatSystem {
    constructor(scene) {
        this.scene = scene;
    }
    
    // Process an attack from one unit to another
    processAttack(attacker, defender) {
        // Calculate damage based on unit stats
        let damage = attacker.stats.damage;
        
        // Apply damage to defender
        defender.takeDamage(damage, attacker);
        
        // Return the damage dealt for reference
        return damage;
    }
    
    // Check for combat between units in all lanes
    checkForCombat() {
        // Process each lane
        for (let i = 0; i < this.scene.game.laneManager.lanes.length; i++) {
            this.checkLaneCombat(i);
        }
    }
    
    // Check for combat in a specific lane
    checkLaneCombat(laneIndex) {
        const lane = this.scene.game.laneManager.getLane(laneIndex);
        
        // Check each player unit
        lane.playerUnits.forEach(unit => {
            if (!unit.active || unit.state !== 'walking') return;
            
            const enemy = this.scene.game.laneManager.findNearestEnemy(unit, unit.stats.attackRange);
            if (enemy) {
                unit.setTarget(enemy);
            }
        });
        
        // Check each enemy unit
        lane.enemyUnits.forEach(unit => {
            if (!unit.active || unit.state !== 'walking') return;
            
            const enemy = this.scene.game.laneManager.findNearestEnemy(unit, unit.stats.attackRange);
            if (enemy) {
                unit.setTarget(enemy);
            }
        });
    }
    
    // Helper method to perform area effect
    applyAreaEffect(source, centerX, centerY, radius, damage, affectsAllies = false) {
        // Get all units that could be affected
        const units = [];
        
        if (source.isPlayer) {
            // If source is player, target enemy units (and potentially allies)
            units.push(...this.scene.enemyUnits);
            if (affectsAllies) units.push(...this.scene.playerUnits);
        } else {
            // If source is enemy, target player units (and potentially allies)
            units.push(...this.scene.playerUnits);
            if (affectsAllies) units.push(...this.scene.enemyUnits);
        }
        
        // Filter units within radius
        const affectedUnits = units.filter(unit => {
            if (!unit.active || unit === source) return false;
            
            const distance = Phaser.Math.Distance.Between(centerX, centerY, unit.x, unit.y);
            return distance <= radius;
        });
        
        // Apply damage to each affected unit
        affectedUnits.forEach(unit => {
            unit.takeDamage(damage, source);
        });
        
        return affectedUnits.length;
    }
    
    // Process healing on target
    processHealing(healer, target, amount) {
        // Apply healing
        target.stats.health = Math.min(target.stats.health + amount, target.stats.maxHealth);
        
        // Show healing effect
        healer.showHealEffect(target);
        
        return amount;
    }
    
    // Apply slow effect to target
    applySlowEffect(source, target, duration = 3000, strength = 0.7) {
        const originalSpeed = target.stats.moveSpeed;
        
        // Reduce movement speed
        target.stats.moveSpeed *= strength;
        
        // Visual indicator
        target.setTint(0x0000ff);
        
        // Reset after duration
        this.scene.time.delayedCall(duration, () => {
            if (target && target.active) {
                target.stats.moveSpeed = originalSpeed;
                target.clearTint();
            }
        });
    }
    
    // Apply weaken effect to target
    applyWeakenEffect(source, target, duration = 3000, strength = 0.7) {
        const originalDamage = target.stats.damage;
        
        // Reduce damage output
        target.stats.damage *= strength;
        
        // Visual indicator
        target.setTint(0x800080);
        
        // Reset after duration
        this.scene.time.delayedCall(duration, () => {
            if (target && target.active) {
                target.stats.damage = originalDamage;
                target.clearTint();
            }
        });
    }
}

// Exportar la clase para que esté disponible globalmente
window.CombatSystem = CombatSystem;
