import { Snap } from '../../3rdparty/geckos.io/snapshot-interpolation.js';
import { Entity } from '../entity.js';
import { Config } from '../config.js';
import { ab2str } from '../util/buffer.js';

class Host {
    #world = null;
    #io = null;
    #httpServer = null;
    #snapMap = new Map();
    #channels = new Map();

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
        const snapshotEntityMap = new Map();
        for(const entity of this.#world.entities) {
            if(entity.replicates) {
                const modelName = entity.class.schemaModelName;

                if(!snapshotEntityMap.has(modelName)) {
                    snapshotEntityMap.set(modelName, []);
                }

                const schemaStruct = entity.class.bufferSchemaStruct;
                const json = entity.toJSON();
                for(const key in json) {
                    if(!(key in schemaStruct)) {
                        delete json[key];
                    }
                }

                snapshotEntityMap.get(modelName).push(json);
            }
        }

        const state = {};
        for(const [key, value] of snapshotEntityMap) {
            if(Entity.schemaModelMap.has(key)) {
                if(!this.#snapMap.has(key)) {
                    this.#snapMap.set(key, new Snap.SnapshotInterpolation());
                }
                const snap = this.#snapMap.get(key);
                const snapshot = snap.snapshot.create({entities: value});
                snap.vault.add(snapshot);
                const arraybuffer = Entity.schemaModelMap.get(key).toBuffer(snapshot);
                const snapshotString = ab2str(arraybuffer);
                state[key] = snapshotString;
            }
        }
        this.#io.emit('state', state);
    }
}

export { Host };
