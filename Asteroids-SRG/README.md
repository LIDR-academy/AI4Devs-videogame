# Asteroids - Réplica del Juego Clásico

Una recreación fiel del clásico arcade Asteroids (1979) de Atari, implementada con HTML5 Canvas, CSS y JavaScript puro.

## Descripción

Este proyecto recrea el juego original Asteroids con todas sus mecánicas principales:

- Nave del jugador con rotación, aceleración con inercia y disparos
- Asteroides que se dividen en fragmentos más pequeños al ser destruidos
- OVNIs que aparecen aleatoriamente y disparan al jugador
- Sistema de niveles con dificultad progresiva
- Estilo visual minimalista en blanco y negro, similar al juego original

## Controles

- **Flechas izquierda/derecha**: Rotar la nave
- **Flecha arriba**: Propulsión
- **Espacio**: Disparar
- **H**: Hiperespacio (teletransporte aleatorio)
- **P**: Pausar/reanudar el juego

### Controles táctiles (dispositivos móviles)
- **Tocar en la izquierda**: Rotar a la izquierda
- **Tocar en la derecha**: Rotar a la derecha
- **Tocar en la parte superior**: Propulsión
- **Doble toque**: Disparar
- **Toque largo**: Hiperespacio

## Características

- **Detección de colisiones precisa**
- **Física realista** con inercia y movimiento
- **Efectos de partículas** para explosiones y propulsión
- **Mecánica de hiperespacio** que permite teletransportarse a una posición aleatoria
- **OVNIs inteligentes** que aparecen periódicamente y disparan
- **Dificultad progresiva** con más asteroides y mayor velocidad en niveles avanzados
- **Diseño responsivo** adaptado a diferentes tamaños de pantalla

## Desarrollo Técnico

El juego está desarrollado completamente con tecnologías web estándar:

- **HTML5**: Estructura básica y elemento Canvas para renderizado
- **CSS3**: Estilos minimalistas para la interfaz
- **JavaScript (ES6+)**: Toda la lógica del juego

### Implementación

- Sistema de detección de colisiones basado en círculos
- Implementación de física para simular inercia y movimiento realista
- Bucle de juego optimizado con requestAnimationFrame()
- Sistema de generación procedural para los asteroides
- Código modular y orientado a objetos

## Pruebas

El juego ha sido probado en los siguientes navegadores:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

También se ha optimizado para dispositivos móviles con controles táctiles.

## Ejecución

Simplemente abre el archivo `index.html` en tu navegador favorito para comenzar a jugar.

## Créditos

Basado en el juego original Asteroids (1979) de Atari, creado por Lyle Rains y Ed Logg.

---

Proyecto desarrollado como parte del curso "AI4Devs". 