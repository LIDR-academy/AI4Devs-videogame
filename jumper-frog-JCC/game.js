class JumperFrog {
    constructor() {
        this.frog = null;
        this.vehicles = [];
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 2;
        this.baseVehicleSpeed = 1.0;
        this.isGameRunning = false;
        this.isPaused = false;
        this.animationFrame = null;
        this.laneOccupancy = new Array(5).fill(false);
        this.vehicleTypes = [
            { size: 'small', name: 'Carro', speed: 0.8, svgId: 'car' },
            { size: 'small', name: 'Taxi', speed: 0.9, svgId: 'taxi' },
            { size: 'medium', name: 'Ambulancia', speed: 1.2, svgId: 'ambulance' },
            { size: 'large', name: 'Bus', speed: 1.0, svgId: 'bus' },
            { size: 'large', name: 'Camión', speed: 0.7, svgId: 'truck' }
        ];
        this.lastVehicleTime = 0;
        this.vehicleSpawnInterval = 200;
        this.minSpawnInterval = 100;
        this.currentSpeedMultiplier = 1;
        this.isMoving = false;
        this.moveDelay = 50;
        this.lastMoveTime = 0;
        this.lastFrameTime = 0;
        this.maxSpeedMultiplier = 2.0;
        this.initialVehicles = 20;
        this.minDistanceBetweenVehicles = 40;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createFrog();
        this.updateScore();
        this.updateLives();
    }

    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    createFrog() {
        this.frog = document.createElement('div');
        this.frog.className = 'frog';
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#frog');
        svg.appendChild(use);
        
        this.frog.appendChild(svg);
        this.resetFrogPosition();
        document.querySelector('.game-board').appendChild(this.frog);
    }

    resetFrogPosition() {
        this.frog.style.left = '380px';
        this.frog.style.top = '520px';
    }

    startGame() {
        document.querySelector('.start-screen').classList.add('hidden');
        this.isGameRunning = true;
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        this.lastVehicleTime = Date.now();
        this.lastMoveTime = Date.now();
        this.stopGameLoop();
        this.startGameLoop();
        
        // Crear vehículos iniciales
        for (let i = 0; i < this.initialVehicles; i++) {
            this.createInitialVehicle();
        }
    }

    startGameLoop() {
        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    stopGameLoop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    togglePause() {
        if (!this.isGameRunning) return;

        if (this.isPaused) {
            // Reanudar el juego
            this.isPaused = false;
            this.lastFrameTime = performance.now();
            this.lastVehicleTime = Date.now();
            this.lastMoveTime = Date.now();
            this.startGameLoop();
            document.querySelector('.pause-overlay').classList.add('hidden');
        } else {
            // Pausar el juego
            this.isPaused = true;
            this.stopGameLoop();
            document.querySelector('.pause-overlay').classList.remove('hidden');
        }
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 2;
        this.baseVehicleSpeed = 1.0;
        this.vehicleSpawnInterval = 200;
        this.currentSpeedMultiplier = 1;
        this.laneOccupancy = new Array(5).fill(false);
        this.lastVehicleTime = Date.now();
        this.updateScore();
        this.updateLives();
        document.getElementById('speed').textContent = '1.0x';
        this.removeAllVehicles();
        this.resetFrogPosition();
        document.querySelector('.game-over').classList.add('hidden');
        this.isGameRunning = true;
        this.startGame();
    }

    handleKeyPress(e) {
        if (!this.isGameRunning || this.isMoving) return;

        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < this.moveDelay) return;

        const frogLeft = parseInt(this.frog.style.left);
        const frogTop = parseInt(this.frog.style.top);
        const step = 40;
        let newLeft = frogLeft;
        let newTop = frogTop;

        switch (e.key) {
            case 'ArrowLeft':
                newLeft = Math.max(0, frogLeft - step);
                break;
            case 'ArrowRight':
                newLeft = Math.min(760, frogLeft + step);
                break;
            case 'ArrowUp':
                newTop = Math.max(0, frogTop - step);
                break;
            case 'ArrowDown':
                newTop = Math.min(560, frogTop + step);
                break;
            case 'p':
            case 'P':
                this.togglePause();
                return;
        }

        if (newLeft !== frogLeft || newTop !== frogTop) {
            this.isMoving = true;
            this.frog.style.left = `${newLeft}px`;
            this.frog.style.top = `${newTop}px`;
            this.lastMoveTime = currentTime;
            setTimeout(() => {
                this.isMoving = false;
            }, this.moveDelay);
        }
    }

    createVehicle() {
        const availableLanes = this.laneOccupancy.map((occupied, index) => ({ occupied, index }))
            .filter(lane => !lane.occupied)
            .map(lane => lane.index);

        if (availableLanes.length === 0) return;

        const canSpawn = this.vehicles.every(vehicle => {
            const vehicleLeft = parseFloat(vehicle.element.style.left);
            const minDistance = this.isAdjacentLane(vehicle.lane, availableLanes) 
                ? this.minDistanceBetweenVehicles * 0.3
                : this.minDistanceBetweenVehicles;
            return vehicleLeft > minDistance;
        });

        if (!canSpawn) return;
        
        const laneIndex = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        const vehicleType = this.vehicleTypes[Math.floor(Math.random() * this.vehicleTypes.length)];
        
        const vehicle = document.createElement('div');
        vehicle.className = `vehicle ${vehicleType.size}`;
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${vehicleType.svgId}`);
        svg.appendChild(use);
        
        vehicle.appendChild(svg);
        
        const top = (laneIndex + 1) * 80;
        vehicle.style.top = `${top}px`;
        vehicle.style.left = '-100px';
        
        document.querySelector('.game-board').appendChild(vehicle);
        
        const vehicleSpeed = this.baseVehicleSpeed * this.currentSpeedMultiplier * vehicleType.speed;
        
        this.vehicles.push({
            element: vehicle,
            lane: laneIndex,
            speed: vehicleSpeed,
            type: vehicleType.name
        });
        
        this.laneOccupancy[laneIndex] = true;
    }

    isAdjacentLane(lane1, availableLanes) {
        return availableLanes.some(lane2 => Math.abs(lane1 - lane2) === 1);
    }

    removeAllVehicles() {
        this.vehicles.forEach(vehicle => vehicle.element.remove());
        this.vehicles = [];
    }

    gameLoop(currentTime = 0) {
        if (!this.isGameRunning || this.isPaused) return;

        const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        if (!this.isGameRunning || this.isPaused) return;
        
        this.updateVehicles(deltaTime);
        this.checkCollisions();
        this.checkWinCondition();
        this.spawnVehicles();
    }

    updateVehicles(deltaTime) {
        this.vehicles.forEach((vehicle, index) => {
            const currentLeft = parseFloat(vehicle.element.style.left);
            const newLeft = currentLeft + (vehicle.speed * deltaTime * 60);
            vehicle.element.style.left = `${newLeft}px`;

            if (newLeft > 800) {
                vehicle.element.remove();
                this.vehicles.splice(index, 1);
                this.laneOccupancy[vehicle.lane] = false;
                
                // Intentar crear un nuevo vehículo inmediatamente cuando uno sale
                this.createVehicle();
            }
        });
    }

    checkCollisions() {
        const frogRect = this.frog.getBoundingClientRect();
        const gameBoardRect = document.querySelector('.game-board').getBoundingClientRect();
        
        // Ajustar las coordenadas relativas al tablero de juego
        const frogX = frogRect.left - gameBoardRect.left;
        const frogY = frogRect.top - gameBoardRect.top;
        
        // Crear un rectángulo de colisión más pequeño para la rana
        const frogCollisionRect = {
            left: frogX + 5, // Margen interno
            right: frogX + frogRect.width - 5,
            top: frogY + 5,
            bottom: frogY + frogRect.height - 5
        };
        
        this.vehicles.forEach(vehicle => {
            const vehicleRect = vehicle.element.getBoundingClientRect();
            const vehicleX = vehicleRect.left - gameBoardRect.left;
            const vehicleY = vehicleRect.top - gameBoardRect.top;
            
            // Crear un rectángulo de colisión más grande para los vehículos
            const vehicleCollisionRect = {
                left: vehicleX - 5, // Margen externo
                right: vehicleX + vehicleRect.width + 5,
                top: vehicleY - 5,
                bottom: vehicleY + vehicleRect.height + 5
            };
            
            if (this.isColliding(frogCollisionRect, vehicleCollisionRect)) {
                this.handleCollision();
            }
        });
    }

    isColliding(rect1, rect2) {
        // Aumentar el margen de tolerancia para colisiones más precisas
        const tolerance = 10; // Aumentado de 5 a 10
        
        // Añadir un margen adicional para la altura
        const heightTolerance = 15; // Tolerancia especial para la altura
        
        return !(
            rect1.right - tolerance < rect2.left + tolerance || 
            rect1.left + tolerance > rect2.right - tolerance || 
            rect1.bottom - heightTolerance < rect2.top + heightTolerance || 
            rect1.top + heightTolerance > rect2.bottom - heightTolerance
        );
    }

    handleCollision() {
        this.lives--;
        this.updateLives();
        
        // Feedback visual de colisión
        this.frog.classList.add('hit');
        setTimeout(() => {
            this.frog.classList.remove('hit');
        }, 500);
        
        if (this.lives <= 0) {
            this.endGame();
        } else {
            this.resetFrogPosition();
        }
    }

    checkWinCondition() {
        const frogTop = parseInt(this.frog.style.top);
        
        if (frogTop <= 40) {
            this.score++;
            this.updateScore();
            
            // Feedback visual de punto ganado
            this.frog.classList.add('success');
            setTimeout(() => {
                this.frog.classList.remove('success');
            }, 500);
            
            // Aumentar la velocidad base de los vehículos de manera más gradual
            this.baseVehicleSpeed += 0.05;
            
            // Reducir el intervalo entre vehículos de manera más gradual
            this.vehicleSpawnInterval = Math.max(
                this.minSpawnInterval,
                this.vehicleSpawnInterval - 5 // Reducido de 8 a 5
            );
            
            // Actualizar el multiplicador global de velocidad con límite
            this.currentSpeedMultiplier = Math.min(
                this.maxSpeedMultiplier,
                1 + (this.score * 0.02)
            );
            
            // Actualizar la velocidad de todos los vehículos existentes
            this.vehicles.forEach(vehicle => {
                const vehicleType = this.vehicleTypes.find(type => type.name === vehicle.type);
                if (vehicleType) {
                    vehicle.speed = this.baseVehicleSpeed * this.currentSpeedMultiplier * vehicleType.speed;
                }
            });
            
            // Actualizar el indicador de velocidad
            document.getElementById('speed').textContent = this.currentSpeedMultiplier.toFixed(1) + 'x';
            
            this.resetFrogPosition();
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    updateLives() {
        document.getElementById('lives').textContent = this.lives;
    }

    endGame(isWin = false) {
        this.isGameRunning = false;
        this.isPaused = false;
        this.stopGameLoop();
        
        document.getElementById('final-score').textContent = this.score;
        document.querySelector('.game-over').classList.remove('hidden');
        
        if (isWin) {
            document.querySelector('.game-over h2').textContent = '¡Felicidades! Has ganado';
        }
    }

    spawnVehicles() {
        const currentTime = Date.now();
        if (currentTime - this.lastVehicleTime >= this.vehicleSpawnInterval) {
            // Intentar crear vehículos en carriles vacíos
            const emptyLanes = this.laneOccupancy.filter(occupied => !occupied).length;
            if (emptyLanes > 0) {
                // Intentar crear hasta 4 vehículos por intervalo
                for (let i = 0; i < 4 && emptyLanes > i; i++) {
                    this.createVehicle();
                }
            }
            this.lastVehicleTime = currentTime;
        }
    }

    createInitialVehicle() {
        const availableLanes = this.laneOccupancy.map((occupied, index) => ({ occupied, index }))
            .filter(lane => !lane.occupied)
            .map(lane => lane.index);

        if (availableLanes.length === 0) return;

        const laneIndex = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        const vehicleType = this.vehicleTypes[Math.floor(Math.random() * this.vehicleTypes.length)];
        
        const vehicle = document.createElement('div');
        vehicle.className = `vehicle ${vehicleType.size}`;
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${vehicleType.svgId}`);
        svg.appendChild(use);
        
        vehicle.appendChild(svg);
        
        const top = (laneIndex + 1) * 80;
        vehicle.style.top = `${top}px`;
        
        // Posición inicial aleatoria en la vía
        const randomPosition = Math.random() * 600; // Entre 0 y 600
        vehicle.style.left = `${randomPosition}px`;
        
        document.querySelector('.game-board').appendChild(vehicle);
        
        const vehicleSpeed = this.baseVehicleSpeed * this.currentSpeedMultiplier * vehicleType.speed;
        
        this.vehicles.push({
            element: vehicle,
            lane: laneIndex,
            speed: vehicleSpeed,
            type: vehicleType.name
        });
        
        this.laneOccupancy[laneIndex] = true;
    }
}

// Iniciar el juego cuando se carga la página
window.addEventListener('load', () => {
    new JumperFrog();
}); 