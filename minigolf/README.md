# MiniGolf Game

A minigolf game implemented with Kotlin/JS and HTML5 Canvas.

## Prerequisites

- Java JDK 11 or higher
- Gradle (or use the included wrapper)

## How to Build and Run

### Using Gradle Wrapper (Recommended)

1. Open a terminal/command prompt in the `minigolf` directory
2. Run the following commands:

```bash
# Clean and build the project
./gradlew clean build

# If you encounter yarn.lock issues, run:
./gradlew kotlinUpgradeYarnLock

# Start the development server
./gradlew runGame
```

3. Open your web browser and navigate to: [http://localhost:8080](http://localhost:8080)

### Verifying the Build

After running the build command, you should see the compiled JavaScript file at:
`build/js/packages/minigolf/kotlin/minigolf.js`

### Troubleshooting the Development Server

If the development server (http://localhost:8080) isn't working:

1. Check if the Gradle process is running with `ps aux | grep gradle`
2. Try a different port with `./gradlew -Dorg.gradle.jvmargs="-Ddev.server.port=8081" runGame`
3. As a fallback, you can directly open the `index.html` file in your browser

## How to Play

1. Click and hold on the white ball to aim
2. Move your mouse to adjust direction and power
   - The red line shows the aim direction
   - The length of the line indicates power
3. Release to shoot
4. Try to get the ball into the black hole

## Troubleshooting

### Game Doesn't Load

- Check that the build was successful without errors
- Ensure the path to the JavaScript file is correct in index.html (should be `build/distributions/minigolf.js`)
- Try opening browser developer tools (F12) to check for JavaScript errors
- Try running with `./gradlew jsBrowserRun` which will open a browser automatically

### Compilation Errors

If you encounter compilation errors:

```bash
# Update Kotlin dependencies
./gradlew kotlinUpgradeYarnLock

# Clean and rebuild
./gradlew clean build
```

## Technical Details

The game is implemented using Kotlin/JS with:

- Data classes for the Ball and Hole
- Canvas-based rendering
- Mouse-based controls
- Physics simulation including friction and collisions

### Project Structure

- `src/jsMain/kotlin/com/ai4devs/minigolf/Game.kt`: Main game logic
- `src/jsMain/kotlin/com/ai4devs/minigolf/Main.kt`: Entry point
- `index.html`: HTML container with Canvas element
- `build.gradle.kts`: Kotlin/JS build configuration

### Technologies Used

- Kotlin 1.9.22
- Kotlin/JS for browser transpilation
- HTML5 Canvas for rendering
- Gradle for building and running

## Credits

Created for the AI4Devs course. 