document.addEventListener("keydown", keyDownHandler);
document.addEventListener("click", mouseClick);

function keyDownHandler(e) {
    if (e.keyCode === 32 && started === false) {
        e.preventDefault();
        startGame();
    }
}

function mouseClick(e) {
    if (started) {
        const rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        // scale mouse coordinates after they have been adjusted to be relative to element
        handleInput((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY)
    }
}

function handleInput(x, y) {
    if (x < canvas.width && y < canvas.height) {
        const xsq = Math.floor(x / res);
        const ysq = Math.floor(y / res);
        grid[xsq][ysq] = 1;
        draw();
    }
}
