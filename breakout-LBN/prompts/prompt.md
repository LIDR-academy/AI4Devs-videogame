
## Desarrollo de un videojuego arcade en 2D

### Contexto inicial

Como **desarrollador de videojuegos** tu misión es desarrollar un videojuego arcade similar a Breakout. El famoso juego en el que una bola rompe ladrillos en la parte superior de la pantalla.
El videojuego debe ser desarrollado para ser ejecutado en un navegador web con las tecnologías html, css y javascript.
Puedes utilizar el framework o librería que mejor creas para llevar a cabo la tarea.

### **Breakout – Requisitos funcionales**

#### 1. Mecánica básica del juego
- **Pelota**:
  - Rebota en paredes y en la pala.
  - Rebota y destruye ladrillos al colisionar.
  - Si cae por debajo de la pala → perder vida o fin de partida.

- **Pala (barra del jugador)**:
  - Control con teclado (← y →) o con ratón.
  - Debe estar limitada al ancho de la pantalla.

- **Ladrillos**:
  - Distribuidos en una cuadrícula (filas y columnas).
  - Al golpear un ladrillo con la pelota, este desaparece.
  - Los ladrillos serán de colores y de diferentes tamaños.

- **Condición de victoria**:
  - Todos los ladrillos destruidos.

- **Condición de derrota**:
  - La pelota cae y el jugador pierde.
  - Habrá un sistema de vidas. Al iniciar el juego, se obtienen tres vidas. Al llegar a cero el jugador pierde.

---

#### 2. Lógica y estados del juego
- Pantalla inicial con botón “Jugar”.
- Estados: Inicio, En juego, Game Over, Victoria.
- Reinicio de partida desde el estado final.

---

#### 3. Puntuación y HUD
- Mostrar en pantalla:
  - Puntuación actual.
  - Número de vidas restantes.
  - Nivel actual (dejarlo preparado para un sistema de niveles que se implementará más adelante).

---

#### 4. Gráficos y diseño
- Uso de `<canvas>` para renderizar el juego.
- Estilo arcade simple: colores planos.
- Diseño con tamaño fijo (por ejemplo, 800x600 px).

---

#### 5. Efectos de sonido (opcional)
- Sonido al rebotar la pelota.
- Sonido al romper ladrillos.
- Sonido de victoria o derrota.

---

#### 6. Testing básico
- Verificar colisiones precisas.
- Controlar límites de la pala.
- Asegurar que la pelota nunca se “queda atrapada” en loops.

### Entrega a realizar

Tu **misión** es desarrollar la primera versión del videojuego, entregando los siguientes artefactos:
- Fichero readme.md con instrucciones para la instalación y descripción de todas las funcionalidades.
- Fichero manual.md con un manual de uso del videojuego para los usuarios.
- Ficheros html, css y javascript separados, utilizando buenas prácticas de desarrollo de software y código seguro, así como cumpliendo los estándares de seguridad definidos en OWASP.
