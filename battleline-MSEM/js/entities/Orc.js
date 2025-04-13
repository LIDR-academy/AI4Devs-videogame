// Orc units class (extends Unit)
// This file is currently just a placeholder as we're using the base Unit class
// We can implement race-specific functionality here if needed

class Orc extends Unit {
    constructor(scene, x, y, type, isPlayer, laneIndex) {
        super(scene, x, y, `orc-${type}`, 'orcs', type, isPlayer, laneIndex);
    }
}

// Exportar la clase para que esté disponible globalmente
window.Orc = Orc;
