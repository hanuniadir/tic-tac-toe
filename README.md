# Tic Tac Toe

This game was developed in React with Typescript.

You are play with the "X" and the AI is the "O".

## Architecture

In the project directory, you can run:

### `npm start`

[http://localhost:3000]

You need to enter your email address and Sign In.

There are some folder => 

- App - The main component and control which page you'll see (login/game)

- Login - The login form (valid email is required)

- Home - The Game board page - with 'Reset' and 'Help Me' buttons


I build it like this to manage effectively the assignment requirements.

For the board game I make a "flat array" it is more comfortable to control and match the places of the signs (X/O)

For the error option I used in function which recognize status 500 and update the state of "App" - like redirect to Login page.

Because a time issue, I didn't finish the "Suggest Move" fitcher. I built a function which try to send an opposite board to the AI machine, get a new board - like to ask the AI "what step would you take as X" but the AI probably can't response to opposite state, I assume the reason for that is the number of X-s and O-s.
Nevertheless, I keep this code in '//' for you could see and be impressed from the idea. In addition, I wrote a function that called 'markDiff' which is get two boards (Game board and AI board - after AI step), recognize the AI step, and mark this square in the game board.
You can try it by yourself on 'Help Me' button (It is always mark the top-right corner).
