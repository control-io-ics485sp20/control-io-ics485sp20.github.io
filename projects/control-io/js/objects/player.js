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
        // this.setCoord();
    };

    randomSpawn() {
        var random_x = Math.floor(((Math.random() * Math.floor(max_x))));
        var random_y = Math.floor(((Math.random() * Math.floor(max_y))));

        // this.playerobject = new PlayerObject(this.gamewindow, random_x, random_y, this.color.normal);
        this.playerobject = new PlayerObject();
        this.playerobject.init(this.gamewindow, random_x, random_y, this.color.normal);

        console.log(this.playerobject.point());
    }

    /*
        * moveX
        *
        * Intended for controllers.
        * Given a float modifier value, updates the player's position on the X axis for a frame.
        */
    moveX (modifier) {

        this.playerobject.assetgroup.position.x = this.playerobject.assetgroup.position.x + (player_minimum_max_velocity * modifier);
        this.updateVisualGuidingLine(this.playerobject.assetgroup.position.x, null, 1);
    }

    /*
        * moveY
        *
        * Intended for controllers.
        * Given a float modifier value, updates the player's position on the Y axis for a frame.
        */
    moveY (modifier) {

        this.playerobject.assetgroup.position.y = this.playerobject.assetgroup.position.y + (player_minimum_max_velocity * modifier);
        this.updateVisualGuidingLine(null, this.playerobject.assetgroup.position.y, 1);
    }

    setCoord() {
        if (debug) {
            console.log(`player.js.Player.setCoord
    x: ` + this.playerobject.assetgroup.position.getX() + `
    y: ` + this.playerobject.assetgroup.position.getY());
        }
        if (this.coordsArray == undefined || this.coordsArray.length == 0) {
            var tempPoint = new paper.Point(this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y);
            if(!this.checkPointIntersects(tempPoint)) {
                this.coordsArray.push(new PlayerCoordinate(this.gamewindow, this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y, this.color.normal));
                this.guidingLine = new PlayerGuidingLine(this.gamewindow, this.coordsArray[0].x, this.coordsArray[0].y, this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y, this.color.normal);
            }
        } else {
            if (!this.checkLineIntersects(this.guidingLine)) {
                var lastCoord = this.coordsArray[this.coordsArray.length - 1];

                this.coordsArray.push(new PlayerCoordinate(this.gamewindow, this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y, this.color.normal));

                this.linesArray.push(new PlayerCoordinateLine(this.gamewindow, this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y, lastCoord.x, lastCoord.y, this.color.normal));
                
                this.updateVisualGuidingLine(this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y, 0);
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
        if (this.playerobject.assetgroup != null) {
            this.playerobject.assetgroup.remove();
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
            var completingLine = new PlayerCoordinateLine(this.gamewindow, this.coordsArray[0].asset.position.x, this.coordsArray[0].asset.position.y, this.playerobject.assetgroup.position.x, this.playerobject.assetgroup.position.y, this.color.normal);

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
        console.log(this.playerobject.assetgroup.position.x);
        console.log(this.playerobject.assetgroup.position.y);

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
        if ((this.playerobject.assetgroup.position.x <= min_x) || (this.playerobject.assetgroup.position.x >= max_x) || (this.playerobject.assetgroup.position.y <= min_y) || (this.playerobject.assetgroup.position.y >= max_y)) {
            // console.log(this.playerobject.assetgroup.position.x + " " + this.playerobject.assetgroup.position.y);
            // this.die("border");
            if (debug) {
                console.log("   Out of bounds!");
            }
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
                ljy = -1;
            }
            if (this.DownPressed) {
                ljy = 1;
            }
            if (this.LeftPressed) {
                ljx = -1;
            }
            if (this.RightPressed) {
                ljx = 1;
            }

            if (this.UpPressed && this.LeftPressed) {
                ljx = -keyboard_player_max_diagonal_velocity;
                ljy = -keyboard_player_max_diagonal_velocity;
            }
            if (this.UpPressed && this.RightPressed) {
                ljx = keyboard_player_max_diagonal_velocity;
                ljy = -keyboard_player_max_diagonal_velocity;
            }
            if (this.DownPressed && this.LeftPressed) {
                ljx = -keyboard_player_max_diagonal_velocity;
                ljy = keyboard_player_max_diagonal_velocity;
            }
            if (this.DownPressed && this.RightPressed) {
                ljx = keyboard_player_max_diagonal_velocity;
                ljy = keyboard_player_max_diagonal_velocity;
            }

            if (this.UpPressed && this.DownPressed) {
                ljy = 0;
            }
            if (this.LeftPressed && this.RightPressed) {
                ljx = 0;
            }
            
            this.moveY(ljy);
            this.moveX(ljx);

            if (ljx != 0 || ljy != 0) {
                let angle = Math.atan2(ljy, ljx) * (180/Math.PI) + 90;
                this.playerobject.rotate(angle);
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

            let ljx = 0;
            let ljy = 0;

            ljx = refineAxisValue(this.gamepad.axes[0]);
            ljy = refineAxisValue(this.gamepad.axes[1]);

            this.moveY(ljy);
            this.moveX(ljx);

            if (ljx != 0 || ljy != 0) {
                let angle = Math.atan2(ljy, ljx) * (180/Math.PI) + 90;
                this.playerobject.rotate(angle);
            }
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