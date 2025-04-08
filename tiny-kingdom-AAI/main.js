// Escena de arranque (Boot Scene)
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Configuraciones iniciales
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Pasar a la escena de precarga
        this.scene.start('PreloadScene');
    }
}

// Escena de precarga (Preload Scene)
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
        this.audioLoaded = false;
    }

    preload() {
        // Crear barra de carga
        this.createLoadingBar();

        // Cargar archivos de juego
        this.loadAssets();

        // Cargar archivos de audio
        this.load.audio('background-music', 'assets/audio/background-music.mp3');
        this.load.audio('attack-sound', 'assets/audio/attack-sound.mp3');
        this.load.audio('gold-sound', 'assets/audio/gold-sound.mp3');
    }

    loadAudioAssets() {
        // Intentar cargar los archivos de audio con manejo de errores
        this.load.on('loaderror', (fileObj) => {
            if (fileObj.type === 'audio') {
                console.warn(`Audio file not found: ${fileObj.key}`);
            }
        });

        // Intentar cargar los archivos de audio
        try {
            this.load.audio('background-music', 'assets/audio/background-music.mp3');
            this.load.audio('attack-sound', 'assets/audio/attack-sound.mp3');
            this.load.audio('gold-sound', 'assets/audio/gold-sound.mp3');
        } catch (e) {
            console.warn('Error loading audio files:', e);
        }
    }

    createLoadingBar() {
        // Texto de carga
        const loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Cargando...',
            { fontSize: '24px', fill: '#ffffff' }
        ).setOrigin(0.5);

        // Barra de progreso
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(
            this.cameras.main.width / 2 - 160,
            this.cameras.main.height / 2 - 25,
            320, 50
        );

        // Evento de progreso de carga
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(
                this.cameras.main.width / 2 - 150,
                this.cameras.main.height / 2 - 15,
                300 * value, 30
            );
        });

        // Evento de carga completa
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    loadAssets() {
        // Cargar imágenes y audios necesarios
        this.load.image('menu-background', 'assets/images/menu-background.svg');
        this.load.image('button', 'assets/images/button.svg');
    }

    create() {
        // Pasar a la escena del menú principal
        this.scene.start('MenuScene');

        // Iniciar música de fondo
        try {
            if (this.cache.audio.exists('background-music')) {
                const music = this.sound.add('background-music', { loop: true, volume: 0.5 });
                music.play();
            }
        } catch (e) {
            console.warn('Error playing background music:', e);
        }
    }
}

// Escena del menú principal
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Añadir fondo del menú
        try {
            this.add.image(400, 300, 'menu-background');
        } catch (e) {
            // Si falla, usar un color de fondo
            this.cameras.main.setBackgroundColor('#34495e');
        }

        // Título del juego
        this.add.text(400, 100, 'TINY KINGDOM', { 
            fontSize: '48px', 
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtítulo
        this.add.text(400, 160, 'Juego de Estrategia por Turnos', { 
            fontSize: '24px', 
            fill: '#ecf0f1' 
        }).setOrigin(0.5);

        // Botones del menú
        this.createButton(400, 280, 'Nueva Partida', () => this.startGame());
        this.createButton(400, 350, 'Opciones', () => this.showOptions());
        this.createButton(400, 420, 'Créditos', () => this.showCredits());
        this.createButton(400, 490, 'Árbol Tecnológico', () => this.scene.start('TechTreeScene'));
    }

    createButton(x, y, text, callback) {
        // Crear un contenedor para el botón
        const button = this.add.rectangle(x, y, 200, 50, 0x16a085, 0.8)
            .setInteractive()
            .on('pointerover', () => button.fillColor = 0x1abc9c)
            .on('pointerout', () => button.fillColor = 0x16a085)
            .on('pointerdown', callback);

        // Texto del botón
        this.add.text(x, y, text, {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    startGame() {
        this.scene.start('FactionSelectScene');
    }

    showOptions() {
        // Para implementar: menú de opciones
        console.log('Opciones - Por implementar');
    }

    showCredits() {
        // Para implementar: pantalla de créditos
        console.log('Créditos - Por implementar');
    }
}

// Escena de selección de facción
class FactionSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FactionSelectScene' });
        this.selectedFaction = null;
    }

    create() {
        // Fondo
        this.cameras.main.setBackgroundColor('#2c3e50');
        
        // Título de la pantalla
        this.add.text(400, 40, 'SELECCIONA TU FACCIÓN', { 
            fontSize: '28px', 
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Descripción
        this.add.text(400, 75, 'Cada facción tiene habilidades y tecnologías únicas', { 
            fontSize: '16px', 
            fill: '#ecf0f1' 
        }).setOrigin(0.5);

        // Definir facciones y sus características
        const factions = [
            {
                name: 'Humanos',
                color: 0x3498db,
                description: 'Versátiles y adaptables. Bonificación en comercio y diplomacia.',
                abilities: ['Diplomacia: Mejores relaciones con otras facciones', 
                           'Comercio: +15% de oro en intercambios', 
                           'Adaptabilidad: Pueden construir en cualquier terreno'],
                techs: ['Agricultura Avanzada', 'Gremios Comerciales', 'Caballería Pesada'],
                x: 170,
                y: 210
            },
            {
                name: 'Elfos',
                color: 0x2ecc71,
                description: 'Antiguos habitantes del bosque. Especialistas en arcos y magia natural.',
                abilities: ['Visión: +20% alcance de visión en el mapa', 
                           'Arquería: +15% daño con armas a distancia', 
                           'Armonía Natural: Bonificación en terrenos de bosque'],
                techs: ['Magia de la Naturaleza', 'Manufatura Élfica', 'Arquitectura Arbórea'],
                x: 330,
                y: 210
            },
            {
                name: 'Enanos',
                color: 0xe74c3c,
                description: 'Maestros forjadores y mineros. Resistentes y poderosos en defensa.',
                abilities: ['Minería: +25% producción de piedra y metales', 
                           'Forja: Armas y armaduras mejoradas', 
                           'Fortaleza: +20% resistencia en estructuras'],
                techs: ['Metalurgia Avanzada', 'Artillería a Vapor', 'Runas Antiguas'],
                x: 490,
                y: 210
            },
            {
                name: 'Orcos',
                color: 0x9b59b6,
                description: 'Feroces guerreros. Expertos en combate y conquista rápida.',
                abilities: ['Ferocidad: +15% daño en combate cuerpo a cuerpo', 
                           'Saqueo: Obtienen recursos al derrotar enemigos', 
                           'Horda: Unidades más baratas pero menos resistentes'],
                techs: ['Bestias de Guerra', 'Shamanismo', 'Armamento Brutal'],
                x: 650,
                y: 210
            }
        ];

        // Crear la selección de facciones
        this.createFactionCards(factions);

        // Botón para volver al menú
        const backButton = this.add.rectangle(100, 550, 160, 40, 0xe74c3c, 0.8)
            .setInteractive()
            .on('pointerover', () => backButton.fillColor = 0xf75c4c)
            .on('pointerout', () => backButton.fillColor = 0xe74c3c)
            .on('pointerdown', () => this.scene.start('MenuScene'));
            
        this.add.text(100, 550, 'Volver al Menú', { 
            fontSize: '16px', 
            fill: '#ffffff' 
        }).setOrigin(0.5);

        // Botón para comenzar (inicialmente deshabilitado)
        this.startButton = this.add.rectangle(700, 550, 160, 40, 0x7f8c8d, 0.8)
            .setInteractive()
            .on('pointerover', () => {
                if (this.selectedFaction) this.startButton.fillColor = 0x27ae60;
            })
            .on('pointerout', () => {
                if (this.selectedFaction) this.startButton.fillColor = 0x16a085;
                else this.startButton.fillColor = 0x7f8c8d;
            })
            .on('pointerdown', () => {
                if (this.selectedFaction) {
                    // Guardar facción seleccionada y comenzar juego
                    game.globals.playerFaction = this.selectedFaction;
                    this.scene.start('GameScene');
                }
            });
            
        this.startButtonText = this.add.text(700, 550, 'Comenzar Juego', { 
            fontSize: '16px', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
        
        // Panel de información detallada (inicialmente oculto)
        this.infoPanel = this.add.rectangle(400, 410, 750, 220, 0x2c3e50, 0.9);
        this.infoPanel.setVisible(false);
        
        this.infoPanelTitle = this.add.text(400, 340, '', { 
            fontSize: '18px',
            fill: '#ffffff',
            fontStyle: 'bold',
            wordWrap: { width: 700 }
        }).setOrigin(0.5);
        this.infoPanelTitle.setVisible(false);
        
        this.infoPanelAbilities = this.add.text(400, 370, '', {
            fontSize: '14px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5, 0);
        this.infoPanelAbilities.setVisible(false);
        
        this.infoPanelTechs = this.add.text(400, 450, '', {
            fontSize: '14px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5, 0);
        this.infoPanelTechs.setVisible(false);
    }

    createFactionCards(factions) {
        // Array para almacenar las referencias a los elementos de facción
        this.factionCards = [];
        const cardSize = 120;
        
        factions.forEach((faction) => {
            // Grupo para contener todos los elementos de la facción
            const group = this.add.group();
            
            // Fondo de la tarjeta
            const card = this.add.rectangle(faction.x, faction.y, cardSize, cardSize, faction.color, 1)
                .setOrigin(0.5)
                .setInteractive()
                .setStrokeStyle(0);
            
            // Añadir texto con el nombre de la facción
            const text = this.add.text(faction.x, faction.y + 40, faction.name, {
                fontSize: '14px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            
            // Añadir eventos
            card.on('pointerover', () => {
                if (this.selectedFaction !== faction.name) {
                    card.setStrokeStyle(4, 0xffffff, 0.8);
                }
                this.showFactionInfo(faction);
            });
            
            card.on('pointerout', () => {
                if (this.selectedFaction !== faction.name) {
                    card.setStrokeStyle(0);
                    this.hideFactionInfo();
                }
            });
            
            card.on('pointerdown', () => {
                // Limpiar selección anterior
                this.factionCards.forEach(fc => {
                    if (fc.name !== faction.name) {
                        fc.card.setStrokeStyle(0);
                    }
                });
                
                // Establecer nueva selección
                card.setStrokeStyle(4, 0xffd700, 1);
                this.selectFaction(faction.name, factions);
            });
            
            // Añadimos un ícono simple según la facción
            let icon;
            switch(faction.name) {
                case 'Humanos':
                    // Corona
                    icon = this.add.polygon(faction.x, faction.y - 15, [
                        0, 0, 20, -20, 40, 0, 30, 20, 20, 10, 10, 20
                    ], 0xf1c40f);
                    break;
                case 'Elfos':
                    // Arco
                    const arcGraphics = this.add.graphics();
                    arcGraphics.lineStyle(4, 0xffffff, 1);
                    arcGraphics.beginPath();
                    arcGraphics.arc(faction.x - 5, faction.y - 15, 20, 0.2, Math.PI - 0.2, false);
                    arcGraphics.strokePath();
                    // Cuerda del arco
                    arcGraphics.lineStyle(2, 0xffffff, 1);
                    arcGraphics.beginPath();
                    arcGraphics.moveTo(faction.x - 24, faction.y - 8);
                    arcGraphics.lineTo(faction.x + 14, faction.y - 8);
                    arcGraphics.strokePath();
                    icon = arcGraphics;
                    break;
                case 'Enanos':
                    // Hacha
                    const axeGraphics = this.add.graphics();
                    axeGraphics.fillStyle(0x95a5a6, 1);
                    axeGraphics.fillRect(faction.x - 5, faction.y - 35, 10, 40);
                    axeGraphics.lineStyle(2, 0xffffff, 1);
                    axeGraphics.fillStyle(0x95a5a6, 1);
                    axeGraphics.beginPath();
                    axeGraphics.moveTo(faction.x + 5, faction.y - 35);
                    axeGraphics.lineTo(faction.x + 25, faction.y - 45);
                    axeGraphics.lineTo(faction.x + 25, faction.y - 25);
                    axeGraphics.closePath();
                    axeGraphics.fillPath();
                    axeGraphics.strokePath();
                    icon = axeGraphics;
                    break;
                case 'Orcos':
                    // Colmillos - usamos líneas rectas en lugar de curvas
                    const tuskGraphics = this.add.graphics();
                    tuskGraphics.lineStyle(6, 0xffffff, 1);
                    
                    // Primer colmillo
                    tuskGraphics.beginPath();
                    tuskGraphics.moveTo(faction.x - 15, faction.y - 35);
                    tuskGraphics.lineTo(faction.x - 5, faction.y - 5);
                    tuskGraphics.lineTo(faction.x + 5, faction.y - 15);
                    tuskGraphics.strokePath();
                    
                    // Segundo colmillo
                    tuskGraphics.beginPath();
                    tuskGraphics.moveTo(faction.x + 15, faction.y - 35);
                    tuskGraphics.lineTo(faction.x + 5, faction.y - 5);
                    tuskGraphics.lineTo(faction.x - 5, faction.y - 15);
                    tuskGraphics.strokePath();
                    
                    icon = tuskGraphics;
                    break;
            }
            
            // Guardar referencia
            this.factionCards.push({
                name: faction.name,
                card: card,
                text: text,
                icon: icon
            });
            
            // Si ya está seleccionada, mostrar el borde
            if (this.selectedFaction === faction.name) {
                card.setStrokeStyle(4, 0xffd700, 1);
            }
        });
    }
    
    showFactionInfo(faction) {
        // Mostrar panel de información
        this.infoPanel.setVisible(true);
        
        // Titulo con descripción
        this.infoPanelTitle.setText(`${faction.name}: ${faction.description}`);
        this.infoPanelTitle.setVisible(true);
        
        // Ajustamos formato para mejor legibilidad
        this.infoPanelAbilities.setText('HABILIDADES:\n• ' + faction.abilities.join('\n• '));
        this.infoPanelAbilities.setVisible(true);
        
        // Ajustamos formato para mejor legibilidad
        this.infoPanelTechs.setText('TECNOLOGÍAS ÚNICAS:\n• ' + faction.techs.join('\n• '));
        this.infoPanelTechs.setVisible(true);
    }
    
    hideFactionInfo() {
        // Solo ocultamos si no hay facción seleccionada o si no estamos forzando la visibilidad
        if (!this.keepInfoVisible) {
            this.infoPanel.setVisible(false);
            this.infoPanelTitle.setVisible(false);
            this.infoPanelAbilities.setVisible(false);
            this.infoPanelTechs.setVisible(false);
        }
        
        // Reseteamos el flag para la próxima vez
        this.keepInfoVisible = false;
    }
    
    selectFaction(factionName, factions) {
        this.selectedFaction = factionName;
        
        // Habilitar botón de comenzar
        this.startButton.fillColor = 0x16a085;
        
        // Actualizar panel de información
        const selectedFactionData = factions.find(f => f.name === factionName);
        this.showFactionInfo(selectedFactionData);
        
        // Importante: mantenemos visible la información
        this.keepInfoVisible = true;
    }
}

// Escena principal del juego
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Configuración básica del juego
        this.setupGame();
        
        // Crear mapa del juego
        this.createMap();
        
        // Interfaz de usuario básica
        this.createUI();
        
        // Asignar territorios iniciales a las facciones
        this.setupInitialTerritories();
        
        // Inicializar sistema de combate
        this.initCombatSystem();

        this.victoryPoints = 0; // Inicializar puntos de victoria
        this.createBuildTowerButton(); // Crear botón para construir torres

        // Añadir un contador de acciones al estado del juego
        this.gameState.actionsRemaining = 3;
    }

    setupGame() {
        // Inicializar estado del juego
        this.gameState = {
            currentFaction: 0,
            turn: 1,
            resources: {
                'Humanos': { 'Comida': 50, 'Mineral': 50, 'Maná': 50 },
                'Elfos': { 'Comida': 50, 'Mineral': 40, 'Maná': 70 },
                'Enanos': { 'Comida': 40, 'Mineral': 80, 'Maná': 30 },
                'Orcos': { 'Comida': 70, 'Mineral': 60, 'Maná': 20 }
            },
            territories: {},
            playerFaction: game.globals.playerFaction || 'Humanos',
            combatInProgress: false,
            experience: 0, // Añadir experiencia
            level: 1 // Añadir nivel
        };

        // Añadir fondo
        this.cameras.main.setBackgroundColor('#2c3e50');
    }

    createMap() {
        // Definición del tamaño del mapa
        this.mapSize = 5; // Mapa 5x5
        this.tileSize = 95; // Tamaño de cada casilla (reducido para dejar más espacio)
        this.map = [];
        
        // Definir tipos de terreno
        this.terrainTypes = [
            { 
                id: 'plains', 
                name: 'Llanuras', 
                resourceBonus: 'Comida', 
                bonusAmount: 3, 
                color: 0x7cb342,
                description: 'Tierras fértiles que aumentan la producción de comida para unidades'
            },
            { 
                id: 'mountains', 
                name: 'Montañas', 
                resourceBonus: 'Mineral', 
                bonusAmount: 3, 
                color: 0x757575,
                description: 'Ricas en minerales, aumentan la producción para construcciones'
            },
            { 
                id: 'forest', 
                name: 'Bosque', 
                resourceBonus: 'Comida', 
                bonusAmount: 2, 
                color: 0x33691e,
                description: 'Bosques que proporcionan comida para unidades'
            },
            { 
                id: 'manaspring', 
                name: 'Fuente de Maná', 
                resourceBonus: 'Maná', 
                bonusAmount: 3, 
                color: 0x9c27b0,
                description: 'Fuente mágica que proporciona maná para hechizos'
            },
            { 
                id: 'hills', 
                name: 'Colinas', 
                resourceBonus: 'Mineral', 
                bonusAmount: 2, 
                color: 0xd4aa00,
                description: 'Terrenos rocosos que proporcionan mineral para construcciones'
            },
            { 
                id: 'magicwoods', 
                name: 'Bosque Mágico', 
                resourceBonus: 'Maná', 
                bonusAmount: 2, 
                color: 0x4a148c,
                description: 'Bosques ancestrales con energía mágica para hechizos'
            }
        ];
        
        // Crear matriz del mapa
        for (let y = 0; y < this.mapSize; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.mapSize; x++) {
                // Elegir un tipo de terreno aleatorio
                const terrainType = this.terrainTypes[Math.floor(Math.random() * this.terrainTypes.length)];
                
                this.map[y][x] = {
                    x: x,
                    y: y,
                    terrain: terrainType,
                    owner: null, // Sin propietario inicialmente
                    units: 0,    // Unidades en el territorio
                    building: null // Sin edificio inicialmente
                };
            }
        }
        
        // Renderizar el mapa en pantalla
        this.renderMap();
    }
    
    renderMap() {
        // Contenedor para todos los elementos del mapa
        this.mapContainer = this.add.container(0, 0);
        
        // Calcular offset para centrar el mapa
        const offsetX = (this.cameras.main.width - this.mapSize * this.tileSize) / 2;
        const offsetY = (this.cameras.main.height - this.mapSize * this.tileSize) / 2 + 60; // Aumentado para dejar espacio a UI superior
        
        // Guardar el límite inferior real del mapa para colocar elementos posteriormente
        this.mapBottomEdge = offsetY + this.mapSize * this.tileSize;
        
        // Crear casillas del mapa
        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                const territory = this.map[y][x];
                
                // Calcular posición en pantalla
                const posX = offsetX + x * this.tileSize + this.tileSize / 2;
                const posY = offsetY + y * this.tileSize + this.tileSize / 2;
                
                // Crear grupo para este territorio
                const territoryGroup = this.add.container(posX, posY);
                
                // Guardar referencia a la posición para uso posterior
                territory.screenX = posX;
                territory.screenY = posY;
                
                // Crear fondo del territorio
                const territoryBg = this.add.rectangle(
                    0, 0,
                    this.tileSize - 8, 
                    this.tileSize - 8, 
                    territory.terrain.color
                ).setStrokeStyle(2, 0xffffff, 0.8);
                
                // Añadir interactividad
                territoryBg.setInteractive();
                territoryBg.on('pointerover', () => this.showTerritoryInfo(territory));
                territoryBg.on('pointerout', () => this.hideTerritoryInfo());
                territoryBg.on('pointerdown', () => this.handleTerritoryClick(territory));
                
                // Texto con nombre del terreno - ajustado para evitar superposiciones
                const terrainText = this.add.text(
                    0, -25,
                    territory.terrain.name,
                    {
                        fontSize: '10px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 2
                    }
                ).setOrigin(0.5);
                
                // Guardar referencias para poder actualizar después
                territory.bg = territoryBg;
                territory.text = terrainText;
                
                // Añadir elementos al grupo
                territoryGroup.add(territoryBg);
                territoryGroup.add(terrainText);
                
                // Añadir el grupo al contenedor principal
                this.mapContainer.add(territoryGroup);
                
                // Guardar referencia al grupo
                territory.group = territoryGroup;
            }
        }
    }
    
    setupInitialTerritories() {
        // Asignar territorio inicial al jugador
        const playerFaction = this.gameState.playerFaction;
        const factions = game.globals.factions;
        
        // Posiciones iniciales para cada facción
        const startPositions = {
            'Humanos': {x: 0, y: 0},
            'Elfos': {x: this.mapSize-1, y: 0},
            'Enanos': {x: 0, y: this.mapSize-1},
            'Orcos': {x: this.mapSize-1, y: this.mapSize-1}
        };
        
        // Asignar territorios iniciales
        factions.forEach(faction => {
            const pos = startPositions[faction];
            const territory = this.map[pos.y][pos.x];
            
            // Asignar propietario
            this.claimTerritory(territory, faction);
            
            // Añadir tropas iniciales
            territory.units = 5;
            
            // Actualizar visualización
            this.updateTerritoryVisuals(territory);
        });
    }
    
    claimTerritory(territory, factionName) {
        // Actualizar propietario del territorio
        territory.owner = factionName;
        
        // Actualizar visualización
        this.updateTerritoryVisuals(territory);
    }
    
    updateTerritoryVisuals(territory) {
        // Color de borde según propietario
        if (territory.owner) {
            const factionColors = {
                'Humanos': 0x3498db,
                'Elfos': 0x2ecc71,
                'Enanos': 0xe74c3c,
                'Orcos': 0x9b59b6
            };
            
            // Actualizar borde
            territory.bg.setStrokeStyle(4, factionColors[territory.owner], 1);
            
            // Mostrar unidades si tiene
            if (territory.units > 0) {
                // Eliminar texto anterior si existe
                if (territory.unitsText) {
                    territory.unitsText.destroy();
                }
                
                // Crear nuevo texto
                territory.unitsText = this.add.text(
                    0, 
                    10,
                    `${territory.units} ⚔️`,
                    {
                        fontSize: '12px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 2
                    }
                ).setOrigin(0.5);
                
                // Añadir al grupo
                territory.group.add(territory.unitsText);
            }
        }
    }
    
    handleTerritoryClick(territory) {
        // No permitir acciones si hay un combate en curso
        if (this.gameState.combatInProgress) {
            return;
        }

        // Solo permitir acciones en el turno del jugador
        if (game.globals.factions[this.gameState.currentFaction] !== this.gameState.playerFaction) {
            this.showMessage('No es tu turno');
            return;
        }

        // Si el territorio pertenece al jugador
        if (territory.owner === this.gameState.playerFaction) {
            // Seleccionar territorio origen
            this.selectSourceTerritory(territory);
        } 
        // Si es un territorio adyacente al seleccionado
        else if (this.selectedTerritory && this.isAdjacent(this.selectedTerritory, territory)) {
            // Intentar conquistar
            this.tryConquerTerritory(this.selectedTerritory, territory);
        }
        else {
            // Mensajes específicos según la situación
            if (!this.selectedTerritory) {
                this.showMessage('Selecciona un territorio propio primero');
            } else if (!this.isAdjacent(this.selectedTerritory, territory)) {
                this.showMessage('El territorio no es adyacente al seleccionado');
            } else {
                this.showMessage('Territorio no disponible');
            }
        }
    }
    
    selectSourceTerritory(territory) {
        // Deseleccionar territorio anterior
        if (this.selectedTerritory) {
            this.selectedTerritory.bg.setStrokeStyle(4, this.getFactionColor(this.selectedTerritory.owner), 1);
        }
        
        // Seleccionar nuevo territorio
        this.selectedTerritory = territory;
        territory.bg.setStrokeStyle(4, 0xffd700, 1);
        
        // Mostrar mensaje informativo
        this.showMessage(`Seleccionado: ${territory.terrain.name} (${territory.units} unidades)`);
    }
    
    isAdjacent(territory1, territory2) {
        // Comprobar si dos territorios son adyacentes
        const dx = Math.abs(territory1.x - territory2.x);
        const dy = Math.abs(territory1.y - territory2.y);
        
        // Adyacente si está a una casilla de distancia ortogonalmente (no diagonal)
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }
    
    tryConquerTerritory(source, target) {
        // Verificar si tiene suficientes unidades (mínimo 2 para atacar)
        if (source.units < 2) {
            this.showMessage('Necesitas al menos 2 unidades para atacar');
            return;
        }
        
        // Si el territorio está vacío
        if (!target.owner) {
            // Éxito automático, mover la mitad de las unidades
            const unitsToMove = Math.ceil(source.units / 2);
            source.units -= unitsToMove;
            target.units = unitsToMove;
            
            // Asignar propietario
            this.claimTerritory(target, this.gameState.playerFaction);
            
            // Actualizar visualización
            this.updateTerritoryVisuals(source);
            this.updateTerritoryVisuals(target);
            
            // Mostrar mensaje
            this.showMessage(`¡Territorio conquistado! Movidas ${unitsToMove} unidades`);
            
            // Desmarcar territorio seleccionado
            this.selectedTerritory = null;
        } 
        // Si el territorio pertenece a otra facción
        else {
            // Iniciar batalla
            this.startCombat(source, target);
        }
    }
    
    getFactionColor(factionName) {
        const factionColors = {
            'Humanos': 0x3498db,
            'Elfos': 0x2ecc71,
            'Enanos': 0xe74c3c,
            'Orcos': 0x9b59b6
        };
        return factionColors[factionName] || 0xffffff;
    }
    
    showTerritoryInfo(territory) {
        // Crear panel de información si no existe
        if (!this.infoPanel) {
            // Colocar el panel encima de los botones pero sin solapar con el mapa
            this.infoPanel = this.add.container(400, 510);
            
            // Fondo del panel
            const bg = this.add.rectangle(0, 0, 700, 60, 0x000000, 0.7);
            this.infoText = this.add.text(0, 0, '', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 650 }
            }).setOrigin(0.5);
            
            this.infoPanel.add(bg);
            this.infoPanel.add(this.infoText);
            
            // Inicialmente invisible
            this.infoPanel.setVisible(false);
        }
        
        // Iconos de recursos
        const resourceIcons = {
            'Comida': '🍗',
            'Mineral': '⛏️',
            'Maná': '✨'
        };
        
        // Actualizar información
        let infoStr = `${territory.terrain.name}: ${territory.terrain.description}\n`;
        infoStr += `Bonificación: +${territory.terrain.bonusAmount} ${resourceIcons[territory.terrain.resourceBonus]} ${territory.terrain.resourceBonus}`;
        
        if (territory.owner) {
            infoStr += ` | Propietario: ${territory.owner} - Unidades: ${territory.units}`;
        } else {
            infoStr += ` | Territorio neutral`;
        }
        
        this.infoText.setText(infoStr);
        this.infoPanel.setVisible(true);
    }
    
    hideTerritoryInfo() {
        if (this.infoPanel) {
            this.infoPanel.setVisible(false);
        }
    }
    
    showMessage(text) {
        // Crear mensaje temporal
        if (this.messageText) {
            this.messageText.destroy();
        }
        
        this.messageText = this.add.text(400, 50, text, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        // Desvanecer después de 2 segundos
        this.time.delayedCall(2000, () => {
            if (this.messageText) {
                this.messageText.destroy();
            }
        });
    }

    createUI() {
        // Fondo para la UI superior expandido para incluir título y recursos
        this.add.rectangle(400, 40, 780, 80, 0x000000, 0.6);
        
        // Texto de información del turno (en la parte superior)
        this.turnText = this.add.text(400, 20, 'Turno: 1 - Facción: Humanos', { 
            fontSize: '18px', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Panel de recursos (debajo del título)
        this.createResourcesPanel();
        
        // Fondo para la UI inferior - asegurando que está bien posicionada
        this.add.rectangle(400, 565, 780, 60, 0x000000, 0.6);
        
        // Botón para finalizar turno
        const endTurnButton = this.add.rectangle(680, 565, 160, 40, 0x16a085, 0.8)
            .setInteractive()
            .on('pointerover', () => endTurnButton.fillColor = 0x1abc9c)
            .on('pointerout', () => endTurnButton.fillColor = 0x16a085)
            .on('pointerdown', () => this.endTurn());
            
        this.add.text(680, 565, 'Finalizar Turno', { 
            fontSize: '16px', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
        
        // Botón para volver al menú
        const menuButton = this.add.rectangle(120, 565, 160, 40, 0xe74c3c, 0.8)
            .setInteractive()
            .on('pointerover', () => menuButton.fillColor = 0xf75c4c)
            .on('pointerout', () => menuButton.fillColor = 0xe74c3c)
            .on('pointerdown', () => this.scene.start('MenuScene'));
            
        this.add.text(120, 565, 'Volver al Menú', { 
            fontSize: '16px', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
    }
    
    createResourcesPanel() {
        // Panel de recursos del jugador
        const resourceTypes = ['Comida', 'Mineral', 'Maná'];
        const playerResources = this.gameState.resources[this.gameState.playerFaction];
        
        // Textos de recursos - ahora en una fila centrada debajo del título
        this.resourceTexts = {};
        let xPos = 250;
        
        // Añadir iconos para cada recurso
        const resourceIcons = {
            'Comida': '🍗', // Icono de comida
            'Mineral': '⛏️', // Icono de mineral
            'Maná': '✨'    // Icono de maná
        };
        
        resourceTypes.forEach(resource => {
            this.resourceTexts[resource] = this.add.text(xPos, 55, `${resourceIcons[resource]} ${resource}: ${playerResources[resource]}`, {
                fontSize: '14px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
            
            xPos += 150; // Mayor separación para acomodar iconos
        });
    }
    
    updateResourceDisplay() {
        // Actualizar visualización de recursos
        const playerResources = this.gameState.resources[this.gameState.playerFaction];
        const resourceIcons = {
            'Comida': '🍗',
            'Mineral': '⛏️',
            'Maná': '✨'
        };
        
        for (const resource in this.resourceTexts) {
            this.resourceTexts[resource].setText(`${resourceIcons[resource]} ${resource}: ${playerResources[resource]}`);
        }
    }

    endTurn() {
        // Restablecer el contador de acciones
        this.gameState.actionsRemaining = 3;
        
        // Procesar recursos del turno
        this.processResources();
        
        // Cambiar a la siguiente facción
        this.gameState.currentFaction = (this.gameState.currentFaction + 1) % 4;
        
        // Si completamos una ronda, aumentar el número de turno
        if (this.gameState.currentFaction === 0) {
            this.gameState.turn++;
        }
        
        // Actualizar texto de turno
        this.turnText.setText(`Turno: ${this.gameState.turn} - Facción: ${game.globals.factions[this.gameState.currentFaction]}`);
        
        // Deseleccionar territorio
        if (this.selectedTerritory) {
            this.selectedTerritory.bg.setStrokeStyle(4, this.getFactionColor(this.selectedTerritory.owner), 1);
            this.selectedTerritory = null;
        }
        
        // Si es turno de la IA, procesarla
        if (game.globals.factions[this.gameState.currentFaction] !== this.gameState.playerFaction) {
            // Simple AI para facciones no jugadoras
            this.processAITurn();
        }
    }
    
    processResources() {
        // Procesar recursos del jugador según territorios
        const currentFaction = game.globals.factions[this.gameState.currentFaction];
        const factionResources = this.gameState.resources[currentFaction];
        
        // Base de producción - pequeña cantidad base por turno
        const baseProduction = {
            'Comida': 2,
            'Mineral': 2,
            'Maná': 1
        };
        
        // Añadir recursos base
        for (const resource in baseProduction) {
            factionResources[resource] += baseProduction[resource];
        }
        
        // Añadir bonificaciones por territorio
        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                const territory = this.map[y][x];
                
                if (territory.owner === currentFaction) {
                    // Añadir bonificación del territorio
                    const bonus = territory.terrain.bonusAmount;
                    const resourceType = territory.terrain.resourceBonus;
                    
                    factionResources[resourceType] += bonus;
                    
                    // Efectos visuales para recolección de recursos (solo para el jugador)
                    if (currentFaction === this.gameState.playerFaction) {
                        this.showResourceCollection(territory, resourceType, bonus);
                    }
                }
            }
        }
        
        // Bonificaciones por facción
        if (currentFaction === 'Humanos') {
            // Humanos: +1 a todos los recursos
            factionResources['Comida'] += 1;
            factionResources['Mineral'] += 1;
            factionResources['Maná'] += 1;
        } else if (currentFaction === 'Elfos') {
            // Elfos: +2 a Maná
            factionResources['Maná'] += 2;
        } else if (currentFaction === 'Enanos') {
            // Enanos: +2 a Mineral
            factionResources['Mineral'] += 2;
        } else if (currentFaction === 'Orcos') {
            // Orcos: +2 a Comida
            factionResources['Comida'] += 2;
        }
        
        // Actualizar visualización si es el jugador
        if (currentFaction === this.gameState.playerFaction) {
            this.updateResourceDisplay();
        }
    }
    
    showResourceCollection(territory, resourceType, amount) {
        // Mostrar efecto visual de recolección de recursos
        const resourceIcons = {
            'Comida': '🍗',
            'Mineral': '⛏️',
            'Maná': '✨'
        };
        
        const resourceText = this.add.text(
            territory.screenX,
            territory.screenY,
            `+${amount} ${resourceIcons[resourceType]}`,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Animación de ascenso y desvanecimiento
        this.tweens.add({
            targets: resourceText,
            y: territory.screenY - 40,
            alpha: 0,
            duration: 1500,
            onComplete: () => resourceText.destroy()
        });

        // Reproducir el efecto de sonido para la recolección de recursos
        try {
            if (resourceType === 'Mineral' && this.cache.audio.exists('gold-sound')) {
                this.sound.play('gold-sound', { volume: 0.3 });
            }
        } catch (e) {
            console.warn('Error playing gold sound:', e);
        }
    }
    
    processAITurn() {
        // IA simple para facciones no jugadoras
        const currentFaction = game.globals.factions[this.gameState.currentFaction];
        
        // Encontrar territorios de la facción actual
        const ownedTerritories = [];
        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                if (this.map[y][x].owner === currentFaction) {
                    ownedTerritories.push(this.map[y][x]);
                }
            }
        }
        
        // Para cada territorio, intentar expandirse
        ownedTerritories.forEach(territory => {
            // Solo expandirse si tiene suficientes unidades
            if (territory.units >= 2) {
                // Encontrar territorios adyacentes
                const adjacentTerritories = this.getAdjacentTerritories(territory);
                
                // Filtrar los que no son de la facción actual
                const targetTerritories = adjacentTerritories.filter(t => t.owner !== currentFaction);
                
                // Si hay objetivos disponibles, elegir uno al azar
                if (targetTerritories.length > 0) {
                    const target = targetTerritories[Math.floor(Math.random() * targetTerritories.length)];
                    
                    // Si el territorio está vacío, conquistarlo
                    if (!target.owner) {
                        const unitsToMove = Math.ceil(territory.units / 2);
                        territory.units -= unitsToMove;
                        target.units = unitsToMove;
                        
                        // Asignar propietario
                        this.claimTerritory(target, currentFaction);
                        
                        // Actualizar visualización
                        this.updateTerritoryVisuals(territory);
                        this.updateTerritoryVisuals(target);
                    }
                    // Simulación simple de batalla para la IA
                    else if (territory.units > target.units * 1.5) {
                        // IA solo ataca si tiene ventaja numérica significativa
                        
                        // Calcular pérdidas
                        const aiLosses = Math.ceil(territory.units * 0.3);
                        const targetLosses = Math.ceil(target.units * 0.7);
                        
                        // Actualizar unidades
                        territory.units -= aiLosses;
                        
                        // Si eliminamos todas las unidades enemigas, conquistamos
                        if (targetLosses >= target.units) {
                            const unitsToMove = Math.ceil(territory.units / 2);
                            territory.units -= unitsToMove;
                            target.units = unitsToMove;
                            
                            // Asignar propietario
                            this.claimTerritory(target, currentFaction);
                        } else {
                            // Reducir unidades del defensor
                            target.units -= targetLosses;
                        }
                        
                        // Actualizar visualización
                        this.updateTerritoryVisuals(territory);
                        this.updateTerritoryVisuals(target);
                    }
                }
            }
        });
        
        // Esperar un poco y pasar al siguiente turno
        this.time.delayedCall(1000, () => {
            this.endTurn();
        });
    }
    
    getAdjacentTerritories(territory) {
        const adjacent = [];
        const { x, y } = territory;
        
        // Comprobar los cuatro territorios adyacentes
        const directions = [
            { x: 0, y: -1 }, // Norte
            { x: 1, y: 0 },  // Este
            { x: 0, y: 1 },  // Sur
            { x: -1, y: 0 }  // Oeste
        ];
        
        directions.forEach(dir => {
            const newX = x + dir.x;
            const newY = y + dir.y;
            
            // Comprobar que está dentro de los límites
            if (newX >= 0 && newX < this.mapSize && newY >= 0 && newY < this.mapSize) {
                adjacent.push(this.map[newY][newX]);
            }
        });
        
        return adjacent;
    }

    initCombatSystem() {
        // Definir estadísticas de unidades por facción
        this.unitStats = {
            'Humanos': { ataque: 5, defensa: 5, moral: 6, nombre: 'Caballero' },
            'Elfos': { ataque: 7, defensa: 3, moral: 5, nombre: 'Arquero' },
            'Enanos': { ataque: 4, defensa: 8, moral: 7, nombre: 'Guerrero' },
            'Orcos': { ataque: 8, defensa: 2, moral: 4, nombre: 'Berserker' }
        };
        
        // Crear panel de combate (inicialmente oculto)
        this.createCombatPanel();
    }
    
    createCombatPanel() {
        // Contenedor principal del combate
        this.combatPanel = this.add.container(400, 300);
        this.combatPanel.setVisible(false);
        
        // Fondo semitransparente para todo el juego durante el combate
        this.combatOverlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7);
        this.combatOverlay.setOrigin(0, 0);
        this.combatPanel.add(this.combatOverlay);
        
        // Panel de la batalla
        this.combatBackground = this.add.rectangle(0, 0, 600, 400, 0x2c3e50, 0.9);
        this.combatBackground.setStrokeStyle(4, 0xffffff, 1);
        this.combatPanel.add(this.combatBackground);
        
        // Título de la batalla
        this.combatTitle = this.add.text(0, -170, 'BATALLA POR EL TERRITORIO', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.combatPanel.add(this.combatTitle);
        
        // Secciones para los bandos combatientes
        this.attackerSection = this.add.container(-200, 0);
        this.defenderSection = this.add.container(200, 0);
        this.combatPanel.add(this.attackerSection);
        this.combatPanel.add(this.defenderSection);
        
        // Sección de resultados de cada ronda
        this.combatLog = this.add.text(0, 80, '', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        this.combatPanel.add(this.combatLog);
        
        // Botones de acción
        this.continueCombatButton = this.add.rectangle(100, 150, 180, 40, 0x16a085, 0.8)
            .setInteractive()
            .on('pointerover', () => this.continueCombatButton.fillColor = 0x1abc9c)
            .on('pointerout', () => this.continueCombatButton.fillColor = 0x16a085)
            .on('pointerdown', () => this.continueCombat());
        
        this.combatPanel.add(this.continueCombatButton);
        
        this.continueCombatText = this.add.text(100, 150, 'Continuar Batalla', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.combatPanel.add(this.continueCombatText);
        
        this.retreatButton = this.add.rectangle(-100, 150, 180, 40, 0xe74c3c, 0.8)
            .setInteractive()
            .on('pointerover', () => this.retreatButton.fillColor = 0xf75c4c)
            .on('pointerout', () => this.retreatButton.fillColor = 0xe74c3c)
            .on('pointerdown', () => this.retreatFromCombat());
        
        this.combatPanel.add(this.retreatButton);
        
        this.retreatText = this.add.text(-100, 150, 'Retirada', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.combatPanel.add(this.retreatText);
        
        // Efectos visuales para el combate
        this.attackEffect = this.add.graphics();
        this.defenseEffect = this.add.graphics();
        this.combatPanel.add(this.attackEffect);
        this.combatPanel.add(this.defenseEffect);
    }
    
    startCombat(attackerTerritory, defenderTerritory) {
        // Guardar referencias a los territorios
        this.attackerTerritory = attackerTerritory;
        this.defenderTerritory = defenderTerritory;
        
        // Inicializar estado de combate
        this.combatState = {
            attacker: {
                faction: attackerTerritory.owner,
                units: attackerTerritory.units,
                remaining: attackerTerritory.units,
                territory: attackerTerritory
            },
            defender: {
                faction: defenderTerritory.owner,
                units: defenderTerritory.units,
                remaining: defenderTerritory.units,
                territory: defenderTerritory
            },
            round: 0,
            log: []
        };
        
        // Marcar que hay un combate en curso
        this.gameState.combatInProgress = true;
        
        // Actualizar interfaz de combate
        this.updateCombatUI();
        
        // Mostrar panel de combate
        this.combatPanel.setVisible(true);
        
        // Animación de entrada
        this.tweens.add({
            targets: this.combatPanel,
            scale: { from: 0.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
    
    updateCombatUI() {
        // Limpiar secciones previas
        this.attackerSection.removeAll(true);
        this.defenderSection.removeAll(true);
        
        // Obtener estadísticas de ambos bandos
        const attackerStats = this.unitStats[this.combatState.attacker.faction];
        const defenderStats = this.unitStats[this.combatState.defender.faction];
        
        // Crear visualización del atacante
        const attackerTitle = this.add.text(0, -80, this.combatState.attacker.faction, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const attackerUnitName = this.add.text(0, -50, attackerStats.nombre, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const attackerUnits = this.add.text(0, -20, `Unidades: ${this.combatState.attacker.remaining}/${this.combatState.attacker.units}`, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const attackerAtkDef = this.add.text(0, 10, `ATK: ${attackerStats.ataque} | DEF: ${attackerStats.defensa} | MOR: ${attackerStats.moral}`, {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Icono de la unidad atacante
        const attackerIcon = this.add.rectangle(0, 50, 60, 60, this.getFactionColor(this.combatState.attacker.faction));
        
        // Añadir elementos a la sección del atacante
        this.attackerSection.add(attackerTitle);
        this.attackerSection.add(attackerUnitName);
        this.attackerSection.add(attackerUnits);
        this.attackerSection.add(attackerAtkDef);
        this.attackerSection.add(attackerIcon);
        
        // Crear visualización del defensor
        const defenderTitle = this.add.text(0, -80, this.combatState.defender.faction, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const defenderUnitName = this.add.text(0, -50, defenderStats.nombre, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const defenderUnits = this.add.text(0, -20, `Unidades: ${this.combatState.defender.remaining}/${this.combatState.defender.units}`, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const defenderAtkDef = this.add.text(0, 10, `ATK: ${defenderStats.ataque} | DEF: ${defenderStats.defensa} | MOR: ${defenderStats.moral}`, {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Icono de la unidad defensora
        const defenderIcon = this.add.rectangle(0, 50, 60, 60, this.getFactionColor(this.combatState.defender.faction));
        
        // Añadir elementos a la sección del defensor
        this.defenderSection.add(defenderTitle);
        this.defenderSection.add(defenderUnitName);
        this.defenderSection.add(defenderUnits);
        this.defenderSection.add(defenderAtkDef);
        this.defenderSection.add(defenderIcon);
        
        // Actualizar el registro de combate si hay entradas
        if (this.combatState.log.length > 0) {
            this.combatLog.setText(this.combatState.log.slice(-3).join('\n'));
        } else {
            this.combatLog.setText('¡La batalla está a punto de comenzar!');
        }
    }
    
    continueCombat() {
        // Incrementar ronda de combate
        this.combatState.round++;
        
        // Calcular resultado de la ronda
        this.resolveCombatRound();
        
        // Actualizar UI con los nuevos valores
        this.updateCombatUI();
        
        // Comprobar si el combate ha terminado
        if (this.combatState.attacker.remaining <= 0 || this.combatState.defender.remaining <= 0) {
            this.endCombat();
        }
    }
    
    resolveCombatRound() {
        // Obtener estadísticas
        const attackerStats = this.unitStats[this.combatState.attacker.faction];
        const defenderStats = this.unitStats[this.combatState.defender.faction];
        
        // Calcular daño base
        const attackerDamage = Math.max(1, Math.floor((attackerStats.ataque * this.combatState.attacker.remaining) / defenderStats.defensa));
        const defenderDamage = Math.max(1, Math.floor((defenderStats.ataque * this.combatState.defender.remaining) / attackerStats.defensa));
        
        // Añadir factor aleatorio (±20%)
        const attackerRoll = 0.8 + (Math.random() * 0.4); // Entre 0.8 y 1.2
        const defenderRoll = 0.8 + (Math.random() * 0.4); // Entre 0.8 y 1.2
        
        // Calcular daño final
        const finalAttackerDamage = Math.round(attackerDamage * attackerRoll);
        const finalDefenderDamage = Math.round(defenderDamage * defenderRoll);
        
        // Aplicar daño
        this.combatState.defender.remaining = Math.max(0, this.combatState.defender.remaining - finalAttackerDamage);
        this.combatState.attacker.remaining = Math.max(0, this.combatState.attacker.remaining - finalDefenderDamage);
        
        // Registrar resultado
        const attackerLog = `${this.combatState.attacker.faction} inflige ${finalAttackerDamage} de daño.`;
        const defenderLog = `${this.combatState.defender.faction} inflige ${finalDefenderDamage} de daño.`;
        
        this.combatState.log.push(`--- Ronda ${this.combatState.round} ---`);
        this.combatState.log.push(attackerLog);
        this.combatState.log.push(defenderLog);
        
        // Animar el ataque
        this.animateCombatRound(finalAttackerDamage, finalDefenderDamage);
    }
    
    animateCombatRound(attackerDamage, defenderDamage) {
        // Efecto de ataque del atacante
        this.attackEffect.clear();
        this.attackEffect.fillStyle(0xff0000, 0.8);
        this.attackEffect.fillRect(180, -10, 40, 4);

        this.tweens.add({
            targets: this.attackEffect,
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Power2'
        });

        // Reproducir el efecto de sonido de ataque
        try {
            if (this.cache.audio.exists('attack-sound')) {
                this.sound.play('attack-sound', { volume: 0.4 });
            }
        } catch (e) {
            console.warn('Error playing attack sound:', e);
        }

        // Mostrar daño en defensor
        const damageTextDefender = this.add.text(200, 0, `-${attackerDamage}`, {
            fontSize: '24px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: damageTextDefender,
            y: '-=30',
            alpha: { from: 1, to: 0 },
            duration: 800,
            ease: 'Power2',
            onComplete: () => damageTextDefender.destroy()
        });

        // Efecto de partículas para el ataque
        const alternativeEffect = this.add.graphics();
        alternativeEffect.fillStyle(0xff0000, 0.8);
        alternativeEffect.fillCircle(200, 0, 20);
        
        this.tweens.add({
            targets: alternativeEffect,
            alpha: 0,
            scale: 1.5,
            duration: 500,
            onComplete: () => alternativeEffect.destroy()
        });

        // Animar contraataque después de un breve retraso
        this.time.delayedCall(400, () => {
            this.defenseEffect.clear();
            this.defenseEffect.fillStyle(0xff0000, 0.8);
            this.defenseEffect.fillRect(-220, -10, 40, 4);

            this.tweens.add({
                targets: this.defenseEffect,
                alpha: { from: 1, to: 0 },
                duration: 500,
                ease: 'Power2'
            });

            // Reproducir sonido de ataque para el contraataque
            try {
                if (this.cache.audio.exists('attack-sound')) {
                    this.sound.play('attack-sound', { volume: 0.3, detune: 300 }); // Ligeramente diferente para distinguirlo
                }
            } catch (e) {
                console.warn('Error playing counter-attack sound:', e);
            }

            // Mostrar daño en atacante
            const damageTextAttacker = this.add.text(-200, 0, `-${defenderDamage}`, {
                fontSize: '24px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: damageTextAttacker,
                y: '-=30',
                alpha: { from: 1, to: 0 },
                duration: 800,
                ease: 'Power2',
                onComplete: () => damageTextAttacker.destroy()
            });

            // Efecto de partículas para el contraataque
            const alternativeCounterEffect = this.add.graphics();
            alternativeCounterEffect.fillStyle(0xff0000, 0.8);
            alternativeCounterEffect.fillCircle(-200, 0, 20);
            
            this.tweens.add({
                targets: alternativeCounterEffect,
                alpha: 0,
                scale: 1.5,
                duration: 500,
                onComplete: () => alternativeCounterEffect.destroy()
            });
        });
    }
    
    retreatFromCombat() {
        // Aplicar penalización por retirada (25% de bajas)
        const casualities = Math.ceil(this.combatState.attacker.units * 0.25);
        this.combatState.attacker.territory.units = Math.max(1, this.combatState.attacker.territory.units - casualities);
        
        // Añadir mensaje al registro
        this.combatState.log.push(`¡${this.combatState.attacker.faction} se retira! ${casualities} unidades perdidas.`);
        
        // Finalizar combate
        this.endCombatWithoutConquest();
    }
    
    endCombat() {
        // Determinar el ganador
        let winner, loser;
        
        if (this.combatState.defender.remaining <= 0) {
            winner = this.combatState.attacker;
            loser = this.combatState.defender;
            this.combatState.log.push(`¡${winner.faction} ha conquistado el territorio!`);
            
            // Actualizar el territorio conquistado
            loser.territory.owner = winner.faction;
            loser.territory.units = Math.max(1, Math.floor(winner.remaining));
            winner.territory.units = Math.max(1, winner.units - Math.floor(winner.remaining));
            
            // Actualizar visualización
            this.updateTerritoryVisuals(winner.territory);
            this.updateTerritoryVisuals(loser.territory);

            // Añadir experiencia al jugador si es el ganador
            if (winner.faction === this.gameState.playerFaction) {
                this.gameState.experience += 100; // Ganar experiencia
                this.checkLevelUp(); // Comprobar si sube de nivel
            }
        } else {
            winner = this.combatState.defender;
            loser = this.combatState.attacker;
            this.combatState.log.push(`¡${winner.faction} ha defendido el territorio!`);
            
            // Actualizar unidades en ambos territorios
            winner.territory.units = Math.max(1, Math.floor(winner.remaining));
            loser.territory.units = Math.max(1, Math.floor(loser.remaining));
            
            // Actualizar visualización
            this.updateTerritoryVisuals(winner.territory);
            this.updateTerritoryVisuals(loser.territory);
        }
        
        // Actualizar UI una última vez
        this.updateCombatUI();
        
        // Animar victoria
        this.animateVictory(winner, loser);
        
        // Cerrar el panel después de un breve retraso
        this.time.delayedCall(3000, () => {
            this.closeCombatPanel();
        });
    }
    
    endCombatWithoutConquest() {
        // Actualizar unidades en el territorio del atacante
        this.updateTerritoryVisuals(this.combatState.attacker.territory);
        
        // Actualizar UI una última vez
        this.updateCombatUI();
        
        // Cerrar el panel después de un breve retraso
        this.time.delayedCall(2000, () => {
            this.closeCombatPanel();
        });
    }
    
    animateVictory(winner, loser) {
        // Determinar qué sección es el ganador
        const winnerSection = winner === this.combatState.attacker ? this.attackerSection : this.defenderSection;
        const loserSection = loser === this.combatState.attacker ? this.attackerSection : this.defenderSection;
        
        // Animar sección ganadora
        this.tweens.add({
            targets: winnerSection,
            scale: { from: 1, to: 1.1 },
            yoyo: true,
            repeat: 2,
            duration: 300,
            ease: 'Sine.easeInOut'
        });
        
        // Animar sección perdedora
        this.tweens.add({
            targets: loserSection,
            alpha: 0.5,
            duration: 300
        });
        
        // Texto de victoria
        const victoryText = this.add.text(0, -120, '¡VICTORIA!', {
            fontSize: '32px',
            fill: '#ffd700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        victoryText.setAlpha(0);
        
        // Añadir texto al panel
        this.combatPanel.add(victoryText);
        
        // Animar texto
        this.tweens.add({
            targets: victoryText,
            alpha: 1,
            scale: { from: 2, to: 1 },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
    
    closeCombatPanel() {
        // Animación de salida
        this.tweens.add({
            targets: this.combatPanel,
            scale: { from: 1, to: 0.5 },
            alpha: 0,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => {
                // Ocultar panel
                this.combatPanel.setVisible(false);
                
                // Desmarcar combate en curso y territorio seleccionado
                this.gameState.combatInProgress = false;
                this.selectedTerritory = null;
            }
        });
    }

    createBuildTowerButton() {
        // Botón para construir torres
        const buildTowerButton = this.add.rectangle(400, 500, 160, 40, 0x3498db, 0.8)
            .setInteractive()
            .on('pointerover', () => buildTowerButton.fillColor = 0x2980b9)
            .on('pointerout', () => buildTowerButton.fillColor = 0x3498db)
            .on('pointerdown', () => this.performAction(() => this.buildTower()));

        this.add.text(400, 500, 'Construir Torre', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    buildTower() {
        if (this.selectedTerritory && this.selectedTerritory.owner === this.gameState.playerFaction) {
            // Construir torre en el territorio seleccionado
            this.selectedTerritory.building = 'Torre';
            this.selectedTerritory.bg.setFillStyle(0x8e44ad); // Cambiar color para indicar torre
            this.victoryPoints += 10; // Añadir puntos de victoria
            this.updateVictoryPointsDisplay();
            this.showMessage('Torre construida. +10 puntos de victoria');

            // Añadir ícono de torre
            if (!this.selectedTerritory.towerIcon) {
                this.selectedTerritory.towerIcon = this.add.rectangle(
                    0, -20, // Coordenadas relativas al grupo
                    20, 20,
                    0xffff00
                ).setOrigin(0.5);
                this.selectedTerritory.group.add(this.selectedTerritory.towerIcon);
            }

            // Añadir animación de construcción
            this.animateTowerConstruction(this.selectedTerritory);
        } else {
            this.showMessage('Selecciona un territorio propio para construir una torre');
        }
    }

    animateTowerConstruction(territory) {
        // Crear un efecto visual de construcción
        const constructionEffect = this.add.graphics();
        constructionEffect.fillStyle(0xffff00, 0.5);
        constructionEffect.fillRect(
            territory.screenX - this.tileSize / 4,
            territory.screenY - this.tileSize / 4,
            this.tileSize / 2,
            this.tileSize / 2
        );

        // Animar el efecto
        this.tweens.add({
            targets: constructionEffect,
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 1.5 },
            duration: 1000,
            onComplete: () => constructionEffect.destroy()
        });
    }

    updateVictoryPointsDisplay() {
        // Mostrar puntos de victoria en la UI
        if (!this.victoryPointsText) {
            this.victoryPointsText = this.add.text(400, 80, '', {
                fontSize: '18px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
        }
        this.victoryPointsText.setText(`Puntos de Victoria: ${this.victoryPoints}`);
    }

    // Crear un método para realizar una acción
    performAction(action) {
        if (this.gameState.actionsRemaining > 0) {
            // Realizar la acción
            action();
            
            // Reducir el contador de acciones
            this.gameState.actionsRemaining--;
            
            // Mostrar mensaje de acciones restantes
            this.showMessage(`Acciones restantes: ${this.gameState.actionsRemaining}`);
        } else {
            this.showMessage('No quedan acciones disponibles este turno.');
        }
    }

    checkLevelUp() {
        // Comprobar si el jugador sube de nivel
        const levelThresholds = [100, 300, 600, 1000]; // Umbrales de experiencia para subir de nivel
        const currentLevel = this.gameState.level;

        if (this.gameState.experience >= levelThresholds[currentLevel - 1]) {
            this.gameState.level++;
            this.showMessage(`¡Has subido al nivel ${this.gameState.level}!`);
            this.unlockNewUnitsOrUpgrades();
        }
    }

    unlockNewUnitsOrUpgrades() {
        // Lógica para desbloquear nuevas unidades o mejoras
        this.showMessage('Nuevas mejoras disponibles.');
        // Aquí se podría abrir la pantalla de selección de mejoras
    }
}

// Definición de mejoras para cada facción
const techTrees = {
    'Humanos': [
        { name: 'Economía Avanzada', cost: 100, effect: 'Aumenta la producción de oro en un 20%' },
        { name: 'Caballería Pesada', cost: 150, effect: 'Mejora la defensa de las unidades de caballería' },
        { name: 'Diplomacia', cost: 120, effect: 'Mejora las relaciones con otras facciones' }
    ],
    'Elfos': [
        { name: 'Magia de la Naturaleza', cost: 100, effect: 'Aumenta la producción de maná en un 20%' },
        { name: 'Arquitectura Arbórea', cost: 150, effect: 'Mejora la defensa de las estructuras en bosques' },
        { name: 'Arquería Avanzada', cost: 120, effect: 'Aumenta el daño de las unidades de arquería' }
    ],
    'Enanos': [
        { name: 'Metalurgia Avanzada', cost: 100, effect: 'Aumenta la producción de mineral en un 20%' },
        { name: 'Fortaleza', cost: 150, effect: 'Mejora la defensa de las estructuras' },
        { name: 'Forja', cost: 120, effect: 'Mejora la calidad de las armas y armaduras' }
    ],
    'Orcos': [
        { name: 'Saqueo', cost: 100, effect: 'Aumenta los recursos obtenidos al derrotar enemigos' },
        { name: 'Bestias de Guerra', cost: 150, effect: 'Mejora la fuerza de las unidades de combate' },
        { name: 'Horda', cost: 120, effect: 'Reduce el costo de las unidades' }
    ]
};

// Función para iniciar una investigación
function startResearch(faction, techName) {
    const tech = techTrees[faction].find(t => t.name === techName);
    if (tech && game.globals.resources[faction].Maná >= tech.cost) {
        game.globals.resources[faction].Maná -= tech.cost;
        console.log(`Investigación iniciada: ${techName}`);
        // Aquí se podría añadir lógica para el progreso de la investigación
    } else {
        console.log('No hay suficientes recursos para iniciar esta investigación.');
    }
}

// Ejemplo de uso
// startResearch('Humanos', 'Economía Avanzada');

// Interfaz de usuario para el árbol tecnológico
class TechTreeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TechTreeScene' });
    }

    create() {
        this.add.text(400, 50, 'Árbol Tecnológico', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        const faction = game.globals.playerFaction || 'Humanos'; // Valor predeterminado
        const techs = techTrees[faction];

        if (techs) {
            techs.forEach((tech, index) => {
                this.add.text(400, 150 + index * 50, `${tech.name} - Costo: ${tech.cost} - ${tech.effect}`, {
                    fontSize: '16px',
                    fill: '#ffffff'
                }).setOrigin(0.5);
            });

            // Iniciar una investigación como ejemplo
            startResearch(faction, techs[0].name);
        } else {
            this.add.text(400, 300, 'No se encontraron mejoras para esta facción.', {
                fontSize: '16px',
                fill: '#ff0000'
            }).setOrigin(0.5);
        }

        // Botón para volver al juego
        const backButton = this.add.rectangle(400, 550, 160, 40, 0xe74c3c, 0.8)
            .setInteractive()
            .on('pointerover', () => backButton.fillColor = 0xf75c4c)
            .on('pointerout', () => backButton.fillColor = 0xe74c3c)
            .on('pointerdown', () => this.scene.start('GameScene'));

        this.add.text(400, 550, 'Volver al Juego', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
}

// Escena de selección de mejoras
class UpgradeSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeSelectionScene' });
    }

    create() {
        this.add.text(400, 50, 'Selecciona una Mejora', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

        // Ejemplo de mejoras disponibles
        const upgrades = [
            { name: 'Aumento de Daño', description: 'Incrementa el daño de las unidades en un 10%' },
            { name: 'Aumento de Resistencia', description: 'Incrementa la resistencia de las unidades en un 10%' },
            { name: 'Nueva Unidad: Catapulta', description: 'Desbloquea la unidad Catapulta' }
        ];

        upgrades.forEach((upgrade, index) => {
            const yPosition = 150 + index * 100;
            const upgradeButton = this.add.rectangle(400, yPosition, 300, 60, 0x3498db, 0.8)
                .setInteractive()
                .on('pointerover', () => upgradeButton.fillColor = 0x2980b9)
                .on('pointerout', () => upgradeButton.fillColor = 0x3498db)
                .on('pointerdown', () => this.selectUpgrade(upgrade));

            this.add.text(400, yPosition, `${upgrade.name} - ${upgrade.description}`, {
                fontSize: '16px',
                fill: '#ffffff'
            }).setOrigin(0.5);
        });

        // Botón para volver al juego
        const backButton = this.add.rectangle(400, 550, 160, 40, 0xe74c3c, 0.8)
            .setInteractive()
            .on('pointerover', () => backButton.fillColor = 0xf75c4c)
            .on('pointerout', () => backButton.fillColor = 0xe74c3c)
            .on('pointerdown', () => this.scene.start('GameScene'));

        this.add.text(400, 550, 'Volver al Juego', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    selectUpgrade(upgrade) {
        // Lógica para aplicar la mejora seleccionada
        console.log(`Mejora seleccionada: ${upgrade.name}`);
        this.scene.start('GameScene');
    }
}

// Configuración básica de Phaser - Actualizamos para incluir la nueva escena
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [BootScene, PreloadScene, MenuScene, FactionSelectScene, GameScene, TechTreeScene, UpgradeSelectionScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);

// Variables globales del juego - Añadimos playerFaction
game.globals = {
    factions: ['Humanos', 'Elfos', 'Enanos', 'Orcos'],
    resources: {
        'Humanos': { 'Comida': 50, 'Mineral': 50, 'Maná': 50 },
        'Elfos': { 'Comida': 50, 'Mineral': 40, 'Maná': 70 },
        'Enanos': { 'Comida': 40, 'Mineral': 80, 'Maná': 30 },
        'Orcos': { 'Comida': 70, 'Mineral': 60, 'Maná': 20 }
    },
    gameState: {
        currentFaction: 0,
        turn: 1,
        territories: {}
    },
    playerFaction: null  // Aquí guardaremos la facción seleccionada
}; 