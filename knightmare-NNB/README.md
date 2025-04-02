# KNIGHTMARE

Un juego de plataformas 2D desafiante donde debes recolectar llaves, abrir puertas y enfrentarte a enemigos mientras intentas conseguir la mayor puntuación posible.

## Características Principales

### Sistema de Juego
- **Movimiento**: 
  - Controles responsivos para moverte y saltar
  - Animación de carrera del personaje
  - Sistema de dirección que recuerda el último movimiento
- **Sistema de Combate**: 
  - Dispara proyectiles para eliminar enemigos
  - Efecto visual "pew" al disparar
  - Dirección de disparo basada en el último movimiento
- **Recolección de Llaves**: Encuentra llaves para abrir puertas y progresar
- **Sistema de Salud**: 
  - Barra de vida con diseño visual mejorado
  - Recoge ítems de curación
  - Indicador de corazón y cantidad de vida
- **Sistema de Puntuación**: Gana puntos por:
  - Recolectar llaves: 150 puntos
  - Abrir puertas: 350 puntos
  - Eliminar enemigos: 100 puntos

### Mecánicas Avanzadas
- **Enemigos**:
  - Animaciones de idle y ataque
  - Disparan proyectiles animados cuando estás en rango (200 píxeles)
  - Al eliminar un enemigo, aparecen dos nuevos en posiciones estratégicas
  - La velocidad de disparo aumenta progresivamente
  - Barras de vida individuales
- **Sistema de Puertas**:
  - Cambio visual al abrirse
  - Generan ítems de curación al atravesarlas
  - Nueva llave aparece al usar una puerta
- **Flecha Auxiliar**:
  - Indica la dirección de la llave cuando no la tienes
  - Indica la puerta abierta cuando tienes la llave
- **Zonas de Muerte**: Pozos que debes evitar para sobrevivir

## Controles
- **A/D** o **←/→**: Movimiento horizontal
- **W** o **↑**: Saltar
- **F**: Disparar
- **SHIFT**: Sprint (velocidad aumentada)
- **0**: Mostrar/ocultar información de depuración

## Objetivos
1. Recolecta llaves para abrir puertas
2. Elimina enemigos para ganar puntos
3. Sobrevive y consigue la mayor puntuación posible
4. Gestiona tu salud recolectando ítems de curación

## Consejos
- Usa el sprint estratégicamente para evitar proyectiles enemigos
- Mantén un ojo en tu salud y busca ítems de curación
- Observa la flecha auxiliar para encontrar objetivos
- Ten cuidado con los pozos de muerte
- Los enemigos se vuelven más agresivos conforme avanza el juego
- Puedes disparar mientras estás quieto en la última dirección de movimiento

## Retos significativos
- La carga de assets de manera local y tener que usar un pipeline eficiente para probar en un servidor local.
- Evitar que la IA por cada correccion que le pedia, modificara otro objeto.
- La deteccion de colisiones de phaser no ayuda mucho.
- En ciertos momentos, por mas especifico que fuese, la IA deliraba mucho y cuando queria implementar un asset, me quitaba un feature.
- En defintiva me quedo con el desarrollo en motores graficos, que en HTML jaja.

## Proceso creativo
- Crear al personaje principal con sus mecanicas basicas, a partir de un cubo.
- Crear los objetos que permitirian al personaje acumular puntos, como la puerta y la llave a partir de figuras basicas
- Crear los enemigos con sus mecanicas por separado, a partir de figuras basicas.
- Crear el sistema de salud para eliminar enemigos y ocasionar Game Over.
- Crear un nivel base, usando un layout.
- Poner las reglas del layout como por ejemplo la cantidad de puertas, las llaves, los enemigos y los pozos de la muerte.
- Reemplazar los assets con graficos.