/**
 * Archivos de audio de respaldo para el juego
 * Estos se utilizarán si no se encuentran los archivos locales
 */

// Sistema de respaldo para audio
window.AUDIO_FALLBACK = {
    // URLs de respaldo para sonidos (CDNs gratuitos o URLs externas)
    urls: {
        'collect': 'https://freesound.org/data/previews/448/448080_7706430-lq.mp3', // Sonido de moneda o coleccionable
        'hit': 'https://freesound.org/data/previews/331/331912_5121236-lq.mp3', // Sonido de daño
        'jump': 'https://freesound.org/data/previews/369/369515_6687661-lq.mp3', // Sonido de salto
        'gameOver': 'https://freesound.org/data/previews/142/142608_2332696-lq.mp3', // Sonido de game over
        'music': 'https://freesound.org/data/previews/413/413854_4284968-lq.mp3' // Música de Halloween
    },
    
    // Cargar audio desde URL
    loadAudio: function(name) {
        if (!this.urls[name]) return null;
        
        try {
            console.log(`Intentando cargar audio de respaldo para: ${name} desde ${this.urls[name]}`);
            const audio = new Audio(this.urls[name]);
            
            // Configurar reproducción en loop para música
            if (name === 'music') {
                audio.loop = true;
            }
            
            return audio;
        } catch (e) {
            console.error(`Error al cargar audio de respaldo: ${name}`, e);
            return null;
        }
    },
    
    // Generar beep simple como último recurso
    generateBeep: function(frequency = 440, duration = 200, volume = 0.5, type = 'sine') {
        return {
            play: function() {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (!AudioContext) return;
                    
                    const audioCtx = new AudioContext();
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    oscillator.type = type;
                    oscillator.frequency.value = frequency;
                    
                    gainNode.gain.value = volume;
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    
                    oscillator.start();
                    
                    setTimeout(() => {
                        oscillator.stop();
                        // Cerrar AudioContext después de un tiempo
                        setTimeout(() => audioCtx.close(), 100);
                    }, duration);
                } catch (e) {
                    console.error('Error al generar beep:', e);
                }
            }
        };
    }
}; 