import { Entity } from './../entity.js';

class State extends Entity{

    constructor(init) {
        super(init);
    }

    get replicates() {
        return true;
    }

}

export { State }
