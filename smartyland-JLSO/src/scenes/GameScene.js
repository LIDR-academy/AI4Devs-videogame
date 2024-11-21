import { GAME_CONFIG } from '../utils/Constants.js';
import { HiddenObject } from '../objects/HiddenObject.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentLevel = 0;
        this.timeLeft = 0;
        this.foundObjects = 0;
        this.hiddenObjects = [];
        this.objectsFound = 0;
    }

    create() {
        const levelConfig = GAME_CONFIG.LEVELS[this.currentLevel];
        this.timeLeft = levelConfig.timeLimit;
        
        // Create background
        this.add.image(0, 0, 'old-room')
            .setOrigin(0)
            .setDisplaySize(this.game.config.width, this.game.config.height);

        // Setup UI
        this.setupUI();
        
        // Initialize level first (before setting up timer)
        this.initializeLevel();

        // Setup magnifying glass power-up
        this.setupMagnifyingGlass();

        // Create list of objects to find for level 1
        const objectsData = [
            { x: 200, y: 300, texture: 'candle' },
            { x: 500, y: 400, texture: 'feather' },
            { x: 200, y: 600, texture: 'hourglass' }, // Moved to bottom left
            { x: 900, y: 500, texture: 'pocket-watch' }
        ];

        // Create hidden objects
        objectsData.forEach(obj => {
            const hiddenObj = new HiddenObject(this, obj.x, obj.y, obj.texture);
            this.add.existing(hiddenObj);
            this.hiddenObjects.push(hiddenObj);
        });

        // Create object list UI
        this.createObjectList();
    }

    setupUI() {
        // Timer text - moved to top left
        this.timerText = this.add.text(20, 20, `Time: ${this.timeLeft}`, {
            fontSize: '24px',
            fill: '#fff'
        });

        // Hint button - adjusted position
        this.hintButton = this.add.image(this.game.config.width - 60, 40, 'hint-button')
            .setInteractive()
            .on('pointerdown', () => this.showHint());
    }

    showHint() {
        // Randomly select a non-found object
        const nonFoundObjects = this.hiddenObjects.filter(obj => !obj.found);
        if (nonFoundObjects.length > 0) {
            const randomObject = Phaser.Math.RND.pick(nonFoundObjects);
            
            // Create highlight effect
            const highlight = this.add.circle(
                randomObject.x,
                randomObject.y,
                30,
                0xffff00,
                0.3
            );

            // Remove highlight after 1 second
            this.time.delayedCall(1000, () => {
                highlight.destroy();
            });
        }
    }

    getLevelBackground() {
        const backgrounds = ['messy-room', 'museum', 'dev-setup'];
        return backgrounds[this.currentLevel];
    }

    createObjectList() {
        const padding = 20;
        const listWidth = 300; // Increased from 200 to 300
        const listStartX = this.game.config.width - listWidth;
        
        // Create darker background for list
        const listBg = this.add.rectangle(
            listStartX, 
            0, 
            listWidth, 
            720, 
            0x000000, 
            0.7
        ).setOrigin(0);

        // Title with more padding
        this.objectList = this.add.text(
            listStartX + padding,
            padding,
            'Objects to Find:', 
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        );

        // Modified object list with better spacing
        this.hiddenObjects.forEach((obj, index) => {
            // Add preview image with more space from left edge
            const previewImage = this.add.image(
                listStartX + padding + 20, // More indent for images
                100 + (index * 60), // More vertical spacing between items
                obj.texture.key
            )
                .setScale(0.05)
                .setOrigin(0, 0.5);

            // Add object name with more space after image
            const textItem = this.add.text(
                listStartX + padding + 80, // More space between image and text
                100 + (index * 60), // Match image Y position
                obj.texture.key,
                {
                    fontSize: '20px',
                    color: '#cccccc'
                }
            ).setOrigin(0, 0.5);

            // Store reference for later color updates
            obj.listText = textItem;
        });
    }

    onObjectFound(object) {
        this.objectsFound++;
        
        // Update text color using stored reference
        if (object.listText) {
            object.listText.setColor('#00ff00');
        }

        // Check if level complete
        if (this.objectsFound === this.hiddenObjects.length) {
            // Clean up the game state
            this.time.delayedCall(1000, () => {
                // Clear all references
                this.hiddenObjects.forEach(obj => {
                    if (obj.listText) {
                        obj.listText.destroy();
                    }
                    obj.destroy();
                });
                this.hiddenObjects = [];
                this.objectsFound = 0;
                
                // Start menu scene
                this.scene.start('MenuScene', { levelComplete: true });
            });
        }
    }

    initializeLevel() {
        const levelData = GAME_CONFIG.LEVELS[0];
        this.timeLeft = levelData.timeLimit;
        
        // Update timer text
        this.timerText.setText(`Time: ${this.timeLeft}`);

        // Create timer event
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => this.updateTimer(),
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.timeLeft--;
        if (this.timerText) {  // Add check to ensure timerText exists
            this.timerText.setText(`Time: ${this.timeLeft}`);
        }
        
        if (this.timeLeft <= 0) {
            // Clean up before game over
            this.hiddenObjects.forEach(obj => {
                if (obj.listText) {
                    obj.listText.destroy();
                }
                obj.destroy();
            });
            this.hiddenObjects = [];
            this.objectsFound = 0;
            
            // Start menu scene with game over
            this.scene.start('MenuScene', { gameOver: true });
        }
    }

    setupMagnifyingGlass() {
        // Magnifying glass power-up
        this.magnifyingGlassActive = false;
        this.magnifyingGlassCooldown = false;

        // Create magnifying glass button
        const magnifyingGlassBtn = this.add.text(this.game.config.width - 50, 100, '🔍', {
            fontSize: '32px'
        })
        .setOrigin(0.5)
        .setInteractive();

        magnifyingGlassBtn.on('pointerdown', () => {
            if (!this.magnifyingGlassActive && !this.magnifyingGlassCooldown) {
                this.activateMagnifyingGlass();
            }
        });
    }

    activateMagnifyingGlass() {
        this.magnifyingGlassActive = true;
        
        // Make all hidden objects slightly more visible
        this.hiddenObjects.forEach(obj => {
            if (!obj.found) {
                obj.setAlpha(0.8);
            }
        });

        // Reset after duration
        this.time.delayedCall(GAME_CONFIG.POWERUPS.MAGNIFYING_GLASS.duration, () => {
            this.hiddenObjects.forEach(obj => {
                if (!obj.found) {
                    obj.setAlpha(1);
                }
            });
            this.magnifyingGlassActive = false;
            this.magnifyingGlassCooldown = true;

            // Reset cooldown
            this.time.delayedCall(GAME_CONFIG.POWERUPS.MAGNIFYING_GLASS.cooldown, () => {
                this.magnifyingGlassCooldown = false;
            });
        });
    }

    // Add more methods as needed...
}