
function getCoords(x, y) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height,  // relationship bitmap vs. element for Y
        canvasX = (x - rect.left) * scaleX, // scale mouse coordinates after 
        canvasY = (y - rect.top) * scaleY; // they have been adjusted to be relative to element
    return [canvasX, canvas.height - canvasY]; // inverted Y so it goes bottom up ( match board)
}

function onClick(e) {
    const [x, y] = getCoords(e.clientX, e.clientY);
    if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
        const xsq = Math.floor(x / res);
        const ysq = Math.floor(y / res);
        const index = ysq * 8 + xsq;
        if (selectedSquare && possibleMove(index)) makeMove(selectedSquare, index);
        else selectSquare(index);
    }
}

function startCapturingInput() {
    window.addEventListener('click', onClick);
}

function stopCapturingInput() {
    window.removeEventListener('click', onClick);
}