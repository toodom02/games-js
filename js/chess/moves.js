let possiblePos = [];
let selectablePos = [];
let selectedSquare = null;
let castlePossible = false;
let enpassant = null;
let pawnPromotion = null;
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
        castlePossible = false;
        selectedSquare = pos;
        possiblePos = findMoves(pos);
    }
    selectablePos = [...possiblePos];
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

function selectableMove(pos) {
    for (let i = 0; i < selectablePos.length; i++) {
        if (selectablePos[i] === pos) return true;
    }
    return false;
}

function makeMove(start, target) {
    const pieceTaken = board[target] ? board[target].type : null;

    // en passant
    if (target === enpassant) {
        if (whiteToMove) board[target - 8] = null;
        else board[target + 8] = null
    }

    // setup enpassant for next move
    if (board[start].type === "pawn" && board[start].first && Math.abs(target - start) === 16) {
        enpassant = whiteToMove ? target - 8 : target + 8;
    } else enpassant = null;

    // move rook if castling
    if (castlePossible) {
        if (target === 2 || target === 58) {
            board[target + 1] = board[target - 2];
            board[target - 2] = null;
        }
        else if (target === 6 || target === 62) {
            board[target - 1] = board[target + 1];
            board[target + 1] = null;
        }
    }

    // move piece
    board[start].first = false;
    board[target] = board[start];
    board[start] = null;

    // pawn promotion
    if (board[target].type === "pawn") {
        if (target < 8 || target > 55) {
            pawnPromotion = target;
        }
    }

    whiteToMove = !whiteToMove;
    selectedSquare = null;
    possiblePos = [];
    selectablePos = [];
    isInCheck = inCheck();
    draw();
    if (pieceTaken === "king") gameOver();
}

function inCheck() {
    let opponentMoves = [];
    let kingPos = [];
    for (let i = 0; i < 64; i++) {
        const piece = board[i];
        if (piece) {
            // find kings
            if (piece.type === "king") kingPos.push(i);
            // find all opponents possible moves
            else opponentMoves = opponentMoves.concat(findMoves(i));
        }
    }
    // can king be taken?
    for (let i = 0; i < opponentMoves.length; i++) {
        for (let j = 0; j < kingPos.length; j++) {
            if (opponentMoves[i] === kingPos[j]) return true;
        }
    }
    return false;
}

function findSlidingMoves(pos, piece) {
    const startDirIndex = piece.type == "bishop" ? 4 : 0;
    const endDirIndex = piece.type == "rook" ? 4 : 8;
    let slidingMoves = [];

    for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
        for (let n = 0; n < distanceFromEdge[pos][directionIndex]; n++) {
            const targetSquare = pos + directionOffsets[directionIndex] * (n + 1);

            if (board[targetSquare]) {
                if (board[targetSquare].colour === piece.colour) break;

                slidingMoves.push(targetSquare);
                break;
            }
            slidingMoves.push(targetSquare);
        }
    }
    return slidingMoves;
}

function findPawnMoves(pos) {
    const piece = board[pos];
    let pawnMoves = [];
    if (piece.colour === "white") {
        let targetSquare = pos + 8;
        if (targetSquare < 64 && !board[targetSquare])
            pawnMoves.push(targetSquare);
        targetSquare = pos + 16;
        if (piece.first && targetSquare < 64 && !board[targetSquare] && !board[targetSquare - 8])
            pawnMoves.push(targetSquare);
        targetSquare = pos + 7;
        if (targetSquare < 64 && pos % 8 > 0 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            pawnMoves.push(targetSquare);
        targetSquare = pos + 9;
        if (targetSquare < 64 && pos % 8 < 7 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            pawnMoves.push(targetSquare);
        if (enpassant != null && (pos + 9 === enpassant || pos + 7 === enpassant))
            pawnMoves.push(enpassant);
    }
    else {
        let targetSquare = pos - 8;
        if (targetSquare >= 0 && !board[targetSquare])
            pawnMoves.push(targetSquare);
        targetSquare = pos - 16;
        if (piece.first && targetSquare >= 0 && !board[targetSquare] && !board[targetSquare + 8])
            pawnMoves.push(targetSquare);
        targetSquare = pos - 7;
        if (targetSquare >= 0 && pos % 8 < 7 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            pawnMoves.push(targetSquare);
        targetSquare = pos - 9;
        if (targetSquare >= 0 && pos % 8 > 0 && board[targetSquare] && board[targetSquare].colour != piece.colour)
            pawnMoves.push(targetSquare);
        if (enpassant != null && (pos - 9 === enpassant || pos - 7 === enpassant))
            pawnMoves.push(enpassant);
    }
    return pawnMoves;
}

function findKnightMoves(pos) {
    const piece = board[pos];
    let knightMoves = []
    let targetSquare = pos + 6;
    if (targetSquare < 64 && pos % 8 > 1 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos - 6;
    if (targetSquare >= 0 && pos % 8 < 6 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos + 10;
    if (targetSquare < 64 && pos % 8 < 6 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos - 10;
    if (targetSquare >= 0 && pos % 8 > 1 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos + 15;
    if (targetSquare < 64 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos - 15;
    if (targetSquare >= 0 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos + 17;
    if (targetSquare < 64 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    targetSquare = pos - 17;
    if (targetSquare >= 0 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        knightMoves.push(targetSquare);
    return knightMoves;
}

function findKingMoves(pos) {
    const piece = board[pos];
    let kingMoves = [];
    let targetSquare = pos + 8;
    if (targetSquare < 64 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos - 8;
    if (targetSquare >= 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos + 1;
    if (pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos - 1;
    if (pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos + 7;
    if (targetSquare < 64 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos - 7;
    if (targetSquare >= 0 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos + 9;
    if (targetSquare < 64 && pos % 8 < 7 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);
    targetSquare = pos - 9;
    if (targetSquare >= 0 && pos % 8 > 0 && (board[targetSquare] ? board[targetSquare].colour != piece.colour : true))
        kingMoves.push(targetSquare);

    // white castle
    if (piece.colour === "white" && piece.first) {
        if (board[7] && board[7].first && !board[5] && !board[6]) {
            kingMoves.push(6);
            castlePossible = true;
        }
        if (board[0] && board[0].first && !board[1] && !board[2] && !board[3]) {
            kingMoves.push(2);
            castlePossible = true;
        }
    }

    // black castle
    if (piece.colour === "black" && piece.first) {
        if (board[56] && board[56].first && !board[57] && !board[58] && !board[59]) {
            kingMoves.push(58);
            castlePossible = true;
        }
        if (board[63] && board[63].first && !board[62] && !board[61]) {
            kingMoves.push(62);
            castlePossible = true;
        }
    }

    return kingMoves;
}

function findMoves(pos) {
    let piece = board[pos];
    let foundMoves = [];

    switch (piece.type) {
        case "king":
            foundMoves = findKingMoves(pos);
            break;
        case "pawn":
            foundMoves = findPawnMoves(pos);
            break;
        case "knight":
            foundMoves = findKnightMoves(pos);
            break;
        case "bishop":
        case "rook":
        case "queen":
            foundMoves = findSlidingMoves(pos, piece);
            break;
    }
    return foundMoves;
}