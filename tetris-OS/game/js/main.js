/**
 * Main entry point for Tetris game
 */

// Add global error handler
window.addEventListener('error', (event) => {
    // Error handling without logging
});

// Wait for all scripts to load
window.addEventListener('load', () => {
    // Check if start button exists
    const startButton = document.getElementById('start-button');
    
    // Function to check for overlapping elements
    function checkOverlappingElements() {
        if (startButton) {
            const rect = startButton.getBoundingClientRect();
            document.elementsFromPoint(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        }
    }
    
    // Function to check button state
    function checkButtonState() {
        if (startButton) {
            const style = window.getComputedStyle(startButton);
            
            // Check for overlapping elements
            checkOverlappingElements();
        }
    }
    
    // Check button state immediately and after a short delay
    checkButtonState();
    setTimeout(checkButtonState, 1000);
    
    // Function to handle window resize
    function handleResize() {
        const gameContainer = document.querySelector('.game-container');
        const gameCanvas = document.getElementById('game-canvas');
        const nextPieceCanvas = document.getElementById('next-piece-canvas');
        
        if (gameContainer && gameCanvas && nextPieceCanvas) {
            // Calculate scale based on container size
            const containerWidth = gameContainer.clientWidth;
            const containerHeight = gameContainer.clientHeight;
            const scale = Math.min(
                containerWidth / window.TETRIS.BOARD_WIDTH / window.TETRIS.CELL_SIZE,
                containerHeight / window.TETRIS.BOARD_HEIGHT / window.TETRIS.CELL_SIZE
            );
            
            // Apply scale to canvases
            gameCanvas.style.transform = `scale(${scale})`;
            nextPieceCanvas.style.transform = `scale(${scale})`;
        }
    }
    
    // Initialize game with retry mechanism
    function initializeGame(retryCount = 0) {
        try {
            // Check if all required classes are loaded
            if (!areRequiredClassesLoaded()) {
                throw new Error('Required game classes not loaded');
            }
            
            // Initialize the game
            window.gameInstance = new window.Game();
            
            // Handle window resize for responsiveness
            window.addEventListener('resize', handleResize);
            handleResize();
            
            // Update high scores display
            const storage = new window.StorageSystem();
            storage.updateHighScoreDisplay();
            
            return true;
        } catch (error) {
            // Retry initialization if classes might not be loaded yet
            if (retryCount < 5) { // Maximum 5 retry attempts
                const delay = 1000; // 1 second delay between attempts
                setTimeout(() => initializeGame(retryCount + 1), delay);
            }
            return false;
        }
    }
    
    // Helper function to get list of missing classes
    function getMissingClasses() {
        const requiredClasses = [
            'Game',
            'Board',
            'Renderer',
            'TetrominoFactory',
            'ScoringSystem',
            'InputHandler',
            'AnimationSystem',
            'AudioSystem',
            'StorageSystem'
        ];
        
        return requiredClasses.filter(className => 
            typeof window[className] === 'undefined'
        );
    }
    
    // Function to check if all required classes are loaded
    function areRequiredClassesLoaded() {
        const requiredClasses = [
            'Game',
            'Board',
            'Renderer',
            'TetrominoFactory',
            'ScoringSystem',
            'InputHandler',
            'AnimationSystem',
            'AudioSystem',
            'StorageSystem'
        ];
        
        return requiredClasses.every(className => {
            return typeof window[className] !== 'undefined';
        });
    }
    
    // Start game initialization
    initializeGame();
});

/**
 * Create an audio context to enable audio on mobile devices
 */
function createAudioContext() {
    // Create an AudioContext instance
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const audioCtx = new AudioContext();
        
        // Add event listener to unmute audio on first user interaction
        document.addEventListener('click', function enableAudio() {
            // Resume the audio context
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            // Remove the click listener after enabling audio
            document.removeEventListener('click', enableAudio);
        }, { once: true });
    }
}

/**
 * Handle window resize to adjust for responsive layout
 */
function handleResize() {
    // Check if we need to show mobile controls
    const isMobile = window.innerWidth <= 768;
    const mobileControls = document.getElementById('mobile-controls');
    
    if (isMobile) {
        mobileControls.classList.remove('hidden');
    } else {
        mobileControls.classList.add('hidden');
    }
} 