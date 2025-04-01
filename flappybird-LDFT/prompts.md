
# Prompt1

Desarrolla un juego Tres en ralla completo en JavaScript que funcione en un navegador web. El juego debe estar completamente integrado en un único archivo HTML, utilizando JavaScript y CSS en línea para simplificarlo. A continuación, se detallan los requisitos y la estructura del juego:


# Flappy Bird - Especificaciones Técnicas

## 📌 Requisitos Técnicos
- **Lenguajes:** HTML, CSS y JavaScript
- **Entorno de ejecución:** Navegador web moderno
- **Interacciones:** Teclado (`keydown` para saltar)
- **Motor gráfico:** Canvas API de JavaScript
- **Persistencia de datos:** No aplica

## 🔧 Componentes
1. **HTML**
   - `<canvas>` para renderizar el juego.
   
2. **CSS**
   - Estilos básicos (`body`, `canvas`).
   - Fondo azul simulando el cielo.

3. **JavaScript**
   - **Lógica del juego**
     - Movimiento del pájaro (gravedad y salto).
     - Generación de tuberías aleatorias.
     - Detección de colisiones.
   - **Dibujado en pantalla**
     - Pájaro amarillo.
     - Tuberías verdes.
   - **Eventos del usuario**
     - Espacio o cualquier tecla para hacer que el pájaro salte.

## 🎮 Funcionalidades
- **Movimiento del pájaro:** Afectado por gravedad, puede saltar con `keydown`.
- **Generación de obstáculos:** Tuberías verdes con espacio aleatorio.
- **Colisiones:** Si el pájaro choca con tuberías o el suelo, el juego termina.
- **Reinicio:** Si el jugador pierde, se puede recargar la página para reiniciar.

## 🎨 Estilo
- **Fondo:** `skyblue` para simular el cielo.
- **Pájaro:** `yellow` en forma de cuadrado.
- **Tuberías:** `green`, se generan con alturas aleatorias.
- **Interfaz minimalista:** Sin texto ni botones adicionales.
