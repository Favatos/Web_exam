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
    GameSession.prototype.handleLeftClick = function (row, col) {
        var current = this.currentGrid[row][col];
        var right = this.solutionGrid[row][col];
        if (right === 1) {
            if (current === 1) {
                return;
            }
            this.currentGrid[row][col] = 1;
            return;
        }
        this.checkLives();
        this.currentGrid[row][col] = 2;
    };
    GameSession.prototype.handleRightClick = function (row, col) {
        var current = this.currentGrid[row][col];
        var right = this.solutionGrid[row][col];
        if (right === 0) {
            if (current === 2)
                return;
            this.currentGrid[row][col] = 2;
            return;
        }
        if (current === 1)
            return;
        this.checkLives();
        this.currentGrid[row][col] = 0;
    };
    GameSession.prototype.checkLives = function () {
        if (this.lives === -1)
            return;
        this.lives -= 1;
        if (this.lives <= 0) {
            this.status = "Lost";
        }
    };
    GameSession.prototype.checkWin = function () {
        for (var row = 0; row < this.solutionGrid.length; row++) {
            if (!this.isRowSolved(row)) {
                console.log("not win");
                return false;
            }
        }
        this.status = "Win";
        console.log("win");
        return true;
    };
    GameSession.prototype.isRowSolved = function (row) {
        for (var col = 0; col < this.solutionGrid[row].length; col++) {
            var right = this.solutionGrid[row][col];
            var current = this.currentGrid[row][col];
            if (right === 1 && current !== 1) {
                return false;
            }
            if (right === 0 && current === 1) {
                return false;
            }
        }
        console.log("right");
        return true;
    };
    GameSession.prototype.isColSolved = function (col) {
        for (var row = 0; row < this.solutionGrid.length; row++) {
            var right = this.solutionGrid[row][col];
            var current = this.currentGrid[row][col];
            if (right === 1 && current !== 1) {
                return false;
            }
            if (right === 0 && current === 1) {
                return false;
            }
        }
        console.log("right");
        return true;
    };
    return GameSession;
}());
var GameView = /** @class */ (function () {
    function GameView(session) {
        this.session = session;
    }
    GameView.prototype.handleLeftClick = function (cell) {
        var row = +cell.dataset.row;
        var col = +cell.dataset.col;
        this.session.handleLeftClick(row, col);
        var right = this.session.solutionGrid[row][col];
        var current = this.session.currentGrid[row][col];
        if (right === 1 && current === 1) {
            GameView.changeCell(cell, 1);
        }
        else if (right === 0 && current === 2) {
            GameView.animateError(cell, 2);
        }
        this.session.checkWin();
        this.renderLives();
    };
    GameView.prototype.handleRightClick = function (cell) {
        var row = +cell.dataset.row;
        var col = +cell.dataset.col;
        var before = this.session.currentGrid[row][col];
        var right = this.session.solutionGrid[row][col];
        this.session.handleRightClick(row, col);
        var current = this.session.currentGrid[row][col];
        if (right === 0 && current === 2) {
            GameView.changeCell(cell, 2);
            return;
        }
        if (before === 1 && current === 1) {
            return;
        }
        if (right === 1 && current === 0) {
            GameView.animateError(cell, 1);
        }
        this.session.checkWin();
        this.renderLives();
    };
    GameView.prototype.updateRowHintView = function (row) {
        var rowHint = document.querySelector(".row-hint-row[data-row=\"".concat(row, "\"]"));
        if (!rowHint)
            return;
        if (this.session.isRowSolved(row)) {
            rowHint.classList.add("hint-done");
            this.changeGridRowToCross(row);
        }
        else {
            rowHint.classList.remove("hint-done");
        }
    };
    GameView.prototype.updateColHintView = function (col) {
        var colHint = document.querySelector(".col-hint-column[data-col=\"".concat(col, "\"]"));
        if (!colHint) {
            console.warn("colHint not found for col", col);
            return;
        }
        if (this.session.isColSolved(col)) {
            colHint.classList.add("hint-done");
            this.changeGridColToCross(col);
        }
        else {
            colHint.classList.remove("hint-done");
        }
    };
    GameView.prototype.changeGridRowToCross = function (row) {
        for (var col = 0; col < this.session.solutionGrid[row].length; col++) {
            if (this.session.currentGrid[row][col] == 0) {
                this.session.currentGrid[row][col] = 2;
                var cell = document.querySelector(".cell[data-row=\"".concat(row, "\"][data-col=\"").concat(col, "\"]"));
                if (cell) {
                    GameView.changeCell(cell, 2);
                }
            }
        }
    };
    GameView.prototype.changeGridColToCross = function (col) {
        for (var row = 0; row < this.session.solutionGrid.length; row++) {
            if (this.session.currentGrid[row][col] == 0) {
                this.session.currentGrid[row][col] = 2;
                var cell = document.querySelector(".cell[data-row=\"".concat(row, "\"][data-col=\"").concat(col, "\"]"));
                if (cell) {
                    GameView.changeCell(cell, 2);
                }
            }
        }
    };
    GameView.changeCell = function (cell, num) {
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
    GameView.animateError = function (cell, finalNum) {
        cell.classList.remove("black", "cross");
        cell.classList.add("error-blink");
        var onAnimationEnd = function () {
            cell.classList.remove("error-blink");
            GameView.changeCell(cell, finalNum);
            cell.removeEventListener("animationend", onAnimationEnd);
        };
        cell.addEventListener("animationend", onAnimationEnd);
    };
    GameView.prototype.showGameOver = function () {
        var modal = document.getElementById("game-over-modal");
        if (!modal)
            return;
        modal.classList.remove("d-none");
        var grid = document.querySelector(".nonogram-grid");
        if (grid) {
            grid.style.pointerEvents = "none";
        }
        var restartBtn = document.getElementById("game-over-restart");
        if (restartBtn) {
            restartBtn.addEventListener("click", function () {
                location.reload();
            });
        }
    };
    GameView.prototype.showGameWin = function () {
        var modal = document.getElementById("game-win-modal");
        if (!modal)
            return;
        modal.classList.remove("d-none");
        var grid = document.querySelector(".nonogram-grid");
        if (grid) {
            grid.style.pointerEvents = "none";
        }
    };
    GameView.prototype.renderLives = function () {
        var el = document.getElementById("LivesDisplay");
        if (el) {
            el.textContent = "Lives: ".concat(this.session.lives);
        }
        if (this.session.status === "Lost") {
            this.showGameOver();
        }
        if (this.session.status === "Win") {
            this.showGameWin();
        }
    };
    return GameView;
}());
console.log("working");
var grid = document.querySelector(".nonogram-grid");
var difficulty = grid.dataset.difficulty;
var lives = difficulty.toLowerCase() == "easy" ? 5 : difficulty.toLowerCase() == "medium" ? 10 : 15;
grid.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});
var session = new GameSession(+grid.dataset.id, lives, JSON.parse(grid.dataset.solution));
var view = new GameView(session);
view.renderLives();
var cells = document.querySelectorAll(".cell");
cells.forEach(function (c) {
    c.addEventListener("mousedown", function (event) {
        var row = +c.dataset.row;
        var col = +c.dataset.col;
        if (event.button === 0) {
            view.handleLeftClick(c);
        }
        else if (event.button === 2) {
            view.handleRightClick(c);
        }
        view.updateRowHintView(row);
        view.updateColHintView(col);
        console.log(c.dataset.row, c.dataset.col);
    });
});
