import Paddle from './paddle.js';
import Ball from './ball.js';
import { BlockManager } from './block.js';

export default class Game {
    constructor(canvas, ctx, ui) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.ui = ui;
        
        // Inicializar elementos del juego
        this.paddle = new Paddle(canvas);
        this.blockManager = new BlockManager(canvas);
        
        // Inicializar pelota con la velocidad del nivel actual
        this.ball = new Ball(canvas);
        const initialBallSpeed = this.blockManager.getBallSpeed();
        this.ball.reset(initialBallSpeed);
        
        // Estado del juego
        this.gameRunning = false;
        this.score = 0;
        
        // Actualizar UI con el nivel inicial
        this.ui.updateLevel(this.blockManager.getCurrentLevelNumber());
        
        // Configurar eventos para iniciar el juego
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Iniciar el juego con la barra espaciadora
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.gameRunning && this.ball.isAttachedToPaddle) {
                this.ball.launch();
            }
            
            // Tecla de prueba: 'T' para destruir todos los bloques instantáneamente
            if (e.key === 't' || e.key === 'T') {
                if (this.gameRunning) {
                    this.destroyAllBlocksForTesting();
                }
            }
        });
        
        // Iniciar el juego con clic
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning && this.ball.isAttachedToPaddle) {
                this.ball.launch();
            }
        });
    }
    
    // Función de prueba para destruir todos los bloques y comprobar la transición de nivel
    destroyAllBlocksForTesting() {
        // Desactivar todos los bloques
        this.blockManager.blocks.forEach(block => {
            block.isActive = false;
            // Añadir puntuación por cada bloque
            this.score += block.value;
        });
        
        // Actualizar la puntuación en la UI
        this.ui.updateScore(this.score);
        
        // Comprobar victoria (esto activará la transición al siguiente nivel)
        if (this.blockManager.allBlocksDestroyed()) {
            this.gameRunning = false;
            const isLastLevel = !this.blockManager.hasMoreLevels();
            this.ui.showWinScreen(this.score, isLastLevel);
        }
    }
    
    start() {
        this.gameRunning = true;
        
        // Iniciar el bucle del juego
        if (!this.animationFrameId) {
            this.gameLoop();
        }
    }
    
    reset() {
        // Reiniciar elementos del juego
        this.paddle.reset();
        
        // Reiniciar la pelota con la velocidad del nivel 1
        this.blockManager.currentLevel = 0;
        const ballSpeed = this.blockManager.getBallSpeed();
        this.ball.reset(ballSpeed);
        
        // Reiniciar bloques
        this.blockManager.reset();
        
        // Reiniciar la puntuación
        this.score = 0;
        this.ui.updateScore(this.score);
        
        // Actualizar UI con el nivel inicial
        this.ui.updateLevel(this.blockManager.getCurrentLevelNumber());
    }
    
    nextLevel() {
        // Avanzar al siguiente nivel
        this.blockManager.nextLevel();
        
        // Obtener la velocidad de la bola para el nuevo nivel
        const newBallSpeed = this.blockManager.getBallSpeed();
        
        // Reiniciar elementos del juego para el nuevo nivel
        this.paddle.reset();
        
        // Reiniciar la pelota con la nueva velocidad
        this.ball.reset(newBallSpeed);
        
        // Actualizar UI con el nuevo nivel
        this.ui.updateLevel(this.blockManager.getCurrentLevelNumber());
        
        // Mantener la puntuación acumulada entre niveles
        this.ui.updateScore(this.score);
    }
    
    gameLoop() {
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameRunning) {
            // Actualizar la barra
            this.paddle.update();
            
            // Actualizar la pelota
            const gameOver = this.ball.update(this.paddle);
            
            // Comprobar colisión con la barra
            this.ball.checkPaddleCollision(this.paddle);
            
            // Comprobar colisiones con los bloques
            const pointsEarned = this.blockManager.checkCollisions(this.ball);
            if (pointsEarned > 0) {
                this.score += pointsEarned;
                this.ui.updateScore(this.score);
            }
            
            // Comprobar si todos los bloques han sido destruidos (victoria)
            if (this.blockManager.allBlocksDestroyed()) {
                this.gameRunning = false;
                const isLastLevel = !this.blockManager.hasMoreLevels();
                this.ui.showWinScreen(this.score, isLastLevel);
            }
            
            // Comprobar game over
            if (gameOver) {
                this.gameRunning = false;
                this.ui.showGameOverScreen(this.score);
            }
        }
        
        // Dibujar elementos
        this.blockManager.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.ball.draw(this.ctx);
        
        // Continuar el bucle del juego
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // Detener el juego y cancelar el bucle de animación
    stop() {
        this.gameRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
} 