// literally copypasta'd right from https://stackoverflow.com/questions/16134997/how-to-pause-and-resume-a-javascript-timer
function startTimer(seconds, container, oncomplete) {
    var startTime, timer, obj, ms = seconds*1000,
        display = document.getElementById(container);
    obj = {};
    obj.resume = function() {
        startTime = new Date().getTime();
        timer = setInterval(obj.step,250); // adjust this number to affect granularity
                            // lower numbers are more accurate, but more CPU-expensive
    };
    obj.pause = function() {
        ms = obj.step();
        clearInterval(timer);
    };
    obj.step = function() {
        var now = Math.max(0, ms-(new Date().getTime()-startTime));
        var m = Math.floor(now/60000);
        var s = Math.floor(now/1000)%60;
        s = (s < 10 ? "0" : "")+s;
        display.innerHTML = m + ":" + s;
        if( now == 0) {
            clearInterval(timer);
            obj.resume = function() {};
            if( oncomplete) oncomplete();
        }
        return now;
    };
    obj.resume();
    return obj;
}