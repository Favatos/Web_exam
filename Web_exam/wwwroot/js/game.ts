class GameSession {
    nonogramId: number;
    currentGrid: number[][];
    solutionGrid: number[][];
    lives: number;
    status: "Playing" | "Lost" | "Win";

    constructor(id: number, lives: number, sGrid: number[][]) {
        this.nonogramId = id;
        this.solutionGrid = sGrid;
        this.currentGrid = GameSession.createEmptyGrid(sGrid.length, sGrid[0].length);
        this.lives = lives;
        this.status = "Playing";
    }

    static createEmptyGrid(height: number, width: number): number[][] {
        let grid: number[][] = [];

        for (let i: number = 0; i < height; i++) {
            let currentRow: number[] = [];
            for (let j: number = 0; j < width; j++) {
                currentRow.push(0);
            }
            grid.push(currentRow);
        }

        return grid;
    }

    handleLeftClick(row: number, col: number): void {
        const current = this.currentGrid[row][col];
        const right = this.solutionGrid[row][col];

        if (right === 1) {
            if (current === 1) {
                return;
            }

            this.currentGrid[row][col] = 1;
            return;
        }

        this.checkLives();
        this.currentGrid[row][col] = 2;
    }

    handleRightClick(row: number, col: number): void {
        const current = this.currentGrid[row][col];
        const right = this.solutionGrid[row][col];

        if (right === 0) {
            if (current === 2) return;

            this.currentGrid[row][col] = 2;
            return;
        }

        if (current === 1) return;

        this.checkLives();
        this.currentGrid[row][col] = 0;
    }

    checkLives(): void {
        if (this.lives === -1) return;

        this.lives -= 1;

        if (this.lives <= 0) {
            this.status = "Lost";
        }
    }

    isRowSolved(row: number): boolean {
        for (let col = 0; col < this.solutionGrid[row].length; col++) {
            const right = this.solutionGrid[row][col];
            const current = this.currentGrid[row][col];

            if (right === 1 && current !== 1) {
                return false;
            }

            if (right === 0 && current === 1) {
                return false;
            }
        }
        console.log("right");
        return true;
    }

    isColSolved(col :number) : boolean{
        for(let row = 0; row < this.solutionGrid.length; row++){
            const right = this.solutionGrid[row][col];
            const current = this.currentGrid[row][col];

            if (right === 1 && current !== 1) {
                return false;
            }

            if (right === 0 && current === 1) {
                return false;
            }
        }
        console.log("right");
        return true;
    }
}


class GameView {
    private session: GameSession;

    constructor(session: GameSession) {
        this.session = session;
    }

    handleLeftClick(cell: HTMLElement): void {
        const row: number = +cell.dataset.row!;
        const col: number = +cell.dataset.col!;

        this.session.handleLeftClick(row, col);

        const right = this.session.solutionGrid[row][col];
        const current = this.session.currentGrid[row][col];

        if (right === 1 && current === 1) {
            GameView.changeCell(cell, 1);
        } else if (right === 0 && current === 2) {
            GameView.animateError(cell, 2);
        }
    }

    handleRightClick(cell: HTMLElement): void {
        const row: number = +cell.dataset.row!;
        const col: number = +cell.dataset.col!;

        const before = this.session.currentGrid[row][col];
        const right = this.session.solutionGrid[row][col];

        this.session.handleRightClick(row, col);

        const current = this.session.currentGrid[row][col];

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
    }


    updateRowHintView(row: number): void {
        const rowHint = document.querySelector<HTMLElement>(`.row-hint-row[data-row="${row}"]`);
        if (!rowHint) return;

        if (this.session.isRowSolved(row)) {
            rowHint.classList.add("hint-done");
            this.changeGridRowToCross(row);
        } else {
            rowHint.classList.remove("hint-done");
        }
    }

    updateColHintView(col : number) : void {
        const colHint = document.querySelector<HTMLElement>(`.col-hint-column[data-col="${col}"]`);
        if (!colHint){ 
            console.warn("colHint not found for col", col);
            return;
        }

        if (this.session.isColSolved(col)) {
            colHint.classList.add("hint-done");
            this.changeGridColToCross(col);
        } else {
            colHint.classList.remove("hint-done");
        }
    }

    changeGridRowToCross(row: number): void {
        for (let col = 0; col < this.session.solutionGrid[row].length; col++) {
            if (this.session.currentGrid[row][col] == 0) {
                this.session.currentGrid[row][col] = 2;

                const cell = document.querySelector<HTMLElement>(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );

                if (cell) {
                    GameView.changeCell(cell, 2);
                }
            }
        }
    }

    changeGridColToCross(col : number): void{
        for (let row = 0; row < this.session.solutionGrid.length; row++){
            if (this.session.currentGrid[row][col] == 0) {
                this.session.currentGrid[row][col] = 2;

                const cell = document.querySelector<HTMLElement>(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );

                if (cell) {
                    GameView.changeCell(cell, 2);
                }
            }
        }
    }

    static changeCell(cell: HTMLElement, num: number): void {
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
    }

    static animateError(cell: HTMLElement, finalNum: number): void {
        cell.classList.remove("black", "cross");
        cell.classList.add("error-blink");

        const onAnimationEnd = () => {
            cell.classList.remove("error-blink");
            GameView.changeCell(cell, finalNum);
            cell.removeEventListener("animationend", onAnimationEnd);
        };

        cell.addEventListener("animationend", onAnimationEnd);
    }
}


console.log("working");

let grid: HTMLElement = document.querySelector(".nonogram-grid")!;

grid.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

let session = new GameSession(
    +grid.dataset.id!,
    10,
    JSON.parse(grid.dataset.solution!)
);

let view = new GameView(session);

let cells: NodeListOf<HTMLElement> = document.querySelectorAll(".cell");

cells.forEach(c => {
    c.addEventListener("mousedown", (event) => {
        const row = +c.dataset.row!;
        const col = +c.dataset.col!;

        if (event.button === 0) {
            view.handleLeftClick(c);
        } else if (event.button === 2) {
            view.handleRightClick(c);
        }

        view.updateRowHintView(row);
        view.updateColHintView(col);

        console.log(c.dataset.row, c.dataset.col);
    });
});
