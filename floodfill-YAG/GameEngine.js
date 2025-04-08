class GameEngine {
    constructor(gridSize, colorCount) {
        this.gridSize = gridSize;
        this.colorCount = colorCount;
        this.board = [];
        this.currentColor = null;
        this.moves = 0;
        this.gameOver = false;
        this.floodedTiles = new Set();
        
        // Event callbacks
        this.onBoardUpdate = null;
        this.onMoveMade = null;
        this.onGameWon = null;
        this.onFloodFill = null;
    }
    
    // Initialize a new game
    newGame() {
        this.moves = 0;
        this.gameOver = false;
        this.floodedTiles.clear();
        this.board = this.generateRandomBoard();
        this.currentColor = this.board[0][0];
        
        // Set initial flooded area
        this.floodedTiles.add('0,0');
        this.floodFill(0, 0, this.currentColor);
        
        // Notify listeners
        if (this.onBoardUpdate) {
            this.onBoardUpdate(this.board, this.floodedTiles);
        }
        
        if (this.onMoveMade) {
            this.onMoveMade(this.moves, this.currentColor);
        }
        
        // Check if won by chance (all tiles are the same color)
        this.checkWinCondition();
    }
    
    // Generate a random board
    generateRandomBoard() {
        const board = [];
        
        for (let row = 0; row < this.gridSize; row++) {
            const rowArray = [];
            for (let col = 0; col < this.gridSize; col++) {
                rowArray.push(Math.floor(Math.random() * this.colorCount) + 1);
            }
            board.push(rowArray);
        }
        
        return board;
    }
    
    // Make a move with a new color
    makeMove(newColor) {
        // Don't count as a move if clicking the current color
        if (newColor === this.currentColor || this.gameOver) return false;
        
        // Increment moves
        this.moves++;
        
        // Update current color
        this.currentColor = newColor;
        
        // Clear flooded tiles
        this.floodedTiles.clear();
        
        // Start new flood from origin
        this.floodFill(0, 0, newColor);
        
        // Notify listeners
        if (this.onMoveMade) {
            this.onMoveMade(this.moves, this.currentColor);
        }
        
        // Check if won
        this.checkWinCondition();
        
        return true;
    }
    
    // Flood fill algorithm
    floodFill(row, col, newColor) {
        const oldColor = this.board[row][col];
        
        // Don't do anything if the colors are the same
        if (oldColor === newColor) {
            this.floodedTiles.add(`${row},${col}`);
            return new Set(); // No new floods
        }
        
        // Queue for BFS
        const queue = [[row, col]];
        const visited = new Set();
        const newlyFlooded = new Set();
        visited.add(`${row},${col}`);
        
        // Process queue
        while (queue.length > 0) {
            const [currentRow, currentCol] = queue.shift();
            
            // Change color
            this.board[currentRow][currentCol] = newColor;
            this.floodedTiles.add(`${currentRow},${currentCol}`);
            newlyFlooded.add(`${currentRow},${currentCol}`);
            
            // Check neighbors (up, down, left, right)
            const neighbors = [
                [currentRow - 1, currentCol], // up
                [currentRow + 1, currentCol], // down
                [currentRow, currentCol - 1], // left
                [currentRow, currentCol + 1]  // right
            ];
            
            for (const [nr, nc] of neighbors) {
                if (nr >= 0 && nr < this.gridSize && 
                    nc >= 0 && nc < this.gridSize && 
                    this.board[nr][nc] === oldColor && 
                    !visited.has(`${nr},${nc}`)) {
                    
                    queue.push([nr, nc]);
                    visited.add(`${nr},${nc}`);
                }
            }
        }
        
        // Notify about the flood
        if (this.onFloodFill && newlyFlooded.size > 0) {
            this.onFloodFill(newlyFlooded);
        }
        
        if (this.onBoardUpdate) {
            this.onBoardUpdate(this.board, this.floodedTiles);
        }
        
        return newlyFlooded;
    }
    
    // Check if the game is won
    checkWinCondition() {
        // Win if all tiles are the same color
        const firstColor = this.board[0][0];
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.board[row][col] !== firstColor) {
                    return false;
                }
            }
        }
        
        // Game is won
        this.gameOver = true;
        
        // Notify win
        if (this.onGameWon) {
            this.onGameWon(this.moves);
        }
        
        return true;
    }
    
    // Get a copy of the board
    getBoard() {
        return this.board.map(row => [...row]);
    }
    
    // Get flooded tiles
    getFloodedTiles() {
        return new Set(this.floodedTiles);
    }
    
    // Get current color
    getCurrentColor() {
        return this.currentColor;
    }
    
    // Get move count
    getMoves() {
        return this.moves;
    }
    
    // Is game over
    isGameOver() {
        return this.gameOver;
    }
} 