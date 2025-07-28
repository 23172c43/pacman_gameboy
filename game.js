const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

const pacmanFrames = document.getElementById("animation")
const ghostFrames = document.getElementById("ghosts");

const btnUp = document.getElementById("btn-up")
const btnRight = document.getElementById("btn-right")
const btnLeft = document.getElementById("btn-left")
const btnDown = document.getElementById("btn-down")

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let fps = 30
let oneBlockSize = 20
let wallColor = '#342DCA'
let wallSpaceWidth = oneBlockSize / 1.5
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2
let wallInnerColor = "black"
let foodColor = "#FEB897"
let score = 0
let ghosts = []
let ghostCount = 4;
let lives = 3
let foodCount = 0

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_BOTTOM = 1

let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];



let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for(let i = 0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
        if(map[i][j] == 2){
            foodCount++;
        }
    }
}

let randomTargetForGhosts = [
    {x: 1 * oneBlockSize, y : 1 * oneBlockSize},
    {x: 1 * oneBlockSize, y : (map.length - 2) * oneBlockSize},
    {x: (map[0].length * 2) * oneBlockSize, y: oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize}
]

let gameLoop = () => {
    draw()
    update()
}

let update = () => {
    pacman.moveProcess()
    pacman.eat()

    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].moveProcess()
    }

    if(pacman.checkGhostCollision()){
        restartGame()
    }

    if(score >= foodCount){
        drawWin();
    }
}



let restartGame = () =>{
    createNewPacman()
    createGhosts()
    lives--

    if(lives == 0){
        gameOver()
    }
}

let gameOver = () => {
    drawGameOver()
    clearInterval(gameInterval)
}

let drawGameOver = () => {
    canvasContext.fillText("Game Over!", 200, 200);
}

let drawWin = () => {
    canvasContext.fillText("Winner!", 200, 200);
}

let drawLives = () => {
    canvasContext.font = "20px Bitcount"
    canvasContext.fillStyle = "white"
    canvasContext.fillText("Lives: ", 200, oneBlockSize * (map.length + 1))

    for(let i = 0; i < lives; i++){
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        )
    }
}

let drawFoods = () => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 2){
                createRect(j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                )
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px Bitcount";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let drawGhosts = () => {
    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].draw()
    }
}

let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black")
    drawWalls()
    drawFoods()
    pacman.draw()
    drawScore()
    drawGhosts()
    drawLives()
}

let gameInterval = setInterval(gameLoop, 1000 / fps)

let drawWalls = () => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 1){ //then it is wall
                createRect(j * oneBlockSize, 
                    i * oneBlockSize, 
                    oneBlockSize, 
                    oneBlockSize,
                    wallColor
                )
            }

            if(j > 0 && map[i][j - 1] == 1){
                createRect(j * oneBlockSize, 
                    i * oneBlockSize + wallOffset, 
                    wallSpaceWidth + wallOffset, 
                    wallSpaceWidth, 
                    wallInnerColor
                )
            }

            if(j < map.length - 1 && map[i][j + 1] == 1){
                createRect(j * oneBlockSize + wallOffset, 
                    i * oneBlockSize + wallOffset, 
                    wallSpaceWidth + wallOffset, 
                    wallSpaceWidth, 
                    wallInnerColor
                )
            }

            if(i > 0 && map[i - 1][j] == 1){
                createRect(j * oneBlockSize + wallOffset, 
                    i * oneBlockSize, 
                    wallSpaceWidth, 
                    wallSpaceWidth + wallOffset, 
                    wallInnerColor
                )
            }

            if(i < map.length - 1 && map[i + 1][j] == 1){
                createRect(j * oneBlockSize + wallOffset, 
                    i * oneBlockSize + wallOffset, 
                    wallSpaceWidth, 
                    wallSpaceWidth  + wallOffset, 
                    wallInnerColor
                )
            }
        }
    }
}

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    )
}

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener('keydown', (event) => {
    let k = event.keyCode

    setTimeout(() => {
        if(k == 37 || k == 65){ //left
            pacman.nextDirection = DIRECTION_LEFT
        } else if(k == 38 || k == 87){ //up
            pacman.nextDirection = DIRECTION_UP
        } else if(k == 39 || k == 68){ // right
            pacman.nextDirection = DIRECTION_RIGHT
        } else if(k == 40 || k == 83){ //down
            pacman.nextDirection = DIRECTION_BOTTOM
        }
    }, 1)
})

// Xử lý vuốt trên điện thoại
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", function (e) {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) {
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (diffX < -30) {
            pacman.nextDirection = DIRECTION_LEFT;
        }
    } else {
        if (diffY > 30) {
            pacman.nextDirection = DIRECTION_BOTTOM;
        } else if (diffY < -30) {
            pacman.nextDirection = DIRECTION_UP;
        }
    }
});

btnUp.onclick = function(){
    pacman.nextDirection = DIRECTION_UP
}

btnDown.onclick = function(){
    pacman.nextDirection = DIRECTION_BOTTOM
}

btnLeft.onclick = function(){
    pacman.nextDirection = DIRECTION_LEFT
}

btnRight.onclick = function(){
    pacman.nextDirection = DIRECTION_RIGHT
}