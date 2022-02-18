import { Component } from './../component.js';
import { IS_BROWSER } from '../../util/env.js';
import { EntityFactory } from './../../factory/EntityFactory.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';

const Defaults = {
	'gltf': null,
	'anim': null,
}

class Model extends Component {
    #gltf = Defaults.gltf;
    #model = null;
    #anim = Defaults.anim;

    constructor(init) {
        super(init);

        this.#gltf = init?.json?.gltf;
        if (IS_BROWSER) {
            GLTFFactory.getModel(this.#gltf).then(model => {
                this.#model = model;
                if(this.#model != null) {
                    this.world.scene.add(this.#model);
                }
            });
        }
        
        const animJson = init?.json?.anim;
        if(animJson != null) {
            EntityFactory.make(this, animJson).then(anim => {
                this.#anim = anim;
            });
        }
    }

    toJSON() {
        const json = super.toJSON();
        if(this.#gltf != Defaults.gltf) {
            json.gltf = this.#gltf;
        }
        if(this.#anim != Defaults.gltf) {
            json.anim = this.#anim?.toJSON();
        }
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
