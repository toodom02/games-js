document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

let aPressed, wPressed, dPressed, sPressed, spacePressed;

function onMouseInput(e) {
    [x, y] = getCoords(e.clientX, e.clientY);
    if (x > 0 && x < canvas.width && y > 0 && y < canvas.height)
        handleInput(x, y);
}

function onTouchInput(e) {
    const touch = e.touches[0];
    [x, y] = getCoords(touch.clientX, touch.clientY);
    if (x > 0 && x < canvas.width && y > 0 && y < canvas.height)
        handleInput(x, y);
}

function onTouchEnd() {
    wPressed = false;
}

function handleInput(x, y) {
    if (x > playerX) {
        angle = Math.atan((playerY - y) / (x - playerX));
    }
    else angle = Math.atan((playerY - y) / (x - playerX)) + Math.PI;
    wPressed = true;
}

function onClickInput(e) {
    if (cooldown <= 0) {
        [x, y] = getCoords(e.clientX, e.clientY);
        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
            spacePressed = true;
            cooldown = 10;
        }
    }
}

function buttonClicked() {
    if (!started) startGame();
    else if (cooldown <= 0) {
        spacePressed = true;
        cooldown = 10;
    }
}

function getCoords(x, y) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height,  // relationship bitmap vs. element for Y
        canvasX = (x - rect.left) * scaleX, // scale mouse coordinates after 
        canvasY = (y - rect.top) * scaleY; // they have been adjusted to be relative to element
    return [canvasX, canvasY];
}

function startCapturingInput() {
    window.addEventListener('click', onClickInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
    window.addEventListener('touchend', onTouchEnd);
}

function stopCapturingInput() {
    window.removeEventListener('click', onClickInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
    window.removeEventListener('touchend', onTouchEnd);
}

function keyDownHandler(e) {
    if (e.keyCode === 32 && started === false) {
        e.preventDefault();
        startGame();
        return;
    }
    switch (e.keyCode) {
        case 87: // W
            e.preventDefault();
            wPressed = true;
            break;
        case 68: // D
            e.preventDefault();
            dPressed = true;
            break;
        case 83: // S
            e.preventDefault();
            sPressed = true;
            break;
        case 65: // A
            e.preventDefault();
            aPressed = true;
            break;
        case 32: // SPACE
            e.preventDefault();
            if (cooldown < 0) {
                spacePressed = true;
                cooldown = 10;
            }
            break;
    }
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 87:
            wPressed = false;
            break;
        case 68:
            dPressed = false;
            break;
        case 83:
            sPressed = false;
            break;
        case 65:
            aPressed = false;
            break;
        case 32:
            spacePressed = false;
            break;
    }
}