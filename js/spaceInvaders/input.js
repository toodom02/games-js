let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function startCapturingInput() {
    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseClick);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
}

function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseClick);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
}

function onMouseInput(e) {
    userInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
    userInput(e.touches[0].clientX, e.touches[0].clientY);
}

function getCoords(x, y) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height,  // relationship bitmap vs. element for Y
        canvasX = (x - rect.left) * scaleX, // scale mouse coordinates after 
        canvasY = (y - rect.top) * scaleY; // they have been adjusted to be relative to element
    return [canvasX, canvasY];
}

function onMouseClick(e) {
    if (cooldown <= 0) {
        [x, y] = getCoords(e.clientX, e.clientY);
        if (x >= 0 && x <= canvas.width &&
            y >= 0 && y <= canvas.height) {
            spacePressed = true;
            cooldown = 50;
            setTimeout(function () { spacePressed = false }, 20);
        }
    }
}

function userInput(x, y) {
    [canvasX, canvasY] = getCoords(x, y);

    if (canvasX >= 0 && canvasX <= canvas.width &&
        canvasY >= 0 && canvasY <= canvas.height) {
        playerX = canvasX;
    }
}

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