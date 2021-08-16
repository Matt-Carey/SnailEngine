import { Actor } from './actor.js';

class Player extends Actor {
    #id = 0;

    constructor(owner, config) {
        super(owner, config);
    }
}

export { Player };
