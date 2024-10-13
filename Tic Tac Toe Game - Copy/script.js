const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const gameResultModal = document.getElementById('gameResultModal');
const modalMessage = document.getElementById('modalMessage');

let currentPlayer = 'X';  // Player is always X
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let isComputerTurn = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Cell click handler
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    // Prevent action if the cell is already taken or game is over or it's computer's turn
    if (board[index] !== '' || isGameOver || isComputerTurn) {
        return;
    }

    // Player's move as 'X'
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    checkResult();

    if (isGameOver) {
        return;
    }

    // Update the status to "Computer's turn"
    statusMessage.textContent = "Computer's turn...";
    isComputerTurn = true;  // Indicate that it's now the computer's turn

    setTimeout(computerMove, 500);  // Delay for the computer move
}

// Computer's move using the Minimax algorithm
function computerMove() {
    if (isGameOver) {
        return;  // Stop if the game is already over
    }

    // Set the current player to 'O' (Computer)
    currentPlayer = 'O';

    const bestMove = findBestMove();
    board[bestMove] = 'O';  // Update the board with computer's move
    cells[bestMove].textContent = 'O';  // Update the UI to show the move

    // Check result after the computer's move
    checkResult();

    if (!isGameOver) {
        // Switch back to player after computer's move
        currentPlayer = 'X';  // Player's turn
        statusMessage.textContent = `Player ${currentPlayer}'s turn`;
        isComputerTurn = false; // It's now the player's turn again
    }
}

// Check for win or draw
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        // Determine who won: player or computer
        if (currentPlayer === 'X') {
            showModal("Player X wins!");  // Show modal for player win
        } else if (currentPlayer === 'O') {
            showModal("Computer wins! 🤖");  // Show modal for computer win
        }
        isGameOver = true;
        isComputerTurn = false;
        return;
    }

    if (!board.includes('')) {
        showModal("It's a draw! 🤝");  // Show modal for draw
        isGameOver = true;
        isComputerTurn = false;
    }
}

// Function to display the modal with a message
function showModal(message) {
    modalMessage.textContent = message;
    gameResultModal.style.display = 'block';  // Show the modal

    // Restart the game after 2 seconds
    setTimeout(restartGame, 2000);  // 2000 milliseconds = 2 seconds
}

// Minimax algorithm to find the best move
function minimax(board, depth, isMaximizing) {
    const score = evaluate(board);

    if (score === 10 || score === -10) {
        return score;
    }

    if (!board.includes('')) {
        return 0; // No moves left, it's a draw
    }

    if (isMaximizing) {
        let best = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // Try the move for the computer
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = ''; // Undo the move
            }
        }
        return best;
    } else {
        let best = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Try the move for the player
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = ''; // Undo the move
            }
        }
        return best;
    }
}

// Evaluate the board state
function evaluate(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === b && b === c) {
            if (a === 'O') {
                return 10; // Computer wins
            } else if (a === 'X') {
                return -10; // Player wins
            }
        }
    }
    return 0; // No winner
}

// Find the best move using Minimax
function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // Try the move for the computer
            let moveVal = minimax(board, 0, false);
            board[i] = ''; // Undo the move

            if (moveVal > bestVal) {
                bestMove = i; // Update the best move
                bestVal = moveVal;
            }
        }
    }
    return bestMove; // Return the best move found
}

// Restart the game
function restartGame() {
    gameResultModal.style.display = 'none'; // Hide the modal when restarting the game
    currentPlayer = 'X';  // Player is always X
    board = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    isComputerTurn = false;
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = '';
    });
}

// Initialize game board
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

statusMessage.textContent = `Player ${currentPlayer}'s turn`;

