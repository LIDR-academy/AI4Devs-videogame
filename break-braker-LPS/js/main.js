import Game from './game.js';
import UI from './ui.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar el tamaño del canvas al contenedor
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    // Inicializar el tamaño del canvas
    resizeCanvas();
    
    // Ajustar el tamaño del canvas cuando la ventana cambia de tamaño
    window.addEventListener('resize', resizeCanvas);
    
    // Inicializar la interfaz de usuario
    const ui = new UI();
    
    // Inicializar el juego con el canvas y el contexto
    const game = new Game(canvas, ctx, ui);
    
    // Configurar eventos de botones
    document.getElementById('startButton').addEventListener('click', () => {
        ui.hideStartScreen();
        game.start();
    });
    
    document.getElementById('restartButton').addEventListener('click', () => {
        ui.hideGameOverScreen();
        game.reset();
        game.start();
    });
    
    document.getElementById('nextLevelButton').addEventListener('click', () => {
        ui.hideWinScreen();
        
        // Comprobar si el texto del botón es "Reiniciar Juego" (último nivel completado)
        if (document.getElementById('nextLevelButton').textContent === 'Reiniciar Juego') {
            // Reiniciar todo el juego desde el nivel 1
            game.reset();
        } else {
            // Avanzar al siguiente nivel
            game.nextLevel();
        }
        
        game.start();
    });
}); 