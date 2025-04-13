/**
 * Game constants and configuration
 */

// Create a global game constants object
window.TETRIS = {
    // Board dimensions
    BOARD_WIDTH: 10,
    BOARD_HEIGHT: 20,
    CELL_SIZE: 30,

    // Game settings
    INITIAL_LEVEL: 1,
    LINES_PER_LEVEL: 10,

    // Speed settings (in milliseconds)
    SPEED_CURVE: {
        1: 1000,   // Level 1: 1 cell per second
        2: 900,
        3: 800,
        4: 700,
        5: 600,
        6: 500,
        7: 400,
        8: 300,
        9: 200,
        10: 100,  // Level 10: 10 cells per second
        // Faster levels
        11: 90,
        12: 80,
        13: 70,
        14: 60,
        15: 50,
        16: 40,
        17: 30,
        18: 20,
        19: 15,
        20: 10    // Level 20: 100 cells per second (insane)
    },

    // Scoring system
    SCORE_VALUES: {
        SOFT_DROP: 1,         // Per cell
        HARD_DROP: 2,         // Per cell
        SINGLE_LINE: 100,
        DOUBLE_LINE: 300,
        TRIPLE_LINE: 500,
        TETRIS: 800           // Four lines
    },

    // Animation durations (in milliseconds)
    ANIMATION_DURATIONS: {
        LINE_CLEAR: 200,
        LEVEL_UP: 500,
        GAME_OVER: 1000,
        PIECE_ROTATION: 50,
        PIECE_MOVEMENT: 30
    },

    // Key bindings
    KEY_BINDINGS: {
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        DOWN: 'ArrowDown',
        HARD_DROP: 'ArrowUp',
        ROTATE: 'z',
        PAUSE: 'p',
        RESTART: 'r',
        QUIT: 'Escape'
    },

    // Game states
    GAME_STATES: {
        TITLE_SCREEN: 'titleScreen',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },

    // Local storage keys
    STORAGE_KEYS: {
        HIGH_SCORES: 'tetris_high_scores',
        AUDIO_SETTINGS: 'tetris_audio_settings'
    },

    // Calculate drop interval based on level
    getDropInterval: function(level) {
        if (level > 20) level = 20; // Cap at level 20
        return this.SPEED_CURVE[level] || this.SPEED_CURVE[20];
    }
}; 