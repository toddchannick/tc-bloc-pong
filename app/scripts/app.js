var canvas = document.getElementById('game-canvas');
var context = canvas.getContext('2d');


// Board 
context.beginPath();
context.lineWidth = 6;
context.strokeStyle = 'black';
context.strokeRect(25, 25, 600, 450);


// Player Object constructor
function Player(x, y){
  this.x = x;
  this.y = y;
  this.color = "#846863";
  this.width = 15;
	this.height = 100;
	this.render = function(){
		context.beginPath();
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);		
	}
}

// Declaring a human and computer paddle
var human = new Player(35, 200);
var computer = new Player(600, 200);

// Calling render function to draw paddles
human.render();
computer.render();



// Ball Object Constructor
function Ball(){
  this.x = 200;
  this.y = 150;
  this.color = '#AC4E7D';
  this.radius = 8;
	this.render = function(){
		context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
    context.fill();
	}
}

// Declaring a new ball
var ball = new Ball();

// Rendering the new ball
ball.render();
