var _W = 720;
var _H = 1280;
var version = "v. 1.0.0";
var metaCode = "swordshield_v1";
var login_obj = {};

// main
var addressContract = "";
// testrpc
var	addressRpcContract = "";
// testnet
var	addressTestContract = "0xe32db7dbccd6ba6f0ec3250cb802387c084078ea";

var options_mainet = false;
var options_rpc = true;
var options_music = true;
var options_sound = true;
var options_mobile = true;
var options_pause = false;
var options_fullscreen = false;


var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) { return window.setTimeout(callback, 1000 / 60); };
	
function initGame() {
	if(window.orientation == undefined){
		options_mobile = false;
	} else {
		options_mobile = true;
	}
	
	if(typeof console === "undefined"){ console = {}; }
	
    //initialize the stage
   
}

