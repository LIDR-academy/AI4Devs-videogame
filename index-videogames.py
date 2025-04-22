# NO TOCAR ESTE ARCHIVO
import os

def get_icon_for_game(game_name):
    # Diccionario que mapea nombres de juegos con iconos apropiados
    icons = {
        "2048": "puzzle-piece",
        "2048 phaser": "dice",
        "asteroids": "meteor",
        "battle line": "chess-board",
        "battleship": "ship",
        "breakout": "cubes",
        "chained words": "link",
        "dinosaur game": "dragon",
        "entrega paquete": "box",
        "fifteen puzzle": "th",
        "flappy bird": "dove",
        "flood fill": "fill-drip",
        "galaxian": "rocket",
        "game mrr": "gamepad",
        "ghosts n goblins": "ghost",
        "habra palabra": "font",
        "hangman": "male",
        "jumper frog": "frog",
        "keen eye": "eye",
        "mario clone": "hat-wizard",
        "memory": "brain",
        "memory match": "clone",
        "penalty": "futbol",
        "pong classic": "table-tennis",
        "puzzle master": "puzzle-piece",
        "red green light": "traffic-light",
        "reversi": "sync",
        "rompe webos": "egg",
        "snake": "snake",
        "sound grid": "music",
        "space star": "star",
        "tetris 3d-afr": "cubes",
        "tetris-dad": "th-large",
        "tic tac toe": "grip-horizontal",
        "tiny kingdom": "chess-rook",
        "tres en raya": "th",
        "juego vocales": "font"
    }
    
    # Normalización del nombre para búsqueda
    game_name_lower = game_name.lower()
    
    # Buscar el icono para este juego
    if game_name_lower in icons:
        return icons[game_name_lower]
    else:
        # Icono predeterminado si no se encuentra
        return "gamepad"

def get_javascript_code():
    return """
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Variables
            const gameList = document.querySelector('ul');
            const gridButton = document.querySelector('[data-view="grid"]');
            const listButton = document.querySelector('[data-view="list"]');
            const decreaseButton = document.getElementById('decrease-columns');
            const increaseButton = document.getElementById('increase-columns');
            const columnDisplay = document.querySelector('.column-display');
            
            let columns = 4; // Valor inicial
            
            // Función para cambiar el número de columnas
            function updateColumns(newValue) {
                columns = Math.max(1, Math.min(6, newValue)); // Entre 1 y 6 columnas
                document.documentElement.style.setProperty('--columns', columns);
                columnDisplay.textContent = columns;
                
                // Guardar preferencia
                localStorage.setItem('gameViewColumns', columns);
            }
            
            // Función para cambiar el modo de visualización
            function updateViewMode(mode) {
                if (mode === 'grid') {
                    gameList.className = 'grid-view';
                    gridButton.classList.add('active');
                    listButton.classList.remove('active');
                } else {
                    gameList.className = 'list-view';
                    listButton.classList.add('active');
                    gridButton.classList.remove('active');
                }
                
                // Guardar preferencia
                localStorage.setItem('gameViewMode', mode);
            }
            
            // Event listeners
            gridButton.addEventListener('click', () => updateViewMode('grid'));
            listButton.addEventListener('click', () => updateViewMode('list'));
            
            decreaseButton.addEventListener('click', () => updateColumns(columns - 1));
            increaseButton.addEventListener('click', () => updateColumns(columns + 1));
            
            // Cargar preferencias del usuario
            const savedColumns = localStorage.getItem('gameViewColumns');
            const savedViewMode = localStorage.getItem('gameViewMode');
            
            if (savedColumns) {
                updateColumns(parseInt(savedColumns));
            }
            
            if (savedViewMode) {
                updateViewMode(savedViewMode);
            }
        });
    </script>
    """

def create_index_html(base_path):
    # El archivo HTML donde se escribirán los enlaces
    index_file_path = os.path.join(base_path, 'index.html')

    # Comenzar a escribir en el archivo
    with open(index_file_path, 'w', encoding='utf-8') as file:
        file.write('<!DOCTYPE html>\n')
        file.write('<html lang="es">\n')
        file.write('<head>\n')
        file.write('    <meta charset="UTF-8">\n')
        file.write('    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        file.write('    <title>Índice de Juegos - AI4Devs</title>\n')
        file.write('    <link rel="stylesheet" href="styles.css">\n')
        file.write('    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n')
        file.write('</head>\n')
        file.write('<body>\n')
        file.write('    <div id="game-index">\n')
        file.write('        <h1>🎮 Selecciona tu juego</h1>\n')
        file.write('        <div class="controls">\n')
        file.write('            <div class="view-modes">\n')
        file.write('                <button class="view-toggle active" data-view="grid">\n')
        file.write('                    <i class="fas fa-th"></i> Grid\n')
        file.write('                </button>\n')
        file.write('                <button class="view-toggle" data-view="list">\n')
        file.write('                    <i class="fas fa-list"></i> Lista\n')
        file.write('                </button>\n')
        file.write('            </div>\n')
        file.write('            <div class="column-control">\n')
        file.write('                <button id="decrease-columns">\n')
        file.write('                    <i class="fas fa-minus"></i>\n')
        file.write('                </button>\n')
        file.write('                <span class="column-display">4</span> Columnas\n')
        file.write('                <button id="increase-columns">\n')
        file.write('                    <i class="fas fa-plus"></i>\n')
        file.write('                </button>\n')
        file.write('            </div>\n')
        file.write('        </div>\n')
        file.write('        <ul class="grid-view">\n')

        # Obtener y ordenar todas las carpetas por nombre alfabéticamente
        # Excluir carpetas con nombres que comienzan con punto
        directories = sorted([item for item in os.listdir(base_path) 
                             if os.path.isdir(os.path.join(base_path, item)) and not item.startswith('.')])

        # Listar todas las carpetas y crear un enlace para cada juego
        for item in directories:
            # Extrae el nombre del juego y las iniciales del autor
            parts = item.split('-')
            game_name = parts[0]
            # Obtener iniciales del autor (si existen)
            author_initials = parts[-1] if len(parts) > 1 else ""
            
            # Capitaliza la primera letra de cada palabra
            game_name = ' '.join(word.capitalize() for word in game_name.split())
            
            # Obtener el icono apropiado para el juego
            icon = get_icon_for_game(game_name)
            
            # Escribir la entrada con el icono y el autor
            file.write(f'            <li><a href="{item}/index.html">\n')
            file.write(f'                <i class="fas fa-{icon}"></i> {game_name}\n')
            if author_initials and author_initials != "index":
                file.write(f'                <span class="author-info">Autor: {author_initials}</span>\n')
            file.write(f'            </a></li>\n')

        file.write('        </ul>\n')
        file.write('    </div>\n')
        file.write('    <footer>\n')
        file.write('        <p>© <span>AI4Devs</span> students - 2025/02</p>\n')
        file.write('    </footer>\n')
        
        # Agregar el código JavaScript para la funcionalidad de cambio de vista
        file.write(get_javascript_code())
        
        file.write('</body>\n')
        file.write('</html>\n')

# Especifica el directorio base donde se encuentran las carpetas de los juegos
base_path = './'
create_index_html(base_path)
