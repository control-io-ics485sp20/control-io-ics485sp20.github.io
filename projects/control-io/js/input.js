class Gamepad {

}

/**
 * refineAxisValue
 *
 * Given a float value, returns a rounded float to the nearedst .00. If this
 * value is within a .05 threshold or over 1, it returns the closest whole value
 * to ensure maximum values/controller idle.
 */
function refineAxisValue(float) {
    var float_val = Math.floor(float * 100) / 100;
    if ((float_val <= 0.08) && (float_val >= -0.08)) {
        return 0;
    } else if ((float_val >= 0.92) && (float_val >= 1)) {
        return 1;
    } else if ((float_val <= -0.92) && (float_val <= -1)) {
        return -1;
    } else {
        return float_val;
    }
}

//TODO assign a gamepad to a Player
function gamepad_detect() {
    //TODO for each person, get the assigned gamepad
    if (navigator.getGamepads) {
        var gp = navigator.getGamepads()[0];

        if (gp != undefined) {
            // if (debug) {
            //     if (gp.buttons[0].value > 0 || gp.buttons[0].pressed == true) {
            //         console.log("AButton pressed.");
            //     }
            //     if (gp.buttons[1].value > 0 || gp.buttons[1].pressed == true) {
            //         console.log("BButton pressed.");
            //     }
            //     if (gp.buttons[2].value > 0 || gp.buttons[2].pressed == true) {
            //         console.log("XButton pressed.");
            //     }
            //     if (gp.buttons[3].value > 0 || gp.buttons[3].pressed == true) {
            //         console.log("YButton pressed.");
            //     }
            //     if (gp.buttons[4].value > 0 || gp.buttons[4].pressed == true) {
            //         console.log("LButton pressed.");
            //     }
            //     if (gp.buttons[5].value > 0 || gp.buttons[5].pressed == true) {
            //         console.log("RButton pressed.");
            //     }
            //     if (gp.buttons[6].value > 0 || gp.buttons[6].pressed == true) {
            //         console.log("LTrigger pressed.");
            //     }
            //     if (gp.buttons[7].value > 0 || gp.buttons[7].pressed == true) {
            //         console.log("RTrigger pressed.");
            //     }
            //     if (gp.buttons[8].value > 0 || gp.buttons[8].pressed == true) {
            //         console.log("BackButton pressed.");
            //     }
            //     if (gp.buttons[9].value > 0 || gp.buttons[9].pressed == true) {
            //         console.log("StartButton pressed.");
            //     }
            //     if (gp.buttons[10].value > 0 || gp.buttons[10].pressed == true) {
            //         console.log("LeftJoystickButton pressed.");
            //     }
            //     if (gp.buttons[11].value > 0 || gp.buttons[11].pressed == true) {
            //         console.log("RightJoystickButton pressed.");
            //     }
            //     if (gp.buttons[12].value > 0 || gp.buttons[12].pressed == true) {
            //         console.log("Up pressed.");
            //     }
            //     if (gp.buttons[13].value > 0 || gp.buttons[13].pressed == true) {
            //         console.log("Down pressed.");
            //     }
            //     if (gp.buttons[14].value > 0 || gp.buttons[14].pressed == true) {
            //         console.log("Left pressed.");
            //     }
            //     if (gp.buttons[15].value > 0 || gp.buttons[15].pressed == true) {
            //         console.log("Right pressed.");
            //     }
            //     if (gp.buttons[16].value > 0 || gp.buttons[16].pressed == true) {
            //         console.log("5 pressed.");
            //     }
            // }

            //TODO move to Player class
            var currLJ_X = refineAxisValue(gp.axes[0]);
            var currLJ_Y = refineAxisValue(gp.axes[1]);
            if (!(players[0].prevLJ_X == currLJ_X)) {
                players[0].prevLJ_X = currLJ_X;
            }
            if (!(players[0].prevLJ_Y == currLJ_Y)) {
                players[0].prevLJ_Y = currLJ_Y;
            }

            var currRJ_X = refineAxisValue(gp.axes[2]);
            var currRJ_Y = refineAxisValue(gp.axes[3]);
            if (!(players[0].prevRJ_X == currRJ_X)) {
                players[0].prevRJ_X = currRJ_X;
            }
            if (!(players[0].prevRJ_Y == currRJ_Y)) {
                players[0].prevRJ_Y = currRJ_Y;
            }

            players[0].moveY(-currLJ_Y);
            players[0].moveX(currLJ_X);
        }
    }
}

//handle computer keydown/keyup events
window.addEventListener('keydown', keyDownEvent);
window.addEventListener('keyup', keyUpEvent);

function keyDownEvent(event) {
    players.forEach(function (player) {
        player.keyDown(event);
    });
}

function keyUpEvent(event) {
    players.forEach(function (player) {
        player.keyUp(event);
    });
}

console.log("[Control.IO] Loaded input module.")
