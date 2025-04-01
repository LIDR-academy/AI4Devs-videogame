/**
 * Scoring system for Tetris
 */
window.ScoringSystem = class ScoringSystem {
    /**
     * Create a new scoring system
     * @param {number} startingLevel - Initial level (default: 1)
     */
    constructor(startingLevel = window.TETRIS.INITIAL_LEVEL) {
        this.reset(startingLevel);
    }
    
    /**
     * Reset the scoring system
     * @param {number} startingLevel - Initial level
     */
    reset(startingLevel = window.TETRIS.INITIAL_LEVEL) {
        this.score = 0;
        this.level = startingLevel;
        this.lines = 0;
        this.lastLevelLines = 0;
    }
    
    /**
     * Add points for soft dropping
     * @param {number} cells - Number of cells dropped
     */
    addSoftDropPoints(cells) {
        this.score += cells * window.TETRIS.SCORE_VALUES.SOFT_DROP;
        return this.score;
    }
    
    /**
     * Add points for hard dropping
     * @param {number} cells - Number of cells dropped
     */
    addHardDropPoints(cells) {
        this.score += cells * window.TETRIS.SCORE_VALUES.HARD_DROP;
        return this.score;
    }
    
    /**
     * Add points for clearing lines
     * @param {number} lineCount - Number of lines cleared
     * @returns {Object} Object with score, level, and levelUp flag
     */
    addLineClearPoints(lineCount) {
        if (lineCount <= 0) return { score: this.score, level: this.level, levelUp: false };
        
        // Calculate points based on number of lines cleared
        let points = 0;
        switch (lineCount) {
            case 1:
                points = window.TETRIS.SCORE_VALUES.SINGLE_LINE;
                break;
            case 2:
                points = window.TETRIS.SCORE_VALUES.DOUBLE_LINE;
                break;
            case 3:
                points = window.TETRIS.SCORE_VALUES.TRIPLE_LINE;
                break;
            case 4:
                points = window.TETRIS.SCORE_VALUES.TETRIS;
                break;
            default:
                points = window.TETRIS.SCORE_VALUES.SINGLE_LINE * lineCount;
        }
        
        // Level multiplier
        points *= this.level;
        
        // Add points to score
        this.score += points;
        
        // Add lines cleared
        this.lines += lineCount;
        
        // Check for level up
        const previousLevel = this.level;
        this.updateLevel();
        const levelUp = this.level > previousLevel;
        
        return {
            score: this.score,
            level: this.level,
            levelUp
        };
    }
    
    /**
     * Update the current level based on lines cleared
     */
    updateLevel() {
        // Calculate level based on lines cleared
        const newLevel = 1 + Math.floor(this.lines / window.TETRIS.LINES_PER_LEVEL);
        
        // Only allow level to increase, not decrease
        if (newLevel > this.level) {
            this.level = newLevel;
            this.lastLevelLines = Math.floor(this.lines / window.TETRIS.LINES_PER_LEVEL) * window.TETRIS.LINES_PER_LEVEL;
        }
    }
    
    /**
     * Get the progress to the next level (0-1)
     * @returns {number} Progress as a value between 0 and 1
     */
    getLevelProgress() {
        const linesInCurrentLevel = this.lines - this.lastLevelLines;
        return linesInCurrentLevel / window.TETRIS.LINES_PER_LEVEL;
    }
    
    /**
     * Get the current drop interval based on level
     * @returns {number} Drop interval in milliseconds
     */
    getDropInterval() {
        return window.TETRIS.getDropInterval(this.level);
    }
    
    /**
     * Get the current stats
     * @returns {Object} Object with score, level, and lines
     */
    getStats() {
        return {
            score: this.score,
            level: this.level,
            lines: this.lines
        };
    }
} 