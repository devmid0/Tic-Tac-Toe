"use strict";

const ContainerEl = document.querySelector(".container");
const playerTxt = document.querySelector(".message");
const restartBtn = document.getElementById("restartbtn");
const boxes = document.querySelectorAll(".box");

const O_TXT = "O";
const X_TXT = "X";

let currentPlayer = X_TXT;
let spaces = Array(9).fill(null);

const winingCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Start the game
const startGame = () => {
  boxes.forEach(box => box.addEventListener("click", boxClicked));
};

function boxClicked(e) {
  const id = e.target.id;

  if (!spaces[id] && currentPlayer) {
    spaces[id] = currentPlayer;
    e.target.innerText = currentPlayer;
    
    if (playerHasWon()) {
      endGame(`Congratulations Player ${currentPlayer}`);
      return;
    } else if (spaces.every(space => space)) { // Check for draw
      endGame("It's a Draw!");
      return;
    }
    
    currentPlayer = currentPlayer === X_TXT ? O_TXT : X_TXT;
  }
}

function playerHasWon() {
  for (const condition of winingCombination) {
    const [a, b, c] = condition;
    if (spaces[a] && spaces[a] === spaces[b] && spaces[a] === spaces[c]) {
      return [a, b, c];
    }
  }
  return false;
}

function endGame(message) {
  playerTxt.innerHTML = `<h2 class="message">${message}</h2>`;
  boxes.forEach(box => box.style.backgroundColor = "#f4d03f");
  ContainerEl.classList.add("success");
  boxes.forEach(box => box.removeEventListener("click", boxClicked));
}

restartBtn.addEventListener("click", restartGame);

function restartGame() {
  spaces.fill(null);
  boxes.forEach(box => {
    box.innerHTML = "";
    box.style.backgroundColor = "";
  });
  playerTxt.innerHTML = "Tic Tac Toe";
  currentPlayer = X_TXT;
  ContainerEl.classList.remove("success");
  startGame();
}

startGame();
