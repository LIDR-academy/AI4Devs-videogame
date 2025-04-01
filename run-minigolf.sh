#!/bin/bash

echo "Starting MiniGolf game..."

# Change to the project root directory
cd "$(dirname "$0")" || { echo "Error: Cannot change to script directory"; exit 1; }

# Kill any running servers on port 8080
echo "Stopping any running servers on port 8080..."
kill -9 $(lsof -ti:8080) 2>/dev/null || true

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Copy index.html to minigolf directory if needed
if [ ! -f "minigolf/index.html" ]; then
    echo "Copying index.html to minigolf directory..."
    cp index.html minigolf/index.html 2>/dev/null || true
fi

# Navigate to the minigolf directory
cd minigolf || { echo "Error: minigolf directory not found"; exit 1; }

# Create build directories
mkdir -p build/js/packages/minigolf

# Copy index.html to build directory
echo "Copying index.html to build directory..."
cp index.html build/js/packages/minigolf/index.html

# Create a simple minigolf.js file if it doesn't exist
if [ ! -f "build/js/packages/minigolf/minigolf.js" ]; then
    echo "Creating a simple minigolf.js file..."
    cat > build/js/packages/minigolf/minigolf.js << 'EOF'
// Simple MiniGolf game in plain JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    
    // Game state
    let strokes = 0;
    let ballX = 400;
    let ballY = 500;
    let ballRadius = 10;
    let ballVelocityX = 0;
    let ballVelocityY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let holeX = 400;
    let holeY = 100;
    let holeRadius = 20;
    let friction = 0.98;
    
    // Draw the course
    function drawCourse() {
        // Green background (already set in CSS)
        
        // Draw hole
        ctx.beginPath();
        ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        
        // Draw ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Draw drag line when dragging
        if (isDragging) {
            ctx.beginPath();
            ctx.moveTo(ballX, ballY);
            ctx.lineTo(dragStartX, dragStartY);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    // Update game state
    function update() {
        // Move ball if it has velocity
        if (Math.abs(ballVelocityX) > 0.1 || Math.abs(ballVelocityY) > 0.1) {
            ballX += ballVelocityX;
            ballY += ballVelocityY;
            
            // Apply friction
            ballVelocityX *= friction;
            ballVelocityY *= friction;
        } else {
            ballVelocityX = 0;
            ballVelocityY = 0;
        }
        
        // Check for collision with canvas edges
        if (ballX - ballRadius < 0) {
            ballX = ballRadius;
            ballVelocityX = -ballVelocityX * 0.7;
        }
        if (ballX + ballRadius > canvas.width) {
            ballX = canvas.width - ballRadius;
            ballVelocityX = -ballVelocityX * 0.7;
        }
        if (ballY - ballRadius < 0) {
            ballY = ballRadius;
            ballVelocityY = -ballVelocityY * 0.7;
        }
        if (ballY + ballRadius > canvas.height) {
            ballY = canvas.height - ballRadius;
            ballVelocityY = -ballVelocityY * 0.7;
        }
        
        // Check if ball is in hole
        const distance = Math.sqrt(Math.pow(ballX - holeX, 2) + Math.pow(ballY - holeY, 2));
        if (distance < holeRadius - ballRadius) {
            // Ball is in hole
            alert(`You completed the hole in ${strokes} strokes!`);
            resetGame();
            scoreElement.textContent = `Strokes: ${strokes}`;
        }
    }
    
    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        drawCourse();
        requestAnimationFrame(gameLoop);
    }
    
    // Reset game
    function resetGame() {
        ballX = 400;
        ballY = 500;
        ballVelocityX = 0;
        ballVelocityY = 0;
        strokes = 0;
    }
    
    // Event listeners
    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check if mouse is on ball
        const distance = Math.sqrt(Math.pow(mouseX - ballX, 2) + Math.pow(mouseY - ballY, 2));
        if (distance < ballRadius && ballVelocityX === 0 && ballVelocityY === 0) {
            isDragging = true;
            dragStartX = mouseX;
            dragStartY = mouseY;
        }
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            dragStartX = e.clientX - rect.left;
            dragStartY = e.clientY - rect.top;
        }
    });
    
    canvas.addEventListener('mouseup', function() {
        if (isDragging) {
            // Calculate velocity based on drag distance and direction
            ballVelocityX = (ballX - dragStartX) * 0.1;
            ballVelocityY = (ballY - dragStartY) * 0.1;
            
            isDragging = false;
            strokes++;
            scoreElement.textContent = `Strokes: ${strokes}`;
        }
    });
    
    // Start game
    resetGame();
    gameLoop();
});
EOF
fi

# Run the Node.js server
echo "Starting server on port 8080..."
node server.js

echo "Game server stopped." 