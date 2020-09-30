const canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "black";
const ctx = canvas.getContext("2d");

const playerHeight = 10;
const playerWidth = 20;
let playerX;
const playerY = canvas.height - playerHeight;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

const invaderRowCount = 5;
const invaderColumnCount = 3;
const invaderWidth = 50;
const invaderHeight = 20;
const invaderPadding = 10;
const invaderOffsetTop = 30;
const invaderOffsetLeft = 30;

let cooldown;
let score;
let dx;
let stepdown;

const shots = [];
const shotHeight = 10;
const shotWidth = 5;

let started = false;

const invaders = [];

function startGame() {
    started = true;

    cooldown = 0;
    score = 0;
    dx = 1;
    stepdown = false;
    playerX = (canvas.width - playerWidth) / 2;

    for (let c = 0; c < invaderColumnCount; c++) {
        invaders[c] = [];
        for (let r = 0; r < invaderRowCount; r++) {
            invaders[c][r] = { x: (r * (invaderWidth + invaderPadding)) + invaderOffsetLeft, y: (c * (invaderHeight + invaderPadding)) + invaderOffsetTop, status: 1 };
        }
    }

    draw();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = true;
            break;
        case 68:
            rightPressed = true;
            break;
        case 37:
            leftPressed = true;
            break;
        case 65:
            leftPressed = true;
            break;
        case 32:
            if (cooldown <= 0) {
                spacePressed = true;
                cooldown = 50;
            }
            break;
    }
    if (e.keyCode === 32 && started === false) {
        startGame();
    }
}
function keyUpHandler(e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = false;
            break;
        case 68:
            rightPressed = false;
            break;
        case 37:
            leftPressed = false;
            break;
        case 65:
            leftPressed = false;
            break;
        case 32:
            spacePressed = false;
            break;
    }
}

function collisionDetection() {
    for (shot of shots) {
        if (shot.y + shotHeight <= 0) {
            const index = shots.indexOf(shot);
            shots.splice(index, 1);
        }
        else {
            for (let j = 0; j < invaderColumnCount; j++) {
                for (let k = 0; k < invaderRowCount; k++) {
                    const invader = invaders[j][k];
                    if (invader.status == 1) {
                        if (shot.y >= invader.y && shot.y <= invader.y + invaderHeight && shot.x >= invader.x && shot.x <= invader.x + invaderWidth) {
                            invader.status = 0;
                            const index = shots.indexOf(shot);
                            shots.splice(index, 1);
                            score++;
                            if (score === invaderRowCount * invaderColumnCount) {
                                gameOver();
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}
function drawShots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].y -= 2;
        const shotX = shots[i].x;
        const shotY = shots[i].y;
        ctx.beginPath();
        ctx.rect(shotX, shotY, shotWidth, shotHeight);
        ctx.fill();
        ctx.closePath();
    }
}
function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, canvas.height - playerHeight, playerWidth, playerHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}
function drawInvaders() {
    if (invaders[0][0].x < invaderOffsetLeft || invaders[0][invaderRowCount - 1].x + invaderWidth >= canvas.width - invaderOffsetLeft) {
        dx = -dx;
        stepdown = true;
    }
    for (let c = 0; c < invaderColumnCount; c++) {
        for (let r = 0; r < invaderRowCount; r++) {
            invaders[c][r].x += dx;
            if (stepdown) {
                invaders[c][r].y += 10;
            }
            if (invaders[c][r].status == 1) {

                const invaderX = invaders[c][r].x;
                const invaderY = invaders[c][r].y;

                if ((invaderY + invaderHeight >= playerY && invaderX >= playerX && invaderX <= playerX + playerWidth) ||
                    invaderY + invaderHeight >= canvas.height) {
                    gameOver();
                    return;
                }

                ctx.beginPath();
                ctx.rect(invaderX, invaderY, invaderWidth, invaderHeight);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    stepdown = false;
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 8, 20);
}
function draw() {
    if (started === false) {
        return;
    }
    else {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawInvaders();
        drawShots();
        drawPlayer();
        drawScore();

        collisionDetection();

        if (rightPressed && playerX < canvas.width - playerWidth) {
            playerX += 7;
        }
        else if (leftPressed && playerX > 0) {
            playerX -= 7;
        }

        if (spacePressed) {
            shots.push({ x: playerX - shotWidth / 2 + playerWidth / 2, y: playerY })
        }

        cooldown -= 1
        spacePressed = false;
        requestAnimationFrame(draw);
    }
}

function menu() {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("SPACEINVADERS.JS", canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to start", canvas.width / 2, 2 * canvas.height / 3);
}

function gameOver() {
    started = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();

    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to restart", canvas.width / 2, 2 * canvas.height / 3);
}

menu();