##PROMPT 1 (PRE-PRONT) chatgpt 4o

Quiero que generes un prompt completo optimizado para claude-3.7-sonnet para crear un videojuego sencillo con IA.

El videojuego consiste en una rejilla en la que aparecen aleatoreamente personajes buenos y malos. Los personajes son emoticonos. El jugador dispara haciendo clic o tocando la pantalla en dispositivos móviles. El jugador gana puntos cuando dispara a los enemigos y pierde cuando dispara a los inocentes. La partida dura inicialmente 30s pero el usuario gana 3s por cada enemigo abatido y pierde 3s por cada inocente. Si se acaba el tiempo o el usuario tiene puntos por debajo de 0 se acaba la partida. El jugador gana puntos por cada enemigo abatido y pierde por los inocentes abatidos. La velocidad a la que aparecen enemigos e inocentes se irá incrementando durante la partida de modo que cada vez sea más dificil.

Aquí te enseño un texto de prueba, pero optimiza lo que creas necesario para conseguir el prompt perfecto:

```Desarrolla un juego completo de la serpiente (Snake) en JavaScript que se ejecute en un navegador web. El juego debe estar completamente contenido en un solo archivo HTML, utilizando JavaScript y CSS en línea para mayor simplicidad. A continuación se detallan los requisitos y la estructura del juego:

1. **Resumen del juego:**
   - El juego consiste en una serpiente que se mueve en una cuadrícula, controlada por las flechas del teclado. El objetivo es comer la comida que aparece aleatoriamente en la cuadrícula sin chocar contra las paredes ni con el propio cuerpo de la serpiente.
   - La serpiente crece en longitud cada vez que come comida, y el juego se acelera ligeramente.
   - El juego termina cuando la serpiente choca consigo misma o con los límites de la cuadrícula.

2. **Requisitos técnicos:**
   - Usar JavaScript puro sin bibliotecas externas.
   - Implementar la lógica y el renderizado del juego dentro de un archivo HTML, utilizando etiquetas `<script>` para JavaScript y `<style>` para CSS.
   - Asegurar la compatibilidad con los principales navegadores (Chrome, Firefox, Safari).

3. **Componentes del juego:**
   - Un área de juego representada por una cuadrícula.
   - Una serpiente que comienza con una longitud de 3.
   - Comida que aparece en ubicaciones aleatorias dentro de la cuadrícula.
   - Un contador de puntuación que muestra la cantidad de comida consumida.

4. **Funcionalidad:**
   - Las teclas de flechas controlan la dirección de la serpiente.
   - El juego se acelera de forma incremental a medida que la serpiente come más comida.
   - La puntuación se actualiza con cada comida consumida.
   - Mostrar un mensaje de "Juego terminado" cuando el juego finaliza, junto con la puntuación final.

5. **Estilo:**
   - Estilizar el área de juego y los elementos de forma mínima pero distinguible. Usar colores contrastantes para la serpiente, la comida y el área de juego.
   - Asegurar que el juego sea visualmente claro y se juegue bien en una variedad de tamaños de pantalla.

6. **Optimización y pruebas:**
   - El código debe estar bien organizado y comentado para facilitar su lectura.
   - Probar el juego en diferentes navegadores para asegurar una jugabilidad consistente y libre de errores.

**Entregable:** Un único archivo HTML que contenga todo el HTML, CSS y JavaScript necesarios para el juego de la serpiente. Incluir comentarios en línea para explicar las partes clave del código y la lógica del juego.

Por favor, prioriza la funcionalidad, la legibilidad del código y el cumplimiento de las especificaciones del juego descritas anteriormente. Este proyecto sirve como un ejercicio integral en la integración de JavaScript, CSS y HTML, y tiene como objetivo demostrar la competencia en la creación de juegos interactivos basados en la web.
```

Pregúntame lo que necesites y si tienes alguna idea me la cuentas

##PROMPT 2 Claude-3.7-sonnet (Sin Cursor Rules)

Desarrolla un juego completo llamado "Dispara al Enemigo" en un solo archivo HTML, utilizando solo HTML, CSS y JavaScript puros, sin bibliotecas externas. El juego debe ejecutarse correctamente tanto en navegadores de escritorio como en dispositivos móviles (touch). A continuación se detallan los requerimientos:

1. **Resumen del juego:**
   - El jugador verá una cuadrícula (rejilla) en la que aparecerán aleatoriamente personajes buenos y malos representados por emoticonos (por ejemplo: 😇 para inocentes y 😈 para enemigos).
   - El jugador dispara tocando (en móviles) o haciendo clic (en escritorio) sobre los personajes que aparecen.
   - Si dispara a un enemigo, gana puntos y se agregan 3 segundos al cronómetro.
   - Si dispara a un inocente, pierde puntos y se restan 3 segundos.
   - El juego comienza con una duración de 30 segundos. Si el tiempo llega a cero o la puntuación es menor a 0, la partida termina.
   - La velocidad con la que aparecen los personajes aumenta progresivamente durante la partida, haciendo el juego cada vez más desafiante.

2. **Requisitos técnicos:**
   - Todo el juego debe estar contenido en un solo archivo `.html`.
   - Incluir estilos CSS dentro de una etiqueta `<style>` y scripts JavaScript dentro de una etiqueta `<script>`.
   - Usar JavaScript puro para toda la lógica del juego.
   - Asegurar que los controles táctiles funcionen correctamente en móviles y el clic funcione en escritorio.

3. **Componentes del juego:**
   - Una cuadrícula visual (rejilla) de al menos 4x4 celdas (puede escalarse según la pantalla).
   - Personajes generados aleatoriamente en celdas vacías.
   - Un contador de tiempo visible.
   - Un marcador de puntuación visible.
   - Un mensaje final de "¡Fin del juego!" con la puntuación obtenida y opción de reiniciar.

4. **Mecánica del juego:**
   - Al hacer clic o tocar un personaje:
     - Si es un enemigo, sumar puntos (ej. +100) y agregar tiempo (+3s).
     - Si es un inocente, restar puntos (ej. -150) y quitar tiempo (-3s).
   - Los personajes desaparecen después de cierto tiempo si no se interactúa con ellos.
   - La aparición de nuevos personajes debe ser constante y acelerarse progresivamente.
   - Evitar que dos personajes aparezcan en la misma celda a la vez.

5. **Estilo visual:**
   - La cuadrícula debe tener un aspecto limpio y ser responsive.
   - Usar colores contrastantes para enemigos e inocentes (ej. fondo rojo para 😈, fondo azul para 😇).
   - Botones y texto suficientemente grandes para móviles.

6. **Optimización:**
   - Comenta el código explicando las funciones clave.
   - Asegura compatibilidad en Chrome, Firefox, Safari.
   - Mantén el código claro y modular.

**Entregable:** Un único archivo `.html` con el juego completo. El objetivo es crear un proyecto divertido, funcional y visualmente atractivo, ideal como ejercicio práctico de programación web interactiva.

Si tienes ideas adicionales para mejorar el gameplay (como animaciones, niveles, etc.), puedes incorporarlas al diseño, siempre que mantengas la simplicidad del archivo único.

##ÚLTIMOS PROPMTS Claude-3.7-sonnet

**Mejoras**:
- Crea una pantalla de bienvenida con un botón de comenzar para empezar la partida.
- Añade más variedad de emoticonos para los enemigos y los inocentes y haz que aparezcan aleatoreamente.
- haz que el tiempo nunca pueda se superior a 30s
- En la pantalla de fin de juego añade estadísticas como 
    - Total enemigos
    - Mejor racha enemigos
    - Total inocentes
    - Duración
- Añade animaciones, usa esta libreria @https://animate.style/ 
- Añade estilos divertidos al juego. Usa dos tipografias que combinen bien de Google fonts @https://fonts.google.com/  
- añade color
- Aplica estilos 8bit
- Añade animaciones positivas y negativas a las celdas cuando se dispare a un amigo enemigo
- haz que tras disparar, se vea la puntuación ganada en un mensaje flotante en la celda que he pulsado durante 1s. Si he perdido puntos muéstralo en rojo
- Acelera el tempo
- usa el tipo de onda sawtooth
- Añade música y sonidos
- haz que pulsar en una casilla vacía penalice -50 puntos
- Añade una penalización de 3s por pulsar una celda vacía
- Modifica la música por una melodía estilo 8bit libre de derechos
- Elimina los emoticonos de sonido y música y usa iconos svg en su lugar
- Cambia el icono de la música por una corchea en svg