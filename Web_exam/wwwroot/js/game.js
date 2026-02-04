var GameSession = /** @class */ (function () {
    function GameSession(id, lives, sGrid) {
        this.nonogramId = id;
        this.solutionGrid = sGrid;
        this.currentGrid = GameSession.createEmptyGrid(sGrid.length, sGrid[0].length);
        this.lives = lives;
        this.status = "Playing";
    }
    GameSession.createEmptyGrid = function (height, width) {
        var grid = [];
        for (var i = 0; i < height; i++) {
            var currentRow = [];
            for (var j = 0; j < width; j++) {
                currentRow.push(0);
            }
            grid.push(currentRow);
        }
        return grid;
    };
    GameSession.prototype.handleLeftClick = function (cell) {
        var row = +cell.dataset.row;
        var col = +cell.dataset.col;
        var current = this.currentGrid[+cell.dataset.row][col];
        var right = this.solutionGrid[row][col];
        if (right === 1) {
            if (current === 1) {
                return;
            }
            this.currentGrid[row][col] = 1;
            GameSession.changeCell(cell, 1);
            return;
        }
        this.checkLives();
        this.currentGrid[row][col] = 2;
        GameSession.animateError(cell, 2);
    };
    GameSession.prototype.handleRightClick = function (cell) {
        var row = +cell.dataset.row;
        var col = +cell.dataset.col;
        var current = this.currentGrid[row][col];
        var right = this.solutionGrid[row][col];
        if (right === 0) {
            if (current === 2)
                return;
            this.currentGrid[row][col] = 2;
            GameSession.changeCell(cell, 2);
            return;
        }
        if (current === 1)
            return;
        this.checkLives();
        this.currentGrid[row][col] = 0;
        GameSession.animateError(cell, 1);
    };
    GameSession.prototype.checkLives = function () {
        if (this.lives === -1)
            return;
        this.lives -= 1;
        if (this.lives <= 0) {
            this.status = "Lost";
        }
    };
    GameSession.changeCell = function (cell, num) {
        cell.classList.remove("black", "cross");
        switch (num) {
            case 0:
                break;
            case 1:
                cell.classList.add("black");
                break;
            case 2:
                cell.classList.add("cross");
                break;
            default:
                return;
        }
    };
    GameSession.animateError = function (cell, finalNum) {
        cell.classList.remove("black", "cross");
        cell.classList.add("error-blink");
        var onAnimationEnd = function () {
            cell.classList.remove("error-blink");
            GameSession.changeCell(cell, finalNum);
            cell.removeEventListener("animationend", onAnimationEnd);
        };
        cell.addEventListener("animationend", onAnimationEnd);
    };
    return GameSession;
}());
console.log("working");
var grid = document.querySelector(".nonogram-grid");
grid.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});
var session = new GameSession(+grid.dataset.id, 10, JSON.parse(grid.dataset.solution));
var cells = document.querySelectorAll(".cell");
cells.forEach(function (c) {
    c.addEventListener("mousedown", function (event) {
        if (event.button == 0)
            session.handleLeftClick(c);
        if (event.button == 2)
            session.handleRightClick(c);
        console.log(c.dataset.row, c.dataset.col);
    });
});
