class Game2048 {
  constructor() {
    this.grid = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
    this.gridContainer = document.querySelector(".grid-container");
    this.scoreElement = document.getElementById("score");
    this.bestScoreElement = document.getElementById("best-score");
    this.gameOverElement = document.getElementById("game-over");
    this.finalScoreElement = document.getElementById("final-score");
    this.darkModeButton = document.getElementById("dark-mode");
    this.tilePositions = new Map();
    this.isAnimating = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateBestScore();
    this.addNewTile();
    this.addNewTile();
    this.updateDisplay();
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    document
      .getElementById("new-game")
      .addEventListener("click", () => this.resetGame());
    document
      .getElementById("try-again")
      .addEventListener("click", () => this.resetGame());
    this.darkModeButton.addEventListener("click", () => this.toggleTheme());
  }

  handleKeyPress(event) {
    if (
      this.gameOverElement.classList.contains("hidden") &&
      !this.isAnimating
    ) {
      switch (event.key) {
        case "ArrowUp":
          this.move("up");
          break;
        case "ArrowDown":
          this.move("down");
          break;
        case "ArrowLeft":
          this.move("left");
          break;
        case "ArrowRight":
          this.move("right");
          break;
      }
    }
  }

  move(direction) {
    const oldGrid = JSON.stringify(this.grid);
    let moved = false;

    switch (direction) {
      case "up":
        moved = this.moveUp();
        break;
      case "down":
        moved = this.moveDown();
        break;
      case "left":
        moved = this.moveLeft();
        break;
      case "right":
        moved = this.moveRight();
        break;
    }

    if (moved) {
      this.isAnimating = true;
      setTimeout(() => {
        this.addNewTile();
        this.updateDisplay();
        this.checkGameOver();
      }, 200);
    }
  }

  moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const row = this.grid[i].filter((cell) => cell !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
          moved = true;
        }
      }
      const newRow = row.concat(Array(4 - row.length).fill(0));
      if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) moved = true;
      this.grid[i] = newRow;
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const row = this.grid[i].filter((cell) => cell !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j - 1, 1);
          moved = true;
        }
      }
      const newRow = Array(4 - row.length)
        .fill(0)
        .concat(row);
      if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) moved = true;
      this.grid[i] = newRow;
    }
    return moved;
  }

  moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
      const column = this.grid
        .map((row) => row[j])
        .filter((cell) => cell !== 0);
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
          moved = true;
        }
      }
      const newColumn = column.concat(Array(4 - column.length).fill(0));
      for (let i = 0; i < 4; i++) {
        if (this.grid[i][j] !== newColumn[i]) moved = true;
        this.grid[i][j] = newColumn[i];
      }
    }
    return moved;
  }

  moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
      const column = this.grid
        .map((row) => row[j])
        .filter((cell) => cell !== 0);
      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i - 1, 1);
          moved = true;
        }
      }
      const newColumn = Array(4 - column.length)
        .fill(0)
        .concat(column);
      for (let i = 0; i < 4; i++) {
        if (this.grid[i][j] !== newColumn[i]) moved = true;
        this.grid[i][j] = newColumn[i];
      }
    }
    return moved;
  }

  addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateDisplay() {
    const oldPositions = new Map(this.tilePositions);
    this.gridContainer.innerHTML = "";
    this.tilePositions.clear();

    // Create all tiles first
    const tiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.row = i;
        tile.dataset.col = j;

        if (this.grid[i][j] !== 0) {
          tile.textContent = this.grid[i][j];
          tile.dataset.value = this.grid[i][j];

          // Calculate new position
          const newPosition = { x: j, y: i };
          const key = `${i},${j}`;
          this.tilePositions.set(key, newPosition);

          // Check if tile moved
          if (oldPositions.has(key)) {
            const oldPos = oldPositions.get(key);
            if (oldPos.x !== newPosition.x || oldPos.y !== newPosition.y) {
              tile.classList.add("moving");
              const deltaX = (newPosition.x - oldPos.x) * 100;
              const deltaY = (newPosition.y - oldPos.y) * 100;
              tile.style.transform = `translate(${deltaX}%, ${deltaY}%)`;
              tiles.push({ tile, deltaX, deltaY });
            }
          } else {
            tile.classList.add("new");
          }

          if (this.grid[i][j] === 2048) {
            tile.classList.add("merged");
          }
        }

        this.gridContainer.appendChild(tile);
      }
    }

    // Handle animations
    if (tiles.length > 0) {
      requestAnimationFrame(() => {
        tiles.forEach(({ tile, deltaX, deltaY }) => {
          if (tile.classList.contains("moving")) {
            setTimeout(() => {
              tile.classList.remove("moving");
              tile.style.transform = "translate(0, 0)";
            }, 200);
          }
        });

        // Update score after animations
        setTimeout(() => {
          this.scoreElement.textContent = this.score;
          this.updateBestScore();
          this.isAnimating = false;
        }, 200);
      });
    } else {
      this.scoreElement.textContent = this.score;
      this.updateBestScore();
      this.isAnimating = false;
    }
  }

  updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem("bestScore", this.bestScore);
      this.bestScoreElement.textContent = this.bestScore;
    }
  }

  checkGameOver() {
    // Check for 2048 tile
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 2048) {
          this.showGameOver(true);
          return;
        }
      }
    }

    // Check for available moves
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) return;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.grid[i][j];
        if (
          (i < 3 && current === this.grid[i + 1][j]) ||
          (j < 3 && current === this.grid[i][j + 1])
        ) {
          return;
        }
      }
    }

    this.showGameOver(false);
  }

  showGameOver(won) {
    this.gameOverElement.classList.remove("hidden");
    this.finalScoreElement.textContent = this.score;
    if (won) {
      this.gameOverElement.querySelector("h2").textContent = "You Win!";
    }
  }

  resetGame() {
    this.grid = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.scoreElement.textContent = "0";
    this.gameOverElement.classList.add("hidden");
    this.addNewTile();
    this.addNewTile();
    this.updateDisplay();
  }

  toggleTheme() {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "light" : "dark"
    );
    localStorage.setItem("theme", isDark ? "light" : "dark");
    this.darkModeButton.textContent = isDark ? "Dark Mode" : "Light Mode";
  }
}

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
  const game = new Game2048();
  // Set initial theme
  document.body.dataset.theme = localStorage.getItem("theme") || "light";
});
