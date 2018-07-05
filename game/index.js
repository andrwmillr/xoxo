import {Map} from 'immutable'
let board = Map()

const move = (player, position) => {
  return { type: 'MOVE', player: player, position: position }
}

export default function reducer(state, action) {
  switch(action.type) {
    case 'START':
      return { board, turn: 'X' }
    case 'MOVE':
      if (action.player === 'X') {
        board.setIn(action.position, action.player)
        return { board, turn: 'O' }
      }
      else return { board, turn: 'X' }
  }
}
