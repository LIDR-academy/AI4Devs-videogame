# Breakout Arcade

Un juego de Breakout clásico desarrollado con HTML, CSS y JavaScript puro para navegadores web.

## Descripción

Breakout es un juego arcade clásico donde el jugador controla una pala en la parte inferior de la pantalla y debe destruir todos los ladrillos en la parte superior haciendo rebotar una pelota. El juego incluye:

- Mecánica de rebote realista
- Sistema de puntuación avanzado con combos
- Vidas múltiples
- Sistema completo de 10 niveles
- Ladrillos especiales con comportamientos únicos
- Sistema de powerups con efectos positivos y negativos
- Sistema de combo para multiplicar puntos
- Efectos visuales mejorados (colisiones, animaciones, puntuaciones flotantes)
- Sistema de pausa
- Efectos visuales y sonoros

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- No requiere instalación adicional

## Cómo jugar

1. Clona o descarga este repositorio.
2. Abre el archivo `index.html` en tu navegador web.
3. Haz clic en el botón "JUGAR" para acceder a la selección de niveles.
4. Selecciona un nivel para comenzar a jugar.
5. Utiliza las teclas de flecha izquierda y derecha (o el ratón) para mover la pala.
6. Pausa el juego con la tecla "P" o haciendo clic en el canvas.
7. Atrapa los powerups que caen de los ladrillos destruidos para obtener ventajas.
8. Intenta romper ladrillos rápidamente para mantener combos y multiplicar puntos.
9. Si necesitas abandonar la partida, puedes usar el botón "SALIR" en la pantalla de juego.
10. Intenta mantener la pelota en juego y destruir todos los ladrillos.

## Características

- **Mecánica del juego**: Pelota que rebota en paredes, pala y ladrillos con física realista.
- **Control del jugador**: Usa las teclas de flecha (← →) o el ratón para mover la pala.
- **Sistema de pausa**: Pausa el juego con la tecla "P" o clic en la pantalla.
- **Botón de salida**: Abandona la partida actual y vuelve al menú principal en cualquier momento.
- **Sistema de puntuación**: 
  - Puntos base por destruir ladrillos (10-20 puntos según tipo)
  - Bonificación por rebote en la pala (1 punto)
  - Sistema de combo que multiplica los puntos
  - Puntuaciones flotantes que muestran visualmente los puntos ganados
- **Sistema de combo**: 
  - Multiplica los puntos al romper ladrillos en rápida sucesión
  - Aumenta con cada ladrillo destruido en menos de 2 segundos
  - Se muestra en pantalla con efectos visuales especiales
  - Se reinicia si pasan más de 2 segundos sin destruir un ladrillo
- **Vidas**: El jugador tiene 3 vidas. Pierde una vida cuando la pelota cae por debajo de la pala.
- **Condición de victoria**: Destruir todos los ladrillos destructibles en el nivel.
- **Sistema de niveles**: 10 niveles diferentes con dificultad progresiva.
- **Ladrillos especiales**:
  - **Normales**: Se destruyen con un golpe. Otorgan 10 puntos.
  - **Indestructibles**: No se rompen, solo rebotan la pelota. Aparecen con una "X" blanca.
  - **Explosivos**: Destruyen los ladrillos cercanos al romperse. Otorgan 20 puntos. Marcados con un círculo blanco.
  - **Regenerativos**: Se regeneran después de 5 segundos. Otorgan 15 puntos. Marcados con un cuadrado blanco.
  - **Móviles**: Cambian de posición aleatoriamente cada 2 segundos. Otorgan 15 puntos. Marcados con una flecha blanca.
- **Sistema de powerups**:
  - **Pala Grande (G)**: Color naranja. Aumenta el tamaño de la pala en un 50% durante 8 segundos.
  - **Pala Pequeña (P)**: Color rojo. Reduce el tamaño de la pala en un 30% durante 8 segundos (efecto negativo).
  - **Pelota Lenta (L)**: Color azul. Reduce la velocidad de la pelota en un 30% durante 8 segundos.
  - **Pelota Rápida (R)**: Color rosa. Aumenta la velocidad de la pelota en un 30% durante 8 segundos (efecto negativo).
  - **Vida Extra (+)**: Color verde. Otorga una vida adicional al jugador.
- **Efectos visuales mejorados**: 
  - Efectos de colisión que muestran un destello cuando la pelota golpea
  - Puntuación flotante que aparece al destruir ladrillos
  - Indicadores visuales de powerups activos
  - Animaciones en los botones y elementos de la interfaz
  - Efectos de pulso en el nivel actual
- **Diferentes estados del juego**: Pantalla de inicio, selección de nivel, juego, game over y victoria.
- **Efectos de sonido**: Incluye sonidos para rebotes, destrucción de ladrillos, explosiones, regeneración, movimiento, pausa, victoria y derrota.

## Estructura del proyecto

```
breakout-LBN/
├── index.html          # Archivo HTML principal
├── css/                # Estilos CSS
│   └── styles.css      # Estilos del juego
├── js/                 # Archivos JavaScript
│   ├── juego.js        # Lógica principal del juego
│   └── niveles.js      # Definición de los 10 niveles
└── sonidos/            # Efectos de sonido
    ├── rebote.mp3      # Sonido de rebote
    ├── romper.mp3      # Sonido de destrucción de ladrillos
    ├── explosion.mp3   # Sonido de ladrillos explosivos
    ├── regeneracion.mp3# Sonido de ladrillos regenerativos
    ├── movimiento.mp3  # Sonido de ladrillos móviles
    ├── pausa.mp3       # Sonido de pausa/reanudar
    ├── victoria.mp3    # Sonido de victoria
    ├── derrota.mp3     # Sonido de derrota
    └── perderVida.mp3  # Sonido de pérdida de vida
```

## Sistema de niveles

El juego incluye 10 niveles diferentes con dificultad progresiva:

1. **Nivel 1**: Ladrillos normales, introducción básica.
2. **Nivel 2**: Introduce ladrillos indestructibles en posiciones específicas.
3. **Nivel 3**: Introduce ladrillos explosivos que destruyen los ladrillos cercanos.
4. **Nivel 4**: Introduce ladrillos regenerativos que reaparecen después de un tiempo.
5. **Nivel 5**: Introduce ladrillos móviles que cambian de posición aleatoriamente.
6. **Nivel 6**: Patrón más complejo con ladrillos indestructibles.
7. **Nivel 7**: Patrón más complejo con ladrillos explosivos.
8. **Nivel 8**: Patrón más complejo con ladrillos regenerativos.
9. **Nivel 9**: Patrón más complejo con ladrillos móviles.
10. **Nivel 10**: Nivel final con mezcla de todos los tipos de ladrillos.

Todos los niveles están disponibles desde el inicio. Los niveles completados se marcan con un color verde y un símbolo de verificación para facilitar el seguimiento del progreso. El nivel actual se destaca con un color naranja y una animación de pulso.

## Sistema de powerups

Los powerups aparecen aleatoriamente cuando destruyes un ladrillo normal (15% de probabilidad). Caen desde la posición del ladrillo y deben ser atrapados con la pala para activarlos:

- **Pala Grande (G)**: Color naranja. Aumenta el ancho de la pala en un 50% durante 8 segundos.
- **Pala Pequeña (P)**: Color rojo. Reduce el ancho de la pala en un 30% durante 8 segundos (efecto negativo).
- **Pelota Lenta (L)**: Color azul. Reduce la velocidad de la pelota en un 30% durante 8 segundos.
- **Pelota Rápida (R)**: Color rosa. Aumenta la velocidad de la pelota en un 30% durante 8 segundos (efecto negativo).
- **Vida Extra (+)**: Color verde. Otorga una vida adicional al jugador.

Al atrapar un powerup, se muestra un mensaje en pantalla indicando el efecto activado. Los powerups tienen una duración limitada (excepto Vida Extra) y solo puede estar activo un powerup a la vez.

## Sistema de combo

El juego incorpora un sistema de combo que multiplica los puntos obtenidos:

- Cada ladrillo destruido inicia o continúa un combo.
- Si destruyes otro ladrillo en menos de 2 segundos, el combo aumenta.
- El valor del combo multiplica los puntos base obtenidos por cada ladrillo.
- Los combos se muestran visualmente en la pantalla (ejemplo: "COMBO x3").
- El combo se reinicia si pasan más de 2 segundos sin destruir un ladrillo.
- El valor del combo aparece en pantalla para que puedas seguir tu progreso.

Este sistema premia el juego rápido y preciso, permitiendo acumular puntuaciones mucho más altas.

## Efectos visuales

El juego incluye varios efectos visuales para mejorar la experiencia:

- **Efectos de colisión**: Destellos que aparecen cuando la pelota golpea paredes, pala o ladrillos.
- **Puntuaciones flotantes**: Números que muestran los puntos ganados y se desvanecen gradualmente.
- **Indicadores de combo**: Textos que aparecen cuando se logra un combo.
- **Animaciones de botones**: Efectos de escala y sombra al pasar el cursor.
- **Marcadores de nivel**: El nivel actual parpadea con una animación de pulso.
- **Efectos en ladrillos especiales**: Marcas visuales que identifican cada tipo de ladrillo.
- **Powerups animados**: Los powerups caen con un diseño distintivo y una letra identificativa.

## Personalización

Puedes personalizar el juego modificando las siguientes configuraciones en los archivos `js/juego.js` y `js/niveles.js`:

- Velocidad de la pelota y la pala
- Tamaño y apariencia de los elementos
- Disposición y tipos de ladrillos en cada nivel
- Comportamiento de los ladrillos especiales
- Tiempos de regeneración y movimiento
- Frecuencia y duración de los powerups
- Tiempos para el sistema de combo
- Probabilidad de aparición de powerups
- Efectos sonoros y visuales

## Seguridad

Este proyecto implementa buenas prácticas de seguridad siguiendo las recomendaciones de OWASP:

- No utiliza eval() ni otras funciones potencialmente peligrosas
- Manipula correctamente los eventos del DOM
- No almacena información sensible
- Utiliza rutas relativas seguras

## Contribuciones

Las contribuciones son bienvenidas. Para proponer cambios:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la licencia MIT. Ver el archivo LICENSE para más detalles. 