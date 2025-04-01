## Game Mechanics for Tetris MVP

### Core Mechanics:
- 7 tetromino shapes (I, O, T, S, Z, J, L) each with distinct colors
- Playing field: 10×20 grid
- Pieces fall from top at increasing speeds
- Rotation: 90° clockwise/counterclockwise
- Controls: Move left/right, rotate, soft drop (faster fall), hard drop (instant placement)
- Line clearing: Filled horizontal lines disappear, blocks above fall down
- Game over: When new pieces can't enter playing field

### Scoring System:
- Single line: 100 points
- Double lines: 300 points
- Triple lines: 500 points
- Tetris (4 lines): 800 points
- Bonus multipliers based on level
- Points for soft/hard drops (1-2 points per cell dropped)

### Difficulty Progression:
- Start at level 1, speed increases every 10 lines cleared
- Level formula: Starting level + (Lines cleared ÷ 10)
- Each level increases fall speed by approximately 10%
- Level 1: ~1.0 seconds per line
- Level 10: ~0.1 seconds per line
- Maximum practical speed at ~level 15-20

## MVP Scope, Target Audience & Success Metrics

### MVP Scope:
- Single-player mode only
- Core tetromino mechanics with accurate physics
- Progressive difficulty system
- Basic scoring system
- Local high score tracking
- Simple UI with next piece preview
- Basic sound effects and minimal music
- Support for keyboard/touch controls
- Pause functionality

### Target Audience:
- Primary: Casual gamers ages 13-45
- Secondary: Nostalgic players familiar with classic Tetris
- Tertiary: Puzzle game enthusiasts looking for skill-based challenges

### Success Metrics:
- User engagement: Average session length >10 minutes
- Retention: 30% of users return within 7 days
- Completion rate: 50% of users reach level 5
- User satisfaction: >4.0/5.0 rating score
- Performance: <1% crash rate, <50ms input latency
- Distribution: 1,000 downloads/plays in first month
- Feedback quality: 10% of users provide actionable feedback
