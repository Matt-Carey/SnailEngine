import { Snap } from '../../3rdparty/geckos.io/snapshot-interpolation.js';
import { Entity } from '../entity.js';
import { Config } from '../config.js';
import { ab2str } from '../util/buffer.js';
import { GhostManager } from './ghostManager.js';

class Host {
    #world = null;
    #io = null;
    #httpServer = null;
    #channels = new Map();
    #snap = null;
    #ghosts = new Map();


    constructor(world) {
        this.#world = world;

        const { fs, http, https, geckos } = global.nodeimports;

        const cfg = Config.get();

		this.#io = geckos(cfg.geckos);

        const key = cfg.server.key;
        const cert = cfg.server.cert;
        const secure = (global.protocol === 'https' || global.protocol === 'https-dev') && key != null && cert != null;
        this.#httpServer = secure ? https.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(cert) }) : http.createServer();
        this.#io.addServer(this.#httpServer);

        this.#snap = new Snap.SnapshotInterpolation();

        this.#io.onConnection(channel => {
            console.log('connection:', channel.id);
            this.#channels.set(channel.id, channel);
            this.#ghosts.set(channel.id, new GhostManager(this.#world, channel.id));

            this.#world.game.onLogin(channel);

            channel.emit('scene', JSON.stringify(this.#world.scene));

            const init = {};
            init.entities = [];
            for(const entity of this.#world.entities) {
                init.entities.push({
                    "UUID": entity.UUID,
                    "meta": entity.meta,
                    "init": entity.init,
                    "json": entity.default
                });
            }
            channel.emit('init', init, { reliable: true });

            channel.on('ack', frame => {
                this.#ghosts.get(channel.id).ack(frame);
            });
        });

        this.#world.onEntityAdded.bind((entity)=>{
            this.#io.emit('entity_added', {
                "UUID": entity.UUID,
                "meta": entity.meta,
                "init": entity.init,
                "json": entity.default
            },
            { reliable: true });
        });

        this.#httpServer.listen(cfg.server.port, () => {
            console.log('listening on *:' + cfg.server.port);
        });
    }

    tick(dt) {
        const replicationTypeMap = new Map();
        const schemaStateMap = new Map();
        const ghostStateMap = new Map();
        for(const entity of this.#world.entities) {
            if(entity.replicates && entity.class.hasReplicatedProperties) {
                const schemaState = {};
                const ghostState = {};

                const aggrigateReplicatedProperties = entity.class.aggrigateReplicatedProperties;
                const entityState = entity.toJSON();
                for(const key in entityState) {
                    if(!(key in aggrigateReplicatedProperties)) {
                        delete entityState[key];
                    }
                    else if(aggrigateReplicatedProperties[key].hasOwnProperty('schema')) {
                        schemaState[key] = entityState[key];
                    }
                    else {
                        ghostState[key] = entityState[key];
                    }
                }

                const replicationType = entity.class.replicationType;
                if(!replicationTypeMap.has(replicationType)) {
                    replicationTypeMap.set(replicationType, []);
                }
                replicationTypeMap.get(replicationType).push(entityState);

                const replicatedSchemaModel = entity.class.replicatedSchemaModel;
                if(replicatedSchemaModel != null) {
                    const schemaName = replicatedSchemaModel.schema.name;
                    if(!schemaStateMap.has(schemaName)) {
                        schemaStateMap.set(schemaName, []);
                    }
                    schemaStateMap.get(schemaName).push(schemaState);
                }

                if((() => {
                    for(const _ in ghostState) return true;
                    return false;
                })()) {
                    const UUID = entity.UUID;
                    ghostStateMap.set(UUID, ghostState);
                }
            }
        }

        const state = {};
        for(const [key, value] of replicationTypeMap) {
            state[key] = value;
        }

        const snapshot = this.#snap.snapshot.create(state);
        this.#snap.vault.add(snapshot);

        for(const [channelId, channel] of this.#channels) {
            const ghost = this.#ghosts.get(channelId).update(ghostStateMap);
            
            const schema = {};
            for(const [key, value] of schemaStateMap) {
                const buffer = Entity.schemaModelMap.get(key).toBuffer(value);
                const string = ab2str(buffer);
                schema[key] = string;
            }
            
            channel.emit('state', {
                id: snapshot.id,
                time: snapshot.time,
                schema: schema,
                ghost: ghost
            });
        }
    }
}

export { Host };
