pragma solidity ^0.4.8;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract Game is owned {
    string public meta_name    = 'SwordShield';
	
	uint8 ATTACKING = 1;
	uint8 PROTECTING = 2;
	
	uint8 STAFF = 1;
	uint8 AXE = 2;
	uint8 SPEAR = 3;
	
	uint8 HELMET = 1;
	uint8 SHILED = 2;
	uint8 ARMOR = 3;
	
	enum GameState {
        InProgress,
        PlayerWon,
        PlayerLose
    }
	
	struct Game {
        address player;
        uint8 hero;
        uint8 weapon;
        uint8 shield;
        GameState state;
        uint8 rnd;
    }
	
    mapping(bytes32 => Game) public listGames;
    
    event log(uint8 value);
	
	modifier checkArmor(uint8 value) {
        if (value > ARMOR && value < HELMET) {
            throw;
        }
        _;
    }
	
	modifier checkWeapon(uint8 value) {
        if (value > SPEAR && value < SWORD) {
            throw;
        }
        _;
    }
	
	modifier checkType(uint8 value) {
        if (value > PROTECTING && value < ATTACKING) {
            throw;
        }
        _;
    }
	
    function battle(uint8 weapon, bytes32 seed)
		public
		checkWeapon(weapon)
	{
		listGames[seed] = Game({
            player: msg.sender,
            hero: ATTACKING,
            weapon: weapon,
            shield: 0,
            state: GameState.InProgress,
            rnd: 0
        });
		
	}
	
    function confirm(bytes32 random_id, uint8 shield, uint8 _v, bytes32 _r, bytes32 _s)
		public
		onlyOwner
	{
		if (ecrecover(random_id, _v, _r, _s) != owner) { // owner
            Game game = listGames[random_id];
            uint8 rnd = uint8(sha3(_s, game.weapon, shield)) % 100;
            game.rnd = rnd;
            log(rnd);
            if(rnd > 50){
				listGames[random_id].state = GameState.PlayerWon;
			} else {
				listGames[random_id].state = GameState.PlayerLose;
			}
        }
	}
	
	function getState(bytes32 random_id) 
		public 
		constant returns(GameState) 
	{
        Game memory game = listGames[random_id];

        if (game.player == 0) {
            throw;
        }

        return game.state;
    }
}