/**
 * Clase para crear y gestionar controles de audio en la UI
 */
class AudioControls {
    constructor(scene, audioManager) {
        this.scene = scene;
        this.audioManager = audioManager;
        
        // Crear controles
        this.createControls();
        
        // Actualizar estados iniciales
        this.updateButtonStates();
    }
    
    createControls() {
        const buttonY = 50;
        const paddingX = 10;
        
        // Fondo para los controles
        this.background = this.scene.add.rectangle(
            this.scene.cameras.main.width - 130, 
            buttonY, 
            120, 
            80, 
            0x000000, 
            0.7
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100);
        
        // Título
        this.titleText = this.scene.add.text(
            this.background.x,
            buttonY - 25,
            'AUDIO',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffffff'
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100);
        
        // Botón de música
        this.musicButton = this.scene.add.text(
            this.background.x - 30,
            buttonY + 5,
            '🎵',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                backgroundColor: '#333333',
                padding: { x: 8, y: 4 }
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setDepth(100);
        
        // Botón de efectos
        this.sfxButton = this.scene.add.text(
            this.background.x + 30,
            buttonY + 5,
            '🔊',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                backgroundColor: '#333333',
                padding: { x: 8, y: 4 }
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setDepth(100);
        
        // Añadir eventos de hover
        [this.musicButton, this.sfxButton].forEach(button => {
            button.on('pointerover', () => {
                button.setBackgroundColor('#555555');
            });
            
            button.on('pointerout', () => {
                button.setBackgroundColor('#333333');
            });
        });
        
        // Eventos de clic
        this.musicButton.on('pointerdown', () => {
            this.audioManager.toggleMusicMute();
            this.updateButtonStates();
            
            // Reproducir sonido de clic
            if (!this.audioManager.sfxMuted) {
                this.audioManager.playSfx('pickup', { volume: 0.3 });
            }
        });
        
        this.sfxButton.on('pointerdown', () => {
            // Reproducir sonido antes de silenciar para confirmación
            if (!this.audioManager.sfxMuted) {
                this.audioManager.playSfx('pickup', { volume: 0.3 });
            }
            
            this.audioManager.toggleSfxMute();
            this.updateButtonStates();
        });
    }
    
    updateButtonStates() {
        // Actualizar icono de música
        this.musicButton.setText(this.audioManager.musicMuted ? '🎵❌' : '🎵');
        
        // Actualizar icono de efectos
        this.sfxButton.setText(this.audioManager.sfxMuted ? '🔊❌' : '🔊');
    }
}

export default AudioControls; 