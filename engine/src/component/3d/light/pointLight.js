import { Component } from '../../component.js'
import { Color, PointLight as ThreePointLight } from '../../../../3rdparty/three.js/build/three.module.js';
import { Vector } from '../../../math/vector.js';

class PointLight extends Component {
    #color = new Color(1.0, 1.0, 1.0);
    #intensity = 1.0;
    #distance = null;
    #decay = null;
    #pointLight = null;

    constructor(init) {
        super(init);
        this.#pointLight = new ThreePointLight(this.#color, this.#intensity, this.#distance, this.#decay);
        this.world.scene.add(this.#pointLight);
    }

    fromJSON(json) {
        super.fromJSON(json);
        if(json.color != null) {
            this.#color.setRGB(json.color.r, json.color.g, json.color.b);
        }

        if(json.intensity != null) {
            this.#intensity = json.intensity;
        }

        if(json.distance != null) {
            this.#distance = json.distance;
        }

        if(json.decay != null) {
            this.#decay = json.decay;
        }

        this.#pointLight.color = this.#color;
        this.#pointLight.intensity = this.#intensity;
        if(this.#distance != null) {
            this.#pointLight.distance = this.#distance;
        }
        if(this.#decay != null) {
            this.#pointLight.decay = this.#decay;
        }
    }

    toJSON() {
        const json = super.toJSON();

        json.color = {};
        json.color.r = this.#color.r;
        json.color.g = this.#color.g;
        json.color.b = this.#color.b;

        json.intensity = this.#intensity;

        if(this.#distance != null) {
            json.distance = this.#distance;
        }

        if(this.#decay != null) {
            json.decay = this.#decay;
        }

        return json;
    }
}

export { PointLight };
