class Tetromino {
    static shapes = {
        'I': [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        'O': [
            [1, 1],
            [1, 1]
        ],
        'T': [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        'S': [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        'Z': [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        'J': [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        'L': [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]
    };

    static colors = {
        'I': '#00f0f0',
        'O': '#f0f000',
        'T': '#a000f0',
        'S': '#00f000',
        'Z': '#f00000',
        'J': '#0000f0',
        'L': '#f0a000'
    };

    constructor(type) {
        this.type = type;
        this.shape = Tetromino.shapes[type];
        this.color = Tetromino.colors[type];
        this.x = 3;
        this.y = 0;
    }

    rotate() {
        const N = this.shape.length;
        const rotated = Array(N).fill().map(() => Array(N).fill(0));

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                rotated[j][N - 1 - i] = this.shape[i][j];
            }
        }

        this.shape = rotated;
    }
}

class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextPiece');
        this.nextCtx = this.nextCanvas.getContext('2d');

        this.blockSize = 30;
        this.cols = 10;
        this.rows = 20;

        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.isPaused = false;

        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();

        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        // Inicializar el sistema de puntuaciones
        this.highScores = this.getHighScores();

        this.initializeControls();
        this.updateScore(0);
        this.updateLevel(1);
        this.displayHighScores();
    }

    generatePiece() {
        const types = Object.keys(Tetromino.shapes);
        const type = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(type);
    }

    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar cuadrícula sutil
        this.drawGrid();

        // Dibujar la pieza actual
        this.drawPiece(this.currentPiece, this.ctx, this.currentPiece.x * this.blockSize, this.currentPiece.y * this.blockSize);

        // Dibujar la sombra de la pieza actual
        this.drawPieceShadow();

        // Dibujar el tablero
        this.drawBoard();

        // Dibujar la siguiente pieza
        this.drawNextPiece();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;

        // Líneas horizontales
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.cols * this.blockSize, y * this.blockSize);
            this.ctx.stroke();
        }

        // Líneas verticales
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.rows * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawPieceShadow() {
        // Crear una copia de la pieza actual
        const shadow = new Tetromino(this.currentPiece.type);
        shadow.x = this.currentPiece.x;
        shadow.y = this.currentPiece.y;
        shadow.shape = [...this.currentPiece.shape];

        // Mover la sombra hacia abajo hasta que colisione
        while (!this.checkCollision(shadow)) {
            shadow.y++;
        }
        shadow.y--;

        // Solo dibujar la sombra si está por debajo de la pieza actual
        if (shadow.y > this.currentPiece.y) {
            // Dibujar la sombra
            shadow.shape.forEach((row, i) => {
                row.forEach((value, j) => {
                    if (value) {
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                        this.ctx.fillRect(
                            (shadow.x + j) * this.blockSize,
                            (shadow.y + i) * this.blockSize,
                            this.blockSize - 1,
                            this.blockSize - 1
                        );

                        // Borde de la sombra
                        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(
                            (shadow.x + j) * this.blockSize,
                            (shadow.y + i) * this.blockSize,
                            this.blockSize - 1,
                            this.blockSize - 1
                        );
                    }
                });
            });
        }
    }

    drawPiece(piece, context, x, y) {
        piece.shape.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    // Color base del bloque
                    context.fillStyle = piece.color;
                    context.fillRect(x + j * this.blockSize, y + i * this.blockSize, this.blockSize - 1, this.blockSize - 1);

                    // Efecto 3D: cara superior (más clara)
                    context.fillStyle = this.lightenColor(piece.color, 30);
                    context.beginPath();
                    context.moveTo(x + j * this.blockSize, y + i * this.blockSize);
                    context.lineTo(x + j * this.blockSize + this.blockSize - 1, y + i * this.blockSize);
                    context.lineTo(x + j * this.blockSize + this.blockSize - 4, y + i * this.blockSize + 3);
                    context.lineTo(x + j * this.blockSize + 3, y + i * this.blockSize + 3);
                    context.closePath();
                    context.fill();

                    // Efecto 3D: cara derecha (más oscura)
                    context.fillStyle = this.darkenColor(piece.color, 20);
                    context.beginPath();
                    context.moveTo(x + j * this.blockSize + this.blockSize - 1, y + i * this.blockSize);
                    context.lineTo(x + j * this.blockSize + this.blockSize - 1, y + i * this.blockSize + this.blockSize - 1);
                    context.lineTo(x + j * this.blockSize + this.blockSize - 4, y + i * this.blockSize + this.blockSize - 4);
                    context.lineTo(x + j * this.blockSize + this.blockSize - 4, y + i * this.blockSize + 3);
                    context.closePath();
                    context.fill();

                    // Efecto de brillo
                    context.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    context.fillRect(x + j * this.blockSize + 3, y + i * this.blockSize + 3, this.blockSize / 3, this.blockSize / 3);
                }
            });
        });
    }

    // Método para aclarar un color (para efectos 3D)
    lightenColor(color, percent) {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    // Método para oscurecer un color (para efectos 3D)
    darkenColor(color, percent) {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    drawBoard() {
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    // Color base del bloque
                    this.ctx.fillStyle = value;
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize - 1, this.blockSize - 1);

                    // Efecto 3D: cara superior (más clara)
                    this.ctx.fillStyle = this.lightenColor(value, 30);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x * this.blockSize, y * this.blockSize);
                    this.ctx.lineTo(x * this.blockSize + this.blockSize - 1, y * this.blockSize);
                    this.ctx.lineTo(x * this.blockSize + this.blockSize - 4, y * this.blockSize + 3);
                    this.ctx.lineTo(x * this.blockSize + 3, y * this.blockSize + 3);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // Efecto 3D: cara derecha (más oscura)
                    this.ctx.fillStyle = this.darkenColor(value, 20);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x * this.blockSize + this.blockSize - 1, y * this.blockSize);
                    this.ctx.lineTo(x * this.blockSize + this.blockSize - 1, y * this.blockSize + this.blockSize - 1);
                    this.ctx.lineTo(x * this.blockSize + this.blockSize - 4, y * this.blockSize + this.blockSize - 4);
                    this.ctx.lineTo(x * this.blockSize + this.blockSize - 4, y * this.blockSize + 3);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // Efecto de brillo
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    this.ctx.fillRect(x * this.blockSize + 3, y * this.blockSize + 3, this.blockSize / 3, this.blockSize / 3);
                }
            });
        });
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        const offsetX = (this.nextCanvas.width - this.nextPiece.shape.length * this.blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * this.blockSize) / 2;

        this.drawPiece(this.nextPiece, this.nextCtx, offsetX, offsetY);
    }

    moveDown() {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.merge();
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.generatePiece();

            if (this.checkCollision()) {
                this.gameOver = true;
                this.handleGameOver();
            }
        }
    }

    moveLeft() {
        this.currentPiece.x--;
        if (this.checkCollision()) {
            this.currentPiece.x++;
        }
    }

    moveRight() {
        this.currentPiece.x++;
        if (this.checkCollision()) {
            this.currentPiece.x--;
        }
    }

    rotate() {
        const originalShape = this.currentPiece.shape;
        this.currentPiece.rotate();
        if (this.checkCollision()) {
            this.currentPiece.shape = originalShape;
        }
    }

    checkCollision(piece = this.currentPiece) {
        return piece.shape.some((row, y) => {
            return row.some((value, x) => {
                if (value === 0) return false;
                const boardX = piece.x + x;
                const boardY = piece.y + y;

                return boardX < 0 ||
                    boardX >= this.cols ||
                    boardY >= this.rows ||
                    (boardY >= 0 && this.board[boardY][boardX]);
            });
        });
    }

    merge() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            });
        });

        this.clearLines();
    }

    clearLines() {
        let linesCleared = 0;
        const linesToClear = [];

        // Identificar las líneas que se deben eliminar
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(value => value !== 0)) {
                linesToClear.push(y);
                linesCleared++;
            }
        }

        if (linesCleared > 0) {
            // Efecto visual de eliminación de líneas
            this.animateLinesClear(linesToClear).then(() => {
                // Eliminar las líneas después de la animación
                for (const lineIndex of linesToClear) {
                    this.board.splice(lineIndex, 1);
                    this.board.unshift(Array(this.cols).fill(0));
                }

                const points = [40, 100, 300, 1200][linesCleared - 1] * this.level;
                this.updateScore(this.score + points);

                const oldLevel = this.level;
                if (this.score >= this.level * 1000) {
                    this.updateLevel(this.level + 1);
                    this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

                    // Efecto visual para subir de nivel
                    if (oldLevel !== this.level) {
                        document.getElementById('level').classList.add('level-up');
                        setTimeout(() => {
                            document.getElementById('level').classList.remove('level-up');
                        }, 600);
                    }
                }
            });
        }
    }

    animateLinesClear(lines) {
        return new Promise(resolve => {
            // Crear efecto de destello
            const flash = (count) => {
                if (count === 0) {
                    resolve();
                    return;
                }

                // Dibujar líneas con efecto
                this.draw(); // Redibujar el tablero

                for (const lineIndex of lines) {
                    // Dibujar una línea blanca sobre las líneas a eliminar
                    const alpha = count % 2 === 0 ? 0.8 : 0.2;
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.fillRect(0, lineIndex * this.blockSize, this.cols * this.blockSize, this.blockSize);
                }

                setTimeout(() => flash(count - 1), 60);
            };

            flash(6); // 6 flashes rápidos
        });
    }

    updateScore(newScore) {
        this.score = newScore;
        document.getElementById('score').textContent = this.score;
    }

    updateLevel(newLevel) {
        this.level = newLevel;
        document.getElementById('level').textContent = this.level;
    }

    reset() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.updateScore(0);
        this.updateLevel(1);
        this.gameOver = false;
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        this.dropInterval = 1000;
    }

    update(time = 0) {
        if (this.gameOver || this.isPaused) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
            this.dropCounter = 0;
        }

        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    initializeControls() {
        // Mover el tablero según la posición del mouse para efecto 3D
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameOver || this.isPaused) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calcular el ángulo de rotación basado en la posición del mouse
            const rotateX = (y - rect.height / 2) * 0.01;
            const rotateY = (x - rect.width / 2) * 0.01;

            const boardFrame = document.querySelector('.board-frame');
            if (boardFrame) {
                boardFrame.style.transform = `rotateX(${2 - rotateX}deg) rotateY(${rotateY - 2}deg)`;
            }
        });

        // Restaurar la rotación original cuando el mouse sale del canvas
        this.canvas.addEventListener('mouseleave', () => {
            const boardFrame = document.querySelector('.board-frame');
            if (boardFrame) {
                boardFrame.style.transform = 'rotateX(2deg) rotateY(-2deg)';
            }
        });

        document.addEventListener('keydown', event => {
            if (this.gameOver) return;

            switch (event.code) {
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case 'Space':
                    this.hardDrop();
                    break;
            }
        });

        // Controles móviles
        document.getElementById('leftBtn').addEventListener('click', () => this.moveLeft());
        document.getElementById('rightBtn').addEventListener('click', () => this.moveRight());
        document.getElementById('rotateBtn').addEventListener('click', () => this.rotate());
        document.getElementById('dropBtn').addEventListener('click', () => this.moveDown());

        // Botones de control
        document.getElementById('startBtn').addEventListener('click', () => {
            if (this.gameOver) {
                this.reset();
            }
            this.isPaused = false;
            this.update();

            // Cambiar el texto del botón
            document.getElementById('startBtn').innerHTML = '<i class="fas fa-play"></i> Reiniciar';
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            if (!this.isPaused) {
                this.update();
                document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Pausar';
            } else {
                document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i> Continuar';
            }
        });

        // Botón para reiniciar las puntuaciones
        const resetScoresBtn = document.getElementById('resetScoresBtn');
        if (resetScoresBtn) {
            resetScoresBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres eliminar todas las puntuaciones guardadas?')) {
                    this.highScores = [];
                    localStorage.removeItem('tetrisHighScores');
                    this.displayHighScores();
                    alert('Todas las puntuaciones han sido eliminadas.');
                }
            });
        }
    }

    hardDrop() {
        while (!this.checkCollision()) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        this.merge();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.generatePiece();
    }

    gameOverAnimation() {
        return new Promise(resolve => {
            this.canvas.classList.add('game-over');

            // Efecto de desvanecimiento
            let opacity = 1;
            const fadeOut = () => {
                if (opacity <= 0) {
                    this.canvas.classList.remove('game-over');
                    resolve();
                    return;
                }

                // Oscurecer el tablero gradualmente
                this.ctx.fillStyle = `rgba(0, 0, 0, ${0.1})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                opacity -= 0.05;
                setTimeout(fadeOut, 40);
            };

            setTimeout(fadeOut, 300); // Pequeña pausa antes de iniciar el desvanecimiento
        });
    }

    checkHighScore() {
        // Verificar si la puntuación actual podría estar en el top 5
        if (this.highScores.length < 5 || this.score > this.highScores[this.highScores.length - 1].score) {
            return true;
        }
        return false;
    }

    promptForName() {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.className = 'high-score-modal';

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            const heading = document.createElement('h2');
            heading.textContent = '¡Nueva puntuación alta!';

            const scoreText = document.createElement('p');
            scoreText.textContent = `Tu puntuación: ${this.score}`;

            const form = document.createElement('form');
            form.onsubmit = (e) => {
                e.preventDefault();
                const playerName = nameInput.value.trim() || 'Jugador Anónimo';
                modal.remove();
                resolve(playerName);
            };

            const nameLabel = document.createElement('label');
            nameLabel.textContent = 'Ingresa tu nombre:';
            nameLabel.htmlFor = 'playerName';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'playerName';
            nameInput.maxLength = 15;
            nameInput.placeholder = 'Jugador Anónimo';

            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Guardar';

            form.appendChild(nameLabel);
            form.appendChild(nameInput);
            form.appendChild(submitButton);

            modalContent.appendChild(heading);
            modalContent.appendChild(scoreText);
            modalContent.appendChild(form);
            modal.appendChild(modalContent);

            document.body.appendChild(modal);

            // Enfocar el campo de entrada
            setTimeout(() => nameInput.focus(), 100);
        });
    }

    async handleGameOver() {
        await this.gameOverAnimation();

        if (this.checkHighScore()) {
            const playerName = await this.promptForName();
            const position = this.saveHighScore(playerName, this.score);

            alert(`¡Juego terminado! Tu puntuación: ${this.score}\n¡Felicidades! Has conseguido la posición #${position} en el ranking!`);
        } else {
            alert(`¡Juego terminado! Tu puntuación: ${this.score}`);
        }

        this.reset();
    }

    // Método para obtener las puntuaciones altas del localStorage
    getHighScores() {
        const scores = localStorage.getItem('tetrisHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    // Método para guardar una nueva puntuación alta
    saveHighScore(name, score) {
        const newScore = { name, score, date: new Date().toLocaleDateString() };
        this.highScores.push(newScore);

        // Ordenar de mayor a menor
        this.highScores.sort((a, b) => b.score - a.score);

        // Mantener solo los 5 mejores
        if (this.highScores.length > 5) {
            this.highScores = this.highScores.slice(0, 5);
        }

        // Guardar en localStorage
        localStorage.setItem('tetrisHighScores', JSON.stringify(this.highScores));

        // Actualizar la visualización
        this.displayHighScores();

        return this.highScores.findIndex(s => s.name === name && s.score === score) + 1;
    }

    // Método para mostrar las puntuaciones altas en el DOM
    displayHighScores() {
        const highScoresList = document.getElementById('highScoresList');
        if (!highScoresList) return;

        highScoresList.innerHTML = '';

        if (this.highScores.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'Aún no hay puntuaciones';
            emptyItem.className = 'empty-scores';
            highScoresList.appendChild(emptyItem);
            return;
        }

        this.highScores.forEach((score, index) => {
            const scoreItem = document.createElement('li');
            scoreItem.className = 'high-score-item';

            const position = document.createElement('span');
            position.className = 'position';
            position.textContent = `${index + 1}.`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'player-name';
            nameSpan.textContent = score.name;

            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'player-score';
            scoreSpan.textContent = score.score;

            const dateSpan = document.createElement('span');
            dateSpan.className = 'score-date';
            dateSpan.textContent = score.date;

            scoreItem.appendChild(position);
            scoreItem.appendChild(nameSpan);
            scoreItem.appendChild(scoreSpan);
            scoreItem.appendChild(dateSpan);

            highScoresList.appendChild(scoreItem);
        });
    }
}

// Iniciar el juego cuando se carga la página
window.addEventListener('load', () => {
    const game = new TetrisGame();
});