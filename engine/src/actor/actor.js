import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/EntityFactory.js'
import { Vector } from './../math/vector.js';

class Actor extends Entity {
	#root = null;
	#pos = new Vector(0, 0, 0);

	constructor(init) {
		super(init);
		this.#root = null;
		const rootJson = init.config['root']
		EntityFactory.make(this, rootJson).then(component => {
			this.#root = component;
		});
		
		const pos = init.config['pos'];
		this.#pos = new Vector(pos.x, pos.y, pos.z);
	}

	toJSON() {
		const json = super.toJSON();
		json['config'] = {
			root: this.#root?.toJSON(),
			pos: this.#pos.toJSON()
		}
		return json;
	}

	get world() {
		return this.owner.world;
	}

	get position() {
		return this.#pos;
	}
	
	tick(dt) {
		if(this.#root != null) {
			this.#root.tick(dt);
		}
	}
}

export { Actor };
