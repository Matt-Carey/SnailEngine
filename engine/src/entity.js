import { UID } from './util/uid.js';

class Entity {
    #meta = null;
	#owner = null;
    #id = null;

    constructor(init) {
        this.#meta = init.meta
        this.#owner = init.owner
        this.#id = init.config['id'] ?? UID();
    }

    get owner() {
		return this.#owner;
	}

    toJSON() {
        return {
            meta: this.#meta,
            owner: this.#owner,
            id: this.#id
        }
    }
}

export { Entity };
