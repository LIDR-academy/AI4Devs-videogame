# Refactorización del juego "Luz Roja, Luz Verde"

Este documento describe la estructura modular implementada para el juego "Luz Roja, Luz Verde" como parte del proceso de refactorización para hacerlo más mantenible.

## Estructura de directorios

```
js/
│
├── config/              # Configuración del juego
│   └── gameConfig.js    # Constantes y configuraciones
│
├── entities/            # Entidades del juego
│   ├── Player.js        # Clase del jugador
│   └── TrafficLight.js  # Clase del semáforo
│
├── scenes/              # Escenas del juego
│   └── GameScene.js     # Escena principal
│
└── main.js              # Punto de entrada del juego
```

## Clases implementadas

### Player
La clase `Player` encapsula toda la lógica relacionada con el jugador:
- Creación del gráfico y del cuerpo físico del jugador
- Métodos para acelerar, desacelerar y detener al jugador
- Manejo de estados (moviéndose, pausado, muerto, etc.)
- Efectos visuales para la muerte y la victoria
- Actualización del gráfico en cada frame

### TrafficLight
La clase `TrafficLight` gestiona el semáforo del juego:
- Cambios automáticos entre luz verde y roja
- Sistema de callbacks para notificar cambios de estado
- Métodos para verificar el estado actual
- Temporizadores para cambios de estado

### GameScene
La escena principal donde se coordina toda la lógica del juego:
- Creación de líneas de inicio y meta
- Instanciación y gestión del jugador y el semáforo
- Configuración de controles
- Manejo del sistema de audio
- Lógica para detectar colisiones con la meta

## Configuración

El archivo `gameConfig.js` centraliza todas las constantes y valores de configuración del juego, lo que facilita ajustar el comportamiento sin tener que buscar valores en el código.

## Proceso de refactorización

Esta refactorización se ha centrado en:

1. **Modularización**: Separar el código en clases con responsabilidades específicas
2. **Encapsulación**: Ocultar los detalles de implementación dentro de cada clase
3. **Configuración centralizada**: Mover todas las constantes a un archivo de configuración
4. **Estructura organizada**: Crear una estructura de directorios clara y lógica

## Próximos pasos

- Implementar sistema de audio modular
- Crear escenas adicionales (menú principal, pantalla de game over)
- Implementar sistema de eventos más robusto
- Optimizar renderizado

## Cómo usar

1. Importar la clase deseada, por ejemplo:
```javascript
import Player from '../entities/Player.js';
```

2. Instanciar la clase con sus parámetros:
```javascript
const player = new Player(scene, x, y, configOptions);
```

3. Usar los métodos públicos de la clase:
```javascript
player.accelerate();
player.decelerate();
``` 