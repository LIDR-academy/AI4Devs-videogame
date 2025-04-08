class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load minimal assets needed for the loading screen
        this.load.image('logo', 'assets/images/logo.svg');
        this.load.image('loading-bar', 'assets/images/loading-bar.svg');
    }

    create() {
        // Set up game settings and configurations
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Initialize the game systems (they'll be fully set up later)
        this.game.laneManager = {};
        this.game.combatSystem = {};
        this.game.economySystem = {};
        
        // Transition to the preloader scene
        this.scene.start('PreloadScene');
    }
}

// Exportar la clase para que esté disponible globalmente
window.BootScene = BootScene;
