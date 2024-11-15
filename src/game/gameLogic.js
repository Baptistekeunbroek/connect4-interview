const { resolve } = require("path");
const readline = require("readline");
let currentPlayer = "X";
let gameTable = [];
let columns = 0;
let rows = 0;
let columnLabels = [];

async function play() {
  await createTable();
  playerMove();
}

async function createTable() {
  return new Promise((resolve) => {
    rl.question(
      "Do you want to play Connect4 or Connect5? (4/5) ",
      (answer) => {
        if (answer === "4") {
          gameTable = [];
          columns = 7;
          rows = 6;
          columnLabels = ["1", "2", "3", "4", "5", "6", "7"];
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
          resolve();
        } else if (answer === "5") {
          gameTable = [];
          columns = 9;
          rows = 6;
          columnLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
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
          resolve();
        }
      }
    );
  });
}

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

async function playerMove() {
  console.log(`It's ${currentPlayer}'s turn.`);
  await askPlayerActionType();
  displayTable();
  checkWinner();
  if (checkWinner()) {
    console.log(`Player ${currentPlayer} wins!`);
    rl.close();
    return;
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
        rl.question(
          "Do you want to use the Anvile Power? (y/n) ",
          (answer2) => {
            if (answer2 === "y") {
              resolve(anvil());
            } else {
              resolve(askPlayerTokenSpot());
            }
          }
        );
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
          gameTable[y - 1][x - 1] !== "."
        ) {
          gameTable[y - 1][x - 1] = ".";

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
          resolve(askPlayerPopOutSpot());
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

function anvil() {
  console.log(
    "You have won the anvil power up ! This removes all pieces below it when played, leaving the Anvil at the bottom row of the board."
  );
  return new Promise((resolve) => {
    rl.question("Where do you want to place your anvil?(y x)", (answer) => {
      const [x, y] = answer.split(" ").map(Number);
      if (
        !isNaN(x) &&
        !isNaN(y) &&
        x >= 1 &&
        x <= columns &&
        y >= 1 &&
        y <= rows
      ) {
        gameTable[y - 1][x - 1] = "A";
        for (let i = y - 1; i < rows; i++) {
          console.log(i, "i");
          gameTable[i][x - 1] = gameTable[y - 1][x - 1];
          gameTable[i][x - 1] = ".";
          if (i === rows - 1) {
            gameTable[i][x - 1] = "A";
          }
        }
        console.log("Updated game table:");
        displayTable();
        resolve();
      } else {
        console.log("Invalid move");
        resolve(anvil());
      }
    });
  });
}

function checkWinner() {
  if ((rows === 6) & (columns === 7)) {
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
  } else if ((rows === 6) & (columns === 9)) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (gameTable[i][j] === currentPlayer) {
          if (
            gameTable[i][j + 1] === currentPlayer &&
            gameTable[i][j + 2] === currentPlayer &&
            gameTable[i][j + 3] === currentPlayer &&
            gameTable[i][j + 4] === currentPlayer
          ) {
            return true;
          }
          if (
            gameTable[i + 1][j] === currentPlayer &&
            gameTable[i + 2][j] === currentPlayer &&
            gameTable[i + 3][j] === currentPlayer &&
            gameTable[i + 4][j] === currentPlayer
          ) {
            return true;
          }
          if (
            gameTable[i + 1][j + 1] === currentPlayer &&
            gameTable[i + 2][j + 2] === currentPlayer &&
            gameTable[i + 3][j + 3] === currentPlayer &&
            gameTable[i + 4][j + 4] === currentPlayer
          ) {
            return true;
          }
          if (
            gameTable[i + 1][j - 1] === currentPlayer &&
            gameTable[i + 2][j - 2] === currentPlayer &&
            gameTable[i + 3][j - 3] === currentPlayer &&
            gameTable[i + 4][j - 4] === currentPlayer
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

module.exports = play;
