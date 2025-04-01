// ===== CONFIGURACIÓN DEL JUEGO =====
// Variables globales
const game = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    isPlayerTurn: true,
    selectedDirection: null,
    power: 5,
    isShooting: false,
    soundEnabled: true,
    goalkeeper: {
        position: 4 // Posición central por defecto
    },
    shooter: {
        position: 4, // Posición central por defecto
        power: 5 // Potencia media por defecto
    },
    powerInterval: null,
    powerDirection: 1, // 1 = aumentando, -1 = disminuyendo
    lastKeyPressed: null
};

// Direcciones y posiciones
// 0 1 2
// 3 4 5
// 6 7 8
const positionMap = [
    { x: '20%', y: '20%' }, // 0: Arriba-izquierda
    { x: '50%', y: '20%' }, // 1: Arriba-centro
    { x: '80%', y: '20%' }, // 2: Arriba-derecha
    { x: '20%', y: '50%' }, // 3: Centro-izquierda
    { x: '50%', y: '50%' }, // 4: Centro-centro
    { x: '80%', y: '50%' }, // 5: Centro-derecha
    { x: '20%', y: '80%' }, // 6: Abajo-izquierda
    { x: '50%', y: '80%' }, // 7: Abajo-centro
    { x: '80%', y: '80%' }  // 8: Abajo-derecha
];

// Función para crear un sonido usando data URI
function createAudioWithFallback(dataUri) {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.src = dataUri;
    return audio;
}

// Efectos de sonido directamente como data URIs (no requieren archivos externos)
const sounds = {
    // Sonido de disparo (kick) - Tono breve
    shoot: createAudioWithFallback('data:audio/wav;base64,UklGRl4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToBAACAgICAgICAgICAgICAgICAgID/////////////////////gICAgP///4CAgICAgP///4CAgICAgP///4CAgICAgP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAEAAgACAAQACAAQAEABAACAAIAAgAEAAQACACAgICAgICAgICAgICAgICAgICAgICAgA=='),
    
    // Sonido de gol (celebración) - Tono ascendente
    goal: createAudioWithFallback('data:audio/wav;base64,UklGRpIBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YW4BAACBgYKChIWHiImKi4uMjIyMi4qJiIaEg4B+fHp4dnVzcXBvbm1tbW5vcHFydHV3eXp8foGChIWHiYqMjY+QkZKTk5STkpGPjo2LiomHhYOBf316eHZ0cnFvbWtqaWlpamttb3Fzc3Z4eXx+gIKEhYeJiouNjo+QkJCQkI+OjYyKiYeGhIOAfn17eXd2dHJxb25tbW1tb3BxbXBua21vcHN0dnl7fX+BgoSFiIqLjY6QkZKTlJSUk5KRj46MiomHhYOBf317eXd1c3Fvbmxramppamttb3Fyc3V3eXt9f4GDhYaIiouNjpCRkZKTk5KRkI+OjIuJiIeEg4F/fXt5d3Z0cnBvbWxramppamttbm5wdnt9fX1+gYOHiImKjY6QkZKTlJSUk5KRkI6Mi4qIhoSCgH58enh2dHJxb25sa2ppaWlqa2ttb3FydHZ4eXx+gIKEhYeJiouNjo+QkJCQkI+OjYwrVMncAAAA'),
    
    // Sonido de atajada o poste - Tono descendente
    save: createAudioWithFallback('data:audio/wav;base64,UklGRpIBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YW4BAABra21uYGFiZGZobG9xcnN0dXV1dXRzcXBua2pmZGJgXlxbWllZWVlbW11eYGJkZmhqbG9wcnR1dnj0JPR2dXRzcXBua2pmZGJgXlxbWllZWVlbXF5gYmRlaWttb3Fyc3V1WTJZeHd2dXRycG5saGZkYV9eXFpZWVlZWltdX2FkZWdpbG5wcnR1dnRzGx4bdnV0c3Fvbmtpk5KRj46MiomHhYOBgH99e3p4d3VzcXBubGtrampra2xtb3Fyc3V3eXt9f4GDhYOCgcGCw4GFhomKjI2Oj5CRkZKRkI+NjYuKiIaEgYF/fXt5eHZ0c3FvbWxraWlpamttbnBxc3V3eXt9f4GDhYaIiouNj5CQkZKSkpGQj46Mi4qIhoWDgYB+fHp4d3VzcXBubGtqamprLFCwzgAAAA=='),
    
    // Sonido de silbato - Tono fluctuante
    whistle: createAudioWithFallback('data:audio/wav;base64,UklGRl4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToBAACBgoODhIWFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiYVEqGvYAAAA='),
    
    // Sonido de multitud
    crowd: createAudioWithFallback('data:audio/wav;base64,UklGRrQDAABXQVZFZm10IBIAAAABAAEARKwAAESsAAACABAAAABkYXRhkAMAAH8ygzmIOJA4ijiIOIs3jDiNN5E2kTePN5A3izvITshvx3PIccdyyHDJb8luyW7Kb8lvy3DKb8pwynDLcMpvy3DLbstvzG7Mb8tuzW7Nbsxuy3DMbsxvzG/Lbsxty27LbctuzG3Lbsxty23LbcpuzG3Mbsxty27Mbcpuy23Lbcpuy27KbspuymzKbcpsy2vJbctsy2zLbMttymzKa8prymvKbMlrymzKbMltym3Jbcpsy2vK9V76XJVUl1aVVJZUk1aRU5FTkVKRU5BUkFGPUpBRkFGQUo9SkFGPUo9Sj1GPUo9Rj1KRU5BRvKi/psDLwMnBycLJwMrAy8HKwMrAy8PKwcnCycPJwcjCysLGw8jCyMPJwsjDyMLHw8jDyMLIwcfCx8HIwsfCx8HHwcfBx8DGwcfBx8LHwsXBx8HGwcbBxsHGwcbBxcHGwcbAxcDGwcXAxcDFwMXAxMDGv8W/xb/GwMa/xr/Fv8W+xb/Fv8a+xr/Fvsa/xb7Fv8W+xb7FvsW+xb/Fvsa/xb7Fvsa/xb/Gv8a/xr/GwMW/x8DGwMbBx8LGwsXDxcPGxMbEx8TIxMnEycTJxcrFysXLxszGzMbNx83Hz8jQydDJ0MrQzNHM083UzdXO1s/X0NfR19HY0tjU2NXY1dnW2dfZ2NnY2tnb2dzb3N3c3t7e397f4ODg4OHh4uLj5OPl5OXm5ebm5+fo6Onp6urr6+zs7e3u7+/w8PHy8vP09PX19vf3+Pn5+vr7/P39/v7///////////////////////////////////////////9+GoIOgVKCUYFTgVKBVIBTgFKBUoBQgVCAUIFPgE+BT39PgE9/UH9Qf05/T35PgE5+T4BPf06AT39QfVAJbA+cAAAA')
};

// ===== ELEMENTOS DEL DOM =====
// Elementos principales
const goalKeeperElement = document.querySelector('.goalkeeper');
const ballElement = document.querySelector('.ball');
const messageElement = document.getElementById('message');
const turnIndicatorElement = document.getElementById('turn-indicator');
const gameOverModal = document.getElementById('game-over');
const finalResultElement = document.getElementById('final-result');

// Overlay para clics
const clickOverlay = document.querySelector('.click-overlay');

// Controles
const directionButtons = document.querySelectorAll('.direction-btn');
const powerBar = document.querySelector('.power-bar');
const powerFill = document.querySelector('.power-fill');
const powerValue = document.querySelector('.power-value');
const shootButton = document.getElementById('shoot-btn');
const shootingControls = document.querySelector('.shooting-controls');
const goalkeeperButtons = document.querySelectorAll('.goalkeeper-btn');
const saveButton = document.getElementById('save-btn');
const goalkeeperControls = document.querySelector('.goalkeeper-controls');
const toggleSoundButton = document.getElementById('toggle-sound');
const restartButton = document.getElementById('restart-btn');

// Marcadores
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const currentRoundElement = document.getElementById('current-round');

// Zonas de la portería
const zones = document.querySelectorAll('.zone');

// Guía de teclas
const keyGridCells = document.querySelectorAll('.key-grid div');

// ===== FUNCIONES DE UTILIDAD =====

// Función para reproducir sonido
function playSound(soundName) {
    if (game.soundEnabled && sounds[soundName]) {
        try {
            // Si ya está reproduciéndose, detenerlo primero
            sounds[soundName].pause();
            sounds[soundName].currentTime = 0;
            
            // Intentar reproducir
            let playPromise = sounds[soundName].play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Error reproduciendo sonido:', error);
                    // En caso de error, intentar reproducir después de la primera interacción del usuario
                    document.addEventListener('click', function initAudio() {
                        sounds[soundName].play().catch(e => console.log('No se pudo reproducir después del clic'));
                        document.removeEventListener('click', initAudio);
                    }, { once: true });
                });
            }
        } catch (error) {
            console.log('Error con sonido:', error);
        }
    }
}

// Función para generar un número aleatorio entre min y max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para actualizar la UI
function updateUI() {
    // Actualizar marcadores
    playerScoreElement.textContent = game.playerScore;
    computerScoreElement.textContent = game.computerScore;
    currentRoundElement.textContent = game.currentRound;
    
    // Actualizar el estado de la ronda
    const roundStatusElement = document.getElementById('round-status');
    if (game.currentRound <= game.maxRounds) {
        roundStatusElement.textContent = `/${game.maxRounds}`;
        roundStatusElement.classList.remove('tiebreaker');
    } else {
        // Estamos en modo desempate
        roundStatusElement.textContent = ' (Desempate)';
        roundStatusElement.classList.add('tiebreaker');
    }
    
    // Mostrar/ocultar controles según el turno
    if (game.isPlayerTurn) {
        shootingControls.style.display = 'flex';
        goalkeeperControls.style.display = 'none';
        turnIndicatorElement.textContent = "Tu turno: ¡Dispara!";
    } else {
        shootingControls.style.display = 'none';
        goalkeeperControls.style.display = 'flex';
        turnIndicatorElement.textContent = "Turno de la máquina: ¡Prepárate para atajar!";
    }
}

// Función para resetear las selecciones
function resetSelections() {
    // Resetear dirección seleccionada
    game.selectedDirection = null;
    
    // Quitar highlights de las zonas
    zones.forEach(zone => {
        zone.classList.remove('highlight', 'target', 'save');
    });
    
    // Resetear la guía de teclas
    keyGridCells.forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    // Resetear la posición del portero y la pelota
    goalKeeperElement.style.left = '50%';
    goalKeeperElement.style.bottom = '20%';
    ballElement.style.left = '50%';
    ballElement.style.bottom = '10%';
    
    // Resetear la barra de potencia
    resetPowerBar();
}

// Función para verificar si el partido ha terminado
function checkGameOver() {
    // Actualizar marcadores siempre
    playerScoreElement.textContent = game.playerScore;
    computerScoreElement.textContent = game.computerScore;
    
    // Si no hemos llegado a las 5 rondas, continuar
    if (game.currentRound <= game.maxRounds) {
        return false;
    }
    
    // Verificar si hay empate
    if (game.playerScore === game.computerScore) {
        // Si estamos en modo desempate (ronda > maxRounds)
        if (game.currentRound > game.maxRounds) {
            // Verificar si alguno tiene ventaja después de un par de tiramientos
            // Como hemos terminado una ronda, ambos han disparado
            // Solo terminar si hay diferencia de puntuación
            return false; // Continuar con los penaltis adicionales
        } else {
            // Cambiar a modo desempate
            messageElement.textContent = '¡Empate! Continuamos con penaltis adicionales';
            messageElement.style.color = 'orange';
            setTimeout(() => {
                messageElement.textContent = '';
            }, 2000);
            return false;
        }
    }
    
    // Si no hay empate y hemos tirado al menos 5 rondas, terminar
    // Mostrar resultado final
    let resultMessage;
    if (game.playerScore > game.computerScore) {
        resultMessage = `¡Ganaste! ${game.playerScore} - ${game.computerScore}`;
    } else {
        resultMessage = `Perdiste. ${game.playerScore} - ${game.computerScore}`;
    }
    
    finalResultElement.textContent = resultMessage;
    playSound('whistle');
    
    // Mostrar modal de fin de juego
    gameOverModal.style.display = 'flex';
    return true;
}

// ===== FUNCIONES DE JUGABILIDAD =====

// Función para manejar los clics en la portería
function handleGoalClick(event) {
    if (game.isShooting) return;
    
    // Obtener la posición del clic relativa al overlay
    const rect = clickOverlay.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convertir la posición a coordenadas relativas (0-1)
    const relX = x / rect.width;
    const relY = y / rect.height;
    
    // Determinar la zona basada en la posición del clic
    // Dividimos la portería en una cuadrícula 3x3
    const col = Math.floor(relX * 3);
    const row = Math.floor(relY * 3);
    
    // Convertir la cuadrícula a un índice (0-8)
    // La cuadrícula está organizada así:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const zoneIndex = row * 3 + col;
    
    // Almacenar la dirección seleccionada
    game.selectedDirection = zoneIndex;
    
    // Quitar highlights anteriores
    zones.forEach(zone => zone.classList.remove('highlight'));
    keyGridCells.forEach(cell => cell.classList.remove('highlight'));
    
    // Destacar la zona seleccionada en la portería
    zones[zoneIndex].classList.add('highlight');
    
    // Destacar la tecla correspondiente en la guía visual
    // Mapeo de la zona a la tecla numérica
    let keyIndex;
    // Mapear del índice de zona (0-8) al índice de tecla visual (0-8)
    switch(zoneIndex) {
        case 0: keyIndex = 0; break; // Zona arriba-izquierda -> Tecla 7
        case 1: keyIndex = 1; break; // Zona arriba-centro -> Tecla 8
        case 2: keyIndex = 2; break; // Zona arriba-derecha -> Tecla 9
        case 3: keyIndex = 3; break; // Zona centro-izquierda -> Tecla 4
        case 4: keyIndex = 4; break; // Zona centro -> Tecla 5
        case 5: keyIndex = 5; break; // Zona centro-derecha -> Tecla 6
        case 6: keyIndex = 6; break; // Zona abajo-izquierda -> Tecla 1
        case 7: keyIndex = 7; break; // Zona abajo-centro -> Tecla 2
        case 8: keyIndex = 8; break; // Zona abajo-derecha -> Tecla 3
        default: keyIndex = 4; // Por defecto, centro
    }
    keyGridCells[keyIndex].classList.add('highlight');
    
    // Si estamos en modo portero, mover el portero inmediatamente
    if (!game.isPlayerTurn) {
        const targetPosition = positionMap[zoneIndex];
        goalKeeperElement.style.left = targetPosition.x;
        goalKeeperElement.style.bottom = targetPosition.y;
    }
}

// Función para el disparo del jugador
function playerShoot() {
    if (game.selectedDirection === null || game.isShooting) {
        return;
    }
    
    // Registrar la zona seleccionada para depuración
    console.log("DISPARO - Zona seleccionada:", game.selectedDirection);
    
    game.isShooting = true;
    playSound('shoot');
    
    // Destacar la zona seleccionada en la portería
    zones.forEach(zone => zone.classList.remove('highlight'));
    zones[game.selectedDirection].classList.add('highlight');
    
    // Ocultar controles durante la animación
    shootingControls.style.pointerEvents = 'none';
    
    // Obtener la zona seleccionada directamente (SIN CAMBIOS NI MAPEOS)
    const selectedZone = game.selectedDirection;
    
    // Obtener la posición EXACTA del centro de la zona seleccionada
    // Esto garantiza que la pelota vaya exactamente a la zona que el usuario eligió
    const finalTargetPosition = positionMap[selectedZone];
    
    // Variable para determinar si golpeará el poste
    let willHitPost = false;
    
    // Solo para tiros potentes hay probabilidad de golpear el poste
    if (game.power >= 8 && Math.random() < 0.4) {
        willHitPost = true;
        // No cambiamos finalTargetPosition para mantener la pelota en la zona seleccionada
        console.log("¡Va a golpear el poste pero mantiene la zona seleccionada!");
    }
    
    // Determinar la velocidad del tiro según la potencia
    let animationDuration;
    if (game.power <= 4) {
        // Tiro lento
        animationDuration = 1200;
    } else if (game.power <= 7) {
        // Tiro normal
        animationDuration = 800;
    } else {
        // Tiro potente
        animationDuration = 500;
    }
    
    // Animar el balón hacia la posición calculada
    console.log("Posición final:", finalTargetPosition.x, finalTargetPosition.y);
    ballElement.style.transition = `all ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    ballElement.style.left = finalTargetPosition.x;
    ballElement.style.bottom = finalTargetPosition.y;
    
    // Ajustar la escala del balón según la potencia
    const scaleValue = 1 + (game.power / 20);
    ballElement.style.transform = `translateX(-50%) scale(${scaleValue})`;
    
    // Calcular la posición del portero de la máquina
    const computerGoalkeeperPosition = getRandomInt(0, 8);
    
    // Delay para dar tiempo a la animación
    setTimeout(() => {
        // Mostrar la posición del portero con una velocidad proporcional a la reacción
        const goalkeeperPos = positionMap[computerGoalkeeperPosition];
        goalKeeperElement.style.transition = 'all 400ms ease-out';
        goalKeeperElement.style.left = goalkeeperPos.x;
        goalKeeperElement.style.bottom = goalkeeperPos.y;
        
        // Determinar si fue gol o atajada
        let isGoal = true;
        
        // Si golpeó el poste, nunca es gol
        if (willHitPost) {
            isGoal = false;
            messageElement.textContent = '¡Ha dado en el poste!';
            messageElement.style.color = 'orange';
            playSound('save');
            // Añadir efecto visual de vibración al poste
            const goalPost = document.querySelector('.goal-post');
            goalPost.classList.add('shake');
            setTimeout(() => {
                goalPost.classList.remove('shake');
            }, 1000);
        }
        // Si el portero adivinó la zona exacta
        else if (computerGoalkeeperPosition === selectedZone) {
            // La probabilidad de atajada depende de la potencia
            let saveChance;
            if (game.power <= 4) {
                saveChance = 0.9; // 90% de probabilidad de atajar tiros lentos
            } else if (game.power <= 7) {
                saveChance = 0.5; // 50% de probabilidad de atajar tiros normales
            } else {
                saveChance = 0.3; // 30% de probabilidad de atajar tiros potentes
            }
            
            if (Math.random() < saveChance) {
                isGoal = false;
                messageElement.textContent = 'Atajada por el portero';
                messageElement.style.color = 'red';
                zones[computerGoalkeeperPosition].classList.add('save');
                goalKeeperElement.classList.add('celebrate');
                playSound('save');
            }
        }
        
        if (isGoal) {
            // Es gol
            game.playerScore++;
            messageElement.textContent = '¡GOL!';
            messageElement.style.color = 'green';
            zones[selectedZone].classList.add('target');
            ballElement.classList.add('celebrate');
            playSound('goal');
        }
        
        // Actualizar marcador
        updateUI();
        
        // Preparar el siguiente turno después de un breve delay
        setTimeout(() => {
            ballElement.classList.remove('celebrate');
            goalKeeperElement.classList.remove('celebrate');
            messageElement.textContent = '';
            resetSelections();
            
            // Restablecer transiciones y transformaciones
            ballElement.style.transition = '';
            ballElement.style.transform = 'translateX(-50%)';
            goalKeeperElement.style.transition = '';
            
            // Cambiar de turno
            game.isPlayerTurn = false;
            game.isShooting = false;
            shootingControls.style.pointerEvents = 'auto';
            
            // Asegurarnos de que la animación de potencia está detenida
            stopPowerAnimation();
            resetPowerBar();
            
            updateUI();
            
            // Pequeña pausa antes de que la máquina dispare
            setTimeout(() => {
                if (!checkGameOver()) {
                    prepareComputerShot();
                }
            }, 1000);
        }, 2000);
    }, animationDuration);
}

// Función para animar la barra de potencia
function startPowerAnimation() {
    // Detener cualquier animación existente
    stopPowerAnimation();
    
    // Empezar desde 0
    game.power = 0;
    updatePowerDisplay();
    
    // Iniciar el intervalo para la animación de potencia
    game.powerInterval = setInterval(() => {
        // Incrementar la potencia
        game.power++;
        
        // Si llegamos a 10, volver a 0
        if (game.power > 10) {
            game.power = 0;
        }
        
        // Actualizar la visualización
        updatePowerDisplay();
    }, 100); // Velocidad de la animación
}

// Función para detener la animación de potencia
function stopPowerAnimation() {
    if (game.powerInterval) {
        clearInterval(game.powerInterval);
        game.powerInterval = null;
    }
}

// Función para actualizar la visualización de potencia
function updatePowerDisplay() {
    // Actualizar el valor numérico
    powerValue.textContent = game.power;
    
    // Actualizar el ancho de la barra de potencia (0-100%)
    powerFill.style.width = `${game.power * 10}%`;
    
    // Quitar clases anteriores
    powerBar.parentElement.classList.remove('power-low', 'power-medium', 'power-high');
    
    // Añadir la clase correspondiente según la potencia
    if (game.power <= 3) {
        powerBar.parentElement.classList.add('power-low');
    } else if (game.power <= 7) {
        powerBar.parentElement.classList.add('power-medium');
    } else {
        powerBar.parentElement.classList.add('power-high');
    }
}

// Función para resetear la barra de potencia
function resetPowerBar() {
    game.power = 0;
    updatePowerDisplay();
}

// Función para preparar el tiro de la máquina
function prepareComputerShot() {
    messageElement.textContent = 'La máquina se prepara para disparar...';
    
    // Delay breve para simular que la máquina está pensando
    setTimeout(() => {
        messageElement.textContent = '¡Listo para atajar!';
        updateUI();
    }, 1500);
}

// Función para cuando el jugador intenta atajar
function playerSave() {
    if (game.selectedDirection === null) {
        return;
    }
    
    // Bloquear más interacciones durante la animación
    goalkeeperControls.style.pointerEvents = 'none';
    
    // Obtener la zona seleccionada (1-9 según la cuadrícula del teclado numérico)
    const selectedZone = game.selectedDirection + 1;
    
    // Determinar la velocidad del movimiento del portero basada en la potencia
    let moveSpeed;
    if (game.power <= 4) {
        moveSpeed = 1000; // Movimiento lento (1s)
    } else if (game.power <= 7) {
        moveSpeed = 600; // Velocidad normal (0.6s)
    } else {
        moveSpeed = 300; // Movimiento rápido (0.3s)
    }
    
    // La posición del portero siempre es exactamente el centro de la zona seleccionada
    const targetPosition = positionMap[game.selectedDirection];
    
    // Mover el portero con la velocidad calculada
    goalKeeperElement.style.transition = `all ${moveSpeed}ms ease-out`;
    goalKeeperElement.style.left = targetPosition.x;
    goalKeeperElement.style.bottom = targetPosition.y;
    
    // Calcular la dirección y potencia del disparo de la máquina
    const computerShotDirection = getRandomInt(0, 8);
    const computerPower = getRandomInt(3, 10);
    
    // Esperar a que el portero termine de moverse antes de que la máquina dispare
    setTimeout(() => {
        // Determinar la velocidad y precisión del tiro según la potencia de la máquina
        let ballSpeed;
        let finalTarget;
        let hitPost = false;
        
        if (computerPower <= 4) {
            // Tiro lento - Tendencia a desviarse ligeramente
            ballSpeed = 1200;
            
            // Calcular una pequeña desviación hacia el centro
            const deviation = 0.2; // 20% de desviación hacia el centro
            
            // Obtener la posición base
            const basePosition = positionMap[computerShotDirection];
            
            // Calcular posición ajustada con tendencia hacia el centro
            const centerPosition = positionMap[4]; // Posición central (índice 4)
            
            finalTarget = {
                x: `calc(${basePosition.x} + ${deviation} * (${centerPosition.x} - ${basePosition.x}))`,
                y: `calc(${basePosition.y} + ${deviation} * (${centerPosition.y} - ${basePosition.y}))`
            };
        } else if (computerPower <= 7) {
            // Tiro normal - Va exactamente a la zona seleccionada
            ballSpeed = 800;
            finalTarget = positionMap[computerShotDirection];
        } else {
            // Tiro potente - Riesgo de dar en el poste
            ballSpeed = 500;
            
            // 40% de probabilidad de golpear el poste si la potencia es alta
            if (Math.random() < 0.4) {
                hitPost = true;
                
                // Determinar qué poste golpeará según la zona seleccionada
                const zoneIndex = computerShotDirection;
                
                if (zoneIndex === 0 || zoneIndex === 3 || zoneIndex === 6) {
                    // Zonas izquierdas - poste izquierdo
                    finalTarget = { x: '10%', y: positionMap[zoneIndex].y };
                } else if (zoneIndex === 2 || zoneIndex === 5 || zoneIndex === 8) {
                    // Zonas derechas - poste derecho
                    finalTarget = { x: '90%', y: positionMap[zoneIndex].y };
                } else if (zoneIndex === 1) {
                    // Zona superior central - travesaño
                    finalTarget = { x: '35%', y: '10%' };
                } else if (zoneIndex === 7) {
                    // Zona inferior central - poste bajo
                    finalTarget = { x: '65%', y: '90%' };
                } else {
                    // Zona central - elige un poste aleatorio
                    const posts = [
                        { x: '15%', y: '15%' }, // Superior izquierdo
                        { x: '85%', y: '15%' }, // Superior derecho
                        { x: '15%', y: '85%' }, // Inferior izquierdo
                        { x: '85%', y: '85%' }  // Inferior derecho
                    ];
                    finalTarget = posts[Math.floor(Math.random() * posts.length)];
                }
            } else {
                // Tiro potente y preciso
                finalTarget = positionMap[computerShotDirection];
            }
        }
        
        // Animar el balón con la velocidad y destino calculados
        playSound('shoot');
        ballElement.style.transition = `all ${ballSpeed}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
        ballElement.style.left = finalTarget.x;
        ballElement.style.bottom = finalTarget.y;
        
        // Ajustar la escala del balón según la potencia
        const scaleValue = 1 + (computerPower / 20);
        ballElement.style.transform = `translateX(-50%) scale(${scaleValue})`;
        
        // Esperar a que la animación del balón termine
        setTimeout(() => {
            // Determinar si fue gol o atajada
            let isSaved = false;
            
            // Si golpeó el poste, nunca es gol
            if (hitPost) {
                isSaved = true;
                messageElement.textContent = '¡La máquina dio en el poste!';
                messageElement.style.color = 'green';
                playSound('save');
                // Añadir efecto visual de vibración al poste
                const goalPost = document.querySelector('.goal-post');
                goalPost.classList.add('shake');
                setTimeout(() => {
                    goalPost.classList.remove('shake');
                }, 1000);
            }
            // Si el portero está en la misma zona que el disparo
            else if (game.selectedDirection === computerShotDirection) {
                // El portero adivinó la dirección, la probabilidad de atajada depende de las potencias
                let saveChance = 0.5; // Base
                
                // Ajustar según la potencia del portero (velocidad de movimiento)
                if (game.power <= 4) {
                    saveChance -= 0.2; // Penalización por movimiento lento
                } else if (game.power >= 8) {
                    saveChance += 0.2; // Bonus por movimiento rápido
                }
                
                // Ajustar según la potencia del disparo
                if (computerPower <= 4) {
                    saveChance += 0.3; // Más fácil atajar tiros lentos
                } else if (computerPower >= 8) {
                    saveChance -= 0.2; // Más difícil atajar tiros potentes
                }
                
                isSaved = Math.random() < saveChance;
            }
            
            if (isSaved) {
                // Atajada
                messageElement.textContent = '¡Gran atajada!';
                messageElement.style.color = 'green';
                zones[game.selectedDirection].classList.add('save');
                goalKeeperElement.classList.add('celebrate');
                playSound('save');
            } else {
                // Es gol
                game.computerScore++;
                messageElement.textContent = 'La máquina marcó gol';
                messageElement.style.color = 'red';
                zones[computerShotDirection].classList.add('target');
                ballElement.classList.add('celebrate');
                playSound('goal');
            }
            
            // Actualizar marcador
            updateUI();
            
            // Preparar para la siguiente ronda
            setTimeout(() => {
                ballElement.classList.remove('celebrate');
                goalKeeperElement.classList.remove('celebrate');
                messageElement.textContent = '';
                resetSelections();
                
                // Restablecer transiciones y transformaciones
                ballElement.style.transition = '';
                ballElement.style.transform = 'translateX(-50%)';
                goalKeeperElement.style.transition = '';
                
                // Cambiar de turno y avanzar ronda
                game.isPlayerTurn = true;
                game.currentRound++;
                goalkeeperControls.style.pointerEvents = 'auto';
                
                // Verificar si el juego ha terminado
                if (checkGameOver()) {
                    return;
                }
                
                updateUI();
            }, 2000);
        }, ballSpeed);
    }, moveSpeed);
}

// ===== CONFIGURACIÓN DE EVENTOS =====

// Event listener para clics en la portería
clickOverlay.addEventListener('click', handleGoalClick);

// Event listener para el botón de reiniciar
restartButton.addEventListener('click', () => {
    // Ocultar el modal
    gameOverModal.style.display = 'none';
    
    // Reiniciar el juego
    game.playerScore = 0;
    game.computerScore = 0;
    game.currentRound = 1;
    game.isPlayerTurn = true;
    
    // Resetear cualquier estado visual del desempate
    const roundStatusElement = document.getElementById('round-status');
    roundStatusElement.textContent = `/${game.maxRounds}`;
    roundStatusElement.classList.remove('tiebreaker');
    
    resetSelections();
    updateUI();
    
    // Reproducir sonido de inicio
    playSound('whistle');
});

// Event listener para el botón de sonido
toggleSoundButton.addEventListener('click', () => {
    game.soundEnabled = !game.soundEnabled;
    toggleSoundButton.textContent = game.soundEnabled ? '🔊' : '🔇';
});

// Soporte para teclado (accesibilidad)
document.addEventListener('keydown', (e) => {
    // Log detallado para depuración
    console.log("===== TECLA PRESIONADA =====");
    console.log("Key:", e.key, "Code:", e.code);
    
    // Mapeo de teclas numéricas a zonas de la portería
    // Teclado numérico:    Zonas de la portería:
    // 7 8 9                0 1 2 (arriba)
    // 4 5 6                3 4 5 (medio)
    // 1 2 3                6 7 8 (abajo)
    const keyMap = {
        '7': 0, '8': 1, '9': 2, // Fila superior - arriba
        '4': 3, '5': 4, '6': 5, // Fila media - medio
        '1': 6, '2': 7, '3': 8, // Fila inferior - abajo
        'Numpad7': 0, 'Numpad8': 1, 'Numpad9': 2,
        'Numpad4': 3, 'Numpad5': 4, 'Numpad6': 5,
        'Numpad1': 6, 'Numpad2': 7, 'Numpad3': 8,
        'NumPad7': 0, 'NumPad8': 1, 'NumPad9': 2,
        'NumPad4': 3, 'NumPad5': 4, 'NumPad6': 5,
        'NumPad1': 6, 'NumPad2': 7, 'NumPad3': 8
    };
    
    // Guardar la última tecla presionada
    if (keyMap[e.key] !== undefined || keyMap[e.code] !== undefined) {
        game.lastKeyPressed = e.key;
        
        // Obtener el zoneIndex desde e.key o e.code
        const zoneIndex = keyMap[e.key] !== undefined ? keyMap[e.key] : keyMap[e.code];
        console.log("Zona seleccionada:", zoneIndex);
        
        // Si es el turno del jugador y presiona una tecla numérica
        if (game.isPlayerTurn && !game.isShooting) {
            // Almacenar la dirección seleccionada
            game.selectedDirection = zoneIndex;
            
            // Quitar highlights anteriores
            zones.forEach(zone => zone.classList.remove('highlight'));
            keyGridCells.forEach(cell => cell.classList.remove('highlight'));
            
            // Destacar la zona seleccionada en la portería
            zones[zoneIndex].classList.add('highlight');
            
            // Destacar la tecla correspondiente en la guía visual
            // Destacamos la misma celda que corresponde al índice de la zona
            keyGridCells[zoneIndex].classList.add('highlight');
            
            // Iniciar la animación de potencia solo si no está ya en curso
            if (!game.powerInterval) {
                startPowerAnimation();
            }
        }
        // Si es el turno del portero
        else if (!game.isPlayerTurn) {
            // Almacenar la dirección seleccionada
            game.selectedDirection = zoneIndex;
            
            // Quitar highlights anteriores
            zones.forEach(zone => zone.classList.remove('highlight'));
            keyGridCells.forEach(cell => cell.classList.remove('highlight'));
            
            // Destacar la zona seleccionada en la portería
            zones[zoneIndex].classList.add('highlight');
            
            // Destacar la tecla correspondiente en la guía visual
            keyGridCells[zoneIndex].classList.add('highlight');
        }
    }
});

// Mejorar el log en keyup para verificar que se dispara correctamente
document.addEventListener('keyup', (e) => {
    console.log("===== TECLA LIBERADA =====");
    console.log("Key:", e.key, "Code:", e.code, "Power:", game.power);
    
    // Mapeo de teclas numéricas
    const keyMap = {
        '7': 0, '8': 1, '9': 2, // Fila superior - arriba
        '4': 3, '5': 4, '6': 5, // Fila media - medio
        '1': 6, '2': 7, '3': 8, // Fila inferior - abajo
        'Numpad7': 0, 'Numpad8': 1, 'Numpad9': 2,
        'Numpad4': 3, 'Numpad5': 4, 'Numpad6': 5,
        'Numpad1': 6, 'Numpad2': 7, 'Numpad3': 8,
        'NumPad7': 0, 'NumPad8': 1, 'NumPad9': 2,
        'NumPad4': 3, 'NumPad5': 4, 'NumPad6': 5,
        'NumPad1': 6, 'NumPad2': 7, 'NumPad3': 8
    };

    // Solo procesar si es una tecla numérica relevante y hay una animación de potencia en curso
    if ((keyMap[e.key] !== undefined || keyMap[e.code] !== undefined) && game.powerInterval && game.isPlayerTurn) {
        // Detener la animación y disparar
        stopPowerAnimation();
        console.log("Disparando a la zona:", game.selectedDirection);
        if (game.isPlayerTurn) {
            playerShoot();
        }
    }
});

// Soporte para dispositivos táctiles (eventos touch)
document.addEventListener('touchstart', (e) => {
    // Ajustar la UI para dispositivos táctiles
    document.body.classList.add('touch-device');
}, { once: true });

// Eventos táctiles para click overlay
clickOverlay.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevenir zoom u otras acciones del navegador
    
    if (game.isShooting || game.powerInterval) return;
    
    // Obtener la posición del toque
    const touch = e.touches[0];
    const rect = clickOverlay.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Convertir la posición a coordenadas relativas (0-1)
    const relX = x / rect.width;
    const relY = y / rect.height;
    
    // Determinar la zona - cuadrícula 3x3
    const col = Math.floor(relX * 3);
    const row = Math.floor(relY * 3);
    const zoneIndex = row * 3 + col;
    
    console.log("===== TOQUE DETECTADO =====");
    console.log("Posición:", x, y, "Coordenadas relativas:", relX, relY);
    console.log("Zona seleccionada:", zoneIndex, "Col:", col, "Row:", row);
    
    // Almacenar la dirección seleccionada - SIN CAMBIOS NI MAPEOS
    game.selectedDirection = zoneIndex;
    
    // Quitar highlights anteriores
    zones.forEach(zone => zone.classList.remove('highlight'));
    keyGridCells.forEach(cell => cell.classList.remove('highlight'));
    
    // Destacar la zona seleccionada en la portería
    zones[zoneIndex].classList.add('highlight');
    
    // Destacar la tecla correspondiente en la guía visual - es el mismo índice
    keyGridCells[zoneIndex].classList.add('highlight');
    
    // Si no es el turno del jugador, mover el portero inmediatamente
    if (!game.isPlayerTurn) {
        const targetPosition = positionMap[zoneIndex];
        goalKeeperElement.style.left = targetPosition.x;
        goalKeeperElement.style.bottom = targetPosition.y;
    }
    
    // Iniciar la animación de potencia
    startPowerAnimation();
});

// Evento touchend simplificado y consistente
clickOverlay.addEventListener('touchend', (e) => {
    e.preventDefault();
    
    console.log("===== TOQUE FINALIZADO =====");
    console.log("Zona seleccionada:", game.selectedDirection, "Potencia:", game.power);
    
    // Si hay animación de potencia en curso
    if (game.powerInterval) {
        stopPowerAnimation();
        if (game.selectedDirection !== null) {
            if (game.isPlayerTurn && !game.isShooting) {
                console.log("Disparando después de tocar");
                playerShoot();
            } else if (!game.isPlayerTurn) {
                console.log("Atajando después de tocar");
                playerSave();
            }
        }
    }
});

// Restaurar eventos táctiles necesarios
// Si el usuario mueve el dedo fuera del área, cancelar la acción
clickOverlay.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    console.log("Toque cancelado");
    stopPowerAnimation();
    resetPowerBar();
});

// Si el usuario mueve el dedo fuera del área mientras mantiene presionado
clickOverlay.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = clickOverlay.getBoundingClientRect();
    
    // Verificar si el dedo está fuera del área
    if (touch.clientX < rect.left || touch.clientX > rect.right ||
        touch.clientY < rect.top || touch.clientY > rect.bottom) {
        console.log("Dedo fuera del área");
        stopPowerAnimation();
        resetPowerBar();
    }
});

// Eliminar los event listeners antiguos de los botones ya que no los necesitamos
shootButton.style.display = 'none';
saveButton.style.display = 'none';

// ===== INICIALIZACIÓN =====
// Inicializa el juego
function init() {
    updateUI();
    playSound('whistle');
    
    // Mostrar mensaje sobre los sonidos
    setTimeout(() => {
        messageElement.textContent = 'Haz clic en cualquier parte para activar los sonidos';
        messageElement.style.color = 'orange';
        
        // Eliminar el mensaje después de unos segundos
        setTimeout(() => {
            messageElement.textContent = '';
        }, 3000);
        
        // Reproducir sonido al primer clic
        document.addEventListener('click', function initAudio() {
            playSound('whistle');
            document.removeEventListener('click', initAudio);
        }, { once: true });
    }, 1000);
}

// Iniciar el juego cuando se haya cargado completamente
window.addEventListener('load', init); 