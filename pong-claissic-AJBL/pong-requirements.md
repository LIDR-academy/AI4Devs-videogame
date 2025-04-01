# Requisitos Funcionales - Clon de Pong

## 1. Interfaz de Juego

- [ ] Crear un campo de juego rectangular con fondo negro
- [ ] Mostrar una línea central punteada blanca que divida el campo verticalmente
- [ ] Mostrar el marcador de puntos para ambos jugadores en la parte superior
- [ ] Implementar dos paletas (rectángulos blancos verticales) en los extremos laterales
- [ ] Mostrar una pelota (cuadrado o círculo blanco) en el campo de juego

## 2. Mecánicas de Juego

### 2.1 Paletas

- [ ] La paleta izquierda se controla con el ratón
- [ ] La paleta derecha se controla con un jugador artificial con una IA
- [ ] Las paletas deben moverse suavemente sin salirse del campo de juego
- [ ] Las paletas deben tener una velocidad de movimiento constante

### 2.2 Pelota

- [ ] La pelota debe moverse constantemente en una dirección diagonal
- [ ] La pelota debe rebotar en los bordes superior e inferior del campo
- [ ] La pelota debe rebotar en las paletas cuando las golpea
- [ ] El ángulo de rebote debe variar según el punto de impacto en la paleta
- [ ] La velocidad de la pelota debe aumentar gradualmente durante el juego

### 2.3 Sistema de Puntuación

- [ ] Otorgar un punto cuando la pelota pasa la paleta del oponente
- [ ] Actualizar el marcador en tiempo real
- [ ] Reiniciar la posición de la pelota después de cada punto
- [ ] Implementar una pausa breve después de cada punto

## 3. Estados del Juego

- [ ] Pantalla de inicio con título y opciones para comenzar
- [ ] Pantalla de pausa activada con la tecla 'P' o 'ESPACIO'
- [ ] Pantalla de fin de juego al alcanzar una puntuación determinada
- [ ] Opción para reiniciar el juego en cualquier momento con 'R'

## 4. Efectos y Retroalimentación

- [ ] Efectos visuales simples para colisiones
- [ ] Indicadores visuales del estado del juego (pausa, fin)

## 5. Tecnologías Requeridas

- HTML5 Canvas para el renderizado
- JavaScript para la lógica del juego
- RequestAnimationFrame para el bucle del juego

## 6. Optimización y Rendimiento

- [ ] Mantener 60 FPS constantes
- [ ] Optimizar las colisiones para evitar fallos
- [ ] Implementar delta time para movimientos fluidos
- [ ] Manejar diferentes resoluciones de pantalla
- [ ] Efectos de partículas en colisiones
