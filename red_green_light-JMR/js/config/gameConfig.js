/**
 * Configuración del juego "Luz Roja, Luz Verde"
 * Este archivo contiene todas las constantes y configuraciones del juego
 */

// Configuración general del juego
export const GAME_CONFIG = {
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    debug: false // Desactivamos el modo debug
};

// Configuración del jugador
export const PLAYER_CONFIG = {
    radius: 15,
    maxSpeed: 10,
    acceleration: 0.2,
    deceleration: 0.3,
    minSpeedThreshold: 0.5,
    spriteSize: {
        width: 40,
        height: 40
    },
    initialPosition: {
        x: 120,
        y: 300
    },
    // Configuración para el efecto de tiriteo por miedo (reducido al 20%)
    shiver: {
        minIntensity: 0.4, // Reducido desde 2
        maxIntensity: 0.8, // Reducido desde 4
        minDuration: 1000,
        maxDuration: 3000,
        frameChance: 0.01 // 1% de probabilidad en cada frame
    }
};

// Configuración de los bots
export const BOT_CONFIG = {
    count: 50, // Número de bots a generar (aumentado a 50 desde 1)
    minY: 150, // Posición Y mínima para generar bots (superior de la línea)
    maxY: 450, // Posición Y máxima para generar bots (inferior de la línea)
    initialX: 120, // Posición X inicial de los bots (igual que el jugador)
    botConfig: {
        minSprintTime: 3000, // Mínimo tiempo de sprint en milisegundos (3 segundos)
        maxSprintTime: 8000, // Máximo tiempo de sprint en milisegundos (8 segundos)
        reactionTimeMin: 300, // Tiempo mínimo de reacción en milisegundos
        reactionTimeMax: 700,  // Tiempo máximo de reacción en milisegundos
        shiverProbability: 0.3, // Probabilidad de que el bot tirite cuando se detiene en rojo
        shiverFrameChance: 0.002 // 0.2% de probabilidad en cada frame durante luz roja
    },
    tintColors: [0xFF9999, 0x99FF99, 0x9999FF, 0xFFFF99, 0xFF99FF] // Colores para distinguir bots
};

// Configuración del semáforo
export const TRAFFIC_LIGHT_CONFIG = {
    position: {
        x: 400,
        y: 50
    },
    radius: 30,
    greenColor: 0x00ff00,
    redColor: 0xff0000,
    greenDuration: {
        min: 3000,
        max: 8000
    },
    redDuration: {
        min: 2000,
        max: 5000
    }
};

// Configuración de la línea de inicio y meta
export const LINES_CONFIG = {
    startLine: {
        x: 100,
        y: 100,
        width: 5,
        height: 400,
        color: 0x00ff00
    },
    finishLine: {
        x: 700,
        y: 100,
        width: 5,
        height: 400,
        color: 0xff0000
    }
};

// Estados del juego
export const GAME_STATES = {
    WAITING: 'waiting',
    MOVING: 'moving',
    PAUSED: 'paused',
    BALANCING: 'balancing',
    FINISHED: 'finished',
    DEAD: 'dead'
};

// Estados del semáforo
export const TRAFFIC_LIGHT_STATES = {
    GREEN: 'green',
    RED: 'red'
};

// Configuración del audio
export const AUDIO_CONFIG = {
    greenLightVolume: 0.5,
    indicatorText: '♪ SONANDO',
    indicatorPosition: {
        x: 650,
        y: 20
    }
};

// Textos del juego
export const GAME_TEXTS = {
    instructions: [
        {
            text: 'Mantén presionado ESPACIO para acelerar',
            position: { x: 400, y: 520 }
        },
        {
            text: 'Suelta ESPACIO para frenar gradualmente',
            position: { x: 400, y: 550 }
        },
        {
            text: 'Debes detenerte cuando el semáforo está ROJO',
            position: { x: 400, y: 580 }
        }
    ],
    gameOver: {
        title: '¡ELIMINADO!',
        restart: 'Presiona R para reiniciar'
    },
    victory: {
        title: '¡META ALCANZADA!',
        restart: 'Presiona R para reiniciar'
    }
};

export default {
    GAME_CONFIG,
    PLAYER_CONFIG,
    BOT_CONFIG,
    TRAFFIC_LIGHT_CONFIG,
    LINES_CONFIG,
    GAME_STATES,
    TRAFFIC_LIGHT_STATES,
    AUDIO_CONFIG,
    GAME_TEXTS
}; 