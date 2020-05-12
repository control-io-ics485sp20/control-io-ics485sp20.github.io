function PlayerObject(ownerId, g, x, y, c) {
    var _this = this;
    _this.ownerId = ownerId;

    _this.gamewindow = g;
    _this.color = c;

    _this.playerexhaustspritepath = ("../img/playersprites/playersprite01-base-exhaust.png");
    _this.playerspritepath = ("../img/playersprites/playersprite01-" + _this.color.replace("#", "") + ".png");
    _this.hitboxRadius = 11;

    if (renderEngine == "paper") {
        _this.assetgroup = new paper.Group();
        _this.assetgroup.applyMatrix = false;
        _this.assetgroup.position = [x, y];
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
        _this.item = new paper.Item();
    } else if (renderEngine == "matter") {
        _this.matter_assetgroup = new Bodies.circle(x, y, _this.hitboxRadius, {
            ownerId: _this.ownerId,
            objectType: "ship",
            render: {
                sprite: {
                    texture: _this.playerspritepath,
                    xScale: 0.008 * _this.hitboxRadius,
                    yScale: 0.008 * _this.hitboxRadius,  
                },
                fillStyle: _this.color,
                collisionFilter: {
                    category: shipCategory,
                    mask: asteroidCategory | shipBarrierCategory,
                }
            },
        });
        // _this.matter_assetgroup.collisionFilter.group = ship_hitboxes;
        World.add(engine.world, [_this.matter_assetgroup]);
    }

    _this.movement = {
        x: 0,
        y: 0
    }

    function move2(movX, movY) {
        Body.applyForce(_this.matter_assetgroup, 
            {
                x: _this.matter_assetgroup.position.x,
                y: _this.matter_assetgroup.position.y,
            },
            {
                x: movX,
                y: movY
            }
        );
    }

    function rotate2(angle) {
        Body.setAngle(_this.matter_assetgroup, angle)
        Body.setAngularVelocity(_this.matter_assetgroup, 0);
    }

    function rotate(angle) {
        _this.sprite.rotation = angle;
        _this.sprite_exhaust.rotation = angle;
    }

    function move(movX, movY) {
        _this.assetgroup.position.x = movX;
        _this.assetgroup.position.y = movY;
    }

    // function moveX(x) {
    //     Body.translate(_this.matter_assetgroup, {x: x, y: 0});
    // }

    // function moveY(y) {
    //     Body.translate(_this.matter_assetgroup, {x: 0, y: y});
    // }

    function point() {
        return _this.assetgroup.position;
    }

    return {
        rotate: rotate,
        move: move,
        rotate2: rotate2,
        move2: move2,
        // moveX: moveX,
        // moveY: moveY,
        point: point,
        assetgroup: _this.assetgroup,
        hitbox: _this.hitbox,
        matter_assetgroup: _this.matter_assetgroup,
        sprite: _this.sprite,
        sprite_exhaust: _this.sprite_exhaust,
        radius: _this.hitboxRadius,
        movement: _this.movement,
        mass: 1
    }
}

/*
 * A coordinate that a player can create.
 */
function PlayerCoordinate(ownerId, gamewindow, x, y, color) {
    var _this = this;
    this.ownerId = ownerId;
    this.radius = 6;
    this.x = x;
    this.y = y;

    if (renderEngine == "paper") {
        this.asset = new paper.Path.Circle({
            center: [x, y],
            radius: _this.radius,
            fillColor: color
        });
        gamewindow.layers["playersetlines"].addChild(_this.asset);
    } else if (renderEngine == "matter") {
        _this.matter_assetgroup = new Bodies.circle(x, y, _this.radius, {
            ownerId: _this.ownerId,
            objectType: "forcefield_projector",
            render: {
                fillStyle: color,
            },
            collisionFilter: {
                category: markerCategory,
                mask: asteroidCategory
            }
        });
        Body.setStatic(_this.matter_assetgroup, true);
        World.add(engine.world, [_this.matter_assetgroup]);
    }

    // return {
    //     x: _this.x,
    //     y: _this.y,
    //     asset: _this.asset,
    //     matter_assetgroup: _this.matter_assetgroup
    // }
}

/*
* A line joining two coordinates.
*/
function PlayerCoordinateLine(ownerId, gamewindow, x1, y1, x2, y2, color) {
    var _this = this;
    this.ownerId = ownerId;

    if (renderEngine == "paper") {
        this.asset = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
        this.asset.strokeColor = color;
        this.asset.strokeWidth = lineWidth;
        this.asset.strokeCap = 'round';
        gamewindow.layers["playersetlines"].addChild(this.asset);
    }

    function despawn() {

    }

    this.despawn = despawn
}

/*
 * A guiding line that follows the player, showing where the next face of their polygon will be.
 */
function PlayerGuidingLine(ownerId, gamewindow, x1, y1, x2, y2, color) {
    var _this = this;
    this.ownerId = ownerId;

    this.asset = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
    this.asset.strokeColor = color;
    this.asset.strokeWidth = lineWidth;
    this.asset.strokeCap = 'round';
    // _this.asset.dashArray = [4, 10]
    gamewindow.layers["playerguidinglines"].addChild(this.asset);
    // }

    function despawn() {

    }

    this.despawn = despawn
}

class PlayerCompletingLine {
    constructor () {

    }
}

/*
 * A polygon that a player has claimed
 */
function PlayerForcefield (ownerId, gamewindow, id, coordsArray, color) {
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

    SFX.sound.play();

    function despawn() {
        // console.log("removing forcefield!");
        _this.asset.remove();
        var rm_sound = new Audio('../music/lost.m4a');
        rm_sound.play();
    }

    this.removeForcefield = despawn;
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
        area: _this.area,
        playerId: _this.playerId,
        despawn: despawn,
    }
}
