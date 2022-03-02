import { Level } from './level.js';
import { Scene } from './render/scene.js';
import { JSONFactory } from './factory/jsonFactory.js';
import { Delegate } from './util/delegate.js';

class World {
    #engine = null;
    #scene = null;
    #levels = new Map();
    #onEntityAddedMap = new Map();
    #entityMap = new Map();
    #ownershipMap = new Map();

	constructor(engine) {
        this.#engine = engine;
	}

    async load(worldURL) {
        JSONFactory.get(worldURL).then(json => {
            this.#scene = new Scene(json.scene);

            for(const level of json.levels) {
                JSONFactory.get(level.path).then(json => {
                    this.#levels.set(level.name, new Level(this, json));
                });
            }
        });
    }

    get scene() {
        return this.#scene;
    }
	
	tick(dt) {
        if(this.#ownershipMap.has(null)) {
            for(const root of this.#ownershipMap.get(null)) {
                this.#tickEntity(dt, root);
            }
        }
	}

    #tickEntity(dt, UUID) {
        const entity = this.#entityMap.get(UUID)
        if(entity != null) {
            entity.tick(dt);
            if(this.#ownershipMap.has(UUID)) {
                const children = this.#ownershipMap.get(UUID);
                for(const child of children) {
                    this.#tickEntity(dt, child);
                }
            }
        }
    }

    addEntity(entity) {
        this.#entityMap.set(entity.UUID, entity);

        if(!this.#ownershipMap.has(entity.owner)) {
            this.#ownershipMap.set(entity.owner, []);
        }
        this.#ownershipMap.get(entity.owner).push(entity.UUID);

        if(this.#onEntityAddedMap.has(entity.UUID)) {
            this.#onEntityAddedMap.get(entity.UUID).call(entity);
        }
    }

    getEntity(UUID) {
        return this.#entityMap.get(UUID);
    }

    getEntityPromise(UUID) {
        const entity = this.getEntity(UUID);
        const entityPromise = new Promise(resolve => {
            if(entity == null) {
                if(!this.#onEntityAddedMap.has(UUID)) {
                    this.#onEntityAddedMap.set(UUID, new Delegate());
                }
                this.#onEntityAddedMap.get(UUID).bind(resolve);
            }
            else {
                resolve(entity);
            }
        });
        return entityPromise;
    }

}

export { World };
