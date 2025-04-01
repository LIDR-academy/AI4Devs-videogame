# Prompts

## Prompt 1

@workspace Today we're going to build a simple board game for two players, Black and White. In the first version both players have to be humans sat in front of the same computer, taking turns, but in future development we can replace one of the players with a computer, and we can also imagine building a networked version where two humans sit in front of their own computers. The game play is simple. The board is an 8x8 grid, green felt with black lines. There are 64 tiles, flat, round, which are black on one side and white on the other. The players take turns placing the tiles on the board, according to rules which you can read in the README. Start by visualising the empty board. Use 3 output files: index.html for the markup, style.css for all styling, and logic.js for the game logic. If I need to start a web server to test this, let me know how and where.

## Prompt 2

The players will select where to put their pieces by clicking on the grid. Now add the logic for when the current player clicks on a square where they can make a valid move.

_We now have a working game board. The players can take turns placing their pieces on the board. Some edge cases are not covered yet.

## Prompt 3

The game works pretty well, but when I reach a situation where the current player has no valid move, I want the game to display "No valid moves for White! White forfeits their turn. Next move: Black" (or vice versa).

## Prompt 4

@workspace Great. Now handle the case where neither player has any valid moves.

_This prompt was rejected, or rather, the response was "filtered by the Responsible AI Service"._

## Prompt 5

Next case: if neither player has any valid moves, the game is over.

## Prompt 6

Add an option to play on a 6x6 or 10x10 board.  This option should only be available when the game starts, i.e. before any pieces have been played.

## Prompt 7

Don't display the board until the user has selected a size, and once they have selected a size, hide the size selector.

## Prompt 8

Make forfeital more visible. Instead of showing it in the text below the board, show a popup over the board, blocking gameplay until it has been acknowlegded.

## Prompt 9

When the game is over, make the winner's pieces glimmer like gold (if there is a winner).

## Prompt 10