# Galaxian for AI4Devs - Especificación Funcional

## Elementos del Juego

### 1. Nave del Jugador
- Posicionada en la parte inferior de la pantalla
- Movimiento horizontal (izquierda-derecha)
- Capacidad para disparar proyectiles hacia arriba
- Posee un número limitado de vidas: 3

### 2. Enemigos (Alienígenas)
- Organizados en formaciones de filas
- Diferentes tipos/colores de enemigos: 3 tipos
  - Verde (nivel inferior)
  - Morado (nivel medio)
  - Rojo (nivel superior)
- Comportamiento base: movimiento lateral en formación
- Naves "líder" aleatorias por grupo de color que realizan ataques en picado

### 3. Proyectiles
- **Del jugador:**
  - Movimiento vertical hacia arriba
  - Sin límite de disparos
- **De los enemigos:**
  - Solo disparan las naves de la fila inferior
  - Disparos aleatorios
  - Limitado a un disparo activo por nave
  
### 4. Sistema de Puntuación
- Puntuación por tipo de enemigo:
  - Verde: 5 puntos
  - Morado: 10 puntos
  - Rojo: 25 puntos
- Bonus por enemigos en picado: 100 puntos
- Visualización de puntuación actual (blanco) y HI-SCORE (azul)

## Mecánicas del Juego

### 1. Movimiento del Jugador
- Control mediante teclado (flechas o A/D)
- Restricción de movimiento dentro de los límites de pantalla

### 2. Disparos
- Activación mediante tecla espacio
- Un disparo por pulsación
- Sin límite de proyectiles

### 3. Comportamiento de los Enemigos
- Movimiento lateral coordinado de la formación
- Patrón de "ida y vuelta" horizontal
- Ataques aleatorios de naves líder
- Retorno a formación tras ataque

### 4. Colisiones
- Eliminación de enemigos al impacto
- Pérdida de vida por impacto enemigo o colisión
- Game Over al perder todas las vidas
- Cancelación mutua de disparos al colisionar

### 5. Niveles
- Nuevo nivel al eliminar todos los enemigos
- Dificultad progresiva:
  - Mayor velocidad de naves
  - Mayor velocidad de disparos
  - Mayor frecuencia de ataques

## Interfaz de Usuario

### 1. Pantalla de Juego
- Área principal de juego (fondo negro estrellado)
- Panel superior informativo:
  - Puntuación actual (blanco)
  - HI-SCORE (azul)
  - Vidas restantes (iconos de nave)
  - Nivel actual

### 2. Pantallas Adicionales
- Pantalla de inicio con título y start
- Pantalla de Game Over con puntuación y restart

## Efectos Visuales y Sonoros

### 1. Gráficos
- Sprites estilo retro pixelado
- Animaciones de explosión
- Fondo estrellado dinámico

### 2. Sonidos
- Efectos de disparo
  - Sonido personalizado para cada disparo del jugador
  - Volumen ajustado al 30% para mejor experiencia
- Efectos de explosión
  - Sonido cuando el jugador es impactado por disparos enemigos
  - Volumen ajustado al 40% para destacar el impacto
- Música de fondo 

### 3. Sistema de Audio
- Implementación mediante Web Audio API
- Sistema de clonación de sonidos para evitar solapamientos
- Gestión independiente de volumen para cada tipo de efecto 