const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const res = canvas.width / 8;
let board;
let fenString;
let whiteToMove;

const pieceImg = new Image();
pieceImg.src = "./static/assets/ChessPieces.png";

class Piece {
    constructor(type, colour) {
        this.type = type;
        this.colour = colour;
        this.first = true;
        this.sWidth = 2000 / 6;
        this.sHeight = 334;
        this.sy = (this.colour === "white") ? 0 : 334;

        switch (this.type) {
            case "king":
                this.sx = 0;
                break;
            case "pawn":
                this.sx = this.sWidth * 5;
                break;
            case "knight":
                this.sx = this.sWidth * 3;
                break;
            case "bishop":
                this.sx = this.sWidth * 2;
                break;
            case "rook":
                this.sx = this.sWidth * 4;
                break;
            case "queen":
                this.sx = this.sWidth;
                break;
        }
    }
}

function startGame() {
    fenString = startingFen;
    board = makeBoard();
    startCapturingInput();
    loadFromFen(fenString);
    draw();
}

function gameOver() {
    const winner = whiteToMove ? "BLACK" : "WHITE";
    stopCapturingInput();
    ctx.font = "bold 116px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "DarkSlateGray";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.fillText(winner + " WINS", canvas.width / 2, 5 * canvas.height / 8);
}

function makeBoard() {
    const x = new Array(64).fill(null);
    return x
}

function drawBoard() {
    let count = 1;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let x = i * res;
            let y = canvas.height - (j + 1) * res;
            let pos = j * 8 + i;
            let square = board[pos];
            if (pos == selectedSquare) ctx.fillStyle = "DarkOrange";
            else if (possibleMove(pos)) ctx.fillStyle = count % 2 == 0 ? "Salmon" : "FireBrick";
            else ctx.fillStyle = count % 2 == 0 ? "Tan" : "SaddleBrown";
            ctx.fillRect(x, y, res, res);
            if (square) {
                ctx.drawImage(pieceImg, square.sx, square.sy, square.sWidth, square.sHeight, x, y, res, res);
            }
            count++;
        }
        count++;
    }

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
}


calculateDistanceFromEdge()
pieceImg.onload = function () {
    startGame();
};

