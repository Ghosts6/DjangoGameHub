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

returnIcon.addEventListener('click', function() {
    window.location.href = 'home/';
});

//game logic
var isGameRunning = true;
var isGameOver = false;
var dino = document.querySelector(".dino");
var cactus = document.querySelector(".cactus");
var scoreboard = document.querySelector(".score");
var endgame = document.querySelector(".game-over-popup");
var score = 0;
var jumped = false;

dino.classList.remove("jump");

function jump(){
    if(jumped)return
    dino.classList.add("jump")
    jumped = true
    setTimeout(function(){
        dino.classList.remove("jump")
        jumped = false
    },800)
}

window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyW' || event.code === 'ArrowUp' || event.code === 'Space') {
        event.preventDefault();
        jump();
    }
});

function updateScore() {
    if (isGameRunning) {
        score += 1;
        scoreboard.innerHTML = 'Score: ' + score;
    }
}

setInterval(updateScore, 2000);

function checkCollision() {
    var dinoRect = dino.getBoundingClientRect();
    var cactusElement = document.querySelector('.cactus');

    if (cactusElement) {
        var cactusRect = cactusElement.getBoundingClientRect();

        if (
            dinoRect.bottom > cactusRect.top &&
            dinoRect.top < cactusRect.bottom &&
            dinoRect.right > cactusRect.left &&
            dinoRect.left < cactusRect.right
        ) {
            endGame();
        }
    }

}

function endGame() {
    if (!isGameRunning || isGameOver) {
        return;
    }

    isGameRunning = false;
    isGameOver = true;
    saveDinosaurScore("PlayerName", score);
    pauseGameAnimations();
    displayGameOverPopup();
}

function pauseGameAnimations() {
    document.querySelector('.game').classList.add('lost');
    document.querySelector('.dino').classList.add('lost-animation');
    document.querySelector('.cactus').classList.add('lost-animation');
}


function displayGameOverPopup() {
    const gameOverPopup = document.createElement('div');
    gameOverPopup.className = 'game-over-popup';

    const gameOverMessage = document.createElement('p');
    gameOverMessage.innerText = 'Game Over!';
    gameOverPopup.appendChild(gameOverMessage);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const homeButton = createButton('Home', () => {
        window.location.href = '/';
    });

    const playAgainButton = createButton('Play Again', () => {
        restartGame();
        document.body.removeChild(gameOverPopup);
    });

    const topScoreButton = createButton('Top Score', () => {
        window.location.href = '/top_scores/';
    });

    buttonsContainer.appendChild(homeButton);
    buttonsContainer.appendChild(playAgainButton);
    buttonsContainer.appendChild(topScoreButton);

    gameOverPopup.appendChild(buttonsContainer);

    document.body.appendChild(gameOverPopup);
}

function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.innerText = text;
    button.addEventListener('click', clickHandler);
    return button;
}

function restartGame() {
    isGameRunning = true;
    isGameOver = false;
    score = 0;
    updateScore();
    removeGameOverPopup();
    document.querySelector('.game').classList.remove('lost');
    document.querySelector('.dino').classList.remove('lost-animation');
    document.querySelector('.cactus').classList.remove('lost-animation');
    const oldCactus = document.querySelector('.cactus');
    const newCactus = oldCactus.cloneNode(true);
    oldCactus.parentNode.replaceChild(newCactus, oldCactus);
    newCactus.style.right = '0';
    if (isGameRunning) {
        gameLoop();
    }
}

function gameLoop() {
    if (isGameRunning && !isGameOver) {
        checkCollision();
        requestAnimationFrame(gameLoop);
    }
}

function removeGameOverPopup() {
    const gameOverPopup = document.querySelector('.game-over-popup');
    if (gameOverPopup && gameOverPopup.parentNode) {
        gameOverPopup.parentNode.removeChild(gameOverPopup);
    }
}

gameLoop();

function saveDinosaurScore(playerName, score) {
    fetch('/save_dinosaur_score/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player_name: playerName,
            score: score,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score saved successfully:', data.message);
    })
    .catch(error => {
        console.error('Error saving score:', error);
    });
}