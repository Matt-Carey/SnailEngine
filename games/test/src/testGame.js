import { Game } from 'http://127.0.0.1:8000/src/game/game.js';

class TestGame extends Game {
    constructor(world, json) {
        super(world, json);
    }

    _onStateReady() {
        super._onStateReady();
    }

    onLogin(channel) {
        super.onLogin(channel);
    }

    onLogout(channel) {
        super.onLogin(channel);
    }
}

export { TestGame };
