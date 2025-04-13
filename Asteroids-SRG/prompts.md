# Prompt para Claude 3.7 y hacer meta prompting

Como experto en prompting, buenas practias de prompts y como experto de diseño de videojuegos y todo lo relacionado con su creación genera un prompt en base a las siguientes instrucciones "1. **Elige un concepto de juego:** Puede ser cualquier tipo de juego que te interese desarrollar, desde un juego de plataformas hasta un puzzle o un juego de estrategia. 2. **Crea los archivos necesarios:** Dentro de la carpeta con el nombre de tu juego y tus iniciales (por ejemplo, `yourGameName-Initials`), añade todos los archivos necesarios para tu juego, incluyendo HTML, CSS y JavaScript. Si tu juego requiere imágenes u otros recursos, asegúrate de incluirlos también y documenta el proceso." para el punto 1 vamos a eligir el videojuego de Asteroids la idea es replicar el juego a la perfección, incluyendo mecanicas y assets al ser un juego simple con el mismo Javascript y CSS los puedes generar.


# Prompt para Cursor utilizando Claude 3.7 y el modo agent

## Objetivo
Crea una réplica fiel del juego clásico Asteroids usando HTML, CSS y JavaScript puro (vanilla). El juego debe incluir todas las mecánicas originales y un estilo visual similar al arcade original.

## Estructura de Archivos
Crea una carpeta llamada `Asteroids-SRG` que contenga:

1. `index.html` - Estructura básica y canvas para el juego
2. `style.css` - Estilos minimalistas para la interfaz
3. `script.js` - Toda la lógica del juego
4. `README.md` - Documentación del proyecto y controles

## Mecánicas a Implementar
- **Nave del jugador**: Rotación, aceleración con inercia, disparos y teletransporte al salir de la pantalla
- **Asteroides**: Diferentes tamaños (grande, mediano, pequeño), movimiento aleatorio, división en asteroides más pequeños al ser destruidos
- **Disparos**: Proyectiles limitados, tiempo de vida, colisiones
- **Ovnis**: Enemigos que aparecen periódicamente y disparan al jugador
- **Sistema de puntuación**: Puntos por destruir asteroides y ovnis
- **Vidas**: Perder una vida al chocar con un asteroide o disparo enemigo
- **Niveles**: Aumentar la dificultad con más asteroides o mayor velocidad en niveles superiores

## Características Visuales
- Estilo vectorial minimalista en blanco y negro
- Efectos de partículas al destruir asteroides
- Animaciones fluidas de movimiento con inercia
- Interfaz retro que muestra puntuación y vidas restantes

## Requisitos Técnicos
- Usa el elemento Canvas para renderizar el juego
- Implementa detección de colisiones precisa
- Crea un bucle de juego eficiente con requestAnimationFrame()
- Optimiza el rendimiento para una experiencia fluida
- Implementa controles responsivos tanto para teclado como para dispositivos táctiles

## Pruebas y Documentación
- Documenta el proceso de desarrollo
- Prueba el juego en diferentes navegadores
- Incluye instrucciones de juego en la pantalla de inicio
- Añade comentarios en el código para explicar las partes críticas

## Entrega
Todos los archivos necesarios deben estar organizados en la estructura de carpetas mencionada anteriormente. El juego debe ser totalmente funcional al abrir el archivo index.html en cualquier navegador moderno.

## Referencias
- Utiliza el juego original Asteroids (1979) de Atari como referencia principal
- Mantén la esencia del juego original mientras implementas las mecánicas principales