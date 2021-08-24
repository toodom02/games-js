
const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const pieces = {
    'k': "king", 'p': "pawn", 'n': "knight",
    'b': "bishop", 'r': "rook", 'q': "queen"
}

const isCharDigit = n => Boolean(++n);

function loadFromFen(inputFen) {
    const fenString = inputFen.split(' ');
    const fen = fenString[0];
    let col = 0, row = 7;
    for (symbol of fen) {
        if (symbol == '/') {
            col = 0;
            row--;
        } else if (isCharDigit(symbol)) {
            col += parseInt(symbol);
        } else {
            let pieceColour = symbol == symbol.toUpperCase() ? "white" : "black";
            let pieceType = pieces[symbol.toLowerCase()];
            board[row * 8 + col] = new Piece(pieceType, pieceColour);
            col++;
        }
    }
    whiteToMove = fenString[1] === 'w';
}