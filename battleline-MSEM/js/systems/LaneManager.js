class LaneManager {
    constructor(scene) {
        this.scene = scene;
        this.lanes = [];
    }
    
    addLane(index, y, height) {
        this.lanes[index] = {
            index: index,
            y: y,
            height: height,
            playerUnits: [],
            enemyUnits: []
        };
    }
    
    getLane(index) {
        return this.lanes[index];
    }
    
    registerUnit(unit) {
        const lane = this.lanes[unit.laneIndex];
        
        if (unit.isPlayer) {
            lane.playerUnits.push(unit);
        } else {
            lane.enemyUnits.push(unit);
        }
    }
    
    unregisterUnit(unit) {
        const lane = this.lanes[unit.laneIndex];
        
        if (unit.isPlayer) {
            const index = lane.playerUnits.indexOf(unit);
            if (index !== -1) {
                lane.playerUnits.splice(index, 1);
            }
        } else {
            const index = lane.enemyUnits.indexOf(unit);
            if (index !== -1) {
                lane.enemyUnits.splice(index, 1);
            }
        }
    }
    
    getUnitsInLane(laneIndex, isPlayer) {
        const lane = this.lanes[laneIndex];
        return isPlayer ? lane.playerUnits : lane.enemyUnits;
    }
    
    getEnemyUnitsInLane(laneIndex, isPlayer) {
        const lane = this.lanes[laneIndex];
        return isPlayer ? lane.enemyUnits : lane.playerUnits;
    }
    
    findNearestEnemy(unit, maxRange) {
        const lane = this.lanes[unit.laneIndex];
        const enemyUnits = unit.isPlayer ? lane.enemyUnits : lane.playerUnits;
        
        let nearest = null;
        let nearestDistance = Infinity;
        
        for (const enemy of enemyUnits) {
            if (!enemy.active) continue;
            
            const distance = Math.abs(unit.x - enemy.x);
            
            if (distance <= maxRange && distance < nearestDistance) {
                nearest = enemy;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }
}

// Exportar la clase para que esté disponible globalmente
window.LaneManager = LaneManager;
