class FloodAnimator {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Listen for flood fill events
        this.gameEngine.onFloodFill = this.animateFlood.bind(this);
    }
    
    // Animate the flood with delay
    animateFlood(newlyFlooded) {
        // Convert set to array
        const floodedTiles = Array.from(newlyFlooded).map(coord => {
            const [r, c] = coord.split(',').map(Number);
            return { row: r, col: c };
        });
        
        // Sort by Manhattan distance from origin (0,0)
        floodedTiles.sort((a, b) => {
            const distA = a.row + a.col;
            const distB = b.row + b.col;
            return distA - distB;
        });
        
        // Get all tiles on the board
        const tiles = document.querySelectorAll('.tile');
        
        // Remove animation class first
        tiles.forEach(tile => {
            tile.classList.remove('flooded');
        });
        
        // Add animation with delay
        floodedTiles.forEach((coord, index) => {
            setTimeout(() => {
                const tile = document.querySelector(`.tile[data-row="${coord.row}"][data-col="${coord.col}"]`);
                if (tile) {
                    tile.classList.add('flooded');
                }
            }, index * 20); // 20ms delay per "wave"
        });
    }
} 