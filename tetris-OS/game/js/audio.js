/**
 * Audio system for Tetris
 */

window.AudioSystem = class AudioSystem {
    /**
     * Create a new audio system
     */
    constructor() {
        this.themes = {};
        this.music = null;
        this.isMuted = false;
        this.musicEnabled = true;
        this.musicVolume = 0.5;
        this.themesLoaded = false;
        this.currentTheme = 'instrumental'; // Default theme

        // Available theme options
        this.availableThemes = {
            'instrumental': 'assets/sounds/theme-tetris-intrumental.mp3',
            'piano': 'assets/sounds/theme-tetris-piano.mp3',
            'fun': 'assets/sounds/theme-tetris-fun.mp3'
        };
        
        // Load settings from storage
        this.loadSettings();
        
        // Initialize audio context
        this.initAudioContext();
        
        // Load themes
        this.loadThemes();
    }
    
    /**
     * Load user audio settings from localStorage
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem('tetris_audio_settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.isMuted = parsed.isMuted || false;
                this.musicEnabled = parsed.musicEnabled !== undefined ? parsed.musicEnabled : true;
                this.currentTheme = parsed.currentTheme || 'instrumental';
                this.musicVolume = parsed.musicVolume || 0.5;
            }
        } catch (error) {
            // Use defaults
        }
    }
    
    /**
     * Save user audio settings to localStorage
     */
    saveSettings() {
        try {
            const settings = {
                isMuted: this.isMuted,
                musicEnabled: this.musicEnabled,
                currentTheme: this.currentTheme,
                musicVolume: this.musicVolume
            };
            localStorage.setItem('tetris_audio_settings', JSON.stringify(settings));
        } catch (error) {
            // Silently fail
        }
    }

    /**
     * Initialize the audio context
     */
    initAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                
                // Create gain node for volume control
                this.musicGain = this.audioContext.createGain();
                this.musicGain.connect(this.audioContext.destination);
                
                // Set initial volume
                this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume;
            }
        } catch (error) {
            // Continue without audio
            this.audioContext = null;
        }
    }
    
    /**
     * Load all theme music
     */
    loadThemes() {
        if (!this.audioContext) {
            return;
        }
        
        // Track loading status
        let loadedCount = 0;
        const totalThemes = Object.keys(this.availableThemes).length;
        
        // Set a timeout to ensure game doesn't wait forever for themes
        setTimeout(() => {
            if (!this.themesLoaded) {
                this.themesLoaded = true;
            }
        }, 5000);
        
        // Load theme music
        for (const [name, path] of Object.entries(this.availableThemes)) {
            this.loadTheme(name, path)
                .then(() => {
                    loadedCount++;
                    if (loadedCount === totalThemes) {
                        this.themesLoaded = true;
                        
                        // Auto-play music if enabled
                        if (this.musicEnabled && !this.isMuted) {
                            this.playMusic();
                        }
                    }
                })
                .catch(() => {
                    loadedCount++;
                    if (loadedCount === totalThemes) {
                        this.themesLoaded = true;
                    }
                });
        }
    }
    
    /**
     * Load a single theme file
     * @param {string} name - Theme name
     * @param {string} path - Path to theme file
     * @returns {Promise} - Promise that resolves when the theme is loaded
     */
    loadTheme(name, path) {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.arrayBuffer();
                })
                .then(buffer => this.audioContext.decodeAudioData(buffer))
                .then(audioBuffer => {
                    this.themes[name] = audioBuffer;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    
    /**
     * Play the current theme music
     */
    playMusic() {
        if (!this.audioContext || !this.musicEnabled || this.isMuted) {
            return;
        }
        
        // Stop currently playing music if any
        this.stopMusic();
        
        const themeBuffer = this.themes[this.currentTheme];
        if (!themeBuffer) {
            return;
        }
        
        try {
            // Create and configure audio source
            const source = this.audioContext.createBufferSource();
            source.buffer = themeBuffer;
            source.loop = true;
            source.connect(this.musicGain);
            
            // Play and store the source
            source.start(0);
            this.music = source;
        } catch (error) {
            // Silently fail if playback fails
        }
    }
    
    /**
     * Set the current theme
     * @param {string} themeName - The name of the theme to use
     */
    setTheme(themeName) {
        if (this.availableThemes[themeName]) {
            this.currentTheme = themeName;
            
            // Restart music if it's playing
            if (this.music) {
                this.playMusic();
            }
        }
    }
    
    /**
     * Toggle music enabled state
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled && !this.isMuted) {
            this.playMusic();
        } else {
            this.stopMusic();
        }
        
        this.saveSettings();
    }
    
    /**
     * Set music enabled state
     * @param {boolean} enabled - Whether music should be enabled
     */
    setMusicEnabled(enabled) {
        if (this.musicEnabled === enabled) return;
        
        this.musicEnabled = enabled;
        
        if (this.musicEnabled && !this.isMuted) {
            this.playMusic();
        } else {
            this.stopMusic();
        }
        
        this.saveSettings();
    }
    
    /**
     * Stop the music
     */
    stopMusic() {
        if (this.music) {
            try {
                this.music.stop();
            } catch (error) {
                // Ignore errors when stopping
            }
            this.music = null;
        }
    }
    
    /**
     * Toggle mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.musicGain) {
            this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume;
        }
        
        if (!this.isMuted && this.musicEnabled && !this.music) {
            this.playMusic();
        }
        
        this.saveSettings();
    }
    
    /**
     * Set music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.musicGain && !this.isMuted) {
            this.musicGain.gain.value = this.musicVolume;
        }
        
        this.saveSettings();
    }
    
    /**
     * Get available theme options
     * @returns {Object} - Object with theme names and paths
     */
    getAvailableThemes() {
        return Object.keys(this.availableThemes);
    }
    
    /**
     * Get current audio settings
     * @returns {Object} - Current audio settings
     */
    getSettings() {
        return {
            isMuted: this.isMuted,
            musicEnabled: this.musicEnabled,
            currentTheme: this.currentTheme,
            musicVolume: this.musicVolume
        };
    }
    
    /**
     * Clean up audio resources
     */
    cleanup() {
        this.stopMusic();
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
    
    /**
     * Dummy play method to maintain API compatibility
     * @param {string} soundName - Name of the sound to play (ignored)
     */
    play(soundName) {
        // This method is kept for compatibility but does nothing
    }
}; 