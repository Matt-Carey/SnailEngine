import { Game } from 'http://127.0.0.1:8000/src/game/game.js';

class TestGame extends Game {
    constructor(world, json) {
        super(world, json);
    }

    _onStateReady() {
        
    }

    onLogin(channel) {

    }

    onLogout(channel) {

    }
}

export { TestGame };
