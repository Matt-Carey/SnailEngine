import { Component } from './../component.js';
import { IS_BROWSER } from '../../util/env.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';
import { AnimationMixer as ThreeAnimationMixer } from './../../../3rdparty/three.js/build/three.module.js';

const Defaults = {
    'gltf': null,
}

class AnimationMixer extends Component {
    #gltf = Defaults.gltf;
    #anims = null;
    #animMixer = null;
    #actions = {};

    constructor(init) {
        super(init);

        this.#gltf = init?.json?.gltf;
        
        if(IS_BROWSER) {
            if(this.#gltf != null) {
                GLTFFactory.getAnims(this.#gltf).then(anims => {
                    this.#anims = anims;
                    if(this.owner.model != null) {
                        this.#animMixer = new ThreeAnimationMixer(this.owner.model);
                        for (const anim of this.#anims) {
                            this.#actions[anim.name] = this.#animMixer.clipAction(anim);
                        }
                    }
                    this.#animMixer.addEventListener( 'finished', (e) => this._onFinishedAnim(e) );
                    this._onMixerReady();
                });
            }
        }
    }

    toJSON() {
        const json = super.toJSON();
        if(this.#gltf != Defaults.gltf) {
            json.gltf = this.#gltf;
        }
        return json;
    }

    tick(dt) {
        if(this.#animMixer != null) {
            this.#animMixer.update(0.001 * dt);
        }
    }

    get actions() {
        return this.#actions;
    }

    _onMixerReady() {

    }

    _onFinishedAnim(e) {
        
    }

}

export { AnimationMixer };
