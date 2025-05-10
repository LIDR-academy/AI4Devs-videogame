# Proceso de Desarrollo de DoodleJump con Jirafa

## PROMPT #1

```
# Contexto
- Me han pedido que desarrolle un videojuego.
- He pensado en desarrollar un DoodleJump pero cambiar el personaje inicial por una jirafa.
- Tenemos que usar html y javascript para desarrollar el juego.
- Si usamos librerías externas debe ser por cdn, no debemos descargarlas.

## Enunciado del ejercicio
2. Realiza el ejercicio
Aunque lo encontrarás en las instrucciones en el Readme.md, aquí las tienes igualmente. Leelas con atención:

Elige un concepto de juego: Puede ser cualquier tipo de juego que te interese desarrollar, desde un juego de plataformas hasta un puzzle o un juego de estrategia.
Crea los archivos necesarios: Dentro de la carpeta con el nombre de tu juego y tus iniciales (por ejemplo, `yourGameName-Initials`), añade todos los archivos necesarios para tu juego, incluyendo un HTML denominado index.html, CSS y JavaScript. Si tu juego requiere imágenes u otros recursos, asegúrate de incluirlos también.
Desarrolla el juego: Utiliza un asistente de código o un chatbot para crear todo el código: HTML para estructurar tu juego, CSS para darle estilo y JavaScript para la lógica del juego. Asegúrate de que tu juego sea interactivo y funcione correctamente en los navegadores web.
Documenta tu proceso: En un archivo prompts.md dentro de la misma carpeta, incluye los prompts utilizados. Además, si quieres, describe el proceso de desarrollo de tu juego, incluyendo cualquier desafío que hayas enfrentado y cómo lo superaste.
Prueba tu juego: Antes de finalizar, prueba tu juego en diferentes navegadores para asegurarte de que funciona correctamente en todos ellos. Ajusta cualquier error que encuentres durante las pruebas con más prompts.
Haz una pull request: Una vez que tu juego esté completo y probado, haz una pull request para incluir tu juego en el repositorio. Asegúrate de incluir en el comentario de la pull request una breve descripción de tu juego, cómo se juega y cualquier detalle relevante que quieras destacar.
Para darte una idea de cómo estructurar tu proyecto, puedes referirte al juego de Snake desarrollado como ejemplo. Encuentra los archivos y la documentación necesaria en la carpeta snake-EHS.

Si lo has hecho bien, correremos el script de python y una vez aceptada la Pull Request se añadirá a la lista de juegos en la interfaz, siendo muy sencillo jugar a todos los juegos como si fuera una recreativa.

# Conclusiones
- Pregúntame lo que necesites para llevar a cabo la tarea.
```


## PROMPT #2

```
# Respuestas
1. Vamos a usar la carpeta de la raíz doodlejump-BRT del proyecto para alojar los archivos (ya está creada).
2. La imagen de la jirafa te la he puesto en doodlejump-BRT/kirin.png
3. Implementa, sistema de puntuación, Power-ups, efectos de sonido y animaciones especiales.

Redacta el plan de desarrollo que vas a tomar, no escribas código todavía. Si tienes más preguntas adicionales házmelas.
```

## PROMPT #3

```
# Respuestas
1. Usa la sabana como bioma
2. Que sea infinito
3. No es necesario el tutorial
4. Los powerups aparecerán de forma aleatoria.
5. Solo será un intento, el personaje solo tendrá una vida por partida. Es importante que al morir, el usuario pueda reiniciar la partida.


Ajusta el plan a estas respuestas. No escribas código todavía.
```

## PROMPT #4

```
Ok vamos a implementar las funcionalidades paso a paso. empecemos con El movimiento horizontal de la jirafa
```


## PROMPT #5

```
Está perfecto, vamos ahora al siguiente paso, implementar los power-ups
```


## PROMPT #6

```
Ok, ahora debemos hacer que la cámara acompañe al personaje durante la subida para que se pueda jugar cómodamente.
```


## PROMPT #7

```
Tenemos que ajustar el comportamiento de la jirafa cuando cae, si se sale de la cámara más de un 20% de forma inferior, debe morir.
```

## PROMPT #8

```
Ok, vamos ahora a agregar más nivel, ahora mismo se generan bloques de salto de forma limitada. Al querer tener el juego infinito, deben seguir generándose contínuamente mientras la jirafa va subiendo.
```

## Resto de prompts con ajustes y diseño de interfaz
```
- Los bloques de salto se están generando de forma consecutiva, con lo cual la dificultad del juego es muy baja. Debe aumentar la aleatoriedad de posición de cada bloque de salto para que el juego sea divertido.

- Mejora ahora los rangos de distancia horizontal para mejorar la distancia horizontal entre los bloques de salto.

- Distribuye los bloques de salto de forma más aleatoria, tanto horizontalmente como verticalmente.

- Las plataformas deben tener su ubicación aleatoria pero siempre dentro de la pantalla.

- Vamos ahora a cambiar el asset del powerup "DOUBLE_JUMP". Usa la imagen @powerup-gold.png  como asset del powerup
```


