export default class Paddle {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 100;
        this.height = 15;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 8;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        
        // Configurar controles del teclado
        this.setupKeyboardControls();
        
        // Configurar controles del ratón
        this.setupMouseControls();
    }
    
    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.isMovingLeft = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.isMovingRight = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.isMovingLeft = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.isMovingRight = false;
            }
        });
    }
    
    setupMouseControls() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            // Centrar la barra en la posición horizontal del ratón
            this.x = mouseX - this.width / 2;
            
            // Mantener la barra dentro de los límites del canvas
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x + this.width > this.canvas.width) {
                this.x = this.canvas.width - this.width;
            }
        });
    }
    
    update() {
        // Mover la barra según las teclas presionadas
        if (this.isMovingLeft) {
            this.x -= this.speed;
        }
        if (this.isMovingRight) {
            this.x += this.speed;
        }
        
        // Mantener la barra dentro de los límites del canvas
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Añadir un efecto visual (degradado)
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    reset() {
        this.x = this.canvas.width / 2 - this.width / 2;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }
} 