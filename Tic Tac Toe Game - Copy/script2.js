const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;

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

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (board[index] !== '' || isGameOver) {
        return;
    }

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;    

    checkResult();
    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;
}

function checkResult() {
    let roundWon = false;

    // Loop through all winning conditions
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

    const modal = document.getElementById('gameResultModal');
    const modalMessage = document.getElementById('modalMessage');

    if (roundWon) {
        statusMessage.textContent = `Player ${currentPlayer} wins!`;
        isGameOver = true;

        // Show modal with win message
        modalMessage.textContent = `Player ${currentPlayer} has won! 🥳`;
        modal.style.display = "block";  // Show the modal with animation

        // Close the modal and restart the game after 2 seconds
        setTimeout(() => {
            modal.style.animation = "fadeOut 1s forwards";  // Fade-out animation
            setTimeout(() => {
                modal.style.display = "none";  // Hide after fade-out completes
                restartGame();  // Restart the game after the modal closes
            }, 1000);
        }, 2000);  // Wait for 2 seconds before starting fade-out
        return;
    }

    if (!board.includes('')) {
        statusMessage.textContent = "It's a draw!";
        isGameOver = true;

        // Show modal with draw message
        modalMessage.textContent = "It's a draw! 🤝";
        modal.style.display = "block";  // Show the modal with animation

        // Close the modal and restart the game after 2 seconds
        setTimeout(() => {
            modal.style.animation = "fadeOut 1s forwards";  // Fade-out animation
            setTimeout(() => {
                modal.style.display = "none";  // Hide after fade-out completes
                restartGame();  // Restart the game after the modal closes
            }, 1000);
        }, 2000);  // Wait for 2 seconds before starting fade-out
        return;
    }
}

function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.animation = ''; // Reset animation style if needed
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

statusMessage.textContent = `Player ${currentPlayer}'s turn`;

