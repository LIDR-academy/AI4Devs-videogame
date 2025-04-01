class UIController {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.colorMap = {
            1: 'var(--color-1)', // Red
            2: 'var(--color-2)', // Green
            3: 'var(--color-3)', // Blue
            4: 'var(--color-4)', // Yellow
            5: 'var(--color-5)', // Purple
            6: 'var(--color-6)', // Orange
            7: 'var(--color-7)', // Magenta
            8: 'var(--color-8)'  // Teal
        };
        
        // DOM Elements
        this.gameBoard = document.getElementById('game-board');
        this.moveCounter = document.getElementById('move-count');
        this.colorControls = document.querySelector('.color-controls');
        
        // Buttons
        this.newGameBtn = document.getElementById('new-game-btn');
        
        // Register for game events
        this.gameEngine.onBoardUpdate = this.updateBoard.bind(this);
        this.gameEngine.onMoveMade = this.updateMoveCounter.bind(this);
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    // Set up event listeners
    setupEventListeners() {
        // New game button
        this.newGameBtn.addEventListener('click', () => {
            this.gameEngine.newGame();
        });
        
        // Keyboard events for color selection
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    // Handle key presses for color selection
    handleKeyDown(e) {
        if (this.gameEngine.isGameOver()) return;
        
        const key = e.key;
        
        // Prevent default behavior for arrow keys to avoid page scrolling
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
            // Prevent default behavior (scrolling)
            e.preventDefault();
            
            if (key === 'ArrowLeft') {
                this.selectPreviousColor();
            } else if (key === 'ArrowRight') {
                this.selectNextColor();
            } else if (key === 'ArrowUp' || key === 'ArrowDown') {
                // Determine selected color
                const selectedColor = document.querySelector('.color-btn.selected');
                const colorValue = selectedColor ? parseInt(selectedColor.dataset.color) : null;
                
                if (colorValue && colorValue !== this.gameEngine.getCurrentColor()) {
                    this.gameEngine.makeMove(colorValue);
                }
            }
        }
    }
    
    // Select previous color
    selectPreviousColor() {
        const currentSelected = document.querySelector('.color-btn.selected');
        let index = 0;
        
        if (currentSelected) {
            const colorBtns = document.querySelectorAll('.color-btn');
            for (let i = 0; i < colorBtns.length; i++) {
                if (colorBtns[i] === currentSelected) {
                    index = i;
                    break;
                }
            }
            
            currentSelected.classList.remove('selected');
            index = (index - 1 + colorBtns.length) % colorBtns.length;
        }
        
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns[index].classList.add('selected');
    }
    
    // Select next color
    selectNextColor() {
        const currentSelected = document.querySelector('.color-btn.selected');
        let index = 0;
        
        if (currentSelected) {
            const colorBtns = document.querySelectorAll('.color-btn');
            for (let i = 0; i < colorBtns.length; i++) {
                if (colorBtns[i] === currentSelected) {
                    index = i;
                    break;
                }
            }
            
            currentSelected.classList.remove('selected');
            index = (index + 1) % colorBtns.length;
        }
        
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns[index].classList.add('selected');
    }
    
    // Update the game board display
    updateBoard(board, floodedTiles) {
        // Clear the board
        this.gameBoard.innerHTML = '';
        
        // Set up the grid style
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.gameEngine.gridSize}, 1fr)`;
        this.gameBoard.style.gridTemplateRows = `repeat(${this.gameEngine.gridSize}, 1fr)`;
        
        // Create tiles
        for (let row = 0; row < this.gameEngine.gridSize; row++) {
            for (let col = 0; col < this.gameEngine.gridSize; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.dataset.color = board[row][col];
                tile.style.backgroundColor = this.colorMap[board[row][col]];
                
                // Mark flooded tiles
                if (floodedTiles.has(`${row},${col}`)) {
                    tile.classList.add('flooded');
                }
                
                // Add wizard directly to the origin tile as we create it
                if (row === 0 && col === 0) {
                    tile.classList.add('origin-tile');
                }
                
                this.gameBoard.appendChild(tile);
            }
        }
        
        // Add wizard to origin tile after all tiles are created
        this.addWizardToOrigin();
        
        // Update color controls
        this.updateColorControls();
    }
    
    // Update move counter
    updateMoveCounter(moves, currentColor) {
        // Make sure we're updating the DOM element with the new moves count
        this.moveCounter.textContent = moves;
        
        // Update color buttons to reflect current color
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('current');
            if (parseInt(btn.dataset.color) === currentColor) {
                btn.classList.add('current');
            }
        });
    }
    
    // Update color control buttons
    updateColorControls() {
        this.colorControls.innerHTML = '';
        
        for (let i = 1; i <= this.gameEngine.colorCount; i++) {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-btn';
            colorBtn.dataset.color = i;
            colorBtn.style.backgroundColor = this.colorMap[i];
            
            // Mark current color
            if (i === this.gameEngine.getCurrentColor()) {
                colorBtn.classList.add('current');
            }
            
            colorBtn.addEventListener('click', this.handleColorClick.bind(this));
            this.colorControls.appendChild(colorBtn);
        }
    }
    
    // Handle color button click
    handleColorClick(e) {
        if (this.gameEngine.isGameOver()) return;
        
        const colorValue = parseInt(e.target.dataset.color);
        
        // Remove selected class from all buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        e.target.classList.add('selected');
        
        // If it's not the current color, make a move
        if (colorValue !== this.gameEngine.getCurrentColor()) {
            this.gameEngine.makeMove(colorValue);
        }
    }
    
    // Add wizard to the origin tile
    addWizardToOrigin() {
        // Find the origin tile (0,0)
        const originTile = document.querySelector('.tile[data-row="0"][data-col="0"]');
        
        if (originTile) {
            // Create wizard container
            const wizardContainer = document.createElement('div');
            wizardContainer.className = 'wizard-container';
            
            // Create wizard element with direct image, not svg
            const wizard = document.createElement('div');
            wizard.className = 'wizard';
            
            // Create image element for better control
            const wizardImg = document.createElement('img');
            wizardImg.src = 'assets/wizard.png';
            wizardImg.alt = 'Wizard';
            wizardImg.className = 'wizard-img';
            
            // Add the image to the wizard
            wizard.appendChild(wizardImg);
            
            // Add to container
            wizardContainer.appendChild(wizard);
            
            // Add to origin tile
            originTile.appendChild(wizardContainer);
            
            // Start sparkle animation
            this.createSparkles(wizardContainer);
        }
    }
    
    // Create sparkle animation
    createSparkles(container) {
        // Create 5 sparkle elements
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            container.appendChild(sparkle);
            
            // Position randomly around the wizard
            this.animateSparkle(sparkle);
        }
        
        // Continue creating sparkles
        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            container.appendChild(sparkle);
            this.animateSparkle(sparkle);
        }, 300);
    }
    
    // Animate a single sparkle
    animateSparkle(sparkle) {
        // Random position around the wizard
        const angle = Math.random() * Math.PI * 2;
        const distance = 10 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        sparkle.style.left = `calc(50% + ${x}px)`;
        sparkle.style.top = `calc(50% + ${y}px)`;
        
        // Random size
        const size = 3 + Math.random() * 5;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Random color - star-like colors
        const colors = ['#fff', '#ffe9c4', '#d4fbff'];
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = `0 0 ${2 + Math.random() * 4}px ${sparkle.style.backgroundColor}`;
        
        // Apply animation
        sparkle.style.animation = `sparkle-animation ${0.5 + Math.random() * 1}s linear forwards`;
        
        // Remove sparkle after animation completes
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1500);
    }

    // Add this method to encode the image as Base64
    // You would run this once to get the Base64 string, then hardcode it
    async encodeImageToBase64(imagePath) {
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error encoding image:', error);
            return null;
        }
    }
} 