import { Game } from './game/game.js';
import { Level } from './level.js';
import { Scene } from './render/scene.js';
import { PhysicsWorld } from './physics/physicsWorld.js'
import { Host } from './networking/host.js';
import { Channel } from './networking/channel.js';
import { DEDICATED_SERVER, CLIENT, STANDALONE, HAS_AUTHORITY } from './networking/role.js';
import { IS_BROWSER, IS_NODE, WORKING_DIR } from './util/env.js';
import { JSONFactory } from './factory/jsonFactory.js';
import { Delegate } from './util/delegate.js';
import { ModuleFactory } from './factory/moduleFactory.js';

class World {
    #engine = null;
    #game = null;
    #scene = null;
    #physics = null;
    #role = null;
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
	}

    async load(worldURL) {
        // Test if url is an absolute path - if so, connect to the server for world.
        if(IS_NODE) {
            this.#role = DEDICATED_SERVER;
            if(this.#host == null) {
                this.#host = new Host(this);
            }
        }
        else if(IS_BROWSER) {
            this.#role = /^(?:\/|[a-z]+:\/\/)/.test(worldURL) ? CLIENT : STANDALONE;
        }

        if(this.authority) {
            // TODO Handle leaving old game
            if(this.#game != null) {
                //this.#game.stop();
            }
            JSONFactory.get(worldURL).then(json => {
                this.#scene.fromJSON(json.scene);
                const gameJson = json.game;
                ModuleFactory.get(gameJson.meta.cdn, gameJson.meta.src).then(result => {
                    const gameClass = result[gameJson.meta.type];
                    if(gameClass != null) {
                        this.#game = new gameClass(this, gameJson.json);
                    }
                });
                for(const level of json.levels) {
                    const levelpath = WORKING_DIR + level.path;
                    JSONFactory.get(levelpath).then(json => {
                        this.#levels.set(level.name, new Level(this, json));
                    });
                }
            });
        }
        else {
            // TODO Handle leaving channel
            if(this.#channel != null) {
                //this.#channel.disconnect();
            }
            this.#channel = new Channel(this, worldURL);
        }
    }

    get scene() {
        return this.#scene;
    }

    get physics() {
        return this.#physics;
    }

    get game() {
        return this.#game;
    }

    get authority() {
        return HAS_AUTHORITY(this.#role);
    }

    get role() {
        return this.#role;
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
