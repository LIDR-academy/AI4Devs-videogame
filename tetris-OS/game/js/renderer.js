/**
 * Rendering system for Tetris
 */

window.Renderer = class Renderer {
    /**
     * Create a new renderer
     * @param {HTMLCanvasElement} gameCanvas - The main game canvas
     * @param {HTMLCanvasElement} nextPieceCanvas - The next piece preview canvas
     */
    constructor(gameCanvas, nextPieceCanvas) {
        // Main game canvas
        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCanvas.getContext('2d');
        
        // Next piece preview canvas
        this.nextPieceCanvas = nextPieceCanvas;
        this.nextPieceCtx = nextPieceCanvas.getContext('2d');
        
        // Setup
        this.blockSize = window.TETRIS.CELL_SIZE;
        
        // Set canvas dimensions based on board size
        this.gameCanvas.width = window.TETRIS.BOARD_WIDTH * this.blockSize;
        this.gameCanvas.height = window.TETRIS.BOARD_HEIGHT * this.blockSize;
    }
    
    /**
     * Clear the game canvas
     */
    clearGameCanvas() {
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
    
    /**
     * Clear the next piece canvas
     */
    clearNextPieceCanvas() {
        this.nextPieceCtx.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
    }
    
    /**
     * Draw the grid lines on the game canvas
     */
    drawGrid() {
        const ctx = this.gameCtx;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        
        // Draw vertical lines
        for (let x = 0; x <= window.TETRIS.BOARD_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.blockSize, 0);
            ctx.lineTo(x * this.blockSize, window.TETRIS.BOARD_HEIGHT * this.blockSize);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= window.TETRIS.BOARD_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.blockSize);
            ctx.lineTo(window.TETRIS.BOARD_WIDTH * this.blockSize, y * this.blockSize);
            ctx.stroke();
        }
    }
    
    /**
     * Draw a single tetromino block
     * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on
     * @param {number} x - X grid position
     * @param {number} y - Y grid position
     * @param {string} color - Block color (hex code)
     * @param {number} alpha - Opacity (0-1)
     */
    drawBlock(ctx, x, y, color, alpha = 1) {
        const blockSize = this.blockSize;
        
        ctx.globalAlpha = alpha;
        
        // Fill block
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        
        // Draw 3D effect
        // Top-left highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x * blockSize, y * blockSize);
        ctx.lineTo((x + 1) * blockSize, y * blockSize);
        ctx.lineTo(x * blockSize, (y + 1) * blockSize);
        ctx.fill();
        
        // Bottom-right shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo((x + 1) * blockSize, y * blockSize);
        ctx.lineTo((x + 1) * blockSize, (y + 1) * blockSize);
        ctx.lineTo(x * blockSize, (y + 1) * blockSize);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw the game board blocks
     * @param {number[][]} grid - Game board grid
     */
    drawBoard(grid) {
        for (let y = 0; y < window.TETRIS.BOARD_HEIGHT; y++) {
            for (let x = 0; x < window.TETRIS.BOARD_WIDTH; x++) {
                const blockId = grid[y][x];
                if (blockId !== 0) {
                    // Map the block ID to the tetromino type
                    let tetrominoType;
                    for (const [type, id] of Object.entries(window.TETRIS.TETROMINO_IDS)) {
                        if (id === blockId) {
                            tetrominoType = type;
                            break;
                        }
                    }
                    
                    if (tetrominoType) {
                        const color = window.TETRIS.TETROMINO_COLORS[tetrominoType];
                        this.drawBlock(this.gameCtx, x, y, color);
                    }
                }
            }
        }
    }
    
    /**
     * Draw the active tetromino piece
     * @param {Tetromino} piece - The active tetromino
     */
    drawPiece(piece) {
        const matrix = piece.getMatrix();
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    // Only draw if within visible board
                    if (boardY >= 0) {
                        this.drawBlock(this.gameCtx, boardX, boardY, piece.color);
                    }
                }
            }
        }
    }
    
    /**
     * Draw the ghost piece (landing position indicator)
     * @param {Tetromino} piece - The active tetromino
     * @param {number} ghostY - The ghost Y position
     */
    drawGhostPiece(piece, ghostY) {
        const matrix = piece.getMatrix();
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = ghostY + y;
                    
                    // Only draw if within visible board
                    if (boardY >= 0 && boardY < window.TETRIS.BOARD_HEIGHT) {
                        this.drawBlock(this.gameCtx, boardX, boardY, piece.color, 0.3);
                    }
                }
            }
        }
    }
    
    /**
     * Draw the next piece preview
     * @param {Tetromino} piece - The next tetromino
     */
    drawNextPiece(piece) {
        this.clearNextPieceCanvas();
        
        // Create a copy of the piece to avoid changing the original
        const pieceType = piece.type;
        
        // Get appropriate matrix - rotate certain pieces for better display
        let matrix;
        if (pieceType === 'I') {
            // Use horizontally oriented I piece (rotate if needed)
            matrix = [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        } else if (pieceType === 'L') {
            // Use horizontally oriented L piece
            matrix = [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ];
        } else {
            matrix = piece.getMatrix();
        }
        
        const width = matrix[0].length;
        const height = matrix.length;
        
        // Fixed size that works for all pieces
        const previewBlockSize = Math.min(
            this.nextPieceCanvas.width / 6,
            this.nextPieceCanvas.height / 6
        );
        
        // Center the piece in the preview canvas
        const offsetX = (this.nextPieceCanvas.width - (width * previewBlockSize)) / 2 / previewBlockSize;
        const offsetY = (this.nextPieceCanvas.height - (height * previewBlockSize)) / 2 / previewBlockSize;
        
        // Save the current block size
        const originalBlockSize = this.blockSize;
        // Set the block size for drawing
        this.blockSize = previewBlockSize;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (matrix[y][x] !== 0) {
                    this.drawBlock(this.nextPieceCtx, offsetX + x, offsetY + y, piece.color);
                }
            }
        }
        
        // Restore the original block size
        this.blockSize = originalBlockSize;
    }
    
    /**
     * Draw the line clear animation
     * @param {number[]} lines - Array of line indices to clear
     * @param {number} progress - Animation progress (0-1)
     */
    renderLineClearAnimation(lines, progress) {
        const ctx = this.gameCtx;
        
        for (const line of lines) {
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - progress})`;
            ctx.fillRect(
                0,
                line * this.blockSize,
                window.TETRIS.BOARD_WIDTH * this.blockSize,
                this.blockSize
            );
        }
    }
    
    /**
     * Draw the level up animation
     * @param {number} level - The new level
     * @param {number} progress - Animation progress (0-1)
     */
    renderLevelUpAnimation(level, progress) {
        const ctx = this.gameCtx;
        const canvas = this.gameCanvas;
        
        // Flash effect
        if (progress < 0.5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - progress * 2})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Level text
        if (progress > 0.3) {
            const textAlpha = Math.min((progress - 0.3) * 2, 1);
            
            ctx.font = 'bold 40px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
            ctx.fillText(
                `LEVEL ${level}`,
                canvas.width / 2,
                canvas.height / 2
            );
        }
    }
    
    /**
     * Update game statistics display
     * @param {Object} stats - Game statistics object
     */
    updateStats(stats) {
        document.getElementById('score').textContent = stats.score;
        document.getElementById('level').textContent = stats.level;
        document.getElementById('lines').textContent = stats.lines;
    }
    
    /**
     * Update the final score display on game over
     * @param {number} score - Final score
     */
    updateFinalScore(score) {
        document.getElementById('final-score').textContent = score;
    }
} 