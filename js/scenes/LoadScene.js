export class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadScene' });
    }

    preload() {
        // Por ahora no necesitamos cargar assets
    }

    create() {
        this.scene.start('MenuScene');
    }
} 