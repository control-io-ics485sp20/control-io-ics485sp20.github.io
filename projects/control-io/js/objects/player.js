/**
 * Player
 *
 * Class that represents a Player
 */
class Player {
    constructor(gamewindow, color, name, keybinds) {
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

        // console.log(color.toString());
        // console.log(tinycolor(color).brighten(25).toString());

        this.prevLJ_X = 0;
        this.prevLJ_Y = 0;
        this.prevRJ_X = 0;
        this.prevRJ_Y = 0;

        this.keybinds = keybinds;

        this.geometry = new THREE.RingGeometry(player_radius, (player_radius + .03), 32);
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        this.player_object = new THREE.Mesh(this.geometry, this.material);

        // this.geometry = new THREE.CircleGeometry(player_radius, 32);
        // this.material = new THREE.MeshBasicMaterial({
        //     color: color
        // });
        // this.player_object = new THREE.Mesh(this.geometry, this.material);

        this.randomSpawn();
        this.newCoord();

        this.guidingLine = new PlayerGuidingLine(this.gamewindow, this.coordsArray[0].x, this.coordsArray[0].y, this.player_object.position.x, this.player_object.position.y, this.color.normal);
    };

    randomSpawn() {
        var random_x = Math.floor(((Math.random() * Math.floor(max_x * 2)) - max_x))/canvas_multiplier;
        var random_y = Math.floor(((Math.random() * Math.floor(max_y * 2)) - max_y))/canvas_multiplier;
        // var random_x = Math.floor(((Math.random() * Math.floor(max_x)) - max_x));
        // var random_y = Math.floor(((Math.random() * Math.floor(max_y)) - max_y));
        this.player_object.position.x = random_x;
        this.player_object.position.y = random_y;
    }

    getPlayerObject () {
        return this.player_object;
    };

    moveUp () {
        this.player_object.position.y += player_max_velocity;
    }

    moveDown () {
        this.player_object.position.y -= player_max_velocity;
    }

    moveLeft () {
        this.player_object.position.x -= player_max_velocity;
    }

    moveRight () {
        this.player_object.position.x += player_max_velocity;
    }

    /*
        * moveX
        *
        * Intended for controllers.
        * Given a float modifier value, updates the player's position on the X axis for a frame.
        */
    moveX (modifier) {
        var player_x = this.player_object.position.x + (player_max_velocity * modifier);
        this.player_object.position.x = player_x;
        
        // updates the guidingLine to the player's current position
        this.guidingLine.guidingLineObject.geometry.vertices[1].x = player_x;
        this.guidingLine.guidingLineObject.geometry.verticesNeedUpdate = true;
        //TODO Constrain x axes movement to area
    }

    /*
        * moveY
        *
        * Intended for controllers.
        * Given a float modifier value, updates the player's position on the Y axis for a frame.
        */
    moveY (modifier) {
        var player_y = this.player_object.position.y + (player_max_velocity * modifier);
        this.player_object.position.y = player_y;
        
        // updates the guidingLine to the player's current position
        this.guidingLine.guidingLineObject.geometry.vertices[1].y = player_y;
        this.guidingLine.guidingLineObject.geometry.verticesNeedUpdate = true;
        //TODO Constrain y axes movement to area
    }

    newCoord() {
        if (this.coordsArray == undefined || this.coordsArray.length == 0) {
            this.coordsArray.push(new PlayerCoordinate(this.gamewindow, this.player_object.position.x, this.player_object.position.y, this.color.normal));
        } else {
            var lastCoord = this.coordsArray[this.coordsArray.length - 1];

            this.coordsArray.push(new PlayerCoordinate(this.gamewindow, this.player_object.position.x, this.player_object.position.y, this.color.normal));

            this.linesArray.push(new PlayerCoordinateLine(this.gamewindow, this.player_object.position.x, this.player_object.position.y, lastCoord.x, lastCoord.y, this.color.normal));
            
            this.guidingLine.guidingLineObject.geometry.vertices[0].x = this.player_object.position.x;
            this.guidingLine.guidingLineObject.geometry.vertices[0].y = this.player_object.position.y;
        }
    }

    setPoly() {
        this.newCoord();

        this.claimedShapesArray.push(new PlayerPolygon(this.gamewindow, this.coordsArray, this.color.dark));

        while (this.coordsArray.length > 0) {
            var n = this.coordsArray.pop();
            this.gamewindow.scene.remove(n.coordObject);
        }

        while (this.linesArray.length > 0) {
            var n = this.linesArray.pop();
            this.gamewindow.scene.remove(n.coordLineObject);
        }

        this.newCoord();
    }

    updatePos () {
        if (this.gamepad == undefined) {
            if (this.UpPressed) {
                this.moveUp();
            }
            if (this.DownPressed) {
                this.moveDown();
            }
            if (this.LeftPressed) {
                this.moveLeft();
            }
            if (this.RightPressed) {
                this.moveRight();
            }
        } else {
            if (this.ALocked == false && this.gamepad.buttons[0].pressed) {
                this.newCoord();
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

            this.currLJ_X = refineAxisValue(this.gamepad.axes[0]);
            this.currLJ_Y = refineAxisValue(this.gamepad.axes[1]);
            if (!(this.prevLJ_X == this.currLJ_X)) {
                this.prevLJ_X = this.currLJ_X;
            }
            if (!(this.prevLJ_Y == this.currLJ_Y)) {
                this.prevLJ_Y = this.currLJ_Y;
            }

            this.currRJ_X = refineAxisValue(this.gamepad.axes[2]);
            this.currRJ_Y = refineAxisValue(this.gamepad.axes[3]);
            if (!(this.prevRJ_X == this.currRJ_X)) {
                this.prevRJ_X = this.currRJ_X;
            }
            if (!(this.prevRJ_Y == this.currRJ_Y)) {
                this.prevRJ_Y = this.currRJ_Y;
            }

            this.moveY(-this.currLJ_Y);
            this.moveX(this.currLJ_X);
        }
    }

    keyDown (e) {
        switch(e.code) {
            case this.keybinds.abutton:
                if (!this.ALocked) {
                    this.newCoord();
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

    keyUp (e) {
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
};