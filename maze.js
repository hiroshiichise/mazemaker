var canvas;
var ctx;

const WIDTH = 1200;
const HEIGHT = 800;

tileW = 20;
tileH = 20;

// hunt and kill method must be non-odd
tileRowCount = 21;
tileColumnCount = 21;

boundX = 1;
boundY = 1;
boundNum = 1;
before_boundX = 1;
before_boundY = 1;

// TODO check all permutation
permutations_d4 = [["u", "r", "l", "d"], ["u", "l", "r", "d"], ["r", "l", "d", "u"], ["l", "d", "u", "r"], ["d", "u", "r", "l"], ["d", "r", "l", "u"], ["r", "l", "u", "d"]];

var tiles = [];

function inittiles() {
    for (c = 0; c < tileColumnCount; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRowCount; r++) {
            if (r == 0 || c == 0 || r == tileRowCount - 1 || c == tileColumnCount - 1) {
                tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: "o", num: 0, wall: "" } // state is o for out    
            }
            else {
                tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: "w", num: 0, wall: "" } // w means wall
            }

        }
    }

    tiles[1][1].state = "s";
    //小手先のやり方
    tiles[1][1].num = 2;
    tiles[tileColumnCount - 2][tileRowCount - 2].state = "f";
    boundX = 1;
    boundY = 1;
    boundNum = 1;
    before_boundX = 1;
    before_boundY = 1;

}

function reset() {
    for (c = 0; c < tileColumnCount; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: "w" } // state is e for empty    
        }
    }
    inittiles();
    output.innerHTML = "";
}

function isOdd(num) { return num % 2; }

function getRandomInt(max) {
    return Math.floor(Math.random() * (max));
}

function canAnahori(row, column) {
    if (tiles[column][row].state != "w") {
        return false;
    }
    let count = 0;
    if (isWallorOuter(tiles[column + 1][row].state)) {
        count = count + 1
    }
    if (isWallorOuter(tiles[column - 1][row].state)) {
        count = count + 1
    }
    if (isWallorOuter(tiles[column][row + 1].state)) {
        count = count + 1
    }
    if (isWallorOuter(tiles[column][row - 1].state)) {
        count = count + 1
    }
    if (count == 3) {
        return true;
    }
    return false;
}
function isWallorOuter(state) {
    if (state == "w" || state == "o") {
        return true
    }
    return false
}
function makeMazeAll() {
    huntKill();
    huntKill();
    makeWall();
    breakWall();
}

function mainHuntKill(row, column) {
    let anahori = true;
    while (anahori) {
        let num = getRandomInt(permutations_d4.length);
        // 0 means u
        anahori = false;
        for (var i = 0; i < permutations_d4[num].length; i++) {
            direction = permutations_d4[num][i];
            if (direction == "u") {
                if ((column - 2) >= 0) {
                    if (isWallorOuter(tiles[column - 2][row].state) && canAnahori(row, column - 1)) {
                        column = column - 1;
                        tiles[column][row].state = "e";
                        anahori = true;
                        break;
                    }
                }
            }
            else if (direction == "d") {
                if ((column + 2) < tileColumnCount) {
                    if (isWallorOuter(tiles[column + 2][row].state) && canAnahori(row, column + 1)) {
                        column = column + 1;
                        tiles[column][row].state = "e";
                        anahori = true;
                        break;
                    }
                }
            }
            else if (direction == "l") {
                if ((row - 2) >= 0) {
                    if (isWallorOuter(tiles[column][row - 2].state) && canAnahori(row - 1, column)) {
                        row = row - 1;
                        tiles[column][row].state = "e";
                        anahori = true;
                        break;
                    }
                }
            }
            else if (direction == "r") {
                if ((row + 2) < tileRowCount) {
                    if (isWallorOuter(tiles[column][row + 2].state) && canAnahori(row + 1, column)) {
                        row = row + 1;
                        tiles[column][row].state = "e";
                        anahori = true;
                        break;
                    }
                }
            }
        }
    }
}

function makeLine(curtile, nexttile) {
    if (isWallorOuter(nexttile.state)) {
        if (curtile.state == "w" && nexttile.state == "w") {
            return false
        }
        return true;
    }
    if (nexttile.num > 0 && curtile.num > 0) {
        if (Math.abs(nexttile.num - curtile.num) == 1) {
            return false;
        }
        return true;
    }
    return false;
}

function mainMakeWall(row, column) {
    wall = ""
    if (makeLine(tiles[column][row], tiles[column + 1][row])) {
        wall += "r"
    }
    if (makeLine(tiles[column][row], tiles[column - 1][row])) {
        wall += "l"
    }
    if (makeLine(tiles[column][row], tiles[column][row + 1])) {
        wall += "d"
    }
    if (makeLine(tiles[column][row], tiles[column][row - 1])) {
        wall += "u"
    }
    tiles[column][row].wall = wall
    return
}

function makeWall() {
    for (var row = 1; row < tileRowCount - 1; row++) {
        for (var column = 1; column < tileColumnCount - 1; column++) {
            mainMakeWall(row, column);
        }
    }
}

function clearWall() {
    for (var row = 1; row < tileRowCount - 1; row++) {
        for (var column = 1; column < tileColumnCount - 1; column++) {
            tiles[column][row].wall = "";
        }
    }
}
function clearState() {
    for (var row = 1; row < tileRowCount - 1; row++) {
        for (var column = 1; column < tileColumnCount - 1; column++) {
            if (tiles[column][row].state == "x" || tiles[column][row].state == "o" || tiles[column][row].state == "f" || tiles[column][row].state == "s") {
            } else {
                tiles[column][row].state = "e";
                tiles[column][row].num = 0;
            }
        }
    }
}

function changeState2Empty(row, column) {
    tiles[column][row].state = "e";

    if (tiles[column + 1][row].state == "w") {
        changeState2Empty(row, column + 1);
    }
    if (tiles[column - 1][row].state == "w") {
        changeState2Empty(row, column - 1);
    }
    if (tiles[column][row + 1].state == "w") {
        changeState2Empty(row + 1, column);
    }
    if (tiles[column][row - 1].state == "w") {
        changeState2Empty(row - 1, column);
    }
}

function mainBreakWall(row, column) {
    let num = getRandomInt(permutations_d4.length);
    for (var i = 0; i < permutations_d4[0].length; i++) {
        if (tiles[column][row].state == "w") {
            direction = permutations_d4[num][i];
            if (direction == "r" && (column + 1) < tileColumnCount) {
                if (tiles[column + 1][row].state == "e") {
                    tiles[column + 1][row].wall = tiles[column + 1][row].wall.replace("l", "");
                    changeState2Empty(row, column);
                    break;
                }
            }
            if (direction == "l" && (column - 1) >= 0) {
                if (tiles[column - 1][row].state == "e") {
                    tiles[column - 1][row].wall = tiles[column - 1][row].wall.replace("r", "");
                    changeState2Empty(row, column);
                    break;
                }
            }
            if (direction == "d" && (row + 1) < tileRowCount) {
                if (tiles[column][row + 1].state == "e") {
                    tiles[column][row + 1].wall = tiles[column][row + 1].wall.replace("u", "");
                    changeState2Empty(row, column);
                    break;
                }
            }
            if (direction == "u" && (row - 1) >= 0) {
                if (tiles[column][row - 1].state == "e") {
                    tiles[column][row - 1].wall = tiles[column][row - 1].wall.replace("d", "");
                    changeState2Empty(row, column);
                    break;
                }
            }
        }
    }
}


function breakWall() {
    for (var row = 1; row < tileRowCount - 1; row++) {
        for (var column = 1; column < tileColumnCount - 1; column++) {
            mainBreakWall(row, column);
        }
    }
    clearState();
}

function huntKill() {
    for (var row = 1; row < tileRowCount - 1; row++) {
        for (var column = 1; column < tileColumnCount - 2; column++) {
            if (tiles[column][row].state == "e") {
                mainHuntKill(row, column);
            }
        }
    }
}

function solveMaze() {
    var Xqueue = [1];
    var Yqueue = [1];

    var pathFound = false;

    var xLoc;
    var yLoc;

    while (Xqueue.length > 0 && !pathFound) {
        xLoc = Xqueue.shift();
        yLoc = Yqueue.shift();

        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == "f" && !tiles[xLoc][yLoc].wall.includes("l") && !tiles[xLoc - 1][yLoc].wall.includes("r")) {
                pathFound = true;
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == "f" && !tiles[xLoc][yLoc].wall.includes("r") && !tiles[xLoc + 1][yLoc].wall.includes("l")) {
                pathFound = true;
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == "f" && !tiles[xLoc][yLoc].wall.includes("u") && !tiles[xLoc][yLoc - 1].wall.includes("d")) {
                pathFound = true;
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == "f" && !tiles[xLoc][yLoc].wall.includes("d") && !tiles[xLoc][yLoc + 1].wall.includes("u")) {
                pathFound = true;
            }
        }

        // quece
        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == "e" && !tiles[xLoc][yLoc].wall.includes("l") && !tiles[xLoc - 1][yLoc].wall.includes("r")) {
                Xqueue.push(xLoc - 1);
                Yqueue.push(yLoc);
                tiles[xLoc - 1][yLoc].state = tiles[xLoc][yLoc].state + "l";
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == "e" && !tiles[xLoc][yLoc].wall.includes("r") && !tiles[xLoc + 1][yLoc].wall.includes("l")) {
                Xqueue.push(xLoc + 1);
                Yqueue.push(yLoc);
                tiles[xLoc + 1][yLoc].state = tiles[xLoc][yLoc].state + "r";
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == "e" && !tiles[xLoc][yLoc].wall.includes("u") && !tiles[xLoc][yLoc - 1].wall.includes("d")) {
                Xqueue.push(xLoc);
                Yqueue.push(yLoc - 1);
                tiles[xLoc][yLoc - 1].state = tiles[xLoc][yLoc].state + "u";
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == "e" && !tiles[xLoc][yLoc].wall.includes("d") && !tiles[xLoc][yLoc + 1].wall.includes("u")) {
                Xqueue.push(xLoc);
                Yqueue.push(yLoc + 1);
                tiles[xLoc][yLoc + 1].state = tiles[xLoc][yLoc].state + "d";
            }
        }
    }
    if (!pathFound) {
        output.innerHTML = "No Solution";
    } else {
        output.innerHTML = "Solved!";
        var path = tiles[xLoc][yLoc].state;
        var pathLength = path.length;
        var currX = 1;
        var currY = 1;
        for (var i = 0; i < pathLength - 1; i++) {
            if (path.charAt(i + 1) == "u") {
                currY -= 1;
            }
            if (path.charAt(i + 1) == "d") {
                currY += 1;
            }
            if (path.charAt(i + 1) == "r") {
                currX += 1;
            }
            if (path.charAt(i + 1) == "l") {
                currX -= 1;
            }
            tiles[currX][currY].state = "x";
        }
    }
    clearState()
}

function rect(x, y, w, h, state, num, wall) {
    if (state == "s") {
        ctx.fillStyle = "#00FF00";
    } else if (state == "f") {
        ctx.fillStyle = "#FF0000";
    } else if (state == "e") {
        ctx.fillStyle = "#ebf3d0";
    } else if (state == "x") {
        ctx.fillStyle = "#000000";
    } else if (state == "o") {
        ctx.fillStyle = "#5c0c09";
    } else {
        ctx.fillStyle = "#AAAAAA";
    }

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();

    if (wall.includes("l")) {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.rect(x - 3, y, 3, h);
        ctx.closePath();
        ctx.fill();
    }
    if (wall.includes("u")) {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.rect(x, y - 3, w, 3);
        ctx.closePath();
        ctx.fill();
    }
    if (wall.includes("d")) {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.rect(x, y + h, w, 3);
        ctx.closePath();
        ctx.fill();
    }
    if (wall.includes("r")) {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.rect(x + w, y, 3, h);
        ctx.closePath();
        ctx.fill();
    }

    if (state == "e") {
        if (num > 0) {
            ctx.fillStyle = "#0000ff";
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            ctx.fill();
        }
    } else if (state == "s") {
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.font = "24px serif";
        ctx.fillText("s", x + 1 / 2 * w, y + h, x + w);
    } else if (state == "f") {
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.font = "24px serif";
        ctx.fillText("f", x + 1 / 2 * w, y + h, x + w);
    }
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

function draw() {
    clear()
    ctx.fillStyle = "#FF0000";

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state, tiles[c][r].num, tiles[c][r].wall)
        }
    }
}

function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    inittiles();
    output = document.getElementById("outcome");
    return setInterval(draw, 10);
}


function canMove(c, r) {
    if ((c == boundX && r == boundY + 1) ||
        (c == boundX && r == boundY - 1) ||
        (c == boundX + 1 && r == boundY) ||
        (c == boundX - 1 && r == boundY)) {
        return true
    }
    return false
}
function canMoveClick(c, r) {
    if (canMove(c, r)) {
        return true
    }
    if (c == boundX && r == boundY) {
        return true
    }
    return false
}


function myMove(e) {
    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c * (tileW + 3) < x && x < c * (tileW + 3) + tileW && r * (tileH + 3) < y && y < r * (tileH + 3) + tileH) {
                if (tiles[c][r].state == "w" && canMove(c, r)) {
                    tiles[c][r].state = "e";
                    tiles[c][r].num = boundNum;
                    before_boundX = boundX;
                    before_boundY = boundY;
                    boundX = c;
                    boundY = r;
                    boundNum = boundNum + 1;
                } else if (tiles[c][r].state == "e" && canMove(c, r)) {
                    //tiles[c][r].state = "w";
                    //tiles[c][r].num = 0;
                    tiles[boundX][boundY].num = 0;
                    tiles[boundX][boundY].state = "w";
                    before_boundX = boundX;
                    before_boundY = boundY;
                    boundX = c;
                    boundY = r;
                    boundNum = boundNum - 1;
                }
            }
        }
    }
}

function myDown(e) {
    canvas.onmousemove = myMove;

    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c * (tileW + 3) < x && x < c * (tileW + 3) + tileW && r * (tileH + 3) < y && y < r * (tileH + 3) + tileH) {
                if (tiles[c][r].state == "w" && canMoveClick(c, r)) {
                    tiles[c][r].state = "e";
                    tiles[c][r].num = boundNum;
                    boundX = c;
                    boundY = r;
                    boundNum = boundNum + 1;
                } else if (tiles[c][r].state == "e" && canMoveClick(c, r)) {
                    tiles[c][r].state = "w";
                    tiles[c][r].num = 0;
                    boundX = before_boundX;
                    boundY = before_boundY;
                    boundNum = boundNum - 1;
                }
            }
        }
    }
}

function myUp() {
    canvas.onmousemove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
