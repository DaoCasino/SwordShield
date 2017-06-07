var C_BATTLE = "aa5f4c08";
var C_CONFIRM = "56ca39b5";

var _callback;
var _mainCallback;

var API = function(prnt) {
	this.prnt = prnt;
	_callback = this.response; // for you
	_mainCallback = prnt.response; // for game
	// example: _callback(command, value, error)
	// example: _mainCallback(command, value, error)
};

API.prototype.battle = function(seed){
	console.log("battle:", seed);
}

API.prototype.defense = function(seed){
	console.log("defense:", seed);
}


API.prototype.responseServer = function(value) {
	var prnt = obj_game["game"];
	console.log("responseServer:", value);
	
}

API.prototype.makeID = function(count){
	if(count){}else{count = 64}
    var str = "0x";
    var possible = "abcdef0123456789";
	var t = String(getTimer());
	count -= t.length;
	str += t;

    for( var i=0; i < count; i++ ){
		str += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	str = numToHex(str);
	
    return str;
}

API.prototype.responseTransaction = function(name, value) {
	var prnt = obj_game["game"];
	var data = "";
	var seed = prnt.makeID();
	var args = [];
	var price = 0;
	var nameRequest = "sendRaw";
	var gasPrice="0x"+numToHex(40000000000);
	var gasLimit=0x927c0; //web3.toHex('600000');
	if(name == "battle"){
		data = "0x"+C_BATTLE+pad(numToHex(_curSkin), 64)+seed;
		args = [_curSkin, seed];
		nameRequest = "gameTxHash";
	} else if(name == "confirm"){
		data = "0x"+C_CONFIRM;
		args = [_seed, _curSkin, 27, prnt.makeID(5), prnt.makeID(5)];
		_seedUsed = _seed;
	}
	
	if(name != "confirm"){
		_seed = seed;
	}
	
	var options = {};
	options.nonce = value;
	options.to = addressContract;
	options.gasPrice = gasPrice;
	options.gasLimit = gasLimit;
	options.value = price;
	options.data = data;
	
	if(privkey){
		if(buf == undefined){
			// prnt.showError(ERROR_BUF);
		} else {
			var tx = new EthereumTx(options);
			tx.sign(new buf(privkey, 'hex'));

			var serializedTx = tx.serialize().toString('hex');
			console.log("The transaction was signed: "+serializedTx);
			
			var params = "0x"+String(serializedTx);
			infura.sendRequest(nameRequest, params, _callback);
		}
	}
}

API.prototype.response = function(command, value, error) {
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
		}
		return false;
	}
	
	if(command == "getGameState"){
		
	} else if(command == "battle" ||
			command == "confirm"){
		prnt.responseTransaction(command, value);
	} else if(command == "responseServer"){
		
	} else if(command == "sendRaw"){
		
	}
}