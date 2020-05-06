function GameOverlay() {
    var _this = this

    function init() {
        var html = `<div id="gameoverlay-scorescreen"></div>`
        $("#window").append(html);

        for (i in game.players) {
            var playerdiv = `
            <div class="gameoverlay-playerdiv" id="` + game.players[i].id + `-playerdiv">` + game.players[i].name + `</div>
            `

            $("#gameoverlay-scorescreen").append(playerdiv);

            // $("#" + game.players[i].id + "-playerdiv").css("background", `linear-gradient(90deg, #FFC0CB 50%, ` + game.players[i].color.normal + ` 50%)`);

            $("#" + game.players[i].id + "-playerdiv").css("width", "100%");
            $("#" + game.players[i].id + "-playerdiv").css("background-color", game.players[i].color.normal);
            // console.log(game.players[i].id);
            // console.log(game.players[i].name);
            console.log(game.players[i].color);
        }
    }

    function show() {
        $("#gameoverlay-scorescreen").css("visibility", "visible");
    }

    function hide() {
        $("#gameoverlay-scorescreen").css("visibility", "hidden");
    }

    function update() {

    }

    return {
        init: init,
        update: update,
        show: show,
        hide: hide,
    }
}

function GameOverlayPauseMenu() {
    var _this = this
    var html = `<div id="gameoverlay-pausemenu"></div>`
    $("#window").append(html);
    $("#gameoverlay-pausemenu").css("z-index", 5);

    $("#gameoverlay-pausemenu").css("visibility", "hidden");

    function show() {
        $("#gameoverlay-pausemenu").css("visibility", "visible");
    }

    function hide() {
        $("#gameoverlay-pausemenu").css("visibility", "hidden");
    }

    return {
        show: show,
        hide: hide
    }
}