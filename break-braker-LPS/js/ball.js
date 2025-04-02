export default class Ball {
    constructor(canvas) {
        this.canvas = canvas;
        this.radius = 8;
        this.reset();
    }
    
    reset(initialSpeed = 5) {
        // Posicionar la pelota en el centro del canvas
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        
        // Establecer velocidad inicial según el nivel
        this.speed = initialSpeed;
        
        // Establecer un ángulo aleatorio para la dirección inicial
        // pero asegurándose de que vaya hacia abajo
        const angle = Math.random() * Math.PI / 2 + Math.PI / 4; // Entre 45° y 135°
        this.dx = Math.cos(angle) * this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = Math.sin(angle) * this.speed;
        
        // La pelota está adherida a la barra inicialmente
        this.isAttachedToPaddle = true;
    }
    
    // Método para actualizar la velocidad de la pelota
    setSpeed(newSpeed) {
        // Calculamos el factor de cambio de velocidad
        const speedFactor = newSpeed / this.speed;
        
        // Actualizamos la velocidad base
        this.speed = newSpeed;
        
        // Actualizamos las componentes dx, dy manteniendo la dirección
        if (!this.isAttachedToPaddle) {
            this.dx *= speedFactor;
            this.dy *= speedFactor;
        }
    }
    
    // Método para lanzar la pelota
    launch() {
        if (this.isAttachedToPaddle) {
            this.isAttachedToPaddle = false;
        }
    }
    
    update(paddle) {
        // Si la pelota está adherida a la barra, moverla con la barra
        if (this.isAttachedToPaddle) {
            this.x = paddle.x + paddle.width / 2;
            this.y = paddle.y - this.radius;
            return;
        }
        
        // Actualizar la posición de la pelota basada en su velocidad
        this.x += this.dx;
        this.y += this.dy;
        
        // Colisión con los bordes laterales
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) {
            this.dx = -this.dx;
        }
        
        // Colisión con el borde superior
        if (this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        
        // Comprobación de gameover (pelota toca el borde inferior)
        if (this.y + this.radius > this.canvas.height) {
            return true; // Indica game over
        }
        
        return false; // No hay game over
    }
    
    // Comprueba la colisión con la barra del jugador
    checkPaddleCollision(paddle) {
        if (this.y + this.radius >= paddle.y && 
            this.y - this.radius <= paddle.y + paddle.height && 
            this.x + this.radius >= paddle.x && 
            this.x - this.radius <= paddle.x + paddle.width) {
            
            // Calcular la posición relativa de la colisión en la barra (entre -1 y 1)
            const hitPosition = (this.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            
            // Cambiar el ángulo de rebote según donde golpee la pelota
            const angle = hitPosition * (Math.PI / 3); // Máximo 60 grados
            
            // Actualizar la dirección de la pelota
            this.dx = Math.sin(angle) * this.speed;
            this.dy = -Math.cos(angle) * this.speed;
            
            // Asegurarse de que la pelota se aleje de la barra
            if (this.dy > 0) {
                this.dy = -this.dy;
            }
            
            // Aumentar ligeramente la velocidad en cada rebote
            this.speed *= 1.01;
        }
    }
    
    // Comprueba la colisión con un bloque
    checkBlockCollision(block) {
        if (!block.isActive) return false;
        
        // Encontrar el punto más cercano del bloque a la pelota
        const closestX = Math.max(block.x, Math.min(this.x, block.x + block.width));
        const closestY = Math.max(block.y, Math.min(this.y, block.y + block.height));
        
        // Calcular la distancia entre la pelota y el punto más cercano
        const distX = this.x - closestX;
        const distY = this.y - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Si la distancia es menor que el radio de la pelota, hay colisión
        if (distance <= this.radius) {
            // Determinar el lado de colisión (arriba/abajo o izquierda/derecha)
            // para cambiar la dirección apropiadamente
            
            // Colisión vertical (arriba/abajo)
            if (Math.abs(distY) > Math.abs(distX)) {
                this.dy = -this.dy;
            } 
            // Colisión horizontal (izquierda/derecha)
            else {
                this.dx = -this.dx;
            }
            
            return true; // Ha habido colisión
        }
        
        return false; // No ha habido colisión
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.closePath();
    }
} 