import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/EntityFactory.js'
import { Vector } from '../math/vector.js';

class Component extends Entity {
	#children = [];
	#rPos = new Vector(0, 0, 0);

	constructor(init) {
		super(init);
		
		this.#children = [];
		const childrenJson = init.config['children']
		for(const childJson of childrenJson) {
			EntityFactory.make(this, childJson).then(component => {
				this.#children.push(component);
			});
		}
		
		const rPos = init.config['rPos'];
		if(rPos != null) {
			this.#rPos = new Vector(rPos.x, rPos.y, rPos.z);
		}
	}

	toJSON() {
		const json = super.toJSON();
		json['config'] = {
			children: [],
			rpos: this.#rPos.toJSON()
		}
		for(const child of this.#children) {
			json.config.children.push(child.toJSON());
		}
		return json;
	}

	get world() {
		const owner = this.owner;
		return owner.world;
	}

	get actor() {
		const owner = this.owner;
		return owner.root == this ? owner : owner.actor;
	}

	get position() {
		const owner = this.owner;
		return Vector.add(owner.position, this.#rPos);
	}
	
	tick(dt) {
		for(const child of this.#children) {
			child.tick(dt);
		}
	}
	
}

export { Component };
