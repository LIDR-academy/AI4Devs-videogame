# 🎮 Tetris-DAD

Un juego de Tetris moderno desarrollado con Phaser 3, con una estética retro-futurista y efectos visuales avanzados.

## 🚀 Características

- Interfaz retro-futurista con efectos de scanlines y brillo
- Música y efectos de sonido inmersivos
- Sistema de puntuación y niveles
- Fondos espaciales dinámicos
- Controles intuitivos
- Efectos visuales modernos
- Diseño responsive

## 🛠️ Requisitos Previos

- Navegador web moderno con soporte para WebGL
- Python 3.x (para el servidor de desarrollo)
- Conexión a internet (para cargar fuentes y recursos)

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone [URL-del-repositorio]
cd Tetris-DAD
```

2. Inicia el servidor de desarrollo:
```bash
python server.py
```

3. Abre el juego en tu navegador:
```
http://localhost:8000
```

## 🎮 Controles

- **Flechas Izquierda/Derecha**: Mover pieza horizontalmente
- **Flecha Arriba**: Rotar pieza
- **Flecha Abajo**: Caída suave
- **Espacio**: Caída dura (coloca la pieza instantáneamente)

## 🏗️ Estructura del Proyecto

```
Tetris-DAD/
├── assets/
│   ├── audio/         # Efectos de sonido y música
│   └── images/        # Imágenes y sprites
├── main.js            # Lógica principal del juego
├── index.html         # Página principal
├── server.py          # Servidor de desarrollo
└── README.md          # Documentación
```

## 🎯 Características del Juego

- Sistema de puntuación basado en líneas completadas
- Niveles progresivos con aumento de dificultad
- Efectos visuales para líneas completadas
- Música adaptativa según el nivel
- Sistema de Game Over con reinicio
- Interfaz retro con efectos modernos

## 🔧 Tecnologías Utilizadas

- [Phaser 3](https://phaser.io/phaser3) - Framework de juegos HTML5
- HTML5 y CSS3 para la interfaz
- JavaScript ES6+
- Python (servidor de desarrollo)
- Fuente "Press Start 2P" para estética retro

## 🎨 Personalización

El juego puede ser personalizado modificando las siguientes variables en `main.js`:

- `gridSize`: Tamaño de cada celda del grid
- `boardWidth`: Número de celdas horizontales
- `boardHeight`: Número de celdas verticales
- `fallTime`: Tiempo base para la caída de piezas
- Colores y formas de los Tetriminos en el objeto `TETRIMINOS`