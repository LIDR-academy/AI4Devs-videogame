class Memorama {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('startGame');
        this.difficultySelect = document.getElementById('difficulty');
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.difficultySettings = {
            easy: { time: 45, penalty: 1 },
            medium: { time: 30, penalty: 2 },
            hard: { time: 15, penalty: 3 }
        };
        this.currentDifficulty = 'hard';
        this.timeLeft = this.difficultySettings[this.currentDifficulty].time;
        this.timer = null;
        this.isPlaying = false;
        
        this.icons = [
            'javascript.png', 'go-lang.png', 'cpp.png', 'python.png',
            'html5.png', 'typescript.png', 'php.png', 'css.png'
        ];

        this.startButton.addEventListener('click', () => this.startGame());
        this.difficultySelect.addEventListener('change', () => {
            if (!this.isPlaying) {
                this.currentDifficulty = this.difficultySelect.value;
                this.timeLeft = this.difficultySettings[this.currentDifficulty].time;
                this.timeDisplay.textContent = this.timeLeft;
            }
        });
    }

    startGame() {
        if (this.isPlaying) return;
        
        this.resetGame();
        this.createBoard();
        this.startTimer();
        this.isPlaying = true;
        this.startButton.disabled = true;
        this.difficultySelect.disabled = true;
    }

    resetGame() {
        this.gameBoard.innerHTML = '';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.currentDifficulty = this.difficultySelect.value;
        this.timeLeft = this.difficultySettings[this.currentDifficulty].time;
        this.timeDisplay.textContent = this.timeLeft;
        this.timeDisplay.className = 'timer';
        
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    createBoard() {
        const cardPairs = [...this.icons, ...this.icons];
        this.shuffleArray(cardPairs);

        cardPairs.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.icon = icon;
            card.dataset.index = index;

            // Crear cara frontal (imagen del lenguaje)
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            cardFront.style.backgroundImage = `url('images/${icon}')`;

            // Crear cara trasera (signo de interrogación)
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';
            cardBack.style.backgroundImage = `url('images/pregunta.png')`;

            // Agregar caras a la tarjeta
            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
            this.cards.push(card);
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    flipCard(card) {
        if (!this.isPlaying || 
            this.flippedCards.includes(card) || 
            card.classList.contains('matched') ||
            this.flippedCards.length >= 2) return;

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.icon === card2.dataset.icon;

        if (match) {
            this.handleMatch();
        } else {
            this.handleMismatch();
        }
    }

    handleMatch() {
        this.flippedCards.forEach(card => {
            card.classList.add('matched');
        });
        this.flippedCards = [];
        this.matchedPairs++;
        this.timeLeft += 10;
        this.timeDisplay.textContent = this.timeLeft;
        this.timeDisplay.classList.add('success');
        setTimeout(() => {
            this.timeDisplay.classList.remove('success');
        }, 1000);

        if (this.matchedPairs === this.icons.length) {
            this.endGame(true);
        }
    }

    handleMismatch() {
        const penalty = this.difficultySettings[this.currentDifficulty].penalty;
        this.timeLeft -= penalty;
        this.timeDisplay.textContent = this.timeLeft;
        this.timeDisplay.classList.add('error');
        setTimeout(() => {
            this.timeDisplay.classList.remove('error');
        }, 1000);

        setTimeout(() => {
            this.flippedCards.forEach(card => {
                card.classList.remove('flipped');
            });
            this.flippedCards = [];
        }, 1000);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timeDisplay.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }

    endGame(won) {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.startButton.disabled = false;
        this.difficultySelect.disabled = false;
        
        if (won) {
            alert('¡Felicidades! Has ganado el juego.');
        } else {
            alert('¡Se acabó el tiempo! Has perdido el juego.');
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new Memorama();
});
