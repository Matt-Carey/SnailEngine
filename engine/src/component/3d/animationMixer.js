import { IS_BROWSER } from '../../util/env.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';
import { AnimationMixer as ThreeAnimationMixer } from './../../../3rdparty/three.js/build/three.module.js';

class AnimationMixer {
    #anims = null;
    #animMixer = null;
    _actions = [];

    constructor(owner, config) {
        // Only run anims on clients
        if(IS_BROWSER) {
            const animConfig = config['anim'];
            (async () => {
                await GLTFFactory.getAnims(animConfig).then(anims => {
                    this.#anims = anims;
                    if(owner.model != null) {
                        this.#animMixer = new ThreeAnimationMixer(owner.model);
                        for (const anim of this.#anims) {
                            this._actions[anim.name] = this.#animMixer.clipAction(anim);
                        }
                    }
                    this._onMixerReady();
                });
            })();
        }
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
