# Battleship 3D - Juego de Hundir la Flota

Un juego de estrategia basado en el clásico "Battleship" (Hundir la Flota) con una perspectiva 3D isométrica. El juego está desarrollado usando HTML, CSS y JavaScript puro.

## Características

- ✅ Vista isométrica 3D lograda con CSS3 y JavaScript
- ✅ Dos tableros: uno para el jugador y otro para la IA
- ✅ Colocación de barcos manual o aleatoria antes del inicio del juego
- ✅ Mecánica de turnos entre el jugador y la IA
- ✅ IA que persigue barcos una vez que los encuentra
- ✅ Efectos visuales de explosión, salpicadura y agua
- ✅ Detección de victoria/derrota y pantalla final con resultados
- ✅ Efectos de sonido para disparos, impactos y finales

## Tecnologías utilizadas

- HTML5 para la estructura del juego
- CSS3 con transformaciones para la perspectiva isométrica
- JavaScript puro para toda la lógica del juego
- Web Audio API para efectos de sonido
- Cargador OBJ básico para los modelos 3D de barcos

## Estructura del proyecto

```
battleship-MAGH/
│── index.html  → Punto de entrada principal
│── game.js     → Lógica del juego, turnos y ataques
│── ui.js       → Control de la interfaz y efectos visuales
│── objloader.js → Cargador de modelos 3D en formato OBJ
│── styles.css  → Estilos y efectos isométricos
│── assets/
│   ├── ships/  → Modelos 3D en formato OBJ
│   ├── sounds/ → Sonidos de explosión y agua
│   ├── images/ → Texturas para el agua y los barcos
```

## Cómo jugar

1. Abre `index.html` en un navegador web moderno (Chrome, Firefox, Edge, Safari)
2. Coloca tus barcos en el tablero de dos formas:
   - Selecciona un barco y haz clic en el tablero para colocarlo
   - Usa el botón "Colocación Aleatoria" para posicionar todos los barcos automáticamente
3. Presiona "Iniciar Juego" para comenzar la partida
4. Ataca el tablero enemigo haciendo clic en las casillas
5. La IA atacará automáticamente después de tu turno
6. El juego termina cuando todos los barcos de un jugador son hundidos

## Requisitos

- Navegador web moderno con soporte para CSS3 Transforms y JavaScript ES6
- Recomendado habilitar el sonido para una mejor experiencia

## Barcos disponibles

- Portaviones (5 casillas)
- Acorazado (4 casillas)
- Crucero (3 casillas)
- Submarino (3 casillas)
- Destructor (2 casillas)

## Desarrollo

Para modificar o ampliar el juego, puedes editar los siguientes archivos:

- `styles.css` para cambiar la apariencia visual
- `game.js` para modificar la lógica del juego
- `ui.js` para ajustar los efectos visuales
- Añadir nuevos modelos OBJ en la carpeta `assets/ships/`
- Reemplazar los efectos de sonido en `assets/sounds/`

## Créditos

Desarrollado como proyecto de demostración para ejemplificar el uso de CSS3 y JavaScript en la creación de juegos con perspectiva isométrica sin usar bibliotecas externas. 