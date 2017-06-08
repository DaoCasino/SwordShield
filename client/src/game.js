import _config  from "./app.config.js";

import DB         from './model/DB/DB'
import Eth        from './model/Eth/Eth'
import Api        from './model/Api'
import bigInt     from 'big-integer'
import Web3       from 'web3'
const web3 = new Web3()

import * as Utils from './utils'

export default class Game {
	constructor(params) {
		window.openkey   = params.openkey || false
		window.user_role = params.role    || false

		// Defense
		this.runConfirm()
	}

	generateSeed(){

	}

	createUser(skin, callback){
		if (skin) {
			callback()
		};
	}

	battle(skin, callback){
		let seed = this.generateSeed()
		// send: skin seed - сгененрировать openkey_to(на кого нападаем)
	}

	runConfirm(){
		// seed, skin v,r,s
	}
}
