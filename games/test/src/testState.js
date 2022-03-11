import { State } from 'http://127.0.0.1:8000/src/game/state.js';

class TestState extends State {
    constructor(init) {
        super(init);
    }

    tick(dt) {
    }
}

export { TestState };
