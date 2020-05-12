function GameWindow(properties) {
    var _this = this
    
    var canvas;
    var properties = properties;
    _this.layers = {};

    function init() {
        html = `
        <canvas id="layer_main" class="gamewindow"></canvas>
        `
        $("#window").append(html);

        $("#layer_main").css("z-index", -3);

        $("#layer_main").css("width", properties.width);
        $("#layer_main").css("height", properties.height);

        canvasid = "layer_main";

        if (renderEngine == "paper") {
            setupPaper(canvasid);
        } else if (renderEngine == "matter") {
            setupMatter(canvasid);
        }
    }

    function setupMatter(canvasid) {
        canvas = document.getElementById(canvasid);
        canvas.width = max_x;
        canvas.height = max_y;

        engine = Engine.create()
        world = engine.world;

        Events.on(engine, 'collisionStart', function(event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];

                let oA = pair.bodyA.objectType;
                let oB = pair.bodyB.objectType;

                if ((oA == "asteroid" && oB == "ship") || (oB == "asteroid" && oA == "ship")) {
                    if (oA == "asteroid") {
                        console.log(pair.bodyA.id + " colliding with ship owned by " + pair.bodyB.ownerId);
                    } else {
                        console.log(pair.bodyB.id + " colliding with ship owned by " + pair.bodyA.ownerId);
                    }
                    SFX.hitsound.play();
                    // _this.hitsound = new Audio('../music/smash.m4a');
                    // _this.hitsound.play();
                }

                if ((oA == "asteroid" && oB == "forcefield_projector") || (oB == "asteroid" && oA == "forcefield_projector")) {
                    if (oA == "asteroid") {
                        console.log(pair.bodyA.id + " colliding with forcefield projector owned by " + pair.bodyB.ownerId);
                    } else {
                        console.log(pair.bodyB.id + " colliding with forcefield projector owned by " + pair.bodyA.ownerId);
                    }
                    SFX.hit_sound.play();
                }

                if ((oA == "asteroid" && oB == "asteroid_border") || (oB == "asteroid" && oA == "asteroid_border")) {
                    // console.log("asteroid despawning!");
                    // console.log(game.asteroids);
                    if (oA == "asteroid") {
                        // console.log(pair.bodyA.id)
                        var result = asteroids.find(obj => {
                            return obj.id === pair.bodyA.id;
                        })
                        result.despawn();
                        asteroids = _.without(asteroids, _.findWhere(asteroids, {id: pair.bodyA.id}));
                    } else {
                        var result = asteroids.find(obj => {
                            return obj.id === pair.bodyB.id;
                        })
                        result.despawn();
                        asteroids = _.without(asteroids, _.findWhere(asteroids, {id: pair.bodyB.id}));
                    }
                }
            }
        });

        render = Render.create({
            canvas: document.getElementById(canvasid),
            context: canvas.getContext('2d'),
            engine: engine,
            options: {
                width: max_x,
                height: max_y,
                wireframes: false,
                background: '../img/background/starry_night.png'
            }
        });
        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0;
        Render.run(render);
        runner = Runner.create();
        Runner.run(runner, engine);

        var playerWalls = new BorderConstraint(20, 200, 'player_border', 'rgba(255, 0, 0, 0.1)', 0, shipBarrierCategory, shipCategory);
        var asteroidWalls = new BorderConstraint(20, -100, 'asteroid_border', 'rgba(255, 0, 0, 0.1)', 0, asteroidBarrierCategory, asteroidCategory);
    }

    function setupPaper(canvasid) {
        canvas = $("#" + canvasid)[0];
        paper.setup(canvas);
        _this.layers["background"] = (new paper.Layer({name: 'background'}));
        _this.layers["shaperaster"] = (new paper.Layer({name: 'shaperaster'}));
        _this.layers["shapes"] = (new paper.Layer({name: 'shapes'}));
        _this.layers["playersetlines"] = (new paper.Layer({name: 'playersetlines'}));
        _this.layers["playerguidinglines"] = (new paper.Layer({name: 'playerguidinglines'}));
        _this.layers["players"] = (new paper.Layer({name: 'players'}));

        _this.layers["asteroids"] = (new paper.Layer({name: 'asteroids'}));

        setBackground();
    }

    function setBackground() {
        var background = new paper.Raster({source: '../img/background/starry_night.png', position: paper.view.center});
        // background.scale(2);
        background.width = max_x;
        background.height = max_y;
        _this.layers["background"].addChild(background);
    }

    function removePlayer() {

    }

    return {
        init: init,
        removePlayer: removePlayer,
        setBackground: setBackground,
        canvas: canvas,
        layers: _this.layers,
        engine: _this.Engine,
        bodies: _this.Bodies,
        world: _this.World,
    }
    

    //adds item to body. Probably belongs in render library.
}
