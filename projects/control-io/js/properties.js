var gameName = "Control.IO"

var lobbyWaitingMessage = "Waiting for players..."
var lobbyJoinInstructionMessage = "Join by keyboard or connect a controller."
var lobbyJoinKeyboardInstructionMessage = "Keyboard detected.<br><br>Press <b>SHIFT</b> to join this controller."
var lobbyJoinControllerInstructionMessage = "Controller detected.<br><br>Press <b>START</b> to join this controller."
var lobbyPlayerJoinedStatus = "Joined"
var readyButtonText = "SPACE / A - START GAME"

//object arrays to keep track of items
var controllers = []; //list of all controllers
var asteroids = [];

var renderEngine = "paper" //"matter" or "paper"
// var renderEngine = "matter" //"matter" or "paper"

//debugging options
var debug = false;
var showHitboxes = false;

var MinPlayers = 1;
// var TotalPlayers;
var gametime = 120; //120
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

var PlayerMinVelocityCap = 4;
var PlayerMaxVelocityCap = 6;
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

var AsteroidMinSpeed2 = 2
var AsteroidMaxSpeed2 = 4
var AsteroidMinSpinSpeed2 = 0.01
var AsteroidMaxSpinSpeed2 = 0.04

var AsteroidMinSize = 1
var AsteroidMaxSize = 2
var AsteroidAllowNoSpin = false;
var AsteroidHitboxColor = 'yellow';
var AsteroidSpawnBorderThreshold = 20;
var AsteroidSpawnRate = 5; //3
var AsteroidSpawnCap = 20; //20
var AsteroidDamageToPlayers = 10; //10
var AsteroidDamageToForcefields = 2; //7

var GameObjectBorderMinX = min_x - AsteroidSpawnBorderThreshold;
var GameObjectBorderMaxX = max_x + AsteroidSpawnBorderThreshold;
var GameObjectBorderMinY = min_y - AsteroidSpawnBorderThreshold;
var GameObjectBorderMaxY = max_y + AsteroidSpawnBorderThreshold;

//-----------------------
//[ F O R C E F I E L D ]
//-----------------------
var ForcefieldHPModifier = 1;

//MATTER.JS
//https://stackoverflow.com/questions/50959493/matter-js-for-collision-detection/55484279
//Create engine - All the game stuff
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Composites = Matter.Composites,
    Common = Matter.Common,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

var canvas;
var engine;
var world;
var render;
var runner;

var asteroid_hitboxes = 4;
var ship_hitboxes = 5;
var marker_hitboxes = 6;

//PRELOAD.JS
var image_bg = preload.getResult("../img/background/starry_night.png").result;
var image_playerbase = preload.getResult("../img/sprites/playersprite01-base.png").result;

var asteroidCategory = 0x0001;
var asteroidBarrierCategory = 0x0002;
var shipCategory = 0x0004;
var shipBarrierCategory = 0x0008;
// var asteroidBarrierCategory = 0x0008;


// var shipfilter = {
        //     group: 0,
        //     category: 30,
        //     mask: 30,
        // }
        // var shipbarrierfilter = {
        //     group: 0,
        //     category: 24,
        //     mask: 8,
        // }
        // var asteroidfilter = {
        //     group: 0,
        //     category: 23,
        //     mask: 23,
        // }
        // var asteroidbarrierfilter = {
        //     group: 0,
        //     category: 22,
        //     mask: 22,
        // }
        // var markerfilter = {
        //     group: 0,
        //     category: 5,
        //     mask: 1,
        // }
        // console.log("true: " + Matter.Detector.canCollide(shipfilter, shipbarrierfilter));
        // console.log("true: " + Matter.Detector.canCollide(shipfilter, asteroidfilter));
        // console.log("false: " + Matter.Detector.canCollide(asteroidfilter, shipbarrierfilter));
        // console.log("true: " + Matter.Detector.canCollide(asteroidfilter, asteroidbarrierfilter));
        // console.log("false: " + Matter.Detector.canCollide(shipfilter, markerfilter));
        // console.log("true: " + Matter.Detector.canCollide(asteroidfilter, markerfilter));