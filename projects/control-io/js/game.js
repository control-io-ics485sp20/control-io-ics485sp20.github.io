function Game() {
    console.log("[Control.IO] Starting game instance...");
    init();

    var gamewindow;

    // constructor() {

    //     this.init();
    // }

    /**
     * init
     *
     * Initializes the game.
     */
    function init() {
        //if singleplayer selected
        runSinglePlayer();

        //if multiplayer selected
        //totally optional
    };

    function runSinglePlayer() {
        console.log("Starting a local session...")
        //start lobby
        //start game countdown
        //start game
        //create start game timer
        gamewindow = new GameWindow();

        initMap();

        addPlayers();

        runAnimation(this);
        //end game screen
    }

    function runMultiPlayer() {
        console.log("Joining a multiplayer session...");
    }

    function initMap() {
        console.log("Initializing map...")
        var map = new GameMap({width: window.innerWidth, height: window.innerHeight});
    
        // var img = new SimpleImage(200,200);
        // print(img);
    
        // for (var pixel of img.values()) {
        //     pixel.setRed(255);
        //     pixel.setGreen(255);
        //     pixel.setBlue(0);
        // }
        // print(img);
    }            

    /**
     * addPlayers
     *
     * Adds players to the game
     */
    function addPlayers() {
        players.push(new Player(gamewindow, "#4d88d5", "Player 1", {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", abutton: "KeyZ", bbutton: "ShiftLeft"}));
        players.push(new Player(gamewindow, "#ff0000", "Player 2", {up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD"}));
        players.push(new Player(gamewindow, "#009933", "Player 3", {up: "KeyI", down: "KeyK", left: "KeyJ", right: "KeyL", abutton: "KeyY", bbutton: "KeyU"}));
        players.push(new Player(gamewindow, "#ffff00", "Player 4", {up: "KeyG", down: "KeyB", left: "KeyV", right: "KeyN"}));
        
        players.forEach(function (player) {
            gamewindow.scene.add(player.getPlayerObject());
        });
    }

    function updatePos() {
        players.forEach(function (player) {
            player.updatePos();
        });
    }

    /**
     * runAnimation
     *
     * Starts the animation sequence. Methods within are called on each frame.
     */
    function runAnimation() {
        requestAnimationFrame(runAnimation);

        updatePos();

        gamewindow.renderer.render(gamewindow.scene, gamewindow.camera);
    }
}

console.log("[Control.IO] Loaded game module.")
