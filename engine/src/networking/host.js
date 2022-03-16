import { Snap } from '../../3rdparty/geckos.io/snapshot-interpolation.js';
import { Entity } from '../entity.js';
import { Config } from '../config.js';
import { ab2str } from '../util/buffer.js';
import { GhostManager } from './ghostManager.js';

class Host {
    #world = null;
    #io = null;
    #httpServer = null;
    #snapMap = new Map();
    #channels = new Map();
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

        this.#io.onConnection(channel => {
            console.log('connection:', channel.id);
            this.#channels.set(channel.id, channel);
            this.#ghosts.set(channel.id, new GhostManager(this.#world));

            this.#world.game.onLogin(channel);

            channel.emit('scene', JSON.stringify(this.#world.scene));

            const init = {};
            init.entities = [];
            for(const entity of this.#world.entities) {
                init.entities.push({
                    "meta": entity.meta,
                    "UUID": entity.UUID,
                    "json": entity.default
                });
            }
            channel.emit('init', init, { reliable: true });

            channel.on('ack_dirty_ghost', frame => {
                this.#ghosts.get(channel.id).ack(frame);
            });
        });

        this.#world.onEntityAdded.bind((entity)=>{
            this.#io.emit('entity_added', {
                "meta": entity.meta,
                "UUID": entity.UUID,
                "json": entity.default
            },
            { reliable: true });
        });

        this.#httpServer.listen(cfg.server.port, () => {
            console.log('listening on *:' + cfg.server.port);
        });
    }

    tick(dt) {
        for(const [channelId, ghost] of this.#ghosts) {
            const ghostFrame = ghost.frame;
            if(ghostFrame != null) {
                this.#channels.get(channelId).emit('dirty_ghost', ghostFrame);
            }
        }

        this.#io.emit('snapshot', this.#snapshot);
    }

    get #snapshot() {
        const snapshotEntityMap = new Map();
        for(const entity of this.#world.entities) {
            if(entity.replicates) {
                const replicatedSchema = entity.class.replicatedSchemaModel.schema;
                const schemaName = replicatedSchema.name;

                if(!snapshotEntityMap.has(schemaName)) {
                    snapshotEntityMap.set(schemaName, []);
                }

                const json = entity.toJSON();
                for(const key in json) {
                    if(!(key in replicatedSchema.struct.state.raw[0].struct)) {
                        delete json[key];
                    }
                }

                snapshotEntityMap.get(schemaName).push(json);
            }
        }

        const snapshotJson = {};
        for(const [key, value] of snapshotEntityMap) {
            if(Entity.schemaModelMap.has(key)) {
                if(!this.#snapMap.has(key)) {
                    this.#snapMap.set(key, new Snap.SnapshotInterpolation());
                }
                const snap = this.#snapMap.get(key);
                const snapshot = snap.snapshot.create({raw: value});
                snap.vault.add(snapshot);
                const snapshotArraybuffer = Entity.schemaModelMap.get(key).toBuffer(snapshot);
                const snapshotString = ab2str(snapshotArraybuffer);
                snapshotJson[key] = snapshotString;
            }
        }

        return snapshotJson;
    }
}

export { Host };
