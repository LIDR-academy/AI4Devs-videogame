/**
 * Animation system for Tetris
 */

window.AnimationSystem = class AnimationSystem {
    /**
     * Create a new animation system
     * @param {Game} game - The game instance
     * @param {Renderer} renderer - The renderer instance
     */
    constructor(game, renderer) {
        this.game = game;
        this.renderer = renderer;
        this.animations = new Map();
        this.currentTime = 0;
    }
    
    /**
     * Start a line clear animation
     * @param {number[]} lines - Array of line indices to clear
     * @param {Function} onComplete - Callback to run when animation completes
     */
    startLineClearAnimation(lines, onComplete) {
        const animation = {
            type: 'lineClear',
            lines: lines,
            startTime: this.currentTime,
            duration: window.TETRIS.ANIMATION_DURATIONS.LINE_CLEAR,
            onComplete: onComplete
        };
        
        this.animations.set('lineClear', animation);
    }
    
    /**
     * Alias for startLineClearAnimation (for game.js compatibility)
     * @param {number[]} lines - Array of line indices to clear
     */
    addLineClearAnimation(lines) {
        this.startLineClearAnimation(lines);
    }
    
    /**
     * Start a level up animation
     * @param {number} level - The new level
     * @param {Function} onComplete - Callback to run when animation completes
     */
    startLevelUpAnimation(level, onComplete) {
        const animation = {
            type: 'levelUp',
            level: level,
            startTime: this.currentTime,
            duration: window.TETRIS.ANIMATION_DURATIONS.LEVEL_UP,
            onComplete: onComplete
        };
        
        this.animations.set('levelUp', animation);
    }
    
    /**
     * Alias for startLevelUpAnimation (for game.js compatibility)
     * @param {number} level - The new level
     */
    addLevelUpAnimation(level) {
        this.startLevelUpAnimation(level);
    }
    
    /**
     * Start a game over animation
     * @param {Function} onComplete - Callback to run when animation completes
     */
    startGameOverAnimation(onComplete) {
        const animation = {
            type: 'gameOver',
            startTime: this.currentTime,
            duration: window.TETRIS.ANIMATION_DURATIONS.GAME_OVER,
            onComplete: onComplete
        };
        
        this.animations.set('gameOver', animation);
    }
    
    /**
     * Alias for startGameOverAnimation (for game.js compatibility)
     */
    addGameOverAnimation() {
        this.startGameOverAnimation();
    }
    
    /**
     * Update animations
     * @param {number} currentTime - Current game time
     */
    update(currentTime) {
        this.currentTime = currentTime;
        
        for (const [key, animation] of this.animations.entries()) {
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            switch (animation.type) {
                case 'lineClear':
                    this.renderer.renderLineClearAnimation(animation.lines, progress);
                    break;
                case 'levelUp':
                    this.renderer.renderLevelUpAnimation(animation.level, progress);
                    break;
                case 'gameOver':
                    // Game over animation handled by CSS transitions
                    break;
            }
            
            if (progress >= 1) {
                if (animation.onComplete) {
                    animation.onComplete();
                }
                this.animations.delete(key);
            }
        }
        
        // Return whether animations are active
        return this.isAnimating();
    }
    
    /**
     * Check if any animations are currently playing
     * @returns {boolean} True if animations are playing
     */
    isAnimating() {
        return this.animations.size > 0;
    }
    
    /**
     * Reset animation system state
     */
    reset() {
        this.animations.clear();
        this.currentTime = 0;
    }
    
    /**
     * Stop all animations
     */
    stopAll() {
        this.animations.clear();
    }
}; 