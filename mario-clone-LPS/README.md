# Super Mario Clone - LPS

Un clon básico de Super Mario desarrollado con Phaser 3.

## Estructura del Proyecto

```
mario-clone-LPS/
├── index.html     # Archivo HTML principal
├── main.js        # Lógica del juego
└── assets/        # Recursos del juego
    ├── images/    # Imágenes y sprites
    └── audio/     # Archivos de sonido
```

## Cómo ejecutar el juego

Para ejecutar el juego, necesitas un servidor web local. Puedes usar uno de los siguientes métodos:

### Opción 1: Usar Python

Si tienes Python instalado, puedes ejecutar un servidor web simple:

Para Python 3:
```
python -m http.server
```

Para Python 2:
```
python -m SimpleHTTPServer
```

Luego abre tu navegador y ve a `http://localhost:8000/mario-clone-LPS/`

### Opción 2: Usar una extensión de VS Code

Si usas Visual Studio Code, puedes instalar la extensión "Live Server" y luego hacer clic derecho en el archivo `index.html` y seleccionar "Open with Live Server".

## Controles

- Flecha Izquierda: Mover a la izquierda
- Flecha Derecha: Mover a la derecha
- Flecha Arriba: Saltar

## Características

- Movimiento tipo plataforma con gravedad y saltos
- Recolección de monedas
- Sistema de puntuación
- Colisiones entre el jugador y las plataformas
- Animaciones básicas del personaje 