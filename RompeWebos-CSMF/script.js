let rows = 10, cols = 10, bombs = 15;
let board = [];
let gameOver = false;

function setDifficulty(level) {
    if (level === 'easy') {
        rows = 10; cols = 10; bombs = 15;
    } else if (level === 'medium') {
        rows = 15; cols = 15; bombs = 40;
    } else if (level === 'hard') {
        rows = 15; cols = 25; bombs = 75;
    }
    initGame();
}

function initGame() {
    gameOver = false;
    board = Array.from({ length: rows }, () => Array(cols).fill(null).map(() => ({
        webo: false, revealed: false, flagged: false, count: 0
    })));
    placeBombs();
    calculateNumbers();
    renderBoard();
}

function placeBombs() {
    let placed = 0;
    while (placed < bombs) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].webo) {
            board[r][c].webo = true;
            placed++;
        }
    }
}

function calculateNumbers() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].webo) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].webo) {
                        count++;
                    }
                }
            }
            board[r][c].count = count;
        }
    }
}

function renderBoard() {
    const container = document.getElementById("game-container");
    container.innerHTML = "";
    board.forEach((row, r) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        row.forEach((cell, c) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            if (cell.revealed) {
                cellDiv.classList.add("revealed");
                if (cell.webo) {
                    cellDiv.textContent = cell.highlighted ? "🍳" : "🥚";
                } else {
                    cellDiv.textContent = cell.count > 0 ? cell.count : "";
                }
            }
            if (cell.flagged) {
                cellDiv.classList.add("flagged");
                cellDiv.textContent = "🐣"; // Correctly flagged cells
                if (cell.misflagged) {
                    cellDiv.classList.add("misflagged"); // Incorrectly flagged cells
                }
            }
            cellDiv.onclick = () => revealCell(r, c);
            cellDiv.oncontextmenu = (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            };
            rowDiv.appendChild(cellDiv);
        });
        container.appendChild(rowDiv);
    });
}

function revealCell(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;
    board[r][c].revealed = true;
    if (board[r][c].webo) {
        gameOver = true;
        revealAll(r, c); // Pass the clicked cell to highlight it
        // alert("¡Perdiste!");
    } else if (board[r][c].count === 0) {
        revealAdjacent(r, c);
    }
    renderBoard();
}

function revealAdjacent(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !board[nr][nc].revealed) {
                revealCell(nr, nc);
            }
        }
    }
}

function toggleFlag(r, c) {
    if (gameOver || board[r][c].revealed) return;
    board[r][c].flagged = !board[r][c].flagged;
    renderBoard();
}

function revealAll(clickedRow, clickedCol) {
    board.forEach((row, r) => row.forEach((cell, c) => {
        if (cell.webo) {
            cell.revealed = true;
            if (r === clickedRow && c === clickedCol) {
                cell.highlighted = true; // Mark the clicked Webo with 🍳
            }
        } else if (cell.flagged && !cell.webo) {
            cell.misflagged = true; // Mark incorrectly flagged cells
        } else if (cell.flagged && cell.webo) {
            cell.revealed = true; // Ensure correctly flagged cells remain visible
        }
    }));
    renderBoard();
}

initGame();
