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

const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authContainer = document.getElementById('auth-container');
const showLoginRegister = document.getElementById('show-login-register');
const gameSelectionContainer = document.getElementById('game-selection-container');

if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
}

if (showLoginRegister) {
    showLoginRegister.addEventListener('click', (e) => {
        e.preventDefault();
        if (authContainer.style.display === 'none') {
            authContainer.style.display = 'block';
            gameSelectionContainer.style.display = 'none';
        } else {
            authContainer.style.display = 'none';
            gameSelectionContainer.style.display = 'block';
        }
    });
}

// Client-side validation for login and registration forms

function showErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrorMessage(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function validateLoginForm() {
    const usernameInput = loginForm.querySelector('#id_username');
    const passwordInput = loginForm.querySelector('#id_password');
    let isValid = true;

    clearErrorMessage('login-username-error');
    clearErrorMessage('login-password-error');

    if (usernameInput.value.trim() === '') {
        showErrorMessage('login-username-error', 'Username is required.');
        isValid = false;
    }

    if (passwordInput.value.trim() === '') {
        showErrorMessage('login-password-error', 'Password is required.');
        isValid = false;
    }

    return isValid;
}

function validateRegisterForm() {
    const usernameInput = registerForm.querySelector('[name=username]');
    const passwordInput = registerForm.querySelector('[name=password]');
    const confirmPasswordInput = registerForm.querySelector('[name=password_confirm]');
    let isValid = true;

    clearErrorMessage('register-username-error');
    clearErrorMessage('register-password-error');
    clearErrorMessage('register-confirm-password-error');

    if (usernameInput.value.trim() === '') {
        showErrorMessage('register-username-error', 'Username is required.');
        isValid = false;
    }

    if (passwordInput.value.trim() === '') {
        showErrorMessage('register-password-error', 'Password is required.');
        isValid = false;
    } else if (passwordInput.value.length < 6) {
        showErrorMessage('register-password-error', 'Password must be at least 6 characters long.');
        isValid = false;
    }

    if (confirmPasswordInput.value.trim() === '') {
        showErrorMessage('register-confirm-password-error', 'Confirm password is required.');
        isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        showErrorMessage('register-confirm-password-error', 'Passwords do not match.');
        isValid = false;
    }

    return isValid;
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        if (!validateLoginForm()) {
            e.preventDefault();
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        if (!validateRegisterForm()) {
            e.preventDefault();
        }
    });
}



