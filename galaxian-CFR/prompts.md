# Construcción del juego Galaxian

## **Prompt 1**
Me gustaría crear un juego sencillo, lo más parecido posible al juego Galaxian, un juego arcade antiguo. Su apariencia gráfica es como la que te muestro en la siguiente imagen. Mis requisitos básicos de partida serían: 
- HTML para estructurar el juego, CSS para darle estilo y JavaScript para la lógica del juego
- Cumplir con buenas prácticas y documentar el código generado.
Antes de hacer nada, me gustaría saber si lo conoces y, de ser así, que me proporcionaras una especificación funcional del juego, para revisarla y completarla antes de hacer nada en código.


## **Prompt 2**
Te voy a ajustar algo los requisitos. Dime si te surge alguna duda con ellos.

## **Prompt 3**
Perfecto, vamos con la configuración inicial. Por favor, para cada paso, recuerda:
- Matener separados el core del juego (index.html), la lógica javascript (galaxian.js) y los estilos (galaxian.css)
- Buenas prácticas y código bien documentado
- Todos los trabajos irán en la carpeta galaxian-CFR, donde ya he ubidado el fichero galaxian.md

## **Prompt 4**
Dime cómo puedo probar el resultado hasta ahora. 

## **Prompt 5**
Perfecto. Vamos con la siguiente fase, Desarrollo del Motor Base. Al finalizar cada fase dime qué resultado podemos esperar en el punto en el que estamos y qué puedo probar para validarlo

## **Prompt 6**
Al presionar ENTER no sucede nada

## **Prompt 7**
Ahora veo los cambios de estado. En la consola también veo algún error: 
Failed to decode downloaded font: https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swapUnderstand this warningAI
localhost/:1 OTS parsing error: invalid sfntVersion: 791289955Understand this warningAI
galaxian.js:89 Tecla presionada: Shift
favicon.ico:1

## **Prompt 8**
El paso con el que estábamos, lo das por finalizado? Era:
3.	Implementación del Jugador
- Creación de la nave
- Sistema de control
- Sistema de disparos
- Sistema de vidas

## **Prompt 9**
Perfecto. Vamos con el paso 4. Implementación de Enemigos
- Creación de tipos de enemigos
- Sistema de formación
- Movimiento coordinado
- Sistema de ataques en picado
- Sistema de disparos enemigos
Dime también qué imágenes deberé crear 

## **Prompt 10**
parece que todo funciona, lo único que las imágenes de los enemigos salen muy pequeñas y la velocidad de movimiento y de disparos de los enemigos es muy rápida para ser el nivel 1

## **Prompt 11**
Los disparos de los enemigos no llegan hasta la parte inferior de la pantalla. Y parece que desaparecen cuando el jugador dispara, cuando sólo deben desaparecer si colisionan con uno de sus disparos o alcanzan (y destruyen) al jugador

## **Prompt 12**
Perfecto, vamos con el siguiente apartado, el 5.	Sistema de Puntuación y UI
- Implementación del marcador
- HI-SCORE
- Visualización de vidas
- Nivel actual
- Pantallas de inicio y game over

## **Prompt 13**
Como ves en la imagen, parece que la cabecera se dibuja dos veces

## **Prompt 14**
Perfecto. Vamos con el punto 6.	Efectos y Pulido
- Animaciones de explosión
- Efectos de sonido
- Música de fondo
- Fondo estrellado
- Ajuste de dificultad: Recuerda. La dificultad la marcan la velocidad de movimiento de las naves, su velocidad de disparo y la velocidad y frecuencia con la que hacen picados. El nivel inicial debe empezar con todos esos criterios muy lentos. El movimiento del jugador no se ve afectado por el nivel