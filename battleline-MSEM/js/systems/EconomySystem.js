class EconomySystem {
    constructor(scene) {
        this.scene = scene;
        this.gold = config.gameSettings.initialGold;
        this.goldGenerationRate = config.gameSettings.goldPerInterval;
        this.goldGenerationInterval = config.gameSettings.goldInterval;
        this.goldPerKill = config.gameSettings.goldPerKill;
        
        // Upgrades
        this.upgrades = {
            goldRate: { level: 1, cost: 50, multiplier: 1.2 },
            unitHealth: { level: 1, cost: 40, multiplier: 1.1 },
            unitDamage: { level: 1, cost: 40, multiplier: 1.1 },
            cooldownReduction: { level: 1, cost: 60, multiplier: 0.9 }
        };
        
        // Start gold generation
        this.startGoldGeneration();
    }
    
    startGoldGeneration() {
        // Set up timer for passive gold generation
        this.goldTimer = this.scene.time.addEvent({
            delay: this.goldGenerationInterval,
            callback: this.generateGold,
            callbackScope: this,
            loop: true
        });
    }
    
    generateGold() {
        // Add gold to player
        this.scene.addGold(this.goldGenerationRate);
    }
    
    getUpgradeCost(upgradeType) {
        if (!this.upgrades[upgradeType]) return 0;
        return this.upgrades[upgradeType].cost;
    }
    
    canAffordUpgrade(upgradeType) {
        const cost = this.getUpgradeCost(upgradeType);
        return this.scene.gold >= cost;
    }
    
    purchaseUpgrade(upgradeType) {
        // Check if upgrade exists and player can afford it
        if (!this.upgrades[upgradeType]) return false;
        
        const cost = this.getUpgradeCost(upgradeType);
        if (this.scene.gold < cost) return false;
        
        // Deduct gold
        this.scene.addGold(-cost);
        
        // Apply upgrade
        const upgrade = this.upgrades[upgradeType];
        upgrade.level++;
        
        // Apply effects based on upgrade type
        switch (upgradeType) {
            case 'goldRate':
                this.goldGenerationRate = Math.floor(config.gameSettings.goldPerInterval * Math.pow(upgrade.multiplier, upgrade.level - 1));
                break;
                
            case 'unitHealth':
                // This will be applied when new units are created
                break;
                
            case 'unitDamage':
                // This will be applied when new units are created
                break;
                
            case 'cooldownReduction':
                // Update all cooldowns
                for (const unitKey in this.scene.cooldowns) {
                    const cd = this.scene.cooldowns[unitKey];
                    cd.total = Math.floor(cd.total * upgrade.multiplier);
                }
                break;
        }
        
        // Update upgrade cost for next level
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        
        return true;
    }
    
    // Apply upgrades to a new unit
    applyUpgradesToUnit(unit) {
        // Apply health upgrade
        const healthMultiplier = Math.pow(
            this.upgrades.unitHealth.multiplier, 
            this.upgrades.unitHealth.level - 1
        );
        unit.stats.health = Math.floor(unit.stats.health * healthMultiplier);
        unit.stats.maxHealth = unit.stats.health;
        
        // Apply damage upgrade
        const damageMultiplier = Math.pow(
            this.upgrades.unitDamage.multiplier, 
            this.upgrades.unitDamage.level - 1
        );
        unit.stats.damage = Math.floor(unit.stats.damage * damageMultiplier);
    }
    
    // Award gold for killing an enemy
    awardGoldForKill() {
        this.scene.addGold(this.goldPerKill);
    }
}

// Exportar la clase para que esté disponible globalmente
window.EconomySystem = EconomySystem;
