export const Square_Statuses = {
  Hidden: "hidden",
  Mine: "mine",
  Number: "number",
  Marked: "marked",
};

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const squareElement = document.createElement("div");
      // setting default status on each square element
      squareElement.dataset.status = Square_Statuses.Hidden;

      const square = {
        squareElement,
        x,
        y,
        // return true if position of this square is same as random mines position
        mine: minePositions.some((p) => positionMatch(p, { x, y })),
        // function to return status of a particular squareElement
        get status() {
          return this.squareElement.dataset.status;
        },
        // function to set status of a particular squareElement
        set status(value) {
          this.squareElement.dataset.status = value;
        },
      };
      row.push(square);
    }
    board.push(row);
  }

  // Returns each row as array with array of 2 divs
  return board;
}

export function revealSquare(board, square) {
  // If square is not hidden then exit
  if (square.status !== Square_Statuses.Hidden) {
    return;
  }

  if (square.mine) {
    square.status = Square_Statuses.Mine;
    return;
  }

  square.status = Square_Statuses.Number;

  // nearbyTiles return array of adjacent squares
  const adjacentSquares = nearbyTiles(board, square);
  // Checks if one of the squares in adjacentSquares array is a mine (true/false)
  const mines = adjacentSquares.filter((square) => square.mine);
  if (mines.length === 0) {
    // No mines in AdjacentSquares array
    // Recursively revealing adjacent squares without mines
    adjacentSquares.forEach((element) => revealSquare(board, element));
  } else {
    // AdjacentSquares array has mines in it
    // There are 1 or more mines, the clicked square shows the number of mines in adjacentSquares array
    square.squareElement.textContent = mines.length;
  }
}

export function markSquare(square) {
  // if status is not hidden or marked exit
  if (
    square.status !== Square_Statuses.Hidden &&
    square.status !== Square_Statuses.Marked
  ) {
    return;
  }
  // unmark or mark a square
  if (square.status === Square_Statuses.Marked) {
    square.status = Square_Statuses.Hidden;
  } else {
    square.status = Square_Statuses.Marked;
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((square) => {
      return (
        square.status === Square_Statuses.Number ||
        (square.mine &&
          (square.status === Square_Statuses.Hidden ||
            square.status === Square_Statuses.Marked))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((square) => square.status === Square_Statuses.Mine);
  });
}

// Creating random positions for mines
function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    // Function compares positions and makes sure individual mine has no overlapping positions
    // Runs while loop until individual positions found
    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { x, y }) {
  const squares = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    //Row number
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      if (xOffset === 0 && yOffset === 0) {
        continue;
      }

      // individual square in a row
      const square = board[x + xOffset]?.[y + yOffset];
      if (square) squares.push(square);
    }
  }

  return squares;
}
