import AudioManager from '../utils/AudioManager.js';
import AudioControls from '../ui/AudioControls.js';

class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }
    
    create() {
        try {
            // Inicializar AudioManager
            this.audioManager = new AudioManager(this);
            
            // Reproducir música de título
            this.audioManager.playMusic('title-music', { volume: 0.5, loop: true });
            
            // Añadir fondo
            this.add.image(0, 0, 'title-bg')
                .setOrigin(0)
                .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
            
            // Título del juego
            const titleText = this.add.text(
                this.cameras.main.width / 2,
                100,
                'GHOSTS\' N GOBLINS',
                {
                    fontFamily: 'Arial',
                    fontSize: '48px',
                    color: '#FFD700',
                    fontStyle: 'bold',
                    stroke: '#000',
                    strokeThickness: 8,
                    shadow: { blur: 5, color: '#000', fill: true }
                }
            ).setOrigin(0.5);
            
            // Animación al título
            this.tweens.add({
                targets: titleText,
                y: 120,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            // Añadir personaje
            this.arthur = this.add.sprite(
                this.cameras.main.width / 2 - 100,
                this.cameras.main.height / 2 + 50,
                'arthur-idle'
            ).setScale(2);
            
            // Reproducir animación de idle
            this.arthur.play('arthur-idle');
            
            // Añadir un enemigo zombie en la pantalla de título
            this.zombie = this.add.sprite(
                this.cameras.main.width / 2 + 100,
                this.cameras.main.height / 2 + 50,
                'zombie-walk'
            ).setScale(2);
            
            this.zombie.play('zombie-walk');
            this.zombie.flipX = true; // Mirando hacia Arthur
            
            // Subtítulo
            this.add.text(
                this.cameras.main.width / 2,
                180,
                'Una recreación en Phaser 3',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5);
            
            // Botón de inicio
            this.startButton = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 150,
                'INICIAR JUEGO',
                {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 6,
                    padding: { x: 20, y: 10 }
                }
            ).setOrigin(0.5);
            
            // Hacer el botón interactivo
            this.startButton.setInteractive()
                .on('pointerover', () => {
                    this.startButton.setTint(0xffff00);
                })
                .on('pointerout', () => {
                    this.startButton.clearTint();
                })
                .on('pointerdown', () => {
                    // Reproducir sonido al hacer clic
                    this.audioManager.playSfx('button-click', { volume: 0.5 });
                    
                    // Detener música
                    this.audioManager.stopMusic();
                    
                    // Transición a la escena del juego
                    this.cameras.main.fade(1000, 0, 0, 0);
                    this.time.delayedCall(1000, () => {
                        this.scene.start('GameScene');
                    });
                });
                
            // Efecto de parpadeo al botón de inicio
            this.tweens.add({
                targets: this.startButton,
                alpha: 0.6,
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            // Crear controles de audio
            this.audioControls = new AudioControls(this, this.audioManager);
            
            // Instrucciones
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height - 100,
                'Flechas: Mover   -   Z: Saltar   -   X: Disparar   -   C: Cambiar arma',
                {
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    color: '#FFFFFF',
                    stroke: '#000',
                    strokeThickness: 3,
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            // Créditos
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height - 50,
                '© 2023 - Recreación con fines educativos',
                {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#CCCCCC',
                    stroke: '#000',
                    strokeThickness: 2
                }
            ).setOrigin(0.5);
            
        } catch (error) {
            console.error('Error en TitleScene.create():', error);
        }
    }
}

export default TitleScene; 