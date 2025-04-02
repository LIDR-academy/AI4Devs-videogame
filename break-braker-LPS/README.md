# Break Braker

## Descripción
Este es un juego clásico de Break Braker (similar a Arkanoid/Breakout) desarrollado con HTML5 Canvas y JavaScript puro. El objetivo es destruir todos los bloques con una pelota que rebota, controlando una barra en la parte inferior de la pantalla.

## Características
- Control de la barra mediante teclado (flechas izquierda/derecha o teclas A/D) y ratón
- Física de rebote realista
- Sistema de puntuación
- Diferentes colores de bloques
- Pantallas de victoria y derrota
- Interfaz de usuario intuitiva

## Cómo jugar
1. Abre el archivo `index.html` en tu navegador favorito.
2. Haz clic en el botón "Iniciar Juego".
3. Presiona la barra espaciadora o haz clic para lanzar la pelota.
4. Controla la barra con el ratón o las teclas de dirección (izquierda/derecha) o A/D.
5. Destruye todos los bloques para ganar.
6. Si la pelota toca el borde inferior, perderás.

## Requisitos técnicos
- Navegador moderno con soporte para HTML5 Canvas (Chrome, Firefox, Safari, Edge)
- No requiere plugins adicionales
- Funciona en diferentes resoluciones de pantalla

## Estructura del proyecto
- `index.html`: Estructura HTML principal
- `styles.css`: Estilos CSS del juego
- `js/main.js`: Punto de entrada principal
- `js/game.js`: Lógica principal del juego
- `js/paddle.js`: Clase para la barra controlada por el jugador
- `js/ball.js`: Clase para la pelota y su física
- `js/block.js`: Clases para los bloques y su gestión

## Mejoras futuras
- Añadir efectos de sonido
- Implementar power-ups
- Añadir varios niveles con diferentes configuraciones de bloques
- Guardar puntuaciones altas localmente 