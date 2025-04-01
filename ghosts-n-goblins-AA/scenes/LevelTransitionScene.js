import AudioManager from '../utils/AudioManager.js';
import AudioControls from '../ui/AudioControls.js';

class LevelTransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelTransitionScene' });
    }

    init(data) {
        // Datos que recibimos de la escena anterior
        this.fromLevel = data.fromLevel || 0;
        this.toLevel = data.toLevel || 1;
        this.score = data.score || 0;
        this.highScore = data.highScore || 0;
        this.lives = data.lives || 3;
        this.zombiesKilled = data.zombiesKilled || 0;
        this.hasArmor = data.hasArmor || true;
        this.weaponType = data.weaponType || 'dagger';
    }

    create() {
        // Inicializar AudioManager
        this.audioManager = new AudioManager(this);
        
        // Reproducir música de transición
        this.audioManager.playMusic('title-music', { volume: 0.4, loop: true });

        // Crear fondo
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0)
            .setAlpha(0.9);

        // Crear contenedor para centralizar todo
        const container = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);

        // Título con nombre del nivel al que vamos
        const titleStyle = {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        };

        // Determinar mensaje según si es el primer nivel o venimos de otro
        let titleText;
        if (this.fromLevel === 0) {
            titleText = 'COMIENZA LA AVENTURA';
        } else {
            titleText = '¡NIVEL COMPLETADO!';
        }

        // Añadir título
        const title = this.add.text(0, -150, titleText, titleStyle).setOrigin(0.5);
        container.add(title);

        // Añadir nombre del nivel al que vamos
        const levelNameStyle = {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffcc00',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        };
        const levelName = this.add.text(0, -100, `NIVEL ${this.toLevel}`, levelNameStyle).setOrigin(0.5);
        container.add(levelName);

        // Mostrar estadísticas
        const statsStyle = {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            align: 'left'
        };

        // Estadísticas
        const scoreText = this.add.text(-150, -40, `PUNTUACIÓN: ${this.score}`, statsStyle);
        const highScoreText = this.add.text(-150, -10, `RÉCORD: ${this.highScore}`, statsStyle);
        const livesText = this.add.text(-150, 20, `VIDAS: ${this.lives}`, statsStyle);
        const zombiesText = this.add.text(-150, 50, `ZOMBIES ELIMINADOS: ${this.zombiesKilled}`, statsStyle);
        
        container.add([scoreText, highScoreText, livesText, zombiesText]);

        // Instrucciones
        const instructionsStyle = {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#cccccc',
            align: 'center'
        };
        const instructions = this.add.text(0, 120, '¡PREPÁRATE PARA EL PRÓXIMO DESAFÍO!', instructionsStyle).setOrigin(0.5);
        const continueText = this.add.text(0, 150, 'Pulsa ESPACIO para continuar', instructionsStyle).setOrigin(0.5);
        container.add([instructions, continueText]);

        // Hacer parpadear el texto de continuar
        this.tweens.add({
            targets: continueText,
            alpha: 0.2,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        // Eventos de teclado - Espacio para continuar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on('keydown-SPACE', this.startNextLevel, this);

        // También permitir hacer clic para continuar
        this.input.on('pointerdown', this.startNextLevel, this);
        
        // Controles de audio
        this.audioControls = new AudioControls(this, this.audioManager);
    }

    startNextLevel() {
        // Detener escuchadores para evitar múltiples activaciones
        this.input.keyboard.off('keydown-SPACE', this.startNextLevel, this);
        this.input.off('pointerdown', this.startNextLevel, this);
        
        // Detener música
        this.audioManager.stopMusic();
        
        // Transición a la escena del juego
        this.scene.start('GameScene', {
            level: this.toLevel,
            score: this.score,
            highScore: this.highScore,
            lives: this.lives,
            zombiesKilled: this.zombiesKilled,
            hasArmor: this.hasArmor,
            weaponType: this.weaponType
        });
    }
}

export default LevelTransitionScene; 