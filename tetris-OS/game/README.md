# Tetris MVP

A classic Tetris game implementation using HTML5, CSS, and JavaScript. This is a minimal viable product (MVP) that includes all the core features of the original Tetris game.

## How to Launch the Game

### Option 1: Open Directly in Browser

1. Simply open the `index.html` file in any modern web browser (Chrome, Firefox, Safari, Edge).
2. The game should load immediately and display the title screen.

### Option 2: Using a Local Server

For the best experience, especially with audio features, you may want to use a local server:

1. If you have Python installed:
   ```
   # For Python 3.x
   python -m http.server
   
   # For Python 2.x
   python -m SimpleHTTPServer
   ```

2. If you have Node.js installed:
   ```
   # Install a simple server first (if you haven't already)
   npm install -g http-server
   
   # Then run
   http-server
   ```

3. Open your browser and navigate to `http://localhost:8000` (or whatever port your server uses).

## Game Controls

- **Arrow Left/Right**: Move piece horizontally
- **Arrow Down**: Soft drop (faster fall)
- **Arrow Up**: Hard drop (instant placement)
- **Z**: Rotate piece
- **P**: Pause game
- **R**: Restart game
- **ESC**: Quit to title screen

## Features

- 7 classic tetromino shapes
- Progressive difficulty (speed increases with level)
- Score tracking with high scores
- Ghost piece preview
- Next piece preview
- Line clear animations
- Mobile-friendly responsive design with touch controls

## Technical Implementation

The game is built with a component-based architecture:

- Core game logic
- Rendering system
- Input handling
- Collision detection
- Scoring system
- Animation system
- Local storage for high scores

## Browser Compatibility

The game should work in all modern browsers with HTML5 Canvas support:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- Sound effects require interaction with the page first (browser security)
- Performance may vary on older mobile devices

## Future Improvements

Potential enhancements for future versions:
- Hold piece functionality
- T-spin recognition
- Combo system
- Multiplayer mode
- Custom themes
- Sound and music options 