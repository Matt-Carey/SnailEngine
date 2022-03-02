class Entity {
    #world = null;
    #UUID = null;
    #meta = null;
	#owner = null;

    constructor(init) {
        this.#world = init.world;
        this.#UUID = init.UUID;
        this.#meta = init.meta;
    }

    fromJSON(json) {
        if(json.owner != null) {
            this.#owner = json.owner;
        }
    }

    toJSON() {
        const json = {};
        json.owner = this.#owner;
        return json;
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

    tick(dt) {

    }

}

export { Entity };
