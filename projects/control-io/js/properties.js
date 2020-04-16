var gameName = "Control.IO"

var lobbyWaitingMessage = "Waiting for players..."
var lobbyJoinInstructionMessage = "Join by keyboard or connect a controller."
var lobbyJoinKeyboardInstructionMessage = "Keyboard detected.<br><br>Press <b>SHIFT</b> to join this controller."
var lobbyJoinControllerInstructionMessage = "Controller detected.<br><br>Press <b>START</b> to join this controller."
var lobbyPlayerJoinedStatus = "Joined"
var readyButtonText = "SPACE / A - START GAME"

var max_x = window.innerWidth;
// var min_x = -max_x;
var min_x = 0;
var max_y = window.innerHeight;
// var min_y = -max_y;
var min_y = 0;

var player_minimum_max_velocity = 3;
var player_maximum_max_velocity = 5;

var player_minimum_control_points = 3;
var player_maximum_control_points = 6;

var players = []; //array of players
var player_radius = .07;

var keyboard_player_max_diagonal_velocity = 0.93;
var keyboard_player_max_linear_velocity = 1;

var lineWidth = 6;
var playersprite_scale = 0.08; //not working

//used to set the bounds of the canvas.?
var canvas_multiplier = 335;

var debug = true;

var zoom_percent = 100;

var controllers = [];
var sensitivity_buffer = 0.08;

var playerCount = 0

const asteroids = [];
