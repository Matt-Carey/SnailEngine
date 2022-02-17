import { Component } from './../component.js';
import { IS_BROWSER } from '../../util/env.js';
import { EntityFactory } from './../../factory/EntityFactory.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';

class Model extends Component {
    #gltf = null;
    #model = null;
    #anim = null;

    constructor(init) {
        super(init);

        if (IS_BROWSER) {
            this.#gltf = init.config['gltf'];
            GLTFFactory.getModel(this.#gltf).then(model => {
                this.#model = model;
                if(this.#model != null) {
                    this.world.scene.add(this.#model);
                }

                const animJson = init.config['anim']
                if(animJson != null) {
                    EntityFactory.make(this, animJson).then(anim => {
                        this.#anim = anim;
                    });
                }
            });
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.config['gltf'] = this.#gltf;
        json.config['anim'] = this.#anim?.toJSON();
        return json;
    }

    tick(dt) {
        super.tick(dt);
        if(this.#model != null) {
            const position = this.position;
            this.#model.position.set(position.x, position.y, position.z);

            const scale = this.scale;
            this.#model.scale.set(scale.x, scale.y, scale.z);
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
