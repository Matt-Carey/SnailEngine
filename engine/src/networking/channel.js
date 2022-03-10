import { Snap } from '../../3rdparty/geckos.io/snapshot-interpolation.js';
import { Config } from './../config.js';
import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/entityFactory.js';
import { ModuleFactory } from './../factory/moduleFactory.js';
import { str2ab } from './../util/buffer.js';

class Channel {
    #world = null;
    #channel = null;
    #snapMap = new Map();

    constructor(world, worldURL) {
        this.#world = world;
        ModuleFactory.get("Engine", "/3rdParty/geckos.io/geckos.io-client.2.1.8.min.js").then(module => {
            const split = worldURL.split(":");
            const options = {};
            options.url = split[0] + ':' + split[1];
            if(split.length > 2) {
                options.port = parseInt(split[2]);
            }

            this.#world.onEntityAdded.bind((entity) => {
                const name = entity.class.schemaModelName;
                if(!this.#snapMap.has(name)) {
                    const cfg = Config.get();
                    this.#snapMap.set(name, new Snap.SnapshotInterpolation(cfg.server.fps ?? 20));
                }
            });

            const geckos = module.geckos;
            this.#channel = geckos(options);
            this.#channel.onConnect(error => {
                if (error) {
                    console.error(error.message);
                }
              
                // listens for a disconnection
                this.#channel.onDisconnect(() => {

                })

                this.#channel.on('scene', json => {
                    world.scene.fromJSON(JSON.parse(json));
                });

                this.#channel.on('init', json => {
                    for(const entity of json.entities) {
                        EntityFactory.make(this.#world, entity.UUID, entity.meta, entity.json);
                    }
                });

                this.#channel.on('state', state => {
                    for(const modelName in state) {
                        if(Entity.schemaModelMap.has(modelName)) {
                            const snapshot = Entity.schemaModelMap.get(modelName).fromBuffer(str2ab(state[modelName]));
                            if(this.#snapMap.has(modelName)) {
                                this.#snapMap.get(modelName).snapshot.add(snapshot);
                            }
                        }
                    }
                });
            });
        });
    }

    tick(dt) {
        for(const [key, value] of this.#snapMap) {
            const interpolationValues = Entity.interpolationValuesMap.get(key);
            const snapshot = value.calcInterpolation(interpolationValues ?? '', 'entities');
            if(snapshot != undefined) {
                for(const state of snapshot.state) {
                    const entity = this.#world.getEntity(state.id);
                    if(entity != null) {
                        entity.fromJSON(state);
                    }
                }
            }
        }
    }
}

export { Channel };
