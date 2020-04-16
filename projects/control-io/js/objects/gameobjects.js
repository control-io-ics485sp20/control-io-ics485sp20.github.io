//gameitem
//base object
function GameItem(id) {
    this.id = id;
    this.position.x = 0;
    this.position.y = 0;

    this.image = "";
}

//ship
//controlled by player or ai
//has hp
function Ship(id) {
    GameItem.call(this, id);

    //these are ideas. Not sure if our ships will use these statistics.
    this.health = 0;
    this.deployables = 0;
    this.fuel = 0;   //might not need fuel.
}


//space station
//capturable
//has hp
function Station(id) {
    GameItem.call(this, id);

    // this.health = 0;
    this.status = "unclaimed";
    this.owner = null;
}

//planet
//capturable
function Planet() {
    GameItem.call(this, id);
}

function AsteroidObject(gamewindow, x, y) {
  // this.gamewindow = gamewindow;

  paper.Raster.prototype.rescale = function(width, height) {
    this.scale(width, height);
  };

  this.asset = new paper.Raster('../img/asteroid.png');
  this.asset.rescale(0.6, 0.6);
  this.asset.position.x = x;
  this.asset.position.y = y;
  this.asset.scale(0.1);
  gamewindow.layers["asteroids"].addChild(this.asset);

  return {
    asset: this.asset
  }
}
