var canvas;
var context;
// width and height of canvas
var W = 750,
	H = 500;
var pi = Math.PI;

var score = {
	human: 0,
	computer: 0
};

canvas = document.getElementById('game-canvas');
context = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;


function drawScore() {
	context.globalAlpha=0.2;
	context.font = "bold 80px Verdana";
	context.fillStyle = "#1C4934";
	context.fillText(score.human, 8, 100);
	context.fillText(score.computer, 670, 100);
	context.globalAlpha=1;
}


// Paint the game canvas background
function paintCanvas() {
	context.fillStyle = "#9EE493";
	context.fillRect(0, 0, W, H);
	context.font = "bold 16px Verdana";
	context.fillStyle = "#1C4934";
	context.fillText("Player", 8, 20);
	context.fillText("Computer", 650, 20);
}

// Draws the game board (boundaries)
function drawNet() {
	context.fillStyle = 'black';
	var w = 4;
	var x = (W - w)*0.5;
	var y = 0;
	var step = H/30;
	while (y < H){
		context.fillRect(x, y+step*.25, w, step*0.5);
		y += step;
	}
}

// Key Controls
var keystate = {};

window.addEventListener('keydown', function (event) {
	keystate[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
	delete keystate[event.keyCode];
});


// Player Object constructor
function Paddle(x, y) {
	this.x = x;
	this.y = y;
	this.color = "#358C99";
	this.width = 15;
	this.height = 100;
	this.velocity_y = 10;
	// top and bottom edges for detecting collisions
	this.edge = {
		top: this.y,
		bottom: this.y + this.height,
		right: this.x + this.width,
		left: this.x
	};
}

// Move the vertical distance 'dy'
Paddle.prototype.move = function (dy) {
	this.y += dy;

	// must account for the new edge positions
	this.edge.top += dy;
	this.edge.bottom += dy;
	this.velocity_y += dy;
};

Paddle.prototype.update = function () {
	for (var key in keystate) {
		var val = Number(key);
		if (val === 38) {
			// Only if the paddle y position equals 5 or more pixels (still has room to move 5 pixels to top boundary)
			if (human.paddle.y >= 5) {
				human.paddle.move(-5);
			}
		}
		// down arrow
		if (val === 40) {
			// Only if the paddle bottom (y position plus height) equals 495 or fewer pixels (still has room to move 5 pixels to bottom boundary)
			if ((human.paddle.y + human.paddle.height) <= 495) {
				human.paddle.move(5);
			}
		}
	}
};


Paddle.prototype.render = function () {
	context.beginPath();
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
};

function Human() {
	this.paddle = new Paddle(0, 200);
}

function Computer() {
	this.paddle = new Paddle(735, 200);
}

// Separate move function for computer because of the different paddle speed
Computer.prototype.move = function (dy) {
	this.paddle.y += dy;
	this.paddle.edge.top += dy;
	this.paddle.edge.bottom += dy;
	this.paddle.velocity_y += dy;
};

Computer.prototype.update = function (ball) {

	// Move computer paddle based on ball's vertical position
	var computer_y_dest = ball.y;

	var diff = -((this.paddle.y + (this.paddle.height * 0.5)) - computer_y_dest);
	if (diff < 0 && diff < -4) { 
		diff = -5;
	} else if (diff > 0 && diff > 4) { 
		diff = 5;
	}
	this.paddle.move(diff*0.85);
	if (this.paddle.y < 0) {
		this.paddle.y = 0;
	} else if (this.paddle.y + this.paddle.height > H) {
		this.paddle.y = (H - this.paddle.height);
	}


};

var human = new Human();
var computer = new Computer();

// Function to generate random number (between -5 and 5) for the initial y component of the velocity
// The initial x component of velocity will be the same in all cases
function randomVelocity() {
	var num = Math.floor(Math.random() * 5) + 1; // this will get a number between 1 and 5;
	num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
	return num;
}

// Ball Object Constructor
function Ball() {
	this.x = W/2;
	this.y = H/2;
	this.color = '#CC5B93';
	this.radius = 8;
	this.speed = 8;

	this.edge = {
		right: this.x + 10,
		left: this.x - 10,
		top: this.y - 10,
		bottom: this.y + 10
	};

	this.velocity_x = this.speed;
//	this.velocity_x = 0;
	this.velocity_y = randomVelocity();
	//	this.velocity_y = 20;
}

Ball.prototype.render = function () {
	context.fillStyle = this.color;
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 0, 2 * pi, false);
	context.fill();
};

// Build a new ball
var ball = new Ball();

Ball.prototype.update = function (human, computer) {

	this.x += this.velocity_x;
	this.y += this.velocity_y;
	
	// Collision with boundaries
	if (this.y < 0 || (this.y + this.radius) > H) {
		var offset = this.velocity_y < 0 ? 0 - this.y : H - (this.y + this.radius);
		this.y += 2 * offset;
		this.velocity_y = -this.velocity_y;
	}
	
	
	var intersect = function(px, py, pw, ph, bx, by, bw, bh) {
		return px < bx + bw && py < by + bh && bx < px + pw && by < py + ph;
	};
	
	// determine which paddle the ball is approaching
	var paddle;
	if (this.velocity_x < 0){
		paddle = human.paddle;
	}
	else {
		paddle = computer.paddle;
	}
	
	if (intersect(paddle.x, paddle.y, paddle.width, paddle.height, this.x, this.y, this.radius, this.radius)){
		this.x = paddle === human.paddle ? human.paddle.x + human.paddle.width : computer.paddle.x - this.radius;
		var n = (this.y + this.radius - paddle.y)/(paddle.height + this.radius);
		var phi = 0.25*pi*(2*n - 1);
		if (paddle === human.paddle){
			this.velocity_x = (this.speed*Math.cos(phi));
			this.velocity_y = this.speed*Math.sin(phi);
		}
		else if (paddle === computer.paddle) {
			this.velocity_x = (this.speed*Math.cos(phi));
			this.velocity_y = this.speed*Math.sin(phi);
		}	
		
	}
	else {
		if (paddle === human.paddle){
			if ((this.x) < 0) {
				score.computer ++;
				this.x = W/2;
				this.y = H/2;
				this.velocity_y = 0;
				if (score.computer === 10){
					document.getElementById('end-game-text').innerHTML = "Sorry, you lost :\(";
					document.getElementById('end-game').style.visibility = "visible";
					score.human = 0;
				  score.computer = 0;
				}
			}
		}
		else {
			if ((this.x + this.radius) > W){
				score.human ++;
				this.x = W/2;
				this.y = H/2;
				this.velocity_y = 0;
				if (score.human === 10){
					document.getElementById('end-game-text').innerHTML = "Congratulations, you won!";
					document.getElementById('end-game').style.visibility = "visible";
					score.human = 0;
				  score.computer = 0;
				}
			}
		}
	}

	if ((this.x + this.radius) >= computer.paddle.x) {
		if ((this.y - this.radius) < (computer.paddle.y + computer.paddle.height) && (this.y + this.radius) > computer.paddle.y) {
			console.log('collision with computer paddle detected');

			this.velocity_x = -this.velocity_x;
			this.velocity_y = -this.velocity_y;

		} else {
			console.log('missed the paddle, point for human');
//			this.x = 325;
//			this.y = 250;
		}
	}

};

var update = function () {
	ball.update(human, computer);
	human.paddle.update();
	computer.update(ball);
};

var render = function () {
	paintCanvas();
	drawScore();
	human.paddle.render();
	computer.paddle.render();
	drawNet();
	ball.render();
};


// Actions needed for each repaint
var step = function () {
	update();
	render();
	animate(step);
};

// Animate function
var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};

window.onload = function () {
	step();
};