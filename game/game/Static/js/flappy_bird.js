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

let timer;
let seconds = 0;

function updateStopwatch() {
    seconds++;
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}:${secs}`;
}

function startStopwatch() {
    seconds = 0;
    document.getElementById('clock').innerText = '00:00:00';
    timer = setInterval(updateStopwatch, 1000);
}

function stopStopwatch() {
    clearInterval(timer);
}

// Flappy Bird Game Logic
var hole = document.getElementById("hole");
var block = document.getElementById("block");
var character = document.getElementById("character");
var scoreElement = document.getElementById("score");
var game = document.querySelector('.game');
var jumping = false;
var counter = 0;
var isGameRunning = true;
var isGameOver = false;
var velocity = 0;
var gravity = 0.3;
var jumpStrength = 8;
var blockAnimation = block.style.animation;
var holeAnimation = hole.style.animation;
var gameAnimation = game.style.animation;

hole.addEventListener('animationiteration', () => {
    if (isGameRunning) {
        var random = -((Math.random() * 400) + 350);
        hole.style.top = random + "px";
        counter++;
        updateScore();
    }
});

setInterval(function() {
    if (!isGameRunning) return;

    var characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue("top"));
    velocity += gravity;
    character.style.top = (characterTop + velocity) + "px";

    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
    var cTop = -(700 - characterTop);

    if ((characterTop > 630) || ((blockLeft < 20) && (blockLeft > -50) && ((cTop < holeTop) || (cTop > holeTop + 150)))) {
        endGame();
    }
}, 10);

function jump() {
    if (!isGameRunning) return;
    velocity = -jumpStrength;
}

document.addEventListener('keydown', function(event) {
    if (!isGameRunning) return;
    if (event.key === 'w' || event.key === 'ArrowUp' || event.key === ' ') {
        jump();
    }
});

function updateScore() {
    scoreElement.innerText = counter;
}

function endGame() {
    if (isGameOver) return;

    block.style.animation = 'none';
    hole.style.animation = 'none';
    game.style.animation = 'none';

    const gameOverPopup = document.createElement('div');
    gameOverPopup.className = 'game-over-popup';

    const gameOverMessage = document.createElement('p');
    gameOverMessage.innerText = `Game Over! Your score: ${counter}`;
    gameOverPopup.appendChild(gameOverMessage);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const playAgainButton = document.createElement('button');
    playAgainButton.innerText = 'Play Again';
    playAgainButton.addEventListener('click', () => {
        resetGame();
        document.body.removeChild(gameOverPopup);
    });

    const homeButton = document.createElement('button');
    homeButton.innerText = 'Home';
    homeButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    const topScoreButton = document.createElement('button');
    topScoreButton.innerText = 'Top Score';
    topScoreButton.addEventListener('click', () => {
        window.location.href = '/top_scores/';
    });

    buttonsContainer.appendChild(playAgainButton);
    buttonsContainer.appendChild(homeButton);
    buttonsContainer.appendChild(topScoreButton);

    gameOverPopup.appendChild(buttonsContainer);
    document.body.appendChild(gameOverPopup);

    isGameRunning = false;
    isGameOver = true;
    document.getElementById('scoreInput').value = counter;
    document.getElementById('yourFormId').submit();
}

function resetGame() {
    counter = 0;
    isGameRunning = true;
    isGameOver = false;
    velocity = 0;
    scoreElement.innerText = counter;
    character.style.top = "200px";
    block.style.animation = blockAnimation;
    hole.style.animation = holeAnimation;
    game.style.animation = gameAnimation;
}

function sendScoreToBackend(score) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/save_score/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            game: 'flappy_bird',
            score: score,
        }),
    });
}

startStopwatch();