const canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "white";
const ctx = canvas.getContext("2d");

const res = 24
const cols = Math.floor(canvas.width / res)
const rows = Math.floor(canvas.height / res)
const numOfMines = 50;
let mines = [];
let grid;
let neighbours
let started = false;

function startGame() {
    started = true;
    grid = makeArray(cols, rows);
    neighbours = makeArray(cols, rows);
    placeMines();
    countNeighbours();
    draw();
}

function makeArray(cols, rows) {
    const x = new Array(cols);
    for (let i = 0; i < x.length; i++) {
        x[i] = new Array(rows).fill(0);
    }
    return x
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

function arrayAlreadyHasArray(arr, subarr) {
    for (var i = 0; i < arr.length; i++) {
        let checker = false
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === subarr[j]) {
                checker = true
            } else {
                checker = false
                break;
            }
        }
        if (checker) {
            return true
        }
    }
    return false
}

function placeMines() {
    for (let i = 0; i < numOfMines; i++) {
        let done = false;
        while (!done) {
            const rndCol = Math.floor(Math.random() * Math.floor(canvas.width / res));
            const rndRow = Math.floor(Math.random() * Math.floor(canvas.height / res));
            if (!arrayAlreadyHasArray(mines, [rndCol, rndRow])) {
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * res;
            let y = j * res;
            if (grid[i][j] == 1) {
                if (arrayAlreadyHasArray(mines, [i, j])) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(x, y, res - 1, res - 1);

                } else {
                    ctx.fillStyle = "LightGrey";
                    ctx.fillRect(x, y, res - 1, res - 1);
                    const neighs = neighbours[i][j];
                    if (neighs > 0) {
                        ctx.fillStyle = "green";
                        ctx.fillText(neighbours[i][j], x + res / 2, y + res / 2 + 5);
                    }
                }
            }
            else {
                ctx.fillStyle = "DarkGrey";
                ctx.fillRect(x, y, res - 1, res - 1);
            }
        }
    }

}

menu();