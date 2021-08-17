let keyPressed;

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if ((e.keyCode === 40 || e.keyCode === 83) && keyPressed != 'up') {
        e.preventDefault();
        keyPressed = 'down';
    }
    else if ((e.keyCode === 39 || e.keyCode === 68) && keyPressed != 'left') {
        e.preventDefault();
        keyPressed = 'right';
    }
    else if ((e.keyCode === 38 || e.keyCode === 87) && keyPressed != 'down') {
        e.preventDefault();
        keyPressed = 'up';
    }
    else if ((e.keyCode === 37 || e.keyCode === 65) && keyPressed != 'right') {
        e.preventDefault();
        keyPressed = 'left';
    }
    else if (e.keyCode === 32 && started === false) {
        e.preventDefault();
        startGame();
    }
}

function upButtonPressed() {
    if (!started) startGame();
    if (keyPressed != 'down') keyPressed = 'up';
}

function downButtonPressed() {
    if (!started) startGame();
    if (keyPressed != 'up') keyPressed = 'down';
}

function leftButtonPressed() {
    if (!started) startGame();
    if (keyPressed != 'right') keyPressed = 'left';
}

function rightButtonPressed() {
    if (!started) startGame();
    if (keyPressed != 'left') keyPressed = 'right';
}