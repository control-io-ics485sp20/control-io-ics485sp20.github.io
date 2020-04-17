var gameName = "Control.IO"

var lobbyWaitingMessage = "Waiting for players..."
var lobbyJoinInstructionMessage = "Join by keyboard or connect a controller."
var lobbyJoinKeyboardInstructionMessage = "Keyboard detected.<br><br>Press <b>SHIFT</b> to join this controller."
var lobbyJoinControllerInstructionMessage = "Controller detected.<br><br>Press <b>START</b> to join this controller."
var lobbyPlayerJoinedStatus = "Joined"
var readyButtonText = "SPACE / A - START GAME"

//object arrays to keep track of items
var players = []; //list of all players
var asteroids = []; //list of all asteroids
var controllers = []; //list of all controllers

//debugging options
var debug = true;
var showHitboxes = true;

var max_x = window.innerWidth;
// var min_x = -max_x;
var min_x = 0;
var max_y = window.innerHeight;
// var min_y = -max_y;
var min_y = 0;

//game options
//player
var PlayerMinVelocityCap = 3;
var PlayerMaxVelocityCap = 5;
var PlayerMinControlPoints = 3;
var PlayerMaxControlPoints = 6;
var PlayerHitboxColor = 'white'; //'#5cff59'

var player_radius = .07;

// var keyboard_player_max_diagonal_velocity = 0.93;
var PlayerKeyboardDiagonalVelocityCap = 0.93;
var keyboard_player_max_linear_velocity = 1;
// var keyboard_player_max_linear_velocity = 1;

var lineWidth = 6;
var playersprite_scale = 0.08; //not working

//used to set the bounds of the canvas.?
// var canvas_multiplier = 335;

//asteroid
var AsteroidMinSpeed = 2
var AsteroidMaxSpeed = 3
var AsteroidMinSpinSpeed = 0.5
var AsteroidMaxSpinSpeed = 3
var AsteroidMinSize = 1
var AsteroidMaxSize = 2
var AsteroidAllowNoSpin = false;
var AsteroidHitboxColor = 'red';
var AsteroidSpawnBorder = 0;
var AsteroidSpawnRate = 3;
var AsteroidSpawnCap = 15;

var AsteroidMinX = min_x;
var AsteroidMaxX = max_x;
var AsteroidMinY = min_y;
var AsteroidMaxY = max_y;

var AsteroidDespawnMinX = min_x - AsteroidSpawnBorder;
var AsteroidDespawnMaxX = max_x + AsteroidSpawnBorder;
var AsteroidDespawnMinY = min_y - AsteroidSpawnBorder;
var AsteroidDespawnMaxY = max_y + AsteroidSpawnBorder;
var AsteroidDespawnUpperLeft = [AsteroidDespawnMinX, AsteroidDespawnMaxY];
var AsteroidDespawnUpperRight = [AsteroidDespawnMaxX, AsteroidDespawnMaxY];
var AsteroidDespawnLowerLeft = [AsteroidDespawnMinX, AsteroidDespawnMinY];
var AsteroidDespawnLowerRight = [AsteroidDespawnMaxX, AsteroidDespawnMinY];

//canvas
var zoom_percent = 100;

var sensitivity_buffer = 0.08;

var playerCount = 0
