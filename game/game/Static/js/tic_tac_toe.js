particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 }, image: { src: "img/github.svg", width: 100, height: 100 } },
    opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
    size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } },
  },
  retina_detect: true,
});

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    
    var timeString = hours + ":" + minutes + ":" + seconds;
    
    document.getElementById("clock").innerHTML = timeString;
}

setInterval(updateClock, 1000);

document.getElementById('returnIcon').addEventListener('click', function() {
    window.location.href = 'home/';
});

var returnIcon = document.getElementById('returnIcon');
returnIcon.addEventListener('mouseover', function() {
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = 'Return to home page';
    
    returnIcon.appendChild(tooltip);
});

returnIcon.addEventListener('mouseout', function() {
    var tooltip = returnIcon.querySelector('.tooltip');
    if (tooltip) {
        returnIcon.removeChild(tooltip);
    }
});

//game logic
let isGameRunning = true;
let isGameOver = false;
let currentPlayer = 1;
let cellState = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function cellClick(row, col) {
    if (cellState[row][col] !== 0) {
        return;
    }

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const svgSize = 80;

    if (currentPlayer === 1) {
        cell.innerHTML = `<svg class="circle" viewBox="0 0 100 100" width="${svgSize}" height="${svgSize}">
                            <circle cx="50" cy="50" r="40" fill="#3498db"></circle>
                          </svg>`;
        cellState[row][col] = 1;
    } else {
        cell.innerHTML = `<svg class="cross" viewBox="0 0 100 100" width="${svgSize}" height="${svgSize}">
                            <line x1="10" y1="10" x2="90" y2="90" stroke="#e74c3c" stroke-width="8"></line>
                            <line x1="90" y1="10" x2="10" y2="90" stroke="#e74c3c" stroke-width="8"></line>
                          </svg>`;
        cellState[row][col] = 2;
    }

    currentPlayer = 3 - currentPlayer;

    checkGameStatus();
}

function checkGameStatus() {

}

document.querySelectorAll('.cell').forEach(cell => {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    cell.addEventListener('click', () => cellClick(row, col));

    const cursorImage = (currentPlayer === 1) ? '{% static "img/cursor-up-left-svgrepo-com.svg"%}' : '{% static "img/cursor-up-left-svgrepo-com(1).svg"%}';
    cell.style.cursor = `url(${cursorImage}), auto`;
});

function checkForWinner() {
    for (let i = 0; i < 3; i++) {
        if (cellState[i][0] !== 0 && cellState[i][0] === cellState[i][1] && cellState[i][1] === cellState[i][2]) {
            return cellState[i][0];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (cellState[0][i] !== 0 && cellState[0][i] === cellState[1][i] && cellState[1][i] === cellState[2][i]) {
            return cellState[0][i];
        }
    }

    if (cellState[0][0] !== 0 && cellState[0][0] === cellState[1][1] && cellState[1][1] === cellState[2][2]) {
        return cellState[0][0];
    }

    if (cellState[0][2] !== 0 && cellState[0][2] === cellState[1][1] && cellState[1][1] === cellState[2][0]) {
        return cellState[0][2];
    }

    return 0;
}

function checkForDraw() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (cellState[i][j] === 0) {
                return false; 
            }
        }
    }
    return true;
}


function checkGameStatus() {
    const winner = checkForWinner();

    if (winner !== 0) {
        endGame(winner);
    } else if (checkForDraw()) {
        endGame(0);
    }
}

function endGame(winner) {
    const gameOverPopup = document.createElement('div');
    gameOverPopup.className = 'game-over-popup';

    const gameOverMessage = document.createElement('p');
    if (winner === 0) {
        gameOverMessage.innerText = 'It\'s a draw!';
    } else {
        gameOverMessage.innerText = `Player ${winner} wins!`;
        highlightWinningCells(winner);
    }
    gameOverPopup.appendChild(gameOverMessage);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const homeButton = document.createElement('button');
    homeButton.innerText = 'Home';
    homeButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    const playAgainButton = document.createElement('button');
    playAgainButton.innerText = 'Play Again';
    playAgainButton.addEventListener('click', () => {
        resetGame();
        removeWinningLines();
        document.body.removeChild(gameOverPopup);
    });

    const topScoreButton = document.createElement('button');
    topScoreButton.innerText = 'Top Score';
    topScoreButton.addEventListener('click', () => {
        window.location.href = '/top_scores/';
    });

    buttonsContainer.appendChild(homeButton);
    buttonsContainer.appendChild(playAgainButton);
    buttonsContainer.appendChild(topScoreButton);

    gameOverPopup.appendChild(buttonsContainer);

    document.body.appendChild(gameOverPopup);
    isGameRunning = false;
    isGameOver = true;
}

function highlightWinningCells(winner) {
    let winningCells = [];

    for (let i = 0; i < 3; i++) {
        if (cellState[i][0] === winner && cellState[i][1] === winner && cellState[i][2] === winner) {
            winningCells = [[i, 0], [i, 1], [i, 2]];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (cellState[0][i] === winner && cellState[1][i] === winner && cellState[2][i] === winner) {
            winningCells = [[0, i], [1, i], [2, i]];
        }
    }

    if (cellState[0][0] === winner && cellState[1][1] === winner && cellState[2][2] === winner) {
        winningCells = [[0, 0], [1, 1], [2, 2]];
    }

    if (cellState[0][2] === winner && cellState[1][1] === winner && cellState[2][0] === winner) {
        winningCells = [[0, 2], [1, 1], [2, 0]];
    }

    for (const [row, col] of winningCells) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        drawLineOnCell(cell, winner);
    }
}

function drawLineOnCell(cell, winner) {
    cell.classList.add('winning-cell', (winner === 1) ? 'player1' : 'player2');
}

function removeWinningLines() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('winning-cell', 'player1', 'player2');
    });
}

function resetGame() {

    isGameRunning = true;
    isGameOver = false;
    currentPlayer = 1;

    cellState = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
    });
}