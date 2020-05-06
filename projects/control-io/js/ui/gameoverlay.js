function GameOverlay() {
    var _this = this

    function init() {
        var html = `<div id="gameoverlay-scorescreen"></div>`
        $("#window").append(html);

        for (i in game.players) {
            var playerdiv = `
            <div class="gameoverlay-playerdiv" id="` + game.players[i].id + `-scorebar">` + game.players[i].name + `</div>
            `

            $("#gameoverlay-scorescreen").append(playerdiv);

            // $("#" + game.players[i].id + "-playerdiv").css("background", `linear-gradient(90deg, #FFC0CB 50%, ` + game.players[i].color.normal + ` 50%)`);

            $("#" + game.players[i].id + "-scorebar").css("width", "100%");
            $("#" + game.players[i].id + "-scorebar").css("background-color", game.players[i].color.normal);
            // console.log(game.players[i].id);
            console.log(game.players[i].id);
            console.log(game.players[i].color);
        }

        var html1 = `<div id="timer"></div>`
        $("#window").append(html1);

        var seconds=60;
        var timer;

        function myFunction() {
          if(seconds < 60) {
            document.getElementById("timer").innerHTML = seconds;
          }
          if (seconds >0 ) {
            seconds--;
          } else {
            clearInterval(timer);
            alert("Time Out");
          }
        }

        if(!timer) {
          timer = window.setInterval(function() {
            myFunction();
          }, 1000);
        }

      //When a key is pressed in the text area, update the timer using myFunction

      //If seconds are equal or greater than 0, countdown until 1 minute has passed
      //Else, clear the timer and alert user of how many words they type per minute

      document.getElementById("timer").innerHTML="1:00";
    }

    function show() {
        $("#gameoverlay-scorescreen").css("visibility", "visible");
    }

    function hide() {
        $("#gameoverlay-scorescreen").css("visibility", "hidden");
    }

    function update(scoreobj) {
        let scoreobjlist = []

        for (i in scoreobj) {
            let obj = scoreobj[i];
            obj.id = i;
            scoreobjlist.push(obj);
        }

        scoreobjlist.sort((a, b) => (a.score < b.score) ? 1 : -1);

        if (scoreobjlist[0] != undefined) {
            $("#gameoverlay-scorescreen").html("");

            let topscore = (scoreobjlist[0].score);

            for(j in scoreobjlist) {
                let percentage = (Math.floor((scoreobjlist[j].score/topscore) * 100)).toString() + "%";

                let playerdiv = `<div class="gameoverlay-playerdiv" id="` + scoreobjlist[j].id + `-scorebar">` + scoreobjlist[j].name + `</div>`
                $("#gameoverlay-scorescreen").append(playerdiv);
                $("#" + scoreobjlist[j].id + "-scorebar").css("width", percentage);
                $("#" + scoreobjlist[j].id + "-scorebar").css("background-color", scoreobjlist[j].color);

            }
        }
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
    var html = `<div class="pausemenu" id="gameoverlay-pausemenu">
    <div id=""></div>
    <div class="gameoverlay-pausemenu-button" id="website-link">WEBSITE</div>
    <div class="gameoverlay-pausemenu-button" id="github-link">GITHUB</div>
    <div class="gameoverlay-pausemenu-button" id="lobby-link">LOBBY</div>
    </div>`
    $("#window").append(html);
    $("#gameoverlay-pausemenu").css("z-index", 5);

    $("#gameoverlay-pausemenu").css("visibility", "hidden");

    function show() {
        console.log("Pausing!");
        $("#gameoverlay-pausemenu").css("visibility", "visible");
    }

    function hide() {
        console.log("Resuming!");
        $("#gameoverlay-pausemenu").css("visibility", "hidden");
    }

    return {
        show: show,
        hide: hide
    }
}

function GameOverlayEndMenu() {
    var _this = this
    var html = `<div id="gameoverlay-endmenu">
    <div id=""></div>
    <div id="website"></div>
    <div id=""></div>
    </div>`
    $("#window").append(html);
    $("#gameoverlay-pausemenu").css("z-index", 5);

    $("#gameoverlay-pausemenu").css("visibility", "hidden");

    function show() {
        console.log("Pausing!");
        $("#gameoverlay-pausemenu").css("visibility", "visible");
    }

    function hide() {
        console.log("Resuming!");
        $("#gameoverlay-pausemenu").css("visibility", "hidden");
    }

    return {
        show: show,
        hide: hide
    }
}
