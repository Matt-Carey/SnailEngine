import { Level } from './level.js';
import { Scene } from './render/scene.js';
import { PhysicsWorld } from './physics/physicsWorld.js'
import { Host } from './networking/host.js';
import { Channel } from './networking/channel.js';
import { IS_BROWSER, IS_NODE } from './util/env.js';
import { JSONFactory } from './factory/jsonFactory.js';
import { Delegate } from './util/delegate.js';

class World {
    #engine = null;
    #scene = null;
    #physics = null;
    #host = null;
    #channel = null;
    #levels = new Map();

    #onEntityAdded = new Delegate();
    #onEntityAddedMap = new Map();
    #entityMap = new Map();
    #ownershipMap = new Map();

	constructor(engine) {
        this.#engine = engine;

        this.#scene = new Scene();
        this.#physics = new PhysicsWorld();

        if(IS_NODE) {
			this.#host = new Host(this);
		}
	}

    async load(worldURL) {
        // Test if url is an absolute path - if so, connect to the server for world.
        if(IS_BROWSER && /^(?:\/|[a-z]+:\/\/)/.test(worldURL)) {
            this.#channel = new Channel(this, worldURL);
        }
        else {
            JSONFactory.get(worldURL).then(json => {
                this.#scene.fromJSON(json.scene);
                for(const level of json.levels) {
                    JSONFactory.get(level.path).then(json => {
                        this.#levels.set(level.name, new Level(this, json));
                    });
                }
            });
        }
    }

    get scene() {
        return this.#scene;
    }

    get physics() {
        return this.#physics;
    }
	
	tick(dt) {
        if(this.#channel != null) {
            this.#channel.tick(dt);
        }
        if(this.#ownershipMap.has(null)) {
            for(const root of this.#ownershipMap.get(null)) {
                this.#tickEntity(dt, root);
            }
        }
        if(this.#host != null) {
            this.#host.tick(dt);
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

        this.#onEntityAdded.call(entity);

        if(this.#onEntityAddedMap.has(entity.UUID)) {
            this.#onEntityAddedMap.get(entity.UUID).resolve(entity);
        }
    }

    getEntity(UUID) {
        return this.#entityMap.get(UUID);
    }

    async getEntityPromise(UUID) {
        const entity = this.getEntity(UUID);
        if(entity != null) {
            return entity;
        }

        if(this.#onEntityAddedMap.has(UUID)) {
            return this.#onEntityAddedMap.get(UUID);
        }

        const promise = new Promise(entity => {
            return entity;
        });

        return promise;
    }

    get onEntityAdded() {
        return this.#onEntityAdded;
    }

    get entities() {
        return Array.from(this.#entityMap.values());
    }

}

export { World };
