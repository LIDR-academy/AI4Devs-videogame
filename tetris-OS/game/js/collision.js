/**
 * Collision detection system for Tetris
 */

window.CollisionSystem = class CollisionSystem {
    /**
     * Check if a piece collides with the board at a given position
     * @param {number[][]} grid - The game board grid
     * @param {Tetromino} piece - The tetromino to check
     * @param {number} offsetX - X offset from current position
     * @param {number} offsetY - Y offset from current position
     * @param {number[][]} [matrix] - Optional alternative matrix for the piece
     * @returns {boolean} True if collision detected
     */
    static checkCollision(grid, piece, offsetX = 0, offsetY = 0, matrix = null) {
        const pieceMatrix = matrix || piece.getMatrix();
        
        for (let y = 0; y < pieceMatrix.length; y++) {
            for (let x = 0; x < pieceMatrix[y].length; x++) {
                if (pieceMatrix[y][x] !== 0) {
                    const boardX = piece.x + x + offsetX;
                    const boardY = piece.y + y + offsetY;
                    
                    // Check board boundaries
                    if (boardX < 0 || boardX >= window.TETRIS.BOARD_WIDTH || 
                        boardY >= window.TETRIS.BOARD_HEIGHT) {
                        return true;
                    }
                    
                    // Check if piece has hit the floor
                    if (boardY < 0) {
                        continue;
                    }
                    
                    // Check collision with other pieces
                    if (grid[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Find the drop position for a piece
     * @param {number[][]} grid - The game board grid
     * @param {Tetromino} piece - The tetromino to check
     * @returns {number} Number of cells the piece can drop
     */
    static findDropPosition(grid, piece) {
        let dropDistance = 0;
        
        while (!this.checkCollision(grid, piece, 0, dropDistance + 1)) {
            dropDistance++;
        }
        
        return dropDistance;
    }
    
    /**
     * Check if a rotation is possible and return the new position
     * @param {number[][]} grid - The game board grid
     * @param {Tetromino} piece - The tetromino to check
     * @param {number} direction - Rotation direction (1 for clockwise, -1 for counterclockwise)
     * @returns {Object|null} Object containing new matrix and offset, or null if rotation not possible
     */
    static checkRotation(grid, piece, direction) {
        // First, get the rotated matrix
        const rotatedMatrix = piece.getRotatedMatrix(direction);
        
        // For O tetromino, no rotation is needed
        if (piece.type === 'O') {
            return {
                matrix: rotatedMatrix,
                x: 0,
                y: 0
            };
        }
        
        try {
            // Get the appropriate kick data set
            const kickDataType = piece.type === 'I' ? 'I' : 'JLSTZ';
            const rotationState = piece.getRotationState(direction);
            
            // If no valid wall kick data, just try the basic rotation
            if (!window.TETRIS.WALL_KICK_DATA || 
                !window.TETRIS.WALL_KICK_DATA[kickDataType] || 
                !window.TETRIS.WALL_KICK_DATA[kickDataType][rotationState]) {
                // Just try the basic rotation without offset
                if (!this.checkCollision(grid, piece, 0, 0, rotatedMatrix)) {
                    return {
                        matrix: rotatedMatrix,
                        x: 0,
                        y: 0
                    };
                }
                return null;
            }
            
            // Try each wall kick position
            const wallKicks = window.TETRIS.WALL_KICK_DATA[kickDataType][rotationState];
            for (let i = 0; i < wallKicks.length; i++) {
                const [offsetX, offsetY] = wallKicks[i];
                if (!this.checkCollision(grid, piece, offsetX, offsetY, rotatedMatrix)) {
                    return {
                        matrix: rotatedMatrix,
                        x: offsetX,
                        y: offsetY
                    };
                }
            }
        } catch (error) {
            // If any error occurs, try basic rotation
            if (!this.checkCollision(grid, piece, 0, 0, rotatedMatrix)) {
                return {
                    matrix: rotatedMatrix,
                    x: 0,
                    y: 0
                };
            }
        }
        
        return null;
    }
    
    /**
     * Check if a T-spin has occurred
     * @param {number[][]} grid - The game board grid
     * @param {Tetromino} piece - The tetromino to check
     * @param {boolean} wasRotated - Whether the piece was just rotated
     * @returns {boolean} True if T-spin detected
     */
    static checkTSpin(grid, piece, wasRotated) {
        // Only check for T-spins with T pieces that were just rotated
        if (piece.type !== 'T' || !wasRotated) {
            return false;
        }
        
        // Check corners around T piece
        let cornersOccupied = 0;
        const corners = [
            [-1, -1], // Top-left
            [1, -1],  // Top-right
            [-1, 1],  // Bottom-left
            [1, 1]    // Bottom-right
        ];
        
        for (const [offsetX, offsetY] of corners) {
            const x = piece.x + offsetX;
            const y = piece.y + offsetY;
            
            if (x < 0 || x >= window.TETRIS.BOARD_WIDTH || 
                y < 0 || y >= window.TETRIS.BOARD_HEIGHT || 
                grid[y][x] !== 0) {
                cornersOccupied++;
            }
        }
        
        // T-spin requires at least 3 corners to be occupied
        return cornersOccupied >= 3;
    }
    
    /**
     * Check if a piece can be spawned at starting position (game over condition)
     * @param {number[][]} grid - The game board grid
     * @param {Tetromino} piece - The tetromino to check
     * @returns {boolean} True if game over condition detected
     */
    static checkGameOver(grid, piece) {
        // Check if piece collides with existing blocks at spawn position
        const pieceMatrix = piece.getMatrix();
        
        for (let y = 0; y < pieceMatrix.length; y++) {
            for (let x = 0; x < pieceMatrix[y].length; x++) {
                if (pieceMatrix[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    // Check if the piece is within board boundaries and collides with existing blocks
                    if (boardY >= 0 && boardY < window.TETRIS.BOARD_HEIGHT &&
                        boardX >= 0 && boardX < window.TETRIS.BOARD_WIDTH &&
                        grid[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
} 