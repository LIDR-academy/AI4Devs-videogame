# MiniGolf Game

A minigolf game implemented with Kotlin/JS and HTML5 Canvas.

## Prerequisites

- Java JDK 11 or higher
- Node.js (for serving the game)

## How to Play

Simply run the game with Gradle and navigate to the provided URL:

```bash
# From the minigolf directory
./gradlew runStandaloneGame
```

Then open your browser and navigate to: [http://localhost:8080](http://localhost:8080)

## Game Controls

1. Click and hold on the white ball to aim
2. Move your mouse to adjust direction and power (the red line shows aim and power)
3. Release to shoot
4. Try to get the ball into the black hole in as few strokes as possible

## Available Gradle Tasks

- `./gradlew runStandaloneGame` - Main task to run the game
- `./gradlew createStandaloneGame` - Creates the standalone HTML game file
- `./gradlew checkNodeInstalled` - Checks if Node.js is installed
- `./gradlew serveStandaloneGame` - Serves the game on port 8080
- `./gradlew runGame` - Legacy task that redirects to runStandaloneGame

## Troubleshooting

If you encounter issues:

1. Ensure Node.js is installed and available in your PATH
2. Make sure port 8080 is not being used by another application
3. Check that you're running the command from the minigolf directory
4. If you see Gradle errors, try running `./gradlew clean` before running the game

## Technical Details

The game uses a standalone HTML file with JavaScript for the game logic. This approach provides a simple and reliable way to run the game without complex build setups.

The Gradle task:
1. Creates a standalone HTML/JS game file
2. Kills any existing processes using port 8080 
3. Starts a Node.js HTTP server to serve the game
4. Opens the game on http://localhost:8080

## Credits

Created for the AI4Devs course. 