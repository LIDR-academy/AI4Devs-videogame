/**
 * Main game logic for Tetris
 */
window.Game = class Game {
    /**
     * Create a new game
     */
    constructor() {
        // Get DOM elements
        this.gameCanvas = document.getElementById('game-canvas');
        this.nextPieceCanvas = document.getElementById('next-piece-canvas');
        this.gameContainer = document.querySelector('.game-container');
        
        // Create game systems
        this.renderer = new Renderer(this.gameCanvas, this.nextPieceCanvas);
        this.board = new Board();
        this.tetrominoFactory = new TetrominoFactory();
        this.scorer = new ScoringSystem();
        this.input = new InputHandler(this.gameContainer);
        this.animation = new AnimationSystem(this, this.renderer);
        this.audio = new AudioSystem();
        this.storage = new StorageSystem();
        
        // Game state
        this.currentState = window.TETRIS.GAME_STATES.TITLE_SCREEN;
        this.currentPiece = null;
        this.nextPiece = null;
        this.lastDropTime = 0;
        this.lockDelayTime = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this._optionsSource = 'title'; // Track where we came from: 'title' or 'pause'
        
        // Set up input handlers
        this.setupInputHandlers();
        
        // Set up UI event listeners
        this.setupUIEventListeners();
        
        // Start render loop
        this.lastRenderTime = 0;
        this.loop(0);
    }
    
    /**
     * Set up keyboard and touch input handlers
     */
    setupInputHandlers() {
        // Movement controls
        this.input.onKeyDown(window.TETRIS.KEY_BINDINGS.LEFT, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING && !this.isPaused) {
                this.moveLeft();
            }
        });
        
        this.input.onKeyDown(window.TETRIS.KEY_BINDINGS.RIGHT, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING && !this.isPaused) {
                this.moveRight();
            }
        });
        
        this.input.onKeyDown(window.TETRIS.KEY_BINDINGS.DOWN, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING && !this.isPaused) {
                this.softDrop();
            }
        });
        
        // Rotation
        this.input.onKeyPress(window.TETRIS.KEY_BINDINGS.ROTATE, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING && !this.isPaused) {
                this.rotatePiece();
            }
        });
        
        // Hard drop
        this.input.onKeyPress(window.TETRIS.KEY_BINDINGS.HARD_DROP, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING && !this.isPaused) {
                this.hardDrop();
            }
        });
        
        // Pause
        this.input.onKeyPress(window.TETRIS.KEY_BINDINGS.PAUSE, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING) {
                this.togglePause();
            }
        });
        
        // Restart
        this.input.onKeyPress(window.TETRIS.KEY_BINDINGS.RESTART, () => {
            if (this.currentState === window.TETRIS.GAME_STATES.PLAYING || this.currentState === window.TETRIS.GAME_STATES.GAME_OVER) {
                this.restart();
            }
        });
    }
    
    /**
     * Set up UI button event listeners
     */
    setupUIEventListeners() {
        // Title screen - Start button
        const startButton = document.getElementById('start-button');
        if (startButton) {
            // Remove any existing listeners
            const newStartButton = startButton.cloneNode(true);
            startButton.parentNode.replaceChild(newStartButton, startButton);
            
            // Add new click listener with bound context
            const boundStartGame = this.startGame.bind(this);
            newStartButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                boundStartGame();
            });
        }
        
        // Title screen - Options button
        const optionsButton = document.getElementById('options-button');
        if (optionsButton) {
            optionsButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showOptionsScreen();
            });
        }
        
        // Options screen - Save button
        const saveOptionsButton = document.getElementById('save-options-button');
        if (saveOptionsButton) {
            saveOptionsButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveOptions();
            });
        }
        
        // Options screen - Cancel button
        const cancelOptionsButton = document.getElementById('cancel-options-button');
        if (cancelOptionsButton) {
            cancelOptionsButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Hide options screen
                document.getElementById('options-screen').classList.add('hidden');
                
                // Return to the appropriate screen based on source
                if (this._optionsSource === 'pause') {
                    // Show pause screen
                    document.getElementById('pause-screen').classList.remove('hidden');
                } else {
                    this.showTitleScreen();
                }
            });
        }
        
        // Initialize options form with current settings
        this.updateOptionsForm();
        
        // Game screen
        document.getElementById('pause-button').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('quit-button').addEventListener('click', () => {
            this.showTitleScreen();
        });
        
        // Pause screen
        document.getElementById('resume-button').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restart-from-pause-button').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('quit-from-pause-button').addEventListener('click', () => {
            this.showTitleScreen();
        });
        
        // Add options button in pause screen
        document.getElementById('options-from-pause-button').addEventListener('click', () => {
            this.showOptionsFromPause();
        });
        
        // Game over screen
        document.getElementById('submit-score-button').addEventListener('click', () => {
            this.submitHighScore();
        });
        
        document.getElementById('play-again-button').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('quit-from-game-over-button').addEventListener('click', () => {
            this.showTitleScreen();
        });
        
        // High scores modal
        document.getElementById('close-high-scores-button').addEventListener('click', () => {
            document.getElementById('high-scores-modal').classList.add('hidden');
        });
    }
    
    /**
     * Start the game
     */
    startGame() {
        // Validate that we have all required properties
        if (!this.board || !this.scorer || !this.animation || !this.input) {
            return;
        }
        
        // Hide title screen, show game screen
        const titleScreen = document.getElementById('title-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (!titleScreen || !gameScreen) {
            return;
        }
        
        titleScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Set up game
        this.board.reset();
        this.scorer.reset();
        this.animation.reset();
        this.input.reset();
        
        // Create initial pieces
        this.nextPiece = this.tetrominoFactory.getNext();
        this.spawnPiece();
        
        // Update game state
        this.currentState = window.TETRIS.GAME_STATES.PLAYING;
        this.isPaused = false;
        this.isGameOver = false;
        
        // Update UI
        this.renderer.updateStats(this.scorer.getStats());
    }
    
    /**
     * Show the title screen
     */
    showTitleScreen() {
        // Hide all screens
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('options-screen').classList.add('hidden');
        
        // Show title screen
        document.getElementById('title-screen').classList.remove('hidden');
        
        // Update game state
        this.currentState = window.TETRIS.GAME_STATES.TITLE_SCREEN;
        this.isPaused = false;
        
        // Reset option source tracking
        this._optionsSource = 'title';
    }
    
    /**
     * Show the options screen
     */
    showOptionsScreen() {
        // Track where we came from
        this._optionsSource = 'title';
        
        // Hide title screen
        document.getElementById('title-screen').classList.add('hidden');
        
        // Show options screen
        document.getElementById('options-screen').classList.remove('hidden');
        
        // Update options form with current settings
        this.updateOptionsForm();
    }
    
    /**
     * Update the options form with current audio settings
     */
    updateOptionsForm() {
        const audioSettings = this.audio.getSettings();
        
        // Set theme selector
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = audioSettings.currentTheme;
        }
        
        // Set music toggle
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.checked = audioSettings.musicEnabled;
        }
    }
    
    /**
     * Show the options screen from pause menu
     */
    showOptionsFromPause() {
        // Track where we came from
        this._optionsSource = 'pause';
        
        // Hide pause screen
        document.getElementById('pause-screen').classList.add('hidden');
        
        // Show options screen
        document.getElementById('options-screen').classList.remove('hidden');
        
        // Update options form with current settings
        this.updateOptionsForm();
    }
    
    /**
     * Save options from the form
     */
    saveOptions() {
        // Get theme selection
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            this.audio.setTheme(themeSelector.value);
        }
        
        // Get music enabled setting
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            this.audio.setMusicEnabled(musicToggle.checked);
        }
        
        // Save settings
        this.audio.saveSettings();
        
        // Hide options screen
        document.getElementById('options-screen').classList.add('hidden');
        
        // Return to the appropriate screen based on source
        if (this._optionsSource === 'pause') {
            // Show pause screen
            document.getElementById('pause-screen').classList.remove('hidden');
            
            // Ensure game stays paused
            this.isPaused = true;
            this.currentState = window.TETRIS.GAME_STATES.PAUSED;
        } else {
            this.showTitleScreen();
        }
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            document.getElementById('pause-screen').classList.remove('hidden');
            this.currentState = window.TETRIS.GAME_STATES.PAUSED;
        } else {
            document.getElementById('pause-screen').classList.add('hidden');
            this.currentState = window.TETRIS.GAME_STATES.PLAYING;
        }
    }
    
    /**
     * Restart the game
     */
    restart() {
        // Hide all screens except game screen
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        // Reset game systems
        this.board.reset();
        this.scorer.reset();
        this.animation.reset();
        this.input.reset();
        
        // Create initial pieces
        this.nextPiece = this.tetrominoFactory.getNext();
        this.spawnPiece();
        
        // Update game state
        this.currentState = window.TETRIS.GAME_STATES.PLAYING;
        this.isPaused = false;
        this.isGameOver = false;
        
        // Update UI
        this.renderer.updateStats(this.scorer.getStats());
    }
    
    /**
     * Spawn a new piece
     */
    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.tetrominoFactory.getNext();
        this.renderer.drawNextPiece(this.nextPiece);
        this.lockDelayTime = 0;
        
        // Check for game over
        if (CollisionSystem.checkGameOver(this.board.grid, this.currentPiece)) {
            this.gameOver();
            return; // Stop further processing when game over
        }

        // Additional game over condition - check if pieces are stacked to the top row
        for (let x = 0; x < window.TETRIS.BOARD_WIDTH; x++) {
            if (this.board.grid[0][x] !== 0) {
                this.gameOver();
                return;
            }
        }
    }
    
    /**
     * Move the current piece left
     */
    moveLeft() {
        if (!this.currentPiece) return;
        
        if (this.board.moveLeft(this.currentPiece)) {
            this.lockDelayTime = 0;
        }
    }
    
    /**
     * Move the current piece right
     */
    moveRight() {
        if (!this.currentPiece) return;
        
        if (this.board.moveRight(this.currentPiece)) {
            this.lockDelayTime = 0;
        }
    }
    
    /**
     * Soft drop - move the current piece down faster
     */
    softDrop() {
        if (!this.currentPiece) return;
        
        if (this.board.moveDown(this.currentPiece)) {
            this.scorer.addSoftDropPoints(1);
            this.renderer.updateStats(this.scorer.getStats());
            this.lastDropTime = performance.now();
        }
    }
    
    /**
     * Hard drop - move the current piece to the bottom instantly
     */
    hardDrop() {
        if (!this.currentPiece) return;
        
        const dropDistance = this.board.hardDrop(this.currentPiece);
        this.scorer.addHardDropPoints(dropDistance);
        this.renderer.updateStats(this.scorer.getStats());
        
        // Lock piece immediately
        this.lockPiece();
    }
    
    /**
     * Rotate the current piece
     */
    rotatePiece() {
        if (!this.currentPiece) return;
        
        if (this.board.rotatePiece(this.currentPiece)) {
            this.lockDelayTime = 0;
        }
    }
    
    /**
     * Lock the current piece into the board
     */
    lockPiece() {
        const result = this.board.lockPiece(this.currentPiece);
        
        // Check if game over was detected
        if (typeof result === 'object' && result.gameOver === true) {
            this.gameOver();
            return;
        }
        
        // Get the completed lines
        const completedLines = Array.isArray(result) ? result : result.clearedLines || [];
        
        if (completedLines.length > 0) {
            // Add points for cleared lines
            const scoreResult = this.scorer.addLineClearPoints(completedLines.length);
            this.renderer.updateStats(this.scorer.getStats());
            
            // Add line clear animation
            this.animation.addLineClearAnimation(completedLines);
            
            // Add level up animation if needed
            if (scoreResult.levelUp) {
                this.animation.addLevelUpAnimation(scoreResult.level);
            }
        }
        
        // Spawn next piece
        this.spawnPiece();
    }
    
    /**
     * End the game
     */
    gameOver() {
        this.isGameOver = true;
        this.currentState = window.TETRIS.GAME_STATES.GAME_OVER;
        this.animation.addGameOverAnimation();
        
        // Update UI
        document.getElementById('final-score').textContent = this.scorer.score;
        
        // Show game over screen after animation
        setTimeout(() => {
            document.getElementById('game-over-screen').classList.remove('hidden');
        }, window.TETRIS.ANIMATION_DURATIONS.GAME_OVER);
    }
    
    /**
     * Submit high score
     */
    submitHighScore() {
        const name = document.getElementById('player-name').value.trim();
        const { score, level, lines } = this.scorer.getStats();
        
        // Add high score
        this.storage.addHighScore(name, score, level, lines);
        
        // Update high score display
        this.storage.updateHighScoreDisplay();
        
        // Show high scores modal
        document.getElementById('high-scores-modal').classList.remove('hidden');
    }
    
    /**
     * Update game state
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Skip updates if game is paused or over
        if (this.isPaused || this.isGameOver || this.currentState !== window.TETRIS.GAME_STATES.PLAYING) {
            return;
        }
        
        // Get current time once for this update cycle
        const currentTime = performance.now();
        
        // Process input with current time for accurate key repeats
        this.input.update(currentTime);
        
        // Update animations
        const animationsActive = this.animation.update(currentTime);
        
        // Skip piece updates if animations are playing
        if (animationsActive) {
            return;
        }
        
        // Check if it's time to drop the piece
        const dropInterval = this.scorer.getDropInterval();
        
        if (currentTime - this.lastDropTime > dropInterval) {
            if (this.currentPiece) {
                // Try to move down
                if (!this.board.moveDown(this.currentPiece)) {
                    // Piece can't move down, start lock delay
                    this.lockDelayTime += currentTime - this.lastDropTime;
                    
                    // Lock after 500ms delay
                    if (this.lockDelayTime >= 500) {
                        this.lockPiece();
                    }
                } else {
                    // Piece moved down, reset lock delay
                    this.lockDelayTime = 0;
                }
            }
            
            this.lastDropTime = currentTime;
        }
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear canvases
        this.renderer.clearGameCanvas();
        
        // Draw grid
        this.renderer.drawGrid();
        
        // Draw board
        this.renderer.drawBoard(this.board.grid);
        
        // Draw current piece and ghost if game is active
        if (this.currentPiece && this.currentState === window.TETRIS.GAME_STATES.PLAYING && !this.isPaused) {
            // Draw ghost piece (landing position)
            const ghostY = this.board.getGhostPosition(this.currentPiece);
            this.renderer.drawGhostPiece(this.currentPiece, ghostY);
            
            // Draw active piece
            this.renderer.drawPiece(this.currentPiece);
        }
    }
    
    /**
     * Main game loop
     * @param {number} timestamp - Current time
     */
    loop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastRenderTime;
        this.lastRenderTime = timestamp;
        
        // Update game state
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Schedule next frame
        requestAnimationFrame(this.loop.bind(this));
    }
} 