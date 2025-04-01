import AudioManager from '../utils/AudioManager.js';
import AudioControls from '../ui/AudioControls.js';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
        this.gameOverMusic = null;
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.level = data.level || 1;
        this.highScore = data.highScore || 0;
        this.zombiesKilled = data.zombiesKilled || 0;
    }

    create() {
        try {
            // Inicializar AudioManager
            this.audioManager = new AudioManager(this);
            
            // Reproducir música de game over
            this.audioManager.playMusic('gameover-music', { volume: 0.5, loop: true });
            
            // Añadir fondo negro
            this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
                .setOrigin(0)
                .setAlpha(0.8);
            
            // Texto de GAME OVER
            const gameOverText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 3,
                'GAME OVER',
                {
                    fontFamily: 'Arial',
                    fontSize: '64px',
                    color: '#FF0000',
                    fontStyle: 'bold',
                    stroke: '#000',
                    strokeThickness: 8
                }
            ).setOrigin(0.5);
            
            // Animación del texto
            this.tweens.add({
                targets: gameOverText,
                scale: { from: 0.8, to: 1.2 },
                alpha: { from: 0, to: 1 },
                duration: 1500,
                ease: 'Bounce.easeOut'
            });
            
            // Puntuación final
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                `Puntuación final: ${this.finalScore}`,
                {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);
            
            // Puntuación más alta
            const highScoreColor = this.finalScore >= this.highScore ? '#ffff00' : '#ffffff';
            this.add.text(
                this.cameras.main.width / 2,
                270,
                'Mejor puntuación: ' + this.highScore,
                { 
                    font: '26px Arial',
                    fill: highScoreColor
                }
            ).setOrigin(0.5);
            
            // Zombies eliminados
            this.add.text(
                this.cameras.main.width / 2,
                320,
                'Zombies eliminados: ' + this.zombiesKilled,
                { 
                    font: '26px Arial',
                    fill: '#ffffff' 
                }
            ).setOrigin(0.5);
            
            // Resumen del desempeño
            let performanceText = '';
            if (this.zombiesKilled >= 30) {
                performanceText = '¡Eres un cazador de zombies legendario!';
            } else if (this.zombiesKilled >= 20) {
                performanceText = '¡Excelente trabajo contra los zombies!';
            } else if (this.zombiesKilled >= 10) {
                performanceText = 'Buen esfuerzo contra las hordas.';
            } else {
                performanceText = 'Mejora tu estrategia para la próxima vez.';
            }
            
            this.add.text(
                this.cameras.main.width / 2,
                370,
                performanceText,
                { 
                    font: '20px Arial',
                    fill: '#ffaa00' 
                }
            ).setOrigin(0.5);
            
            // Botón para volver a la pantalla de título
            const restartButton = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 100,
                'VOLVER AL TÍTULO',
                {
                    fontFamily: 'Arial',
                    fontSize: '28px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 4,
                    padding: { x: 20, y: 10 }
                }
            ).setOrigin(0.5);
            
            // Hacer el botón interactivo
            restartButton.setInteractive()
                .on('pointerover', () => {
                    restartButton.setTint(0xffff00);
                })
                .on('pointerout', () => {
                    restartButton.clearTint();
                })
                .on('pointerdown', () => {
                    // Reproducir sonido al hacer clic
                    this.audioManager.playSfx('button-click', { volume: 0.5 });
                    
                    // Detener música
                    this.audioManager.stopMusic();
                    
                    // Transición a la escena del título
                    this.cameras.main.fade(1000, 0, 0, 0);
                    this.time.delayedCall(1000, () => {
                        this.scene.start('TitleScene');
                    });
                });
                
            // Efecto de parpadeo al botón
            this.tweens.add({
                targets: restartButton,
                alpha: 0.6,
                duration: 800,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            // Crear controles de audio
            this.audioControls = new AudioControls(this, this.audioManager);
            
        } catch (error) {
            console.error('Error en GameOverScene.create():', error);
            // Mostrar mensaje de error y volver a la pantalla de título automáticamente
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                'Error: Volviendo a la pantalla principal...',
                { 
                    font: '20px Arial',
                    fill: '#ff0000' 
                }
            ).setOrigin(0.5);
            
            // Volver a la pantalla de título después de 3 segundos
            this.time.delayedCall(3000, () => {
                this.scene.start('TitleScene');
            });
        }
    }
}

export default GameOverScene; 