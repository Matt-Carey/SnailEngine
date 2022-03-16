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
    #ghostFrame = -1;

    constructor(world, worldURL) {
        this.#world = world;
        ModuleFactory.get("Engine", "/3rdparty/geckos.io/geckos.io-client.2.1.8.min.js").then(module => {
            const split = worldURL.split(":");
            const options = {};
            options.url = split[0] + ':' + split[1];
            if(split.length > 2) {
                options.port = parseInt(split[2]);
            }

            this.#world.onEntityAdded.bind((entity) => {
                const interpolationMethod = entity.class.interpolationMethod;
                const name = entity.class.replicatedSchemaModel.schema.name;
                if(!this.#snapMap.has(name)) {
                    const cfg = Config.get();
                    this.#snapMap.set(name, new Snap.SnapshotInterpolation(cfg.server.fps ?? 20));
                }
            });

            const geckos = module.geckos;
            this.#channel = geckos(options);
            console.log(this.#channel);
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

                this.#channel.on('entity_added', entity => {
                    EntityFactory.make(this.#world, entity.UUID, entity.meta, entity.json);
                })

                this.#channel.on('snapshot', snapshotJson => {
                    for(const modelName in snapshotJson) {
                        if(Entity.schemaModelMap.has(modelName)) {
                            const snapshotString = snapshotJson[modelName];
                            const snapshotArraybuffer = str2ab(snapshotString);
                            const snapshot = Entity.schemaModelMap.get(modelName).fromBuffer(snapshotArraybuffer);
                            if(this.#snapMap.has(modelName)) {
                                this.#snapMap.get(modelName).snapshot.add(snapshot);
                            }
                        }
                    }
                });

                this.#channel.on('dirty_ghost', ghost => {
                    if(ghost.frame <= this.#ghostFrame) return;
                    this.#ghostFrame = ghost.frame;
                    if(Math.random() > 0.8)
                    this.#channel.emit('ack_dirty_ghost', ghost.frame);
                })

            });
        });
    }

    tick(dt) {
        for(const [key, value] of this.#snapMap) {
            const interpolationMethod = Entity.interpolationMethodMap.get(key);
            const snapshot = value.calcInterpolation(interpolationMethod ?? '', 'raw');
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
