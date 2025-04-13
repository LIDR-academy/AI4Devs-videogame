class AudioController {
    constructor(soundEnabled = true, musicEnabled = true) {
        this.soundEnabled = soundEnabled;
        this.musicEnabled = musicEnabled;
        this.userInteracted = false;
        
        // Audio elements
        this.sounds = {
            move: null,
            win: null,
            select: null
        };
        
        this.backgroundMusic = null;
        
        // Initialize audio
        this.initializeAudio();
        
        // Set up interaction listener
        this.setupInteractionListener();
    }
    
    // Initialize audio elements
    initializeAudio() {
        // Create audio elements for sound effects - simplify to use same sound for move/select
        this.sounds.move = new Audio('audio/click.mp3');
        this.sounds.move.volume = 0.5;
        
        // Just reference the same audio object for select (with slightly lower volume)
        this.sounds.select = this.sounds.move;
        
        // Win sound is still distinct
        this.sounds.win = new Audio('audio/win.mp3');
        this.sounds.win.volume = 0.7;
        
        // Create background music element
        this.backgroundMusic = new Audio('audio/music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
    }
    
    // Setup listener for user interaction
    setupInteractionListener() {
        const interactionEvents = ['click', 'keydown', 'touchstart'];
        
        const handleInteraction = () => {
            this.userInteracted = true;
            
            // Play music if it's enabled
            if (this.musicEnabled) {
                this.playMusic();
            }
            
            // Remove event listeners once interaction is detected
            interactionEvents.forEach(event => {
                document.removeEventListener(event, handleInteraction);
            });
        };
        
        // Add event listeners for user interaction
        interactionEvents.forEach(event => {
            document.addEventListener(event, handleInteraction);
        });
    }
    
    // Play a sound - add pitch variation for select vs move
    playSound(soundName) {
        if (!this.soundEnabled || !this.sounds[soundName]) return;
        
        try {
            // Clone the audio to allow overlapping sounds
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            
            // Add slight pitch variation for select vs move
            if (soundName === 'select') {
                sound.volume = 0.3; // Lower volume for select
            } else {
                sound.volume = 0.5; // Normal volume for move
            }
            
            if (this.userInteracted) {
                sound.play().catch(e => {
                    console.log(`Sound play failed: ${e.message}`);
                });
            }
        } catch (error) {
            console.error(`Error playing sound: ${error.message}`);
        }
    }
    
    // Play background music
    playMusic() {
        if (!this.musicEnabled || !this.backgroundMusic) return;
        
        try {
            if (this.userInteracted) {
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.play().catch(e => {
                    console.log(`Music play failed: ${e.message}`);
                });
            }
        } catch (error) {
            console.error(`Error playing music: ${error.message}`);
        }
    }
    
    // Stop background music
    stopMusic() {
        if (!this.backgroundMusic) return;
        
        try {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        } catch (error) {
            console.error(`Error stopping music: ${error.message}`);
        }
    }
    
    // Enable/disable sound
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }
    
    // Enable/disable music
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        
        if (enabled && this.userInteracted) {
            this.playMusic();
        } else {
            this.stopMusic();
        }
    }
    
    // Handle settings change
    handleSettingsChange(settings) {
        this.setSoundEnabled(settings.sound);
        this.setMusicEnabled(settings.music);
    }
} 