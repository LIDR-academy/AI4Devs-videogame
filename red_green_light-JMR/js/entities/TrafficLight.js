/**
 * Clase TrafficLight - Encapsula toda la lógica relacionada con el semáforo
 * en el juego "Luz Roja, Luz Verde"
 */
import { TRAFFIC_LIGHT_CONFIG, TRAFFIC_LIGHT_STATES } from '../config/gameConfig.js';

class TrafficLight {
    /**
     * Constructor de la clase TrafficLight
     * @param {Phaser.Scene} scene - La escena a la que pertenece el semáforo
     * @param {Object} config - Configuración adicional del semáforo
     */
    constructor(scene, config = {}) {
        this.scene = scene;
        
        // Configuración del semáforo
        this.config = {
            ...TRAFFIC_LIGHT_CONFIG,
            ...config
        };
        
        // Estado inicial del semáforo
        this.state = TRAFFIC_LIGHT_STATES.GREEN;
        
        // Callback para cuando cambia el estado
        this.onStateChange = null;
        
        // Timer para cambios automáticos de estado
        this.stateTimer = null;
        
        // Crear el semáforo en la escena
        this.create();
    }
    
    /**
     * Crea el semáforo en la escena
     */
    create() {
        const { x, y } = this.config.position;
        const radius = this.config.radius;
        
        // Crear gráfico del semáforo
        this.graphic = this.scene.add.circle(x, y, radius, this.config.greenColor);
    }
    
    /**
     * Establece el callback para cambios de estado
     * @param {Function} callback - Función a llamar cuando cambie el estado
     */
    setStateChangeCallback(callback) {
        this.onStateChange = callback;
    }
    
    /**
     * Cambia al estado de luz verde
     */
    setGreen() {
        this.state = TRAFFIC_LIGHT_STATES.GREEN;
        this.graphic.setFillStyle(this.config.greenColor);
        
        // Llamar al callback si existe
        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
        
        // Programar cambio a luz roja
        this.scheduleStateChange();
    }
    
    /**
     * Cambia al estado de luz roja
     */
    setRed() {
        this.state = TRAFFIC_LIGHT_STATES.RED;
        this.graphic.setFillStyle(this.config.redColor);
        
        // Llamar al callback si existe
        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
        
        // Programar cambio a luz verde
        this.scheduleStateChange();
    }
    
    /**
     * Programa el siguiente cambio de estado
     */
    scheduleStateChange() {
        // Cancelar cualquier timer existente
        if (this.stateTimer) {
            this.stateTimer.remove();
        }
        
        // Determinar duración según el estado actual
        const duration = this.state === TRAFFIC_LIGHT_STATES.GREEN 
            ? Phaser.Math.Between(this.config.greenDuration.min, this.config.greenDuration.max)
            : Phaser.Math.Between(this.config.redDuration.min, this.config.redDuration.max);
        
        // Programar el cambio
        this.stateTimer = this.scene.time.delayedCall(duration, () => {
            if (this.state === TRAFFIC_LIGHT_STATES.GREEN) {
                this.setRed();
            } else {
                this.setGreen();
            }
        }, [], this);
    }
    
    /**
     * Inicia la secuencia de cambios de estado
     */
    start() {
        // Comenzar con luz verde
        this.setGreen();
    }
    
    /**
     * Detiene la secuencia de cambios de estado
     */
    stop() {
        if (this.stateTimer) {
            this.stateTimer.remove();
            this.stateTimer = null;
        }
    }
    
    /**
     * Retorna el estado actual del semáforo
     * @returns {string} - Estado del semáforo
     */
    getState() {
        return this.state;
    }
    
    /**
     * Comprueba si el semáforo está en rojo
     * @returns {boolean} - true si está en rojo
     */
    isRed() {
        return this.state === TRAFFIC_LIGHT_STATES.RED;
    }
    
    /**
     * Comprueba si el semáforo está en verde
     * @returns {boolean} - true si está en verde
     */
    isGreen() {
        return this.state === TRAFFIC_LIGHT_STATES.GREEN;
    }
}

export default TrafficLight; 