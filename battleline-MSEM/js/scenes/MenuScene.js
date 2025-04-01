class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Background
        this.add.image(400, 300, 'background');
        
        // Title text
        this.add.text(400, 100, 'Warlords: Call to Arms', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(400, 160, 'Select Your Race', {
            fontFamily: 'Arial',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        // Race selection buttons
        this.createRaceButtons();
        
        // Play background music
        // Commented out for now to avoid audio errors
        // this.sound.play('title-music', { loop: true });
    }
    
    createRaceButtons() {
        // Get races from config
        const races = gameConfig.gameSettings.races;
        
        // Calculate button positions
        const buttonWidth = 200;
        const spacing = 50;
        const totalWidth = (races.length * buttonWidth) + ((races.length - 1) * spacing);
        const startX = (800 - totalWidth) / 2 + (buttonWidth / 2);
        
        // Create a button for each race
        races.forEach((race, index) => {
            const x = startX + (index * (buttonWidth + spacing));
            const y = 350;
            
            // Create button background
            const button = this.add.image(x, y, 'button').setDisplaySize(buttonWidth, 80);
            
            // Make button interactive
            button.setInteractive();
            
            // Add race icon
            this.add.image(x - 70, y, `${race.slice(0, -1)}-icon`).setDisplaySize(50, 50);
            
            // Add race text
            this.add.text(x + 10, y, this.capitalizeFirstLetter(race), {
                fontFamily: 'Arial',
                fontSize: 24,
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            // Button hover effects
            button.on('pointerover', () => {
                button.setTint(0xaaaaaa);
            });
            
            button.on('pointerout', () => {
                button.clearTint();
            });
            
            // Button click - start game with selected race
            button.on('pointerdown', () => {
                // Play click sound if available
                if (this.sound && this.sound.get('click')) {
                    this.sound.play('click');
                }
                
                // Set player race
                this.game.globals.playerRace = race;
                
                // Select random enemy race different from player
                let availableEnemyRaces = [...gameConfig.gameSettings.races];
                availableEnemyRaces.splice(availableEnemyRaces.indexOf(race), 1);
                const enemyRace = availableEnemyRaces[Math.floor(Math.random() * availableEnemyRaces.length)];
                this.game.globals.enemyRace = enemyRace;
                
                // Start the game scene
                this.scene.start('GameScene');
            });
        });
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Exportar la clase para que esté disponible globalmente
window.MenuScene = MenuScene;
