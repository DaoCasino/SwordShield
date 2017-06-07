
function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.back_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.addChild(this.back_mc);
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	this.createArt();
}

ScrGame.prototype.createArt = function(){
	var rndBg = Math.ceil(Math.random()*3);
	var bg = addObj("bg"+rndBg, _W/2, _H/2);
	this.back_mc.addChild(bg);
}

ScrGame.prototype.resetTimer  = function(){
	// this.timeGetState = TIME_GET_STATE;
}

ScrGame.prototype.update  = function(diffTime){
	if(options_pause){
		return false;
	}
}
