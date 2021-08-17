let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 39:
            e.preventDefault();
            rightPressed = true;
            break;
        case 68:
            e.preventDefault();
            rightPressed = true;
            break;
        case 37:
            e.preventDefault();
            leftPressed = true;
            break;
        case 65:
            e.preventDefault();
            leftPressed = true;
            break;
        case 32:
            if (cooldown <= 0) {
                e.preventDefault();
                spacePressed = true;
                cooldown = 50;
            }
            break;
    }
    if (e.keyCode === 32 && started === false) {
        e.preventDefault();
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

function lButtonPressed() {
    if (!started) startGame();
    leftPressed = true;
    setTimeout(function () { leftPressed = false }, 100);
}

function rButtonPressed() {
    if (!started) startGame();
    rightPressed = true;
    setTimeout(function () { rightPressed = false }, 100);
}

function sButtonPressed() {
    if (!started) startGame();
    if (cooldown <= 0) {
        spacePressed = true;
        cooldown = 50;
        setTimeout(function () { spacePressed = false }, 20);
    }
}