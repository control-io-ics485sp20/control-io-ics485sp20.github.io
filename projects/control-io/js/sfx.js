// if (!createjs.Sound.initializeDefaultPlugins()) { 
//     console.log("cannot play audio!");
//     return; 
// }

// createjs.Sound.registerSound('../music/in.wav', 'in');
// createjs.Sound.registerSound('../music/countdown_trim.wav', 'countdown_trim');
// createjs.Sound.registerSound('../music/zzz.m4a', 'zzz');
// createjs.Sound.registerSound('../music/dot.wav', 'dot');
// createjs.Sound.registerSound('../music/ingame.wav', 'ingame');
// createjs.Sound.registerSound('../music/smash.m4a', 'smash');
// createjs.Sound.registerSound('../music/endgame.wav', 'endgame');

function SFX() {
    var _this = this;

    _this.audio_in = new Audio('../music/in.wav');
    _this.timer = new Audio('../music/countdown_trim.wav');
    _this.hit_sound = new Audio('../music/zzz.m4a');
    _this.dot_sound = new Audio('../music/dot.wav');
    _this.music_ingame = new Audio('../music/ingame.wav');
    _this.hitsound = new Audio('../music/smash.m4a');
    _this.music_endgame = new Audio('../music/endgame.wav');
    _this.sound = new Audio('../music/claim.wav');
    

    _this.audio_in.preload = 'auto';
    _this.timer.preload = 'auto';
    _this.hit_sound.preload = 'auto';
    _this.dot_sound.preload = 'auto';
    _this.music_ingame.preload = 'auto';
    _this.hitsound.preload = 'auto';
    _this.music_endgame.preload = 'auto';

    _this.hit_sound.volume = 0.4;
    _this.music_ingame.volume = 0.4;
    _this.music_endgame.volume = 0.8;

    return {
        hit_sound: _this.hit_sound,
        dot_sound: _this.dot_sound,
        music_ingame: _this.music_ingame,
        hitsound: _this.hitsound,
        music_endgame: _this.music_endgame,
        audio_in: _this.audio_in,
        timer: _this.timer,
        sound: _this.sound,
    }
}

var SFX = new SFX();