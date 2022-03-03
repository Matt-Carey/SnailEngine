import { Component } from '../../component.js';
import { Color, Light as ThreeLight } from '../../../../3rdparty/three.js/build/three.module.js';

class Light extends Component {
    #color = new Color(1.0, 1.0, 1.0);
    #intensity = 1.0;
    #light = null;

    constructor(init) {
        super(init);
    }

    fromJSON(json) {
        super.fromJSON(json);

        if(this.#light == null) {
            this.#light = this._makeLight();
            this.world.scene.add(this.#light);
        }

        if(json.color != null) {
            this.#color.setRGB(json.color.r, json.color.g, json.color.b);
            this.light.color = this.#color;
        }

        if(json.intensity != null) {
            this.#intensity = json.intensity;
            this.light.intensity = this.#intensity;
        }
    }

    toJSON() {
        const json = super.toJSON();

        json.color = {};
        json.color.r = this.#color.r;
        json.color.g = this.#color.g;
        json.color.b = this.#color.b;

        json.intensity = this.#intensity;

        return json;
    }

    get light() {
        return this.#light;
    }

    get color() {
        return this.#color;
    }

    get intensity() {
        return this.#intensity;
    }

    _makeLight() {
        return new ThreeLight(this.color, this.intensity);
    }
}

export { Light };
