import { UID } from './util/uid.js';

class Entity {
    #meta = null;
	#owner = null;
    #id = null;

    constructor(init) {
        this.#meta = init?.json?.meta;
        this.#owner = init?.owner;
        this.#id = init?.json?.id ?? UID();
    }

    get owner() {
		return this.#owner;
	}

    toJSON() {
        return {
            "meta" : this.#meta,
            "id" : this.#id,
        }
    }
}

export { Entity };
