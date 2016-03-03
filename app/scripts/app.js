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

function addKeyEvents() {
	window.addEventListener('keydown', onKeyDown, true);
}

// Player Object constructor
function Paddle(x, y) {
	this.x = x;
	this.y = y;
	this.color = "#846863";
	this.width = 15;
	this.height = 100;
	this.speed = 10;
}

// Move the vertical distance 'dy'
Paddle.prototype.move = function (dy) {
	// clear the current rectangle
	context.clearRect(this.x, this.y, this.width, this.height);
	this.y += dy;
}

Paddle.prototype.render = function () {
	context.beginPath();
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
}

function onKeyDown(e) {
	// up arrow
	if (e.keyCode === 38) {
		// Move 10 pixels on the y axis towards the origin
		// Only if the paddle y position equals 30 or more pixels (still has room to move 10 pixels to top boundary)
		if (human.paddle.y >= 30) {
			human.paddle.move(-10);
		}
	}
	// down arrow
	if (e.keyCode === 40) {
		// Move 10 pixels on the y axis away from the origin 
		// Only if the paddle y position equals 370 or fewer pixels (still has room to move 10 pixels to bottom boundary)
		if (human.paddle.y <= 370) {
			human.paddle.move(10);
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
	this.velocity_x = 5;
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

Ball.prototype.update = function() {
	this.x += this.velocity_x;
	this.y += this.velocity_y;
};

var update = function () {
	ball.update();
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
	addKeyEvents();
};