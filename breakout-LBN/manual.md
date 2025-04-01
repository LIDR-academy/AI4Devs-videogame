# Manual de Usuario - Breakout Arcade

Este manual proporciona toda la información necesaria para disfrutar al máximo del juego Breakout Arcade.

## Índice
1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Controles](#controles)
4. [Reglas del juego](#reglas-del-juego)
5. [Sistema de niveles](#sistema-de-niveles)
6. [Tipos de ladrillos](#tipos-de-ladrillos)
7. [Sistema de powerups](#sistema-de-powerups)
8. [Sistema de combo](#sistema-de-combo)
9. [Sistema de pausa](#sistema-de-pausa)
10. [Elementos del juego](#elementos-del-juego)
11. [Estados del juego](#estados-del-juego)
12. [Consejos y trucos](#consejos-y-trucos)
13. [Solución de problemas](#solución-de-problemas)

---

## Introducción

Breakout es un juego arcade clásico donde controlas una pala en la parte inferior de la pantalla para hacer rebotar una pelota y destruir todos los ladrillos en la parte superior. El objetivo es eliminar todos los ladrillos sin dejar caer la pelota. Esta versión moderna incluye múltiples niveles, tipos especiales de ladrillos, powerups, un sistema de combo y efectos visuales para una experiencia más inmersiva.

---

## Instalación

### Requisitos del sistema
- Navegador web moderno (Chrome, Firefox, Safari o Edge)
- JavaScript habilitado
- Conexión a internet (solo para la descarga inicial)

### Pasos para jugar
1. Descarga o clona el repositorio del juego
2. Descomprime el archivo si es necesario
3. Abre el archivo `index.html` en tu navegador web
4. Haz clic en el botón "JUGAR" para comenzar
5. Selecciona el nivel que deseas jugar

---

## Controles

El juego permite varios métodos de control:

### Movimiento de la pala
- **Flecha izquierda (←)**: Mover la pala hacia la izquierda
- **Flecha derecha (→)**: Mover la pala hacia la derecha
- **Mover el ratón**: La pala seguirá la posición horizontal del cursor del ratón

### Pausa
- **Tecla P**: Pausar/reanudar el juego
- **Clic con el ratón**: Pausar/reanudar el juego durante la partida

### Salir del juego
- **Botón SALIR**: Permite terminar la partida actual y volver a la pantalla de inicio en cualquier momento.

### Navegación por menús
- **Botones en pantalla**: Utiliza los botones para navegar entre menús, iniciar partida, seleccionar nivel o reiniciar el juego.

---

## Reglas del juego

1. **Objetivo principal**: Destruir todos los ladrillos destructibles en pantalla haciendo que la pelota rebote contra ellos.
2. **Vidas**: Comienzas con 3 vidas en cada nivel.
3. **Pérdida de vida**: Si la pelota cae por debajo de la pala, perderás una vida.
4. **Fin del juego**: El juego termina cuando:
   - Destruyes todos los ladrillos destructibles (¡victoria!)
   - Pierdes todas tus vidas (game over)
5. **Puntuación**:
   - Ladrillos normales: 10 puntos × valor del combo
   - Ladrillos explosivos: 20 puntos × valor del combo
   - Ladrillos regenerativos: 15 puntos × valor del combo
   - Ladrillos móviles: 15 puntos × valor del combo
   - Ladrillos destruidos por explosión: 5 puntos
   - Rebote en la pala: 1 punto
6. **Powerups**: Aparecen aleatoriamente al destruir ladrillos normales y te ofrecen ventajas temporales.
7. **Combos**: Romper ladrillos rápidamente en sucesión aumenta el multiplicador de puntos.

---

## Sistema de niveles

El juego cuenta con 10 niveles diferentes, cada uno con patrones y comportamientos de ladrillos específicos:

1. **Nivel 1**: Nivel básico con ladrillos normales.
2. **Nivel 2**: Introduce ladrillos indestructibles.
3. **Nivel 3**: Introduce ladrillos explosivos.
4. **Nivel 4**: Introduce ladrillos regenerativos.
5. **Nivel 5**: Introduce ladrillos móviles.
6. **Nivel 6**: Patrón más complejo con ladrillos indestructibles.
7. **Nivel 7**: Patrón más complejo con ladrillos explosivos.
8. **Nivel 8**: Patrón más complejo con ladrillos regenerativos.
9. **Nivel 9**: Patrón más complejo con ladrillos móviles.
10. **Nivel 10**: Nivel final con todos los tipos de ladrillos.

### Acceso a los niveles
- Todos los niveles están disponibles desde el inicio.
- Puedes jugar cualquier nivel en cualquier orden.
- Los niveles completados se marcan con un color verde y un símbolo de verificación.
- El nivel actual se destaca con un color naranja y una animación de pulso.

### Pantalla de selección de nivel
- Selecciona cualquier nivel haciendo clic en su botón correspondiente.
- Puedes volver a jugar niveles ya completados para mejorar tu puntuación.
- La pantalla muestra claramente qué niveles has completado para llevar un seguimiento de tu progreso.

---

## Tipos de ladrillos

El juego incluye varios tipos de ladrillos con comportamientos especiales:

### Ladrillos normales
- **Apariencia**: Colores variados según la fila (rojo, naranja, amarillo, verde, azul)
- **Comportamiento**: Se destruyen al ser golpeados por la pelota
- **Puntuación**: 10 puntos (multiplicados por el valor del combo)
- **Características especiales**: Pueden generar powerups aleatoriamente al ser destruidos (15% de probabilidad)

### Ladrillos indestructibles
- **Apariencia**: Gris con una "X" blanca
- **Comportamiento**: No pueden ser destruidos, solo rebotan la pelota
- **Puntuación**: 0 puntos
- **Características especiales**: Sirven como obstáculos permanentes que dificultan el acceso a otros ladrillos

### Ladrillos explosivos
- **Apariencia**: Naranja/rojo con un círculo blanco en el centro
- **Comportamiento**: Al ser destruidos, hacen explotar los ladrillos cercanos (excepto los indestructibles)
- **Radio de explosión**: 2 ladrillos en todas direcciones
- **Puntuación**: 20 puntos (multiplicados por el valor del combo) + 5 por cada ladrillo adicional destruido
- **Efecto visual**: Efecto de colisión naranja/rojo al ser impactados

### Ladrillos regenerativos
- **Apariencia**: Verde con un cuadrado blanco en el centro
- **Comportamiento**: Se regeneran 5 segundos después de ser destruidos
- **Puntuación**: 15 puntos (multiplicados por el valor del combo)
- **Efecto visual**: Efecto de colisión verde al ser impactados

### Ladrillos móviles
- **Apariencia**: Azul con una flecha blanca
- **Comportamiento**: Cambian de posición aleatoriamente cada 2 segundos
- **Puntuación**: 15 puntos (multiplicados por el valor del combo)
- **Efecto visual**: Efecto de colisión azul al ser impactados

---

## Sistema de powerups

Los powerups aparecen aleatoriamente cuando rompes un ladrillo normal (15% de probabilidad). Caen desde la posición del ladrillo y deben ser atrapados con la pala para activarlos.

### Tipos de powerups

#### Powerups positivos
- **Pala Grande (G)**:
  - **Apariencia**: Rectángulo naranja con la letra "G"
  - **Efecto**: Aumenta el tamaño de la pala en un 50%
  - **Duración**: 8 segundos
  - **Efecto visual**: Mensaje "¡PALA GRANDE!" al activarse

- **Pelota Lenta (L)**:
  - **Apariencia**: Rectángulo azul con la letra "L"
  - **Efecto**: Reduce la velocidad de la pelota en un 30%
  - **Duración**: 8 segundos
  - **Efecto visual**: Mensaje "¡PELOTA LENTA!" al activarse

- **Vida Extra (+)**:
  - **Apariencia**: Rectángulo verde con el símbolo "+"
  - **Efecto**: Otorga una vida adicional
  - **Duración**: Permanente
  - **Efecto visual**: Mensaje "¡VIDA EXTRA!" al activarse

#### Powerups negativos
- **Pala Pequeña (P)**:
  - **Apariencia**: Rectángulo rojo con la letra "P"
  - **Efecto**: Reduce el tamaño de la pala en un 30%
  - **Duración**: 8 segundos
  - **Efecto visual**: Mensaje "¡PALA PEQUEÑA!" al activarse

- **Pelota Rápida (R)**:
  - **Apariencia**: Rectángulo rosa con la letra "R"
  - **Efecto**: Aumenta la velocidad de la pelota en un 30%
  - **Duración**: 8 segundos
  - **Efecto visual**: Mensaje "¡PELOTA RÁPIDA!" al activarse

### Funcionamiento
- Solo puede estar activo un powerup a la vez
- Si atrapas un nuevo powerup mientras otro está activo, el anterior se cancela
- Al finalizar el tiempo de duración, la pala o la pelota vuelven a su estado normal
- Los powerups caen a una velocidad constante y desaparecen si salen de la pantalla

---

## Sistema de combo

El juego incluye un sistema de combo que multiplica los puntos obtenidos por romper ladrillos:

### Cómo funcionan los combos
- Cada vez que rompes un ladrillo, se inicia o continúa un combo
- Si rompes otro ladrillo dentro de los 2 segundos siguientes, el combo aumenta en 1
- El valor del combo multiplica los puntos base de cada ladrillo
- Ejemplo: Un ladrillo normal otorga 10 puntos. Con un combo x3, otorgará 30 puntos

### Visualización
- El combo se indica en pantalla con un texto flotante: "COMBO x2", "COMBO x3", etc.
- El texto aparece sobre el ladrillo que se acaba de romper
- Cuanto mayor sea el combo, más destacado será el efecto visual

### Reinicio del combo
- El combo se reinicia a 1 si pasan más de 2 segundos sin romper un ladrillo
- También se reinicia si pierdes una vida

### Estrategia
- Intenta romper ladrillos en rápida sucesión para mantener el combo
- Prioriza situaciones donde puedas golpear varios ladrillos rápidamente
- Los ladrillos explosivos son excelentes para aumentar el combo, ya que destruyen varios ladrillos a la vez

---

## Sistema de pausa

Durante la partida, puedes pausar el juego de dos formas:

1. **Presionando la tecla P**
2. **Haciendo clic con el ratón en cualquier parte del área de juego**

Cuando el juego está en pausa:
- Se muestra un mensaje de "JUEGO EN PAUSA" en la pantalla
- Se aplica un overlay semi-transparente sobre el área de juego
- La pelota y todos los elementos dejan de moverse
- El tiempo y las animaciones se detienen
- Los temporizadores de powerups y regeneración de ladrillos se pausan

Para reanudar el juego, simplemente:
- Presiona la tecla P nuevamente, o
- Haz clic con el ratón en cualquier parte del área de juego o del overlay de pausa

La función de pausa es útil cuando necesitas hacer una breve pausa durante la partida.

## Salir del juego

En cualquier momento durante la partida, puedes utilizar el botón **SALIR** ubicado en la parte superior de la pantalla de juego para:

- Terminar inmediatamente la partida actual
- Volver a la pantalla de inicio

Ten en cuenta que al usar esta función:
- No se guardará tu progreso en el nivel actual
- Tu puntuación de la partida se perderá
- Tendrás que comenzar desde el principio si decides jugar nuevamente

Esta opción es útil cuando deseas abandonar una partida y volver al menú principal sin tener que esperar a perder todas las vidas.

---

## Elementos del juego

### Pelota
- Rebota en paredes, pala y ladrillos con física realista
- Cambia de dirección dependiendo de dónde golpee en la pala
- Aumenta ligeramente su velocidad con el tiempo
- Velocidad inicial incrementa en niveles superiores
- Muestra efectos visuales de colisión al golpear elementos

### Pala (controlada por el jugador)
- Se mueve horizontalmente en la parte inferior de la pantalla
- No puede salir de los límites del área de juego
- La posición de impacto de la pelota influye en el ángulo de rebote
- Puede cambiar de tamaño con los powerups correspondientes
- Sirve para atrapar powerups que caen

### Ladrillos
- Organizados en filas y columnas en la parte superior
- Diferentes tipos y comportamientos según el nivel
- Cada nivel tiene una disposición única de ladrillos
- Muestran marcas visuales que indican su tipo especial
- Generan puntuaciones flotantes al ser destruidos

### Powerups
- Caen desde la posición de los ladrillos normales destruidos
- Tienen formas y colores diferentes según su tipo
- Muestran una letra identificativa en su centro
- Requieren ser atrapados con la pala para activarse

### Indicadores en pantalla
- **Puntuación**: Muestra los puntos acumulados
- **Nivel**: Indica el nivel actual
- **Vidas**: Muestra el número de vidas restantes
- **Tipo de ladrillo**: Muestra el tipo especial de ladrillo del nivel actual
- **Efectos visuales**: Puntuaciones flotantes, efectos de colisión, indicadores de combo

---

## Estados del juego

El juego tiene cinco estados principales:

1. **Pantalla de inicio**
   - Muestra el título del juego
   - Botón "JUGAR" para acceder a la selección de niveles

2. **Selección de nivel**
   - Muestra los niveles disponibles
   - Niveles completados marcados con color verde y símbolo de verificación
   - Nivel actual destacado con color naranja y animación de pulso
   - Botón para volver a la pantalla de inicio

3. **En juego**
   - El juego está activo
   - La pelota rebota y el jugador controla la pala
   - Se muestran puntuación, nivel, vidas y tipo de ladrillo
   - Powerups y efectos visuales activos
   - Se puede pausar el juego

4. **Game Over**
   - Se muestra cuando pierdes todas las vidas
   - Muestra tu puntuación final
   - Botones para reiniciar o volver a la selección de niveles

5. **Victoria**
   - Se muestra cuando destruyes todos los ladrillos destructibles
   - Muestra tu puntuación final
   - Botones para avanzar al siguiente nivel, reiniciar o volver a la selección de niveles

---

## Consejos y trucos

1. **Control del ángulo**: El punto donde la pelota golpea la pala afecta su dirección. Golpear con los extremos de la pala provocará rebotes más angulados.

2. **Mantén combos altos**: Intenta romper ladrillos en rápida sucesión para multiplicar tu puntuación con el sistema de combo.

3. **Utiliza los ladrillos indestructibles a tu favor**: Puedes usar los ladrillos indestructibles como rebotadores para alcanzar ladrillos difíciles.

4. **Aprovecha los explosivos**: Intenta golpear primero los ladrillos explosivos que estén rodeados de muchos otros ladrillos para maximizar su efecto y mantener combos altos.

5. **Prioriza powerups positivos**: Intenta atrapar los powerups de Pala Grande, Pelota Lenta y Vida Extra, mientras evitas los negativos si es posible.

6. **Ten cuidado con los regenerativos**: Si no eres rápido, puede que tengas que destruir el mismo ladrillo varias veces. Planifica tu estrategia.

7. **Anticipa los movimientos**: Para ladrillos móviles, intenta anticipar hacia dónde se moverán y posicionate estratégicamente.

8. **Usa la pausa**: Si la pelota va muy rápido o necesitas un momento para planificar, usa la función de pausa.

9. **Prioriza los ladrillos especiales**: Intenta eliminar primero los ladrillos explosivos y móviles, ya que pueden facilitar la destrucción de los demás.

10. **Mantén la calma**: A medida que avanzas en los niveles, la velocidad aumenta. Mantén la calma y concéntrate.

11. **Observa los efectos visuales**: Los efectos de colisión pueden ayudarte a anticipar el movimiento de la pelota, especialmente a altas velocidades.

12. **Aprovecha los rebotes en la pala**: Cada rebote te da 1 punto adicional, lo que puede sumar bastante en partidas largas.

---

## Solución de problemas

### El juego va lento o tiene lag
- Cierra otras aplicaciones o pestañas del navegador
- Actualiza la página (F5)
- Prueba con otro navegador

### No se reproduce el sonido
- Verifica que tu dispositivo no esté en silencio
- Comprueba que los archivos de sonido estén en la carpeta correcta
- Algunos navegadores requieren interacción del usuario antes de reproducir sonido

### El juego no responde a los controles
- Asegúrate de que la ventana del juego está seleccionada (haz clic en ella)
- Comprueba que tu teclado/ratón funciona correctamente
- Verifica que el juego no está en pausa (el mensaje "JUEGO EN PAUSA" desaparece)
- Actualiza la página

### La pelota desaparece o se comporta de forma extraña
- Esto puede ocurrir raramente debido a algún error. Reinicia el nivel

### Los ladrillos no funcionan correctamente
- Si los ladrillos regenerativos no reaparecen o los móviles no se mueven, podría ser un problema de rendimiento. Cierra otras aplicaciones para liberar recursos

### Los powerups no se activan
- Asegúrate de golpearlos con la pala, no con la pelota
- Si ya tienes un powerup activo, el nuevo reemplazará al anterior

### La puntuación no aumenta correctamente
- Verifica que no haya problemas de rendimiento que afecten al sistema de combo
- Los puntos se muestran brevemente como texto flotante; confirma que se suman al total

---

¡Disfruta jugando a Breakout Arcade! Si tienes alguna sugerencia o encuentras algún problema, no dudes en contactar con el desarrollador a través del repositorio del proyecto. 