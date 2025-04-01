// Game configuration
const config = {
    // Game settings
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    pixelArt: true,
    backgroundColor: '#1a2b3c',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,  // Activar depuración visual de físicas
            fps: 60,      // Forzar 60 fps
            timeScale: 1, // Velocidad normal
            maxVelocity: 500, // Velocidad máxima más alta
            tileBias: 16,
            forceX: true  // Forzar movimiento en X
        }
    },
    // Las escenas se configurarán en main.js cuando las clases ya estén disponibles
    scene: [],
    // Game balance settings
    gameSettings: {
        // Lane settings
        laneCount: 5,
        laneHeight: 80,
        
        // Economy settings
        initialGold: 100,
        goldPerInterval: 5,
        goldInterval: 5000, // ms
        goldPerKill: 2,
        
        // Races
        races: ['humans', 'elves', 'orcs'],
        
        // Game speed
        gameSpeed: 1
    }
};

// Exportar la configuración globalmente
window.gameConfig = config;
