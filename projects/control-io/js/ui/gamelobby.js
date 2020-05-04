function GameLobby(roomName) {
    var roomName = roomName;
    // var game = game;
    var controllers = {};
    var joinedPlayers = 0;
    var startVotePlayers = 0;
    var ButtonPressedStatus = {}
    var controllerCheck;
    var counter = 3;
    // AButtonPressed = {}
    var availablePlayers = [
        { "name": "Player 1", "color": "#ff3c00" },
        { "name": "Player 2", "color": "#00c6e5" },
        { "name": "Player 3", "color": "#00df48" },
        { "name": "Player 4", "color": "#fffb00" },
        { "name": "Player 5", "color": "#ffb700" },
        { "name": "Player 6", "color": "#0026ff" },
        { "name": "Player 7", "color": "#8c00ff" },
        { "name": "Player 8", "color": "#ff85f1" }
    ];

    function create() {
        var html = `
        <div id="gamelobby">
            <div id="gamelobby-gamename">` + gameName + `</div>        
            <div id="gamelobby-roomname">` + roomName + `</div>
            <div id="gamelobby-playerlist">
                <div id="keyboard1" class="gamelobby-playercard">` + lobbyJoinKeyboardInstructionMessage + `</div>
            </div>
            <div id="gamelobby-readybutton">` + readyButtonText + `<div id="gamelobby-readybutton-playercount"></div></div>        
        </div>
        `

        controllers["keyboard1"] = {};

        $("#window").append(html);

        checkControllers();
    }

    function runGame() {
        window.cancelAnimationFrame(controllerCheck);

        $("#gamelobby").remove();

        game.startGame(controllers);
    }

    function controllerJoin(event) {
        let id = event.gamepad.id + event.gamepad.index;

        if (controllers[id] != null) {
            controllers[id]["gamepad"] = event.gamepad;
        } else {
            $("#gamelobby-playerlist").append(`<div id="` + id + `" class="gamelobby-playercard">` + lobbyJoinControllerInstructionMessage + `</div>`);
            controllers[id] = {};
            controllers[id]["gamepad"] = event.gamepad;

            ButtonPressedStatus[id] = {}
        }
    }

    function controllerLeave(event) {
        let id = event.gamepad.id + event.gamepad.index;
        $("#" + id).remove();

        if (controllers[id]["player"] != null) {
            removePlayer(controllers[id]["player"]);
            joinedPlayers--;
            updateStartButton();
        }

        delete controllers[id];
    }

    function controllerLock(id, message) {
        if (controllers[id]["player"] == null) {
            var player = addPlayer();

            if (player != null) {
                controllers[id]["player"] = player;

                $("#" + id).html(
                    `<div class="gamelobby-playercard-playername">` + controllers[id]["player"]["name"] + `</div>
                    <div class="gamelobby-playercard-joinedstatus">` + lobbyPlayerJoinedStatus + `</div>`
                );
                $("#" + id).css("border", ("8px solid " + controllers[id]["player"]["color"]));
                $("#" + id + "> div.gamelobby-playercard-playername").css("background-color", controllers[id]["player"]["color"]);

                joinedPlayers++;
            }
        } else {
            $("#" + id).html(message);
            $("#" + id).css("border", ("8px solid white"));

            removePlayer(controllers[id]["player"]);
            delete controllers[id]["player"];

            joinedPlayers--;
        }
        updateStartButton();
    }

    function updateStartButton() {
        if (joinedPlayers >= MinPlayers) {
            // $("#gamelobby-readybutton-playercount").html("");
            $("#gamelobby-readybutton").css("background-color", "rgb(218, 189, 29)");
        } else {
            // $("#gamelobby-readybutton-playercount").html("(" + joinedPlayers + "/" + "2)");
            $("#gamelobby-readybutton").css("background-color", "rgb(158, 158, 158)");
        }
    }

    function startLock() {
        // console.log("startvote_pressed")
        // if (controllers[id]["start"]) {

        // }
        if (joinedPlayers >= MinPlayers) {
            console.log("3 seconds timer(tbr)");
            timer.play();
            changeName();
            setTimeout(changeName,1000);
            setTimeout(changeName,2000);
            setTimeout(runGame,3000);
        }
    }

    function changeName(){
      document.getElementById("gamelobby-roomname").innerHTML = "Game starts in " + counter + "...";
      counter --;
    }

    function addPlayer() {
        if (availablePlayers.length > 0) {
            return availablePlayers.shift();
        } else {
            return null;
        }
    }

    function removePlayer(playerItem) {
        availablePlayers.unshift(playerItem);
    }

    function joinLeaveKeyboard(event) {
        if ((event.code == "ShiftLeft") || (event.code == "ShiftRight")) {
            controllerLock("keyboard1", lobbyJoinKeyboardInstructionMessage);
            var audio_in = new Audio('../music/in.wav');
            audio_in.play();
            // gameLobby.joinLeaveKeyboard();
        } else if (event.code == "Space") {
            startLock();
        } else {
            //any other key pressed
        }
    }

    function checkControllers() {
        controllerCheck = requestAnimationFrame(checkControllers);
        Object.keys(controllers).forEach(function (id) {
            if (controllers[id] != null && controllers[id]["gamepad"] != null) {
                if (controllers[id]["gamepad"].buttons[9].value > 0 || controllers[id]["gamepad"].buttons[9].pressed == true) {
                    ButtonPressedStatus[id]["start_pressed"] = true;
                } else {
                    if (ButtonPressedStatus[id]["start_pressed"] == true) {
                        controllerLock(id, lobbyJoinControllerInstructionMessage);
                        ButtonPressedStatus[id]["start_pressed"] = false;
                    }
                }

                if (controllers[id]["gamepad"].buttons[0].value > 0 || controllers[id]["gamepad"].buttons[0].pressed == true) {
                    ButtonPressedStatus[id]["a_pressed"] = true;
                } else {
                    if (ButtonPressedStatus[id]["a_pressed"] == true) {
                        startLock(id);
                        ButtonPressedStatus[id]["a_pressed"] = false;
                    }
                }
            }
        });
    }
    return {
        create: create,
        controllerJoin: controllerJoin,
        controllerLeave: controllerLeave,
        joinLeaveKeyboard : joinLeaveKeyboard
    }

    function generateColor() {

    }

    // function generateName() {
    //     var takenNames = [];
    //     Object.keys(controllers).forEach(function (id) {
    //         if (controllers[id] != null && controllers[id]["player"] != null && controllers[id]["player"]["name"] != null) {
    //             takenNames.push(controllers[id]["player"]["name"]);
    //         }
    //     });

    //     var iterator = 1;
    //     var taken = true;
    //     var currName;
    //     while(taken) {
    //         currName = ("Player " + iterator);
    //         if (takenNames.includes(currName)) {
    //             iterator++;
    //         } else {
    //             taken = false;
    //         }
    //     }
    //     return currName;
    // }
}
