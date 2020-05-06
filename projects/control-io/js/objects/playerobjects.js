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
        velocity: _this.velocity,
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
 * A polygon that a player has claimed
 */
function PlayerForcefield (gamewindow, id, coordsArray, color) {
    var _this = this;
    _this.id = "forcefield-" + (Date.now() * Math.random()).toString().replace(".", "-");

    // constructor (gamewindow, id, coordsArray, color) {
    _this.playerId = id;

    _this.asset = new paper.Path();

    _this.asset.lineObjects = [];

    _this.maxOpacity = 0.7
    _this.minOpactiy = 0.3

    var i = 0;
    _this.lastCoord = coordsArray[coordsArray.length - 1];
    while (i < coordsArray.length) {
        let segment = {
            p1: _this.lastCoord,
            p2: coordsArray[i],
            slope: (coordsArray[i].y - _this.lastCoord.y)/(coordsArray[i].x - _this.lastCoord.x)
        }

        _this.asset.lineObjects.push(segment);
        _this.lastCoord = coordsArray[i];

        _this.asset.add(new paper.Point(coordsArray[i].x, coordsArray[i].y));
        i++;
    }
    _this.asset.closed = true;
    _this.asset.fillColor = color;
    _this.asset.opacity = _this.maxOpacity;

    if (showHitboxes == true) {
        _this.asset.strokeColor = PlayerHitboxColor;
    } else {
        // _this.hitbox.visible = false;
        _this.asset.strokeColor = null;
    }

    gamewindow.layers["shapes"].addChild(_this.asset);

    // let hpmulti = 1.2;

    _this.area = (Math.abs(_this.asset.area)/100)
    _this.health = _this.area * ForcefieldHPModifier;
    _this.maxHealth = _this.health;

    if (debug) {
        console.log("playerobjects.js.PlayerPolygon.constructor");
        console.log("   area: " + _this.area);
        console.log("   health: " + _this.health);
    }
    // gamewindow.layers["shaperaster"] 

    // game.claimedShapes.push(_this);
    // }

    function removeForcefield() {
        console.log("removing forcefield!");
        _this.asset.remove();
    }

    this.removeForcefield = removeForcefield;
    // game.forcefields.push(this);

    // console.log(game.forcefields);

    return {
        lines: _this.asset.lineObjects,
        id: _this.id,
        health: _this.health,
        maxHealth: _this.maxHealth,
        opacity: _this.asset.opacity,
        maxOpacity: _this.maxOpacity,
        minOpacity: _this.minOpacity,
        asset: _this.asset,
        removeForcefield: removeForcefield,
    }
}