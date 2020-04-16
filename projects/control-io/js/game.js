function Game() {
    console.log("[Control.IO] Starting game instance...");
    init();

    var gameLobby;
    var gameWindow;
    var gameMap;

    var gameStatus;

    var gameRunning;

    function init() {
        window.addEventListener('gamepadconnected', controllerConnectedEvent);
        window.addEventListener('gamepaddisconnected', controllerDisconnectedEvent);
        window.addEventListener('keyup', keyUp);

        // window.addEventListener("MozGamepadButtonDown", function(evt) { buttonPressed(evt, true); } );
        // window.addEventListener("MozGamepadButtonUp", function(evt) { buttonPressed(evt, false); } );

        //if singleplayer selected
        runLocalPlayer();

        //if multiplayer selected
        //totally optional
    };

    function runLocalPlayer() {
        console.log("Starting a local session...")
        gameLobby = new GameLobby("Starting Local Session...");
        gameStatus = "local-lobby"
        var gameLobbyResult = gameLobby.create();
    }

    function runMultiPlayer() {
        console.log("Joining a multiplayer session...");
        //totally optional
    }

    function startGame(controllers) {
        // console.log(controllers);

        gameStatus = "singleplayer-game";
        //start game countdown
        //start game
        //create start game timer
        let dimensions = {width: window.innerWidth, height: window.innerHeight}

        gameWindow = new GameWindow(dimensions);
        gameWindow.init();
        gameMap = new GameMap(dimensions);

        // initMap();

        addPlayers(controllers);

        const navigator = new Navigator(window.innerWidth, window.innerHeight);

        for(var x = 0, xl = 15; x != xl; ++x) {

            let asteroid = new Asteroid(this, gameWindow, gameMap, navigator);
            asteroids.push(asteroid);
        }
        
        runAnimation(this);
        // console.log('view ' + paper.view);

        paper.view.onFrame = function() {
            // console.log("a");
            checkGameStatus();
            // gameRunning = requestAnimationFrame(runAnimation);

            updatePos();

            // paper.view.draw();
        }

        // runAnimation(this);
        //end game screen
    }

    return {
        startGame: startGame,
        checkGameStatus: checkGameStatus
    }

    // function initMap() {
    //     console.log("Initializing map...")
    //     var map = new GameMap({width: window.innerWidth, height: window.innerHeight});

    //     // var img = new SimpleImage(200,200);
    //     // print(img);

    //     // for (var pixel of img.values()) {
    //     //     pixel.setRed(255);
    //     //     pixel.setGreen(255);
    //     //     pixel.setBlue(0);
    //     // }
    //     // print(img);
    // }

    /**
     * addPlayers
     *
     * Adds players to the game
     */
    function addPlayers(controllers) { //TODO only add players from lobby

        Object.keys(controllers).forEach(function (id) {
            if (controllers[id]["player"] != null) {
                if (controllers[id]["gamepad"] != null) {
                    players.push(new Player(this, gameWindow, gameMap, controllers[id]["player"]["color"], controllers[id]["player"]["name"], controllers[id]["gamepad"], null));
                } else if (id == "keyboard1") {
                    players.push(new Player(this, gameWindow, gameMap, controllers[id]["player"]["color"], controllers[id]["player"]["name"], null, {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", abutton: "Space", bbutton: "ShiftLeft"}) );
                }
                playerCount++;
            }
        });



        // players.forEach(function (player) {
        //     gameWindow.scene.add(player.getPlayerObject());
        // });
    }

    function updatePos() {
        players.forEach(function (player) {
            player.updatePos();
        });
    }

    /**
     * runAnimation
     *
     * Starts the animation sequence. Methods within are called on each frame.
     */
    function runAnimation() {
        checkGameStatus();
        gameRunning = requestAnimationFrame(runAnimation);

        for (var x = 0, xl = asteroids.length; x != xl; ++x) {
          asteroids[x].roam();
        }

        updatePos();

        paper.view.draw();
    }



    //Literally from https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
    /**
     * controllerConnectedEvent
     * Detects when a gamepad is connected and announces it.
     */
    function controllerConnectedEvent(event) {
        if (gameStatus == "local-lobby") {
            gameLobby.controllerJoin(event);
        } else if (gameStatus == "singleplayer-game") {
            //allow for reconnect of disconnected player
        } else if (gameStatus == "debug") {
            var i = 0;
            while(i < players.length) {
                if (players[i].gamepad == undefined) {
                    players[i].gamepad = event.gamepad;
                    console.log("Gamepad connected and assigned to %s with index %d: %s. %d buttons, %d axes.",
                        players[i].name, event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length);
                    break;
                }
                i++;
            }
        }
    };

    function controllerDisconnectedEvent(event) {
        if (gameStatus == "local-lobby") {
            gameLobby.controllerLeave(event);
        } else if (gameStatus == "singleplayer-game") {
            //allow for reconnect of disconnected player
        } else if (gameStatus == "debug") {
            var i = 0;
            while(i < players.length) {
                if (players[i].gamepad == event.gamepad) {
                    players[i].gamepad = undefined;
                    console.log("Gamepad disconnected from %s with index %d: %s. %d buttons, %d axes.",
                        players[i].name, event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length);
                    break;
                }
                i++;
            }
        }
    }

    function keyUp(event) {
        if (gameStatus == "local-lobby") {
            gameLobby.joinLeaveKeyboard(event);

            // if (event.code == "Space") {
            // } else if (event.) {

            // }
        } else if (gameStatus == "singleplayer-game") {

        } else {

        }
    }

    // players.push(new Player(gameWindow, "#4d88d5", "Player 1", {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", abutton: "KeyZ", bbutton: "ShiftLeft"}));
    // players.push(new Player(gameWindow, "#ff0000", "Player 2", {up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD"}));
    // players.push(new Player(gameWindow, "#009933", "Player 3", {up: "KeyI", down: "KeyK", left: "KeyJ", right: "KeyL", abutton: "KeyY", bbutton: "KeyU"}));
    // players.push(new Player(gameWindow, "#ffff00", "Player 4", {up: "KeyG", down: "KeyB", left: "KeyV", right: "KeyN"}));
}

console.log("[Control.IO] Loaded game module.")

function checkGameStatus() {
    if (playerCount <= 1) { //or timer is up
        console.log("Game has finished!");
        console.log(playerCount);
        window.cancelAnimationFrame(gameRunning);
    }
}
