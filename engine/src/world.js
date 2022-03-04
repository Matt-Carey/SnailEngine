import { Level } from './level.js';
import { Scene } from './render/scene.js';
import { PhysicsWorld } from './physics/physicsWorld.js'
import { Config } from './config.js';
import { IS_BROWSER, IS_NODE } from './util/env.js'
import { EntityFactory } from './factory/entityFactory.js';
import { ModuleFactory } from './factory/moduleFactory.js';
import { JSONFactory } from './factory/jsonFactory.js';
import { Delegate } from './util/delegate.js';

class World {
    #engine = null;
    #scene = null;
    #physics = null;
    #levels = new Map();

    #onEntityAddedMap = new Map();
    #entityMap = new Map();
    #ownershipMap = new Map();

	constructor(engine) {
        this.#engine = engine;

        this.#scene = new Scene();
        this.#physics = new PhysicsWorld();

        if(IS_NODE) {
			const { http, geckos } = global.nodeimports;
            const server = http.createServer()

			const io = geckos({
                cors: {
                    allowAuthorization: true
                }
            });

            io.addServer(server);
            io.onConnection(channel => {
                console.log('connection:', channel.id);

                channel.emit('scene', JSON.stringify(this.#scene));

                const init = {};
                init.entities = [];
                for(const [key, value] of this.#entityMap) {
                    const entity = {};
                    entity.meta = value.meta;
                    entity.UUID = value.UUID;
                    entity.json = value.toJSON();
                    init.entities.push(entity);
                }
                channel.emit('init', init);
            });

            server.listen(8080, () => {
                console.log('listening on *:8080');
            });
		}
	}

    async load(worldURL) {
        // Test if url is an absolute path - if so, connect to the server for world.
        if(IS_BROWSER && /^(?:\/|[a-z]+:\/\/)/.test(worldURL)) {
            ModuleFactory.get("Engine", "/3rdParty/geckos.io/geckos.io-client.2.1.8.min.js").then((module) => {
                const geckos = module.geckos;
                const split = worldURL.split(":");
                const options = {};
                options.url = split[0] + ':' + split[1];
                if(split.length > 2) {
                    options.port = parseInt(split[2]);
                }
                const channel = geckos(options);
                channel.onConnect(error => {
                    if (error) {
                        console.error(error.message);
                    }
                  
                    // listens for a disconnection
                    channel.onDisconnect(() => {

                    })

                    channel.on('scene', json => {
                        this.#scene.fromJSON(JSON.parse(json));
                    });

                    channel.on('init', json => {
                        for(const entity of json.entities) {
                            EntityFactory.make(this, entity.UUID, entity.meta, entity.json);
                        }
                    });
                });
            });
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
