import inquirer from 'inquirer';
import { Map } from 'immutable';

import gameReducer from './game';
import { createStore } from 'redux';

const ongoing = Map()
  .setIn([0, 0], 'O')
  .setIn([1, 0], 'X')
  .setIn([0, 1], 'O')
  .setIn([1, 1], 'X');

const xWins = ongoing.setIn([0, 2], 'O');

const oWins = ongoing
  .setIn([0, 0], 'X')
  .setIn([1, 1], 'X')
  .setIn([2, 2], 'X');

console.log('null?', gameReducer.winner(ongoing));
console.log('O?', gameReducer.winner(xWins));
console.log('X?', gameReducer.winner(oWins));

const printBoard = () => {
  const { board } = game.getState();
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], '_'));
    }
    process.stdout.write('\n');
  }
};

const getInput = player => async () => {
  const { turn } = game.getState();
  if (turn !== player) return;
  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'coord',
      message: `${turn}'s move (row,col):`,
    },
  ]);
  const [row = 0, col = 0] = ans.coord.split(/[,\s+]/).map(x => +x);
  game.dispatch(gameReducer.move(turn, [row, col]));
};

const printWinner = () => {
  const { board } = game.getState();
  return gameReducer.winner(board);
};

// Create the store
const game = createStore(gameReducer.reducer);

// Debug: Print the state
// game.subscribe(() => console.log(game.getState()))

game.subscribe(printBoard);
game.subscribe(() => game.getState());
game.subscribe(getInput('X'));
game.subscribe(getInput('O'));
game.subscribe(() => {
  if (game.getState().winner !== null) {
    console.log(game.getState().winner, 'is the winner!');
    process.exit(0);
  }
});
game.subscribe(printWinner);

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: 'START' });
