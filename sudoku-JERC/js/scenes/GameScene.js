export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Variables del juego
        this.selectedCell = null;
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.numbers = [];
        this.cells = [];
        this.initialBoard = [];
        
        // Dibujar el tablero
        this.drawBoard();
        
        // Añadir controles
        this.addControls();
        
        // Añadir botones
        this.addButtons();
        
        // Generar un Sudoku inicial
        this.generateInitialBoard();
    }

    drawBoard() {
        const graphics = this.add.graphics();
        const offsetX = (800 - 576) / 2;
        const offsetY = (600 - 576) / 2;
        
        // Dibujar celdas
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const x = offsetX + i * 64;
                const y = offsetY + j * 64;
                
                // Crear celda interactiva
                const cell = this.add.rectangle(x + 32, y + 32, 64, 64, 0xffffff)
                    .setStrokeStyle(2, 0x000000)
                    .setInteractive();
                
                cell.gridX = i;
                cell.gridY = j;
                this.cells.push(cell);
                
                // Añadir número
                const number = this.add.text(x + 32, y + 32, '', {
                    fontSize: '32px',
                    fill: '#000',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);
                
                this.numbers.push(number);
            }
        }
        
        // Líneas gruesas para subgrids
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

    addButtons() {
        // Botón Validar
        const validateButton = this.add.rectangle(250, 50, 120, 40, 0x4CAF50);
        this.add.text(250, 50, 'Validar', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        validateButton.setInteractive();
        validateButton.on('pointerover', () => validateButton.setFillStyle(0x45A049));
        validateButton.on('pointerout', () => validateButton.setFillStyle(0x4CAF50));
        validateButton.on('pointerdown', () => this.validateBoard());

        // Botón Reiniciar
        const resetButton = this.add.rectangle(550, 50, 120, 40, 0x4CAF50);
        this.add.text(550, 50, 'Reiniciar', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        resetButton.setInteractive();
        resetButton.on('pointerover', () => resetButton.setFillStyle(0x45A049));
        resetButton.on('pointerout', () => resetButton.setFillStyle(0x4CAF50));
        resetButton.on('pointerdown', () => this.resetBoard());
    }

    addControls() {
        // Manejo de input
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject.type === 'Rectangle' && gameObject.gridX !== undefined) {
                if (this.selectedCell) {
                    this.selectedCell.setStrokeStyle(2, 0x000000);
                }
                this.selectedCell = gameObject;
                gameObject.setStrokeStyle(2, 0x00ff00);
            }
        });
        
        // Manejo de teclado
        this.input.keyboard.on('keydown', (event) => {
            if (this.selectedCell && event.key >= '1' && event.key <= '9') {
                const index = this.selectedCell.gridY * 9 + this.selectedCell.gridX;
                if (!this.cells[index].isFixed) {
                    this.board[this.selectedCell.gridY][this.selectedCell.gridX] = parseInt(event.key);
                    this.numbers[index].setText(event.key);
                }
            }
        });
    }

    generateInitialBoard() {
        const initialNumbers = [
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

        this.initialBoard = JSON.parse(JSON.stringify(initialNumbers));

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (initialNumbers[i][j] !== 0) {
                    this.board[i][j] = initialNumbers[i][j];
                    const index = i * 9 + j;
                    this.numbers[index].setText(initialNumbers[i][j].toString());
                    this.cells[index].setFillStyle(0xf0f0f0);
                    this.cells[index].isFixed = true;
                }
            }
        }
    }

    validateBoard() {
        let isValid = true;
        
        // Validar filas y columnas
        for (let i = 0; i < 9; i++) {
            const row = new Set();
            const col = new Set();
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] !== 0) {
                    if (row.has(this.board[i][j])) {
                        isValid = false;
                        break;
                    }
                    row.add(this.board[i][j]);
                }
                if (this.board[j][i] !== 0) {
                    if (col.has(this.board[j][i])) {
                        isValid = false;
                        break;
                    }
                    col.add(this.board[j][i]);
                }
            }
            if (!isValid) break;
        }

        // Validar subcuadrículas 3x3
        if (isValid) {
            for (let block = 0; block < 9; block++) {
                const set = new Set();
                const rowStart = Math.floor(block / 3) * 3;
                const colStart = (block % 3) * 3;
                
                for (let i = rowStart; i < rowStart + 3; i++) {
                    for (let j = colStart; j < colStart + 3; j++) {
                        if (this.board[i][j] !== 0) {
                            if (set.has(this.board[i][j])) {
                                isValid = false;
                                break;
                            }
                            set.add(this.board[i][j]);
                        }
                    }
                    if (!isValid) break;
                }
                if (!isValid) break;
            }
        }

        // Mostrar mensaje
        const resultText = this.add.text(400, 550, isValid ? '¡Correcto!' : 'Hay errores...', {
            fontSize: '24px',
            fill: isValid ? '#4CAF50' : '#f44336',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Eliminar el mensaje después de 2 segundos
        this.time.delayedCall(2000, () => {
            resultText.destroy();
        });
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