// Simple script to create placeholder images using canvas
// Run this with Node.js once you've installed canvas module
// npm install canvas
const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create a placeholder sprite sheet
function createSpriteSheet(name, color, frameWidth, frameHeight, frames) {
    console.log(`Creating sprite sheet for ${name} with color ${color}`);

    // Create canvas with appropriate size for the sprite sheet
    const canvas = createCanvas(frameWidth * frames, frameHeight);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw differently colored rectangles for each frame
    for (let i = 0; i < frames; i++) {
        // Calculate frame position
        const x = i * frameWidth;
        
        // Draw character shape
        ctx.fillStyle = color;
        
        // Draw body (slightly different for each frame to simulate animation)
        const offset = Math.sin(i * 0.5) * 3;
        ctx.fillRect(x + 8, 10 + offset, 16, 30);
        
        // Draw head
        ctx.fillRect(x + 10, 4 + offset, 12, 10);
        
        // Draw weapon or special effect based on frame
        if (i > 9 && i < 14) {
            // Attack frames
            ctx.fillStyle = '#FF9900';
            ctx.fillRect(x + 24, 15, 6, 6);
        } else if (i > 13) {
            // Death frames
            ctx.fillStyle = '#FF0000';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(x + 5, 25, 22, 8);
            ctx.globalAlpha = 1.0;
        }
        
        // Frame number (for debugging)
        ctx.fillStyle = 'white';
        ctx.font = '8px sans-serif';
        ctx.fillText(i.toString(), x + 2, 46);
    }

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`assets/images/${name}.png`, buffer);
}

// Function to create a simple icon
function createIcon(name, color) {
    console.log(`Creating icon for ${name} with color ${color}`);

    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, 32, 32);

    // Draw colored circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();

    // Add some detail
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 1.5);
    ctx.stroke();

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`assets/images/${name}-icon.png`, buffer);
}

// Function to create effect animations
function createEffectAnimation(name, color, frames) {
    console.log(`Creating effect animation for ${name}`);
    
    const size = name === 'explosion' ? 64 : 32;
    const canvas = createCanvas(size * frames, size);
    const ctx = canvas.getContext('2d');
    
    // Fill background with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw effect frames
    for (let i = 0; i < frames; i++) {
        const x = i * size;
        const radius = size / 2 * (1 - i / frames);
        
        // Draw colored circle that gets smaller
        ctx.fillStyle = color;
        ctx.globalAlpha = 1 - (i / frames);
        ctx.beginPath();
        ctx.arc(x + size/2, size/2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add details
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + size/2, size/2, radius * 0.7, 0, Math.PI * 1.7);
        ctx.stroke();
    }
    
    // Reset alpha
    ctx.globalAlpha = 1.0;
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`assets/images/${name}.png`, buffer);
}

// Create directory if it doesn't exist
if (!fs.existsSync('assets/images')) {
    fs.mkdirSync('assets/images', { recursive: true });
}

// Create icons for races
createIcon('human', '#3498db');  // Blue
createIcon('elf', '#2ecc71');    // Green
createIcon('orc', '#e74c3c');    // Red

// Create other UI elements
createIcon('gold', '#f1c40f');   // Yellow for gold
createIcon('logo', '#9b59b6');   // Purple for logo
createIcon('loading-bar', '#3498db');  // Blue for loading bar
createIcon('background', '#2c3e50');  // Dark blue for background

// Create unit sprite sheets - 20 frames each (4 idle, 6 walk, 4 attack, 6 death)
// Human units
createSpriteSheet('human-swordsman', '#3498db', 32, 48, 20);
createSpriteSheet('human-archer', '#3498db', 32, 48, 20);
createSpriteSheet('human-knight', '#3498db', 32, 48, 20);
createSpriteSheet('human-cleric', '#3498db', 32, 48, 20);

// Elf units
createSpriteSheet('elf-spearman', '#2ecc71', 32, 48, 20);
createSpriteSheet('elf-archer', '#2ecc71', 32, 48, 20);
createSpriteSheet('elf-druid', '#2ecc71', 32, 48, 20);
createSpriteSheet('elf-sentinel', '#2ecc71', 32, 48, 20);

// Orc units
createSpriteSheet('orc-brute', '#e74c3c', 32, 48, 20);
createSpriteSheet('orc-thrower', '#e74c3c', 32, 48, 20);
createSpriteSheet('orc-shaman', '#e74c3c', 32, 48, 20);
createSpriteSheet('orc-beast', '#e74c3c', 48, 48, 20);

// Create effect animations
createEffectAnimation('explosion', '#e74c3c', 16);  // Red explosion
createEffectAnimation('heal', '#2ecc71', 6);        // Green healing

console.log('All placeholder images created successfully!');
