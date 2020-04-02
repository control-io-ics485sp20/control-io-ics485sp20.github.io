class GameWindow {

    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera( zoom_percent, max_x / max_y, 1, 1000 );
        // var camera = new THREE.OrthographicCamera( max_x / - 2, max_x / 2, max_y / 2, max_y / - 2, max_x, max_y );
        this.camera.position.z = 5;
    
        this.renderer.setSize( max_x, max_y );
        $('#window').append(this.renderer.domElement);

        //move to canvas, for later
        // this.canvas = document.createElement("canvas");
        // this.canvas.style.width="100%";
        // this.canvas.style.height="100%";
        // // this.canvas.fillStyle = "green";

        // var ctx = this.canvas.getContext("2d");
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, max_x, max_y);


        // $('#window').append(this.canvas);

    }

    

    //adds item to body. Probably belongs in render library.
}
