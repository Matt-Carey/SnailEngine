import { ObjectFactory } from './../factory/objectFactory.js'
import { Vector } from './../math/vector.js';

class Actor {
	#owner = null;
	#root = null;
	#pos = new Vector(0, 0, 0);

	constructor(owner, config) {
		this.#owner = owner;
		
		this.#root = null;
		const rootConfig = config['root'];
		(async () => {
			await ObjectFactory.make(this, rootConfig.type, rootConfig.src, rootConfig.config).then(component => {
				this.#root = component;
			});
		})();
		
		const pos = config['pos'];
		this.#pos = new Vector(pos.x, pos.y, pos.z);
	}

	get world() {
		return this.#owner.world;
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
