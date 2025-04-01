1) Que tecnologia crees que es la mas adecuada para implementar este juego?

2) Perfecto utilicemos Phaser.js
Comencemos implementando el ecenario dell juego y el personaje que sea solamente una pelotita que parta en la linea de inico.
al apretar la barra espacio se mueve hacia la meta

3) Quiero que la Horientacion sea hacia el lado que el personaje parta a la izquierda y se mueva a la derecha.
La barra espacio no esta moviendo el personaje

4) Aun no se mueve la pelotita, estos son los errores....

5) Aun no carges los audios elimina la implementacion de los audios

6) Los logs son:
Tecla ESPACIO presionada
game.js:297 Cambiando a estado moving
game.js:309 Velocidad: 5
game.js:309 Velocidad: 10
game.js:309 Velocidad: 15
game.js:309 Velocidad: 20
game.js:309 Velocidad: 25
game.js:309 Velocidad: 30
game.js:309 Velocidad: 35
game.js:309 Velocidad: 40
game.js:309 Velocidad: 45
game.js:319 Deteniendo jugador
26game.js:290 Tecla ESPACIO presionada

Si bien esto pasa la pelotita no se mueve.
Comenta por ahora la implementacion del mini Juego.

7) Perfecto, Ahora quiero que implementes la Inercia del Jugador que acelere de a poco y frene de a poco.

8) Guando la luz sea verde pon la musica de assets/audio/greenLight.mp3.
Para la musica y luego cambia el semaforo de color con 0.2 segundos despues si alguien cuando el semaforo esta en rojo se mueve pierde

9) Creo que hay un error al cargar el audio.
index.html:1 Access to XMLHttpRequest at 'file:///Users/rkm/Desktop/Estudio/lidr/AI4Devs-videogame/red_green_light-JMR/assets/audio/greenLight.mp3' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.Comprende este errorAI
phaser.min.js:1 Uncaught Error: Audio key "greenLight" missing from cache
    at new initialize (phaser.min.js:1:523701)
    at initialize.add (phaser.min.js:1:521060)
    at initialize.create (game.js:96:34)
    at initialize.create (phaser.min.js:1:491015)
    at initialize.loadComplete (phaser.min.js:1:490466)
    at o.emit (phaser.min.js:1:7809)
    at initialize.loadComplete (phaser.min.js:1:944358)
    at initialize.fileProcessComplete (phaser.min.js:1:944058)
    at initialize.nextFile (phaser.min.js:1:943649)
    at initialize.onError (phaser.min.js:1:20816)
initialize @ phaser.min.js:1
add @ phaser.min.js:1
create @ game.js:96
create @ phaser.min.js:1
loadComplete @ phaser.min.js:1
o.emit @ phaser.min.js:1
loadComplete @ phaser.min.js:1
fileProcessComplete @ phaser.min.js:1
nextFile @ phaser.min.js:1
onError @ phaser.min.js:1
XMLHttpRequest.send
t.exports @ phaser.min.js:1
load @ phaser.min.js:1
(anónimas) @ phaser.min.js:1
each @ phaser.min.js:1
checkLoadQueue @ phaser.min.js:1
start @ phaser.min.js:1
bootScene @ phaser.min.js:1
start @ phaser.min.js:1
bootQueue @ phaser.min.js:1
o.emit @ phaser.min.js:1
texturesReady @ phaser.min.js:1
o.emit @ phaser.min.js:1
updatePending @ phaser.min.js:1
o.emit @ phaser.min.js:1
checkKey.n.onload @ phaser.min.js:1Comprende este errorAI
phaser.min.js:1 
            
            
           GET file:///Users/rkm/Desktop/Estudio/lidr/AI4Devs-videogame/red_green_light-JMR/assets/audio/greenLight.mp3 net::ERR_FAILED

10) Lo probe y ahora No hay errores en consola, pero no se reproduce el audio, agrega console.log para poder debugear

11) Si bien aparecen los logs 
Intentando desbloquear audio por interacción del usuario
game.js:119 No se pudo desbloquear el audio
game.js:100 Intentando desbloquear audio por interacción del usuario
game.js:107 Audio desbloqueado correctamente
game.js:347 Objeto greenLightMusic no disponible para pausar
game.js:384 Objeto greenLightMusic no disponible para reproducir
game.js:347 Objeto greenLightMusic no disponible para pausar
game.js:384 Objeto greenLightMusic no disponible para reproducir

el audio no funciona. Cual podria ser el error?


12) Aun no funciona:⭐ Verificando si el audio existe en la caché: false
game.js:179 ⭐ Estado del sistema antes de crear audio: bloqueado
game.js:197 ⭐ Sistema de audio bloqueado, esperando interacción del usuario
phaser.min.js:1 
            
            
           GET https://bigtincan.github.io/sample-audio-files/imperial_march.mp3 net::ERR_FAILED 404 (Not Found)
(anónimas) @ phaser.min.js:1
load @ phaser.min.js:1
(anónimas) @ phaser.min.js:1
each @ phaser.min.js:1
checkLoadQueue @ phaser.min.js:1
start @ phaser.min.js:1
bootScene @ phaser.min.js:1
start @ phaser.min.js:1
bootQueue @ phaser.min.js:1
(anónimas) @ phaser.min.js:1
texturesReady @ phaser.min.js:1
(anónimas) @ phaser.min.js:1
updatePending @ phaser.min.js:1
(anónimas) @ phaser.min.js:1
(anónimas) @ phaser.min.js:1Comprende este errorAI
game.js:105 Intentando desbloquear audio por interacción del usuario
game.js:138 No se pudo desbloquear el audio
game.js:105 Intentando desbloquear audio por interacción del usuario
game.js:112 Audio desbloqueado correctamente
game.js:115 ⭐ Creando audio después del desbloqueo
game.js:128 ⭐ El audio no está en caché
overrideMethod @ hook.js:608
(anónimas) @ game.js:128
(anónimas) @ phaser.min.js:1
processDownEvents @ phaser.min.js:1
update @ phaser.min.js:1
updateInputPlugins @ phaser.min.js:1
onMouseDown @ phaser.min.js:1
s.m.n.startListeners.onMouseDown @ phaser.min.js:1Comprende este errorAI
game.js:252 TECLA ESPACIO PRESIONADA - EVENTO TECLADO

13) https://raw.githubusercontent.com/mozillascience/friendly-github/master/assets/audio/human-voice.mp3 da 404

14) @https://mdn.github.io/learning-area/javascript/apis/introduction/assets/audio-sample.mp3  tampoco esta disponible, por que no puedo usar mi audio local?

15) El audio funciona, pero necesito que sea mi audio y no este, cuales serian los pasos para implementarlo?

16) Refactoriza el codigo con principios SOLID, para que este sea mas legible

17) Genera un plan para cambiar el personaje por el pinguino de los sprites, y animarlo para que camine.

18) Genera un Plan Para refactorizar el codigo y que quede mas mantenible, no cambies las funcionalidades actuales

19) Genera un plan para refactorizar @game.js , para hacerlo mas mantenible has un plan por pasos pequeños

20) Fase 2: Modularización
Crear clase Player
Encapsular toda la lógica del jugador en una clase
Incluir métodos para mover, detener y eliminar al jugador

21) Genera un plan detallado para Cambia el Player y que pase del circulo, el pinguino de los sprites.
Incluye en tu plan la interpretacion de como generar la animacion con los archivos

22) si

23) Si, quiero que cuando el usuario no oprima el teclado el pinguino este estatico parado, actualmente se pone en posicion de slide

24) Ya no esta implementado el pinguino, volvio el circulo!

25) Editemos el Juego para que el pinguino vaya mucho mas lento, a maxima velocidad tiene que tardarse al menos 1 minuto en llegar al otro lado.

26) Editemos el Juego para que el pinguino vaya mucho mas lento, a maxima velocidad tiene que tardarse al menos 1 minuto en llegar al otro lado.

27) Ayudame a mejorar el efecto visual cuando el pinguino muere, quiero que se haga un efecto de sonido de pistola assets/audio/pistol.mp3
, quiero que se reproduzca en el momento que el pinguino muera
tambien quiero que salte y que la sangre quede en el suelo, tambien cuando muere se acaba su inercia y queda queto en el lugar

28) Existe alguna libreria que pueda simular el efecto de la sangre?

29) Implementemos Particle Systems de Phaser

30) Si, ayudame a crear las imagenes

31) 3. Alternativa completa: Generación dinámica de las imágenes

32) Player.js:189 Uncaught TypeError: this.scene.bloodEmitter.explode is not a function
    at initialize.onComplete (Player.js:189:53)
    at initialize.dispatchTweenEvent (phaser.min.js:1:322373)
    at initialize.nextState (phaser.min.js:1:318095)
    at initialize.update (phaser.min.js:1:321646)
    at initialize.update (phaser.min.js:1:1017612)
    at o.emit (phaser.min.js:1:8202)
    at initialize.step (phaser.min.js:1:225406)
    at initialize.update (phaser.min.js:1:490723)
    at initialize.step (phaser.min.js:1:793006)
    at initialize.step (phaser.min.js:1:433503)

﻿
