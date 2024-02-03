var myGamePiece1;
var myGamePiece2;
var obstacles;
var score;

function startGame() {
    score = [0,0];
    myGamePiece1 = new component(30, 30, "red", 225, 225);
    myGamePiece2 = new component(30, 30, "blue", 225, 45);
    obstacles = [
        new obstacle(50, 100, "green", 150, 100),
        new obstacle(100, 50, "green", 200, 150)
    ];
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
    this.slow = false;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();    
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
    this.getCorners= function(){
        var corners = [];
        corners.push([this.x - this.width / 2, this.y - this.height / 2]); // Top-left
        corners.push([this.x + this.width / 2, this.y - this.height / 2]); // Top-right
        corners.push([this.x - this.width / 2, this.y + this.height / 2]); // Bottom-left
        corners.push([this.x + this.width / 2, this.y + this.height / 2]); // Bottom-right
        return corners;
    }
}

function obstacle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    // Draw obstacles
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
    myGamePiece1.moveAngle = 0;
    myGamePiece1.speed = 0;
    myGamePiece2.moveAngle = 0;
    myGamePiece2.speed = 0;

    // Check for collisions with the edges of the canvas for myGamePiece1
    var corners1 = myGamePiece1.getCorners();
    for (var i = 0; i < corners1.length; i++) {
        if (corners1[i][0] <= 0 || corners1[i][0] >= myGameArea.canvas.width ||
            corners1[i][1] <= 0 || corners1[i][1] >= myGameArea.canvas.height) {
            // Adjust the position to prevent going out of bounds
            score = [score[0],score[1]+1];
            console.log(score);
            myGamePiece1.speed = 0;
            myGamePiece1.newPos(); // Update position
            myGamePiece1.x = 225;
            myGamePiece1.y = 125;
            break; // No need to check further if any corner is out of bounds
        }
    }

    // Check for collisions with obstacles for myGamePiece1
    for (var i = 0; i < obstacles.length; i++) {
        if (myGamePiece1.x < obstacles[i].x + obstacles[i].width &&
            myGamePiece1.x + myGamePiece1.width > obstacles[i].x &&
            myGamePiece1.y < obstacles[i].y + obstacles[i].height &&
            myGamePiece1.y + myGamePiece1.height > obstacles[i].y) {
            // Adjust the position to prevent collision with obstacle
            console.log("on green 1")
            myGamePiece1.slow = true;
            myGamePiece1.speed = 0;
            myGamePiece1.newPos(); // Update position
            break;
        } else {
            myGamePiece1.slow = false;
        }
    }

    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece1.moveAngle = -3; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece1.moveAngle = 3; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece1.speed= 3; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece1.speed= -3; }
    if (myGamePiece1.slow == true){
        if (myGamePiece1.speed > 0){
            myGamePiece1.speed = 1
        } else if (myGamePiece1.speed < 0){
            myGamePiece1.speed = -1
        }  else {
            myGamePiece1.speed = 0
        }
        if (myGamePiece1.moveAngle > 0){
            myGamePiece1.moveAngle = 1
        } else if (myGamePiece1.moveAngle < 0){
            myGamePiece1.moveAngle = -1
        }  else {
            myGamePiece1.moveAngle = 0
        }
    }
    myGamePiece1.newPos();
    myGamePiece1.update();

    // Check for collisions with the edges of the canvas for myGamePiece2
    var corners2 = myGamePiece2.getCorners();
    for (var i = 0; i < corners2.length; i++) {
        if (corners2[i][0] <= 0 || corners2[i][0] >= myGameArea.canvas.width ||
            corners2[i][1] <= 0 || corners2[i][1] >= myGameArea.canvas.height) {
            // Adjust the position to prevent going out of bounds
            score = [score[0]+1,score[1]];
            console.log(score);
            myGamePiece2.speed = 0;
            myGamePiece2.newPos(); // Update position
            myGamePiece2.x = 225;
            myGamePiece2.y = 125;
            break; // No need to check further if any corner is out of bounds
        }
    }

    // Check for collisions with obstacles for myGamePiece2
    for (var i = 0; i < obstacles.length; i++) {
        if (myGamePiece2.x < obstacles[i].x + obstacles[i].width &&
            myGamePiece2.x + myGamePiece2.width > obstacles[i].x &&
            myGamePiece2.y < obstacles[i].y + obstacles[i].height &&
            myGamePiece2.y + myGamePiece2.height > obstacles[i].y) {
                console.log("on green 2")
                // Adjust the position to prevent collision with obstacle
                myGamePiece2.speed = 0;
                myGamePiece2.newPos(); // Update position
                break;
        }
    }

    if (myGameArea.keys && myGameArea.keys[65]) {myGamePiece2.moveAngle = -3; }
    if (myGameArea.keys && myGameArea.keys[68]) {myGamePiece2.moveAngle = 3; }
    if (myGameArea.keys && myGameArea.keys[87]) {myGamePiece2.speed= 3; }
    if (myGameArea.keys && myGameArea.keys[83]) {myGamePiece2.speed= -3; }
    myGamePiece2.newPos();
    myGamePiece2.update();
}
