import { useReducer, useState } from "react"

const SIZE = 3

const PLAYERS_CURSOR = ["X", "O"]

function createBoard(boardSize) {
  const board = []
  let columnItering = 0
  for (let i = 0; i < boardSize * boardSize; i++) {
    if (i > 0 && i % boardSize === 0) {
      ++columnItering
    }

    board[columnItering] ??= []
    board[columnItering].push(i)
  }

  return board
}

function checkPlayerWon(state) {
  return [false]
}

function getCellValue(state, { rowIndex, cellIndex }) {
  return state.board[rowIndex][cellIndex]
}

function cellIsTaken(value) {
  return typeof value === "string"
}

function takeCell(state, { onTakeCell, ...payload }) {
  const { rowIndex, cellIndex } = payload
  const [currentPlayerCursor, ...nextPlayers] = state.playerCursors
  state.board[rowIndex][cellIndex] = currentPlayerCursor
  state.playerCursors = [...nextPlayers, currentPlayerCursor]
  onTakeCell(state, payload)
  return state
}

function reducerTicTacToe(state, payload) {
  switch (payload.action) {
    case "user-clicked-cell":
      const { onTakenCellClick, onTakeCell } = payload
      const currentPlayerCursor = state.getCurrentPlayer()
      const [playerWon] = checkPlayerWon(state)
      if (playerWon) {
      }
      const cellValue = getCellValue(state, payload)
      const cellTaken = cellIsTaken(cellValue)
      if (cellTaken) {
        onTakenCellClick(cellValue, currentPlayerCursor)
        break
      }
      onTakeCell(state, payload)
      takeCell(state, payload)
  }

  return { ...state }
}

export function Board() {
  const [game, dispatch] = useReducer(reducerTicTacToe, {
    board: createBoard(SIZE),
    playerCursors: PLAYERS_CURSOR,
    getCurrentPlayer() {
      return this.playerCursors[0]
    },
  })
  const [message, setMessage] = useState(null)

  return (
    <>
      <span>Current player: {game.getCurrentPlayer()}</span>
      {game.board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, cellIndex) => (
            <button
              key={`${rowIndex}-${cellIndex}`}
              onClick={() =>
                dispatch({
                  action: "user-clicked-cell",
                  cellIndex,
                  rowIndex,
                  onTakeCell(state, { rowIndex, cellIndex }) {
                    setMessage(`${state.getCurrentPlayer()} tomou a célula [${rowIndex}, ${cellIndex}]`)
                  },
                  onTakenCellClick(playerWhoTake, currentPlayer) {
                    setMessage(
                      `Célula já tomada ${currentPlayer === playerWhoTake ? "por você" : `pelo player ${playerWhoTake}`}`
                    )
                  },
                })
              }
              className="flex h-10 w-10 border border-black"
            >
              {typeof cell === "string" && cell}
            </button>
          ))}
        </div>
      ))}
      {message}
    </>
  )
}
