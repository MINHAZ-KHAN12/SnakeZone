// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let speed = 8;
let score = 0;
let lastPaintTime = 0;
let isPaused = false;
const boardSize = 18;

let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Pause Button Logic
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
});

// Main Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if (isPaused) return;
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

// Check Collision (with itself)
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

// Update Head Rotation Based on Direction
function updateHeadRotation(dir) {
    const head = document.getElementById("snake-head");
    if (!head) return;

    let angle = 0;
    if (dir.x === 0 && dir.y === -1) angle = 0;       // Up
    else if (dir.x === 1 && dir.y === 0) angle = 90;  // Right
    else if (dir.x === 0 && dir.y === 1) angle = 180; // Down
    else if (dir.x === -1 && dir.y === 0) angle = 270;// Left

    head.style.transform = `rotate(${angle}deg)`;
}

// Game Engine
function gameEngine() {
    // Collision
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        localStorage.setItem("latestScore", score);
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        window.location.href = "gameover.html";
        return;
    }

    // Eat Food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High Score: " + hiscoreval;
        }

        scoreBox.innerHTML = "Score: " + score;

        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // Generate new food
        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Move Snake Body
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    // Move Snake Head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Wall Wrapping
    if (snakeArr[0].x > boardSize) snakeArr[0].x = 1;
    if (snakeArr[0].x < 1) snakeArr[0].x = boardSize;
    if (snakeArr[0].y > boardSize) snakeArr[0].y = 1;
    if (snakeArr[0].y < 1) snakeArr[0].y = boardSize;

    // Render Snake and Food
    board.innerHTML = "";

    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
            snakeElement.id = "snake-head"; // Important for rotation
        } else {
            snakeElement.classList.add('snake');
            snakeElement.style.opacity = `${1 - index * 0.05}`; // Fading tail effect
        }

        board.appendChild(snakeElement);
    });

    updateHeadRotation(inputDir); // 🔄 Update rotation after render

    // Render Food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    foodElement.textContent = "🍎"; // Or use 🐭
    board.appendChild(foodElement);
}

// High Score
let hiscoreval = 0;
let hiscore = localStorage.getItem("hiscore");
if (hiscore !== null) {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High Score: " + hiscoreval;
} else {
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}

// Start Game
musicSound.play();
window.requestAnimationFrame(main);

// Controls
window.addEventListener('keydown', e => {
    if (e.key === "p" || e.key === "P") {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
        return;
    }

    if (isPaused) return;

    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});
