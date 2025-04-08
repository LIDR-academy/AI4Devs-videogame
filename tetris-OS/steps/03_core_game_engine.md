# Tetris MVP - Core Game Engine

## Tetromino Physics Implementation

### Tetromino Definition

Each tetromino is defined by a 4×4 matrix representing its shape and rotation state:

```javascript
// Example: I-piece (cyan)
const I_TETROMINO = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
```

All seven standard tetrominos (I, O, T, S, Z, J, L) are defined with unique IDs and colors.

### Movement Mechanics

```javascript
class Tetromino {
  constructor(shape, color, id) {
    this.shape = shape;
    this.color = color;
    this.id = id;
    this.x = 3; // Starting position (center of board)
    this.y = 0; // Top of board
    this.rotation = 0; // Current rotation state (0-3)
  }
  
  // Move piece horizontally
  moveX(direction, board) {
    const newX = this.x + direction;
    if (!this.checkCollision(newX, this.y, this.shape, board)) {
      this.x = newX;
      return true;
    }
    return false;
  }
  
  // Move piece down
  moveDown(board) {
    const newY = this.y + 1;
    if (!this.checkCollision(this.x, newY, this.shape, board)) {
      this.y = newY;
      return true;
    }
    return false; // Collision detected, piece should lock
  }
  
  // Hard drop - move to lowest possible position
  hardDrop(board) {
    let dropDistance = 0;
    while (this.moveDown(board)) {
      dropDistance++;
    }
    return dropDistance; // For score calculation
  }
}
```

### Gravity System

The gravity system controls the speed at which pieces fall:

```javascript
class GravitySystem {
  constructor() {
    this.level = 1;
    this.dropInterval = this.calculateDropInterval(this.level);
    this.lastDropTime = 0;
  }
  
  // Calculate drop interval based on level
  calculateDropInterval(level) {
    // Classic NES Tetris formula (frames)
    // Converted to milliseconds
    return Math.max(100, 1000 - ((level - 1) * 50));
  }
  
  // Update level based on lines cleared
  updateLevel(linesCleared) {
    this.level = 1 + Math.floor(linesCleared / 10);
    this.dropInterval = this.calculateDropInterval(this.level);
  }
  
  // Check if it's time to drop the piece
  shouldDropPiece(currentTime) {
    if (currentTime - this.lastDropTime > this.dropInterval) {
      this.lastDropTime = currentTime;
      return true;
    }
    return false;
  }
}
```

## Collision Detection System

### Grid-Based Collision

```javascript
class CollisionSystem {
  // Check if a piece would collide at the specified position
  checkCollision(x, y, shape, board) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const boardX = x + col;
          const boardY = y + row;
          
          // Check boundaries
          if (
            boardX < 0 || 
            boardX >= board.width ||
            boardY >= board.height
          ) {
            return true;
          }
          
          // Skip collision check above the board
          if (boardY < 0) {
            continue;
          }
          
          // Check collision with locked pieces
          if (board.grid[boardY][boardX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  // Check if a piece can be spawned at starting position
  checkGameOver(piece, board) {
    return this.checkCollision(piece.x, piece.y, piece.shape, board);
  }
}
```

### Piece Locking

```javascript
class BoardManager {
  // Lock the current piece into the board
  lockPiece(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] !== 0) {
          const boardX = piece.x + col;
          const boardY = piece.y + row;
          
          // Only lock if within board boundaries
          if (
            boardX >= 0 && 
            boardX < this.width &&
            boardY >= 0 && 
            boardY < this.height
          ) {
            this.grid[boardY][boardX] = piece.id;
          }
        }
      }
    }
    
    // After locking, check for completed lines
    return this.clearLines();
  }
}
```

## Rotation Logic

### Super Rotation System (SRS)

The SRS is the modern rotation system used in most Tetris implementations, handling wall kicks and special edge cases.

```javascript
class RotationSystem {
  constructor() {
    // Wall kick data (JLSTZPiece)
    this.jlstzKickData = [
      [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],  // 0->1
      [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],      // 1->2
      [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],     // 2->3
      [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]    // 3->0
    ];
    
    // Wall kick data (IPiece)
    this.iKickData = [
      [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],    // 0->1
      [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],    // 1->2
      [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],    // 2->3
      [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]     // 3->0
    ];
  }
  
  // Rotate a piece clockwise
  rotate(piece, board) {
    const newRotation = (piece.rotation + 1) % 4;
    const newShape = this.getRotatedShape(piece.shape);
    
    // Get kick data based on piece type
    const kickData = piece.id === 1 ? this.iKickData : this.jlstzKickData;
    const tests = kickData[piece.rotation];
    
    // Try each kick offset
    for (const [offsetX, offsetY] of tests) {
      const newX = piece.x + offsetX;
      const newY = piece.y - offsetY; // Y is inverted in most game coordinates
      
      if (!board.checkCollision(newX, newY, newShape)) {
        // Rotation successful with this offset
        piece.shape = newShape;
        piece.rotation = newRotation;
        piece.x = newX;
        piece.y = newY;
        return true;
      }
    }
    
    // No valid rotation found
    return false;
  }
  
  // Rotate a matrix 90 degrees clockwise
  getRotatedShape(shape) {
    const size = shape.length;
    const rotated = Array(size).fill().map(() => Array(size).fill(0));
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        rotated[x][size - 1 - y] = shape[y][x];
      }
    }
    
    return rotated;
  }
}
```

## Graphics Programming & Rendering System

### Canvas-Based Renderer

```javascript
class Renderer {
  constructor(canvas, blockSize = 30) {
    this.ctx = canvas.getContext('2d');
    this.blockSize = blockSize;
    this.colors = [
      'transparent',  // Empty cell
      '#00FFFF',      // I - Cyan
      '#FFFF00',      // O - Yellow
      '#800080',      // T - Purple
      '#00FF00',      // S - Green
      '#FF0000',      // Z - Red
      '#0000FF',      // J - Blue
      '#FF7F00'       // L - Orange
    ];
  }
  
  // Clear the entire canvas
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  
  // Draw the board grid
  drawBoard(board) {
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const cellValue = board.grid[y][x];
        if (cellValue !== 0) {
          this.drawBlock(x, y, cellValue);
        }
      }
    }
    
    // Draw grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= board.width; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.blockSize, 0);
      this.ctx.lineTo(x * this.blockSize, board.height * this.blockSize);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= board.height; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.blockSize);
      this.ctx.lineTo(board.width * this.blockSize, y * this.blockSize);
      this.ctx.stroke();
    }
  }
  
  // Draw a single tetromino block
  drawBlock(x, y, colorIndex) {
    const blockSize = this.blockSize;
    
    // Fill block
    this.ctx.fillStyle = this.colors[colorIndex];
    this.ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    // Draw highlight (3D effect)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.beginPath();
    this.ctx.moveTo(x * blockSize, y * blockSize);
    this.ctx.lineTo((x + 1) * blockSize, y * blockSize);
    this.ctx.lineTo(x * blockSize, (y + 1) * blockSize);
    this.ctx.fill();
    
    // Draw shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.moveTo((x + 1) * blockSize, y * blockSize);
    this.ctx.lineTo((x + 1) * blockSize, (y + 1) * blockSize);
    this.ctx.lineTo(x * blockSize, (y + 1) * blockSize);
    this.ctx.fill();
    
    // Draw border
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
  }
  
  // Draw active piece
  drawPiece(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          // Only draw if within visible board
          if (boardY >= 0) {
            this.drawBlock(boardX, boardY, piece.id);
          }
        }
      }
    }
  }
  
  // Draw ghost piece (shadow of where piece will land)
  drawGhostPiece(piece, ghostY) {
    this.ctx.globalAlpha = 0.3;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = ghostY + y;
          
          // Only draw if within visible board
          if (boardY >= 0) {
            this.drawBlock(boardX, boardY, piece.id);
          }
        }
      }
    }
    
    this.ctx.globalAlpha = 1.0;
  }
  
  // Draw next piece preview
  drawNextPiece(piece, x, y) {
    // Center piece in preview box
    const offsetX = x + (2 - piece.shape[0].length / 2);
    const offsetY = y + (2 - piece.shape.length / 2);
    
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] !== 0) {
          this.drawBlock(offsetX + col, offsetY + row, piece.id);
        }
      }
    }
  }
}
```

### Animation System

```javascript
class AnimationSystem {
  constructor(renderer) {
    this.renderer = renderer;
    this.animations = [];
  }
  
  // Add a line clear animation
  addLineClearAnimation(lineIndices) {
    this.animations.push({
      type: 'lineClear',
      lines: lineIndices,
      startTime: performance.now(),
      duration: 200 // milliseconds
    });
  }
  
  // Add level up animation
  addLevelUpAnimation(level) {
    this.animations.push({
      type: 'levelUp',
      level: level,
      startTime: performance.now(),
      duration: 500 // milliseconds
    });
  }
  
  // Update and render all active animations
  update(currentTime) {
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      const elapsed = currentTime - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);
      
      if (progress >= 1) {
        this.animations.splice(i, 1);
        continue;
      }
      
      this.renderAnimation(anim, progress);
    }
    
    return this.animations.length > 0;
  }
  
  // Render specific animation based on type
  renderAnimation(anim, progress) {
    switch (anim.type) {
      case 'lineClear':
        this.renderLineClearAnimation(anim, progress);
        break;
      case 'levelUp':
        this.renderLevelUpAnimation(anim, progress);
        break;
    }
  }
  
  // Render line clear animation (white flash + disappear)
  renderLineClearAnimation(anim, progress) {
    const ctx = this.renderer.ctx;
    const blockSize = this.renderer.blockSize;
    
    for (const lineY of anim.lines) {
      // Flash white then fade out
      if (progress < 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - progress * 2})`;
      } else {
        // Skip second half, let the regular game loop handle clearing
        return;
      }
      
      ctx.fillRect(
        0, 
        lineY * blockSize, 
        ctx.canvas.width, 
        blockSize
      );
    }
  }
  
  // Render level up animation (screen flash)
  renderLevelUpAnimation(anim, progress) {
    const ctx = this.renderer.ctx;
    
    if (progress < 0.2) {
      // Flash in
      ctx.fillStyle = `rgba(255, 255, 255, ${progress * 5})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else if (progress < 0.8) {
      // Hold
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Display level text
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `LEVEL ${anim.level}!`, 
        ctx.canvas.width / 2, 
        ctx.canvas.height / 2
      );
    } else {
      // Flash out
      const alpha = (1 - progress) * 5;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }
}
```

## Integration: Game Loop

The game loop ties everything together, maintaining a consistent update frequency and handling the game's flow.

```javascript
class GameLoop {
  constructor(game, renderer, input) {
    this.game = game;
    this.renderer = renderer;
    this.input = input;
    this.lastTime = 0;
    this.accumulator = 0;
    this.timestep = 1000 / 60; // 60 FPS
    this.running = false;
    this.animationFrame = null;
  }
  
  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.loop.bind(this));
  }
  
  stop() {
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  loop(currentTime) {
    if (!this.running) return;
    
    // Calculate elapsed time
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Avoid spiral of death with large delta time
    if (deltaTime > 1000) {
      this.animationFrame = requestAnimationFrame(this.loop.bind(this));
      return;
    }
    
    // Update input state
    this.input.update();
    
    // Fixed timestep updates
    this.accumulator += deltaTime;
    while (this.accumulator >= this.timestep) {
      this.game.update(this.timestep, this.input);
      this.accumulator -= this.timestep;
    }
    
    // Render at display framerate
    this.renderer.clear();
    this.game.render(this.renderer, this.accumulator / this.timestep);
    
    this.animationFrame = requestAnimationFrame(this.loop.bind(this));
  }
}
```

## Performance Optimization

### Efficient Rendering

- Using dirty rectangle technique to only redraw changed areas
- Pre-calculating rotation matrices to avoid recalculations
- Caching tetromino shapes and colors

### Memory Management

- Object pooling for frequently created objects (animations, effects)
- Minimizing garbage collection triggers by reusing objects
- Using typed arrays for grid data when applicable

### Input Handling

- Input buffering for precise rotation and movement timing
- Key repeat rate limiting to prevent overwhelming the game loop
- Action queueing for complex inputs and combos 