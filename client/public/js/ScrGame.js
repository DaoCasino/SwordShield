
function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

var heroes = ["", "minotaur", "lizard", "druid"];
var offsetHeroes = [undefined, {x:70, y:0}, {x:45, y:15}, {x:0, y:-10}];

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	this.createArt();
}

ScrGame.prototype.createArt = function(){
	this.hero = new PIXI.Container();
	this.hero.x = _W/2;
	this.hero.y = _H/2;
	this.game_mc.addChild(this.hero);
	var shadow = new PIXI.Graphics();
	shadow.beginFill(0x000000)
	shadow.drawCircle(0, 0, 100);
	shadow.endFill(); 
	shadow.alpha = 0.5;
	shadow.scale.y = 0.5;
	shadow.y = 150;
	this.hero.addChild(shadow);
	this.refreshSkin(3);
}

ScrGame.prototype.refreshSkin = function(value){
	var skin = this.hero.skin;
	if(skin){
		this.hero.removeChild(skin);
	}
	var name = heroes[value];
	var ofs = offsetHeroes[value];
	var skin = addObj(name, ofs.x, ofs.y);
	this.hero.addChild(skin);
	this.hero.skin = skin;
}

ScrGame.prototype.resetTimer = function(){
	// this.timeGetState = TIME_GET_STATE;
}

ScrGame.prototype.update = function(diffTime){
	if(options_pause){
		return false;
	}
}
