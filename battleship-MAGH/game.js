/**
 * Battleship 3D - Lógica del juego
 * 
 * Este archivo contiene la lógica principal del juego de Battleship:
 * - Inicialización del juego
 * - Gestión de turnos
 * - Lógica de ataques
 * - IA del oponente
 * - Verificación de victoria/derrota
 */

// Configuración del juego
const GRID_SIZE = 10;
const SHIPS = [
  { type: 'carrier', size: 5, name: 'Portaviones' },
  { type: 'battleship', size: 4, name: 'Acorazado' },
  { type: 'cruiser', size: 3, name: 'Crucero' },
  { type: 'submarine', size: 3, name: 'Submarino' },
  { type: 'destroyer', size: 2, name: 'Destructor' }
];

// Clase principal del juego
class BattleshipGame {
  constructor() {
    // Estado del juego
    this.gameStarted = false;
    this.gameOver = false;
    this.currentTurn = 'player'; // 'player' o 'ai'
    
    // Tableros de juego (grids)
    this.playerBoard = this.createEmptyBoard();
    this.enemyBoard = this.createEmptyBoard();
    
    // Barcos
    this.playerShips = [];
    this.enemyShips = [];
    
    // Estado actual de colocación
    this.placementPhase = true;
    this.selectedShipType = null;
    this.selectedShipSize = 0;
    this.shipOrientation = 'horizontal'; // 'horizontal' o 'vertical'
    
    // Estado de la IA
    this.aiHits = []; // Guarda los hits para que la IA pueda "perseguir" barcos
    this.aiLastHit = null;
    this.aiTargetMode = false;
    this.aiTargetQueue = [];
    
    // Audio
    this.audioContext = null;
    this.sounds = {};
    
    // OBJ Loader
    this.objLoader = new OBJLoader();
    
    // Inicializamos el juego
    this.initGame();
  }
  
  // Inicialización del juego
  initGame() {
    // Inicializamos la UI y los tableros
    this.initBoards();
    this.initUI();
    this.initAudio();
    
    // Mostramos el modal de bienvenida
    this.showModal('¡Bienvenido a Battleship 3D!', 'Coloca tus barcos en el tablero para comenzar. Puedes hacerlo manualmente o usar la colocación aleatoria.');
  }
  
  // Inicialización de los tableros visuales
  initBoards() {
    const playerBoardElement = document.getElementById('player-board');
    const enemyBoardElement = document.getElementById('enemy-board');
    
    // Limpiamos los tableros
    playerBoardElement.innerHTML = '';
    enemyBoardElement.innerHTML = '';
    
    // Creamos celdas para ambos tableros
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // Celda para el tablero del jugador
        const playerCell = document.createElement('div');
        playerCell.className = 'cell';
        playerCell.dataset.x = x;
        playerCell.dataset.y = y;
        playerCell.addEventListener('click', () => this.handlePlayerCellClick(x, y));
        playerCell.addEventListener('mouseover', () => this.handlePlayerCellHover(x, y));
        playerCell.addEventListener('mouseout', () => this.handlePlayerCellOut(x, y));
        playerBoardElement.appendChild(playerCell);
        
        // Celda para el tablero enemigo
        const enemyCell = document.createElement('div');
        enemyCell.className = 'cell';
        enemyCell.dataset.x = x;
        enemyCell.dataset.y = y;
        enemyCell.addEventListener('click', () => this.handleEnemyCellClick(x, y));
        enemyBoardElement.appendChild(enemyCell);
      }
    }
  }
  
  // Inicialización de la interfaz de usuario
  initUI() {
    // Botones de control
    document.getElementById('start-game').addEventListener('click', () => this.startGame());
    document.getElementById('random-placement').addEventListener('click', () => this.randomPlacement());
    document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
    document.getElementById('toggle-orientation').addEventListener('click', () => this.toggleShipOrientation());
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    
    // Opciones de barcos
    const shipOptions = document.querySelectorAll('.ship-option');
    shipOptions.forEach(option => {
      option.addEventListener('click', () => {
        if (!option.classList.contains('placed')) {
          this.selectShip(option.dataset.ship, parseInt(option.dataset.size));
          
          // Remover selección de otros barcos
          shipOptions.forEach(opt => opt.classList.remove('selected'));
          
          // Seleccionar este barco
          option.classList.add('selected');
        }
      });
    });
  }
  
  // Inicializar sistema de audio
  initAudio() {
    try {
      // Crear contexto de audio
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Cargar sonidos
      this.loadSound('hit', 'assets/sounds/explosion.mp3');
      this.loadSound('miss', 'assets/sounds/splash.mp3');
      this.loadSound('place', 'assets/sounds/place.mp3');
      this.loadSound('win', 'assets/sounds/victory.mp3');
      this.loadSound('lose', 'assets/sounds/defeat.mp3');
    } catch (e) {
      console.error('Error al inicializar el sistema de audio:', e);
    }
  }
  
  // Cargar un archivo de sonido
  loadSound(name, url) {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => this.audioContext.decodeAudioData(buffer))
      .then(decodedData => {
        this.sounds[name] = decodedData;
      })
      .catch(err => console.error(`Error al cargar el sonido ${name}:`, err));
  }
  
  // Reproducir un sonido
  playSound(name) {
    if (!this.audioContext || !this.sounds[name]) return;
    
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name];
    source.connect(this.audioContext.destination);
    source.start(0);
  }
  
  // Crear tablero vacío
  createEmptyBoard() {
    const board = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      board[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        board[y][x] = {
          ship: null,   // Tipo de barco (null si no hay barco)
          hit: false,   // Si la celda ha sido golpeada
          shipIndex: -1 // Índice del barco en el array de barcos
        };
      }
    }
    return board;
  }
  
  // Seleccionar un barco para colocar
  selectShip(type, size) {
    this.selectedShipType = type;
    this.selectedShipSize = size;
  }
  
  // Cambiar la orientación del barco
  toggleShipOrientation() {
    this.shipOrientation = this.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    
    // Limpiar visualización previa si hay alguna
    const cells = document.querySelectorAll('#player-board .cell.preview');
    cells.forEach(cell => cell.classList.remove('preview'));
  }
  
  // Manejar hover sobre celda del jugador (para previsualizar colocación)
  handlePlayerCellHover(x, y) {
    if (!this.placementPhase || !this.selectedShipType) return;
    
    // Verificar si el barco cabe en esa posición
    const canPlace = this.canPlaceShip(x, y, this.selectedShipSize, this.shipOrientation === 'vertical', this.playerBoard);
    
    // Mostrar previsualización
    const cells = this.getShipCells(x, y, this.selectedShipSize, this.shipOrientation === 'vertical');
    cells.forEach(([cellX, cellY]) => {
      if (cellX >= 0 && cellX < GRID_SIZE && cellY >= 0 && cellY < GRID_SIZE) {
        const cellElement = document.querySelector(`#player-board .cell[data-x="${cellX}"][data-y="${cellY}"]`);
        cellElement.classList.add('preview');
        if (!canPlace) {
          cellElement.classList.add('invalid');
        }
      }
    });
  }
  
  // Manejar mouseout sobre celda del jugador (eliminar previsualización)
  handlePlayerCellOut(x, y) {
    const cells = document.querySelectorAll('#player-board .cell.preview');
    cells.forEach(cell => {
      cell.classList.remove('preview');
      cell.classList.remove('invalid');
    });
  }
  
  // Manejar click en celda del jugador (para colocar barcos)
  handlePlayerCellClick(x, y) {
    if (!this.placementPhase || !this.selectedShipType) return;
    
    // Intentar colocar el barco
    const placed = this.placeShip(x, y, this.selectedShipType, this.selectedShipSize, this.shipOrientation === 'vertical', this.playerBoard, this.playerShips);
    
    if (placed) {
      // Reproducir sonido
      this.playSound('place');
      
      // Marcar el barco como colocado en la UI
      const shipOption = document.querySelector(`.ship-option[data-ship="${this.selectedShipType}"]`);
      shipOption.classList.add('placed');
      shipOption.classList.remove('selected');
      
      // Actualizar la vista
      this.updateBoardView();
      
      // Resetear selección
      this.selectedShipType = null;
      this.selectedShipSize = 0;
      
      // Verificar si todos los barcos están colocados
      if (this.playerShips.length === SHIPS.length) {
        document.getElementById('start-game').disabled = false;
        this.showModal('¡Barcos colocados!', 'Todos los barcos han sido colocados. Presiona "Iniciar Juego" para comenzar la batalla.');
      }
    }
  }
  
  // Manejar click en celda enemiga (para atacar)
  handleEnemyCellClick(x, y) {
    if (this.placementPhase || this.gameOver || this.currentTurn !== 'player') return;
    
    // Verificar si la celda ya fue atacada
    if (this.enemyBoard[y][x].hit) return;
    
    // Realizar ataque
    const hit = this.attack(x, y, this.enemyBoard, this.enemyShips);
    
    // Reproducir sonido
    this.playSound(hit ? 'hit' : 'miss');
    
    // Actualizar la vista
    this.updateBoardView();
    
    // Verificar si el jugador ganó
    if (this.checkWin(this.enemyShips)) {
      this.gameOver = true;
      this.playSound('win');
      this.showModal('¡Victoria!', 'Has hundido todos los barcos enemigos. ¡Felicidades!');
      return;
    }
    
    // Cambiar turno
    this.currentTurn = 'ai';
    document.getElementById('turn-indicator').textContent = 'Turno del enemigo';
    
    // La IA atacará después de un breve retraso
    setTimeout(() => this.aiTurn(), 1000);
  }
  
  // Verificar si un barco puede ser colocado en una posición
  canPlaceShip(x, y, size, isVertical, board) {
    const cells = this.getShipCells(x, y, size, isVertical);
    
    for (const [cellX, cellY] of cells) {
      // Verificar que esté dentro del tablero
      if (cellX < 0 || cellX >= GRID_SIZE || cellY < 0 || cellY >= GRID_SIZE) {
        return false;
      }
      
      // Verificar que no haya otro barco en esa posición
      if (board[cellY][cellX].ship !== null) {
        return false;
      }
    }
    
    return true;
  }
  
  // Obtener las celdas que ocuparía un barco
  getShipCells(x, y, size, isVertical) {
    const cells = [];
    
    for (let i = 0; i < size; i++) {
      if (isVertical) {
        cells.push([x, y + i]);
      } else {
        cells.push([x + i, y]);
      }
    }
    
    return cells;
  }
  
  // Colocar un barco en el tablero
  placeShip(x, y, type, size, isVertical, board, ships) {
    if (!this.canPlaceShip(x, y, size, isVertical, board)) {
      return false;
    }
    
    // Crear el barco
    const ship = {
      type,
      size,
      hits: 0,
      positions: this.getShipCells(x, y, size, isVertical),
      isVertical
    };
    
    // Añadir el barco a la lista
    const shipIndex = ships.length;
    ships.push(ship);
    
    // Actualizar el tablero
    for (const [cellX, cellY] of ship.positions) {
      board[cellY][cellX].ship = type;
      board[cellY][cellX].shipIndex = shipIndex;
    }
    
    return true;
  }
  
  // Colocar barcos aleatoriamente
  randomPlacement() {
    if (!this.placementPhase) return;
    
    // Limpiar tablero y barcos actuales
    this.playerBoard = this.createEmptyBoard();
    this.playerShips = [];
    
    // Desmarcar todos los barcos en la UI
    const shipOptions = document.querySelectorAll('.ship-option');
    shipOptions.forEach(option => {
      option.classList.remove('placed');
      option.classList.remove('selected');
    });
    
    // Intentar colocar cada barco aleatoriamente
    for (const ship of SHIPS) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        const isVertical = Math.random() > 0.5;
        
        placed = this.placeShip(x, y, ship.type, ship.size, isVertical, this.playerBoard, this.playerShips);
        attempts++;
      }
      
      if (!placed) {
        console.error(`No se pudo colocar el ${ship.name}`);
      } else {
        // Marcar el barco como colocado en la UI
        const shipOption = document.querySelector(`.ship-option[data-ship="${ship.type}"]`);
        shipOption.classList.add('placed');
      }
    }
    
    // Actualizar vista
    this.updateBoardView();
    
    // Habilitar botón de inicio si todos los barcos fueron colocados
    if (this.playerShips.length === SHIPS.length) {
      document.getElementById('start-game').disabled = false;
      this.showModal('¡Barcos colocados!', 'Todos los barcos han sido colocados aleatoriamente. Presiona "Iniciar Juego" para comenzar la batalla.');
    }
  }
  
  // Iniciar el juego
  startGame() {
    if (this.playerShips.length !== SHIPS.length) {
      this.showModal('¡Faltan barcos!', 'Debes colocar todos los barcos antes de comenzar el juego.');
      return;
    }
    
    // Cambiar a fase de juego
    this.placementPhase = false;
    this.gameStarted = true;
    
    // Ocultar controles de colocación y mostrar botón de reset
    document.getElementById('placement-controls').style.display = 'none';
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('random-placement').style.display = 'none';
    document.getElementById('reset-game').style.display = 'block';
    
    // Colocar barcos de la IA aleatoriamente
    this.placeAIShips();
    
    // Mensaje de inicio
    this.showModal('¡Comienza la batalla!', 'Ataca el tablero enemigo haciendo clic en una casilla. Destruye todos sus barcos para ganar.');
    
    // Actualizar indicador de turno
    document.getElementById('turn-indicator').textContent = 'Tu turno';
  }
  
  // Colocar barcos de la IA aleatoriamente
  placeAIShips() {
    for (const ship of SHIPS) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        const isVertical = Math.random() > 0.5;
        
        placed = this.placeShip(x, y, ship.type, ship.size, isVertical, this.enemyBoard, this.enemyShips);
        attempts++;
      }
      
      if (!placed) {
        console.error(`No se pudo colocar el ${ship.name} enemigo`);
      }
    }
    
    // Actualizar vista pero sin mostrar los barcos enemigos
    this.updateBoardView(true);
  }
  
  // Actualizar la vista de los tableros
  updateBoardView(hideEnemyShips = false) {
    // Limpiar contenedores de barcos existentes
    const shipModels = document.querySelectorAll('.ship-model');
    shipModels.forEach(model => model.remove());

    // Actualizar tablero del jugador
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = this.playerBoard[y][x];
        const cellElement = document.querySelector(`#player-board .cell[data-x="${x}"][data-y="${y}"]`);
        
        // Resetear clases
        cellElement.className = 'cell';
        
        // Aplicar clases según el estado
        if (cell.ship) {
          cellElement.classList.add('ship');
        }
        
        if (cell.hit) {
          if (cell.ship) {
            cellElement.classList.add('hit');
          } else {
            cellElement.classList.add('miss');
          }
        }
      }
    }
    
    // Actualizar tablero enemigo
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = this.enemyBoard[y][x];
        const cellElement = document.querySelector(`#enemy-board .cell[data-x="${x}"][data-y="${y}"]`);
        
        // Resetear clases
        cellElement.className = 'cell';
        
        // Aplicar clases según el estado
        if (cell.ship && !hideEnemyShips) {
          cellElement.classList.add('enemy-ship');
        }
        
        if (cell.hit) {
          if (cell.ship) {
            cellElement.classList.add('hit');
          } else {
            cellElement.classList.add('miss');
          }
        }
      }
    }

    // Renderizar modelos 3D de barcos del jugador
    this.playerShips.forEach(ship => {
      const [startX, startY] = ship.positions[0];
      const firstCell = document.querySelector(`#player-board .cell[data-x="${startX}"][data-y="${startY}"]`);

      const shipContainer = document.createElement('div');
      shipContainer.className = 'ship-model';
      
      // Calcular dimensiones exactas para el barco
      const cellWidth = firstCell.offsetWidth;
      const cellHeight = firstCell.offsetHeight;
      
      if (ship.isVertical) {
        shipContainer.style.height = `${cellHeight * ship.size}px`;
        shipContainer.style.width = `${cellWidth}px`;
      } else {
        shipContainer.style.width = `${cellWidth * ship.size}px`;
        shipContainer.style.height = `${cellHeight}px`;
      }
      
      // Crear modelo 3D para el barco
      this.objLoader.createShipModel(ship.type, ship.size, shipContainer, ship.isVertical);
      
      firstCell.appendChild(shipContainer);
    });
    
    // Actualizar contadores de barcos
    document.getElementById('player-ships-count').textContent = this.countRemainingShips(this.playerShips);
    document.getElementById('enemy-ships-count').textContent = this.countRemainingShips(this.enemyShips);
  }
  
  // Contar barcos restantes (no hundidos)
  countRemainingShips(ships) {
    let count = 0;
    
    for (const ship of ships) {
      if (ship.hits < ship.size) {
        count++;
      }
    }
    
    return count;
  }
  
  // Realizar un ataque en una posición
  attack(x, y, board, ships) {
    // Marcar la celda como atacada
    board[y][x].hit = true;
    
    // Verificar si había un barco
    if (board[y][x].ship) {
      const shipIndex = board[y][x].shipIndex;
      const ship = ships[shipIndex];
      
      // Incrementar hits del barco
      ship.hits++;
      
      // Verificar si el barco fue hundido
      if (ship.hits === ship.size) {
        console.log(`¡Barco ${ship.type} hundido!`);
      }
      
      return true; // Hit
    }
    
    return false; // Miss
  }
  
  // Turno de la IA
  aiTurn() {
    if (this.gameOver) return;
    
    let targetX, targetY;
    
    if (this.aiTargetMode && this.aiTargetQueue.length > 0) {
      // Modo de objetivo: la IA persigue un barco ya golpeado
      [targetX, targetY] = this.aiTargetQueue.shift();
      
      // Verificar que la celda no haya sido atacada ya
      while (this.playerBoard[targetY][targetX].hit && this.aiTargetQueue.length > 0) {
        [targetX, targetY] = this.aiTargetQueue.shift();
      }
      
      // Si todas las celdas de la cola ya fueron atacadas, volver a modo aleatorio
      if (this.playerBoard[targetY][targetX].hit) {
        this.aiTargetMode = false;
        this.aiLastHit = null;
        this.aiTargetQueue = [];
        return this.aiTurn(); // Intentar de nuevo en modo aleatorio
      }
    } else {
      // Modo aleatorio: la IA elige una celda al azar
      do {
        targetX = Math.floor(Math.random() * GRID_SIZE);
        targetY = Math.floor(Math.random() * GRID_SIZE);
      } while (this.playerBoard[targetY][targetX].hit);
    }
    
    // Realizar ataque
    const hit = this.attack(targetX, targetY, this.playerBoard, this.playerShips);
    
    // Reproducir sonido
    this.playSound(hit ? 'hit' : 'miss');
    
    // Si es un hit, añadir celdas adyacentes a la cola para perseguir el barco
    if (hit) {
      this.aiTargetMode = true;
      this.aiLastHit = [targetX, targetY];
      
      // Añadir celdas adyacentes a la cola
      const directions = [
        [0, -1], // arriba
        [1, 0],  // derecha
        [0, 1],  // abajo
        [-1, 0]  // izquierda
      ];
      
      for (const [dx, dy] of directions) {
        const newX = targetX + dx;
        const newY = targetY + dy;
        
        // Verificar que esté dentro del tablero
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          // Verificar que no haya sido atacada
          if (!this.playerBoard[newY][newX].hit) {
            this.aiTargetQueue.push([newX, newY]);
          }
        }
      }
    }
    
    // Actualizar vista
    this.updateBoardView(true);
    
    // Verificar si la IA ganó
    if (this.checkWin(this.playerShips)) {
      this.gameOver = true;
      this.playSound('lose');
      this.showModal('Derrota', 'La IA ha hundido todos tus barcos. ¡Mejor suerte la próxima vez!');
      return;
    }
    
    // Volver al turno del jugador
    this.currentTurn = 'player';
    document.getElementById('turn-indicator').textContent = 'Tu turno';
  }
  
  // Verificar si hay un ganador
  checkWin(ships) {
    // Un jugador gana cuando todos los barcos del oponente están hundidos
    for (const ship of ships) {
      if (ship.hits < ship.size) {
        return false; // Aún hay barcos no hundidos
      }
    }
    
    return true; // Todos los barcos han sido hundidos
  }
  
  // Resetear el juego
  resetGame() {
    // Reiniciar variables
    this.gameStarted = false;
    this.gameOver = false;
    this.currentTurn = 'player';
    this.playerBoard = this.createEmptyBoard();
    this.enemyBoard = this.createEmptyBoard();
    this.playerShips = [];
    this.enemyShips = [];
    this.placementPhase = true;
    this.selectedShipType = null;
    this.selectedShipSize = 0;
    this.aiHits = [];
    this.aiLastHit = null;
    this.aiTargetMode = false;
    this.aiTargetQueue = [];
    
    // Reiniciar UI
    document.getElementById('placement-controls').style.display = 'block';
    document.getElementById('start-game').style.display = 'inline-block';
    document.getElementById('random-placement').style.display = 'inline-block';
    document.getElementById('reset-game').style.display = 'none';
    
    // Desmarcar todos los barcos en la UI
    const shipOptions = document.querySelectorAll('.ship-option');
    shipOptions.forEach(option => {
      option.classList.remove('placed');
      option.classList.remove('selected');
    });
    
    // Reiniciar tableros
    this.initBoards();
    
    // Mostrar mensaje
    this.showModal('¡Juego reiniciado!', 'Coloca tus barcos en el tablero para comenzar una nueva partida.');
  }
  
  // Mostrar modal
  showModal(title, message) {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.classList.add('active');
  }
  
  // Cerrar modal
  closeModal() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('active');
  }
}

// Iniciar el juego cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const game = new BattleshipGame();
  window.game = game; // Para depuración
}); 