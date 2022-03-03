import { Level } from './level.js';
import { Scene } from './render/scene.js';
import { Config } from './config.js';
import { IS_BROWSER, IS_NODE } from './util/env.js'
import { EntityFactory } from './factory/entityFactory.js';
import { ModuleFactory } from './factory/moduleFactory.js';
import { JSONFactory } from './factory/jsonFactory.js';
import { Delegate } from './util/delegate.js';

class World {
    #engine = null;
    #scene = null;
    #levels = new Map();

    #onEntityAddedMap = new Map();
    #entityMap = new Map();
    #ownershipMap = new Map();

    #socket = null;
    #socketMap = null;

	constructor(engine) {
        this.#engine = engine;

        if(IS_NODE) {
			const { http, express, ServerSocket } = global.nodeimports;
			const app = express();
			const server = http.createServer(app);
            Config.get().then(cfg => {
                this.#socket = new ServerSocket(server, { cors: { origin: cfg.server.cors.origin }});

                this.#socket.on('connection', (socket) => {
                    console.log('connection:', socket.id);
                    socket.emit('scene', JSON.stringify(this.#scene));

                    const init = {};
                    init.entities = [];
                    for(const [key, value] of this.#entityMap) {
                        const entity = {};
                        entity.meta = value.meta;
                        entity.UUID = value.UUID;
                        entity.json = value.toJSON();
                        init.entities.push(entity);
                    }
                    socket.emit('init', init);

                    this.#socketMap.set(socket.id, socket);
                });
    
                server.listen(8080, () => {
                    console.log('listening on *:8080');
                });
            });
		}
	}

    async load(worldURL) {
        // Test if url is an absolute path - if so, connect to the server for world.
        if(IS_BROWSER && /^(?:\/|[a-z]+:\/\/)/.test(worldURL)) {
            this.#scene = new Scene();
            ModuleFactory.get("Engine", "/3rdParty/socket.io/socket.io.min.js").then(module => {
                this.#socket = io(worldURL);

                this.#socket.on('connect', () => {
                    console.log('connection:', this.#socket.id);
                });

                this.#socket.on('scene', (json) => {
                    console.log(json);
                    this.#scene.fromJSON(JSON.parse(json));
                })

                this.#socket.on('init', (json) => {
                    console.log(json);
                    for(const entity of json.entities) {
                        EntityFactory.make(this, entity.UUID, entity.meta, entity.json);
                    }
                });

            });
        }
        else {
            JSONFactory.get(worldURL).then(json => {
                this.#scene = new Scene();
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
