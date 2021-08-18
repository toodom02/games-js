document.addEventListener("keydown", keyDownHandler);
const flagButton = document.getElementById('flag-button');
let flag = false;

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
            scaleY = canvas.height / rect.height,  // relationship bitmap vs. element for Y
            canvasX = (e.clientX - rect.left) * scaleX, // scale mouse coordinates after 
            canvasY = (e.clientY - rect.top) * scaleY; // they have been adjusted to be relative to element

        if (flag) handleFlagInput(canvasX, canvasY);
        else handleMineInput(canvasX, canvasY);
    }
}

function handleMineInput(x, y) {
    if (x < canvas.width && y < canvas.height) {
        const xsq = Math.floor(x / res);
        const ysq = Math.floor(y / res);
        if (grid[xsq][ysq] == 0) {
            grid[xsq][ysq] = 1;
            if (hasMine(xsq, ysq)) gameOver();
            else if (neighbours[xsq][ysq] == 0) clearZeros(xsq, ysq);
            draw();
        }
    }
}

function handleFlagInput(x, y) {
    if (x < canvas.width && y < canvas.height) {
        const xsq = Math.floor(x / res);
        const ysq = Math.floor(y / res);
        if (grid[xsq][ysq] == 0) {
            grid[xsq][ysq] = 2;
            flags += 1;
        }
        else if (grid[xsq][ysq] == 2) {
            grid[xsq][ysq] = 0;
            flags -= 1;
        }
        draw();
    }
}

function clearZeros(x, y) {
    for (let i = - 1; i < 2; i++) {
        for (let j = - 1; j < 2; j++) {
            if (!(j == 0 && i == 0) && x + i < cols && x + i >= 0
                && y + j < rows && y + j >= 0) {
                if (!hasMine(x + i, y + j) && grid[x + i][y + j] == 0) {
                    if (neighbours[x + i][y + j] != 0) {
                        grid[x + i][y + j] = 1;
                    }
                    else {
                        grid[x + i][y + j] = 1;
                        clearZeros(x + i, y + j);
                    }
                }
            }
        }
    }
}

function flagClicked() {
    if (!started) {
        startGame(); return;
    }
    flagButton.checked = !flagButton.checked;
    if (flagButton.checked) {
        flagButton.innerHTML = "FLAG";
        flag = true;
    }
    else {
        flagButton.innerHTML = "MINE";
        flag = false;
    }
}