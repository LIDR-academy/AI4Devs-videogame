class LevelManager {
    constructor() {
        // Configuración de los niveles del juego
        this.levels = [
            {
                id: 1,
                name: 'Cementerio Encantado',
                background: 'stage1-background',
                music: 'game-music',
                width: 3200,
                bossType: 'flying-demon',
                bossName: 'Demonio Alado',
                enemyTypes: ['zombie'],
                enemySpawnRate: 2000,
                difficulty: 1
            },
            {
                id: 2,
                name: 'Bosque Maldito',
                background: 'stage2-background',
                music: 'forest-music',
                width: 3600,
                bossType: 'tree-monster',
                bossName: 'Árbol Ancestral',
                enemyTypes: ['zombie', 'phantom'],
                enemySpawnRate: 1800,
                difficulty: 1.2
            },
            {
                id: 3,
                name: 'Castillo Embrujado',
                background: 'stage3-background',
                music: 'castle-music',
                width: 4000,
                bossType: 'knight',
                bossName: 'Caballero Maldito',
                enemyTypes: ['zombie', 'phantom', 'skeleton'],
                enemySpawnRate: 1600,
                difficulty: 1.5
            },
            {
                id: 4,
                name: 'Caverna Infernal',
                background: 'stage4-background',
                music: 'cave-music',
                width: 4400,
                bossType: 'dragon',
                bossName: 'Dragón de Fuego',
                enemyTypes: ['zombie', 'phantom', 'skeleton', 'demon'],
                enemySpawnRate: 1400,
                difficulty: 1.8
            },
            {
                id: 5,
                name: 'Trono del Diablo',
                background: 'stage5-background',
                music: 'final-music',
                width: 4800,
                bossType: 'lucifer',
                bossName: 'Rey Demonio',
                enemyTypes: ['zombie', 'phantom', 'skeleton', 'demon', 'gargoyle'],
                enemySpawnRate: 1200,
                difficulty: 2.0
            }
        ];
    }

    // Obtener datos de un nivel específico
    getLevel(levelId) {
        const level = this.levels.find(l => l.id === levelId);
        if (!level) {
            console.error(`No se encontró el nivel con ID ${levelId}`);
            // Devolver el primer nivel como fallback
            return this.levels[0];
        }
        return level;
    }

    // Obtener el número total de niveles
    getTotalLevels() {
        return this.levels.length;
    }

    // Obtener la configuración para el siguiente nivel
    getNextLevel(currentLevelId) {
        const nextLevelId = currentLevelId + 1;
        if (nextLevelId > this.levels.length) {
            // Si no hay más niveles, indicarlo devolviendo null
            return null;
        }
        return this.getLevel(nextLevelId);
    }

    // Comprobar si es el último nivel
    isLastLevel(levelId) {
        return levelId === this.levels.length;
    }

    // Obtener dificultad del nivel
    getLevelDifficulty(levelId) {
        const level = this.getLevel(levelId);
        return level.difficulty;
    }

    // Generar configuración del jefe para un nivel
    getBossConfig(levelId) {
        const level = this.getLevel(levelId);
        return {
            type: level.bossType,
            name: level.bossName,
            health: 100 * level.difficulty,
            damage: 10 * level.difficulty,
            speed: 100 * Math.sqrt(level.difficulty)
        };
    }

    // Generar lista de enemigos para un nivel
    getEnemyTypes(levelId) {
        const level = this.getLevel(levelId);
        return level.enemyTypes;
    }
}

export default LevelManager; 