var C_CREATE_USER = "4e832026";
var C_BATTLE = "aa5f4c08";
var C_CONFIRM = "56ca39b5";

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
var _this;

function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.user_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();

	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.user_mc);
	this.addChild(this.face_mc);

	_this = this;

	this.bWindow = false;

	this._arButtons = [];
	_callback = this.response;

	var tfWait = addText("WAIT...", 50, "#000000", undefined, "center", 400)
	tfWait.x = _W/2;
	tfWait.y = 900 - tfWait.height/2;
	tfWait.visible = false;
	this.face_mc.addChild(tfWait);
	this.tfWait = tfWait;

	this.createHero();

	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.createHero = function(){
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
	shadow.visible = false;
	this.hero.addChild(shadow);
	this.shadow = shadow;

	var posY = 300;
	var str = "Select unit";
	var tfSelect = addText(str, 50, "#FFFFFF", "#000000", "center", 400, 4)
	tfSelect.x = _W/2;
	tfSelect.y = 150;
	this.user_mc.addChild(tfSelect);

	var icoMinotaur = addButton2("ico_minotaur", _W/2-200, posY);
	this.user_mc.addChild(icoMinotaur);
	this._arButtons.push(icoMinotaur);
	var icoLizard = addButton2("ico_lizard", _W/2, posY);
	this.user_mc.addChild(icoLizard);
	this._arButtons.push(icoLizard);
	var icoDruid = addButton2("ico_druid", _W/2+200, posY);
	this.user_mc.addChild(icoDruid);
	this._arButtons.push(icoDruid);
	var btnReady = addButton2("bntText", _W/2, 1000);
	btnReady.name = "btnReady";
	btnReady.visible = false;
	this.user_mc.addChild(btnReady);
	this._arButtons.push(btnReady);
	icoMinotaur.overSc = true;
	icoLizard.overSc = true;
	icoDruid.overSc = true;
	btnReady.overSc = true;

	var tfReady = addText("READY", 50, "#000000", undefined, "center", 150)
	tfReady.x = 0;
	tfReady.y = -tfReady.height/2;
	btnReady.addChild(tfReady);

	this.btnReady = btnReady;
}

ScrGame.prototype.createArt = function(){
	var btnAttack = addObj("btnAttack", _W/2-150, 200);
	this.face_mc.addChild(btnAttack);
	var btnDefense = addObj("btnDefense", _W/2+150, 200);
	this.face_mc.addChild(btnDefense);
	var btnBattle = addButton2("btnBattle", _W/2, 350);
	this.face_mc.addChild(btnBattle);
	this._arButtons.push(btnBattle);
	var tfCountAttack = addText("0/0", 30, "#000000", undefined, "center", 400)
	tfCountAttack.x = _W/2-150;
	tfCountAttack.y = 300;
	this.face_mc.addChild(tfCountAttack);

	btnBattle.overSc = true;
}

ScrGame.prototype.createText = function(){
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
	this.shadow.visible = true;
	this.btnReady.visible = true;
	var name = _heroes[value];
	var ofs = _offsetHeroes[value];
	var skin = addObj(name, ofs.x, ofs.y);
	this.hero.addChild(skin);
	this.hero.skin = skin;
}

ScrGame.prototype.createUser = function(){
	console.log("createUser");
	this.user_mc.visible = false;
	this.tfWait.visible = true;

	Game.createUser( _curSkin, function(data){
		_this.tfWait.visible = false;
		_this.createArt();
		_this.createText();
	})
}

ScrGame.prototype.battle = function(){
	console.log("battle:");
	Game.battle(_curSkin, function(data){
		console.log(data)
	})
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

	if(item_mc.name == "btnReady"){
		this.createUser();
	} else if(item_mc.name == "btnAttack"){
	} else if(item_mc.name == "btnDefense"){
		this.defense(_curSkin);
	} else if(item_mc.name == "btnBattle"){
		this.battle(_curSkin);
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
