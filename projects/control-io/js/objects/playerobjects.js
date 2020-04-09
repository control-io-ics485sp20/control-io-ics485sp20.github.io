function PlayerObject(gamewindow, x, y, color) {
    // this.gamewindow = gamewindow;

    this.asset = new paper.Raster('../img/grey.png');
    this.asset.position.x = x;
    this.asset.position.y = y;
    this.asset.scale(0.1);
    gamewindow.layers["players"].addChild(this.asset);

    function rotate_sprite(angle) {
        // console.log(this.asset.rotation);
        this.asset.rotation = angle;
    }

    return {
        rotate_sprite: rotate_sprite,
        asset: this.asset
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
        radius: 8,
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
        this.asset.dashArray = [4, 10]
        gamewindow.layers["playerguidinglines"].addChild(this.asset);
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
        gamewindow.layers["shapes"].addChild(this.asset);

        console.log(Math.abs(this.asset.area));
        // gamewindow.layers["shaperaster"]
    }
}

// class PlayerObject