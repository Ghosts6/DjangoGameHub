![baner](https://github.com/Ghosts6/Local-website/blob/main/img/Baner.png)
# 🌐DjangoGameHub :

This is my source code of web platform that hosting classic games like Snake, Flappy Bird, Tic-Tac-Toe, and Chrome's Dinosaur Game. Powered by Django and PostgreSQL for seamless performance, with HTML, CSS, and JavaScript for a captivating frontend. Track your scores, compete on the leaderboard, and aim for the top spot. Join the gaming community, challenge yourself, and let the games begin!





# 🔍Code-sample(Snake Game Overview):


In our Snake Game, navigate through the grid, avoiding collisions with the game borders or your own tail to stay in the game. Devouring fruits not only adds points to your score but also extends the length of your snake, presenting both a challenge and an opportunity.

Key Features:

   1 Scoring System:
        Successfully consuming fruits increases your score, showcasing your gaming prowess.
        Track your live score at the top of the game page for instant feedback on your performance.

   2 Game Challenges:
        Collision with the game borders or your own tail results in a game-over scenario.
        The longer your snake grows, the more strategic your movements need to be to avoid obstacles.

  3 Top Scores:
        Compete for the top spot by achieving the highest scores.
        View your personal high score prominently during gameplay for a constant sense of achievement.

  4  Score Page:
        Explore the dedicated score page to witness the top scores achieved by players.
        Be inspired by the best and strive to reach the pinnacle of the leaderboards.
 
 
  snake.html
  ```html
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/png" sizes="32x32" href="{% static 'favicon/favicon-32x32.png'%}">
    <link rel="icon" type="image/png" sizes="16x16" href="{% static 'favicon/favicon-16x16.png'%}">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#603cba">
    <meta name="theme-color" content="#ffffff">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <link rel="stylesheet" href="{% static 'css/snake.css' %}">
</head>
<body>
    <div class="game-container">
        <div class="score-container">
            <p class="player-score">
                <span id="playerName">Your Name</span>
                <span id="score">0</span>
            </p>
        </div>
        <div class="snake-container"></div>
        <div class="fruit apple" data-points="5">🍎</div>
        <div class="fruit apple" data-points="5">🍎</div>
        <div class="fruit apple" data-points="5">🍎</div>
        <div class="fruit apple" data-points="5">🍎</div>
        <div class="fruit banana" data-points="10">🍌</div>
        <div class="fruit banana" data-points="10">🍌</div>
    </div>
    <div class="top-score-container">
        <p>Top Score:</p>
        <form id="snakeScoreForm" method="post" action="{% url 'submit_snake_score' %}">
        {% csrf_token %}
    <ul>
        {% for score in top_scores %}
            <li>{{ score.player_name }} - {{ score.score }}</li>
        {% empty %}
            <li>No top score yet.</li>
        {% endfor %}
    </ul>
</div>
    </div>
    <script src="{%static 'js/snake.js' %}"></script>
</body>
</html>
```
snake.css
```css
body {
    margin: 0;
    animation: movingColor 10s infinite;
    background: linear-gradient(45deg, #a3d7ff, #ffb6d1, #c7b3ff);
    background-size: 100% 100%;
    background-attachment: fixed;
    overflow: hidden;
}

@keyframes movingColor {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.game-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    border: 10px dashed #003366; 
    padding: 20px; 
    box-sizing: border-box; 
    overflow: hidden;
    z-index: 1;
}

.score-container {
    position: absolute;
    top: 20px; 
    left: 50%;
    transform: translateX(-50%);
    color: #000;
    z-index: 2;
}

.player-score {
    display: inline-block;
    margin-right: 10px; 
}

.top-score-container {
    position: absolute;
    bottom: 20px; 
    left: 50%;
    transform: translateX(-50%);
    color: #000;
    z-index: 2; 
}
.fruit {
    font-size: 24px; 
    cursor: pointer;
    z-index: 3;
}

.banana {
    color: yellow; 
}

.game-over-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 3px double #00bfff;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 10;
}

.buttons-container {
    margin-top: 20px;
}

.buttons-container button {
    background-color: #00bfff; 
    color: #000; 
    border-radius: 20px; 
    padding: 10px 20px; 
    margin: 5px; 
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, border 0.3s ease;
}

.buttons-container button:hover {
    background-color: #007acc; 
    color: #fff; 
    border: 3px double #007acc;
}
```
snake.js
```js
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
```
views.py
```python
def Snake_Game(request, player_name):
    top_scores = SnakeScore.objects.order_by('-score')[:1]
    return render(request, 'snake.html', {'top_scores': top_scores, 'player_name': player_name})

def top_scores(request):
    snake_top_scores = SnakeScore.objects.order_by('-score')[:5]
    flappy_top_scores = FlappyScore.objects.order_by('-score')[:5]
    dinosaur_top_scores = DinosaurScore.objects.order_by('-score')[:5]

    return render(request, 'top_scores.html', {
        'snake_top_scores': snake_top_scores,
        'flappy_top_scores': flappy_top_scores,
        'dinosaur_top_scores': dinosaur_top_scores,
    })

def handle_snake_score_submission(request):
    if request.method == 'POST':
        form = SnakeScoreForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse('Score submitted successfully!')
    
    return HttpResponse('Invalid submission or GET request!')
```      
#🖥️Technolgy:

Backend:python,django,postgersql
Frontend:html,css,js

![Django](https://img.shields.io/badge/django-%23092E20.svg?style=plastic&logo=django&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=plastic&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=plastic&logo=javascript&logoColor=%23F7DF1E)  ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=plastic&logo=css3&logoColor=white)  ![Python](https://img.shields.io/badge/python-3670A0?style=plastic&logo=python&logoColor=ffdd54) ![PostgreSQL](https://img.shields.io/badge/postgresql-336791?style=plastic&logo=postgresql&logoColor=white)
