/**
 * Input handling system for Tetris
 */

window.InputHandler = class InputHandler {
    /**
     * Create a new input handler
     * @param {HTMLElement} gameContainer - The game container element
     */
    constructor(gameContainer) {
        // Store key callbacks
        this.keyDownCallbacks = {};
        this.keyPressCallbacks = {};
        
        // Track key states
        this.keyState = {};
        this.lastKeyTime = {};
        this.keyRepeatCount = {};
        
        // Key repeat settings - faster for movement keys
        this.repeatDelay = 150;     // ms before first repeat (shorter for more responsive feel)
        this.repeatInterval = 50;   // ms between repeats
        
        // Faster repeat settings for arrow keys
        this.fastKeys = [
            window.TETRIS.KEY_BINDINGS.LEFT,
            window.TETRIS.KEY_BINDINGS.RIGHT,
            window.TETRIS.KEY_BINDINGS.DOWN
        ];
        this.fastRepeatDelay = 100;     // Shorter initial delay for arrow keys
        this.fastRepeatInterval = 30;   // Shorter interval for rapid movement
        
        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Set up event listeners
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        
        // Set up mobile controls if container provided
        if (gameContainer) {
            this.setupMobileControls(gameContainer);
        }
    }
    
    /**
     * Register a callback for when a key is held down (with repeat)
     * @param {string} key - The key to listen for
     * @param {Function} callback - The function to call
     */
    onKeyDown(key, callback) {
        this.keyDownCallbacks[key] = callback;
    }
    
    /**
     * Register a callback for when a key is pressed (once per press)
     * @param {string} key - The key to listen for
     * @param {Function} callback - The function to call
     */
    onKeyPress(key, callback) {
        this.keyPressCallbacks[key] = callback;
    }
    
    /**
     * Handle key down events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        const key = event.key;
        
        // Prevent default behavior for game controls
        if (Object.values(window.TETRIS.KEY_BINDINGS).includes(key)) {
            event.preventDefault();
        }
        
        // If key is newly pressed
        if (!this.keyState[key]) {
            this.keyState[key] = true;
            this.lastKeyTime[key] = performance.now();
            this.keyRepeatCount[key] = 0;
            
            // Trigger the key press callback (once per press)
            if (this.keyPressCallbacks[key]) {
                this.keyPressCallbacks[key]();
            }
            
            // Trigger the key down callback immediately
            if (this.keyDownCallbacks[key]) {
                this.keyDownCallbacks[key]();
            }
        }
    }
    
    /**
     * Handle key up events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyUp(event) {
        const key = event.key;
        this.keyState[key] = false;
        delete this.keyRepeatCount[key];
    }
    
    /**
     * Update input state, handle key repeats
     * @param {number} currentTime - Current time in ms
     */
    update(currentTime) {
        // Process key repeats for held down keys
        for (const [key, isPressed] of Object.entries(this.keyState)) {
            if (isPressed && this.keyDownCallbacks[key]) {
                const timeSinceLastTrigger = currentTime - this.lastKeyTime[key];
                
                // Determine if this is a fast-repeat key (arrow key)
                const isFastKey = this.fastKeys.includes(key);
                const repeatDelay = isFastKey ? this.fastRepeatDelay : this.repeatDelay;
                let repeatInterval = isFastKey ? this.fastRepeatInterval : this.repeatInterval;
                
                // For arrow key movement, get faster with longer press
                if (isFastKey && this.keyRepeatCount[key] > 10) {
                    // Make repeat interval even shorter after 10 repeats
                    repeatInterval = Math.max(repeatInterval / 2, 15);
                }
                
                // Initial delay before starting repeats
                if (timeSinceLastTrigger > repeatDelay) {
                    // How many repeats should have happened since the delay elapsed
                    const repeatCount = Math.floor((timeSinceLastTrigger - repeatDelay) / repeatInterval);
                    
                    // If we've reached the time for another repeat
                    if (repeatCount > 0) {
                        // Update the last key time, accounting for any extra time
                        this.lastKeyTime[key] = currentTime - (timeSinceLastTrigger % repeatInterval);
                        
                        // Increment repeat count for this key (for accelerating speed)
                        this.keyRepeatCount[key] = (this.keyRepeatCount[key] || 0) + 1;
                        
                        // Trigger the callback
                        this.keyDownCallbacks[key]();
                    }
                }
            }
        }
    }
    
    /**
     * Set up mobile touch controls
     * @param {HTMLElement} gameContainer - The game container element
     */
    setupMobileControls(gameContainer) {
        const mobileControls = document.getElementById('mobile-controls');
        if (!mobileControls) return;
        
        // Only show mobile controls on touch devices
        if ('ontouchstart' in window) {
            mobileControls.classList.remove('hidden');
            
            // Mobile control mappings (button ID -> keyboard key)
            const mobileButtonToKey = {
                'mobile-left': window.TETRIS.KEY_BINDINGS.LEFT,
                'mobile-right': window.TETRIS.KEY_BINDINGS.RIGHT,
                'mobile-down': window.TETRIS.KEY_BINDINGS.DOWN,
                'mobile-rotate': window.TETRIS.KEY_BINDINGS.ROTATE,
                'mobile-drop': window.TETRIS.KEY_BINDINGS.HARD_DROP,
                'mobile-pause': window.TETRIS.KEY_BINDINGS.PAUSE
            };
            
            // Add touch handlers for each mobile button
            for (const [buttonId, keyCode] of Object.entries(mobileButtonToKey)) {
                const button = document.getElementById(buttonId);
                if (!button) continue;
                
                // Touch start - similar to key down
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    
                    // Simulate key press
                    this.keyState[keyCode] = true;
                    this.lastKeyTime[keyCode] = performance.now();
                    this.keyRepeatCount[keyCode] = 0;
                    
                    // Call appropriate callbacks
                    if (this.keyPressCallbacks[keyCode]) {
                        this.keyPressCallbacks[keyCode]();
                    }
                    
                    if (this.keyDownCallbacks[keyCode]) {
                        this.keyDownCallbacks[keyCode]();
                    }
                });
                
                // Touch end - similar to key up
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.keyState[keyCode] = false;
                    delete this.keyRepeatCount[keyCode];
                });
                
                // Prevent touch move to avoid issues
                button.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                });
            }
        }
    }
    
    /**
     * Reset all input state
     */
    reset() {
        this.keyState = {};
        this.lastKeyTime = {};
        this.keyRepeatCount = {};
    }
    
    /**
     * Clean up event listeners
     */
    cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}; 