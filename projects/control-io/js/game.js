function Game() {
    var _this = this

    var ingame;
    console.log("[Control.IO] Starting game instance...");

    _this.reg;

    _this.players = []
    _this.asteroids = []
    _this.forcefields = []

    _this.gameLobby;
    _this.gameWindow;
    _this.gameMap;

    _this.overlay;

    _this.gameStatus;

    init();

    function init() {
        window.addEventListener('gamepadconnected', controllerConnectedEvent);
        window.addEventListener('gamepaddisconnected', controllerDisconnectedEvent);
        window.addEventListener('keyup', keyUp);

        // window.addEventListener("MozGamepadButtonDown", function(evt) { buttonPressed(evt, true); } );
        // window.addEventListener("MozGamepadButtonUp", function(evt) { buttonPressed(evt, false); } );

        //if local singleplayer/multiplayer selected
        runLocalGame();

        //if internet multiplayer selected
        //totally optional

    };

    function runLocalGame() {
        console.log("Starting a local session...")
        _this.gameLobby = new GameLobby("Starting Local Session...");
        _this.gameStatus = "local-lobby"
        var gameLobbyResult = _this.gameLobby.create();
    }

    function runMultiPlayer() {
        console.log("Joining a multiplayer session...");
        //totally optional
    }

    function startGame(controllers) {
        // console.log(controllers);
        _this.gameStatus = "singleplayer-game";
        //start game countdown
        //start game
        //create start game timer
        let dimensions = {width: window.innerWidth, height: window.innerHeight}

        _this.gameWindow = new GameWindow(dimensions);
        _this.gameWindow.init();
        _this.gameMap = new GameMap(dimensions);

        _this.scorescreen = new GameOverlay();
        _this.pausemenu = new GameOverlayPauseMenu();
        _this.endmenu = new GameOverlayEndMenu();

        _this.music_ingame = new Audio('../music/ingame.wav');
        _this.music_ingame.play();
        _this.music_ingame.volume = 0.4;

        // setTimeout(finishGame,60000);

        // initMap();

        addPlayers(controllers);
        TotalPlayers = game.players.length;

        _this.scorescreen.init();

        // _this.fpsInterval = 1000/fpscap;
        // _this.then = Date.now();
        // _this.starttime = _this.then;
        // nextFrame();
        _this.timer = startTimer(60, null, function() {
            finishGame();
        })

        paper.view.onFrame = function() {
            if (!_this.paused && !_this.endgame) {
                checkGameStatus();

                updateForcefields();

                spawnAsteroids();

                updateAsteroids();

                updatePlayerScores();
            }
            updatePlayers();
        }
    }

    function finishGame() {
        // window.cancelAnimationFrame(gameRunning);
        _this.endgame = true;
        showEndMenu();
        // ingame.pause();
        _this.music_ingame.volume = 0.0;

        _this.music_endgame = new Audio('../music/endgame.wav');
        _this.music_endgame.play();
        _this.music_endgame.volume = 0.8;
        // paper.view.pause();
        // window.cancelAnimationFrame(_this.gameRunning);
    }

    // function nextFrame() {

    //     _this.gameRunning = requestAnimationFrame(nextFrame);

    //     _this.now = Date.now();
    //     _this.elapsed = _this.now - _this.then;

    //     if (_this.elapsed > _this.fpsInterval) {
    //         _this.then = _this.now - (_this.elapsed % _this.fpsInterval);

    //         if (!_this.paused) {
    //             updateForcefields();

    //             checkGameStatus();

    //             spawnAsteroids();

    //             updateAsteroids();

    //             updatePlayerScores();
    //         }
    //         updatePlayers();
    //     }
    // }

    function spawnAsteroids() {
        if ((game.asteroids.length < AsteroidSpawnCap) && ((Math.random() * 101) < AsteroidSpawnRate)) {
            let asteroid = new Asteroid(_this.gameWindow, _this.gameMap);
            game.asteroids.push(asteroid);
        }
    }

    function goto_website() {
        // console.log("website clicked!");
        window.open("https://control-io-ics485sp20.github.io/"); 

    }

    function goto_github() {
        // console.log("github clicked!");
        window.open("https://github.com/control-io-ics485sp20/control-io-ics485sp20.github.io/tree/master/projects/control-io"); 

    }

    function goto_lobby() {
        // console.log("lobby clicked!");
        location.reload();
    }

    return {
        startGame: startGame,
        checkGameStatus: checkGameStatus,
        togglePauseMenu: togglePauseMenu,
        goto_website: goto_website,
        goto_github: goto_github,
        goto_lobby: goto_lobby,
        reg: _this.reg,
        overlay: _this.overlay,
        players: _this.players,
        asteroids: _this.asteroids,
        forcefields: _this.forcefields,
    }

    /**
     * addPlayers
     *
     * Adds players to the game
     */
    function addPlayers(controllers) { //TODO only add players from lobby
        Object.keys(controllers).forEach(function (id) {
            if (controllers[id]["player"] != null) {
                if (controllers[id]["gamepad"] != null) {
                    game.players.push(new Player(_this.gameWindow, _this.gameMap, controllers[id]["player"]["color"], controllers[id]["player"]["name"], controllers[id]["gamepad"], null));
                } else if (id == "keyboard1") {
                    game.players.push(new Player(_this.gameWindow, _this.gameMap, controllers[id]["player"]["color"], controllers[id]["player"]["name"], null, {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", abutton: "Space", bbutton: "ShiftLeft", startbutton: "Escape"}) );
                }
                playerCount++;
            }
        });
    }

    function updatePlayers() {
        game.players.forEach(function (player) {
            player.updatePos(_this.paused, _this.endgame);

            if (player.alive && player.health <= 0) {
                player.alive = false;
                // console.log(player.name + " is dead!");
                playerCount--;
            }
        });
    }

    function updateForcefields() {
        game.forcefields.forEach(function (forcefield, index, object) {
            if (forcefield.health < 0) {
                forcefield.removeForcefield();
                object.splice(index, 1);

                console.log(game.forcefields);
            }
            // var result = asteroid.updatePos();
            // if (!result) {
            //     object.splice(index, 1);
            // }
        })
    }

    function updateAsteroids() {
        game.asteroids.forEach(function (asteroid, index, object) {
            var result = asteroid.updatePos();
            if (!result) {
                object.splice(index, 1);
            }
        })
    }

    function updatePlayerScores() {
        let scoreobj = {};

        for (i in game.forcefields) {
            if (scoreobj[game.forcefields[i].playerId] == undefined) {
                scoreobj[game.forcefields[i].playerId] = {};
                scoreobj[game.forcefields[i].playerId].score = 0;
            }

            scoreobj[game.forcefields[i].playerId].score += game.forcefields[i].area;
        }

        if ((_this.lastforcefieldslength != game.forcefields.length) && !(_.isEqual(_this.lastScoreObj,scoreobj))) {
            _this.lastScoreObj = scoreobj;
            _this.lastforcefieldslength = game.forcefields.length;
            
            for (j in game.players) {
                if (game.players[j].id != undefined && scoreobj[game.players[j].id] != undefined) {
                    scoreobj[game.players[j].id].name = game.players[j].name;
                    scoreobj[game.players[j].id].color = game.players[j].color.normal;
                }
            }

            _this.scorescreen.update(scoreobj);
        }
    }

    function togglePauseMenu() {
        if (!_this.endgame) {
            if (_this.paused) {
                _this.paused = false;
                _this.pausemenu.hide();
                _this.scorescreen.show();
                _this.timer.resume();
                _this.music_ingame.play();
            } else {
                _this.paused = true;
                _this.scorescreen.hide();
                _this.pausemenu.show();
                _this.timer.pause();
                _this.music_ingame.pause();
            }
        }
    }

    function showEndMenu() {
        if (_this.endgame && _this.endmenushown == undefined) {
            _this.endmenu.show();
            _this.endmenushown = true;
        }
    }

    

    //Literally from https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
    /**
     * controllerConnectedEvent
     * Detects when a gamepad is connected and announces it.
     */
    function controllerConnectedEvent(event) {
        if (_this.gameStatus == "local-lobby") {
            _this.gameLobby.controllerJoin(event);
        } else if (_this.gameStatus == "singleplayer-game") {
            //TODO allow for reconnect of disconnected player
        } else if (_this.gameStatus == "debug") {
            var i = 0;
            while(i < _this.players.length) {
                if (_this.players[i].gamepad == undefined) {
                    _this.players[i].gamepad = event.gamepad;
                    console.log("Gamepad connected and assigned to %s with index %d: %s. %d buttons, %d axes.",
                    _this.players[i].name, event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length);
                    break;
                }
                i++;
            }
        }
    };

    function controllerDisconnectedEvent(event) {
        if (_this.gameStatus == "local-lobby") {
            _this.gameLobby.controllerLeave(event);
        } else if (_this.gameStatus == "singleplayer-game") {
            //TODO allow for reconnect of disconnected player
        } else if (_this.gameStatus == "debug") {
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
        if (_this.gameStatus == "local-lobby") {
            _this.gameLobby.joinLeaveKeyboard(event);
        } else if (_this.gameStatus == "singleplayer-game") {

        } else {

        }
    }

    //TODO can't seem to call checkGameStatus
    function checkGameStatus() {
        if (TotalPlayers == 1) { //if local singleplayer
            if (playerCount <= 0) {
                // window.cancelAnimationFrame(gameRunning);
                // _this.gameend = true;
                finishGame();
            }
        } else { //if local multiplayer
            if (playerCount <= 1) { //or timer is up
                // console.log("Game has finished!");
                // console.log(playerCount);
                // window.cancelAnimationFrame(gameRunning);
                // _this.gameend = true;
                finishGame();
            }
        }
    }
}

console.log("[Control.IO] Loaded game module.")


