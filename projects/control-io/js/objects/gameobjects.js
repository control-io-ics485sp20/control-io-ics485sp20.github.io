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
    _this.velocitymodifier2 = (Math.random() * (AsteroidMaxSpeed2 - AsteroidMinSpeed2) + AsteroidMinSpeed2);
    //set random spin speed
    _this.spinmodifier = (Math.random() * (AsteroidMaxSpinSpeed - AsteroidMinSpinSpeed) + AsteroidMinSpinSpeed);
    _this.spinmodifier2 = (Math.random() * (AsteroidMaxSpinSpeed2 - AsteroidMinSpinSpeed2) + AsteroidMinSpinSpeed2);
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
    _this.mass = 1.5 * _this.sizemodifier;
    _this.radius = asteroidModel.small.hitboxBaseSize * _this.sizemodifier;
    _this.movement = spawn(_this);

    _this.velX = _this.movement.velX;
    _this.velY = _this.movement.velY;

    if (renderEngine == "paper") {
        _this.assetgroup = new paper.Group();
        _this.assetgroup.applyMatrix = false;
        _this.sprite = new paper.Raster({
            source: asteroidModel.small.source,
            position: [0, 0],
            scaling: _this.spriteSize,
            applyMatrix: false
        });
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
        _this.assetgroup.position = [_this.movement.x, _this.movement.y];
    } else if (renderEngine == "matter") {
        _this.hitbox2 = new Bodies.circle(_this.movement.x, _this.movement.y, _this.radius, {
            id: _this.id,
            ownerObj: this,
            objectType: "asteroid",
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            inertia: Infinity,
            restitution: 1,
            render: {
                sprite: {
                    texture: asteroidModel.small.source,
                    xScale: 0.021 * _this.radius,
                    yScale: 0.021 * _this.radius
                },
            },
            collisionFilter: {
                category: asteroidCategory,
                mask: asteroidCategory | shipCategory | asteroidBarrierCategory,
            }
            // collisionFilter: asteroidbarrierfilter,
        });
        Body.setVelocity(_this.hitbox2, {x: _this.velX * _this.velocitymodifier2, y: _this.velY * _this.velocitymodifier2});
        Body.setAngularVelocity(_this.hitbox2, _this.spinmodifier2 * _this.spindirection);
        // _this.hitbox2.collisionFilter.group = asteroid_hitboxes;
        World.add(engine.world, [_this.hitbox2]);
    }

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
                    if (player.alive) {
                        var playerHitbox = {
                            x: player.playerobject.assetgroup.position.x,
                            y: player.playerobject.assetgroup.position.y,
                            radius: player.playerobject.radius
                        }

                        if (checkCircleHit(playerHitbox, asteroidHitbox)) {
                            if ((_this.collisions[(_this.id + "_" + player.id)] == undefined)) {
                                if (player.hitbox) {
                                    player.hitbox.strokeColor = "red";
                                }
                                _this.hitbox.strokeColor = "red";

                                // console.log(_this.id + " colliding with " + player.id);
                                // console.log(game.players.filter(obj => {return obj.id === player.id})[0].health);
                                player.health -= _this.damage.toPlayers;
                                player.lastHitBy = "asteroid";
                                console.log(player.name + ": " + player.health);

                                SFX.hitsound.play();

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

                        let deleteprogress = false;

                        //check points
                        for (j in player.coordsArray) {
                            // console.log(player.coordsArray[j].asset);

                            if (checkCircleHit(asteroidHitbox, player.coordsArray[j].asset)) {
                                console.log("coord hit!");
                                deleteprogress = true;
                            }
                        }

                        //check lines
                        for (k in player.linesArray) {
                            if (checkPathHit(asteroidHitbox, player.linesArray[k].asset)) {
                                console.log("line hit!");
                                deleteprogress = true;
                            }
                        }

                        //check guiding line
                        // console.log(player.guidingLine);
                        if (player.guidingLine && checkPathHit(asteroidHitbox, player.guidingLine)) {
                            console.log("guiding line hit!");
                        }
                    }
                }

                for (i in asteroids) {
                    let asteroid2 = asteroids[i]

                    let asteroid2Hitbox = {
                        id: asteroid2.id,
                        x: asteroid2.assetgroup.position.x,
                        y: asteroid2.assetgroup.position.y,
                        radius: asteroid2.radius,
                    }
                    if (asteroidHitbox.id === asteroid2Hitbox.id) {
                    } else {
                        if (checkCircleHit(asteroidHitbox, asteroid2Hitbox)) {
                            resolveAsteroidToAsteroidCollision(_this, asteroid2)
                        } else {
                        }
                    }
                };

                // console.log(game.forcefields)

                for (i in game.forcefields) {
                    let claimedShape = game.forcefields[i];

                    if (checkPathHit(asteroidHitbox, claimedShape.asset)) {
                        claimedShape.health -= _this.damage.toForcefields;
                        if (debug) {
                            console.log(claimedShape.id + ": " + claimedShape.health);
                        }
                        SFX.hit_sound.play();

                        let dmgpercentage = claimedShape.health/claimedShape.maxHealth;
                        claimedShape.asset.opacity = (dmgpercentage * (claimedShape.maxOpacity));

                        resolveAsteroidToPolygonCollision(_this, claimedShape.asset)
                    } else {
                    }
                }

                // for (i in game.players) {
                //     let claimedShape = game.forcefields[i];

                //     if (checkPolygonHit(asteroidHitbox, claimedShape.asset)) {
                //         claimedShape.health -= _this.damage.toForcefields;
                //         if (debug) {
                //             console.log(claimedShape.id + ": " + claimedShape.health);
                //         }
                //         SFX.hit_sound.play();

                //         let dmgpercentage = claimedShape.health/claimedShape.maxHealth;
                //         claimedShape.asset.opacity = (dmgpercentage * (claimedShape.maxOpacity));

                //         resolveAsteroidToPolygonCollision(_this, claimedShape.asset)
                //     } else {
                //     }
                // }
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

    function despawn() {
        // console.log("despawning");
        Matter.Composite.remove(world, _this.hitbox2);
    }

    return {
        updatePos: updatePos,
        assetgroup: _this.assetgroup,
        gamemap: _this.gamemap,
        radius: _this.radius,
        sprite: _this.sprite,
        hitbox: _this.hitbox,
        hitbox2: _this.hitbox2,
        despawn: despawn,
        id: _this.id,
        velocity: _this.velocity,
        movement: _this.movement,
        mass: _this.mass,
        gamewindow: _this.gameWindow,
    }
}

function BorderConstraint(borderWidth, borderMargin, objectType, color, group = 0x0000, category = 1, mask = -1) {
// function BorderConstraint(borderWidth, borderMargin, objectType, color, filter) {
    var _this = this;

    _this.renderSettings = {
        fillStyle: color,
        strokeStyle: color,
    }

    _this.objectType = objectType; 
    _this.borderWidth = borderWidth;
    _this.borderMargin = borderMargin;

    _this.topWall = new Bodies.rectangle((max_x / 2), (min_y + _this.borderMargin), (max_x - (_this.borderMargin * 2)  + _this.borderWidth), _this.borderWidth, { objectType: _this.objectType, render: _this.renderSettings });
    _this.bottomWall = new Bodies.rectangle((max_x / 2), (max_y - _this.borderMargin), (max_x - (_this.borderMargin * 2)  + _this.borderWidth), _this.borderWidth, { objectType: _this.objectType, render: _this.renderSettings });
    _this.leftWall = new Bodies.rectangle((min_x + _this.borderMargin), (max_y / 2), _this.borderWidth, (max_y - (_this.borderMargin * 2) + _this.borderWidth), { objectType: _this.objectType, render: _this.renderSettings });
    _this.rightWall = new Bodies.rectangle((max_x - _this.borderMargin), (max_y / 2), _this.borderWidth, (max_y - (_this.borderMargin * 2) + _this.borderWidth), { objectType: _this.objectType, render: _this.renderSettings });

    // _this.topWall.collisionFilter = filter
    // _this.bottomWall.collisionFilter = filter
    // _this.leftWall.collisionFilter = filter
    // _this.rightWall.collisionFilter = filter

    _this.topWall.collisionFilter = { category: category, mask: mask }
    _this.bottomWall.collisionFilter = { category: category, mask: mask }
    _this.leftWall.collisionFilter = { category: category, mask: mask }
    _this.rightWall.collisionFilter = { category: category, mask: mask }

    _this.topWall.collisionFilter.group = group;
    _this.bottomWall.collisionFilter.group = group;
    _this.leftWall.collisionFilter.group = group;
    _this.rightWall.collisionFilter.group = group;
    Body.setStatic(_this.topWall, true);
    Body.setStatic(_this.bottomWall, true);
    Body.setStatic(_this.leftWall, true);
    Body.setStatic(_this.rightWall, true);
    World.add(engine.world, [_this.topWall, _this.bottomWall, _this.leftWall, _this.rightWall]);

    return {

    }
}

// function AsteroidDespawnConstraint() {


//     return {

//     }
// }