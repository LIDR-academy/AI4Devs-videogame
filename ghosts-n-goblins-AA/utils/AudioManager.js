/**
 * Clase para gestionar todos los efectos de sonido y música del juego
 */
class AudioManager {
    constructor(scene) {
        this.scene = scene;
        
        // Estado de silencio
        this.musicMuted = false;
        this.sfxMuted = false;
        
        // Cargar configuración de audio desde localStorage
        this.loadAudioSettings();
        
        // Aplicar configuraciones
        this.scene.sound.mute = (this.musicMuted && this.sfxMuted);
        
        // Referencias a música actualmente reproduciendo
        this.currentMusic = null;
        
        // Volúmenes
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        
        // Cache de sonidos (para evitar crear múltiples instancias)
        this.soundCache = {};
    }
    
    // Cargar configuración de audio guardada
    loadAudioSettings() {
        this.musicMuted = localStorage.getItem('musicMuted') === 'true';
        this.sfxMuted = localStorage.getItem('sfxMuted') === 'true';
    }
    
    // Guardar configuración de audio
    saveAudioSettings() {
        localStorage.setItem('musicMuted', this.musicMuted);
        localStorage.setItem('sfxMuted', this.sfxMuted);
    }
    
    // Reproducir música (con loop)
    playMusic(key, config = {}) {
        // Detener música anterior si existe
        this.stopMusic();
        
        // Si la música está silenciada, salir
        if (this.musicMuted) return null;
        
        // Fusionar configuración con valores por defecto
        const musicConfig = {
            volume: this.musicVolume,
            loop: true,
            ...config
        };
        
        // Verificar que la clave de audio exista
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`Audio '${key}' no encontrado en caché`);
            return null;
        }
        
        // Reproducir y guardar referencia
        this.currentMusic = this.scene.sound.add(key, musicConfig);
        this.currentMusic.play();
        
        return this.currentMusic;
    }
    
    // Detener música actual
    stopMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
    
    // Reproducir efecto de sonido
    playSfx(key, config = {}) {
        // Si los efectos están silenciados, salir
        if (this.sfxMuted) return null;
        
        // Si se solicita detener el sonido
        if (config.stop) {
            if (this.soundCache[key] && this.soundCache[key].isPlaying) {
                console.log(`Deteniendo sonido: ${key}`);
                this.soundCache[key].stop();
            }
            return null;
        }
        
        // Fusionar configuración con valores por defecto
        const sfxConfig = {
            volume: this.sfxVolume,
            ...config
        };
        
        // Verificar que la clave de audio exista
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`Audio '${key}' no encontrado en caché`);
            return null;
        }
        
        // Usar caché para sonidos frecuentes
        if (!this.soundCache[key]) {
            this.soundCache[key] = this.scene.sound.add(key);
        }
        
        // Reproducir el sonido con la configuración proporcionada
        this.soundCache[key].play(sfxConfig);
        
        return this.soundCache[key];
    }
    
    // Alternar silencio de música
    toggleMusicMute() {
        this.musicMuted = !this.musicMuted;
        
        // Guardar configuración
        this.saveAudioSettings();
        
        // Aplicar cambio
        if (this.musicMuted) {
            this.stopMusic();
        } else if (this.currentMusic) {
            // Intentar reanudar la música si estaba reproduciendo
            this.currentMusic.play();
        }
        
        // Actualizar el estado general de silencio
        this.scene.sound.mute = (this.musicMuted && this.sfxMuted);
        
        return this.musicMuted;
    }
    
    // Alternar silencio de efectos
    toggleSfxMute() {
        this.sfxMuted = !this.sfxMuted;
        
        // Guardar configuración
        this.saveAudioSettings();
        
        // Actualizar el estado general de silencio
        this.scene.sound.mute = (this.musicMuted && this.sfxMuted);
        
        return this.sfxMuted;
    }
    
    // Detener todos los sonidos (para muerte del jugador)
    stopAllSounds() {
        console.log('Deteniendo todos los sonidos y efectos');
        
        // Detener música
        this.stopMusic();
        
        // Detener todos los efectos de sonido
        Object.values(this.soundCache).forEach(sound => {
            if (sound && sound.isPlaying) {
                sound.stop();
            }
        });
    }
}

export default AudioManager; 