import { Snap } from '../../3rdparty/geckos.io/snapshot-interpolation.js';
import { Config } from './../config.js';
import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/entityFactory.js';
import { ModuleFactory } from './../factory/moduleFactory.js';
import { str2ab } from './../util/buffer.js';

class Channel {
    #world = null;
    #channel = null;
    #snapshot = null;
    #snapshotKeySet = new Set();
    #ackTime = -1;

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
            });

            const geckos = module.geckos;
            this.#channel = geckos(options);
            console.log(this.#channel);
            this.#channel.onConnect(error => {
                if (error) {
                    console.error(error.message);
                }

                const cfg = Config.get();
                this.#snapshot = new Snap.SnapshotInterpolation(cfg.server.fps ?? 20);
              
                // listens for a disconnection
                this.#channel.onDisconnect(() => {

                })

                this.#channel.on('scene', json => {
                    world.scene.fromJSON(JSON.parse(json));
                });

                this.#channel.on('init', json => {
                    for(const entity of json.entities) {
                        EntityFactory.make(this.#world, entity.UUID, entity.meta, entity.init, entity.json);
                    }
                });

                this.#channel.on('entity_added', entity => {
                    EntityFactory.make(this.#world, entity.UUID, entity.meta, entity.init, entity.json);
                })

                this.#channel.on('state', state => {
                    if(state.time < this.#ackTime) return;
                    this.#ackTime = state.time;

                    const entityStateMap = new Map();
                    const replicationTypeMap = new Map();
                    for(const entity of this.#world.entities) {
                        if(entity.replicates && entity.class.hasReplicatedProperties) {
                            const aggrigateReplicatedProperties = entity.class.aggrigateReplicatedProperties;
                            const entityState = entity.toJSON();
                            for(const key in entityState) {
                                if(!(key in aggrigateReplicatedProperties)) {
                                    delete entityState[key];
                                }
                            }
                            const replicationType = entity.class.replicationType;
                            if(!replicationTypeMap.has(replicationType)) {
                                replicationTypeMap.set(replicationType, []);
                            }
                            replicationTypeMap.get(replicationType).push(entityState);
                            entityStateMap.set(entity.UUID, entityState);
                        }
                    }

                    const frame = {};
                    for(const [key, value] of replicationTypeMap) {
                        frame[key] = value;
                        this.#snapshotKeySet.add(key);
                    }

                    for(const key in state.schema) {
                        if(Entity.schemaModelMap.has(key)) {
                            const arrayBuffer = str2ab(state.schema[key]);
                            const modelMap = Entity.schemaModelMap.get(key);
                            const snapshot = modelMap.fromBuffer(arrayBuffer);
                            for(const index in snapshot) {
                                const entitySnapshot = snapshot[index];
                                if(entityStateMap.has(entitySnapshot.id)) {
                                    const entityState = entityStateMap.get(entitySnapshot.id);
                                    for(const property in entitySnapshot) {
                                        entityState[property] = entitySnapshot[property];
                                    }
                                }
                            }
                        }
                    }

                    if(state.ghost != null) {
                        const delta = state.ghost.delta;
                        for(const key in delta) {
                            if(entityStateMap.has(key)) {
                                const entityState = entityStateMap.get(key);
                                for(const property in delta[key]) {
                                    entityState[property] = delta[key][property];
                                }
                            }
                        }
                        this.#channel.emit('ack', state.ghost.frame);
                    }

                    if((() => {
                        for(const _ in frame) return true;
                        return false;
                    })()) {
                        this.#snapshot.snapshot.add({id: state.id, time: state.time, state: frame});
                    }
                });
            });
        });
    }

    tick(dt) {
        if(this.#snapshot != null) {
            for(const [key, value] of Entity.replicationTypeMap) {
                if(key == value && this.#snapshotKeySet.has(key)) {
                    const interpolationMethod = Entity.interpolationMethodMap.get(key);
                    try {
                        const snapshot = this.#snapshot.calcInterpolation(interpolationMethod, value);
                        if(snapshot != undefined) {
                            for(const state of snapshot.state) {
                                const entity = this.#world.getEntity(state.id);
                                if(entity != null) {
                                    entity.fromJSON(state);
                                }
                            }
                        }
                    } catch(error) {
                        console.log("Error in interpolating snapshot" + key);
                    }
                }
            }
        }
    }
}

export { Channel };
