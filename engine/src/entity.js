import { UID } from './util/uid.js';

class Entity {
	#owner = null;
	#type = null;
	#src = null;
    #id = null;

    constructor(init) {
		this.#owner = init.owner;
		this.#type = init.type;
		this.#src = init.src;
        this.#id = init.config['id'] ?? UID();
    }

    get owner() {
		return this.#owner;
	}

    toJSON() {
        return {
            type: this.#type,
            src: this.#src
        }
    }
}

export { Entity };
