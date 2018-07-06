import inquirer from 'inquirer';
import {Map} from 'immutable'

import gameReducer from './game';
import { createStore } from 'redux';

import ai from './game/ai'

const ongoing = Map()
  .setIn([0, 0], 'O')
  .setIn([1, 0], 'X')
  .setIn([0, 1], 'O')

const ongoingState = gameReducer.reducer({board: ongoing, turn: 'X', winner: null}, gameReducer.move('X', [1, 1]))

const possMoves = ai.moves(ongoingState.board)

console.log(ongoingState)

console.log('SCORES\n', possMoves, '\n', possMoves.map(move => ai.score(ongoingState, move)))

// console.log(ai.moves(ongoing))
// console.log(ongoing)

// const xWins = ongoing.setIn([0, 2], 'O');

const drawMap = ongoing
  .setIn([0, 2], 'X')
  .setIn([1, 1], 'X')
  .setIn([1, 2], 'O')
  .setIn([2, 0], ')')
  .setIn([2, 1], 'O')
  .setIn([2, 2], 'X')

// console.log(drawMap)

// console.log(gameReducer.winner(drawMap))

// console.log('null?', gameReducer.winner(ongoing));
// console.log('O?', gameReducer.winner(xWins));
// console.log('X?', gameReducer.winner(oWins));

const printBoard = () => {
  const gameState = game.getState();
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(gameState.board.getIn([r, c], '_'));
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

// const aiMove = (player) => {
//   game.dispatch(gameReducer.move(player, ai.chooseMove(game.getState())))
// }

const game = createStore(gameReducer.reducer);

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
game.subscribe(() => {
  if (game.getState().error) console.log(game.getState().error)
})

game.dispatch({ type: 'START' });
