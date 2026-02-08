var Editor = /** @class */ (function () {
    function Editor(width, height) {
        this.width = width;
        this.height = height;
        this.solutionGrid = Editor.createEmptyGrid(height, width);
    }
    Editor.createEmptyGrid = function (height, width) {
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
    Editor.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;
        this.solutionGrid = Editor.createEmptyGrid(height, width);
    };
    return Editor;
}());
var EditorView = /** @class */ (function () {
    function EditorView(editor) {
        this.editor = editor;
        this.gridJsonInput = document.getElementById("GridJson");
        this.container = document.getElementById("nonogram-editor");
    }
    EditorView.prototype.renderGrid = function () {
        this.container.innerHTML = "";
        this.container.style.gridTemplateColumns = "repeat(".concat(this.editor.width, ", 24px)");
        for (var i = 0; i < this.editor.solutionGrid.length; i++) {
            for (var j = 0; j < this.editor.solutionGrid[i].length; j++) {
                var cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i.toString();
                cell.dataset.col = j.toString();
                this.container.appendChild(cell);
            }
        }
    };
    EditorView.prototype.attachEvents = function () {
        var _this = this;
        var cells = this.container.querySelectorAll(".cell");
        cells.forEach(function (c) {
            c.addEventListener("click", function () {
                var row = +c.dataset.row;
                var col = +c.dataset.col;
                _this.editor.solutionGrid[row][col] = _this.editor.solutionGrid[row][col] === 1 ? 0 : 1;
                c.classList.toggle("black");
                _this.updateGridJson();
            });
        });
    };
    EditorView.prototype.updateGridJson = function () {
        if (!this.gridJsonInput)
            return;
        this.gridJsonInput.value = JSON.stringify(this.editor.solutionGrid);
    };
    return EditorView;
}());
var width = 0;
var height = 0;
var inputWidth = document.getElementById("Width");
if (inputWidth instanceof HTMLInputElement) {
    width = +inputWidth.value;
}
var inputHeight = document.getElementById("Height");
if (inputHeight instanceof HTMLInputElement) {
    height = +inputHeight.value;
}
var onSizeChange = function () {
    var newWidth = 0;
    var newHeight = 0;
    if (inputWidth instanceof HTMLInputElement) {
        newWidth = +inputWidth.value;
    }
    if (inputHeight instanceof HTMLInputElement) {
        newHeight = +inputHeight.value;
    }
    editor.resize(newWidth, newHeight);
    view.renderGrid();
    view.attachEvents();
    view.updateGridJson();
};
var editor = new Editor(width, height);
var view = new EditorView(editor);
view.renderGrid();
view.attachEvents();
view.updateGridJson();
inputHeight.addEventListener("change", onSizeChange);
inputWidth.addEventListener("change", onSizeChange);
