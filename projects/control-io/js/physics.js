//https://www.youtube.com/watch?v=XYzA_kPWyJ8
function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function checkHit(circle1, circle2) {
    if (circle1 != null & circle2 != null) {
        if (getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < (circle1.radius + circle2.radius)) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function checkPolygonHit(circle1, path) {
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

//https://www.youtube.com/watch?v=789weryntzM&t=1024s
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    }
    return rotatedVelocities;
}

function resolveAsteroidToAsteroidCollision(object1, object2) {
    const xVelocityDiff = object1.velocity.x - object2.velocity.x;
    const yVelocityDiff = object1.velocity.y - object2.velocity.y;

    const xDist = object2.assetgroup.position.x - object1.assetgroup.position.x;
    const yDist = object2.assetgroup.position.y - object1.assetgroup.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(yDist, xDist)

        const m1 = object1.mass;
        const m2 = object2.mass;

        const u1 = rotate(object1.velocity, angle);
        const u2 = rotate(object2.velocity, angle);

        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        }
        const v2 = {
            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
            y: u2.y
        }

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        object1.velocity.x = vFinal1.x;
        object1.velocity.y = vFinal1.y;

        object2.velocity.x = vFinal2.x;
        object2.velocity.y = vFinal2.y;
    }
}

function resolveAsteroidToShipCollision(object1, object2) {
    const xVelocityDiff = object1.velocity.x - object2.velocity.x;
    const yVelocityDiff = object1.velocity.y - object2.velocity.y;

    const xDist = object2.assetgroup.position.x - object1.assetgroup.position.x;
    const yDist = object2.assetgroup.position.y - object1.assetgroup.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(yDist, xDist)

        const m1 = object1.mass;
        const m2 = object2.mass;

        const u1 = rotate(object1.velocity, angle);
        const u2 = rotate(object2.velocity, angle);

        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        }
        const v2 = {
            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
            y: u2.y
        }

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        object1.velocity.x = vFinal1.x;
        object1.velocity.y = vFinal1.y;

        // object2.velocity.x = vFinal2.x;
        // object2.velocity.y = vFinal2.y;
    }
}

function resolveAsteroidToPolygonCollision(object, path) {
    const xVelocityDiff = object.velocity.x - 0;
    const yVelocityDiff = object.velocity.y - 0;

    let nearestPoint = path.getNearestPoint([object.assetgroup.position.x, object.assetgroup.position.y]); 

    const xDist = nearestPoint.x - object.assetgroup.position.x;
    const yDist = nearestPoint.y - object.assetgroup.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        console.log("bouncing");

        let lines = path.lineObjects;

        let angle = 0;
        for (i in lines) {
            // console.log(lines[i]);
            let n = new paper.Path.Line(lines[i].p1, lines[i].p2);
            if (n.contains(nearestPoint)) {
                angle = Math.atan2(lines[i].p2.y - lines[i].p1.y, lines[i].p2.x - lines[i].p1.x);
                // console.log("contains!");
                console.log(angle);
            }

        }
        // const angle = -Math.atan2(yDist, xDist)

        const m1 = object.mass;
        // // // const m2 = object2.mass;
        const m2 = 4

        const u1 = rotate(object.velocity, angle);
        const u2 = rotate({x: 0, y: 0}, angle);

        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        }

        // const vFinal1 = rotate(v1, -angle);

        // object.velocity.x = vFinal1.x;
        // object.velocity.y = vFinal1.y;
        
        object.velocity.x *= -1;
        object.velocity.y *= -1;

        // object.velocity.x = u1.x;
        // object.velocity.y = u1.y;

        // object.velocity.x = v1.x;
        // object.velocity.y = v1.y;
    }
}