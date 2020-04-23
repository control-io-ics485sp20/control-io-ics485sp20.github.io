//https://www.youtube.com/watch?v=XYzA_kPWyJ8
function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function checkHit(circle1, circle2) {
    if (circle1 != null & circle2 != null) {
        // console.log("checking hit!");
        // console.log(getDistance(circle1.position.x, circle1.position.y, circle2.position.x, circle2.position.y));
        // console.log(circle1);
        // console.log(circle2);
        // console.log((circle1.radius + circle2.radius));
        if (getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < (circle1.radius + circle2.radius)) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}