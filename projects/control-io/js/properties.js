var max_x = window.innerWidth;
var min_x = -max_x;
var max_y = window.innerHeight;
var min_y = -max_y;

var player_max_velocity = .05;
var players = []; //array of players
var player_radius = .07;

//used to set the bounds of the canvas.?
var canvas_multiplier = 335;

var debug = false;

var zoom_percent = 100;
