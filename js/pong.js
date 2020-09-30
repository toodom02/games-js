const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
let x;
let y;
let dx;
let dy;

const paddleHeight = 75;
const paddleWidth = 10;
const paddleX = canvas.width - paddleWidth - 10;
const paddle2X = paddleWidth + 10 - paddleWidth;
let paddleY;
let paddle2Y;

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

let score1;
let score2;

let started = false;

function startGame() {
    started = true;
    score1 = 0;
    score2 = 0;
    paddleY = paddle2Y = (canvas.height - paddleHeight) / 2;
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 2;
    dy = -2;
    draw();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 38:
            upPressed = true;
            break;
        case 40:
            downPressed = true;
            break;
        case 87:
            wPressed = true;
            break;
        case 83:
            sPressed = true;
            break;
    }
    if (e.keyCode === 32 && started === false) {
        startGame();
    }
    else if (e.keyCode === 27 && started === true) {
        started = false;
    }
}
function keyUpHandler(e) {
    switch (e.keyCode) {
        case 38:
            upPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        case 87:
            wPressed = false;
            break;
        case 83:
            sPressed = false;
            break;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.rect(paddle2X, paddle2Y, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}
function drawScore() {
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score1, canvas.width / 4, canvas.height / 3);
    ctx.fillText(score2, 3 * canvas.width / 4, canvas.height / 3);
    ctx.beginPath();
    ctx.setLineDash([canvas.height / 10]);
    ctx.moveTo(canvas.width / 2, [canvas.height / 20]);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScore();

    if (started === false) {
        ctx.font = "16px Arial";
        ctx.fillText("Press SPACEBAR to restart", canvas.width / 2, 2 * canvas.height / 3);
    }
    else {
        drawBall();
        drawPaddle();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {

            if (x + dx > canvas.width - ballRadius) {
                score1++;
            }
            else if (x + dx < ballRadius) {
                score2++;
            }

            x = canvas.width / 2;
            y = canvas.height / 2;
            dx < 0 ? dx = 2 : dx = -2;
            dy = -2;
            paddleY = (canvas.height - paddleHeight) / 2;
            paddle2Y = (canvas.height - paddleHeight) / 2;

        }

        else if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        else if (x + dx >= paddleX && y > paddleY && y < paddleY + paddleHeight || x + dx <= paddle2X + paddleWidth && y > paddle2Y && y < paddle2Y + paddleHeight) {
            dx = -dx;
            dx < 0 ? dx -= 1 : dx += 1;
        }

        if (downPressed && paddleY < canvas.height - paddleHeight) {
            paddleY += 7;
        }
        else if (upPressed && paddleY > 0) {
            paddleY -= 7;
        }
        if (sPressed && paddle2Y < canvas.height - paddleHeight) {
            paddle2Y += 7;
        }
        else if (wPressed && paddle2Y > 0) {
            paddle2Y -= 7;
        }

        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }
}

function menu() {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PONG.JS", canvas.width / 2, canvas.height / 3);

    ctx.fillText("Press SPACEBAR to start", canvas.width / 2, 2 * canvas.height / 3);

}

menu();