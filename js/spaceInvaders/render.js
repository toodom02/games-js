const canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "black";
const ctx = canvas.getContext("2d");

const playerHeight = 10;
const playerWidth = 20;
let playerX;
const playerY = canvas.height - playerHeight;

const invaderRowCount = 5;
const invaderColumnCount = 3;
const invaderWidth = 30;
const invaderHeight = 20;
const invaderPadding = 20;
const invaderOffsetTop = 30;
const invaderOffsetLeft = 30;

let cooldown;
let score;
let dx;
let stepdown;
let endText;

const shots = [];
const shotHeight = 10;
const shotWidth = 5;

let started = false;

const invaders = [];
const invader = new Image();
invader.src = './static/assets/spaceInvader.svg';


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
                                endText = "YOU WON!";
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

function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
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
                    endText = "GAME OVER";
                    gameOver();
                    return;
                }

                ctx.beginPath();
                ctx.drawImage(invader, invaderX, invaderY, invaderWidth, invaderHeight);
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
    ctx.fillText(endText, canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to restart", canvas.width / 2, 2 * canvas.height / 3);
}

menu();