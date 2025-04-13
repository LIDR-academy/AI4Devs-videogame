class PuzzleMaster {
    constructor() {
        this.board = null;
        this.size = 3; // Default 3x3
        this.pieces = [];
        this.solution = [];
        this.selectedPiece = null;
        this.startTime = null;
        this.moves = 0;
        this.init();
    }

    init() {
        this.board = document.getElementById('puzzle-board');
        this.setupBoard();
        this.setupEventListeners();
        this.startGame();
    }

    setupBoard() {
        // Clear the board
        this.board.innerHTML = '';
        this.board.style.display = 'grid';
        this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.board.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
        this.board.style.gap = '2px';
        this.board.style.width = '300px';
        this.board.style.height = '300px';
    }

    setupEventListeners() {
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('verify-btn').addEventListener('click', () => this.verify());
    }

    startGame() {
        // Create solution array (1 to size*size-1, and 0 for empty space)
        this.solution = Array.from({ length: this.size * this.size }, (_, i) => i + 1);
        this.solution[this.solution.length - 1] = 0; // Last piece is empty (0)

        // Create shuffled pieces array
        this.pieces = [...this.solution];
        this.shufflePieces();

        // Render pieces
        this.renderPieces();

        // Start timer
        this.startTime = new Date();
        this.moves = 0;

        // Hide any previous messages
        document.getElementById('message').style.display = 'none';
    }

    shufflePieces() {
        // Shuffle the pieces array
        for (let i = this.pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pieces[i], this.pieces[j]] = [this.pieces[j], this.pieces[i]];
        }

        // Make sure the puzzle is solvable
        if (!this.isSolvable()) {
            // Swap two pieces to make it solvable
            const index1 = this.pieces.indexOf(1);
            const index2 = this.pieces.indexOf(2);
            [this.pieces[index1], this.pieces[index2]] = [this.pieces[index2], this.pieces[index1]];
        }
    }

    isSolvable() {
        // Count inversions
        let inversions = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] === 0) continue;
            
            for (let j = i + 1; j < this.pieces.length; j++) {
                if (this.pieces[j] === 0) continue;
                if (this.pieces[i] > this.pieces[j]) {
                    inversions++;
                }
            }
        }

        // For odd-sized puzzles, the puzzle is solvable if the number of inversions is even
        if (this.size % 2 === 1) {
            return inversions % 2 === 0;
        } 
        // For even-sized puzzles, the puzzle is solvable if:
        // (blank row from bottom + inversions) is odd
        else {
            const blankRow = Math.floor(this.pieces.indexOf(0) / this.size);
            const blankRowFromBottom = this.size - blankRow;
            return (blankRowFromBottom + inversions) % 2 === 1;
        }
    }

    renderPieces() {
        this.board.innerHTML = '';
        
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;
            
            if (this.pieces[i] !== 0) {
                piece.textContent = this.pieces[i];
                piece.style.backgroundColor = '#3498db';
                piece.style.color = 'white';
                piece.style.cursor = 'pointer';
            } else {
                piece.classList.add('empty');
            }

            piece.addEventListener('click', () => this.movePiece(i));
            
            this.board.appendChild(piece);
        }
    }

    movePiece(index) {
        const emptyIndex = this.pieces.indexOf(0);
        
        // Check if the clicked piece is adjacent to the empty space
        if (this.isAdjacent(index, emptyIndex)) {
            // Swap the pieces
            [this.pieces[index], this.pieces[emptyIndex]] = [this.pieces[emptyIndex], this.pieces[index]];
            this.moves++;
            this.renderPieces();
            
            // Check if the puzzle is solved
            if (this.isSolved()) {
                this.showVictoryMessage();
            }
        }
    }

    isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / this.size);
        const col1 = index1 % this.size;
        const row2 = Math.floor(index2 / this.size);
        const col2 = index2 % this.size;
        
        // Check if the pieces are adjacent (horizontally or vertically)
        return (
            (row1 === row2 && Math.abs(col1 - col2) === 1) ||
            (col1 === col2 && Math.abs(row1 - row2) === 1)
        );
    }

    isSolved() {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] !== this.solution[i]) {
                return false;
            }
        }
        return true;
    }

    showVictoryMessage() {
        const endTime = new Date();
        const timeElapsed = Math.floor((endTime - this.startTime) / 1000); // in seconds
        
        const messageElement = document.getElementById('message');
        messageElement.style.display = 'block';
        messageElement.style.backgroundColor = '#2ecc71';
        messageElement.innerHTML = `
            <h2>¡Felicidades!</h2>
            <p>Has resuelto el puzzle en ${timeElapsed} segundos con ${this.moves} movimientos.</p>
            <p>Puntuación: ${this.calculateScore(timeElapsed)}</p>
        `;
    }

    calculateScore(timeElapsed) {
        // Simple scoring formula: 1000 - (time * 5) - (moves * 10)
        // With a minimum score of 100
        const baseScore = 1000;
        const timeDeduction = timeElapsed * 5;
        const movesDeduction = this.moves * 10;
        const score = Math.max(100, baseScore - timeDeduction - movesDeduction);
        return Math.floor(score);
    }

    restart() {
        this.startGame();
    }

    verify() {
        if (this.isSolved()) {
            this.showVictoryMessage();
        } else {
            const messageElement = document.getElementById('message');
            messageElement.style.display = 'block';
            messageElement.style.backgroundColor = '#e74c3c';
            messageElement.textContent = '¡El puzzle aún no está resuelto! Sigue intentando.';
            
            // Hide the message after 3 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }
    }

    // Method to change difficulty (size of the puzzle)
    setDifficulty(size) {
        this.size = size;
        this.setupBoard();
        this.startGame();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PuzzleMaster();
    
    // Add difficulty buttons
    const controls = document.querySelector('.controls');
    
    const difficultyDiv = document.createElement('div');
    difficultyDiv.className = 'difficulty';
    difficultyDiv.innerHTML = '<p>Dificultad:</p>';
    
    const easyBtn = document.createElement('button');
    easyBtn.textContent = 'Fácil (3x3)';
    easyBtn.addEventListener('click', () => game.setDifficulty(3));
    
    const mediumBtn = document.createElement('button');
    mediumBtn.textContent = 'Medio (4x4)';
    mediumBtn.addEventListener('click', () => game.setDifficulty(4));
    
    const hardBtn = document.createElement('button');
    hardBtn.textContent = 'Difícil (5x5)';
    hardBtn.addEventListener('click', () => game.setDifficulty(5));
    
    difficultyDiv.appendChild(easyBtn);
    difficultyDiv.appendChild(mediumBtn);
    difficultyDiv.appendChild(hardBtn);
    
    controls.parentNode.insertBefore(difficultyDiv, controls.nextSibling);
});
