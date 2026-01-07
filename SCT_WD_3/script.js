const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const winLine = document.getElementById("winLine");
const mode = document.getElementById("mode");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

const patterns = [
    { combo: [0,1,2], line: "row-0" },
    { combo: [3,4,5], line: "row-1" },
    { combo: [6,7,8], line: "row-2" },

    { combo: [0,3,6], line: "col-0" },
    { combo: [1,4,7], line: "col-1" },
    { combo: [2,5,8], line: "col-2" },

    { combo: [0,4,8], line: "diag-0" },
    { combo: [2,4,6], line: "diag-1" }
];

cells.forEach(cell => cell.onclick = () => handleClick(cell));

function handleClick(cell) {
    const i = cell.dataset.i;

    if (!gameActive || board[i]) return;

    playMove(i, currentPlayer);

    if (checkWin(currentPlayer)) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (board.every(v => v)) {
        statusText.textContent = "Draw! Starting next round...";
        setTimeout(resetBoardOnly, 1200);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (mode.value === "ai" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function playMove(i, player) {
    board[i] = player;
    cells[i].textContent = player;
}

function computerMove() {
    if (!gameActive) return;

    const empty = board
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    const choice = empty[Math.floor(Math.random() * empty.length)];
    playMove(choice, "O");

    if (checkWin("O")) {
        statusText.textContent = "Computer wins!";
        gameActive = false;
        return;
    }

    if (board.every(v => v)) {
        statusText.textContent = "Draw! Starting next round...";
        setTimeout(resetBoardOnly, 1200);
        return;
    }

    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
}

function checkWin(player) {
    for (let p of patterns) {
        if (p.combo.every(i => board[i] === player)) {
            winLine.className = `win-line ${p.line}`;
            return true;
        }
    }
    return false;
}

function resetBoardOnly() {
    board.fill("");
    cells.forEach(c => c.textContent = "");
    winLine.className = "win-line";
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";
}

function resetGame() {
    resetBoardOnly();
}
