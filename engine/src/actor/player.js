import { Actor } from './actor.js';

class Player extends Actor {
    #id = 0;

    constructor(init) {
        super(init);
    }
}

export { Player };
