-----
PROMPT #1
-----

Cual consideras que es el mejor framework/libreria para un videojuego que funcione en browser usando HTML5/CSS/Javascript y basado en las mecanicas de juego de Megaman X y Castlevania. Responde de manera concreta.

-----
PROMPT #2
-----

Eres un Senior Game Developer, enfocado en desarrollo de videojuegos, usando tecnologias como HTML, CSS, y JS. Tienes conocimiento sobre mecanicas de juego y sistemas de juego de juegos 2D.

Vamos a crear un videojuego desde cero, llamado "Knightmare" usando la tecnologia Phaser.js. Primero crea la estructura de carpetas para la creacion del videojuego desde cero, y usando assets como spitesheets, animaciones y sonido. No quiero que crees codigo aun, solo los archivos y carpetas necesarias para empezar a desarrollar.

La estructura del proyecto sera: 
  │── index.html
  │── style.css
  │── main.js
  │── assets/
  │    │── images/
  │    │── audio/

Ejecuta los comandos necesarios para crear todos los directorios y archivos. Una vez que ya esten creados, modifica index.html, style.css y main.js para que muestre el titulo del juego en pantalla solamente. Verifica que Phaser ha sido añadido correctamente, y manten tus acciones lo mas simples posibles, cumpliendo los objetivos requeridos.

Si tienes alguna pregunta no dudes en consultar.

-----
PROMPT #3
-----

Eres un Senior Game Developer. Nuestra primera tarea, sera crear el personaje Player al juego. Para ello, usaremos como referencia juegos 2D platformer como Megaman X5, y Castlevania SOTN. Ya tenemos la estructura principal de carpetas lista, me gustaria que primero echaras un vistazo para que te familiarices con la estructura. 

Luego, necesito que: 
1. Crees un suelo plano para el juego.
1. Crees el personaje principal que controlara el jugador o "Player".
2. El Player debe moverse de izquierda a derecha.
3. El player puede saltar y caer.
4. El player puede hacer dash.
5. El player tiene una reaccion de back push cuando recibe daño. No ejecutes ninguna logica de salud, solo deja el comportamiento listo, y que se pueda probar.

Dichas acciones se podran probar con los siguientes inputs: 
1. Movimiento Izquierda: Flecha Izquierda o Tecla A
2. Movimiento Derecha: Flecha Derecha o Tecla D
3. Salto: Flecha Arriba o tecla W
4. Dash: Shift Izquierdo
5. Back Push (Solo Test): Tecla F.

Utiliza figuras geometricas de distintos colores, para ver la representacion del personaje y de las balas que dispara. Enfocate solamente en la creacion del personaje, y para la visualizacion del juego usa referencias de camara como en los juegos antes mencionados.

-----
PROMPT #4
-----

Dibuja al player de un color Gris. No lo puedo ver con el fondo negro. Añade una linea para saber la direccion de los inputs que estoy presionando.

-----
PROMPT #5
-----

El concepto del juego en Knightmare, es atravesar la mayor cantidad de puertas posibles antes de morir. Cada nivel tiene una puerta cerrada, y el jugador debe explorar un nivel para encontrar una llave y poder abrir la puerta que lo llevara a otro nivel.

Antes de crear niveles, nuestras segunda tarea sera crear el objeto Llave o "Key". Para ello, las caracteristicas son:

* Es un objeto que aparece en el nivel de forma aleatoria
* El jugador la recoge al pasar a traves de el.
* Cuando la llave es recogida, el jugador suma 500 pts y aparece un icono sobre el, indicando que tiene la llave.

Usa representaciones basicas como un cuadrado amarillo, para colocar la llave en el nivel actual, y el icono de llave sobre el player cuando es recogido. Agrega tambien un contador de puntos que pueda ser legible y estilizado. Usa el CSS para esto.

-----
PROMPT #6
-----

La llave no esta colisionando con el suelo. Debe colisionar con el mundo pero debe overlapear su colision con el jugador para que sea detectado cuando este lo recoge. Reparalo.

-----
PROMPT #7
-----

Funciona bien, pero ya no puedo saltar. Necesito que: 

1. Repares el comportamiento para que el personaje pueda saltar de nuevo. 
2. Agregues un panel de Debug que me permita revisar: 
* Velocidad en X del Player.
* Velocidad en Y del player.
* Si el player tiene la llave o no.
* Este panel debe prenderse y apagarse oprimiendo la Tecla 0.
* Debe vivir en el margen Derecho superior del Viewport.
* Debe ser legible y abierto a incluir mas variables.

-----
PROMPT #8
-----

El personaje no salta porque segun el panel de Debug, su velocidad es de -0.83, por lo que lo considera aun cayendo. Necesito que: 

1. Corrijas este error, porque cuando el personaje no esta cayendo, y permanece sobre una superficie, su velocidad vertical deberia ser cero. Al parecer, se debe a la linea 102, porque nunca reconoce el this.player.body.touching.down como TRUE, y deberia serlo cuando toca el suelo.
2. Agrega en el panel de Debug, el ultimo estado en el que se encuentra el player: Movement, Jump, Dash, o Push Back.

-----
PROMPT #9
-----

Nuestra tercera tarea sera crear el objeto Puerta o "Door". Para ello, las caracteristicas son:

* Es un objeto que aparece en el nivel, en lugares que el jugador puede alcanzar, es decir, sobre Suelo.
* No tiene gravedad.
* Tiene dos estados: Cerrado y Abierto
* Si el jugador pasa por la puerta cerrada, no pasa nada.
* Cuando el jugador coge una llave, la puerta pasa de estado Cerrado a Abierto.
* Si el jugador pasa por la puerta en estado Abierto, suma 1000 pts y muestra un estado de Win.

Usa una figura geometrica rectangular vertical para representar la puerta. Dicha puerta debe ser Roja, cuando esta cerrada, y Verde cuando esta abierta. Asegurate de que el player pueda pasar a traves de ella, y que dicha puerta se dibuje por detras del player.
@Phaser 

-----
PROMPT #10
-----

En el Win condition, luego de agregar los puntos, quitale la llave al player y cierra la puerta. Luego de esto, genera una nueva llave en el nivel para que el jugador la busque y abra de nuevo. Remueve el mensaje de Win COndition

-----
PROMPT #11
-----

Nuestra 4ta tarea, sera crear a nuestro primer enemigo. Debemos crear un objeto Enemigo o "Enemy" que cumpla las siguientes caracteristicas: 

* Es un objeto fijo sobre el suelo en el mundo.
* Puede mirar a la derecha o izquierda, dependiendo de donde este posicionado el jugador.
* Cada segundo va a disparar un proyectil. Dicho proyectil no es afectado por la gravedad y se destruye al colisionar con un objeto.
* El proyectil del enemigo le quita puntos de vida al jugador si colisiona con el.

Para ello: 
- Crearemos el objeto Enemy con todos los parametros mencionados arriba. No olvides añadir una linea para saber hacia que direccion esta mirando el Enemigo.
- Representa al enemigo con un Rombo Naranja.
- Representa los proyectiles enemigos con un circulo rojo.
- El Player tendra una barra de vida de 0 a 100.
- Cuando el player reciba un impacto de proyectil enemigo, debe hacer push back y perder 10 puntos de vida.
- Cuando el player llegue a cero de vida, hay mensaje de game over y el player no puede moverse mas.

-----
PROMPT #12
-----

Me gustaria hacer unos ajustes: 

- Los proyectiles del Enemigo deben ser de color blanco.
- Los proyectiles enemigos no deben colisionar con los enemigos.
- La direccion tanto del player como del Enemigo debe activarse y desactivarse con el boton de Debug (Tecla 0)
- Remueve el boton de test del PushBack.
- Añade una variable al debug panel para saber cuantos enemigos existen, y el estado de las puertas en el nivel (teniendo en cuenta que se agregaran mas).

-----
PROMPT #13
-----

Cuando el enemigo es destruido, sus proyectiles siguen disparando. Corrige y refactoriza de ser necesario este comportamiento, porque vamos a tener muchos mas enemigos en pantalla y necesito que cada uno dispare por separado, y debemos tener control de quien esta disparando y donde detenerlos. 

-----
PROMPT #14
-----

Muchisimo mejor ! Pero ahora, perdimos la logica en donde los proyectiles del Player se destruyen cuando tocan los proyectiles enemigos, y la deteccion de daño cuando el proyectil del player colisiona con el Enemigo. Recuerda que, al destruirse el Enemigo, este debe dejar de disparar.

-----
PROMPT #15
-----

Eres un Level Designer experto en plataformas 2D. La imagen adjunta @LevelLayout.png es la referencia de un nivel de Megaman, lleno de habitaciones, huecos, y plataformas. Usaremos esto como referencia para crear nuestro propio nivel. 

Para ello, considera: 

- El movimiento de camara es basado en Megaman X y Castlevania, en donde, a medida que el jugador avanza o se devuelve, dicha camara lo sigue.
- El nivel debe poder recorrerse en su totalidad, sin ningun bloqueo, o salto imposible.
- El nivel debe ser un loop, es decir, En algun punto, debe volver al inicio. 
- El jugador puede recorer el nivel de izquierda a derecha y de derecha a izquierda.
- Recuerda mantener los parametros de cada objeto en el mundo, como la gravedad y las reglas de cada contexto.

Con estos parametros, crea un nivel coherente, que sea facil de recorrer con las mecanicas actuales. Manten el numero d eobjetos como llaves, puertas y enemigos, tal como estan actualmente.

@Phaser 

-----
PROMPT #16
-----

Hagamos ajustes al nivel: 
- Agrega mas plataformas en el nivel, porque hay zonas que estan muy altas, y no hay camino para subir.
- Agrega solo 2 huecos que ocasionen game over inmediato al caer en ellas, considerandolos pozos sin fondo.
- Los proyectiles tanto de los enemigos, como del player colisionan con pisos y paredes de las plataformas.
- Agrega 6 puertas en todo el nivel, separadas de manera equidistante una de la otra por todo el nivel. Recuerda que deben estar ubicadas en puntos alcanzables por el jugador.
- Ajusta y modifica la logica de la llave, para que, al ser recogida, esta escoja solo una de las puertas en el nivel para abrirla.

-----
PROMPT #17
-----

Realicemos mas correcciones: 
- Estas usando muchas plataformas verticales que no permiten acceder a las puertas. Remuevelas.
- Las plataformas horizontales siguen estando muy altas. Bajalas o añade mas plataformas en la parte baja que permitan subir.
- No veo la llave. Asegurate de estar colocando la llave en un lugar coherente sobre el piso o una plataforma, nunca sobre los huecos.
- El GameOver de los huecos deben mostrar el comportamiento de Game Over como si el jugador hubiese perdido toda su vida.

-----
PROMPT #18
-----

Realicemos mas correcciones: 
- Estas usando muchas plataformas verticales que no permiten acceder a las puertas. Remuevelas.
- Las plataformas horizontales siguen estando muy altas. Bajalas o añade mas plataformas en la parte baja que permitan subir.
- No veo la llave. Asegurate de estar colocando la llave en un lugar coherente sobre el piso o una plataforma, nunca sobre los huecos.
- El GameOver de los huecos deben mostrar el comportamiento de Game Over como si el jugador hubiese perdido toda su vida.

-----
PROMPT #19
-----

Eres un Senior Game Development con grandes aptitudes en HTML, CSS, JS, y usando Phaser.js. Hagamos mas correcciones al juego actual:

1) La llave debe colisionar con los objetos y plataformas del nivel.
2) La llave no puede aparecer sobre huecos, ni sobre puertas, ni sobre enemigos.
3) En la parte superior del viewport: 
* Crea una flecha auxiliar, que apunte hacia el objetivo que debe perseguir el jugador: Si no tiene llave, apunta al lugar donde este posicionada la llave, y si tiene la llave debe apuntar a la puerta que debe abrir. 
* Cuando apunta a la llave debe ser una flecha de color amarillo. 
* Cuando apunta a la puerta abierta, debe ser una flecha de color verde.
* Cuando el jugador entra a la puerta abierta, la flecha debe apuntar a la siguiente llave y otra vez tomar color amarillo.
* Esta herramienta solo debe verse cuando el panel de debug este abierto.
3) Remueve la plataforma que señalo en la imagen adjunta. Es la que esta señalada en Naranja.

-----
PROMPT #20
-----

Ahora la tarea será la creación del item de curacion. Para ello considera:

- Item que solo detecta al player.
- Si el player toca el item, este le brinda 20 puntos de vida.
- No le afecta la gravedad.
- Aparece solo cuando el player iteractua con una puerta abierta. En ese caso, aparece sobre la puerta, para ser recogida por el Player como recompensa.

Crea el item en el juego con sus parametros. No vayas a hacer ninguna modificacion de nivel que no sea la pedida. 
@Phaser 

-----
PROMPT #21
-----

Ajustemos: 
- Incrementa en 15 pixeles mas, la altura de aparicion del item de curacion
- Remueve la limitante maxima de salud del player. Puede superar los 100 unidades.
- Recuerda los ajustes de puntuacion: Recoger llave, da 150 pts, interactuar con puerta abierta da 350 pts,  eliminar enemigos da 100 pts.

-----
PROMPT #22
-----

Realizaremos ajustes en los enemigos para crear una curva de dificultad: 
1) Reactivaremos el ataque de los enemigos. Ya no comentes las lineas de codigo donde atacaban antes.
2) Por cada muerte del enemigo, el sistema debe crear dos enemigos nuevos, no sin antes Revisar dos posiciones validas en todo el nivel donde puedan ser ubicados (no intereccion con plataformas, puertas, llaves o el player).
3) Los enemigos deben atacar cuando el Player este a menos de 200 pixeles de distancia.
4) Al eliminar a un enemigo, la frequencia de disparo de todos los enemigos debe acortarse: Si entre cada disparo hay 1 segundo, al morir un enemigo debe bajar 0.05 segundos por lo que ahora dispararan cada 0.95 segundos.

-----
PROMPT #23
-----

Ahora vamos a agregar una pantalla de menu principal y revisar la de game over.

MENU PRINCIPAL
* Debe tener el titulo del Juego.
* Debe mostrar las instrucciones de juego.
* Debe tener un boton de Play para comenzar la partida.

GAME OVER
* Por alguna razon, la pantalla que teniamos ya no funciona. Revisala porque no se esta mostrando nada en pantalla cuando el jugador pierde toda su salud o se cae a un hueco.
* Al entrar en Game Over, la info de Debug, de Score y Health debe ocultarse.
* El Game Over debe mostrar en su pantalla, la puntuacion final, enemigos destruidos y puertas abiertas.
* Debe tener un boton de replay que refresque la pagina.

-----
PROMPT #24
-----

Aparentemente el Game Over no se esta renderizando en la posicion de la camara, por lo que tenemos una camara dinamica con movimiento. Asegurate que el GameOver aparezca y tenga en cuenta la posicion actual de la camara para aparecer donde debe. 

-----
PROMPT #25
-----

Vamos a agregar assets graficos para el juego. 

Usa @Background.png para el fondo del nivel. Ajusta y escala la imagen de ser necesario para que pueda ocupar todo el lienzo del nivel y no queden huecos

Estos son cambios netamente esteticos, por lo que nada de cambios con respecto a colisiones o gravedad debe ocurrir. Solo el cambio de arte implementando estos assets. Asegurate de que todos los objetos sigan comportandose de la misma manera.

-----
PROMPT #26
-----

Ahora cargaremos assets graficos para los objetos: 

LLAVE
- Usa @Key.png para la representacion del objeto Llave. Esta imagen debe estar al doble de la escala de la actual colision para que no se vea tan pequeña.
- Usa @KeyIcon.png para el icono sobre el jugador, cuando tiene una llave. Remueve la representacion grafica con el cuadro amarillo que teniamos previamente.

PUERTA
- Usa @door_closed.png para las puertas en estado cerrado. Intenta ajustar el tamaño de la imagen a las colisiones actuales.
- Usa @door_open.png para las puertas en estado abierto. Al igual que el anterior punto, intenta ajustar el tamaño de dichas puertas a las colisiones actuales.

ITEM CURATIVO
- El item curativo es una animacion de 8 frames asi: @frame-1.png @frame-2.png @frame-3.png @frame-4.png @frame-5.png @frame-6.png @frame-7.png @frame-8.png . Ajusta el tamaño de estas imagenes al tamaño de la colision del objeto Curativo.

Recuerda que son solo modificaciones esteticas, por lo que no deberia afectar el comportamiento actual de ninguno de loss objetos como colisiones, gravedad, etc. Asegurate de eso.
@Phaser 

-----
PROMPT #27
-----

Cambiemos la representacion de los puntos de vida y el Score. Para ello: 
- Crea una barra de progreso que represente la salud o barra de vida actual del player. A medida que el jugador recibe daño, esta barra va disminuyendo, representando su salud.
- La barra de progreso contendra adentro el texto de salud actual / salud maxima.
- Si el jugador sobrepasa el limite de 100 puntos de vida, el nuevo valor sera su vida maxima y la barra se ajustara a dicho valor nuevo.
- El score se mostrara debajo de la barra de vida.

Usa un diseño llamativo que permita visualizar bien los datos expuestos de vida y de puntaje.
@Phaser 

-----
PROMPT #28
-----

Ahora vamos a cargar assets graficos para el Enemigo: 

- En estado Idle, usaremos @0.png @1.png @2.png @3.png para la animacion de Idle. Cuando el Personaje no ataca.
- Cuando ataca, vamos a hacer una corta animacion de estos dos frames @0.png @1.png , para luego volver a la animacion Idle.
- El proyectil del enemigo tiene la representacion animada, por estos 3 frames en loop.@0.png @1.png @2.png . Asegurate de mantener el tamaño de esos frames al tamaño de la colision del proyectil.

Asegurate de usar las rutas correctas donde se encuentra cada uno de los estados, y finalmente verifica que el comprotamiento sea el mismo. No deben haber cambios de jugabilidad.

-----
PROMPT #29
-----

Vamos a hacer unas correcciones: 
- La linea de direccion del enemigo, van a estar ocultas por defecto. Se activaran si oprimimos el boton de Debug. Lo mismo para la linea de direccion del Player.
- El enemigo desde un inicio debe estar en modo Idle, haciendo su animacion.
- El enemigo siempre sabe donde esta el Player, por lo que su orientacion varia en el eje horizontal, dependiendo en donde este ubicado el jugador. Ej: Si el jugador esta a la derecha del enemigo, el debe tener el efecto espejo mirando hacia el, y viceversa.
- Reemplaza los numeros de vida de los enemigos, por pequeñas barras de vida color cyan, que representen su vida total y vayan disminuyendo a medida que se les hace daño. Si el enemigo muere, su barra de vida desaparece 

Asegurate que los cambios no afecten tampoco el panel de Debug. 

-----
PROMPT #30
-----

Realizaremos la penultima carga de assets de imagenes, y sera con el entorno.

- Usa@Castle_Rock01.png para el suelo mas grande del nivel. Si es necesario repite el Tile, para no tener que estirarlo por toda la colision, y que se vea uniforme.
- Usa @Castle_Pit.png para el pit, o la colision de caida. 
- Usa @Castle_Platform02.png @Castle_Platform03.png para las plataformas. Puedes seleccionar la que mas se ajuste al tamaño de cada plataforma, pero debes variar entre todas para que hayan multiples plataformas con distintas formas.

Te recuerdo que son modificaciones visuales, mas no debe afectar en ninguna circunstancia colisiones, gravedad u otros comportamientos actuales. 

-----
PROMPT #31
-----

Vamos a realizar unas correcciones: 
1) Los tiles de algunas plataformas se ven estiradas. Revisa cada plataforma y repite el Tile si es necesario, sin modificar la colision en cada plataforma, para que se vea mejor. Esto no debe modificar las plataformas actuales ni sus tamaños ni sus posiciones.
2) El Background esta demasiado estirado horizontalmente. Reducelo en escala un 50% y si es necesario, repite el tile para que cubra todo el nivel.
3) Los enemigos seran afectados por la gravedad. Ya no quedaran en el aire, asi que asegurate que, cuando se verifique una nueva posicion para crearlos, no queden sobre el jugador, sobre los pit, etc.
4) Me volvio a ocurrir este error cuando fui a tocar una llave. Verifica que este arreglado. 

-----
PROMPT #32
-----

Vamos a corregir: 
- El Background lo veo mejor, pero ahora necesito que ocupe la pantalla. Para ello, escala de manera vertical el Tile un 50% adicional, y a nivel horizontal un 25% adicional.
- Regresa a la version de Tiles anterior para las plataformas, el cambio que hiciste da un mal affordance de como son las colisiones. Regresa a esa version anterior de plataformas. 
- Hay un caso borde: Si el personaje va hacia la izquierda y se detiene, queda mirando siempre hacia la derecha. El deberia recordar su ultima direccion, por si, se quiere disparar detenido, use la ultima direccion en la que se dirigia.

-----
PROMPT #33
-----

Finalmente, haremos la representacion grafica del personaje Player: 
1. Usa @player_bullet.png para el proyectil del Player
2. Usa @player_pew.png arriba del jugador para indicar cuando esta disparando. Este deberia aparecer al disparar y desaparecer a los 0.5 segs. Si se dispara de nuevo durante la espera de 0.5 segs, el contador se reinicia a otros 0.5 segs. Aplicalo manteniendo las proporciones originales de la imagen.
3. Usa @player_run0.png @player_run1.png @player_run2.png @player_run3.png @player_run4.png @player_run5.png como animacion por defecto del jugador. Esta representacion grafica, debe ajustarse al tamaño actual de nuestro Player, por lo que no debe modificar por nada la colision.

Recuerda que esto es solo implementacion visual por lo que nada de la logica actual del Player debe ser modificado, mas alla de implementar estos assets. Ningun otro objeto debe resultar modificado.