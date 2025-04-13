
#PROMPTS

## PROMPT 1
Desarrolla un juego del tipo memorama que se ejecute en el navegador utilizando, HTML, CSS y Javascript, lo siguiente son los requerimientos del juego

1. **Descripción del juego**
-	El juego consiste en un tablero que muestra un máximo de 16 elementos en una cuadricula de 4 x 4, el objetivo es que se encuentren los pares iguales dentro del tablero
-	Cada elemento del tablero mostrara primero un icono que representa el estado de desconocido, el usuario debe de poder dar click en cada elemento, descubriendo como máximo 2 al mismo tiempo, si son iguales mantener el icono, en caso contrario regresar al estado desconocido.
-	El juego termina cuando el usuario descubre todos los pares, o bien cuando el tiempo ha terminado
-	El juego tendrá un tiempo inicial de 15 segundos, cada ves que encuentra un par correctamente, el tiempo aumentara 10 segundos, por otra parte, cada vez que el usuario falle, se le restaran 3 segundos

2. **Requisitos técnicos**
- Usa javascript sin librerías
- Utiliza los archivos index.html, scripts.js, y styles.css incluidos en el proyecto
- Utiliza los iconos de la carpeta images incluidos en el proyecto
- Utiliza el archivo pregunta.png para el estado de desconocido 

3. **Componentes del juego**
- Tablero de memorama 
- Iconos de lenguajes de programación ordenados aleatoriamente con estado inicial de desconocido
- Contador de tiempo restante

4. ** Funcionalidad**
- Los iconos del tablero deberán poder descubrirse al darles click
- El juego deberá mostrar un contador en reversa del tiempo restante
- El tiempo deberá pintarse en verde cada ves que el usuario encuentre un par
- El tiempo deberá pintarse en rojo cada ves que el usuario falle al descubrir dos elementos desconocidos distintos

---
## PROMPT 2

>@memory-ESPR Del juego de memorama, añade la opción de escoger niveles de dificultad, actualmente el juego inicia con 15 segundos, este seria el nivel dificil, añade el nivel facil con 45 segundos y el nivel intermedio con 30 segundos, donde el nivel facil quita 1 segundo por cada intento fallido y el nivel intermedio quita 2 segundos por cada intento fallido

## PROMPT 3

>actualmente el juego gira los iconos de modo que cuando quedan descubiertos quedan derecha a izquierda de forma que por ejemplo TS queda como ST pero con la fuente con efecto espejo, corrige este error visual de modo que al quedar descubierto el icono quede TS