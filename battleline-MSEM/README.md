# Battleline

A 2D strategy game inspired by Warlords, built with Phaser 3, HTML, CSS, and JavaScript.

## 🎮 Game Overview

Battleline is a lane-based strategy game where players choose one of three races (Humans, Elves, or Orcs) and deploy various units to battle against an enemy. Each race has unique units with special abilities, and players must manage resources and cooldowns to achieve victory.

## 🚀 Game Features

- **Three Playable Races**: Humans, Elves, and Orcs, each with four unique unit types
- **Lane-Based Combat**: Strategic unit deployment across multiple lanes
- **Economy System**: Gold generation and management
- **Cooldown System**: Prevents unit spamming
- **Special Abilities**: Unique effects like healing, slowing enemies, and area attacks
- **Mass Attack**: Special ability to deploy units in all lanes at once

## 🎯 How to Play

1. Clone this repository
2. Open the `index.html` file in a web server (see "Running the Game" below)
3. Select a race at the menu screen
4. Deploy units by clicking on unit buttons and selecting a lane
5. Manage your gold and unit cooldowns
6. Win by having your units reach the enemy base (right side)
7. Defend against enemy units reaching your base (left side)

## 💻 Running the Game

Since this game uses JavaScript modules and assets, it needs to run on a web server. You can use one of these methods:

### Using Python's built-in server

```bash
# If you have Python installed:
# Navigate to the game directory
cd /path/to/battleline

# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then open your browser and go to `http://localhost:8000`

### Using Node.js

If you have Node.js installed, you can use packages like `http-server`:

```bash
# Install http-server globally
npm install -g http-server

# Navigate to the game directory
cd /path/to/battleline

# Start the server
http-server
```

Then open your browser and go to `http://localhost:8080`

## 🎨 Asset Generation

The game comes with a script to generate placeholder assets. If you have Node.js installed, you can run:

```bash
# Install the canvas package
npm install canvas

# Run the script
node create_placeholder_images.js
```

This will create basic placeholder images for all units and icons. For a complete game, you should replace these with proper sprites and animations.

## 📂 Project Structure

```
/warlords-game/
├── index.html            # Main entry point
├── css/                  # Styling
│   └── styles.css        # Main CSS file
├── assets/               # Game assets
│   ├── images/           # Sprites, backgrounds, UI elements
│   ├── audio/            # Sound effects, music
│   └── data/             # JSON configurations
├── js/                   # JavaScript files
│   ├── main.js           # Game initialization
│   ├── config.js         # Game configuration
│   ├── scenes/           # Game scenes (menu, gameplay, etc.)
│   ├── entities/         # Unit classes and behaviors
│   └── systems/          # Game systems (combat, economy, etc.)
```

## 🛠️ Customization

You can customize various aspects of the game:

- **Unit Stats**: Edit `assets/data/units.json`
- **Upgrades**: Edit `assets/data/upgrades.json`
- **Game Settings**: Modify values in `js/config.js`
- **Visual Style**: Update styles in `css/styles.css`

## 🔧 Development

To extend this game, you can:

1. Add more unit types by extending the `Unit` class
2. Implement new special abilities in the `useSpecialAbility` method
3. Add additional lanes or gameplay mechanics
4. Implement a level system with different enemy waves
5. Add sound effects and music to enhance the experience

## 🏆 Victory Conditions

- Win by having your units reach the enemy base
- Lose if enemy units reach your base

Enjoy the game!
