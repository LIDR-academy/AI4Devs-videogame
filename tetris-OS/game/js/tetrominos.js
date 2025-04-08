/**
 * Tetromino definitions and rotation system
 */

// Tetromino shapes defined in a 4×4 grid
window.TETRIS.TETROMINO_SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

// Color definitions for each tetromino type
window.TETRIS.TETROMINO_COLORS = {
    I: '#00FFFF', // Cyan
    O: '#FFFF00', // Yellow
    T: '#800080', // Purple
    S: '#00FF00', // Green
    Z: '#FF0000', // Red
    J: '#0000FF', // Blue
    L: '#FF7F00'  // Orange
};

// Numerical IDs for each tetromino type (used in the board grid)
window.TETRIS.TETROMINO_IDS = {
    I: 1,
    O: 2,
    T: 3,
    S: 4,
    Z: 5,
    J: 6,
    L: 7
};

// Super Rotation System (SRS) wall kick data
// Format: [test1, test2, test3, test4, test5] where each test is [x, y]
// representing the position adjustment to try
window.TETRIS.WALL_KICK_DATA = {
    // Wall kick data for J, L, S, T, Z tetrominos
    JLSTZ: [
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], // 0->1
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],     // 1->2
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],    // 2->3
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]   // 3->0
    ],
    // Wall kick data for I tetromino
    I: [
        [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],   // 0->1
        [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],   // 1->2
        [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],   // 2->3
        [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]    // 3->0
    ]
};

/**
 * Tetromino class - represents a tetromino piece
 */
window.Tetromino = class Tetromino {
    /**
     * Create a new tetromino
     * @param {string} type - The type of tetromino (I, O, T, S, Z, J, L)
     */
    constructor(type) {
        this.type = type;
        this.color = window.TETRIS.TETROMINO_COLORS[type];
        this.id = window.TETRIS.TETROMINO_IDS[type];
        this.rotation = 0;
        this.matrix = window.TETRIS.TETROMINO_SHAPES[type];
        
        // Set initial position
        this.x = Math.floor((window.TETRIS.BOARD_WIDTH - this.matrix[0].length) / 2);
        this.y = -2;
    }
    
    /**
     * Get the current matrix of the piece
     * @returns {number[][]} Current piece matrix
     */
    getMatrix() {
        return this.matrix;
    }
    
    /**
     * Get the matrix after rotation
     * @param {number} direction - Rotation direction (1 for clockwise, -1 for counterclockwise)
     * @returns {number[][]} Rotated matrix
     */
    getRotatedMatrix(direction) {
        const matrix = this.getMatrix();
        const N = matrix.length;
        const rotated = Array(N).fill().map(() => Array(N).fill(0));
        
        if (direction === 1) { // Clockwise
            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    rotated[x][N - 1 - y] = matrix[y][x];
                }
            }
        } else { // Counterclockwise
            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    rotated[N - 1 - x][y] = matrix[y][x];
                }
            }
        }
        
        return rotated;
    }
    
    /**
     * Get the current rotation state
     * @param {number} direction - Rotation direction (1 for clockwise, -1 for counterclockwise)
     * @returns {number} Rotation state (0-3)
     */
    getRotationState(direction) {
        let state = this.rotation;
        
        // For O tetromino, rotation state is always 0
        if (this.type === 'O') {
            return 0;
        }
        
        // Calculate next rotation state
        if (direction === 1) {
            // Clockwise: 0->1, 1->2, 2->3, 3->0
            state = (state + 1) % 4;
        } else if (direction === -1) {
            // Counter-clockwise: 0->3, 3->2, 2->1, 1->0
            state = (state + 3) % 4;  // Same as (state - 1 + 4) % 4
        }
        
        return state;
    }
    
    /**
     * Rotate the piece
     * @param {number} direction - Rotation direction (1 for clockwise, -1 for counterclockwise)
     * @param {number[][]} [matrix] - Optional pre-calculated matrix to use
     */
    rotate(direction, matrix) {
        this.matrix = matrix || this.getRotatedMatrix(direction);
        this.rotation = this.getRotationState(direction);
    }
    
    /**
     * Move the piece
     * @param {number} dx - X movement
     * @param {number} dy - Y movement
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    
    /**
     * Get wall kick data for this tetromino type
     * @param {number} rotationIndex - Current rotation index 
     * @returns {number[][]} Array of [x, y] offsets to try
     */
    getWallKickData(rotationIndex) {
        const dataSet = this.type === 'I' ? window.TETRIS.WALL_KICK_DATA.I : window.TETRIS.WALL_KICK_DATA.JLSTZ;
        return dataSet[rotationIndex];
    }
    
    /**
     * Create a ghost piece (for showing landing position)
     * @returns {Tetromino} A copy of this tetromino
     */
    createGhost() {
        const ghost = new Tetromino(this.type);
        ghost.x = this.x;
        ghost.y = this.y;
        ghost.rotation = this.rotation;
        ghost.matrix = this.matrix;
        return ghost;
    }
}

/**
 * Factory for creating random tetrominos
 */
window.TetrominoFactory = class TetrominoFactory {
    /**
     * Create a new tetromino factory
     */
    constructor() {
        this.reset();
    }
    
    /**
     * Reset the factory's bag
     */
    reset() {
        this.bag = [];
        this.refillBag();
    }
    
    /**
     * Refill the bag with all tetromino types
     */
    refillBag() {
        const types = Object.keys(window.TETRIS.TETROMINO_SHAPES);
        
        // Create array of all piece types
        const newPieces = [...types];
        
        // Shuffle the array
        for (let i = newPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
        }
        
        // Add to current bag
        this.bag.push(...newPieces);
    }
    
    /**
     * Get the next tetromino
     * @returns {Tetromino} A new tetromino instance
     */
    getNextPiece() {
        // Refill bag if empty
        if (this.bag.length === 0) {
            this.refillBag();
        }
        
        // Get next piece from bag
        const type = this.bag.shift();
        return new Tetromino(type);
    }
    
    /**
     * Alias for getNextPiece to maintain compatibility with game.js
     * @returns {Tetromino} A new tetromino instance
     */
    getNext() {
        return this.getNextPiece();
    }
} 