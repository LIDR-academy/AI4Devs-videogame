/**
 * Storage system for Tetris high scores
 */
window.StorageSystem = class StorageSystem {
    /**
     * Create a new storage system
     */
    constructor() {
        this.highScores = this.loadHighScores();
    }
    
    /**
     * Load high scores from local storage
     * @returns {Array} Array of high score objects
     */
    loadHighScores() {
        try {
            const scores = localStorage.getItem(window.TETRIS.STORAGE_KEYS.HIGH_SCORES);
            return scores ? JSON.parse(scores) : [];
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Save high scores to local storage
     */
    saveHighScores() {
        try {
            localStorage.setItem(
                window.TETRIS.STORAGE_KEYS.HIGH_SCORES,
                JSON.stringify(this.highScores)
            );
        } catch (error) {
            // Silent failure
        }
    }
    
    /**
     * Add a new high score
     * @param {string} name - Player name
     * @param {number} score - Player score
     * @param {number} level - Final level reached
     * @param {number} lines - Total lines cleared
     */
    addHighScore(name, score, level, lines) {
        // Create new score entry
        const newScore = {
            name: name.substring(0, 10), // Limit name length
            score: score,
            level: level,
            lines: lines,
            date: new Date().toISOString()
        };
        
        // Add to array and sort
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top scores
        this.highScores = this.highScores.slice(0, window.TETRIS.MAX_HIGH_SCORES);
        
        // Save to storage
        this.saveHighScores();
        
        // Update display
        this.updateHighScoreDisplay();
    }
    
    /**
     * Check if a score qualifies as a high score
     * @param {number} score - Score to check
     * @returns {boolean} True if score qualifies
     */
    isHighScore(score) {
        if (this.highScores.length < window.TETRIS.MAX_HIGH_SCORES) {
            return true;
        }
        return score > this.highScores[this.highScores.length - 1].score;
    }
    
    /**
     * Update the high scores display
     */
    updateHighScoreDisplay() {
        const container = document.getElementById('high-scores-list');
        if (!container) return;
        
        // Clear existing entries
        container.innerHTML = '';
        
        if (this.highScores.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'high-score-empty';
            emptyMessage.textContent = 'No high scores yet!';
            container.appendChild(emptyMessage);
            return;
        }
        
        // Create entries for each score
        this.highScores.forEach((score, index) => {
            const entry = document.createElement('div');
            entry.className = 'high-score-entry';
            
            const rank = document.createElement('div');
            rank.className = 'high-score-rank';
            rank.textContent = `${index + 1}.`;
            
            const name = document.createElement('div');
            name.className = 'high-score-name';
            name.textContent = score.name;
            
            const scoreValue = document.createElement('div');
            scoreValue.className = 'high-score-score';
            scoreValue.textContent = score.score.toLocaleString();
            
            const details = document.createElement('div');
            details.className = 'high-score-details';
            details.textContent = `Level ${score.level} - ${score.lines} lines`;
            
            const date = document.createElement('div');
            date.className = 'high-score-date';
            date.textContent = new Date(score.date).toLocaleDateString();
            
            entry.appendChild(rank);
            entry.appendChild(name);
            entry.appendChild(scoreValue);
            entry.appendChild(details);
            entry.appendChild(date);
            
            container.appendChild(entry);
        });
    }
    
    /**
     * Show the high scores modal
     */
    showHighScores() {
        const modal = document.getElementById('high-scores-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateHighScoreDisplay();
        }
    }
    
    /**
     * Hide the high scores modal
     */
    hideHighScores() {
        const modal = document.getElementById('high-scores-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
} 