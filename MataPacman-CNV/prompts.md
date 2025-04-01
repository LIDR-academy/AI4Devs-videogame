La idea inicial era hacer un videojuego tipo Beate'm up en 2.5 D en el que se seleccionaba mas de un jugador. Estos fueron los prompts iniciales a chat gpt para generar el tema de sprites y mas calculos.

---
¿cómo se denomina técnicamente el rol de un desarrollador de videojuegos?
¿conoces the king of dragons (videojuego)?
¿cómo se llama la perspectiva visual de the king of dragons?
¿sabrías decirme que proporción de espacio ocupa uno de los personajes en relación con el escenario?
¿qué proporción de terreno hábil con respecto al fondo tenemos en la pantalla?
¿Qué me puedes decir de los algoritmos de la IA de los enemigos?

---
No muestra la imagen (pantalla negra) (log de error)
Cómo instalo Live Server?
buscame las páginas oficiales de documentacoin de phaser 3

---

Necesito que generes los sprites de los jugadores del juego. Utiliza el formato que sea mas conveniente para estos casos. Vamos a empezar por el guerrero. Genera los sprites de parado, movimiento, salto y tumbado. Tienen que ser los suficientes para una animación fluida. - Guerrero: 
- Su arma es una gran espada.
- Tiene una apariencia como Conan el bárbaro, pero lleva una armadura roja con hombreras y un casco con cuernos.

---
CONCLUSIONES: 
Despues de un largo proceso de generar sprites y ver que no ha sido posible interpretar los sprites correctamente en pantalla, tuve que ceñirme a los que ya existian en la libreria de phaser3.

Al haber problemas con los sprites de los enemigos, porque no podian ser personalizados, daba el mismo problema, decidi cambiar el concepto del juego a mata pacman porque era el sprite de enemigo animado que pude encontrar.

Con la base creada reformulamos el proyecto de nuevo:
Vamos a generar el desarrollo del videojuego mata pacman.

Este fue el prompt inicial para continuar a partir de la base generada:

Asume el rol de un game programmer experimentado:
Partiendo de la base del proyecto en contexto, como game programmer las tecnologias a utilizar seran:
HTMl + JAvaScript + CSS + Phaser3.

El resto es una cadena muy larga de prompts del chat de Cursor:

- analiza el archivo index.html e indicame el contexto

Si, de momento es un test de funcionamiento  básicoanaliza el archivo index.html e indicame el contexto

Este es el error que da al ejecutarlo en el navegador

parece que no respondia

......


EL juego tratará de un personaje que lleva una espada.
Los enemigos serán Pacmans.
Por el momento vamos a crear al personaje utilizando el spirte dude de Phaser3.
Para los pacman busca sprites que sean de pacman un poco vistosos. y como fondo utiliza la imagen que esta en la carpeta assets.

---

No está encontrando las texturas de pacman

---

busca en librerias como phaser o equivalentes o en zonas de sprites de internet, donde puedes obtener sprites de pacman.

---

Ahora si aparecen pacmans pero salen con una linea encima

---

Necesito que como fondo pongas la imagen imbackground.png ubicada en la carpeta img

---

porque le sale un cuadrado de textura no encontrada?porque le sale un cuadrado de textura no encontrada?

---

juzga tu mismo

---

La espada no se tiene que mostrar mientras el personaje no ataque.

---

Los sprites de pacman tienen que ser mas grandes

---

vamos a darle movimiento al personaje

---

El personaje, cuando camina a la derecha tiene que mirar a la derecha y cuando camina a la izqueirda mirar a la izquierda.

---

haz lo mismo para los pacmans

---

No lo hacen bien. Tienen que estar mirando siempre en el sentido en el que se están moviendo.

---

Ahora si miran en el sentido en el que se mueven pero ahora no abren la boca. Tienen que abrir y cerrar la boca mientras se mueven.

---

Ahora si miran en el sentido en el que se mueven pero ahora no abren la boca. Tienen que abrir y cerrar la boca mientras se mueven.

---

Otra condicion de los pacman es que el sprite no puede estar boca abajo. Es decir. los ojos deben quedar siempre encima de la boca.

---

pero ahora hay veces que no miran en el sentido en el que se mueven:
- Los pacman siempre miran en el sentido en el que se mueven.
- Los ojos quedarán siempre por encima de la boca

---

Ahora si

---

La resolucion del escenario ha de ser la de la imagen de fondo.

---

Haz la resolucion un poco mas grande 1024 x 768 por ejemplo.

---

Manteniendo esa resolucion, el escenario tiene que abarcar toda la imagen de fondo

---

El escenario sigue siendo pequeño en comparacion con los personajes. Escala el escenario para que sea mas grande.

---

Pero ahora se ha perdido la camara y se ve todo el escenario entero. Vuelve a configurar la camara para que muestre una resolucion de 800 x 600

---

Amplia la resolucion del fondo, es decir que los elementos del fondo se vean mas fgrandes. Pero manteniendo la cámara y el tamaño de los personajes tal y como estan ahora.

---

Ahora resolucion de la camara sea un poco mas grande, 1024 x 768. Pero manteniendo todo como está, es decir tamaño de escenario, camara, tamaño de personajes

---

si, perfecto

---

Si, ahora vamos a implementar el ataque del jugador.
A pesar de que no lleva espada, cuando ataque debe salir del personaje un arco representando el movimiento de la hoja de una espada. 
Ese efecto saldra siempre delante del personaje dependiendo de la direccion en la que este mirando.

---

Sale un cuadrado de textura no encontrada.
No utilices sprites. Genera una linea gruesa que simule el movimiento de una hoja. La linea tiene que salir en el sentido en el que esta caminado el jugador.

---

Sigue apareciendo de vez en cuando el sprite de una espada. No debe de aparecer.

---

ya no. pero ahora los pacmans no miran en el sentido de su direccion. Recuerdoa que sus ojos han de quedar siempre por encima de su boca

---

La linea que simula la espada tiene que ser un poco mas larga y un poco mas estrecha

---

ajusta un poco la longitud. un poco mas corta

--

cuando el personaje se esta moviendo hacia arriba, la espada tiene que atacar hacia arriba y cuando va hacia abajo tiene que atacar hacia abajo

---

a hoja de la espada aparece demasiado arriba con respecto al  personaje, le esta saliendo por la cabeza. La línea debe de salir un poco mas abajo de la mitad del cuerpo

---

Ahora los enemigos tienen que morir al ser tocados por la espada. Deben de cambiar de color un instante antes de desaparecer.

---

haz un poco mas grande el area de deteccion de golpes

---

haz un poco mas grande el area de deteccion de golpes

---

Los pacmans se tienen que ir generando aleatoriamente por el escenario conforme van muriendo

---

los pacmans tiene que hacer el efecto de la explosion de una burbuja cuando mueren. Esto lo han de hacer justo despues de cambiar de color al haber recibido el golpe

---


el efecto de la explosion tiene que ser mas grande

---

el efecto de la contraccion quitalo, el pacman en el momento de recibir el golpe ya deja de moverse y hace el resto de la secuencia, es decir, se pone rojo y explota.

---

quita el efecto de la contracción, pero deja todo lo demas como esta

---

Si, ahora tenemos que implementar un marcador en la parte inferior de la pantallaa donde indique la puntuacion que llevamos. Que tenga un estilo vistoso y acorde con la temática del juego

---

El recuadro sombreado que esta detras de la puntuacion, debe de ocupar todo el ancho de la pantalla

---

Perfecto. Ahora en la parte derecha de la puntuacion indica el nº de pacmans que hay que derrotar para pasar el nivel

---

se muestra cortado prueba a sustituir las palabras por un icono de pacman

---

Cuando llegue a 0 se subirá de nivel y se reseteara el contador de pacmans sumandole 5, el nivel se indica en el centro del marcador inferior

---

El número de pacmans simultaneos en pantalla empezara con 3, conforme se va subiendo niveles se ira incrementando en 1.
El numero de pacmans a eliminar empezara con 10 incrementado 5 mas por cada nivel que se suba.

---

cuando queda un pacman y se le va a matar el juego se congela. No pasa al nivel 2

---

Cuando se pasa de nivel los pacmans que quedan actualmente en el nivel deben permanecer

--

El personaje tendrá 3 vidas que se indicaran en la parte superior derecha de la pantalla.
Estaran representadas por una imagen pequeña del propio personaje por cada vida que tenga.

---

deshaz los cambios, la pantalla se ve negra.

---

Indica el nº de vidas arriba en la parte derecha de la pantalla de forma vistosa. El nº de vidas con las que se empieza es 3

---

Cuando el pacman ya ha sido atacado y esta de color rojo ya no podrá dañar al jugador.

---

Cuando las vidas lleguen a 0 se mostrará game over indicando el mesaje de presonar para espaciadora para empezar


---

Cuando este en game over todos los enemigos se tienen que parar

---

Cuando se presiona la barra espaciadora despues del game over, el juego se tiene que reiniciar por completo.

--

cuando esta en game over el contador de vidas sigue bajando en negativo, se tiene que quedar en 0

---

Cuando el personaje pierde una vida ha de hacer un efecto de explosión y aparecer en otra zona de la pantalla.
Aparecera en un estado inmune que dura 3 segundos.
Para simular la inmunidad el personaje parpadeará

---

Tras explotar en la ultima vida el personaje queda desaparecido tras la explosion.

---


el personaje sigue sin desaparecer en la ultima vida. se queda de color rojo. tiene que desaparecer tras la explosion

--

Pero cuando se reinicia el juego el personaje sigue sin aparecer. Se tiene que reiniciar el estado del personaje junto con todo el juego al presionar la barra espaciadora despues del game over

---

Hay ocasiones en que los pacmans no estando al lado del personaje hacen que este muera

---

ahora el hitbox del pacman ha quedado un poco corto, amplialo un poco

---

si, pero el hitbox sigue siendo un poco corto

---

Si, por favor. El juego tiene que funcionar como cuando estaba solo en el index.html

---

Ahora tenemos que refactorizar el codigo para que quede en un archivo Html un js y css

---

Si, por favor. El juego tiene que funcionar como cuando estaba solo en el index.html

---

No, el juego muestra el siguiente error

---

Ahora funciona pero no aparece la linea que simula la espada, aparece como un semicirculo verde, cambialo para que aparezca la linea que simula la espada tal y como aparecia antes

---

Lo sigue haciendo mal.
Recuerdas como era la linea antes de que te pidiera refactorizar el código? Pues asi.

---

No me he explicado bien creo.
El ataque tiene que simular la hoja de una espada.
Tiene es ser una linea blanca que aparece por debajo de la mitad de la altura del personaje.

---

No, esta incluso peor. Me apena mucho que lo estes haciendo tan mal. Simula la hoja de una espada que aparece el personaje cuando ataca. No pongas una linea fina que se alarga. Tiene que ser algo mas grande y que de el efecto de la hoja de una espada.

---

Cada vez lo estas haciendo peor.

---

No. La linea debe de ser de unos 130 pixeles de larga por 20 de ancha.
debe de aparecer con un efecto de trasparencia como el de los puntos de los pacmans que se matan

---

la linea debe aparecer i desaparecer quedandose eterea antes de desaparecer del todo. Y no se pueden ir quedando lineas dibujadas por la pantalla

---

Casi, ahora si que hace el efecto, pero la linea se queda dibujada en el escenario despues durante un instante

---

Ahora esta mejor pero no tiene hitbox practicamente. El hitbox tiene que ser todo el largo de la linea.
Tambien tiene que pasar menos tiempo entre golpe y golpe

---


Haz un poco mas grande el hitbox de la espada, no es suficiente

--

No, esta igual. Puede ser por el tiempo de golpeo que es muy corto?

---

ahora mejor pero no suficiente. Incrementa el grosor del hitbox de la espada.
Cuando el personaje desaparece sigue apareciendo algun espadazo si le das a la barra espaciadora en ese instante

---

se tiene que poder golpear mas repetidamente

---


Ahora necesitamos una pantalla de inicio donde indique el nombre del juego "MATA-PACMAN".
Tambien indicará las instrucciones del juego y debajo estará el boton Jugar. 


---

No.
Al pulsar ESC tiene que mostrar el mensaje de si quieres salir del juego. En ese momento TODO el juego se pausa por COMPLETO.
Si seleccionas que si. Volveras a la pantalla incial. Si dices que no se reanudará el juego tal y como estaba cuando se pulsó ESC.

---

Cuando dices que si. El juego se ha de resetear ENTERO como cuando se carga por primera vez. Se ha de INICIALIZAR TODO.


---


Ahora cuando se dice que si se quiere salir del juego, la pantalla se queda negra


---


Sigue comportandose igual, muestra este error

---

