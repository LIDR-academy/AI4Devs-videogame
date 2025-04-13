# STATE

"Please help me define the details of a game in JavaScript CSS HTML. I need to fill in the following state, but it must be step by step in an interactive way, waiting for my feedback before moving to the next step. le's start whith which game do you want to implment ?

state {
  Game Overview: [briefly describe the game objective, basic logic, and main mechanics],
  Technical Requirements: [list technical requirements, browser compatibility, use of pure JavaScript, etc.],
  Game Components: [specify game elements, e.g., game grid, snake, food, score],
  Functionality: [describe functionalities, such as key controls, collision logic, speed increase mechanism, etc.],
  Styling: [define how to style the grid, snake, food, and general layout],
  Optimization & Testing: [indicate any optimization requirements and cross-browser testing, code comments, etc.]
}"

After a long interaction focued on the state concepts, it generated the prompts.


# Memory Game - Technical Specification

## Game Overview

A memory card game where players need to match pairs of cards. The game features a level-based progression system, starting with 8 cards and increasing to 12 and 16 cards. The game requires an explicit start action from the player and features fireworks upon completion. When progressing to the next level, the game starts automatically without requiring additional user input.

## Technical Requirements

- HTML5
- CSS3 with Tailwind CSS
- JavaScript (ES6+)
- Web Animations API for fireworks effect

## Game Components

### 1. Game Board

- Responsive grid layout (2x4, 3x4, 4x4)
- Cards are initially face down
- Cards are disabled until game starts
- Cards flip with smooth animation
- Cards show emojis when matched
- Grid adjusts based on level (8, 12, or 16 cards)

### 2. Game Controls

- Single button that serves both start and reset functionality
- Button is green (#10B981)
- Button text changes between "Start Game" and "Reset Game"
- Button is disabled during card animations
- Automatic game start when progressing to next level

### 3. Game Stats

- Move counter
- Timer display
- High score tracking
- Current level display (1-3)

### 4. Level System

- Level 1: 8 cards (2x4 grid)
- Level 2: 12 cards (3x4 grid)
- Level 3: 16 cards (4x4 grid)
- Level progression modal
- Persistent level tracking
- Automatic game start on level progression

### 5. Celebration Effects

- Fireworks animation on game completion
- Multiple firework bursts
- Colorful particle effects
- Smooth fade-out animation

## Functionality

### 1. Game Start Control

- Game requires explicit start action for first level
- Cards are disabled until game starts
- Timer begins only after start
- Button text changes to "Reset Game" after start
- Automatic start when progressing to next level

### 2. Card Mechanics

- Cards flip one at a time
- Maximum two cards can be flipped at once
- Cards remain face up if matched
- Cards flip back if not matched
- Matched cards are disabled

### 3. Level Progression

- Level completion detection
- Level progression modal
- Grid layout adjustment
- Card count increase
- Persistent level state
- Automatic game start on level progression
- Option to restart from level 1

### 4. Victory Celebration

- Fireworks effect triggers on completion
- Modal displays completion message
- Level progression option
- High score update
- Option to start new game
- Automatic game start for next level

### 5. Reset Functionality

- Resets all game elements
- Clears timer
- Resets move counter
- Reshuffles cards
- Returns to initial state
- Maintains current level
- Requires manual game start after reset

## Animations and Transitions

- Card flip animation (0.6s)
- Card match animation (0.3s)
- Firework particle animation (1-1.5s)
- Grid layout transition
- Smooth opacity transitions
- Button state transitions

## Performance Considerations

- Efficient particle system for fireworks
- Optimized animations using transform
- Minimal DOM updates
- Efficient state management
- Responsive grid calculations

## Accessibility

- Keyboard navigation support
- ARIA labels for interactive elements
- High contrast color scheme
- Clear visual feedback
- Screen reader compatibility

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback for older browsers
- Progressive enhancement approach
