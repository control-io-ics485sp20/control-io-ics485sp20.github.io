// literally copypasta'd right from https://stackoverflow.com/questions/16134997/how-to-pause-and-resume-a-javascript-_this.timer
function startTimer(seconds, container, oncomplete) {
    var _this = this;
    _this.startTime;
    _this.timer; 
    _this.obj;
    _this.ms = seconds*1000;
    if (container != undefined && container != null) {
        _this.display = document.getElementById(container);
    }
    _this.obj = {};

    _this.obj.resume = function() {
        _this.startTime = new Date().getTime();
        _this.timer = setInterval(_this.obj.step,250); // adjust this number to affect granularity
                            // lower numbers are more accurate, but more CPU-expensive
    };
    
    _this.obj.pause = function() {
        _this.ms = _this.obj.step();
        clearInterval(_this.timer);
    };
    
    _this.obj.step = function() {
        var now = Math.max(0,_this.ms-(new Date().getTime()-_this.startTime));
        var m = Math.floor(now/60000), s = Math.floor(now/1000)%60;
        var s = (s < 10 ? "0" : "")+s;
            
        if (_this.display) {
            _this.display.innerHTML = m+":"+s;
        }
        if( now == 0) {
            clearInterval(_this.timer);
            _this.obj.resume = function() {};
            if( oncomplete) oncomplete();
        }
        return now;
    };
    
    _this.obj.resume();
    
    return _this.obj;
}