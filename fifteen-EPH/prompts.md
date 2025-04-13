# Fifteen Puzzle Game - EPH

IA utilizada: Cursor

# Prompts:

## Prompt 1

```md
# Generate a 15 Puzzle Game with Phaser 3

I want you to develop a _15 Puzzle_ game using **JavaScript, HTML, and CSS**, with the **Phaser 3** library.

## **Game Requirements:**

1. **Level Selection Screen:**

   - The player must be able to choose between:
     - **Easy (3x3)**
     - **Medium (4x4)**
     - **Hard (5x5)**
   - Design should follow a **cyberpunk aesthetic**, with neon colors, futuristic fonts, and a dark background.
   - Interactive buttons with a glowing neon effect for selecting the level.

2. **Game Screen:**

   - A board with numbered tiles from **1 to the board size**.
   - Tiles must **slide smoothly** when moved.
   - A **time counter** that starts when the game begins.
   - A **move counter** that increases every time a tile is slid.
   - **Sound effects**:
     - A sound when a tile moves (sci-fi or glitchy sound).
     - A special sound when the puzzle is completed (synthwave-style effect).
   - **Relaxing background music** that loops throughout the game.
   - A button to **restart the game** without changing the level.

3. **Ranking Screen:**
   - Displays **two leaderboards**:
     - **Time-based ranking** (players who solve the puzzle the fastest).
     - **Move-based ranking** (players who solve the puzzle with the fewest moves).
   - Ranking data should be **stored in `localStorage`** and persist after closing the game.

## **Code Structure & Organization:**

- The code should be **well-structured and modular**, with separate files for different parts of the game:
  - `index.html` (base structure).
  - `main.js` (initialization and game setup).
  - `scenes/MenuScene.js` (handles the level selection screen).
  - `scenes/GameScene.js` (contains the main game logic).
  - `scenes/RankingScene.js` (manages the ranking display).
  - `styles.css` (design and cyberpunk styling).
  - `assets/` (folder for sound effects, background music, and any necessary images).
- Code should be **modular and commented** for clarity.

## **Interaction and Usability:**

- **Mouse and touch compatibility**:
  - Players should be able to click or tap a tile to move it if there is an adjacent empty space.
- **Smooth animations** when tiles move.
- **Cyberpunk aesthetic** with:
  - Neon colors (electric blue, neon pink, purple).
  - Dark futuristic UI with glowing edges.
  - Digital or glitchy font style.
- **Background music should be relaxing** (ambient, synthwave, or chill electronic).

## **Delivery Format:**

Ensure that the code follows **good development practices**, including:

- Clean, **well-organized files**.
- **Modularization**: each scene should be in its own file.
- **Commented code** to explain important functions and logic.

Generate the code following these instructions.
```

## Prompt 2

Buttons aren't working properly.

## Prompt 3

At RankingScene.js I can't choose other difficulty levels.

## Prompt 4

When restarting the game, tiles are not moving properly.
