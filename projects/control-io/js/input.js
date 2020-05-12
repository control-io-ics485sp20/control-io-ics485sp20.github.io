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

