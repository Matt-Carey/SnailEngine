import { Component } from './../../component.js'
import { World } from './../../../world.js';
import { Vector } from './../../math/vector.js';
import { Config } from './../../config';

class Box extends Component {
    #dimensions = new Vector(1, 1, 1);
    #rigidBody = null;

    constructor(init) {
        super(init);

        this.#rigidBody = this.world.physics.add({
            type:'box'
        });
    }

    fromJSON(json) {
        if(json.dimensions != null) {
            this.#dimensions = json.dimensions;
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.dimensions = this.#dimensions;
        return json;
    }

}

export { Box };
