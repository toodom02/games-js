let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function startCapturingInput() {
    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
}

function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
}

function onMouseInput(e) {
    userInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
    for (let i = 0; i < e.touches.length; i++) {
        userInput(e.touches[i].clientX, e.touches[i].clientY);
    }
}

function userInput(x, y) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height,  // relationship bitmap vs. element for Y
        canvasX = (x - rect.left) * scaleX, // scale mouse coordinates after 
        canvasY = (y - rect.top) * scaleY; // they have been adjusted to be relative to element

    if (canvasX >= 0 && canvasX <= canvas.width &&
        canvasY >= 0 && canvasY <= canvas.height) {
        if (canvasX > canvas.width / 2) paddleY = canvasY - paddleHeight / 2;
        else paddle2Y = canvasY - paddleHeight / 2;
    }
}

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