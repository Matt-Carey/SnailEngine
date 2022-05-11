import { Schema } from './../3rdparty/geckos.io/typed-array-buffer-schema.js';
import { deepCopy } from './util/diff.js';

class Entity {
    #class = null;
    #world = null;
    #UUID = null;
    #meta = null;
    #init = null;
	#owner = null;
    #netId = null;
    #replicates = null;
    #default = null;
    
    static #replicatedPropertiesMap = new Map();
    static #replicationTypeMap = new Map();
    static #schemaModelMap = new Map();
    static #interpolationMethodMap = new Map();

    constructor(init) {
        this.#class = init.class
        this.#world = init.world;
        this.#UUID = init.UUID;
        this.#meta = init.meta;
        this.#init = init.init;

        this.#replicates = init.init?.replicates ?? false;

        this.#class.replicationType;
        this.#class.replicatedSchemaModel;
        this.#class.interpolationMethod;
    }

    static {
        Entity.#replicationTypeMap.set(Entity.name, Entity.name);
        Entity.#schemaModelMap.set(Entity.name, new Schema.Model(Schema.BufferSchema.schema(Entity.name, {id : {type: Schema.string8, length: 6}})));
        Entity.#interpolationMethodMap.set(Entity.name, '');
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
        return this.#replicates;
    }

    static get replicatedProperties() {
        return {
            id: { schema: { type: Schema.string8, length: 6 } }
        };
    }

    static get hasReplicatedProperties() {
        for(let key in this.aggrigateReplicatedProperties) {
            if (key != 'id') {
                return true;
            }
        }
        return false;
    }

    static get aggrigateReplicatedProperties() {
        if(Entity.#replicatedPropertiesMap.has(this.name)) {
            return Entity.#replicatedPropertiesMap.get(this.name);
        }
        if(!this.hasOwnProperty("replicatedProperties")) {
            return this.superclass.aggrigateReplicatedProperties;
        }
        const replicatedProperties = this.replicatedProperties;
        const superReplicatedProperties = (this == Entity) ? {} : this.superclass.aggrigateReplicatedProperties;
        const aggrigateProperties = deepCopy(superReplicatedProperties);
        for(const key in replicatedProperties) {
            aggrigateProperties[key] = replicatedProperties[key];
        }
        Entity.#replicatedPropertiesMap.set(this.name, aggrigateProperties);
        return aggrigateProperties;
    }

    get replicatedState() {
        const replicatedProperties = this.class.aggrigateReplicatedProperties;
        const state = this.toJSON();
        for(const key in state) {
            if(!(key in replicatedProperties)) {
                delete state[key];
            }
        }
        return state;
    }

    static get replicationType() {
        if(Entity.#replicationTypeMap.has(this.name)) {
            return Entity.#replicationTypeMap.get(this.name);
        }
        
        let c = this;
        while(!c.hasOwnProperty("replicatedProperties")) {
            c = c.superclass;
            if(Entity.#replicationTypeMap.has(c.name)) {
                const replicationType = Entity.#replicationTypeMap.get(c.name);
                let c2 = this;
                while(c2 != c) {
                    Entity.#replicationTypeMap.set(c2.name, replicationType);
                    c2 = c2.superclass;
                }
                return Entity.#replicationTypeMap.get(this.name);
            }
        }

        const replicationType = c.name;

        let c2 = this;
        while(c2 != c) {
            Entity.#replicationTypeMap.set(c2.name, replicationType);
            c2 = c2.superclass;
        }
        Entity.#replicationTypeMap.set(c.name, replicationType);

        return Entity.#replicationTypeMap.set(this.name, replicationType);
    }

    static get replicationTypeMap() {
        return Entity.#replicationTypeMap;
    }

    static get replicatedSchemaModel() {
        if(Entity.#schemaModelMap.has(this.name)) {
            return Entity.#schemaModelMap.get(this.name);
        }
        
        let c = this;
        while(!c.hasOwnProperty("replicatedProperties") || !((replicatedProperties) => {
            for(const key in replicatedProperties) {
                if(replicatedProperties[key].hasOwnProperty("schema")) {
                    return true;
                }
            }
            return false;
        })(c.replicatedProperties)) {
            c = c.superclass;
            if(Entity.#schemaModelMap.has(c.name)) {
                const schemaModel = Entity.#schemaModelMap.get(c.name);
                let c2 = this;
                while(c2 != c) {
                    Entity.#schemaModelMap.set(c2.name, schemaModel);
                    c2 = c2.superclass;
                }
                return Entity.#schemaModelMap.get(this.name);
            }
        }

        const schema = {};
        const aggrigateProperties = c.aggrigateReplicatedProperties;
        for(const key in aggrigateProperties) {
            if(aggrigateProperties[key].hasOwnProperty("schema")) {
                schema[key] = aggrigateProperties[key].schema;
            }
        }

        const schemaModel = new Schema.Model(Schema.BufferSchema.schema(c.name, schema));

        let c2 = this;
        while(c2 != c) {
            Entity.#schemaModelMap.set(c2.name, schemaModel);
            c2 = c2.superclass;
        }
        Entity.#schemaModelMap.set(c.name, schemaModel);

        return Entity.#schemaModelMap.get(this.name);
    }

    static get schemaModelMap() {
        return Entity.#schemaModelMap;
    }

    static get interpolationMethod() {
        if(Entity.#interpolationMethodMap.has(this.name)) {
            return Entity.#interpolationMethodMap.get(this.name);
        }
        
        let c = this;
        while(!c.hasOwnProperty("replicatedProperties")) {
            c = c.superclass;
            if(Entity.#interpolationMethodMap.has(c.name)) {
                const interpolationMethod = Entity.#interpolationMethodMap.get(c.name);
                let c2 = this;
                while(c2 != c) {
                    Entity.#interpolationMethodMap.set(c2.name, interpolationMethod);
                    c2 = c2.superclass;
                }
                return Entity.#interpolationMethodMap.get(this.name);
            }
        }

        const interpMethods = [];
        const aggrigateProperties = c.aggrigateReplicatedProperties;
        for(const key in aggrigateProperties) {
            if(aggrigateProperties[key].hasOwnProperty("interp")) {
                switch(aggrigateProperties[key].interp) {
                    case 'linear':
                        interpMethods.push(key);
                    break;
                    case 'rad':
                        interpMethods.push(key+'(rad)');
                    break;
                    case 'deg':
                        interpMethods.push(key+'(deg)');
                    break;
                    case 'quat':
                        interpMethods.push(key+'(quat)');
                    break;
                }
            }
        }

        const interpolationMethod = interpMethods.join(' ');

        let c2 = this;
        while(c2 != c) {
            Entity.#interpolationMethodMap.set(c2.name, interpolationMethod);
            c2 = c2.superclass;
        }
        Entity.#interpolationMethodMap.set(c.name, interpolationMethod);

        return Entity.#interpolationMethodMap.set(this.name, interpolationMethod);
    }

    static get interpolationMethodMap() {
        return Entity.#interpolationMethodMap;
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

    get init() {
        return this.#init;
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

    prePhysTick() {

    }

    postPhysTick() {

    }

}

export { Entity };
