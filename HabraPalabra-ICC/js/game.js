/**
 * HabraPalabra Game
 * A word puzzle game where players connect adjacent letters to form words
 */

// Game classes using OOP approach
class LetterTile {
    constructor(letter, points, row, col) {
        this.letter = letter;
        this.points = points;
        this.row = row;
        this.col = col;
        this.element = null;
        this.selected = false;
    }

    createElement() {
        const tileElement = document.createElement('div');
        tileElement.className = `letter-tile pt-${this.points}`;
        tileElement.dataset.row = this.row;
        tileElement.dataset.col = this.col;

        const letterElement = document.createElement('div');
        letterElement.className = 'letter';
        letterElement.textContent = this.letter;
        
        const pointsElement = document.createElement('div');
        pointsElement.className = 'points';
        pointsElement.textContent = this.points;

        tileElement.appendChild(letterElement);
        tileElement.appendChild(pointsElement);
        
        this.element = tileElement;
        return tileElement;
    }

    toggleSelected() {
        this.selected = !this.selected;
        this.element.classList.toggle('selected', this.selected);
    }

    setSelected(selected) {
        this.selected = selected;
        this.element.classList.toggle('selected', selected);
    }
}

class GameBoard {
    constructor(size = 4, language = 'english') {
        this.size = size;
        this.language = language;
        this.grid = [];
        this.boardElement = document.querySelector('.game-board');
        this.selectedTiles = [];
        this.currentWord = '';
    }

    initialize() {
        this.boardElement.innerHTML = '';
        this.boardElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
        
        // Create empty grid
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(null));
        
        // Generate random letters for the grid
        this.generateRandomGrid();
        
        // Create DOM elements for tiles
        this.createTileElements();
        
        // Add event listeners
        this.setupEventListeners();
    }

    generateRandomGrid() {
        // Letter frequency based on language selected
        let letterPool;
        
        if (this.language === 'spanish') {
            letterPool = [
                { letter: 'A', points: 1, frequency: 12 },
                { letter: 'B', points: 3, frequency: 2 },
                { letter: 'C', points: 3, frequency: 4 },
                { letter: 'D', points: 2, frequency: 5 },
                { letter: 'E', points: 1, frequency: 12 },
                { letter: 'F', points: 4, frequency: 1 },
                { letter: 'G', points: 2, frequency: 2 },
                { letter: 'H', points: 4, frequency: 1 },
                { letter: 'I', points: 1, frequency: 6 },
                { letter: 'J', points: 8, frequency: 1 },
                { letter: 'L', points: 1, frequency: 5 },
                { letter: 'M', points: 3, frequency: 2 },
                { letter: 'N', points: 1, frequency: 6 },
                { letter: 'Ñ', points: 8, frequency: 1 },
                { letter: 'O', points: 1, frequency: 9 },
                { letter: 'P', points: 3, frequency: 2 },
                { letter: 'Q', points: 5, frequency: 1 },
                { letter: 'R', points: 1, frequency: 6 },
                { letter: 'S', points: 1, frequency: 7 },
                { letter: 'T', points: 1, frequency: 4 },
                { letter: 'U', points: 1, frequency: 5 },
                { letter: 'V', points: 4, frequency: 1 },
                { letter: 'X', points: 8, frequency: 1 },
                { letter: 'Y', points: 4, frequency: 1 },
                { letter: 'Z', points: 10, frequency: 1 }
            ];
        } else {
            letterPool = [
                { letter: 'A', points: 1, frequency: 9 },
                { letter: 'B', points: 3, frequency: 2 },
                { letter: 'C', points: 3, frequency: 2 },
                { letter: 'D', points: 2, frequency: 4 },
                { letter: 'E', points: 1, frequency: 12 },
                { letter: 'F', points: 4, frequency: 2 },
                { letter: 'G', points: 2, frequency: 3 },
                { letter: 'H', points: 4, frequency: 2 },
                { letter: 'I', points: 1, frequency: 9 },
                { letter: 'J', points: 8, frequency: 1 },
                { letter: 'K', points: 5, frequency: 1 },
                { letter: 'L', points: 1, frequency: 4 },
                { letter: 'M', points: 3, frequency: 2 },
                { letter: 'N', points: 1, frequency: 6 },
                { letter: 'O', points: 1, frequency: 8 },
                { letter: 'P', points: 3, frequency: 2 },
                { letter: 'Q', points: 10, frequency: 1 },
                { letter: 'R', points: 1, frequency: 6 },
                { letter: 'S', points: 1, frequency: 4 },
                { letter: 'T', points: 1, frequency: 6 },
                { letter: 'U', points: 1, frequency: 4 },
                { letter: 'V', points: 4, frequency: 2 },
                { letter: 'W', points: 4, frequency: 2 },
                { letter: 'X', points: 8, frequency: 1 },
                { letter: 'Y', points: 4, frequency: 2 },
                { letter: 'Z', points: 10, frequency: 1 }
            ];
        }

        // Create a pool of letters based on their frequency
        const weightedPool = [];
        for (const item of letterPool) {
            for (let i = 0; i < item.frequency; i++) {
                weightedPool.push(item);
            }
        }

        // Randomly assign letters to the grid
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const randomIndex = Math.floor(Math.random() * weightedPool.length);
                const { letter, points } = weightedPool[randomIndex];
                this.grid[row][col] = new LetterTile(letter, points, row, col);
            }
        }
    }

    createTileElements() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.grid[row][col];
                const tileElement = tile.createElement();
                this.boardElement.appendChild(tileElement);
            }
        }
    }

    setupEventListeners() {
        // Add mouse event listeners to tiles
        this.boardElement.addEventListener('mousedown', this.handleTileMouseDown.bind(this));
        this.boardElement.addEventListener('mouseover', this.handleTileMouseOver.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Prevent text selection during drag
        this.boardElement.addEventListener('dragstart', e => e.preventDefault());
        
        // Cancel selection if mouse leaves game board during drag
        this.boardElement.addEventListener('mouseleave', () => {
            if (this.selectedTiles.length > 0) {
                this.clearSelection();
                this.boardElement.classList.remove('selecting');
            }
        });
        
        // Touch events for mobile
        this.boardElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.boardElement.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.boardElement.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }

    handleTileMouseDown(event) {
        // Prevent default browser selection behavior
        event.preventDefault();
        
        const tile = this.getTileFromEvent(event);
        if (tile) {
            // Add selecting class to change cursor
            this.boardElement.classList.add('selecting');
            this.startWordSelection(tile);
        }
    }

    handleTileMouseOver(event) {
        // Prevent default browser selection behavior
        event.preventDefault();
        
        if (this.selectedTiles.length === 0) return;
        
        const tile = this.getTileFromEvent(event);
        if (tile && !tile.selected) {
            // Check if this tile is adjacent to the last selected tile
            const lastTile = this.selectedTiles[this.selectedTiles.length - 1];
            if (this.areAdjacent(lastTile, tile)) {
                this.addTileToSelection(tile);
            }
        }
    }

    handleMouseUp(event) {
        // Prevent default browser selection behavior
        if (event) {
            event.preventDefault();
        }
        
        // Remove selecting class when done
        this.boardElement.classList.remove('selecting');
        
        if (this.selectedTiles.length > 0) {
            this.validateSelectedWord();
        }
    }

    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const tile = this.getTileFromTouch(touch);
        if (tile) {
            // Add selecting class for touch devices
            this.boardElement.classList.add('selecting');
            this.startWordSelection(tile);
        }
    }

    handleTouchMove(event) {
        event.preventDefault();
        if (this.selectedTiles.length === 0) return;
        
        const touch = event.touches[0];
        const tile = this.getTileFromTouch(touch);
        if (tile && !tile.selected) {
            const lastTile = this.selectedTiles[this.selectedTiles.length - 1];
            if (this.areAdjacent(lastTile, tile)) {
                this.addTileToSelection(tile);
            }
        }
    }

    handleTouchEnd(event) {
        event.preventDefault();
        
        // Remove selecting class when touch ends
        this.boardElement.classList.remove('selecting');
        
        if (this.selectedTiles.length > 0) {
            this.validateSelectedWord();
        }
    }

    getTileFromEvent(event) {
        const element = event.target.closest('.letter-tile');
        if (!element) return null;
        
        const row = parseInt(element.dataset.row);
        const col = parseInt(element.dataset.col);
        return this.grid[row][col];
    }

    getTileFromTouch(touch) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!element) return null;
        
        const tileElement = element.closest('.letter-tile');
        if (!tileElement) return null;
        
        const row = parseInt(tileElement.dataset.row);
        const col = parseInt(tileElement.dataset.col);
        return this.grid[row][col];
    }

    startWordSelection(tile) {
        this.clearSelection();
        this.addTileToSelection(tile);
    }

    addTileToSelection(tile) {
        tile.toggleSelected();
        this.selectedTiles.push(tile);
        this.updateCurrentWord();
    }

    updateCurrentWord() {
        this.currentWord = this.selectedTiles.map(tile => tile.letter).join('');
        document.getElementById('word-display').textContent = this.currentWord;
    }

    areAdjacent(tile1, tile2) {
        const rowDiff = Math.abs(tile1.row - tile2.row);
        const colDiff = Math.abs(tile1.col - tile2.col);
        // Tiles are adjacent if they are diagonally, horizontally, or vertically next to each other
        return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
    }

    clearSelection() {
        this.selectedTiles.forEach(tile => tile.setSelected(false));
        this.selectedTiles = [];
        this.currentWord = '';
        document.getElementById('word-display').textContent = '';
    }

    validateSelectedWord() {
        if (this.currentWord.length >= 3) {
            // Pass the word to the game for validation and scoring
            game.validateWord(this.currentWord, this.selectedTiles);
        }
        this.clearSelection();
    }
}

class Game {
    constructor() {
        this.board = null;
        this.score = 0;
        this.foundWords = [];
        this.timer = null;
        this.timeRemaining = 120; // 2 minutes by default
        this.difficulty = 'medium';
        this.language = 'english'; // Default language
        this.soundEnabled = true;
        this.hintsRemaining = 3;
        
        // DOM elements
        this.scoreElement = document.getElementById('current-score');
        this.timerElement = document.getElementById('timer');
        this.hintsElement = document.getElementById('hints');
        this.foundWordsElement = document.getElementById('found-words');
        
        // Modals
        this.tutorialModal = document.getElementById('tutorial-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.settingsModal = document.getElementById('settings-modal');
        
        // Buttons
        this.hintButton = document.getElementById('hint-btn');
        this.clearButton = document.getElementById('clear-btn');
        this.newGameButton = document.getElementById('new-game-btn');
        this.settingsButton = document.getElementById('settings-btn');
        this.helpButton = document.getElementById('help-btn');
        
        // Initialize
        this.init();
    }

    init() {
        // Create game board
        this.board = new GameBoard(4, this.language);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show tutorial on first visit
        if (!localStorage.getItem('tutorialSeen')) {
            this.showTutorial();
            localStorage.setItem('tutorialSeen', 'true');
        }
        
        // Load settings
        this.loadSettings();
        
        // Start new game
        this.startNewGame();
    }

    setupEventListeners() {
        // Game control buttons
        this.hintButton.addEventListener('click', this.useHint.bind(this));
        this.clearButton.addEventListener('click', () => this.board.clearSelection());
        
        // Menu buttons
        this.newGameButton.addEventListener('click', this.startNewGame.bind(this));
        this.settingsButton.addEventListener('click', this.showSettings.bind(this));
        this.helpButton.addEventListener('click', this.showTutorial.bind(this));
        
        // Tutorial modal
        document.getElementById('tutorial-ok-btn').addEventListener('click', () => {
            this.tutorialModal.classList.remove('active');
        });
        
        // Settings modal
        document.getElementById('save-settings-btn').addEventListener('click', this.saveSettings.bind(this));
        
        // Game over modal
        document.getElementById('play-again-btn').addEventListener('click', this.startNewGame.bind(this));
        
        // Close buttons for modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });
    }

    startNewGame() {
        // Reset game state
        this.score = 0;
        this.foundWords = [];
        clearInterval(this.timer);
        this.timeRemaining = parseInt(document.getElementById('game-time').value) || 120;
        this.hintsRemaining = 3;
        
        // Update UI
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeRemaining;
        this.hintsElement.textContent = this.hintsRemaining;
        this.foundWordsElement.innerHTML = '';
        
        // Update board language if needed
        if (this.board.language !== this.language) {
            this.board = new GameBoard(4, this.language);
        }
        
        // Initialize board with new letters
        this.board.initialize();
        
        // Start timer
        this.startTimer();
        
        // Close any open modals
        this.gameOverModal.classList.remove('active');
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.timerElement.textContent = this.timeRemaining;
            
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    validateWord(word, tiles) {
        word = word.toLowerCase();
        
        // Use the appropriate dictionary based on language
        const dictionary = this.language === 'spanish' ? window.spanishDictionary : window.englishDictionary;
        
        // Check if the word is in the dictionary and not already found
        if (dictionary.includes(word) && !this.foundWords.includes(word)) {
            // Calculate score based on word length and tile points
            const wordScore = this.calculateWordScore(tiles);
            
            // Add to found words
            this.foundWords.push(word);
            this.addWordToUI(word, wordScore);
            
            // Update score
            this.score += wordScore;
            this.scoreElement.textContent = this.score;
            
            return true;
        }
        
        return false;
    }

    calculateWordScore(tiles) {
        // Base score is sum of letter points
        let score = tiles.reduce((total, tile) => total + tile.points, 0);
        
        // Bonus for longer words
        if (tiles.length >= 5) score += 5;
        if (tiles.length >= 7) score += 10;
        if (tiles.length >= 9) score += 15;
        
        return score;
    }

    addWordToUI(word, score) {
        const listItem = document.createElement('li');
        listItem.textContent = `${word} (${score})`;
        this.foundWordsElement.appendChild(listItem);
    }

    useHint() {
        if (this.hintsRemaining <= 0) return;
        
        // Get valid words from current board that haven't been found yet
        const validWords = this.findValidWords();
        
        if (validWords.length > 0) {
            // Pick a random valid word
            const randomWord = validWords[Math.floor(Math.random() * validWords.length)];
            
            // Highlight the first letter of the word
            const firstLetter = randomWord.path[0];
            const tile = this.board.grid[firstLetter.row][firstLetter.col];
            
            // Visual hint - enhanced animation
            tile.element.classList.add('hint-active');
            
            // Keep the animation active for 3 seconds
            setTimeout(() => {
                tile.element.classList.remove('hint-active');
            }, 3000);
            
            // Reduce hints
            this.hintsRemaining--;
            this.hintsElement.textContent = this.hintsRemaining;
        }
    }

    findValidWords() {
        // This is a simplified implementation
        const validWords = [];
        
        // Use the appropriate dictionary
        const dictionary = this.language === 'spanish' ? window.spanishDictionary : window.englishDictionary;
        
        // Check a few random starting positions for valid words
        for (let attempts = 0; attempts < 20; attempts++) {
            const row = Math.floor(Math.random() * this.board.size);
            const col = Math.floor(Math.random() * this.board.size);
            const startTile = this.board.grid[row][col];
            
            // Try to find a word starting with this tile
            this.findWordsFromTile(startTile, [], '', validWords, dictionary);
        }
        
        return validWords;
    }

    findWordsFromTile(tile, path, currentWord, validWords, dictionary) {
        // Add current tile to path and update current word
        const newPath = [...path, { row: tile.row, col: tile.col }];
        const newWord = currentWord + tile.letter.toLowerCase();
        
        // Check if current word is a valid dictionary word and not already found
        if (newWord.length >= 3 && 
            dictionary.includes(newWord) && 
            !this.foundWords.includes(newWord)) {
            validWords.push({ word: newWord, path: newPath });
        }
        
        // Stop if path is too long
        if (newPath.length >= 7) return;
        
        // Check adjacent tiles
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                if (rowOffset === 0 && colOffset === 0) continue;
                
                const newRow = tile.row + rowOffset;
                const newCol = tile.col + colOffset;
                
                // Check if new position is within grid bounds
                if (newRow >= 0 && newRow < this.board.size && 
                    newCol >= 0 && newCol < this.board.size) {
                    
                    const nextTile = this.board.grid[newRow][newCol];
                    
                    // Check if tile is not already in path
                    if (!path.some(p => p.row === newRow && p.col === newCol)) {
                        this.findWordsFromTile(nextTile, newPath, newWord, validWords, dictionary);
                    }
                }
            }
        }
    }

    endGame() {
        clearInterval(this.timer);
        
        // Update game over modal
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('words-found-count').textContent = this.foundWords.length;
        
        // Show game over modal
        this.gameOverModal.classList.add('active');
    }

    showTutorial() {
        this.tutorialModal.classList.add('active');
    }

    showSettings() {
        // Update settings form with current values
        document.getElementById('language').value = this.language;
        document.getElementById('difficulty').value = this.difficulty;
        document.getElementById('game-time').value = parseInt(document.getElementById('game-time').value) || 120;
        document.getElementById('sound-toggle').checked = this.soundEnabled;
        
        // Show settings modal
        this.settingsModal.classList.add('active');
    }

    saveSettings() {
        // Get values from form
        const newLanguage = document.getElementById('language').value;
        this.difficulty = document.getElementById('difficulty').value;
        const gameTime = parseInt(document.getElementById('game-time').value);
        this.soundEnabled = document.getElementById('sound-toggle').checked;
        
        // Check if language changed
        const languageChanged = newLanguage !== this.language;
        this.language = newLanguage;
        
        // Save to localStorage
        localStorage.setItem('language', this.language);
        localStorage.setItem('difficulty', this.difficulty);
        localStorage.setItem('gameTime', gameTime);
        localStorage.setItem('soundEnabled', this.soundEnabled);
        
        // Close modal
        this.settingsModal.classList.remove('active');
        
        // Restart the game if language changed to update the board
        if (languageChanged) {
            this.startNewGame();
        }
    }

    loadSettings() {
        // Load settings from localStorage
        this.language = localStorage.getItem('language') || 'english';
        this.difficulty = localStorage.getItem('difficulty') || 'medium';
        const gameTime = parseInt(localStorage.getItem('gameTime')) || 120;
        this.soundEnabled = localStorage.getItem('soundEnabled') === 'true';
        
        // Update form elements
        document.getElementById('language').value = this.language;
        document.getElementById('difficulty').value = this.difficulty;
        document.getElementById('game-time').value = gameTime;
        document.getElementById('sound-toggle').checked = this.soundEnabled;
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
}); 