/**
 * Battleship 3D - Interfaz de Usuario
 * 
 * Este archivo contiene el código para manejar efectos visuales y animaciones
 * de la interfaz de usuario para el juego Battleship 3D.
 */

// Clase para manejar efectos de agua
class WaterEffect {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.ripples = [];
    this.maxRipples = 5;
    
    // Inicializar efecto de agua
    this.init();
  }
  
  // Inicializar el efecto
  init() {
    // Crear capa de agua
    this.waterLayer = document.createElement('div');
    this.waterLayer.className = 'water-layer';
    this.waterLayer.style.position = 'absolute';
    this.waterLayer.style.top = '0';
    this.waterLayer.style.left = '0';
    this.waterLayer.style.width = '100%';
    this.waterLayer.style.height = '100%';
    this.waterLayer.style.pointerEvents = 'none';
    this.waterLayer.style.zIndex = '1';
    
    // Añadir textura de agua
    this.waterLayer.style.background = 'linear-gradient(135deg, rgba(10, 25, 47, 0.8) 0%, rgba(76, 222, 217, 0.2) 100%)';
    this.waterLayer.style.boxShadow = 'inset 0 0 50px rgba(100, 255, 218, 0.3)';
    
    // Añadir capa de agua al tablero
    this.boardElement.prepend(this.waterLayer);
    
    // Añadir animación de ondulación
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Ondular la superficie del agua
      this.waterLayer.style.transform = `translateZ(0) rotate3d(1, 0, 0, ${Math.sin(time * 0.5) * 2}deg)`;
      
      // Animar las ondas existentes
      this.updateRipples();
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Crear una nueva onda en una posición específica
  createRipple(x, y) {
    if (this.ripples.length >= this.maxRipples) {
      // Reutilizar la onda más antigua
      const ripple = this.ripples.shift();
      ripple.element.remove();
    }
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(100, 255, 218, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';
    ripple.style.pointerEvents = 'none';
    
    // Añadir onda a la capa de agua
    this.waterLayer.appendChild(ripple);
    
    // Animar la onda
    const creationTime = Date.now();
    
    this.ripples.push({
      element: ripple,
      creationTime,
      x,
      y
    });
  }
  
  // Actualizar todas las ondas existentes
  updateRipples() {
    const currentTime = Date.now();
    
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const ripple = this.ripples[i];
      const age = (currentTime - ripple.creationTime) / 1000; // Edad en segundos
      
      // La onda crece y se desvanece con el tiempo
      const scale = Math.min(5, age * 3);
      const opacity = Math.max(0, 1 - age / 2);
      
      ripple.element.style.transform = `scale(${scale})`;
      ripple.element.style.opacity = opacity.toString();
      
      // Eliminar ondas antiguas
      if (age > 2) {
        ripple.element.remove();
        this.ripples.splice(i, 1);
      }
    }
  }
}

// Clase para manejar efectos de explosión
class ExplosionEffect {
  constructor() {
    this.explosions = [];
  }
  
  // Crear una explosión en una celda específica
  createExplosion(cellElement) {
    // Crear contenedor de explosión
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.position = 'absolute';
    explosion.style.top = '0';
    explosion.style.left = '0';
    explosion.style.width = '100%';
    explosion.style.height = '100%';
    explosion.style.pointerEvents = 'none';
    explosion.style.zIndex = '10';
    
    // Añadir partículas de explosión
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      particle.style.position = 'absolute';
      particle.style.top = '50%';
      particle.style.left = '50%';
      particle.style.width = `${Math.random() * 6 + 2}px`;
      particle.style.height = `${Math.random() * 6 + 2}px`;
      particle.style.backgroundColor = `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 50 + 50}%)`;
      particle.style.borderRadius = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.opacity = '1';
      
      // Añadir animación a cada partícula
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 20;
      const speedX = Math.cos(angle) * distance;
      const speedY = Math.sin(angle) * distance;
      const speedZ = Math.random() * 100 - 50;
      
      const delay = Math.random() * 0.2;
      
      particle.style.transition = `transform 0.5s ease-out ${delay}s, opacity 0.5s ease-out ${delay}s`;
      setTimeout(() => {
        particle.style.transform = `translate3d(${speedX}px, ${speedY}px, ${speedZ}px)`;
        particle.style.opacity = '0';
      }, 10);
      
      explosion.appendChild(particle);
    }
    
    // Añadir onda expansiva
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave';
    shockwave.style.position = 'absolute';
    shockwave.style.top = '50%';
    shockwave.style.left = '50%';
    shockwave.style.width = '10px';
    shockwave.style.height = '10px';
    shockwave.style.borderRadius = '50%';
    shockwave.style.boxShadow = '0 0 10px 2px rgba(255, 200, 0, 0.8)';
    shockwave.style.transform = 'translate(-50%, -50%) scale(0)';
    shockwave.style.opacity = '1';
    
    // Animar onda expansiva
    shockwave.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    setTimeout(() => {
      shockwave.style.transform = 'translate(-50%, -50%) scale(5)';
      shockwave.style.opacity = '0';
    }, 10);
    
    explosion.appendChild(shockwave);
    
    // Añadir al documento y guardar referencia
    cellElement.appendChild(explosion);
    
    // Eliminar después de la animación
    setTimeout(() => {
      explosion.remove();
    }, 2000);
  }
  
  // Crear efecto de salpicadura
  createSplash(cellElement) {
    // Crear gotas de agua
    for (let i = 0; i < 15; i++) {
      const droplet = document.createElement('div');
      droplet.className = 'water-droplet';
      droplet.style.position = 'absolute';
      droplet.style.top = '50%';
      droplet.style.left = '50%';
      droplet.style.width = `${Math.random() * 4 + 2}px`;
      droplet.style.height = `${Math.random() * 4 + 2}px`;
      droplet.style.backgroundColor = 'rgba(100, 200, 255, 0.8)';
      droplet.style.borderRadius = '50%';
      droplet.style.transform = 'translate(-50%, -50%)';
      droplet.style.opacity = '1';
      droplet.style.zIndex = '5';
      
      // Añadir animación a cada gota
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 10;
      const speedX = Math.cos(angle) * distance;
      const speedY = Math.sin(angle) * distance;
      const speedZ = Math.random() * 40;
      const gravity = 50; // Para simular la caída
      
      const delay = Math.random() * 0.1;
      const duration = 0.5 + Math.random() * 0.3;
      
      droplet.style.transition = `transform ${duration}s cubic-bezier(0.2, 0.8, 0.3, 1) ${delay}s, opacity ${duration}s ease-out ${delay}s`;
      
      setTimeout(() => {
        droplet.style.transform = `translate3d(${speedX}px, ${speedY + gravity}px, ${speedZ}px)`;
        droplet.style.opacity = '0';
      }, 10);
      
      cellElement.appendChild(droplet);
      
      // Eliminar después de la animación
      setTimeout(() => {
        droplet.remove();
      }, (delay + duration) * 1000 + 100);
    }
    
    // Crear onda en el agua
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.style.position = 'absolute';
    splash.style.top = '50%';
    splash.style.left = '50%';
    splash.style.width = '10px';
    splash.style.height = '10px';
    splash.style.borderRadius = '50%';
    splash.style.border = '2px solid rgba(100, 200, 255, 0.6)';
    splash.style.transform = 'translate(-50%, -50%) scale(0)';
    splash.style.opacity = '1';
    splash.style.zIndex = '4';
    
    // Animar onda expansiva
    splash.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    setTimeout(() => {
      splash.style.transform = 'translate(-50%, -50%) scale(4)';
      splash.style.opacity = '0';
    }, 10);
    
    cellElement.appendChild(splash);
    
    // Eliminar después de la animación
    setTimeout(() => {
      splash.remove();
    }, 1100);
  }
}

// Inicializar efectos cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear efecto de agua en ambos tableros
  const playerBoardElement = document.getElementById('player-board');
  const enemyBoardElement = document.getElementById('enemy-board');
  
  const playerWaterEffect = new WaterEffect(playerBoardElement);
  const enemyWaterEffect = new WaterEffect(enemyBoardElement);
  
  // Crear controlador de efectos de explosión
  const explosionEffect = new ExplosionEffect();
  
  // Observar cambios en el DOM para detectar hits y misses
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const cell = mutation.target;
        
        // Si la celda ahora tiene la clase 'hit', crear explosión
        if (cell.classList.contains('hit') && !cell.dataset.explosionCreated) {
          explosionEffect.createExplosion(cell);
          cell.dataset.explosionCreated = 'true';
        }
        
        // Si la celda ahora tiene la clase 'miss', crear salpicadura
        if (cell.classList.contains('miss') && !cell.dataset.splashCreated) {
          explosionEffect.createSplash(cell);
          cell.dataset.splashCreated = 'true';
        }
      }
    });
  });
  
  // Configurar el observador para escuchar cambios en las clases de las celdas
  const observerConfig = { attributes: true, attributeFilter: ['class'], subtree: true };
  observer.observe(playerBoardElement, observerConfig);
  observer.observe(enemyBoardElement, observerConfig);
  
  // Crear efecto de hover sobre celdas enemigas
  const enemyCells = document.querySelectorAll('#enemy-board .cell');
  enemyCells.forEach(cell => {
    cell.addEventListener('mouseover', () => {
      if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
        // Crear un pequeño efecto de ondulación al pasar el mouse
        const rect = cell.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        enemyWaterEffect.createRipple(x, y);
      }
    });
  });
}); 