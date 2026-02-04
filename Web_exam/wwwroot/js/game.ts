class GameSession{
    nonogramId : number;
    currentGrid : number[][];
    solutionGrid : number[][]
    lives : number;
    status : "Playing" | "Lost" | "Win";

    constructor(id : number,  lives : number, sGrid : number[][]){
        this.nonogramId = id;
        this.solutionGrid = sGrid;
        this.currentGrid = GameSession.createEmptyGrid(sGrid.length, sGrid[0].length);
        this.lives  = lives;
        this.status  = "Playing";
    }

    static createEmptyGrid(height: number, width: number): number[][] {
        let grid : number[][] = [];

        for(let i: number = 0; i < height; i++){
            let currentRow : number[] = [];
            for(let j: number = 0; j < width; j++){
                currentRow.push(0);
            }
            grid.push(currentRow);
        }

        return grid;

    }

    handleLeftClick(cell : HTMLElement): void {
        const row : number = +cell.dataset.row!;
        const col : number = +cell.dataset.col!;

        const current = this.currentGrid[+cell.dataset.row!][col];
        const right = this.solutionGrid[row][col];

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
    }

    handleRightClick(cell: HTMLElement): void {
    const row: number = +cell.dataset.row!;
    const col: number = +cell.dataset.col!;

    const current = this.currentGrid[row][col];
    const right = this.solutionGrid[row][col];

    if (right === 0) {
        if (current === 2) return;

        this.currentGrid[row][col] = 2;
        GameSession.changeCell(cell, 2); 
        return;
    }

    if (current === 1) return;

    this.checkLives();
    this.currentGrid[row][col] = 0;
    GameSession.animateError(cell, 1);
}



    checkLives(): void {
        if (this.lives === -1) return;

        this.lives -= 1;

        if (this.lives <= 0) {
            this.status = "Lost";
        }
    }

    static changeCell(cell : HTMLElement, num : number) : void{
        cell.classList.remove("black", "cross");

        switch (num){
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
            GameSession.changeCell(cell, finalNum);
            cell.removeEventListener("animationend", onAnimationEnd);
        };

        cell.addEventListener("animationend", onAnimationEnd);
    }
}
console.log("working");


let grid : HTMLElement = document.querySelector(".nonogram-grid")!;
grid.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

let session : GameSession = new GameSession(+grid.dataset.id!, 10, JSON.parse(grid.dataset.solution!));
let cells : NodeListOf<HTMLElement> = document.querySelectorAll(".cell");

cells.forEach(c => {
        c.addEventListener("mousedown", (event) => {
            if (event.button == 0) session.handleLeftClick(c);
            if (event.button == 2) session.handleRightClick(c);
            console.log(c.dataset.row, c.dataset.col);
        });
});




