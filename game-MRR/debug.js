// Herramienta de depuración para identificar problemas

// Función para imprimir información de depuración en el canvas
function drawDebugInfo(ctx, gameData) {
    if (!ctx) {
        console.error('Contexto de canvas no disponible');
        return;
    }

    ctx.save();
    
    // Configurar estilos de texto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 400, 160);
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    
    // Imprimir información sobre el estado del juego
    let y = 30;
    const lineHeight = 15;
    
    ctx.fillText(`Canvas: ${ctx.canvas.width}x${ctx.canvas.height}`, 20, y);
    y += lineHeight;
    
    if (gameData.player) {
        ctx.fillText(`Jugador: x=${Math.round(gameData.player.x)}, y=${Math.round(gameData.player.y)}, vx=${gameData.player.velocityX.toFixed(2)}, vy=${gameData.player.velocityY.toFixed(2)}`, 20, y);
        y += lineHeight;
        ctx.fillText(`Estado: ${gameData.player.state}, En suelo: ${gameData.player.isOnGround}, Saltando: ${gameData.player.isJumping}`, 20, y);
        y += lineHeight;
    } else {
        ctx.fillText('Jugador no inicializado', 20, y);
        y += lineHeight;
    }
    
    ctx.fillText(`Plataformas: ${gameData.platforms.length}, Fantasmas: ${gameData.ghosts.length}, Calabazas: ${gameData.pumpkins.length}`, 20, y);
    y += lineHeight;
    
    // Detección de teclas activas
    let activeKeys = Object.entries(gameData.keys)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key)
        .join(', ');
    
    ctx.fillText(`Teclas activas: ${activeKeys || 'ninguna'}`, 20, y);
    y += lineHeight;
    
    // Estado del juego
    ctx.fillText(`Juego en ejecución: ${gameData.gameRunning}`, 20, y);
    y += lineHeight;
    
    // Errores detectados
    if (gameData.errors.length > 0) {
        ctx.fillStyle = 'red';
        ctx.fillText('Errores detectados:', 20, y);
        y += lineHeight;
        
        gameData.errors.forEach(error => {
            ctx.fillText(`- ${error}`, 30, y);
            y += lineHeight;
        });
    }
    
    ctx.restore();
}

// Función para detectar problemas comunes
function detectProblems(gameData) {
    const errors = [];
    
    // Comprobar si el canvas existe y tiene dimensiones correctas
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        errors.push('No se encuentra el elemento canvas');
    } else if (canvas.width === 0 || canvas.height === 0) {
        errors.push(`Dimensiones de canvas inválidas: ${canvas.width}x${canvas.height}`);
    }
    
    // Comprobar si el jugador existe y está en una posición razonable
    if (!gameData.player) {
        errors.push('Jugador no inicializado');
    } else if (isNaN(gameData.player.x) || isNaN(gameData.player.y)) {
        errors.push(`Posición de jugador inválida: x=${gameData.player.x}, y=${gameData.player.y}`);
    }
    
    // Comprobar si hay plataformas
    if (gameData.platforms.length === 0) {
        errors.push('No hay plataformas en el nivel');
    }
    
    return errors;
}

// Exportar funciones para uso en game.js
window.gameDebug = {
    drawDebugInfo,
    detectProblems
}; 