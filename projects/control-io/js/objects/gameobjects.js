/**
 * Asteroid
 *
 * Class that represents an Asteroid
 */

function Asteroid () {
    // var gamemap;

    function init (game, gamewindow, gameMap){
        this.game = game;
        this.gamewindow = gamewindow;
        this.gamemap = gameMap;

        //set random size
        this.sizemodifier = (Math.random() * (AsteroidMaxSize - AsteroidMinSize) + AsteroidMinSize);
        //set random velocity
        this.velocitymodifier = (Math.random() * (AsteroidMaxSpeed - AsteroidMinSpeed) + AsteroidMinSpeed);
        //set random spin speed
        this.spinmodifier = (Math.random() * (AsteroidMaxSpinSpeed - AsteroidMinSpinSpeed) + AsteroidMinSpinSpeed);
        //set random spin direction
        if (AsteroidAllowNoSpin) { //if spindirection includes 0
            this.spindirection = ((Math.floor(Math.random() * 2)) * ((Math.floor(Math.random() * 2)) == 1 ? 1 : -1));
        } else { //if spindirection excludes 0
            this.spindirection = ((Math.floor(Math.random() * 2)) == 1 ? 1 : -1); 
        }

        this.assetgroup = new paper.Group();
        this.assetgroup.applyMatrix = false;

        this.spritescaling = 0.11 * this.sizemodifier;
        this.sprite = new paper.Raster({
            source: '../img/sprites/asteroid-min.png',
            position: [0, 0],
            scaling: this.spritescaling,
            applyMatrix: false
        });

        this.hitboxscaling = 11 * this.sizemodifier;
        this.hitbox = new paper.Path.Circle({
            radius: this.hitboxscaling,
            applyMatrix: false
        });
        if (showHitboxes == true) {
            this.hitbox.strokeColor = AsteroidHitboxColor;
        } else {
            this.hitbox.visible = false;
        }

        this.assetgroup.addChild(this.sprite);
        this.assetgroup.addChild(this.hitbox);

        gamewindow.layers["asteroids"].addChild(this.assetgroup);

        var roamParams = spawn(this.assetgroup);
        this.roamX = roamParams.roamX;
        this.roamY = roamParams.roamY;
    }

    function spawn(assetgroup) {
        var x;
        var y;
        var roamX;
        var roamY;
        //TODO spawn at edge
        var xyspawn = (Math.floor(Math.random() * 4));
        if (xyspawn == 0) { //spawn top side
            x = Math.floor((Math.random() * Math.floor(AsteroidMaxX)));
            y = AsteroidMinY;

            roamX = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
            roamY = ((Math.random() * 1) * (1));
        } else if (xyspawn == 1) { //spawn bottom side
            x = Math.floor((Math.random() * Math.floor(AsteroidMaxX)));
            y = AsteroidMaxY;

            roamX = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
            roamY = ((Math.random() * 1) * (-1));
        } else if (xyspawn == 2) { //spawn left side
            x = AsteroidMinX;
            y = Math.floor((Math.random() * Math.floor(AsteroidMaxY)));

            roamX = ((Math.random() * 1) * (1));
            roamY = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
        } else if (xyspawn == 3) { //spawn right side
            x = AsteroidMaxX;
            y = Math.floor((Math.random() * Math.floor(AsteroidMaxY)));

            roamX = ((Math.random() * 1) * (-1));
            roamY = ((Math.random() * 1) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
        }

        assetgroup.position = [x, y];
        return {roamX: roamX, roamY: roamY};
    }

    function updatePos() {
        if (this.assetgroup) {
            let newx = this.assetgroup.position.x + this.roamX * this.velocitymodifier;
            let newy = this.assetgroup.position.y + this.roamY * this.velocitymodifier;

            // if (!this.hitbox.intersects(this.gamemap.AsteroidBounds)) {
            if (this.gamemap.AsteroidIsOutOfBounds(newx, newy)) {

                console.log("Asteroid left play area!");
                remove(this.hitbox, this.sprite, this.assetgroup);
                delete this.hitbox;
                delete this.sprite;
                delete this.assetgroup;
            } else {
                this.assetgroup.position.x = newx;
                this.assetgroup.position.y = newy;

                this.assetgroup.rotate(this.spindirection * this.spinmodifier);
            }

            // var asthitbox = this.hitbox;
            // Object.keys(players).forEach(function (id) {
            //     if (players[id].playerobject.hitbox.intersects(asthitbox)) {
            //         console.log("collided!");

            //     }
            // });

            return true;
        } else {
            return false;
        }
        
        //move
        // this.assetgroup.position.y = this.assetgroup.position.y + y * this.velocitymodifier;
        // this.assetgroup.position.x = this.assetgroup.position.x + x * this.velocitymodifier;

        //either reflect asteroids, or destroy asteroids

        // //if out of bounds
        // if(this.gamemap.isOutOfBoundsX(this.assetgroup.position.x)){
        //     this.roamX = x = (x < 0) ? (x * -1) : (0 - x);
        // }

        // //if out of bounds
        // if(this.gamemap.isOutOfBoundsY(this.assetgroup.position.x)){
        //     this.roamY = y = (y < 0) ? (y * -1) : (0 - y);
        // }
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
        init: init,
        updatePos: updatePos,
        spawn: spawn,
        // isOutOfBounds: isOutOfBounds,
        assetgroup: this.assetgroup,
        gamemap: this.gamemap,
        hitbox: this.hitbox
    }
}

//gameitem
//base object
// function GameItem(id) {
//     this.id = id;
//     this.position.x = 0;
//     this.position.y = 0;

//     this.image = "";
// }

// //ship
// //controlled by player or ai
// //has hp
// function Ship(id) {
//     GameItem.call(this, id);

//     //these are ideas. Not sure if our ships will use these statistics.
//     this.health = 0;
//     this.deployables = 0;
//     this.fuel = 0;   //might not need fuel. 
// }

// //asteroid
// //has hp
// function Asteroid(id) {
//     GameItem.call(this, id);

//     this.health = 0;
//     this.damage = 0;
// }

// //space station
// //capturable
// //has hp
// function Station(id) {
//     GameItem.call(this, id);

//     // this.health = 0;
//     this.status = "unclaimed";
//     this.owner = null;
// }

// //planet
// //capturable
// function Planet() {
//     GameItem.call(this, id);
// }