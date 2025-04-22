class Game {
    constructor() {
        this.audioController = new AudioController();
        this.burbujas = [];
        this.progress = 0;
        this.score = 0;
        this.vocalObjetivo = '';
        this.vocales = ['a', 'e', 'i', 'o', 'u'];
        this.audioInitialized = false;
        this.init();
    }

    init() {
        this.createGameContainer();
        this.createScoreBoard();
        this.createBubbles();
        this.setupEventListeners();
        this.mostrarPantallaInicio();
    }

    setupEventListeners() {
        document.getElementById('burbujas').addEventListener('click', async (e) => {
            const bubble = e.target.closest('.burbuja');
            if (bubble) {
                const vocalSeleccionada = bubble.textContent;
                
                if (vocalSeleccionada === this.vocalObjetivo) {
                    // Respuesta correcta
                    this.audioController.playVocal(vocalSeleccionada);
                    
                    setTimeout(() => {
                        this.audioController.playSuccess();
                        this.actualizarPuntuacion();
                        this.mostrarFeedback(true);
                        this.updateProgress();
                        this.showReward();
                        
                        // Primero mezclamos las vocales
                        setTimeout(() => {
                            // Mezclar las posiciones de las burbujas existentes
                            this.mezclarBurbujas();
                            // Luego iniciamos nueva ronda
                            this.nuevaRonda();
                        }, 1000);
                    }, 800);
                } else {
                    // Respuesta incorrecta
                    this.audioController.playVocal(vocalSeleccionada);
                    
                    // Mantener toda la reacción de error
                    setTimeout(() => {
                        this.audioController.playError();
                        this.mostrarFeedback(false);
                        bubble.classList.add('incorrecto');
                        
                        // Quitar la animación después de un tiempo
                        setTimeout(() => {
                            bubble.classList.remove('incorrecto');
                        }, 500);
                    }, 800);
                }
            }
        });
    }

    // Nuevo método para mezclar las burbujas existentes
    mezclarBurbujas() {
        const positions = [
            { x: 20, y: 20 },
            { x: 60, y: 20 },
            { x: 40, y: 40 },
            { x: 20, y: 60 },
            { x: 60, y: 60 }
        ];
        
        // Mezclar las posiciones
        positions.sort(() => Math.random() - 0.5);
        
        // Asignar nuevas posiciones a las burbujas existentes
        this.burbujas.forEach((bubble, index) => {
            bubble.element.style.left = `${positions[index].x}%`;
            bubble.element.style.top = `${positions[index].y}%`;
            
            // Agregar una transición suave
            bubble.element.style.transition = 'left 0.5s ease, top 0.5s ease';
        });
    }

    createScoreBoard() {
        // Crear el tablero de puntuación
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        scoreBoard.innerHTML = `
            <div class="score">Puntos: <span id="score-value">0</span></div>
            <div id="feedback-message"></div>
        `;
        document.getElementById('game-container').prepend(scoreBoard);
    }

    createGameContainer() {
        const container = document.getElementById('burbujas');
        if (!container) {
            console.error('Contenedor de burbujas no encontrado');
            return;
        }
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
    }

    createBubbles() {
        const container = document.getElementById('burbujas');
        container.innerHTML = '';
        this.burbujas = [];
        
        // Asegurarnos de mezclar las vocales aleatoriamente
        const vocalesMezcladas = [...this.vocales].sort(() => Math.random() - 0.5);
        
        // Crear las burbujas con las vocales mezcladas
        vocalesMezcladas.forEach(vocal => {
            const bubble = new Bubble(vocal);
            container.appendChild(bubble.element);
            this.burbujas.push(bubble);
        });
    }

    mostrarPantallaInicio() {
        const pantallaInicio = document.createElement('div');
        pantallaInicio.id = 'pantalla-inicio';
        pantallaInicio.innerHTML = `
            <div class="inicio-contenido">
                <h1>¡Juego de Vocales!</h1>
                <button id="btn-comenzar">¡Comenzar! 🎮</button>
            </div>
        `;
        document.getElementById('game-container').appendChild(pantallaInicio);

        // Iniciar el juego al hacer click en el botón
        document.getElementById('btn-comenzar').onclick = () => {
            this.audioInitialized = true;
            pantallaInicio.remove();
            this.nuevaRonda();
        };
    }

    nuevaRonda() {
        if (!this.audioInitialized) return;
        
        this.vocalObjetivo = this.vocales[Math.floor(Math.random() * this.vocales.length)];
        this.mostrarInstruccion();
        this.audioController.playVocal(this.vocalObjetivo);
    }

    mostrarInstruccion() {
        let instruccion = document.getElementById('instruccion');
        if (!instruccion) {
            instruccion = document.createElement('div');
            instruccion.id = 'instruccion';
            document.getElementById('game-container').prepend(instruccion);
        }
        
        // Mantenemos la vocal en minúscula en la instrucción
        instruccion.innerHTML = `
            <span>¡Encuentra la vocal ${this.vocalObjetivo}!</span>
            <div class="sound-icon">🔊</div>
        `;

        instruccion.style.cursor = 'pointer';
        instruccion.onclick = () => {
            this.audioController.playVocal(this.vocalObjetivo);
            const soundIcon = instruccion.querySelector('.sound-icon');
            soundIcon.classList.add('sound-active');
            setTimeout(() => {
                soundIcon.classList.remove('sound-active');
            }, 200);
        };
    }

    mostrarFeedback(correcto) {
        const feedbackDiv = document.getElementById('feedback-message');
        feedbackDiv.textContent = correcto ? '¡Muy bien! 🌟' : '¡Inténtalo otra vez! 😊';
        feedbackDiv.className = correcto ? 'feedback-correcto' : 'feedback-incorrecto';
        
        setTimeout(() => {
            feedbackDiv.textContent = '';
            feedbackDiv.className = '';
        }, 2000);
    }

    actualizarPuntuacion() {
        this.score += 10;
        const scoreValue = document.getElementById('score-value');
        scoreValue.textContent = this.score;
        scoreValue.classList.add('score-change');
        setTimeout(() => scoreValue.classList.remove('score-change'), 500);
    }

    updateProgress() {
        this.progress++;
        if (this.progress >= 5) {
            this.showReward();
            this.progress = 0;
        }
    }

    showReward() {
        const premio = document.getElementById('premio');
        premio.classList.remove('hidden');
        
        for (let i = 0; i < 5; i++) {
            this.createStar();
        }
        
        setTimeout(() => {
            premio.classList.add('hidden');
            premio.innerHTML = '';
        }, 1500);
    }

    createStar() {
        const star = document.createElement('img');
        star.src = 'assets/images/effects/star.png';
        star.className = 'estrella';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        document.getElementById('premio').appendChild(star);
    }
}

// Asegurarse de que el DOM esté completamente cargado
window.addEventListener('load', () => {
    new Game();
}); 