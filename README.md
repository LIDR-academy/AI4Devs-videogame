# MiniGolf Game

A fun and challenging MiniGolf game built with Kotlin/JS, featuring multiple levels with increasing difficulty and realistic physics.

## Description

This MiniGolf game offers a complete golfing experience with:
- 10 progressively challenging levels
- Realistic ball physics and collision detection
- Visual power and direction indicators
- Score tracking and best scores per level
- Par scoring system
- Beautiful graphics with shadows and visual effects

## Features

- **Multiple Levels**: Each level has unique obstacles and layouts
- **Physics Engine**: Realistic ball movement and collision detection
- **Visual Feedback**: Power line and golf club visualization
- **Score System**: Track your strokes and compare against par
- **Best Scores**: Save your best performance for each level
- **Responsive Controls**: Intuitive aiming and power control system

## How to Play

1. **Aiming**: Click and drag from the ball to aim your shot
2. **Power Control**: The length of the red line indicates shot power
3. **Shooting**: Release the mouse button to shoot
4. **Objective**: Get the ball in the hole in as few strokes as possible
5. **Level Progression**: Complete each level to unlock the next one

## Setup and Execution

### Prerequisites

- Java Development Kit (JDK) 11 or higher
- Gradle 7.0 or higher
- A modern web browser

### Running the Game

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd minigolf
   ```

2. Run the game:
   ```bash
   ./run-minigolf.sh
   ```

3. Open your web browser and navigate to:
   ```
   http://localhost:8080
   ```

### Development Setup

1. Open the project in your preferred IDE (IntelliJ IDEA recommended)
2. Import the project as a Gradle project
3. Let Gradle sync complete
4. Run the `jsBrowserDevelopmentRun` task

## Controls

- **Mouse Click and Drag**: Aim and set power
- **Mouse Release**: Shoot the ball
- **No Controls Needed**: Watch the ball roll after shooting

## Game Rules

1. Each level has a par score
2. Try to complete each level in as few strokes as possible
3. The ball must enter the hole to complete the level
4. Your best score for each level is saved automatically
5. Progress to the next level by completing the current one

## Technical Details

- Built with Kotlin/JS
- Uses HTML5 Canvas for rendering
- Implements realistic physics for ball movement
- Stores best scores in browser localStorage
- Responsive design that works on different screen sizes

## Contributing

Feel free to submit issues and enhancement requests!
