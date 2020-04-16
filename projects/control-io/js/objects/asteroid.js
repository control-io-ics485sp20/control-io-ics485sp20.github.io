/**
 * Asteroid
 *
 * Class that represents an Asteroid
 */

class Asteroid
{
  constructor(game, gamewindow, gamemap, navigator){
    this.game = game;
    this.gamewindow = gamewindow;

    this.navigator = navigator;
    this.randomSpawn();
    this.roamX = this.navigator.randCoOrd();
    this.roamY = this.navigator.randCoOrd();

    this.ray = false;
  }

  spin(){

  }

  roam(){
    let x = this.roamX;
    let y = this.roamY;

    this.asteroidobject.asset.position.y = this.asteroidobject.asset.position.y + y*1.5;
    this.asteroidobject.asset.position.x = this.asteroidobject.asset.position.x + x*1.5;

    if(this.navigator.isOutOfBoundsX(this.asteroidobject.asset.position.x)){
      this.roamX = x = (x < 0) ? (x * -1) : (0 - x);
    }

    if(this.navigator.isOutOfBoundsY(this.asteroidobject.asset.position.x)){
      this.roamY = y = (y < 0) ? (y * -1) : (0 - y);
    }
  }

  randomSpawn() {
    var random_x = Math.floor(((Math.random() * Math.floor(max_x))));
    var random_y = Math.floor(((Math.random() * Math.floor(max_y))));

    this.asteroidobject = new AsteroidObject(this.gamewindow, random_x, random_y);
  }

  updateVisual(x, y, index) {
    if (this.guidingLine != null) {
      if (x != null) {
        this.guidingLine.asset.segments[index].point.x = x;
      }
      if (y != null) {
        this.guidingLine.asset.segments[index].point.y = y;
      }
      this.guidingLine.asset.bringToFront();
    }
  }


}
