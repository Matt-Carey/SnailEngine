import { Component } from './../component.js';
import { EntityFactory } from './../../factory/EntityFactory.js';
import { GLTFFactory } from './../../factory/gltfFactory.js';

class Model extends Component {
    #gltf = null;
    #model = null;
    #anim = null;

    constructor(init) {
        super(init);

        this.#gltf = init.config['gltf'];
        GLTFFactory.getModel(this.#gltf).then(model => {
            this.#model = model;
            if(this.#model != null) {
                this.world.scene.add(this.#model);
            }

            const animJson = init.config['anim']
            EntityFactory.make(this, animJson).then(anim => {
                this.#anim = anim;
            });
        });
    }

    toJSON() {
        const json = super.toJSON();
        json.config['gltf'] = this.#gltf;
        json.config['anim'] = this.#anim?.toJSON();
        return json;
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