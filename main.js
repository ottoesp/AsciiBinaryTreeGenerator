function findDistanceFromParentNode(row){
    if (row === 2){
        return 3;
    } else if (row === 1){
        return 1;
    }
    return findDistanceFromParentNode(row - 1) * 2 + 1
}

function Node(value, row) {
    this.value = value;
    this.right = false;
    this.left = false;
    this.x = false;
    this.y = false;
    this.row = row;

    this.flipRows = function () {
        if (this.right !== false) {
            this.right.flipRows()
        }
        if (this.left !== false) {
            this.left.flipRows()
        }
        this.row = depthSizes.length - this.row;
    }
    this.assignDistanceToParent = function () {
        if (this.right !== false) {
            this.right.assignDistanceToParent()
        }
        if (this.left !== false) {
            this.left.assignDistanceToParent()
        }
        this.distance2PN = findDistanceFromParentNode(this.row);
    }
    this.assignYValues = function (gridHeight) {
        if (this.right !== false) {
            this.right.assignYValues()
        }
        if (this.left !== false) {
            this.left.assignYValues()
        }
        if (this.row === 1) {
            this.y = 0
        } else {
            this.y = 2 + 3 * (this.row - 2)
        }
    }
    this.assignXValues = function (stem, boardWidth) {
        if (stem) {
            this.x = Math.floor(boardWidth / 2)
        }
        if (this.right !== false) {
            this.right.x = this.x + this.right.distance2PN
            if (this.right.row === 1){
                this.right.x += 1
            }
            this.right.assignXValues(false)
        }
        if (this.left !== false) {
            this.left.x = this.x - this.left.distance2PN
            if (this.left.row === 1){
                this.left.x -= 1
            }
            this.left.assignXValues(false)
        }
    }
    this.place = function (grid) {
        if (this.right !== false) {
            this.right.place(grid)
        }
        if (this.left !== false) {
            this.left.place(grid)
        }
        let stringVal = value.toString()
        if (stringVal.length > 3) {
            console.log("ERROR value too large")
        } else if (stringVal.length === 3) {
            grid[this.y].splice(this.x - 1, 3, stringVal[0], stringVal[1], stringVal[2])
        } else if (stringVal.length === 2) {
            grid[this.y].splice(this.x, 2, stringVal[0], stringVal[1])
        } else if (stringVal.length === 1) {
            grid[this.y].splice(this.x, 1, stringVal)
        }
        if (this.row !== 1) {
            if (this.right !== false) {
                grid[this.y - 1][this.x + 1] = "\\"
                for (let i = 2; i < this.right.distance2PN - 1; i++){
                    grid[this.y - 1][this.x + i] = "_"
                }
                if (this.row != 2){
                    grid[this.y - 2][this.x + this.right.distance2PN - 1] = "\\"
                }

            }
            if (this.left !== false) {
                grid[this.y - 1][this.x - 1] = "/"
                for (let i = 2; i < this.left.distance2PN - 1; i++){
                    grid[this.y - 1][this.x - i] = "_"
                }
                if (this.row !== 2){
                    grid[this.y - 2][this.x - this.left.distance2PN + 1] = "/"
                }

            }
        }
    }
}


function randList(start, end, NumberOfValues){
    let output = [];
    for (let i = 0; i < NumberOfValues; i++){
        output.push(Math.floor(Math.random() * (end - start) ) + start);
    }
    return output;
}

function printGrid(grid){

    let g = grid.reverse()
    for (let i = 0; i < g.length; i++){
        console.log(g[i].join(""))
    }

}

function placeObjectInTree(val, tree, row){
    if (val < tree.value){
        if (tree.left){
            placeObjectInTree(val, tree.left, row + 1);
        } else{
            tree.left = new Node(val, row);
        }
    } else{
        if (tree.right){
            placeObjectInTree(val, tree.right, row + 1);
        } else{
            tree.right = new Node(val, row);
        }
    }

}

function createObjectTree(inp){
    let tree = new Node(inp[0], 0);
    for (let i = 1; i < inp.length; i++){
        placeObjectInTree(inp[i], tree, 1)
    }
    return tree;
}

var depthSizes = []

function findDepthSizes(tree, depth){
    if (depthSizes[depth] === undefined){
        depthSizes.push(0);
    }
    depthSizes[depth] += 1;
    if (tree.left){
        findDepthSizes(tree.left, depth + 1)
    }
    if (tree.right){
        findDepthSizes(tree.right, depth + 1)
    }
}

function findBoardWidth(){
    let numberOfRows = depthSizes.length
    return boardWidthRecur(numberOfRows)
}

function boardWidthRecur(depth){
    if (depth === 1){
        return 1;
    }
    return boardWidthRecur(depth - 1) * 2 + 3
}

function findBoardHeight(){
    let numberOfRows = depthSizes.length
    return boardHeightRecur(numberOfRows) + 1
}

function boardHeightRecur(depth){
    if (depth === 3){
        return 5;
    } if (depth === 2){
        return 2;
    } if (depth === 1){
        return 1;
    }
    return boardHeightRecur(depth - 1) + 3
}

function createGrid(width, height){
    let grid = [];
    for (let i = 0; i < height; i++){
        grid.push([]);
        for (let j = 0; j < width; j++){
            grid[i].push(" ");
        }
    }
    return grid;
}



function start(inp){
    depthSizes = []
    let tree = createObjectTree(inp);
    findDepthSizes(tree, 0);
    tree.flipRows()
    tree.assignDistanceToParent()
    const boardWidth = findBoardWidth();
    const boardHeight = findBoardHeight();
    tree.assignYValues(boardHeight)
    tree.assignXValues(true, boardWidth)
    let grid = createGrid(boardWidth, boardHeight);
    tree.place(grid)
    printGrid(grid)
}

start(randList(0, 999, 10))