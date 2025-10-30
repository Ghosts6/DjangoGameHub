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

// game logic
let snakeSegments = [];

function setRandomPosition(fruit) {
    const container = document.querySelector('.game-container');
    const containerRect = container.getBoundingClientRect();
    const gridSize = 20;
    const maxX = Math.floor((containerRect.width - gridSize) / gridSize);
    const maxY = Math.floor((containerRect.height - gridSize) / gridSize);
    
    let newX, newY;
    let validPosition = false;

    while (!validPosition) {
        newX = Math.floor(Math.random() * maxX) * gridSize;
        newY = Math.floor(Math.random() * maxY) * gridSize;
        validPosition = true;

        // Check collision with snake
        for (const segment of snakeSegments) {
            const segLeft = parseInt(segment.element.style.left);
            const segTop = parseInt(segment.element.style.top);
            if (segLeft === newX && segTop === newY) {
                validPosition = false;
                break;
            }
        }
    }

    fruit.style.position = 'absolute';
    fruit.style.left = `${newX}px`;
    fruit.style.top = `${newY}px`;
}

document.addEventListener("DOMContentLoaded", function () {
    // Global elements
    const elements = {
        container: document.querySelector('.game-container'),
        snakeContainer: document.querySelector('.snake-container'),
        scoreDisplay: document.getElementById('score'),
        fruits: document.querySelectorAll('.fruit')
    };

    // Game state object
    const game = {
        isOver: false,
        isRunning: false,
        isPaused: false,
        waitingForStart: true,
        direction: { x: 0, y: 0 },
        nextDirection: { x: 0, y: 0 },
        gridSize: 20,
        snakeSize: 5,
        gameInterval: null,
        speed: 150,
        score: 0
    };

    // Initialize fruits
    elements.fruits.forEach(fruit => {
        fruit.style.display = 'block';
    });

    // Create and show start message
    const startMessage = document.createElement('div');
    startMessage.className = 'start-message';
    startMessage.innerHTML = 'Press any arrow key or WASD to start';
    document.body.appendChild(startMessage);

    const fruits = document.querySelectorAll('.fruit');

    function sendScoreToBackend(playerName, score) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch('/save_score/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify({ game: 'snake', score: score })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score save response:', data);
            // Optionally, update the displayed top score if the new score is higher
            const topScoreElement = document.querySelector('.top-score-container ul li');
            if (topScoreElement) {
                const currentTopScoreText = topScoreElement.innerText;
                const currentTopScoreMatch = currentTopScoreText.match(/\d+/);
                const currentTopScore = currentTopScoreMatch ? parseInt(currentTopScoreMatch[0]) : 0;

                if (score > currentTopScore) {
                    let userDisplay = playerName;
                    // Assuming the backend response might include the actual top score user/guest name
                    // For now, we'll just use the current player's name if it's a new top score
                    topScoreElement.innerHTML = `${userDisplay} - ${score}`;
                }
            }
        })
        .catch(error => {
            console.error('Error saving score:', error);
        });
    }

    function eatFruit(fruit) {
        const points = parseInt(fruit.getAttribute('data-points'));
        game.score += points;
        elements.scoreDisplay.innerText = game.score;
        
        // Grow snake - add segment at tail position
        const tail = snakeSegments[snakeSegments.length - 1];
        const newSegment = createSnakeSegment('🔴', 'blue', tail.left, tail.top);
        snakeSegments.push({ 
            element: newSegment, 
            left: tail.left, 
            top: tail.top 
        });
        elements.snakeContainer.appendChild(newSegment);
        
        // Move fruit to new position
        setRandomPosition(fruit);
    }

    function expireBanana(banana) {
        banana.style.display = 'none';
        // Respawn banana after it expires
        setTimeout(() => {
            banana.style.display = 'block';
            setRandomPosition(banana);
            setTimeout(() => expireBanana(banana), 10000);
        }, 5000);
    }

    elements.fruits.forEach(fruit => {
        setRandomPosition(fruit);
        if (fruit.classList.contains('banana')) {
            setTimeout(() => expireBanana(fruit), 10000);
        }
    });

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

    function createSnake() {
        elements.snakeContainer.innerHTML = '';
        snakeSegments.length = 0;

        // Calculate starting position (centered)
        const initialX = Math.floor(elements.container.clientWidth / (2 * game.gridSize)) * game.gridSize;
        const initialY = Math.floor(elements.container.clientHeight / (2 * game.gridSize)) * game.gridSize;

        // Create head
        const head = createSnakeSegment('👹', 'green', initialX, initialY);
        snakeSegments.push({ element: head, left: initialX, top: initialY });
        elements.snakeContainer.appendChild(head);

        // Create body
        for (let i = 1; i < game.snakeSize; i++) {
            const bodySegment = createSnakeSegment('🔴', 'blue', initialX - i * game.gridSize, initialY);
            snakeSegments.push({ 
                element: bodySegment, 
                left: initialX - i * game.gridSize, 
                top: initialY 
            });
            elements.snakeContainer.appendChild(bodySegment);
        }
    }

    function updateSnake() {
        if (game.isPaused || !game.isRunning) return;

        // Update current direction from next direction
        game.direction = { ...game.nextDirection };

        // Move body segments
        for (let i = snakeSegments.length - 1; i > 0; i--) {
            snakeSegments[i].left = snakeSegments[i - 1].left;
            snakeSegments[i].top = snakeSegments[i - 1].top;
        }

        // Move head
        snakeSegments[0].left += game.direction.x;
        snakeSegments[0].top += game.direction.y;

        // Update visual positions
        snakeSegments.forEach(segment => {
            segment.element.style.left = `${segment.left}px`;
            segment.element.style.top = `${segment.top}px`;
        });

        // Check collisions
        if (checkCollisionWithBorders() || checkCollisionWithItself()) {
            endGame();
            return;
        }

        checkCollisionWithFruits();
    }

    function checkCollisionWithFruits() {
        const head = snakeSegments[0];
        fruits.forEach(fruit => {
            // Only check visible fruits
            if (fruit.style.display === 'none') return;
            
            const fruitLeft = parseInt(fruit.style.left);
            const fruitTop = parseInt(fruit.style.top);

            if (head.left === fruitLeft && head.top === fruitTop) {
                eatFruit(fruit);
            }
        });
    }

    function moveSnake() {
        if (game.isPaused || !game.isRunning) return;
        updateSnake();
    }

    function checkCollisionWithBorders() {
        const head = snakeSegments[0];
        const containerRect = elements.container.getBoundingClientRect();
        
        return (
            head.left < 0 || 
            head.top < 0 || 
            head.left + game.gridSize > containerRect.width || 
            head.top + game.gridSize > containerRect.height
        );
    }

    function checkCollisionWithItself() {
        const head = snakeSegments[0];
        for (let i = 4; i < snakeSegments.length; i++) {
            if (head.left === snakeSegments[i].left && 
                head.top === snakeSegments[i].top) {
                return true;
            }
        }
        return false;
    }

    function endGame() {
        if (!game.isRunning || game.isOver) return;
        
        clearInterval(game.gameInterval);
        game.isRunning = false;
        game.isOver = true;

        const score = parseInt(elements.scoreDisplay.innerText);
        const playerName = document.getElementById('playerName').innerText;
        sendScoreToBackend(playerName, score);

        const gameOverPopup = document.createElement('div');
        gameOverPopup.className = 'game-over-popup';
        
        const msg = document.createElement('p');
        msg.innerText = 'Game Over! Final Score: ' + score;
        gameOverPopup.appendChild(msg);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';

        // Home button
        const homeBtn = document.createElement('button');
        homeBtn.innerText = 'Home';
        homeBtn.onclick = () => window.location.href = '/';

        // Play Again button
        const playAgainBtn = document.createElement('button');
        playAgainBtn.innerText = 'Play Again';
        playAgainBtn.onclick = () => {
            document.body.removeChild(gameOverPopup);
            startGame();
        };

        // Top Score button
        const topScoreBtn = document.createElement('button');
        topScoreBtn.innerText = 'Top Score';
        topScoreBtn.onclick = () => window.location.href = '/top_scores/';

        buttonsContainer.append(homeBtn, playAgainBtn, topScoreBtn);
        gameOverPopup.appendChild(buttonsContainer);
        document.body.appendChild(gameOverPopup);
    }

    function handleKeyPress(event) {
        const key = event.key.toLowerCase();
        const validKeys = ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'];
        if (!validKeys.includes(key)) return;

        if (game.waitingForStart) {
            game.waitingForStart = false;
            const startMessage = document.querySelector('.start-message');
            if (startMessage) startMessage.remove();
            startGame();
            return;
        }

        if (game.isOver || game.isPaused) return;

        // Determine new direction based on key press
        let newDirection = { ...game.direction };

        switch(key) {
            case 'w': case 'arrowup':
                if (game.direction.y !== game.gridSize) {
                    newDirection = { x: 0, y: -game.gridSize };
                }
                break;
            case 's': case 'arrowdown':
                if (game.direction.y !== -game.gridSize) {
                    newDirection = { x: 0, y: game.gridSize };
                }
                break;
            case 'a': case 'arrowleft':
                if (game.direction.x !== game.gridSize) {
                    newDirection = { x: -game.gridSize, y: 0 };
                }
                break;
            case 'd': case 'arrowright':
                if (game.direction.x !== -game.gridSize) {
                    newDirection = { x: game.gridSize, y: 0 };
                }
                break;
        }

        // Update next direction (will be applied on next game tick)
        game.nextDirection = newDirection;
    }

    function startGame() {
        console.log('Starting game...');
        if (game.gameInterval) {
            clearInterval(game.gameInterval);
        }
        
        // Reset game state
        game.isRunning = true;
        game.isOver = false;
        game.isPaused = false;
        game.waitingForStart = false;
        game.score = 0;
        
        // Set initial direction (moving right)
        game.direction = { x: game.gridSize, y: 0 };
        game.nextDirection = { x: game.gridSize, y: 0 };
        
        // Reset score and create new snake
        elements.scoreDisplay.innerText = '0';
        createSnake();
        
        // Start game loop
        game.gameInterval = setInterval(moveSnake, game.speed);
        
        // Reset and show fruits
        fruits.forEach(fruit => {
            fruit.style.display = 'block';
            setRandomPosition(fruit);
        });
        
        console.log('Game started with initial direction:', game.direction);
    }

    function pauseGame() {
        if (!game.isRunning || game.isOver) return;
        
        game.isPaused = true;
        clearInterval(game.gameInterval);
        
        const pauseMessage = document.createElement('div');
        pauseMessage.className = 'pause-message';
        pauseMessage.innerHTML = 'Game Paused<br>Press Space to Resume';
        document.body.appendChild(pauseMessage);
    }

    function resumeGame() {
        if (!game.isRunning || game.isOver) return;
        
        game.isPaused = false;
        game.gameInterval = setInterval(moveSnake, game.speed);
        
        const pauseMessage = document.querySelector('.pause-message');
        if (pauseMessage) {
            pauseMessage.remove();
        }
    }

    // Event Listeners
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !game.waitingForStart && !game.isOver) {
            game.isPaused ? resumeGame() : pauseGame();
            event.preventDefault();
        }
    });

    document.addEventListener('keydown', handleKeyPress);

    // Initialize game
    createSnake();
});