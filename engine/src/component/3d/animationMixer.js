import { Component } from './../component.js';
import { IS_BROWSER } from '../../util/env.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';
import { AnimationMixer as ThreeAnimationMixer } from './../../../3rdparty/three.js/build/three.module.js';

class AnimationMixer extends Component {
    #gltf = null;
    #anims = null;
    #animMixer = null;
    _actions = [];

    constructor(init) {
        super(init);

        this.#gltf = init.config['gltf'];
        GLTFFactory.getAnims(this.#gltf).then(anims => {
            this.#anims = anims;
            if(this.owner.model != null) {
                this.#animMixer = new ThreeAnimationMixer(this.owner.model);
                for (const anim of this.#anims) {
                    this._actions[anim.name] = this.#animMixer.clipAction(anim);
                }
            }
            this._onMixerReady();
        });
    }

    toJSON() {
        const json = super.toJSON();
        json.config['gltf'] = this.#gltf;
        return json;
    }

    tick(dt) {
        if(this.#animMixer != null) {
            this.#animMixer.update(0.001 * dt);
        }
    }

    _onMixerReady() {

    }
}

export { AnimationMixer };
