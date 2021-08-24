let possiblePos = [];
let selectedSquare;
const directionOffsets = [8, -8, -1, 1, 7, -7, 9, -9];
const distanceFromEdge = new Array(64);

function selectSquare(pos) {
    if (board[pos] == null) return;

    if (selectedSquare == pos) {
        selectedSquare = null;
        possiblePos = [];
    }
    else if ((board[pos].colour == "white" && whiteToMove) ||
        (board[pos].colour == "black" && !whiteToMove)) {
        selectedSquare = pos;
        findMoves(pos);
    }
    draw();
}

function calculateDistanceFromEdge() {
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const north = 7 - row;
            const east = 7 - col;
            const south = row;
            const west = col;

            // lines up with directionOffset
            distanceFromEdge[row * 8 + col] = [
                north, south, west, east,
                Math.min(north, west), Math.min(south, east),
                Math.min(north, east), Math.min(south, west)
            ]
        }
    }
}

function possibleMove(pos) {
    for (let i = 0; i < possiblePos.length; i++) {
        if (possiblePos[i] === pos) return true;
    }
    return false;
}

function makeMove(start, target) {
    const pieceTaken = board[target] ? board[target].type : null;
    board[start].first = false;
    board[target] = board[start];
    board[start] = null;
    whiteToMove = !whiteToMove;
    selectedSquare = null;
    possiblePos = [];
    draw();
    if (pieceTaken == "king") gameOver();
}

function findSlidingMoves(pos, piece) {
    const startDirIndex = piece.type == "bishop" ? 4 : 0;
    const endDirIndex = piece.type == "rook" ? 4 : 8;

    for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
        for (let n = 0; n < distanceFromEdge[pos][directionIndex]; n++) {
            const targetSquare = pos + directionOffsets[directionIndex] * (n + 1);

            if (board[targetSquare]) {
                if (board[targetSquare].colour === piece.colour) break;

                possiblePos.push(targetSquare);
                break;
            }
            possiblePos.push(targetSquare);
        }
    }
}

function findPawnMoves(pos) {
    const piece = board[pos];
    if (piece.colour === "white") {
        let targetSquare = pos + 8;
        if (targetSquare < 64 && !board[targetSquare]) possiblePos.push(targetSquare);
        targetSquare = pos + 16;
        if (piece.first && targetSquare < 64 && !board[targetSquare]) possiblePos.push(targetSquare);
        targetSquare = pos + 7;
        if (targetSquare < 64 && pos % 8 > 0 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            possiblePos.push(targetSquare);
        targetSquare = pos + 9;
        if (targetSquare < 64 && pos % 8 < 7 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            possiblePos.push(targetSquare);
    }
    else {
        let targetSquare = pos - 8;
        if (targetSquare >= 0 && !board[targetSquare]) possiblePos.push(targetSquare);
        targetSquare = pos - 16;
        if (piece.first && targetSquare >= 0 && !board[targetSquare]) possiblePos.push(targetSquare);
        targetSquare = pos - 7;
        if (targetSquare >= 0 && pos % 8 < 7 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            possiblePos.push(targetSquare);
        targetSquare = pos - 9;
        if (targetSquare >= 0 && pos % 8 > 0 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            possiblePos.push(targetSquare);
    }
}

function findKnightMoves(pos) {
    const piece = board[pos];
    let targetSquare = pos + 6;
    if (targetSquare < 64 && pos % 8 > 1 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 6;
    if (targetSquare >= 0 && pos % 8 < 6 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos + 10;
    if (targetSquare < 64 && pos % 8 < 6 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 10;
    if (targetSquare >= 0 && pos % 8 > 1 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos + 15;
    if (targetSquare < 64 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 15;
    if (targetSquare >= 0 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos + 17;
    if (targetSquare < 64 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 17;
    if (targetSquare >= 0 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
}

function findKingMoves(pos) {
    const piece = board[pos];
    let targetSquare = pos + 8;
    if (targetSquare < 64 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 8;
    if (targetSquare >= 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos + 1;
    if (pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 1;
    if (pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos + 7;
    if (targetSquare < 64 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 7;
    if (targetSquare >= 0 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos + 9;
    if (targetSquare < 64 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
    targetSquare = pos - 9;
    if (targetSquare >= 0 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        possiblePos.push(targetSquare);
}

function findMoves(pos) {
    let piece = board[pos];
    possiblePos = [];

    switch (piece.type) {
        case "king":
            findKingMoves(pos);
            break;
        case "pawn":
            findPawnMoves(pos);
            break;
        case "knight":
            findKnightMoves(pos);
            break;
        case "bishop":
        case "rook":
        case "queen":
            findSlidingMoves(pos, piece);
            break;
    }
}