![baner](https://github.com/Ghosts6/Local-website/blob/main/img/Baner.png)
# 🌐DjangoGameHub :

This is the source code for a web platform hosting a collection of classic and AI-powered games. Built with Django and PostgreSQL for robust backend performance, and a dynamic frontend using HTML, CSS, and JavaScript. Players can enjoy classic arcade games like Snake, Flappy Bird, Tic-Tac-Toe, and Chrome's Dinosaur Game, compete on leaderboards, and challenge an AI in the new Akinator game.

## 🎮 Games Included:
*   **Snake Game:** Navigate the snake, eat food, and grow without hitting walls or yourself. Compete for high scores.
*   **Flappy Bird:** Test your reflexes by guiding a bird through a series of pipes.
*   **Tic-Tac-Toe:** A classic two-player game.
*   **Chrome's Dinosaur Game:** Jump over obstacles in an endless runner.
*   **Akinator (AI-Powered):** Think of a character, and the Akinator (powered by OpenAI) will try to guess it by asking a series of questions.

## ✨ Features:
*   **User Authentication:** Login/Register system for personalized experience.
*   **Guest Play:** Play games without needing to register.
*   **Leaderboards:** Track and compare high scores across different games.
*   **Modern UI/UX:** Engaging and responsive design for a smooth gaming experience.
*   **AI Integration:** Akinator game leverages OpenAI for intelligent guessing.

## 🚀 Technologies Used:

Backend: Python, Django, PostgreSQL, OpenAI API
Frontend: HTML, CSS, JavaScript, Particles.js

![Django](https://img.shields.io/badge/django-%23092E20.svg?style=plastic&logo=django&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=plastic&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=plastic&logo=javascript&logoColor=%23F7DF1E) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=plastic&logo=css3&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=plastic&logo=python&logoColor=ffdd54) ![PostgreSQL](https://img.shields.io/badge/postgresql-336791?style=plastic&logo=postgresql&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=plastic&logo=openai&logoColor=white)

## ⚙️ Setup and Installation:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ghosts6/DjangoGameHub.git
    cd DjangoGameHub
    ```
2.  **Create a virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    *   Create a `.env` file in the `game/game/` directory.
    *   Add your PostgreSQL database configuration.
    *   Add your OpenAI API key: `OPENAI_API_KEY='your_openai_api_key_here'`
5.  **Run database migrations:**
    ```bash
    python game/manage.py migrate
    ```
6.  **Create a superuser (optional):**
    ```bash
    python game/manage.py createsuperuser
    ```
7.  **Run the development server:**
    ```bash
    python game/manage.py runserver
    ```
    The application will be available at `http://127.0.0.1:8000/`.