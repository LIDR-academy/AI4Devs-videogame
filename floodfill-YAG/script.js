// Main entry point for the game
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize settings manager first
    const settingsManager = new SettingsManager();
    const settings = settingsManager.getSettings();
    
    // Initialize game engine
    const gameEngine = new GameEngine(settings.gridSize, settings.colorCount);
    
    // Initialize UI controller
    const uiController = new UIController(gameEngine);
    
    // Initialize flood animator
    const floodAnimator = new FloodAnimator(gameEngine);
    
    // Initialize game timer
    const gameTimer = new GameTimer();
    
    // Initialize audio controller
    const audioController = new AudioController(settings.sound, settings.music);
    
    // Initialize score manager
    const scoreManager = new ScoreManager();
    
    // Initialize accessibility service
    const accessibilityService = new AccessibilityService();
    
    // Wire up game events
    
    // When game is won
    gameEngine.onGameWon = (moves) => {
        // Stop the timer
        gameTimer.stop();
        
        // Play win sound
        audioController.playSound('win');
        
        // Show win modal
        scoreManager.showWinModal(moves, gameTimer.getTime(), settings.gridSize);
        
        // Announce win to screen readers
        document.dispatchEvent(new CustomEvent('gameWon', {
            detail: {
                moves: moves,
                time: gameTimer.getTime()
            }
        }));
    };
    
    // When a move is made
    gameEngine.onMoveMade = (moves, newColor) => {
        // Play move sound
        audioController.playSound('move');
        
        // Update move counter display
        document.getElementById('move-count').textContent = moves;
        
        // Announce move to screen readers
        document.dispatchEvent(new CustomEvent('gameMove', {
            detail: {
                moves: moves,
                color: newColor
            }
        }));
    };
    
    // Add integration between components
    
    // New game button should reset timer
    document.getElementById('new-game-btn').addEventListener('click', () => {
        gameTimer.reset();
        gameTimer.start();
        
        // Announce new game to screen readers
        document.dispatchEvent(new CustomEvent('gameStart'));
    });
    
    // Play again button should start new game
    document.getElementById('play-again').addEventListener('click', () => {
        gameEngine.newGame();
        gameTimer.reset();
        gameTimer.start();
        
        // Announce new game to screen readers
        document.dispatchEvent(new CustomEvent('gameStart'));
    });
    
    // Settings changed event
    document.addEventListener('settingsChanged', (e) => {
        const newSettings = e.detail;
        
        // Update game engine with new settings
        gameEngine.gridSize = newSettings.gridSize;
        gameEngine.colorCount = newSettings.colorCount;
        
        // Update audio controller
        audioController.handleSettingsChange(newSettings);
        
        // Start a new game
        gameEngine.newGame();
        gameTimer.reset();
        gameTimer.start();
    });
    
    // Start the game
    gameEngine.newGame();
    gameTimer.start();
    audioController.playMusic();
});
