class Game {
    constructor() {
        // Elementos do DOM
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.startButton = document.getElementById('start-game');
        
        // Estado do jogo
        this.score = 0;
        this.timeLeft = 60;
        this.gameInterval = null;
        this.isGameRunning = false;
        this.playerPosition = { x: 40, y: 40 };
        this.playerDirection = 'right';
        this.packages = [];
        this.deliveryPoints = [];
        this.obstacles = [];
        
        // Configurações
        this.playerSpeed = 3;
        this.gridSize = 40;
        this.maxPackages = 5;
        
        // Cache de elementos
        this.roadElements = [];
        this.buildingElements = [];
        
        // Controles
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        
        // Inicializar eventos
        this.init();
        
        // Criar o circuito
        this.createCircuit();
        
        // Criar o jogador
        this.player = document.createElement('div');
        this.player.id = 'player';
        this.gameBoard.appendChild(this.player);
        
        // Posicionar o jogador e criar elementos visuais
        this.playerPosition = { x: 3 * this.gridSize, y: 3 * this.gridSize };
        this.player.style.left = `${this.playerPosition.x}px`;
        this.player.style.top = `${this.playerPosition.y}px`;
        this.createVehicleElements();
        this.rotatePlayer();
    }
    
    init() {
        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    startGame() {
        if (this.isGameRunning) return;
        
        console.log("Iniciando o jogo...");
        this.resetGame();
        
        // Verificar se o player foi criado corretamente
        if (!this.player || !this.player.parentNode) {
            console.error("Player não foi criado corretamente!");
            // Criar o player novamente se necessário
            this.player = document.createElement('div');
            this.player.id = 'player';
            this.gameBoard.appendChild(this.player);
            
            // Recriar os elementos visuais
            this.createVehicleElements();
            
            // Posicionar o player
            this.player.style.left = `${this.playerPosition.x}px`;
            this.player.style.top = `${this.playerPosition.y}px`;
            this.rotatePlayer();
        }
        
        // Certificar que o player está visível
        this.player.classList.remove('hidden');
        console.log("Player visível:", this.player);
        
        this.isGameRunning = true;
        this.startButton.disabled = true;
        
        // Iniciar o bucle del juego
        this.gameInterval = setInterval(() => {
            this.gameLoop();
        }, 1000 / 60);
        
        // Iniciar el contador de tiempo
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
        
        // Iniciar generador de paquetes periódicos
        this.packageInterval = setInterval(() => {
            this.tryAddPackage();
        }, 5000); // Intentar añadir un nuevo paquete cada 5 segundos
        
        // Generar más paquetes para recolectar (3 iniciales)
        for (let i = 0; i < 3; i++) {
            this.createPackage();
        }
        
        // Generar puntos de entrega y obstáculos
        this.createDeliveryPoint();
        this.createObstacle();
        
        console.log("Jogo iniciado com sucesso!");
    }
    
    resetGame() {
        console.log("Resetando o jogo...");
        this.score = 0;
        this.timeLeft = 60;
        this.packages = [];
        this.deliveryPoints = [];
        this.obstacles = [];
        
        // Limpar os caches
        this.roadElements = [];
        this.buildingElements = [];
        
        // Limpar o tabuleiro
        this.gameBoard.innerHTML = '';
        
        // Recriar o circuito
        this.createCircuit();
        
        // Encontrar uma posição válida para a van (em uma interseção)
        const startX = 3 * this.gridSize;
        const startY = 3 * this.gridSize;
        
        this.playerPosition = { x: startX, y: startY };
        this.playerDirection = 'right';
        
        // Remover o jogador anterior, se existir
        if (this.player) {
            this.player.remove();
        }
        
        // Criar um novo elemento para o jogador
        this.player = document.createElement('div');
        this.player.id = 'player';
        
        // Definir posição inicial
        this.player.style.left = `${this.playerPosition.x}px`;
        this.player.style.top = `${this.playerPosition.y}px`;
        
        // Adicionar ao DOM antes de criar os elementos visuais
        this.gameBoard.appendChild(this.player);
        console.log("Player adicionado ao DOM:", this.player);
        
        // Criar os elementos visuais do veículo
        this.createVehicleElements();
        console.log("Elementos visuais criados");
        
        // Aplicar rotação inicial
        this.rotatePlayer();
        
        // Remover classes residuais
        this.player.classList.remove('moving', 'collision');
        
        this.updateScore();
        this.updateTime();
        
        console.log("Jogo resetado com sucesso!");
    }
    
    generateGameElements() {
        // Generar paquetes
        for (let i = 0; i < 5; i++) {
            this.createPackage();
        }
        
        // Generar puntos de entrega
        for (let i = 0; i < 3; i++) {
            this.createDeliveryPoint();
        }
        
        // Generar obstáculos
        for (let i = 0; i < 4; i++) {
            this.createObstacle();
        }
    }
    
    // Nuevos métodos para crear el mapa de la ciudad
    createCircuit() {
        // Limpar o tabuleiro primeiro
        this.gameBoard.innerHTML = '';
        
        const boardWidth = Math.floor(this.gameBoard.offsetWidth / this.gridSize);
        const boardHeight = Math.floor(this.gameBoard.offsetHeight / this.gridSize);
        
        // Limpar caches antes de criar novos elementos
        this.roadElements = [];
        this.buildingElements = [];
        
        // Criar ruas horizontais e verticais
        for (let j = 0; j < boardHeight; j += 3) {
            for (let i = 0; i < boardWidth; i++) {
                const road = this.createRoad('horizontal', i * this.gridSize, j * this.gridSize);
                this.roadElements.push({ 
                    element: road, 
                    x: i * this.gridSize, 
                    y: j * this.gridSize 
                });
            }
        }
        
        for (let i = 0; i < boardWidth; i += 3) {
            for (let j = 0; j < boardHeight; j++) {
                const road = this.createRoad('vertical', i * this.gridSize, j * this.gridSize);
                this.roadElements.push({ 
                    element: road, 
                    x: i * this.gridSize, 
                    y: j * this.gridSize 
                });
            }
        }
        
        // Criar interseções nos cruzamentos de ruas
        for (let i = 0; i < boardWidth; i += 3) {
            for (let j = 0; j < boardHeight; j += 3) {
                const intersection = this.createIntersection(i * this.gridSize, j * this.gridSize);
                this.roadElements.push({ 
                    element: intersection, 
                    x: i * this.gridSize, 
                    y: j * this.gridSize 
                });
            }
        }
        
        // Adicionar edifícios nos espaços não navegáveis
        this.createBuildings();
    }
    
    createRoad(type, x, y) {
        const road = document.createElement('div');
        road.className = `road road-${type}`;
        road.style.left = x + 'px';
        road.style.top = y + 'px';
        
        if (type === 'horizontal') {
            road.style.width = this.gridSize + 'px';
            
            // Añadir línea divisoria más sutil
            if (Math.random() > 0.3) { // Solo el 70% de las calles tendrán líneas divisorias
                const divider = document.createElement('div');
                divider.style.position = 'absolute';
                divider.style.top = '50%';
                divider.style.left = '10%';
                divider.style.width = '80%';
                divider.style.height = '1px';
                divider.style.backgroundColor = '#FFEB3B';
                divider.style.opacity = '0.4';
                divider.style.transform = 'translateY(-50%)';
                road.appendChild(divider);
            }
        } else {
            road.style.height = this.gridSize + 'px';
            
            // Añadir línea divisoria más sutil
            if (Math.random() > 0.3) { // Solo el 70% de las calles tendrán líneas divisorias
                const divider = document.createElement('div');
                divider.style.position = 'absolute';
                divider.style.left = '50%';
                divider.style.top = '10%';
                divider.style.height = '80%';
                divider.style.width = '1px';
                divider.style.backgroundColor = '#FFEB3B';
                divider.style.opacity = '0.4';
                divider.style.transform = 'translateX(-50%)';
                road.appendChild(divider);
            }
        }
        
        this.gameBoard.appendChild(road);
        
        // Adicionar ao cache de calles
        this.roadElements.push({
            element: road,
            x: x,
            y: y
        });
        
        return road;
    }
    
    createIntersection(x, y) {
        const intersection = document.createElement('div');
        intersection.className = 'intersection';
        intersection.style.left = x + 'px';
        intersection.style.top = y + 'px';
        this.gameBoard.appendChild(intersection);
        
        // Adicionar ao cache de calles
        this.roadElements.push({
            element: intersection,
            x: x,
            y: y
        });
        
        return intersection;
    }
    
    createBuildings() {
        const boardWidth = Math.floor(this.gameBoard.offsetWidth / this.gridSize);
        const boardHeight = Math.floor(this.gameBoard.offsetHeight / this.gridSize);
        
        // Criar edifícios em todos os espaços que não são ruas
        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardHeight; j++) {
                // Verificar se a posição não é uma rua ou interseção
                if ((i % 3 !== 0) && (j % 3 !== 0)) {
                    // Probabilidade de criar um edifício (90%)
                    if (Math.random() < 0.9) {
                        this.createBuilding(i * this.gridSize, j * this.gridSize);
                    } else if (Math.random() < 0.5) {
                        // Probabilidade de criar um ponto de referência (5%)
                        this.createLandmark(i * this.gridSize, j * this.gridSize);
                    }
                }
            }
        }
    }
    
    createLandmarks() {
        // Este método ya no es necesario, ya que estamos creando
        // los puntos de referencia en el método createBuildings
    }
    
    createBuilding(x, y) {
        const building = document.createElement('div');
        building.className = 'building';
        
        // Tamaño del edificio (ocupando un bloque de cuadrícula)
        building.style.width = this.gridSize + 'px';
        building.style.height = this.gridSize + 'px';
        building.style.left = x + 'px';
        building.style.top = y + 'px';
        
        // Colores variados para los edificios (tonos de gris y azul)
        const colorIndex = Math.floor(Math.random() * 3);
        const colors = ['#607D8B', '#455A64', '#37474F'];
        building.style.backgroundColor = colors[colorIndex];
        
        // Altura variable para dar una sensación 3D más realista
        const heightFactor = 0.7 + Math.random() * 0.7; // entre 0.7 y 1.4
        const zTranslation = Math.floor(Math.random() * 5) + 1; // entre 1 y 5
        
        // Agregar transformación 3D con perspectiva
        building.style.transform = `translateZ(${zTranslation}px) rotateX(10deg) scaleZ(${heightFactor})`;
        
        // Agregar textura de pisos al edificio
        const floorCount = Math.floor(Math.random() * 4) + 2; // entre 2 y 5 pisos
        const floorHeight = 100 / floorCount;
        
        for (let i = 0; i < floorCount; i++) {
            const floor = document.createElement('div');
            floor.style.position = 'absolute';
            floor.style.width = '100%';
            floor.style.height = `${floorHeight}%`;
            floor.style.top = `${i * floorHeight}%`;
            floor.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
            floor.style.backgroundColor = 'rgba(0,0,0,0.03)';
            building.appendChild(floor);
        }
        
        // Agregar ventanas
        const windowCount = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < windowCount; i++) {
            const windowElement = document.createElement('div');
            windowElement.className = 'building-window';
            
            // Alinear ventanas en una cuadrícula
            const row = Math.floor(i / 2);
            const col = i % 2;
            
            windowElement.style.width = '8px';
            windowElement.style.height = '8px';
            windowElement.style.backgroundColor = Math.random() > 0.3 ? '#FFEB3B' : '#263238';
            windowElement.style.position = 'absolute';
            windowElement.style.left = (5 + col * 17) + 'px';
            windowElement.style.top = (5 + row * 15) + 'px';
            
            // Efecto de profundidad para las ventanas
            const windowDepth = Math.random() * 2 + 1;
            windowElement.style.transform = `translateZ(${windowDepth}px)`;
            
            // Variar la luminosidad de las ventanas
            if (windowElement.style.backgroundColor === '#FFEB3B') {
                const opacity = (Math.random() * 0.5 + 0.5).toFixed(2); // entre 0.5 y 1.0
                windowElement.style.opacity = opacity;
            }
            
            // Añadir índice para escalonar las animaciones
            windowElement.style.setProperty('--window-index', i);
            
            building.appendChild(windowElement);
        }
        
        // Agregar detalles ocasionales
        if (Math.random() > 0.7) {
            const antenna = document.createElement('div');
            antenna.style.position = 'absolute';
            antenna.style.width = '2px';
            antenna.style.height = '10px';
            antenna.style.backgroundColor = '#212121';
            antenna.style.top = '-10px';
            antenna.style.left = '50%';
            antenna.style.transform = 'translateX(-50%)';
            building.appendChild(antenna);
        }
        
        this.gameBoard.appendChild(building);
        
        // Adicionar ao cache de edifícios
        this.buildingElements.push({
            element: building,
            x: x,
            y: y,
            width: this.gridSize,
            height: this.gridSize
        });
        
        return building;
    }
    
    createLandmark(x, y) {
        const landmark = document.createElement('div');
        
        // Elegir entre plaza o parque
        const isPark = Math.random() > 0.5;
        landmark.className = isPark ? 'park' : 'plaza';
        
        // Tamaño (ocupando un bloque de cuadrícula)
        landmark.style.width = this.gridSize + 'px';
        landmark.style.height = this.gridSize + 'px';
        landmark.style.left = x + 'px';
        landmark.style.top = y + 'px';
        
        // Efecto 3D para landmarks
        landmark.style.transformStyle = 'preserve-3d';
        landmark.style.transform = 'rotateX(10deg) translateZ(2px)';
        
        if (isPark) {
            // Parque: verde con árboles
            landmark.style.backgroundColor = '#4CAF50';
            
            // Agregar textura de césped
            landmark.style.backgroundImage = 'linear-gradient(90deg, rgba(46,125,50,0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(46,125,50,0.2) 1px, transparent 1px)';
            landmark.style.backgroundSize = '5px 5px';
            
            // Agregar algunos árboles con apariencia 3D
            const treeCount = Math.floor(Math.random() * 4) + 2;
            
            // Crear un patrón irregular para los árboles
            const treePositions = [];
            for (let i = 0; i < treeCount; i++) {
                let posX, posY, valid;
                
                // Asegurar que los árboles no se superpongan
                do {
                    valid = true;
                    posX = 5 + Math.random() * 25;
                    posY = 5 + Math.random() * 25;
                    
                    for (let j = 0; j < treePositions.length; j++) {
                        const dist = Math.sqrt(
                            Math.pow(posX - treePositions[j].x, 2) + 
                            Math.pow(posY - treePositions[j].y, 2)
                        );
                        if (dist < 10) {
                            valid = false;
                            break;
                        }
                    }
                } while (!valid);
                
                treePositions.push({ x: posX, y: posY });
                
                // Crear tronco del árbol
                const trunk = document.createElement('div');
                trunk.style.position = 'absolute';
                trunk.style.width = '2px';
                trunk.style.height = '6px';
                trunk.style.backgroundColor = '#795548';
                trunk.style.left = posX + 'px';
                trunk.style.bottom = (this.gridSize - posY) + 'px';
                trunk.style.transform = 'translateZ(2px)';
                trunk.style.zIndex = '1';
                landmark.appendChild(trunk);
                
                // Crear copa del árbol
                const tree = document.createElement('div');
                tree.className = 'tree';
                tree.style.width = '8px';
                tree.style.height = '8px';
                tree.style.position = 'absolute';
                tree.style.left = (posX - 3) + 'px';
                tree.style.top = (posY - 6) + 'px';
                tree.style.backgroundColor = '#2E7D32';
                tree.style.borderRadius = '50%';
                tree.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                tree.style.transform = 'translateZ(3px)';
                tree.style.zIndex = '2';
                landmark.appendChild(tree);
            }
            
            // Agregar un camino ocasionalmente
            if (Math.random() > 0.5) {
                const path = document.createElement('div');
                path.style.position = 'absolute';
                path.style.width = '6px';
                path.style.height = '100%';
                path.style.left = '45%';
                path.style.backgroundColor = '#D7CCC8';
                path.style.opacity = '0.6';
                path.style.transform = 'translateZ(0.5px)';
                path.style.zIndex = '0';
                landmark.appendChild(path);
            }
            
        } else {
            // Plaza: color más claro con banco y decoraciones
            landmark.style.backgroundColor = '#8D6E63';
            
            // Agregar textura de pavimento
            landmark.style.backgroundImage = 'linear-gradient(45deg, #7D6E63 25%, transparent 25%, transparent 75%, #7D6E63 75%, #7D6E63), linear-gradient(45deg, #7D6E63 25%, transparent 25%, transparent 75%, #7D6E63 75%, #7D6E63)';
            landmark.style.backgroundSize = '10px 10px';
            landmark.style.backgroundPosition = '0 0, 5px 5px';
            
            // Agregar bancos
            const benchCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < benchCount; i++) {
                const bench = document.createElement('div');
                bench.className = 'bench';
                
                // Posición del banco en la plaza
                const benchX = i === 0 ? 10 : 25;
                const benchY = i === 0 ? 15 : 25;
                
                bench.style.width = '12px';
                bench.style.height = '4px';
                bench.style.position = 'absolute';
                bench.style.left = benchX + 'px';
                bench.style.top = benchY + 'px';
                bench.style.backgroundColor = '#5D4037';
                bench.style.boxShadow = '0 1px 2px rgba(0,0,0,0.5)';
                bench.style.transform = 'translateZ(2.5px)';
                bench.style.borderRadius = '1px';
                
                // Agregar patas al banco
                const legLeft = document.createElement('div');
                legLeft.style.position = 'absolute';
                legLeft.style.width = '2px';
                legLeft.style.height = '2px';
                legLeft.style.bottom = '-2px';
                legLeft.style.left = '1px';
                legLeft.style.backgroundColor = '#4E342E';
                bench.appendChild(legLeft);
                
                const legRight = document.createElement('div');
                legRight.style.position = 'absolute';
                legRight.style.width = '2px';
                legRight.style.height = '2px';
                legRight.style.bottom = '-2px';
                legRight.style.right = '1px';
                legRight.style.backgroundColor = '#4E342E';
                bench.appendChild(legRight);
                
                landmark.appendChild(bench);
            }
            
            // Agregar una fuente central ocasionalmente
            if (Math.random() > 0.5) {
                const fountain = document.createElement('div');
                fountain.style.position = 'absolute';
                fountain.style.width = '12px';
                fountain.style.height = '12px';
                fountain.style.borderRadius = '50%';
                fountain.style.left = '14px';
                fountain.style.top = '14px';
                fountain.style.backgroundColor = '#B0BEC5';
                fountain.style.boxShadow = 'inset 0 0 5px rgba(0,0,0,0.3)';
                fountain.style.transform = 'translateZ(1px)';
                
                const water = document.createElement('div');
                water.style.position = 'absolute';
                water.style.width = '8px';
                water.style.height = '8px';
                water.style.borderRadius = '50%';
                water.style.left = '2px';
                water.style.top = '2px';
                water.style.backgroundColor = '#4FC3F7';
                water.style.boxShadow = '0 0 5px rgba(79,195,247,0.5)';
                water.style.transform = 'translateZ(1.5px)';
                fountain.appendChild(water);
                
                landmark.appendChild(fountain);
            }
        }
        
        this.gameBoard.appendChild(landmark);
        
        // Adicionar ao cache de edifícios (landmarks também são não-navegáveis)
        this.buildingElements.push({
            element: landmark,
            x: x,
            y: y,
            width: this.gridSize,
            height: this.gridSize
        });
        
        return landmark;
    }
    
    getRandomRoadPosition() {
        // Usar o cache de ruas ao invés de consultar o DOM
        if (this.roadElements.length === 0) return null;
        
        // Filtrar las posiciones ya ocupadas
        const occupiedPositions = [];
        
        // Añadir posiciones de paquetes
        this.packages.forEach(pkg => {
            const x = parseInt(pkg.style.left);
            const y = parseInt(pkg.style.top);
            occupiedPositions.push({ x, y });
        });
        
        // Añadir posiciones de puntos de entrega
        this.deliveryPoints.forEach(point => {
            const x = parseInt(point.style.left);
            const y = parseInt(point.style.top);
            occupiedPositions.push({ x, y });
        });
        
        // Añadir posiciones de obstáculos
        this.obstacles.forEach(obstacle => {
            const x = parseInt(obstacle.style.left);
            const y = parseInt(obstacle.style.top);
            occupiedPositions.push({ x, y });
        });
        
        // Añadir posición del jugador
        occupiedPositions.push(this.playerPosition);
        
        // Filtrar las calles disponibles (no ocupadas)
        const availableRoads = this.roadElements.filter(road => {
            const roadX = road.x;
            const roadY = road.y;
            
            return !occupiedPositions.some(pos => 
                Math.abs(pos.x - roadX) < 30 && Math.abs(pos.y - roadY) < 30
            );
        });
        
        if (availableRoads.length === 0) return null;
        
        // Elegir una calle aleatoria
        const randomRoad = availableRoads[Math.floor(Math.random() * availableRoads.length)];
        const x = randomRoad.x + 5;
        const y = randomRoad.y + 5;
        
        return { x, y };
    }
    
    createPackage() {
        // Verificar si ya hay demasiados paquetes en el mapa
        if (this.packages.length >= this.maxPackages) {
            return;
        }
        
        const position = this.getRandomRoadPosition();
        if (!position) return;
        
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        
        // Añadir una etiqueta a la caja
        const label = document.createElement('div');
        label.className = 'package-label';
        label.textContent = 'VMR';
        label.style.position = 'absolute';
        label.style.top = '50%';
        label.style.left = '50%';
        label.style.transform = 'translate(-50%, -50%)';
        label.style.fontSize = '8px';
        label.style.fontWeight = 'bold';
        label.style.color = '#8B4513';
        packageElement.appendChild(label);
        
        packageElement.style.left = position.x + 'px';
        packageElement.style.top = position.y + 'px';
        
        // Rotar aleatoriamente la caja para variedad visual
        const rotation = Math.floor(Math.random() * 4) * 90;
        packageElement.style.transform = `rotate(${rotation}deg)`;
        
        this.gameBoard.appendChild(packageElement);
        this.packages.push(packageElement);
    }
    
    createDeliveryPoint() {
        const position = this.getRandomRoadPosition();
        if (!position) return;
        
        const point = document.createElement('div');
        point.className = 'delivery-point';
        point.style.left = position.x + 'px';
        point.style.top = position.y + 'px';
        this.gameBoard.appendChild(point);
        this.deliveryPoints.push(point);
    }
    
    createObstacle() {
        const position = this.getRandomRoadPosition();
        if (!position) return;
        
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        
        // Añadir un icono de advertencia
        const warning = document.createElement('div');
        warning.textContent = '!';
        warning.style.position = 'absolute';
        warning.style.top = '50%';
        warning.style.left = '50%';
        warning.style.transform = 'translate(-50%, -50%)';
        warning.style.fontSize = '16px';
        warning.style.fontWeight = 'bold';
        warning.style.color = 'white';
        obstacle.appendChild(warning);
        
        obstacle.style.left = position.x + 'px';
        obstacle.style.top = position.y + 'px';
        this.gameBoard.appendChild(obstacle);
        this.obstacles.push(obstacle);
    }
    
    handleKeyDown(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = true;
        }
    }
    
    handleKeyUp(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = false;
        }
    }
    
    movePlayer() {
        if (!this.isGameRunning) return;

        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;
        let moved = false;

        // Calcular nova posição baseada nas teclas pressionadas
        if (this.keys.ArrowUp) {
            newY -= this.playerSpeed;
            this.playerDirection = 'up';
            moved = true;
        } else if (this.keys.ArrowDown) {
            newY += this.playerSpeed;
            this.playerDirection = 'down';
            moved = true;
        }
        
        if (this.keys.ArrowLeft) {
            newX -= this.playerSpeed;
            this.playerDirection = 'left';
            moved = true;
        } else if (this.keys.ArrowRight) {
            newX += this.playerSpeed;
            this.playerDirection = 'right';
            moved = true;
        }

        if (!moved) {
            return;
        }

        // Verificar se a nova posição é válida
        if (this.isValidPosition(newX, newY)) {
            // Atualizar a posição
            this.playerPosition.x = newX;
            this.playerPosition.y = newY;

            // Atualizar a posição visual da van
            this.player.style.left = `${this.playerPosition.x}px`;
            this.player.style.top = `${this.playerPosition.y}px`;
            
            // Adicionar classe de movimento
            this.player.classList.add('moving');
            
            // Rotacionar a van
            this.rotatePlayer();
        }
    }
    
    isValidPosition(x, y) {
        // Verificar limites do tabuleiro
        if (x < 0 || x > this.gameBoard.offsetWidth - 40 || 
            y < 0 || y > this.gameBoard.offsetHeight - 40) {
            return false;
        }
        
        // Calcular a posição na grade
        const gridX = Math.floor((x + 20) / this.gridSize); // +20 para considerar o centro da van
        const gridY = Math.floor((y + 20) / this.gridSize);
        
        // Verificar se está em uma rua horizontal ou vertical
        const isOnHorizontalRoad = gridY % 3 === 0;
        const isOnVerticalRoad = gridX % 3 === 0;
        
        // Se estiver em uma interseção ou em uma rua, a posição é válida
        return isOnHorizontalRoad || isOnVerticalRoad;
    }
    
    rotatePlayer() {
        if (!this.player) return;
        
        const rotation = {
            'up': -90,
            'down': 90,
            'left': 180,
            'right': 0
        };
        const rotationDegrees = rotation[this.playerDirection];
        
        // Definir transformação com rotação e preserve-3d
        this.player.style.transform = `rotateZ(${rotationDegrees}deg) translateZ(0)`;
        
        // Salvar o valor de rotação para uso em outras funções
        this.player.style.setProperty('--rotation', `${rotationDegrees}deg`);
    }
    
    checkCollisions() {
        // Verificar colisões com pacotes
        this.packages.forEach((pkg, index) => {
            if (this.isColliding(this.player, pkg)) {
                this.collectPackage(index);
            }
        });
        
        // Verificar colisões com pontos de entrega
        this.deliveryPoints.forEach((point, index) => {
            if (this.isColliding(this.player, point)) {
                this.deliverPackage(index);
            }
        });
        
        // Verificar colisões com obstáculos
        this.obstacles.forEach((obstacle, index) => {
            if (this.isColliding(this.player, obstacle)) {
                this.hitObstacle(index);
            }
        });
    }
    
    isColliding(element1, element2) {
        // Usar valores diretos em vez de getBoundingClientRect para melhor performance
        // Isso evita reflow no navegador
        const rect1 = {
            left: parseInt(element1.style.left || 0),
            top: parseInt(element1.style.top || 0),
            right: parseInt(element1.style.left || 0) + element1.offsetWidth,
            bottom: parseInt(element1.style.top || 0) + element1.offsetHeight
        };
        
        const rect2 = {
            left: parseInt(element2.style.left || 0),
            top: parseInt(element2.style.top || 0),
            right: parseInt(element2.style.left || 0) + element2.offsetWidth,
            bottom: parseInt(element2.style.top || 0) + element2.offsetHeight
        };
        
        // Tornar a detecção de colisão mais precisa reduzindo um pouco a área de colisão
        const margin = 10;
        
        return !(rect1.right - margin < rect2.left + margin || 
                rect1.left + margin > rect2.right - margin || 
                rect1.bottom - margin < rect2.top + margin || 
                rect1.top + margin > rect2.bottom - margin);
    }
    
    collectPackage(index) {
        this.packages[index].remove();
        this.packages.splice(index, 1);
        this.score += 10;
        this.updateScore();
        
        // Crear un nuevo paquete para mantener el juego desafiante
        this.createPackage();
        
        // Probabilidad de generar paquete adicional (25% de chance)
        if (Math.random() < 0.25) {
            this.createPackage();
        }
    }
    
    deliverPackage(index) {
        this.deliveryPoints[index].remove();
        this.deliveryPoints.splice(index, 1);
        this.score += 20;
        this.updateScore();
        
        // Crear nuevo punto de entrega
        this.createDeliveryPoint();
    }
    
    hitObstacle(index) {
        // Eliminar el obstáculo
        this.obstacles[index].remove();
        this.obstacles.splice(index, 1);
        
        // Penalizar al jugador (reducir puntos)
        this.score = Math.max(0, this.score - 5);
        this.updateScore();
        
        // Remover estado de movimiento
        this.player.classList.remove('moving');
        
        // Retroceder la furgoneta ligeramente en dirección opuesta a la colisión
        if (this.playerDirection === 'up') {
            this.playerPosition.y += 40;
        } else if (this.playerDirection === 'down') {
            this.playerPosition.y -= 40;
        } else if (this.playerDirection === 'left') {
            this.playerPosition.x += 40;
        } else if (this.playerDirection === 'right') {
            this.playerPosition.x -= 40;
        }
        
        // Asegurar que la furgoneta esté sobre una calle después del retroceso
        const gridX = Math.round(this.playerPosition.x / this.gridSize) * this.gridSize;
        const gridY = Math.round(this.playerPosition.y / this.gridSize) * this.gridSize;
        this.playerPosition.x = gridX;
        this.playerPosition.y = gridY;
        
        // Verificar si la nueva posición es válida
        if (!this.isValidPosition(this.playerPosition.x, this.playerPosition.y)) {
            // Si no lo es, volver a la posición inicial
            this.playerPosition.x = 40;
            this.playerPosition.y = 40;
        }
        
        // Aplicar la nueva posición
        this.player.style.left = this.playerPosition.x + 'px';
        this.player.style.top = this.playerPosition.y + 'px';
        
        // Añadir efecto visual de colisión
        this.player.classList.add('collision');
        
        // Limpiar todas las teclas presionadas
        this.keys.ArrowUp = false;
        this.keys.ArrowDown = false;
        this.keys.ArrowLeft = false;
        this.keys.ArrowRight = false;
        
        setTimeout(() => {
            this.player.classList.remove('collision');
        }, 500);
        
        // Crear nuevo obstáculo
        this.createObstacle();
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateTime() {
        this.timeLeft--;
        this.timeElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 0) {
            this.gameOver();
        }
    }
    
    gameOver() {
        clearInterval(this.gameInterval);
        clearInterval(this.timeInterval);
        clearInterval(this.packageInterval);
        this.isGameRunning = false;
        this.startButton.disabled = false;
        alert(`Fin del juego! Puntuación: ${this.score}`);
    }
    
    gameLoop() {
        if (!this.isGameRunning) return;
        
        // Process movement if any direction key is pressed
        if (this.keys.ArrowUp || this.keys.ArrowDown || this.keys.ArrowLeft || this.keys.ArrowRight) {
            this.movePlayer();
        } else {
            // No keys pressed, remove moving class
            this.player.classList.remove('moving');
        }
        
        // Check collisions after movement
        this.checkCollisions();
    }

    createVehicleElements() {
        // Limpiar elementos existentes
        this.player.innerHTML = '';
        
        // Adicionar HTML diretamente para evitar problemas
        this.player.innerHTML = `
            <div class="wheel wheel-front"></div>
            <div class="wheel wheel-back"></div>
            <div class="window window-front"></div>
            <div class="window window-back"></div>
            <div class="window-rear"></div>
            <div class="headlight headlight-left"></div>
            <div class="headlight headlight-right"></div>
            <div class="grille"></div>
            <div class="rear-door"></div>
            <div class="company-logo">VMR</div>
            <div class="taillight taillight-left"></div>
            <div class="taillight taillight-right"></div>
        `;
    }

    tryAddPackage() {
        // Solo añadir nuevo paquete si hay menos del máximo
        if (this.packages.length < this.maxPackages) {
            // Probabilidad del 70% de añadir un nuevo paquete
            if (Math.random() < 0.7) {
                this.createPackage();
            }
        }
    }
}

// Iniciar el juego cuando la página cargue
window.addEventListener('load', () => {
    new Game();
}); 