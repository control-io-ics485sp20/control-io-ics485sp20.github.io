class GameMap {
    constructor (boundaryX, boundaryY){
        this.boundaryX = boundaryX;
        this.boundaryY = boundaryY;

        var visible = false;
        var strokeColor = 'white';

        if (showHitboxes == true) {
            strokeColor = 'white';
            visible = true;
        } else {
            strokeColor = '';
            visible = false;
        }
    }

    GameObjectIsOutOfBounds(x, y) {
        if ((
            x < GameObjectBorderMinX
        ) || (
            x > GameObjectBorderMaxX
        ) || (
            y < GameObjectBorderMinY
        ) || (
            y > GameObjectBorderMaxY
        )){
            return true;
        }
        return false;
    }

    // isOutOfBoundsX(x){
    //     return ((x >= this.boundaryX) || (x <= 0 ));
    // }

    // isOutOfBoundsY(y){
    //     return ((y >= this.boundaryY) || (y <= 0 ));
    // }

    // randCoOrd(){
    //     let x = Math.random() * 2 + 1;
    //     x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    //     return x;
    // }

    // update(boundaryX, boundaryY) {
    //     this.boundaryX;
    //     this.boundaryY;
    // }
}

