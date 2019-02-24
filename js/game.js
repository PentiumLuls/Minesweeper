const cellSize = 40;
let canvasWidth;
let canvasHeight;
let size;
let minesAmount;
let isGameOver;
let difficulty = 2;
let grid;

function run() {
    setup();
    const canvas = document.getElementById('canvas');
    canvas.addEventListener("mouseup", handleCanvasClick, false);
    draw();
}

function setup() {
    switch (difficulty) {
        case 1: {
            canvasWidth = cellSize * 5;
            canvasHeight = cellSize * 5;
            minesAmount = 3;
            size = {cols: canvasWidth / cellSize, rows: canvasHeight / cellSize};
            break;
        }
        case 2: {
            canvasWidth = cellSize * 10;
            canvasHeight = cellSize * 10;
            minesAmount = 15;
            size = {cols: canvasWidth / cellSize, rows: canvasHeight / cellSize};
            break;
        }
        case 3: {
            canvasWidth = cellSize * 20;
            canvasHeight = cellSize * 15;
            minesAmount = 50;
            size = {cols: canvasWidth / cellSize, rows: canvasHeight / cellSize};
            break;
        }
    }
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    grid = create2DArray(size);
    isGameOver = false;
    for(var x = 0; x < size.cols; x++) {
        for (var y = 0; y < size.rows; y++) {
            grid[x][y] = new Cell(x * cellSize, y * cellSize);
        }
    }
    generateField();
}

function draw() {
    const canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    for(var x = 0; x < size.cols; x++) {
        for (var y = 0; y < size.rows; y++) {
            grid[x][y].draw(ctx, cellSize);
        }
    }
}

function handleDifficulty() {
    if (document.getElementById('r1').checked) {
        difficulty = 1;
    }
    else if (document.getElementById('r2').checked) {
        difficulty = 2;
    }
    else if (document.getElementById('r3').checked) {
        difficulty = 3;
    }
}

function handleCanvasClick(event) {
    btnCode = event.button;

    const x = event.offsetX;
    const y = event.offsetY;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);

    if (btnCode === 0) {
        //LEFT CLICK
        if (grid[cellX][cellY].flagged || grid[cellX][cellY].opened) {
            //DO NOTHING
        } else if (grid[cellX][cellY].type === mine) {
            grid[cellX][cellY].opened = true;
            gameOver(cellX, cellY);
        } else if (grid[cellX][cellY].type === empty) {
            grid[cellX][cellY].opened = true;
            reveal(cellX, cellY);
        } else {
            //ANY NUMBER
            grid[cellX][cellY].opened = true;
        }
    }
    else if (btnCode === 2) {
        //RIGHT CLICK
        if (grid[cellX][cellY].opened === false) {
            grid[cellX][cellY].flagged = !grid[cellX][cellY].flagged;
        }
    }
    draw();
    validateGameEnd();
}

function drawGameEnd() {
    const canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "24px Georgia";
    if (isGameOver) {
        ctx.fillText('~GAME OVER~', canvasWidth / 2 - ctx.measureText('~GAME OVER~').width / 2, canvasHeight / 3);
    } else {
        ctx.fillText('~CONGRATULATION~', canvasWidth / 2 - ctx.measureText('~CONGRATULATION~').width / 2, canvasHeight / 3);
    }
}

function validateGameEnd() {
    var ended = true;
    for(var x = 0; x < size.cols; x++) {
        for (var y = 0; y < size.rows; y++) {
            if (!grid[x][y].opened && grid[x][y].type !== mine) {
                ended = false;
                break;
            }
        }
    }
    if (ended && !isGameOver) {
        console.log("WIN!!!");
        drawGameEnd();
    } else if (isGameOver) {
        console.log('GAME OVER');
        drawGameEnd();
    }
}

function reveal(cellX, cellY) {
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                const i = cellX + x;
                const j = cellY + y;
                if (i > -1 && i < size.cols && j > -1 && j < size.rows) {
                    revealNextCell(i, j);
                }
            }
        }
}

function revealNextCell(x, y) {
    if (grid[x][y].opened) return;
    if (grid[x][y].type === empty) {
        grid[x][y].opened = true;
        reveal(x, y);
    }
    else {
        grid[x][y].opened = true;
    }
}

function gameOver(cellX, cellY) {
    for(var x = 0; x < size.cols; x++) {
        for (var y = 0; y < size.rows; y++) {
            grid[x][y].opened = true;
            if (grid[x][y].flagged && grid[x][y].type === mine) {
                grid[x][y].type = disabledMine;
            }
        }
    }
    grid[cellX][cellY].type = explodedMine;
    isGameOver = true;
}

function generateField() {
    //PLACE MINES
    for (var i = 0; i < minesAmount; i++) {
        var placed = false;
        while(placed === false) {
            const x = getRandomNumber(size.cols);
            const y = getRandomNumber(size.rows);
            if (grid[x][y].type !== mine) {
                grid[x][y].type = mine;
                placed = true;
            }
        }
    }
    //PLACE NUMBERS
    for(var x = 0; x < size.cols; x++) {
        for (var y = 0; y < size.rows; y++) {
            if (grid[x][y].type !== mine) {
                switch(countCellNeighbours(x, y, mine)) {
                    case 0: grid[x][y].type = empty; break;
                    case 1: grid[x][y].type = one; break;
                    case 2: grid[x][y].type = two; break;
                    case 3: grid[x][y].type = three; break;
                    case 4: grid[x][y].type = four; break;
                    case 5: grid[x][y].type = five; break;
                    case 6: grid[x][y].type = six; break;
                    case 7: grid[x][y].type = seven; break;
                    case 8: grid[x][y].type = eight; break;
                }
            }
        }
    }
}

function countCellNeighbours(x, y, type) {
    var result = 0;
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            try {
                if (i === 0 && j === 0) continue;
                if (grid[x + i][y + j].type === type) {
                    result++;
                }
            } catch (e) {}
        }
    }
    return result;
}

function getRandomNumber(endNum) {
    return Math.floor(Math.random() * endNum);
}

function reset() {
    handleDifficulty();
    setup();
    draw();
}

function create2DArray(size) {
    const grid = new Array(size.cols);
    for (var x = 0; x < size.cols; x++) {
        grid[x] = new Array(size.rows);
    }
    return grid;
}

run();