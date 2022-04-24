import { Component } from '../../component.js'
import { IS_BROWSER, WORKING_DIR } from '../../../util/env.js';
import { GLTFFactory } from '../../../factory/gltfFactory.js';
import { Delegate } from '../../../util/delegate.js';

class Model extends Component {
    #gltf = null;
    #model = null;
    #onModelLoadedDel = new Delegate();

    constructor(init) {
        super(init);
    }

    fromJSON(json) {
        super.fromJSON(json);

        if(json.gltf != null && json.gltf != this.#gltf) {
            this.#gltf = json.gltf;
            if (IS_BROWSER) {
                GLTFFactory.getModel(WORKING_DIR + this.#gltf).then(model => {
                    this.world.scene.remove(this.#model);
                    this.#model = model;
                    this.onModelLoaded.call(this.#model);
                    if(this.#model != null) {
                        this.world.scene.add(this.#model);
                    }
                });
            }
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.gltf = this.#gltf;
        return json;
    }

    tick(dt) {
        super.tick(dt);
        if(this.#model != null) {
            const position = this.position;
            this.#model.position.set(position.x, position.y, position.z);

            const rotation = this.rotation;
            this.#model.rotation.set(rotation.x, rotation.y, rotation.z);

            const scale = this.scale;
            this.#model.scale.set(scale.x, scale.y, scale.z);
        }
    }

    get onModelLoaded() {
        return this.#onModelLoadedDel;
    }

    get model() {
        return this.#model;
    }
}

export { Model };
