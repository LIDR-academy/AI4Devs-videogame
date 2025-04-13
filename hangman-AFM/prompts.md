# Andres Felipe Marin - Hangman gamen

**IDE utilizado:** `Cursor en chat modo Agente con LLM auto`  
**Fecha de la conversación:** 2025-03-30


- Vamos a crear el juego del "ahorcado" o "hangman" utilizando únicamente html, css y javascript.  Para eso el primer paso es copiar la carpeta snake-EHS y a partir de esta crear una nueva con el nombre hangman-AFM

- Yes, please add the visual representation of the hangman

- We need to use a service where words can be loaded in order to be guessed

- Lets switch the api service to use a list of 100 common words in spanish

- ok, now lets make the game useful, the hangman does not to be drawn at first, but in every click of a letter if the letter is not included in the word that needs to be guessed a part of the hangman needs to be drawn and the letter needs to show a red mark in order to
   show that that letter is not included in the word, and when the letter actually is included in the word we need to show a green mark

- There error shows up in the console index.html:224 Uncaught SyntaxError: Failed to execute 'querySelector' on 'Document': '.key:contains('A')' is not a valid selector. at guessLetter (index.html:224:34) at HTMLButtonElement. (index.html:186:53)

- Lets do some changes, the gallows needs to be previosuly drawn, and with every click on every word the only element that is drawn is the man

- Now let's do some other fixes.  Let's follow this rule.  Generally, the game ends once the word is guessed, or if the stick figure is complete—signifying that all guesses have been used

- When the player loses, the man should be completed drawn before the alert

- Ok, now lets change the list of words, please use a list of 100 words commonly used in spanish but with a minimum length of 8 letters

- one final improvement, when the game restarts the score is not being reseted

- Ok, now lets change the list of words, please use a list of 100 words commonly used in spanish but with a minimum length of 6 letters, and no special characters