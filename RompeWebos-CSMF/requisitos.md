# **Requisitos Técnicos y Funcionales - RompeWebos**

## **1. Introducción**
"RompeWebos" es un videojuego basado en la lógica del clásico *Minesweeper*. Su objetivo es descubrir todas las celdas seguras sin activar ninguna bomba (*Webo*). Este documento describe los requisitos funcionales y técnicos para su desarrollo e implementación.

---

## **2. Requisitos Funcionales**

### **2.1 Jugabilidad**
- El juego genera un **tablero de NxM** celdas.
- Se colocan aleatoriamente **bombas (Webos)** en ciertas celdas.
- El jugador puede hacer **clic izquierdo** en una celda:
  - Si hay un Webo, **pierde la partida** y en esa celda se muestra el emoji 🍳.
  - Si no hay Webo, se muestra el **número de Webos adyacentes**.
  - Si no hay Webos adyacentes, se descubren **automáticamente las celdas vacías conectadas**.
- El jugador puede hacer **clic derecho** en una celda para **marcarla con una bandera**, la cual será representada con el emoji 🐣.
- Se incluyen **tres niveles de dificultad** seleccionables mediante botones:
  - **Fácil**: Tablero de 10x10 con 15 Webos.
  - **Medio**: Tablero de 15x15 con 40 Webos.
  - **Difícil**: Tablero de 25x15 con 75 Webos.
- La partida finaliza cuando:
  - El jugador **descubre todas las celdas sin Webos** (**Victoria**).
  - El jugador **hace clic en una celda con Webo** (**Derrota**).
- Después de perder la partida:
  - Solo el Webo que activó la derrota se muestra con el emoji 🍳.
  - Los Webos no marcados correctamente se muestran con el emoji 🥚.
  - Las celdas marcadas erróneamente muestran el emoji 🐣 con el emoji ❌ **superpuesto** mediante estilos CSS.
  - Las celdas marcadas correctamente siguen mostrando el emoji 🐣.
- Se muestra un **cronómetro** y un **contador de Webos restantes**.
- Botón para **reiniciar la partida**.

### **2.2 Interfaz Gráfica**
- **Diseño visual atractivo**, con animaciones y transiciones fluidas.
- Representación visual de:
  - Celdas cubiertas.
  - Celdas descubiertas (con números o vacías).
  - Celdas con Webos (cuando explotan, 🍳).
  - Celdas marcadas con bandera (🐣).
  - Celdas con Webos no marcadas tras perder (🥚).
  - Celdas marcadas erróneamente tras perder (❌🐣).
- Mensajes emergentes al ganar o perder.

---

## **3. Requisitos Técnicos**

### **3.1 Tecnologías a Utilizar**
- **HTML5**: Estructura del juego y elementos interactivos.
- **CSS3**: Estilos, animaciones y efectos visuales.
- **JavaScript (Vanilla o con Phaser.js)**: Lógica del juego e interactividad.
- **LocalStorage (opcional)**: Guardado de puntuaciones o estado del juego.

### **3.2 Estructura del Proyecto**
```
rompewebos/
│── index.html   # Estructura del juego
│── style.css    # Estilos y animaciones
│── script.js    # Lógica del juego
│── assets/
│   ├── images/  # Iconos y sprites
└── README.md    # Documentación
```

### **3.3 Lógica del Juego**
- **Representación del tablero**: Matriz `NxM`.
- **Generación aleatoria de Webos**.
- **Cálculo de números de Webos adyacentes**.
- **Manejo de eventos**:
  - Clic izquierdo: Descubrir celda.
  - Clic derecho: Marcar celda con bandera (🐣).
- **Expansión de celdas vacías** (DFS o BFS).
- **Condiciones de victoria/derrota**.
- **Revelación de celdas tras perder**:
  - Webos no marcados: 🥚.
  - Celdas erróneamente marcadas: ❌🐣.

### **3.4 Optimización y Accesibilidad**
- Uso eficiente del **DOM y eventos**.
- **Diseño responsivo** para distintos dispositivos.
- **Compatibilidad con navegadores modernos** (Chrome, Firefox, Edge, Safari).
- Accesibilidad mejorada para usuarios con discapacidades visuales.

---

## **4. Pruebas y Publicación**

### **4.1 Pruebas**
- **Pruebas unitarias** para la lógica del juego.
- **Pruebas en diferentes navegadores**.
- **Feedback de usuarios para mejoras en la UX/UI**.

### **4.2 Publicación**
- Subida a **GitHub/GitHub Pages**.
- Despliegue en plataformas como **Netlify o Vercel**.
- Promoción en redes y foros de desarrolladores.

---

## **5. Documentación y Mantenimiento**

### **5.1 Documentación**
- **README.md** con instrucciones de instalación y uso.
- **Comentarios en el código** para facilitar futuras modificaciones.
- **Diagramas de flujo** sobre la lógica principal.

### **5.2 Mantenimiento**
- **Corrección de errores** y optimización del rendimiento.
- **Implementación de nuevas funcionalidades** según feedback de jugadores.
- **Compatibilidad con futuras versiones de navegadores.**

---

## **6. Conclusión**
"RompeWebos" busca ofrecer una versión moderna y entretenida del clásico *Minesweeper*. Siguiendo estos requisitos, se garantiza una implementación eficiente y una experiencia de usuario atractiva.
