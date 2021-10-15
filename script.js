var canvas;
var canvasContex;
var ballX = 50;
var ballSpeedX = 4;
var ballY = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var titleScreen = true;

var showWinScreen = false;

var paddle2Y = 250;
var paddle1Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

function calculateMousePosition(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    // offset X/Y coordinates within playable space
    var mouseX = evt.cilentX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };

}

function handleMouseClick(evt){
    if (titleScreen){
        titleScreen = false;
    }

    if (showWinScreen){
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContex = canvas.getContext('2d');

    var framesPerSecond = 60;
    setInterval(updateEverything, 1000/framesPerSecond)

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = calculateMousePosition(evt);
        // centre paddle on mouse
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    })
}

function ballReset(){
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        player1Score = 0;
        player2Score = 0;
        showWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function updateEverything(){
    moveEverything();
    drawEverything();
}

function drawNet(){
    for (var i=0; i<=canvas.height; i+=40){
        colorRect(canvas.width/2-1,i,2,30,'white');
    }
}

function drawEverything(){
    //background black
    colorRect (0,0, canvas.width, canvas.height, 'black');

    if (titleScreen == true){
        canvasContex.fillStyle = 'white';
        canvasContex.fillText("CLICK TO START", 345,500)
        return
    }

    if (showWinScreen == true) {
        canvasContex.fillStyle = 'white';
        if (player1Score = WINNING_SCORE){
            canvasContex.fillText("PLAYER 1 WINS", 350,200)
        } else if (player2Score = WINNING_SCORE){
            canvasContex.fillText("PLAYER 2 WINS", 350,200)

        }
        canvasContex.fillText("CLICK TO CONTINUE", 345,500)
        return;
    }
    // line down middle
    drawNet();

    // paddle LEFT
    colorRect (0,paddle1Y,PADDLE_WIDTH,100, 'white');
    // paddle RIGHT
    colorRect (canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,100, 'white');

    // the ball
    colorCircle(ballX, ballY, 10, 'white');

    // scores
    canvasContex.fillText("Player 1 score" + " : " + player1Score, 100,100)
    canvasContex.fillText("Player 2 score" + " : " + player2Score, canvas.width-200, 100)


}

function colorCircle(centreX, centreY, radius, drawColor){
    canvasContex.fillStyle = drawColor;
    canvasContex.beginPath();
    canvasContex.arc(centreX, centreY, radius,0,Math.PI*2, true);
    canvasContex.fill();

}

// creates rectangles with fill colours
function colorRect(leftX, topY, width, height, drawColor){
    canvasContex.fillStyle = drawColor;
    canvasContex.fillRect (leftX, topY, width, height);

}

function computerMovement(){
    var paddle2YCentre = paddle2Y + PADDLE_HEIGHT/2;
    if (paddle2YCentre < ballY - 20 && ballX > canvas.width/4){
        paddle2Y += 5
    } else if (paddle2YCentre > ballY + 20 && ballX > canvas.width/4) {
        paddle2Y -= 5
    }


}

function moveEverything(){
    if (showWinScreen == true) {
        return;
    }
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY

    if (ballX <= (PADDLE_WIDTH)){
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY

            //offset for edge of paddle hits, centre gives no Y acceleration
            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.25;

        } else {
            // adds score before reset, allows for end condition check
            player2Score++;
            ballReset();
        }
    }

    if (ballX >= (canvas.width - PADDLE_WIDTH)){
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;

                //offset for edge of paddle hits, centre gives no Y acceleration
                var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.25;
        } else {
            player1Score++;
            ballReset();
        }
    }

    if (ballY >= canvas.height || ballY <= 0){
        ballSpeedY = -ballSpeedY;
    }

}