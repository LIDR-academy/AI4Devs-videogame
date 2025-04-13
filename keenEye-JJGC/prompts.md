# Cloude sonnet 3.7 - Cursor

## Prompt 1

I want you to be an expert Software Engineer with vast experience in gaming!

I want you to create a game from scratch:

- Name: Keen eye
- The game should be able to play it via browser
- Implement the best practices of software engineering
- Use the best practices of UX/UI design
- The game should be a 2D side game
- The game should have simple graphics but should be fun to play
- The game will display a timer 5 seconds, in the upper left corner
- The game will display a score, in the upper right corner
- The player should select the exact same image by clicking on it within the time limit
- The the images must be slightly different but with a lot of similarity
- The player can select only one image
- The game will display a base image, animated with a lot of details
  - For example, a monkey eating a banana with a hat on its head with a necktie
- The image will be in the center of the screen
- In a new row, the game will display three (2 slightly different, 1 exactly the same) more options of the same image in a grid of 3x1
- If the player selects the correct image, the score will increase by 1 and display an animation like a confetti, stars, etc.
- If the player selects the wrong image, the score will decrease by 1 and display an animation like a bomb, etc.
- The game will display this screen three times with different images
- Everytime the game displays a new set of images, an animation will play like a card flip
- At the end of the game, the game will display the final score
- The game will display a start screen with the game title and a button to start the game
- The game will display a game over screen with the final score and a button to start the game again
- Generate the images, feel free to use DALL-E 3 from OpenAI, for example.

## Prompt 2.

I need you to update the code and display the images on the `/img` folder

- For the first round display monkey\*.jpeg
- For the first round display panda\*.jpeg
- For the first round display croc\*.jpeg

where \* is 1,2 or 3

## Prompt 3

Ok, it's looking good
Only the first round is correct.
On the second and third step the images are not correct, they remind the same a the previous one

So if the main image is a Panda then display the right images (panda1.jpeg, panda2.jpeg and panda3.jpeg) so the user can select the same image

## Prompt 4

The images on the bottom are still not correct. Also the timer and images should be on the within screen height, no vertical scroll

## Prompt 5

Make the "Play again" button look as it was before, now it's full width.

The images are still not correct, they are not refreshed for the next round (2 and 3)

They look correct at the begining (round 1)

## Prompt 6

Now the main image on the second round it's not present. It was working before.

The images at the bottom are not working still!!!!

## Prompt 7

the image names are correct. HOWEVER THE IMAGES ARE NOT CORRECT!!! I DON'T SEE THEM

error in the console:

```
game.js:64 Uncaught (in promise) TypeError: Cannot set properties of null (setting 'src')
    at game.js:64:15
    at NodeList.forEach (<anonymous>)
    at Game.loadImages (game.js:62:18)
    at Game.startRound (game.js:55:16)
    at Game.startGame (game.js:39:16)
```

## Prompt 8

no!!!

```
game.js:71 Uncaught (in promise) TypeError: Cannot set properties of null (setting 'src')
    at game.js:71:15
    at NodeList.forEach (<anonymous>)
    at Game.loadImages (game.js:69:18)
    at Game.startRound (game.js:62:16)
    at Game.handleOptionClick (game.js:177:16)
```

## Prompt 9

no!!!

```
game.js:71 Uncaught (in promise) TypeError: Cannot set properties of null (setting 'src')
    at game.js:71:15
    at NodeList.forEach (<anonymous>)
    at Game.loadImages (game.js:69:18)
    at Game.startRound (game.js:62:16)
    at Game.handleOptionClick (game.js:177:16)
```

## Prompt 10

no, the duplicate images (the broken images) are still present.

Also, Once I select an image, the next image in the same position is not visible on the next round.

So if I select the image on the position 2 (on the first round) the new image on the position 2 is not visible (on the second round)

## Prompt 11

Ok, I don't see the duplicated images anymore and the image selection seems correct. However I still don't see all the images in the next round

## Prompt 20

Improve the confetti animation, I want it to be vissible in all the page!
