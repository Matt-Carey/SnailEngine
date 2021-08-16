import { ObjectFactory } from './../factory/objectFactory.js'
import { Vector } from '../math/vector.js';

class Component {
	#owner = null;
	#children = [];
	#rPos = new Vector(0, 0, 0);

	constructor(owner, config) {
		this.#owner = owner;
		this.#children = [];
		const childrenConfig = config['children'];
		for(const childConfig of childrenConfig) {
			(async () => {
				await ObjectFactory.make(this, childConfig.type, childConfig.src, childConfig.config).then(component => {
					this.#children.push(component);
				});
			})();
		}
		
		const rPos = config['rPos'];
		this.#rPos = new Vector(rPos.x, rPos.y, rPos.z);
	}

	get world() {
		return this.#owner.world;
	}

	get actor() {
		return this.#owner.root == this ? this.#owner : this.#owner.actor;
	}

	get position() {
		return Vector.add(this.#owner.position, this.#rPos);
	}
	
	tick(dt) {
		for(const child of this.#children) {
			child.tick(dt);
		}
	}
	
}

export { Component };
