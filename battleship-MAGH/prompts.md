Prompt 1:

Battleship 3D Isométrico - Juego en el Navegador
Descripción:
Un juego de estrategia basado en "Battleship" (Hundir la Flota) con una perspectiva 3D isométrica. El jugador coloca sus barcos en un tablero y ataca al enemigo seleccionando casillas, mientras que la IA responde con ataques propios. El objetivo es hundir todos los barcos del oponente antes de que el jugador pierda los suyos.

1. Visión General del Juego
Un juego de combate naval donde el jugador y la IA tienen tableros de batalla con barcos ocultos. El jugador ataca casillas enemigas, intentando hundir todos los barcos antes de que la IA lo haga.

🔹 Características clave:
✅ Vista isométrica 3D lograda con HTML, CSS y JavaScript.
✅ Dos tableros: uno para el jugador y otro para la IA.
✅ Colocación de barcos antes del inicio del juego.
✅ Mecánica de turnos: el jugador ataca, luego la IA responde.
✅ IA básica para realizar ataques aleatorios o estratégicos.
✅ Efectos visuales como animaciones de explosión y agua al ser impactado.
✅ Detección de victoria/derrota y pantalla final con resultados.

2. Requisitos Técnicos
✅ HTML + JavaScript puro → Sin bibliotecas externas como Three.js o WebGL.
✅ CSS3 → Transformaciones para la perspectiva isométrica.
✅ OBJLoader → Para cargar los modelos de barcos desde la carpeta /assets/.
✅ Web Audio API → Para efectos de sonido (explosiones, agua, impactos).
✅ GSAP (opcional) → Para transiciones suaves en la interfaz.

3. Componentes del Juego
🔹 Tableros de Batalla (Grids 10x10)
Tablero del Jugador: Muestra la posición de sus barcos y los ataques enemigos.

Tablero de la IA: Oculto hasta que el jugador ataque.

🔹 Barcos (assets/ships/)
Destructor (2 casillas)

Submarino (3 casillas)

Crucero (3 casillas)

Acorazado (4 casillas)

Portaviones (5 casillas)

🔹 Los barcos se renderizan en 3D desde los modelos OBJ en la carpeta /assets/ships/.

🔹 Efectos Visuales
Disparos → Animación de explosión si impacta, onda en el agua si falla.

Sombra de los barcos → Para simular profundidad en la vista isométrica.

🔹 HUD (Interfaz de Usuario)
Indicador de turnos: Muestra si es el turno del jugador o de la IA.

Contador de barcos restantes.

Pantalla de victoria o derrota al final del juego.

4. Controles y Mecánicas
🔹 Interacción con el mouse

Colocar barcos → Hacer clic y arrastrar para posicionarlos antes de empezar.

Atacar casillas enemigas → Clic en la cuadrícula del enemigo.

🔹 Mecánicas de Juego

Colocación de barcos aleatoria o manual antes de empezar.

Turnos alternos entre jugador e IA.

La IA ataca aleatoriamente hasta que encuentre un barco y luego persigue su hundimiento.

El juego termina cuando todos los barcos de un jugador son hundidos.

5. Funcionalidad del Juego
✅ Renderizado isométrico de los tableros y barcos con CSS3 y JavaScript.
✅ Carga de modelos de barcos desde la carpeta /assets/ships/.
✅ Detección de impactos y hundimiento con efectos visuales.
✅ Sistema de turnos con IA básica que busca y destruye.
✅ Sonidos de explosión y agua con Web Audio API.
✅ Pantalla final mostrando victoria o derrota.

6. Gráficos y UI
🎨 Estilo visual: Isométrico, con barcos en 3D y una cuadrícula con efecto de agua.
💡 Luces y sombras para mejorar la percepción de profundidad.
📜 HUD con:

Indicador de turnos.

Contador de barcos restantes.

Mensajes de victoria o derrota.

7. Optimización y Pruebas
✅ Uso eficiente de CSS3 para simular isometría sin WebGL.
✅ Pruebas en múltiples navegadores (Chrome, Firefox, Edge, Safari).
✅ Optimización de modelos 3D para carga rápida.
✅ Detección de colisiones optimizada en el código.

8. Entregable
📂 Un proyecto HTML + JavaScript con la siguiente estructura:

mathematica
Copiar
Editar
battleship-MAGH/
│── index.html  → Punto de entrada principal.
│── game.js     → Lógica del juego, turnos y ataques.
│── ui.js       → Control de la interfaz y efectos visuales.
│── styles.css  → Estilos y efectos isométricos.
│── assets/
│   ├── ships/  → Modelos 3D en formato OBJ.
│   ├── sounds/ → Sonidos de explosión y agua.
│   ├── images/ → Texturas para el agua y los barcos.
📝 Código con comentarios explicativos para facilitar modificaciones.

Prompt 2:
Simplifica el estilo visual del juego para que sea mas entendible y menos complejo, elimina las sombras de los barcos.