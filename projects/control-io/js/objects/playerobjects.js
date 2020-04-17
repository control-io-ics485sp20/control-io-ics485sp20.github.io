function PlayerObject() {

    function init(gamewindow, x, y, color) {
        this.assetgroup = new paper.Group();
        this.assetgroup.applyMatrix = false;
        this.assetgroup.position = [x, y];

        this.playerexhaustspritepath = ("../img/playersprites/playersprite01-base-exhaust.png");
        this.playerspritepath = ("../img/playersprites/playersprite01-" + color.replace("#", "") + ".png");
        
        this.sprite_exhaust = new paper.Raster({
            source: this.playerexhaustspritepath,
            point: [0, 0],
            scaling: 0.08,
            applyMatrix: false,
            width: this.width,
            height: this.height
        });

        this.sprite = new paper.Raster({
            source: this.playerspritepath,
            point: [0, 0],
            scaling: 0.08,
            applyMatrix: false,
            width: this.width,
            height: this.height
        });

        this.hitbox = new paper.Path.Circle({
            radius: 11,
            applyMatrix: false
        });
        if (showHitboxes == true) {
            this.hitbox.strokeColor = PlayerHitboxColor;
        } else {
            this.hitbox.visible = false;
        }

        this.assetgroup.addChild(this.sprite_exhaust);
        this.assetgroup.addChild(this.sprite);
        this.assetgroup.addChild(this.hitbox);

        gamewindow.layers["players"].addChild(this.assetgroup);

        this.item = new paper.Item();
        // console.log(this.assetgroup.position);
    }

    function rotate(angle) {
        this.sprite.rotation = angle;
        this.sprite_exhaust.rotation = angle;
    }

    function move(xpos, ypos) {
        this.assetgroup.position.x = xpos;
        this.assetgroup.position.y = ypos;
    }

    function point() {
        return this.assetgroup.position;
    }

    return {
        init: init,
        rotate: rotate,
        move: move,
        point: point,
        assetgroup: this.assetgroup,
        hitbox: this.hitbox,
        sprite_exhaust: this.sprite_exhaust
    }
}

/*
 * A coordinate that a player can create.
 */
function PlayerCoordinate(gamewindow, x, y, color) {
    // constructor (gamewindow, x, y, color) {
    this.x = x;
    this.y = y;

    this.asset = new paper.Path.Circle({
        center: [x, y],
        radius: 6,
        fillColor: color
    });

    gamewindow.layers["playersetlines"].addChild(this.asset);
    // }

    return {
        x: this.x,
        y: this.y,
        asset: this.asset
    }
}

/*
* A line joining two coordinates.
*/
class PlayerCoordinateLine {
    constructor (gamewindow, x1, y1, x2, y2, color) {

        this.asset = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
        this.asset.strokeColor = color;
        this.asset.strokeWidth = lineWidth;
        this.asset.strokeCap = 'round';
        gamewindow.layers["playersetlines"].addChild(this.asset);
    }
}

/*
 * A guiding line that follows the player, showing where the next face of their polygon will be.
 */
class PlayerGuidingLine {
    constructor (gamewindow, x1, y1, x2, y2, color) {

        this.asset = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
        this.asset.strokeColor = color;
        this.asset.strokeWidth = lineWidth;
        this.asset.strokeCap = 'round';
        // this.asset.dashArray = [4, 10]
        gamewindow.layers["playerguidinglines"].addChild(this.asset);
    }
}

class PlayerCompletingLine {
    constructor () {

    }
}

/*
 * A polygon that a 
 */
class PlayerPolygon {
    constructor (gamewindow, coordsArray, color) {

        this.asset = new paper.Path();
        var i = 0;
        while (i < coordsArray.length) {
            // this.polygonShape.lineTo(coordsArray[i].x, coordsArray[i].y);
            this.asset.add(new paper.Point(coordsArray[i].x, coordsArray[i].y));
            i++;
        }
        this.asset.closed = true;
        this.asset.fillColor = color;
        this.asset.opacity = 0.5;

        if (showHitboxes == true) {
            this.asset.strokeColor = PlayerHitboxColor;
        } else {
            // this.hitbox.visible = false;
            this.asset.strokeColor = null;
        }

        gamewindow.layers["shapes"].addChild(this.asset);

        if (debug) {
            console.log("playerobjects.js.PlayerPolygon.constructor");
            console.log("   area: " + (Math.abs(this.asset.area)/100));
        }
        // gamewindow.layers["shaperaster"]
    }
}