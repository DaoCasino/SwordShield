var obj_game = {};
var api;
var _heroes = ["", "minotaur", "lizard", "druid"];
var _offsetHeroes = [undefined, {x:70, y:0}, {x:45, y:15}, {x:0, y:-10}];
var _callback;
var _mouseX;
var _mouseY;
var _deploy;
var _curSkin = 1;

function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	obj_game["game"] = this;
	api = new API(this);
	
	this.bWindow = false;
	
	this._arButtons = [];
	_callback = this.response;
	
	this.createArt();
	this.createText();
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
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
	shadow.alpha = 0.3;
	shadow.scale.y = 0.5;
	shadow.y = 150;
	this.hero.addChild(shadow);
	this.refreshSkin(_curSkin);
	
	var btnAttack = addButton2("btnAttack", _W/2-150, 300);
	this.face_mc.addChild(btnAttack);
	this._arButtons.push(btnAttack);
	var btnDefense = addButton2("btnDefense", _W/2+150, 300);
	this.face_mc.addChild(btnDefense);
	this._arButtons.push(btnDefense);
	
	btnAttack.overSc = true;
	btnDefense.overSc = true;
}

ScrGame.prototype.createText = function(){
	var str = "Select unit";
	var tfSelect = addText(str, 40, "#000000", undefined, "center", 400)
	tfSelect.x = _W/2;
	tfSelect.y = _H/2+250;
	this.face_mc.addChild(tfSelect);
}

ScrGame.prototype.refreshSkin = function(value){
	var skin = this.hero.skin;
	if(skin){
		this.hero.removeChild(skin);
	}
	var name = _heroes[value];
	var ofs = _offsetHeroes[value];
	var skin = addObj(name, ofs.x, ofs.y);
	this.hero.addChild(skin);
	this.hero.skin = skin;
}

ScrGame.prototype.response = function(command, value, error) {
	var prnt = obj_game["game"];
	
	if(value == undefined || error || options_debug){
		if(command == "sendRaw" || command == "gameTxHash"){
			if(error){
				// OUT OF GAS - error client (wrong arguments from the client)
				// invalid JUMP - throw contract
				console.log("response:", error);
				// prnt.showError(error.message);
			} else {
				// prnt.showError(ERROR_CONTRACT);
			}
			// prnt.bWait = false;
		}
		return false;
	}
	
	if(command == "getGameState"){
		
	} else if(command == "battle" ||
			command == "confirm"){
		prnt.responseTransaction(command, value);
	} else if(command == "responseServer"){
		prnt.sendSeed(value);
	} else if(command == "sendRaw"){
		// prnt.timeWaitResponse = 0;
	}
}

ScrGame.prototype.resetTimer = function(){
	// this.timeGetState = TIME_GET_STATE;
}

ScrGame.prototype.update = function(diffTime){
	if(options_pause){
		return false;
	}
}

ScrGame.prototype.clickCell = function(item_mc) {
	var name = item_mc.name;
	if(item_mc.name.search("btn") != -1){
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	if(item_mc.overSc){
		item_mc.scale.x = 1*item_mc.sc;
		item_mc.scale.y = 1*item_mc.sc;
	}
	
	if(item_mc.name == "btnAttack"){
		api.battle(_curSkin);
	} else if(item_mc.name == "btnDefense"){
		api.defense(_curSkin);
	}
}

ScrGame.prototype.checkButtons = function(evt){
	_mouseX = evt.data.global.x;
	_mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, _mouseX, _mouseY) &&
		item_mc.visible && item_mc.dead != true){
			if(item_mc.disabled != true && item_mc.alpha == 1){
				if(item_mc._selected == false){
					item_mc._selected = true;
					if(item_mc.over){
						item_mc.over.visible = true;
					} else if(item_mc.overSc){
						item_mc.scale.x = 1.1*item_mc.sc;
						item_mc.scale.y = 1.1*item_mc.sc;
					}
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else if(item_mc.overSc){
					item_mc.scale.x = 1*item_mc.sc;
					item_mc.scale.y = 1*item_mc.sc;
				}
			}
		}
	}
}

ScrGame.prototype.touchHandler = function(evt){
	if(this.bWindow){
		return false;
	}
	var phase = evt.type;
	
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		for (var i = 0; i < this._arButtons.length; i++) {
			var item_mc = this._arButtons[i];
			if(item_mc._selected){
				this.clickCell(item_mc);
				return;
			}
		}
	}
}

ScrGame.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}