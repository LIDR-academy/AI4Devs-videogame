# Tetris AFR - Edición 3D

Una implementación moderna del clásico juego Tetris utilizando tecnologías web estándar (HTML5, CSS3 y JavaScript), con efectos visuales 3D y sistema de puntuaciones altas.

## Características

- Diseño moderno y responsive con efectos 3D
- Controles intuitivos para teclado y dispositivos móviles
- Sistema de puntuación, niveles y ranking de mejores puntuaciones
- Visualización de la siguiente pieza con efectos visuales
- Animaciones fluidas y efectos visuales modernos
- Previsualización de la posición de caída de la pieza
- Sistema de almacenamiento de las 5 mejores puntuaciones
- Interfaz de usuario mejorada con iconos y efectos visuales

## Controles

### Teclado

- ←: Mover pieza a la izquierda
- →: Mover pieza a la derecha
- ↓: Mover pieza hacia abajo más rápido
- ↑: Rotar pieza
- Espacio: Caída instantánea (hard drop)

### Dispositivos Móviles

- Botones en pantalla para todas las acciones

## Sistema de Puntuación

### Puntos por líneas

- 1 línea: 40 × nivel
- 2 líneas: 100 × nivel
- 3 líneas: 300 × nivel
- 4 líneas: 1200 × nivel

### Niveles

- El nivel incrementa cada 1000 puntos
- A mayor nivel, mayor velocidad de caída de las piezas

### Ranking de Puntuaciones

- Se guardan las 5 mejores puntuaciones
- Las puntuaciones se almacenan localmente en el navegador
- Cada puntuación registra el nombre del jugador, los puntos y la fecha

## Tecnologías Utilizadas

- HTML5 Canvas para el renderizado con efectos 3D
- CSS3 para estilos, animaciones y transformaciones 3D
- JavaScript ES6+ para la lógica del juego
- LocalStorage para almacenar las puntuaciones
- Diseño responsive para compatibilidad móvil
- Iconos de Font Awesome para una interfaz más intuitiva

## Características Técnicas

- Efectos visuales 3D mediante transformaciones CSS
- Renderizado avanzado con sombras y efectos de iluminación
- Sistema de colisiones preciso
- Navegación fluida con teclado y controles táctiles
- Previsualización de la posición de caída de las piezas
- Efectos visuales al completar líneas y subir de nivel
- Animación suave para mejorar la experiencia de juego
- Interfaz moderna y minimalista con retroalimentación visual

## Estructura del Proyecto

```
Tetris-AFR/
├── index.html      # Estructura del juego
├── styles.css      # Estilos y diseño visual con efectos 3D
├── script.js       # Lógica del juego y sistema de puntuaciones
└── README.md       # Documentación
```

## Cómo Jugar

1. Abre `index.html` en tu navegador web
2. Presiona el botón "Iniciar" para comenzar
3. Usa los controles de teclado o los botones en pantalla para jugar
4. Completa líneas para ganar puntos y subir de nivel
5. Al terminar el juego, si tu puntuación es alta, podrás guardar tu nombre
6. ¡Intenta conseguir la mayor puntuación posible y entrar en el Top 5!

## Desarrollo

El juego está construido siguiendo principios de programación orientada a objetos, con dos clases principales:

- `Tetromino`: Maneja la lógica de las piezas del Tetris
- `TetrisGame`: Controla el estado del juego, la lógica principal y el sistema de puntuaciones

## Requisitos del Sistema

- Navegador web moderno con soporte para:
  - HTML5 Canvas
  - CSS3 con transformaciones 3D
  - JavaScript ES6+
  - LocalStorage

## Contribuir

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una nueva rama para tus cambios
3. Realiza tus modificaciones
4. Envía un pull request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.
