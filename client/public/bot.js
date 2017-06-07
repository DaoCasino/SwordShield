var game_url = 'http://10.0.0.10:9999';
var user_context = ''
var user_role = false


status.addListener("init", function (params, context) {
	user_context = context

	status.sendMessage( 'Hi! This is completely decentralized and fast game. Where you attack enemies or defend yourself.' );

	var select_msg = [
		'Select your role:',
		' - Sword. Find enemy and attack imidietly. (win odd: 49%)',
		'',
		' - Shield. Stay online and wait while somebody attack you. (win odd: 51%). You can minimize the application, it will be working in background!',
		'',
		'Please start type your role',
	].join('\n')

	status.sendMessage(select_msg)
});


function helloSug(params, context) {
	if (user_role) { return };

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
	function helloSuggestions() {
		var suggestions = [" I want to be #Sword#", " I want to be #Shield#"].map(function(entry) {
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
								entry
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

	return helloSuggestions(params, context)
}
status.addListener("on-message-input-change", helloSug);


status.addListener("on-message-send", function (params, context) {
	if (user_role) { return; }

	var result = {
		err: null,
		data: null,
		messages: []
	};

	if (params.message.indexOf('#Shield#') > -1) {
		user_role = 'shield'
		status.sendMessage('OK, you are Shield')
	}

	if (params.message.indexOf('#Sword#') > -1) {
		user_role = 'sword'
		// status.sendMessage('')
		// status.sendMessage('')

		return {
			markup: status.components.touchable(
				{ onPress: status.components.dispatch([status.events.SET_VALUE, "/startgame"]) },
				status.components.view({
					height: 56,
					borderBottomWidth: 1,
					borderBottomColor: "#0000001f"
				}, [status.components.text(
						{style: {
							marginTop: 12,
							marginLeft: 12,
							fontSize: 14,
							fontFamily: "font",
							color: "#000000de"
						}},
				"OK, you are Sword, now open game!")])
			)
		}

	}





	// var url = game_url+'#openkey='+context.from;

	// return {
	// 	title:           "Browser",
	// 	dynamicTitle:    true,
	// 	singleLineInput: true,
	// 	actions:         [{ type: status.actions.FULLSCREEN }],
	// 	markup:          status.components.bridgedWebView(url)
	// };
});


status.command({
	name:           "startgame",
	title:          "Start Game",
	registeredOnly: true,
	description:    "Start game",
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
