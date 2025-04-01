// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#4488aa',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Variables
let player;
let platforms;
let obstacles;
let score = 0;
let scoreText;
let gameSpeed = 5;
let gameOver = false;
let difficultyLevel = 1;
let debugText;

// Improved jump handling with coyote time (small grace period for jumping after leaving platform)
const COYOTE_TIME = 150; // milliseconds
let lastOnGroundTime = 0;

// Preload game assets - using generated graphics instead of image files
function preload() {
    // We'll create graphics in the create function instead of loading images
}

// Create game objects
function create() {
    // Create platforms group
    platforms = this.physics.add.staticGroup();
    
    // Create ground with better collision
    const ground = platforms.create(400, 580, '');
    ground.setVisible(false);
    ground.body.setSize(800, 40);
    ground.refreshBody();
    ground.body.immovable = true; // Make sure the ground doesn't move
    
    // Create a visible ground
    const groundGraphics = this.add.rectangle(400, 580, 800, 40, 0x00aa00);
    
    // Create player - using a rectangle for visuals
    const playerGraphics = this.add.rectangle(100, 450, 32, 48, 0xff0000);
    
    // Create the player physics object
    player = this.physics.add.sprite(100, 450, '');
    player.setVisible(false); // Hide the default sprite
    player.body.setSize(32, 48); // Set the physics body size
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Store graphics objects in a map to update them in the update function
    this.graphicsMap = new Map();
    this.graphicsMap.set(player, playerGraphics);
    
    // Create obstacles group
    obstacles = this.physics.add.group();
    
    // Improved colliders with better precision
    this.physics.add.collider(player, platforms, function() {
        // Add a small visual indicator when player touches ground
        if (!player.wasOnGround && player.body.touching.down) {
            const landEffect = this.add.circle(player.x, player.y + 24, 10, 0xffffff, 0.5);
            this.tweens.add({
                targets: landEffect,
                alpha: 0,
                scale: 2,
                duration: 300,
                onComplete: function() { landEffect.destroy(); }
            });
        }
        player.wasOnGround = player.body.touching.down;
    }, null, this);
    
    // More precise collision for obstacles with custom callback
    this.physics.add.overlap(player, obstacles, function(player, obstacle) {
        // Calculate more precise collision based on the graphics size
        const playerGraphic = this.graphicsMap.get(player);
        const obstacleGraphic = this.graphicsMap.get(obstacle);
        
        if (!playerGraphic || !obstacleGraphic) return;
        
        // Get actual bounds for more precise collision
        const playerBounds = {
            left: player.x - (playerGraphic.width / 2) + 5, // Add small margin for fairness
            right: player.x + (playerGraphic.width / 2) - 5,
            top: player.y - (playerGraphic.height / 2) + 5,
            bottom: player.y + (playerGraphic.height / 2) - 5
        };
        
        const obstacleBounds = {
            left: obstacle.x - (obstacleGraphic.width / 2),
            right: obstacle.x + (obstacleGraphic.width / 2),
            top: obstacle.y - (obstacleGraphic.height / 2),
            bottom: obstacle.y + (obstacleGraphic.height / 2)
        };
        
        // Check if bounds actually overlap
        if (playerBounds.right > obstacleBounds.left && 
            playerBounds.left < obstacleBounds.right && 
            playerBounds.bottom > obstacleBounds.top && 
            playerBounds.top < obstacleBounds.bottom) {
            
            // Visual feedback for collision point
            const collisionPoint = this.add.circle(
                (playerBounds.left + playerBounds.right) / 2,
                (playerBounds.top + playerBounds.bottom) / 2,
                5, 0xff0000, 1
            );
            
            this.tweens.add({
                targets: collisionPoint,
                alpha: 0,
                scale: 3,
                duration: 500,
                onComplete: function() { collisionPoint.destroy(); }
            });
            
            // Call game over function
            gameOverFunction.call(this, player, obstacle);
        }
    }, null, this);
    
    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    
    // Start spawning obstacles with variable delay based on difficulty
    this.obstacleTimer = this.time.addEvent({
        delay: 2000,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });
    
    // Debug text to show player state
    debugText = this.add.text(16, 50, '', { fontSize: '16px', fill: '#fff' });
    
    // Difficulty level text
    this.difficultyText = this.add.text(600, 16, 'Level: 1', { fontSize: '24px', fill: '#fff' });

    // In the create function, add this direct keyboard handler:
    this.input.keyboard.on('keydown-SPACE', function() {
        console.log("Space key detected directly in Phaser");
        player.setVelocityY(-350);
    }, this);

    // Add a direct click handler too
    this.input.on('pointerdown', function() {
        if (!gameOver) {
            console.log("Click detected directly in Phaser");
            player.setVelocityY(-350);
        }
    }, this);
}

// Update game state
function update() {
    if (gameOver) {
        return;
    }
    
    // Update score
    score += 0.1;
    const currentScore = Math.floor(score);
    scoreText.setText('Score: ' + currentScore);
    
    // Update difficulty level based on score
    const newDifficultyLevel = Math.floor(currentScore / 50) + 1;
    if (newDifficultyLevel !== difficultyLevel) {
        difficultyLevel = newDifficultyLevel;
        this.difficultyText.setText('Level: ' + difficultyLevel);
        
        // Adjust obstacle spawn rate based on difficulty
        this.obstacleTimer.delay = Math.max(500, 2000 - (difficultyLevel * 200));
        
        // Visual feedback for level up
        const levelUpText = this.add.text(400, 300, 'LEVEL UP!', { 
            fontSize: '48px', 
            fill: '#ffff00',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: levelUpText,
            alpha: 0,
            y: 250,
            duration: 1000,
            ease: 'Power2',
            onComplete: function() { levelUpText.destroy(); }
        });
    }
    
    // Increase game speed over time
    gameSpeed = 5 + Math.floor(difficultyLevel * 1.5);
    
    // Update graphics positions
    this.graphicsMap.forEach((graphic, physicsObj) => {
        if (physicsObj.active) {
            graphic.x = physicsObj.x;
            graphic.y = physicsObj.y;
            
            // If this is an obstacle graphic, update its size if it has custom properties
            if (physicsObj.obstacleData) {
                graphic.width = physicsObj.obstacleData.width;
                graphic.height = physicsObj.obstacleData.height;
            }
        } else {
            graphic.destroy();
            this.graphicsMap.delete(physicsObj);
        }
    });
    
    // Move obstacles
    obstacles.children.iterate(function (child) {
        if (child) {
            child.x -= gameSpeed;
            
            // Remove obstacles that are off-screen
            if (child.x < -50) {
                child.destroy();
            }
        }
    });
    
    // Update debug information
    debugText.setText(
        `Player y: ${Math.floor(player.y)}\n` +
        `On ground: ${player.body.touching.down}\n` +
        `Coyote time: ${this.time.now - lastOnGroundTime < COYOTE_TIME}\n` +
        `Velocity Y: ${Math.floor(player.body.velocity.y)}\n` +
        `Game Speed: ${gameSpeed}\n` +
        `Difficulty: ${difficultyLevel}\n` +
        `Obstacles: ${obstacles.countActive()}`
    );

    // In the update function, add this code to track ground contact time
    if (player.body.touching.down) {
        lastOnGroundTime = this.time.now;
    }

    // Process jump requests - simplified version
    if (window.jumpRequested) {
        console.log("Jump requested detected in update");
        player.setVelocityY(-350);
        
        // Reset jump request immediately
        window.jumpRequested = false;
    }
}

// Spawn obstacle with varying size and position based on difficulty
function spawnObstacle() {
    if (gameOver) return;
    
    // Determine what type of obstacle pattern to spawn based on difficulty
    const patternType = Phaser.Math.Between(1, 5);
    
    if (patternType <= 2 || difficultyLevel <= 1) {
        // Standard ground obstacle
        spawnGroundObstacle(this);
    } else if (patternType === 3) {
        // Tall obstacle that requires precise timing
        spawnTallObstacle(this);
    } else if (patternType === 4) {
        // Flying obstacles at different heights
        spawnFlyingObstacles(this);
    } else {
        // Gap pattern - obstacles with a gap to jump through
        spawnGapPattern(this);
    }
}

// Spawn a standard ground obstacle
function spawnGroundObstacle(scene) {
    const width = Phaser.Math.Between(20 + (difficultyLevel * 3), 30 + (difficultyLevel * 4));
    const height = Phaser.Math.Between(30 + (difficultyLevel * 3), 40 + (difficultyLevel * 4));
    
    const obstacle = obstacles.create(850, 560, '');
    obstacle.body.setSize(width, height);
    obstacle.body.allowGravity = false;
    obstacle.setImmovable(true);
    obstacle.setVisible(false);
    
    obstacle.obstacleData = { width, height };
    
    const color = Phaser.Display.Color.GetColor(0, 0, Math.min(255, 50 + (difficultyLevel * 20)));
    const obstacleGraphics = scene.add.rectangle(850, 560, width, height, color);
    
    scene.graphicsMap.set(obstacle, obstacleGraphics);
}

// Spawn a tall obstacle that requires precise timing
function spawnTallObstacle(scene) {
    const width = 30 + (difficultyLevel * 2);
    const height = 200 + (difficultyLevel * 10); // Much taller obstacle
    
    const obstacle = obstacles.create(850, 560 - (height/2), '');
    obstacle.body.setSize(width, height);
    obstacle.body.allowGravity = false;
    obstacle.setImmovable(true);
    obstacle.setVisible(false);
    
    obstacle.obstacleData = { width, height };
    
    const color = Phaser.Display.Color.GetColor(0, Math.min(255, 50 + (difficultyLevel * 20)), 0);
    const obstacleGraphics = scene.add.rectangle(850, 560 - (height/2), width, height, color);
    
    scene.graphicsMap.set(obstacle, obstacleGraphics);
}

// Spawn flying obstacles at different heights
function spawnFlyingObstacles(scene) {
    // Create 2-4 flying obstacles at different heights
    const numObstacles = Phaser.Math.Between(2, Math.min(4, difficultyLevel));
    
    // Divide the screen height into sections
    const screenHeight = 500; // Usable screen height
    const sectionHeight = screenHeight / numObstacles;
    
    for (let i = 0; i < numObstacles; i++) {
        // Skip a random section to create a gap to jump through
        if (Phaser.Math.Between(1, 10) <= 3 && i > 0 && i < numObstacles - 1) {
            continue;
        }
        
        const sectionTop = 100 + (i * sectionHeight);
        const sectionBottom = sectionTop + sectionHeight;
        
        const y = Phaser.Math.Between(sectionTop, sectionBottom);
        const width = Phaser.Math.Between(20, 30 + (difficultyLevel * 2));
        const height = Phaser.Math.Between(20, 30 + (difficultyLevel * 2));
        
        const obstacle = obstacles.create(850 + Phaser.Math.Between(0, 100), y, '');
        obstacle.body.setSize(width, height);
        obstacle.body.allowGravity = false;
        obstacle.setImmovable(true);
        obstacle.setVisible(false);
        
        obstacle.obstacleData = { width, height };
        
        const blue = Math.min(255, 50 + (difficultyLevel * 20));
        const color = Phaser.Display.Color.GetColor(0, blue, blue);
        const obstacleGraphics = scene.add.rectangle(obstacle.x, obstacle.y, width, height, color);
        
        scene.graphicsMap.set(obstacle, obstacleGraphics);
    }
}

// Spawn a pattern with a gap to jump through
function spawnGapPattern(scene) {
    // Create a wall of obstacles with a gap
    const wallHeight = 500;
    const gapSize = Math.max(60, 100 - (difficultyLevel * 5)); // Gap gets smaller with difficulty
    const gapPosition = Phaser.Math.Between(150, 450); // Random position for the gap
    
    // Create top part of wall
    if (gapPosition > 150) {
        const topHeight = gapPosition - 100;
        const topObstacle = obstacles.create(850, topHeight/2, '');
        topObstacle.body.setSize(40, topHeight);
        topObstacle.body.allowGravity = false;
        topObstacle.setImmovable(true);
        topObstacle.setVisible(false);
        
        topObstacle.obstacleData = { width: 40, height: topHeight };
        
        const color = Phaser.Display.Color.GetColor(Math.min(255, 50 + (difficultyLevel * 20)), 0, Math.min(255, 50 + (difficultyLevel * 20)));
        const topGraphics = scene.add.rectangle(850, topHeight/2, 40, topHeight, color);
        
        scene.graphicsMap.set(topObstacle, topGraphics);
    }
    
    // Create bottom part of wall
    const bottomTop = gapPosition + gapSize;
    if (bottomTop < 550) {
        const bottomHeight = 560 - bottomTop;
        const bottomObstacle = obstacles.create(850, bottomTop + (bottomHeight/2), '');
        bottomObstacle.body.setSize(40, bottomHeight);
        bottomObstacle.body.allowGravity = false;
        bottomObstacle.setImmovable(true);
        bottomObstacle.setVisible(false);
        
        bottomObstacle.obstacleData = { width: 40, height: bottomHeight };
        
        const color = Phaser.Display.Color.GetColor(Math.min(255, 50 + (difficultyLevel * 20)), 0, Math.min(255, 50 + (difficultyLevel * 20)));
        const bottomGraphics = scene.add.rectangle(850, bottomTop + (bottomHeight/2), 40, bottomHeight, color);
        
        scene.graphicsMap.set(bottomObstacle, bottomGraphics);
    }
}

// Game over function
function gameOverFunction(player, obstacle) {
    this.physics.pause();
    gameOver = true;
    
    // Display game over text
    this.add.text(400, 300, 'GAME OVER', { 
        fontSize: '64px', 
        fill: '#fff',
        align: 'center'
    }).setOrigin(0.5);
    
    this.add.text(400, 350, 'Click to Restart', { 
        fontSize: '32px', 
        fill: '#fff',
        align: 'center'
    }).setOrigin(0.5);
    
    // Show final score
    this.add.text(400, 400, `Final Score: ${Math.floor(score)}`, { 
        fontSize: '32px', 
        fill: '#fff',
        align: 'center'
    }).setOrigin(0.5);
    
    // Add restart functionality
    this.input.on('pointerdown', function () {
        this.scene.restart();
        score = 0;
        gameSpeed = 5;
        difficultyLevel = 1;
        gameOver = false;
    }, this);
}

console.log("Phaser Endless Runner initialized!");
