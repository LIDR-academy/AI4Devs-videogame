#PROMPTS
##ChatGPT-4o

###Prompt 1:
````
Eres un experto product engineer, y tienes admás una amplia experiencia como game developer. Quiero hacer una réplica básica, pero funcional del juego de arcade Break Braker. Quiero que tenga un interfaz sencillo, pero completo, aunque no necesito que tenga audio. Ayudame a hacer un prompt para usarlo para definir los requerimientos de desarrollo, así como tecnología, estructura, u otros aspectos funcionales y no funcionales. Haz algo completo para un MVP
````
##Claude-3.7-sonnet
###Prompt 2:
```
Dentro de la nueva carpeta break-braker-LPS quiero desarrollar el código para o siguiente que te voy a pedir:
1. Visión General

Queremos desarrollar una versión básica pero completamente funcional del clásico juego arcade Break Braker, que sirva como un MVP (Minimum Viable Product). El juego debe incluir una jugabilidad fluida, una interfaz intuitiva y mecánicas esenciales, sin necesidad de audio en esta fase inicial.
2. Requerimientos Funcionales
2.1 Mecánicas del Juego

    Implementar una pelota que rebota en la pantalla y destruye bloques al impactarlos.

    Incluir una barra controlable por el jugador en la parte inferior de la pantalla para desviar la pelota.

    Diseñar bloques destructibles que desaparecen cuando son golpeados por la pelota.

    Definir una lógica de colisiones, incluyendo:

        Rebotes realistas contra paredes y la barra del jugador.

        Bloques que desaparecen tras un impacto.

        Reinicio del juego si la pelota toca la parte inferior de la pantalla.

2.2 Controles

    Movimiento horizontal de la barra usando teclado (flechas izquierda/derecha o A/D) y ratón.

    Posibilidad de iniciar la partida con espacio o clic.

2.3 Progresión y Puntuación

    Contador de puntos basado en los bloques destruidos.

    Pantalla de victoria cuando se eliminan todos los bloques.

    Pantalla de derrota cuando la pelota cae fuera de la pantalla.

3. Requerimientos No Funcionales
3.1 Tecnología

    Motor/Framework: HTML5 con Canvas API y JavaScript (alternativamente Phaser.js para facilitar física y colisiones).

    Estructura del código:

        Módulos ES6 para organizar lógica de juego, renderizado y eventos.

        Un loop principal de juego optimizado con requestAnimationFrame().

3.2 Rendimiento y Optimización

    Debe correr a 60 FPS en navegadores modernos.

    Código ligero y eficiente, evitando cálculos innecesarios en cada frame.

    Uso de un sistema de pooling para reutilizar objetos en lugar de crearlos/destruirlos dinámicamente.

3.3 Interfaz de Usuario (UI)

    Un diseño minimalista y responsivo.

    Botón de reinicio tras victoria o derrota.

    Mostrar la puntuación en tiempo real.

3.4 Compatibilidad

    Debe funcionar en navegadores modernos (Chrome, Firefox, Edge, Safari) sin necesidad de plugins.

    Soporte para pantallas de diferentes resoluciones con un diseño adaptable.
````

###Prompt 3:
````
Solicitud desde otro origen bloqueada: la política de mismo origen impide leer el recurso remoto en file:///Users/loretopardodesantayanagalbis/Sites/localhost/AI4Devs-videogame/break-braker-LPS/js/main.js (razón: la solicitud CORS no es http).2
````

###Prompt 4:
````
Lo veo muy bien. Podemos hacer un test para comprobar que pasa bien de nivel?
````

#Prompt 5
````
Está muy bien. Además de que cambie el número de bloques por nivel, también quiero que cambie, sólo un poco, la velocidad de la bola. En el primer nivel quiero que vaya más despacio
````

#Prompt 6
````
puedes hacer una prueba para comprobar que pasa bien al sieguiente nivel?
````

