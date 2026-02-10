class Editor{
    solutionGrid : number[][];
    width : number;
    height : number;

    constructor(width : number, height : number){
        this.width = width;
        this.height = height;

        this.solutionGrid = Editor.createEmptyGrid(height, width);
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

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.solutionGrid = Editor.createEmptyGrid(height, width);
    }

    
}

class EditorView{
    private editor : Editor;
    private isDrawing : boolean = false;
    gridJsonInput :  HTMLInputElement;
    container : HTMLElement;

    constructor(editor: Editor){
        this.editor = editor;
        this.gridJsonInput = document.getElementById("GridJson") as HTMLInputElement;
        this.container = document.getElementById("nonogram-editor")!;
    }

    renderGrid() {
        this.container.innerHTML = "";

        this.container.style.gridTemplateColumns = `repeat(${this.editor.width}, 24px)`;

        for (let i : number = 0; i < this.editor.solutionGrid.length; i++){
            for (let j : number = 0; j < this.editor.solutionGrid[i].length;j ++) {
                let cell =  document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i.toString();
                cell.dataset.col = j.toString();

                this.container.appendChild(cell);
            }
        }
    }

    attachEvents(){
        let cells: NodeListOf<HTMLElement> = this.container.querySelectorAll(".cell");

        cells.forEach(c => {
            c.addEventListener("mousedown", (event) => {
                if(event.button != 0) return;

                this.isDrawing = true;
                this.paintCell(c);
            })

            c.addEventListener("mouseenter", (event) => {
                if (!this.isDrawing) return;

                this.paintCell(c);
            })

            c.addEventListener("mouseup", () => {
                this.isDrawing = false;
            })
        });
    }

    updateGridJson() {
        if (!this.gridJsonInput) return;
        this.gridJsonInput.value = JSON.stringify(this.editor.solutionGrid);
    }

    paintCell(c : HTMLElement) {
        const row: number = +c.dataset.row!;
        const col: number = +c.dataset.col!;
        this.editor.solutionGrid[row][col] = this.editor.solutionGrid[row][col] === 1 ? 0 : 1;

        c.classList.toggle("black");
        this.updateGridJson();
    }
}

let width = 0;
let height = 0;

let inputWidth  = document.getElementById("Width")!;
if(inputWidth instanceof HTMLInputElement) {
    width = +inputWidth.value; 
}

let inputHeight = document.getElementById("Height")!;
if(inputHeight instanceof HTMLInputElement) {
    height = +inputHeight.value; 
}


const onSizeChange = () => {
    let newWidth = 0;
    let newHeight = 0;

    if(inputWidth instanceof HTMLInputElement) {
        newWidth = +inputWidth.value; 
    }
    if(inputHeight instanceof HTMLInputElement) {
        newHeight = +inputHeight.value; 
    }

    editor.resize(newWidth, newHeight);
    view.renderGrid();
    view.attachEvents();
    view.updateGridJson();
};

let editor : Editor = new Editor(width, height);
let view :EditorView = new EditorView(editor);

view.renderGrid();
view.attachEvents();
view.updateGridJson();

inputHeight.addEventListener("change", onSizeChange);
inputWidth.addEventListener("change", onSizeChange);

