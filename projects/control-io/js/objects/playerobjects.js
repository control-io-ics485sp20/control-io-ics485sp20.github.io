/*
* A coordinate that a player can create.
*/
class PlayerCoordinate {
    constructor (gamewindow, x, y, color) {
        this.x = x;
        this.y = y;

        this.asset = new paper.Path.Circle({
            center: [x, y],
            radius: 8,
            fillColor: color
        });
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

        console.log(this.asset.area);
        // gamewindow.layers["shaperaster"]
    }
}

// class PlayerObject