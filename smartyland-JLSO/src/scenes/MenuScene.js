export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Add title
        this.add.text(640, 200, 'Smartyland', {
            fontSize: '64px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(640, 360, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Optional: Add hover effects
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#fff' }));

        // Handle game over or level complete
        if (this.scene.settings.data) {
            const message = this.scene.settings.data.levelComplete ? 
                'Level Complete!' : 
                'Game Over!';
            
            this.add.text(640, 500, message, {
                fontSize: '48px',
                fill: '#fff'
            }).setOrigin(0.5);
        }
    }
}
