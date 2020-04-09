function GameWindow(properties) {
    var canvas;
    var properties = properties;
    var layers = {};

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
        layers["background"] = (new paper.Layer({name: 'background'}));
        layers["shaperaster"] = (new paper.Layer({name: 'shaperaster'}));
        layers["shapes"] = (new paper.Layer({name: 'shapes'}));
        layers["playersetlines"] = (new paper.Layer({name: 'playersetlines'}));
        layers["playerguidinglines"] = (new paper.Layer({name: 'playerguidinglines'}));
        layers["players"] = (new paper.Layer({name: 'players'}));

        setBackground();
    }

    function addPlayer(x, y, color) {
        var Player = new paper.Raster('../img/grey.png');
        Player.position.x = x;
        Player.position.y = y;
        Player.scale(0.1);
        // Player.size = new paper.Size(20, 20);
        // Player.center = [x, y];
        // var Player = new paper.Raster({
        //     source: '../img/grey.png',
        //     center: [x, y],
        // });
        // var Player = new paper.Path.Circle({
        //     center: [x, y],
        //     radius: 8,
        //     strokeWidth: 5,
        //     strokeColor: color
        // });
        layers["players"].addChild(Player);
        return Player;
    }

    function setBackground() {
        var background = new paper.Raster({source: '../img/starry_night.png', position: window.center});
        background.scale(2);
        // background.point = [0,0];
        // background.size = [max_x / 2, max_y / 2];
        // background.size.x = max_x;
        layers["background"].addChild(background);
    }

    function removePlayer() {

    }

    return {
        init: init,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        setBackground: setBackground,
        canvas: canvas,
        layers: layers
    }
    

    //adds item to body. Probably belongs in render library.
}
