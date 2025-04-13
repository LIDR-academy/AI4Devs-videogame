const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  parent: "game-container",
  backgroundColor: "#faf8ef",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let grid = [];
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let scoreText;
let bestScoreText;
let tiles = [];
let isAnimating = false;
let currentScene;

function preload() {
  // Load assets if needed
}

function createRoundedRectangle(scene, x, y, width, height, color, radius = 6) {
  const graphics = scene.add.graphics();
  graphics.lineStyle(0);
  graphics.fillStyle(color);
  graphics.beginPath();
  graphics.moveTo(x - width / 2 + radius, y - height / 2);
  graphics.lineTo(x + width / 2 - radius, y - height / 2);
  graphics.arc(
    x + width / 2 - radius,
    y - height / 2 + radius,
    radius,
    -Math.PI / 2,
    0
  );
  graphics.lineTo(x + width / 2, y + height / 2 - radius);
  graphics.arc(
    x + width / 2 - radius,
    y + height / 2 - radius,
    radius,
    0,
    Math.PI / 2
  );
  graphics.lineTo(x - width / 2 + radius, y + height / 2);
  graphics.arc(
    x - width / 2 + radius,
    y + height / 2 - radius,
    radius,
    Math.PI / 2,
    Math.PI
  );
  graphics.lineTo(x - width / 2, y - height / 2 + radius);
  graphics.arc(
    x - width / 2 + radius,
    y - height / 2 + radius,
    radius,
    Math.PI,
    -Math.PI / 2
  );
  graphics.closePath();
  graphics.fill();
  return graphics;
}

function create() {
  currentScene = this;

  // Initialize grid
  for (let i = 0; i < 4; i++) {
    grid[i] = Array(4).fill(0);
  }

  // Create game board background
  const boardSize = 400;
  const boardX = (config.width - boardSize) / 2;
  const boardY = 100;

  const board = createRoundedRectangle(
    this,
    boardX + boardSize / 2,
    boardY + boardSize / 2,
    boardSize,
    boardSize,
    0xbbada0
  );

  // Create grid cells
  const cellSize = boardSize / 4;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      createRoundedRectangle(
        this,
        boardX + j * cellSize + cellSize / 2,
        boardY + i * cellSize + cellSize / 2,
        cellSize - 10,
        cellSize - 10,
        0xeee4da
      );
    }
  }

  // Add score text
  scoreText = this.add.text(20, 20, "Score: 0", {
    fontSize: "24px",
    fill: "#776e65",
  });

  bestScoreText = this.add.text(20, 50, "Best: " + bestScore, {
    fontSize: "24px",
    fill: "#776e65",
  });

  // Add new game button
  const newGameButton = this.add.rectangle(400, 35, 120, 40, 0xbbada0);
  newGameButton.setInteractive({ useHandCursor: true });
  newGameButton.on("pointerdown", () => {
    console.log("New game clicked"); // Debug log
    resetGame(this);
  });

  const newGameText = this.add.text(400, 35, "New Game", {
    fontSize: "18px",
    fill: "#ffffff",
  });
  newGameText.setOrigin(0.5);

  // Add initial tiles
  addNewTile(this);
  addNewTile(this);

  // Setup input
  this.input.keyboard.on("keydown", (event) => handleKeyPress(event, this));
}

function update() {
  // Update animations if needed
}

function addNewTile(scene) {
  const emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    grid[x][y] = value;
    createTile(scene, x, y, value);
  }
}

function createTile(scene, row, col, value, fromX = null, fromY = null) {
  const boardSize = 400;
  const boardX = (config.width - boardSize) / 2;
  const boardY = 100;
  const cellSize = boardSize / 4;

  const targetX = boardX + col * cellSize + cellSize / 2;
  const targetY = boardY + row * cellSize + cellSize / 2;

  // Create a container for the tile and its text
  const container = scene.add.container(fromX || targetX, fromY || targetY);

  const tile = createRoundedRectangle(
    scene,
    0,
    0, // Position relative to container
    cellSize - 10,
    cellSize - 10,
    getTileColor(value)
  );

  const text = scene.add.text(
    0,
    0, // Position relative to container
    value.toString(),
    {
      fontSize: value >= 1000 ? "32px" : "40px",
      fill: value <= 4 ? "#776e65" : "#ffffff",
    }
  );
  text.setOrigin(0.5);

  container.add([tile, text]);

  // If this is a new tile (not moved), add a scale animation
  if (!fromX && !fromY) {
    container.setScale(0);
    scene.tweens.add({
      targets: container,
      scale: 1,
      duration: 200,
      ease: "Back.out",
    });
  } else {
    // If this is a moved tile, add a sliding animation
    scene.tweens.add({
      targets: container,
      x: targetX,
      y: targetY,
      duration: 150,
      ease: "Linear",
    });
  }

  tiles.push({ container, value, row, col });
}

function getTileColor(value) {
  const colors = {
    2: 0xeee4da,
    4: 0xede0c8,
    8: 0xf2b179,
    16: 0xf59563,
    32: 0xf67c5f,
    64: 0xf65e3b,
    128: 0xedcf72,
    256: 0xedcc61,
    512: 0xedc850,
    1024: 0xedc53f,
    2048: 0xedc22e,
  };
  return colors[value] || 0xedc22e;
}

function handleKeyPress(event, scene) {
  if (isAnimating) return;

  let moved = false;
  const oldGrid = JSON.stringify(grid);
  const oldPositions = new Map();
  tiles.forEach(({ container, row, col }) => {
    oldPositions.set(`${row},${col}`, { x: container.x, y: container.y });
  });

  switch (event.key) {
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
  }

  if (moved) {
    isAnimating = true;
    updateDisplay(scene, oldPositions);
    setTimeout(() => {
      addNewTile(scene);
      checkGameOver(scene);
      isAnimating = false;
    }, 150);
  }
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    const row = grid[i].filter((cell) => cell !== 0);
    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        score += row[j];
        row.splice(j + 1, 1);
        moved = true;
      }
    }
    const newRow = row.concat(Array(4 - row.length).fill(0));
    if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
    grid[i] = newRow;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    const row = grid[i].filter((cell) => cell !== 0);
    for (let j = row.length - 1; j > 0; j--) {
      if (row[j] === row[j - 1]) {
        row[j] *= 2;
        score += row[j];
        row.splice(j - 1, 1);
        moved = true;
      }
    }
    const newRow = Array(4 - row.length)
      .fill(0)
      .concat(row);
    if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
    grid[i] = newRow;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let j = 0; j < 4; j++) {
    const column = grid.map((row) => row[j]).filter((cell) => cell !== 0);
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        score += column[i];
        column.splice(i + 1, 1);
        moved = true;
      }
    }
    const newColumn = column.concat(Array(4 - column.length).fill(0));
    for (let i = 0; i < 4; i++) {
      if (grid[i][j] !== newColumn[i]) moved = true;
      grid[i][j] = newColumn[i];
    }
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let j = 0; j < 4; j++) {
    const column = grid.map((row) => row[j]).filter((cell) => cell !== 0);
    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1]) {
        column[i] *= 2;
        score += column[i];
        column.splice(i - 1, 1);
        moved = true;
      }
    }
    const newColumn = Array(4 - column.length)
      .fill(0)
      .concat(column);
    for (let i = 0; i < 4; i++) {
      if (grid[i][j] !== newColumn[i]) moved = true;
      grid[i][j] = newColumn[i];
    }
  }
  return moved;
}

function updateDisplay(scene, oldPositions) {
  // Clear all existing tiles
  tiles.forEach(({ container }) => {
    container.destroy();
  });
  tiles = [];

  // Create new tiles with animations
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== 0) {
        const oldPos = oldPositions.get(`${i},${j}`);
        if (oldPos) {
          createTile(scene, i, j, grid[i][j], oldPos.x, oldPos.y);
        } else {
          createTile(scene, i, j, grid[i][j]);
        }
      }
    }
  }

  // Update score
  scoreText.setText("Score: " + score);
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestScoreText.setText("Best: " + bestScore);
  }
}

function checkGameOver(scene) {
  // Check for 2048 tile
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 2048) {
        showGameOver(scene, true);
        return;
      }
    }
  }

  // Check for available moves
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return;
    }
  }

  // Check for possible merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];
      if (
        (i < 3 && current === grid[i + 1][j]) ||
        (j < 3 && current === grid[i][j + 1])
      ) {
        return;
      }
    }
  }

  showGameOver(scene, false);
}

function showGameOver(scene, won) {
  const gameOverText = scene.add.text(
    config.width / 2,
    config.height / 2,
    won ? "You Win!" : "Game Over!",
    { fontSize: "48px", fill: "#776e65" }
  );
  gameOverText.setOrigin(0.5);

  const scoreText = scene.add.text(
    config.width / 2,
    config.height / 2 + 60,
    "Score: " + score,
    { fontSize: "32px", fill: "#776e65" }
  );
  scoreText.setOrigin(0.5);
}

function resetGame(scene) {
  // Clear grid
  for (let i = 0; i < 4; i++) {
    grid[i] = Array(4).fill(0);
  }

  // Clear tiles
  tiles.forEach(({ container }) => {
    container.destroy();
  });
  tiles = [];

  // Reset score
  score = 0;
  scoreText.setText("Score: 0");

  // Add new tiles
  addNewTile(scene);
  addNewTile(scene);

  // Update display without animations for new game
  updateDisplay(scene, new Map());
}
