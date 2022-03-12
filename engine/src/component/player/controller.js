import { Entity } from './../../entity.js';

class Controller extends Entity {
    #netId = null;
    
    constructor(init) {
        super(init);
    }

    get replicates() {
        return true;
    }

    fromJSON(json) {
        super.fromJSON(json);
        if(json.netId != null) {
            this.#netId = json.netId;
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.netId = this.#netId;
        return json;
    }

    get netId() {
        return this.#netId;
    }
}

export { Controller };
