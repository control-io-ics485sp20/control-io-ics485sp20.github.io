function PlayerObject(g, x, y, c) {
    var _this = this;

    _this.gamewindow = g;
    _this.color = c;

    _this.assetgroup = new paper.Group();
    _this.assetgroup.applyMatrix = false;
    _this.assetgroup.position = [x, y];

    _this.playerexhaustspritepath = ("../img/playersprites/playersprite01-base-exhaust.png");
    _this.playerspritepath = ("../img/playersprites/playersprite01-" + _this.color.replace("#", "") + ".png");
    
    _this.sprite_exhaust = new paper.Raster({
        source: _this.playerexhaustspritepath,
        point: [0, 0],
        scaling: 0.08,
        applyMatrix: false,
        width: _this.width,
        height: _this.height
    });

    _this.sprite = new paper.Raster({
        source: _this.playerspritepath,
        point: [0, 0],
        scaling: 0.08,
        applyMatrix: false,
        width: _this.width,
        height: _this.height
    });

    _this.hitboxRadius = 11;
    _this.hitbox = new paper.Path.Circle({
        radius: _this.hitboxRadius,
        applyMatrix: false
    });
    if (showHitboxes == true) {
        _this.hitbox.strokeColor = PlayerHitboxColor;
    } else {
        _this.hitbox.visible = false;
    }

    _this.assetgroup.addChild(_this.sprite_exhaust);
    _this.assetgroup.addChild(_this.sprite);
    _this.assetgroup.addChild(_this.hitbox);

    _this.gamewindow.layers["players"].addChild(_this.assetgroup);
    // g.layers["players"].addChild(_this.assetgroup);

    _this.item = new paper.Item();
        // console.log(_this.assetgroup.position);
    // }

    _this.velocity = {
        x: 0,
        y: 0
    }

    function rotate(angle) {
        _this.sprite.rotation = angle;
        _this.sprite_exhaust.rotation = angle;
    }

    function move(xpos, ypos) {
        _this.assetgroup.position.x = xpos;
        _this.assetgroup.position.y = ypos;
    }

    function point() {
        return _this.assetgroup.position;
    }

    return {
        rotate: rotate,
        move: move,
        point: point,
        assetgroup: _this.assetgroup,
        hitbox: _this.hitbox,
        sprite: _this.sprite,
        sprite_exhaust: _this.sprite_exhaust,
        radius: _this.hitboxRadius,
        velocity: {
            x: 1,
            y: 1
        },
        mass: 1
    }
}

/*
 * A coordinate that a player can create.
 */
function PlayerCoordinate(gamewindow, x, y, color) {
    var _this = this;

    // constructor (gamewindow, x, y, color) {
    _this.x = x;
    _this.y = y;

    _this.asset = new paper.Path.Circle({
        center: [x, y],
        radius: 6,
        fillColor: color
    });

    gamewindow.layers["playersetlines"].addChild(_this.asset);
    // }

    return {
        x: _this.x,
        y: _this.y,
        asset: _this.asset
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
        // _this.asset.dashArray = [4, 10]
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
            // _this.polygonShape.lineTo(coordsArray[i].x, coordsArray[i].y);
            this.asset.add(new paper.Point(coordsArray[i].x, coordsArray[i].y));
            i++;
        }
        this.asset.closed = true;
        this.asset.fillColor = color;
        this.asset.opacity = 0.5;

        if (showHitboxes == true) {
            this.asset.strokeColor = PlayerHitboxColor;
        } else {
            // _this.hitbox.visible = false;
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