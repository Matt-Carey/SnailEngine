import { Schema } from './../3rdparty/geckos.io/typed-array-buffer-schema.js';

class Entity {
    #class = null;
    #world = null;
    #UUID = null;
    #meta = null;
	#owner = null;
    #default = null;
    
    static #schemaModelMap = new Map();
    static #interpolationValuesMap = new Map();

    constructor(init) {
        this.#class = init.class
        this.#world = init.world;
        this.#UUID = init.UUID;
        this.#meta = init.meta;
    }

    get class() {
        return this.#class;
    }

    fromJSON(json) {
        if(json.owner != null) {
            this.#owner = json.owner;
        }
    }

    toJSON() {
        const json = {};
        json.id = this.#UUID;
        json.owner = this.#owner;
        return json;
    }

    get replicates() {
        return false;
    }

    static get bufferSchemaName() {
        return this.bufferSchema.name;
    }

    static #bufferSchema = null;
	static get bufferSchema() {
		if(Entity.#bufferSchema == null) {
			Entity.#bufferSchema = Schema.BufferSchema.schema('entity', {
                id: { type: Schema.string8, length: 6 }
            });
		}	
		return Entity.#bufferSchema;
	}

    static #interpolationValues = null;
    static get interpolationValues() {
        if(Entity.#interpolationValues == null) {
            Entity.#interpolationValues = '';
        }
        return Entity.#interpolationValues;
    }

    static get schemaModelName() {
        return this.schemaModel.schema.name;
    }

    static get schemaModelMap() {
        return Entity.#schemaModelMap;
    }

    static get interpolationValuesMap() {
        return Entity.#interpolationValuesMap;
    }

    static get schemaModel() {
        const rawBufferSchema = this.bufferSchema;
        const name = rawBufferSchema.name + '_ss';
        if(!Entity.#schemaModelMap.has(name)) {
            const snapshotBufferSchema = Schema.BufferSchema.schema(name, {
                id: { type: Schema.string8, length: 6 },
                time: Schema.uint64,
                state: { entities: [rawBufferSchema] }
            });
            Entity.#schemaModelMap.set(name, new Schema.Model(snapshotBufferSchema));
        }
        if(!Entity.#interpolationValuesMap.has(name)) {
            Entity.#interpolationValuesMap.set(name, this.interpolationValues);
        }
        return Entity.#schemaModelMap.get(name);
    }

    get world() {
        return this.#world;
    }

    get UUID() {
        return this.#UUID;
    }

    get meta() {
        return this.#meta;
    }

    get owner() {
		return this.#owner;
	}

    get owningEntity() {
        return this.world.getEntity(this.owner);
    }

    get default() {
        return this.#default;
    }

    set default(json) {
        if(this.#default == null) {
            this.#default = json;
        }
    }

    tick(dt) {

    }

}

export { Entity };
