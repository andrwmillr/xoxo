import {reducer, move} from '.'


// REWRITE THIS
const moves = board => {
  let possMoves = []
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      if (!board.hasIn([r, c])) {
        possMoves.push([r, c])
      }
    }
  }
  return possMoves
}

const score = (game, position) => {
  const newGame = reducer(game, move(game.turn, position))
  if (newGame.winner === game.turn) {
    return 1
  }
  if (newGame.winner === 'draw') {return 0}
  else {
    const oppMoves = moves(newGame.board)
    return -Math.max(...oppMoves.map(el => score(newGame, el)))
  }
}

const chooseMove = (state) => {
  const possMoves = moves(state.board)
  let bestScore = -2;
  let chosenMove;
  for (let i = 0; i < possMoves.length; i++) {
    if (score(state, possMoves[i]) > score) {
      bestScore = score(state, possMoves[i])
      chosenMove = possMoves[i]
    }
  }
  return chosenMove
}

module.exports = { moves, score, chooseMove }
