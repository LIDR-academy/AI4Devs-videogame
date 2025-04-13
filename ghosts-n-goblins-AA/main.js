import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';

// Esperar a que el DOM esté listo y Phaser esté disponible
window.addEventListener('load', () => {
    // Verificar que Phaser esté disponible
    if (typeof Phaser === 'undefined') {
        console.error('Phaser no está disponible. Asegúrate de que phaser.min.js se cargue correctamente.');
        return;
    }

    // Configuración del juego
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1000 },
                debug: false
            }
        },
        scene: [
            BootScene,
            TitleScene,
            GameScene,
            GameOverScene,
            VictoryScene
        ]
    };

    // Crear instancia del juego
    const game = new Phaser.Game(config);

    // Ocultar pantalla de carga cuando el juego esté listo
    game.events.on('ready', () => {
        document.getElementById('loading').classList.add('hidden');
    });
}); 