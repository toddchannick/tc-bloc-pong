var canvas;
var	context;
// width and height of canvas
var W = 650,
		H = 500;

// Initialize the game canvas
function init(){
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
	context.lineWidth = 6;
	context.strokeStyle = 'black';
	context.strokeRect(25, 25, 600, 450);
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
	// Move the vertical distance 'dy'
	this.move = function (dy) {
		// clear the current rectangle
		context.clearRect(this.x, this.y, this.width, this.height);
		this.y += dy;
	}
	this.render = function () {
		context.beginPath();
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	};
}

function onKeyDown(e) {
	// up arrow
	if (e.keyCode === 38) {
		// Move 10 pixels on the y axis towards the origin
		// Only if the paddle y position equals 35 or more pixels (still has room to move 10 pixels to top boundary)
		if (human.y >= 35){
			human.move(-10);	
		}
	}
	// down arrow
	if (e.keyCode === 40) {
		// Move 10 pixels on the y axis away from the origin 
		// Only if the paddle y position equals 365 or fewer pixels (still has room to move 10 pixels to bottom boundary)
		if (human.y <= 365){
			human.move(10);
		}	
	}
}

// Declaring a human and computer paddle
var human = new Paddle(35, 200);
var computer = new Paddle(600, 200);


// Ball Object Constructor
function Ball() {
	this.x = 325;
	this.y = 250;
	this.color = '#AC4E7D';
	this.radius = 10;
	this.render = function () {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
	};
}

// Declaring a new ball
var ball = new Ball();

var render = function () {
	paintCanvas();
	drawBoundaries();
	human.render();
	computer.render();
	ball.render();
	// redraw
	animate(render);
};

// Actions needed for each repaint
function step(){
	render();
}

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