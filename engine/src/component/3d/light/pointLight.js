import { Light } from './light.js';
import { Color, PointLight as ThreePointLight } from '../../../../3rdparty/three.js/build/three.module.js';

class PointLight extends Light {
    #distance = 0;
    #decay = 1;

    constructor(init) {
        super(init);
    }

    fromJSON(json) {
        super.fromJSON(json);

        if(json.distance != null) {
            this.#distance = json.distance;
            this.light.distance = this.#distance;
        }

        if(json.decay != null) {
            this.#decay = json.decay;
            this.light.decay = this.#decay;
        }
    }

    toJSON() {
        const json = super.toJSON();

        if(this.#distance != null) {
            json.distance = this.#distance;
        }

        if(this.#decay != null) {
            json.decay = this.#decay;
        }

        return json;
    }

    get distance() {
        return this.#distance;
    }

    get decay() {
        return this.#decay;
    }

    _makeLight() {
        return new ThreePointLight(this.color, this.intensity, this.distance, this.decay);
    }
}

export { PointLight };
