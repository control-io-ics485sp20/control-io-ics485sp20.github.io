function PlayerObject() {

    function init(gamewindow, x, y, color) {
        this.assetgroup = new paper.Group();
        this.assetgroup.applyMatrix = false;

        this.assetgroup.position = [x, y];

        this.playerspritepath = ("../img/sprites/playersprite01-" + color.replace("#", "") + ".png");
        
        this.spritegroup = new paper.Raster({
            source: this.playerspritepath,
            point: [0, 0],
            scaling: 0.08,
            applyMatrix: false,
            width: this.width,
            height: this.height
        });

        this.assetgroup.addChild(this.spritegroup);

        gamewindow.layers["players"].addChild(this.assetgroup);

        this.item = new paper.Item();
        console.log(this.assetgroup.position);
    }

    function rotate(angle) {
        this.spritegroup.rotation = angle;
    }

    function move(xpos, ypos) {
        this.assetgroup.position.x = xpos;
        this.assetgroup.position.y = ypos;
    }

    function point() {
        return this.assetgroup.position;
    }

    return {
        init: init,
        rotate: rotate,
        move: move,
        point: point,
        assetgroup: this.assetgroup
    }
}

/*
 * A coordinate that a player can create.
 */
function PlayerCoordinate(gamewindow, x, y, color) {
    // constructor (gamewindow, x, y, color) {
    this.x = x;
    this.y = y;

    this.asset = new paper.Path.Circle({
        center: [x, y],
        radius: 6,
        fillColor: color
    });

    gamewindow.layers["playersetlines"].addChild(this.asset);
    // }

    return {
        x: this.x,
        y: this.y,
        asset: this.asset
    }
}

/*
* A line joining two coordinates.
*/
class PlayerCoordinateLine {
    constructor (gamewindow, x1, y1, x2, y2, color) {

        this.asset = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
        this.asset.strokeColor = color;
        this.asset.strokeWidth = lineWidth;
        this.asset.strokeCap = 'round';
        gamewindow.layers["playersetlines"].addChild(this.asset);
    }
}

/*
 * A guiding line that follows the player, showing where the next face of their polygon will be.
 */
class PlayerGuidingLine {
    constructor (gamewindow, x1, y1, x2, y2, color) {

        this.asset = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
        this.asset.strokeColor = color;
        this.asset.strokeWidth = lineWidth;
        this.asset.strokeCap = 'round';
        // this.asset.dashArray = [4, 10]
        gamewindow.layers["playerguidinglines"].addChild(this.asset);
    }
}

class PlayerCompletingLine {
    constructor () {

    }
}

/*
 * A polygon that a 
 */
class PlayerPolygon {
    constructor (gamewindow, coordsArray, color) {

        this.asset = new paper.Path();
        var i = 0;
        while (i < coordsArray.length) {
            // this.polygonShape.lineTo(coordsArray[i].x, coordsArray[i].y);
            this.asset.add(new paper.Point(coordsArray[i].x, coordsArray[i].y));
            i++;
        }
        this.asset.closed = true;
        this.asset.fillColor = color;
        this.asset.opacity = 0.5;
        gamewindow.layers["shapes"].addChild(this.asset);

        if (debug) {
            console.log("playerobjects.js.PlayerPolygon.constructor");
            console.log("   area: " + (Math.abs(this.asset.area)/100));
        }
        // gamewindow.layers["shaperaster"]
    }
}