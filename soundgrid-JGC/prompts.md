# Prompt 1
**Role**: Eres un experto desarrollador de videojuegos web con 10+ años de experiencia en Phaser.js, diseño de mecánicas de juego y pedagogía para principiantes. Tu objetivo es ayudarme a construir un juego paso a paso, explicando conceptos clave, dando código modular y evitando sobrecarga de información.

**Contexto del Proyecto**:
- **Juego**: "Sound Grid" (juego de memoria auditiva).
- **Tecnología**: Phaser 3 + JavaScript.
- **Objetivo Inicial**: Cuadrícula 2x2 donde cada celda emite un sonido único; el jugador debe repetir secuencias generadas aleatoriamente.

**Core Gameplay**:  
- Una cuadrícula de 4 bloques (2x2) donde cada uno emite un sonido único.  
- El juego genera secuencias de sonidos que el jugador debe repetir en orden.  
- Cada nivel aumenta la longitud de la secuencia.  
- Pierdes si fallas 1 vez.  

**Estilo Visual**:  
- Diseño minimalista y moderno.  
- Feedback visual claro en cada acción (aciertos/errores).  
- Ambiente inmersivo con efectos sutiles.  

**Requerimientos Técnicos**:  
- Desarrollar con Phaser.js.  
- Priorizar simplicidad sobre optimización.  
- Assets básicos (sin arte complejo).

**Instrucciones**:
1. Espera a que te solicite cada etapa (no des código anticipado).
2. Prioriza soluciones simples sobre código optimizado en esta fase.
3. Explica brevemente cada concepto antes de implementarlo.
4. Usa términos técnicos pero con analogías claras.
___
# Prompt 2

Crea la estructura base del proyecto:  
- Ventana de juego cuadrada centrada en pantalla.  
- Fondo oscuro elegante.  
- Sistema para cargar recursos (sonidos/imágenes).

Todo el desarrollo se basará en el uso de HTML, CSS y Javascript, con @Phaser3 , y deberás ubicarlo en la carpeta @soundgrid-JGC 
___
# Prompt 3
Implementa la cuadrícula principal:  
- 4 bloques distribuidos uniformemente.  
- Cada bloque debe:  
  - Cambiar de color al pasar el mouse.  
  - Tener un color distinto cuando está activo.  
  - Ser claramente clickeable.  
___
# Prompt 4
veo el siguiente error:

Uncaught TypeError: cell.setShadow is not a function
    at createGrid (game.js:190:14)
    at initialize.create (game.js:142:5)
    at initialize.create (phaser.min.js:1:491015)
    at initialize.bootScene (phaser.min.js:1:490336)
    at initialize.start (phaser.min.js:1:494019)
    at initialize.bootQueue (phaser.min.js:1:488688)
    at o.emit (phaser.min.js:1:8120)
    at initialize.texturesReady (phaser.min.js:1:792521)
    at o.emit (phaser.min.js:1:8120)
    at initialize.updatePending (phaser.min.js:1:498828)
___
#Prompt 5
Añade sonidos al juego:  
- 3 tonos musicales distintos.  
- Cada fila de bloques usa un tono diferente.  
- Al clickear un bloque: reproduce su sonido + feedback visual.
___
# Prompt 6
Uncaught Error: Audio key "note_c4" missing from cache
    at new initialize (phaser.min.js:1:523701)
    at initialize.add (phaser.min.js:1:521060)
    at initialize.create (game.js:158:29)
    at initialize.create (phaser.min.js:1:491015)
    at initialize.loadComplete (phaser.min.js:1:490466)
    at o.emit (phaser.min.js:1:8246)
    at initialize.loadComplete (phaser.min.js:1:944358)
    at initialize.fileProcessComplete (phaser.min.js:1:944058)
    at initialize.nextFile (phaser.min.js:1:943649)
    at initialize.onLoad (phaser.min.js:1:20751)
___
# Prompt 7
Crea el sistema de secuencias:  
1. Generar secuencia aleatoria que crece cada nivel.  
2. Reproducir secuencia automáticamente:  
   - Bloques se iluminan al activarse.  
   - Tiempo entre cada paso de la secuencia.  
3. Validar los clicks del jugador contra la secuencia. 
___
# Prompt 8
adapta el diseño para el tablero de juego se parezca al de la imagen que adjunto
___
# Prompt 9
Haz los siguientes ajustes:
 - Extiende el fondo de la interfaz a todo lo que ocupa la pantalla
 - El nivel debe aparecer en el círculo del centro del tablero, como un contador numérico rojo
 - El botón "Empezar" no debe solaparse con el tablero 
___
# Prompt 10
cuando el usuario falle, quiero que suene un sonido estridente paracido al de un error
