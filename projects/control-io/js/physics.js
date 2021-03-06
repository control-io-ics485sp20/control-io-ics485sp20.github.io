/**
 * @description Contains functions which detect and handle collisions between objects.
 * 
 * Based entirely off of this tutorial
 * https://www.youtube.com/watch?v=XYzA_kPWyJ8
 */

/**
 * @name getDistance
 * @description gets the distance between two points
 * @param {*} x1 point 1 x
 * @param {*} y1 point 1 y
 * @param {*} x2 point 2 x
 * @param {*} y2 point 2 y
 */
function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

/**
 * @name checkCircleHit
 * @description checks if two paper.js circles are colliding
 * @param {*} circle1 a paper.js circle 1
 * @param {*} circle2 a paper.js circle 2
 */
function checkCircleHit(circle1, circle2) {
    if (circle1 != null & circle2 != null) {
        if (getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < (circle1.radius + circle2.radius)) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

/**
 * @name checkPathHit
 * @description checks if a paper.js circle and path are colliding
 * @param {*} circle1 a paper.js circle
 * @param {*} path a paper.js path
 */
function checkPathHit(circle1, path) {
    if (circle1 != null & path != null) {
        let nearestPoint = path.getNearestPoint([circle1.x, circle1.y]); 
        if (getDistance(circle1.x, circle1.y, nearestPoint.x, nearestPoint.y) < (circle1.radius)) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}


/**
 * @name rotateVelocities
 * @description based on https://www.youtube.com/watch?v=789weryntzM&t=1024s
 * @param {*} movement 
 * @param {*} angle 
 */
function rotateVelocities(movement, angle) {
    const rotatedVelocities = {
        velX: movement.velX * Math.cos(angle) - movement.velY * Math.sin(angle),
        velY: movement.velX * Math.sin(angle) + movement.velY * Math.cos(angle)
    }
    return rotatedVelocities;
}

/**
 * @name resolveAsteroidToAsteroidCollision
 * @description based on https://www.youtube.com/watch?v=789weryntzM&t=1024s
 * @param {*} object1 
 * @param {*} object2 
 */
function resolveAsteroidToAsteroidCollision(object1, object2) {
    const xVelocityDiff = object1.movement.velX - object2.movement.velX;
    const yVelocityDiff = object1.movement.velY - object2.movement.velY;

    const xDist = object2.assetgroup.position.x - object1.assetgroup.position.x;
    const yDist = object2.assetgroup.position.y - object1.assetgroup.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(yDist, xDist)

        const m1 = object1.mass;
        const m2 = object2.mass;

        const u1 = rotateVelocities(object1.movement, angle);
        const u2 = rotateVelocities(object2.movement, angle);

        const v1 = {
            velX: u1.velX * (m1 - m2) / (m1 + m2) + u2.velX * 2 * m2 / (m1 + m2),
            velY: u1.velY
        }
        const v2 = {
            velX: u2.velX * (m1 - m2) / (m1 + m2) + u1.velX * 2 * m2 / (m1 + m2),
            velY: u2.velY
        }

        const vFinal1 = rotateVelocities(v1, -angle);
        const vFinal2 = rotateVelocities(v2, -angle);

        object1.movement.velX = vFinal1.velX;
        object1.movement.velY = vFinal1.velY;

        object2.movement.velX = vFinal2.velX;
        object2.movement.velY = vFinal2.velY;
    }
}

/**
 * @name resolveAsteroidToShipCollision
 * @description based on https://www.youtube.com/watch?v=789weryntzM&t=1024s
 * @param {*} object1 
 * @param {*} object2 
 */
function resolveAsteroidToShipCollision(object1, object2) {
    const xVelocityDiff = object1.movement.velX - object2.movement.velX;
    const yVelocityDiff = object1.movement.velY - object2.movement.velY;

    const xDist = object2.assetgroup.position.x - object1.assetgroup.position.x;
    const yDist = object2.assetgroup.position.y - object1.assetgroup.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(yDist, xDist)

        const m1 = object1.mass;
        const m2 = object2.mass;

        const u1 = rotateVelocities(object1.movement, angle);
        const u2 = rotateVelocities(object2.movement, angle);

        const v1 = {
            velX: u1.velX * (m1 - m2) / (m1 + m2) + u2.velX * 2 * m2 / (m1 + m2),
            velY: u1.velY
        }
        const v2 = {
            velX: u2.velX * (m1 - m2) / (m1 + m2) + u1.velX * 2 * m2 / (m1 + m2),
            velY: u2.velY
        }

        const vFinal1 = rotateVelocities(v1, -angle);
        const vFinal2 = rotateVelocities(v2, -angle);

        object1.movement.velX = vFinal1.velX;
        object1.movement.velY = vFinal1.velY;

        // object2.velocity.x = vFinal2.x;
        // object2.velocity.y = vFinal2.y;
    }
}

/**
 * @name resolveAsteroidToPolygonCollision
 * @description based on https://www.youtube.com/watch?v=789weryntzM&t=1024s
 * @param {*} object 
 * @param {*} path 
 */
function resolveAsteroidToPolygonCollision(object, path) {
    const xVelocityDiff = object.movement.velX - 0;
    const yVelocityDiff = object.movement.velY - 0;

    let nearestPoint = path.getNearestPoint([object.assetgroup.position.x, object.assetgroup.position.y]); 

    const xDist = nearestPoint.x - object.assetgroup.position.x;
    const yDist = nearestPoint.y - object.assetgroup.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // console.log("bouncing");

        let lines = path.lineObjects;

        let angle = 0;
        for (i in lines) {
            // console.log(lines[i]);
            let n = new paper.Path.Line(lines[i].p1, lines[i].p2);
            if (n.contains(nearestPoint)) {
                angle = Math.atan2(lines[i].p2.y - lines[i].p1.y, lines[i].p2.x - lines[i].p1.x);
                // console.log("contains!");
                // console.log(angle);
            }

        }
        // const angle = -Math.atan2(yDist, xDist)

        const m1 = object.mass;
        // // // const m2 = object2.mass;
        const m2 = 4

        const u1 = rotateVelocities(object.movement, angle);
        const u2 = rotateVelocities({velX: 0, velY: 0}, angle);

        const v1 = {
            x: u1.velX * (m1 - m2) / (m1 + m2) + u2.velX * 2 * m2 / (m1 + m2),
            y: u1.velY
        }

        // const vFinal1 = rotate(v1, -angle);

        // object.movement.velX = vFinal1.x;
        // object.movement.velY = vFinal1.y;
        
        object.movement.velX *= -1;
        object.movement.velY *= -1;

        // object.velocity.x = u1.x;
        // object.velocity.y = u1.y;

        // object.velocity.x = v1.x;
        // object.velocity.y = v1.y;
    }
}