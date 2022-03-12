import { Schema } from './../3rdparty/geckos.io/typed-array-buffer-schema.js';

class Entity {
    #class = null;
    #world = null;
    #UUID = null;
    #meta = null;
	#owner = null;
    #netId = null;
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

    get superclass() {
        return Object.getPrototypeOf(this.class);
    }

    static get superclass() {
        return Object.getPrototypeOf(this);
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

	static get bufferSchemaStruct() {
		return { id: { type: Schema.string8, length: 6 } };
	}

    static get interpolationValues() {
        return '';
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
        let c = this;
        while(!c.hasOwnProperty("bufferSchemaStruct")) {
            c = c.superclass;
        }
        const key = c.name;
        if(!Entity.#schemaModelMap.has(key)) {
            Entity.#schemaModelMap.set(key, new Schema.Model(Schema.BufferSchema.schema(key, {
                id: { type: Schema.string8, length: 6 },
                time: Schema.uint64,
                state: { entities: [Schema.BufferSchema.schema(key + '_raw', c.bufferSchemaStruct)] }
            })));
        }
        if(!Entity.#interpolationValuesMap.has(key)) {
            Entity.#interpolationValuesMap.set(key, c.interpolationValues);
        }
        return Entity.#schemaModelMap.get(key);
    }

    get world() {
        return this.#world;
    }

    get authority() {
        return this.world.authority;
    }

    get role() {
        return this.world.role;
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
