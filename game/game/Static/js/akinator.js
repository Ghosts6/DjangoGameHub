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

let gameState = {
    lastGuess: null,
    gameStarted: false,
    conversationHistory: [],
    isCelebrating: false
};

function celebrateVictory(characterName) {
    if (gameState.isCelebrating) return;
    gameState.isCelebrating = true;

    document.querySelectorAll('.victory-overlay, .victory-message, .confetti, .firework, .star-burst, .sparkle')
        .forEach(el => el.remove());

    document.body.classList.add('victory-mode');

    const overlay = document.createElement('div');
    overlay.className = 'victory-overlay';
    document.body.appendChild(overlay);

    const victoryMessage = document.createElement('div');
    victoryMessage.className = 'victory-message';
    victoryMessage.innerHTML = `
        <h2>🎉 I Got It! 🎉</h2>
        <p>Your character was:</p>
        <div class="victory-character">${characterName}</div>
        <p style="margin-top: 30px; font-size: 1.4em;">I knew it! 😎</p>
    `;
    document.body.appendChild(victoryMessage);

    createConfetti();
    createFireworks();
    createStarBurst();
    createSparkles();

    const container = document.querySelector('.akinator-container');
    container.classList.add('celebrate-guess');

    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s ease forwards';
        victoryMessage.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            overlay.remove();
            victoryMessage.remove();
            document.body.classList.remove('victory-mode');
            container.classList.remove('celebrate-guess');
            gameState.isCelebrating = false;
        }, 500);
    }, 5000);
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            const shapes = ['rotate(45deg)', 'rotate(0deg)', 'rotate(90deg)'];
            confetti.style.transform = shapes[Math.floor(Math.random() * shapes.length)];
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

function createFireworks() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const fireworkCount = 8;
    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = (Math.random() * 80 + 10) + '%';
            firework.style.top = (Math.random() * 60 + 20) + '%';
            firework.style.color = colors[Math.floor(Math.random() * colors.length)];
            firework.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
            firework.style.setProperty('--y', (Math.random() * 200 - 100) + 'px');
            document.body.appendChild(firework);
            setTimeout(() => firework.remove(), 2000);
        }, i * 300);
    }
}

function createStarBurst() {
    const starBurst = document.createElement('div');
    starBurst.className = 'star-burst';
    const starCount = 12;
    const radius = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const angle = (i / starCount) * Math.PI * 2;
        const tx = Math.cos(angle) * radius;
        const ty = Math.sin(angle) * radius;
        star.style.setProperty('--tx', tx + 'px');
        star.style.setProperty('--ty', ty + 'px');
        star.style.animationDelay = (i * 0.05) + 's';
        starBurst.appendChild(star);
    }
    document.body.appendChild(starBurst);
    setTimeout(() => starBurst.remove(), 2000);
}

function createSparkles() {
    const sparkleCount = 50;
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (Math.random() * 100) + '%';
            sparkle.style.top = (Math.random() * 100) + '%';
            sparkle.style.animationDelay = Math.random() + 's';
            sparkle.style.animationDuration = (Math.random() * 1 + 1) + 's';
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 3000);
        }, i * 40);
    }
}

const style = document.createElement('style');
style.textContent = `@keyframes fadeOut { to { opacity: 0; } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const questionArea = document.getElementById('question-area');
    const akinatorQuestion = document.getElementById('akinator-question');
    const answerButtons = document.getElementById('answer-buttons');
    const guessArea = document.getElementById('guess-area');
    const akinatorGuess = document.getElementById('akinator-guess');
    const startGameBtn = document.getElementById('start-game-btn');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    function updateUI(data) {
        if (data.guess) {
            gameState.lastGuess = data.guess;
            akinatorQuestion.textContent = "Is your character...";
            akinatorGuess.textContent = data.guess;
            guessArea.style.display = 'block';
            answerButtons.style.display = 'none';
            startGameBtn.style.display = 'none';
            resetGameBtn.style.display = 'block';
        } else if (data.question) {
            akinatorQuestion.textContent = data.question;
            guessArea.style.display = 'none';
            answerButtons.style.display = 'block';
            startGameBtn.style.display = 'none';
            resetGameBtn.style.display = 'block';
        } else {
            akinatorQuestion.textContent = "Think of a character, and I will try to guess it!";
            guessArea.style.display = 'none';
            answerButtons.style.display = 'none';
            startGameBtn.style.display = 'block';
            resetGameBtn.style.display = 'none';
        }
    }

    async function sendAnswer(answer) {
        gameState.conversationHistory.push({ role: 'user', content: answer });
        try {
            const response = await fetch('/akinator/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    history: gameState.conversationHistory,
                    answer: answer
                })
            });
            const data = await response.json();
            if (data.guess) gameState.lastGuess = data.guess;
            else if (data.question && data.question.includes('Is your character')) {
                const match = data.question.match(/Is your character ([^?]+)\?/);
                if (match) gameState.lastGuess = match[1];
            }
            gameState.conversationHistory.push({
                role: 'assistant',
                content: data.question || data.guess
            });
            updateUI(data);
            if (data.success) setTimeout(() => celebrateVictory(gameState.lastGuess), 100);
        } catch (error) {
            console.error('Error sending answer:', error);
        }
    }

    startGameBtn.addEventListener('click', () => {
        gameState = {
            lastGuess: null,
            gameStarted: true,
            conversationHistory: [{
                role: 'system',
                content: 'You are Akinator. I will think of a character, and you will ask me yes/no questions to guess it.'
            }],
            isCelebrating: false
        };
        sendAnswer('start_game');
    });

    answerButtons.addEventListener('click', event => {
        if (event.target.classList.contains('answer-btn')) {
            sendAnswer(event.target.dataset.answer);
        }
    });

    guessArea.addEventListener('click', async event => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;
        const answer = targetButton.dataset.answer;
        if (!answer) return;
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        try {
            if (answer === 'guess_yes') {
                targetButton.classList.add('correct-guess');
                akinatorQuestion.textContent = `I knew it! I guessed "${gameState.lastGuess}" correctly! 🎉`;
                guessArea.style.display = 'none';
                resetGameBtn.style.display = 'block';
                await sendAnswer('guess_yes');
                if (!gameState.isCelebrating) celebrateVictory(gameState.lastGuess);
            } else if (answer === 'guess_no') {
                akinatorQuestion.textContent = "Darn! Let me try another question.";
                guessArea.style.display = 'none';
                answerButtons.style.display = 'block';
                await sendAnswer('guess_no');
            }
        } catch (error) {
            console.error('Error handling guess:', error);
        } finally {
            document.querySelectorAll('button').forEach(btn => btn.disabled = false);
        }
    });

    resetGameBtn.addEventListener('click', () => {
        gameState = {
            lastGuess: null,
            gameStarted: false,
            conversationHistory: [],
            isCelebrating: false
        };
        updateUI({});
    });

    updateUI({});
});
