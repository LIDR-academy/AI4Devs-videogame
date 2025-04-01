# Luz Roja, Luz Verde

Un juego minimalista inspirado en el popular juego infantil "Luz Roja, Luz Verde", implementado con Phaser.js.

## Descripción

En este juego, controlas a un personaje (representado como una pelotita) que debe avanzar desde la línea de inicio (izquierda) hasta la meta (derecha). Sin embargo, hay una regla crucial: solo puedes moverte cuando la luz está verde. Si te mueves cuando la luz está roja, serás eliminado.

## Cómo jugar

1. **Objetivo**: Llegar a la meta (línea roja a la derecha) sin ser eliminado.
2. **Controles**:
   - Mantén presionada la tecla **ESPACIO** para acelerar gradualmente.
   - Suelta la tecla **ESPACIO** para frenar de forma gradual (inercia).

3. **Mecánicas**:
   - **Inercia**: El personaje acelera y frena gradualmente, simulando la física del movimiento real.
   - **Semáforo**: Un círculo en la parte superior de la pantalla indica si puedes moverte (verde) o debes detenerte (rojo).
   - **Audio**: La música suena cuando la luz está verde y se detiene cuando cambia a roja.
   - **Trampa de tiempo**: La luz cambia a roja 0.2 segundos después de que la música se detiene.
   - **Eliminación**: Serás eliminado si te mueves cuando la luz está roja.

4. **Reinicio**: Presiona la tecla **R** para reiniciar el juego después de ganar o ser eliminado.

## Características implementadas

- Escenario básico con línea de inicio (izquierda) y meta (derecha)
- Personaje controlable con la barra espaciadora
- Sistema de inercia con aceleración y frenado gradual
- Sistema de semáforo con luz roja/verde
- Música que indica cuando puedes moverte
- Trampa de tiempo entre la música y el cambio visual
- Detección de movimiento durante luz roja
- Efectos visuales para ganar y perder
- Sistema de reinicio

## Características pendientes
- Implementación de sonidos adicionales
- Minijuego de equilibrio al detenerse
- Bots con IA básica

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Phaser.js (framework para juegos HTML5)

## Cómo ejecutar

1. Simplemente abre el archivo `index.html` en un navegador moderno.
2. El juego debería cargarse automáticamente.

¡Buena suerte y que gane el mejor! 