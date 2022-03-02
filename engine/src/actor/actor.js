import { Entity } from './../entity.js';
import { Vector } from './../math/vector.js';

class Actor extends Entity {
	#pos = new Vector(0, 0, 0);
	#scale = new Vector(1, 1, 1);

	constructor(init) {
		super(init);
	}

	fromJSON(json) {
		super.fromJSON(json);
		
		if(json.pos != null) {
			this.#pos.fromJSON(json.pos);
		}

		if(json.scale != null) {
			this.#scale.fromJSON(json.scale);
		}
	}

	toJSON() {
		const json = super.toJSON();

		json.pos = this.#pos.toJSON();
		json.scale = this.#scale.toJSON();

		return json;
	}

	get position() {
		return this.#pos;
	}

	get scale() {
		return this.#scale;
	}
}

export { Actor };
