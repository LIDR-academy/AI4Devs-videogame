// Configuración principal del juego
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000', // Fondo negro uniforme
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: false
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);

// Variables globales
let sounds = {};
let gridCells = [];
let currentSequence = [];
let playerSequence = [];
let isPlayingSequence = false;
let isPlayerTurn = false;
let currentLevel = 1;
let sequenceIndex = 0;

// Configuración del juego
const GAME_CONFIG = {
    initialSequenceLength: 1,
    delayBetweenSequenceSteps: 800,
    flashDuration: 500,
    maxLevel: 7
};

// Colores para los bloques
const COLORS = {
    GREEN: 0x39FF14, // Verde neón
    RED: 0xFF073A,   // Rojo neón
    BLUE: 0x00FFFF,  // Azul neón
    YELLOW: 0xFFFF00, // Amarillo neón
    HOVER_TINT: 0xDDDDDD,
    ACTIVE_TINT: 0xFFFFFF
};

// Frecuencias de notas musicales (en Hz)
const NOTES = {
    C4: 261.63,  // Do
    E4: 329.63,  // Mi
    G4: 392.00,  // Sol
    A4: 440.00   // La
};

// Para reproducir sonidos con Web Audio API
let audioContext;
try {
    // Intentar crear el contexto de audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
} catch (e) {
    console.error('Web Audio API no está soportada en este navegador');
}

// Clase para los bloques de la cuadrícula
class GridCell extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color, id, noteFrequency) {
        super(scene, x, y, width, height, color);
        this.id = id;
        this.defaultColor = color;
        this.isActive = false;
        this.noteFrequency = noteFrequency;
        this.setInteractive({ useHandCursor: true });
        this.setStrokeStyle(2, 0x000000);
        this.sector = null; // Referencia al gráfico del sector
        this.highlight = null; // Referencia al brillo

        // Eventos de interacción
        this.on('pointerover', this.onHover.bind(this));
        this.on('pointerout', this.onOut.bind(this));
        this.on('pointerdown', this.onDown.bind(this));
        this.on('pointerup', this.onUp.bind(this));

        // Añadir al scene
        scene.add.existing(this);
    }

    onHover() {
        if (!this.isActive && isPlayerTurn && this.sector) {
            // Hacer el sector más brillante
            this.sector.setAlpha(0.8);
        }
    }

    onOut() {
        if (!this.isActive && isPlayerTurn && this.sector) {
            // Restaurar opacidad normal
            this.sector.setAlpha(1);
        }
    }

    onDown() {
        if (!isPlayerTurn) return; // Solo permitir clics durante el turno del jugador
        
        this.isActive = true;
        
        if (this.sector) {
            // Efecto visual al hacer clic
            this.sector.setAlpha(0.7);
        }
        
        // Reproducir sonido
        this.playTone();
        
        // Añadir a la secuencia del jugador
        playerSequence.push(this.id);
        
        // Verificar si la secuencia es correcta hasta ahora
        checkPlayerSequence();
    }

    onUp() {
        if (!isPlayerTurn) return;
        
        this.isActive = false;
        
        if (this.sector) {
            // Restaurar apariencia normal
            this.sector.setAlpha(1);
        }
    }

    playTone() {
        if (audioContext) {
            // Flash visual
            if (this.sector) {
                this.scene.tweens.add({
                    targets: this.sector,
                    alpha: 0.5,
                    yoyo: true,
                    duration: 200,
                    ease: 'Sine.easeInOut'
                });
            }
            
            // Crear oscilador
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Configurar oscilador
            oscillator.type = 'sine';
            oscillator.frequency.value = this.noteFrequency;
            gainNode.gain.value = 0.5;
            
            // Conectar nodos
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Aplicar envolvente (attack, decay, sustain, release)
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            
            // Iniciar y detener el oscilador
            oscillator.start(now);
            oscillator.stop(now + 0.5);
        }
    }

    activate() {
        this.isActive = true;
        
        if (this.sector) {
            // Hacer el sector más brillante durante la activación
            this.scene.tweens.add({
                targets: this.sector,
                alpha: 0.5,
                yoyo: true,
                duration: GAME_CONFIG.flashDuration,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Reproducir sonido
        this.playTone();
        
        // Desactivar después de un breve tiempo
        this.scene.time.delayedCall(GAME_CONFIG.flashDuration, () => {
            this.isActive = false;
            if (this.sector) {
                this.sector.setAlpha(1);
            }
        });
    }
}

// Precarga de recursos
function preload() {
    // Mostrar texto de carga
    const loadingText = this.add.text(
        this.cameras.main.width / 2, 
        this.cameras.main.height / 2, 
        'Cargando...', 
        { 
            font: '28px Arial', 
            fill: '#ffffff' 
        }
    ).setOrigin(0.5);
    loadingText.setName('loadingText'); // Añadir un nombre para poder referenciarlo después

    // Eventos de carga
    this.load.on('progress', (value) => {
        loadingText.setText(`Cargando: ${parseInt(value * 100)}%`);
    });

    this.load.on('complete', () => {
        loadingText.destroy();
    });
}

// Crear elementos del juego
function create() {
    // Asegurarse de que el texto de carga se ha eliminado
    const loadingText = this.children.getByName('loadingText');
    if (loadingText) {
        loadingText.destroy();
    }

    // Agregar texto de título
    this.add.text(
        this.cameras.main.width / 2, 
        50, 
        'Sound Grid', 
        { 
            font: 'bold 36px Arial', 
            fill: '#ffffff' 
        }
    ).setOrigin(0.5);

    // Crear la cuadrícula
    createGrid(this);

    // Texto de instrucciones
    const instructionsText = this.add.text(
        this.cameras.main.width / 2, 
        this.cameras.main.height - 50, 
        'Escucha la secuencia y repítela', 
        { 
            font: '18px Arial', 
            fill: '#ffffff' 
        }
    ).setOrigin(0.5);
    instructionsText.setName('instructionsText');

    // Texto de estado
    const statusText = this.add.text(
        this.cameras.main.width / 2, 
        this.cameras.main.height - 80, 
        'Pulsa "Empezar" para jugar', 
        { 
            font: '20px Arial', 
            fill: '#ffffff' 
        }
    ).setOrigin(0.5);
    statusText.setName('statusText');

    // Botón de inicio - Colocarlo justo debajo del título
    const startButton = this.add.rectangle(
        this.cameras.main.width / 2,
        90, // Nueva posición Y, justo debajo del título
        140,
        40,
        0x27ae60
    );
    startButton.setInteractive({ useHandCursor: true });
    startButton.setName('startButton');
    
    const startText = this.add.text(
        startButton.x,
        startButton.y,
        'Empezar',
        {
            font: '18px Arial',
            fill: '#ffffff'
        }
    ).setOrigin(0.5);
    
    startButton.on('pointerdown', () => {
        startGame(this);
    });
    
    console.log('Juego iniciado correctamente');
}

// Función para crear la cuadrícula de 2x2
function createGrid(scene) {
    // Calcular dimensiones y posiciones
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;
    const outerRadius = 180;    // Radio del círculo exterior
    const innerRadius = 50;     // Radio del círculo interior (centro gris)
    const segmentRadius = outerRadius - 10; // Radio de los segmentos de color
    
    // Posiciones para cada sector (ángulos en radianes)
    const sectorAngles = [
        { start: Math.PI * 1.25, end: Math.PI * 1.75 },   // Sector superior-izquierdo (amarillo)
        { start: Math.PI * 1.75, end: Math.PI * 2.25 },   // Sector superior-derecho (azul)
        { start: Math.PI * 0.75, end: Math.PI * 1.25 },   // Sector inferior-izquierdo (rojo)
        { start: Math.PI * 0.25, end: Math.PI * 0.75 }    // Sector inferior-derecho (verde)
    ];
    
    // Colores para cada sector (siguiendo el patrón de la imagen)
    const colors = [COLORS.YELLOW, COLORS.BLUE, COLORS.RED, COLORS.GREEN];
    
    // Frecuencias de notas para cada celda
    const noteFrequencies = [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.A4];
    
    // Crear el círculo exterior (fondo negro)
    const outerCircle = scene.add.circle(centerX, centerY, outerRadius, 0x000000);
    outerCircle.setStrokeStyle(4, 0x1e272e);
    outerCircle.setDepth(-3);
    
    // Limpiar el array global
    gridCells = [];
    
    // Crear los sectores de colores neón
    for (let i = 0; i < 4; i++) {
        const startAngle = sectorAngles[i].start;
        const endAngle = sectorAngles[i].end;
        
        // Puntos para el sector
        const sector = scene.add.graphics();
        sector.fillStyle(colors[i], 1);
        sector.lineStyle(2, 0x000000, 0.8);
        
        // Dibujar el sector
        sector.beginPath();
        sector.moveTo(centerX, centerY);
        
        // Crear un arco (sector circular)
        // Dibujar el arco
        for (let angle = startAngle; angle <= endAngle; angle += 0.01) {
            const x = centerX + segmentRadius * Math.cos(angle);
            const y = centerY + segmentRadius * Math.sin(angle);
            sector.lineTo(x, y);
        }
        
        // Cerrar el camino
        sector.lineTo(centerX, centerY);
        sector.closePath();
        sector.fillPath();
        sector.strokePath();
        
        // Calcular la posición media del sector para colocar la zona interactiva
        const midAngle = (startAngle + endAngle) / 2;
        const sectorX = centerX + (segmentRadius / 2) * Math.cos(midAngle);
        const sectorY = centerY + (segmentRadius / 2) * Math.sin(midAngle);
        
        // Crear la zona interactiva con el tamaño y posición adecuados
        const cell = new GridCell(
            scene,
            sectorX,
            sectorY,
            segmentRadius, // Ancho aproximado
            segmentRadius, // Alto aproximado
            colors[i],
            i + 1,
            noteFrequencies[i]
        );
        
        // Hacer la zona rectangular invisible
        cell.setAlpha(0.001);
        
        // Definir el área interactiva como un círculo que abarca todo el sector
        const interactiveArea = new Phaser.Geom.Circle(
            centerX, 
            centerY, 
            segmentRadius
        );
        
        // Solo permitir interacciones dentro del sector
        cell.setInteractive({ 
            hitArea: interactiveArea,
            hitAreaCallback: function(hitArea, x, y) {
                // Primero verificar si está dentro del círculo
                if (!Phaser.Geom.Circle.Contains(hitArea, x, y)) {
                    return false;
                }
                
                // Calcular el ángulo del punto (x,y) con respecto al centro
                const angle = Math.atan2(y - centerY, x - centerX);
                // Convertir a ángulo positivo (0-2π)
                const positiveAngle = angle < 0 ? angle + Math.PI * 2 : angle;
                
                // Verificar si el ángulo está dentro del sector
                // Comparar ángulos considerando el caso especial de cruce del eje X positivo
                if (startAngle > endAngle) {
                    return positiveAngle >= startAngle || positiveAngle <= endAngle;
                } else {
                    return positiveAngle >= startAngle && positiveAngle <= endAngle;
                }
            }
        });
        
        // Guardar referencia al sector en la celda
        cell.sector = sector;
        
        // Agregar efecto de brillo (similar a los reflejos en la imagen)
        const highlight = scene.add.graphics();
        highlight.fillStyle(0xffffff, 0.2);
        
        // La posición y forma del brillo depende del sector
        let highlightAngle, highlightSize;
        
        if (i === 0) { // Amarillo (arriba-izquierda)
            highlightAngle = Math.PI * 1.5;
            highlightSize = 30;
        } else if (i === 1) { // Azul (arriba-derecha)
            highlightAngle = Math.PI * 2;
            highlightSize = 35;
        } else if (i === 2) { // Rojo (abajo-izquierda)
            highlightAngle = Math.PI;
            highlightSize = 25;
        } else { // Verde (abajo-derecha)
            highlightAngle = Math.PI * 0.5;
            highlightSize = 30;
        }
        
        // Dibujar el brillo
        highlight.beginPath();
        const hlX = centerX + (segmentRadius * 0.6) * Math.cos(highlightAngle);
        const hlY = centerY + (segmentRadius * 0.6) * Math.sin(highlightAngle);
        highlight.fillCircle(hlX, hlY, highlightSize);
        highlight.closePath();
        highlight.fillPath();
        
        // Guardar referencia al brillo
        cell.highlight = highlight;
        
        // Almacenar referencia en el array global
        gridCells.push(cell);
    }
    
    // Crear el círculo central (gris)
    const innerCircle = scene.add.circle(centerX, centerY, innerRadius, 0x95a5a6);
    innerCircle.setStrokeStyle(2, 0x7f8c8d);
    
    // Añadir un círculo interno que resalte el nivel
    const levelCircle = scene.add.circle(centerX, centerY, innerRadius - 12, 0x2c3e50);
    levelCircle.setStrokeStyle(2, 0xecf0f1);
    
    // Dibujar el botón central (la línea horizontal del círculo central)
    const centerButton = scene.add.rectangle(centerX, centerY + 10, innerRadius * 1.2, 8, 0x2c3e50);
    centerButton.setStrokeStyle(1, 0x1a2530);
    
    // Texto "NIVEL" pequeño encima del número
    const levelLabel = scene.add.text(
        centerX, 
        centerY - 20, 
        'NIVEL', 
        { 
            font: 'bold 12px Arial', 
            fill: '#ffffff' 
        }
    ).setOrigin(0.5);
    
    // Añadir el nivel como un contador numérico llamativo en el círculo central
    const levelText = scene.add.text(
        centerX, 
        centerY + 2, 
        currentLevel.toString(), 
        { 
            font: 'bold 32px Arial', 
            fill: '#ffffff',
            stroke: '#cc0000',
            strokeThickness: 3,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000',
                blur: 2,
                fill: true
            }
        }
    ).setOrigin(0.5);
    levelText.setName('levelText');
    
    // Añadir un brillo detrás del número para destacarlo más
    const levelGlow = scene.add.graphics();
    levelGlow.fillStyle(0xcc0000, 0.2);
    levelGlow.fillCircle(centerX, centerY, 20);
    levelGlow.setDepth(-1);
    
    // Pequeño efecto de pulso para llamar la atención
    scene.tweens.add({
        targets: levelText,
        scale: { from: 1, to: 1.1 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    
    // Añadir pequeños círculos decorativos (amarillo y rojo) como en la imagen
    const yellowDot = scene.add.circle(centerX - 12, centerY + 20, 4, COLORS.YELLOW);
    const redDot = scene.add.circle(centerX + 12, centerY + 20, 4, COLORS.RED);
}

// Iniciar el juego
function startGame(scene) {
    // Iniciar el contexto de audio si está suspendido
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Restablecer variables
    currentLevel = 1;
    playerSequence = [];
    currentSequence = [];
    isPlayingSequence = false;
    isPlayerTurn = false;
    
    // Actualizar textos
    updateLevelText(scene);
    
    // Desactivar botón de inicio
    const startButton = scene.children.getByName('startButton');
    if (startButton) {
        startButton.disableInteractive();
        startButton.setFillStyle(0x7f8c8d); // Color gris
    }
    
    // Actualizar estado
    updateStatusText(scene, 'Preparando secuencia...');
    
    // Empezar con el primer nivel
    scene.time.delayedCall(1000, () => {
        generateSequence();
        playSequence(scene);
    });
}

// Generar secuencia aleatoria
function generateSequence() {
    // Mantener la secuencia anterior y añadir un nuevo paso
    if (currentLevel === 1) {
        currentSequence = [];
    }
    
    // Añadir elementos a la secuencia según el nivel
    while (currentSequence.length < GAME_CONFIG.initialSequenceLength + currentLevel - 1) {
        const randomCellId = Math.floor(Math.random() * 4) + 1; // 1-4
        currentSequence.push(randomCellId);
    }
    
    console.log('Secuencia generada:', currentSequence);
}

// Reproducir secuencia
function playSequence(scene) {
    isPlayingSequence = true;
    isPlayerTurn = false;
    sequenceIndex = 0;
    
    updateStatusText(scene, 'Observa la secuencia...');
    
    // Reproducir cada paso de la secuencia
    const playNextStep = () => {
        if (sequenceIndex < currentSequence.length) {
            const cellId = currentSequence[sequenceIndex];
            const cell = gridCells.find(c => c.id === cellId);
            
            console.log(`Reproduciendo paso ${sequenceIndex + 1}: celda ${cellId}`);
            
            if (cell) {
                // Asegurarse de que esté activo por un momento
                cell.activate();
                
                // Verificar si el sector existe
                if (!cell.sector) {
                    console.error(`La celda ${cellId} no tiene un sector asociado`);
                }
            } else {
                console.error(`No se encontró la celda con ID ${cellId}`);
            }
            
            sequenceIndex++;
            
            // Programar el siguiente paso
            scene.time.delayedCall(GAME_CONFIG.delayBetweenSequenceSteps, playNextStep);
        } else {
            // Secuencia completada, turno del jugador
            isPlayingSequence = false;
            playerSequence = [];
            isPlayerTurn = true;
            updateStatusText(scene, 'Tu turno! Repite la secuencia');
        }
    };
    
    // Comenzar a reproducir la secuencia
    scene.time.delayedCall(500, playNextStep);
}

// Verificar la secuencia del jugador
function checkPlayerSequence() {
    const currentIndex = playerSequence.length - 1;
    
    // Verificar si el último input coincide con la secuencia
    if (playerSequence[currentIndex] !== currentSequence[currentIndex]) {
        // Error: secuencia incorrecta
        gameOver();
        return;
    }
    
    // Verificar si se completó correctamente la secuencia
    if (playerSequence.length === currentSequence.length) {
        // Secuencia correcta
        const scene = gridCells[0].scene;
        isPlayerTurn = false;
        
        updateStatusText(scene, '¡Correcto! Siguiente nivel...');
        
        // Pasar al siguiente nivel
        currentLevel++;
        if (currentLevel > GAME_CONFIG.maxLevel) {
            // Victoria: completó todos los niveles
            gameWin();
        } else {
            // Continuar con el siguiente nivel
            scene.time.delayedCall(1500, () => {
                updateLevelText(scene);
                generateSequence();
                playSequence(scene);
            });
        }
    }
}

// Función para reproducir un sonido de error
function playErrorSound() {
    if (audioContext) {
        // Crear osciladores para un sonido más complejo y estridente
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configurar osciladores para sonido disonante y estridente
        oscillator1.type = 'sawtooth'; // Forma de onda más áspera
        oscillator1.frequency.value = 220; // Frecuencia base (A3)
        
        oscillator2.type = 'square'; // Forma de onda cuadrada para más estridencia
        oscillator2.frequency.value = 233.08; // Ligeramente desafinado para crear disonancia (Bb3)
        
        // Conectar nodos
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Aplicar envolvente para sonido de error
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.6, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.2);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        
        // Añadir modulación de frecuencia para efecto de sirena
        oscillator1.frequency.setValueAtTime(220, now);
        oscillator1.frequency.linearRampToValueAtTime(180, now + 0.5);
        
        oscillator2.frequency.setValueAtTime(233.08, now);
        oscillator2.frequency.linearRampToValueAtTime(195, now + 0.5);
        
        // Iniciar y detener los osciladores
        oscillator1.start(now);
        oscillator2.start(now);
        oscillator1.stop(now + 0.5);
        oscillator2.stop(now + 0.5);
    }
}

// Fin del juego
function gameOver() {
    const scene = gridCells[0].scene;
    isPlayerTurn = false;
    
    // Reproducir sonido de error
    playErrorSound();
    
    // Efecto visual de error
    scene.cameras.main.shake(500, 0.01);
    
    updateStatusText(scene, '¡Incorrecto! Juego terminado');
    
    // Reactivar botón de inicio
    scene.time.delayedCall(2000, () => {
        const startButton = scene.children.getByName('startButton');
        if (startButton) {
            startButton.setInteractive({ useHandCursor: true });
            startButton.setFillStyle(0x27ae60); // Color verde
        }
        updateStatusText(scene, 'Pulsa "Empezar" para intentarlo de nuevo');
    });
}

// Victoria
function gameWin() {
    const scene = gridCells[0].scene;
    
    updateStatusText(scene, '¡Felicidades! ¡Has ganado!');
    
    // Reactivar botón de inicio
    scene.time.delayedCall(3000, () => {
        const startButton = scene.children.getByName('startButton');
        if (startButton) {
            startButton.setInteractive({ useHandCursor: true });
            startButton.setFillStyle(0x27ae60); // Color verde
        }
        updateStatusText(scene, 'Pulsa "Empezar" para jugar de nuevo');
    });
}

// Actualizar texto de nivel con una animación
function updateLevelText(scene) {
    const levelText = scene.children.getByName('levelText');
    if (levelText) {
        // Añadir efecto de escala al cambiar de nivel
        scene.tweens.add({
            targets: levelText,
            scale: { from: 1.5, to: 1 },
            duration: 300,
            ease: 'Back.easeOut',
            onStart: () => {
                levelText.setText(currentLevel.toString());
            }
        });
        
        // Flash de color para el cambio de nivel
        scene.tweens.add({
            targets: levelText,
            alpha: { from: 0.3, to: 1 },
            duration: 200,
            ease: 'Sine.easeOut'
        });
    }
}

// Actualizar texto de estado
function updateStatusText(scene, message) {
    const statusText = scene.children.getByName('statusText');
    if (statusText) {
        statusText.setText(message);
    }
}

// Actualización del juego (cada frame)
function update() {
    // La lógica principal está manejada por eventos
} 