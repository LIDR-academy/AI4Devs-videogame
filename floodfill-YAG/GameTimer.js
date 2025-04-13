class GameTimer {
    constructor() {
        this.startTime = null;
        this.timer = null;
        this.timeDisplay = document.getElementById('time');
        this.elapsedSeconds = 0;
    }
    
    // Start the timer
    start() {
        // Clear existing timer
        this.stop();
        
        this.startTime = Date.now();
        this.elapsedSeconds = 0;
        this.timer = setInterval(() => this.update(), 1000);
        this.timeDisplay.textContent = '00:00';
    }
    
    // Stop the timer
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    // Reset the timer
    reset() {
        this.stop();
        this.elapsedSeconds = 0;
        this.timeDisplay.textContent = '00:00';
    }
    
    // Update the timer display
    update() {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const seconds = this.elapsedSeconds % 60;
        
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Get current time as formatted string
    getTime() {
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const seconds = this.elapsedSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Get elapsed seconds
    getElapsedSeconds() {
        return this.elapsedSeconds;
    }
} 