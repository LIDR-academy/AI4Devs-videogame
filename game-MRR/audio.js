// Sistema de audio para el juego
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.isMuted = false;
        this.soundsLoaded = false;
        this.musicVolume = 0.3;
        this.effectsVolume = 0.5;
        this.useGeneratedAudio = true; // Flag para forzar el uso de audio generado
        
        // Inicializar AudioContext una sola vez
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log('AudioContext inicializado correctamente');
        } catch (e) {
            console.error('Error al inicializar AudioContext:', e);
            this.audioContext = null;
        }
    }

    // Inicializar y precargar todos los sonidos
    init() {
        console.log('Sistema de audio inicializado');
        
        // Crear sonidos de respaldo usando Web Audio API
        this.createAllFallbackSounds();
        
        // Solo intentar cargar archivos si no estamos forzando el audio generado
        if (!this.useGeneratedAudio) {
            try {
                // Intentar cargar archivos de sonido
                this.load('collect', 'assets/audio/collect.mp3');
                this.load('hit', 'assets/audio/hit.mp3');
                this.load('jump', 'assets/audio/jump.mp3');
                this.load('gameOver', 'assets/audio/game-over.mp3');
                
                // Música de fondo
                this.music = new Audio('assets/audio/halloween-ambient.mp3');
                this.music.loop = true;
                this.music.volume = this.musicVolume;
                
                // Si la música falla, crear música de respaldo
                this.music.onerror = () => {
                    console.log('Usando música de respaldo generada');
                    this.fallbackMusic = this.generateAmbientMusic();
                };
            } catch (e) {
                console.error('Error al cargar sonidos:', e);
                // Asegurarse de que todos los sonidos de respaldo estén creados
                this.createAllFallbackSounds();
            }
        }
        
        // Intentar activar AudioContext con un botón de inicio para navegadores con políticas estrictas
        this.addAudioContextEnabler();
    }
    
    // Crear todos los sonidos de respaldo de una vez
    createAllFallbackSounds() {
        console.log('Creando sonidos de respaldo con Web Audio API');
        this.sounds['collect'] = this.generateCollectSound();
        this.sounds['hit'] = this.generateHitSound();
        this.sounds['jump'] = this.generateJumpSound();
        this.sounds['gameOver'] = this.generateGameOverSound();
        this.fallbackMusic = this.generateAmbientMusic();
    }

    // Añadir botón para habilitar AudioContext en navegadores con políticas estrictas
    addAudioContextEnabler() {
        // Verificar si el AudioContext está suspendido o si no hay un audio context
        if ((this.audioContext && this.audioContext.state === 'suspended') || !this.audioContext) {
            console.log('AudioContext suspendido o no disponible, añadiendo botón habilitador');
            
            // Buscar botón existente y removerlo si ya existe
            const existingButton = document.getElementById('audioEnablerButton');
            if (existingButton) {
                existingButton.remove();
            }
            
            const enablerButton = document.createElement('button');
            enablerButton.id = 'audioEnablerButton';
            enablerButton.textContent = '🔊 Habilitar Audio';
            enablerButton.style.position = 'absolute';
            enablerButton.style.top = '50%';
            enablerButton.style.left = '50%';
            enablerButton.style.transform = 'translate(-50%, -50%)';
            enablerButton.style.zIndex = '9999';
            enablerButton.style.padding = '15px 30px';
            enablerButton.style.backgroundColor = '#ff6600';
            enablerButton.style.color = 'white';
            enablerButton.style.border = '2px solid white';
            enablerButton.style.borderRadius = '8px';
            enablerButton.style.fontSize = '18px';
            enablerButton.style.cursor = 'pointer';
            enablerButton.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            
            enablerButton.onclick = () => {
                // Intentar reanudar AudioContext
                if (this.audioContext) {
                    this.audioContext.resume().then(() => {
                        console.log('AudioContext reanudado con éxito');
                        // Reproducir un sonido de prueba para confirmar
                        this.play('collect');
                        // Iniciar música
                        this.playMusic();
                        enablerButton.remove();
                    }).catch(err => {
                        console.error('Error al reanudar AudioContext:', err);
                    });
                } else {
                    // Intentar crear nuevo AudioContext
                    try {
                        window.AudioContext = window.AudioContext || window.webkitAudioContext;
                        this.audioContext = new AudioContext();
                        console.log('AudioContext creado correctamente');
                        this.createAllFallbackSounds();
                        this.play('collect');
                        this.playMusic();
                        enablerButton.remove();
                    } catch (e) {
                        console.error('Error al crear AudioContext:', e);
                    }
                }
            };
            
            document.body.appendChild(enablerButton);
        }
    }
    
    // Cargar un sonido individual
    load(name, path) {
        try {
            // Intentar cargar el archivo de audio local
            this.sounds[name] = new Audio(path);
            this.sounds[name].volume = this.effectsVolume;
            
            // Manejar errores de carga de audio
            this.sounds[name].onerror = () => {
                console.error(`Error al cargar el sonido: ${path}`);
                
                // Intentar cargar desde URL de respaldo
                if (window.AUDIO_FALLBACK && window.AUDIO_FALLBACK.urls[name]) {
                    console.log(`Intentando cargar sonido desde URL de respaldo para: ${name}`);
                    const fallbackAudio = window.AUDIO_FALLBACK.loadAudio(name);
                    
                    if (fallbackAudio) {
                        this.sounds[name] = fallbackAudio;
                        this.sounds[name].volume = this.effectsVolume;
                        console.log(`Sonido cargado desde URL de respaldo: ${name}`);
                        return;
                    }
                }
                
                // Si no hay respaldo online, usar el generado
                console.log(`Usando sonido generado para: ${name}`);
            };
            
            // Confirmar carga exitosa
            this.sounds[name].oncanplaythrough = () => {
                console.log(`Sonido cargado: ${name}`);
            };
        } catch (error) {
            console.error(`Error al cargar sonido ${name}:`, error);
        }
    }
    
    // Generar sonido de recolección
    generateCollectSound() {
        const soundObj = {
            play: () => {
                if (this.isMuted || !this.audioContext) return;
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // Nota A5
                oscillator.frequency.exponentialRampToValueAtTime(1760, this.audioContext.currentTime + 0.1); // Nota A6
                
                gainNode.gain.setValueAtTime(this.effectsVolume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }
        };
        return soundObj;
    }
    
    // Generar sonido de daño
    generateHitSound() {
        const soundObj = {
            play: () => {
                if (this.isMuted || !this.audioContext) return;
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // Nota A3
                oscillator.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.2); // Nota A2
                
                gainNode.gain.setValueAtTime(this.effectsVolume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }
        };
        return soundObj;
    }
    
    // Generar sonido de salto
    generateJumpSound() {
        const soundObj = {
            play: () => {
                if (this.isMuted || !this.audioContext) return;
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(392, this.audioContext.currentTime); // Nota G4
                oscillator.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.1); // Nota G5
                
                gainNode.gain.setValueAtTime(this.effectsVolume * 0.7, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.15);
            }
        };
        return soundObj;
    }
    
    // Generar sonido de game over
    generateGameOverSound() {
        const soundObj = {
            play: () => {
                if (this.isMuted || !this.audioContext) return;
                
                const oscillator1 = this.audioContext.createOscillator();
                const oscillator2 = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator1.type = 'sawtooth';
                oscillator1.frequency.setValueAtTime(440, this.audioContext.currentTime); // Nota A4
                oscillator1.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 0.8); // Nota A3
                
                oscillator2.type = 'square';
                oscillator2.frequency.setValueAtTime(415, this.audioContext.currentTime + 0.4); // Nota G#4
                oscillator2.frequency.exponentialRampToValueAtTime(185, this.audioContext.currentTime + 1.2); // Nota G#3
                
                gainNode.gain.setValueAtTime(this.effectsVolume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
                
                oscillator1.connect(gainNode);
                oscillator2.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator1.start();
                oscillator2.start(this.audioContext.currentTime + 0.4);
                oscillator1.stop(this.audioContext.currentTime + 0.8);
                oscillator2.stop(this.audioContext.currentTime + 1.2);
            }
        };
        return soundObj;
    }
    
    // Generar música de fondo de respaldo
    generateAmbientMusic() {
        // Objeto simple para representar la música
        const musicObj = {
            loop: true,
            isPlaying: false,
            
            play: () => {
                if (this.isMuted || musicObj.isPlaying) return;
                
                try {
                    if (!this.audioContext) {
                        try {
                            window.AudioContext = window.AudioContext || window.webkitAudioContext;
                            this.audioContext = new AudioContext();
                        } catch(err) {
                            console.error('No se pudo crear AudioContext:', err);
                            return;
                        }
                    }
                    
                    console.log('Reproduciendo música generada');
                    
                    // Función auxiliar para reproducir una nota
                    const playNote = (freq, duration, delay = 0, type = 'sine', volume = 0.2) => {
                        try {
                            if (!this.audioContext) return;
                            
                            const time = this.audioContext.currentTime + delay;
                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();
                            
                            osc.type = type;
                            osc.frequency.value = freq;
                            
                            gain.gain.value = volume * this.musicVolume;
                            
                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);
                            
                            osc.start(time);
                            osc.stop(time + duration);
                        } catch(e) {
                            console.error('Error al reproducir nota:', e);
                        }
                    };
                    
                    // Reproducir notas simples
                    playNote(146.83, 2.5, 0, 'triangle', 0.15); // D3
                    playNote(110, 2, 0.5, 'triangle', 0.15); // A2
                    playNote(146.83, 2.5, 2, 'triangle', 0.15); // D3
                    playNote(110, 2, 2.5, 'triangle', 0.15); // A2
                    
                    musicObj.isPlaying = true;
                    
                    // Si está en loop, programar la siguiente reproducción
                    if (musicObj.loop) {
                        setTimeout(() => {
                            musicObj.isPlaying = false;
                            musicObj.play();
                        }, 5000); // Reproducir cada 5 segundos
                    }
                } catch(error) {
                    console.error('Error al reproducir música generada:', error);
                    musicObj.isPlaying = false;
                }
            },
            
            pause: () => {
                musicObj.isPlaying = false;
            }
        };
        
        return musicObj;
    }

    // Reproducir un sonido por nombre
    play(name) {
        try {
            if (this.isMuted) {
                return;
            }
            
            // Si estamos usando audio generado o el sonido no existe, generar uno nuevo
            if (this.useGeneratedAudio || !this.sounds[name]) {
                // Generar sonido en tiempo real según el tipo
                if (name === 'collect') {
                    this.generateCollectSound().play();
                    console.log('Reproduciendo sonido de recolección generado');
                } else if (name === 'hit') {
                    this.generateHitSound().play();
                    console.log('Reproduciendo sonido de golpe generado');
                } else if (name === 'jump') {
                    this.generateJumpSound().play();
                    console.log('Reproduciendo sonido de salto generado');
                } else if (name === 'gameOver') {
                    this.generateGameOverSound().play();
                    console.log('Reproduciendo sonido de game over generado');
                }
                return;
            }
            
            // Intentar reproducir sonido cargado (solo si no estamos forzando audio generado)
            if (this.sounds[name].play) {
                this.sounds[name].play();
            }
        } catch (error) {
            console.error(`Error al reproducir sonido ${name}, usando generado:`, error);
            // Intentar reproducir sonido generado como respaldo
            try {
                if (name === 'collect') this.generateCollectSound().play();
                else if (name === 'hit') this.generateHitSound().play();
                else if (name === 'jump') this.generateJumpSound().play();
                else if (name === 'gameOver') this.generateGameOverSound().play();
            } catch (e) {
                console.error('Error fatal al reproducir sonido generado:', e);
            }
        }
    }

    // Iniciar música de fondo
    playMusic() {
        if (this.isMuted) return;
        
        try {
            // Si estamos usando audio generado, usar siempre la música generada
            if (this.useGeneratedAudio) {
                console.log('Reproduciendo música generada');
                if (this.fallbackMusic && this.fallbackMusic.play) {
                    this.fallbackMusic.play();
                }
                return;
            }
            
            // Intentar reproducir la música cargada
            if (this.music) {
                const playPromise = this.music.play();
                
                if (playPromise) {
                    playPromise.catch(error => {
                        console.error('Error al reproducir música:', error);
                        // Usar música generada como respaldo
                        if (this.fallbackMusic && this.fallbackMusic.play) {
                            console.log('Usando música generada');
                            this.fallbackMusic.play();
                        }
                    });
                }
            } else if (this.fallbackMusic && this.fallbackMusic.play) {
                console.log('Reproduciendo música de respaldo (original no disponible)');
                this.fallbackMusic.play();
            }
        } catch (error) {
            console.error('Error al reproducir música:', error);
            // Intentar con música de respaldo
            if (this.fallbackMusic && this.fallbackMusic.play) {
                this.fallbackMusic.play();
            }
        }
    }
    
    // Pausar música de fondo
    pauseMusic() {
        try {
            if (this.music) {
                this.music.pause();
            }
            if (this.fallbackMusic) {
                this.fallbackMusic.pause();
            }
        } catch (error) {
            console.error('Error al pausar música:', error);
        }
    }
    
    // Crear un botón para activar el audio (necesario en algunos navegadores)
    createAudioEnableButton() {
        const audioButton = document.createElement('button');
        audioButton.innerText = '🔊 Activar Sonido';
        audioButton.style.position = 'absolute';
        audioButton.style.bottom = '80px';
        audioButton.style.left = '50%';
        audioButton.style.transform = 'translateX(-50%)';
        audioButton.style.zIndex = '1000';
        audioButton.style.padding = '10px 20px';
        audioButton.style.backgroundColor = '#ff6600';
        audioButton.style.color = 'white';
        audioButton.style.border = 'none';
        audioButton.style.borderRadius = '5px';
        audioButton.style.cursor = 'pointer';
        
        audioButton.onclick = () => {
            this.playMusic();
            audioButton.remove();
        };
        
        document.body.appendChild(audioButton);
    }

    // Silenciar/activar todos los sonidos
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.music) {
            if (this.isMuted) {
                this.music.pause();
            } else {
                this.playMusic();
            }
        }
        
        return this.isMuted;
    }
}

// Exportar el AudioManager como variable global
window.audioManager = new AudioManager();

// Iniciar el sistema de audio cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager.init();
    
    // Exponer la variable soundEnabled a nivel global para que game.js pueda acceder
    window.soundEnabled = true;
    
    // Reintento de inicialización después de un breve retraso
    setTimeout(() => {
        // Verificar si AudioContext está suspendido y añadir manejador de eventos para reanudar
        if (window.audioManager.audioContext && window.audioManager.audioContext.state === 'suspended') {
            console.log('Configurando manejador de eventos para reanudar AudioContext');
            
            const resumeAudioContext = () => {
                window.audioManager.audioContext.resume().then(() => {
                    console.log('AudioContext reanudado por interacción del usuario');
                }).catch(err => {
                    console.error('Error al reanudar AudioContext:', err);
                });
                
                // Limpiar después de usar
                document.removeEventListener('click', resumeAudioContext);
                document.removeEventListener('keydown', resumeAudioContext);
                document.removeEventListener('touchstart', resumeAudioContext);
            };
            
            document.addEventListener('click', resumeAudioContext);
            document.addEventListener('keydown', resumeAudioContext);
            document.addEventListener('touchstart', resumeAudioContext);
        }
    }, 500);
}); 