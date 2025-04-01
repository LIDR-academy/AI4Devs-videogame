# Flood-Fill Game Development Prompts

## Prompt 1

- Explain to me this codebase, specially understand the assignment from the @README.md

## Prompt 2

- Create a small PRD, save the content in the file @PRD.md
- I want to create a puzzle game called: Food-Fill
- The target audience is indie gamers using a webbrowser
- This is both a Challenge and an educational research
- The app should be built using vanilla js, at least great part of this, keeping the best practices for a javascript product, it should be simple but still should include SOLID principles and OWASP best principles, it will be running on web browsers, mostly new browsers but with some compatibility for old browsers (not that old like IE7), the code should not be compiled.
- The basic features of a Flood-fill game (if you have suggestions you can ask me for confirmation), it should include a local scoreboard
- Let's not include deep time specifications on the PRD, it should be simple enough to understand the product and to share it with people interested
- The visual preferences should feel like 8-bit indie games, i can provide you further assets later

## Prompt 3

### Role
You are an expert product manager, specialized in the creation of web based games

### Objective

Create a small PRD, save the content in the file @PRD.md 

### Feedback

Ask me any questions needed to create the PRD

## Prompt 4

1. I want to create a puzzle game called: Food-Fill

2. The target audience is indie gamers using a webbrowser

3. This is both a Challenge and an educational research

4. The app should be built using vanilla js, at least great part of this, keeping the best practices for a javascript product, it should be simple but still should include SOLID principles and OWASP best principles, it will be running on web browsers, mostly new browsers but with some compatibility for old browsers (not that old like IE7), the code should not be compiled.

5. The basic features of a Flood-fill game (if you have suggestions you can ask me for confirmation), it should include a local scoreboard

6. Let's not include deep time specifications on the PRD, it should be simple enough to understand the product and to share it with people interested

7. The visual preferences should feel like 8-bit indie games, i can provide you further assets later

Ask me the questions you have from this

## Prompt 5

1. Yes, classic flood-fill, given a n x n board of tiles where each tile is given one of m colors, each tile is connected to four adjancent tiles, a tile is connected to the origin (tie tile in the upper left corner) so the flood will start from the origin, the goal of the game is to change all the tiles to the same color, preferably with the fewest number of moves possible

2. No dificulty levels by now

3. We should track both moves and time, but the moves have precedency on the importance

4. I got wrong the word food, is flood-fill

5. we should use both mouse and keyboard controls are supported

ask me more questions about this

## Prompt 6

1. Players can adjust this, but by default 10x10

2. Have a defualt colors, but can be configurable with a minimun of 4 colors and a max of 8

3. Is about minimizing moves

4. Yes, include animations

5. Yes, we will include audio for background music + movements

6. Just standard web accessibility

7. One single scoreboard, with fewest moves (if tie use time as the decisive factor)

## Prompt 7

Create the PRD with what we have discussed

## Prompt 8

Based on the @PRD.md create the game described, use the files @index.html, @script.js , and @style.css as the elements to create the videogame, ask me any questions if you need further clarification

## Prompt 9

Some clarifications:

1. Dont count as a move if the user clicks the current flooded color again
2. Animate progressively 
3. No diagonal tiles are taking in to account
4. No undo process for users
5. Store scores per grid size
6. Only store top 10

From your questions

1. Color pallete can be standard decided for you
2. Arrow keys
3. All elements that give the visual style
4. Left placeholders for adding the audio files later


## Prompt 10

The javascript failed since it was too big, i want us to address this problem separating the files and doing it one request per time:

These are the recommended files:

- GameEngine	Board state, move logic, flood-fill logic
- FloodAnimator	Handles async visual animation of filling
- UIController	Color buttons, event listeners, visual updates
- ScoreManager	LocalStorage, sorting, filtering by grid size
- GameTimer	Start/stop/reset logic with Date.now() deltas
- SettingsManager	Grid size, color count, audio toggles
- AudioController	Load and play sound effects/music
- AccessibilityService	Tab index, ARIA labels, focus feedback

All in separate js files

## Prompt 11

The game looks amazing, but the amount of moves used is not being updated every time i use it

## Prompt 12

I've included an asset called @wizard.png , i want it you to animated in the first tile of the game, so it can look like he's paiting the process

Ask me any questions about this

## Prompt 13

1. It should always stay on the origin (0,0)

2. Bobbing up and down

3. At all times

4. sparkles

## Prompt 14

The wizard is not appearing, just some sparks at the center of the game

## Prompt 15

The problem was with the provided asset, update the changes to include the asset, making it animated

## Prompt 16

It's looking good, 2 tweaks, make the borders of the tiles black instead of white, and update the colors to use Resurrect 64 pallete

## Prompt 17

There's problems on the borders when the tiles together on the x axis are the same color

## Prompt 18

Include a legend of how to use the keyboard for playing

## Prompt 19

When using the arrow keys for playing the game, they are also triggering a page navigation action, remove that so they only work for the game itself and not for the navigation of the page

## Prompt 20

Awesome, now tell me which audio assets i need to include, what filename should they have and where i need to locate them for you to find them

## Prompt 21

The move and select sound are basically the same

## Prompt 22

No background sound is working

## Prompt 23

Help me creating assets for this game:

I want it to be 8-pixel indie game style

1. A player that will be animated
2. A Tiny wizard/painter

## Prompt 24

Based on what you know, recommend me audio assets

├── audio/
│   ├── click.mp3
│   ├── win.mp3
│   └── music.mp3

## Prompt 25

Help me convert them from ogg and wav to mp3