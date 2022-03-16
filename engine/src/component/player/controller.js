import { IS_NODE } from '../../util/env.js';
import { Entity } from './../../entity.js';

class Controller extends Entity {
    #netId = null;

    #testVar = null;
    #testVar2 = null;

    #time = 0;
    
    constructor(init) {
        super(init);
        this.#testVar = 1;
        this.#testVar = 1;
    }

    get replicates() {
        return true;
    }

    static get replicatedProperties() {
        return {
            testVar: '',
            testVar2: ''
        }
    }

    fromJSON(json) {
        super.fromJSON(json);
        if(json.netId != null) {
            this.#netId = json.netId;
        }
        if(json.testVar != null) {
            this.#testVar = json.testVar;
        }
        if(json.testVar2 != null) {
            this.#testVar2 = json.testVar2;
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.netId = this.#netId;
        json.testVar = this.#testVar;
        json.testVar2 = this.#testVar2;
        return json;
    }

    get netId() {
        return this.#netId;
    }

    tick(dt) {
        super.tick(dt);

        if(IS_NODE) {
            this.#time += dt;
            if(Math.random() > 0.95) this.#testVar2++;
            while(this.#time >= 3000) {
                this.#time -= 3000;
                this.#testVar++;
            }
        }
    }
}

export { Controller };
