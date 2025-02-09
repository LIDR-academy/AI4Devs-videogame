export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Set the base path for all assets
        this.load.setBaseURL('./src/assets/');

        // Load background
        this.load.image('old-room', 'images/backgrounds/old_room.png');
        
        // Load objects
        this.load.image('candle', 'images/objects/candle.png');
        this.load.image('feather', 'images/objects/feather.png');
        this.load.image('hourglass', 'images/objects/hourglass.png');
        this.load.image('pocket-watch', 'images/objects/pocket_watch.png');

        // Add loading bar if needed
        this.add.text(20, 20, 'Loading game...', {
            font: '24px Arial',
            fill: '#ffffff'
        });
    }

    create() {
        this.scene.start('GameScene');
    }
}