export class HiddenObject extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        this.setInteractive();
        this.found = false;
        this.setScale(0.08); // Changed from 0.1 to 0.08 for smaller size
        this.setAlpha(0.6); // Add initial transparency (0.6 = 60% opacity)
        
        this.on('pointerdown', this.onObjectClick, this);
        this.on('pointerover', this.onHover, this);
        this.on('pointerout', this.onHoverOut, this);
    }

    onObjectClick() {
        if (!this.found) {
            this.found = true;
            this.scene.onObjectFound(this);
            this.setTint(0x00ff00); // Green tint when found
            this.setAlpha(1); // Fully visible when found
        }
    }

    onHover() {
        if (!this.found) {
            this.setScale(0.09); // Changed from 0.12 to 0.09 for hover effect
            this.setAlpha(0.8); // More visible on hover
        }
    }

    onHoverOut() {
        if (!this.found) {
            this.setScale(0.08); // Changed from 0.1 to 0.08 to match initial scale
            this.setAlpha(0.6); // Return to initial transparency
        }
    }
}
