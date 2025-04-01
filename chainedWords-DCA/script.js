class ChainedWordsGame {
    constructor() {
        this.players = ['Jugador 1', 'Jugador 2'];
        this.currentPlayer = 0;
        this.scores = [0, 0];
        this.rounds = 3;
        this.timePerTurn = 30;
        this.currentWord = '';
        this.timer = null;
        this.gameActive = false;
        this.wordHistory = [];
        this.isGameOver = false;

        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.wordDisplay = document.getElementById('word-display');
        this.wordInput = document.getElementById('word-input');
        this.timerDisplay = document.getElementById('timer');
        this.playerTurn = document.getElementById('player-turn');
        this.player1Score = document.getElementById('player1-score');
        this.player2Score = document.getElementById('player2-score');
        this.startButton = document.getElementById('start-game');
        this.roundsInput = document.getElementById('rounds');
        this.timeInput = document.getElementById('time');
    }

    initEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.wordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.checkWord(this.wordInput.value);
            }
        });
    }

    startGame() {
        this.rounds = parseInt(this.roundsInput.value);
        this.timePerTurn = parseInt(this.timeInput.value);
        this.scores = [0, 0];
        this.currentPlayer = 0;
        this.gameActive = true;
        this.isGameOver = false;
        this.wordInput.disabled = false;
        this.startTurn();
    }

    startTurn() {
        this.wordInput.value = '';
        this.wordInput.focus();
        this.updateTurnDisplay();
        this.startTimer();
        this.playSound('turn');
    }

    updateTurnDisplay() {
        this.playerTurn.textContent = `Turno: ${this.players[this.currentPlayer]}`;
        this.playerTurn.className = this.currentPlayer === 0 ? 'player1' : 'player2';
    }

    startTimer() {
        if (this.isGameOver) return;

        let timeLeft = this.timePerTurn;
        this.timerDisplay.textContent = `Tiempo restante: ${timeLeft}`;

        this.timer = setInterval(() => {
            if (this.isGameOver) {
                clearInterval(this.timer);
                return;
            }

            timeLeft--;
            this.timerDisplay.textContent = `Tiempo restante: ${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.endTurn(false);
            }
        }, 1000);
    }

    checkWord(word) {
        if (word.trim() === '') return;

        if (this.isValidWord(word)) {
            this.currentWord = word;
            this.wordHistory.push(word);
            this.updateWordDisplay();
            this.endTurn(true);
        } else {
            this.handleInvalidWord();
        }
    }

    isValidWord(word) {
        if (!this.currentWord) return true;
        const lastSyllable = this.getLastSyllable(this.currentWord);
        return word.toLowerCase().startsWith(lastSyllable.toLowerCase());
    }

    getLastSyllable(word) {
        // Implementar lógica para obtener la última sílaba
        // Esto es un placeholder básico
        return word.slice(-2);
    }

    updateWordDisplay() {
        const wordDisplay = document.getElementById('word-display');

        // Invertimos el orden de las palabras
        const reversedHistory = [...this.wordHistory].reverse();

        wordDisplay.innerHTML = reversedHistory
            .map((word, index) =>
                `<div class="word-item" style="opacity: ${1 - (index * 0.1)};">
                    ${word}
                </div>`
            )
            .join('');

        // Auto-scroll to bottom para mostrar la última palabra
        wordDisplay.scrollTop = wordDisplay.scrollHeight;
    }

    endTurn(success) {
        clearInterval(this.timer);

        if (success) {
            this.scores[this.currentPlayer]++;
            this.updateScores();
            this.nextPlayer();
            this.startTurn();
        } else {
            this.endRound();
        }
    }

    updateScores() {
        this.player1Score.textContent = this.scores[0];
        this.player2Score.textContent = this.scores[1];
        if (this.scores[this.currentPlayer] >= 5) {
            this.endRound();
        }
    }

    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.updateTurnDisplay();
        this.startTimer();
    }

    endRound() {
        this.rounds--;
        if (this.rounds > 0) {
            this.startGame();
        } else {
            this.endGame();
        }
    }

    handleInvalidWord() {
        // El jugador actual pierde, el oponente gana
        const winnerIndex = (this.currentPlayer + 1) % this.players.length;
        this.scores[winnerIndex] += 5; // Bonus por ganar la ronda

        // Mostrar alerta de palabra no válida
        alert(`¡Palabra no válida!\n${this.players[this.currentPlayer]} ha perdido.`);

        // Finalizar el juego
        this.endGame();

        // Reiniciar para nueva partida
        this.resetGame();
    }

    resetGame() {
        this.isGameOver = false;
        this.wordHistory = [];
        this.currentWord = '';
        this.rounds = 3;
        this.timePerTurn = 30;
        this.updateWordDisplay();
        this.scores = [0, 0];
        this.updateScores();
        this.wordInput.value = '';
        this.timerDisplay.textContent = `Tiempo restante: ${this.timePerTurn}`;
        clearInterval(this.timer);
        this.wordInput.disabled = true;
    }

    endGame() {
        this.isGameOver = true;
        clearInterval(this.timer);
        this.playSound('game-over');

        const winner = this.scores[0] > this.scores[1] ? 'Jugador 1' : 'Jugador 2';
        alert(`¡Juego terminado!\nGanador: ${winner}\nPuntuación final:\nJugador 1: ${this.scores[0]}\nJugador 2: ${this.scores[1]}`);

        this.resetGame();
    }

    playSound(soundType) {
        const sound = document.getElementById(`${soundType}-sound`);
        sound.pause();
        sound.currentTime = 0;
    }
}

// Iniciar el juego cuando se cargue la página
window.onload = () => new ChainedWordsGame();
