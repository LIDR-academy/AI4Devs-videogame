# Entrega de Paquetes - VMR

Un juego de entrega de paquetes en la ciudad, donde controlas una van de entregas para recoger y entregar paquetes mientras evitas obstáculos.

## Características del Juego

### Jugabilidad
- **Objetivo**: Recoger paquetes (amarillos) y entregarlos en los puntos de entrega (verdes)
- **Tiempo**: 60 segundos para hacer la mayor cantidad de entregas posible
- **Puntuación**: Gana puntos por cada entrega exitosa
- **Obstáculos**: Evita los obstáculos (rojos) que aparecen en el camino

### Controles
- **Flechas de dirección**: Mueven la van por la ciudad
  - ↑: Mover hacia arriba
  - ↓: Mover hacia abajo
  - ←: Mover hacia la izquierda
  - →: Mover hacia la derecha

### Elementos del Juego

#### Ciudad
- Calles organizadas en una cuadrícula
- Intersecciones que permiten cambios de dirección
- Edificios que delimitan las áreas no transitables
- Puntos de referencia para mejorar la navegación

#### Van de Entregas
- Movimiento suave y controlado
- Rotación automática según la dirección
- Alineación automática con las calles
- Detección de colisiones con edificios y obstáculos

#### Sistema de Puntuación
- Puntos por recoger paquetes
- Puntos adicionales por entregas exitosas
- Contador de tiempo visible
- Puntuación actual mostrada en pantalla

## Mejoras Implementadas

### Optimización del Movimiento
- Velocidad ajustada para mejor control
- Sistema de colisiones mejorado
- Movimiento fluido en las calles
- Giros suaves en las intersecciones

### Diseño de la Ciudad
- Layout optimizado para mejor jugabilidad
- Densidad de calles ajustada
- Distribución equilibrada de edificios
- Mejor visibilidad de elementos del juego

### Interfaz de Usuario
- Controles intuitivos
- Retroalimentación visual clara
- Indicadores de progreso visibles
- Instrucciones claras para el jugador

## Requisitos Técnicos

### Navegador
- Navegador web moderno con soporte para:
  - JavaScript ES6+
  - CSS3
  - HTML5

### Rendimiento
- Optimizado para ejecutarse suavemente en navegadores modernos
- Gestión eficiente de recursos
- Animaciones fluidas

## Instalación y Ejecución

1. Clonar el repositorio
2. Abrir el archivo `index.html` en un navegador web
3. Hacer clic en "Iniciar Juego" para comenzar
4. Usar las flechas del teclado para controlar la van

## Desarrollo

### Estructura del Proyecto
```
├── index.html          # Archivo principal del juego
├── styles.css         # Estilos y animaciones
├── game.js           # Lógica del juego
└── README.md         # Documentación
```

### Tecnologías Utilizadas
- HTML5 para la estructura
- CSS3 para estilos y animaciones
- JavaScript para la lógica del juego

## Contribución

Si deseas contribuir al proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu función (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
