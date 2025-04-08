# Prompts para el Juego Jumper Frog

Prompt 1:
Como experto senior en desarrollo de videojuegos con HTML, CSS y JavaScript, crea el juego "Jumper Frog" con las siguientes características:

## Mecánicas del juego
- Un solo nivel con 3 vidas disponibles.
- Se obtiene 1 punto por cada cruce exitoso de la calle.
- Al perder las 3 vidas o completar una cantidad definida de cruces exitosos, el juego termina y la puntuación se reinicia.
- una colisión ocurre cuando la rana toca un vehículo desde cualquier lado.
- La rana debe comenzar en la zona segura de inicio y debe llegar a la zona segura de destino para sumar puntos.
- los vehículos solo pueden circular por los carriles, no por las zonas seguras.
- Aumento progresivo de dificultad: la velocidad de los vehículos incrementa con cada cruce exitoso.

## Elementos del juego
- Rana: debe tener una apariencia de rana, con ojos y patas, estilizada pero y reconocible como rana.
- Vehículos: debe haber 3 tipos distintos, cada uno con ruedas visibles y diferenciados por su tamaño (autobus, vehículo pequeño etc), velocidad, color y diseño.
- Carriles de tráfico: el juego debe incluir 5 carriles con vehículos en movimiento.
- Zonas seguras: una al inicio y otra al final de la calle, donde la rana aparece y donde suma puntos al llegar.
- Sistema de colisiones preciso para detectar cuando la rana es atropellada por un vehículo.

## Requerimientos técnicos y optimización
- Código JavaScript limpio, modular y eficiente, estructurado en funciones reutilizables con buenas practicas SOLID.
- Eliminación eficiente de vehículos cuando salen de la pantalla para optimizar el rendimiento.
- Diseño responsive, adaptado a dispositivos móviles y de escritorio.
- Animaciones CSS y transiciones suaves para mejorar la experiencia visual.
- Buena accesibilidad y controles intuitivos para una experiencia de usuario fluida.

## Estilos y diseño
- Diseños CSS avanzados, con calidad de diseñador senior.
- Animación de salto para la rana al moverse.
- Efectos visuales para colisiones.
- diseño de carriles con apariencia a carretera
- diseño de zona segura con apariencia a prado
- Pantallas de inicio y de Game Over con transiciones suaves.
- Indicadores de vidas y puntuación claramente visibles y bien posicionados.

## Controles y jugabilidad
- Movimiento en 4 direcciones usando las teclas de flechas del teclado.
- Evitar los vehículos para cruzar al otro lado de manera segura.
- Cada cruce exitoso suma puntos, mientras que un choque reduce una vida.
- El juego termina al perder todas las vidas o al completar un número definido de cruces exitosos.

## El juego y el README deben estar completamente en español y explicar claramente cómo jugar y el funcionamiento del código.


Prompt 2:
- Se debe mejorar el diseño de los vehículos, no cumple con las condiciones iniciales
- El prado debe ser de un color diferente a la rana.
- Los límites del tablero deben están bien definidos
- la rana no se puede mover en diagonal

Prompt 3:
- Los vehículos se superponen y no se ven las ruedas claramente
- El diseño CSS son muy básicos, necesitamos un diseño más profesional y atractivo
- El prado se confunde con la rana por los colores similares
- Se debe quitar el límite de 10 puntos para que el juego sea más desafiante
- Los vehículos deben aparecer de manera más dinámica y frecuente

Prompt 4:
- Realizar mejora cuando se pierde la partida, se reinicia el juego y los vehículos no aparecen.
- aumentar la velocidad y frecuencia de los vehículos a medida que aumenta la puntuación hasta máximo x3 de velocidad.
- al iniciar el juego la carretera ya debe tener vehículos.

Prompt 5:
Pausar y reanudar partida no funciona correctamente, revisa a fondo verifica con pruebas unitarias, tener en cuenta buenas prácticas de programación y el rol de senior de videojuegos.

Prompt 6:
Actualizar los diseños vehículos y la rana utilizando SVG, siguiendo estas especificaciones:

Requisitos de Estilo:
- Diseño minimalista y moderno en 2D
- Los elementos deben ser claramente distinguibles entre sí
- Optimizar el código SVG para un tamaño de archivo eficiente
- Usar una paleta de colores consistente con el tema del juego
- Todas las ruedas deben ser círculos sólidos negros
- Los trazos deben ser limpios y precisos
- Mantener una escala consistente entre la rana y los vehículos

Elementos a implementar:

1. Rana:
   - Diseño minimalista y moderno
   - Cuerpo redondeado con proporciones adecuadas
   - Ojos grandes y expresivos
   - Patas claramente definidas
   - Color principal: verde
   - Detalles en verde oscuro

2. Vehículos:
   a. Carro pequeño:
      - Diseño compacto y moderno
      - Color principal: rojo
      - Ventanas con diseño actualizado
      - Ruedas proporcionales

   b. Taxi:
      - Carrocería amarilla clásica
      - Sección de techo distintiva
      - Ventanas con diseño moderno
      - Perfil reconocible de taxi

   c. Ambulancia:
      - Base blanca con acentos turquesa
      - Emblema de cruz roja
      - Diseño de vehículo de emergencia moderno
      - Ventanas con diseño actualizado

   d. Camión:
      - Cabina y sección de carga diferenciadas
      - Esquema de dos colores (azul oscuro y gris azulado)
      - Ruedas proporcionales
      - Perfil rectangular con detalles modernos

Implementación:
1. Ajustar las clases CSS para los nuevos tamaños
2. Mantener la consistencia con el sistema de colisiones actual
3. Asegurar que los vehículos se muevan correctamente en ambos carriles
4. Verificar que las colisiones funcionen con los nuevos diseños

Notas adicionales:
- Los vehículos deben mantener sus velocidades y comportamientos actuales
- El sistema de spawn de vehículos debe funcionar con los nuevos diseños
- Las colisiones deben ser precisas con los nuevos tamaños
- Los vehículos deben verse bien en ambos carriles de cada calle
- La rana debe mantener su capacidad de movimiento y colisiones