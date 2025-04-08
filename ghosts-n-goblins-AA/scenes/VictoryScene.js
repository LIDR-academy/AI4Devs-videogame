import AudioManager from '../utils/AudioManager.js';
import AudioControls from '../ui/AudioControls.js';

class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.level = data.level || 1;
        
        // Guardar puntuación alta si es mayor
        const highScore = localStorage.getItem('highScore') || 0;
        if (this.finalScore > highScore) {
            localStorage.setItem('highScore', this.finalScore);
        }
    }
    
    create() {
        try {
            // Inicializar AudioManager
            this.audioManager = new AudioManager(this);
            
            // Reproducir música de victoria
            this.audioManager.playMusic('victory-theme', { volume: 0.6 });
            
            // Fondo para la escena de victoria
            this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000044)
                .setOrigin(0)
                .setAlpha(0.8);
            
            // Título de VICTORIA
            const victoryText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 4,
                '¡VICTORIA!',
                {
                    fontFamily: 'Arial',
                    fontSize: '64px',
                    color: '#FFD700',
                    fontStyle: 'bold',
                    stroke: '#000',
                    strokeThickness: 8
                }
            ).setOrigin(0.5);
            
            // Animación del texto
            this.tweens.add({
                targets: victoryText,
                scale: { from: 0.8, to: 1.2 },
                alpha: { from: 0, to: 1 },
                duration: 1500,
                ease: 'Bounce.easeOut'
            });
            
            // Mensaje de felicitación
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 50,
                '¡Has derrotado al demonio y\ncompletado el juego!',
                {
                    fontFamily: 'Arial',
                    fontSize: '28px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 4,
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            // Puntuación final
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 50,
                `Puntuación final: ${this.finalScore}`,
                {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);
            
            // Mostrar puntuación alta
            const highScore = localStorage.getItem('highScore') || 0;
            const highScoreText = this.add.text(
                this.cameras.main.width / 2,
                330,
                `Puntuación más alta: ${highScore}`,
                {
                    fontSize: '24px',
                    fill: '#FFFFFF',
                    align: 'center',
                    stroke: '#000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5);
            
            // Añadir efecto especial si batió el récord
            if (this.finalScore >= highScore) {
                highScoreText.setFill('#FFD700');
                
                // Texto de nuevo récord
                const newRecordText = this.add.text(
                    this.cameras.main.width / 2 + 250,
                    330,
                    '¡NUEVO RÉCORD!',
                    {
                        fontSize: '18px',
                        fill: '#FF4500',
                        fontStyle: 'bold',
                        stroke: '#000',
                        strokeThickness: 3
                    }
                ).setOrigin(0.5).setAngle(15);
                
                // Añadir efecto pulsante al texto de nuevo récord
                this.tweens.add({
                    targets: newRecordText,
                    scale: { from: 1, to: 1.2 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
            
            // Imagen del jefe derrotado (atenuado)
            const bossImg = this.add.sprite(
                this.cameras.main.width / 2,
                450,
                'boss_death',
                7
            ).setScale(2).setAlpha(0.7).setTint(0xFF0000);
            
            // Botón para volver a la pantalla de título
            const menuButton = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 150,
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
            menuButton.setInteractive()
                .on('pointerover', () => {
                    menuButton.setTint(0xffff00);
                })
                .on('pointerout', () => {
                    menuButton.clearTint();
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
                targets: menuButton,
                alpha: 0.6,
                duration: 800,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            // Crear controles de audio
            this.audioControls = new AudioControls(this, this.audioManager);
            
        } catch (error) {
            console.error('Error en VictoryScene.create():', error);
        }
    }
}

export default VictoryScene; 