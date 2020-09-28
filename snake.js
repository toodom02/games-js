const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const width = 10;
const height = 10;
const radius = 2.5;

let keyPressed;
let snakeCentre;
let started = false;

let fruitX = Math.floor(Math.random() * (canvas.width - 2 * radius) + 2 * radius);
let fruitY = Math.floor(Math.random() * (canvas.height - 2 * radius) + 2 * radius);

let score = 0

// starts snake in centre
const snake = [[canvas.width / 2, canvas.height / 2]];

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 40 && keyPressed != 'up') {
        keyPressed = 'down';
    }
    else if (e.keyCode === 39 && keyPressed != 'left') {
        keyPressed = 'right';
    }
    else if (e.keyCode === 38 && keyPressed != 'down') {
        keyPressed = 'up';
    }
    else if (e.keyCode === 37 && keyPressed != 'right') {
        keyPressed = 'left';
    }
    else if (e.keyCode === 32 && started === false) {
        started = true
        draw();
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawFruit() {
    ctx.beginPath();
    ctx.arc(fruitX, fruitY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#‎FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawSnake() {
    ctx.fillStyle = "#00FF00";
    for (part of snake) {
        ctx.fillRect(part[0], part[1], width, height);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFruit();
    drawScore();


    if (snake[0][1] < 0 || snake[0][1] > canvas.height - height || snake[0][0] < 0 || snake[0][0] > canvas.width - width) {
        alert("GAME OVER");
        document.location.reload();
    }
    else {
        // end game is collides with self
        for (part of snake.slice(1)) {
            if (part[0] === snake[0][0] && part[1] === snake[0][1]) {
                alert("GAME OVER");
                document.location.reload();
            }
        }

        // co-ords of positions fall through array
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i][0] = snake[i - 1][0];
            snake[i][1] = snake[i - 1][1];
        }

        snakeCentre = [snake[0][0] + width / 2, snake[0][1] + height / 2];

        // checks if apple touched
        if (Math.abs(snakeCentre[0] - fruitX) <= width / 2 + radius && Math.abs(snakeCentre[1] - fruitY) <= height / 2 + radius) {
            snake.push([null, null]);
            fruitX = Math.floor(Math.random() * (canvas.width - 2 * radius) + 2 * radius);
            fruitY = Math.floor(Math.random() * (canvas.height - 2 * radius) + 2 * radius);
            score += 1
        }


        switch (keyPressed) {
            case 'right':
                score > 1 ? snake[0][0] += score : snake[0][0] += 1;
                break;
            case 'left':
                score > 1 ? snake[0][0] -= score : snake[0][0] -= 1;
                break;
            case 'up':
                score > 1 ? snake[0][1] -= score : snake[0][1] -= 1;
                break;
            case 'down':
                score > 1 ? snake[0][1] += score : snake[0][1] += 1;
                break;
            default:
                keyPressed = 'right';
        }
    }
    requestAnimationFrame(draw);
}

function menu() {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("SNAKE.JS", canvas.width / 2, canvas.height / 3);

    ctx.fillText("Press SPACEBAR to start", canvas.width / 2, 2 * canvas.height / 3);



    //draw();

}

menu();