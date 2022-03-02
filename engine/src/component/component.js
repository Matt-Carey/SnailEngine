import { Entity } from './../entity.js';
import { Vector } from '../math/vector.js';

class Component extends Entity {
	#rPos = new Vector(0, 0, 0);
	#rScale = new Vector(1, 1, 1);

	constructor(init) {
		super(init);
	}

	fromJSON(json) {
		super.fromJSON(json);
		
		if(json.rPos != null) {
			this.#rPos.fromJSON(json.rPos);
		}

		if(json.rScale != null) {
			this.#rScale.fromJSON(json.rScale);
		}
	}

	toJSON() {
		const json = super.toJSON();
		
		json.rPos = this.#rPos.toJSON();
		json.rScale = this.#rScale.toJSON();

		return json;
	}

	get position() {
		const owner = this.owningEntity;
		return Vector.add(owner.position, this.#rPos);
	}

	get scale() {
		const owner = this.owningEntity;
		return Vector.multiply(owner.scale, this.#rScale);
	}
	
}

export { Component };
