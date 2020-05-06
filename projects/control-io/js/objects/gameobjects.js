/**
 * Asteroid
 *
 * Class that represents an Asteroid
 */

function Asteroid (gameWindow, gameMap) {
    var _this = this
    _this.id = (Date.now() * Math.random()).toString().replace(".", "-");

    _this.gamewindow = gameWindow;
    _this.gamemap = gameMap;

    //set random size
    _this.sizemodifier = (Math.random() * (AsteroidMaxSize - AsteroidMinSize) + AsteroidMinSize);
    //set random velocity
    _this.velocitymodifier = (Math.random() * (AsteroidMaxSpeed - AsteroidMinSpeed) + AsteroidMinSpeed);
    //set random spin speed
    _this.spinmodifier = (Math.random() * (AsteroidMaxSpinSpeed - AsteroidMinSpinSpeed) + AsteroidMinSpinSpeed);
    //set random spin direction
    if (AsteroidAllowNoSpin) { //if spindirection includes 0
        _this.spindirection = ((Math.floor(Math.random() * 2)) * ((Math.floor(Math.random() * 2)) == 1 ? 1 : -1));
    } else { //if spindirection excludes 0
        _this.spindirection = ((Math.floor(Math.random() * 2)) == 1 ? 1 : -1); 
    }

    _this.assetgroup = new paper.Group();
    _this.assetgroup.applyMatrix = false;

    var asteroidModel = {
        small: {
            spriteBaseSize: 0.25,
            hitboxBaseSize: 11,
            source: '../img/sprites/ASTEROID small v1-min.png'
        },
        large: {
            spriteBaseSize: 0.25,
            hitboxBaseSize: 11,
            source: '../img/sprites/ASTEROID large v1-min.png'
        }
    }

    // console.log(asteroidModel["small"]);

    _this.spriteSize = asteroidModel.small.spriteBaseSize * _this.sizemodifier;
    _this.sprite = new paper.Raster({
        // source: '../img/sprites/asteroid-min.png',
        source: asteroidModel.small.source,
        position: [0, 0],
        scaling: _this.spriteSize,
        applyMatrix: false
    });

    _this.mass = 1.5 * _this.sizemodifier;
    // _this.mass = 1;
    _this.radius = asteroidModel.small.hitboxBaseSize * _this.sizemodifier;
    _this.hitbox = new paper.Path.Circle({
        radius: _this.radius,
        applyMatrix: false
    });
    if (showHitboxes == true) {
        _this.hitbox.strokeColor = AsteroidHitboxColor;
    } else {
        _this.hitbox.visible = false;
    }

    _this.assetgroup.addChild(_this.sprite);
    _this.assetgroup.addChild(_this.hitbox);

    _this.gamewindow.layers["asteroids"].addChild(_this.assetgroup);

    _this.velocity = spawn(_this);



    _this.velX = _this.velocity.x;
    _this.velY = _this.velocity.y;
    // }

    // console.log("Creating asteroid!");


    function spawn() {
        var x;
        var y;
        var velX;
        var velY;
        //TODO spawn at edge
        var xyspawn = (Math.floor(Math.random() * 4));
        if (xyspawn == 0) { //spawn top side
            x = Math.floor((Math.random() * Math.floor(GameObjectBorderMaxX)));
            y = GameObjectBorderMinY;

            velX = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
            velY = ((Math.random() * 1) * (1));
        } else if (xyspawn == 1) { //spawn bottom side
            x = Math.floor((Math.random() * Math.floor(GameObjectBorderMaxX)));
            y = GameObjectBorderMaxY;

            velX = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
            velY = ((Math.random() * 1) * (-1));
        } else if (xyspawn == 2) { //spawn left side
            x = GameObjectBorderMinX;
            y = Math.floor((Math.random() * Math.floor(GameObjectBorderMaxY)));

            velX = ((Math.random() * 1) * (1));
            velY = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
        } else if (xyspawn == 3) { //spawn right side
            x = GameObjectBorderMaxX;
            y = Math.floor((Math.random() * Math.floor(GameObjectBorderMaxY)));

            velX = ((Math.random() * 1) * (-1));
            velY = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
        }

        _this.assetgroup.position = [x, y];

        //
        // _this.hitbox2 = new _this.gamewindow.bodies.circle(x, y, _this.radius);
        // console.log(_this.hitbox2);
        // _this.gamewindow.world.add(_this.gamewindow.engine.world, [_this.hitbox2]);

        return {x: velX, y: velY};
    }

    function updatePos() {
        if (_this.assetgroup) {
            let newx = _this.assetgroup.position.x + _this.velocity.x * _this.velocitymodifier;
            let newy = _this.assetgroup.position.y + _this.velocity.y * _this.velocitymodifier;

            if (_this.gamemap.GameObjectIsOutOfBounds(newx, newy)) {
                remove(_this.hitbox, _this.sprite, _this.assetgroup);
                delete _this.hitbox;
                delete _this.sprite;
                delete _this.assetgroup;
            } else {
                _this.assetgroup.position.x = newx;
                _this.assetgroup.position.y = newy;

                _this.assetgroup.rotate(_this.spindirection * _this.spinmodifier);

                _this.asteroidHitboxRadius = _this.radius;

                var asteroidHitbox = {
                    id: _this.id,
                    x: _this.assetgroup.position.x,
                    y: _this.assetgroup.position.y,
                    radius: _this.radius
                }

                Object.keys(game.players).forEach(function (index) {
                    var playerHitbox = {
                        x: game.players[index].playerobject.assetgroup.position.x,
                        y: game.players[index].playerobject.assetgroup.position.y,
                        radius: game.players[index].playerobject.radius
                    }

                    if (checkHit(playerHitbox, asteroidHitbox)) {
                        if (game.players[index].playerobject) {
                            game.players[index].playerobject.hitbox.strokeColor = "red";
                        }
                        _this.hitbox.strokeColor = "red";

                        //everything here should technically run
                        // console.log("asteroid colliding with ship!");
                        resolveAsteroidToShipCollision(_this, game.players[index].playerobject);
                    } else {
                        if (game.players[index].playerobject) {
                            game.players[index].playerobject.hitbox.strokeColor = "white";
                        }
                        _this.hitbox.strokeColor = "yellow";
                    }
                });

                Object.keys(game.asteroids).forEach(function (index) {
                    let asteroid2Hitbox = {
                        id: game.asteroids[index].id,
                        x: game.asteroids[index].assetgroup.position.x,
                        y: game.asteroids[index].assetgroup.position.y,
                        radius: game.asteroids[index].radius,
                    }
                    if (asteroidHitbox.id === asteroid2Hitbox.id) {
                        // console.log("same asteroid!");
                    } else {
                        if (checkHit(asteroidHitbox, asteroid2Hitbox)) {
                            resolveAsteroidToAsteroidCollision(_this, game.asteroids[index])
                        } else {
                        }
                    }
                });

                Object.keys(claimed_shapes).forEach(function (index) {
                    if (checkPolygonHit(asteroidHitbox, claimed_shapes[index].asset)) {
                        // console.log("polygon hit!");
                        resolveAsteroidToPolygonCollision(_this, claimed_shapes[index].asset)
                    } else {
                    }
                });
            }
            return true;
        } else {
            return false;
        }
    }

    function remove(hitbox, sprite, assetgroup) {
        hitbox.remove();
        sprite.remove();
        assetgroup.remove();

        hitbox = null;
        sprite = null;
        assetgroup = null;
    }

    return {
        updatePos: updatePos,
        assetgroup: _this.assetgroup,
        gamemap: _this.gamemap,
        radius: _this.radius,
        sprite: _this.sprite,
        hitbox: _this.hitbox,
        id: _this.id,
        velocity: _this.velocity,
        mass: _this.mass,
        gamewindow: _this.gameWindow,
    }
}