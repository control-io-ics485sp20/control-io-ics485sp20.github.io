function GameWindow(properties) {
    var _this = this
    
    var canvas;
    var properties = properties;
    _this.layers = {};

    // var Render = Matter.Render;

    // _this.Engine = Matter.Engine;
    // _this.World = Matter.World;
    // _this.Bodies = Matter.Bodies;

    

    // var engine = _this.Engine.create();
    // _this.Engine.run(engine);

    function init() {
        html = `
        <canvas id="layer_main" class="gamewindow"></canvas>
        `
        $("#window").append(html);

        $("#layer_main").css("z-index", -3);

        $("#layer_main").css("width", properties.width);
        $("#layer_main").css("height", properties.height);

        canvasid = "layer_main";

        // canvas = $("#layer_main")[0];

        // setupMatter(canvasid);
        setupPaper(canvasid);
    }

    function setupMatter(canvasid) {
        render = Render.create({
            canvas: document.getElementById(canvasid),
            engine: engine,
            options: {
                width: max_x,
                height: max_y,
                wireframes: false,
                background: 'blue'
            }
        });
        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0;
        Render.run(render);
        runner = Runner.create();
        Runner.run(runner, engine);
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
        var background = new paper.Raster({source: '../img/background/starry_night.png', position: window.center});
        background.scale(2);
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
