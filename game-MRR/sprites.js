// Clase base para todos los objetos del juego
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isOnGround = false;
    }

    // Método para actualizar posición
    update() {
        // Aplicar velocidad a la posición
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    // Detectar colisiones con otros objetos
    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    draw(ctx) {
        // Método a ser sobrescrito por las clases hijas
        // Por defecto, dibuja un rectángulo de depuración
        if (window.debugMode) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

// Clase para el jugador (esqueleto)
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 60);
        this.lives = 3;
        this.score = 0;
        this.jumpForce = -17;
        this.gravity = 0.8;
        this.speed = 5;
        this.isJumping = false;
        this.direction = 1; // 1: derecha, -1: izquierda
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.state = 'idle'; // idle, run, jump, fall
        
        // Intentar cargar sprite, pero tener respaldo con formas básicas
        this.hasSprite = false;
        this.sprite = new Image();
        this.sprite.src = 'assets/skeleton.png';
        this.sprite.onload = () => {
            console.log('Sprite del esqueleto cargado correctamente');
            this.hasSprite = true;
            // Ajustar dimensiones para mantener proporción con la imagen
            this.spriteWidth = this.sprite.width;
            this.spriteHeight = this.sprite.height;
            // Mantener la altura del jugador y ajustar el ancho proporcionalmente
            this.width = Math.floor(this.sprite.width * (this.height / this.sprite.height));
        };
        this.sprite.onerror = () => {
            console.error('Error al cargar el sprite del esqueleto');
        };
        // Definir dimensiones de referencia para el sprite (valores por defecto)
        this.spriteWidth = 200;
        this.spriteHeight = 250;
    }

    update(platforms, collectibles, enemies) {
        // Actualizar temporizador de invulnerabilidad
        if (this.isInvulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.isInvulnerable = false;
            }
        }
        
        // Aplicar gravedad
        this.velocityY += this.gravity;
        
        // Limitar velocidad máxima de caída
        if (this.velocityY > 15) {
            this.velocityY = 15;
        }
        
        // Actualizar posición
        super.update();
        
        // Asignar estado
        if (this.velocityY < 0) {
            this.state = 'jump';
        } else if (this.velocityY > 1) {
            this.state = 'fall';
        } else if (Math.abs(this.velocityX) > 0.5) {
            this.state = 'run';
        } else {
            this.state = 'idle';
        }
        
        // Actualizar animación
        this.animationTimer++;
        if (this.animationTimer >= 10) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
        
        // Colisión con el suelo y límites del nivel
        if (this.y > GROUND_LEVEL - this.height) {
            this.y = GROUND_LEVEL - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
        
        // Detectar colisiones con plataformas
        this.checkPlatformCollisions(platforms);
        
        // Limitar posición horizontal dentro del nivel
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > LEVEL_WIDTH - this.width) {
            this.x = LEVEL_WIDTH - this.width;
        }

        // Colisión con coleccionables
        for (let i = collectibles.length - 1; i >= 0; i--) {
            if (this.collidesWith(collectibles[i])) {
                this.score += collectibles[i].points;
                collectibles.splice(i, 1);
                
                // Reproducir sonido de recolección
                if (window.audioManager && window.soundEnabled !== false) {
                    window.audioManager.play('collect');
                }
            }
        }

        // Colisión con enemigos (si no es invulnerable)
        if (!this.isInvulnerable) {
            for (const enemy of enemies) {
                if (this.collidesWith(enemy)) {
                    this.lives--;
                    this.isInvulnerable = true;
                    this.invulnerableTimer = 60; // 60 frames = 1 segundo aprox.
                    
                    // Reproducir sonido de daño
                    if (window.audioManager && window.soundEnabled !== false) {
                        window.audioManager.play('hit');
                    }
                    
                    break;
                }
            }
        }
    }

    checkPlatformCollisions(platforms) {
        let onPlatform = false;
        
        platforms.forEach(platform => {
            // Solo verificar si está cayendo (velocidad vertical positiva)
            if (this.velocityY > 0) {
                // Verificar si el jugador estaba por encima de la plataforma en el frame anterior
                const wasAbove = this.y + this.height - this.velocityY <= platform.y;
                
                if (wasAbove && this.checkCollision(platform)) {
                    // Ajustar posición a la parte superior de la plataforma
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    onPlatform = true;
                }
            }
            
            // Colisión con los lados de la plataforma (cuando no está arriba)
            if (!onPlatform && this.checkCollision(platform)) {
                // Colisión lateral
                if (this.x + this.width > platform.x && this.x < platform.x) {
                    // Colisión por la izquierda
                    this.x = platform.x - this.width;
                } else if (this.x < platform.x + platform.width && this.x + this.width > platform.x + platform.width) {
                    // Colisión por la derecha
                    this.x = platform.x + platform.width;
                }
            }
        });
        
        return onPlatform;
    }
    
    checkCollision(object) {
        return (
            this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y
        );
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.state = 'jump';
            
            // Reproducir sonido de salto
            if (window.audioManager && window.soundEnabled !== false) {
                try {
                    window.audioManager.play('jump');
                    console.log('Reproduciendo sonido de salto');
                } catch (error) {
                    console.error('Error al reproducir sonido de salto:', error);
                }
            }
        }
    }

    moveLeft() {
        this.velocityX = -this.speed;
        this.direction = -1;
        if (this.isOnGround) {
            this.state = 'run';
        }
    }

    moveRight() {
        this.velocityX = this.speed;
        this.direction = 1;
        if (this.isOnGround) {
            this.state = 'run';
        }
    }

    stopMoving() {
        this.velocityX = 0;
        if (this.isOnGround) {
            this.state = 'idle';
        }
    }

    draw(ctx) {
        // Parpadeo si es invulnerable
        if (this.isInvulnerable && Math.floor(this.invulnerableTimer / 5) % 2 === 1) {
            return; // No dibujar si está parpadeando
        }
        
        if (this.hasSprite && this.sprite.complete) {
            // Relación de aspecto del sprite original
            const scale = this.height / this.spriteHeight;
            const displayWidth = this.spriteWidth * scale;
            
            ctx.save();
            
            // Aplicar transformación según la dirección
            if (this.direction === -1) {
                // Volteado horizontalmente (mirando a la izquierda)
                ctx.translate(this.x + displayWidth, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.sprite,
                    0, 0, this.spriteWidth, this.spriteHeight,
                    0, this.y, displayWidth, this.height
                );
            } else {
                // Normal (mirando a la derecha)
                ctx.drawImage(
                    this.sprite,
                    0, 0, this.spriteWidth, this.spriteHeight,
                    this.x, this.y, displayWidth, this.height
                );
            }
            
            ctx.restore();
            
            // Información de depuración si es necesario
            if (window.debugMode) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        } else {
            // Dibujar una forma básica si no hay sprite
            ctx.save();
            ctx.fillStyle = '#eeeeee'; // Color hueso para el esqueleto
            
            // Cuerpo
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Detalles (como una cara simple)
            ctx.fillStyle = '#000000';
            
            // Ojos
            const eyeSize = this.width / 8;
            const eyeY = this.y + this.height / 4;
            
            if (this.direction === 1) {
                // Mirando a la derecha
                ctx.fillRect(this.x + this.width / 3, eyeY, eyeSize, eyeSize);
                ctx.fillRect(this.x + this.width * 2/3, eyeY, eyeSize, eyeSize);
            } else {
                // Mirando a la izquierda
                ctx.fillRect(this.x + this.width / 3 - eyeSize, eyeY, eyeSize, eyeSize);
                ctx.fillRect(this.x + this.width * 2/3 - eyeSize, eyeY, eyeSize, eyeSize);
            }
            
            // Boca
            const mouthY = this.y + this.height / 2;
            ctx.fillRect(this.x + this.width / 4, mouthY, this.width / 2, eyeSize);
            
            ctx.restore();
        }
    }

    checkPumpkinCollisions(pumpkins) {
        for (let i = pumpkins.length - 1; i >= 0; i--) {
            const pumpkin = pumpkins[i];
            
            // Verificar colisión con calabaza
            if (this.x + this.width > pumpkin.x && 
                this.x < pumpkin.x + pumpkin.width && 
                this.y + this.height > pumpkin.y && 
                this.y < pumpkin.y + pumpkin.height) {
                
                // Recolectar calabaza
                this.score += 10;
                pumpkins.splice(i, 1);
                
                // Reproducir sonido de recolección
                if (window.audioManager) {
                    console.log('Reproduciendo sonido de recolección');
                    window.audioManager.play('collect');
                }
            }
        }
    }
    
    checkGhostCollisions(ghosts) {
        for (const ghost of ghosts) {
            // Verificar colisión con fantasma
            if (this.x + this.width > ghost.x + 10 && 
                this.x < ghost.x + ghost.width - 10 && 
                this.y + this.height > ghost.y + 10 && 
                this.y < ghost.y + ghost.height - 10) {
                
                // Perder vida y entrar en estado de invulnerabilidad
                this.lives--;
                this.isInvulnerable = true;
                this.lastCollisionTime = Date.now();
                
                // Reproducir sonido de golpe
                if (window.audioManager) {
                    console.log('Reproduciendo sonido de daño');
                    window.audioManager.play('hit');
                }
                
                // Efecto de retroceso
                if (this.x < ghost.x) {
                    this.velX = -8; // Empujar hacia la izquierda
                } else {
                    this.velX = 8; // Empujar hacia la derecha
                }
                this.velY = -5; // Pequeño salto hacia arriba
                
                break; // Salir del bucle una vez detectada una colisión
            }
        }
    }

    hit() {
        if (!this.isInvulnerable) {
            this.lives--;
            this.isInvulnerable = true;
            this.invulnerableTimer = 60; // 1 segundo a 60 FPS
            
            // Reproducir sonido de golpe
            if (window.audioManager && window.soundEnabled !== false) {
                try {
                    window.audioManager.play('hit');
                    console.log('Reproduciendo sonido de daño');
                } catch (error) {
                    console.error('Error al reproducir sonido de daño:', error);
                }
            }
        }
    }
}

// Clase para plataformas
class Platform extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.hasSprite = false;
        this.sprite = new Image();
        this.sprite.src = 'assets/platform.png';
        this.sprite.onload = () => {
            console.log('Sprite de la plataforma cargado correctamente');
            this.hasSprite = true;
        };
        this.sprite.onerror = () => {
            console.error('Error al cargar el sprite de la plataforma, usando respaldo');
            this.hasSprite = false;
        };
        this.tileWidth = 32;
        this.tileHeight = 32;
    }

    draw(ctx) {
        try {
            if (this.hasSprite && this.sprite.complete) {
                // Dibujar plataforma con patrón repetitivo
                const horizontalTiles = Math.ceil(this.width / this.tileWidth);
                
                for (let i = 0; i < horizontalTiles; i++) {
                    const drawWidth = (i === horizontalTiles - 1) 
                        ? this.width - (this.tileWidth * i) 
                        : this.tileWidth;
                    
                    ctx.drawImage(
                        this.sprite,
                        0, 0, this.tileWidth, this.tileHeight,
                        this.x + (i * this.tileWidth), this.y,
                        drawWidth, this.height
                    );
                }
            } else {
                // Dibujar una forma básica si no hay sprite
                this.drawFallbackPlatform(ctx);
            }
        } catch (error) {
            console.error('Error al dibujar plataforma:', error);
            // En caso de error, siempre dibujar el respaldo
            this.drawFallbackPlatform(ctx);
        }
    }
    
    // Método para dibujar una plataforma básica como respaldo
    drawFallbackPlatform(ctx) {
        ctx.save();
        
        // Color principal de la plataforma
        ctx.fillStyle = '#8B4513'; // Marrón para plataformas
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Borde superior con hierba (temática Halloween)
        ctx.fillStyle = '#4B5320'; // Verde oscuro
        ctx.fillRect(this.x, this.y, this.width, 5);
        
        // Detalles para hacerlo más interesante
        ctx.fillStyle = '#663300'; // Marrón más oscuro para los detalles
        
        // Dibujar algunos "ladrillos" o marcas en la plataforma
        const brickWidth = 20;
        const brickSpacing = 30;
        
        for (let i = 0; i < this.width; i += brickSpacing) {
            ctx.fillRect(this.x + i, this.y + 8, brickWidth, 2);
            ctx.fillRect(this.x + i + 5, this.y + 15, brickWidth, 2);
        }
        
        ctx.restore();
    }
}

// Clase para enemigos (fantasmas)
class Ghost extends GameObject {
    constructor(x, y, patrolDistance = 200) {
        super(x, y, 40, 50);
        this.originalX = x;
        this.patrolDistance = patrolDistance;
        this.speed = 2;
        this.velocityX = this.speed;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.hasSprite = false;
        this.sprite = new Image();
        this.sprite.src = 'assets/ghost.png';
        this.sprite.onload = () => {
            console.log('Sprite del fantasma cargado correctamente');
            this.hasSprite = true;
        };
        this.sprite.onerror = () => {
            console.error('Error al cargar el sprite del fantasma, usando respaldo');
            this.hasSprite = false;
        };
        this.spriteWidth = 64;
        this.spriteHeight = 64;
    }

    update() {
        super.update();
        
        // Movimiento de patrulla horizontal
        if (this.x > this.originalX + this.patrolDistance) {
            this.velocityX = -this.speed;
        } else if (this.x < this.originalX) {
            this.velocityX = this.speed;
        }
        
        // Animación flotante vertical
        this.y += Math.sin(Date.now() / 200) * 0.5;
        
        // Actualizar frame de animación
        this.animationTimer++;
        if (this.animationTimer >= 10) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    draw(ctx) {
        try {
            if (this.hasSprite && this.sprite.complete) {
                ctx.save();
                // Ajustar solo para animación de marco (no para frames de animación de sprite sheet)
                const drawWidth = this.width;
                const drawHeight = this.height;
                
                if (this.velocityX < 0) {
                    // Mirando a la izquierda
                    ctx.translate(this.x + drawWidth, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(
                        this.sprite,
                        0, 0,
                        this.sprite.width, this.sprite.height,
                        0, this.y,
                        drawWidth, drawHeight
                    );
                } else {
                    // Mirando a la derecha
                    ctx.drawImage(
                        this.sprite,
                        0, 0,
                        this.sprite.width, this.sprite.height,
                        this.x, this.y,
                        drawWidth, drawHeight
                    );
                }
                ctx.restore();
                
                // Información de depuración si es necesario
                if (window.debugMode) {
                    ctx.strokeStyle = 'red';
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            } else {
                // Dibujar una forma básica si no hay sprite
                this.drawFallbackGhost(ctx);
            }
        } catch (error) {
            console.error('Error al dibujar fantasma:', error);
            // En caso de error, siempre dibujar el respaldo
            this.drawFallbackGhost(ctx);
        }
    }
    
    // Método para dibujar un fantasma básico como respaldo
    drawFallbackGhost(ctx) {
        ctx.save();
        
        // Fantasma básico
        ctx.fillStyle = 'rgba(200, 200, 255, 0.7)'; // Color fantasmal semitransparente
        
        // Cuerpo del fantasma (forma redondeada arriba y ondulada abajo)
        const ghostHeight = this.height * 0.8;
        
        // Cuerpo principal
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.width/2, this.width/2, Math.PI, 0, false);
        ctx.lineTo(this.x + this.width, this.y + ghostHeight);
        
        // Base ondulada
        const waveHeight = this.height * 0.2;
        const segments = 3;
        const segmentWidth = this.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const waveY = this.y + ghostHeight + (i % 2 === 0 ? waveHeight : 0);
            ctx.lineTo(this.x + this.width - segmentWidth * (i + 1), waveY);
        }
        
        ctx.lineTo(this.x, this.y + ghostHeight);
        ctx.closePath();
        ctx.fill();
        
        // Ojos
        ctx.fillStyle = '#000000';
        const eyeSize = this.width / 6;
        const eyeY = this.y + this.height / 3;
        
        if (this.velocityX >= 0) {
            // Mirando a la derecha
            ctx.fillRect(this.x + this.width / 3 - eyeSize/2, eyeY, eyeSize, eyeSize);
            ctx.fillRect(this.x + this.width * 2/3 - eyeSize/2, eyeY, eyeSize, eyeSize);
        } else {
            // Mirando a la izquierda  
            ctx.fillRect(this.x + this.width / 3 - eyeSize/2, eyeY, eyeSize, eyeSize);
            ctx.fillRect(this.x + this.width * 2/3 - eyeSize/2, eyeY, eyeSize, eyeSize);
        }
        
        ctx.restore();
    }
}

// Clase para coleccionables (calabazas)
class Pumpkin extends GameObject {
    constructor(x, y) {
        super(x, y, 30, 30);
        this.points = 10;
        this.hasSprite = false;
        this.sprite = new Image();
        this.sprite.src = 'assets/pumpkin.png';
        this.sprite.onload = () => {
            console.log('Sprite de la calabaza cargado correctamente');
            this.hasSprite = true;
        };
        this.sprite.onerror = () => {
            console.error('Error al cargar el sprite de la calabaza, usando respaldo');
            this.hasSprite = false;
        };
        this.rotation = 0;
    }

    update() {
        super.update();
        
        // Animación de rotación suave
        this.rotation = (Math.sin(Date.now() / 500) * 0.1);
    }

    draw(ctx) {
        try {
            if (this.hasSprite && this.sprite.complete) {
                ctx.save();
                // Aplicar rotación para animación
                ctx.translate(this.x + this.width/2, this.y + this.height/2);
                ctx.rotate(this.rotation);
                ctx.drawImage(
                    this.sprite,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height
                );
                ctx.restore();
            } else {
                // Dibujar una forma básica si no hay sprite
                this.drawFallbackPumpkin(ctx);
            }
        } catch (error) {
            console.error('Error al dibujar calabaza:', error);
            // En caso de error, siempre dibujar el respaldo
            this.drawFallbackPumpkin(ctx);
        }
    }
    
    // Método para dibujar una calabaza básica como respaldo
    drawFallbackPumpkin(ctx) {
        ctx.save();
        
        // Aplicar rotación para animación
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        // Color principal de la calabaza
        ctx.fillStyle = '#ff6600'; // Naranja
        
        // Cuerpo de la calabaza (círculo)
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Detalles de la calabaza
        ctx.fillStyle = '#000000'; // Negro para los ojos y la boca
        
        // Ojos
        const eyeSize = this.width / 8;
        const eyeOffsetX = this.width / 6;
        const eyeOffsetY = -this.height / 6;
        
        // Primer ojo (triangular)
        ctx.beginPath();
        ctx.moveTo(-eyeOffsetX, eyeOffsetY);
        ctx.lineTo(-eyeOffsetX - eyeSize, eyeOffsetY - eyeSize);
        ctx.lineTo(-eyeOffsetX + eyeSize, eyeOffsetY - eyeSize);
        ctx.closePath();
        ctx.fill();
        
        // Segundo ojo (triangular)
        ctx.beginPath();
        ctx.moveTo(eyeOffsetX, eyeOffsetY);
        ctx.lineTo(eyeOffsetX - eyeSize, eyeOffsetY - eyeSize);
        ctx.lineTo(eyeOffsetX + eyeSize, eyeOffsetY - eyeSize);
        ctx.closePath();
        ctx.fill();
        
        // Boca (forma curva)
        ctx.beginPath();
        ctx.arc(0, this.height/6, this.width/3, 0, Math.PI);
        ctx.fill();
        
        // Tallo
        ctx.fillStyle = '#663300'; // Marrón
        ctx.fillRect(-this.width/10, -this.height/2, this.width/5, -this.height/5);
        
        ctx.restore();
    }
}