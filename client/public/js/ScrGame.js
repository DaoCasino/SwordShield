var obj_game = {};
var api;
var _heroes = ["", "minotaur", "lizard", "druid"];
var _offsetHeroes = [undefined, {x:70, y:0}, {x:45, y:15}, {x:0, y:-10}];
var _callback;
var _mouseX;
var _mouseY;
var _deploy;
var _curSkin = 0;
var _countAttackWin = 0;
var _countAttackMax = 0;
var _countDefenseWin = 0;
var _countDefenseMax = 0;

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
	this.refreshSkin(1);
	
	var btnAttack = addButton2("btnAttack", _W/2-150, 200);
	this.face_mc.addChild(btnAttack);
	this._arButtons.push(btnAttack);
	var btnDefense = addButton2("btnDefense", _W/2+150, 200);
	this.face_mc.addChild(btnDefense);
	this._arButtons.push(btnDefense);
	var btnBattle = addButton2("btnBattle", _W/2, 350);
	this.face_mc.addChild(btnBattle);
	this._arButtons.push(btnBattle);
	var icoMinotaur = addButton2("ico_minotaur", _W/2-200, 1000);
	this.face_mc.addChild(icoMinotaur);
	this._arButtons.push(icoMinotaur);
	var icoLizard = addButton2("ico_lizard", _W/2, 1000);
	this.face_mc.addChild(icoLizard);
	this._arButtons.push(icoLizard);
	var icoDruid = addButton2("ico_druid", _W/2+200, 1000);
	this.face_mc.addChild(icoDruid);
	this._arButtons.push(icoDruid);
	
	this.btnBattle = btnBattle;
	
	btnAttack.overSc = true;
	btnDefense.overSc = true;
	btnBattle.overSc = true;
	icoMinotaur.overSc = true;
	icoLizard.overSc = true;
	icoDruid.overSc = true;
}

ScrGame.prototype.createText = function(){
	var str = "Select unit";
	var tfSelect = addText(str, 40, "#000000", undefined, "center", 400)
	tfSelect.x = _W/2;
	tfSelect.y = _H/2+250;
	this.face_mc.addChild(tfSelect);
	var tfCountAttack = addText("0/0", 30, "#000000", undefined, "center", 400)
	tfCountAttack.x = _W/2-150;
	tfCountAttack.y = 300;
	this.face_mc.addChild(tfCountAttack);
	var tfPrcntAttack = addText("(0%)", 30, "#000000", undefined, "center", 400)
	tfPrcntAttack.x = _W/2-150;
	tfPrcntAttack.y = 350;
	this.face_mc.addChild(tfPrcntAttack);
	var tfCountDefense = addText("0/0", 30, "#000000", undefined, "center", 400)
	tfCountDefense.x = _W/2+150;
	tfCountDefense.y = 300;
	this.face_mc.addChild(tfCountDefense);
	var tfPrcntDefense = addText("(0%)", 30, "#000000", undefined, "center", 400)
	tfPrcntDefense.x = _W/2+150;
	tfPrcntDefense.y = 350;
	this.face_mc.addChild(tfPrcntDefense);
	
	this.tfCountAttack = tfCountAttack;
	this.tfPrcntAttack = tfPrcntAttack;
	this.tfCountDefense = tfCountDefense;
	this.tfPrcntDefense = tfPrcntDefense;
}

ScrGame.prototype.refreshText = function(){
	var strAttack = _countAttackWin + "/" + _countAttackMax;
	var prcntAttack = "("+Math.ceil((_countAttackWin/_countAttackMax)*100)+"%)";
	var strAttack = _countDefenseWin + "/" + _countDefenseMax;
	var prcntAttack = "("+Math.ceil((_countDefenseWin/_countDefenseMax)*100)+"%)";
	this.tfCountAttack.setText(strAttack);
	this.tfPrcntAttack.setText(prcntAttack);
	this.tfCountDefense.setText(strAttack);
	this.tfPrcntDefense.setText(prcntAttack);
}

ScrGame.prototype.refreshSkin = function(value){
	if(_curSkin == value){
		return false;
	}
	_curSkin = value;
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
		this.btnBattle.visible = true;
	} else if(item_mc.name == "btnDefense"){
		this.btnBattle.visible = false;
		api.defense(_curSkin);
	} else if(item_mc.name == "btnBattle"){
		api.battle(_curSkin);
	} else if(item_mc.name == "ico_minotaur"){
		this.refreshSkin(1);
	} else if(item_mc.name == "ico_lizard"){
		this.refreshSkin(2);
	} else if(item_mc.name == "ico_druid"){
		this.refreshSkin(3);
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