# Patrones del Sistema: Luz Roja, Luz Verde

## Arquitectura del Sistema
El juego "Luz Roja, Luz Verde" está organizado en un sistema modular con componentes claramente definidos que se comunican entre sí siguiendo principios de diseño de juegos.

### Componentes Principales

#### 1. Sistema de Juego (GameSystem)
- Controla el flujo general del juego
- Gestiona las transiciones entre estados (menú, juego, victoria, derrota)
- Coordina los demás subsistemas

#### 2. Gestor de Entrada (InputManager)
- Captura y procesa la entrada del jugador (botón principal)
- Transmite las acciones del jugador al sistema de personajes

#### 3. Sistema de Personajes (CharacterSystem)
- Controla el comportamiento de los personajes jugables y los bots
- Implementa la lógica de movimiento, detención y eliminación
- Gestiona las animaciones de los personajes

#### 4. Sistema de Semáforo (TrafficLightSystem)
- Maneja la lógica del semáforo (cambios entre luz roja y verde)
- Controla la música que indica el estado del semáforo
- Coordina con el personaje giratorio para la detección de movimiento

#### 5. Sistema de Minijuego (MinigameSystem)
- Implementa el minijuego de equilibrio cuando el jugador se detiene
- Gestiona la dificultad del minijuego según el progreso

#### 6. Sistema de Renderizado (RenderSystem)
- Gestiona toda la presentación visual del juego
- Implementa los efectos visuales (animaciones, sangre, etc.)

#### 7. Sistema de Audio (AudioSystem)
- Controla la reproducción de música y efectos de sonido
- Sincroniza la música con los cambios del semáforo

## Patrones de Diseño Utilizados

### Patrón Estado (State Pattern)
- Utilizado para gestionar los diferentes estados del juego (menú, jugando, pausa, fin de juego)
- Cada estado encapsula su propio comportamiento y transiciones

### Patrón Observador (Observer Pattern)
- Implementado para la comunicación entre subsistemas
- Permite que los componentes reaccionen a eventos como cambios en el semáforo o eliminación de jugadores

### Patrón Comando (Command Pattern)
- Utilizado para la entrada del jugador, separando la acción de presionar el botón de su efecto

### Patrón Singleton
- Aplicado a los gestores principales (GameSystem, InputManager, AudioSystem)
- Garantiza una única instancia accesible globalmente

## Relaciones entre Componentes
- **GameSystem** coordina a todos los demás sistemas
- **InputManager** comunica las acciones del jugador a **CharacterSystem**
- **TrafficLightSystem** notifica cambios de estado a **CharacterSystem** y **AudioSystem**
- **CharacterSystem** interactúa con **MinigameSystem** cuando un personaje se detiene
- **RenderSystem** y **AudioSystem** responden a eventos de los demás sistemas

Esta arquitectura modular facilita el desarrollo independiente de cada componente y permite cambios o mejoras sin afectar a todo el sistema. 