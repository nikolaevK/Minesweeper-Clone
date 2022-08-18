import {
  Square_Statuses,
  createBoard,
  markSquare,
  revealSquare,
  checkWin,
  checkLose,
} from "./logic.js";

const Mines_input = document.querySelector(".input-form");
const form = document.querySelector(".form");
const playAgainBtn = document.querySelector(".play-again-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("hide-form");
  const number = Mines_input.value;

  const Board_Size = 10;
  const Number_Of_Mines = number;

  const messageText = document.querySelector("[data-subtext]");
  messageText.classList.add("subtext");
  // load-subtext loads message on click
  messageText.classList.add("load-subtext");
  const minesLeftText = document.querySelector("[data-mine-count]");
  minesLeftText.textContent = Number_Of_Mines;

  const board = createBoard(Board_Size, Number_Of_Mines);
  const boardElement = document.querySelector(".board");
  // load-toggle shows elements on click after amount of mines chosen
  boardElement.classList.add("load-toggle");
  // Assigning the property to the board for css grid to work
  boardElement.style.setProperty("--size", Board_Size);

  // Loops through the array that comes from logic and renders squares
  board.forEach((row) => {
    row.forEach((square) => {
      boardElement.appendChild(square.squareElement);
      square.squareElement.addEventListener("click", () => {
        revealSquare(board, square);
        checkGameEnd();
      });
      square.squareElement.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        markSquare(square);
        listMinesLeft();
      });
    });
  });

  function listMinesLeft() {
    const markedSquaresCount = board.reduce((count, row) => {
      return (
        count +
        row.filter((square) => square.status === Square_Statuses.Marked).length
      );
    }, 0);

    minesLeftText.textContent = Number_Of_Mines - markedSquaresCount;
  }

  function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
      boardElement.addEventListener("click", stopProp, { capture: true });
      boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }

    if (win) {
      messageText.textContent = "You Win!";
      playAgainBtn.classList.add("play-again-loaded");
      playAgain();
    }
    if (lose) {
      messageText.textContent = "Game Over!";

      board.forEach((row) => {
        row.forEach((square) => {
          if (square.status === Square_Statuses.Marked) markSquare(square);
          if (square.mine) revealSquare(board, square);
        });
      });
      playAgainBtn.classList.add("play-again-loaded");
      playAgain();
    }
  }

  function stopProp(e) {
    e.stopImmediatePropagation();
  }

  function playAgain() {
    playAgainBtn.addEventListener("click", () => {
      location.reload();
    });
  }

  Mines_input.value = "";
});
