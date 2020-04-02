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

//asteroid
//has hp
function Asteroid(id) {
    GameItem.call(this, id);

    this.health = 0;
    this.damage = 0;
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