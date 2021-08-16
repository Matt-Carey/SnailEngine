import { Component } from './../component.js';
import { ObjectFactory } from './../../factory/objectFactory.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';
import { IS_BROWSER } from '../../util/env.js';

class Model extends Component {
    #model = null;
    #anim = null;

    constructor(owner, config) {
        super(owner, config);
        
        // Only load GLTF models on clients
        if(IS_BROWSER) {
            const modelConfig = config['model'];
            (async () => {
                await GLTFFactory.getModel(modelConfig).then(model => {
                    this.#model = model;
                    this.world.scene.add(this.#model);

                    const animConfig = config['anim'];
                    if(animConfig != null) {
                        (async () => {
                            await ObjectFactory.make(this, animConfig.type, animConfig.src, animConfig.config).then(anim => {
                                this.#anim = anim;
                            });
                        })();
                    }
                });
            })();
        }
    }

    tick(dt) {
        super.tick(dt);
        const pos = this.position;
        if(this.#model != null) {
            this.#model.position.set(pos.x, pos.y, pos.z);
        }
        if(this.#anim != null) {
            this.#anim.tick(dt);
        }
    }

    get model() {
        return this.#model;
    }
}

export { Model };
