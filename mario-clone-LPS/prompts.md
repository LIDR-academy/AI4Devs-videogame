#PROMPTS
##Cursor + Calude-3.7-Sonnet

###Prompt 1

```
Eres un experto desarrollador de juegos. Quiero hacer un clon del juego Super Mario, pero una versión básica, y quiero hacerl usando Phaser 3, un popular framework para juegos HTML5. No quiero esrciir nada de código, así que configura toda la estructura de archivos y configuraciones necesaria para hacerlo.
Primero crea la estructura del proyecto:
-mario-clone-LPS/
-index.html
-main.js
-assets/
-images/
-audio/
Ejecuta los comandos necesarios usando phyton para crear los directorios y archivos
Una vez creada la estructura, rellena index.html y main.js y verifica que Phaser se haya añadido correctamente
```

###Prompt 2
````
Eres un desarrollador de juegos experto. Tu tarea consiste en continuar configurando el clon ligero de Super Mario con Phaser 3. 
A continuación, necesitamos:

Añadir plataformas al entorno de juego.
Asegurarse de que el personaje jugador pueda aterrizar en estas plataformas e interactuar con ellas.

Por favor, gestiona todas las actualizaciones de archivos y configuraciones necesarias para lograrlo. Una vez hecho esto, prueba el juego para asegurarte de que el personaje jugador pueda recolectar objetos y que la puntuación se actualice según corresponda. 
@Phaser 
```

###Prompt 3

```
Quita todos los sonidos, que no hacen falta
```

###Prompt 4
```
La pantalla inicial no es viable, tiene que poder resolverse completa, pero no es posible acceder a todas las plataformas. 
````

###Prompt 5
````
No se puede acceder a todas las monedas, ni pasar por todas las plataformas, proque los espacios entre plataformas son muy pequeños. Fijate en la imagen
```

###Prompt 6
````
Eres un desarrollador de juegos experto. 
A continuación, necesitamos:

Añadir enemigos al entorno de juego.
Implementar la lógica de fin de partida que se activa cuando el personaje choca con un enemigo.
Por favor, gestiona todas las actualizaciones y configuraciones necesarias para lograrlo. Una vez hecho esto, prueba el juego para asegurarte de que el personaje pueda interactuar con los enemigos y que la lógica de fin de partida funcione correctamente. @Phaser 3
````


###Prompt 7
````
En la primera pantalla, que será el primer nivel, solo puede haber un enemigo, porque es la pantalla más fácil. Tiene que haber niveles infinitos, de modo que cuando el usuario gane un nivel, aparezca uno nuevo con una nueva posición aleatoria y una nueva cantidad de monedas, enemigos y plataformas y comience automáticamente. 
```

###Prompt 8
````
Debes asegurarte que todos los niveles lleguen a poder resolverse. Que el personaje pueda llegar a coger todas las monedas. En el nivel 1, por ejemplo, no se puede superar al enemigo.
````

###Prompt 9
````
XHRGET
https://labs.phaser.io/assets/skies/cyberpunk-street.png
CORS Missing Allow Origin

Solicitud desde otro origen bloqueada: la política de mismo origen impide leer el recurso remoto en https://labs.phaser.io/assets/skies/cyberpunk-street.png (razón: falta la cabecera CORS 'Access-Control-Allow-Origin'). Código de estado: 404.
```

###Prompt 10
````
Cuando choco con el enemigo me da este error: Uncaught TypeError: this.time is undefined
    showGameOver http://localhost:8000/main.js:607
    hitEnemy http://localhost:8000/main.js:543
    collideSpriteVsGroup https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    collideHandler https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    collideObjects https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    update https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    update https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    emit https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    step https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    update https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    step https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    step https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
    t https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js:1
main.js:607:5
````
#prompt 11
````
He pasado al segundo nivel y no veo al personaje principal, epro si a los enemigos. Asegurate que aparece de nuevo en todos los niveles
```

###Prompt 12
````
 Al pasar de nivel el jugador no está visible. 
```

>No consigo que el personaje principal aparezca en el segundo nivel, pero aquí lo tengo que dejar.
​
