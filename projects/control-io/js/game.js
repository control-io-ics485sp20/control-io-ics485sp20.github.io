function Game() {
    var _this = this

    // var ingame;
    console.log("[Control.IO] Starting game instance...");

    _this.reg;

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


    /**
     * @name runLocalGame
     * @description Starts a local lobby session.
     */
    function runLocalGame() {
        console.log("Starting a local session...")
        _this.gameLobby = new GameLobby("Starting Local Session...");
        _this.gameStatus = "local-lobby"
        var gameLobbyResult = _this.gameLobby.create();
    }

    /**
     * @name runOnlineGame
     * @description Not implemented. Starts an online lobby session.
     */
    function runOnlineGame() {
        console.log("Joining a multiplayer session...");
        console.log("Not implemented!");
    }

    /**
     * @name startGame
     * @description Starts the game session and calls animate.
     * @param {*} controllers game controllers collected from the lobby
     */
    function startGame(controllers) {
        // console.log(controllers);
        _this.gameStatus = "singleplayer-game";
        //start game countdown
        //start game
        let dimensions = {width: window.innerWidth, height: window.innerHeight}

        _this.gameWindow = new GameWindow(dimensions);
        _this.gameWindow.init();
        _this.gameMap = new GameMap(dimensions);

        _this.scorescreen = new GameOverlay();
        _this.pausemenu = new GameOverlayPauseMenu();
        _this.endmenu = new GameOverlayEndMenu();

        // _this.music_ingame = new Audio('../music/ingame.wav');
        // _this.music_endgame = new Audio('../music/endgame.wav');
        // _this.music_ingame.volume = 0.4;
        // _this.music_endgame.volume = 0.8;
        // _this.music_ingame.play();
        SFX.music_ingame.play();

        addPlayers(controllers);
        _this.TotalPlayers = playerCount;

        _this.scorescreen.init();

        _this.timer = startTimer(gametime, "timer", function() {
            finishGame();
        })

        if (renderEngine == "paper") {
            paper.view.onFrame = function() {
                if (!_this.paused && !_this.endgame) {
                    checkGameStatus();
                    updateForcefields();
                    addAsteroids();
                    updateAsteroids();
                    updatePlayerScores();
                }
                updatePlayers();
            }
        } else if (renderEngine == "matter") {
            animate();
        }
    }

    /**
     * @name finishGame
     * @description calls procedures that finish the game.
     */
    function finishGame() {
        _this.endgame = true;
        // _this.timer.pause();
        showEndMenu();
        SFX.music_ingame.pause();
        SFX.music_endgame.play();
    }

    /**
     * @name animate
     * @description runs an animation using requestAnimationFrame
     */
    function animate() {
        _this.gameRunning = requestAnimationFrame(animate);
        if (!_this.paused && !_this.endgame) {
            checkGameStatus();
            updateForcefields();
            addAsteroids();
            updateAsteroids();
            updatePlayerScores();
        }
        updatePlayers();
    }

    /**
     * @name addAsteroids
     * @description adds asteroids to the game map
     */
    function addAsteroids() {
        if ((asteroids.length < AsteroidSpawnCap) && ((Math.random() * 101) < AsteroidSpawnRate)) {
            let asteroid = new Asteroid(_this.gameWindow, _this.gameMap);
            asteroids.push(asteroid);
            // console.log(asteroids);
        }
    }

    /**
     * @name goto_website
     * @description Sends the user to our website
     */
    function goto_website() {
        window.open("https://control-io-ics485sp20.github.io/"); 

    }

    /**
     * @name goto_github
     * @description Sends the user to our github
     */
    function goto_github() {
        window.open("https://github.com/control-io-ics485sp20/control-io-ics485sp20.github.io/tree/master/projects/control-io"); 

    }

    /**
     * @name goto_lobby
     * @description Sends the user back to the lobby
     */
    function goto_lobby() {
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
        // players: _thplayers,
        asteroids: _this.asteroids,
        forcefields: _this.forcefields,
        playerCount: _this.playerCount,
        totalPlayers: _this.totalPlayers,
        this: this,
    }

    /**
     * @name addPlayers
     * @description adds players to the game
     * @param {*} controllers 
     */
    function addPlayers(controllers) { //TODO only add players from lobby
        Object.keys(controllers).forEach(function (id) {
            if (controllers[id]["player"] != null) {
                if (controllers[id]["gamepad"] != null) {
                    players.push(new Player(_this.gameWindow, _this.gameMap, controllers[id]["player"]["color"], controllers[id]["player"]["name"], controllers[id]["gamepad"], null));
                } else if (id == "keyboard1") {
                    players.push(new Player(_this.gameWindow, _this.gameMap, controllers[id]["player"]["color"], controllers[id]["player"]["name"], null, {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", abutton: "Space", bbutton: "ShiftLeft", startbutton: "Escape"}) );
                }
                playerCount++;
            }
        });
    }

    /**
     * @name updatePlayers
     * @description on called frame, updates each player
     */
    function updatePlayers() {
        players.forEach(function (player) {
            player.updatePos(_this.paused, _this.endgame);

            if (player.alive && player.health <= 0) {
                player.kill();
                player.alive = false;
                // console.log(player.name + " is dead!");
                // playerCount -= 1;
            }
        });
    }

    /**
     * @name updateForceFields
     * @description on called frame, updates each forcefield
     */
    function updateForcefields() {
        game.forcefields.forEach(function (forcefield, index, object) {
            if (forcefield.health < 0) {
                forcefield.despawn();
                object.splice(index, 1);

                console.log(game.forcefields);
            }
            // var result = asteroid.updatePos();
            // if (!result) {
            //     object.splice(index, 1);
            // }
        })
    }

    /**
     * @name updateAsteroids
     * @description on called frame, updates each asteroid
     */
    function updateAsteroids() {
        if (renderEngine == "paper") {
            asteroids.forEach(function (asteroid, index, object) {
                var result = asteroid.updatePos();
                if (!result) {
                    object.splice(index, 1);
                }
            });
        } else if (renderEngine == "matter") {
            // asteroids.forEach(function (asteroid, index, object) {
            //     var result = asteroid.despawn;
            //     console.log(result);
            //     // if (!result) {
            //     //     object.splice(index, 1);
            //     // }
            // });
        }
    }

    /**
     * @name updatePlayerScores
     * @description on called frame, updates the list of player scores in the UI
     */
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
            
            for (j in players) {
                if (players[j].id != undefined && scoreobj[players[j].id] != undefined) {
                    scoreobj[players[j].id].name = players[j].name;
                    scoreobj[players[j].id].color = players[j].color.normal;
                }
            }

            _this.scorescreen.update(scoreobj);
        }
    }

    /**
     * @name togglePauseMenu
     * @description calls procedures when a player toggles the pause menu
     */
    function togglePauseMenu() {
        if (!_this.endgame) {
            if (_this.paused) {
                _this.paused = false;
                _this.pausemenu.hide();
                _this.scorescreen.show();
                _this.timer.resume();
                // _this.music_ingame.play();
                SFX.music_ingame.play();
                // engine.enabled = true;
                if (renderEngine == "matter") {
                    Runner.start(runner, engine);
                }
            } else {
                _this.paused = true;
                _this.scorescreen.hide();
                _this.pausemenu.show();
                _this.timer.pause();
                // _this.music_ingame.pause();
                SFX.music_ingame.pause();
                // engine.enabled = false;

                if (renderEngine == "matter") {
                    Runner.stop(runner);
                }
            }
        }
    }

    /**
     * @name showEndMenu
     * @description calls procedures when the end of game menu is shown
     */
    function showEndMenu() {
        if (_this.endgame && _this.endmenushown == undefined) {
            _this.endmenu.show();
            _this.endmenushown = true;
            // engine.enabled = false;
            Runner.stop(runner);
        }
    }

    //Literally from https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
    /**
     * @name controllerConnectedEvent
     * @description Detects when a gamepad is connected
     * @param {*} event 
     */
    function controllerConnectedEvent(event) {
        if (_this.gameStatus == "local-lobby") {
            _this.gameLobby.controllerJoin(event);
        } else if (_this.gameStatus == "singleplayer-game") {
            //TODO allow for reconnect of disconnected player
        } else if (_this.gameStatus == "debug") {
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

    /**
     * @name controllerDisconnectedEvent
     * @description Detects when a gamepad is disconnected
     * @param {*} event 
     */
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
        // console.log("checking game");
        if (_this.TotalPlayers == 1) { //if local singleplayer
            if (playerCount <= 0) {
                _this.timer.pause();
                finishGame();
            }
        } else { //if local multiplayer
            if (playerCount <= 1) { //or timer is up
                _this.timer.pause();
                finishGame();
            }
        }
    }
}

console.log("[Control.IO] Loaded game module.")


