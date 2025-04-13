class ScoreManager {
    constructor() {
        this.highScores = {};
        this.loadHighScores();
        
        // DOM Elements
        this.scoreGridSize = document.getElementById('score-grid-size');
        this.highScoresTable = document.getElementById('high-scores-body');
        this.scoresModal = document.getElementById('scores-modal');
        this.closeScoresBtn = document.getElementById('close-scores');
        this.scoresBtn = document.getElementById('scores-btn');
        
        // Win Modal Elements
        this.winModal = document.getElementById('win-modal');
        this.winMoves = document.getElementById('win-moves');
        this.winTime = document.getElementById('win-time');
        this.highScoreMessage = document.getElementById('high-score-message');
        this.playAgainBtn = document.getElementById('play-again');
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    // Set up event listeners
    setupEventListeners() {
        this.closeScoresBtn.addEventListener('click', () => {
            this.scoresModal.style.display = 'none';
        });
        
        this.scoresBtn.addEventListener('click', () => {
            this.showHighScores();
            this.scoresModal.style.display = 'flex';
        });
        
        this.scoreGridSize.addEventListener('change', () => {
            this.displayHighScores(this.scoreGridSize.value);
        });
        
        this.playAgainBtn.addEventListener('click', () => {
            this.winModal.style.display = 'none';
            // Reset game will be handled through event bubbling
        });
    }
    
    // Show high scores modal
    showHighScores() {
        this.populateGridSizeOptions();
        const gridSize = this.scoreGridSize.value || 10;
        this.displayHighScores(gridSize);
    }
    
    // Populate grid size selector
    populateGridSizeOptions() {
        // Clear previous options
        this.scoreGridSize.innerHTML = '';
        
        // Get all grid sizes that have scores
        const gridSizes = Object.keys(this.highScores);
        
        if (gridSizes.length === 0) {
            const option = document.createElement('option');
            option.value = 10;
            option.textContent = '10x10';
            this.scoreGridSize.appendChild(option);
            return;
        }
        
        // Add options for each grid size
        gridSizes.sort((a, b) => a - b).forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}x${size}`;
            this.scoreGridSize.appendChild(option);
        });
    }
    
    // Display high scores for a specific grid size
    displayHighScores(gridSize) {
        // Clear previous scores
        this.highScoresTable.innerHTML = '';
        
        // Get scores for this grid size
        const scores = this.highScores[gridSize] || [];
        
        if (scores.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No scores yet';
            row.appendChild(cell);
            this.highScoresTable.appendChild(row);
            return;
        }
        
        // Display scores
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            
            // Rank
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);
            
            // Moves
            const movesCell = document.createElement('td');
            movesCell.textContent = score.moves;
            row.appendChild(movesCell);
            
            // Time
            const timeCell = document.createElement('td');
            timeCell.textContent = score.time;
            row.appendChild(timeCell);
            
            // Date
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(score.date).toLocaleDateString();
            row.appendChild(dateCell);
            
            this.highScoresTable.appendChild(row);
        });
    }
    
    // Load high scores from localStorage
    loadHighScores() {
        const savedScores = localStorage.getItem('floodFillHighScores');
        if (savedScores) {
            this.highScores = JSON.parse(savedScores);
        }
    }
    
    // Save high scores to localStorage
    saveHighScores() {
        localStorage.setItem('floodFillHighScores', JSON.stringify(this.highScores));
    }
    
    // Check if a score is a high score and save it
    checkAndSaveScore(gridSize, moves, time) {
        // Initialize array for this grid size if it doesn't exist
        if (!this.highScores[gridSize]) {
            this.highScores[gridSize] = [];
        }
        
        // Create score object
        const score = {
            moves,
            time,
            date: Date.now()
        };
        
        // Get scores for this grid size
        const scores = this.highScores[gridSize];
        
        // Add the new score
        scores.push(score);
        
        // Sort by moves (ascending), then by time
        scores.sort((a, b) => {
            if (a.moves !== b.moves) {
                return a.moves - b.moves;
            }
            return a.time.localeCompare(b.time);
        });
        
        // Keep only top 10 scores
        if (scores.length > 10) {
            scores.length = 10;
        }
        
        // Save to localStorage
        this.saveHighScores();
        
        // Determine if this is a high score (in top 10)
        const scoreIndex = scores.findIndex(s => s === score);
        return scoreIndex >= 0 && scoreIndex < 10;
    }
    
    // Show win modal with score
    showWinModal(moves, time, gridSize) {
        this.winMoves.textContent = moves;
        this.winTime.textContent = time;
        
        // Check if high score
        const isHighScore = this.checkAndSaveScore(gridSize, moves, time);
        
        if (isHighScore) {
            this.highScoreMessage.textContent = 'New High Score!';
        } else {
            this.highScoreMessage.textContent = '';
        }
        
        this.winModal.style.display = 'flex';
    }
} 