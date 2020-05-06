var gameName = "Control.IO"

var lobbyWaitingMessage = "Waiting for players..."
var lobbyJoinInstructionMessage = "Join by keyboard or connect a controller."
var lobbyJoinKeyboardInstructionMessage = "Keyboard detected.<br><br>Press <b>SHIFT</b> to join this controller."
var lobbyJoinControllerInstructionMessage = "Controller detected.<br><br>Press <b>START</b> to join this controller."
var lobbyPlayerJoinedStatus = "Joined"
var readyButtonText = "SPACE / A - START GAME"

//object arrays to keep track of items
var controllers = []; //list of all controllers

//debugging options
var debug = true;
var showHitboxes = true;

var MinPlayers = 1;
// var TotalPlayers;
var zoom_percent = 100;
var sensitivity_buffer = 0.08;
var playerCount = 0

var max_x = window.innerWidth;
var min_x = 0;
var max_y = window.innerHeight;
var min_y = 0;

var pi = Math.PI;

var fpscap = 30;

//game options
//---------------
//[ P L A Y E R ]
//---------------
var PlayerBaseHP = 150;

var PlayerMinVelocityCap = 3;
var PlayerMaxVelocityCap = 5;
var PlayerMinControlPoints = 3;
var PlayerMaxControlPoints = 6;
var PlayerHitboxColor = 'white';
var PlayerSpawnBorderThreshold = 20;
var player_radius = .07;

var PlayerSpawnBorderMinX = min_x - PlayerSpawnBorderThreshold;
var PlayerSpawnBorderMaxX = max_x + PlayerSpawnBorderThreshold;
var PlayerSpawnBorderMinY = min_y - PlayerSpawnBorderThreshold;
var PlayerSpawnBorderMaxY = max_y + PlayerSpawnBorderThreshold;

var PlayerKeyboardDiagonalVelocityCap = 0.93;
var keyboard_player_max_linear_velocity = 1;
// var keyboard_player_max_linear_velocity = 1;

var lineWidth = 6;
var playersprite_scale = 0.08; //not working

var PlayerMinX = min_x;
var PlayerMaxX = max_x;
var PlayerMinY = min_y;
var PlayerMaxY = max_y;

//-------------------
//[ A S T E R O I D ]
//-------------------
var AsteroidMinSpeed = 2.5
var AsteroidMaxSpeed = 3
var AsteroidMinSpinSpeed = 0.5
var AsteroidMaxSpinSpeed = 3
var AsteroidMinSize = 1
var AsteroidMaxSize = 2
var AsteroidAllowNoSpin = false;
var AsteroidHitboxColor = 'yellow';
var AsteroidSpawnBorderThreshold = 20;
var AsteroidSpawnRate = 5; //3
var AsteroidSpawnCap = 20; //20
var AsteroidDamageToPlayers = 10; //10
var AsteroidDamageToForcefields = 4; //7

var GameObjectBorderMinX = min_x - AsteroidSpawnBorderThreshold;
var GameObjectBorderMaxX = max_x + AsteroidSpawnBorderThreshold;
var GameObjectBorderMinY = min_y - AsteroidSpawnBorderThreshold;
var GameObjectBorderMaxY = max_y + AsteroidSpawnBorderThreshold;

//-----------------------
//[ F O R C E F I E L D ]
//-----------------------
var ForcefieldHPModifier = 1;

