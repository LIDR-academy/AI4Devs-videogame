// Wait for DOM to load before starting the game
window.onload = function() {
    // Agregar las escenas a la configuración ahora que todas las clases están disponibles
    gameConfig.scene = [
        BootScene,
        PreloadScene,
        MenuScene,
        GameScene
    ];
    
    // Create a new Phaser game instance with our configuration
    const game = new Phaser.Game(gameConfig);
    
    // Make game instance globally accessible
    window.game = game;
    
    // Track game state
    game.globals = {
        playerRace: null,  // Player's chosen race
        enemyRace: null,   // Enemy's race
        playerGold: gameConfig.gameSettings.initialGold,
        enemyGold: gameConfig.gameSettings.initialGold,
        gameOver: false,
        winner: null
    };
};
