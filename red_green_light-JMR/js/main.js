/**
 * Archivo principal del juego "Luz Roja, Luz Verde"
 * Configura e inicia el juego utilizando la estructura modular
 */
import { GAME_CONFIG } from './config/gameConfig.js';
import GameScene from './scenes/GameScene.js';

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    backgroundColor: GAME_CONFIG.backgroundColor,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: GAME_CONFIG.debug // Desactivado ahora que GAME_CONFIG.debug es false
        }
    },
    input: {
        keyboard: {
            // Evitar que la barra espaciadora haga scroll en la página
            capture: [Phaser.Input.Keyboard.KeyCodes.SPACE]
        }
    },
    scene: [GameScene]
};

// Cuando el DOM esté listo, iniciar el juego
document.addEventListener('DOMContentLoaded', function() {
    // Crear una instancia del juego
    const game = new Phaser.Game(config);
    
    // Manejar eventos de ventana para adaptar el tamaño
    window.addEventListener('resize', function() {
        game.scale.refresh();
    });
    
    console.log('Juego "Luz Roja, Luz Verde" iniciado con estructura modular');
}); 