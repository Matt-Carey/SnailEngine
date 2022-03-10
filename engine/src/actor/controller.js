import { Actor } from './actor.js'

class Controller extends Actor {
    #keys = []
    
    constructor(init) {
        super(init);
    }
}

export { Controller };
