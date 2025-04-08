/**
 * Game board for Tetris
 */

window.Board = class Board {
    /**
     * Create a new game board
     */
    constructor() {
        this.width = window.TETRIS.BOARD_WIDTH;
        this.height = window.TETRIS.BOARD_HEIGHT;
        this.grid = this.createEmptyGrid();
    }
    
    /**
     * Create an empty grid
     * @returns {number[][]} Empty grid array
     */
    createEmptyGrid() {
        return Array(this.height).fill(null)
            .map(() => Array(this.width).fill(0));
    }
    
    /**
     * Reset the board
     */
    reset() {
        this.grid = this.createEmptyGrid();
    }
    
    /**
     * Check if a position is valid on the board
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if position is valid
     */
    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    
    /**
     * Check if a cell is empty
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if cell is empty
     */
    isCellEmpty(x, y) {
        if (!this.isValidPosition(x, y)) return false;
        return this.grid[y][x] === 0;
    }
    
    /**
     * Lock a piece in place on the board
     * @param {Tetromino} piece - The piece to lock
     * @returns {number[]} Array of cleared line indices
     */
    lockPiece(piece) {
        const matrix = piece.getMatrix();
        const pieceId = piece.id;
        let reachedTop = false;
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    // Check if any part of the piece is near the top of the board
                    if (boardY <= 1) {
                        reachedTop = true;
                    }
                    
                    if (this.isValidPosition(boardX, boardY)) {
                        this.grid[boardY][boardX] = pieceId;
                    }
                }
            }
        }
        
        // Check for completed lines and return them
        const clearedLines = this.clearLines();
        
        // If the piece reached the top and no lines were cleared, it might be game over
        if (reachedTop && clearedLines.length === 0) {
            // Check top two rows for blocks
            for (let y = 0; y < 2; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.grid[y][x] !== 0) {
                        // Return a special marker for game over
                        return { clearedLines: [], gameOver: true };
                    }
                }
            }
        }
        
        return clearedLines;
    }
    
    /**
     * Check for and clear completed lines
     * @returns {number[]} Array of cleared line indices
     */
    clearLines() {
        const linesToClear = [];
        
        // Find completed lines
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.isLineComplete(y)) {
                linesToClear.push(y);
            }
        }
        
        // Clear lines from bottom to top
        linesToClear.sort((a, b) => b - a).forEach(y => {
            this.grid.splice(y, 1);
            this.grid.unshift(Array(this.width).fill(0));
        });
        
        return linesToClear;
    }
    
    /**
     * Check if a line is complete
     * @param {number} y - Y coordinate of line
     * @returns {boolean} True if line is complete
     */
    isLineComplete(y) {
        return this.grid[y].every(cell => cell !== 0);
    }
    
    /**
     * Get the current state of the board
     * @returns {number[][]} Current grid state
     */
    getGrid() {
        return this.grid;
    }
    
    /**
     * Move a piece down one position
     * @param {Tetromino} piece - The piece to move
     * @returns {boolean} True if the move was successful
     */
    moveDown(piece) {
        if (!CollisionSystem.checkCollision(this.grid, piece, 0, 1)) {
            piece.y += 1;
            return true;
        }
        return false;
    }
    
    /**
     * Move a piece left one position
     * @param {Tetromino} piece - The piece to move
     * @returns {boolean} True if the move was successful
     */
    moveLeft(piece) {
        if (!CollisionSystem.checkCollision(this.grid, piece, -1, 0)) {
            piece.x -= 1;
            return true;
        }
        return false;
    }
    
    /**
     * Move a piece right one position
     * @param {Tetromino} piece - The piece to move
     * @returns {boolean} True if the move was successful
     */
    moveRight(piece) {
        if (!CollisionSystem.checkCollision(this.grid, piece, 1, 0)) {
            piece.x += 1;
            return true;
        }
        return false;
    }
    
    /**
     * Rotate a piece
     * @param {Tetromino} piece - The piece to rotate
     * @returns {boolean} True if the rotation was successful
     */
    rotatePiece(piece) {
        const result = CollisionSystem.checkRotation(this.grid, piece, 1);
        if (result) {
            piece.rotate(1, result.matrix);
            piece.x += result.x;
            piece.y += result.y;
            return true;
        }
        return false;
    }
    
    /**
     * Hard drop a piece to the bottom
     * @param {Tetromino} piece - The piece to drop
     * @returns {number} The distance the piece was dropped
     */
    hardDrop(piece) {
        const dropDistance = CollisionSystem.findDropPosition(this.grid, piece);
        piece.y += dropDistance;
        return dropDistance;
    }
    
    /**
     * Get the ghost position for a piece (where it would land)
     * @param {Tetromino} piece - The piece to check
     * @returns {number} The Y position of the ghost
     */
    getGhostPosition(piece) {
        return piece.y + CollisionSystem.findDropPosition(this.grid, piece);
    }
}; 