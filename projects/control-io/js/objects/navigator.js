/**
 * Navigator
 *
 * Class that represents a Navigator
 */

class Navigator {
  constructor(boundryX, boundryY){
    this.boundryX = boundryX;
    this.boundryY = boundryY;
  }

  isOutOfBoundsX(x){
    return ((x >= this.boundryX) || (x <= 0 ));
  }

  isOutOfBoundsY(y){
    return ((y >= this.boundryY) || (y <= 0 ));
  }

  randCoOrd(){
    let x = Math.random() * 2 + 1;
    return x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  }

  update(boundryX, boundryY) {
    this.boundryX;
    this.boundryY;
  }
}
