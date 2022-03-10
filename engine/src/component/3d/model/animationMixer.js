import { Component } from '../../component.js'
import { GLTFFactory } from '../../../factory/gltfFactory.js';
import { AnimationMixer as ThreeAnimationMixer } from '../../../../3rdparty/three.js/build/three.module.js';

class AnimationMixer extends Component {
    #gltf = null;
    #anims = null;
    #animMixer = null;
    #actions = {};

    constructor(init) {
        super(init);
    }

    fromJSON(json) {
        super.fromJSON(json);

        if(json.gltf != null && json.gltf != this.#gltf) {
            this.#gltf = json.gltf;
            GLTFFactory.getAnims(this.#gltf).then(anims => {
                this.#anims = anims;

                this.world.getEntityPromise(this.owner).then(entity => {
                    const onModelLoaded = (model) => {
                        this.#animMixer = new ThreeAnimationMixer(model);
                        for (const anim of this.#anims) {
                            this.#actions[anim.name] = this.#animMixer.clipAction(anim);
                        }
                        this.#animMixer.addEventListener( 'finished', (e) => this._onFinishedAnim(e) );
                        this._onMixerReady();
                    }

                    entity.onModelLoaded.bind(onModelLoaded);
                    if(entity.model != null) {
                        onModelLoaded(entity.model);
                    }
                });
            });
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.gltf = this.#gltf;
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
