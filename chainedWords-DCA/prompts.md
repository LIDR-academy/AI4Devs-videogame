# Desarrollo de videojuego

Como experto en desarrollo de videojuegos con JS, CSS y HTML debes elegir el mejor framework, y desarrollar el proyecto con las siguientes características para obtener un MVP del siguiente videojuego
Toma como referencia, ejemplo y documentación los ficheros adjuntos

## Palabras encadenadas

Juego para jugar con amigos, donde cada jugador debe escribir una palabra que comience con la última sílaba de la palabra anterior.
El juego debe tener las siguientes características:

- El juego debe tener un sistema de turnos
- El juego debe tener un sistema de puntuación, cada palabra correcta suma 1 punto y ganar una ronda suma 5 puntos, una ronda se gana cuando el jugador oponente no peude escribir una palabra en el tiempo establecido
- El juego debe tener un sistema de tiempo para responder
- El juego debe tener un sistema de configuración para poder cambiar el tiempo de respuesta y el número de rondas
- El juego debe tener un aspecto visual atractivo y responsivo
- El juego debe tener un sistema de sonido para indicar el fin de la partida y el cambio de turno
- El juego debe tener un sistema cambio de colores en función del jugador que tiene el turno, J1 y J2

Debes incluir todo lo necesario, archivo JS, HTML, CSS y carpeta de assets con las imágenes y sonidos necesarios para que el proyecto sea funcional y se pueda ejecutar en cualquier navegador, en la carpeta chainedWords-DCA.

Debes desarrollar todas y cada una de las características, como experto en cada una de las tecnologías necesarias para ello.
Antes de emprender el desarrollo, actúa como un experto Business Analist y un Product Owner para especificar y priorizar en base a MoSCoW cada una de las 8 tareas listadas
Desarrolla cada una de las tareas en la planificación obtenida, cambiando de rol, Desarrollador JS o diseñador CSS o desarrollador HTML, según sea necesario para cada tarea

-----

## IDE y LLM utilizados

Cursor con deepseek-v3 en modo Ask

## Prompts utilizados

Desarrolla un videojuego completo en la carpeta @chainedWords-DCA  en base a lo expuesto en @prompts.md y teniendo en cuenta todo lo explicado y los ejemplos expuestos en @AI4Devs-videogame

-----

Cuando se ejecuta deben ir mostrándose las palabras escritas encima de la caja de texto para escribir la palabra, cuanto más antigua la palabra más arriba y la más reciente más abajo

-----

hay varios errores:
- la plabra no está terminada si no se pulsa la tecla enter
- los sonidos se están ejecutando en bucle, el sonido turn debe sonar solo una vez cuando se pulsa la tecla enter, y el sonido de game-over debe mostrarse solo cuando se cumpla la condición de finalización del juego, mostrando el alert indicando el jugador que ha ganado y su puntuación

-----

Si se muestra el alert de palabra no válida, el jugador que la ha escrito pierde el juego y se muestra el alert del ganador y el sonido de game-over, y se limpia todo para una nueva partida

-----

el orden del histórico de palabras está al revés de como se ha indicado, debe invertirse

-----

Al finalizar una partida, el banner de Tiempo restante sigue corriendo y el sonido de cambio de turno empieza a oirse en bucle, corrígelo

-----