function setRandomPosition(fruit) {
    const container = document.querySelector('.game-container');
    const randomXPercent = Math.random() * 100;
    const randomYPercent = Math.random() * 100;


    fruit.style.position = 'absolute';
    fruit.style.left = `${randomXPercent}%`;
    fruit.style.top = `${randomYPercent}%`;
}

document.addEventListener("DOMContentLoaded", function () {
    let isGameOver = false;
    let isGameRunning = false;
    let isGamePaused = false;
    function sendScoreToBackend(playerName, score) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/save_score/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            player_name: playerName,
            score: score,
        }),
    });
}


    const fruits = document.querySelectorAll('.fruit');

    function eatFruit(fruit) {
        const points = parseInt(fruit.getAttribute('data-points'));
        const currentScore = parseInt(document.getElementById('score').innerText);

        document.getElementById('score').innerText = currentScore + points;

        setRandomPosition(fruit);
    }

    function expireBanana(banana) {
        banana.style.display = 'none';
    }

    fruits.forEach(fruit => {
        setRandomPosition(fruit);
    });

    fruits.forEach(fruit => {
        fruit.addEventListener('click', function () {
            const isBanana = fruit.classList.contains('banana');

            if (isBanana) {
                setTimeout(() => expireBanana(fruit), 10000);
            }

            eatFruit(fruit);
        });
    });

    const snakeContainer = document.querySelector('.snake-container');
    const container = document.querySelector('.game-container');


    let snakeDirectionX = 0;
    let snakeDirectionY = 0;
    let snakeSize = 5;
    const snakeSegments = [];

function createSnake() {
    snakeContainer.innerHTML = '';


    const initialX = Math.floor(container.clientWidth / 2);
    const initialY = Math.floor(container.clientHeight / 2);

    snakeSegments.length = 0; 

  
    const head = createSnakeSegment('👹', 'green', initialX, initialY);
    snakeSegments.push({ element: head, left: initialX, top: initialY });
    snakeContainer.appendChild(head);


    for (let i = 1; i < snakeSize; i++) {
        const bodySegment = createSnakeSegment('🔴', 'blue', initialX - i * 20, initialY);
        snakeSegments.push({ element: bodySegment, left: initialX - i * 20, top: initialY });
        snakeContainer.appendChild(bodySegment);
    }
}

function createSnakeSegment(text, color, left, top) {
    const segment = document.createElement('div');
    segment.className = 'snake-segment';
    segment.innerHTML = text;
    segment.style.color = color;
    segment.style.position = 'absolute';
    segment.style.left = `${left}px`;
    segment.style.top = `${top}px`;
    return segment;
}

function updateSnake() {
    for (let i = snakeSegments.length - 1; i > 0; i--) {
        snakeSegments[i].left = snakeSegments[i - 1].left;
        snakeSegments[i].top = snakeSegments[i - 1].top;
    }


    snakeSegments[0].left += snakeDirectionX;
    snakeSegments[0].top += snakeDirectionY;


    snakeSegments.forEach(segment => {
        const snakeSegment = segment.element;
        snakeSegment.style.left = `${segment.left}px`;
        snakeSegment.style.top = `${segment.top}px`;
    });
}

function checkCollisionWithFruits() {
    const head = snakeSegments[0];

    fruits.forEach(fruit => {
        if (isCollision(head.element, fruit)) {
            eatFruit(fruit);

            const tail = snakeSegments[snakeSegments.length - 1];
            const newSegment = createSnakeSegment('🔴', 'blue', tail.left, tail.top);
            snakeSegments.push({ element: newSegment, left: tail.left, top: tail.top });
            snakeContainer.appendChild(newSegment);
        }
    });
}

function moveSnake() {
        if (isGamePaused) {
        return;
    }
    console.log('Moving snake...');
    updateSnake();
    checkCollisionWithFruits();

    if (checkCollisionWithBorders() || checkCollisionWithItself()) {
        endGame();
    }
}


function isCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function checkCollisionWithBorders() {
    const head = snakeSegments[0].element;
    const containerRect = container.getBoundingClientRect();
    const headRect = head.getBoundingClientRect(); 

    if (
        headRect.left < containerRect.left ||
        headRect.right > containerRect.right ||
        headRect.top < containerRect.top ||
        headRect.bottom > containerRect.bottom
    ) {
        console.log('Collision with borders');
        return true;
    }

    return false;
}

function checkCollisionWithItself() {
    const head = snakeSegments[0];

    for (let i = 1; i < snakeSegments.length; i++) {
        const bodySegment = snakeSegments[i];

        if (head.left === bodySegment.left && head.top === bodySegment.top) {
            console.log('Collision with itself');
            return true;
        }
    }

    return false;
}

function endGame() {
    if (!isGameRunning) {
        return;
    }

    if (isGameOver) {
        return;
    }

    pauseGame();

    const playerName = document.getElementById('playerName').innerText;
    const score = parseInt(document.getElementById('score').innerText);

    sendScoreToBackend(playerName, score);

    const gameOverPopup = document.createElement('div');
    gameOverPopup.className = 'game-over-popup';

    const gameOverMessage = document.createElement('p');
    gameOverMessage.innerText = 'Game Over! Your snake collided with the borders or itself.';
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
        document.body.removeChild(gameOverPopup);
        resumeGame();
        createSnake();
        moveSnake();
        isGameRunning = true;
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

function resetGame() {
    snakeSize = 5;
    document.getElementById('score').innerText = '0';
    createSnake();
    isGameOver = false;
}

function handleKeyPress(event) {
        if (isGameOver || isGamePaused) {
            return;
        }
    const key = event.key.toLowerCase();

    switch (key) {
        case 'w':
            if (snakeDirectionY !== 20) {
                snakeDirectionX = 0;
                snakeDirectionY = -20;
            }
            break;
        case 's':
            if (snakeDirectionY !== -20) {
                snakeDirectionX = 0;
                snakeDirectionY = 20;
            }
            break;
        case 'a':
            if (snakeDirectionX !== 20) {
                snakeDirectionX = -20;
                snakeDirectionY = 0;
            }
            break;
        case 'd':
            if (snakeDirectionX !== -20) {
                snakeDirectionX = 20;
                snakeDirectionY = 0;
            }
            break;
    }
}

    document.addEventListener('keydown', handleKeyPress);

    createSnake();

        function startGame() {
        isGameRunning = true; 
        createSnake();
        setInterval(moveSnake, 200);
        resetGame();
    }

    function pauseGame() {
        isGamePaused = true;
    }

    function resumeGame() {
        isGamePaused = false;
    }
    
    setTimeout(startGame, 1000);
    document.addEventListener('keydown', handleKeyPress);
});
