/**
 * Asteroid
 *
 * Class that represents an Asteroid
 */

function Asteroid (gameWindow, gameMap) {
    var _this = this
    _this.id = "asteroid-" + (Date.now() * Math.random()).toString().replace(".", "-");

    _this.gamewindow = gameWindow;
    _this.gamemap = gameMap;

    _this.collisions = {};

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

    _this.damage = {
        toPlayers: (AsteroidDamageToPlayers * _this.sizemodifier * _this.velocitymodifier),
        toForcefields: (AsteroidDamageToForcefields * _this.sizemodifier * _this.velocitymodifier),
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

    _this.spriteSize = asteroidModel.small.spriteBaseSize * _this.sizemodifier;
    _this.sprite = new paper.Raster({
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

    _this.movement = spawn(_this);

    _this.velX = _this.movement.velX;
    _this.velY = _this.movement.velY;

    _this.hitbox2 = new Bodies.circle(_this.movement.x, _this.movement.y, _this.radius, {
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        inertia: Infinity,
        restitution: 1,
        // velocity: {
        //     x: _this.velX,
        //     x: _this.velY,
        // },
        render: {
            fillStyle: "yellow",
        }
    });
    Body.setVelocity(_this.hitbox2, {x: _this.velX, y: _this.velY});
    _this.hitbox2.collisionFilter.group = matter_hitboxes;
    World.add(engine.world, [_this.hitbox2]);

    function spawn() {
        let x;
        let y;
        let velX;
        let velY;
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

        return {
            velX: velX, 
            velY: velY,
            x: x,
            y: y,
        };
    }

    function updatePos() {
        if (_this.assetgroup) {
            let newx = _this.assetgroup.position.x + _this.movement.velX * _this.velocitymodifier;
            let newy = _this.assetgroup.position.y + _this.movement.velY * _this.velocitymodifier;

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

                for (i in game.players) {
                    let player = game.players[i];

                    var playerHitbox = {
                        x: player.playerobject.assetgroup.position.x,
                        y: player.playerobject.assetgroup.position.y,
                        radius: player.playerobject.radius
                    }

                    if (checkHit(playerHitbox, asteroidHitbox)) {
                        if ((_this.collisions[(_this.id + "_" + player.id)] == undefined)) {
                            if (player.hitbox) {
                                player.hitbox.strokeColor = "red";
                            }
                            _this.hitbox.strokeColor = "red";

                            // console.log(_this.id + " colliding with " + player.id);
                            // console.log(game.players.filter(obj => {return obj.id === player.id})[0].health);
                            player.health -= _this.damage.toPlayers;
                            console.log(player.name + ": " + player.health);

                            var hitsound = new Audio('../music/smash.m4a');
                            hitsound.play();

                            resolveAsteroidToShipCollision(_this, player.playerobject);

                            _this.collisions[(_this.id + "_" + player.id)] = true;
                        }
                    } else {
                        if (player.hitbox) {
                            player.hitbox.strokeColor = "white";
                        }
                        _this.hitbox.strokeColor = "yellow";

                        delete _this.collisions[(_this.id + "_" + player.id)];
                    }
                }

                for (i in game.asteroids) {
                    let asteroid2 = game.asteroids[i]

                    let asteroid2Hitbox = {
                        id: asteroid2.id,
                        x: asteroid2.assetgroup.position.x,
                        y: asteroid2.assetgroup.position.y,
                        radius: asteroid2.radius,
                    }
                    if (asteroidHitbox.id === asteroid2Hitbox.id) {
                    } else {
                        if (checkHit(asteroidHitbox, asteroid2Hitbox)) {
                            resolveAsteroidToAsteroidCollision(_this, asteroid2)
                        } else {
                        }
                    }
                };

                // console.log(game.forcefields)

                for (i in game.forcefields) {
                    let claimedShape = game.forcefields[i];

                // Object.keys(game.claimedShapes).forEach(function (index) {
                    if (checkPolygonHit(asteroidHitbox, claimedShape.asset)) {

                        // console.log(claimedShape);
                        // claimedShape.removeForcefield();


                        // console.log("polygon hit!");
                        claimedShape.health -= _this.damage.toForcefields;
                        console.log(claimedShape.id + ": " + claimedShape.health);
                        var hit_sound = new Audio('../music/zzz.m4a');
                        hit_sound.play();
                        hit_sound.volume = 0.4;

                        let dmgpercentage = claimedShape.health/claimedShape.maxHealth;
                        // claimedShape.asset.opacity = (dmgpercentage * (claimedShape.maxOpacity - claimedShape.minOpacity)) + claimedShape.minOpacity;
                        claimedShape.asset.opacity = (dmgpercentage * (claimedShape.maxOpacity));
                        // console.log(claimedShape.id + ": " + claimedShape.health);

                        // console.log(claimedShape);

                        resolveAsteroidToPolygonCollision(_this, claimedShape.asset)
                    } else {
                    }
                }
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
        movement: _this.movement,
        mass: _this.mass,
        gamewindow: _this.gameWindow,
    }
}
