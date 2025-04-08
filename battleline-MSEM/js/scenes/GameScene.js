class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Initialize properties
        this.lanes = [];
        this.playerUnits = [];
        this.enemyUnits = [];
        this.unitButtons = {};
        this.cooldowns = {};
        this.gold = 0;
        this.enemyGold = 0;
        this.lastEnemySpawnTime = 0;
    }

    create() {
        console.log('GameScene created - Starting game with race:', this.game.globals.playerRace);
        
        // Set up scene resources
        this.setupResources();
        
        // Create battlefield
        this.createBattlefield();
        
        // Create UI
        this.createUI();
        
        // Set up gameplay systems
        this.setupGameSystems();
        
        // Start the battle
        this.startBattle();
        
        // Play background music
        // Comentado para evitar errores de audio
        /*
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
        this.bgMusic = this.sound.add('battle-music', { loop: true, volume: 0.5 });
        this.bgMusic.play();
        */
    }
    
    setupResources() {
        // Load unit and upgrade data
        this.unitData = this.cache.json.get('unit-data');
        this.upgradeData = this.cache.json.get('upgrade-data');
        
        // Set up player and enemy races
        this.playerRace = this.game.globals.playerRace;
        this.enemyRace = this.game.globals.enemyRace;
        
        // Track units
        this.playerUnits = this.add.group();
        this.enemyUnits = this.add.group();
        
        // Define lanes
        this.laneCount = gameConfig.gameSettings.laneCount;
        this.laneHeight = gameConfig.gameSettings.laneHeight;
        
        // Setup game variables
        this.gold = this.game.globals.playerGold;
        this.enemyGold = this.game.globals.enemyGold;
        this.unitCooldowns = {};
        this.upgradesPurchased = {};
        
        // Setup enemy AI
        this.enemySpawnTimer = 0;
        this.enemyDecisionTime = 3000; // ms
    }

    update(time, delta) {
        // Skip update if game is over
        if (this.game.globals.gameOver) return;
        
        // Update all player units
        this.playerUnits.getChildren().forEach(unit => {
            if (unit.active) unit.update(delta);
        });
        
        // Update all enemy units
        this.enemyUnits.getChildren().forEach(unit => {
            if (unit.active) unit.update(delta);
        });
        
        // Update cooldowns
        this.updateCooldowns(delta);
        
        // Update enemy AI
        this.updateEnemyAI(time, delta);
        
        // Check victory conditions
        this.checkVictoryConditions();
    }

    setupGameSystems() {
        // Inicializar sistemas del juego
        this.setupPhysics();
        this.setupEnemyAI();
        this.setupGoldGeneration();
    }
    
    setupPhysics() {
        console.log("Configurando físicas del juego");
        
        // Modificar la configuración de colisión para que las unidades puedan moverse
        // pero aún así detectar cuando están cerca unas de otras
        
        // En lugar de usar collider (que detiene las unidades), usar overlap
        // que permite que sigan moviéndose
        this.physics.add.overlap(this.playerUnits, this.enemyUnits, (playerUnit, enemyUnit) => {
            // Si las unidades están lo suficientemente cerca, comenzar a atacar
            const distance = Phaser.Math.Distance.Between(playerUnit.x, playerUnit.y, enemyUnit.x, enemyUnit.y);
            
            if (distance < 50) {
                // Solo cambiar el estado si las unidades están caminando
                if (playerUnit.state === 'walking') {
                    console.log(`Unidad jugador encontró objetivo: ${enemyUnit.race}-${enemyUnit.type}`);
                    playerUnit.setTarget(enemyUnit);
                }
                
                if (enemyUnit.state === 'walking') {
                    console.log(`Unidad enemiga encontró objetivo: ${playerUnit.race}-${playerUnit.type}`);
                    enemyUnit.setTarget(playerUnit);
                }
            }
        });
        
        // Configurar para que las unidades del mismo equipo no colisionen entre sí
        // Esto se hace automáticamente en grupos de físicas separados
        
        console.log("Físicas configuradas");
    }
    
    setupEnemyAI() {
        // Configurar la IA del enemigo
        this.enemyDecisionTime = 3000; // ms
        this.enemySpawnTimer = 0;
        
        // Definir estrategias de IA
        this.enemyStrategy = {
            // Probabilidad de spawning para cada tipo de unidad
            spawnProbabilities: {
                'brute': 0.3,
                'thrower': 0.3,
                'shaman': 0.2,
                'beast': 0.2
            },
            
            // Mínimo de oro a mantener como reserva
            goldReserve: 50
        };
    }
    
    setupGoldGeneration() {
        // Configurar la generación de oro para el jugador y el enemigo
        this.goldGenerationTimer = this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: () => {
                // Añadir oro al jugador
                this.addGold(5);
                
                // Añadir oro al enemigo
                this.addEnemyGold(5);
            },
            callbackScope: this,
            loop: true
        });
    }

    initializeGameSystems() {
        // Initialize lane management
        this.game.laneManager = new LaneManager(this);
        
        // Initialize combat system 
        this.game.combatSystem = new CombatSystem(this);
        
        // Initialize economy system
        this.game.economySystem = new EconomySystem(this);
    }

    createBackground() {
        // Add background image 
        this.add.image(400, 300, 'background');
        
        // Add top banner for score/progress
        const topBanner = this.add.rectangle(400, 30, 800, 60, 0x000000, 0.7);
        
        // Add bottom banner for unit selection
        const bottomBanner = this.add.rectangle(400, 570, 800, 60, 0x000000, 0.7);
    }

    createBattlefield() {
        // Agregar el fondo del campo de batalla
        this.add.image(400, 300, 'background').setDisplaySize(800, 600);
        
        // Crear las líneas de las lanes
        this.createLanes();
        
        // Crear bases del jugador y enemigo
        this.createBases();
    }
    
    createLanes() {
        // Definir el número de lanes para el campo de batalla
        this.laneCount = 3;
        this.laneHeight = 100;
        
        // Crear líneas visuales para las lanes
        for (let i = 0; i < this.laneCount; i++) {
            const y = this.getLaneY(i);
            
            // Línea punteada para cada lane
            for (let x = 100; x < 700; x += 30) {
                this.add.rectangle(x, y, 10, 3, 0xffffff, 0.3);
            }
            
            // Número de lane
            this.add.text(30, y, `${i+1}`, {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
    }
    
    createBases() {
        // Base del jugador (izquierda)
        const playerBase = this.add.rectangle(50, 300, 80, 400, 0x0000ff, 0.3);
        
        // Base del enemigo (derecha)
        const enemyBase = this.add.rectangle(750, 300, 80, 400, 0xff0000, 0.3);
        
        // Añadir íconos de las razas en las bases si existen
        if (this.playerRace) {
            try {
                const playerRaceIcon = this.add.image(50, 100, `${this.playerRace.slice(0, -1)}-icon`);
                playerRaceIcon.setScale(1.5);
            } catch (e) {
                console.warn("No se pudo cargar el icono de la raza del jugador", e);
            }
        }
        
        if (this.enemyRace) {
            try {
                const enemyRaceIcon = this.add.image(750, 100, `${this.enemyRace.slice(0, -1)}-icon`);
                enemyRaceIcon.setScale(1.5);
            } catch (e) {
                console.warn("No se pudo cargar el icono de la raza enemiga", e);
            }
        }
    }
    
    getLaneY(laneIndex) {
        // Calcular la posición Y basada en el índice del carril
        const laneHeight = 80;
        const topMargin = 180;
        return topMargin + (laneIndex * laneHeight);
    }

    createUI() {
        // Crear elementos de UI básicos
        this.createGoldUI();
        this.createUnitButtons();
        this.createSpecialButtons();
    }
    
    createGoldUI() {
        // Mostrar icono de oro y contador
        const goldIcon = this.add.image(30, 30, 'gold-icon').setScale(0.5);
        
        // Texto del oro
        this.goldText = this.add.text(55, 30, `Gold: ${this.gold}`, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);
    }
    
    createUnitButtons() {
        // Botones para spawnear unidades según la raza
        this.unitButtons = {};
        
        // Definir los tipos de unidades según la raza
        let unitTypes = [];
        switch (this.playerRace) {
            case 'humans':
                unitTypes = ['swordsman', 'archer', 'knight', 'cleric'];
                break;
            case 'elves':
                unitTypes = ['spearman', 'archer', 'sentinel', 'druid'];
                break;
            case 'orcs':
                unitTypes = ['brute', 'thrower', 'beast', 'shaman'];
                break;
        }
        
        // Crear botones para cada tipo
        const startX = 150;
        const startY = 30;
        const spacing = 120;
        
        unitTypes.forEach((type, index) => {
            // Crear botón
            const button = this.add.image(startX + (index * spacing), startY, 'button')
                .setDisplaySize(100, 40)
                .setInteractive();
            
            // Costos
            const cost = this.getUnitCost(this.playerRace, type);
            
            // Texto del botón
            const buttonText = this.add.text(startX + (index * spacing), startY, 
                `${this.capitalize(type)}\n${cost} gold`, {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    color: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);
            
            // Cooldown overlay
            const cooldownOverlay = this.add.rectangle(
                startX + (index * spacing), 
                startY, 
                100, 
                40, 
                0x000000, 
                0.7
            ).setVisible(false);
            
            // Guardar referencias
            this.unitButtons[type] = {
                button,
                text: buttonText,
                cooldown: cooldownOverlay,
                unit: type,
                cost: cost
            };
            
            // Eventos del botón
            button.on('pointerover', () => {
                button.setTint(0xaaaaaa);
            });
            
            button.on('pointerout', () => {
                button.clearTint();
            });
            
            button.on('pointerdown', () => {
                // Verificar si hay suficiente oro
                if (this.gold >= cost) {
                    // Iniciar selección de lane
                    this.showLaneSelection(type, this.playerRace);
                } else {
                    console.log(`Not enough gold for ${type}`);
                }
            });
        });
    }
    
    createSpecialButtons() {
        // Botón para ataque masivo
        const massAttackButton = this.add.image(700, 30, 'button')
            .setDisplaySize(120, 40)
            .setInteractive();
        
        this.add.text(700, 30, 'Mass Attack\n100 gold', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        massAttackButton.on('pointerover', () => {
            massAttackButton.setTint(0xaaaaaa);
        });
        
        massAttackButton.on('pointerout', () => {
            massAttackButton.clearTint();
        });
        
        massAttackButton.on('pointerdown', () => {
            this.triggerMassAttack();
        });
    }
    
    updateCooldowns(delta) {
        // Actualizar cooldowns de los botones de unidades
        Object.keys(this.unitCooldowns).forEach(key => {
            if (this.unitCooldowns[key] > 0) {
                this.unitCooldowns[key] -= delta;
                
                // Actualizar visualización del cooldown
                const unitType = key.split('-')[1];
                if (this.unitButtons[unitType]) {
                    this.unitButtons[unitType].cooldown.setVisible(true);
                }
                
                // Quitar cooldown si se completa
                if (this.unitCooldowns[key] <= 0) {
                    this.unitCooldowns[key] = 0;
                    
                    // Actualizar visualización
                    if (this.unitButtons[unitType]) {
                        this.unitButtons[unitType].cooldown.setVisible(false);
                    }
                }
            }
        });
    }
    
    showLaneSelection(type, race) {
        // Crear overlays para seleccionar lanes
        const laneSelectors = [];
        const laneOverlays = [];
        
        for (let i = 0; i < this.laneCount; i++) {
            const y = this.getLaneY(i);
            
            // Crear overlay para la lane
            const laneOverlay = this.add.rectangle(400, y, 800, this.laneHeight, 0xffff00, 0.3)
                .setInteractive()
                .on('pointerdown', () => {
                    // Spawear la unidad en esta lane
                    this.spawnUnit(type, true, i);
                    
                    // Eliminar todos los overlays
                    laneOverlays.forEach(overlay => overlay.destroy());
                    laneSelectors.forEach(selector => selector.destroy());
                });
            
            // Texto indicador
            const laneText = this.add.text(400, y, 'Click to deploy', {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);
            
            laneOverlays.push(laneOverlay);
            laneSelectors.push(laneText);
        }
        
        // Botón para cancelar selección
        const cancelButton = this.add.image(400, 550, 'button')
            .setDisplaySize(200, 40)
            .setInteractive()
            .on('pointerdown', () => {
                // Eliminar todos los overlays
                laneOverlays.forEach(overlay => overlay.destroy());
                laneSelectors.forEach(selector => selector.destroy());
                cancelButton.destroy();
                cancelText.destroy();
            });
        
        const cancelText = this.add.text(400, 550, 'Cancel', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        laneSelectors.push(cancelButton, cancelText);
    }
    
    spawnEnemyUnit(type, laneIndex) {
        // Verificar el costo de la unidad
        const cost = this.getUnitCost(this.enemyRace, type);
        
        // Verificar si el enemigo tiene suficiente oro
        if (this.enemyGold < cost) {
            console.log(`Enemy doesn't have enough gold for ${type}`);
            return null;
        }
        
        // Restar el costo del oro enemigo
        this.enemyGold -= cost;
        
        // Determinar posición de spawn
        const x = 700; // Derecha de la pantalla para el enemigo
        const y = this.getLaneY(laneIndex);
        
        // Crear la unidad según la raza
        let unit = null;
        
        const raceClass = this.getRaceClass(this.enemyRace);
        if (raceClass) {
            unit = new raceClass(this, x, y, type, false, laneIndex);
            
            // Agregar a la física y al grupo de unidades enemigas
            this.enemyUnits.add(unit);
            
            // Reproducir sonido de spawn si está disponible
            if (this.sound && this.sound.get('spawn')) {
                this.sound.play('spawn');
            }
            
            console.log(`Enemy spawned ${type} in lane ${laneIndex}`);
        } else {
            console.error(`Race class not found for ${this.enemyRace}`);
        }
        
        return unit;
    }
    
    spawnUnit(type, isPlayer, laneIndex) {
        // Verificar el costo de la unidad
        const race = isPlayer ? this.playerRace : this.enemyRace;
        const cost = this.getUnitCost(race, type);
        
        // Verificar si el jugador tiene suficiente oro
        if (isPlayer && this.gold < cost) {
            console.log(`Not enough gold for ${type}`);
            return null;
        }
        
        // Restar el costo del oro del jugador si es una unidad del jugador
        if (isPlayer) {
            this.gold -= cost;
            this.goldText.setText(`Gold: ${this.gold}`);
        }
        
        // Determinar posición de spawn
        const x = isPlayer ? 100 : 700; // Izquierda para jugador, derecha para enemigo
        const y = this.getLaneY(laneIndex);
        
        // Crear la unidad según la raza
        let unit = null;
        
        const raceClass = this.getRaceClass(race);
        if (raceClass) {
            unit = new raceClass(this, x, y, type, isPlayer, laneIndex);
            
            // Agregar a la física y al grupo correspondiente
            if (isPlayer) {
                this.playerUnits.add(unit);
                
                // Iniciar cooldown para esta unidad
                const cooldownKey = `${race}-${type}`;
                this.unitCooldowns[cooldownKey] = 3000; // 3 segundos de cooldown
                
            } else {
                this.enemyUnits.add(unit);
            }
            
            // Reproducir sonido de spawn si está disponible
            if (this.sound && this.sound.get('spawn')) {
                this.sound.play('spawn');
            }
            
            console.log(`${isPlayer ? 'Player' : 'Enemy'} spawned ${type} in lane ${laneIndex}`);
        } else {
            console.error(`Race class not found for ${race}`);
        }
        
        return unit;
    }
    
    setupResources() {
        // Inicializar variables de juego
        this.playerRace = this.game.globals.playerRace || 'humans';
        this.enemyRace = this.game.globals.enemyRace || 'orcs';
        
        // Configurar oro inicial
        this.gold = 100;
        this.enemyGold = 100;
        
        // Crear grupos de físicas para las unidades
        this.playerUnits = this.physics.add.group();
        this.enemyUnits = this.physics.add.group();
        
        // Inicializar cooldowns para las unidades
        this.unitCooldowns = {};
        
        // Inicializar timers del juego
        this.lastGoldUpdateTime = 0;
        this.goldUpdateInterval = 1000; // 1 segundo
        this.goldPerUpdate = 5;
    }
    
    checkVictoryConditions() {
        // Comprobar si alguna unidad del jugador ha llegado a la base enemiga
        this.playerUnits.getChildren().forEach(unit => {
            if (unit.active && unit.x >= 730) {
                this.playerWins();
            }
        });
        
        // Comprobar si alguna unidad enemiga ha llegado a la base del jugador
        this.enemyUnits.getChildren().forEach(unit => {
            if (unit.active && unit.x <= 70) {
                this.enemyWins();
            }
        });
    }
    
    playerWins() {
        if (!this.game.globals.gameOver) {
            console.log("¡Victoria! Has derrotado al enemigo.");
            this.game.globals.gameOver = true;
            
            // Mostrar mensaje de victoria
            this.showGameOverMessage(true);
            
            // Reproducir sonido de victoria si está disponible
            if (this.sound && this.sound.get('victory')) {
                this.sound.play('victory');
            }
        }
    }
    
    enemyWins() {
        if (!this.game.globals.gameOver) {
            console.log("¡Derrota! El enemigo ha invadido tu base.");
            this.game.globals.gameOver = true;
            
            // Mostrar mensaje de derrota
            this.showGameOverMessage(false);
            
            // Reproducir sonido de derrota si está disponible
            if (this.sound && this.sound.get('defeat')) {
                this.sound.play('defeat');
            }
        }
    }
    
    showGameOverMessage(isVictory) {
        // Crear fondo semi-transparente
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        // Mensaje principal
        const message = isVictory ? '¡VICTORIA!' : '¡DERROTA!';
        const messageColor = isVictory ? '#00ff00' : '#ff0000';
        
        const messageText = this.add.text(400, 250, message, {
            fontFamily: 'Arial',
            fontSize: '48px',
            fontWeight: 'bold',
            color: messageColor,
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Botón para volver al menú
        const menuButton = this.add.rectangle(400, 350, 200, 50, 0x333333, 1)
            .setInteractive();
        
        const menuText = this.add.text(400, 350, 'Volver al Menú', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Eventos del botón
        menuButton.on('pointerover', () => {
            menuButton.setFillStyle(0x555555);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setFillStyle(0x333333);
        });
        
        menuButton.on('pointerdown', () => {
            // Detener sonidos si existen
            if (this.sound) {
                this.sound.stopAll();
            }
            
            // Volver al menú
            this.scene.start('MenuScene');
        });
    }
    
    addGold(amount) {
        this.gold += amount;
        // Actualizar texto del oro
        this.goldText.setText(`Gold: ${this.gold}`);
    }
    
    getUnitCost(race, type) {
        // Costo base para todas las unidades
        const baseCost = {
            'swordsman': 25,
            'spearman': 25,
            'brute': 25,
            'archer': 35,
            'thrower': 35,
            'knight': 60,
            'sentinel': 60,
            'beast': 60,
            'cleric': 50,
            'druid': 50,
            'shaman': 50
        };
        
        return baseCost[type] || 30; // 30 es el costo por defecto si no se encuentra el tipo
    }
    
    capitalize(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    startBattle() {
        console.log("Iniciando batalla...");
        
        // Iniciar el temporizador de actualización para la IA del enemigo
        this.enemyAITimer = this.time.addEvent({
            delay: 2000, // 2 segundos
            callback: this.updateEnemyAI,
            callbackScope: this,
            loop: true
        });
        
        // Configurar el verificador de condiciones de victoria
        this.victoryCheckTimer = this.time.addEvent({
            delay: 500, // 0.5 segundos
            callback: this.checkVictoryConditions,
            callbackScope: this,
            loop: true
        });
    }
    
    updateEnemyAI() {
        // Si el juego ha terminado, no hacer nada
        if (this.game.globals && this.game.globals.gameOver) return;
        
        // Intentar spawnear una unidad enemiga aleatoriamente
        if (Math.random() < 0.5) { // 50% de probabilidad
            this.trySpawnEnemyUnit();
        }
    }
    
    trySpawnEnemyUnit() {
        // Elegir un tipo de unidad básico si estamos en modo de depuración o no hay enemyStrategy
        if (!this.enemyStrategy) {
            console.log("enemyStrategy no está definida, usando valores por defecto");
            // Spawner un brute en una lane aleatoria
            const laneIndex = Math.floor(Math.random() * (this.laneCount || 3));
            if (this.enemyGold >= 25) {
                this.spawnEnemyUnit('brute', laneIndex);
                console.log("Enemigo spawnea brute en lane", laneIndex);
            }
            return;
        }
        
        // Código normal para spawnear basado en probabilidades
        const unitTypes = Object.keys(this.enemyStrategy.spawnProbabilities);
        let selectedType = null;
        
        // Filtrar unidades que podemos pagar
        const affordableUnits = unitTypes.filter(type => {
            const cost = this.getUnitCost(this.enemyRace, type);
            return cost <= this.enemyGold;
        });
        
        if (affordableUnits.length === 0) {
            // No podemos permitirnos ninguna unidad
            return;
        }
        
        // Si tenemos suficiente oro, elegir una unidad aleatoria
        if (this.enemyGold > (this.enemyStrategy.goldReserve || 50)) {
            // Elegir una unidad basada en probabilidades
            const rand = Math.random();
            let cumulativeProbability = 0;
            
            for (const type of affordableUnits) {
                cumulativeProbability += this.enemyStrategy.spawnProbabilities[type];
                if (rand <= cumulativeProbability) {
                    selectedType = type;
                    break;
                }
            }
            
            // Si no se eligió ninguna unidad, elegir una aleatoria
            if (!selectedType) {
                selectedType = affordableUnits[Math.floor(Math.random() * affordableUnits.length)];
            }
            
            // Elegir una lane aleatoria
            const laneIndex = Math.floor(Math.random() * (this.laneCount || 3));
            
            // Spawnear la unidad
            this.spawnEnemyUnit(selectedType, laneIndex);
        }
    }
    
    addEnemyGold(amount) {
        this.enemyGold += amount;
        console.log(`Enemigo ahora tiene ${this.enemyGold} de oro`);
    }
    
    getRaceClass(race) {
        // Devuelve la clase apropiada según la raza
        if (!race) return null;
        
        try {
            switch (race) {
                case 'humans':
                    return Human || window.Human;
                case 'elves':
                    return Elf || window.Elf;
                case 'orcs':
                    return Orc || window.Orc;
                default:
                    console.error(`Race not found: ${race}`);
                    return null;
            }
        } catch (e) {
            console.error("Error al obtener la clase de raza:", e);
            // Si hay un error, intentamos usar el objeto global si está disponible
            if (race === 'humans' && window.Human) return window.Human;
            if (race === 'elves' && window.Elf) return window.Elf;
            if (race === 'orcs' && window.Orc) return window.Orc;
            return null;
        }
    }
}
