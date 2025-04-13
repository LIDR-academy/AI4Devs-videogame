class SettingsManager {
    constructor() {
        // Default settings
        this.settings = {
            gridSize: 10,
            colorCount: 6,
            sound: true,
            music: true
        };
        
        // DOM elements
        this.settingsModal = document.getElementById('settings-modal');
        this.gridSizeInput = document.getElementById('grid-size');
        this.gridSizeValue = document.getElementById('grid-size-value');
        this.colorCountInput = document.getElementById('color-count');
        this.colorCountValue = document.getElementById('color-count-value');
        this.soundToggle = document.getElementById('sound-toggle');
        this.musicToggle = document.getElementById('music-toggle');
        this.saveSettingsBtn = document.getElementById('save-settings');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.settingsBtn = document.getElementById('settings-btn');
        
        // Load settings
        this.loadSettings();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    // Static method to load settings
    static loadSettings() {
        const savedSettings = localStorage.getItem('floodFillSettings');
        let settings = {
            gridSize: 10,
            colorCount: 6,
            sound: true,
            music: true
        };
        
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            settings.gridSize = parsedSettings.gridSize || 10;
            settings.colorCount = parsedSettings.colorCount || 6;
            settings.sound = parsedSettings.sound !== undefined ? parsedSettings.sound : true;
            settings.music = parsedSettings.music !== undefined ? parsedSettings.music : true;
        }
        
        return settings;
    }
    
    // Load settings from localStorage
    loadSettings() {
        this.settings = SettingsManager.loadSettings();
        
        // Update UI
        this.updateUI();
    }
    
    // Update settings UI
    updateUI() {
        this.gridSizeInput.value = this.settings.gridSize;
        this.gridSizeValue.textContent = `${this.settings.gridSize}x${this.settings.gridSize}`;
        this.colorCountInput.value = this.settings.colorCount;
        this.colorCountValue.textContent = this.settings.colorCount;
        this.soundToggle.checked = this.settings.sound;
        this.musicToggle.checked = this.settings.music;
    }
    
    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('floodFillSettings', JSON.stringify(this.settings));
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Settings button
        this.settingsBtn.addEventListener('click', () => {
            this.openSettingsModal();
        });
        
        // Grid size input
        this.gridSizeInput.addEventListener('input', () => {
            this.gridSizeValue.textContent = `${this.gridSizeInput.value}x${this.gridSizeInput.value}`;
        });
        
        // Color count input
        this.colorCountInput.addEventListener('input', () => {
            this.colorCountValue.textContent = this.colorCountInput.value;
        });
        
        // Save settings button
        this.saveSettingsBtn.addEventListener('click', () => {
            this.saveSettingsFromUI();
            this.closeSettingsModal();
            
            // Dispatch custom event
            const event = new CustomEvent('settingsChanged', {
                detail: this.settings
            });
            document.dispatchEvent(event);
        });
        
        // Close settings button
        this.closeSettingsBtn.addEventListener('click', () => {
            this.closeSettingsModal();
        });
    }
    
    // Open settings modal
    openSettingsModal() {
        // Make sure UI reflects current settings
        this.updateUI();
        this.settingsModal.style.display = 'flex';
    }
    
    // Close settings modal
    closeSettingsModal() {
        this.settingsModal.style.display = 'none';
    }
    
    // Save settings from UI
    saveSettingsFromUI() {
        this.settings.gridSize = parseInt(this.gridSizeInput.value);
        this.settings.colorCount = parseInt(this.colorCountInput.value);
        this.settings.sound = this.soundToggle.checked;
        this.settings.music = this.musicToggle.checked;
        
        this.saveSettings();
    }
    
    // Get settings
    getSettings() {
        return { ...this.settings };
    }
} 