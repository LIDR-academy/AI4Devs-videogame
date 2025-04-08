# Contexto Activo: Luz Roja, Luz Verde

## Enfoque Actual
Actualmente, el proyecto se encuentra en fase inicial de desarrollo. Estamos estableciendo la estructura base del juego "Luz Roja, Luz Verde" y definiendo las mecánicas principales a implementar.

## Cambios Recientes
- Creación de la documentación inicial del proyecto
- Definición de la arquitectura básica del sistema
- Establecimiento de las tecnologías a utilizar (Ruby con RSpec para testing)

## Próximos Pasos
1. **Implementación del sistema básico de juego**:
   - Crear la estructura de clases para el GameSystem
   - Desarrollar el flujo básico del juego
   - Implementar la transición entre estados

2. **Desarrollo del sistema de personajes**:
   - Implementar la clase base para los personajes
   - Crear los personajes jugables (Oso, Conejo, Pingüino)
   - Desarrollar la lógica de movimiento y detención

3. **Implementación del sistema de semáforo**:
   - Crear la lógica para los cambios entre luz roja y luz verde
   - Implementar el personaje giratorio que detecta movimiento
   - Desarrollar la sincronización con el sistema de audio

4. **Desarrollo del minijuego de equilibrio**:
   - Implementar la mecánica del minijuego cuando el jugador se detiene
   - Crear los elementos visuales necesarios
   - Integrar con el sistema de personajes

## Decisiones Activas
1. **Enfoque de desarrollo**: Estamos utilizando un enfoque de desarrollo dirigido por pruebas (TDD) con RSpec para asegurar la calidad del código.
   
2. **Arquitectura modular**: Hemos decidido implementar una arquitectura modular con sistemas claramente definidos para facilitar el desarrollo y mantenimiento.
   
3. **Estilo visual**: Se ha optado por un estilo minimalista con colores planos para mantener la simplicidad visual y enfocar en la jugabilidad.
   
4. **Mecánica central**: El juego se controlará con un único botón principal, siguiendo el principio de simplicidad en los controles pero profundidad en la jugabilidad.

## Consideraciones Actuales
- Necesitamos definir detalladamente cómo implementar el sistema de detección de movimiento durante la luz roja
- Debemos equilibrar la dificultad del minijuego de equilibrio para que sea desafiante pero justo
- Es importante establecer un sistema de progresión de dificultad a lo largo del juego
- Necesitamos definir cómo implementar el comportamiento de los bots para que sean desafiantes pero predecibles

Este documento refleja el estado actual del proyecto y será actualizado regularmente conforme avance el desarrollo. 