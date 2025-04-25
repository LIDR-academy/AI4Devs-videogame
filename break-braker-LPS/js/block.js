export default class Block {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isActive = true;
        this.value = 10; // Puntos que da este bloque al ser destruido
    }
    
    draw(ctx) {
        if (!this.isActive) return;
        
        // Dibujar el bloque principal
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Efecto de brilloso (borde superior e izquierdo más claro)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(this.x, this.y, this.width, 2);
        ctx.fillRect(this.x, this.y, 2, this.height);
        
        // Efecto de sombra (borde inferior y derecho más oscuro)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x + this.width - 2, this.y, 2, this.height);
        ctx.fillRect(this.x, this.y + this.height - 2, this.width, 2);
    }
    
    // Método para desactivar el bloque cuando es golpeado
    hit() {
        this.isActive = false;
        return this.value;
    }
}

export class BlockManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.blocks = [];
        this.levelConfigurations = [
            // Nivel 1: disposición básica de 5x8 (más lento)
            {
                rows: 5,
                cols: 8,
                colors: ['#FF5252', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3'],
                ballSpeed: 4  // Velocidad más baja para nivel 1
            },
            // Nivel 2: más bloques y diferentes colores
            {
                rows: 6,
                cols: 10,
                colors: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688'],
                ballSpeed: 5  // Velocidad media para nivel 2
            },
            // Nivel 3: bloques en patrón más complejo
            {
                rows: 7,
                cols: 12,
                colors: ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#795548'],
                ballSpeed: 6  // Velocidad más alta para nivel 3
            }
        ];
        this.currentLevel = 0;
        this.setupBlocks();
    }
    
    setupBlocks() {
        // Vaciar el array de bloques
        this.blocks = [];
        
        // Obtener la configuración del nivel actual
        const config = this.levelConfigurations[this.currentLevel];
        
        // Configuración de la cuadrícula de bloques
        const rows = config.rows;
        const cols = config.cols;
        const blockWidth = (this.canvas.width - 40) / cols;
        const blockHeight = 25;
        const startX = 20;
        const startY = 50;
        
        // Crear la cuadrícula de bloques
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * blockWidth;
                const y = startY + row * blockHeight;
                
                // Usar un color diferente para cada fila
                const color = config.colors[row % config.colors.length];
                
                this.blocks.push(new Block(x, y, blockWidth - 4, blockHeight - 4, color));
            }
        }
    }
    
    // Comprueba si todos los bloques han sido destruidos
    allBlocksDestroyed() {
        return this.blocks.every(block => !block.isActive);
    }
    
    // Comprueba colisiones con todos los bloques
    checkCollisions(ball) {
        let score = 0;
        
        for (const block of this.blocks) {
            if (ball.checkBlockCollision(block)) {
                score += block.hit();
            }
        }
        
        return score;
    }
    
    // Dibuja todos los bloques activos
    draw(ctx) {
        for (const block of this.blocks) {
            block.draw(ctx);
        }
    }
    
    // Avanza al siguiente nivel o vuelve al primero si ya estaba en el último
    nextLevel() {
        this.currentLevel = (this.currentLevel + 1) % this.levelConfigurations.length;
        this.setupBlocks();
        return this.currentLevel;
    }
    
    // Reinicia el nivel actual
    reset() {
        this.setupBlocks();
    }
    
    // Obtiene el nivel actual como número (para mostrar)
    getCurrentLevelNumber() {
        return this.currentLevel + 1;
    }
    
    // Comprueba si hay más niveles disponibles
    hasMoreLevels() {
        return this.currentLevel < this.levelConfigurations.length - 1;
    }
    
    // Obtiene la velocidad de la bola para el nivel actual
    getBallSpeed() {
        return this.levelConfigurations[this.currentLevel].ballSpeed;
    }
}