var game_url = 'http://10.0.0.20:9999';
var user_context = '';
var enemy_selected = false;
var contract_address = '0x6ae02b2f861b071af202ab7caface8929fe42529';
var enemies = []
var enemies_str = '';


status.addListener("init", function (params, context) {
	user_context = context
	status.sendMessage( 'Hi! This is completely decentralized and fast game. Where you attack enemies or defend yourself.' );
	status.sendMessage( 'Run /startgame command' );
});



var usercreated = false;

function createUser(){
	if (usercreated) { return }

	// shh.post ... not work

	var params = {
		from:     web3.eth.accounts[0],
		to:       contract_address,
		value:    0,
		gasPrice: '0x737be7600',
		gas:      '0x927c0',

		data:  '0x4e8320260000000000000000000000000000000000000000000000000000000000000002',
	}

	web3.eth.sendTransaction(params, function(err,res){
		usercreated = true;
		status.sendMessage('User created!')
	})
}


function Attack(enemy){
	// shh.post ... not work

	var params = {
		from:     web3.eth.accounts[0],
		to:       contract_address,
		value:    0,
		gasPrice: '0x737be7600',
		gas:      '0x927c0',

		data:  '0x689a9add00000000000000000000000000000000000000000000000000000000000000026162636465663031323334353637383961626364656630313233343536373839000000000000000000000000'+enemy,
	}

	web3.eth.sendTransaction(params, function(err, res){
		status.sendMessage(res)
		status.sendMessage('Enemy attacked: ' + enemy)
	})
}



function findEnemy(){
	status.sendMessage('Find enemies!')
	var filter = web3.eth.filter({fromBlock:1077192, toBlock: 'latest', address: contract_address});
	filter.watch(function(error, result){
	  if (result && result.topics && result.topics[0] == '0xb124611581bfef7f8eb3c5f37021d06d67c3e49df90a5a581431e70cb6cfcd61' ) {
			//search enemies
			var enemy = result.data.substr(26);
			// if (enemy!=user_context) {
			// };
			enemies.push('Attack: '+enemy)
			enemies_str += ' '+enemy+', '

			if (enemies.length > 2) {
				status.sendMessage('Select enemies: ' + enemies_str)
				selectEnemies()
				filter.stopWatching();
			};
		}
	});
}


function waitAttack(){
	// shh.watch ... not work

	var filter = web3.eth.filter({fromBlock:1077192, toBlock: 'latest', address: contract_address});
	filter.watch(function(error, result){
		if (result.topics[1] && result.topics[1].indexOf(web3.eth.accounts[0].substr(2))>-1) {

			var attacker = result.data.substr(26,40);
			var seed     = result.data.substr(66);

			status.sendMessage('attacker:'+attacker);
			status.sendMessage('seed:'+seed);

			Protection(seed)
		}
	});
}

function Protection(seed){

}


function selectEnemies(){
	status.sendMessage('Select enemies: ' + enemies_str)

	function helloSug(params, context) {
		if (enemy_selected) { return };

		function suggestionsContainerStyle() {
			return {
				marginVertical: 1,
				marginHorizontal: 0,
				keyboardShouldPersistTaps: "always",
				height: 100,
				backgroundColor: "white",
				borderRadius: 5,
				flexGrow: 1
			};
		}
		function enemySuggestions() {
			var suggestions = enemies.map(function(entry) {
				return status.components.touchable(
					{ onPress: status.components.dispatch([status.events.SET_VALUE, entry]) },
					status.components.view(
						suggestionsContainerStyle,

						[status.components.view(
							{
								height: 56,
								borderBottomWidth: 1,
								borderBottomColor: "#0000001f"
							},
							[
								status.components.text(
									{style: {
										marginTop: 12,
										marginLeft: 12,
										fontSize: 14,
										fontFamily: "font",
										color: "#000000de"
									}},
									entry.substr(0,30)+'...'
								)
							]
						)]
					)
				);
			});

			// Let's wrap those two touchable buttons in a scrollView
			var view = status.components.scrollView(
				suggestionsContainerStyle(),
				suggestions
			);

			// Give back the whole thing inside an object.
			return {markup: view};
		}

		return enemySuggestions(params, context)
	}
	status.addListener("on-message-input-change", helloSug);
}

status.addListener("on-message-send", function (params, context) {
	var result = {
		err:      null,
		data:     null,
		messages: []
	};

	var msg = params.message

	if (msg.indexOf('Attack:') > -1) {

		var attacked_enemy = false
		for(var k in enemies){
			if (enemies[k].indexOf(msg.split(':')[1].split('...')[0])>-1) {
				attacked_enemy = enemies[k].split('Attack: ')[1]
			}
		}

		Attack(attacked_enemy)

		// return {
		// 	markup: status.components.touchable(
		// 		{ onPress: status.components.dispatch([status.events.SET_VALUE, "/startgame"]) },
		// 		status.components.view({
		// 			height: 56,
		// 			borderBottomWidth: 1,
		// 			borderBottomColor: "#0000001f"
		// 		}, [status.components.text(
		// 				{style: {
		// 					marginTop: 12,
		// 					marginLeft: 12,
		// 					fontSize: 14,
		// 					fontFamily: "font",
		// 					color: "#000000de"
		// 				}},
		// 		"OK, you are Sword, now open game!")])
		// 	)
		// }

	}
});







status.command({
	name:           "opengame",
	title:          "Open Game Frontend",
	registeredOnly: true,
	description:    "Open game frontend",
	color:          "#ffa500",
	fullscreen:     true,

	onSend: function(params, context){
		var url = game_url+'#openkey='+context.from;

		return {
			title:           "Browser",
			dynamicTitle:    true,
			singleLineInput: true,
			actions:         [{ type: status.actions.FULLSCREEN }],
			markup:          status.components.bridgedWebView(url)
		};
	}
});


status.command({
	name:           "start_bot_game",
	title:          "Start Bot Game",
	description:    "Start bot game",
	color:          "#ffa500",
	onSend: function(params, context){
		createUser();
		findEnemy();
		waitAttack();

		return 'Started';
	}
});

