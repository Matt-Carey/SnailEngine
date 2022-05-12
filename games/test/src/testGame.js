import { Game } from 'http://127.0.0.1:8000/src/game/game.js';

class TestGame extends Game {
    constructor(world, json) {
        super(world, json);
    }

    onLogin(channel) {
        super.onLogin(channel);
    }

    onLogout(channel) {
        super.onLogin(channel);
    }

    _onStateReady(state) {
        super._onStateReady(state);
    }

    _onControllerReady(controller) {
        super._onControllerReady(controller);
    }

    _canPlayerStart(controller) {
        return super._canPlayerStart(controller);
    }
}

export { TestGame };
