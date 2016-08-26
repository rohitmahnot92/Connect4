# Connect4
Connect 4 is a two-player connection game in which the players first choose a color and then take turns dropping colored discs from the top into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the next available space within the column. The objective of the game is to connect four of one's own discs of the same color next to each other vertically, horizontally, or diagonally before your opponent. Connect Four is a strongly solved game. The first player can always win by playing the right moves.

Challenges:

 The major challenge I faced was after after setting up the grid, in coming up with the end game logic. Initially, I decided to take a mathematical approach, where I added the x,y coordinates of the disc, and stored them in two separate arrays for the respective players. Then, sorting this array, and chacking for 4 same x values, having 4 consecutive corresponding y values would result in a win(and vice versa). For example, [[3,4],[3,5],[3,6],[3,7]], would connect 4. Furthermore, for the diagnols, I sorted the sum & difference of the coordinates(x+y and x-y), and then performed the same check. The logic was consistent, but the use of so many loops and sorting functions led to a O(n^3).To make the program more efficient, I started approaching the problem from a different angle, where I used the position of the most recent disc, and started iterating in all different directions to check for 4 consecutive discs. The one above could be ruled out right away, leaving us with 7 different directions. Furthermore, excluding the bottom direction, the remaining 6 directions (2 sides,4 diagnoals) could further be split in half, leaving us with a total of 4 checks, and 0(n), making the program a lot more efficient. Therefore, I decided to proceed in this direction.

Improvements:

1. The first thing I would like to change is to make the UI independent of the game logic. Right now, the game depends on the dimensions of the grid (hard coded). Ideally, I would like to get the dimensions of the screeen using media queries, and define a standard grid based on the device used.

2. I would also like to add an 'Undo' button, giving the player an option to change his last move.

3. I would like to add some more animations:
a. Having the disc fall from top to the bottom-most available space, along with some sound effects.
b. Adding a plug at the bottom of the grid, which when pulled resets the game, making all the discs flush out from the bottom, just like the actual game.

4. Furthermore, I would like to add an option to play with the computer. For this, I would write an algorithm based on my own game style(intermediate level), and use DMGregory(expert level), where the computer always wins. 

5. Furthermore, the functions in the main file can be broken down into smaller files, making the code more organized and efficient.
