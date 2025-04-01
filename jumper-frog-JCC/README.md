# Jumper Frog 🐸

Un juego clásico de cruzar la calle desarrollado con HTML, CSS y JavaScript.

## 🎮 Cómo Jugar

1. Haz clic en "Iniciar Juego" para comenzar
2. Usa las flechas del teclado para mover la rana:
   - ⬅️ Flecha izquierda: Mover a la izquierda
   - ➡️ Flecha derecha: Mover a la derecha
   - ⬆️ Flecha arriba: Mover hacia arriba
   - ⬇️ Flecha abajo: Mover hacia abajo
3. Presiona 'P' para pausar/reanudar el juego

## 🎯 Objetivo

- Guía a la rana a través de los carriles de tráfico
- Evita los vehículos que se mueven
- Llega a la zona segura superior para ganar puntos
- Tienes 3 vidas disponibles
- La velocidad aumenta progresivamente con cada cruce exitoso

## 🚗 Características

- 5 tipos diferentes de vehículos con velocidades variables:
  - 🚗 Carro (velocidad base)
  - 🚕 Taxi (velocidad base + 10%)
  - 🚑 Ambulancia (velocidad base + 20%)
  - 🚌 Bus (velocidad base)
  - 🚛 Camión (velocidad base - 30%)
- Sistema de dificultad progresiva:
  - La velocidad aumenta con cada cruce exitoso
  - El intervalo de spawn de vehículos disminuye
  - Velocidad máxima de 2x
- Sistema de colisiones preciso
- Zonas seguras en la parte superior e inferior
- Sistema de pausa
- Diseño responsive para diferentes dispositivos
- Interfaz intuitiva y fácil de usar

## 💻 Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- SVG para gráficos vectoriales

## 🛠️ Estructura del Proyecto

```
jumper-frog-JCC/
├── index.html      # Estructura principal del juego y assets SVG
├── styles.css      # Estilos y animaciones
├── game.js         # Lógica del juego
└── README.md       # Documentación
```

## 🎨 Características Técnicas

- Diseño modular y orientado a objetos
- Sistema de colisiones basado en rectángulos
- Animaciones suaves con CSS
- Gestión eficiente de recursos
- Sistema de spawn de vehículos optimizado
- Control de velocidad y dificultad progresiva
- Código limpio y bien documentado

## 🎯 Objetivos de Aprendizaje

Este proyecto demuestra:
- Programación orientada a objetos en JavaScript
- Manejo de eventos del teclado
- Detección de colisiones
- Animaciones y transiciones CSS
- Diseño responsive
- Gestión de estado del juego
- Trabajo con SVG
- Control de velocidad y dificultad en juegos

## 🚀 Cómo Ejecutar

1. Clona este repositorio
2. Abre el archivo `index.html` en tu navegador
3. ¡Comienza a jugar!