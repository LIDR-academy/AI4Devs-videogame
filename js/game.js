// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Importar las escenas
    import('./scenes/LoadScene.js').then(LoadSceneModule => {
        import('./scenes/MenuScene.js').then(MenuSceneModule => {
            import('./scenes/GameScene.js').then(GameSceneModule => {
                // Configuración del juego
                const config = {
                    type: Phaser.AUTO,
                    width: 800,
                    height: 600,
                    parent: 'game',
                    backgroundColor: '#f0f0f0',
                    scene: [
                        LoadSceneModule.LoadScene,
                        MenuSceneModule.MenuScene,
                        GameSceneModule.GameScene
                    ]
                };

                // Crear la instancia del juego
                try {
                    window.game = new Phaser.Game(config);
                } catch (error) {
                    console.error('Error al inicializar Phaser:', error);
                }
            });
        });
    });
}); 