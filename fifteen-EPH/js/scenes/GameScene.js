class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.tiles = [];
    this.moves = 0;
    this.timeElapsed = 0;
    this.isGameComplete = false;
    this.emptyTileIndex = null; // Track empty tile position
  }

  init(data) {
    // Clear previous game state
    this.tiles = [];
    this.moves = 0;
    this.timeElapsed = 0;
    this.isGameComplete = false;
    this.emptyTileIndex = null;
    this.boardSize = data.size;
    this.tileCount = this.boardSize * this.boardSize - 1;
  }

  create() {
    // Enable input events
    this.input.on("gameobjectdown", (pointer, gameObject) => {
      const tileData = this.tiles.find((t) => t.sprite === gameObject);
      if (tileData) {
        this.handleTileClick(tileData.currentIndex);
      }
    });

    // Initialize game state
    this.moves = 0;
    this.timeElapsed = 0;
    this.isGameComplete = false;

    // Create UI elements
    this.createUI();

    // Create board
    this.createBoard();

    // Start timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  createUI() {
    // Time counter
    this.timeText = this.add.text(16, 16, "TIME: 00:00", {
      fontSize: "24px",
      fill: "#fff",
    });

    // Moves counter
    this.movesText = this.add.text(16, 50, "MOVES: 0", {
      fontSize: "24px",
      fill: "#fff",
    });

    // Menu button
    const menuButton = this.add
      .text(700, 16, "MENU", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("MenuScene"));

    // Restart button
    const restartButton = this.add
      .text(700, 50, "↺", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setInteractive()
      .on("pointerdown", () => this.scene.restart());
  }

  createBoard() {
    const tileSize = 80;
    const padding = 4;
    const boardWidth = this.boardSize * (tileSize + padding) - padding;
    const boardHeight = this.boardSize * (tileSize + padding) - padding;

    const startX = (800 - boardWidth) / 2;
    const startY = (600 - boardHeight) / 2 + 50;

    // Create numbers array and shuffle
    let numbers = Array.from(
      { length: this.boardSize * this.boardSize },
      (_, i) => i + 1
    );
    numbers.pop(); // Remove last number to create empty space
    numbers = this.shuffleArray(numbers);

    // Set initial empty tile position to last position
    this.emptyTileIndex = this.boardSize * this.boardSize - 1;

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const index = i * this.boardSize + j;
        const number = index < numbers.length ? numbers[index] : null;

        if (number !== null) {
          const tileX = startX + j * (tileSize + padding) + tileSize / 2;
          const tileY = startY + i * (tileSize + padding) + tileSize / 2;

          // Create tile background with input enabled
          const tile = this.add
            .rectangle(tileX, tileY, tileSize, tileSize, 0x000000)
            .setStrokeStyle(2, 0x00ff00, 0.3)
            .setInteractive({ useHandCursor: true }) // Enable hand cursor
            .setData("index", index); // Store index on the tile object

          // Add hover effects
          tile.on("pointerover", () => {
            tile.setStrokeStyle(2, 0x00ff00, 1);
          });

          tile.on("pointerout", () => {
            tile.setStrokeStyle(2, 0x00ff00, 0.3);
          });

          const text = this.add
            .text(tileX, tileY, number.toString(), {
              fontSize: "32px",
              fill: "#fff",
              fontFamily: "Arial",
            })
            .setOrigin(0.5);

          // Store tile data
          this.tiles.push({
            sprite: tile,
            text: text,
            number: number,
            currentIndex: index,
          });
        }
      }
    }
  }

  handleTileClick(clickedIndex) {
    if (this.isGameComplete) return;

    if (this.isAdjacent(clickedIndex, this.emptyTileIndex)) {
      this.moveTile(clickedIndex, this.emptyTileIndex);

      // Update empty tile position
      const oldEmptyIndex = this.emptyTileIndex;
      this.emptyTileIndex = clickedIndex;

      // Update move counter
      this.moves++;
      this.movesText.setText(`MOVES: ${this.moves}`);
    }
  }

  isAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / this.boardSize);
    const col1 = index1 % this.boardSize;
    const row2 = Math.floor(index2 / this.boardSize);
    const col2 = index2 % this.boardSize;

    const isAdjacent =
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2);

    console.log(
      `Checking adjacency: (${row1},${col1}) and (${row2},${col2}): ${isAdjacent}`
    ); // Debug log
    return isAdjacent;
  }

  moveTile(fromIndex, toIndex) {
    const tile = this.tiles.find((t) => t.currentIndex === fromIndex);
    if (!tile) {
      console.log(`No tile found at index ${fromIndex}`); // Debug log
      return;
    }

    const tileSize = 80;
    const padding = 4;
    const boardWidth = this.boardSize * (tileSize + padding) - padding;
    const startX = (800 - boardWidth) / 2;
    const startY = (600 - boardWidth) / 2 + 50;

    const toRow = Math.floor(toIndex / this.boardSize);
    const toCol = toIndex % this.boardSize;
    const newX = startX + toCol * (tileSize + padding) + tileSize / 2;
    const newY = startY + toRow * (tileSize + padding) + tileSize / 2;

    console.log(`Moving tile to position (${newX},${newY})`); // Debug log

    this.tweens.add({
      targets: [tile.sprite, tile.text],
      x: newX,
      y: newY,
      duration: 200,
      ease: "Power2",
      onComplete: () => {
        tile.currentIndex = toIndex;
        if (this.checkWinCondition()) {
          this.handleGameComplete();
        }
      },
    });
  }

  findEmptyTileIndex() {
    return this.emptyTileIndex;
  }

  checkWinCondition() {
    return this.tiles.every((tile) => tile.number === tile.currentIndex + 1);
  }

  handleGameComplete() {
    this.isGameComplete = true;
    if (this.timerEvent) {
      this.timerEvent.remove();
    }

    // Save score
    this.saveScore();

    // Create dark overlay
    const overlay = this.add
      .rectangle(0, 0, 800, 600, 0x000000, 0.7)
      .setOrigin(0)
      .setDepth(1);

    // Show completion message with better visibility
    const completionText = this.add
      .text(
        400,
        250,
        "PUZZLE COMPLETE!\n\n" +
          "Time: " +
          this.formatTime(this.timeElapsed) +
          "\n" +
          "Moves: " +
          this.moves,
        {
          fontSize: "32px",
          fill: "#fff",
          align: "center",
          backgroundColor: "#000000",
          padding: { x: 20, y: 20 },
        }
      )
      .setOrigin(0.5)
      .setDepth(2);

    // Add "Back to Menu" button
    const menuButton = this.add
      .text(400, 400, "BACK TO MENU", {
        fontSize: "24px",
        fill: "#fff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(2);

    menuButton.on("pointerover", () => menuButton.setStyle({ fill: "#0f0" }));
    menuButton.on("pointerout", () => menuButton.setStyle({ fill: "#fff" }));
    menuButton.on("pointerdown", () => this.scene.start("MenuScene"));
  }

  saveScore() {
    const scoreData = {
      time: this.timeElapsed,
      moves: this.moves,
      date: new Date().toLocaleDateString(),
      timeFormatted: this.formatTime(this.timeElapsed),
    };

    // Save time-based ranking
    const timeKey = `rankings_${this.boardSize}_time`;
    let timeRankings = JSON.parse(localStorage.getItem(timeKey) || "[]");
    timeRankings.push(scoreData);
    timeRankings.sort((a, b) => a.time - b.time);
    timeRankings = timeRankings.slice(0, 5); // Keep top 5
    localStorage.setItem(timeKey, JSON.stringify(timeRankings));

    // Save moves-based ranking
    const movesKey = `rankings_${this.boardSize}_moves`;
    let movesRankings = JSON.parse(localStorage.getItem(movesKey) || "[]");
    movesRankings.push(scoreData);
    movesRankings.sort((a, b) => a.moves - b.moves);
    movesRankings = movesRankings.slice(0, 5); // Keep top 5
    localStorage.setItem(movesKey, JSON.stringify(movesRankings));
  }

  updateTimer() {
    if (!this.isGameComplete) {
      this.timeElapsed++;
      this.timeText.setText("TIME: " + this.formatTime(this.timeElapsed));
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // Ensure the puzzle is solvable
    do {
      // Shuffle
      currentIndex = array.length;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    } while (!this.isSolvable(array));

    return array;
  }

  isSolvable(array) {
    let inversions = 0;
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] && array[j] && array[i] > array[j]) {
          inversions++;
        }
      }
    }

    // For odd-sized boards, number of inversions must be even
    if (this.boardSize % 2 === 1) {
      return inversions % 2 === 0;
    }

    // For even-sized boards, inversions + row of empty space from bottom must be odd
    const emptyRowFromBottom =
      this.boardSize - Math.floor(array.indexOf(null) / this.boardSize);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }

  preload() {
    // Temporarily comment out audio loading until you have the files
    // this.load.audio('move', 'assets/sounds/move.mp3');
    // this.load.audio('complete', 'assets/sounds/complete.mp3');
    // this.load.audio('background', 'assets/sounds/background.mp3');
  }

  shutdown() {
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    this.tiles.forEach((tile) => {
      tile.sprite.destroy();
      tile.text.destroy();
    });
    this.tiles = [];
  }
}
