/*
    * A coordinate that a player can create.
    */
   class PlayerCoordinate {
    constructor (gamewindow, x, y, color) {

        this.x = x;
        this.y = y;

        this.geometry = new THREE.CircleGeometry(player_radius, 32);
        this.material = new THREE.MeshBasicMaterial({
            color: color
        });
        this.coordObject = new THREE.Mesh(this.geometry, this.material);

        this.coordObject.position.x = this.x;
        this.coordObject.position.y = this.y;

        gamewindow.scene.add(this.coordObject);
    }
}

/*
    * A line joining two coordinates.
    */
class PlayerCoordinateLine {
    constructor (gamewindow, x1, y1, x2, y2, color) {
        this.material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 3
        });

        this.geometry = new THREE.Geometry();

        this.geometry.vertices.push(
            new THREE.Vector3(x1, y1, 0),
            new THREE.Vector3(x2, y2, 0)
        );

        this.coordLineObject = new THREE.Line(this.geometry, this.material);
        gamewindow.scene.add(this.coordLineObject);
    }
}

/*
 * A guiding line that follows the player, showing where the next face of their polygon will be.
 */
class PlayerGuidingLine {
    constructor (gamewindow, x1, y1, x2, y2, color) {
        this.material = new THREE.LineDashedMaterial({
            color: color,
            linewidth: 3,
            scale: 1,
            dashSize: .04,
            gapSize: 2
        });

        this.geometry = new THREE.Geometry();

        this.geometry.vertices.push(
            new THREE.Vector3(x1, y1, 0),
            new THREE.Vector3(x2, y2, 0)
        );

        this.guidingLineObject = new THREE.Line(this.geometry, this.material);
        gamewindow.scene.add(this.guidingLineObject);
    }
}

/*
 * A polygon that a 
 */
class PlayerPolygon {
    constructor (gamewindow, coordsArray, color) {

        this.material = new THREE.MeshBasicMaterial({
            color: color
        });

        this.extrudeSettings = { 
            amount: 1, 
            bevelEnabled: false, 
            bevelSegments: 2, 
            steps: 2, 
            bevelSize: 1, 
            bevelThickness: 1 
        };

        this.polygonShape = new THREE.Shape();

        this.polygonShape.moveTo(coordsArray[0].x, coordsArray[0].y);
        var i = 1;
        while (i < coordsArray.length) {
            this.polygonShape.lineTo(coordsArray[i].x, coordsArray[i].y);
            i++;
        }
        //this.polygonShape.lineTo(coordsArray[0].x, coordsArray[0].y);

        this.geometry = new THREE.ShapeGeometry(this.polygonShape, this.extrudeSettings);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        console.log(this.polygonShape.area);

        gamewindow.scene.add(this.mesh);
    }
}