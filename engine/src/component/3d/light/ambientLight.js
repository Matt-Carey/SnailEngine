import { Light } from './light.js';
import { AmbientLight as ThreeAmbientLight } from '../../../../3rdparty/three.js/build/three.module.js';

class AmbientLight extends Light {
    constructor(init) {
        super(init);
    }

    _makeLight() {
        return new ThreeAmbientLight(this.color, this.intensity);
    }
}

export { AmbientLight };
