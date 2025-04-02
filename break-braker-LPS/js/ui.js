export default class UI {
    constructor() {
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.winScreen = document.getElementById('winScreen');
        this.scoreElement = document.getElementById('score');
        this.finalScoreElement = document.getElementById('finalScore');
        this.winScoreElement = document.getElementById('winScore');
        this.levelElement = document.getElementById('level');
        this.levelCompleteText = document.getElementById('levelCompleteText');
        this.nextLevelButton = document.getElementById('nextLevelButton');
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
    }
    
    updateLevel(level) {
        this.levelElement.textContent = level;
    }

    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.winScreen.classList.add('hidden');
    }

    hideStartScreen() {
        this.startScreen.classList.add('hidden');
    }

    showGameOverScreen(score) {
        this.finalScoreElement.textContent = score;
        this.gameOverScreen.classList.remove('hidden');
    }

    hideGameOverScreen() {
        this.gameOverScreen.classList.add('hidden');
    }

    showWinScreen(score, isLastLevel) {
        this.winScoreElement.textContent = score;
        
        // Actualizar texto según si es el último nivel o no
        if (isLastLevel) {
            this.levelCompleteText.textContent = '¡Has completado todos los niveles!';
            this.nextLevelButton.textContent = 'Reiniciar Juego';
        } else {
            this.levelCompleteText.textContent = 'Nivel completado';
            this.nextLevelButton.textContent = 'Siguiente Nivel';
        }
        
        this.winScreen.classList.remove('hidden');
    }

    hideWinScreen() {
        this.winScreen.classList.add('hidden');
    }
} 