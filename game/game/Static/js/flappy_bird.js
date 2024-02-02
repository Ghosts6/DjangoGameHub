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

// game logic
var hole = document.getElementById("hole");
var block = document.getElementById("block");
var character = document.getElementById("character");
var scoreElement = document.getElementById("score");
var game = document.querySelector('.game');
var jumping = 0;
var counter = 0;
var isGameRunning = true;
var isGameOver = false;
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

  var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
  if (jumping == 0) {
    character.style.top = (characterTop + 4) + "px";
  }
  var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
  var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
  var cTop = -(700 - characterTop);

  if ((characterTop > 630) || ((blockLeft < 20) && (blockLeft > -50) && ((cTop < holeTop) || (cTop > holeTop + 150)))) {
    console.log("game over, score" + counter);
    endGame();
  }
}, 10);

function jump() {
  if (isGameRunning && jumping === 0) {
    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(function() {
      var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
      if ((characterTop > 6) && (jumpCount < 15)) {
        character.style.top = (characterTop - 7) + "px";
      }
      if (jumpCount >= 20) {
        clearInterval(jumpInterval);
        jumping = 0;
        jumpCount = 0;
      }
      jumpCount++;
    }, 10);
  }
}

document.addEventListener('keydown', function(event) {
  if (!isGameRunning) return;

  if ((event.key === 'w' || event.key === 'ArrowUp' || event.key === ' ') && jumping === 0) {
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
  scoreElement.innerText = counter;
  character.style.top = "200px";
  block.style.animation = blockAnimation;
  hole.style.animation = holeAnimation;
  game.style.animation = gameAnimation;
}

function sendScoreToBackend(playerName, score) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/save_flappy_score/', {
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