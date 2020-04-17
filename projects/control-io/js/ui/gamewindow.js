function GameWindow(properties) {
    var canvas;
    var properties = properties;
    this.layers = {};

    function init() {

        html = `
        <canvas id="layer_main" class="gamewindow"></canvas>
        `
        $("#window").append(html);

        $("#layer_main").css("z-index", -3);

        $("#layer_main").css("width", properties.width);
        $("#layer_main").css("height", properties.height);

        canvas = $("#layer_main")[0];

        paper.setup(canvas);
        this.layers["background"] = (new paper.Layer({name: 'background'}));
        this.layers["shaperaster"] = (new paper.Layer({name: 'shaperaster'}));
        this.layers["shapes"] = (new paper.Layer({name: 'shapes'}));
        this.layers["playersetlines"] = (new paper.Layer({name: 'playersetlines'}));
        this.layers["playerguidinglines"] = (new paper.Layer({name: 'playerguidinglines'}));
        this.layers["players"] = (new paper.Layer({name: 'players'}));

        this.layers["asteroids"] = (new paper.Layer({name: 'asteroids'}));

        this.setBackground();
    }

    function setBackground() {
        var background = new paper.Raster({source: '../img/background/starry_night.png', position: window.center});
        background.scale(2);
        this.layers["background"].addChild(background);
    }

    function removePlayer() {

    }

    return {
        init: init,
        removePlayer: removePlayer,
        setBackground: setBackground,
        canvas: canvas,
        layers: this.layers
    }
    

    //adds item to body. Probably belongs in render library.
}
