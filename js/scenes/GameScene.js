export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.selectedCell = null;
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.numbers = [];
        this.cells = [];
        this.initialBoard = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ];
    }

    create() {
        this.createBoard();
        this.createButtons();
        this.setupInputHandlers();
        this.fillInitialNumbers();
    }

    createBoard() {
        const graphics = this.add.graphics();
        const offsetX = (800 - 576) / 2;
        const offsetY = (600 - 576) / 2;

        // Dibujar celdas
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const x = offsetX + j * 64;
                const y = offsetY + i * 64;

                // Crear celda
                const cell = this.add.rectangle(x + 32, y + 32, 64, 64, 0xffffff)
                    .setStrokeStyle(2, 0x000000)
                    .setInteractive();
                
                // Coordenadas de la cuadrícula
                cell.gridX = j;
                cell.gridY = i;
                this.cells.push(cell);

                // Crear texto para números
                const number = this.add.text(x + 32, y + 32, '', {
                    fontSize: '32px',
                    fill: '#000',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);

                this.numbers.push(number);
            }
        }

        // Dibujar líneas gruesas para subgrids
        graphics.lineStyle(4, 0x000000);
        for (let i = 0; i <= 9; i += 3) {
            graphics.beginPath();
            graphics.moveTo(offsetX + i * 64, offsetY);
            graphics.lineTo(offsetX + i * 64, offsetY + 9 * 64);
            graphics.moveTo(offsetX, offsetY + i * 64);
            graphics.lineTo(offsetX + 9 * 64, offsetY + i * 64);
            graphics.strokePath();
        }
    }

    createButtons() {
        // Calcular posiciones basadas en el tablero
        const offsetX = (800 - 576) / 2;
        const offsetY = (600 - 576) / 2;

        // Botón Validar - En la celda 2 de la primera fila
        const validateButton = this.add.rectangle(
            offsetX + 64 * 1,  // Segunda celda
            offsetY + 32,      // Primera fila
            120, 40, 
            0x4CAF50
        ).setInteractive();
        
        const validateText = this.add.text(
            offsetX + 64 * 1,
            offsetY + 32,
            'Validar', 
            {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Botón Reiniciar - En la celda 7 de la primera fila
        const resetButton = this.add.rectangle(
            offsetX + 64 * 6,  // Séptima celda
            offsetY + 32,      // Primera fila
            120, 40, 
            0x4CAF50
        ).setInteractive();
        
        const resetText = this.add.text(
            offsetX + 64 * 6,
            offsetY + 32,
            'Reiniciar', 
            {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Marcar los botones para excluirlos de la selección
        validateButton.isButton = true;
        resetButton.isButton = true;

        // Interactividad de los botones
        [validateButton, resetButton].forEach((button, index) => {
            const text = index === 0 ? validateText : resetText;
            button.on('pointerover', () => {
                button.setFillStyle(0x45A049);
                text.setScale(1.1);
            });
            button.on('pointerout', () => {
                button.setFillStyle(0x4CAF50);
                text.setScale(1);
            });
        });

        validateButton.on('pointerdown', () => this.validateBoard());
        resetButton.on('pointerdown', () => this.resetBoard());
    }

    setupInputHandlers() {
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            // Ignorar si es un botón
            if (gameObject.isButton) return;

            // Solo procesar si es una celda del tablero
            if (gameObject.type === 'Rectangle' && gameObject.gridX !== undefined) {
                // Deseleccionar celda anterior
                if (this.selectedCell) {
                    this.selectedCell.setStrokeStyle(2, 0x000000);
                }

                // Solo seleccionar si no es una celda fija
                if (!gameObject.isFixed) {
                    this.selectedCell = gameObject;
                    gameObject.setStrokeStyle(2, 0x00ff00);

                    // Debug para verificar coordenadas
                    console.log(`Celda seleccionada: x=${gameObject.gridX}, y=${gameObject.gridY}`);
                }
            }
        });

        this.input.keyboard.on('keydown', (event) => {
            if (this.selectedCell && event.key >= '1' && event.key <= '9') {
                const x = this.selectedCell.gridX;
                const y = this.selectedCell.gridY;
                const index = y * 9 + x;

                if (!this.cells[index].isFixed) {
                    const number = parseInt(event.key);
                    
                    // Actualizar el tablero lógico
                    this.board[y][x] = number;
                    
                    // Actualizar la visualización
                    this.numbers[index].setText(number.toString());
                    
                    // Efecto visual
                    this.numbers[index].setScale(1.2);
                    this.tweens.add({
                        targets: this.numbers[index],
                        scale: 1,
                        duration: 200,
                        ease: 'Back.easeOut'
                    });

                    // Debug para verificar la actualización
                    console.log(`Número ${number} insertado en: x=${x}, y=${y}, index=${index}`);
                }
            }
        });
    }

    fillInitialNumbers() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.initialBoard[i][j] !== 0) {
                    const index = i * 9 + j;
                    this.board[i][j] = this.initialBoard[i][j];
                    this.numbers[index].setText(this.initialBoard[i][j].toString());
                    this.cells[index].setFillStyle(0xf0f0f0);
                    this.cells[index].isFixed = true;
                }
            }
        }
    }

    validateBoard() {
        let isValid = this.checkBoardValidity();
        
        const resultText = this.add.text(400, 550, 
            isValid ? '¡Correcto!' : 'Hay errores...', {
            fontSize: '24px',
            fill: isValid ? '#4CAF50' : '#f44336',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => resultText.destroy());
    }

    checkBoardValidity() {
        // Validar filas y columnas
        for (let i = 0; i < 9; i++) {
            if (!this.isValidSet(this.board[i]) || 
                !this.isValidSet(this.board.map(row => row[i]))) {
                return false;
            }
        }

        // Validar subcuadrículas 3x3
        for (let blockRow = 0; blockRow < 3; blockRow++) {
            for (let blockCol = 0; blockCol < 3; blockCol++) {
                const numbers = [];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        numbers.push(this.board[blockRow * 3 + i][blockCol * 3 + j]);
                    }
                }
                if (!this.isValidSet(numbers)) return false;
            }
        }
        return true;
    }

    isValidSet(numbers) {
        const set = new Set();
        for (let num of numbers) {
            if (num !== 0) {
                if (set.has(num)) return false;
                set.add(num);
            }
        }
        return true;
    }

    resetBoard() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const index = i * 9 + j;
                if (!this.cells[index].isFixed) {
                    this.board[i][j] = 0;
                    this.numbers[index].setText('');
                }
            }
        }
        if (this.selectedCell) {
            this.selectedCell.setStrokeStyle(2, 0x000000);
            this.selectedCell = null;
        }
    }
} 