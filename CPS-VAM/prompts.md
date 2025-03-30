# CPS > Cientifico - Platform Shooter

### Assets
    Sounds
        https://pixabay.com/sound-effects/

    Images
        gpt-4o
        gemini flash 2.0


### Model
    gpt-4o

### prompt 1
    act as a professional game developer of indie games using just html, js, and css that can run in the browser

### prompt 2

    i want to build a 2D platform game of a cyberpunk mad scientist that has a gun as a weapon and use it to kill aliens . the game should be build only with html, css and js and assets such as sound, images,.. but no frameworks. dont build yet, we havve to confirm first that you have no more questions

"
⚡️ Questions Before We Start
Game Length: Do you want endless waves or level-based progression?

Difficulty Curve: Should enemies get stronger/faster over time?

Power-Ups/Items: Any special abilities (e.g., shield, extra ammo)?

Win/Lose Conditions: Define victory and defeat criteria.

Visual Style: Do you have a preference for pixel art or high-res assets?

Mobile Compatibility: Should we make it touch-friendly?
"

### prompt 3

    1- yes, endless waves increasing difficulty 2- yes, it should get more difficult as player is gaining more points 3- infinite ammo, but add ability to jump 4- player should have a health bar that lowers if touched by an alien, if the health bar is 0% or below, then it is game over. 5- no, it should be for desktop


"
🎯 Final Game Design Plan
✅ Core Mechanics Recap
Player Controls:

Move left, right, and jump.

Shoot with a key press (Space or Ctrl).

Movement: ArrowLeft, ArrowRight, ArrowUp for jumping.

Shooting Mechanism:

Infinite ammo.

Bullets destroy aliens on collision.

Enemy AI:

Aliens spawn in waves.

Increase difficulty over time:

Faster movement.

More aliens spawn.

Health System:

Health bar for the player (100% to 0%).

Health reduces if aliens touch the player.

Game over when health reaches 0%.

Endless Wave Progression:

Aliens spawn endlessly.

Difficulty increases as the score goes up.

Score System:

Score increases when an alien is eliminated.

Higher difficulty with higher score.

🎥 Visual and Gameplay Elements
Player Animations: Idle, run, jump, and shoot.

Alien Animations: Patrol and attack.

Cyberpunk Environment: Futuristic dark neon-themed city background.

UI Elements:

Health bar

Score counter

Wave indicator

🕹️ Control Scheme
ArrowLeft → Move Left

ArrowRight → Move Right

ArrowUp → Jump

Space or Ctrl → Shoot

🎧 Audio and Visual Effects
Sound Effects:

Gunfire

Alien hit

Player damage

Background Music:

Cyberpunk/Techno Vibe

Visual Effects:

Neon glow on player and bullets

Explosions for enemy kills

📚 Technical Plan
🚀 HTML Setup
Canvas to render the game.

Basic UI for health and score.

🎨 CSS Styling
Dark theme with neon highlights.

Animate the health bar and UI elements.

💡 JavaScript Core Logic
Main game loop (requestAnimationFrame).

Collision detection between bullets and aliens.

Spawn control for waves and increasing difficulty.

Enemy AI behavior and player actions.

🛠️ Project Structure
bash
Copy
Edit
/cyberpunk-scientist-game
├── /assets
│   ├── /images
│   │   ├── player_idle.png
│   │   ├── player_run.png
│   │   ├── player_jump.png
│   │   ├── player_shoot.png
│   │   ├── alien_walk.png
│   │   ├── alien_hit.png
│   │   ├── bullet.png
│   │   └── background.png
│   ├── /sounds
│   │   ├── shoot.mp3
│   │   ├── hit.mp3
│   │   ├── damage.mp3
│   │   └── bg-music.mp3
├── /css
│   └── styles.css
├── /js
│   ├── game.js
│   ├── player.js
│   ├── enemy.js
│   └── bullet.js
└── index.html
⚡️ Wave Progression and Difficulty Increase
Wave 1: Slow aliens, minimal damage.

Wave 5+: Faster aliens, more spawns.

Wave 10+: Aliens shoot back or spawn in groups.

🧠 Game Logic for Difficulty
Increase alien speed by +0.1 after every 5 aliens killed.

Reduce spawn interval as score increases.

Randomized spawn positions and wave sizes.

🎮 Game Over Criteria
Player dies if:

Health reaches 0%.

Show a “Game Over” screen with the score.
"

### prompt 4

    ok, before starting i want you to make a moscow analysis and then build our PRD for our game. the game will be named vam, the alien killer. Also remember to be very detailed in the PRD, including instructions and using the best ux/ui practices


"
📚 Detailed Product Requirements Document (PRD)
🎮 VAM: The Alien Killer – Product Requirements Document (PRD)
1. 🎯 Game Overview
VAM: The Alien Killer is a 2D platform shooter where players control a cyberpunk mad scientist fighting endless waves of alien invaders. The player uses a futuristic gun with infinite ammo to eliminate aliens, surviving as long as possible while dealing with increasing difficulty.

2. 🕹️ Game Objectives
Eliminate as many aliens as possible.

Survive endless waves while maintaining health.

Achieve the highest score possible.

3. 🧩 Key Features
3.1. 🎮 Core Gameplay
Movement Controls:

Left (ArrowLeft)

Right (ArrowRight)

Jump (ArrowUp)

Shoot (Space or Ctrl)

Gun Mechanism:

Shoot projectiles with infinite ammo.

Destroy aliens on bullet collision.

Wave Progression:

Aliens spawn with increasing frequency and speed.

Difficulty increases after every 5 waves.

Health System:

Health bar decreases when aliens touch the player.

Game over when health reaches 0%.

Collision Detection:

Detect collision between bullets and aliens.

Detect alien contact with the player.

3.2. 👾 Enemy AI Behavior
Basic Aliens:

Move horizontally (patrol pattern).

Cause damage on player contact.

Advanced Aliens:

Faster movement and higher damage.

Appear after certain wave thresholds.

Boss Aliens:

Appear after 10+ waves.

Require multiple hits to destroy.

3.3. 🧠 Wave and Difficulty Scaling
Increase alien speed by +0.1 after every 5 aliens killed.

Reduce spawn interval by -0.2s after every 5 waves.

Randomized spawn positions to increase unpredictability.

3.4. 🎧 Audio and Visual Effects
Sound Effects:

Shooting, enemy hit, player damage, game over.

Background Music:

Looping cyberpunk/techno music.

Visual Effects:

Neon-style UI elements.

Bullet trails and alien explosions.

3.5. 🕹️ UI/UX Design
Health Bar:

Positioned at the top-left.

Decreases dynamically with damage.

Score and Wave Display:

Top-right corner.

Updates in real time.

Game Over Screen:

Shows final score.

Includes restart button.

✅ UX Best Practices:

Minimalist UI for better focus on the gameplay.

Consistent button placement for restart and controls.

Game instructions on the landing screen.

4. 📚 Technical Specifications
4.1. 🛠️ Project Structure
bash
Copy
Edit
/vam-the-alien-killer
├── /assets
│   ├── /images
│   │   ├── player_idle.png
│   │   ├── player_run.png
│   │   ├── player_jump.png
│   │   ├── player_shoot.png
│   │   ├── alien_walk.png
│   │   ├── alien_hit.png
│   │   ├── bullet.png
│   │   └── background.png
│   ├── /sounds
│   │   ├── shoot.mp3
│   │   ├── hit.mp3
│   │   ├── damage.mp3
│   │   └── bg-music.mp3
├── /css
│   └── styles.css
├── /js
│   ├── game.js
│   ├── player.js
│   ├── enemy.js
│   └── bullet.js
└── index.html
4.2. 🎨 UI/UX Guidelines
Color Palette:

Neon blue, purple, and orange for a futuristic vibe.

Dark background to enhance the cyberpunk atmosphere.

Typography:

Futuristic fonts for score and wave counters.

Clean and minimalistic UI.

4.3. 📡 Game Logic and Mechanics
Game Loop:

requestAnimationFrame() for smooth frame rendering.

Update game state and draw elements.

Collision Detection:

Axis-Aligned Bounding Box (AABB) for collision between:

Bullets and aliens.

Aliens and player.

Enemy Spawning:

Randomized alien positions within a defined boundary.

Spawn intervals decrease as difficulty increases.

Wave System:

Increase difficulty progressively by:

Increasing enemy speed.

Reducing spawn intervals.

Adding tougher alien types.

5. 🚀 Game Flow
5.1. 🕹️ Main Game Flow
Start Screen:

Display game title and instructions.

Start button to begin the game.

In-Game:

Player controls and real-time updates.

Continuous waves of enemies.

Game Over:

Display final score and wave.

Option to restart or return to the main menu.

5.2. 🎯 Difficulty Progression Flow
Wave 1-5: Basic aliens, slow, and fewer in number.

Wave 6-10: Faster aliens, reduced spawn intervals.

Wave 11+: Advanced aliens with higher damage.

6. 🧩 Non-Functional Requirements
Performance: Minimal frame drops and smooth gameplay.

Security: Prevent code injection or game exploits.

Cross-Browser Compatibility: Ensure consistency across Chrome, Firefox, and Edge.

7. 📅 Milestones and Timeline
Week 1: Setup project structure, game loop, and basic UI.

Week 2: Implement player movement, shooting, and enemy AI.

Week 3: Add wave progression and difficulty scaling.

Week 4: Integrate audio, visual effects, and refine UI/UX.

8. 🧠 Risks and Mitigation
Performance Issues: Optimize rendering and limit object creation.

Collision Detection Errors: Thorough testing to ensure hitboxes align.

Game Balancing: Playtesting to fine-tune difficulty.

9. 🎮 Success Metrics
Smooth performance with 60 FPS.

Engaging gameplay with balanced difficulty.

High replayability through wave-based progression.
"

### prompt 5

    ok, now begin to build

### prompt 6

    please create all the assets

### prompt 7

    continue with assets

### prompt 8

    ok, integrate all in game


### prompt 9

    i want you to add an initial menu with the instructions (how to jump, move, shoot, ...) and add a message box with a button to start the game 


### prompt 10

    add a pause button with keyboard letter "p", and add it to instructions    

### prompt 11


### prompt 12



### prompt 13



###prompt 14



### prompt 15