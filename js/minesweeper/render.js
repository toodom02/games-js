const canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "white";
const ctx = canvas.getContext("2d");

if (screen.availHeight > screen.availWidth) {
    canvas.width = 320;
    canvas.height = 480;
}

const res = 20
const cols = Math.floor(canvas.width / res)
const rows = Math.floor(canvas.height / res)
const numOfMines = 40;
let mines;
let grid;
let neighbours
let started = false;
let flags;

// images: Flaticon.com
const mineImg = new Image();
mineImg.src = './static/assets/bomb.svg';
const flagImg = new Image();
flagImg.src = './static/assets/flag.svg';

function startGame() {
    started = true;
    flags = 0;
    document.addEventListener("click", mouseClick);
    flagButton.innerHTML = "MINE";
    grid = makeArray(cols, rows);
    mines = [];
    neighbours = makeArray(cols, rows);
    placeMines();
    countNeighbours();
    draw();
}

function gameOver() {
    started = false;
    flagButton.innerHTML = "RESTART";
    document.removeEventListener("click", mouseClick);
    grid = makeArray(cols, rows, 1);
    draw();
}

function gameWon() {
    started = false;
    flagButton.innerHTML = "RESTART";
    document.removeEventListener("click", mouseClick);
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "DarkRed";
    ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to restart", canvas.width / 2, 2 * canvas.height / 3);
}

function makeArray(cols, rows, value = 0) {
    const x = new Array(cols);
    for (let i = 0; i < x.length; i++) {
        x[i] = new Array(rows).fill(value);
    }
    return x
}

function hasWon() {
    if (flags === numOfMines) {
        for (let i = 0; i < numOfMines; i++) {
            if (grid[mines[i][0]][mines[i][1]] != 2) return false;
        }
        return true;
    } else return false;
}

function countNeighbours() {
    for (let i = 0; i < numOfMines; i++) {
        for (let j = - 1; j < 2; j++) {
            for (let k = - 1; k < 2; k++) {
                if ((mines[i][0] + j) < cols && (mines[i][1] + k) < rows &&
                    (mines[i][0] + j) >= 0 && (mines[i][1] + k) >= 0) {
                    neighbours[mines[i][0] + j][mines[i][1] + k] += 1;
                }
            }
        }
        neighbours[mines[i][0]][mines[i][1]] -= 1;
    }
}

function hasMine(x, y) {
    for (let i = 0; i < mines.length; i++) {
        if (mines[i][0] === x && mines[i][1] === y) return true;
    }
    return false;
}

function placeMines() {
    for (let i = 0; i < numOfMines; i++) {
        let done = false;
        while (!done) {
            const rndCol = Math.floor(Math.random() * Math.floor(canvas.width / res));
            const rndRow = Math.floor(Math.random() * Math.floor(canvas.height / res));
            if (!hasMine(rndCol, rndRow)) {
                mines.push([rndCol, rndRow]);
                done = true;
            }
        }
    }
}

function menu() {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "DarkRed";
    ctx.fillText("MINESWEEPER.JS", canvas.width / 2, canvas.height / 3);
    ctx.fillText("Press SPACEBAR to start", canvas.width / 2, 2 * canvas.height / 3);
}

function getColour(num) {
    switch (num) {
        case 1:
            return "Blue";
        case 2:
            return "Green";
        case 3:
            return "Red";
        case 4:
            return "DarkBlue";
        case 5:
            return "DarkRed";
        case 6:
            return "DarkCyan";
        case 7:
            return "Black";
        case 8:
            return "DimGrey";
        default:
            return "Green"
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hasWon()) {
        gameWon();
        return;
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * res;
            let y = j * res;
            if (grid[i][j] == 1) {
                if (hasMine(i, j)) {
                    ctx.fillStyle = "LightGrey";
                    ctx.fillRect(x, y, res - 1, res - 1);
                    ctx.drawImage(mineImg, x, y, res - 1, res - 1);
                } else {
                    ctx.fillStyle = "LightGrey";
                    ctx.fillRect(x, y, res - 1, res - 1);
                    const neighs = neighbours[i][j];
                    if (neighs > 0) {
                        ctx.fillStyle = getColour(neighs);
                        ctx.font = "16px Arial";
                        ctx.fillText(neighbours[i][j], x + res / 2, y + res / 2 + 5);
                    }
                }
            } else if (grid[i][j] == 2) {
                ctx.fillStyle = "DarkGrey";
                ctx.fillRect(x, y, res - 1, res - 1);
                ctx.drawImage(flagImg, x, y, res - 1, res - 1);
            } else {
                ctx.fillStyle = "DarkGrey";
                ctx.fillRect(x, y, res - 1, res - 1);
            }
        }
    }

}

menu();