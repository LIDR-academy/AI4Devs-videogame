class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.setCanvasSize();

    // Game state
    this.gameState = 'menu'; // menu, playing, paused, gameOver
    this.score = { player1: 0, player2: 0 };
    this.winningScore = 5;

    // Game objects
    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      size: 16,
      speed: 5,
      dx: 5,
      dy: 5
    };

    this.paddleHeight = 100;
    this.paddleWidth = 10;
    this.paddleSpeed = 8;

    this.player1 = {
      y: (this.canvas.height - this.paddleHeight) / 2,
      score: 0
    };

    this.player2 = {
      y: (this.canvas.height - this.paddleHeight) / 2,
      score: 0
    };

    // Input handling
    this.keys = {};
    this.setupEventListeners();

    // Mouse control
    this.mouseControl = {
      enabled: true,
      y: this.player1.y
    };

    // Animation
    this.lastTime = 0;
    this.deltaTime = 0;

    // AI properties with improved initial difficulty
    this.ai = {
      difficulty: 0.2,         // Aumentado de 0.05
      reactionTime: 40,        // Reducido de 60
      maxSpeed: this.paddleSpeed * 0.3,  // Aumentado de 0.15
      errorMargin: 200,        // Reducido de 300
      difficultyIncrease: 0.01
    };

    // Add property to track initial phase
    this.initialPhase = true;

    // Score pause control
    this.scorePause = {
      active: false,
      duration: 2000, // 2 seconds
      startTime: 0
    };

    this.gameStartTime = 0; // To track game duration for difficulty scaling
  }

  setCanvasSize() {
    this.canvas.width = 800;
    this.canvas.height = 600;
  }

  setupEventListeners() {
    // Mouse controls
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.mouseControl.enabled) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        // Adjust the position so that the center of the paddle follows the mouse
        this.mouseControl.y = mouseY - this.paddleHeight / 2;
        // Keep the paddle within the canvas boundaries
        this.mouseControl.y = Math.max(0, Math.min(this.mouseControl.y, this.canvas.height - this.paddleHeight));
      }
    });

    // Existing menu controls
    document.getElementById('newGameBtn').addEventListener('click', () => this.startGame());
    document.getElementById('resumeButton').addEventListener('click', () => this.resumeGame());
    document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    document.getElementById('playAgainButton').addEventListener('click', () => this.restartGame());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'p' || e.key === ' ') {
        this.togglePause();
      }
      if (e.key === 'r') {
        this.restartGame();
      }
    });
  }

  startGame() {
    this.gameState = 'playing';
    this.gameStartTime = Date.now();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    this.resetBall();
    this.gameLoop(0);
  }

  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      document.getElementById('pauseMenu').classList.remove('hidden');
    } else if (this.gameState === 'paused') {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.gameState = 'playing';
    document.getElementById('pauseMenu').classList.add('hidden');
    this.gameLoop(this.lastTime);
  }

  restartGame() {
    this.score = { player1: 0, player2: 0 };
    this.updateScoreDisplay();
    this.resetBall();
    document.getElementById('gameOverMenu').classList.add('hidden');
    document.getElementById('pauseMenu').classList.add('hidden');
    this.startGame();
  }

  resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.speed = 5;

    // Make sure the ball has a meaningful initial direction
    const angle = Math.random() * Math.PI / 4 + Math.PI / 8; // Angle between π/8 and 3π/8
    const direction = Math.random() > 0.5 ? 1 : -1;

    this.ball.dx = Math.cos(angle) * this.ball.speed * direction;
    this.ball.dy = Math.sin(angle) * this.ball.speed * (Math.random() > 0.5 ? 1 : -1);
  }

  update(deltaTime) {
    if (this.gameState !== 'playing') return;

    // Check if we're in score pause
    if (this.scorePause.active) {
      if (Date.now() - this.scorePause.startTime >= this.scorePause.duration) {
        this.scorePause.active = false;
      } else {
        return; // Skip update while paused
      }
    }

    // Player 1 movement (mouse or keyboard)
    if (this.mouseControl.enabled) {
      // Smooth movement towards mouse position
      const diff = this.mouseControl.y - this.player1.y;
      this.player1.y += diff * 0.2; // Adjust this value to change the smoothness of the movement
    } else {
      // Keyboard controls
      if (this.keys['w'] && this.player1.y > 0) {
        this.player1.y -= this.paddleSpeed;
      }
      if (this.keys['s'] && this.player1.y < this.canvas.height - this.paddleHeight) {
        this.player1.y += this.paddleSpeed;
      }
    }

    // AI movement (player 2)
    this.updateAI();

    // Ball movement
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Ball collision with top and bottom
    if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
      this.ball.dy *= -1;
    }

    // Ball collision with paddles
    if (this.checkPaddleCollision()) {
      this.ball.speed *= 1.05; // Increase speed
    }

    // Scoring
    if (this.ball.x <= 0) {
      this.score.player2++;
      this.onScore();
    } else if (this.ball.x >= this.canvas.width) {
      this.score.player1++;
      this.onScore();
    }

    // Keep player1 paddle within bounds
    this.player1.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.player1.y));
  }

  updateAI() {
    // Check if player1 has scored 2 points and we're still in initial phase
    if (this.initialPhase && this.score.player1 >= 2) {
      this.initialPhase = false;
      // Further improve AI after player scores 2 points
      this.ai.difficulty = 0.4;        // Aumentado de 0.3
      this.ai.reactionTime = 25;       // Reducido de 30
      this.ai.maxSpeed = this.paddleSpeed * 0.5;  // Aumentado de 0.4
      this.ai.errorMargin = 120;       // Reducido de 150
    }

    // Only move if ball is moving towards AI and is in the right half of the field
    if (this.ball.dx > 0 && this.ball.x > this.canvas.width / 2) {
      const prediction = this.predictBallPosition();
      const paddleCenter = this.player2.y + this.paddleHeight / 2;

      // Add more randomness to prediction based on initial phase
      const randomError =
        (Math.random() - 0.5) *
        this.ai.errorMargin *
        (this.initialPhase ? 1.8 : 1.5 - this.ai.difficulty);  // Reducido de 2.5
      const targetY = prediction + randomError;

      // Higher chance to update during initial phase
      if (Math.random() > (this.initialPhase ? 0.5 : 0.7)) {  // Aumentado de 0.3
        return;
      }

      // Move paddle more quickly during initial phase
      if (Math.abs(paddleCenter - targetY) > this.paddleHeight / 3) {
        const moveSpeed =
          this.ai.maxSpeed *
          (this.initialPhase
            ? 0.5  // Aumentado de 0.3
            : Math.min(0.6, Math.abs(paddleCenter - targetY) / 200));
        if (paddleCenter < targetY) {
          this.player2.y += moveSpeed;
        } else {
          this.player2.y -= moveSpeed;
        }
      }
    }

    // Keep paddle within bounds
    this.player2.y = Math.max(
      0,
      Math.min(this.canvas.height - this.paddleHeight, this.player2.y)
    );
  }

  predictBallPosition() {
    // Add random error to the prediction
    const randomOffset = (Math.random() - 0.5) * 100;

    const ballTrajectorySlope = this.ball.dy / this.ball.dx;
    const intersectX = this.canvas.width - this.paddleWidth;
    let intersectY =
      this.ball.y +
      ballTrajectorySlope * (intersectX - this.ball.x) +
      randomOffset;

    // Account for bounces with more error
    const bounces = Math.floor(Math.abs(intersectY) / this.canvas.height);
    intersectY =
      bounces % 2 === 0
        ? intersectY % this.canvas.height
        : this.canvas.height - (intersectY % this.canvas.height);

    return intersectY;
  }

  checkPaddleCollision() {
    // Left paddle
    if (
      this.ball.x <= this.paddleWidth &&
      this.ball.y >= this.player1.y &&
      this.ball.y <= this.player1.y + this.paddleHeight
    ) {
      this.ball.dx = Math.abs(this.ball.dx);
      this.calculateDeflection(this.player1.y);
      return true;
    }
    // Right paddle
    if (
      this.ball.x >= this.canvas.width - this.paddleWidth &&
      this.ball.y >= this.player2.y &&
      this.ball.y <= this.player2.y + this.paddleHeight
    ) {
      this.ball.dx = -Math.abs(this.ball.dx);
      this.calculateDeflection(this.player2.y);
      return true;
    }
    return false;
  }

  calculateDeflection(paddleY) {
    const relativeIntersectY = paddleY + this.paddleHeight / 2 - this.ball.y;
    const normalizedIntersectY = relativeIntersectY / (this.paddleHeight / 2);
    const bounceAngle = (normalizedIntersectY * Math.PI) / 4;
    this.ball.dy = -this.ball.speed * Math.sin(bounceAngle);
  }

  onScore() {
    this.updateScoreDisplay();

    if (
      this.score.player1 >= this.winningScore ||
      this.score.player2 >= this.winningScore
    ) {
      this.gameOver();
    } else {
      // Activate the pause
      this.scorePause.active = true;
      this.scorePause.startTime = Date.now();

      // Place the ball in the center during the pause
      this.ball.x = this.canvas.width / 2;
      this.ball.y = this.canvas.height / 2;
      this.ball.dx = 0;
      this.ball.dy = 0;

      // Schedule ball reset after the pause
      setTimeout(() => {
        if (this.gameState === 'playing') {
          this.resetBall();
        }
      }, this.scorePause.duration);
    }
  }

  updateScoreDisplay() {
    document.getElementById('player1Score').textContent = this.score.player1;
    document.getElementById('player2Score').textContent = this.score.player2;
  }

  gameOver() {
    this.gameState = 'gameOver';
    const winner =
      this.score.player1 > this.score.player2 ? 'Player 1' : 'Player 2';
    document.getElementById('winnerText').textContent = `${winner} wins!`;
    document.getElementById('gameOverMenu').classList.remove('hidden');
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw center line
    this.ctx.setLineDash([10, 10]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw paddles
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, this.player1.y, this.paddleWidth, this.paddleHeight);
    this.ctx.fillRect(
      this.canvas.width - this.paddleWidth,
      this.player2.y,
      this.paddleWidth,
      this.paddleHeight
    );

    // Draw ball
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw score pause indicator
    if (this.scorePause.active) {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      const timeLeft = Math.ceil(
        (this.scorePause.duration -
          (Date.now() - this.scorePause.startTime)) /
          1000
      );
      this.ctx.fillText(
        `Next round in ${timeLeft}...`,
        this.canvas.width / 2 - 20,
        this.canvas.height / 2 - 20
      );
      this.ctx.textAlign = 'left'; // Reset text align
    }
  }

  gameLoop(timestamp) {
    this.deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(this.deltaTime);
    this.draw();

    if (this.gameState !== 'gameOver') {
      requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
  }
}

// Start the game when the page loads
window.onload = () => {
  const game = new Game();
  document.getElementById('newGameBtn').addEventListener('click', () =>
    game.startGame()
  );
};
