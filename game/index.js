import { Map } from 'immutable';
let board = Map();

const move = (player, position) => {
  return { type: 'MOVE', player: player, position: position };
};

const streak = (streakBoard, coords) => {
  let result = streakBoard.getIn(coords[0]);
  if (result === '_') {
    return null;
  }
  for (let i = 1; i < 3; i++) {
    if (streakBoard.getIn(coords[i]) !== result) {
      // console.log('coord', coords[i], 'getIn', streakBoard.getIn(coords[i]))
      return undefined;
    }
  }
  return result;
};

const winner = thisBoard => {
  if (streak(thisBoard, [[0, 0], [1, 1], [2, 2]])) {
    return streak(thisBoard, [[0, 0], [1, 1], [2, 2]]);
  }
  if (streak(thisBoard, [[0, 2], [1, 1], [2, 0]])) {
    return streak(thisBoard, [[0, 0], [1, 1], [2, 2]]);
  }

  let streakArr = [];
  for (let i = 0; i < 3; i++) {
    let rowEl = [];
    let colEl = [];
    for (let j = 0; j < 3; j++) {
      rowEl.push([i, j]);
      colEl.push([j, i]);
    }
    streakArr.push(rowEl);
    streakArr.push(colEl);
  }

  let result = undefined;
  streakArr.forEach(streakEl => {
    if (streak(thisBoard, streakEl)) {
      result = streak(thisBoard, streakEl);
      // let toReturn = streak(thisBoard, streakEl);
      return result;
    }
  });

  if (result !== undefined) {
    return result;
  }

  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      if (!thisBoard.hasIn([r, c])) {
        return null;
      }
    }
  }
  return 'draw';
};

const turnReducer = (state, action) => {
  let result = bad(state, action);
  console.log(result);
  switch (action.type) {
    case 'START':
      return 'X';
    case 'MOVE':
      if (action.player === 'X') return 'O';
      else return 'X';
    default:
      return state;
  }
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE':
      console.log('calling board.setIn');
      board = board.setIn(action.position, action.player);
      return board;
    default:
      return board;
  }
};

const reducer = (state, action) => {
  if (bad(state, action) === null) {
    board = boardReducer(state, action);
    let winningSymbol = winner(board);
    return {
      board,
      turn: turnReducer(state, action),
      winner: winningSymbol,
    };
  } else {
    console.log('hit error block');
    console.log(bad(state, action));
    return {
      ...state,
      error: bad(state, action),
    };
  }
};

const bad = (state, action) => {
  switch (action.type) {
    case 'START':
      return null;
    // if (action.player || action.position) {
    //   return 'Error, start function contains extra arguments';
    // }
    case 'MOVE':
      console.log('**** action', action.position);
      if (action.position.length !== 2) {
        return 'Error, position is not a 2 element array';
      } else if (board.getIn(action.position)) {
        console.log('current position: ', action.position);
        console.log(
          'getIn of current position: ',
          board.getIn(action.position)
        );
        return 'Error, position is already filled';
      }
      return null;
    default:
      return null;
  }
};

module.exports = { reducer, move, winner, streak };
