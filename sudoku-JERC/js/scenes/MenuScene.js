export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Título
        this.add.text(400, 150, 'SUDOKU', {
            fontSize: '64px',
            fill: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Botón de inicio
        const startButton = this.add.rectangle(400, 300, 200, 60, 0x4CAF50);
        this.add.text(400, 300, 'Iniciar Juego', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        startButton.setInteractive();
        startButton.on('pointerover', () => startButton.setFillStyle(0x45A049));
        startButton.on('pointerout', () => startButton.setFillStyle(0x4CAF50));
        startButton.on('pointerdown', () => this.scene.start('GameScene'));
    }
} 