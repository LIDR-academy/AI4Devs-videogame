class AudioController {
    constructor() {
        this.sounds = {
            pop: new Audio('assets/sounds/pop.wav'),
            success: new Audio('assets/sounds/success.wav'),
            error: new Audio('assets/sounds/error.wav'),
            vocales: {
                'a': new Audio('assets/sounds/vocales/a.mp3'),
                'e': new Audio('assets/sounds/vocales/e.mp3'),
                'i': new Audio('assets/sounds/vocales/i.mp3'),
                'o': new Audio('assets/sounds/vocales/o.mp3'),
                'u': new Audio('assets/sounds/vocales/u.mp3')
            }
        };
        
        // Inicializar con audio silenciado si los archivos no están disponibles
        this.handleMissingAudio();
    }

    handleMissingAudio() {
        // Crear función silenciosa para manejar errores de audio faltante
        const silentPlay = () => console.log('Audio no disponible');
        
        // Manejar errores de carga de audio
        this.sounds.pop.onerror = () => this.sounds.pop.play = silentPlay;
        this.sounds.success.onerror = () => this.sounds.success.play = silentPlay;
        
        Object.values(this.sounds.vocales).forEach(audio => {
            audio.onerror = () => audio.play = silentPlay;
        });
    }

    playVocal(vocal) {
        try {
            // Detener cualquier vocal que esté sonando
            Object.values(this.sounds.vocales).forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            
            // Intentar reproducir la nueva vocal
            this.sounds.vocales[vocal].play().catch(() => console.log('No se pudo reproducir el audio'));
        } catch (error) {
            console.log('Error al reproducir vocal:', vocal);
        }
    }

    playPop() {
        try {
            this.sounds.pop.currentTime = 0;
            this.sounds.pop.play().catch(() => console.log('No se pudo reproducir el pop'));
        } catch (error) {
            console.log('Error al reproducir pop');
        }
    }

    playSuccess() {
        try {
            this.sounds.success.currentTime = 0;
            this.sounds.success.play().catch(() => console.log('No se pudo reproducir el success'));
        } catch (error) {
            console.log('Error al reproducir success');
        }
    }

    playError() {
        try {
            this.sounds.error.currentTime = 0;
            this.sounds.error.play();
        } catch (error) {
            console.log('Error al reproducir sonido de error');
        }
    }
} 