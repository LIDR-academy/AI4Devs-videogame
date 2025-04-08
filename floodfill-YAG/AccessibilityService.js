class AccessibilityService {
    constructor() {
        // Initialize accessibility enhancements
        this.setupAccessibility();
    }
    
    // Set up accessibility features
    setupAccessibility() {
        // Add ARIA attributes to color buttons
        this.setupColorButtonsAccessibility();
        
        // Add keyboard focus styles
        this.setupFocusStyles();
        
        // Set up announcements for important game events
        this.setupAnnouncements();
    }
    
    // Set up color buttons accessibility
    setupColorButtonsAccessibility() {
        // Use MutationObserver instead of DOMNodeInserted
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('color-btn')) {
                            const colorBtn = node;
                            const colorIndex = colorBtn.dataset.color;
                            
                            // Set proper attributes
                            colorBtn.setAttribute('role', 'button');
                            colorBtn.setAttribute('aria-label', `Color ${colorIndex}`);
                            colorBtn.setAttribute('tabindex', '0');
                            
                            // Add keyboard event for Enter/Space
                            colorBtn.addEventListener('keydown', (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    colorBtn.click();
                                }
                            });
                        }
                    });
                }
            });
        });
        
        // Start observing the color-controls element
        const colorControls = document.querySelector('.color-controls');
        if (colorControls) {
            observer.observe(colorControls, { childList: true });
        }
    }
    
    // Set up focus styles
    setupFocusStyles() {
        // Add a style element for focus styles
        const style = document.createElement('style');
        style.textContent = `
            .color-btn:focus-visible,
            .pixel-btn:focus-visible {
                outline: 3px solid white;
                box-shadow: 0 0 0 3px black, 0 0 8px 5px rgba(255, 255, 255, 0.5);
                position: relative;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set up announcements for screen readers
    setupAnnouncements() {
        // Create an aria-live region for announcements
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('sr-only');
        announcer.id = 'game-announcer';
        document.body.appendChild(announcer);
        
        // Listen for game events to make announcements
        document.addEventListener('gameMove', (e) => {
            this.announce(`Move ${e.detail.moves}. Changed to color ${e.detail.color}.`);
        });
        
        document.addEventListener('gameWon', (e) => {
            this.announce(`Congratulations! You won in ${e.detail.moves} moves with a time of ${e.detail.time}.`);
        });
        
        document.addEventListener('gameStart', () => {
            this.announce('New game started.');
        });
    }
    
    // Make an announcement to screen readers
    announce(message) {
        const announcer = document.getElementById('game-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    }
    
    // Add SR-only style for screen reader text
    addSROnlyStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(style);
    }
} 