import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/EntityFactory.js'
import { Vector } from './../math/vector.js';

class Actor extends Entity {
	#root = null;
	#pos = new Vector(0, 0, 0);
	#scale = new Vector(1, 1, 1);

	constructor(init) {
		super(init);
		this.#root = null;
		const rootJson = init.config['root']
		EntityFactory.make(this, rootJson).then(component => {
			this.#root = component;
		});
		
		const pos = init.config['pos'];
		if(pos != null) {
			this.#pos = new Vector(pos.x, pos.y, pos.z);
		}

		const scale = init.config['scale'];
		if(scale != null) {
			this.#scale = new Vector(scale.x, scale.y, scale.z);
		}
	}

	toJSON() {
		const json = super.toJSON();
		json['config'] = {
			root: this.#root?.toJSON(),
			pos: this.#pos.toJSON(),
			scale: this.#scale.toJSON()
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
