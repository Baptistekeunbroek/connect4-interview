const { resolve } = require("path");
const readline = require("readline");
let gameTable = [];
let columns = 7;
let rows = 6;
const columnLabels = ["1", "2", "3", "4", "5", "6", "7"];
let currentPlayer = "X";

function play() {
  createTable();
  playerMove();
}

async function createTable() {
  for (let i = 0; i < columns; i++) {
    gameTable[i] = ["1"];
    for (let j = 0; j < columns; j++) {
      gameTable[i][j] = ".";
    }
  }
  console.log("   " + columnLabels.join(" "));

  for (let i = 0; i < rows; i++) {
    console.log(`${i + 1}  ${gameTable[i].join(" ")}`);
  }
}

async function playerMove() {
  console.log(`It's ${currentPlayer}'s turn.`);
  await askPlayerActionType();
  displayTable();
  checkWinner();
  if (checkWinner()) {
    console.log(`Player ${currentPlayer} wins!`);
    rl.close();
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  playerMove();
}
function displayTable() {
  console.log("   " + columnLabels.join(" "));
  for (let i = 0; i < rows; i++) {
    console.log(`${i + 1}  ${gameTable[i].join(" ")}`);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askPlayerActionType() {
  return new Promise((resolve) => {
    rl.question("Do you want to Pop Out a token? (y/n) ", (answer) => {
      if (answer === "y") {
        resolve(askPlayerPopOutSpot());
      } else {
        resolve(askPlayerTokenSpot());
      }
    });
  });
}
function askPlayerPopOutSpot() {
  return new Promise((resolve) => {
    rl.question(
      "Which token do you want to Pop Out? (column,row) ",
      (answer) => {
        const [x, y] = answer.split(" ").map(Number);
        if (
          !isNaN(x) &&
          !isNaN(y) &&
          x >= 1 &&
          x <= columns &&
          y >= 1 &&
          y <= rows &&
          gameTable[y - 1][x - 1] !== currentPlayer
        ) {
          gameTable[y - 1][x - 1] = ".";

          // Shift tokens downward in the column
          for (let i = y - 1; i > 0; i--) {
            console.log(i, "i");
            gameTable[i][x - 1] = gameTable[i - 1][x - 1];
            gameTable[i - 1][x - 1] = ".";
          }

          console.log("Updated game table:");
          displayTable();
          resolve();
        } else {
          console.log("Invalid move. Please select a valid token.");
          resolve(askPlayerPopOutSpot()); // Retry if input is invalid
        }
      }
    );
  });
}

function askPlayerTokenSpot() {
  return new Promise((resolve) => {
    rl.question("Where do you want to place your token?(y x)", (answer) => {
      const [x, y] = answer.split(" ").map(Number);
      if (
        !isNaN(x) &&
        !isNaN(y) &&
        x >= 1 &&
        x <= columns &&
        y >= 1 &&
        y <= rows &&
        gameTable[y - 1][x - 1] === "."
      ) {
        gameTable[y - 1][x - 1] = currentPlayer;
        resolve();
      } else {
        console.log("Invalid move");
        resolve(askPlayerTokenSpot());
      }
    });
  });
}

function checkWinner() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (gameTable[i][j] === currentPlayer) {
        if (
          gameTable[i][j + 1] === currentPlayer &&
          gameTable[i][j + 2] === currentPlayer &&
          gameTable[i][j + 3] === currentPlayer
        ) {
          return true;
        }
        if (
          gameTable[i + 1][j] === currentPlayer &&
          gameTable[i + 2][j] === currentPlayer &&
          gameTable[i + 3][j] === currentPlayer
        ) {
          return true;
        }
        if (
          gameTable[i + 1][j + 1] === currentPlayer &&
          gameTable[i + 2][j + 2] === currentPlayer &&
          gameTable[i + 3][j + 3] === currentPlayer
        ) {
          return true;
        }
        if (
          gameTable[i + 1][j - 1] === currentPlayer &&
          gameTable[i + 2][j - 2] === currentPlayer &&
          gameTable[i + 3][j - 3] === currentPlayer
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

module.exports = play;
