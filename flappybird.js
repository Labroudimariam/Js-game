let board;
let boardWidth = 500;
let boardHeight = 570;
let context;


let birdWidth = 40;
let birdHeight = 36;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let obstacleArray = [];
let obstacleWidth = 45; 
let obstacleHeight = 500;
let obstacleX = boardWidth;
let obstacleY = 0;

let topobstacleImg;
let bottomobstacleImg;

let velocityX = -2; 
let velocityY = 0; 
let gravity = 0.4;

let gameOver = false;
let score = 0;
let totalTime = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

    birdImg = new Image();
    birdImg.src = "bird1.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }    
    topobstacleImg = new Image();
    topobstacleImg.src = "obstacle1.jpeg";

    bottomobstacleImg = new Image();
    bottomobstacleImg.src = "obstacle1.jpeg";


    requestAnimationFrame(update);
    setInterval(placeobstacles, 1500); 
    document.addEventListener("keydown", moveBird);
}
function update() {
    requestAnimationFrame(update);
        
    if (score>=20){
        gameOver=true;
        context.fillText(" YOU WIN ",160,250);

    }
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;

    bird.y = Math.max(bird.y + velocityY, 0); 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
    if (bird.y > board.height) {
        gameOver = true;
    }
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (!obstacle.passed && bird.x > obstacle.x + obstacle.width) {
            score += 0.5; 
            obstacle.passed = true;
        }

        if (detectCollision(bird, obstacle)) {
            gameOver = true;
        }
    }
   

    context.fillStyle = "black";
    context.font="25px Arial";
    context.fillText(`time : ${totalTime} sec`,5,45);
    context.fillText(`score : ${score}`, 5, 95);



    if (gameOver) {
        context.fillText(" GAME OVER ",160,250);
    }
}

function placeobstacles() {
    if (gameOver) {
        return;
    }
    totalTime++

    let randomobstacleY = obstacleY - obstacleHeight/4 - Math.random()*(obstacleHeight/2);
    let openingSpace = board.height/4;

    let topobstacle = {
        img : topobstacleImg,
        x : obstacleX,
        y : randomobstacleY,
        width : obstacleWidth,
        height : obstacleHeight,
        passed : false
    }
    obstacleArray.push(topobstacle);

    let bottomobstacle = {
        img : bottomobstacleImg,
        x : obstacleX,
        y : randomobstacleY + obstacleHeight + openingSpace,
        width : obstacleWidth,
        height : obstacleHeight,
        passed : false
    }
    obstacleArray.push(bottomobstacle);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "Enter") {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            obstacleArray = [];
            score = 0; 
            totalTime = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;   
}