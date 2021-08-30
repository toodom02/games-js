const canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "black";
const ctx = canvas.getContext("2d");
const shootButton = document.getElementById("shoot-button");

function checkOrientation() {
    if (screen.availHeight > screen.availWidth) {
        canvas.width = 320;
        canvas.height = 480;
    }
}

let started = false;
let angle;
let score;
let playerX, playerY;
let cooldown;
const playerWidth = 25;
const playerHeight = 22;
let bullet = [];
const bulletRad = 2;
let asteroid = [];
let accel;

const shipImg = new Image();
shipImg.src = './static/assets/ship.svg';
const asteroidImg = new Image();
asteroidImg.src = './static/assets/asteroid.svg';

function startGame() {
    started = true;
    shootButton.innerHTML = "SHOOT";
    wPressed = sPressed = aPressed = dPressed = false;
    score = 0;
    cooldown = 0;
    bullet = []; asteroid = [];
    accel = 0;
    angle = Math.PI / 2; // start vertically up
    playerX = (canvas.width - playerWidth) / 2;
    playerY = (canvas.height - playerHeight) / 2;
    startCapturingInput();
    draw();
}

function drawPlayer() {
    ctx.save();
    ctx.translate(playerX + playerWidth / 2, playerY + playerHeight / 2);
    ctx.rotate(-angle);
    ctx.translate(-playerX - playerWidth / 2, -playerY - playerHeight / 2);
    ctx.drawImage(shipImg, playerX, playerY, playerWidth, playerHeight);
    ctx.restore();
}

function drawBullets() {
    for (let i = 0; i < bullet.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = "orange";
        ctx.arc(bullet[i].x, bullet[i].y, bulletRad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        bullet[i].x += (Math.PI) * Math.cos(bullet[i].angle);
        bullet[i].y -= (Math.PI) * Math.sin(bullet[i].angle);

        if (bullet[i].x > canvas.width || bullet[i].x + bulletRad < 0 ||
            bullet[i].y > canvas.height || bullet[i].y + bulletRad < 0)
            bullet.splice(i, 1);
    }
}

function drawAsteroids() {
    for (let i = 0; i < asteroid.length; i++) {
        const ast = asteroid[i]

        ctx.save();
        ctx.translate(ast.x + ast.rad / 2, ast.y + ast.rad / 2);
        ctx.rotate(-ast.angle);
        ctx.translate(-ast.x - ast.rad / 2, -ast.y - ast.rad / 2);
        ctx.drawImage(asteroidImg, ast.x, ast.y, ast.rad, ast.rad);
        ctx.restore();

        asteroid[i].x += (Math.PI / 8) * Math.cos(ast.angle);
        asteroid[i].y -= (Math.PI / 8) * Math.sin(ast.angle);

        if (asteroid[i].x > canvas.width || asteroid[i].x + asteroid[i].rad < 0 ||
            asteroid[i].y > canvas.height || asteroid[i].y + asteroid[i].rad < 0)
            asteroid.splice(i, 1);

        // if player collides with asteroid
        if (collisionDetection(playerX, playerY, playerWidth, playerHeight, ast.x, ast.y, ast.rad - 5, ast.rad - 5)) {
            gameOver();
            return;
        }

        // if bullet collides with asteroid
        for (let j = 0; j < bullet.length; j++) {
            if (collisionDetection(bullet[j].x, bullet[j].y, bulletRad, bulletRad, ast.x, ast.y, ast.rad, ast.rad)) {
                asteroid.splice(i, 1);
                bullet.splice(j, 1);
                score += 1;
            }
        }

    }
}

function makeAsteroid() {
    const angle = 2 * Math.PI * Math.random();
    const rad = 50 * Math.random() + 20;
    let x, y;

    if (angle < Math.PI / 4) {
        x = - rad;
        y = Math.random() * canvas.height / 2 + canvas.height / 2;
    }
    else if (angle < Math.PI / 2) {
        x = Math.random() * canvas.width / 2;
        y = canvas.height;
    }
    else if (angle < 3 * Math.PI / 4) {
        x = Math.random() * canvas.width / 2 + canvas.width / 2;
        y = canvas.height;
    }
    else if (angle < Math.PI) {
        x = canvas.width;
        y = Math.random() * canvas.height / 2 + canvas.height / 2;
    }
    else if (angle < 5 * Math.PI / 4) {
        x = canvas.width;
        y = Math.random() * canvas.height / 2;
    }
    else if (angle < 3 * Math.PI / 2) {
        x = Math.random() * canvas.width / 2 + canvas.width / 2;
        y = -rad;
    }
    else if (angle < 7 * Math.PI / 4) {
        x = Math.random() * canvas.width / 2;
        y = -rad;
    }
    else {
        x = -rad;
        y = Math.random() * canvas.height / 2;
    }
    asteroid.push({ x: x, y: y, angle: angle, rad: rad });
}

function collisionDetection(x, y, w, h, x2, y2, w2, h2) {
    if (y + h >= y2 && y <= y2 + h2 && x + w >= x2 && x <= x2 + w2) {
        return true;
    }
    return false;
}

function checkBoundary(moveX, moveY) {
    const margin = -1;
    if (playerX + moveX > 0 + margin && playerX + moveX + playerWidth < canvas.width - margin &&
        playerY - moveY > 0 + margin && playerY - moveY + playerHeight < canvas.height - margin)
        return true;
    return false;
}

function drawScore() {
    ctx.font = "256px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "DarkSlateGrey";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);
}

function draw() {
    if (!started) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawBullets();
    drawPlayer();
    drawAsteroids();

    if (asteroid.length < (3 + score / 2) && ((Math.random() * (80 - score) <= 0.5) ? true : false)) makeAsteroid();
    else if (asteroid.length < 2) makeAsteroid();

    if (aPressed) angle += Math.PI / 32;
    else if (dPressed) angle -= Math.PI / 64;
    let forwardX = wPressed ? (accel / 10 + Math.PI / 2) * Math.cos(angle) : accel / 4 * Math.cos(angle);
    let forwardY = wPressed ? (accel / 10 + Math.PI / 2) * Math.sin(angle) : accel / 4 * Math.sin(angle);
    let backwardX = sPressed ? (accel / 10 - (Math.PI / 3)) * Math.cos(angle) : accel / 4 * Math.cos(angle);
    let backwardY = sPressed ? (accel / 10 - (Math.PI / 3)) * Math.sin(angle) : accel / 4 * Math.sin(angle);

    if ((wPressed || accel > 0) && checkBoundary(forwardX, forwardY)) {
        playerX += forwardX;
        playerY -= forwardY;
        if (wPressed && accel < 10) accel++;
    }
    else if ((sPressed || accel < 0) && checkBoundary(backwardX, backwardY)) {
        playerX += backwardX;
        playerY -= backwardY;
        if (sPressed && accel > -5) accel--;
    }

    if (!wPressed && accel > 0) accel--
    else if (!sPressed && accel < 0) accel++;

    if (spacePressed) {
        bullet.push({
            x: playerX - bulletRad / 2 + playerWidth / 2,
            y: playerY - bulletRad / 2 + playerHeight / 2,
            angle: angle
        })
    }

    cooldown -= 1
    spacePressed = false
    requestAnimationFrame(draw);
}

function menu() {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("ASTEROIDS.JS", canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to start", canvas.width / 2, 2 * canvas.height / 3);
}

function gameOver() {
    started = false;
    stopCapturingInput();
    shootButton.innerHTML = "START";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to restart", canvas.width / 2, 2 * canvas.height / 3);
}

checkOrientation();
menu();