var canvas;
var context;
// width and height of canvas
var W = 650,
	H = 500;

// Initialize the game canvas
function init() {
	canvas = document.getElementById('game-canvas');
	context = canvas.getContext('2d');
	canvas.width = W;
	canvas.height = H;
}

// Paint the game canvas background
function paintCanvas() {
	context.fillStyle = "#E1EFE7";
	context.fillRect(0, 0, W, H);
}

// Draws the game board (boundaries)
function drawBoundaries() {
	context.beginPath();
	context.lineWidth = 4;
	context.strokeStyle = 'black';
	context.strokeRect(20, 20, 610, 460);
}

// Key Controls
var keysPressed = {};

window.addEventListener('keydown', function (event) {
	keysPressed[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
	delete keysPressed[event.keyCode];
});


// Player Object constructor
function Paddle(x, y) {
	this.x = x;
	this.y = y;
	this.color = "#846863";
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
}

Paddle.prototype.update = function () {
	for (var key in keysPressed) {
		var val = Number(key);
		if (val === 38) {
			// Move 5 pixels on the y axis towards the origin
			// Only if the paddle y position equals 30 or more pixels (still has room to move 10 pixels to top boundary)
			if (human.paddle.y >= 25) {
				human.paddle.move(-5);
			}
		}
		// down arrow
		if (val === 40) {
			// Move 5 pixels on the y axis away from the origin 
			// Only if the paddle y position equals 370 or fewer pixels (still has room to move 10 pixels to bottom boundary)
			if (human.paddle.y <= 375) {
				human.paddle.move(5);
			}
		}
	}
};


Paddle.prototype.render = function () {
	context.beginPath();
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
}

function onKeyDown(e) {
	// up arrow
	if (e.keyCode === 38) {
		// Move 5 pixels on the y axis towards the origin
		// Only if the paddle y position equals 30 or more pixels (still has room to move 10 pixels to top boundary)
		if (human.paddle.y >= 25) {
			human.paddle.move(-5);
		}
	}
	// down arrow
	if (e.keyCode === 40) {
		// Move 5 pixels on the y axis away from the origin 
		// Only if the paddle y position equals 370 or fewer pixels (still has room to move 10 pixels to bottom boundary)
		if (human.paddle.y <= 375) {
			human.paddle.move(5);
		}
	}
}

function Human() {
	this.paddle = new Paddle(30, 200);
}

function Computer() {
	this.paddle = new Paddle(605, 200);
}

var human = new Human();
var computer = new Computer();


// Ball Object Constructor
function Ball() {
	this.x = 325;
	this.y = 250;
	this.color = '#AC4E7D';
	this.radius = 10;

	this.edge = {
		right: this.x + 10,
		left: this.x - 10,
		top: this.y - 10,
		bottom: this.y + 10
	}

	this.velocity_x = -5;
	this.velocity_y = 0;
}

Ball.prototype.render = function () {
	context.fillStyle = this.color;
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	context.fill();
};

// Build a new ball
var ball = new Ball();

Ball.prototype.update = function (human, computer) {
	var p1 = human.paddle;
	var p2 = computer.paddle;

	this.x += this.velocity_x;
	this.y += this.velocity_y;

	this.edge.left += this.velocity_x;
	this.edge.right += this.velocity_x;

	this.edge.top += this.velocity_y;
	this.edge.bottom += this.velocity_y;

	// If ball's left edge is equal to the right edge of the paddle
	// AND if the ball if within the paddles top and bottom edges ---> COLLISION
	if (this.edge.left === p1.edge.right){
		if (this.edge.top < p1.edge.bottom && this.edge.bottom > p1.edge.top) {
			console.log('collision detected');
			this.velocity_x = -this.velocity_x;
		}
		else {
			console.log('missed the paddle');
		}
	}

	if (this.edge.right === p2.edge.left){
		if (this.edge.top < p2.edge.bottom && this.edge.bottom > p2.edge.top) {
			console.log('collisi	on detected');
			this.velocity_x = -this.velocity_x;
		}
		else {
			console.log('missed the paddle');
		}
	}

};

// Update function which runs during repaint with updated positions
var update = function () {
	ball.update(human, computer);
	human.paddle.update();
};

var render = function () {
	paintCanvas();
	human.paddle.render();
	computer.paddle.render();
	drawBoundaries();
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
	init();
	step();
};