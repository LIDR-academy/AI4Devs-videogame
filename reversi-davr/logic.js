class ReversiGame {
    constructor() {
        this.boardSize = null;
        this.setupSizeSelector();
        this.setupForfeitModal();
    }

    setupSizeSelector() {
        const buttons = document.querySelectorAll('#size-selector button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.boardSize = parseInt(button.dataset.size);
                document.getElementById('size-selector').classList.add('hidden');
                document.getElementById('board').classList.remove('hidden');
                document.getElementById('status').classList.remove('hidden');
                this.initializeGame();
            });
        });
    }

    setupForfeitModal() {
        document.getElementById('acknowledge-forfeit').addEventListener('click', () => {
            document.getElementById('forfeit-modal').classList.add('hidden');
            this.resumeAfterForfeit();
        });
    }

    showForfeitModal(message) {
        document.getElementById('forfeit-message').textContent = message;
        document.getElementById('forfeit-modal').classList.remove('hidden');
    }

    resumeAfterForfeit() {
        this.updateStatus(`Current player: ${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}`);
    }

    isGameStarted() {
        if (!this.board) return false;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] && 
                    !(row === Math.floor(this.boardSize/2) - 1 && col === Math.floor(this.boardSize/2) - 1) &&
                    !(row === Math.floor(this.boardSize/2) - 1 && col === Math.floor(this.boardSize/2)) &&
                    !(row === Math.floor(this.boardSize/2) && col === Math.floor(this.boardSize/2) - 1) &&
                    !(row === Math.floor(this.boardSize/2) && col === Math.floor(this.boardSize/2))) {
                    return true;
                }
            }
        }
        return false;
    }

    initializeGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.initializeBoard();
        document.getElementById('board').innerHTML = '';
        this.createBoardUI();
        this.updateStatus(`Current player: Black`);
        
        // Disable size buttons if game has started
        const buttons = document.querySelectorAll('#size-selector button');
        buttons.forEach(button => {
            button.disabled = this.isGameStarted();
        });
    }

    initializeBoard() {
        const mid = Math.floor(this.boardSize/2);
        this.board[mid-1][mid-1] = 'white';
        this.board[mid-1][mid] = 'black';
        this.board[mid][mid-1] = 'black';
        this.board[mid][mid] = 'white';
    }

    createBoardUI() {
        const boardElement = document.getElementById('board');
        boardElement.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.handleMove(i, j));
                boardElement.appendChild(cell);
                
                if (this.board[i][j]) {
                    const piece = document.createElement('div');
                    piece.className = `piece ${this.board[i][j]}`;
                    cell.appendChild(piece);
                }
            }
        }
    }

    isValidMove(row, col) {
        // Cannot place on occupied cell
        if (this.board[row][col]) return false;
        
        // Check all directions for valid flips
        const directions = [
            [-1,-1], [-1,0], [-1,1],
            [0,-1],          [0,1],
            [1,-1],  [1,0],  [1,1]
        ];
        
        return directions.some(([dRow, dCol]) => 
            this.wouldFlip(row, col, dRow, dCol).length > 0
        );
    }

    wouldFlip(row, col, dRow, dCol) {
        const flips = [];
        let curRow = row + dRow;
        let curCol = col + dCol;
        
        // Collect potential flips
        while (curRow >= 0 && curRow < this.boardSize && curCol >= 0 && curCol < this.boardSize) {
            if (!this.board[curRow][curCol]) return [];
            if (this.board[curRow][curCol] === this.currentPlayer) {
                return flips;
            }
            flips.push([curRow, curCol]);
            curRow += dRow;
            curCol += dCol;
        }
        return [];
    }

    getAllFlips(row, col) {
        const directions = [
            [-1,-1], [-1,0], [-1,1],
            [0,-1],          [0,1],
            [1,-1],  [1,0],  [1,1]
        ];
        
        return directions.flatMap(([dRow, dCol]) => 
            this.wouldFlip(row, col, dRow, dCol)
        );
    }

    placePiece(row, col) {
        // Place the new piece
        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);
        
        // Flip captured pieces
        const flips = this.getAllFlips(row, col);
        flips.forEach(([r, c]) => {
            this.board[r][c] = this.currentPlayer;
            this.updateCell(r, c);
        });
    }

    updateCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.innerHTML = '';
        if (this.board[row][col]) {
            const piece = document.createElement('div');
            piece.className = `piece ${this.board[row][col]}`;
            cell.appendChild(piece);
        }
    }

    hasValidMoves() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.isValidMove(row, col)) {
                    return true;
                }
            }
        }
        return false;
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    countPieces() {
        let black = 0, white = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'black') black++;
                if (this.board[row][col] === 'white') white++;
            }
        }
        return { black, white };
    }

    isGameOver() {
        // Try as current player
        const currentHasMoves = this.hasValidMoves();
        
        // Try as other player
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        const otherHasMoves = this.hasValidMoves();
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        
        return !currentHasMoves && !otherHasMoves;
    }

    applyWinnerEffect(winnerColor) {
        const pieces = document.querySelectorAll(`.piece.${winnerColor}`);
        pieces.forEach(piece => piece.classList.add('winner'));
    }

    switchPlayer() {
        if (this.isGameOver()) {
            const { black, white } = this.countPieces();
            let message = `Game Over! Final score - Black: ${black}, White: ${white}. `;
            if (black > white) {
                message += 'Black wins!';
                this.applyWinnerEffect('black');
            } else if (white > black) {
                message += 'White wins!';
                this.applyWinnerEffect('white');
            } else {
                message += "It's a tie!";
            }
            this.updateStatus(message);
            return;
        }

        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        
        if (!this.hasValidMoves()) {
            const currentPlayerCapitalized = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
            const nextPlayer = this.currentPlayer === 'black' ? 'White' : 'Black';
            this.showForfeitModal(`No valid moves for ${currentPlayerCapitalized}! ${currentPlayerCapitalized} forfeits their turn. Next move: ${nextPlayer}`);
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        } else {
            this.updateStatus(`Current player: ${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}`);
        }
    }

    handleMove(row, col) {
        if (!this.isValidMove(row, col)) return;
        
        this.placePiece(row, col);
        this.switchPlayer();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new ReversiGame();
});
