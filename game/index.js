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

const winner = function (thisBoard) {
  if (streak(thisBoard, [[0, 0], [1, 1], [2, 2]])) {
    return streak(thisBoard, [[0, 0], [1, 1], [2, 2]]);
  }
  if (streak(thisBoard, [[0, 2], [1, 1], [2, 0]])) {
    return streak(thisBoard, [[0, 2], [1, 1], [2, 0]]);
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
    }
  });

  if (result) {
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
  switch (action.type) {
    case 'START':
      return 'X';
    case 'MOVE':
      if (action.player === 'X') return 'O';
      else return 'X';
    default:
      return state.turn;
  }
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE':
      const nextBoard = state.board.setIn(action.position, action.player);
      return nextBoard;
    default:
      return state.board;
  }
};

const reducer = (state = {board: board}, action) => {
  const error = bad(state, action)
  if (error) {
    // console.log(error)
    return { ...state, error }
  }
  return {
    board: boardReducer(state, action),
    turn: turnReducer(state, action),
    winner: winner(boardReducer(state, action)),
  };
};

const bad = (state, action) => {
  if (action.type === 'MOVE') {
      if (action.position.length !== 2) {
        return 'ERROR: position is not a 2 element array.';
      }
      if (state.board.hasIn(action.position)) {
        return `ERROR: position ${action.position} is already filled.`;
      }
      const posArr = action.position
      if (posArr[0] < 0 || posArr[0] > 2 || posArr[1] < 0 || posArr[1] > 2) {
        return 'ERROR: invalid input! Please input numbers between 0 and 2.'
      }
  }
  return null
};

module.exports = { reducer, move, winner, streak };
