const startButton = document.getElementById('start-button');
const queenButton = document.getElementById('queen-button');
const rookButton = document.getElementById('rook-button');
const bishopButton = document.getElementById('bishop-button');
const knightButton = document.getElementById('knight-button');


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
        if (selectedSquare != null && selectableMove(index)) makeMove(selectedSquare, index);
        else selectSquare(index);
    }
}

function buttonClicked() {
    if (!started) {
        startGame();
        startButton.hidden = true;
        startButton.removeEventListener('click', buttonClicked);
    }
}

function queenClicked() {
    board[pawnPromotion] = new Piece("queen", board[pawnPromotion].colour, false);
    stopCapturingPawnPromotion();
}
function rookClicked() {
    board[pawnPromotion] = new Piece("rook", board[pawnPromotion].colour, false);
    stopCapturingPawnPromotion();
}
function bishopClicked() {
    board[pawnPromotion] = new Piece("bishop", board[pawnPromotion].colour, false);
    stopCapturingPawnPromotion();
}
function knightClicked() {
    board[pawnPromotion] = new Piece("knight", board[pawnPromotion].colour, false);
    stopCapturingPawnPromotion();
}

function startCapturePawnPromotion() {
    stopCapturingInput();
    queenButton.hidden = false;
    rookButton.hidden = false;
    bishopButton.hidden = false;
    knightButton.hidden = false;
    queenButton.addEventListener('click', queenClicked);
    rookButton.addEventListener('click', rookClicked);
    bishopButton.addEventListener('click', bishopClicked);
    knightButton.addEventListener('click', knightClicked);
}

function stopCapturingPawnPromotion() {
    pawnPromotion = null;
    queenButton.hidden = true;
    rookButton.hidden = true;
    bishopButton.hidden = true;
    knightButton.hidden = true;
    queenButton.removeEventListener('click', queenClicked);
    rookButton.removeEventListener('click', rookClicked);
    bishopButton.removeEventListener('click', bishopClicked);
    knightButton.removeEventListener('click', knightClicked);
    startCapturingInput();
    draw();
}

function startCapturingInput() {
    window.addEventListener('click', onClick);
}

function stopCapturingInput() {
    window.removeEventListener('click', onClick);
}