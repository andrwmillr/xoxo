import {Map} from 'immutable'
let board = Map()

const move = (player, position) => {
  return { type: 'MOVE', player: player, position: position }
}

const streak = (streakBoard, coords) => {
  let result = streakBoard.getIn(coords[0])
  if (result === '_') {
    return null
  }
  for (let i = 1; i < 3; i++) {
    if (streakBoard.getIn(coords[i]) !== result) {
      // console.log('coord', coords[i], 'getIn', streakBoard.getIn(coords[i]))
      return undefined
    }
  }
  return result
}

const winner = (thisBoard) => {
  if (streak(thisBoard, [[0, 0], [1, 1], [2, 2]])) {
    return streak(thisBoard, [[0, 0], [1, 1], [2, 2]])
  }
  if (streak(thisBoard, [[0, 2], [1, 1], [2, 0]])) {
    return streak(thisBoard, [[0, 0], [1, 1], [2, 2]])
  }

  let streakArr = []
  for (let i = 0; i < 3; i++) {
    let rowEl = []
    let colEl = []
    for (let j = 0; j < 3; j++) {
      rowEl.push([i, j])
      colEl.push([j, i])
    }
    streakArr.push(rowEl)
    streakArr.push(colEl)
  }

  streakArr.forEach(streakEl => {
    // console.log('got into forEach with', streakEl)
    // console.log(streak(thisBoard, streakEl))
    if (streak(thisBoard, streakEl)) {
      console.log('entered if block on streak', streakEl, streak(thisBoard, streakEl))
      return streak(thisBoard, streakEl)
    }
  })

  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      if (!thisBoard.hasIn([r, c])) {
        return null
      }
    }
  }
  return 'draw'
}


const reducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return { board, turn: 'X' }
    case 'MOVE':

      board = board.setIn(action.position, action.player)
      if (action.player === 'X') return { board, turn: 'O' }
      else return { board, turn: 'X' }
    default: return state
  }
}

module.exports = { reducer, move, winner, streak }
