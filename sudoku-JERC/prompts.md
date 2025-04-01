# Prompts Juego de Sudoku
    Se ha usado Cursor y gpt-4o para las imagenes    

## Prompt 1
    Eres un desarrollador de software de juegos y necesitas crear un juego de sudoku
    ¿Dime cuál es el mejor framework o librería para desarrollar un juego de sudoku en el navegador con HTML5/CSS/JavaScript?

## Prompt 2
    Como experto desarrollador de juegos quiero que crees una tarea para configurar la estructura para un juego de sudoku utilizando Phaser 3, un popular framework de juegos en HTML5. No quiero escribir ni una sola línea de código yo mismo, así que por favor encárgate de toda la creación de archivos y configuración necesaria.
    
    Utiliza el fichero prompts-sudoku.md y crea todo la funcionalidad descrita dentro de la carpeta sudoku-JERC

## Prompt 3
    Dime porque ocurre este error al ejecutar el juego desde el navegador: http://localhost:8080/
    Access to script at 'file:///C:/Users/jronc/Documents/MasterIA/AI4Devs-videogame/sudoku-JERC/js/game.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.Understand this errorAI
    game.js:1 
    Failed to load resource: net::ERR_FAILED

## Prompt 4
    De estos errores que se muestran en la consola del navegador al ejecutar la aplicación:
    failed to load resource: the server responded with a status of 404 (File not found)Understand this errorAI
    http://localhost:8080/assets/cell.png:1 
            
            
    Failed to load resource: the server responded with a status of 404 (File not found)Understand this errorAI
    http://localhost:8080/assets/numbers.png:1 
            
            
    Failed to load resource: the server responded with a status of 404 (File not found)Understand this errorAI
    http://localhost:8080/assets/background.png


Creame las imagenes con estas caracteristicas:
    cell.png
    Especificaciones:
    - Tamaño: 64x64 píxeles
    - Fondo: blanco (#FFFFFF)
    - Borde: negro (#000000, 2px)
    - Formato: PNG con transparencia
    - Uso: Esta imagen será la base para cada celda del Sudoku

    numbers.png
    Especificaciones:
    - Tamaño total: 576x64 píxeles
    - Cada número: 64x64 píxeles
    - Distribución: 9 números en fila (1-9)
    - Color de números: negro (#000000)
    - Fuente recomendada: Arial o Sans-serif, negrita
    - Tamaño de fuente: 32px
    - Fondo: transparente
    - Formato: PNG con transparencia
    - Uso: Spritesheet para todos los números del juego

    background.png
    Especificaciones:
    - Tamaño: 800x600 píxeles (para coincidir con tu config actual)
    - Color base: blanco (#FFFFFF)
    - Color de fondo: gris muy claro (#F0F0F0)
    - Patrón opcional: grid sutil o textura suave
    - Formato: PNG
    - Uso: Fondo general del juego

## Prompt 5
    Corregi el estilo para los botones validar y reinciar, estan mal ubicados dentro del tablero y cuando selecionas un cuadro para ingresar un numero el valor se inserta en otra celda y no en la seleccionada