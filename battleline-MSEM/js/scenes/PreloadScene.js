class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Display loading UI
        this.createLoadingUI();
        
        // Load game assets
        this.loadImages();
        this.loadAudio(); 
        this.loadData();
        
        // Configurar manejador de errores para assets
        this.load.on('loaderror', (fileObj) => {
            console.warn('Error loading: ', fileObj.key);
            // Continuamos cargando incluso si hay errores
            this.load.totalToLoad--;
            this.load.checkQueue();
        });
    }

    createLoadingUI() {
        // Create a loading bar UI
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Add logo
        const logo = this.add.image(width / 2, height / 2 - 100, 'logo');
        logo.setScale(0.5);
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 20, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Progress bar background
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 + 10, 320, 50);
        
        // Update progress bar as assets load
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 20, 300 * value, 30);
        });
        
        // Clear progress bar when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            
            // Registro de depuración
            console.log('¡Carga completada! Iniciando MenuScene...');
            
            // Avanzar a la siguiente escena tras un pequeño retraso
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    loadImages() {
        // Interface
        this.load.image('background', 'assets/images/background.svg');
        this.load.image('button', 'assets/images/button.svg'); 
        this.load.image('gold-icon', 'assets/images/gold-icon.svg');
        
        // Temporary placeholder images for races
        this.load.image('human-icon', 'assets/images/human-icon.svg');
        this.load.image('elf-icon', 'assets/images/elf-icon.svg');
        this.load.image('orc-icon', 'assets/images/orc-icon.svg');
        
        // Human units
        this.load.image('human-swordsman', 'assets/images/human-swordsman.svg');
        this.load.image('human-archer', 'assets/images/human-archer.svg');
        this.load.image('human-knight', 'assets/images/human-knight.svg');
        this.load.image('human-cleric', 'assets/images/human-cleric.svg');
        
        // Elf units
        this.load.image('elf-spearman', 'assets/images/elf-spearman.svg');
        this.load.image('elf-archer', 'assets/images/elf-archer.svg');
        this.load.image('elf-druid', 'assets/images/elf-druid.svg');
        this.load.image('elf-sentinel', 'assets/images/elf-sentinel.svg');
        
        // Orc units
        this.load.image('orc-brute', 'assets/images/orc-brute.svg');
        this.load.image('orc-thrower', 'assets/images/orc-thrower.svg');
        this.load.image('orc-shaman', 'assets/images/orc-shaman.svg');
        this.load.image('orc-beast', 'assets/images/orc-beast.svg');
        
        // Effects
        this.load.image('explosion', 'assets/images/explosion.svg');
        this.load.image('heal', 'assets/images/heal.svg');
    }

    loadAudio() {
        // Music
        this.load.audio('title-music', 'assets/audio/title-music.mp3');
        this.load.audio('battle-music', 'assets/audio/battle-music.mp3');
        
        // Sound effects
        this.load.audio('click', 'assets/audio/click.mp3');
        this.load.audio('spawn', 'assets/audio/spawn.mp3');
        this.load.audio('attack', 'assets/audio/attack.mp3');
        this.load.audio('death', 'assets/audio/death.mp3');
        this.load.audio('victory', 'assets/audio/victory.mp3');
        this.load.audio('defeat', 'assets/audio/defeat.mp3');
    }

    loadData() {
        // Load game data (unit stats, etc.)
        this.load.json('unit-data', 'assets/data/units.json');
        this.load.json('upgrade-data', 'assets/data/upgrades.json');
    }

    create() {
        console.log('PreloadScene create() ejecutado');
        
        // Crear un objeto de sonido simulado para evitar errores
        // Esta es una solución temporal mientras resolvemos los problemas de audio
        this.sound.add = (key) => {
            console.log(`Creating dummy sound for: ${key}`);
            return {
                play: () => console.log(`Playing dummy sound: ${key}`),
                stop: () => console.log(`Stopping dummy sound: ${key}`),
                setVolume: () => {}
            };
        };
        
        // Iniciar la escena del menú
        this.scene.start('MenuScene');
    }
}

// Exportar la clase para que esté disponible globalmente
window.PreloadScene = PreloadScene;
