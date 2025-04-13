# Videojuego - Carlos Santiago Melon Fernandez - ChatGPT

**Prompt 1**

Eres un experto en desarrollo de pequeños videojuegos sobre HTML5/CSS3/Javascript. Quieres desarrollar un videojuego llamado "RompeWebos" que funciona con la lógica del clásico Minesweeper.
¿Cuál sería el mejor proceso para plasmar requisitos técnicos, funcionales, documentar y finalmente implementar?

**Prompt 2**

Crea un fichero markdown con todo el detalle de requisitos técnicos y funcionales necesarios para implementar el juego.

**Prompt 3**

Realiza algunos ajustes sobre la especificación:
- No se utilizará ningún sonido en el juego.
- Las celdas marcadas con bandera serán mostradas en el tablero con el emoji 🐣
- Cuando se hace clic izquierdo en una celda que contiene un Webo, perdiendo así la partida, se muestra en esa celda el emoji 🍳
- Después de perder la partida se revelan en el tablero las celdas que contenían un Webo y que no habían sido marcadas con bandera mediante el emoji 🥚, y las celdas que habían sido marcadas erróneamente muestran el emoji ❌ superpuesto sobre el anteriormente mencionado 🐣

**Promp 4**

Dados los requisitos técnicos y funcionales que has generado, procede con el desarrollo del juego.

**Prompt 5**

En la especificación están separados HTML, CSS y javascript en ficheros diferentes.
Asegúrate que te ajustas completamente a la especificación.
Corrige esto y continúa con la implementación. Genera los ficheros HTML, CSS, Javascript y Readme con todo su contenido terminado, y tras ello veremos si hay que hacer ajustes.

**Prompt 6**

Ajustes a realizar:
- Deben mostrarse bajo el tablero 3 botones: uno por cada nivel de dificultad. El fácil con un tablero de 10x10 (como el actual), el medio con un tablero de 15x15 y el difícil con un tablero de 25x15. La dificultad se debe mostrar también en el número de Webos de cada tablero.
- Ahora mismo, al perder, todos las celdas con Webo aparecen como 🍳. Solo debe mostrarse con este emoji la casilla con el Webo que se ha pulsado al perder. Revisa los requisitos técnicos para asegurarte que la lógica del juego está bien implementada.
Haz los ajustes en todos los ficheros necesarios, incluyendo el de requisitos, el readme, el HTML, el CSS y el Javascript.

**Prompt 7**

Un par de ajustes más:

- Dale al título principal un aspecto moderno y divertido.
- Coloca el botón reiniciar a la derecha de los botones de dificultad, separado de ellos por una barra vertical
- Dale a los botones un estilo atractivo y moderno
- Una vez que se pierde, ya no se puede seguir onteractuando con el teclado

**Prompt 8**

Cuando termina la partida no se están viendo las celdas marcadas, solo las marcadas erróneamente.
