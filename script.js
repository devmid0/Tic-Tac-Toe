"use strict";

const ContainerEl = document.querySelector(".container");
const playerTxt = document.querySelector(".message");
const restartBtn = document.getElementById("restartbtn");
const boxes = document.querySelectorAll(".box");
const difficultySelector = document.getElementById("difficulty");

const O_TXT = "O";
const X_TXT = "X";

let currentPlayer = X_TXT;
let spaces = Array(9).fill(null);
let difficulty = 'normal';

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
  difficultySelector.addEventListener("change", () => difficulty = difficultySelector.value);
};

function boxClicked(e) {
  const id = e.target.id;

  if (!spaces[id] && currentPlayer === X_TXT) {
    spaces[id] = X_TXT;
    e.target.innerText = X_TXT;
    
    if (playerHasWon()) {
      endGame(`Congratulations Player ${X_TXT}`);
      return;
    } else if (spaces.every(space => space)) { // Check for draw
      endGame("It's a Draw!");
      return;
    }
    
    currentPlayer = O_TXT;
    setTimeout(aiPlay, 500)
  }
}

function aiPlay() {
  const emptyBoxes = spaces.map((space, index) => space === null ? index : null).filter(index => index !== null);
  if (emptyBoxes.length === 0) return;

  let move;
  switch (difficulty) {
    case 'easy':
      move = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
      break;
    case 'normal':
      move = getBestMoveNormal();
      break;
  }
  
  spaces[move] = O_TXT;
  boxes[move].innerText = O_TXT;
  
  if (playerHasWon()) {
    endGame(`Congratulations Player ${O_TXT}`);
  } else if (spaces.every(space => space)) { // Check for draw
    endGame("It's a Draw!");
  } else {
    currentPlayer = X_TXT;
  }
}

function getBestMoveNormal() {
  // Basic logic for Normal difficulty
  let move = getBlockingMove();
  if (move === -1) {
    move = spaces.findIndex(space => space === null);
  }
  return move;
}

function getBestMoveHard() {
  return minimaxDecision();
}

function getBlockingMove() {
  for (const condition of winingCombination) {
    const [a, b, c] = condition;
    const line = [spaces[a], spaces[b], spaces[c]];
    if (line.filter(value => value === X_TXT).length === 2 && line.includes(null)) {
      return line.indexOf(null) === 0 ? a : line.indexOf(null) === 1 ? b : c;
    }
  }
  return -1;
}

function minimaxDecision() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < spaces.length; i++) {
    if (spaces[i] === null) {
      spaces[i] = O_TXT;
      let score = minimax(false);
      spaces[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(isMaximizing) {
  let winner = playerHasWon();
  if (winner) {
    return winner[0] === O_TXT ? 10 : -10;
  } else if (spaces.every(space => space !== null)) {
    return 0;
  }
  
  let bestScore = isMaximizing ? -Infinity : Infinity;
  for (let i = 0; i < spaces.length; i++) {
    if (spaces[i] === null) {
      spaces[i] = isMaximizing ? O_TXT : X_TXT;
      let score = minimax(!isMaximizing);
      spaces[i] = null;
      bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }
  }
  return bestScore;
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