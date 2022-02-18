import { Component } from '../component/component.js';
import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/EntityFactory.js'
import { Vector } from './../math/vector.js';

const Defaults = {
	'root': null,
	'pos': new Vector(0, 0, 0),
	'scale': new Vector(1, 1, 1),
}

class Actor extends Entity {
	#root = Defaults.root;
	#pos = Defaults.pos;
	#scale = Defaults.scale;

	constructor(init) {
		super(init);

		const rootJson = init?.json?.root;
		if(rootJson != null) {
			EntityFactory.make(this, rootJson).then(component => {
				this.#root = component;
			});
		}
		
		const pos = init?.json?.pos;
		if(pos != null) {
			this.#pos = new Vector(pos.x, pos.y, pos.z);
		}

		const scale = init?.json?.scale;
		if(scale != null) {
			this.#scale = new Vector(scale.x, scale.y, scale.z);
		}
	}

	toJSON() {
		const json = super.toJSON();

		if(this.#root != Defaults.root) {
			json.root = this.#root.toJSON();
		}

		if(!Vector.equals(this.#pos, Defaults.pos)) {
			json.pos = this.#pos.toJSON();
		}

		if(!Vector.equals(this.#scale, Defaults.scale)) {
			json.scale = this.#scale.toJSON();
		}

		return json;
	}

	get world() {
		return this.owner.world;
	}

	get position() {
		return this.#pos;
	}

	get scale() {
		return this.#scale;
	}
	
	tick(dt) {
		if(this.#root != null) {
			this.#root.tick(dt);
		}
	}
}

export { Actor };
