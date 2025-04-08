class Animations {
  static async showConfetti(element) {
    // Get the position of the clicked element
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Save the original content (if any)
    const originalContent = element.innerHTML;

    const colors = [
      "#4ecca3",
      "#ff6b6b",
      "#ffd93d",
      "#6c5ce7",
      "#FF9A00",
      "#FF33A8",
    ];
    const particles = 150; // More particles for a fuller effect
    const duration = CONFIG.FEEDBACK_DURATION;

    // Create a container for the confetti that covers the whole page
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    confettiContainer.style.position = "fixed";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100%";
    confettiContainer.style.height = "100%";
    confettiContainer.style.pointerEvents = "none"; // So it doesn't interfere with clicks
    confettiContainer.style.zIndex = "9999"; // Ensure it's above everything else

    document.body.appendChild(confettiContainer);

    // Add a celebratory glow from the clicked element
    const glow = document.createElement("div");
    glow.style.position = "absolute";
    glow.style.width = "100px";
    glow.style.height = "100px";
    glow.style.borderRadius = "50%";
    glow.style.background =
      "radial-gradient(circle, rgba(78, 204, 163, 0.8), rgba(78, 204, 163, 0))";
    glow.style.left = centerX + "px";
    glow.style.top = centerY + "px";
    glow.style.transform = "translate(-50%, -50%)";
    glow.style.animation = "glow-pulse 1s ease-in-out infinite";
    confettiContainer.appendChild(glow);

    // Add an explosion-like flash of light
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100%";
    flash.style.height = "100%";
    flash.style.backgroundColor = "rgba(78, 204, 163, 0.2)";
    flash.style.animation = "success-flash 0.5s ease-out forwards";
    flash.style.zIndex = "9990";
    confettiContainer.appendChild(flash);

    // Generate particles across the entire screen
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement("div");
      particle.className = "confetti-particle";

      // Randomize colors
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      // Position some particles around the clicked area for a burst effect
      let startX, startY;
      if (i < particles / 3) {
        // Start about a third of particles from the clicked element
        startX = centerX + (Math.random() * 50 - 25);
        startY = centerY + (Math.random() * 50 - 25);
        particle.style.left = startX + "px";
        particle.style.top = startY + "px";
      } else {
        // Rest spread across the top of the viewport
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = -Math.random() * 20 - 10 + "%"; // Start above the viewport
      }

      // Randomize sizes for more variety
      const size = Math.random() * 10 + 5;
      particle.style.width = size + "px";
      particle.style.height = size + "px";

      // Randomize animation duration and delay
      particle.style.animationDuration = Math.random() * 2 + 1 + "s";
      particle.style.animationDelay = Math.random() * 0.5 + "s";

      // Add some variety in particle shapes
      if (Math.random() > 0.6) {
        particle.style.borderRadius = "50%"; // Circle
      } else if (Math.random() > 0.5) {
        particle.style.borderRadius = "0"; // Square
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      } else if (Math.random() > 0.5) {
        // Star shape
        particle.style.clipPath =
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        particle.style.backgroundColor = "#FFD700"; // Gold color for stars
      } else {
        // Random pentagon
        particle.style.clipPath =
          "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";
      }

      confettiContainer.appendChild(particle);
    }

    // Add a success indicator to the element
    element.classList.add("correct-highlight");

    // Clear the element content
    element.innerHTML = "";

    // Create keyframes for the glow animation if it doesn't exist yet
    if (!document.querySelector('style[data-animation="glow-pulse"]')) {
      const glowKeyframes = document.createElement("style");
      glowKeyframes.setAttribute("data-animation", "glow-pulse");
      glowKeyframes.textContent = `
        @keyframes glow-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        }
        
        @keyframes success-flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;
      document.head.appendChild(glowKeyframes);
    }

    // Remove the confetti after the duration
    await new Promise((resolve) => setTimeout(resolve, duration));
    confettiContainer.remove();
    element.classList.remove("correct-highlight");
  }

  static async showBomb(element) {
    // Get the position of the clicked element to center the main explosion
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Save the original content (if any)
    const originalContent = element.innerHTML;

    // Create a container for the explosion that covers the whole page
    const explosionContainer = document.createElement("div");
    explosionContainer.className = "explosion-container";
    explosionContainer.style.position = "fixed";
    explosionContainer.style.top = "0";
    explosionContainer.style.left = "0";
    explosionContainer.style.width = "100%";
    explosionContainer.style.height = "100%";
    explosionContainer.style.pointerEvents = "none"; // So it doesn't interfere with clicks
    explosionContainer.style.zIndex = "9999"; // Ensure it's above everything else

    document.body.appendChild(explosionContainer);

    // Create multiple explosion elements for a more dramatic effect
    const explosionCount = 25; // Increased from 12 for more particles
    const explosionColors = [
      "#ff6b6b",
      "#ff4757",
      "#ff5252",
      "#ff7979",
      "#ff4444",
      "#FFAA00", // Added orange for more color variety
    ];

    // Create the main explosion at the center of the clicked element
    const mainExplosion = document.createElement("div");
    mainExplosion.className = "bomb-animation main-explosion";
    mainExplosion.style.left = centerX + "px";
    mainExplosion.style.top = centerY + "px";
    explosionContainer.appendChild(mainExplosion);

    // Create multiple shockwave effects for a more dramatic explosion
    for (let i = 0; i < 3; i++) {
      const shockwave = document.createElement("div");
      shockwave.className = "shockwave";
      shockwave.style.left = centerX + "px";
      shockwave.style.top = centerY + "px";
      shockwave.style.animationDelay = i * 0.1 + "s"; // Staggered delay
      explosionContainer.appendChild(shockwave);
    }

    // Create flying debris particles
    for (let i = 0; i < explosionCount; i++) {
      const debris = document.createElement("div");
      debris.className = "debris";

      // Random color from explosion colors
      debris.style.backgroundColor =
        explosionColors[Math.floor(Math.random() * explosionColors.length)];

      // Position at the center of the clicked element
      debris.style.left = centerX + "px";
      debris.style.top = centerY + "px";

      // Random size
      const size = Math.random() * 15 + 5;
      debris.style.width = size + "px";
      debris.style.height = size + "px";

      // Random direction and distance for animation
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 50; // Increased for more spread

      // Calculate the end position for the debris
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      // Create a specific animation for this debris
      const animationName = `debris-fly-${i}`;
      const keyframes = document.createElement("style");
      keyframes.textContent = `
        @keyframes ${animationName} {
          0% {
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + ${
              endX - centerX
            }px), calc(-50% + ${endY - centerY}px)) scale(0.2) rotate(180deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(keyframes);

      // Apply the animation
      const duration = Math.random() * 0.5 + 0.8;
      debris.style.animation = `${animationName} ${duration}s ease-out forwards`;

      // Add random rotation for more chaotic movement
      if (Math.random() > 0.5) {
        debris.style.borderRadius = "0"; // Make some square for variety
        debris.style.transform = `rotate(${Math.random() * 360}deg)`;
      }

      // Add to container
      explosionContainer.appendChild(debris);
    }

    // Create more smoke effect elements
    for (let i = 0; i < 12; i++) {
      // Increased from 8
      const smoke = document.createElement("div");
      smoke.className = "smoke";

      // Position around the explosion center with more variance
      const smokeOffset = 40; // Increased from 20
      smoke.style.left =
        centerX + (Math.random() * smokeOffset * 2 - smokeOffset) + "px";
      smoke.style.top =
        centerY + (Math.random() * smokeOffset * 2 - smokeOffset) + "px";

      // Random size
      const size = Math.random() * 80 + 40; // Increased for bigger smoke clouds
      smoke.style.width = size + "px";
      smoke.style.height = size + "px";

      // Random animation duration and delay
      smoke.style.animationDuration = Math.random() * 1.5 + 1.5 + "s"; // Longer duration
      smoke.style.animationDelay = Math.random() * 0.5 + "s"; // More varied delay

      // Add to container
      explosionContainer.appendChild(smoke);
    }

    // Add a screen flash effect
    const flash = document.createElement("div");
    flash.className = "screen-flash";
    explosionContainer.appendChild(flash);

    // Add a second flash with delay for more impact
    setTimeout(() => {
      const secondFlash = document.createElement("div");
      secondFlash.className = "screen-flash";
      secondFlash.style.animationDuration = "0.3s";
      explosionContainer.appendChild(secondFlash);
    }, 200);

    // Add a failed indicator to the element
    element.classList.add("incorrect-highlight");

    // Clear the element's inner HTML
    element.innerHTML = "";

    // Wait for animation to complete
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.FEEDBACK_DURATION)
    );

    // Remove the explosion container
    explosionContainer.remove();
    element.classList.remove("incorrect-highlight");
  }

  static async flipCard(element) {
    element.style.transform = "rotateY(180deg)";
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.CARD_FLIP_DURATION / 2)
    );
    element.style.transform = "rotateY(0)";
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.CARD_FLIP_DURATION / 2)
    );
  }

  static async fadeIn(element) {
    element.style.opacity = "0";
    element.classList.remove("hidden");
    await new Promise((resolve) => setTimeout(resolve, 50));
    element.style.opacity = "1";
  }

  static async fadeOut(element) {
    element.style.opacity = "0";
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.ANIMATION_DURATION)
    );
    element.classList.add("hidden");
  }
}

// Add animation styles to the document
const style = document.createElement("style");
style.textContent = `
    .confetti-particle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        animation: confetti-fall linear forwards;
        z-index: 9999;
    }

    @keyframes confetti-fall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        75% {
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }

    .bomb-animation {
        position: absolute;
        width: 50px;
        height: 50px;
        background: #ff6b6b;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: bomb-explosion 1s ease-out forwards;
        z-index: 9999;
    }
    
    .main-explosion {
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, #ff6b6b, #ff4757);
        box-shadow: 0 0 30px #ff4757, 0 0 60px #ff6b6b;
    }

    @keyframes bomb-explosion {
        0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    .shockwave {
        position: absolute;
        width: 10px;
        height: 10px;
        background: transparent;
        border: 6px solid rgba(255, 75, 75, 0.8);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: shockwave 1s ease-out forwards;
        z-index: 9998;
    }
    
    @keyframes shockwave {
        0% {
            width: 0px;
            height: 0px;
            border-width: 6px;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            border-width: 1px;
            opacity: 0;
        }
    }
    
    .debris {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        z-index: 9997;
        transform: translate(-50%, -50%);
        animation: debris-fly 1s ease-out forwards;
    }
    
    @keyframes debris-fly {
        0% {
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: 
                translate(
                    calc(-50% + var(--distance) * cos(var(--angle))), 
                    calc(-50% + var(--distance) * sin(var(--angle)))
                )
                scale(0.2)
                rotate(180deg);
            opacity: 0;
        }
    }
    
    .smoke {
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(100, 100, 100, 0.8), rgba(50, 50, 50, 0.2));
        transform: translate(-50%, -50%);
        animation: smoke-rise 2s ease-out forwards;
        z-index: 9996;
    }
    
    @keyframes smoke-rise {
        0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
        }
        20% {
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, calc(-50% - 100px)) scale(2);
            opacity: 0;
        }
    }
    
    .screen-flash {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 75, 75, 0.3);
        animation: screen-flash 0.5s ease-out forwards;
        z-index: 9990;
    }
    
    @keyframes screen-flash {
        0% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    
    .correct-highlight {
        animation: correct-pulse 0.6s ease-in-out 3;
    }
    
    @keyframes correct-pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(76, 236, 163, 0.7);
        }
        50% {
            box-shadow: 0 0 0 15px rgba(76, 236, 163, 0.3);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(76, 236, 163, 0);
        }
    }
    
    .incorrect-highlight {
        animation: incorrect-pulse 0.3s ease-in-out 5;
    }
    
    @keyframes incorrect-pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.7);
        }
        50% {
            box-shadow: 0 0 0 10px rgba(255, 75, 75, 0.3);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 75, 75, 0);
        }
    }

    .timer-warning {
        color: #ff4757 !important;
        font-weight: bold !important;
        text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
        transform-origin: center center;
        display: inline-block;
    }
    
    .timer-container-warning {
        animation: timer-vibrate 0.3s ease-in-out infinite;
        transform-origin: center center;
        font-size: 1.3em;
    }
    
    @keyframes timer-vibrate {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
