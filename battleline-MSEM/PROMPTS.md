# Setup
## IDE
Windsurf ai

## LLM
Claude 3.7 Sonnet (Thinking)

# Prompt 1

Ahora eres un programador experto en la creación de videojuegos. Necesito que crees un videojuego en 2D al estilo Warlords: call to arms. Te dejo la descripción completa. Debes hacer la función del arquitecto de software y planificar el paso a paso que se debe seguir para desarrollar el juego. Recuerda que solo se puede usar html, css y javascript.

## ⚔️ **1. Tipos de Unidades por Raza**

### 🧍 Humanos

- **Espadachín**: rápido y barato, cuerpo a cuerpo.
- **Arquero**: ataque a distancia, daño medio.
- **Caballero**: lento pero con mucha vida, ideal para tanquear.
- **Clérigo**: cura aliados cercanos (rango corto).

### 🧝 Elfos

- **Lanceros del bosque**: muy rápidos, bajo HP.
- **Arqueros élficos**: largo alcance y precisión alta.
- **Druida**: invoca raíces que ralentizan al enemigo.
- **Centinela mágico**: lanza proyectiles mágicos de área.

### 🧟 Orcos

- **Bruto orco**: muy fuerte en cuerpo a cuerpo, pero lento.
- **Tirador salvaje**: lanza hachas con bajo alcance.
- **Chaman**: puede lanzar una maldición que reduce daño enemigo.
- **Bestia de guerra**: unidad pesada que aplasta a varias unidades.

---

## 🧠 **2. Sistema de Combate**

- **Tiempo real, por carriles (líneas)**: como en Warlords, puedes elegir por cuál línea lanzar la unidad.
- **Unidades avanzan automáticamente** y se detienen al encontrar enemigos en su camino.
- **Detección de colisiones**: cuando una unidad enemiga entra en rango de ataque (cuerpo a cuerpo o a distancia).
- **Sistema de prioridades**: las unidades atacan a lo más cercano, sin cambiar de línea.
- **Cooldown** por tipo de unidad: no puedes spamear el mismo tipo constantemente.

---

## 💰 **3. Sistema de Mejoras / Economía**

- **Oro por tiempo**: ganas oro pasivamente cada 5 segundos.
- **Oro por kills**: +1 o +2 de oro al eliminar enemigos.
- **Mejoras por partida** (no permanentes al inicio):
    - **Velocidad de generación de oro**
    - **Vida de unidades**
    - **Daño de unidades**
    - **Reducción de cooldown**

---

## 🎨 **4. UI y Estilo Gráfico**

### Estilo

- **Pixel Art o estilo vectorial 2D simple** (como Warlords).
- **Vista lateral 2D** con líneas horizontales (3-5 carriles).
- Animaciones suaves de ataque y movimiento.

### Interfaz

- **Panel inferior** con iconos de unidades por raza.
- **Minimapa o barra de progreso** arriba que muestra qué tanto han avanzado los ejércitos.
- **Indicadores de oro y cooldown** sobre cada botón de unidad.
- **Botón de "¡Lanzar ataque masivo!"** si quieres una habilidad especial.


Debes usar la libreria phaser 3 @web 

# Prompt 2

De momento no veo nada

# Prompt 3
Se queda atascada la pantalla en loading

# Prompt 4 (grupo de prompts con errores de consola)
