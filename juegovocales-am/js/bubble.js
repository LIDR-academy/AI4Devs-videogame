class Bubble {
    constructor(vocal) {
        this.vocal = vocal;
        this.element = this.createElement();
        this.addAccessibility();
    }

    createElement() {
        const bubble = document.createElement('div');
        bubble.className = 'burbuja';
        bubble.textContent = this.vocal;
        bubble.style.backgroundColor = this.getColor();
        
        // Definir posiciones fijas para cada vocal
        const positions = {
            'a': { x: 20, y: 20 },
            'e': { x: 60, y: 20 },
            'i': { x: 40, y: 40 },
            'o': { x: 20, y: 60 },
            'u': { x: 60, y: 60 }
        };
        
        bubble.style.left = `${positions[this.vocal].x}%`;
        bubble.style.top = `${positions[this.vocal].y}%`;
        bubble.style.zIndex = '1';

        // Eventos para manejo de z-index
        bubble.addEventListener('mouseenter', () => {
            bubble.style.zIndex = '10';
        });
        
        bubble.addEventListener('mouseleave', () => {
            bubble.style.zIndex = '1';
        });

        return bubble;
    }

    getColor() {
        const colors = {
            'a': 'var(--color-a)',
            'e': 'var(--color-e)',
            'i': 'var(--color-i)',
            'o': 'var(--color-o)',
            'u': 'var(--color-u)'
        };
        return colors[this.vocal];
    }

    addAccessibility() {
        this.element.setAttribute('role', 'button');
        this.element.setAttribute('aria-label', `Vocal ${this.vocal}`);
        this.element.setAttribute('tabindex', '0');
        
        this.element.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.element.click();
            }
        });
    }
} 