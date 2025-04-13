# Tickets de Trabajo - PuzzleMaster

## Ticket 1: Configuración Inicial del Repositorio
**Descripción:**  
Configurar el repositorio en GitHub y establecer la estructura base del proyecto.

**Tareas:**
- Hacer fork del repositorio original.
- Clonar el fork en local.
- Crear una rama para la feature: `solved-PuzzleMaster`.
- Configurar la estructura de carpetas, por ejemplo:
  - `/PuzzleMaster-ACBG`
    - `/src` (código fuente: `index.html`, `styles.css`, `script.js`)
    - `/docs` (documentación, PRD, prompts utilizados)
    - `/assets` (imágenes e íconos)
- Subir la estructura base al repositorio.

**Criterios de Aceptación:**
- El repositorio debe tener la rama `solved-PuzzleMaster`.
- La estructura del proyecto debe estar visible en GitHub y contener las carpetas indicadas.

---

## Ticket 2: Diseño de la Interfaz de Usuario (UI)
**Descripción:**  
Diseñar y maquetar el layout inicial del juego, inspirándose en la imagen de referencia.

**Tareas:**
- Crear `index.html` con la estructura básica de la aplicación.
- Crear `styles.css` para definir estilos responsivos y visualmente atractivos (colores, tipografía, distribución de elementos, etc.).
- Incluir componentes UI:
  - Título (alineado a la izquierda).
  - Área del tablero o contenedor para el puzzle.
  - Botones de interacción (por ejemplo, "Reiniciar", "Verificar", etc.).
  - Área para mensajes o notificaciones (por ejemplo, pantalla de victoria).

**Criterios de Aceptación:**
- La interfaz debe ser responsiva y adaptarse a distintos dispositivos (desktop y mobile).
- El diseño debe reflejar la estética de la imagen de referencia.

---

## Ticket 3: Implementación del Tablero y Generación de Piezas
**Descripción:**  
Desarrollar la lógica para generar el tablero del puzzle y ubicar las piezas de forma aleatoria.

**Tareas:**
- Crear una función que inicialice el tablero (por ejemplo, con dimensiones configurables: 3x3, 4x4, etc.).
- Generar y mezclar las piezas del puzzle de forma aleatoria.
- Mostrar el tablero en el DOM de `index.html`.

**Criterios de Aceptación:**
- Al iniciar el juego, el tablero se genera correctamente con piezas desordenadas.
- El diseño del tablero es visualmente claro y las piezas son distinguibles.

---

## Ticket 4: Implementación de la Interacción del Usuario
**Descripción:**  
Permitir al usuario mover y reacomodar las piezas del puzzle mediante interacciones.

**Tareas:**
- Implementar la funcionalidad de arrastrar y soltar (drag & drop) para escritorio.
- Añadir soporte para eventos táctiles en dispositivos móviles.
- Validar movimientos permitidos (por ejemplo, solo intercambiar piezas adyacentes o según las reglas definidas).

**Criterios de Aceptación:**
- El usuario puede mover las piezas correctamente mediante arrastrar y soltar o clics/touches.
- El estado del tablero se actualiza de forma precisa en el DOM.

---

## Ticket 5: Verificación de la Solución y Sistema de Puntuación
**Descripción:**  
Desarrollar la lógica para detectar si el puzzle se ha resuelto y calcular la puntuación.

**Tareas:**
- Implementar una función que verifique el estado del tablero y detecte si el puzzle está resuelto.
- Crear una pantalla de victoria que se active al completar el puzzle.
- Integrar un sistema de puntuación basado en el tiempo de resolución y/o la cantidad de movimientos realizados.

**Criterios de Aceptación:**
- El juego detecta correctamente cuando el puzzle está resuelto.
- Se muestra una pantalla de victoria con el mensaje correspondiente y la puntuación obtenida.

---

## Ticket 6: Pruebas y Depuración
**Descripción:**  
Realizar pruebas funcionales y de usabilidad para asegurar la calidad del producto.

**Tareas:**
- Probar la aplicación en diferentes navegadores y dispositivos.
- Identificar y documentar errores o inconsistencias.
- Corregir bugs y optimizar el rendimiento de la aplicación.
- Validar que la interfaz sea intuitiva y responsiva.

**Criterios de Aceptación:**
- El juego funciona sin errores críticos.
- La experiencia de usuario es fluida y sin problemas de rendimiento.
- Se han realizado pruebas de usabilidad con resultados satisfactorios.

---

## Ticket 7: Documentación y Preparación del Pull Request
**Descripción:**  
Documentar el desarrollo, incluir los prompts utilizados y preparar la entrega final del proyecto.

**Tareas:**
- Actualizar el archivo README del repositorio con instrucciones de instalación, uso y descripción del proyecto.
- Incluir en la carpeta `/docs`:
  - El PRD completo.
  - Los prompts utilizados (todos, en orden, hasta llegar a la solución).
  - Información sobre el chatbot empleado en el proceso.
- Realizar commits finales y preparar el Pull Request en GitHub.

**Criterios de Aceptación:**
- La documentación es completa y accesible para otros miembros del equipo.
- El Pull Request incluye todos los archivos y la información requerida (estructura, código, prompts, etc.).
- El proyecto cumple con los estándares definidos en el PRD.

---
