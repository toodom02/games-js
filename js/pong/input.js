let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 38:
            e.preventDefault();
            upPressed = true;
            break;
        case 40:
            e.preventDefault();
            downPressed = true;
            break;
        case 87:
            e.preventDefault();
            wPressed = true;
            break;
        case 83:
            e.preventDefault();
            sPressed = true;
            break;
    }
    if (e.keyCode === 32 && started === false) {
        e.preventDefault();
        startGame();
    }
    else if (e.keyCode === 27 && started === true) {
        endGame();
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

function upButtonPressed() {
    if (!started) startGame();
    upPressed = true;
    downPressed = false;
    setTimeout(function () { upPressed = false }, 100);
}

function downButtonPressed() {
    if (!started) startGame();
    downPressed = true;
    upPressed = false;
    setTimeout(function () { downPressed = false }, 100);
}

function wButtonPressed() {
    if (!started) startGame();
    wPressed = true;
    sPressed = false;
    setTimeout(function () { wPressed = false }, 100);
}

function sButtonPressed() {
    if (!started) startGame();
    sPressed = true;
    wPressed = false;
    setTimeout(function () { sPressed = false }, 100);
}