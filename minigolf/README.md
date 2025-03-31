# MiniGolf Game

A simple minigolf game created for the AI4Devs project.

## How to Run

Simply open the `index.html` file in a web browser to play the game. No compilation or build step is required.

## How to Play

1. Click and hold on the white ball to aim
2. Move your mouse to adjust direction and power
   - The red line shows the aim direction
   - The length of the line indicates power
3. Release to shoot
4. Try to get the ball into the black hole

## Game Features

- Physics-based ball movement with friction
- Wall collisions
- Stroke counter
- Success message when the ball goes in the hole

## Technical Details

The game is implemented using HTML5 Canvas and JavaScript. The main components are:

- Ball class: Represents the golf ball with position and velocity
- Hole class: Represents the target hole
- Game class: Main game logic including physics, rendering, and user interaction

## Future Kotlin Implementation

We originally planned to implement this game in Kotlin/JS but encountered setup issues. The current JavaScript implementation follows the same structure that would be used in the Kotlin version, with:

- Data classes for the Ball and Hole
- A main Game class handling all game logic
- Canvas-based rendering
- Mouse-based controls

## Credits

Created for the AI4Devs course. 