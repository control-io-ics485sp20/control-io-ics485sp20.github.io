/**
 * Player
 *
 * Class that represents a Player
 */
class Player {
    constructor(game, gamewindow, gamemap, color, name, gamepad, keybinds) {
        this.game = game;

        this.coordsArray = [];
        this.linesArray = [];
        this.claimedShapesArray = [];

        this.gamewindow = gamewindow;

        this.name = name;

        this.color = {
            normal: color,
            bright: tinycolor(color).brighten(25).toString(),
            dark: tinycolor(color).darken(25).toString()
        };

        this.prevLJ_X = 0;
        this.prevLJ_Y = 0;
        this.prevRJ_X = 0;
        this.prevRJ_Y = 0;

        //maxrange
        //maxpoints

        this.gamepad = gamepad;
        this.keybinds = keybinds;

        this.randomSpawn();
        this.setCoord();
    };

    randomSpawn() {
        var random_x = Math.floor(((Math.random() * Math.floor(max_x))));
        var random_y = Math.floor(((Math.random() * Math.floor(max_y))));

        this.playerobject = new PlayerObject(this.gamewindow, random_x, random_y, this.color.normal);
    }

    moveUp () {
        this.playerobject.asset.position.y -= player_max_velocity;
        this.updateVisualGuidingLine(null, this.playerobject.asset.position.y, 1);
    }

    moveDown () {
        this.playerobject.asset.position.y += player_max_velocity;
        this.updateVisualGuidingLine(null, this.playerobject.asset.position.y, 1);
    }

    moveLeft () {
        this.playerobject.asset.position.x -= player_max_velocity;
        this.updateVisualGuidingLine(this.playerobject.asset.position.x, null, 1);
    }

    moveRight () {
        this.playerobject.asset.position.x += player_max_velocity;
        this.updateVisualGuidingLine(this.playerobject.asset.position.x, null, 1);
    }

    /*
        * moveX
        *
        * Intended for controllers.
        * Given a float modifier value, updates the player's position on the X axis for a frame.
        */
    moveX (modifier) {

        this.playerobject.asset.position.x = this.playerobject.asset.position.x + (player_max_velocity * modifier);
        this.updateVisualGuidingLine(this.playerobject.asset.position.x, null, 1);
    }

    /*
        * moveY
        *
        * Intended for controllers.
        * Given a float modifier value, updates the player's position on the Y axis for a frame.
        */
    moveY (modifier) {

        this.playerobject.asset.position.y = this.playerobject.asset.position.y + (player_max_velocity * modifier);
        this.updateVisualGuidingLine(null, this.playerobject.asset.position.y, 1);
    }

    setCoord() {
        if (this.coordsArray == undefined || this.coordsArray.length == 0) {
            var tempPoint = new paper.Point(this.playerobject.asset.position.x, this.playerobject.asset.position.y);
            if(!this.checkPointIntersects(tempPoint)) {
                this.coordsArray.push(new PlayerCoordinate(this.gamewindow, this.playerobject.asset.position.x, this.playerobject.asset.position.y, this.color.normal));
                this.guidingLine = new PlayerGuidingLine(this.gamewindow, this.coordsArray[0].x, this.coordsArray[0].y, this.playerobject.asset.position.x, this.playerobject.asset.position.y, this.color.normal);
            }
        } else {
            if (!this.checkLineIntersects(this.guidingLine)) {
                var lastCoord = this.coordsArray[this.coordsArray.length - 1];

                this.coordsArray.push(new PlayerCoordinate(this.gamewindow, this.playerobject.asset.position.x, this.playerobject.asset.position.y, this.color.normal));

                this.linesArray.push(new PlayerCoordinateLine(this.gamewindow, this.playerobject.asset.position.x, this.playerobject.asset.position.y, lastCoord.x, lastCoord.y, this.color.normal));
                
                this.updateVisualGuidingLine(this.playerobject.asset.position.x, this.playerobject.asset.position.y, 0);
            }
        }
    }

    updateVisualGuidingLine(x, y, index) {
        if (this.guidingLine != null) {
            if (x != null) {
                this.guidingLine.asset.segments[index].point.x = x;
            }
            if (y != null) {
                this.guidingLine.asset.segments[index].point.y = y;
            }
            this.guidingLine.asset.bringToFront();
        }
    }

    removeVisuals() {
        if (this.playerobject.asset != null) {
            this.playerobject.asset.remove();
        }
        if (this.guidingLine != null && this.guidingLine.asset != null) {
            this.guidingLine.asset.remove();
        }
        while (this.coordsArray.length > 0) {
            var n = this.coordsArray.pop();
            n.asset.remove();
        }
        while (this.linesArray.length > 0) {
            var n = this.linesArray.pop();
            n.asset.remove();
        }
    }

    setPoly() {
        if (!(this.coordsArray == undefined || this.coordsArray.length < 2)) {
            var completingLine = new PlayerCoordinateLine(this.gamewindow, this.coordsArray[0].asset.position.x, this.coordsArray[0].asset.position.y, this.playerobject.asset.position.x, this.playerobject.asset.position.y, this.color.normal);

            if (!(this.checkLineIntersects(completingLine) || this.checkLineIntersects(this.guidingLine))) {
                this.setCoord();

                this.claimedShapesArray.push(new PlayerPolygon(this.gamewindow, this.coordsArray, this.color.dark));
    
                while (this.coordsArray.length > 0) {
                    var n = this.coordsArray.pop();
                    n.asset.remove();
                }
    
                while (this.linesArray.length > 0) {
                    var n = this.linesArray.pop();
                    n.asset.remove();
                }
    
                this.guidingLine.asset.remove();
                this.guidingLine = null;
            }

            completingLine.asset.remove();
        }
    }

    //debug
    printCoordinates() {
        console.log(this.playerobject.asset.position.x);
        console.log(this.playerobject.asset.position.y);

        this.checkOutOfBounds();
    }

    checkLineIntersects(line) {
        let claimedshapes = this.gamewindow.layers["shapes"].children;

        let intersectConflict = false;

        Object.keys(claimedshapes).forEach(function (id) {
            if (claimedshapes[id].intersects(line.asset)) {
                intersectConflict = true;
            }
        });
        return intersectConflict;
    }

    checkPointIntersects(point) {
        let claimedshapes = this.gamewindow.layers["shapes"].children;

        let intersectConflict = false;

        Object.keys(claimedshapes).forEach(function (id) {
            if (claimedshapes[id].contains(point)) {
                intersectConflict = true;
            }
        });
        return intersectConflict;
    }

    checkOutOfBounds() {
        if ((this.playerobject.asset.position.x <= min_x) || (this.playerobject.asset.position.x >= max_x) || (this.playerobject.asset.position.y <= min_y) || (this.playerobject.asset.position.y >= max_y)) {
            this.die("border");
        }
    }

    die(reason, participant) {
        if (reason == "border") {
            console.log(this.name + " ran into a wall and died!");
        } else if (reason == "pkill") {
            console.log(this.name + " was slain!");
        } else {
            console.log(this.name + " died!");
        }
        this.removeVisuals();
        game.playerCount -= 1;
        checkGameStatus();
    }

    updatePos () {
        if (this.gamepad == undefined) {
            let ljx = 0;
            let ljy = 0;

            if (this.UpPressed) {
                ljy = ljy + 1;
                this.moveUp();
            }
            if (this.DownPressed) {
                ljy = ljy - 1;
                this.moveDown();
            }
            if (this.LeftPressed) {
                ljx = ljx + 1;
                this.moveLeft();
            }
            if (this.RightPressed) {
                ljx = ljx - 1;
                this.moveRight();
            }

            if (ljx != 0 || ljy != 0) {
                let angle = Math.atan2(ljy, ljx) * (180/Math.PI) - 90;
                this.playerobject.asset.rotation = angle;
            }

        } else {
            if (this.ALocked == false && this.gamepad.buttons[0].pressed) {
                this.setCoord();
                this.ALocked = true;
            } else if (!this.gamepad.buttons[0].pressed) {
                this.ALocked = false;
            }

            if (this.BLocked == false && this.gamepad.buttons[1].pressed) {
                this.setPoly();
                this.BLocked = true;
            } else if (!this.gamepad.buttons[1].pressed) {
                this.BLocked = false;
            }

            //left joystick
            this.currLJ_X = refineAxisValue(this.gamepad.axes[0]);
            this.currLJ_Y = refineAxisValue(this.gamepad.axes[1]);
            if (!(this.prevLJ_X == this.currLJ_X)) {
                this.prevLJ_X = this.currLJ_X;
            }
            if (!(this.prevLJ_Y == this.currLJ_Y)) {
                this.prevLJ_Y = this.currLJ_Y;
            }

            //right joystick
            this.currRJ_X = refineAxisValue(this.gamepad.axes[2]);
            this.currRJ_Y = refineAxisValue(this.gamepad.axes[3]);
            if (!(this.prevRJ_X == this.currRJ_X)) {
                this.prevRJ_X = this.currRJ_X;
            }
            if (!(this.prevRJ_Y == this.currRJ_Y)) {
                this.prevRJ_Y = this.currRJ_Y;
            }

            if (this.currLJ_X != 0 || this.currLJ_Y != 0) {
                let angle = Math.atan2(this.currLJ_Y, this.currLJ_X) * (180/Math.PI) + 90;
                this.playerobject.asset.rotation = angle;
            }

            this.moveY(this.currLJ_Y);
            this.moveX(this.currLJ_X);
        }
        this.checkOutOfBounds();
    }

    keyDown (e) {
        if (this.keybinds) {
            switch(e.code) {
                case this.keybinds.abutton:
                    if (!this.ALocked) {
                        this.setCoord();
                        this.ALocked = true;
                    }
                    break;
                case this.keybinds.bbutton:
                    if (!this.BLocked) {
                        this.setPoly();
                        this.BLocked = true;
                    }
                    break;
                case this.keybinds.up:
                    this.UpPressed = true;
                    break;
                case this.keybinds.down:
                    this.DownPressed = true;
                    break;
                case this.keybinds.left:
                    this.LeftPressed = true;
                    break;
                case this.keybinds.right:
                    this.RightPressed = true;
                    break;
                default:
                    break;
            }
        }
    }

    keyUp (e) {
        if (this.keybinds) {
            switch(e.code) {
                case this.keybinds.abutton:
                    this.ALocked = false;
                    break;
                case this.keybinds.bbutton:
                    this.BLocked = false;
                    break;
                case this.keybinds.up:
                    this.UpPressed = false;
                    break;
                case this.keybinds.down:
                    this.DownPressed = false;
                    break;
                case this.keybinds.left:
                    this.LeftPressed = false;
                    break;
                case this.keybinds.right:
                    this.RightPressed = false;
                    break;
                default:
                    break;
            }
        }
    }
};