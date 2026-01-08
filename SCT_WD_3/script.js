const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const winLine = document.getElementById("winLine");
const mode = document.getElementById("mode");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

let startingPlayer = "X";

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

cells.forEach(cell =>
    cell.addEventListener("click", () => handleClick(cell))
);

function handleClick(cell) {
    const i = cell.dataset.i;

    if (!gameActive || board[i] !== "") return;

    makeMove(i, currentPlayer);

    if (checkWin(currentPlayer)) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "Draw! Starting next round...";
        setTimeout(resetBoardOnly, 1200);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();

    if (mode.value === "ai" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function computerMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, "O");

    if (checkWin("O")) {
        statusText.textContent = "Computer wins!";
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "Draw! Starting next round...";
        setTimeout(resetBoardOnly, 1200);
        return;
    }

    currentPlayer = "X";
    updateStatus();
}

function minimax(boardState, depth, isMaximizing) {
    if (checkWinnerForAI(boardState, "O")) return 10 - depth;
    if (checkWinnerForAI(boardState, "X")) return depth - 10;
    if (boardState.every(c => c !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "O";
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "X";
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForAI(boardState, player) {
    return patterns.some(p =>
        p.combo.every(i => boardState[i] === player)
    );
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

function isDraw() {
    return board.every(cell => cell !== "");
}

function resetBoardOnly() {
    board.fill("");
    cells.forEach(cell => cell.textContent = "");
    winLine.className = "win-line";
    gameActive = true;

    /* Alternate starting player */
    currentPlayer = startingPlayer;
    startingPlayer = startingPlayer === "X" ? "O" : "X";

    updateStatus();

    if (mode.value === "ai" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function resetGame() {
    startingPlayer = "X";
    resetBoardOnly();
}

function updateStatus() {
    if (mode.value === "ai" && currentPlayer === "O") {
        statusText.textContent = "Computer's turn";
    } else {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}
