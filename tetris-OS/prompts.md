Cursor and Claude 3.7-sonnet

**Prompt 1**:
you are a senior business analyst and also a senior game software engineer. You have a trong experience in tetris game and you know how to implement it from scratch. You will give me an overview of all the steps to perform to create a first MVP of this game. For each step you will briefly describe the professionals that are needed with their competencies to succeed for each step

**Prompt 2**:
Let's start with the first step:
You are now a senior game deigner, you will look into the original tetris and tey to mimic it as much as possible in term of game mechanics, scoring and difficulty progression
When this part will be done you will take the role of a business analyst and establish the MVP scope, the target audience and the success metrics

**Prompt 3**:
Now let's detail the architecture design:
You are now a senior software architect who will create the technical architecture, the component structure and the dataflow
Then you will be a tech lead who will take stack decisions considering performance requirements.

You will generate a file called 02_architecture_design.md in the folder @steps 

**Prompt 4**:
Now generate the file 03_core_game_engine.md where you are succesively:
1. a senior game engine developer who implements tetromino physics, collision detection and rotation logic
2. a senior graphics programmer that handles rendering and animation systems

**Prompt 5**:
now generate the file 04_UI_UX_design.md where you succesively are:
1. a senior UI/UX designer that creates intuitive interface and visual feedback systems
2. a senior graphic artist that design tetromino blocks, backgrounds and visual assets

**Prompt 6**:
now generate the file 04_UI_UX_design.md where you succesively are:
1. a senior UI/UX designer that creates intuitive interface and visual feedback systems
2. a senior graphic artist that design tetromino blocks, backgrounds and visual assets

**Prompt 7**:
Now you will use the repo @steps to implement the game in a repo called game. You are succesively:
1. a senior front end developer who builds responsive user interface and input handling
2. a senior backend developer who implements scoring system, state management and persistance if needed
In the new repo you can add as many files as you need to implement the game. When you have finished you write a tutorial on how to launch the game

==== DEBUGGING PART - USING THE MCP BROWSER-TOOLS ======
**Prompt 8 -start button issue**:
check at my actual selected item, the button has no corresponding action

**Prompt 9 -start button issue**:
I have rerun the game, check in the browser to understand the error

**Prompt 10 -start button issue**:
I have refresh and clicked again the start button.  Check the browser and find the bug origin. Then fix it

**Prompt 11 -start button issue**:
It still does not work. fix it

**Prompt 12 -start button issue**:
now there is an error in the console log fix it

**Prompt 13 -start button issue**:
refreshing the page I still have an issue in the console log, fix it

**Prompt 14 -start button issue**:
Now the layout is totally broken, check the browser and fix it

**Prompt 15 -start button issue**:
I have console errors, fix them. Ensure to fix just the strict  necessary, no more than that

**Prompt 16 -start button issue**:
Ok I have moved the all game from one location to another so check if paths need to be fix for the whole project. Then you have to fix the fact that there is no more error for the start button but it still does not happen anything

**Prompt 17 -start button issue**:
It now trigger an error in the console log. Fix  it

**Prompt 18 -start button issue**:
There are still errors in the console log. fix it

**Prompt 19 -start button issue**: (needed to start a new chat as the context was way too long)
You are a senior QA engineer and a senior software engineer with expertise in JS CSS and HTML. You will help me debugg my game @game by looking at the console log and console errors

**Prompt 20 -start button issue**:
Fix the issues you have encountered. Let's start with the first one on your list

**Prompt 21 -game-not-starting-issue**:
Now when I click on the start button I arrive to the next page but there are erros in the console. fix the bugs

**Prompt 21 -game-playing-issue**:
you are a senior QA engineer and a senior software engineer with a strong expertise in JS, CSS and HTML. Help me to debug my game @game looking at the console informations (logs, errors...).I have identified issues with left and right keys, they are not working. 

**Prompt 22 -game-playing-issue**:
There are 2 issues to fix that does not return an error: 
1. The game do not stop (no gameover) when it should, when the components arrive to the last line it should trigger gameover but it never happen
2. the next piece shown in the left handside is bigger than the box depending on the piece shown

**Prompt 23 -game-playing-issue**:
The gameover issue is handle. Nowas you can see in the image provided the piece does not fit the size of the box. Find a simple and straight forward solution

**Prompt 24 -game-playing-issue**:
It did noot work. Why not rotating the piece in the box as it happens only on 2 pieces, the bar and the L. It should solve the issue

**Prompt 25 -game-playing-new-feature**:
Now I want you to allow for the right arrow, left arrow and down arrow the following feature:
when the key stays pushed down, the movement must continue. Now when I keep the key down, nothing happen, I want the movement to go really fast in this case

**Prompt 26 -game-sound-background**:
Now I have added 3 files in the @assets folder. Each of them is a theme song for tetris to be played in background. I want you to update the following:
1. Add a options button in the home page of the game (same style as start but with different color)
2. this button open a new page of options
3. this option page contains a dropdown to choose in between these background theme (find an appropriate name for this dropdown)
4. It also as a check button to enable or disable the background sound
5. update all the parts of the code that are needed to make all these points working

**Prompt 27 -game-sound-background**:
Perfect, now the game paused window must also display the options button to be able to change the configuration

**Prompt 28 -game-sound-background**:
Now the behaviour that  has to be taken care of is that when I come from the paused window and I save my options configuration, I go back to the home page. I should go back then to the paused game menu. Fix that

**Prompt 29 -game-sound-background**:
You are a senior QA engineer and a senior software engineer with strong knowledge in JS, CSS and HTML. You are known to always implement the simpler solution and asking to perform other changes if you have seen the need to do so. In my game @game I have an issue with the options menu. When I open it from the game paused menu and I save my configuration it returns to the home page instead of returning to the game paused menu. Fix that

**Prompt 30 -game-sound-background**:
It did not work correctly. I go back to the game paused menu when I  cancel my configuration but if I save it I go back to the home page. fix it

**Prompt 31 -game-sound-background**:
It still does not work when I save my configuration. I have the same result

**Prompt 31 -cleaning code**:
Perfect. Now I want you to perform the following:
1. remove all the traceback in all the code
2. I will use only the theme sounds. All the other ones can be removed fro mthe code (rotate, move, drop, 
lineClear...) 

**Prompt 32 -cleaning code**:
look at the console log and remove all the remaining logs

