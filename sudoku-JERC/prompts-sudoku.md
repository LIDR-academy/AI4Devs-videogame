
**Resumen del Juego:**
   - El Sudoku es un juego de lógica en el que el jugador debe completar una cuadrícula de 9x9 celdas con números del 1 al 9.
   - La regla principal es que ningún número se puede repetir en la misma fila, columna o subcuadro de 3x3.
   - El objetivo es completar el tablero cumpliendo todas las reglas.
   - El juego puede ofrecer diferentes niveles de dificultad (fácil, medio, difícil) predefiniendo más o menos números

2. **Requisitos Técnicos:**
   - Usar la libreria de Phaser
   - Compatible con los navegadores modernos: Chrome, Firefox, Safari, etc.

3. **Componentes del Juego:**
   - Tablero de juego (9x9) representado con una tabla o una cuadrícula CSS (display: grid).
   - Celdas interactivas, donde el usuario puede ingresar números.
   - Celdas predefinidas (parte del puzzle inicial) que no se pueden modificar.
   - Botones o controles opcionales:
     - Validar solución
     - Reiniciar juego
     - Generar nuevo tablero
   - Mensajes de estado: "Correcto", "Error", "Juego Completado", etc.

4. **Funcionalidad:**
   - El jugador puede hacer clic en una celda vacía e ingresar un número del 1 al 9.
   - Validación básica: solo se aceptan números válidos.
   - Validación avanzada (opcional): verificar si el número rompe las reglas del juego.
   - Opción de comprobar si el tablero está completo y correcto.
   - Mensaje final cuando el jugador resuelve el Sudoku correctamente.

5. **Estilo:**
   - Mostrar el tablero con bordes visibles y claros para cada subcuadro de 3x3.
   - Celdas con número fijo (dadas) deben tener un estilo distinto (color de fondo o fuente).
   - Las celdas editables deben tener un diseño limpio y una buena experiencia al escribir.
   - Adaptar el juego a diferentes tamaños de pantalla (responsivo).

6. **Optimización y Pruebas:**
   - Código limpio, organizado y comentado para facilitar la lectura.
   - Probar en distintos navegadores para asegurar compatibilidad.
